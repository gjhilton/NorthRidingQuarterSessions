"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { css } from "styled-system/css";
import { useClientQuery } from "@/lib/useClientQuery";
import {
  randomEspecialInterest,
  type EspecialInterestRow,
} from "@/lib/queries/especialInterest";
import { Card } from "@/components/ui";

function yearOf(dateStr: string | null): string {
  return dateStr ? dateStr.slice(0, 4) : "unknown year";
}

export function EspecialInterest() {
  const [result, setResult] = useState<EspecialInterestRow | null | undefined>(undefined);
  const { isPending, run } = useClientQuery<EspecialInterestRow | null>(setResult);

  useEffect(() => {
    run((db) => randomEspecialInterest(db));
    // Only ever needs to run once, on mount, to pick a single random case.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isPending && (result === null || result === undefined)) return null;

  return (
    <Card className={css({ borderColor: "fgAccent" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>
        Of especial interest
      </h2>
      {isPending || result === undefined ? (
        <p className={css({ fontSize: "body", color: "fgMuted", mt: "2" })}>
          Digging through the archive…
        </p>
      ) : (
        result && (
          <Link href={`/browse/${result.id}`}>
            <Card className={css({ mt: "2", _hover: { borderColor: "fgAccent" } })}>
              <span className={css({ fontSize: "small", color: "fgMuted" })}>
                {yearOf(result.offence_date ?? result.conviction_date)} —{" "}
                {result.reference_number}
              </span>
              <p className={css({ fontSize: "body", mt: "1" })}>{result.charge_description}</p>
            </Card>
          </Link>
        )
      )}
    </Card>
  );
}
