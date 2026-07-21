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
import { token } from "styled-system/tokens";

const GRID_COLOR = token("colors.border");
const LINE_COLOR = token("colors.chart2");
const TEXT_COLOR = token("colors.muted");

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
        {/* type="number" + domain so years position by true elapsed time --
            this archive has decades-long gaps between extracted records, and
            an evenly-spaced category axis would draw those as if they were
            consecutive years, misrepresenting how sparse the data actually is. */}
        <XAxis
          dataKey="year"
          type="number"
          domain={["dataMin", "dataMax"]}
          allowDecimals={false}
          tick={{ fill: TEXT_COLOR, fontSize: 12 }}
        />
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
