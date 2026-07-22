import Link from "next/link";
import { css } from "styled-system/css";
import {
  especialInterestCount,
  fieldCoverage,
  getTotals,
  relatedConvictionPairCount,
} from "@/lib/queries/stats";
import {
  courtTownScopeComparison,
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
  const scopeComparison = courtTownScopeComparison();
  const coverage = fieldCoverage();
  const relatedConvictionPairs = relatedConvictionPairCount();
  const especialInterestTotal = especialInterestCount();
  const especialInterestPct = Math.round((especialInterestTotal / totals.convictions) * 100);

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
        {coveragePct >= 100 ? (
          <p>
            All {totals.convictions.toLocaleString()} Summary Conviction records identified in
            the archive scrape have been extracted ({coveragePct}%) — see the{" "}
            <Link href="/" className={css({ color: "fgAccent" })}>
              home page
            </Link>{" "}
            for which decades that spans. That completeness is about <em>this</em>{" "}
            pipeline&rsquo;s input, not the underlying archive: the scrape targeted Summary
            Conviction records specifically, so other Quarter Sessions document types are out of
            scope entirely, and it&rsquo;s possible for the archive catalogue itself to grow
            after the scrape was taken. What&rsquo;s <em>not</em>{" "}
            uniformly complete is per-field coverage within these records — see &ldquo;Field
            coverage&rdquo; below before relying on any one field being populated.
          </p>
        ) : (
          <p>
            {totals.convictions.toLocaleString()} of {totals.rawCaseTotal.toLocaleString()}{" "}
            Summary Conviction records identified in the archive scrape have been extracted so
            far ({coveragePct}%) — see the coverage note on the{" "}
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
        )}
        <div className={css({ display: "flex", gap: "3", flexWrap: "wrap" })}>
          {statusBreakdown.map((s) => (
            <Card key={s.status} className={css({ minWidth: "8rem" })}>
              <div className={css({ fontSize: "heading", fontWeight: "600", fontFamily: "serif" })}>
                {s.count}
              </div>
              <div className={css({ fontSize: "body", color: "fgMuted" })}>{s.status}</div>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Why 'in scope' isn't just 'heard at Whitby'">
        <p>
          The scrape found records via a free-text keyword search for
          &ldquo;whitby&rdquo; against the archive catalogue, which
          inevitably caught some records by pure coincidence — a
          defendant surnamed Whitby who never lived near the town, a pub
          called the &ldquo;Whitby Arms Inn&rdquo; in Middlesbrough, a
          railway line merely <em>named</em>{" "}
          after Whitby. 26 such records were identified, hand-reviewed one
          at a time, and removed — see{" "}
          <code>OUT_OF_SCOPE_REVIEW.md</code> in the repository for the
          full log of every one and why.
        </p>
        <p>
          A record is kept in scope if the offence occurred in Whitby, the
          case was <em>heard</em>{" "}
          at Whitby, a defendant lives in Whitby, or an involved person
          (victim, witness) lives in Whitby. It&rsquo;s worth explaining
          why court location alone isn&rsquo;t used as the sole rule,
          since it&rsquo;s tempting to assume &ldquo;heard at Whitby&rdquo;
          is the cleanest definition of &ldquo;a Whitby case.&rdquo;
          Restricting the corpus to only{" "}
          <strong>
            {scopeComparison.courtTownOnlyTotal.toLocaleString()}
          </strong>{" "}
          cases heard at Whitby, out of the current{" "}
          <strong>{scopeComparison.currentTotal.toLocaleString()}</strong>,
          would drop{" "}
          <strong>{scopeComparison.excludedIfRestricted.toLocaleString()}</strong>{" "}
          records — and most of those are exactly the cases you&rsquo;d
          most want to keep:
        </p>
        <Table>
          <thead>
            <tr>
              <Th>Why it would be excluded</Th>
              <Th>Records</Th>
            </tr>
          </thead>
          <tbody>
            {scopeComparison.excludedBreakdown.map((row) => (
              <tr key={row.reason}>
                <Td>{row.reason}</Td>
                <Td>{row.count}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p className={css({ fontSize: "small", color: "fgMuted" })}>
          Most of what a court-town-only rule would exclude is cases where
          the offence itself happened in Whitby but the court/hearing
          location wasn&rsquo;t recorded — the single most directly
          relevant category there is. A residency-only connection
          (defendant or witness lives in Whitby, offence and court both
          elsewhere) is the weaker signal, not the stronger one — court
          location alone gets this backwards.
        </p>
      </Section>

      <Section title="Field coverage">
        <p>
          The stats above are about which <em>records</em> exist — this is about which{" "}
          <em>fields</em>{" "}
          are actually filled in within them. Some fields are rarely stated in the
          archivist&rsquo;s original summary at all (defendant age, for instance, is almost
          never given as an exact figure), which is a property of the source material, not a
          pipeline gap — but it&rsquo;s easy to assume a field is reliably populated just because
          it&rsquo;s in the schema, so here&rsquo;s the actual fill rate for the less
          consistently-present ones.
        </p>
        <Table>
          <thead>
            <tr>
              <Th>Field</Th>
              <Th>Filled</Th>
              <Th>Coverage</Th>
            </tr>
          </thead>
          <tbody>
            {coverage.map((c) => (
              <tr key={c.field}>
                <Td>{c.field}</Td>
                <Td>
                  {c.filled.toLocaleString()} / {c.total.toLocaleString()}
                </Td>
                <Td>{c.pct}%</Td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p className={css({ fontSize: "small", color: "fgMuted" })}>
          Convictions-scoped fields are out of {totals.convictions.toLocaleString()};
          defendant-scoped fields are out of {totals.defendants.toLocaleString()}{" "}
          defendant mentions (not unique people — see &ldquo;Defendants and involved persons are
          not deduplicated&rdquo; below).{" "}
          {relatedConvictionPairs.toLocaleString()}{" "}
          pairs of convictions are additionally linked as related incidents (shared arrest,
          mutual charges, group offences) — see any linked record&rsquo;s detail page for the
          specific note explaining the link.
        </p>
      </Section>

      <Section title="&ldquo;Of especial interest&rdquo; picks aren't rare">
        <p>
          The homepage widget of that name pulls a random record flagged{" "}
          <code>of_especial_interest</code>{" "}
          during extraction — the LLM&rsquo;s own judgment call about which cases are unusually
          colourful or notable, made with instructions to reserve the flag for a small minority
          of records. In practice it landed on{" "}
          <strong>
            {especialInterestTotal.toLocaleString()} of {totals.convictions.toLocaleString()}{" "}
            records (about {especialInterestPct}%)
          </strong>{" "}
          — roughly one case in five, not the rare stand-out the instructions asked for. Worth
          knowing before you read too much into a case showing up there: it&rsquo;s a loose
          filter for &ldquo;probably readable,&rdquo; not a curated highlight reel.
        </p>
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
        <p>
          A small number of records also carry an <strong>editorial correction</strong> — shown
          directly on that record&rsquo;s page — for the rarer case where a field was extracted
          against what the source text literally says, because the text was judged to contain an
          error. One example: a record whose stated street (Church Street) is attested nowhere
          else in the archive except in Whitby, while that record&rsquo;s own offence town is
          given as Ruswarp — recorded as Whitby instead, with a note explaining why. This is
          different from the confidence flag above: confidence says &ldquo;this might be
          wrong&rdquo;, a correction note says &ldquo;this was wrong, and here&rsquo;s what
          changed and why&rdquo;. Always transparent, never silent.
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
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "2" })}>
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
          <p className={css({ fontSize: "body", color: "fgMuted", mb: "2" })}>
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
                    fontSize: "body",
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

      <Section title="Offence types follow a curated taxonomy, but new proposals still need review">
        <p>
          Every offence type sits under one of 17 categories in a curated taxonomy (see{" "}
          <Link href="/taxonomy" className={css({ color: "fgAccent" })}>
            Taxonomy
          </Link>{" "}
          for the full category → offence type breakdown) — but the model, and manual data entry,
          can still propose a new offence type if none of the existing ones fit. Those proposals
          start out uncategorised and aren&rsquo;t automatically checked for whether they
          duplicate an existing type under different phrasing (e.g. &ldquo;possession of short
          weights&rdquo; vs. &ldquo;possession of inaccurate weights&rdquo;) until someone
          reviews them and, if needed, adds a merge rule to the taxonomy.
        </p>
        <div>
          <h3 className={css({ fontWeight: "600", mb: "2" })}>
            Offence types awaiting categorisation ({unreviewedOffences.length})
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
            borderRadius: "corner",
            fontSize: "body",
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
      <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>{title}</h2>
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
