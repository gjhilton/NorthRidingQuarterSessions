"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { token } from "styled-system/tokens";

const DEFAULT_COLOR = token("colors.chart2");

// Minimal, compact chart for small-multiples layouts -- no axes, no grid,
// fixed small height. The point is comparing many of these side by side at
// a glance (shape, not precise values), unlike the full YearTrend/
// StackedYearArea charts elsewhere, which are meant to be read individually
// in more detail. Tooltip is kept (hovering for the exact value is fine),
// just everything else is stripped down.
export function Sparkline({
  data,
  color = DEFAULT_COLOR,
  height = 48,
}: {
  data: { x: number | string; y: number }[];
  color?: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Tooltip
          contentStyle={{ fontSize: 11, borderRadius: 4, padding: "4px 8px" }}
          labelFormatter={(x) => `${x}`}
          formatter={(value) => [`${value}`, ""]}
        />
        <Area
          type="monotone"
          dataKey="y"
          stroke={color}
          fill={color}
          fillOpacity={0.15}
          strokeWidth={1.5}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
