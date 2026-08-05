# Website TODO

- **Offence pages + "Offences" section.** A page per type of offence, plus an
  Offences section/nav entry. Needs scoping before building: does "each type
  of offence" mean the 17 taxonomy categories or the 55 leaf offence types?
  What should the Offences section be — a new top-level nav item distinct
  from `/taxonomy`, or a restructuring of `/taxonomy` itself into per-category
  pages (mirroring the `/streets` + `/streets/[id]` list/detail pattern)?
  The homepage intro paragraph (`src/app/page.tsx`) already links to these
  category slugs ahead of the pages existing (broken links until this is
  built) — keep the eventual routes consistent with what's already linked:
  `/offences/poaching-fishing`, `/offences/drink-public-order`,
  `/offences/vagrancy-begging`, `/offences/assault-resisting-authority`.

- Once homepage work is further along: roll the `formatPersonName`
  (SURNAME, Firstname (occupation)) convention out page by page across the
  rest of the site, alongside general polish — Browse, People, Trends, etc.
