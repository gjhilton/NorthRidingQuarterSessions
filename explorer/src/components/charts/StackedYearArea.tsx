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
import { token } from "styled-system/tokens";

const GRID_COLOR = token("colors.fg");
const TEXT_COLOR = token("colors.fgMuted");

// Cycled across series in order; "Other" (always the last series key from
// topNSeriesByYear) lands on chart7 (the grey) so it reads as a residual
// bucket rather than competing with the named categories.
const SERIES_COLORS = [
  token("colors.chart1"),
  token("colors.chart2"),
  token("colors.chart3"),
  token("colors.chart4"),
  token("colors.chart5"),
  token("colors.chart6"),
  token("colors.chart7"),
];

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
