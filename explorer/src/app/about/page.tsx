import { css } from "styled-system/css";
import { Card, PageContainer, PageTitle, sectionHeadingStyle } from "@/components/ui";
import { readContent } from "@/lib/content";
import { MarkdownContent } from "@/components/MarkdownContent";

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

      <Section title="Cookies">
        <MarkdownContent>{readContent("about", "cookies")}</MarkdownContent>
      </Section>

      <Section title="Accessibility">
        <MarkdownContent>{readContent("about", "accessibility")}</MarkdownContent>
      </Section>
    </PageContainer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className={css({ display: "flex", flexDirection: "column", gap: "3", scrollMarginTop: "3rem" })}
    >
      <h2 className={css(sectionHeadingStyle)}>{title}</h2>
      <Card className={css({ display: "flex", flexDirection: "column", gap: "4" })}>{children}</Card>
    </section>
  );
}
