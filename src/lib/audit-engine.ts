import { PRICING_DATA } from '@/data/pricing'
import type {
  AuditInput,
  AuditResult,
  ToolRecommendation,
  AiTool,
} from '@/types'
import { generateSlug } from '@/lib/utils'

// ─── Main audit function ──────────────────────────────────────────────────────

export function runAudit(input: AuditInput): Omit<AuditResult, 'id' | 'aiSummary' | 'createdAt'> {
  const recommendations: ToolRecommendation[] = input.tools.map((entry) =>
    evaluateTool(entry.tool, entry.plan, entry.monthlySpend, entry.seats, input)
  )

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.monthlySavings, 0
  )
  const totalAnnualSavings = totalMonthlySavings * 12

  return {
    input,
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings,
    slug: generateSlug(),
  }
}

// ─── Per-tool evaluator ───────────────────────────────────────────────────────

function evaluateTool(
  tool: AiTool,
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {

  switch (tool) {
    case 'cursor':
      return evaluateCursor(plan, monthlySpend, seats, input)
    case 'github_copilot':
      return evaluateCopilot(plan, monthlySpend, seats, input)
    case 'claude':
      return evaluateClaude(plan, monthlySpend, seats, input)
    case 'chatgpt':
      return evaluateChatGPT(plan, monthlySpend, seats, input)
    case 'anthropic_api':
      return evaluateAPI('anthropic_api', monthlySpend)
    case 'openai_api':
      return evaluateAPI('openai_api', monthlySpend)
    case 'gemini':
      return evaluateGemini(plan, monthlySpend, seats, input)
    case 'windsurf':
      return evaluateWindsurf(plan, monthlySpend, seats, input)
    default:
      return keepAsIs(tool, plan, monthlySpend)
  }
}

// ─── Cursor ───────────────────────────────────────────────────────────────────

function evaluateCursor(
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    tool: 'cursor',
    currentPlan: plan,
    currentSpend: monthlySpend,
  }

  // Check if team also pays for Copilot — duplication
  const hasCopilot = input.tools.some((t) => t.tool === 'github_copilot')
  if (hasCopilot && (plan === 'Pro' || plan === 'Business')) {
    const savings = Math.round(monthlySpend * 0.5)
    return {
      ...base,
      recommendedAction: 'optimize',
      monthlySavings: savings,
      annualSavings: savings * 12,
      reason:
        'You are paying for both Cursor and GitHub Copilot, which overlap significantly. ' +
        'Consider consolidating to Cursor only — it includes Copilot-equivalent completions.',
    } as ToolRecommendation
  }

  // Hobby plan — already free
  if (plan === 'Hobby') {
    return {
      ...base,
      recommendedAction: 'keep',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'You are on the free Hobby plan — no savings to find here.',
    } as ToolRecommendation
  }

  // Business with 1-2 seats — overkill
  if (plan === 'Business' && seats <= 2) {
    const proSpend = 20 * seats
    const savings = monthlySpend - proSpend
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Business plan ($40/seat) needs team features like SSO and admin controls. With only ${seats} seat(s), Pro ($20/seat) gives you identical AI capabilities at half the cost.`,
    } as ToolRecommendation
  }

  // Pro is optimal for most cases
  if (plan === 'Pro') {
    return {
      ...base,
      recommendedAction: 'keep',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'Cursor Pro is the right plan for individual developers — good value for unlimited completions.',
    } as ToolRecommendation
  }

  return keepAsIs('cursor', plan, monthlySpend)
}

// ─── GitHub Copilot ───────────────────────────────────────────────────────────

function evaluateCopilot(
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    tool: 'github_copilot',
    currentPlan: plan,
    currentSpend: monthlySpend,
  }

  // If team uses Cursor Pro/Business — Copilot is redundant
  const hasCursor = input.tools.some(
    (t) => t.tool === 'cursor' && (t.plan === 'Pro' || t.plan === 'Business')
  )
  if (hasCursor) {
    return {
      ...base,
      recommendedAction: 'switch',
      recommendedTool: 'cursor',
      monthlySavings: monthlySpend,
      annualSavings: monthlySpend * 12,
      reason:
        'Your team already pays for Cursor Pro/Business which includes equivalent AI completions. ' +
        'GitHub Copilot is redundant — dropping it saves the full cost.',
    } as ToolRecommendation
  }

  // Enterprise with small team
  if (plan === 'Enterprise' && seats <= 5) {
    const businessSpend = 19 * seats
    const savings = monthlySpend - businessSpend
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Business',
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Enterprise ($39/seat) is designed for large orgs with complex compliance needs. With ${seats} seats, Business ($19/seat) covers all practical use cases.`,
    } as ToolRecommendation
  }

  // Individual is optimal
  if (plan === 'Individual') {
    return {
      ...base,
      recommendedAction: 'keep',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'GitHub Copilot Individual is well-priced for a single developer.',
    } as ToolRecommendation
  }

  return keepAsIs('github_copilot', plan, monthlySpend)
}

// ─── Claude ───────────────────────────────────────────────────────────────────

function evaluateClaude(
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    tool: 'claude',
    currentPlan: plan,
    currentSpend: monthlySpend,
  }

  // Max plan — only justified for power users
  if (plan === 'Max' && seats <= 2) {
    const proSpend = 20 * seats
    const savings = monthlySpend - proSpend
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Claude Max ($100/seat) gives 5× the usage limits of Pro. Unless you are consistently hitting Pro limits, downgrading to Pro ($20/seat) saves $80/seat/month.`,
    } as ToolRecommendation
  }

  // Team with fewer than 5 seats — below minimum, paying wrong plan
  if (plan === 'Team' && seats < 5) {
    const proSpend = 20 * seats
    const savings = monthlySpend - proSpend
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Pro',
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Claude Team requires a minimum of 5 seats. With ${seats} seat(s), individual Pro plans ($20/seat) are more cost-effective and have no minimum.`,
    } as ToolRecommendation
  }

  // Also paying for ChatGPT — likely redundant
  const hasChatGPT = input.tools.some((t) => t.tool === 'chatgpt')
  if (hasChatGPT && (plan === 'Pro' || plan === 'Team')) {
    return {
      ...base,
      recommendedAction: 'optimize',
      monthlySavings: Math.round(monthlySpend * 0.4),
      annualSavings: Math.round(monthlySpend * 0.4) * 12,
      reason:
        'You are paying for both Claude and ChatGPT. For most use cases, one is sufficient. ' +
        'Pick the one your team uses most and cancel the other.',
    } as ToolRecommendation
  }

  if (plan === 'Pro' || plan === 'Free') {
    return {
      ...base,
      recommendedAction: 'keep',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'Claude Pro is well-priced for the capability it offers.',
    } as ToolRecommendation
  }

  return keepAsIs('claude', plan, monthlySpend)
}

// ─── ChatGPT ─────────────────────────────────────────────────────────────────

function evaluateChatGPT(
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    tool: 'chatgpt',
    currentPlan: plan,
    currentSpend: monthlySpend,
  }

  // Team plan break-even: only worth it above 4 seats
  if (plan === 'Team' && seats <= 3) {
    const plusSpend = 20 * seats
    const savings = monthlySpend - plusSpend
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Plus',
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `ChatGPT Team costs $30/seat vs Plus at $20/seat. With only ${seats} seat(s), individual Plus plans save money. Team features (shared workspace) only justify the premium at 4+ seats.`,
    } as ToolRecommendation
  }

  // Also paying for Claude
  const hasClaude = input.tools.some((t) => t.tool === 'claude')
  if (hasClaude && plan !== 'Free') {
    return {
      ...base,
      recommendedAction: 'optimize',
      monthlySavings: Math.round(monthlySpend * 0.5),
      annualSavings: Math.round(monthlySpend * 0.5) * 12,
      reason:
        'You are paying for both ChatGPT and Claude, which overlap heavily for most tasks. ' +
        'Consolidating to one could save 50% of this cost.',
    } as ToolRecommendation
  }

  if (plan === 'Plus' || plan === 'Free') {
    return {
      ...base,
      recommendedAction: 'keep',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'ChatGPT Plus is reasonably priced for the features it provides.',
    } as ToolRecommendation
  }

  return keepAsIs('chatgpt', plan, monthlySpend)
}

// ─── API tools (Anthropic + OpenAI) ──────────────────────────────────────────

function evaluateAPI(tool: 'anthropic_api' | 'openai_api', monthlySpend: number): ToolRecommendation {
  // High API spend — suggest cheaper models
  if (monthlySpend > 500) {
    return {
      tool,
      currentPlan: 'Pay-as-you-go',
      currentSpend: monthlySpend,
      recommendedAction: 'optimize',
      monthlySavings: Math.round(monthlySpend * 0.4),
      annualSavings: Math.round(monthlySpend * 0.4) * 12,
      reason:
        tool === 'anthropic_api'
          ? 'At this spend level, switching non-critical tasks from Claude Sonnet to Claude Haiku (5× cheaper) could reduce your bill by ~40% with minimal quality loss.'
          : 'At this spend level, routing non-critical tasks to GPT-4o mini (significantly cheaper than GPT-4o) could cut your bill by ~40%.',
    }
  }

  return {
    tool,
    currentPlan: 'Pay-as-you-go',
    currentSpend: monthlySpend,
    recommendedAction: 'keep',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'API spend is within a reasonable range. Monitor usage and consider cheaper model tiers if spend grows.',
  }
}

// ─── Gemini ───────────────────────────────────────────────────────────────────

function evaluateGemini(
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    tool: 'gemini',
    currentPlan: plan,
    currentSpend: monthlySpend,
  }

  // If team is coding-focused — Gemini is weaker for code
  if (input.useCase === 'coding' && plan !== 'Free') {
    return {
      ...base,
      recommendedAction: 'optimize',
      monthlySavings: Math.round(monthlySpend * 0.6),
      annualSavings: Math.round(monthlySpend * 0.6) * 12,
      reason:
        'For coding use cases, Cursor or Claude Code outperform Gemini significantly. ' +
        'Consider reallocating this budget to a coding-focused tool.',
    } as ToolRecommendation
  }

  // Business/Enterprise with few seats
  if ((plan === 'Business' || plan === 'Enterprise') && seats <= 3) {
    const advancedSpend = 20 * seats
    const savings = monthlySpend - advancedSpend
    return {
      ...base,
      recommendedAction: 'downgrade',
      recommendedPlan: 'Advanced',
      monthlySavings: Math.max(0, savings),
      annualSavings: Math.max(0, savings) * 12,
      reason: `Gemini Business/Enterprise includes Google Workspace features that may not be necessary. With ${seats} seat(s), Gemini Advanced ($20/seat) covers individual AI needs at lower cost.`,
    } as ToolRecommendation
  }

  return keepAsIs('gemini', plan, monthlySpend)
}

// ─── Windsurf ────────────────────────────────────────────────────────────────

function evaluateWindsurf(
  plan: string,
  monthlySpend: number,
  seats: number,
  input: AuditInput
): ToolRecommendation {
  const base: Partial<ToolRecommendation> = {
    tool: 'windsurf',
    currentPlan: plan,
    currentSpend: monthlySpend,
  }

  // If team also uses Cursor — duplicate
  const hasCursor = input.tools.some((t) => t.tool === 'cursor' && t.plan !== 'Hobby')
  if (hasCursor) {
    return {
      ...base,
      recommendedAction: 'switch',
      recommendedTool: 'cursor',
      monthlySavings: monthlySpend,
      annualSavings: monthlySpend * 12,
      reason:
        'You are paying for both Windsurf and Cursor. These are direct competitors with near-identical features. ' +
        'Pick one and cancel the other to eliminate duplicate spend.',
    } as ToolRecommendation
  }

  if (plan === 'Free') {
    return {
      ...base,
      recommendedAction: 'keep',
      monthlySavings: 0,
      annualSavings: 0,
      reason: 'Windsurf Free tier — no cost to optimize.',
    } as ToolRecommendation
  }

  return keepAsIs('windsurf', plan, monthlySpend)
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function keepAsIs(tool: AiTool, plan: string, monthlySpend: number): ToolRecommendation {
  return {
    tool,
    currentPlan: plan,
    currentSpend: monthlySpend,
    recommendedAction: 'keep',
    monthlySavings: 0,
    annualSavings: 0,
    reason: 'This tool and plan appear well-matched to your usage. No changes recommended.',
  }
}