import { css } from "styled-system/css";
import { offenceTaxonomyTree } from "@/lib/queries/taxonomy";
import { Card, ChartTitle, PageContainer, PageTitle, Table, Td, Th } from "@/components/ui";

export default function TaxonomyPage() {
  const categories = offenceTaxonomyTree();
  const totalConvictions = categories.reduce((sum, c) => sum + c.total, 0);
  const totalLeaves = categories.reduce((sum, c) => sum + c.leaves.length, 0);

  return (
    <PageContainer>
      <PageTitle subtitle="The offence taxonomy behind every chart on Trends and every filter on Browse">
        Taxonomy
      </PageTitle>

      <Card>
        <p className={css({ fontSize: "body" })}>
          Every conviction&rsquo;s offence type sits under one of{" "}
          <strong>{categories.length} categories</strong>, made up of{" "}
          <strong>{totalLeaves} canonical offence types</strong> covering{" "}
          <strong>{totalConvictions.toLocaleString()}</strong>{" "}
          tagged convictions. Extraction —
          LLM or manual — originally produced 91 near-duplicate free-text strings for these same
          offences (six different names for &ldquo;child not sent to school&rdquo; alone:
          &ldquo;education offence&rdquo;, &ldquo;school attendance offence&rdquo;,
          &ldquo;truancy&rdquo;, and three more). This page reflects the consolidated result —
          see{" "}
          <code>data-loader/qsrecords/offence_types.py</code>&rsquo;s <code>OFFENCE_TAXONOMY</code>{" "}
          for the merge rules themselves.
        </p>
      </Card>

      <Card>
        <ChartTitle>Two caveats worth reading before you rely on a leaf-level count</ChartTitle>
        <ul className={css({ display: "flex", flexDirection: "column", gap: "3", fontSize: "body", pl: "5", listStyleType: "disc" })}>
          <li>
            <strong>
              Category totals are reliable; leaf boundaries between close siblings aren&rsquo;t
              re-audited.
            </strong>{" "}
            Only true duplicate <em>names</em>{" "}
            were merged, not re-classified
            content — e.g. &ldquo;poor law offence&rdquo; is used in the source data as a catch-all
            for cases that arguably belong under its siblings &ldquo;failure to maintain
            family&rdquo; or &ldquo;refusing workhouse labour&rdquo;; splitting it correctly would
            need each record re-read individually. The category (Poor Law &amp; Workhouse) is
            correct regardless.
          </li>
          <li>
            <strong>
              &ldquo;Animal offence&rdquo; and &ldquo;animal damage&rdquo; are deliberately
              unmerged.
            </strong>{" "}
            Their underlying records turned out to be a genuine mix (a dog
            worrying a lamb, a cat killed, a cat tortured) rather than one consistent offence, so
            rather than force them into a possibly-wrong bucket they&rsquo;re left as their own
            small, category-assigned-but-unconsolidated leaves, flagged for future manual review.
          </li>
        </ul>
      </Card>

      {categories.map((category) => (
        <Card key={category.id}>
          <div className={css({ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: "3", flexWrap: "wrap", gap: "2" })}>
            <ChartTitle>{category.name}</ChartTitle>
            <span className={css({ fontSize: "body", color: "fgMuted" })}>
              {category.total.toLocaleString()} conviction{category.total === 1 ? "" : "s"} ·{" "}
              {category.leaves.length} offence type{category.leaves.length === 1 ? "" : "s"}
            </span>
          </div>
          <Table>
            <thead>
              <tr>
                <Th>Offence type</Th>
                <Th>Convictions</Th>
              </tr>
            </thead>
            <tbody>
              {category.leaves.map((leaf) => (
                <tr key={leaf.id}>
                  <Td>{leaf.name}</Td>
                  <Td>{leaf.count.toLocaleString()}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      ))}
    </PageContainer>
  );
}
