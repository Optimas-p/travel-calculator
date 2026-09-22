import * as React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { DestinationResult } from "@/lib/types"

const costLabels = [
  { label: "Транспорт", key: "transport" as const },
  { label: "Проживание", key: "accommodation" as const },
  { label: "Питание", key: "food" as const },
  { label: "Развлечения", key: "activities" as const },
  { label: "Доп. расходы", key: "extra" as const },
]

const formatPrice = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
}).format

interface DestinationCardProps {
  result: DestinationResult
}

export function DestinationCard({ result }: DestinationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="text-2xl">{result.destination.emoji}</span>
          <span>{result.destination.name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-2 text-sm">
            {costLabels.map(({ label, key }) => (
              <div key={key} className="flex justify-between">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-medium">{formatPrice(result.costs[key])}</span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-2 text-sm">
            {result.hiddenCostsTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Скрытые расходы (чек-лист):</span>
                <span className="font-medium">{formatPrice(result.hiddenCostsTotal)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Итого:</span>
              <span className="font-semibold text-lg">{formatPrice(result.totalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Коэффициент времени (kt):</span>
              <span className="font-medium">
                {((result.kt * 100).toFixed(1))}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Стоимость одного дня отдыха:</span>
              <span className="font-medium">{formatPrice(result.costPerRestDay)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Дней отдыха:</span>
              <span className="font-medium">{result.restDays.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
