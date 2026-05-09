import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AuditAI — Find out how much your team wastes on AI tools',
  description:
    'AuditAI analyzes your AI subscriptions and tells you exactly where to cut, switch, or optimize. Takes 2 minutes. Free forever.',
  openGraph: {
    title: 'AuditAI — AI Spend Auditor for Startups',
    description: 'Find out how much your team wastes on AI tools. Takes 2 minutes.',
    type: 'website',
    url: process.env.NEXT_PUBLIC_APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AuditAI — AI Spend Auditor for Startups',
    description: 'Find out how much your team wastes on AI tools. Takes 2 minutes.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}