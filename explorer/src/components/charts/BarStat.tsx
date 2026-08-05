"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { token } from "styled-system/tokens";

// Recharts takes raw color strings (stroke/fill props), not className, so
// these read the shared theme tokens via the token() helper rather than
// css() -- see theme/tokens.ts for the actual values.
const GRID_COLOR = token("colors.fg");
const BAR_COLOR = token("colors.chart1");
const TEXT_COLOR = token("colors.fgMuted");

export function HorizontalBarStat({
  data,
}: {
  data: { name: string; count: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={Math.max(200, data.length * 32)}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} horizontal={false} />
        <XAxis type="number" allowDecimals={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={160}
          tick={{ fill: TEXT_COLOR, fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: GRID_COLOR }}
        />
        <Bar dataKey="count" fill={BAR_COLOR} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
