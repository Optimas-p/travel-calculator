"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HiddenCostItem, HiddenCostsState } from "@/lib/types";

interface HiddenCostsChecklistProps {
  items: HiddenCostItem[];
  state: HiddenCostsState;
  onToggle: (id: string, enabled: boolean) => void;
  onAmountChange: (id: string, amount: number) => void;
  total: number;
}

export function HiddenCostsChecklist({
  items,
  state,
  onToggle,
  onAmountChange,
  total,
}: HiddenCostsChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Калькулятор скрытых расходов (чек-лист)</CardTitle>
        <div className="text-xs text-muted-foreground">
          Отметьте пункты, которые касаются вашей поездки — сумма добавится к
          итоговой стоимости каждого направления.
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const itemState = state[item.id];
          return (
            <div key={item.id} className="flex items-center gap-3">
              <Checkbox
                id={item.id}
                checked={itemState?.enabled ?? false}
                onCheckedChange={(checked) => onToggle(item.id, checked as boolean)}
              />
              <Label htmlFor={item.id} className="flex-1 cursor-pointer">
                {item.label}
              </Label>
              <Input
                type="number"
                value={itemState?.amount ?? item.suggestedAmount}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (!isNaN(value) && value >= 0) {
                    onAmountChange(item.id, value);
                  }
                }}
                disabled={!itemState?.enabled}
                className="w-24"
                step="0.01"
                min="0"
              />
              <span className="text-sm font-medium">₽</span>
            </div>
          );
        })}
        <div className="border-t pt-3 mt-3">
          <div className="text-xs text-muted-foreground mb-1">
            Итого по чек-листу:
          </div>
          <div className="text-lg font-semibold">
            {new Intl.NumberFormat("ru-RU", {
              style: "currency",
              currency: "RUB",
              maximumFractionDigits: 0,
            }).format(total)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
