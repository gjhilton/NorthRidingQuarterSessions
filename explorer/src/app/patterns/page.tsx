import { css } from "styled-system/css";
import {
  dayOfWeekBreakdown,
  defendantsPerConvictionByCategory,
  gameSpeciesBreakdown,
  seasonalityByCategory,
} from "@/lib/queries/patterns";
import { CategoryBar } from "@/components/charts/CategoryBar";
import { Sparkline } from "@/components/charts/Sparkline";
import { MiniBarRow } from "@/components/charts/MiniBarRow";
import { Card, ChartTitle, EmptyState, PageContainer, PageTitle } from "@/components/ui";

export default function PatternsPage() {
  const seasonality = seasonalityByCategory();
  const dayOfWeek = dayOfWeekBreakdown();
  const groupSize = defendantsPerConvictionByCategory();
  const species = gameSpeciesBreakdown();
  const maxGroupSize = Math.max(...groupSize.map((g) => g.avgDefendants), 1);
  const maxSpecies = Math.max(...species.map((s) => s.count), 1);

  return (
    <PageContainer>
      <PageTitle subtitle="Social-history patterns that only show up when many facets sit side by side, at a glance, rather than one chart at a time">
        Patterns
      </PageTitle>

      <Card>
        <ChartTitle>Seasonality by offence category</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Month of the offence, top categories side by side. The standout: poaching runs 3-4x
          higher September-December than January-May — matching the real English game season
          (partridge opens 1 September, pheasant 1 October) almost exactly, a distinct signature
          from the corpus&rsquo;s general summer peak. Property offences are also seasonal, but
          shaped differently — a sharp July peak (opportunity, harvest season, more goods and
          people about) rather than an autumn one.
        </p>
        {seasonality.length === 0 ? (
          <EmptyState>No dated, categorised convictions yet.</EmptyState>
        ) : (
          <div
            className={css({
              display: "grid",
              gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
              gap: "4",
            })}
          >
            {seasonality.map((s) => (
              <div key={s.category}>
                <div className={css({ display: "flex", justifyContent: "space-between", fontSize: "small", mb: "1" })}>
                  <span>{s.category}</span>
                  <span className={css({ color: "fgMuted" })}>peak: {s.peakMonth}</span>
                </div>
                <Sparkline data={s.months} />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <ChartTitle>Day of the offence</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Weekly rhythms — pay day, market day, the Sabbath.
        </p>
        <CategoryBar data={dayOfWeek} />
      </Card>

      <Card>
        <ChartTitle>Group vs. solo offending</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Average defendants per conviction, by category (categories with fewer than 20
          convictions excluded so a couple of multi-defendant records can&rsquo;t swing the
          ranking). Poaching and property offences run highest — consistent with poaching&rsquo;s
          known history as gang/party activity — while vagrancy and assault are almost always
          solo.
        </p>
        {groupSize.length === 0 ? (
          <EmptyState>No categorised convictions yet.</EmptyState>
        ) : (
          groupSize.map((g) => (
            <MiniBarRow
              key={g.category}
              label={g.category}
              value={g.avgDefendants}
              max={maxGroupSize}
              formattedValue={g.avgDefendants.toFixed(2)}
            />
          ))
        )}
      </Card>

      <Card>
        <ChartTitle>What was poached</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Species named in poaching-type offences. Subsistence game (rabbits/conies, hares)
          outnumbers prestige game (pheasant, partridge) — salmon is the other major target,
          reflecting the coastal setting.
        </p>
        {species.length === 0 ? (
          <EmptyState>No game species recorded yet.</EmptyState>
        ) : (
          species.map((s) => (
            <MiniBarRow key={s.species} label={s.species} value={s.count} max={maxSpecies} />
          ))
        )}
      </Card>

      <Card>
        <ChartTitle>Two checks that didn&rsquo;t confirm a hypothesis</ChartTitle>
        <p className={css({ fontSize: "body", color: "fgMuted", mb: "3" })}>
          Not every test of the data turns up a pattern — a null result is still worth reporting,
          especially when it doubles as a demonstration of why coverage caveats matter.
        </p>
        <div className={css({ display: "flex", flexDirection: "column", gap: "4" })}>
          <p className={css({ fontSize: "body" })}>
            <strong>No clean shift around the Licensing Act 1872</strong>{" "}
            (which tightened pub
            hours). Raw drink &amp; public order counts rise sharply from 1866 to 1874, but that
            turns out to be fully explained by rising extraction volume in those years — checked
            as a share of dated convictions instead of a raw count, drink hovers noisily between
            33% and 53% across 1866-1878 with no visible step change at 1872. A raw-count chart
            alone would have told a false story here.
          </p>
          <p className={css({ fontSize: "body" })}>
            <strong>
              High-repeat defendant names are probably several different people, not one
              prolific offender.
            </strong>{" "}
            Names recurring 3+ times often span many unrelated offence
            categories in a way one person&rsquo;s criminal career rarely would. Given this
            site&rsquo;s defendant records are never deduplicated across cases (see About), a
            common name recurring dozens of times is far more likely several real people sharing
            a name than a single busy individual — a caution about the People pages, not a
            finding about crime.
          </p>
        </div>
      </Card>
    </PageContainer>
  );
}
