// Single source of truth for the site's nav links, shared by Nav.tsx (a
// "use client" component -- importing plain data back out of it into a
// server component like Footer doesn't work) and Footer.tsx.
export const primaryLinks = [
  { href: "/convictions", label: "Convictions" },
  { href: "/people", label: "People" },
  { href: "/locations", label: "Locations" },
];

export const trailingLinks = [{ href: "/about", label: "About" }];
