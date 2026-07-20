"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const GRID_COLOR = "#ddd3bd";
const BAR_COLOR = "#4c6b6b";
const TEXT_COLOR = "#6b6355";

// Vertical bar chart for a small fixed set of categories (day of week,
// lag-time buckets) -- as opposed to BarStat's horizontal layout, which
// suits longer/variable-length category lists (offence types, towns).
export function CategoryBar({ data }: { data: { label: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: GRID_COLOR }} />
        <Bar dataKey="count" fill={BAR_COLOR} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
