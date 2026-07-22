import { css } from "styled-system/css";
import { Card, PageContainer, PageTitle } from "@/components/ui";

export default function AccessibilityPage() {
  return (
    <PageContainer>
      <PageTitle>Accessibility</PageTitle>
      <Card>
        <p className={css({ fontSize: "body" })}>
          This is a small, independently-run project, not a formally
          audited site — there&rsquo;s no certified compliance statement to
          give you. What we can say honestly: pages use semantic HTML,
          interactive elements are keyboard-operable, and search
          suggestions support arrow-key navigation. Some parts of the
          site — particularly maps and network diagrams — are inherently
          visual and don&rsquo;t currently have a non-visual equivalent.
        </p>
        <p className={css({ fontSize: "body", mt: "3" })}>
          If you hit a genuine accessibility barrier using this site,{" "}
          <a
            href="https://github.com/gjhilton/NorthRidingQuarterSessions/issues"
            target="_blank"
            rel="noopener noreferrer"
            className={css({ color: "fgAccent" })}
          >
            please open an issue on GitHub
          </a>{" "}
          — that&rsquo;s the most reliable way to get it looked at.
        </p>
      </Card>
    </PageContainer>
  );
}
