"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { css, cx } from "styled-system/css";
import type { PersonListRow } from "@/lib/queries/peopleList";
import { toSlug } from "@/lib/slug";
import { titleCase } from "@/lib/text";
import { Card, Pill, formInputStyle } from "@/components/ui";

type RoleFilter = "all" | "defendant" | "person";
type SexFilter = "all" | "male" | "female";

export function PeopleBrowseList({ people }: { people: PersonListRow[] }) {
  const [role, setRole] = useState<RoleFilter>("all");
  const [sex, setSex] = useState<SexFilter>("all");

  const filtered = useMemo(() => {
    return people.filter((p) => {
      if (role === "defendant" && p.defendant_mentions === 0) return false;
      if (role === "person" && p.person_mentions === 0) return false;
      if (sex !== "all" && p.sex !== sex) return false;
      return true;
    });
  }, [people, role, sex]);

  const groups = useMemo(() => {
    const map = new Map<string, PersonListRow[]>();
    for (const p of filtered) {
      const letter = (p.display_name || p.name_key).trim().charAt(0).toUpperCase() || "#";
      const bucket = map.get(letter);
      if (bucket) bucket.push(p);
      else map.set(letter, [p]);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
      <div className={css({ display: "flex", flexWrap: "wrap", gap: "3", alignItems: "end" })}>
        <FilterField label="Role">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as RoleFilter)}
            className={cx(formInputStyle, css({ px: "2", py: "1.5" }))}
          >
            <option value="all">All roles</option>
            <option value="defendant">Defendants</option>
            <option value="person">Involved persons</option>
          </select>
        </FilterField>
        <FilterField label="Sex">
          <select
            value={sex}
            onChange={(e) => setSex(e.target.value as SexFilter)}
            className={cx(formInputStyle, css({ px: "2", py: "1.5" }))}
          >
            <option value="all">All</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </FilterField>
        <p className={css({ fontSize: "sm", color: "fgMuted" })}>
          {filtered.length.toLocaleString()} of {people.length.toLocaleString()} names
        </p>
      </div>

      {groups.length > 0 && (
        <nav
          className={css({
            display: "flex",
            flexWrap: "wrap",
            gap: "1",
            fontSize: "xs",
            position: "sticky",
            top: 0,
            bg: "bg",
            py: "2",
            zIndex: 1,
          })}
        >
          {groups.map(([letter]) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className={css({
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "1.5rem",
                height: "1.5rem",
                borderRadius: "sm",
                color: "fgAccent",
                _hover: { bg: "bgSurface" },
              })}
            >
              {letter}
            </a>
          ))}
        </nav>
      )}

      <div className={css({ display: "flex", flexDirection: "column", gap: "6" })}>
        {groups.map(([letter, rows]) => (
          <div key={letter} id={`letter-${letter}`} className={css({ scrollMarginTop: "3rem" })}>
            <h3
              className={css({
                fontFamily: "serif",
                fontSize: "lg",
                fontWeight: "600",
                mb: "2",
                color: "fgMuted",
              })}
            >
              {letter}
            </h3>
            <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
              {rows.map((p) => (
                <Link key={p.name_key} href={`/people/${toSlug(p.name_key)}`}>
                  <Card
                    className={css({
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "3",
                      flexWrap: "wrap",
                      _hover: { borderColor: "fgAccent" },
                    })}
                  >
                    <span>
                      <span className={css({ fontWeight: "600" })}>{p.display_name}</span>
                      {(p.occupation || p.town_name) && (
                        <span className={css({ color: "fgMuted", fontSize: "sm" })}>
                          {" "}
                          · {[p.occupation, p.town_name ? titleCase(p.town_name) : null]
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                    </span>
                    <Pill>
                      {p.total_mentions} mention{p.total_mentions === 1 ? "" : "s"}
                    </Pill>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "1",
        fontSize: "xs",
        color: "fgMuted",
      })}
    >
      {label}
      {children}
    </label>
  );
}
