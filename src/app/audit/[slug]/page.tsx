'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight, Zap, TrendingDown, CheckCircle,
  AlertCircle, Share2, Mail, ExternalLink
} from 'lucide-react'
import { TOOL_LABELS } from '@/types'
import type { AuditResult, ToolRecommendation } from '@/types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

function actionColor(action: ToolRecommendation['recommendedAction']) {
  switch (action) {
    case 'downgrade': return '#f59e0b'
    case 'switch':    return '#ef4444'
    case 'optimize':  return '#6366f1'
    case 'keep':      return '#22c55e'
    default:          return '#a1a1aa'
  }
}

function actionLabel(action: ToolRecommendation['recommendedAction']) {
  switch (action) {
    case 'downgrade': return 'Downgrade plan'
    case 'switch':    return 'Switch tool'
    case 'optimize':  return 'Optimize usage'
    case 'keep':      return 'Keep as-is ✓'
    default:          return action
  }
}

// ─── Lead capture modal ───────────────────────────────────────────────────────

function LeadModal({ auditId, onClose }: { auditId: string; onClose: () => void }) {
  const [email, setEmail]     = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole]       = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone]       = useState(false)

  const handleSubmit = async () => {
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, companyName: company, role, auditId }),
      })
      setDone(true)
    } catch {
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{
        background: '#111113', border: '1px solid #27272a',
        borderRadius: '20px', padding: '40px', maxWidth: '440px', width: '100%',
        boxShadow: '0 0 60px rgba(99,102,241,0.15)',
      }}>
        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎉</div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fafafa', marginBottom: '8px' }}>
              You're on the list!
            </h3>
            <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>
              We'll send your audit report and notify you when new optimizations apply to your stack.
            </p>
            <button onClick={onClose} style={{
              padding: '10px 24px', borderRadius: '10px', background: '#6366f1',
              color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600,
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Mail size={20} color="#6366f1" />
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fafafa' }}>
                Save your audit report
              </h3>
            </div>
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '24px' }}>
              We'll email you the full report and notify you when new savings opportunities apply to your stack.
            </p>

            {/* Honeypot */}
            <input type="text" name="_trap" tabIndex={-1} autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0 }} aria-hidden="true" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {[
                { label: 'Email address *', value: email, onChange: setEmail, placeholder: 'you@company.com', type: 'email' },
                { label: 'Company name', value: company, onChange: setCompany, placeholder: 'Acme Inc.', type: 'text' },
                { label: 'Your role', value: role, onChange: setRole, placeholder: 'CTO, Founder, etc.', type: 'text' },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '6px' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={f.value}
                    onChange={(e) => f.onChange(e.target.value)}
                    placeholder={f.placeholder}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '10px',
                      background: '#18181b', border: '1px solid #27272a',
                      color: '#fafafa', fontSize: '0.9rem', outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={onClose} style={{
                flex: 1, padding: '12px', borderRadius: '10px',
                background: 'transparent', border: '1px solid #27272a',
                color: '#a1a1aa', cursor: 'pointer', fontWeight: 500,
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={!email || loading} style={{
                flex: 2, padding: '12px', borderRadius: '10px',
                background: '#6366f1', color: 'white', border: 'none',
                cursor: email ? 'pointer' : 'not-allowed',
                fontWeight: 600, opacity: email ? 1 : 0.6,
              }}>
                {loading ? 'Saving...' : 'Send my report →'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AuditResultPage() {
  const params = useParams()
  const slug = params.slug as string

  const [audit, setAudit]         = useState<AuditResult | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(false)
  const [showLead, setShowLead]   = useState(false)
  const [copied, setCopied]       = useState(false)

  useEffect(() => {
    fetch(`/api/audit/${slug}`)
      .then((r) => r.json())
      .then((d) => { setAudit(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [slug])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div style={{ background: '#09090b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: '#a1a1aa' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #27272a', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p>Loading your audit...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  )

  if (error || !audit) return (
    <div style={{ background: '#09090b', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fafafa' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Audit not found</h2>
        <p style={{ color: '#a1a1aa', marginBottom: '24px' }}>This audit may have expired or the link is incorrect.</p>
        <Link href="/audit" style={{ color: '#818cf8', textDecoration: 'none' }}>Run a new audit →</Link>
      </div>
    </div>
  )

  const isHighSavings = audit.totalMonthlySavings > 500
  const isOptimal     = audit.totalMonthlySavings < 100
  const totalSpend    = audit.recommendations.reduce((s, r) => s + r.currentSpend, 0)

  return (
    <main style={{ background: '#09090b', minHeight: '100vh', fontFamily: 'system-ui,sans-serif', color: '#fafafa' }}>

      {/* Grid bg */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto', padding: '32px 20px' }}>

        {/* Nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', background: '#6366f1', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={13} color="white" fill="white" />
            </div>
            <span style={{ fontWeight: 700, color: '#fafafa' }}>AuditAI</span>
          </Link>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px',
              background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
              color: '#818cf8', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
            }}>
              <Share2 size={14} /> {copied ? 'Copied!' : 'Share'}
            </button>
            <button onClick={() => setShowLead(true)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '8px',
              background: '#6366f1', border: 'none',
              color: 'white', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500,
            }}>
              <Mail size={14} /> Save report
            </button>
          </div>
        </div>

        {/* HERO SAVINGS */}
        <div style={{
          background: 'linear-gradient(135deg, #111113 0%, #1a1a2e 100%)',
          border: '1px solid #27272a',
          borderRadius: '20px', padding: '40px', marginBottom: '24px',
          textAlign: 'center',
          boxShadow: isHighSavings ? '0 0 60px rgba(99,102,241,0.15)' : 'none',
        }}>
          {isOptimal ? (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
              <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                You're spending well
              </h1>
              <p style={{ color: '#a1a1aa' }}>
                Your current AI stack is well-optimised. We found less than $100/month in savings.
                We'll notify you when new opportunities apply to your stack.
              </p>
            </>
          ) : (
            <>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Potential savings identified
              </p>
              <div style={{ fontSize: 'clamp(3rem,8vw,5rem)', fontWeight: 800, color: '#22c55e', lineHeight: 1, marginBottom: '8px' }}>
                {formatCurrency(audit.totalMonthlySavings)}
                <span style={{ fontSize: '1.5rem', color: '#a1a1aa', fontWeight: 400 }}>/mo</span>
              </div>
              <div style={{ fontSize: '1.2rem', color: '#a1a1aa', marginBottom: '16px' }}>
                {formatCurrency(audit.totalAnnualSavings)}/year
              </div>
              <div style={{
                display: 'inline-flex', gap: '24px',
                background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '12px 24px',
                fontSize: '0.875rem', color: '#a1a1aa',
              }}>
                <span>Current spend: <strong style={{ color: '#fafafa' }}>{formatCurrency(totalSpend)}/mo</strong></span>
                <span>Team: <strong style={{ color: '#fafafa' }}>{audit.input.teamSize} people</strong></span>
                <span>Use case: <strong style={{ color: '#fafafa' }}>{audit.input.useCase}</strong></span>
              </div>
            </>
          )}
        </div>

        {/* AI SUMMARY */}
        {audit.aiSummary && (
          <div style={{
            background: '#111113', border: '1px solid #27272a',
            borderRadius: '16px', padding: '24px', marginBottom: '24px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ width: '20px', height: '20px', background: '#6366f1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={11} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                AI-generated summary
              </span>
            </div>
            <p style={{ color: '#d4d4d8', lineHeight: 1.7, fontSize: '0.95rem' }}>{audit.aiSummary}</p>
          </div>
        )}

        {/* CREDEX CTA — high savings only */}
        {isHighSavings && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(99,102,241,0.05))',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '16px', padding: '24px', marginBottom: '24px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            flexWrap: 'wrap',
          }}>
            <div>
              <h3 style={{ fontWeight: 700, color: '#fafafa', marginBottom: '4px' }}>
                💡 Capture even more savings with Credex
              </h3>
              <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>
                Credex offers discounted AI credits for Cursor, Claude, and ChatGPT Enterprise — sourced from companies that overforecast.
              </p>
            </div>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 20px', borderRadius: '10px',
              background: '#6366f1', color: 'white', textDecoration: 'none',
              fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap',
            }}>
              Book a consultation <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* PER-TOOL BREAKDOWN */}
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '16px', color: '#fafafa' }}>
          Per-tool breakdown
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {audit.recommendations.map((rec, i) => (
            <div key={i} style={{
              background: '#111113', border: '1px solid #27272a',
              borderRadius: '14px', padding: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fafafa' }}>
                      {TOOL_LABELS[rec.tool]}
                    </span>
                    <span style={{
                      padding: '2px 10px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600,
                      background: `${actionColor(rec.recommendedAction)}20`,
                      color: actionColor(rec.recommendedAction),
                      border: `1px solid ${actionColor(rec.recommendedAction)}40`,
                    }}>
                      {actionLabel(rec.recommendedAction)}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', color: '#71717a' }}>
                    Current: {rec.currentPlan} · {formatCurrency(rec.currentSpend)}/mo
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {rec.monthlySavings > 0 ? (
                    <>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#22c55e' }}>
                        -{formatCurrency(rec.monthlySavings)}/mo
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#71717a' }}>
                        {formatCurrency(rec.annualSavings)}/yr
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e' }}>
                      <CheckCircle size={16} /> <span style={{ fontSize: '0.875rem' }}>Optimal</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ background: '#27272a', borderRadius: '4px', height: '4px', marginBottom: '12px' }}>
                <div style={{
                  height: '4px', borderRadius: '4px',
                  background: rec.monthlySavings > 0 ? '#22c55e' : '#6366f1',
                  width: totalSpend > 0 ? `${Math.min((rec.currentSpend / totalSpend) * 100, 100)}%` : '0%',
                  transition: 'width 0.8s ease',
                }} />
              </div>

              {/* Reason */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <AlertCircle size={14} style={{ color: '#52525b', marginTop: '2px', flexShrink: 0 }} />
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', lineHeight: 1.6 }}>{rec.reason}</p>
              </div>

              {/* Recommended plan/tool */}
              {rec.recommendedPlan && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(99,102,241,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#818cf8' }}>
                  → Switch to <strong>{rec.recommendedPlan}</strong> plan
                </div>
              )}
              {rec.recommendedTool && (
                <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: '8px', fontSize: '0.8rem', color: '#fca5a5' }}>
                  → Consider switching to <strong>{TOOL_LABELS[rec.recommendedTool]}</strong>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* BOTTOM CTA */}
        <div style={{
          background: '#111113', border: '1px solid #27272a',
          borderRadius: '16px', padding: '28px', textAlign: 'center',
        }}>
          <h3 style={{ fontWeight: 700, marginBottom: '8px' }}>
            {isOptimal ? 'Stay informed' : 'Ready to start saving?'}
          </h3>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>
            {isOptimal
              ? "We'll notify you when new savings opportunities apply to your stack."
              : 'Save this report and share it with your team or manager.'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => setShowLead(true)} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 24px', borderRadius: '10px',
              background: '#6366f1', color: 'white', border: 'none',
              cursor: 'pointer', fontWeight: 600,
            }}>
              <Mail size={16} /> Save my report
            </button>
            <button onClick={handleCopy} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 24px', borderRadius: '10px',
              background: 'transparent', border: '1px solid #27272a',
              color: '#a1a1aa', cursor: 'pointer', fontWeight: 500,
            }}>
              <Share2 size={16} /> {copied ? 'Copied!' : 'Copy link'}
            </button>
            <Link href="/audit" style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '12px 24px', borderRadius: '10px',
              background: 'transparent', border: '1px solid #27272a',
              color: '#a1a1aa', textDecoration: 'none', fontWeight: 500,
            }}>
              New audit <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>

      {showLead && <LeadModal auditId={audit.id} onClose={() => setShowLead(false)} />}
    </main>
  )
}