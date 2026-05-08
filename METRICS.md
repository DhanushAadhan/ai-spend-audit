# METRICS.md — Success Metrics

## North Star Metric

**Audits completed per week** — because a completed audit means the user got value,
entered their data, and saw results. Everything else (emails, shares, signups) follows from this.

---

## Metrics Dashboard (Post-Launch)

### Acquisition
| Metric | Target (Week 1) | Target (Month 1) |
|--------|----------------|-----------------|
| Unique visitors | 500 | 3,000 |
| Audits started | 150 (30% of visitors) | 900 |
| Audits completed | 100 (67% completion) | 600 |
| Email captures | 30 (30% of completed) | 180 |

### Engagement
| Metric | Target |
|--------|--------|
| Avg time on results page | > 2 minutes |
| Shareable URL clicks | > 20% of completed audits |
| Return visits (D7) | > 15% |

### Revenue (Month 3+)
| Metric | Target |
|--------|--------|
| Free → Pro conversion | 3% of email captures |
| Pro → Team upgrade | 10% of Pro users |
| MRR | $225 by month 3 |

---

## How We Measure Each Metric

### Audits Completed
- Tracked via Supabase `audits` table row count
- Query: `select count(*) from audits where created_at > now() - interval '7 days'`

### Email Capture Rate
- Tracked via Supabase `leads` table
- Formula: `leads.count / audits.count * 100`
- Target: > 25%

### Shareable URL Clicks
- Tracked via Vercel Analytics on `/audit/[slug]` route
- Also tracked via Open Graph preview renders

### Average Savings Identified
- Query: `select avg(total_monthly_savings) from audits`
- This number is our best marketing asset — display it on landing page

---

## Lighthouse Scores (Performance Targets)

| Category | Target |
|----------|--------|
| Performance | ≥ 85 |
| Accessibility | ≥ 90 |
| Best Practices | ≥ 90 |
| SEO | ≥ 90 |

---

## What "Success" Looks Like at Submission

- 10+ real audits completed (not test data)
- 3+ email captures from real users
- 1+ shareable URL clicked by someone other than the developer
- Lighthouse performance ≥ 85
- CI green on final commit
- DEVLOG has entry for every day (Day 1–5)