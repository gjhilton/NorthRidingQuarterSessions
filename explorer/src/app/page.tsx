import Link from "next/link";
import { css } from "styled-system/css";
import { Card, PageContainer } from "@/components/ui";
import { CasesSearch } from "@/components/browse/CasesSearch";
import { OnThisDay } from "@/components/OnThisDay";
import { PeopleSearch } from "@/components/people/PeopleSearch";
import { SiteTitle } from "@/components/SiteTitle";
import { siteSubtitle } from "@/lib/siteName";

const findBoxes = [
  {
    href: "/convictions",
    title: "Find convictions",
    description: "Search and browse every extracted Summary Conviction record.",
    linkText: "Browse convictions",
    search: <CasesSearch />,
  },
  {
    href: "/people",
    title: "Find people",
    description: "Look up an offender or involved person and trace their connections.",
    linkText: "Browse people",
    search: <PeopleSearch autoFocus={false} />,
  },
];

export default function Home() {
  return (
    <PageContainer>
      <div>
        <h1 className={css({ fontFamily: "serif", fontSize: "hero", fontWeight: "600", color: "fg" })}>
          <SiteTitle />
        </h1>
        <p className={css({ fontSize: "display", color: "fgMuted", mt: "2" })}>{siteSubtitle()}</p>
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/homepage-placeholder.png"
        alt="Tin Ghaut, Whitby, circa 1890s"
        className={css({ width: "100%", height: "auto", borderRadius: "corner" })}
      />
      <p className={css({ fontSize: "body" })}>
        The Justices of the Peace at Whitby&rsquo;s Quarter Sessions convicted people of
        everyday offences —{" "}
        <Link href="/offences/8">poaching</Link>,{" "}
        <Link href="/offences/1">drunkenness</Link>,{" "}
        <Link href="/offences/5">vagrancy</Link>,{" "}
        <Link href="/offences/2">assault</Link>, and dozens more —
        each case recorded as a short summary in the archive&rsquo;s own catalogue. This site
        makes those Summary Conviction records searchable, browsable, and explorable, drawn
        from{" "}
        <a href="https://archivesunlocked.northyorks.gov.uk" target="_blank" rel="noopener noreferrer">
          North Yorkshire County Record Office&rsquo;s Archives Unlocked catalogue
        </a>
        . Read more about the North Riding Quarter Sessions on the NYCRO blog{" "}
        <a
          href="https://nycroblog.com/2024/11/29/records-of-the-north-riding-quarter-sessions/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>{" "}
        and{" "}
        <a
          href="https://nycroblog.com/2025/05/28/quarter-sessions-bundles/"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>

      <OnThisDay />

      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
          gap: "4",
        })}
      >
        {findBoxes.map((b) => (
          <Card key={b.href} className={css({ height: "100%" })}>
            <h2 className={css({ fontFamily: "serif", fontSize: "heading", fontWeight: "600" })}>
              {b.title}
            </h2>
            <p className={css({ color: "fgMuted", fontSize: "body", mt: "1" })}>{b.description}</p>
            <div className={css({ mt: "3" })}>{b.search}</div>
            <Link
              href={b.href}
              className={css({
                display: "inline-block",
                color: "fgAccent",
                fontSize: "body",
                fontWeight: "600",
                mt: "3",
              })}
            >
              {b.linkText} →
            </Link>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
