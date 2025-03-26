"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { Bar, BarChart, XAxis, YAxis } from "recharts";

export function StackedHorizontalBarChart({
  className,
  chartConfig,
  chartData,
  legend = true,
}: {
  className?: string;
  chartConfig: ChartConfig;
  chartData?: any[];
  legend?: boolean;
}) {
  return (
    <ChartContainer
      config={chartConfig}
      className={cn("h-8 w-full", className)}
    >
      <BarChart
        layout="vertical"
        data={chartData}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
      >
        <YAxis type="category" tickLine={false} axisLine={false} hide />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          hide
          domain={[0, "dataMax"]}
        />

        {Object.keys(chartConfig).map((type) => (
          <Bar
            key={type}
            dataKey={type}
            stackId="a"
            fill={chartConfig[type].color}
            strokeWidth={2}
            radius={4}
          />
        ))}

        {legend && (
          <ChartLegend
            className="pt-1 justify-end text-xs gap-8 hidden md:flex"
            content={<ChartLegendContent />}
          />
        )}
      </BarChart>
    </ChartContainer>
  );
}
