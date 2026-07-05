import type { Metadata } from 'next'
import { TooltipProvider } from '@/components/ui/tooltip'
import '../index.css'

export const metadata: Metadata = {
  title: 'GlyphWeave — ASCII Roguelike Tilemap Editor',
  description: 'ASCII Roguelike Tilemap Editor',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body><TooltipProvider>{children}</TooltipProvider></body>
    </html>
  )
}
