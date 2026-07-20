import Link from "next/link";
import { css } from "styled-system/css";
import { getTotals } from "@/lib/queries/dashboard";
import { Card, PageContainer, PageTitle } from "@/components/ui";

export default function MethodologyPage() {
  const totals = getTotals();
  const coveragePct = Math.round((totals.convictions / totals.rawCaseTotal) * 100);

  return (
    <PageContainer>
      <PageTitle subtitle="How this dataset was built, and what it can and can't tell you">
        Methodology
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
          <strong>a partial corpus is still a partial corpus.</strong> Any pattern in Dashboard or
          Trends — an offence type rising or falling, a year with more convictions than another —
          may simply reflect which records happen to have been extracted yet, not a real
          historical trend. Treat everything on those two pages as provisional until coverage is
          much closer to complete.
        </p>
      </Section>

      <Section title="What the extraction gets wrong, and how you'd know">
        <p>
          As of the batches processed since this page was added, each record carries the LLM&rsquo;s
          own self-reported confidence (&ldquo;high&rdquo;, &ldquo;medium&rdquo;, or
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
      </Section>

      <Section title="Defendants and involved persons are not deduplicated">
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
          will appear as two. The{" "}
          <Link href="/data-quality" className={css({ color: "fgAccent" })}>
            Data quality
          </Link>{" "}
          page lists repeated names as candidates worth a manual second look, not as confirmed
          matches.
        </p>
      </Section>

      <Section title="Offence categories are partly LLM-invented">
        <p>
          The model is given a seed list of standard offence categories and asked to match
          against it, but may propose a new category if none fit. Those proposed categories
          aren&rsquo;t automatically reviewed for whether they duplicate an existing one under a
          different name (e.g. &ldquo;possession of short weights&rdquo; vs. &ldquo;possession of
          inaccurate weights&rdquo;) — see the unreviewed list on{" "}
          <Link href="/data-quality" className={css({ color: "fgAccent" })}>
            Data quality
          </Link>
          .
        </p>
      </Section>

      <Section title="Search scope">
        <p>
          The search box on{" "}
          <Link href="/browse" className={css({ color: "fgAccent" })}>
            Browse
          </Link>{" "}
          matches against the charge description, reference number, and defendant/involved-person
          names. It does not currently match against offence type, sentencing text, or occupation
          — searching &ldquo;poaching&rdquo; won&rsquo;t find a case classified under that offence
          type unless the word itself appears in the charge description text.
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
      <h2 className={css({ fontFamily: "serif", fontSize: "xl", fontWeight: "600" })}>{title}</h2>
      <Card className={css({ display: "flex", flexDirection: "column", gap: "3" })}>
        {children}
      </Card>
    </section>
  );
}
