"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import { onThisDayNearest, type OnThisDayResult } from "@/lib/queries/onThisDay";
import { Card } from "@/components/ui";

function formatMonthDay(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function yearOf(dateStr: string | null): string {
  return dateStr ? dateStr.slice(0, 4) : "unknown year";
}

export function OnThisDay() {
  const [today] = useState(() => new Date());
  const [result, setResult] = useState<OnThisDayResult | null>(null);
  const { isPending, run } = useClientQuery<OnThisDayResult | null>(setResult);

  useEffect(() => {
    run((db) => onThisDayNearest(db, today));
    // Only ever needs to run once, on mount, against "today" as captured above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loads asynchronously and never blocks the rest of the page -- while
  // pending, or in the near-impossible case nothing turns up even within the
  // nearest-date search, the box simply isn't rendered (no loading
  // placeholder, no empty state), so it only ever pops in once there's
  // something real to show.
  if (isPending || result === null) {
    return null;
  }

  const { row } = result;
  const matchedDate = addDays(today, result.offsetDays);
  const year = yearOf(row.offence_date ?? row.conviction_date);
  const heading =
    result.offsetDays === 0
      ? `On this day: ${formatMonthDay(today)} (${year})`
      : `Nearest to today: ${formatMonthDay(matchedDate)} (${year})`;

  return (
    <Card className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>
        {heading}
      </h2>
      <p className={css({ fontSize: "body" })}>{row.raw_record}</p>
      <Link
        href={`/browse/${row.id}`}
        className={css({
          display: "inline-block",
          color: "fgAccent",
          fontSize: "body",
          fontWeight: "600",
        })}
      >
        View full record ({row.reference_number}) →
      </Link>
    </Card>
  );
}
