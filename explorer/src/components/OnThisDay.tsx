"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import { onThisDay, todayMonthDay, type OnThisDayRow } from "@/lib/queries/onThisDay";
import { Card, EmptyState } from "@/components/ui";

function formatMonthDay(date: Date): string {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long" });
}

function yearOf(dateStr: string | null): string {
  return dateStr ? dateStr.slice(0, 4) : "unknown year";
}

export function OnThisDay() {
  const [today] = useState(() => new Date());
  const [results, setResults] = useState<OnThisDayRow[] | null>(null);
  const { isPending, run } = useClientQuery<OnThisDayRow[]>(setResults);

  useEffect(() => {
    run((db) => onThisDay(db, todayMonthDay(today)));
    // Only ever needs to run once, on mount, against "today" as captured above.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>
        On this day: {formatMonthDay(today)}
      </h2>
      {isPending || results === null ? (
        <p className={css({ fontSize: "sm", color: "fgMuted" })}>Checking the record…</p>
      ) : results.length === 0 ? (
        <EmptyState>No extracted cases on record for this date yet.</EmptyState>
      ) : (
        <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
          {results.map((r) => (
            <Link key={r.id} href={`/browse/${r.id}`}>
              <Card className={css({ _hover: { borderColor: "fgAccent" } })}>
                <span className={css({ fontSize: "xs", color: "fgMuted" })}>
                  {yearOf(r.offence_date ?? r.conviction_date)} — {r.reference_number}
                </span>
                <p className={css({ fontSize: "sm", mt: "1" })}>{r.charge_description}</p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
