import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Audit Your AI Spend — AuditAI',
  description: 'Enter your AI tools and get an instant savings report.',
}

export default function AuditLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}