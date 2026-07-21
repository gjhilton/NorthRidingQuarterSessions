import Link from "next/link";
import { css } from "styled-system/css";
import { getTotals } from "@/lib/queries/stats";
import {
  lowConfidenceRecords,
  possibleNameVariants,
  recentExtractionFailures,
  repeatedDefendantNames,
  repeatedPersonNames,
  rawCaseStatusBreakdown,
  unreviewedOffenceTypes,
} from "@/lib/queries/quality";
import { Card, EmptyState, PageContainer, PageTitle, Pill, Table, Th, Td } from "@/components/ui";
import { toSlug } from "@/lib/slug";

export default function AboutPage() {
  const totals = getTotals();
  const coveragePct = Math.round((totals.convictions / totals.rawCaseTotal) * 100);
  const repeatedDefendants = repeatedDefendantNames();
  const repeatedPersons = repeatedPersonNames();
  const unreviewedOffences = unreviewedOffenceTypes();
  const statusBreakdown = rawCaseStatusBreakdown();
  const failures = recentExtractionFailures();
  const lowConfidence = lowConfidenceRecords();
  const nameVariants = possibleNameVariants();

  return (
    <PageContainer>
      <PageTitle subtitle="How this dataset was built, what it can and can't tell you, and where the rough edges are">
        About
      </PageTitle>

      <Section title="Where this data comes from">
        <p>
          Every record here starts as a catalogue entry on{" "}
          <a
            href="https://archivesunlocked.northyorks.gov.uk"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            Archives Unlocked North Yorkshire
          </a>
          , the North Yorkshire County Record Office&rsquo;s public catalogue for the North
          Riding Quarter Sessions Bundles (QSB). Each Summary Conviction entry there has a short
          free-text description written by an archivist summarising the original court document
          — not the document itself.
        </p>
        <p>
          That description is what gets processed here: scraped into a spreadsheet, then sent to
          a large language model (Claude or GPT-4, depending on the run) with instructions to
          pull out structured fields — defendant names, offence type, dates, location, sentencing
          — into the database this site reads from. Nothing here is transcribed by a human from
          the original document, and this site is two steps removed from it: archivist&rsquo;s
          summary, then LLM extraction from that summary.
        </p>
        <p>
          <strong>For anything you intend to rely on</strong> — citing in research, confirming a
          family history detail — follow the &ldquo;View original archive record&rdquo; link on
          any record back to Archives Unlocked and check it against the original catalogue entry.
        </p>
      </Section>

      <Section title="Two different extraction paths">
        <p>
          Six fields — petty sessional division, monetary value, game species, and age/marital
          status/relationship for defendants and involved persons — were added to the schema
          partway through this project, after several hundred records had already been extracted
          without them. Rather than leave those earlier records with permanent gaps, or re-spend
          API budget re-running them through the pipeline for six fields, records 1&ndash;193 had
          these six fields specifically backfilled by an LLM (Claude) reading each raw archivist
          summary directly within a Claude Code development session — the same underlying task the
          automated pipeline performs, but run once, manually, outside the documented
          batch-extraction process.
        </p>
        <p>
          This is recorded, not hidden: every summary conviction carries an{" "}
          <code>extraction_attempt</code> audit row, and the backfilled records are distinguishable
          from pipeline-extracted ones by <code>provider = &lsquo;claude-code-session&rsquo;</code>{" "}
          and <code>batch_id = &lsquo;backfill-2026-07-20-6field&rsquo;</code> in that table. The
          same extraction discipline applied to the automated pipeline applied here — fields were
          only filled where the source text explicitly stated them, nothing was inferred or
          guessed — but treat this as one further remove from the source, on top of the two
          described above.
        </p>
      </Section>

      <Section title="How much of the archive is covered">
        <p>
          {totals.convictions.toLocaleString()} of {totals.rawCaseTotal.toLocaleString()} archive
          records have been extracted so far ({coveragePct}%) — see the coverage note on the{" "}
          <Link href="/" className={css({ color: "fgAccent" })}>
            home page
          </Link>{" "}
          for the current figure and which decades it spans. Extraction is done in batches,
          deliberately sampled to spread across decades rather than working through the archive
          in catalogue order, specifically so that partial coverage doesn&rsquo;t read as a
          skewed slice of one narrow period. Even so:{" "}
          <strong>a partial corpus is still a partial corpus.</strong> Any pattern on{" "}
          <Link href="/trends" className={css({ color: "fgAccent" })}>
            Trends
          </Link>{" "}
          — an offence type rising or falling, a year with more convictions than another — may
          simply reflect which records happen to have been extracted yet, not a real historical
          trend. Treat everything on that page as provisional until coverage is much closer to
          complete.
        </p>
        <div className={css({ display: "flex", gap: "3", flexWrap: "wrap" })}>
          {statusBreakdown.map((s) => (
            <Card key={s.status} className={css({ minWidth: "8rem" })}>
              <div className={css({ fontSize: "xl", fontWeight: "600", fontFamily: "serif" })}>
                {s.count}
              </div>
              <div className={css({ fontSize: "sm", color: "fgMuted" })}>{s.status}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section
        title="What the extraction gets wrong, and how you'd know"
        id="confidence"
      >
        <p>
          As of the batches processed since this note was added, each record carries the
          LLM&rsquo;s own self-reported confidence (&ldquo;high&rdquo;, &ldquo;medium&rdquo;, or
          &ldquo;low&rdquo;) and, when not high, which specific fields it was unsure about. A
          record&rsquo;s detail page only shows this note when confidence is medium or low —
          nothing appears for high-confidence records, or for records extracted before this was
          added (there&rsquo;s no confidence data for those; that&rsquo;s a gap, not a sign
          they&rsquo;re more reliable).
        </p>
        <p>
          This self-reported confidence is the model&rsquo;s own assessment, not an independent
          check — it can be wrong, including in the direction of unwarranted confidence. It&rsquo;s
          a hint about where to look twice, not a guarantee.
        </p>
        <div>
          <h3 className={css({ fontWeight: "600", mb: "2" })}>
            Medium/low-confidence records ({lowConfidence.length})
          </h3>
          {lowConfidence.length === 0 ? (
            <EmptyState>None flagged.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Reference</Th>
                  <Th>Confidence</Th>
                  <Th>Flagged fields</Th>
                </tr>
              </thead>
              <tbody>
                {lowConfidence.map((r) => (
                  <tr key={r.id}>
                    <Td>
                      <Link
                        href={`/browse/${r.id}`}
                        className={css({ color: "fgAccent", fontWeight: "600" })}
                      >
                        {r.reference_number}
                      </Link>
                    </Td>
                    <Td>
                      <Pill>{r.extraction_confidence}</Pill>
                    </Td>
                    <Td>{r.uncertain_fields ?? "—"}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Section>

      <Section title="Defendants and involved persons are not deduplicated" id="deduplication">
        <p>
          Every extraction creates fresh defendant/involved-person rows — there is no
          identity-resolution step linking &ldquo;John Smith&rdquo; in one case to &ldquo;John
          Smith&rdquo; in another as the same real person, or catching that &ldquo;Jno. Smith&rdquo;
          and &ldquo;John Smith&rdquo; might be. The{" "}
          <Link href="/people" className={css({ color: "fgAccent" })}>
            People
          </Link>{" "}
          pages group mentions by an exact normalised name match only. Two different real people
          sharing a name will appear as one page; the same real person spelled two different ways
          will appear as two. The lists below are repeat-name candidates worth a manual second
          look, not confirmed matches.
        </p>
        <div>
          <h3 className={css({ fontWeight: "600", mb: "2" })}>
            Repeated defendant names ({repeatedDefendants.length})
          </h3>
          <NameList
            rows={repeatedDefendants.map((r) => ({ ...r, href: `/people/${toSlug(r.name_key)}` }))}
          />
        </div>
        <div>
          <h3 className={css({ fontWeight: "600", mb: "2" })}>
            Repeated involved-person names ({repeatedPersons.length})
          </h3>
          <p className={css({ fontSize: "sm", color: "fgMuted", mb: "2" })}>
            Witnesses, victims, prosecutors etc. whose name recurs across cases.
          </p>
          <NameList
            rows={repeatedPersons.map((r) => ({ ...r, href: `/people/${toSlug(r.name_key)}` }))}
          />
        </div>
        <div>
          <h3 className={css({ fontWeight: "600", mb: "2" })}>
            Possible name variants ({nameVariants.length})
          </h3>
          <p className={css({ fontSize: "sm", color: "fgMuted", mb: "2" })}>
            The lists above only catch the exact same name recurring. These pairs share a surname
            with a small spelling difference between them (like &ldquo;Jno. Smith&rdquo; vs.
            &ldquo;John Smith&rdquo;) — worth a look, but a shared surname with a close spelling is
            also just what two unrelated people in a small town look like, so treat this as a
            prompt to check, not a claim.
          </p>
          {nameVariants.length === 0 ? (
            <EmptyState>None found.</EmptyState>
          ) : (
            <div className={css({ display: "flex", flexDirection: "column", gap: "2" })}>
              {nameVariants.map((v) => (
                <div
                  key={`${v.a.name_key}::${v.b.name_key}`}
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    gap: "2",
                    flexWrap: "wrap",
                    fontSize: "sm",
                  })}
                >
                  <Link href={`/people/${toSlug(v.a.name_key)}`} className={css({ color: "fgAccent" })}>
                    {v.a.display_name} ({v.a.count}×)
                  </Link>
                  <span className={css({ color: "fgMuted" })}>↔</span>
                  <Link href={`/people/${toSlug(v.b.name_key)}`} className={css({ color: "fgAccent" })}>
                    {v.b.display_name} ({v.b.count}×)
                  </Link>
                  <Pill>edit distance {v.distance}</Pill>
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section title="Offence categories are partly LLM-invented">
        <p>
          The model is given a seed list of standard offence categories and asked to match
          against it, but may propose a new category if none fit. Those proposed categories
          aren&rsquo;t automatically reviewed for whether they duplicate an existing one under a
          different name (e.g. &ldquo;possession of short weights&rdquo; vs. &ldquo;possession of
          inaccurate weights&rdquo;).
        </p>
        <div>
          <h3 className={css({ fontWeight: "600", mb: "2" })}>
            Unreviewed offence types ({unreviewedOffences.length})
          </h3>
          {unreviewedOffences.length === 0 ? (
            <EmptyState>None pending review.</EmptyState>
          ) : (
            <Table>
              <thead>
                <tr>
                  <Th>Offence type</Th>
                  <Th>Case count</Th>
                </tr>
              </thead>
              <tbody>
                {unreviewedOffences.map((o) => (
                  <tr key={o.name}>
                    <Td>{o.name}</Td>
                    <Td>{o.count}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Section>

      <Section title="Recent extraction failures" id="failures">
        <p>
          Raw cases where an extraction attempt errored out rather than producing a record —
          these aren&rsquo;t in the {totals.convictions.toLocaleString()} extracted so far, and
          are retried in later batches.
        </p>
        {failures.length === 0 ? (
          <EmptyState>No extraction failures recorded.</EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <Th>Reference</Th>
                <Th>Attempted</Th>
                <Th>Provider / model</Th>
                <Th>Error</Th>
              </tr>
            </thead>
            <tbody>
              {failures.map((f) => (
                <tr key={f.id}>
                  <Td>{f.reference_number}</Td>
                  <Td>{f.attempted_at}</Td>
                  <Td>
                    {f.provider} / {f.model}
                  </Td>
                  <Td className={css({ maxWidth: "24rem" })}>{f.error_message ?? "—"}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>

      <Section title="Search scope">
        <p>
          The search box on{" "}
          <Link href="/browse" className={css({ color: "fgAccent" })}>
            Browse
          </Link>{" "}
          matches against the charge description, reference number, offence type, sentencing text,
          and defendant/involved-person names. It does not currently match against occupation —
          searching &ldquo;butcher&rdquo; won&rsquo;t find a defendant with that occupation unless
          the word itself appears elsewhere in the record.
        </p>
      </Section>

      <Section title="Getting the data">
        <p>
          Every field discussed above is in the download, in case you want to analyse it
          yourself rather than through this site&rsquo;s views: reference number, dates, offence
          type, charge description, sentencing, location, defendant names, extraction confidence,
          and the archive URL, one row per conviction.
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/nrqs-dataset.csv`}
          download
          className={css({
            display: "inline-block",
            width: "fit-content",
            bg: "fgAccent",
            color: "bgSurface",
            px: "4",
            py: "2",
            borderRadius: "md",
            fontSize: "sm",
            fontWeight: "600",
          })}
        >
          Download full dataset (CSV)
        </a>
      </Section>
    </PageContainer>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={css({ display: "flex", flexDirection: "column", gap: "3", scrollMarginTop: "3rem" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>{title}</h2>
      <Card className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
        {children}
      </Card>
    </section>
  );
}

function NameList({ rows }: { rows: { name_key: string; count: number; href: string }[] }) {
  if (rows.length === 0) return <EmptyState>None found.</EmptyState>;
  return (
    <div className={css({ display: "flex", flexWrap: "wrap", gap: "2" })}>
      {rows.map((r) => (
        <Link key={r.name_key} href={r.href}>
          <Pill>
            {r.name_key} ({r.count}×)
          </Pill>
        </Link>
      ))}
    </div>
  );
}
