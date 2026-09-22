import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RegionInfo } from "@/lib/regions";

export function RegionGuide({ regions }: { regions: RegionInfo[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {regions.map((region) => (
        <Card key={region.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="text-2xl">{region.emoji}</span>
              <span>{region.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{region.description}</p>
            <p>{region.travelNote}</p>
            {region.fuelNote && (
              <p className="rounded-md bg-amber-500/10 p-2 text-xs text-amber-700 dark:text-amber-400">
                ⛽ {region.fuelNote}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
