"use client";

import { useMemo } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
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
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            type="number"
            dataKey="kt"
            name="kt"
            domain={[0, 100]}
            tick={{ fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
            label={{
              value: "Коэффициент времени (K_t), %",
              position: "insideBottom",
              offset: -5,
              fill: "var(--muted-foreground)",
            }}
          />
          <YAxis
            type="number"
            dataKey="totalCost"
            name="totalCost"
            tick={{ fill: "var(--muted-foreground)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={{ stroke: "var(--border)" }}
            label={{
              value: "Итоговая стоимость, ₽",
              angle: -90,
              position: "insideLeft",
              fill: "var(--muted-foreground)",
            }}
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
            >
              <LabelList
                dataKey="name"
                position="top"
                style={{ fontSize: 11, fill: "var(--foreground)" }}
              />
            </Scatter>
          ))}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
