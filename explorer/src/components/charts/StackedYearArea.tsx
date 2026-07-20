"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const GRID_COLOR = "#ddd3bd";
const TEXT_COLOR = "#6b6355";

// Cycled across series in order; "Other" (always the last series key from
// topNSeriesByYear) lands on the grey so it reads as a residual bucket
// rather than competing with the named categories.
const SERIES_COLORS = ["#8a5240", "#4c6b6b", "#b08c3e", "#6b4c8a", "#4c708a", "#7a8a4c", "#9a9284"];

export function StackedYearArea({
  data,
  seriesKeys,
}: {
  data: Record<string, number | string>[];
  seriesKeys: string[];
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
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
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {seriesKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId="1"
            stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
            fill={SERIES_COLORS[i % SERIES_COLORS.length]}
            fillOpacity={0.75}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
