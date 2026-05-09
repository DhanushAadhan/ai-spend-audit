import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase'

const leadSchema = z.object({
  email: z.string().email(),
  companyName: z.string().optional(),
  role: z.string().optional(),
  auditId: z.string().uuid().optional(),
  _trap: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const body = await req.json()

  // Honeypot check
  if (body._trap) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }

  const { email, companyName, role, auditId } = parsed.data

  const { error } = await supabaseAdmin
    .from('leads')
    .insert({
      email,
      company_name: companyName,
      role,
      audit_id: auditId,
    })

  if (error) {
    console.error('Lead save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}