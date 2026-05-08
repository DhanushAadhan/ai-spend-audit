# AuditAI — AI Spend Auditor for Startups

AuditAI helps startup founders and engineering managers find where they're
overspending on AI tools like Cursor, Claude, ChatGPT, and Copilot —
and recommends a smarter, cheaper stack. Free forever, no login required.

## Live Demo
🔗 https://ai-spend-audit-seven.vercel.app

## Screenshots
_(add after UI is built on Day 2-3)_

## Quick Start
```bash
git clone https://github.com/DhanushAadhan/ai-spend-audit
cd ai-spend-audit
npm install
cp .env.example .env.local
# Fill in .env.local with your keys
npm run dev
```

## Decisions
1. **Next.js over Vite** — needed SSR for shareable audit URLs with proper OG tags
2. **Hardcoded audit engine over AI** — financial calculations must be deterministic and auditable
3. **Supabase over Firebase** — Postgres gives us proper relational integrity between audits and leads
4. **Vitest over Jest** — 10x faster, native ESM support, same API
5. **No login required** — removing friction before value delivery maximises audit completion rate