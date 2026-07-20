"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GRID_COLOR = "#ddd3bd";
const LINE_COLOR = "#4c6b6b";
const TEXT_COLOR = "#6b6355";

export function YearTrend({ data }: { data: { year: number; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
        <defs>
          <linearGradient id="yearFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={LINE_COLOR} stopOpacity={0.35} />
            <stop offset="95%" stopColor={LINE_COLOR} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="year" tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
        <YAxis allowDecimals={false} tick={{ fill: TEXT_COLOR, fontSize: 12 }} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, borderColor: GRID_COLOR }} />
        <Area
          type="monotone"
          dataKey="count"
          stroke={LINE_COLOR}
          fill="url(#yearFill)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
