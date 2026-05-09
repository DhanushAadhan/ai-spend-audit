import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runAudit } from '@/lib/audit-engine'
import { supabaseAdmin } from '@/lib/supabase'
import Anthropic from '@anthropic-ai/sdk'
import { TOOL_LABELS } from '@/types'

// ─── Rate limiting (simple in-memory) ────────────────────────────────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= 10) return true
  entry.count++
  return false
}

// ─── Input schema ─────────────────────────────────────────────────────────────
const auditInputSchema = z.object({
  tools: z.array(z.object({
    tool: z.enum(['cursor','github_copilot','claude','chatgpt','anthropic_api','openai_api','gemini','windsurf']),
    plan: z.string().min(1),
    monthlySpend: z.number().min(0),
    seats: z.number().min(1),
  })).min(1),
  teamSize: z.number().min(1),
  useCase: z.enum(['coding','writing','data','research','mixed']),
})

// ─── AI Summary ──────────────────────────────────────────────────────────────
async function generateAISummary(auditData: ReturnType<typeof runAudit>): Promise<string> {
  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const toolBreakdown = auditData.recommendations
      .map((r) => `- ${TOOL_LABELS[r.tool]} (${r.currentPlan}): $${r.currentSpend}/mo → ${r.recommendedAction} → saves $${r.monthlySavings}/mo. Reason: ${r.reason}`)
      .join('\n')

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `You are a concise financial advisor specializing in AI tool spending.

A team has completed an AI spend audit:
Team size: ${auditData.input.teamSize}
Primary use case: ${auditData.input.useCase}
Total monthly spend: $${auditData.recommendations.reduce((s, r) => s + r.currentSpend, 0)}
Total monthly savings found: $${auditData.totalMonthlySavings}
Annual savings: $${auditData.totalAnnualSavings}

Per-tool breakdown:
${toolBreakdown}

Write a personalized 80-100 word summary paragraph that:
1. Acknowledges their current spending situation honestly
2. Highlights the biggest savings opportunity specifically  
3. Explains WHY the recommended changes make sense for their use case
4. Ends with one actionable next step

Tone: Professional but direct. Like a trusted advisor, not a sales pitch.
Do NOT use bullet points. Write in flowing prose only.`,
      }],
    })

    return message.content[0].type === 'text' ? message.content[0].text : fallbackSummary(auditData)
  } catch {
    return fallbackSummary(auditData)
  }
}

function fallbackSummary(auditData: ReturnType<typeof runAudit>): string {
  const topRec = auditData.recommendations
    .filter((r) => r.recommendedAction !== 'keep')
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0]

  if (!topRec || auditData.totalMonthlySavings === 0) {
    return `Your team of ${auditData.input.teamSize} is spending thoughtfully on AI tools. Your current stack appears well-optimised for ${auditData.input.useCase} work. Keep monitoring as pricing changes frequently — new savings opportunities may emerge as vendors adjust their plans.`
  }

  return `Your team of ${auditData.input.teamSize} is currently spending $${auditData.recommendations.reduce((s, r) => s + r.currentSpend, 0)}/month on AI tools, with $${auditData.totalMonthlySavings}/month ($${auditData.totalAnnualSavings}/year) in identified savings. The biggest opportunity is with ${TOOL_LABELS[topRec.tool]}: ${topRec.reason} Start there first — it's the highest-impact change for your ${auditData.input.useCase}-focused team.`
}

// ─── POST handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Honeypot check
  const body = await req.json()
  if (body._trap) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  // Rate limit
  const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Validate
  const parsed = auditInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  // Run audit engine
  const auditResult = runAudit(parsed.data)

  // Generate AI summary
  const aiSummary = await generateAISummary(auditResult)

  // Save to Supabase
  const { data, error } = await supabaseAdmin
    .from('audits')
    .insert({
      slug: auditResult.slug,
      input: auditResult.input,
      recommendations: auditResult.recommendations,
      total_monthly_savings: auditResult.totalMonthlySavings,
      total_annual_savings: auditResult.totalAnnualSavings,
      ai_summary: aiSummary,
    })
    .select('slug')
    .single()

  if (error) {
    console.error('Supabase error:', error)
    return NextResponse.json({ error: 'Failed to save audit' }, { status: 500 })
  }

  return NextResponse.json({ slug: data.slug })
}