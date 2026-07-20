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

const GRID_COLOR = "#ddd3bd";
const BAR_COLOR = "#8a5240";
const TEXT_COLOR = "#6b6355";

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
