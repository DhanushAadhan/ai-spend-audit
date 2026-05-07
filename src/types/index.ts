export type AiTool =
  | 'cursor'
  | 'github_copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic_api'
  | 'openai_api'
  | 'gemini'
  | 'windsurf'

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed'

export interface ToolEntry {
  tool: AiTool
  plan: string
  monthlySpend: number
  seats: number
}

export interface AuditInput {
  tools: ToolEntry[]
  teamSize: number
  useCase: UseCase
}

export interface ToolRecommendation {
  tool: AiTool
  currentPlan: string
  currentSpend: number
  recommendedAction: 'downgrade' | 'switch' | 'keep' | 'optimize'
  recommendedPlan?: string
  recommendedTool?: AiTool
  monthlySavings: number
  annualSavings: number
  reason: string
}

export interface AuditResult {
  id: string
  input: AuditInput
  recommendations: ToolRecommendation[]
  totalMonthlySavings: number
  totalAnnualSavings: number
  aiSummary?: string
  createdAt: string
}

export interface LeadCapture {
  email: string
  companyName?: string
  role?: string
  teamSize?: number
  auditId: string
}

export const TOOL_LABELS: Record<AiTool, string> = {
  cursor: 'Cursor',
  github_copilot: 'GitHub Copilot',
  claude: 'Claude',
  chatgpt: 'ChatGPT',
  anthropic_api: 'Anthropic API',
  openai_api: 'OpenAI API',
  gemini: 'Gemini',
  windsurf: 'Windsurf',
}

export const TOOL_PLANS: Record<AiTool, string[]> = {
  cursor: ['Hobby', 'Pro', 'Business', 'Enterprise'],
  github_copilot: ['Individual', 'Business', 'Enterprise'],
  claude: ['Free', 'Pro', 'Max', 'Team', 'Enterprise', 'API'],
  chatgpt: ['Free', 'Plus', 'Team', 'Enterprise', 'API'],
  anthropic_api: ['Pay-as-you-go'],
  openai_api: ['Pay-as-you-go'],
  gemini: ['Free', 'Advanced', 'Business', 'Enterprise', 'API'],
  windsurf: ['Free', 'Pro', 'Teams'],
}