import { describe, it, expect } from 'vitest'
import { runAudit } from '@/lib/audit-engine'
import type { AuditInput } from '@/types'

// ─── Test 1: Single tool over-spend detection ─────────────────────────────────
describe('Cursor Business with 1 seat', () => {
  it('should recommend downgrade to Pro', () => {
    const input: AuditInput = {
      tools: [{ tool: 'cursor', plan: 'Business', monthlySpend: 40, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toBe('downgrade')
    expect(rec.recommendedPlan).toBe('Pro')
    expect(rec.monthlySavings).toBe(20)
    expect(rec.annualSavings).toBe(240)
  })
})

// ─── Test 2: Duplicate tool detection (Cursor + Copilot) ─────────────────────
describe('Cursor Pro + GitHub Copilot Individual', () => {
  it('should flag Copilot as redundant when Cursor Pro is active', () => {
    const input: AuditInput = {
      tools: [
        { tool: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1 },
        { tool: 'github_copilot', plan: 'Individual', monthlySpend: 10, seats: 1 },
      ],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    const copilotRec = result.recommendations.find((r) => r.tool === 'github_copilot')
    expect(copilotRec?.recommendedAction).toBe('switch')
    expect(copilotRec?.monthlySavings).toBe(10)
  })
})

// ─── Test 3: Total savings aggregation ───────────────────────────────────────
describe('Multiple tools with savings', () => {
  it('should correctly aggregate total monthly and annual savings', () => {
    const input: AuditInput = {
      tools: [
        { tool: 'cursor', plan: 'Business', monthlySpend: 40, seats: 1 },   // saves $20
        { tool: 'claude', plan: 'Max', monthlySpend: 100, seats: 1 },        // saves $80
      ],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    expect(result.totalMonthlySavings).toBeGreaterThan(0)
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12)
  })
})

// ─── Test 4: Already optimal — keep recommendation ────────────────────────────
describe('Optimal plan selection', () => {
  it('should return keep for Cursor Pro with 1 seat', () => {
    const input: AuditInput = {
      tools: [{ tool: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    }
    const result = runAudit(input)
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toBe('keep')
    expect(rec.monthlySavings).toBe(0)
    expect(result.totalMonthlySavings).toBe(0)
  })
})

// ─── Test 5: ChatGPT Team break-even ─────────────────────────────────────────
describe('ChatGPT Team with 2 seats', () => {
  it('should recommend downgrading to Plus for small teams', () => {
    const input: AuditInput = {
      tools: [{ tool: 'chatgpt', plan: 'Team', monthlySpend: 60, seats: 2 }],
      teamSize: 2,
      useCase: 'writing',
    }
    const result = runAudit(input)
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toBe('downgrade')
    expect(rec.recommendedPlan).toBe('Plus')
    expect(rec.monthlySavings).toBeGreaterThan(0)
  })
})

// ─── Test 6: API spend optimization ──────────────────────────────────────────
describe('High Anthropic API spend', () => {
  it('should recommend optimization for spend over $500/mo', () => {
    const input: AuditInput = {
      tools: [{ tool: 'anthropic_api', plan: 'Pay-as-you-go', monthlySpend: 800, seats: 1 }],
      teamSize: 5,
      useCase: 'data',
    }
    const result = runAudit(input)
    const rec = result.recommendations[0]
    expect(rec.recommendedAction).toBe('optimize')
    expect(rec.monthlySavings).toBeGreaterThan(0)
  })
})

// ─── Test 7: Audit result has slug ───────────────────────────────────────────
describe('Audit result structure', () => {
  it('should generate a unique slug for each audit', () => {
    const input: AuditInput = {
      tools: [{ tool: 'cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }],
      teamSize: 1,
      useCase: 'coding',
    }
    const result1 = runAudit(input)
    const result2 = runAudit(input)
    expect(result1.slug).toBeDefined()
    expect(result1.slug).toHaveLength(8)
    expect(result1.slug).not.toBe(result2.slug)
  })
})