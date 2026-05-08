# PROMPTS.md

## AI Summary Prompt

Used in `/src/app/api/audit/route.ts` to generate the personalized audit summary.

### Final Prompt (v3)

```
You are a concise financial advisor specializing in SaaS and AI tool spending.

A startup has just completed an AI spend audit. Here is their data:

Team size: {{teamSize}}
Primary use case: {{useCase}}
Total monthly spend on AI tools: ${{totalMonthlySpend}}
Total potential monthly savings: ${{totalMonthlySavings}}
Total potential annual savings: ${{totalAnnualSavings}}

Per-tool breakdown:
{{toolBreakdown}}

Write a personalized 80-100 word summary paragraph that:
1. Acknowledges their current spending situation honestly
2. Highlights the biggest savings opportunity specifically
3. Explains WHY the recommended changes make sense for their use case
4. Ends with one actionable next step

Tone: Professional but direct. Like a trusted advisor, not a sales pitch.
Do NOT use bullet points. Write in flowing prose only.
Do NOT mention Credex or any specific vendor by name in a promotional way.
```

### Why This Prompt Works

- **Specific constraints** (80-100 words) prevent rambling
- **Flowing prose only** makes it feel personal, not templated
- **Use case context** allows Claude to tailor recommendations (coding vs writing teams have different optimal stacks)
- **"Trusted advisor" tone** instruction prevents salesy language that users distrust

### What I Tried That Didn't Work

**v1 — Too generic:**
```
Summarize this AI spend audit data: {{data}}
```
Result: Claude produced generic boilerplate with no personalization.

**v2 — Too long:**
Asked for a "detailed analysis" — Claude produced 300+ word essays that users didn't read.

**v3 (current)** — Word count constraint + tone instruction + specific structure = consistent 90-word paragraphs that feel human.

### Fallback Template

When the Anthropic API fails or times out, the app falls back to:

```
Your team of {{teamSize}} is currently spending ${{totalMonthlySpend}}/month on AI tools.
Our audit identified ${{totalMonthlySavings}}/month (${{totalAnnualSavings}}/year) in potential savings.
The biggest opportunity is {{topRecommendation}}. For a {{useCase}}-focused team,
this change makes sense because {{topReason}}. Start with the highest-savings change first
and reassess your stack in 30 days.
```