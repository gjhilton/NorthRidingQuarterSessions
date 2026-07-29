import { css } from "styled-system/css";
import { Card, PageContainer, PageTitle, sectionHeadingStyle } from "@/components/ui";
import { readContent } from "@/lib/content";
import { MarkdownContent } from "@/components/MarkdownContent";
import { SchemaERD } from "@/components/SchemaERD";
import { SCHEMA_ERD } from "@/content/about/schema-erd";

export default function AboutPage() {
  return (
    <PageContainer>
      <PageTitle>About</PageTitle>

      <Section title="The North Riding Quarter Sessions">
        <MarkdownContent>{readContent("about", "intro")}</MarkdownContent>
      </Section>

      <Section title="How this site is built">
        <MarkdownContent>{readContent("about", "process")}</MarkdownContent>
      </Section>

      <Section title="Database schema" id="database-schema">
        <SchemaERD diagram={SCHEMA_ERD} />
      </Section>

      <Section title="Cookies" id="cookies">
        <MarkdownContent>{readContent("about", "cookies")}</MarkdownContent>
      </Section>

      <Section title="Accessibility" id="accessibility">
        <MarkdownContent>{readContent("about", "accessibility")}</MarkdownContent>
      </Section>
    </PageContainer>
  );
}

function Section({ title, id, children }: { title: string; id?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className={css({ display: "flex", flexDirection: "column", gap: "3", scrollMarginTop: "3rem" })}
    >
      <h2 className={css(sectionHeadingStyle)}>{title}</h2>
      <Card className={css({ display: "flex", flexDirection: "column", gap: "4" })}>{children}</Card>
    </section>
  );
}
