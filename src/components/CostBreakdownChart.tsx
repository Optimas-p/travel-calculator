"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import type { TooltipContentProps } from "recharts";
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";
import type { DestinationResult } from "@/lib/types";

const COLORS = {
  transport: "#3b82f6",
  accommodation: "#10b981",
  food: "#f59e0b",
  activities: "#ef4444",
  extra: "#8b5cf6",
  hiddenCosts: "#64748b",
};

const LEGEND_ITEMS: Array<{ key: keyof typeof COLORS; label: string }> = [
  { key: "transport", label: "Транспорт" },
  { key: "accommodation", label: "Проживание" },
  { key: "food", label: "Питание" },
  { key: "activities", label: "Развлечения" },
  { key: "extra", label: "Доп. расходы" },
  { key: "hiddenCosts", label: "Скрытые расходы (чек-лист)" },
];

interface ChartData {
  name: string;
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  extra: number;
  hiddenCosts: number;
}

export function CostBreakdownChart({ results }: { results: DestinationResult[] }) {
  const chartData: ChartData[] = results.map((result) => ({
    name: result.destination.name,
    transport: result.costs.transport,
    accommodation: result.costs.accommodation,
    food: result.costs.food,
    activities: result.costs.activities,
    extra: result.costs.extra,
    hiddenCosts: result.hiddenCostsTotal,
  }));

  const customTooltip = ({ active, payload }: TooltipContentProps<ValueType, NameType>) => {
    if (!active || !payload || !payload.length) return null;

    const total = payload.reduce((sum, entry) => sum + Number(entry.value ?? 0), 0);

    return (
      <div className="rounded-md border border-border bg-popover text-popover-foreground p-4 shadow-lg">
        <p className="text-sm font-semibold mb-2">{(payload[0].payload as ChartData).name}</p>
        {payload.map((entry, index) => (
          <p
            key={index}
            style={{ color: entry.color }}
            className="text-sm"
          >
            {entry.name}:{" "}
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            }).format(Number(entry.value ?? 0))}
          </p>
        ))}
        <p className="text-sm font-semibold mt-2 pt-2 border-t border-border">
          Итого:{" "}
          {new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: "RUB",
            maximumFractionDigits: 0,
          }).format(total)}
        </p>
      </div>
    );
  };

  return (
    <div>
      <div className="h-[340px] w-full sm:h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 12, top: 4, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
              tickFormatter={(value) => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)}
            />
            <YAxis
              dataKey="name"
              type="category"
              width={96}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={{ stroke: "var(--border)" }}
            />
            <Tooltip content={customTooltip} cursor={{ fill: "var(--muted)" }} />
            <Bar dataKey="transport" stackId="a" fill={COLORS.transport} name="Транспорт" />
            <Bar dataKey="accommodation" stackId="a" fill={COLORS.accommodation} name="Проживание" />
            <Bar dataKey="food" stackId="a" fill={COLORS.food} name="Питание" />
            <Bar dataKey="activities" stackId="a" fill={COLORS.activities} name="Развлечения" />
            <Bar dataKey="extra" stackId="a" fill={COLORS.extra} name="Доп. расходы" />
            <Bar dataKey="hiddenCosts" stackId="a" fill={COLORS.hiddenCosts} name="Скрытые расходы (чек-лист)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-foreground">
        {LEGEND_ITEMS.map(({ key, label }) => (
          <li key={key} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS[key] }}
              aria-hidden
            />
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
