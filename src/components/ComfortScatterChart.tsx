"use client";

import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DestinationResult } from "@/lib/types";

const DESTINATION_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const CUSTOM_TOOLTIP_FORMATTER = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

interface ComfortScatterChartProps {
  results: DestinationResult[];
}

export function ComfortScatterChart({ results }: ComfortScatterChartProps) {
  const chartData = useMemo(() => {
    return results.map((result) => ({
      name: result.destination.name,
      emoji: result.destination.emoji,
      kt: result.kt * 100,
      totalCost: result.totalCost,
      costPerRestDay: result.costPerRestDay,
    }));
  }, [results]);

  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">
        По горизонтали — коэффициент времени K_t (%), по вертикали — итоговая
        стоимость (₽); размер точки — стоимость одного дня отдыха.
      </p>
      <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 20, bottom: 4, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="kt"
            name="kt"
            domain={[0, 100]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
          />
          <YAxis
            type="number"
            dataKey="totalCost"
            name="totalCost"
            width={72}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
            tickFormatter={(value) => new Intl.NumberFormat("ru-RU", { notation: "compact", maximumFractionDigits: 1 }).format(value)}
          />
          <ZAxis type="number" dataKey="costPerRestDay" range={[400, 2000]} name="costPerRestDay" />
          <Tooltip
            cursor={{ strokeDasharray: "3 3" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0) {
                const data = payload[0].payload;
                return (
                  <div className="rounded border border-border bg-popover text-popover-foreground p-3 shadow-sm">
                    <div className="text-lg font-semibold">
                      {data.emoji} {data.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Коэффициент времени: {data.kt.toFixed(1)}%
                    </div>
                    <div className="text-sm">
                      Стоимость: {CUSTOM_TOOLTIP_FORMATTER.format(data.totalCost)}
                    </div>
                    <div className="text-sm">
                      Затраты на день отдыха: {CUSTOM_TOOLTIP_FORMATTER.format(data.costPerRestDay)}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {chartData.map((item, index) => (
            <Scatter
              key={index}
              name={item.name}
              data={[item]}
              fill={DESTINATION_COLORS[index % DESTINATION_COLORS.length]}
            />
          ))}
        </ScatterChart>
      </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-foreground">
        {chartData.map((item, index) => (
          <li key={item.name} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: DESTINATION_COLORS[index % DESTINATION_COLORS.length] }}
              aria-hidden
            />
            {item.emoji} {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
