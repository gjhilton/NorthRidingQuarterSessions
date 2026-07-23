"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { token } from "styled-system/tokens";

const GRID_COLOR = token("colors.fg");
const TEXT_COLOR = token("colors.fgMuted");
const MALE_COLOR = token("colors.chart1");
const FEMALE_COLOR = token("colors.chart2");

export function GenderYearLines({
  data,
}: {
  data: { year: number; male: number; female: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ left: 8, right: 16, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={GRID_COLOR} vertical={false} />
        {/* type="number" + domain, matching YearTrend/StackedYearArea -- see
            those components for why an evenly-spaced category axis would
            misrepresent this archive's decades-long gaps between records. */}
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
        <Line
          type="monotone"
          dataKey="male"
          name="Male"
          stroke={MALE_COLOR}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="female"
          name="Female"
          stroke={FEMALE_COLOR}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
