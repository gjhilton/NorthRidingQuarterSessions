# Same-person-across-convictions candidates

Running list, built incidentally during the per-record full-field audit
(`full-audit-log.md`). NOT acted on now — deliberately deferred until the
per-record correctness pass is complete and the data is clean, per
discussion 2026-07-30. Purpose: a head start for a dedicated
cross-corpus person-matching pass later, not a decision log.

Each entry: name, the summary_conviction ids involved, and the specific
signal that makes it a plausible same-person match (an unusual name, a
recurring specific role/occupation/place combination, etc.) — the
stronger and more specific the signal, the better a candidate for
merging/linking later. Common names with no distinguishing context (e.g.
generic "John Smith" appearances) are NOT logged here — there are too
many of those to be useful signal, and no realistic way to disambiguate
them without more than a name.

## Confirmed same person (resolved with the user, not yet merged in DB)

- **Sovina Short** — person ids 6576 (conviction 252, role: licensee),
  7330 (conviction 1657, role: property owner), 9777 (conviction 5982,
  role: victim/complainant) — a licensee/property-owner in Whitby,
  1868-1870. Rare name, identical spelling three times, confirmed with
  the user to be almost certainly one real person. Not merged in the DB
  yet (deferred), but confidence is high enough to treat as settled
  when the merge pass happens.

## Strong candidates (unusual name or specific recurring role+place)

- **William Hopper, farmer, Goathland, 17 February 1867 — confirmed
  3-person gang assault.** Records 2382 (Charles Brockett), 2385
  (Henry Tindale "otherwise Tindale Harry"), and 2388 (Joseph Baxter
  "otherwise Baxter Joe"), all assaulting the same man the same day.
- **Grosmont town street, Eskdaleside cum Ugglebarnby, 31 October
  1886 — likely 2-record same day.** Records 2381 (Robert Scott) and
  2384 (John Watson), both begging in the same street the same day.
- **Robert Kirby, "sub-distributor of stamps," of Whitby** — recurs as
  informant across many hawker/pedlar-licence convictions throughout the
  corpus (e.g. records 249, 256, 260, 267, and others already passed in
  the audit before this log existed). A named, specific, salaried
  government office in one town — very likely the same real official
  across all instances, unlike a generic name recurrence. NOTE: at least
  one OTHER "Robert Kirby" exists in the corpus in a completely different
  context (record 248, part of a vagrant/pedlar family group with Lucy,
  Mary Ann and Harriett Kirby) — that one is clearly NOT the same person
  and should not be swept in by name alone if this gets automated later.
- **John Morley, constable "of the township of Whitby"** — recurs as
  informant across multiple begging/vagrancy convictions (e.g. records
  136, 140, 239, 247). Same reasoning as Robert Kirby: specific named
  office, not just a common name.
- **William Clark, harbour master** — recurs at records 191 and 197,
  both involving ships refusing to move when directed by the harbour
  master. Specific, singular civic office.
- **Jane Holland** — records 159 (Fylingdales, 1818, weights offence) and
  280 (Robin Hood's Bay in the parish of Fylingdales, 1824, weights
  offence again) — same name, same parish, same offence TYPE, 6 years
  apart. Plausible but weaker signal than the others above (no unusual
  name, no single specific office tying them together) — worth a second
  look during the merge pass rather than treated as settled.

- **Thomas Pritchard, pedlar, of Ruswarp** — record 265 (as husband of
  defendant Mary Pritchard, "of the township of Ruswarp pedlar") and
  record 304 (as the direct defendant himself, "of the township of
  Ruswarp pedlar", SAME offence date 20 June 1889, SAME location — St
  Hilda's Terrace, SAME township — Ruswarp). This is about as strong as
  circumstantial evidence gets without a stated relationship: very likely
  husband and wife arrested together/same night, both drunk and
  disorderly in the same place. Worth prioritising in the merge pass.
- **John Grainger, "one of the constables for the North Riding"** —
  victim in both record 295 (Stephenson, Hebron and Tose) and record 301
  (Joseph Crispin) — identical offence ("assaulting John Grainger... in
  the execution of his duty"), identical date (9 November 1859), identical
  location (Hinderwell). Almost certainly one real assault incident
  prosecuted as two separate convictions against different defendants (a
  group vs. an individual) — the two Grainger person rows are very likely
  the same man.

- **Francis Selby, police constable, of Whitby** — recurs as informant
  at records 314, 320, 326, all within days of each other (14/14/15
  October 1869). Specific named office holder, high confidence.
- **Henry William Siggs, gamekeeper, of Lythe** — recurs across multiple
  records (313, and others reviewed earlier in this session, e.g. 397,
  403, 409). Specific named office, high confidence.
- **Thomas Spink, licensee, of Hinderwell** — recurs at records 298, 310,
  328, all around the same date (10 June 1889) — could plausibly be one
  pub-full of separate drunk-and-disorderly convictions from the same
  night. High confidence.
- **Edward Jameson Ayre, jet worker, of Whitby** — appears at record 1
  (offence 1888) and record 321 (offence 1876, 12 years earlier). Unusual
  three-part name, same occupation, same town — strong candidate for the
  same real person across a plausible working-life span.

- **John Mason, butcher, of Whitby** — victim in both record 337 (Ralph
  Nunn) and record 343 (George Wilson), identical charge wording
  ("assaulting John Mason of the township of Whitby butcher"), same date
  (19 July 1857) — almost certainly one real assault involving two
  attackers, prosecuted as two separate convictions.

- **William Spence, property owner** — records 358 and 382, IDENTICAL
  charge ("maliciously killing five young ducks, the property of William
  Spence"), same date (1 July 1889), two different defendants — almost
  certainly one real incident, two ducks-killers prosecuted separately.
- **George Cholmley esquire, lord of the manor of Fylingdales** — records
  366 and 372, identical charge, identical date (20 December 1847), two
  different defendants, one specific named manor — very likely one
  trespassing incident with two trespassers.
- **Thomas Jackson, "a reputed thief"** — records 349 and 373, ~2 months
  apart (24 July / 11 September 1857), same unusual epithet ("reputed
  thief" in both, "a suspected person" added in 373), same general
  Whitby-harbour-loitering behaviour. Weaker signal than the others above
  (common name), but the recurring specific epithet is more than pure
  coincidence — worth a look in the merge pass.

- **Sarah A. Thompson, Thomas Watson (licensee), and the same Whitby
  witness group — THREE sightings** — record 447 ("Sarah A. Thompson,
  Ralph Speedy, William Nawton, Thomas Watson, Joseph Philpot, Francis
  Harrison", full names), record 466 ("S.A. Thompson, R. Speedy, William
  Nawton, T. Watson, E. Watson, J. Philpot, F. Harrison", initials), and
  record 482 ("S.A. Thompson, R. Speedy, W. Nawton, Ed. Watson, J.
  Philpot, F. Harrison", initials) — all "of the township of Whitby",
  all naming the same licensee Thomas Watson, all 1876. Records 466 and
  482 are almost certainly the SAME incident (identical offence date 11
  November 1876, identical licensed premises, identical charge template,
  two different defendants ejected together). Very strong signal — this
  reads as one recurring group of licensed-premises regulars/witnesses,
  called on repeatedly. UPDATE: records 1971 (Richard Holmes) and 1974
  (William Barrett) are two MORE convictions from the exact same night
  (11 November 1876), same witness group, same licensee Thomas Watson,
  same "refusing to leave when asked by the said Thomas Watson"
  template — brings this to (at least) 6 defendants ejected from the
  same premises the same night: 466, 482, 1971, 1974, 1977 (Robert
  Arnold, soldier), and 1980 (Edward Barrett — possibly related to
  William Barrett in 1974, same surname same night, not stated as kin
  so not assumed). A genuinely large group-ejection incident. Flagging
  one open wrinkle for the merge pass:
  466 has both "T. Watson" (witness) and a separate "E. Watson" (witness)
  alongside licensee "Thomas Watson", while 482 has "Thomas Watson"
  (licensee) plus a separate "Ed. Watson" (witness) — i.e. there appear
  to be TWO different Watsons in this group (the licensee himself, "T."
  or "Thomas", plus a second "E."/"Ed." Watson), not a clean 1:1 across
  all names in all three records — don't assume a single Thomas Watson
  accounts for every "Watson" mention here. RESOLVED by record 1983:
  Richard Holmes, Robert Wilson, Edward Barrett and Robert Arnold (four
  of the same-night defendants) are convicted TOGETHER of assaulting
  "Edward Watson" — confirming Edward Watson is a real, distinct second
  person (not a mis-transcription of Thomas), and that this was one
  real riotous ejection-then-assault incident, not just coincidental
  same-night filings.

- **Thomas Bowron, police constable, of Glaisdale** — records 501 and 509,
  11 days apart (28 Sept / 9 Oct 1869 offence dates), identical name,
  office, and township. Possibly also the (occupation-less) "Thomas
  Bowron" assaulted in record 489, same township, weaker signal since no
  occupation is stated there. High confidence on 501/509; 489 worth a
  second look only.
- **George Holmes, constable "for the North Riding" / "police constable",
  of Whitby** — record 510 (informant, alongside Ryder and Moody) and
  record 514 (victim of assault, alongside informant Thomas Holmes) —
  same office, same town, and the two records themselves are a companion
  pair (see John Jones below) covering one incident. High confidence.
- **John Jones, coal porter, of Whitby — same defendant, two convictions
  from one incident** — records 510 ("drunk and disorderly on the Whitby
  and Guisborough highway") and 514 ("assaulting George Holmes... in the
  execution of his duty"), identical offence date (18 Nov 1876) and
  location (Aislaby). Correctly two separate person rows per the
  no-cross-conviction-merge design (not a bug), but flagging as the
  clearest example yet of the general phenomenon: same real person,
  same night, two separate prosecutions — worth using as a reference
  case when the merge pass designs its linking criteria.

- **Charles Tempest Clarkson, superintendent of police, of Whitby** —
  records 505 and 517, both 1869, unusual three-part name, specific
  senior office. High confidence.
- **Robert Ridley, police constable, of Whitby** — records 465 and 537,
  11 months apart (Oct 1869), same office, same town.

- **Thomas Duck (licensee) and Simpson Harnby (police constable), of
  Whitby** — records 545 and 549, identical offence date (14 December
  1869), identical charge template ("being drunk on the licensed
  premises of Thomas Duck and refusing to leave when asked by Simpson
  Harnby") — same incident, two people ejected together, prosecuted
  separately. High confidence for both names.

- **Francis Calvert, farmer, of Goathland** — records 554 (victim) and
  577 (witness), both 1875, identical description ("of the township of
  Goathland farmer"). Specific enough combination (occupation + township)
  to be a good candidate despite the ordinary name.

- **William Cavallier, cabinet maker, of Whitby** — record 579 (defendant,
  leaving mahogany logs outside his shop in Flowergate) and record 595
  (property owner, his dog was beaten), both 1836, identical name/
  occupation/township. High confidence.
- **William Herbert, butcher** — records 609 and 612, 2 days apart
  (30 Oct / 1 Nov 1875), same name and occupation. Flagging a wrinkle:
  the two records state OPPOSITE home townships for him (Ruswarp in 609,
  Whitby in 612) while the offence-location township is also swapped
  between them (Whitby in 609, Ruswarp in 612) — each record's own text
  was followed faithfully, this isn't an extraction error, but the
  merge pass should look closely at which (if either) home is actually
  correct before linking these.

- **Mary Ann Stonehouse, singlewoman, of Whitby** — record 615 (victim,
  offence 16 Nov 1875) and record 526 (defendant, offence 8 Dec 1876),
  same full name, about a year apart. Reasonable candidate, not as
  strong as a shared specific office but a distinctive enough full name.
- **James Whittle, property owner, of Whitby** — records 495, 622, 625,
  all "stealing apples... the property of James Whittle and growing in
  his garden", same offence date (28 August 1889) across 622/625, three
  separate defendants. High confidence.
- **Thomas Hall, police constable, of Whitby** — records 581 and 624,
  same office, same town.
- **Charles Sams and Mary Sams, of Whitby — a couple, same night** —
  record 631 (Charles, defendant) and record 566 (Mary, defendant,
  Charles named as her husband), identical offence date (15 September
  1889). Almost certainly arrested/convicted separately the same night.
- **Joseph Gatenby, constable for the North Riding, of Whitby** —
  records 564 (informant) and 638 (victim), same office, same town.

- **William Dobson, police sergeant/acting sergeant, Whitby** — recurs
  very frequently (20+ sightings) as informant/arresting officer across
  the corpus, e.g. records 7, 39, 646, 966, 1247, 1882 (now), 2082, 2450,
  2500, 2566, 2766, 3437, 3479, 3525, 3956, 4128, 5698, 5745, 5905 —
  each a separate person row (not yet merged), too numerous to
  individually track further; noting the pattern here rather than
  re-listing every sighting going forward. Distinct from the "assaulted
  by James/Thomas Loftus" incident cluster noted separately below (646,
  652, 664, 670), which is the same recurring Dobson in a victim role.
- **James Loftus, labourer, of Whitby** — records 646 and 664, identical
  name/home/occupation, SAME offence date (27 July 1889), two different
  constables assaulted (William Dobson, William Lee) — reads as one
  continuous resisting-arrest incident charged as two separate assault
  counts. High confidence these are the same real person on the same
  day (correctly two separate person rows per the project's design).
- **William Gibbons, property owner** — records 658, 661, and 667 (3
  sightings now), identical charge ("stealing a quantity of peas... the
  property of William Gibbons and growing in his garden"), same offence
  date (11 July 1889) — one incident, three thieves prosecuted
  separately. High confidence.
- **The Loftus brothers' 27 July 1889 incident** — records 646 (James
  Loftus assaulting William Dobson), 652 (Thomas Loftus assaulting
  William Lee), 664 (James Loftus assaulting William Lee again), and 670
  (Thomas Loftus assaulting John Cook) — all same date, all "of the
  township of Whitby", reads as one riotous incident where (at least)
  two Loftus men each assaulted two different constables. High
  confidence on the incident; James and Thomas are different first
  names so correctly not the same individual.
- **Isaac Hick, jet worker, of Whitby** — record 653 (husband of
  defendant Ellen Hick, no home/occupation stated there) and record 687
  (defendant himself, jet worker, home Whitby). Same name, same town,
  plausible but not retroactively applied to 653 since that record's own
  text states nothing about him. Plus a volatile pair with wife Ellen
  across late December 1874: record 1249 (Isaac assaulting Ellen, 24
  Dec), record 1269 (Ellen drunk and disorderly, also 24 Dec — same
  night as the assault, home/occupation now confirmed Whitby/jet
  worker), and record 1268 (Ellen assaulting constable Robert Needham,
  26 Dec). High confidence this is the same couple recurring across a
  short violent stretch. Five records in three days: 1249 (24 Dec),
  1269 (24 Dec), 1284 (24 Dec, Isaac himself drunk and disorderly), 1268
  (26 Dec), and 1272 (26 Dec, same arrest as 1268 told from the
  drunkenness side). Plus four later sightings: record 1559 (27
  November 1874, Ellen drunk at Robin Hood's Bay), record 1595 (13
  October 1874, Isaac himself drunk in Church Street), record 1601 (21
  October 1874, Ellen again), and record 1666 (19 February 1875, Isaac
  drunk on Joseph Marsay's premises). Plus record 2013 (19 May 1874,
  Ellen drunk and disorderly on Church Street, home/occupation for
  Isaac now confirmed Whitby/jet worker via pattern #6).
- **Miles Moody, inspector of police, Whitby** — records 1144, 1162,
  1269, 1272, and 1601. Fifth sighting; high confidence.
- **John Chapman Walker's elm tree, Ruswarp, 3 November 1887 —
  confirmed 8-person group vandalism.** Records 1596 (William Hall),
  1599 (Frederick Pearson), 1602 (George William Sixton), 1605 (George
  Smith), 1608 (Thomas Hewling), 1611 (Arthur Duck), 1614 (Thomas James
  Tweedy), and 1617 (John Robert Saddler), all damaging the same tree
  the same day — a genuinely large group incident, possibly a riot or
  organized vandalism. Same John Chapman Walker (property owner,
  Ruswarp) recurs as victim in unrelated incidents on other dates:
  record 1899 (21 May 1877, Thomas Walker damaging doors) and record
  5887 (13 September 1881) — a landowner/property owner appearing
  across a decade of separate convictions, high confidence same
  person given the distinctive full name.
- **Sophia Johnson and George Johnson (miner), Whitby, 31 July 1874 —
  confirmed same day, two charges.** Records 1613 (Sophia assaulting
  William Arrundale) and 1616 (Sophia damaging Marshall Pearson's door
  key, with Arrundale again as informant) — same date, same informant,
  one eventful day for this couple.
- **Thomas James Tweedy, Whitby** — record 1130 (assaulting William
  Martin) and record 1614 (elm tree vandalism, one of eight). Same
  name; medium confidence given no occupation to cross-check.
- **Robert Needham, police constable, Whitby** — records 1165, 1268
  (victim), 1269, 1272, 1499, 1655, and 1693 (all informant). High
  confidence.
- **William Tillson, police constable, Lythe** — records 1645 and 1654
  (same incident). Same name/occupation/place; high confidence.
- **Hannah Dawson, licensee, Whitby** — records 1422 and 1496. Same
  name/office/place; high confidence.
- **John Henry Smith and Hannah Smith, the Bridge, Whitby, 12 April
  1888 — confirmed same-day pair.** Records 1270 (John Henry, drunk and
  disorderly) and 1273 (Hannah, his wife, also drunk and disorderly),
  same date and location — husband and wife convicted together.
- **Joseph Scaife, constable of the North Riding, of Whitby** — records
  643 (informant) and 688 (victim), same office, same town. Plus record
  1369 (police constable, Fylingdales, informant) — same name, a
  differently-worded but equivalent office; medium-high confidence.

- **Thomas Vaughan's Newton Mulgrave poaching incident** — records 675,
  705, 717, and 878, all identical landowner, township, date, and time
  (12.15 a.m., 13 June 1875) — four men netting game the same night,
  prosecuted separately.
- **Charles Albert Martindale, police constable, of Whitby** — records
  722, 800, 868 (all informant, unrelated dates) plus a distinct
  group-assault incident on 28 January 1869 where THREE separate
  defendants (records 1083, 1086, 1089) were each convicted of
  assaulting him the same night — 6 sightings total, same office, same
  town.
- **Samuel Harrison, police constable, of Whitby** — records 1066
  (victim), 1084 (informant), 1610 (victim), 1625 (informant), and 1643
  (informant). Five sightings; high confidence.
- **John Jefferson, police constable, Fylingdales** — records 1416 and
  1640 (as victim). Same name/office/place; high confidence.
- **Mary Ann Stonehouse** — records 526 (singlewoman), 615 (singlewoman,
  victim), and 874 (common prostitute) — same full name, same general
  area and era, but the occupation shift on the third sighting (common
  prostitute vs. singlewoman) is worth checking carefully in the merge
  pass rather than assuming all three are the same woman — could be a
  change in her circumstances over time, or could be a different person
  entirely.
- **Thomas Fisher (riveter) and Sarah Ann Fisher, of Whitby** — records
  730 (Thomas, defendant) and 754 (Sarah Ann, defendant, husband Thomas
  named), same offence date (11 May 1889), same street (Henrietta
  Street) — likely the same couple, convicted separately the same
  night.
- **Edward Weeks, constable for the North Riding, of Whitby** — records
  732 (informant) and 756 (victim), same office, same town.
- **John Atkinson, police constable, of Hinderwell** — records 689 and
  764, same office, same town.

- **Thomas Beeforth, landowner** — records 497 (1859, unrelated
  game-trespass) and 772/784/867/876 (all 21 April 1889, identical
  charge, four separate people breaking the same fence) — same
  recurring named landowner.
- **John Atkinson, police constable, of Hinderwell** — now 5 sightings
  (689, 764, 773, 776, 782), all same office, same town, mostly the same
  cluster of Staithes Street drunk-and-disorderly convictions in late
  August 1869.

- **Charles Albert Martindale, police constable, of Whitby** — records
  722 and 800, same office, same town.
- **Mark Boggett, police constable, of Whitby** — records 577 (victim)
  and 807 (informant), same office, same town.
- **William George Baker (jet worker) and Agnes Baker, of Whitby** —
  records 790 and 799, same couple, 3 days apart, both Agnes convicted
  as defendant with William named as husband each time.

- **Elizabeth Hobson and Alice Joyce — mutual affray** — records 853
  (Elizabeth convicted of assaulting Alice) and 856 (Alice convicted of
  assaulting Elizabeth), same offence date (20 April 1889) — a mutual
  fight, each woman prosecuted for assaulting the other.
- **Patrick Joyce, bricklayer, of Whitby** — records 733 and 856
  (husband of Alice Joyce), same occupation, same town.
- **Thomas Gaines, fisherman, of Whitby** — now 4 sightings (532, 542,
  624, 860), same occupation, same town.
- **Edward Jameson Ayre, jet worker, of Whitby** — now 3 sightings (1,
  321, 861).
- **Warner Coleman (cattle dealer, Darlington) and William Bradley —
  mutual affray** — records 769 (Bradley convicted of assaulting
  Coleman) and 864 (Coleman convicted of assaulting Bradley), same
  offence date (13 April 1889), same location (Eskdaleside cum
  Ugglebarnby) — a mutual fight, each man prosecuted for assaulting the
  other.

- **William Cruddas, constable for the North Riding** — records 897,
  900, 903, three different defendants all "assaulting William
  Cruddas... in the execution of his duty", identical date (16 June
  1888) and township (Glaisdale) — likely one arrest/resistance
  incident involving multiple people.
- **George Hewison, police constable, of Whitby** — records 822 and
  899, same office, same town.
- **Cuthbert Wray** — recurs as "fruit hawker" (record 465, husband of
  Mary Wray) and "fruiterer" (record 905, witness) — same likely person,
  different wording kept faithfully in each record rather than
  harmonized.

- **George Jackson, of Barnby, and his son Joseph** — records 3560,
  3952, and 5407, all "not sending his son Joseph Jackson to school,"
  same father-son pair, three separate prosecutions (correctly three
  separate George Jackson person rows per the no-merge policy). Found
  while resolving the "township of Barnby" open question.

- **Thomas Atkinson, innkeeper, of Whitby** — records 928 and 934, 2
  days apart (25 & 27 April 1869), same occupation, two separate
  licensed-premises-related offences. High confidence.

- **James Cliff, landowner** — records 955 and 958, same date (26 April
  1869), two different defendants damaging his property (a tree and a
  fence) — one incident, prosecuted as two separate charges.
- **George Eli North, police constable, of Fylingdales** — records 828,
  939, 962, 1195, and 1884, same office, same town. Fifth sighting;
  high confidence. NOTE: records 2156 (25 July 1874) and 2260 (5
  August 1874, 11 days later) both have a "George Eli North, police
  constable" stated as being "of the township of Whitby" instead —
  same unusual full name, two records now, but a different home
  township than every Fylingdales sighting. Not assumed to be the
  same person as the Fylingdales one; reads as plausibly a second,
  genuinely distinct George Eli North (or a same-source transcription
  habit) given it now recurs twice with the same "Whitby" home.
  Flagged for the merge pass to resolve either way.
- **Harriet Hicks, singlewoman, of Whitby** — records 860 and 953, same
  status/town, recurs alongside Dorothy Gaines both times.

- **Andrew Harland, licensed victualler/publican, Whitby** — records
  327, 1002, 1017, 1094, 1333, and now 1882 (drunk-on-premises informant
  role). Sixth sighting; high confidence recurring licensee.
- **Andrew Harland (licensed victualler) and John Brand — same
  incident** — records 1002 (Harland convicted of selling beer to a
  drunk person) and 1017 (Brand convicted of being drunk on Harland's
  licensed premises), same date (21 July 1888) — reads as the same
  incident from both sides.

- **Robert Martin, shop porter, of Whitby — three assaults, one day** —
  records 1020, 1023, 1026, all 22 July 1888, three different victims
  (Jane Cooper, Eliza Jane Hutton, Mary Ann Hutton) — same real
  defendant, correctly three separate person rows.

- **James Wilkinson, police constable, of Whitby** — records 886
  (victim) and 1039 (informant), same office, same town.

- **Peter Kilpatrick, iron worker, of Whitby** — records 929, 1038,
  1040, 1041, 1093 — 5 sightings across 1875 and 1888, same occupation,
  same town.

- **Robert Steel (fisherman) and William Massey (licensee), of Whitby —
  same night** — records 1050 (Steel convicted of damaging Massey's
  glasses/table) and 1053 (Steel convicted of being drunk on Massey's
  premises and refusing to leave), same date (28 July 1888) — reads as
  one continuous incident.

- **William Robinson's hay, Ruswarp — 5 defendants, one night** —
  records 1056, 1061, 1064, 1067, 1070, all "wilfully damaging hay, the
  property of William Robinson," identical date (29 July 1888) — one
  incident, five separate people prosecuted.

- **Robert Burnett's fence, Ruswarp** — records 1073 and 1076, both
  "maliciously breaking a fence, the property of Robert Burnett," same
  date (29 July 1888) — same incident as the William Robinson hay spree
  above, possibly the same broader night of trouble in the area, but
  kept as its own entry (different property owner).

- **Charles Mason, blacksmith, of Whitby — same incident** — records
  1034 (assaulting constable Thomas Hall) and 1105 (damaging North
  Riding Constabulary property), identical offence date (19 May 1875) —
  almost certainly the same scuffle, two separate charges.

- **Joseph Marsay, of Whitby** — record 1057 (defendant, mariner), 1114
  and 1186 (licensee, 11 May 1875 incident), 1117 (licensed victualler,
  same incident), and now 1460 (licensee, 13 October 1874, earlier than
  the others) — same name recurring as the licensed-premises owner
  across multiple dates, plausibly the same person with two trades
  (mariner/licensee), not confirmed.
- **"Bailiff" Appleton, of Whitby** — records 351 (licensee), 1113 (cab
  driver, assaulting Robert Barrick), and 1524 (cab driver, drunk in
  charge of a carriage) — third sighting matches 1113's occupation
  exactly (cab driver). High confidence.
- **Joseph Marsay's licensed premises, Whitby, 31 March 1875 — confirmed
  same incident, not just same person.** Record 1114 (William Weatherill
  convicted of being drunk on Marsay's premises) and record 1117 (Marsay
  himself convicted of allowing drunkenness on those premises) share the
  same offence_date and the same premises — this is one real-world event
  producing two convictions. Also ties back to record 1057's Joseph
  Marsay (mariner there) as a third sighting of the same recurring name,
  now with "licensed victualler" confirmed as his real trade in 1117.

- **John Nicholson, police constable, Whitby** — records 1117, 1120,
  1144, 1171, 1180, 1186, 1198, 1207, 1440, 1478, 1493, 1496, 1511,
  1562, 1571, 1583, 1592, 1607, 1628, 1646, 1666, 1669, and 1678.
  Twenty-three sightings of the same name/occupation/place. High
  confidence.
- **John Norman, police constable, Whitby** — records 1355 and 1624.
  Same name/occupation/place; high confidence.
- **A disorderly day in Whitby, 17 October 1874 — three separate
  assaults on constables.** Records 1478 (Thomas Lynch assaulting John
  Nicholson), 1583 (Patrick Joyce assaulting George Richard Lazenby),
  and 1592 (Thomas Smith, also assaulting Nicholson). Three unrelated
  defendants, two officers, one day — reads like genuine local unrest
  rather than coincidence; logged for awareness, not a person-merge
  candidate.
  Possibly also record 1260 (4 January 1875, as an assault victim,
  "constable for the North Riding", no home stated) — predates
  all the other sightings and worded slightly differently, so logged as
  a weaker addition rather than folded into the main count.
- **Thomas Hall, police constable, Whitby** — records 1171, 1180, 1186,
  1207, 1308, and now 1341. Sixth sighting, usually alongside
  Nicholson as a fellow informant. High confidence.
- **Joseph Gatenby, police constable, Whitby** — records 1155, 1158,
  1161 (all informant, same 8 March 1869 incident), 1209 (victim), and
  1459 (informant). Fifth sighting of the same name/occupation/place.
  High
  confidence.
- **John Backhouse, jet worker, Whitby** — the existing same-day pair
  (1184/1187, 1888) plus now record 1207 (1875, obstructing Henrietta
  Street), 13 years earlier. Plausibly the same man across a long
  working life; logged as a separate, weaker candidate given the gap.
- **Robert Jefferson's licensed premises, Whitby, 11 May 1875 —
  confirmed same incident, three convictions.** Record 1171 (George
  Webster, drunk on the premises), record 1180 (Jefferson himself,
  allowing it), and record 1186 (Matthew Tose, also drunk on the
  premises) — same date, same premises, same two informants (Thomas
  Hall and John Nicholson) throughout.
- **Robert Jefferson, licensed victualler, Whitby — recurs 12 times**
  across the corpus in the licensee role (records 1171, 1180, 1186,
  1908, 1950, 2456, 2628, 2634, 2646, 3707, 3829, 3909). High
  confidence single recurring licensee; not individually re-tracked
  further given the volume.
- **John Backhouse, jet worker, Whitby** — record 1184 (drunk and
  disorderly at the Bridge) and record 1187 (assaulting William
  Barrett), both dated 11 September 1888. Near-certainly the same man,
  two separate offences the same day. High confidence.
- **Richard Lyth, Whitby** — record 1167 (jet worker, 1869) and record
  1181 (labourer, 1888), 19 years apart with a different stated
  occupation. Weak/plausible candidate only (same man later in life is
  possible but not confident) — flagged for completeness, not a strong
  match.
- **George Richard Lazenby, police constable, Whitby** — records 1138,
  1141, 1174, 1380, 1460, 1583, 1595, 1672, 1678, and 2269. Tenth
  sighting; high confidence.
- **Joseph Marsay's licensed premises, Whitby, 31 March 1875 — possible
  fourth member.** Record 1675 (William Dixon) has the same date and
  premises as the confirmed 3-person group at 1114/1180/1186, but a
  different informant (Edward Weeks); weaker link than the confirmed
  trio.
- **Ann Thompson, Whitby** — record 1117 (widow, witness), record 1126
  (licensee, only 9 ids apart), record 1505, and record 1571 (both
  licensee). Four sightings; medium-high confidence, given the widow/
  licensee role plausibly reflects one woman running a licensed
  premises.

- **William Martin, Whitby** — record 1118 (defendant, jet worker,
  drunk on Eleanor Miller's premises, 18 August 1888) and record 1130
  (victim of assault, 25 August 1888), only 7 days and 12 conviction ids
  apart. High confidence.

- **William Sedman, water bailiff, Ruswarp** — records 1136 and 1139,
  both convicted of illegally catching salmon at Ruswarp, 4 days and 3
  conviction ids apart. Same name/occupation/home/offence-type;
  near-certain match.

- **Holmes, jet worker(s), Whitby, drunk on the Whitby and Hawsker
  highway, 5 August 1888** — record 1148 (John Holmes) and record 1151
  (Thomas Holmes), same date, same highway, same offence, 3 conviction
  ids apart. Same surname, different first names — likely a joint
  incident (two men convicted separately) or possibly kin, not
  necessarily the same individual; flagged for the merge pass to
  consider as a linked-incident pair rather than a straightforward
  same-person match.

- **Louisa Watson, Hannah Wallace, and Mary Jane Wallace, New Way Ghaut,
  Whitby, 8 March 1869 — confirmed same incident.** Records 1155, 1158,
  and 1161: identical date, location, offence (drunk and riotous), and
  informant (Joseph Gatenby, police constable) — three women arrested
  together, convicted in separate records. Hannah and Mary Jane share
  the surname Wallace — possibly related, not confirmed.
- **Jonathan Harrison's licensed premises, Whitby, 24 April 1875 —
  confirmed same incident.** Record 1144 (Richard Purvis convicted of
  being drunk on Harrison's premises) and record 1162 (Harrison himself
  convicted of allowing the drunkenness) — same date, same premises,
  same informant Miles Moody.

- **Dowsland, sergeant of police, Hinderwell** — records 1192 and 1201,
  both dated 24 May 1875, both Runswick Lane, Hinderwell. Same
  same-day-two-arrests shape as the Watson/Wallace and Purvis/Harrison
  incidents above — confirmed same incident (John Blenkey and William
  Pattison both drunk in Runswick Lane that day).
- **John Ryder, police officer, Whitby** — records 1197, 1221, 1277,
  1358, 1394, 1403, 1451, 1579, and 1609 (all "inspector of police",
  1868); records 1284, 1204, 1368, 1562, 1580, 1708, and 1723 (all
  "superintendent of police", 1874-77; 1708 also adds "inspector of
  weights and measures for the division of Whitby Strand"). Plausibly
  the same officer promoted sometime between 1868 and December 1874;
  medium-high confidence given nine consistent 1868 sightings and seven
  consistent post-promotion ones.
- **Joseph Green, miner, Eskdaleside-cum-Ugglebarnby** — record 1216 (15
  May 1875) and record 1281 (26 December 1874, trespassing in pursuit
  of conies with Joseph Lowther). Same name/occupation/home; medium
  confidence.
- **Frank Walker, Whitby** — record 1123 (assault victim, no occupation
  stated) and record 1204 (surveyor, informant). Plausibly the same
  man; weak-medium confidence given no occupation to cross-check at
  1123.

- **James Gibson, police constable, Glaisdale** — records 1189, 1210,
  1219, and 1305. Four sightings; high confidence.
- **George Wilson and Joseph Morrison, both of Danby End, Glaisdale
  town street, 27 May 1875 — confirmed same incident.** Records 1210
  and 1219: identical date, location, offence, informant (James
  Gibson), and even the same home hamlet (Danby End) — two men arrested
  together.
- **William Barrett, Whitby** — record 1187 (assault victim, 11
  September 1888) and record 1217 (young person employed in an iron
  foundry, Ruswarp, 31 August 1888), 11 days apart. Plausibly the same
  person; medium confidence.

- **John Elwood Ryder, Whitby-area victim of adulterated-food sales** —
  record 1145 (sub-standard milk, 8 August 1888) and record 1229
  (sub-standard lard, 30 August 1888), 22 days apart, different sellers.
  Same full name; high confidence.

- **Robert Ward's licensed premises, Whitby, 25 September 1888 —
  confirmed same incident.** Records 1232 (Joseph Storr) and 1235
  (Matthew Beal), both drunk on Ward's premises the same night.

- **Charles Aaron Blakeston / Charles Aaron Blackstone, jet worker,
  Whitby** — record 1245 ("Blakeston") vs records 1142/1188
  ("Blackstone"). Identical distinctive first+middle name, same
  township/occupation; plausibly a surname-spelling variant of the same
  real person. Flagged for the merge pass to reconcile the spelling.
- **Charles Tempest Clarkson, superintendent of police, Whitby** —
  records 1131 and 1248. Same full name/office; high confidence.
- **Edward Raw, labourer, Whitby, 24 March 1888 — confirmed same-day
  spree, three convictions.** Record 1244 (drunk and disorderly), 1247
  (assaulting constable William Dobson), and 1250 (assaulting constable
  John Johnson) — same man resisting arrest across three separate
  convictions the same day.

- **Thomas Archer, Whitby police** — record 1174 (inspector of police),
  record 1251 (police constable), and record 1684 (inspector of
  police, matching 1174). Third sighting; the 1251 rank mismatch is now
  outweighed by two consistent "inspector" sightings.

- **William Ruehorn, Whitby** — record 1256 (truancy re: his son, 6
  April 1888) and record 1264 (jet worker, drunk and disorderly, 7
  April 1888), one day apart. Plausibly the same man; medium-high
  confidence.

- **Thomas Stamper Dale, police constable, Hinderwell** — records 1274,
  1286/1289 (same incident), 1495/1501, and 1686. Fourth sighting; high
  confidence. Also record 1504's "[blank] Dale" (same highway
  livestock-straying offence type) — near-certainly the same officer,
  first name blanked this time.
- **John Watson, landowner, Egton area** — records 1350 and 1687. Same
  name/place/role (land targeted by conies-poaching trespass); medium
  confidence.
- **Thomas Jefferson and Thomas Stamper Dale, Hinderwell, 6 June 1868 —
  confirmed same incident.** Records 1286 (Jefferson drunk and riotous,
  refusing to leave) and 1289 (Jefferson assaulting Dale) — same date,
  same two people, an escalating single encounter.
- **Edward Ruehorn, jet worker, Whitby** — records 1121, 1288, and now
  1375. Third sighting; medium-high confidence.
- **Miriam Featherstone, Whitby — assaulted three times over two
  days.** Record 1353 (Mary Burns, 22 February 1875), record 1663
  (Jane Peart, also 22 February — a second, separate assault the same
  day, confirmed not a duplicate of 1371), and record 1371 (Jane Peart
  again, 23 February 1875). Same victim, Jane Peart assaulting her on
  both days — looks like a real feud, not confirmed as merge-worthy but
  a strong pattern.

- **New Gardens footpath pitch-and-toss group, Hawsker cum Stainsacre,
  22 April 1888 — confirmed 7-person same incident.** Records
  1291/1294/1297 (fixed a duplicate-location split to reveal this) plus
  1300/1303/1306/1309 — Richard Hobson, Anderson Hobson, Joseph Hart,
  James Pearson, Alfred George Walker, John Storm, Frederick Hutchinson,
  all playing pitch and toss on the same footpath the same day.
- **Charles Tempest Clarkson, Whitby** — records 1131 and 1248 (both
  superintendent of police), 1292 (property owner, trousers damaged),
  1418 (assault victim), 1862 (informant), and now 1883 (informant).
  Sixth sighting; high confidence it's the same recurring figure. Note:
  this name recurs dozens of times across the full corpus as the
  standing Whitby police superintendent informant on drunk/disorderly
  convictions — each is a genuinely separate person row (not yet
  merged), too numerous to individually list here going forward.
- **William Pattison, jet worker, Whitby, 21 June 1868 — same-day
  pair.** Record 1292 (trousers damaged) and record 1295 (drunk), same
  defendant, same date.

- **John Brough, beer house keeper, Whitby** — records 1251, 1298, and
  1394. Third sighting; high confidence.
- **William Lynch and Margaret Jane Lynch, Whitby, 15 August 1868** —
  records 1391 and 1388, same date, similar MO (frequenting a public
  place with intent to steal/commit a felony). Plausibly related;
  medium confidence.

- **Richard Bell, police constable, Whitby** — records 1298, 1313, 1322,
  and 1364 (as an assault victim). Fourth sighting; high confidence.
- **Thomas Ward and Patrick Riley, Bridge Street, Whitby, 4 February
  1875 — confirmed same incident.** Records 1302 and 1311, both pedlars
  causing an obstruction, same date and location.

- **John Stangoe, farmer, Lythe** — record 1178 (12 September 1888) and
  record 1330 (2 May 1888, 4 months earlier). Same name/occupation/
  home; high confidence.

- **James Smith and Thomas Martin, Hanover Terrace, Ruswarp, 14 May
  1888 — confirmed same incident.** Records 1336 and 1339, both begging
  in the same place the same day.

- **Susan Backhouse, Whitby** — record 1224 (fish hawker, 10 November
  1868) and record 1344 (widow, 11 February 1875). Same name, different
  stated occupation across records — same pattern as the existing Mary
  Ann Stonehouse entry; flagged for the merge pass rather than assumed.

- **William Hammond, police constable, Hinderwell** — records 1201,
  1347, 1619, 1660, 1696, 1711, 1789, 1965, 2129, 2183 (as assault
  victim), 2249 (witness), and 2284. Twelfth sighting; high
  confidence.
- **Alfred Barker, sergeant of police, Hinderwell** — records 1293,
  1619, 2249, and 2266. Fourth sighting; high confidence.
- **Scarborough men, Whitby and Stainsacre highway, 24 January 1887 —
  likely 3-person same incident.** Records 2181 (Frederick Hubbard,
  fisherman), 2184 (John William Masham, fisherman), and 2187 (George
  Bowering, fish curer), all "of Scarborough," all begging on the same
  highway the same day.
- **William Ward, fruiterer, Whitby — recurs across a 3-year span.**
  Records 1916/1919 (24 August 1867, assault victim) and now 2185 (13
  December 1864, defendant, assaulting Josephine Wray) — same
  name/occupation/town, earlier by 3 years; not merged, flagged.
- **William Clark, licensee, Whitby, 14 September 1887 — confirmed
  2-person same incident.** Records 1960 (Edwin Renwick) and 1963
  (Robert Garbutt), both drunk on the same licensed premises the same
  day.
- **Margaret Ann Hansill, wife of William George Hansill (jet worker),
  Whitby, 25 July 1887 — confirmed same-day spree.** Records 1787
  (drunk and disorderly on the Pier) and 1790 (assaulting Herbert
  Storey), same defendant, same date. Now also record 1996 (19 March
  1887, Church Street) and 2038 (5 April 1887, Church Street again) —
  a fourth sighting of this couple, plus this is
  the SAME couple as "William George Hansell/Margaret Ann Hansell"
  logged separately below (records 1933/1936/1939/1990) — "Hansill"
  vs "Hansell" is a spelling variant of the same surname, same first
  names/occupation/town, almost certainly one family; flagged for the
  merge pass rather than assumed.
- **Alfred Barker, sergeant of police, Hinderwell** — records 1293 and
  1619. Same name/occupation/place; high confidence.
- **Peter Kelly and George Johnson, Thomas Smith, Whitby, 26 December
  1867 — confirmed same incident.** Records 1621 and 1618, two
  different defendants assaulting the same earthenware dealer the same
  day.

- **Mary Elizabeth Grant and Frances Heselwood, Boulby Bank, Whitby, 5
  August 1868 — confirmed same incident.** Records 1352 and 1355, both
  using obscene and indecent language in the same place the same day.

- **Charles Mark Palmer's land, Hinderwell, 14 February 1875 —
  confirmed 3-person group poaching incident.** Records 1350 (John
  Gray), 1362 (John Deacon), and 1365 (William Duck Brewster), all
  trespassing in pursuit of conies on the same land the same day.

- **William Watson, Whitby** — record 1168 ("labourer", wife Ellen using
  obscene language) and record 1382 ("mariner", wife Ellen assaulting
  Winifred Joyce). Same couple, occupation stated differently across
  records — flagged for the merge pass to reconcile.
- **Philip Joyce and Winifred/Winnifred Joyce, Whitby** — record 1329
  (27 June 1874) and record 1382 (14 August 1868, 6 years earlier).
  Same couple recurring; high confidence.

- **John Liddle, cartman, Whitby** — record 1206 (1868) and record 1386
  (1875). Same name/occupation/place; medium-high confidence.
- **John Backhouse, Whitby** — the existing candidate (jet worker,
  records 1184/1187/1207) plus record 1390 ("fisherman", 5 June 1888,
  close in date to the 1888 pair). Occupation mismatch weakens
  confidence; logged as a separate, weaker addition.

- **George McLaughlan/McLaughlin, scissor grinder, Whitby, Robert
  Ward's licensed premises** — records 1333 and 1396, about a month
  apart, surname spelled slightly differently. High confidence.
- **John Hodgson, fisherman, Whitby** — records 1317 and 1397, 6.5
  years apart. Same name/occupation/place; medium confidence given the
  gap.
- **William Pickering, police constable, Eskdaleside** — records 1257,
  1400, 1421, and 1800. Fourth sighting; high confidence.
- **William Mead and Richard Bell, "[blank] Botham"'s land, Hutton
  Mulgrave, 31 May 1867 — confirmed same-day group poaching.** Records
  1797 and 1794, two men using sheep dogs to kill hares on the same
  land the same day.
- **Henry Douglas, carpenter, Whitby, drunk and disorderly on the Pier**
  — records 1796 (26 July 1887) and 1799 (28 July 1887), two days
  apart. Same defendant/offence/location; high confidence.

- **George Webster, jet worker, Whitby** — record 1171 (11 May 1875,
  drunk on Robert Jefferson's premises) and record 1404 (8 October
  1874, Baxtergate). Same name/occupation/home; high confidence.

- **George Carr and George Brown, road leading from Thorpe to Robin
  Hood's Bay, Fylingdales, 15 October 1874 — confirmed same incident.**
  Records 1410 and 1413, same date and location, one begging and one
  wandering.

- **David Robinson and John Mason, Upgang Lane, Ruswarp, 15 June 1888 —
  confirmed same incident.** Records 1411 and 1414, both lodging in the
  open air, same date and location.

- **William Adamson and George Gibbons, William McClauchlin, Hinderwell,
  16 December 1887 — confirmed same incident.** Records 1417 and 1420,
  two different defendants assaulting the same victim the same day.
- **Edward Francis and Samuel Williams, Whitby and Robin Hood's Bay
  highway, Fylingdales, 15 September 1874 — likely same incident.**
  Records 1989 and 2034, same date, same road, both begging.

- **Joseph Bridges, fisherman, Whitby** — records 1393 and 1423, about
  6 months apart. Same name/occupation/home; high confidence.

- **William Featherstone, sailor, Whitby** — records 1353, 1428, 1460,
  and 1656 (truancy re: daughter Amelia, no occupation stated). Fourth
  sighting; high confidence.
- **Henry Sewell and Mary Sewell, Cleveland Terrace, Ruswarp, 27 August
  1868 — confirmed same incident.** Records 1424 and 1427, husband and
  wife both begging in the same place the same day.

- **George Welford, Hinderwell, 18 December 1887 — confirmed 6-person
  group assault.** Records 1429 (George Codling), 1432 (Thomas Taylor),
  1435 (John Brown), 1438 (Ernest Dunn), 1441 (Matthew Pearson), and
  1444 (Albert Dunn), all assaulting the same victim the same day —
  reads like a riot rather than an ordinary assault.
- **Mary Elizabeth Grant, Whitby** — records 1352 and 1436, 24 days
  apart, both common-prostitute/indecent-behaviour convictions. Same
  name/occupation; high confidence.

- **William Ward, 3 October 1874 — confirmed same underlying incident,
  two charges.** Record 1425 (assaulting James Beattie) and record 1446
  (maliciously damaging George Frank's pears), same date, same set of
  witnesses (Beattie, H.M. Frank, Robert Carr) — one altercation
  producing two separate convictions.

- **John Noble, jet worker, Whitby** — records 1449 and 1452, 13 days
  apart. Same name/occupation/home; high confidence.
- **Mary Jane Wallace, Whitby** — record 1161 (singlewoman, New Way
  Ghaut, 8 March 1869) and record 1454 (common prostitute, Grape Lane,
  5 September 1868, 6 months earlier). Same name, different stated
  status — weaker candidate.

- **Ann Miller and Henry Miller (labourer), Whitby — eight sightings.**
  Records 1168, 1221, 1304, 1331, 1465, 1469, 1472, and 1535, all Ann
  convicted for drunkenness/obscene language with Henry named as her
  husband, consistently "labourer" of Whitby throughout. Very high
  confidence this is one recurring couple.

- **John McCloin/McGloin, common lodging house keeper, Whitby** —
  records 1271 ("McCloin") and 1486 ("McGloin"). Same
  occupation/place, surname spelled slightly differently; high
  confidence.

- **Feaster Stubbs's licensed premises, Fylingdales, 28 February 1888 —
  confirmed same incident.** Record 1503 (Marshall Bedlington drunk on
  Stubbs's premises) and record 1506 (Stubbs himself, selling beer to a
  drunken person).

- **Alexander Lewis, master mariner, Whitby, 3 March 1888 — same-day
  spree.** Record 1515 (drunk and disorderly in Hudson Street) and
  record 1518 (damaging George Thomas Crowther's windows), same
  defendant, same date, offence at Ruswarp both times.
- **George Blooman and William Gallilee, North Terrace, Ruswarp, 30
  October 1874 — confirmed same incident.** Records 1466 and 1517,
  both throwing a firework (a cracker) in the same place the same day.

- **Robert Burnett, John Burnett, and George Burnett, James Richardson,
  Ruswarp, 2 April 1868 — confirmed same incident.** Records 1540,
  1543, and 1546 — three Burnetts (plausibly a family) assaulting the
  same farm servant the same day.
- **Thomas Batty, Whitby** — record 1261 (seaman) and record 1542
  (retired mariner). Same name, plausibly the same man later in life;
  medium confidence.

- **Robert Arndale and Thomas Sedman, James Fowler, Ruswarp, 21
  November 1874 — confirmed same incident.** Records 1556 and 1568, two
  defendants assaulting the same victim the same day, with identical
  witnesses (Fowler himself and Moses Brown).
- **William Verrill and Henry Verrill, Staithes/Hinderwell, 10 October
  1887** — records 1560 (daughter Dinah) and 1566 (daughter Martha
  Ann), same surname, same truancy date — plausibly related family;
  medium confidence.

- **All Saints' Church, Hawsker cum Stainsacre, 6 November 1887 —
  confirmed 3-person same incident.** Records 1629 (William Agar), 1632
  (Christopher Parker Peacock), and 1635 (David John Barnett), all
  indecent behaviour during divine service the same day.

- **George Wake, Robert Pearson, and John Sanderson, Hinderwell Street,
  27 September 1867 — confirmed same-day trio.** Records 1716, 1713,
  and 1728, three men driving carts/waggons furiously on the same
  street the same date.
- **Ruswarp garden-vandalism spree, 16 July 1887 — the same trio (Thomas
  Siddle, Isaac Carlton, Robert Robinson) hit two different gardens.**
  At George Fawcett's: records 1724/1733 (Siddle, door then onions),
  1727/1736 (Carlton, door then onions), 1730/1739 (Robinson, door then
  onions). At Joseph Readman's: records 1742 (Siddle, door), 1745
  (Carlton, door), 1748 (Robinson, door), 1751 (Siddle, cherries), 1754
  (Carlton, cherries), and 1757 (Robinson, cherries). At Isaac Stamp's:
  records 1760 (Siddle, strawberries) and 1763 (Carlton, strawberries),
  likely more to follow. At least fourteen convictions from one day's
  spree across three properties so far.
- **John Joyce and Anthony Joyce, John Grier, Whitby, 15 November 1867
  — confirmed same incident.** Records 1749 and 1752, likely two
  brothers assaulting the same man.

- **James Calvert and Michael Calvert, Goldsborough highway, Lythe, 29
  November 1867 — confirmed same incident.** Records 1764 and 1767,
  mirror-image convictions of the same fight between the two men.

- **Robert Steel, fisherman, Whitby, July 1887 — same-week spree.**
  Record 1772 (refusing to leave Thomas Wadsworth's premises, 23 July),
  record 1775 (assaulting Wadsworth, also 23 July), and record 1778
  (drunk on the Pier, 25 July) — three convictions in three days.
- **William Pearson, landowner, Roxby area** — records 1726 and 1780.
  Same name/role; medium confidence.

- **John Alderson Wallace, police constable** — records 1795 (assault
  victim, Whitby), 1801 (informant, Whitby), 1807 (assault victim,
  Whitby), 1858 (informant, home given as Ruswarp), 1932 (informant,
  no home stated), and 1941 (informant, home Ruswarp again). Same full
  name/office throughout; high confidence despite the one differing
  home.
- **Samuel Winterburn and Francis Schofield, Eskdaleside, 27 July 1867
  — confirmed same incident.** Records 1857 and 1859, both drunk and
  riotous in a public thoroughfare the same day.

- **Robert Dixon and Thomas Dixon, John Alderson Wallace, Whitby, 31
  March 1877 — confirmed same incident.** Records 1807 and 1795, two
  Dixons (plausibly related) assaulting the same constable the same
  day.

- **Thomas Howard, labourer, Whitby** — record 1721 (truancy re: daughter
  Caroline) and record 1811 (wife Mary Howard's husband). Same
  name/place; medium confidence.

- **James Barker's licensed premises, Whitby, 6 August 1887 — confirmed
  4-person same incident.** Records 1817 (Joseph Storr), 1820 (Edwin
  Renwick), 1823 (Thomas Joyce), and 1826 (Francis Fewster), all drunk
  and refusing to leave the same premises the same day.
- **Mary Howden and Catherine Johnson, George Street, Ruswarp, 5 July
  1867 — confirmed same incident.** Records 1827 and 1818, both
  begging in the same place the same day.

- **Joseph Verrill's garden, Hinderwell, 7 August 1887 — confirmed
  same incident.** Records 1835 (Isaac Harrison Crispin) and 1838
  (Richard Dix), both stealing apples from the same garden the same
  day.

- **William Nicholson, police constable, Whitby** — records 1840 and
  1843. Same name/occupation/place; high confidence. Distinct from the
  much more prolific John Nicholson candidate above.
- **John McCloin/McGloin/McGloine, common lodging house keeper, Whitby**
  — records 1271, 1486, and 1845. Third sighting/spelling variant;
  high confidence.

- **Robert Henry Waller, jet worker, Whitby, 13 August 1887 — same-day
  pair.** Records 1844 (drunk and disorderly in Church Street) and 1847
  (damaging a police coat), same defendant, same date.

- **James Wright, police constable, Egton** — records 1544 and 1855.
  Same name/occupation/place; high confidence. Distinct from the
  James Wright of Hinderwell (record 1713).

- **Isaac Abraham and William Lowe, Staithes town street, Hinderwell, 5
  May 1877 — confirmed same incident.** Records 1869 and 1872, both
  drunk and disorderly in the same place the same day.

- **James Richardson's land, Hawsker cum Stainsacre, 21 August 1887 —
  confirmed same incident.** Records 1873 (Joseph Thomas Dence) and
  1876 (Joseph Morrison), both stealing beans the same day.
- **Frank Crosier, Hinderwell, 11 August 1867 — confirmed 2-person
  same incident.** Records 1874 (John Smithson) and 1877 (William
  Headlam), both assaulting the same man the same day.
- **Bath bricks pedlar pair, Whitby, 8 June 1877 — likely 2-person
  same incident.** Records 1890 (William Ward) and 1893 (Christopher
  White), identical charge (acting as a pedlar offering bath bricks
  for sale without a certificate), same date.

## How to use this later

When the merge-design pass happens: start with the "strong candidates"
above (specific recurring office/role is the highest-confidence signal),
decide the linking mechanism, then run a proper corpus-wide sweep using
whatever criteria get agreed (name + role/occupation + place + plausible
date range) rather than name alone — name-only matching will produce
false positives (see the Robert Kirby counter-example above, a different
person who happens to share the name).
- **Joseph Monkman, constable of the North Riding, Egton, 3 September
  1887 — confirmed 2-person same incident.** Records 1912 (Andrew
  Cockburn, tailor) and 1915 (Joseph Hodgson, shoemaker), both of
  Loftus, both assaulting the same constable the same day.
- **Thomas Stabler assaulting William Ward and Mary Ward (husband and
  wife), Whitby, 24 August 1867 — confirmed 2-charge same incident.**
  Records 1916 (assaulting William Ward) and 1919 (assaulting Mary
  Ward, William named as her husband) — same defendant, same date,
  reads as one attack on a married couple charged as two counts.
  William Ward (fruiterer, Whitby) appears as two separate person rows
  across the two records (7477, 10220) — plausibly the same real man,
  not merged.
- **Andrew Cockburn/Joseph Hodgson/Joseph Monkman, 3 September 1887 —
  confirmed 4-record connected cluster.** Records 1912 (Cockburn
  assaulting constable Monkman, offence at Egton), 1915 (Hodgson
  assaulting Monkman, same day), 1918 (Monkman, as informant, catching
  Cockburn poaching with Hodgson at Eskdaleside cum Ugglebarnby, six
  rabbits/two nets/15 stobs/two bags/one bludgeon seized), and 1921
  (mirror-image poaching charge against Hodgson, same seizure details)
  — reads as one real event: Monkman caught the pair poaching, searched
  them, and was assaulted, with the assault charged as two counts and
  the poaching charged as two counts (one per defendant). High
  confidence.
- **Francis Norman, landowner, Ruswarp, 10 June 1877 — confirmed
  2-person same incident.** Records 1926 (Joseph Paylor) and 1929
  (Robert Bulmer), both trespassing after conies on his land, same
  date.
- **William George Hansell, jet worker, Whitby — recurs 3 times in 4
  days.** Records 1933 (3 September 1887, Church Street), 1936 (5
  September, Bridge End), and 1939 (same day as 1936, wife Margaret
  Ann Hansell also drunk at Bridge End — a husband-and-wife
  same-incident pair). High confidence recurring habitual drunkard.
- **George Gallilee's licensed premises, Whitby, 9 May 1877 —
  confirmed 2-person same incident.** Records 1896 (Joseph Storr) and
  1953 (Thomas Robson Cornforth), both drunk on the same premises the
  same day, same three police witnesses (Ryder, Moody, Peacock)
  throughout.
- **James Ryan (Glaisdale labourer) assaulted twice, Whitby, 2 July
  1865 — confirmed 2-person same incident.** Records 1955 (James
  Gavan) and 1958 (Michael Boan), both convicted of assaulting the
  same James Ryan the same day — reads as a group assault by two men,
  prosecuted separately.
- **Edwin Renwick, butcher, Hawsker-cum-Stainsacre — recurs
  frequently, all September 1887.** Records 1960 (drunk on William
  Clark's premises, 14 Sept), 1966 (drunk and disorderly in
  Baxtergate, 15 Sept), plus earlier Green Lane sightings (4283, 5941)
  — a busy few days for a recurring habitual-drunkenness defendant.
- **Filey (East Riding) fishermen, Whitby, 11 August 1865 — likely
  2-person same incident.** Records 1991 (William Sayers) and 2003
  (William Bower), both "of Filey in the East Riding fisherman," both
  drunk and riotous in a public thoroughfare the same day — plausibly
  two crewmates from the same visiting boat.
- **Furious riding crackdown, Whitby, 6 August 1865 — likely 3-record
  enforcement sweep, not necessarily one incident.** Records 1997
  (William Thurkell, Baxtergate, informant James Wright), 2000 (John
  Harrison, Baxtergate, informant Hugh McGregor), and 2006 (John
  Sanderson, Bridge Street, informant Hugh McGregor) — all "riding a
  horse furiously," same day, two by the same informant. Reads as a
  targeted enforcement day rather than one single incident.
- **Solomon Marshall, jet worker, Whitby, 22 March 1887 — same-day,
  two convictions.** Record 2008 (begging in Arundel Place) and record
  2011 (assaulting constable William Marshall — a coincidental shared
  surname, not stated as kin), both same day.
- **James Waite/Hugh McGregor, Hinderwell, 5 August 1865 — likely
  4-record enforcement cluster.** Records 2012 (Joseph Crispin, Red
  Lion), 2015 (Thomas Crooks, Black Lion, informed on by Hugh
  McGregor), 2018 (Thomas Jefferson, general public thoroughfare, also
  informed on by Hugh McGregor), and 2021 (George Porritt, Red Lion
  again) — all Hinderwell fishermen drunk and riotous, same day.
- **Sleights and Grosmont highway, 31 March 1887 — same-day pair.**
  Records 2020 (Thomas Stewart) and 2023 (Thomas Cook), both begging
  on the same highway the same day.
- **William Pattison, Baxtergate, Whitby — recurs twice, 1874.**
  Records 2022 (2 October) and 2028 (13 July), both drunk and riotous
  in Baxtergate, no home stated either time.
- **Ass ill-treating, Fylingdales, 28 March 1887 — confirmed 3-person
  group incident.** Records 2029 (William Bryan Stubbs), 2032
  (William Stubbs — likely the same boy, middle name dropped), and
  2035 (John Richardson Dixon) — identical charge wording, identical
  date, all schoolboys — reads as three boys tormenting the same
  animal together.
- **William Harland, fisherman, Whitby, 19 August 1865 — likely same
  person, two convictions same day.** Record 2033 (assaulting Jane
  Gatenby) and record 2042 (drunk, on the oath of Martin Dickinson) —
  same name/occupation/town/date, plausibly one bad night.
- **St Ann's Staith stonemasons, Whitby, 20 June 1874 — confirmed
  2-person same incident.** Records 2072 (Charles Hughes) and 2075
  (William Souter), both stonemasons, both drunk and riotous in the
  same place the same day. William Souter also has a SECOND conviction
  the same day: record 2114 (assaulting constable John Nicholson) —
  likely resisting arrest after 2075.
- **Francis Fewster, jet worker, Whitby, 14 May 1887 — same-day,
  THREE convictions.** Record 2076 (drunk and disorderly, Church
  Street), record 2079 (assaulting Thomas Loftus), and record 2082
  (assaulting constable William Dobson) — same defendant, same date,
  reads as one drunken night escalating into resisting arrest. Fourth
  overall sighting with 2053.
- **Revd George Austen's churchyard, Whitby, 15 May 1887 — confirmed
  2-person same incident.** Records 2091 (William Murphy) and 2094
  (Thomas Maddison), both damaging the churchyard soil/herbage the
  same day.
- **John McDonnell, Whitby, 18 September 1865 — likely same person,
  two convictions same day.** Record 2089 (assaulting constable Hugh
  McGregor) and record 2092 (drunk and riotous), same name, same date
  — plausibly one arrest.
- **John Nicholson, constable, Whitby, 20 June 1874 — 2-record
  resisting-arrest cluster.** Records 2114 (William Souter assaulting
  Nicholson) and 2123 (Mark Aylan resisting Nicholson), same officer,
  same day. Nicholson is the corpus's super-recurring Whitby constable
  (23+ sightings elsewhere), not individually re-tracked further.
- **Elizabeth/George Sedman, Whitby — recurs as a couple.** Record
  2062 (28 August 1865, Elizabeth drunk) and record 2122 (1 October
  1864, Elizabeth assaulting William Lloyd) — same names/town, over a
  year apart; separate person rows each time, plausibly the same
  couple.
- **North Eastern Railway Company/John Watson land, Egton, 8 June
  1874 — confirmed 3-person group trespass.** Record 2087 (George
  Wilks and Marshall Wright) and record 2099 (Robert Dixon), all
  trespassing after game on the same land the same day.
- **John Conroyed, Fylingdales, 17 June 1874 — likely same person,
  two convictions same day.** Record 1998 (assaulting George
  Wellburn) and record 2105 (drunk and disorderly in Robin Hood's Bay
  town street, on the oath of William Woardley), same name, same
  township, same date.
- **William Horsley Bell, constable, Whitby, 28 September 1865 —
  likely 2-record enforcement pair.** Records 2107 (John Watkins
  assaulting Bell) and 2110 (James Kelly drunk, on the oath of Bell),
  same day, two different bricklayers.
- **Christmas Day drunkenness, Church Street, Whitby, 25 December
  1886 — confirmed 2-person same day.** Records 2139 (Kate Ward,
  widow) and 2142 (Hannah Scales, widow), both drunk and disorderly
  in the same street the same day.
- **Henry Wheat, constable, Whitby, 9 November 1864 — 2-record
  enforcement pair.** Records 2155 (George Dixon) and 2158 (John
  Backhouse), both drunk and riotous in Church Street, same day.
- **Constable John Smith, Whitby, 5 July 1874 — chaotic 3-record day.**
  Records 2165 (Thomas Clarkson resisting), 2168 (Charles Boyce
  assaulting, witnessed by John Smith and Urban Bird), and 2171
  (Charles Boyce ALSO resisting) — Boyce has two separate charges the
  same day; likely one continuous confrontation split into assault +
  resisting counts.
- **John and Mary Fealay, shoemaker, Whitby, 26 March 1867 — confirmed
  same-day couple.** Record 2194 (Mary assaulting Bridget McCarty,
  John named as her husband) and record 2197 (John himself assaulting
  William Walsh), same date — reads as one violent day for both
  spouses.
- **Mary Wray, Whitby, 22 July 1874 — same-day, two convictions.**
  Records 2192 (drunk and disorderly, Grape Lane) and 2207 (indecent
  and obscene language, Grape Lane), same defendant/husband
  (Cuthbert), same date/place.
- **Solomon Marshall, jet worker, Whitby — recurs a third time.**
  Records 2008, 2011, and now 2205 (lodging in a pig sty, Hawsker cum
  Stainsacre).
- **John Henry Roberts, Whitby, 7 April 1867 — confirmed 3-person same
  incident.** Records 2209 (William Potts), 2212 (John Wilson), and
  2215 (Thomas Smith), all assaulting the same man the same day — a
  genuine gang assault.
- **Robert Harrison, quarryman, Glaisdale — recurs twice.** Records
  2202 (29 January 1887, drunk on the Glaisdale highway) and 2217 (5
  February 1887, drunk in Wellington Road, Whitby) — same
  name/occupation/home, a week apart.
- **Malachey and Margaret Kelly, Hinderwell, 11 February 1887 —
  confirmed same-day couple.** Records 2220 (Malachey drunk) and 2223
  (Margaret drunk, Malachey named as her husband), same date/place —
  both spouses drunk together in Staithes town street.
- **Staithes drunkenness, Hinderwell, 6 April 1867 — likely 2-record
  same-day pattern.** Records 2221 (Thomas Jefferson) and 2224 (George
  Porritt), both drunk/riotous fishermen in Staithes Street the same
  day.
- **Robert Purvis, fruiterer, Whitby, 12 February 1887 — same-day, two
  convictions.** Records 2226 (assaulting Hannah Atkinson) and 2229
  (assaulting Mary Jane Mathews), same defendant, same date — two
  separate assaults the same day.
- **Marquis of Normanby's land, parish of Lythe, 10 April 1867 —
  confirmed 2-person group trespass.** Records 2233 (Zachariah
  Fletcher) and 2236 (John Frankland), both trespassing after conies
  on the same land the same day.
- **Edward Binns, stonemason, Whitby, 20 February 1887 — same-day,
  two convictions.** Records 2244 (drunk and disorderly on the Pier)
  and 2247 (assaulting constable William Cook), same defendant, same
  date — likely resisting arrest after the first charge.
- **James Reeves, riveter, Whitby, 21 February 1887 — same-day, two
  convictions.** Records 2250 (drunk and disorderly, Haggersgate) and
  2253 (assaulting constable George Lambert), same defendant, same
  date.
- **The Bridge, Whitby, 26 February 1887 — confirmed 2-person same
  day.** Records 2264 (Francis Fewster) and 2267 (Joseph Storr), both
  drunk and disorderly on the Bridge the same day. Fewster's 5th
  overall sighting.
- **Walter Horne, fisherman, Whitby, 10 August 1874 — same-day, two
  convictions.** Records 2252 (drunk and disorderly, Church Street)
  and 2269 (assaulting constable George Richard Lazenby), same
  defendant, same date.
- **Port Mulgrave town street, Hinderwell, 28 February 1887 — likely
  2-person same day.** Records 2273 (William Broderick) and 2276
  (Thomas Jones), both begging in the same street the same day.
- **Two printers drunk same day, Whitby, 12 June 1867 — possible
  connection.** Records 2295 (Hugh William Hughes) and 2298 (Lindsay
  Anderson), both printers, both drunk, same day — plausibly
  colleagues, weaker signal than a shared location/witness.
- **Hinderwell public thoroughfare, 10 June 1867 — likely 2-record
  same-day pattern.** Records 2304 (James Raw) and 2307 (John Jackson,
  Brotton), both drunk and riotous in a public thoroughfare the same
  day, same informant context (Frank Crosier as constable, not victim
  this time — a different role from his other appearances).
- **George Brewster, cartman, Whitby, 3 September 1874 — same-day, two
  convictions.** Records 2308 (too far from his cart on the Pier) and
  2311 (obstructing Haggersgate with his cart), same defendant, same
  date — two separate cart-control offences the same day.
- **Edward Row, labourer, Whitby, 4 September 1874 — same-day, two
  convictions.** Records 2258 (drunk and disorderly, Church Street)
  and 2323 (assaulting constable Miles Moody), same defendant, same
  date.
- **John Smallwood, innkeeper, Eskdaleside, 21 December 1866 —
  confirmed 2-person same incident.** Records 2331 (Francis Schofield)
  and 2334 (Richard Davy), both assaulting the same man the same day.
- **Whitby School Board truancy, 4 October 1886 — 3-record same-day
  enforcement sweep.** Records 2330 (George Tweedy/son John Andrew),
  2333 (William Arnold/daughter Mary), and 2336 (Stephen Palmer/son
  George), all "not sending [child] to school," same date — a single
  School Board enforcement day.
- **Brunswick Street snowballs, Whitby, 16 January 1867 — confirmed
  2-person same incident.** Records 2337 (George Braithwaite) and
  2340 (Valentine Austin), both throwing snowballs in the same street
  the same day.
- **George Nellist and Isaac Wilson, Whitby, 25 January 1867 —
  confirmed mutual-fighting pair.** Records 2346 and 2349, each man
  separately convicted for fighting the other the same day; both
  correctly use "co-participant" role, not victim/assailant.
- **Salmon poaching in close season, Hawsker cum Stainsacre, 24
  October 1886 — confirmed 2-person same incident.** Records 2354
  (John Harland) and 2357 (John Backhouse), both catching one salmon
  in the German Ocean the same day.
- **Dice game, St Hilda's Terrace, Ruswarp, 23 October 1886 —
  confirmed 3-person same incident.** Records 2360 (Anderson Hobson),
  2363 (William John Blackstone), and 2366 (James Pearson), all
  playing dice in the same place the same day.
- **Anderson Hobson, jet worker, Whitby — recurs beyond the New
  Gardens group.** Record 2360 (defendant, dice game, 1886) and 2362
  (assault victim, 1874) — separate, unrelated appearances of the
  name across a 12-year span; not merged.
- **Richard Holmes, Whitby — possibly the same man as the Thomas
  Watson cluster (1971/1983).** Record 2359 (14 September 1874, named
  as Mary Holmes's husband, jet worker) predates that cluster (1876)
  by 2 years; same name/town/occupation, worth checking in the merge
  pass.
- **Whitby harbour unjust coal scales, 29 January 1867 — 3-record
  weights-and-measures enforcement sweep.** Records 2355 (Henry
  Readman, ship "Friends"), 2361 (Mary Harland, ship "Hopewell"), and
  2367 (Anthony Jackson, ship "Fowler"), all found by Charles Tempest
  Clarkson the same day — a coordinated harbour inspection, not
  coincidence.
- **Stephen Kingston, jet worker, Whitby, 25 October 1886 — same-day,
  two convictions.** Records 2375 (drunk and disorderly, Flowergate)
  and 2378 (damaging John Readman's trousers), same defendant, same
  date.
- **Thomas Adams alias George Wilson, Lythe, 27 September 1874 —
  same-day, two convictions.** Records 2371 (assaulting constable
  Thomas Dennis) and 2389 (found with a rabbit and partridge by the
  same Dennis), same defendant, same date — one continuous poaching-
  then-resisting incident.
- **Aislaby, 5 November 1886 — confirmed 5-record same day.** Records
  2387 (Francis Smith begging), 2390 (Isaac Smith begging), 2393
  (Sarah Jane Smith, wife of Isaac Smith, begging), 2396 (Francis
  Smith ALSO assaulting constable James Side), and 2399 (Isaac Smith
  ALSO assaulting the same James Side) — Isaac and Sarah Jane are a
  husband-and-wife pair; both Francis and Isaac Smith escalated from
  begging to assaulting the same constable, reads as one group
  incident.
- **Shafto Pearson Richardson's licensed premises, Whitby, 9 November
  1886 — confirmed 2-person same incident.** Records 2405 (Patrick
  Dixon) and 2408 (Mary Jane Knaggs, wife of John Knaggs), both drunk
  on the same premises the same day.
- **Sir Charles Mark Palmer's land, Roxby, 26 September 1888 —
  confirmed 3-person same incident (restart pass).** Records 2
  (William Tooley), 3 (Jonathan Agar), and 4 (John Marley), all
  Liverton Mines miners, all trespassing after conies on the same
  land the same day.
- **Whitby and Robin Hood's Bay highway, Fylingdales, 11 October 1888
  — confirmed 2-person same incident (restart pass).** Records 11
  (Stephen George Mills) and 12 (John Quinney), both labourers, both
  begging on the same road the same day.
- **Robert Harker, carrier, Mickleby — recurs twice, 13 days apart
  (restart pass).** Records 10 (6 October 1888, obstructing Lythe
  town street) and 17 (19 October 1888, drunk in charge of a horse
  and cart on the Hinderwell and Ellerby highway) — same
  name/occupation/home, plausibly the same working carrier cited
  twice for separate transport offences.
- **Alfred Ford, caulker, Whitby, 10 November 1888 — same-day, two
  convictions (restart pass).** Records 30 (drunk and disorderly,
  Church Street) and 31 (assaulting constable John Carpenter), same
  defendant, same date.
- **Staithes Beck salmon poaching, Hinderwell, 11 November 1888 —
  confirmed 2-person same incident (restart pass).** Records 34
  (Thomas Humphrey) and 35 (Robert Cummins), both attempting to catch
  salmon in the close season, same day/place.
- **Stonegate Beck salmon poaching, Glaisdale, 24 November 1888 —
  confirmed 2-person same incident (restart pass).** Records 41
  (Joseph Harrison) and 42 (William Wren), both killing a salmon in
  the close season, same day/place.
