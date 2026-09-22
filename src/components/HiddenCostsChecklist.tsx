"use client";

import { Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { HiddenCostItem, HiddenCostsState } from "@/lib/types";

interface HiddenCostsChecklistProps {
  items: HiddenCostItem[];
  state: HiddenCostsState;
  nights: number;
  total: number;
  onToggle: (id: string, enabled: boolean) => void;
  onAmountChange: (id: string, amount: number) => void;
  onRoundTripChange: (id: string, roundTrip: boolean) => void;
  onCountChange: (id: string, count: number) => void;
}

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

export function HiddenCostsChecklist({
  items,
  state,
  nights,
  total,
  onToggle,
  onAmountChange,
  onRoundTripChange,
  onCountChange,
}: HiddenCostsChecklistProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Калькулятор скрытых расходов (чек-лист)</CardTitle>
        <p className="text-xs text-muted-foreground">
          Отметьте пункты, которые касаются вашей поездки — сумма добавится к
          итоговой стоимости каждого направления.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => {
          const entry = state[item.id];
          const enabled = entry?.enabled ?? false;

          return (
            <div key={item.id} className="space-y-2 border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-2">
                <Checkbox
                  id={item.id}
                  checked={enabled}
                  onCheckedChange={(checked) => onToggle(item.id, checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor={item.id} className="flex-1 cursor-pointer font-normal">
                  {item.label}
                  <span className="block text-xs font-normal text-muted-foreground">
                    {item.unitNote}
                  </span>
                </Label>
                <Popover>
                  <PopoverTrigger
                    aria-label={`Пояснение: ${item.label}`}
                    className="mt-0.5 text-muted-foreground hover:text-foreground"
                  >
                    <Info className="size-4" />
                  </PopoverTrigger>
                  <PopoverContent>{item.helpText}</PopoverContent>
                </Popover>
              </div>

              {enabled && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pl-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={entry.amount}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (!isNaN(value) && value >= 0) onAmountChange(item.id, value);
                      }}
                      className="w-24"
                      step="0.01"
                      min="0"
                    />
                    <span className="text-muted-foreground">₽</span>
                  </div>

                  {item.supportsCount && (
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${item.id}-count`} className="text-muted-foreground">
                        {item.countLabel}:
                      </Label>
                      <Input
                        id={`${item.id}-count`}
                        type="number"
                        value={entry.count}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0) onCountChange(item.id, value);
                        }}
                        className="w-16"
                        min="0"
                        step="1"
                      />
                    </div>
                  )}

                  {item.supportsRoundTrip && (
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`${item.id}-roundtrip`}
                        checked={entry.roundTrip}
                        onCheckedChange={(checked) => onRoundTripChange(item.id, checked)}
                      />
                      <Label htmlFor={`${item.id}-roundtrip`} className="text-muted-foreground">
                        Туда и обратно
                      </Label>
                    </div>
                  )}

                  {item.scalesWithNights && (
                    <span className="text-xs text-muted-foreground">
                      × {Math.max(nights, 0)} {nights === 1 ? "ночь" : "ночей"}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}

        <div className="border-t pt-3">
          <div className="mb-1 text-xs text-muted-foreground">Итого по чек-листу:</div>
          <div className="text-lg font-semibold">{currencyFormatter.format(total)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
