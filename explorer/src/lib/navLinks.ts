// Single source of truth for the site's nav links, shared by Nav.tsx (a
// "use client" component -- importing plain data back out of it into a
// server component like Footer doesn't work) and Footer.tsx.
export const primaryLinks = [
  { href: "/convictions", label: "Convictions" },
  { href: "/people", label: "People" },
];

export const insightsLinks = [
  { href: "/trends", label: "Trends" },
  { href: "/gender", label: "Gender" },
  { href: "/occupations", label: "Occupations" },
  { href: "/patterns", label: "Patterns" },
  { href: "/justice", label: "Justice" },
  { href: "/taxonomy", label: "Taxonomy" },
  { href: "/map", label: "Map" },
  { href: "/streets", label: "Streets" },
];

export const trailingLinks = [{ href: "/about", label: "About" }];
