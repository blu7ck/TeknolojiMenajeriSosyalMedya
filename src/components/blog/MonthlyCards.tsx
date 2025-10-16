"use client"

import { Calendar } from "lucide-react"

interface MonthlyCardsProps {
  months: string[]
  postsCount: Record<string, any[]>
  onSelectMonth: (month: string) => void
}

export function MonthlyCards({ months, postsCount, onSelectMonth }: MonthlyCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map((month) => (
        <button
          key={month}
          onClick={() => onSelectMonth(month)}
          className="group relative overflow-hidden rounded-2xl bg-card border border-border p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-primary"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">{postsCount[month].length} yazı</span>
            </div>

            <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{month}</h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Yazıları görüntüle</span>
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
