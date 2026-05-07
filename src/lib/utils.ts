import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// shadcn/ui className helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a short random slug for shareable URLs
export function generateSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length: 8 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('')
}

// Format currency — e.g. 1234.5 → "$1,234.50"
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Format large numbers — e.g. 12000 → "12,000"
export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n)
}

// Clamp a value between min and max
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}