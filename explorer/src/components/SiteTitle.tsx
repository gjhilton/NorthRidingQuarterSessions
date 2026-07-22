// Visual counterpart to SITE_TITLE (lib/siteName.ts) -- same title, but with
// "th" rendered as an actual superscript, for contexts that can render JSX
// (nav brand, homepage h1). Contexts that can't (the <title> tag, aria
// labels) should use the plain-text SITE_TITLE string instead.
export function SiteTitle() {
  return (
    <>
      Petty crime in C19<sup>th</sup> Whitby
    </>
  );
}
