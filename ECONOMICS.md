# ECONOMICS.md — Unit Economics

## Cost to Run AuditAI

### Per Audit Cost Breakdown

| Component | Cost per Audit |
|-----------|---------------|
| Vercel compute | ~$0.000023 (edge function, ~50ms) |
| Supabase DB write | ~$0.000001 (single row insert) |
| Anthropic API (Claude Haiku) | ~$0.0008 (avg 400 tokens in, 120 out) |
| Resend email | ~$0.001 (1 email per lead, ~30% conversion) |
| **Total per audit** | **~$0.0018** |

### Monthly Infrastructure Cost at Scale

| Audits/Month | Vercel | Supabase | Anthropic | Resend | Total |
|-------------|--------|----------|-----------|--------|-------|
| 100 (today) | $0 | $0 | $0.08 | $0.03 | ~$0.11 |
| 1,000 | $0 | $0 | $0.80 | $0.30 | ~$1.10 |
| 10,000 | $20 | $25 | $8.00 | $3.00 | ~$56 |
| 100,000 | $150 | $100 | $80.00 | $30.00 | ~$360 |

**Key insight:** Stays on free tiers until ~5,000 audits/month.

---

## Revenue Model

### Free Tier
- Cost per user: ~$0.0018/audit
- Revenue: $0
- Value: Virality, email capture, brand awareness

### Pro Plan ($9/month)
- Gross margin: ~99% (infrastructure cost ~$0.05/month for power user)
- Break-even users needed: 1 (any single Pro subscriber covers 5,000 free audits)

### Team Plan ($29/month)
- Gross margin: ~99.5%
- Target: 100 Team subscribers = $2,900 MRR

### LTV Calculations (Estimated)
- Average Pro subscriber stays 8 months → LTV = $72
- Average Team subscriber stays 14 months → LTV = $406
- Blended LTV (80% Pro, 20% Team) = $139

### CAC Target
- Organic (PH/HN/Twitter): ~$0 CAC
- Paid acquisition break-even: CAC < $139
- Target CAC: <$20 (keeps LTV:CAC ratio > 5:1)

---

## Credex Marketplace Integration

### How AuditAI Drives Credex Revenue

When users complete an audit, AuditAI recommends switching or downgrading tools. 
Credex can monetize this by:

1. **Referral fees** — Partner with AI tool vendors for referral commissions when users 
   switch plans through AuditAI recommendations
2. **Lead generation** — Sell qualified "high AI spend" leads to enterprise software vendors
3. **Credex Premium upsell** — Gate advanced features (team benchmarking, spend alerts) 
   behind Credex marketplace subscription
4. **Data insights** — Anonymized aggregate spend data is valuable to AI vendors for 
   pricing intelligence (with user consent)

### Revenue Projection (12 months)

| Month | Free Users | Pro Users | MRR | Notes |
|-------|-----------|-----------|-----|-------|
| 1 | 200 | 5 | $45 | Post-launch |
| 3 | 800 | 25 | $225 | Word of mouth |
| 6 | 3,000 | 80 | $720 | PH relaunch |
| 12 | 10,000 | 250 | $2,250 | Steady state |

---

## Why This Business Makes Sense

- **No supply cost** — The "product" is calculations and AI text. Marginal cost near zero.
- **High intent users** — Someone auditing AI spend is already thinking about cutting costs = receptive to recommendations
- **Natural upgrade path** — Free audit → email capture → nurture → Pro conversion
- **Defensible data moat** — Aggregate anonymized spend data becomes more valuable over time