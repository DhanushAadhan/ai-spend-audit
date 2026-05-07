# DEVLOG — AuditAI

## Day 1 — 2026-05-07

**Hours worked:** 4

**What I did:**
- Scaffolded Next.js 14 app with TypeScript, Tailwind CSS, and shadcn/ui
- Set up Supabase project — created `audits` and `leads` tables with RLS policies
- Configured Vercel deployment with environment variables
- Defined all TypeScript types for the audit domain (ToolEntry, AuditInput, AuditResult)
- Added verified pricing data for all 8 AI tools (Cursor, Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf)
- Set up Vitest with jsdom + @testing-library/react
- Configured GitHub Actions CI pipeline (lint + test on push to main)
- Created utility functions: slug generator, currency formatter, cn helper

**What I learned:**
- Supabase RLS policies need to be set carefully — anon key respects RLS, service role bypasses it. Used service role only in API routes.
- shadcn/ui's `init` command generates a components.json that pins component versions — important for reproducibility.

**Blockers / what I'm stuck on:**
- Need to verify exact Cursor Enterprise pricing — marked as estimated for now, will confirm before submission.
- Resend API key setup pending — will do tomorrow alongside lead capture.

**Plan for tomorrow:**
- Build the spend input form — all 8 tools with plan selector, seat count, use case picker
- Implement localStorage persistence with Zod validation
- Build the landing page hero section
- Make layout fully mobile responsive