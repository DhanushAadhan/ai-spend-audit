// All prices in USD per seat per month unless noted
// Sources verified week of 07 May 2026 — see PRICING_DATA.md for URLs

export interface PlanPricing {
  plan: string
  pricePerSeat: number      // monthly USD per seat
  flatMonthly?: number      // flat fee regardless of seats
  minSeats?: number
  maxSeats?: number
  description: string
}

export const PRICING_DATA: Record<string, PlanPricing[]> = {
  cursor: [
    { plan: 'Hobby',      pricePerSeat: 0,   description: 'Free tier — 2000 completions/mo' },
    { plan: 'Pro',        pricePerSeat: 20,  description: 'Unlimited completions + GPT-4 & Claude' },
    { plan: 'Business',   pricePerSeat: 40,  description: 'Team features + SSO + admin' },
    { plan: 'Enterprise', pricePerSeat: 100, description: 'Custom — estimated from public info' },
  ],
  github_copilot: [
    { plan: 'Individual',  pricePerSeat: 10,  description: 'Single developer' },
    { plan: 'Business',    pricePerSeat: 19,  description: 'Teams — policy management' },
    { plan: 'Enterprise',  pricePerSeat: 39,  description: 'Enterprise SSO + audit logs' },
  ],
  claude: [
    { plan: 'Free',       pricePerSeat: 0,   description: 'Limited Claude 3.5 Sonnet access' },
    { plan: 'Pro',        pricePerSeat: 20,  description: '5× more usage + Projects' },
    { plan: 'Max',        pricePerSeat: 100, description: '5× Pro limits — power users' },
    { plan: 'Team',       pricePerSeat: 25,  minSeats: 5, description: 'Collaboration + admin, min 5 seats' },
    { plan: 'Enterprise', pricePerSeat: 60,  description: 'SSO + audit logs — estimated' },
    { plan: 'API',        pricePerSeat: 0,   description: 'Pay-as-you-go — enter actual spend' },
  ],
  chatgpt: [
    { plan: 'Free',       pricePerSeat: 0,   description: 'GPT-4o limited' },
    { plan: 'Plus',       pricePerSeat: 20,  description: 'GPT-4o + advanced tools' },
    { plan: 'Team',       pricePerSeat: 30,  minSeats: 2, description: 'Shared workspace, min 2 seats' },
    { plan: 'Enterprise', pricePerSeat: 60,  description: 'SSO + custom limits — estimated' },
    { plan: 'API',        pricePerSeat: 0,   description: 'Pay-as-you-go — enter actual spend' },
  ],
  anthropic_api: [
    { plan: 'Pay-as-you-go', pricePerSeat: 0, description: 'Token-based billing — enter actual spend' },
  ],
  openai_api: [
    { plan: 'Pay-as-you-go', pricePerSeat: 0, description: 'Token-based billing — enter actual spend' },
  ],
  gemini: [
    { plan: 'Free',       pricePerSeat: 0,   description: 'Gemini 1.5 Flash limited' },
    { plan: 'Advanced',   pricePerSeat: 20,  description: 'Gemini 1.5 Pro + 2TB Drive' },
    { plan: 'Business',   pricePerSeat: 24,  description: 'Workspace + Gemini for Workspace' },
    { plan: 'Enterprise', pricePerSeat: 36,  description: 'Full enterprise suite' },
    { plan: 'API',        pricePerSeat: 0,   description: 'Pay-as-you-go — enter actual spend' },
  ],
  windsurf: [
    { plan: 'Free',  pricePerSeat: 0,  description: 'Limited Flow credits' },
    { plan: 'Pro',   pricePerSeat: 15, description: 'Unlimited completions + 500 Flow credits' },
    { plan: 'Teams', pricePerSeat: 35, description: 'Team admin + SSO' },
  ],
}

// Monthly spend thresholds for recommendations
export const THRESHOLDS = {
  highSavingsAlert: 500,   // Show Credex prominently above this
  lowSavingsAlert: 100,    // "Spending well" message below this
  teamPlanBreakeven: {
    chatgpt: 4,            // Team ($30×n) beats Plus ($20×n) only at 4+ seats after value
    claude: 5,             // Team min seats
  },
}