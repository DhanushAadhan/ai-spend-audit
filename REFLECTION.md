# REFLECTION.md

## What I Built

AuditAI is an AI spend auditor for startups — it analyzes what teams pay for AI tools
like Cursor, Copilot, Claude, and ChatGPT, then identifies savings opportunities and
recommends a smarter stack. Think "Mint for AI subscriptions."

---

## What Went Well

### Technical Decisions I'm Proud Of

**Audit engine as pure functions**
The entire savings calculation logic lives in `src/lib/audit-engine.ts` as pure TypeScript
functions with no side effects. This made it trivially easy to unit test with Vitest and
meant I could build the UI independently without a working backend.

**Graceful AI fallback**
When the Anthropic API fails (timeout, rate limit, network error), the app falls back to
a template-based summary rather than showing an error. Users never see a broken experience.

**Shareable URLs without PII**
The shareable `/audit/[slug]` page strips all personally identifiable information before
rendering. Only tool names, plan types, and savings numbers are shown. This means users
can share their audit publicly without worrying about exposing company spend data.

**Supabase RLS from day one**
I configured Row Level Security on both tables before writing any application code.
This prevented any accidental data exposure during development.

---

## What I'd Do Differently

**Start with user interviews on Day 1**
I built the input form based on assumptions about what data users have readily available.
After talking to real users, I learned that most people don't know their exact seat count —
they just know their monthly bill. I'd redesign the input to accept either format.

**Use a monorepo from the start**
As the project grew, I wished I had separated the audit engine into its own package.
This would make it reusable (e.g., for a future CLI tool or API) without copy-pasting.

**Add analytics earlier**
I added Vercel Analytics on Day 5. I should have added it on Day 1 so I'd have real
funnel data to show at submission instead of projections.

---

## Hardest Technical Problem

**The GitHub Actions CI failure on Day 1.**
The `package-lock.json` was out of sync with `package.json` due to some packages being
installed in different orders. `npm ci` requires exact sync, which `npm install` doesn't
enforce. Fixed by deleting node_modules and package-lock.json and doing a clean reinstall.
Lesson: always run `npm ci` locally before pushing to catch this early.

---

## What I Learned About Entrepreneurship

Building this tool taught me that the real product isn't the audit — it's the moment
of realization. When someone sees "you're spending $1,136/month but estimated $800"
they feel surprised and slightly embarrassed. That emotion is what drives action.

The best products don't just show data. They create a feeling that makes the next step
(switching plans, cutting a tool, sharing with your team) feel obvious and urgent.

---

## If I Had 30 More Days

1. Add real-time pricing sync (scrape vendor pages weekly, alert users when prices change)
2. Build a team comparison feature (how does your AI spend compare to similar-size companies?)
3. Add a Slack bot that sends monthly spend digest
4. Create a public "State of AI Spending" report from anonymized aggregate data
5. Build a Chrome extension that auto-detects AI tool subscriptions from billing emails