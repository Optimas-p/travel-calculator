"use client"

import type { DestinationResult } from "@/lib/types"

const formatCurrency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
})

interface RecommendationBannerProps {
  result: DestinationResult
  reason: string
}

export function RecommendationBanner({ result, reason }: RecommendationBannerProps) {
  const { destination, totalCost, kt, costPerRestDay } = result

  return (
    <div className="relative overflow-hidden rounded-lg border-2 border-primary bg-primary/10 p-6">
      <div className="flex flex-col gap-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          Рекомендуем
        </div>

        <div className="flex items-center gap-3">
          <span className="text-4xl">{destination.emoji}</span>
          <span className="text-2xl font-bold">{destination.name}</span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-primary/70">Общая стоимость</span>
            <span className="text-lg font-semibold">{formatCurrency.format(totalCost)}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-primary/70">Качество отдыха</span>
            <span className="text-lg font-semibold">{(kt * 100).toFixed(1)}%</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs text-primary/70">Стоимость дня отдыха</span>
            <span className="text-lg font-semibold">{formatCurrency.format(costPerRestDay)}</span>
          </div>
        </div>

        <div className="text-sm text-primary/90">{reason}</div>
      </div>
    </div>
  )
}
