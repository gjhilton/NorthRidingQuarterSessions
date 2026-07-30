# Full re-extraction audit log — part 2 (records 1401+)

Continues directly from `full-audit-log.md` (part 1, records 1–1400).
Same methodology throughout: read every conviction's `raw_record` text
directly, cross-check every proper name/location/relationship against
the database, fix real gaps via direct SQL, log every record
individually (one-line OK or detailed FIXED entry), log same-person
candidates to `same-person-candidates.md` without merging, and populate
`summary_conviction.anomalies` for any new source-side artifacts found.
See `reextraction-audit-notes.md` for the established rules (sex
inference, pattern #6, specific-site rules, truancy rule,
silence-implies-local, title/office/esquire/baronet/licensee
conventions, Highways/Rivers/Railways category, etc).

This file will close out at record ~2400 (1000 more records) and hand
off to `full-audit-log-3.md`, and so on every 1000 records.

## Records 1401-1405

1401: Christopher Stainthorpe assaulting Isabella Stainthorpe, offence
      at Ruswarp — FIXED sex (7175, female). No home stated for
      either, correctly left null. Shared surname but no relationship
      stated in the source, correctly left uncaptured.
1402: Henry Palmer (labourer, home Newholm-cum-Dunsley) begging in East
      Row, offence at Newholm-cum-Dunsley — OK, no fixes needed. Same
      date (11 June 1888) and location as record 1399's Edward
      Jackson — confirmed same-incident pair, two men begging together.
1403: Edward Jordan (labourer, Whitby) drunk; informant John Ryder
      (inspector of police, Whitby) — FIXED sex (7176, male). Sixth
      sighting of John Ryder as inspector in 1868 (also 1197, 1221,
      1277, 1358, 1394) — updating the candidate entry.
1404: George Webster, jet worker, Whitby, drunk and disorderly in
      Baxtergate — OK, no fixes needed. Same name/occupation/home as
      record 1171 (drunk on Robert Jefferson's premises), about 7
      months earlier — logging as a candidate.
1405: Frederick Owen (printer, Mickleby) begging in "Mickleby town
      street", offence at Mickleby — OK, no fixes needed; correctly
      resolves to Mickleby itself.

**Progress: id 1401-1405 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair, 2 same-person candidates logged (one
entry updated).**

## Records 1406-1410

1406: Thomas Bradley, begging in Cleveland Terrace, offence at Ruswarp
      — OK, no fixes needed (no home stated, correctly null; Cleveland
      Terrace correctly under West Cliff).
1407: Ellen Hick, wife of Isaac Hick (jet worker), of the township of
      Whitby, drunk and disorderly in Sandgate — FIXED missing home on
      Isaac Hick (9959, Whitby) — pattern #6. Extends the Hick couple's
      timeline back to 10 October 1874, earlier than the December 1874
      cluster already logged.
1408: John Thompson, labourer, Ruswarp, lodging in a cowhouse — OK, no
      fixes needed.
1409: John Watson assaulting Joshua Hillas — FIXED sex (7177, male). No
      home stated for either, correctly null.
1410: George Carr, begging "in the road leading from Thorpe to Robin
      Hood's Bay", offence at Fylingdales — FIXED a missing location
      link: an existing "Thorpe & Robin Hood's Bay Highway" node (id
      134, already used by record 962's "Thorpe and Robin Hood's Bay
      highway") was not linked here despite the same road being
      described in different words. Checked scope and found record
      1413 has the identical gap (same road, "wandering" instead of
      "begging", same date) — fixed both. Same date (15 October 1874)
      confirms 1410 and 1413 are a same-incident pair, two men on the
      same road that day.

**Progress: id 1406-1410 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 2 missing-location links fixed (one
out-of-sequence), 1 confirmed same-incident pair logged.**

## Records 1411-1415 (1413 already fixed above)

1411: David Robinson, labourer, Ruswarp, lodging in the open air in
      Upgang Lane — OK, no fixes needed. Same date (15 June 1888) and
      location as record 1414 — confirmed same-incident pair.
1412: John Robinson (fruiterer, Whitby) assaulting John White — FIXED
      sex (7178, male). Shares a name with record 1225's defendant John
      White, but 7 years apart with no other overlap — not linked.
1413: George Brown, road leading from Thorpe to Robin Hood's Bay — OK,
      already fixed above (confirmed same-incident pair with 1410).
1414: John Mason, labourer, Ruswarp, lodging in the open air in Upgang
      Lane — OK, no fixes needed; confirmed same-incident pair with
      1411.
1415: Francis Jarvis, begging in Cleveland Terrace, offence at Ruswarp
      — OK, no fixes needed (no home stated, correctly null).

**Progress: id 1411-1415 done (5 of 5 fully resolved). 1 sex fix, 1
confirmed same-incident pair logged.**

## Records 1416-1420

1416: Robert Estill (sailor, Fylingdales) drunk and disorderly in
      "Robin Hood's Bay town street"; informant John Jefferson (police
      constable, Fylingdales) — FIXED sex (7179, male). Correctly
      resolves to Robin Hood's Bay itself.
1417: William Adamson (master mariner, Hinderwell) assaulting William
      McClauchlin, offence at Hinderwell — FIXED sex (7180, male). Same
      date (16 December 1887) and victim as record 1420 — confirmed
      same-incident pair, two men assaulting the same person that day.
1418: Ann Watson assaulting Charles Tempest Clarkson — FIXED sex (7181,
      male). Fourth sighting of Clarkson (also 1131, 1248, 1292), this
      time as an assault victim — updating the candidate entry.
1419: Robert Cockerill (carrier, Fylingdales) drunk in charge of a horse
      and cart on "the Whitby and Robin Hood's Bay highway", offence at
      Hawsker cum Stainsacre — FOUND a missing-location-link bug: an
      existing "Whitby & Robin Hood's Bay Highway" node (id 136,
      already used by 13 other convictions) wasn't linked here. Checked
      full corpus scope for this phrase and found two more gaps besides
      this one — records 1989 and 5093 — fixed all three. (1989 shares
      the same date, 15 September 1874, and offence, begging, as the
      already-linked record 2034 — likely a same-incident pair, logged.)
1420: George Gibbons (butcher, Hinderwell) assaulting William
      McClauchlin, offence at Hinderwell — FIXED sex (7182, male).
      Confirmed same-incident pair with 1417.

**Progress: id 1416-1420 done (5 of 5 fully resolved). 4 sex fixes, 3
missing-location links fixed (2 out-of-sequence), 2 confirmed
same-incident pairs, 1 same-person candidate entry updated.**

## Records 1421-1425

1421: Barney FitzPatrick (furnaceman, Eskdaleside-cum-Ugglebarnby)
      drunk and riotous in a public thoroughfare; informant William
      Pickering (police constable) — FIXED sex (7183, male). Source's
      "Barney Fitz. Patrick" already correctly normalized to
      "FitzPatrick", no fix needed there. Third sighting of William
      Pickering (also 1257, 1400) — updating the candidate entry.
1422: Richard Collier (jet worker, Whitby) drunk on the licensed
      premises of Hannah Dawson, refusing to leave when asked by
      Dawson herself — FIXED sex (7184, female).
1423: Joseph Bridges, fisherman, Whitby, drunk and disorderly on the
      Pier — OK, no fixes needed. Same name/occupation/home as record
      1393, about 6 months apart — logging as a candidate.
1424: Mary Sewell, wife of Henry Sewell, begging in Cleveland Terrace,
      offence at Ruswarp — FIXED sex (9960, male). No "of the township"
      clause for Henry in this text, correctly left home/occupation
      null.
1425: William Ward (fruiterer, Whitby) assaulting James Beattie
      (labourer, Hawsker cum Stainsacre); informants Beattie himself,
      "H.M. Frank" (wife of George Frank, gardener, Hawsker cum
      Stainsacre), and Robert Carr (baker, Whitby) — FIXED sex (7185
      Beattie male, 7186 H.M. Frank female, 7187 Carr male, 10209
      George Frank male). "H.M. Frank" correctly captured as literal
      initials since the source gives no fuller name — not fabricated.

**Progress: id 1421-1425 done (5 of 5 fully resolved). 7 sex fixes, 2
same-person candidate entries updated/logged.**

## Records 1426-1430

1426: Francis Sherwood, groom, home Ruswarp, drunk and disorderly in
      Church Street, offence at Whitby — OK, no fixes needed.
1427: Henry Sewell, begging in Cleveland Terrace, offence at Ruswarp —
      OK, no fixes needed (already correctly male, no home stated). Same
      date and location as record 1424 (his wife Mary Sewell) —
      confirmed same-incident pair, husband and wife begging together.
1428: William Featherstone, sailor, Whitby, drunk and disorderly in the
      New Quay — OK, no fixes needed. Same name/occupation/home as
      record 1353's William Featherstone (Miriam's husband), about 4.5
      months earlier — logging as a candidate.
1429: George Codling (farm servant, of Dale House in Hinderwell)
      assaulting George Welford, offence at Hinderwell — FIXED sex
      (7188, male).
1430: Frank Williams assaulting William Shaw, offence at Eskdaleside —
      FIXED sex (7189, male). No home stated for either, correctly
      null.

**Progress: id 1426-1430 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate logged.**

## Records 1431-1435

1431: Ralph Jordison (painter, Whitby) assaulting Edward Weeks, a
      constable for the North Riding; informant is Weeks himself —
      FIXED sex (7190, male). Both names are already-recurring figures
      (Jordison at 1156, Weeks at 1126) meeting here in one record.
1432: Thomas Taylor (farm servant, home Skinningrove) assaulting George
      Welford, offence at Hinderwell — FIXED sex (7191, male). Same
      date (18 December 1887), victim, and township as records 1429 and
      1435 — confirmed a 3-person group assault on George Welford that
      day.
1433: William Nicholson (ostler), Jonathan Marsay (waggoner), and Mark
      Squires (postboy), all Whitby, plus William Norton (labourer,
      Hawsker cum Stainsacre) trespassing in pursuit of game on Peter
      George Coble's land, offence at Sneaton — FIXED sex (7192, male).
      Shares a name with record 1366's licensee Jonathan Marsay, but a
      different occupation (waggoner vs licensee) — not linked given
      the mismatch.
1434: Jane Coates, common prostitute, indecent behaviour in Church
      Street, offence at Whitby — OK, no fixes needed (no home stated,
      correctly null).
1435: John Brown (platelayer, Hinderwell) assaulting George Welford —
      FIXED sex (7193, male). Confirmed third member of the same-day
      group assault with 1429 and 1432.

**Progress: id 1431-1435 done (5 of 5 fully resolved). 4 sex fixes, 1
confirmed 3-person same-incident group logged.**

## Records 1436-1440

1436: Mary Elizabeth Grant, common prostitute, indecent behaviour in
      Church Street — OK, no fixes needed. Same name/occupation as
      record 1352 (obscene language on Boulby Bank), 24 days apart —
      logging as a candidate. Same date (29 August 1868) and offence as
      record 1439 below — confirmed same-incident pair.
1437: Thomas Crooks, home Roxby, keeping two dogs while licensed for
      only one, offence at Roxby — OK, no fixes needed.
1438: Ernest Dunn (miner, Hinderwell) assaulting George Welford — FIXED
      sex (7194, male). Fourth member of the same-day (18 December
      1887) group assault on Welford — updating the candidate entry.
1439: Margaret Corner, common prostitute, indecent behaviour in Church
      Street — OK, no fixes needed (no home stated, correctly null).
      Confirmed same-incident pair with 1436.
1440: George Duck (labourer, Whitby) drunk and disorderly in Baxtergate;
      informants George Hewison and John Nicholson, both police
      constables, Whitby — FIXED sex (7195 Hewison, 7196 Nicholson,
      both male). This John Nicholson sighting is dated 18 October
      1874, earlier than any other sighting so far (the main cluster
      starts ~1875) — extends the candidate's timeline back further.
      George Hewison matches an already-logged candidate from an
      earlier session.

**Progress: id 1436-1440 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate entry extended
(earlier timeline), 1 new candidate logged.**

## Records 1441-1445

1441: Matthew Pearson (miner, Hinderwell) assaulting George Welford —
      FIXED sex (7197, male). Fifth member of the same-day (18 December
      1887) group assault on Welford — updating the candidate entry.
1442: Richard Steel, fisherman, Whitby, drunk and riotous on the Pier —
      OK, no fixes needed. Shares name/occupation/home with records
      1122 and 1160 (both also "Richard Steel, fisherman, Whitby") —
      recurring name already implicit across the corpus, not
      separately logged given how generic the combination is becoming.
1443: William Garbutt and James Shawcroft, both miners, Hinderwell,
      trespassing in pursuit of game on Edmund Henry Turton's land at
      Newton Mulgrave — FIXED sex (7198, male).
1444: Albert Dunn (of Staithes Lane End, Hinderwell) assaulting George
      Welford — FIXED sex (7199, male). Sixth member of the same-day
      group assault — updating the candidate entry.
1445: Thomas White (sand hawker, home Stockton on Tees, county Durham)
      driving a cart furiously in Bridge Street, offence at Whitby —
      OK, no fixes needed; Stockton on Tees already exists correctly in
      the location tree as a genuinely distant home town.

**Progress: id 1441-1445 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry updated twice (now 6 assailants).**

## Records 1446-1450

1446: William Ward (fruiterer, Whitby) maliciously damaging three heaps
      of pears belonging to George Frank; witnesses James Beattie,
      "H.M. Frank" (wife of George Frank), and Robert Carr — FIXED sex
      (7200 George Frank male, 7201 Beattie male, 7202 H.M. Frank
      female, 7203 Carr male). Same date (3 October 1874) and same four
      other names as record 1425 (Ward assaulting Beattie) — clearly
      the same real-world incident, told across two separate charges
      (assault + malicious damage) arising from the same altercation.
1447: Robert Harper (beer house keeper, Ruswarp) allowing darts to be
      played for money on his licensed premises — OK, no fixes needed.
1448: "[blank] Williams", begging in Upgang Lane, offence at Ruswarp —
      OK as extracted, first name correctly left null matching the
      source's literal "[blank]"; added an `anomalies` note.
1449: John Noble, jet worker, Whitby, drunk and disorderly at the
      Bridge — OK, no fixes needed.
1450: Robert Tinley (carpenter, Whitby) drunk and disorderly in Skinner
      Street, offence at Ruswarp — OK, no fixes needed; Skinner Street
      correctly under West Cliff per the sweep.

**Progress: id 1446-1450 done (5 of 5 fully resolved). 4 sex fixes, 1
new anomalies entry, 1 confirmed same-incident pair (same underlying
event as record 1425) logged.**

## Records 1451-1455

1451: Thomas Atkinson (beer house keeper, Whitby) allowing drunkenness
      on his licensed premises; informant John Ryder (inspector of
      police) — FIXED sex (7204, male). Shares a name with the existing
      "Thomas Atkinson (innkeeper)" candidate from records 928/934, but
      a different occupation here (beer house keeper) — not folded in,
      just noted. Seventh sighting of John Ryder as inspector in 1868
      — updating the candidate entry.
1452: John Noble (jet worker, of Boulby Bank in Whitby) assaulting
      Matthew Wheatley — FIXED sex (7205, male). Same name/occupation as
      record 1449 (drunk at the Bridge), 13 days earlier, now with a
      more specific home (Boulby Bank rather than just Whitby) —
      logging as a candidate.
1453: Robert Tinley (carpenter, Whitby) assaulting John Johnson, a
      constable of the North Riding, offence at Ruswarp — FIXED sex
      (7206, male). Same defendant and date (2 January 1888) as record
      1450 (drunk in Skinner Street) — confirmed same-day spree.
1454: Mary Jane Wallace, common prostitute, indecent behaviour in Grape
      Lane, offence at Whitby — OK, no fixes needed (no home stated,
      correctly null). Shares a name with record 1161's Mary Jane
      Wallace (singlewoman, New Way Ghaut incident, 6 months later,
      different stated status) — logged as a weaker candidate given
      the status mismatch.
1455: John Harland, shoemaker, Whitby, drunk and disorderly in Sandgate
      — OK, no fixes needed.

**Progress: id 1451-1455 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry updated, 2 new candidates logged (one
weaker).**

## Records 1456-1460

1456: Mark Boulby, land surveyor, home Ruswarp, drunk and disorderly in
      Baxtergate, offence at Whitby — OK, no fixes needed.
1457: Thomas Harland, labourer, Whitby, drunk — OK, no fixes needed.
1458: Ralph Jordison, painter, Whitby, drunk and disorderly on the Pier
      — OK, no fixes needed. Same defendant and date (10 October 1874)
      as record 1431 (assaulting constable Edward Weeks) — confirmed
      same-day spree.
1459: Frances Heselwood (prostitute, Whitby) drunk; informant Joseph
      Gatenby (police constable, Whitby) — FIXED sex (7207, male).
      Shares a name with record 1355's Frances Heselwood (singlewoman,
      Boulby Bank), about 6 weeks apart, different stated status —
      logging as a candidate. Fifth sighting of Joseph Gatenby —
      updating the candidate entry.
1460: William Featherstone (sailor, Whitby) drunk on the licensed
      premises of Joseph Marsay, refusing to leave when asked by George
      Richard Lazenby, a police constable — FIXED sex (7208 Marsay,
      7209 Lazenby, both male). Third sighting of this William
      Featherstone (also 1353, 1428), fourth of Joseph Marsay's
      recurring licensee identity, and fourth of George Richard Lazenby
      — three separate candidate entries all touched by one record.

**Progress: id 1456-1460 done (5 of 5 fully resolved). 3 sex fixes, 1
new candidate logged, 3 same-person candidate entries updated.**

## Records 1461-1465

1461: John Dugal, labourer, Whitby, begging in Baxtergate — OK, no
      fixes needed.
1462: Richard Collier, jet worker, Whitby, drunk — OK, no fixes needed.
      Recurring name (also 1174, 1280, 1422), already implicit given how
      common this combination is becoming.
1463: John Forth, gas fitter, home Ruswarp, drunk in charge of a horse
      and cart in Baxtergate, offence at Whitby — OK, no fixes needed.
1464: Thomas Dixon (of Tate Hill in the township of Whitby) not sending
      his daughter Jane Elizabeth to school — FIXED sex (7210, female).
      Offence location correctly resolves to Tate Hill per the truancy
      rule.
1465: Mary Wray, wife of "[blank] fruiterer", and Ann Miller, wife of
      Henry Miller, both obstructing Church Street; informant "[blank]
      Dickinson" (police constable, Whitby) — FOUND a real extraction
      bug: the husband's occupation ("fruiterer") had been wrongly
      attached to Mary herself instead of a separate husband stub.
      FIXED by removing "fruiterer" from Mary (1548), creating a new
      person row for the husband (first_name=NULL, last_name='Wray',
      sex=male, occupation=fruiterer — his home is genuinely not
      stated, since the "both of the township of Whitby" clause covers
      the two named women, not him), and linking the wife relationship.
      This is almost certainly the same Cuthbert Wray from record 1265
      (also "fruiterer", also married to a Mary Wray), but his first
      name is blank in *this* record's source text, so it wasn't
      filled in from the other sighting — logged as a candidate
      instead. FIXED sex (9961 Henry Miller, male) — fifth sighting of
      this recurring couple (also 1168, 1221, 1304, 1331). "[blank]
      Dickinson" shares occupation/place with record 1188's informant —
      logged as a possible same-officer candidate.

**Progress: id 1461-1465 done (5 of 5 fully resolved). 2 sex fixes, 1
real extraction bug fixed (misattributed occupation + missing husband
stub), 1 same-person candidate entry updated (5th sighting), 2 new
candidates logged.**

**Major corpus-wide sweep triggered by record 1465's "wife of [blank]
fruiterer" bug.** Searched the full corpus for the "X wife of [blank]
SURNAME [OCCUPATION]" pattern (32 hits) and fixed every real gap found:
7 records had the husband's occupation wrongly attached to the wife
instead of a separate blank-name husband stub (2579, 2825, 4192, 4225,
4350, 5244, 5374); 3 had the husband's occupation/home entirely dropped
with no misattachment (4403, 4876, 4924); 5 were missing just the
husband relationship link with nothing else stated (4097, 5062, 5148,
6250, 6251). 9 others were already correctly handled. Full detail
recorded in `reextraction-audit-notes.md` rather than repeated here,
since these are scattered records well outside the current sequential
range — same "out-of-sequence scope check" methodology as the Mirk Esk
and New Gardens fixes.

## Records 1466-1470

1466: George Blooman, home Ruswarp, throwing a firework in North
      Terrace, offence at Ruswarp — OK, no fixes needed.
1467: Joseph Hart, jet worker, Whitby, Church Street — OK, no fixes
      needed. Same defendant as record 1297 (New Gardens footpath
      group), different date.
1468: John Woodward (innkeeper, Hinderwell) allowing drunkenness on his
      licensed premises; informant James Wright (police constable,
      Hinderwell) — FIXED sex (7212, male).
1469: Ann Miller, wife of Henry Miller (labourer), of the township of
      Whitby, drunk and disorderly on the Pier — FIXED missing home on
      Henry Miller (9962, Whitby) — pattern #6. Sixth sighting of this
      recurring couple (also 1168, 1221, 1304, 1331, 1465).
1470: George Martin, jet worker, Whitby, Church Street — OK, no fixes
      needed. Same defendant as record 1238, different date.

**Progress: id 1466-1470 done (5 of 5 fully resolved). 2 sex fixes, 1
pattern-#6 missing-home fix.**

## Records 1471-1475

1471: Francis Fewster (jet worker, Whitby) drunk on the licensed
      premises of Thomas Hawkesfield, refusing to leave when asked by
      Elizabeth Hawkesfield, his wife — FIXED sex (7213 Thomas male,
      7214 Elizabeth female).
1472: Ann Miller, wife of Henry Miller (labourer), of the township of
      Whitby, drunk and disorderly in Church Street — FIXED missing
      home on Henry Miller (9963, Whitby) — pattern #6. Seventh
      sighting of this recurring couple.
1473: Thomas Colbert, labourer, Ruswarp, begging in "Ruswarp town
      street" — OK, no fixes needed; correctly resolves to Ruswarp
      itself.
1474: John Lythe, joiner, Whitby, drunk — OK, no fixes needed.
1475: Thomas Loftus, jet worker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.

**Progress: id 1471-1475 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix.**

## Records 1476-1480

1476: James Connor, labourer, Fylingdales, begging in Station Road —
      OK, no fixes needed.
1477: John Lythe assaulting Ann Lythe — FIXED sex (7215, female). Same
      date (16 September 1868) as record 1474's John Lythe (joiner,
      drunk) — confirmed same-day spree; no relationship stated between
      the two despite the shared surname, correctly left uncaptured.
1478: Thomas Lynch assaulting John Nicholson, one of the constables for
      the North Riding — FIXED sex (7216, male). Dated 17 October
      1874, close to the earliest confirmed Nicholson sighting (18
      October 1874, record 1440) — extends the timeline slightly
      further; updating the candidate entry.
1479: William Ritchie, sailor, Whitby, begging at St Ann's Staith — OK,
      no fixes needed.
1480: William Jackson, lodging in the coastguard shed, offence at
      Whitby — OK, no fixes needed (no home stated, correctly null).

**Progress: id 1476-1480 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-day spree, 1 same-person candidate entry updated.**

## Records 1481-1485

1481: John Bonson, jet worker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1482: John Roberts (labourer, Whitby) destroying his own clothes while
      being relieved in the Whitby Union workhouse — FIXED a missing
      location link to the existing "Union Workhouse" node (id 81).
      Triggered a corpus-wide scope check (see the sweep note above)
      that found and fixed 29 more identical gaps elsewhere in the
      corpus.
1483: James Stewart, carpenter, Whitby, drunk and riotous on the Cragg
      — OK, no fixes needed. Same defendant as record 1194.
1484: Adeline Smith, hawker, Whitby, acting as a pedlar hawking clothes
      pegs without a certificate — OK, no fixes needed.
1485: James Kenny, pedlar, Whitby, begging in Baxtergate — OK, no fixes
      needed.

**Progress: id 1481-1485 done (5 of 5 fully resolved). 1 missing
location link fixed (plus 29 more found via corpus-wide sweep).**

## Records 1486-1490

1486: John McGloin (common lodging house keeper, Whitby) not cleansing
      his house to the inspector's satisfaction — OK, no fixes needed.
      Shares a very similar name/occupation with record 1271's John
      McCloin (also common lodging house keeper, Whitby) — plausibly
      the same person with a spelling variant; logged as a candidate.
1487: Robinson Groves (cab driver, Whitby) drunk in charge of a horse
      and cab on "the road leading from Victoria Square to Esk
      Terrace", offence at Ruswarp — FIXED a missing location: created
      a new "Road from Victoria Square to Esk Terrace" node (id 404,
      under West Cliff) after finding a second record (1848) uses the
      identical phrase, matching the specific-named-route convention.
1488: Solomon Marshall (jet worker, Whitby) assaulting Maria Newby —
      FIXED sex (7217, female).
1489: John Campbell, wilfully damaging clothing while relieved in the
      workhouse, offence at Whitby — OK, no fixes needed; already
      correctly linked to the Union Workhouse node.
1490: Mary Ann Smith, singlewoman, Whitby, acting as a pedlar hawking
      clothes pegs without a certificate — OK, no fixes needed.

**Progress: id 1486-1490 done (5 of 5 fully resolved). 1 sex fix, 1 new
location created (used by 2 records), 1 same-person candidate logged.**

## Records 1491-1495

1491: John Porritt, farmer, Roxby, keeping a dog without a licence,
      offence at Roxby — OK, no fixes needed. Added an `anomalies` note:
      this record and 1494 are word-for-word identical (same date, same
      defendant) but carry different QSB archive item numbers — a
      genuine source-side duplicate rather than an extraction error;
      left as two separate rows.
1492: Hugh McLean, wilfully damaging clothing while relieved in the
      workhouse, offence at Whitby — OK, no fixes needed; already
      correctly linked to the Union Workhouse.
1493: Jonathan Harrison (beer house keeper, Whitby) allowing
      drunkenness on his licensed premises; informant John Nicholson
      (police constable, Whitby) — OK as extracted, no fixes needed
      (both already correct). Recurring Harrison (also 1144, 1162) and
      an eleventh sighting of John Nicholson.
1494: John Porritt again — OK, no fixes needed; same duplicate-archive
      note as 1491.
1495: Joseph Tose (rag gatherer, Hinderwell) owning an ass found
      straying on "the Hinderwell and Staithes highway"; informant
      Thomas Stamper Dale (police constable, Hinderwell) — FIXED sex
      (7219, male) and FIXED a missing location link to the existing
      "Staithes & Hinderwell Highway" node (id 167). Scope check found
      four more identical gaps corpus-wide (761 already linked; 1501,
      1504, 1523, 4089 were not) — fixed all four alongside this one.

**Progress: id 1491-1495 done (5 of 5 fully resolved). 1 sex fix, 5
missing-location links fixed (4 out-of-sequence), 1 new anomalies entry
(genuine archive duplicate) applied to 2 records.**

## Records 1496-1500

1496: John Conwell (jet worker, Whitby) drunk on the licensed premises
      of Hannah Dawson, refusing to leave when asked by John Nicholson,
      a police constable — FIXED sex (7220 Dawson female, 7221
      Nicholson male). Second sighting of Hannah Dawson (also 1422) and
      twelfth of John Nicholson — updating both candidate entries.
1497: Edward Wood, seaman, Whitby, drunk and disorderly in Flowergate —
      OK, no fixes needed.
1498: Thomas Stabler, jet worker, Whitby, drunk and riotous on the Pier
      — OK, no fixes needed.
1499: Mary Ann Seddon, wife of Henry Seddon (watchmaker), of the
      township of Whitby, obscene language in Sandgate; informants
      Robert Needham (police constable) and Miriam Weatherill
      (spinster) — FIXED sex (7222 Needham male, 7223 Weatherill
      female, 9964 Henry Seddon male) and FIXED missing home on Henry
      Seddon (9964, Whitby) — pattern #6. Shares a surname with record
      1176's "[blank] Seddon" informant, 6 years apart — too loose a
      connection to link confidently, not logged.
1500: James Balmer, tailor, Fylingdales, begging in "Robin Hood's Bay
      town street" — OK, no fixes needed; correctly resolves to Robin
      Hood's Bay itself.

**Progress: id 1496-1500 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix, 2 same-person candidate entries updated.**

## Records 1501-1505

1501: Edward Turnbull (fish hawker, Hinderwell) owning a horse found
      straying on the Hinderwell and Staithes highway; informant Thomas
      Stamper Dale — FIXED sex (7224, male). Location link already
      fixed above (out-of-sequence). Third sighting of Thomas Stamper
      Dale (also 1274, 1286/1289) — updating the candidate entry.
1502: John William Wilson (miner, Egton) killing 13 salmon other than
      with a rod and line in the river Esk during the close season —
      OK, no fixes needed; correctly resolves to the existing River Esk
      node.
1503: Marshall Bedlington (mariner, Fylingdales) drunk on the licensed
      premises of Feaster Stubbs — FIXED sex (7225, male).
1504: Anthony Marshall (labourer, Hinderwell) owning an ass found
      straying on the same highway; informant "[blank] Dale" (police
      constable, Hinderwell) — OK, location link already fixed above.
      Same offence type/location/date range as Thomas Stamper Dale's
      other sightings (1495, 1501) — near-certainly the same officer
      with his first name blanked this time; logged as a strong
      candidate. Sex correctly left null (no name to infer from).
1505: Joseph Storr (jet worker, Whitby) drunk on the licensed premises
      of Ann Thompson, refusing to leave when asked by Thompson
      herself — FIXED sex (7227, female). Third sighting of Ann
      Thompson (also 1117, 1126) — updating the candidate entry.

**Progress: id 1501-1505 done (5 of 5 fully resolved). 3 sex fixes, 3
same-person candidate entries updated, 1 strong new candidate logged.**

## Records 1506-1512 (1507, 1510 skipped by the source scrape)

1506: Feaster Stubbs (licensed victualler, Fylingdales) selling beer to
      a drunken person — OK, no fixes needed. Same date (28 February
      1888) and premises as record 1503 (Marshall Bedlington convicted
      of being drunk on Stubbs's premises) — confirmed same-incident
      pair.
1508: Sarah Nussey, wife of Thomas Nussey (stonemason), of the township
      of Whitby, found at midnight in James Wood's yard with intent to
      steal, offence at Ruswarp — FIXED sex (7228 Wood, 9965 Thomas
      Nussey, both male) and FIXED missing home on Thomas Nussey (9965,
      Whitby) — pattern #6.
1509: Johnson Hutton (farmer, Fylingdales) drunk in charge of a horse
      on "Ruswarp town street", offence at Ruswarp — OK, no fixes
      needed; correctly resolves to Ruswarp itself.
1511: William Martin (jet worker, Whitby) drunk and disorderly in
      Baxtergate; informant John Nicholson (police constable, Whitby) —
      FIXED sex (7229, male). Thirteenth sighting of John Nicholson —
      updating the candidate entry. Shares a name with the recurring
      William Martin candidates at 1118/1130.
1512: George Raw (labourer, of Houlsyke in Glaisdale) keeping a dog
      without a licence, offence at Glaisdale — OK, no fixes needed.

**Progress: id 1506-1512 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-incident pair, 1
same-person candidate entry updated.**

## Records 1513-1518 (1516 skipped by the source scrape)

1513: William White (jet turner, Whitby) assaulting William Heselton
      (labourer, Pickering) — FIXED sex (7230, male). Genuinely
      unusual record: offence and court location are both Pickering,
      not Whitby (dated 1866, embedded in an 1868 bundle) — correctly
      captured as such rather than defaulted to Whitby.
1514: Thomas Simpson, fisherman, Whitby, drunk and disorderly in the
      New Quay — OK, no fixes needed.
1515: Alexander Lewis (master mariner, Whitby) drunk and disorderly in
      Hudson Street, offence at Ruswarp — OK, no fixes needed. Same
      date (3 March 1888) as record 1518 — confirmed same-day spree,
      likely one drunken outing.
1517: William Gallilee, home Ruswarp, throwing a firework in North
      Terrace, offence at Ruswarp — OK, no fixes needed (no occupation
      stated, correctly null). Same date/location/offence as record
      1466's George Blooman — confirmed same-incident pair.
1518: Alexander Lewis again, wilfully damaging George Thomas Crowther's
      window glass, offence at Ruswarp — FIXED sex (7231, male).
      Confirmed same-day spree with 1515.

**Progress: id 1513-1518 done (5 of 5 fully resolved). 2 sex fixes, 2
confirmed same-incident/same-day pairs logged.**

## Records 1519-1523

1519: Robert Cockerill, "late of the township of Northallerton but now
      of Whitby", using a waggon without his name painted on it,
      offence at Brompton, case heard at Northallerton — OK, no fixes
      needed; a genuinely out-of-area record correctly captured: court
      location Northallerton, offence location Brompton, and his home
      correctly set to his *current* residence (Whitby), not his former
      one (Northallerton).
1520: Eliza Weatherstone, common prostitute, indecent behaviour in
      Church Street, offence at Whitby — OK, no fixes needed (no home
      stated, correctly null).
1521: John Daniels, shoemaker, Egton, begging in "Egton town street" —
      OK, no fixes needed; correctly resolves to Egton itself.
1522: "Willian Ruehorne" (labourer, Whitby) drunk and riotous in Church
      Street — OK as extracted; the first/last name spelling exactly
      matches the source text's own apparent typos ("Willian" for
      William, "Ruehorne" for Ruehorn) — left as-is rather than
      silently corrected, consistent with how other source-side typos
      have been handled this session (logged, not fixed). Possibly the
      same recurring William Ruehorn (records 1121/1264/1288/1375), but
      those are all "jet worker" while this one is "labourer" — not
      linked given the occupation mismatch and name uncertainty.
1523: Robert Vincent, miner, Hinderwell, wantonly firing a gun near the
      Hinderwell and Staithes highway — OK, already fixed above
      (location link).

**Progress: id 1519-1523 done (5 of 5 fully resolved). No fixes needed
this batch — a clean stretch including two genuinely unusual but
correctly-handled out-of-area/typo records.**

## Records 1524-1528

1524: "Baliff Appleton" (cab driver, Whitby) drunk in charge of two
      horses and a carriage in Baxtergate — FIXED by applying the
      established "Bailiff is a title" treatment (title='Bailiff',
      first_name=NULL, matching records 351 and 1113) — third sighting
      of this recurring figure, same occupation (cab driver) as 1113.
1525: John Rust assaulting William Tilson, offence at Lythe — FIXED sex
      (7232, male). No home stated for either, correctly null.
1526: John Green (miner, Egton) killing 13 salmon other than with a rod
      and line in the river Esk during the close season — OK, no fixes
      needed; correctly resolves to River Esk. Same date (31 October
      1874), method, and river as record 1502's John William Wilson —
      confirmed same-incident pair, two men poaching salmon together.
1527: Robert Marshall, labourer, Whitby, begging in Baxtergate — OK, no
      fixes needed.
1528: Jane Robson, wife of William Robson (engine driver), of the
      township of Whitby, drunk — FIXED sex (9966, male) and FIXED
      missing home on William Robson (9966, Whitby) — pattern #6.

**Progress: id 1524-1528 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 1 "Bailiff Appleton" third-sighting
applied, 1 confirmed same-incident pair logged.**

## Records 1529-1533

1529: John William Pickering, jet worker, Whitby, throwing a firework
      in St Ann's Staith — OK, no fixes needed.
1530: James Walker, labourer, Lythe, begging in "Lythe town street" —
      OK, no fixes needed; correctly resolves to Lythe itself.
1531: Thomas Kelly, destroying his own clothes in the Whitby Union
      workhouse — OK, no fixes needed; already correctly linked.
1532: William Herbert, butcher, Whitby, drunk and disorderly in
      Sandgate — OK, no fixes needed.
1533: William Blooman (cab proprietor, Ruswarp) ill-treating a horse by
      working it in an unfit state — OK, no fixes needed. Shares a
      surname with record 1466's George Blooman (Ruswarp), plausibly a
      relative — noted but not linked.

**Progress: id 1529-1533 done (5 of 5 fully resolved). A clean
batch — no fixes needed.**

## Records 1534-1538

1534: John Codling, jet worker, Whitby, drunk and riotous in Baxtergate
      — OK, no fixes needed. Same defendant as record 1307.
1535: Ann Miller, wife of Henry Miller (labourer), of the township of
      Whitby, drunk and disorderly in Henrietta Street — FIXED missing
      home on Henry Miller (9967, Whitby) — pattern #6. Eighth sighting
      of this recurring couple.
1536: William Gaskin (of Renwick's Yard in the township of Whitby) not
      sending his son Richard Gaskin to school — FIXED sex (7233,
      male). Offence location correctly resolves to Renwick's Yard per
      the truancy rule.
1537: James Raw, fisherman, Hinderwell, drunk and riotous in "Staithes
      Street" — OK, no fixes needed; correctly resolves to Staithes
      itself.
1538: David Theaker, miner, Hinderwell, drunk and disorderly in
      "Staithes town street" — OK, no fixes needed; same resolution as
      1537.

**Progress: id 1534-1538 done (5 of 5 fully resolved). 2 sex fixes, 1
pattern-#6 missing-home fix.**

## Records 1539-1543

1539: William Scales (of Cappleman's Yard in the township of Whitby)
      not sending his son Harry Scales to school — FIXED sex (7234,
      male). Offence location correctly resolves to Cappleman's Yard
      per the truancy rule.
1540: Robert Burnett (farmer, Ruswarp) assaulting James Richardson
      (farm servant, Ruswarp) — FIXED sex (7235, male). Same date (2
      April 1868) and victim as record 1543 — confirmed same-incident
      pair, two Burnetts (plausibly related) assaulting the same man.
1541: William Holmes (joiner, Egton) assaulting James Husband
      (gardener, Egton) — FIXED sex (7236, male).
1542: Thomas Batty (retired mariner, Whitby) drunk on the licensed
      premises of three named licensees — John Corner, John Henry
      Corner, and William Readman — FIXED sex (7237, 7238, 7239, all
      male). Shares a name with record 1261's Thomas Batty (seaman) —
      plausibly the same man later in life; logged as a candidate.
1543: John Burnett (farm servant, Ruswarp) assaulting James Richardson
      — OK, no fixes needed; confirmed same-incident pair with 1540.

**Progress: id 1539-1543 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate logged.**

## Records 1544-1548

1544: John Harrison (stonemason, Egton) using a lantern to catch salmon
      in the river Esk; informant James Wright (police constable,
      Egton) — FIXED sex (7241, male). Correctly resolves to River Esk.
1545: George Simpson (labourer, Whitby) found with two rabbits when
      searched at Spring Hill by William Cook, a constable of the North
      Riding, offence at Ruswarp — FIXED sex (7242, male).
1546: George Burnett (farm servant, Ruswarp) assaulting James
      Richardson — FIXED sex (7243, male). Same date and victim as
      1540 and 1543 — a third Burnett confirmed in the same-day
      incident; updating the candidate entry.
1547: John Gidney, farmer, Fylingdales, drunk and disorderly on the
      Whitby and Robin Hood's Bay highway — OK, already fixed above
      (location link).
1548: John Grier, rag gatherer, Whitby, drunk and disorderly at the
      Bridge — OK, no fixes needed.

**Progress: id 1544-1548 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry updated (now 3 Burnetts).**

## Records 1549-1553

1549: John Stainton, taking clothing provided for the poor while
      relieved in the Whitby Union workhouse — OK, no fixes needed;
      already correctly linked.
1550: John Harrison (stonemason, Egton) assaulting James Wright, one of
      the constables for the North Riding — FIXED sex (7244, male).
      Same date (30 October 1874) and same two people as record 1544
      (Harrison caught salmon-poaching by Wright) — confirmed the same
      encounter continuing into an assault; confirmed same-incident
      pair.
1551: John Simmons, sailor, home Newholm-cum-Dunsley, begging in
      Newholm Lane, offence at Newholm-cum-Dunsley — OK, no fixes
      needed.
1552: George Peart, jet worker, Whitby, drunk and riotous in "Ruswarp
      Street", offence at Ruswarp — OK, no fixes needed; correctly
      resolves to the existing "Ruswarp Street" node (a genuinely named
      street, not a Ruswarp/West-Cliff conflict). Same defendant as
      record 1371.
1553: Thomas Winspear maliciously breaking a shrub on land occupied by
      Sir George Elliott, offence at Ruswarp — OK, no fixes needed;
      Elliott's office/sex already correctly captured on this fresh
      person row from the earlier aristocrats resolution (spelled
      "Elliott" here vs "Elliot" at record 1225 — a source spelling
      variant, not a bug).

**Progress: id 1549-1553 done (5 of 5 fully resolved). 1 sex fix, 1
confirmed same-incident pair.**

## Records 1554-1558

1554: James Abram Theaker (Hinderwell) not sending his son James
      Theaker to school — FIXED sex (7246, male). No more specific site
      than the township itself is stated for his home, so offence
      location correctly resolves to Hinderwell per the truancy rule.
1555: Martin Raw, jet worker, Whitby, drunk and riotous in "Ruswarp
      Street", offence at Ruswarp — OK, no fixes needed. Same date (12
      April 1868) and location as record 1552's George Peart —
      confirmed same-incident pair.
1556: Robert Arndale (jet worker, Whitby) assaulting James Fowler;
      informants James Fowler himself and Moses Brown, both jet
      workers, Whitby — FIXED sex (7247 Fowler, 7248 Brown, both male).
      Correctly reused the same person row for victim+informant.
1557: Dinah Footy (of Staithes in the township of Hinderwell) not
      sending her daughter Sarah Footy to school — FIXED sex (7249,
      female). Offence location correctly resolves to Staithes per the
      truancy rule.
1558: Isaac Tose refusing to maintain himself and his family, whereby
      his wife Maria Toes and their five children (Eliza, Laurence,
      Isaiah, Francis, William — note the source spells the family
      "Toes" against Isaac's own "Tose", correctly preserved rather
      than normalized) became chargeable to the Whitby Union — FIXED
      sex on all six family members (Maria/Eliza female, Laurence/
      Isaiah/Francis/William male) and FIXED Isaac's own missing home:
      no township was stated for him directly, but the offence is
      explicitly at Whitby and the family became "chargeable to the
      Whitby Union" (a legal-settlement/residency signal) — inferred
      home=Whitby on that basis rather than left blank. All six
      family relationships (wife, five children) were already
      correctly captured.

**Progress: id 1554-1558 done (5 of 5 fully resolved). 11 sex fixes, 1
inferred-home fix (Isaac Tose), 1 confirmed same-incident pair.**

## Records 1559-1563

1559: Ellen Hick, wife of Isaac Hick (jet worker), of the township of
      Whitby, drunk and disorderly in "Robin Hood's Bay town street",
      offence at Fylingdales — FIXED missing home on Isaac Hick (9968,
      Whitby) — pattern #6. Sixth sighting of this recurring couple.
      Location correctly resolves to Robin Hood's Bay itself.
1560: William Verrill (of Staithes in Hinderwell) not sending his
      daughter Dinah Verrill to school — FIXED sex (7256, female).
      Offence location correctly resolves to Staithes per the truancy
      rule.
1561: William Jefferson, lodging in an outhouse, offence at Whitby —
      OK, no fixes needed (no home stated, correctly null).
1562: John Thompson (jet worker, Whitby) drunk and disorderly in the
      Market Place; informants John Nicholson (police constable) and
      John Ryder (superintendent of police), both Whitby — FIXED sex
      (7257 Nicholson, 7258 Ryder, both male). Fourteenth sighting of
      Nicholson and fourth of Ryder as superintendent — updating both
      candidate entries.
1563: John Cole, "commonly called John Carling Cole", of the township
      of Hinderwell, not sending his daughter Sarah Cole to school —
      FIXED sex (7259, female). Alias correctly captured.

**Progress: id 1559-1563 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix, 2 same-person candidate entries updated.**

## Records 1564-1568

1564: John Humpleby, lodging in an outhouse, offence at Whitby — OK, no
      fixes needed (no home stated, correctly null).
1565: John Thirlwall (jet ornament manufacturer, Whitby) assaulting
      Robert Jackson, his apprentice; informant is Jackson himself —
      FIXED sex (7260, male). Relationship (apprentice) already
      correctly captured.
1566: Henry Verrill (of Staithes in Hinderwell) not sending his
      daughter Martha Ann Verrill to school — FIXED sex (7261, female).
      Same surname and same date (10 October 1887) as record 1560's
      William Verrill (daughter Dinah) — plausibly a related family
      prosecuted together that day; logged as a candidate.
1567: George Lennard, "the younger" (labourer, Lythe), assaulting John
      Wilson — FIXED sex (7262, male) and FIXED a missing name_postfix
      ("the younger" — an existing value used elsewhere in the corpus
      — had been dropped for this record).
1568: Thomas Sedman (jet worker, Whitby) assaulting James Fowler;
      informants James Fowler and Moses Brown, both jet workers, Whitby
      — FIXED sex (7263 Fowler, 7264 Brown, both male). Same date (21
      November 1874), victim, and both witnesses as record 1556's
      Robert Arndale — confirmed a 2-person group assault on Fowler
      that day.

**Progress: id 1564-1568 done (5 of 5 fully resolved). 6 sex fixes, 1
missing name_postfix fixed, 1 confirmed same-incident group, 1
same-person candidate logged.**

## Records 1569-1573

1569: Edward Shippey, "the younger" (of Staithes in Hinderwell), not
      sending his daughter Margaret Shippey to school — FIXED sex
      (7265, female) and FIXED missing name_postfix ("the younger").
1570: Elizabeth Hodgson, Whitby, drunk — OK, no fixes needed.
1571: William Dixon (jet worker, Whitby) drunk on the licensed premises
      of Ann Thompson, refusing to leave when asked by John Nicholson,
      a police constable — FIXED sex (7266 Thompson female, 7267
      Nicholson male). Fourth sighting of Ann Thompson (also 1117,
      1126, 1505) and fifteenth of John Nicholson — updating both
      candidate entries.
1572: John Rodgers, hawker, Whitby, offering books for sale without a
      licence — OK, no fixes needed.
1573: Thomas Swales, embezzling clothing provided for the poor while
      maintained in the Whitby Union workhouse — OK, no fixes needed;
      already correctly linked.

**Progress: id 1569-1573 done (5 of 5 fully resolved). 3 sex fixes, 1
missing name_postfix fixed, 2 same-person candidate entries updated.**

## Records 1574-1578

1574: Thomas Cole, fisherman, Hinderwell, drunk and disorderly in
      "Staithes town street" — OK, no fixes needed; correctly resolves
      to Staithes itself.
1575: Thomas Dixon, jet worker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1576: John Smith and Isaac Tose embezzling two suits of clothing
      provided for the poor while maintained in the Whitby Union
      workhouse — OK, no fixes needed; already correctly linked. Same
      Isaac Tose as record 1558 (whose family became chargeable to the
      Whitby Union) — a fresh person row per this record, not merged
      (per the standing no-cross-conviction-merge policy), but the two
      records tell a connected story.
1577: Dawson Hunter (farm labourer, home Carlton in Cleveland)
      interfering with passengers' comfort "on the north line of the
      North Eastern Railway"; informants Joseph White (police
      constable, York) and David Wylman (railway porter, Whitby) —
      FIXED sex (7268 White, 7269 Wylman, both male). No location fix
      attempted for the railway line itself — found a much larger,
      messier pattern here (21 corpus-wide "North Eastern Railway"
      mentions mixing several distinct named lines and generic
      references) that needs individual reading rather than a blanket
      fix; logged as an open item in the notes file rather than guessed.
1578: George Watson (of Arguments Yard in the township of Whitby) not
      sending his son Billy Vasey Watson to school — FIXED sex (7270,
      male). Offence location correctly resolves to Arguments Yard per
      the truancy rule.

**Progress: id 1574-1578 done (5 of 5 fully resolved). 3 sex fixes, 1
open item flagged for later (North Eastern Railway naming).**

## Records 1579-1583

1579: Richard Collier (jet worker, Whitby) drunk; informant John Ryder
      (inspector of police) — FIXED sex (7271, male). Eighth sighting
      of John Ryder as inspector — updating the candidate entry.
1580: William Wilson (licensed victualler, Whitby) opening his licensed
      premises outside licensing hours; informant John Ryder
      (superintendent of police) — FIXED sex (7272, male). Fifth
      sighting of John Ryder as superintendent — updating the
      candidate entry. Same defendant as record 1131.
1581: Robinson Smithies (stonemason, of Sleights in Eskdaleside cum
      Ugglebarnby) trespassing in pursuit of conies on Thomas Jackson's
      land, offence at Eskdaleside cum Ugglebarnby — FIXED sex (7273,
      male).
1582: Elizabeth Hodgson, Whitby, drunk — OK, no fixes needed. Same
      defendant as record 1570, about 2 weeks apart.
1583: Patrick Joyce (bricklayer, Whitby) assaulting George Richard
      Lazenby; informants Lazenby himself and John Nicholson, both
      police constables, Whitby — FIXED sex (7274 Lazenby, 7275
      Nicholson, both male). Sixth sighting of Lazenby and sixteenth of
      Nicholson — updating both candidate entries. Same date (17
      October 1874) as record 1478 (Thomas Lynch assaulting Nicholson)
      — two separate assaults on two different officers the same day;
      logged as a possible connected-day candidate.

**Progress: id 1579-1583 done (5 of 5 fully resolved). 5 sex fixes, 3
same-person candidate entries updated, 1 possible connected-day
candidate logged.**

## Records 1584-1588

1584: Robert Foster, coal porter, Whitby, profane and obscene language
      in St Ann's Staith — OK, no fixes needed. Same date (29 October
      1887) and location as record 1587 (his wife) — confirmed
      same-incident domestic pair.
1585: Elizabeth Lamb (brick maker, Whitby, aged 14) stealing a
      half-crown belonging to John Robinson; informant is Robinson
      himself — FIXED sex (7276, male).
1586: Henry Hopkins exposing himself in an eating house with intent to
      insult Mary Ann Turner — FIXED sex (7277, female). No home stated
      for either, correctly null.
1587: Mary Ann Foster, wife of Robert Foster (coal porter), of the
      township of Whitby, profane and obscene language in St Ann's
      Staith — FIXED missing home on Robert Foster (9969, Whitby) —
      pattern #6. Confirmed same-incident pair with 1584. Relationship
      (wife) already correctly captured.
1588: Anthony Jackson, shoemaker, Whitby, drunk — OK, no fixes needed.

**Progress: id 1584-1588 done (5 of 5 fully resolved). 3 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-incident pair.**

## Records 1589-1593

1589: John Backhouse, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed. Same recurring name as the
      existing Backhouse candidate, dated 9 October 1874 — earlier than
      any of the other sightings; extends the timeline further back.
1590: George Martin, jet worker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed. Third sighting of this defendant
      (also 1238, 1470).
1591: Samuel Tomkins (labourer, Eskdaleside-cum-Ugglebarnby) assaulting
      Jane Knaggs, wife of William Knaggs (innkeeper), of the township
      of Ruswarp — FIXED sex (7278 Jane female, 10211 William male) and
      FIXED missing home on William Knaggs (10211, Ruswarp) — pattern
      #6.
1592: Thomas Smith assaulting John Nicholson, one of the constables for
      the North Riding — FIXED sex (7279, male). Same date (17 October
      1874) as records 1478 (Thomas Lynch assaulting Nicholson) and
      1583 (Patrick Joyce assaulting Lazenby) — a THIRD assault on a
      Whitby constable that same day; this looks less like coincidence
      and more like a genuinely disorderly day in the town. Updating
      the connected-day note and John Nicholson's candidate entry.
1593: William Thomas Wilson, jet worker, Whitby, drunk and disorderly
      in Bridge Street — OK, no fixes needed.

**Progress: id 1589-1593 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 1 same-person candidate entry extended, 1
connected-day pattern strengthened to 3 incidents.**

## Records 1594-1598

1594: Thomas Joyce assaulting John Angus, offence at Whitby — FIXED sex
      (7280, male). No home stated for either, correctly null.
1595: Isaac Hick (jet worker, Whitby) drunk and disorderly in Church
      Street; informant George Richard Lazenby (police constable,
      Whitby) — FIXED sex (7281, male). Seventh sighting of the
      recurring Hick and of Lazenby — updating both candidate entries.
1596: William Hall (Whitby) maliciously damaging an elm tree belonging
      to John Chapman Walker, esquire, offence at Ruswarp — FIXED sex
      (7282, male). "Esquire" correctly dropped as a bare honorific,
      not captured as an occupation.
1597: John Brough (beer house keeper, Whitby) keeping his licensed
      premises open after 11 p.m. — OK, no fixes needed. Fourth
      sighting of this recurring figure (also 1251, 1298, 1394).
1598: William Martin, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed. Fourth sighting of this
      recurring name (also 1118, 1130, 1511).

**Progress: id 1594-1598 done (5 of 5 fully resolved). 3 sex fixes, 2
same-person candidate entries updated.**

## Records 1599-1603

1599: Frederick Pearson (Whitby) maliciously damaging John Chapman
      Walker's elm tree, offence at Ruswarp — FIXED sex (7283, male).
      Same date, tree, and victim as record 1596 (William Hall) —
      confirmed same-incident group; see 1602 below for the third
      member.
1600: Thomas Grady, labourer, Whitby, drunk — OK, no fixes needed.
1601: Ellen Hick, wife of Isaac Hick (jet worker), of the township of
      Whitby, drunk and disorderly in Church Street; informant Miles
      Moody (inspector of police) — FIXED sex (7284 Moody male, 9970
      Isaac male) and FIXED missing home on Isaac Hick (9970, Whitby)
      — pattern #6. Eighth sighting of this couple and fifth of Miles
      Moody — updating both candidate entries.
1602: George William Sixton (Whitby) also damaging Walker's elm tree —
      FIXED sex (7285, male). Confirmed third member of the same-day
      group vandalism with 1596 and 1599.
1603: Robert Dalziel, begging in Esk Terrace, offence at Ruswarp — OK,
      no fixes needed (no home stated, correctly null).

**Progress: id 1599-1603 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed 3-person same-incident group,
2 same-person candidate entries updated.**

## Records 1604-1608

1604: Samuel Ling (miller, Lythe) drunk in charge of a horse on "the
      highway leading from Robin Hood's Bay to Stainton Dale";
      informant John Jefferson (police constable, Fylingdales) — FIXED
      sex (7286, male) and FIXED a missing location: created a new
      "Robin Hood's Bay & Stainton Dale Highway" node (id 405, under
      Highways) — the only mention of this specific route in the
      corpus, matching the two-endpoint highway convention.
1605: George Smith (Whitby) also damaging John Chapman Walker's elm
      tree — FIXED sex (7287, male). Confirmed fourth member of the
      3 November 1887 group vandalism (now with 1596, 1599, 1602).
1606: George Bland assaulting Thomas Hansell, offence at Whitby —
      FIXED sex (7288, male). No home stated for either, correctly
      null.
1607: Francis Walker (jet worker, Whitby) drunk on the licensed
      premises of Robert Knaggs, refusing to leave when asked by John
      Nicholson, a police constable — FIXED sex (7289 Knaggs, 7290
      Nicholson, both male). Eighteenth sighting of John Nicholson —
      updating the candidate entry.
1608: Thomas Hewling (Whitby) also damaging Walker's elm tree — FIXED
      sex (7291, male). Confirmed fifth member of the same group
      vandalism incident.

**Progress: id 1604-1608 done (5 of 5 fully resolved). 6 sex fixes, 1
new location created, 1 same-incident group extended to 5 people, 1
same-person candidate entry updated.**

## Records 1609-1613

1609: Elizabeth Brough (beer house keeper, Whitby) drunk; informant
      John Ryder (inspector of police) — FIXED sex (7292, male). Same
      recurring figure as record 1298. Ninth sighting of Ryder as
      inspector — updating the candidate entry.
1610: Samuel Jackson (iron moulder, Whitby) assaulting Samuel Harrison,
      one of the constables for the North Riding — FIXED sex (7293,
      male). Matches an existing "Samuel Harrison" candidate from an
      earlier session.
1611: Arthur Duck (Whitby) also damaging John Chapman Walker's elm tree
      — FIXED sex (7294, male). Confirmed sixth member of the 3
      November 1887 group vandalism.
1612: Henry George Foster (shoemaker, Whitby) beating and overdriving a
      horse; informant William Holmes (farmer, Egton), offence at Egton
      — FIXED sex (7295, male).
1613: Sophia Johnson, wife of George Johnson (miner), of the township
      of Whitby, assaulting William Arrundale (tailor, Whitby) — FIXED
      sex (7296 Arrundale, 9971 George Johnson, both male) and FIXED
      missing home on George Johnson (9971, Whitby) — pattern #6.
      Shares a name with record 1261's licensee William Arrundale, but
      a different occupation here (tailor) — not linked given the
      mismatch.

**Progress: id 1609-1613 done (5 of 5 fully resolved). 6 sex fixes, 1
pattern-#6 missing-home fix, 1 same-incident group extended to 6
people, 2 same-person candidate entries updated.**

## Records 1614-1618

1614: Thomas James Tweedy (Whitby) also damaging John Chapman Walker's
      elm tree — FIXED sex (7297, male). Confirmed seventh member of
      the 3 November 1887 group vandalism. Same recurring name as
      record 1130's Thomas James Tweedy — logged as a candidate.
1615: William Lowther (labourer, Eskdaleside-cum-Ugglebarnby) using a
      light to catch salmon; informant James Brockett (cabinet maker,
      Ruswarp), offence at Aislaby — FIXED sex (7298, male).
1616: Sophia Johnson, wife of George Johnson (miner), of the township
      of Whitby, wilfully damaging a door key belonging to Marshall
      Pearson; informant William Arrundale (tailor, Whitby) — FIXED sex
      (7299 Pearson, 7300 Arrundale, both male) and FIXED missing home
      on George Johnson (9972, Whitby) — pattern #6. Same date (31 July
      1874) and same informant Arrundale as record 1613 — confirmed the
      same underlying day/incident, told as two separate charges
      (assault + property damage) against Sophia.
1617: John Robert Saddler (Whitby) also damaging Walker's elm tree —
      FIXED sex (7301, male). Confirmed eighth member of the same
      group vandalism.
1618: George Johnson (labourer, Whitby) assaulting Thomas Smith
      (earthenware dealer, Whitby) — FIXED sex (7302, male). Different
      occupation and 7 years apart from the Sophia/George Johnson
      couple above (miner, 1874) — not linked given the mismatch.

**Progress: id 1614-1618 done (5 of 5 fully resolved). 7 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-day/two-charge incident,
1 same-incident group extended to 8 people, 1 same-person candidate
logged.**

**The 21-record "North Eastern Railway" open item from earlier this
session was resolved with the user** (see the dedicated section in
`reextraction-audit-notes.md`): created Stockton & Whitby Railway (406),
Whitby & Loftus Railway (407), Whitby (Town) Station (408), Glaisdale
Station (409), and Railway Warehouse (410); linked all named-line/named-
site records to them; left the genuinely generic company-property
mentions unlinked per the user's "these are really places" guidance.

## Records 1619-1623

1619: James Goodchap (miner, Hinderwell) drunk on the licensed premises
      of John Featherstone; informants Alfred Barker (sergeant of
      police) and William Hammond (police constable), both Hinderwell
      — FIXED sex (7303 Featherstone, 7304 Barker, 7305 Hammond, all
      male). Matches existing candidates for both Barker and Hammond —
      updating both entries.
1620: James Sunley (Whitby) also damaging John Chapman Walker's elm
      tree — FIXED sex (7306, male). Confirmed ninth member of the 3
      November 1887 group vandalism.
1621: Peter Kelly (labourer, Whitby) assaulting Thomas Smith
      (earthenware dealer, Whitby); informant is Smith himself — FIXED
      sex (7307, male). Same victim and exact date (26 December 1867)
      as record 1618 (George Johnson also assaulting Smith) — confirmed
      a 2-person group assault on Smith that day.
1622: Thomas Weatherill (jet worker, Whitby) drunk in Church Street;
      informants George Hewison and Mark Boggett, both police
      constables, Whitby — FIXED sex (7308 Hewison, 7309 Boggett, both
      male). Source text carries an archival "[Dated October in text,
      but endorsed November]" annotation — added an `anomalies` note.
      Found a broader pattern of 24 similar "dated X but endorsed Y"
      records corpus-wide; logged as a low-priority documentation-only
      follow-up rather than swept now.
1623: Thomas Haslam (labourer, Hinderwell) begging in "Staithes Lane" —
      FIXED a location gap: was linked to the coarser "Staithes"
      township instead of the existing specific "Staithes Lane" node
      (id 402, already used by record 1042); replaced the coarser link
      with the specific one, matching the specific-site convention.

**Progress: id 1619-1623 done (5 of 5 fully resolved). 7 sex fixes, 1
location-specificity fix, 1 new anomalies entry (+ a documentation-only
follow-up item logged), 1 confirmed same-incident pair, 2 same-person
candidate entries updated.**

## Records 1624-1628

1624: John Wilson (labourer, Whitby) drunk and riotous in Church
      Street; informant John Norman (police constable, Whitby) — FIXED
      sex (7310, male). Second sighting of Norman (also 1355) —
      logging as a candidate.
1625: Robert Foster (fisherman, Whitby) drunk and disorderly in
      Haggersgate; informant Samuel Harrison (police constable,
      Whitby) — FIXED sex (7311, male). Matches the existing Samuel
      Harrison candidate.
1626: Joseph Fishburn, labourer, Whitby, drunk and disorderly at the
      Pier — OK, no fixes needed.
1627: Joseph Dean (blacksmith, Whitby) resisting William Preston, one
      of the constables for the North Riding; informant is Preston
      himself — FIXED sex (7312, male).
1628: William Stokill (cabinet maker, Whitby) drunk on the licensed
      premises of John Booth, refusing to leave when asked by John
      Nicholson; informants Nicholson and "[blank] Booth", wife of John
      Booth (innkeeper), both Whitby — FIXED sex (7313 Nicholson male,
      7314 wife female, 10212 John Booth male) and FIXED missing home
      on John Booth (10212, Whitby) — pattern #6. This "[blank] Booth"
      case was already correctly structured (blank first name, husband
      stub, relationship all present) — no bug, just the routine
      sex/home gaps. Nineteenth sighting of John Nicholson — updating
      the candidate entry.

**Progress: id 1624-1628 done (5 of 5 fully resolved). 6 sex fixes, 1
pattern-#6 missing-home fix, 2 same-person candidates
logged/confirmed.**

## Records 1629-1633

1629: William Agar, jet worker, Whitby, indecent behaviour in All
      Saints' Church during divine service, offence at Hawsker cum
      Stainsacre — OK, no fixes needed. Same date (6 November 1887) and
      location as record 1632 — confirmed same-incident pair.
1630: William Pattison assaulting William Preston, offence at Whitby —
      FIXED sex (7315, male). Same date (1 January 1868) and same
      victim as record 1627 (Joseph Dean resisting Preston) — Preston
      was resisted and then assaulted the same day; confirmed connected
      incident. No home/occupation stated for Pattison here (unlike
      1633 below), correctly left null rather than inherited.
1631: Ellen Hicks, Whitby, intoxicated on Picton railway station,
      offence at Picton, case heard at South Stockton — OK, no fixes
      needed; a genuinely out-of-area record, already correctly
      captured (court location South Stockton, offence at the existing
      Picton Railway Station node) from an earlier session.
1632: Christopher Parker Peacock, jet worker, Whitby, All Saints'
      Church — OK, no fixes needed; confirmed same-incident pair with
      1629.
1633: William Pattison (jet worker, Whitby) assaulting John English
      (labourer, Whitby) — FIXED sex (7316, male). Same defendant and
      exact date (1 January 1868) as record 1630 — a further entry in
      this William Pattison's long-running pattern of same-day
      multi-victim sprees.

**Progress: id 1629-1633 done (5 of 5 fully resolved). 2 sex fixes, 2
confirmed same-incident pairs.**

## Records 1634-1638

1634: Jane Joyce, wife of Patrick Joyce (bricklayer), of the township
      of Whitby, obscene language in Church Street — FIXED missing home
      on Patrick Joyce (9973, Whitby) — pattern #6. Same Patrick Joyce
      as record 1583.
1635: David John Barnett, jet worker, Whitby, All Saints' Church — OK,
      no fixes needed; third confirmed member of the 6 November 1887
      same-incident pair (now a trio with 1629, 1632).
1636: John Codling, jet worker, Whitby, drunk — OK, no fixes needed.
      Recurring name (also 1307, 1534).
1637: George Jackson, begging in "Staithes town street", offence at
      Hinderwell — OK, no fixes needed; correctly resolves to Staithes
      itself. Added an `anomalies` note for the source's own "dated 13
      January but endorsed 30 January" discrepancy (part of the
      documentation-only pattern noted at record 1622).
1638: Francis Fewster, jet worker, Whitby, drunk and disorderly on the
      Pier — OK, no fixes needed.

**Progress: id 1634-1638 done (5 of 5 fully resolved). 1 pattern-#6
missing-home fix, 1 new anomalies entry, 1 same-incident trio
confirmed.**

## Records 1639-1643

1639: William Pattison, jet worker, Whitby, drunk and riotous in
      Bridge End — OK, no fixes needed. Third conviction for this
      defendant on 1 January 1868 (also 1630, 1633) — extending his
      same-day spree pattern.
1640: George McLaughlin (pedlar, Whitby) assaulting John Jefferson, one
      of the constables for the North Riding, offence at Fylingdales —
      FIXED sex (7317, male). Same defendant and exact date (5 January
      1875) as record 1263 — confirmed same-person/same-day. Also
      matches the recurring John Jefferson candidate (also 1416).
1641: James Marshall, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed.
1642: John Brand, carpenter, Whitby, drunk — OK, no fixes needed.
      Matches an existing "Andrew Harland/John Brand same-day"
      candidate from an earlier session.
1643: John Noble (jet worker, Whitby) drunk and disorderly on Boulby
      Bank; informant Samuel Harrison (police constable, Whitby) —
      FIXED sex (7318, male). Same recurring defendant as 1449/1452 and
      matches the existing Samuel Harrison candidate — updating it.

**Progress: id 1639-1643 done (5 of 5 fully resolved). 2 sex fixes, 2
same-person candidates confirmed/updated.**

## Records 1644-1648

1644: William Dixon, labourer, Mickleby, begging in "Mickleby town
      street" — OK, no fixes needed; correctly resolves to Mickleby
      itself.
1645: Matthew Robinson (home Newholm-cum-Dunsley) drunk and disorderly
      on licensed premises, refusing to leave when asked by William
      Tillson, a police constable, offence at Lythe — FIXED sex (7319,
      male).
1646: Samuel Jackson (moulder, Whitby) drunk on the licensed premises
      of Thomas Bryan, refusing to leave when asked by John Nicholson —
      FIXED sex (7320 Bryan, 7321 Nicholson, both male). Same recurring
      defendant as record 1260 (assaulted Nicholson there). Twentieth
      sighting of John Nicholson — updating the candidate entry.
1647: William Anderson, labourer, Ugthorpe, begging in "Ugthorpe town
      street" — OK, no fixes needed; correctly resolves to Ugthorpe
      itself.
1648: William Eccles (labourer, Lythe) trespassing in pursuit of game
      on land in the possession of the Marquis of Normanby — OK, no
      fixes needed; Constantine Henry Phipps's full name/office/sex
      already correctly captured on this fresh person row, matching the
      established aristocrats convention exactly.

**Progress: id 1644-1648 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry updated.**

## Records 1649-1653

1649: George Barff (farmer, Mickleby) ill-treating a dog; informant
      George Stephenson (farm servant, Mickleby) — FIXED sex (7323,
      male).
1650: Alfred Johnson (labourer, Sleights) assaulting John William
      Johnson, aged eight, offence at Whitby — FIXED sex (7324, male).
      Same defendant and date (10 December 1887) as record 1653 below —
      confirmed same-day spree.
1651: Thomas Mitchell, begging in York Terrace, offence at Ruswarp —
      OK, no fixes needed (no home stated, correctly null; York Terrace
      correctly under West Cliff per the sweep).
1652: Jonathan Hall (tailor, Whitby) assaulting Ellen Martin, wife of
      William Martin (jet worker), of the township of Whitby — FIXED
      sex (7325 Ellen female, 10213 William male) and FIXED missing
      home on William Martin (10213, Whitby) — pattern #6. Matches the
      recurring William Martin name (also 1118, 1130, 1511, 1598).
1653: Alfred Johnson again, drunk in charge of a pony and cart in
      Victoria Square — OK, no fixes needed; confirmed same-day spree
      with 1650.

**Progress: id 1649-1653 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-day spree.**

## Records 1654-1658

1654: William Lawson (home Newholm-cum-Dunsley) drunk and disorderly on
      licensed premises, refusing to leave when asked by William
      Tillson, a police constable, offence at Lythe — FIXED sex (7326,
      male). Same date and officer as record 1645 — a second defendant
      from the same incident/premises; confirmed same-incident pair.
      Second sighting of Tillson — updating the candidate entry.
1655: John Conwell (jet worker, Whitby) drunk and disorderly in
      Baxtergate; informants Robert Needham (police constable) and
      Thomas Ridley (sergeant of police), both Whitby — FIXED sex
      (7327 Needham, 7328 Ridley, both male). Same recurring defendant
      as record 1496. Fourth sighting of Needham — updating the
      candidate entry.
1656: William Featherstone (Whitby) not sending his daughter Amelia
      Featherstone to school — FIXED sex (7329, female). Matches the
      recurring William Featherstone (sailor) candidate (also 1353,
      1428, 1460) — updating it, though no occupation is stated in
      this particular record.
1657: Eliza Dale (singlewoman, Whitby) wilfully damaging a window
      belonging to Sovina Short — OK, no fixes needed; Short's sex
      already correctly inferred female from an unusual but real name.
1658: Thomas Puckett (ironstone miner, Hinderwell) using an iron
      stemmer contrary to the Coal Mines Regulation Act 1872 — OK, no
      fixes needed.

**Progress: id 1654-1658 done (5 of 5 fully resolved). 4 sex fixes, 1
confirmed same-incident pair, 3 same-person candidate entries
updated.**

## Records 1659-1663

1659: George McLaughlin (grinder, Whitby) drunk; informant Charles
      Tempest Clarkson (superintendent of police) — FIXED sex (7331,
      male). Fifth sighting of Clarkson — updating the candidate entry.
1660: William Ward (labourer, home Loftus) drunk and disorderly in
      "Staithes town street"; informant William Hammond (police
      constable, Hinderwell), offence at Hinderwell — FIXED sex (7332,
      male). Correctly resolves to Staithes itself. Fourth sighting of
      Hammond — updating the candidate entry.
1661: Mary Delany, singlewoman, Whitby, drunk and disorderly in New Way
      Ghaut — OK, no fixes needed.
1662: Charlotte Constable, begging in St Hilda's Terrace, offence at
      Ruswarp — OK, no fixes needed (no home stated, correctly null).
1663: Jane Peart, wife of George Peart (jet worker), assaulting Miriam
      Featherstone, wife of William Featherstone (sailor), both of the
      township of Whitby — FIXED sex (7333 Miriam female, 9974 George
      male, 10214 William male) and FIXED missing home on both George
      Peart and William Featherstone (both Whitby) — pattern #6 on
      each. **Not a duplicate of record 1371** despite the same names
      and near-identical text — this one is dated 22 February 1875
      (with a fuller informant clause) while 1371 is dated 23 February
      1875 — Jane Peart assaulted Miriam Featherstone on two
      consecutive days. Correcting the earlier same-person-candidates
      note, which had this as a single-day event.

**Progress: id 1659-1663 done (5 of 5 fully resolved). 5 sex fixes, 2
pattern-#6 missing-home fixes, 2 same-person candidate entries updated,
1 candidate note corrected.**

## Records 1664-1668

1664: Samuel E. Clymer, seaman, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1665: Catherine Nugent, begging in Victoria Square, offence at Ruswarp
      — OK, no fixes needed (no home stated, correctly null).
1666: Isaac Hick (jet worker, Whitby) drunk on the licensed premises of
      Joseph Marsay; informants John Nicholson and Marsay himself,
      licensed victualler — FIXED sex (7334 Nicholson, 7335 Marsay,
      both male). Ninth sighting of Isaac Hick and twenty-first of John
      Nicholson — updating both candidate entries. Also another
      sighting of the recurring Joseph Marsay.
1667: John Wood, hawker, Ruswarp, begging in Mayfield Place — OK, no
      fixes needed.
1668: Francis Schofield, miner, home Eskdaleside-cum-Ugglebarnby, drunk
      and riotous in Church Street, offence at Whitby — OK, no fixes
      needed.

**Progress: id 1664-1668 done (5 of 5 fully resolved). 2 sex fixes, 2
same-person candidate entries updated.**

## Records 1669-1673

1669: James Marshall (jet worker, Whitby) drunk and disorderly in
      Church Street; informant John Nicholson — FIXED sex (7336,
      male). Twenty-second sighting of Nicholson — updating the
      candidate entry.
1670: Thomas Allison, jet worker, Whitby, drunk and disorderly in the
      Old Market Place — OK, no fixes needed.
1671: Ann Reeve, common prostitute, indecent behaviour in Church
      Street, offence at Whitby — OK, no fixes needed (no home stated,
      correctly null).
1672: William Lawson (labourer, home Newholm-cum-Dunsley) drunk on the
      licensed premises of Thomas Crosby, refusing to leave when asked
      by George Richard Lazenby — FIXED sex (7337 Crosby, 7338
      Lazenby, both male). Eighth sighting of Lazenby — updating the
      candidate entry.
1673: Andrew Thompson, labourer, Whitby, begging in Baxtergate — OK, no
      fixes needed.

**Progress: id 1669-1673 done (5 of 5 fully resolved). 3 sex fixes, 2
same-person candidate entries updated.**

## Records 1674-1678

1674: Joseph Chapman frequenting Church Street, "which leads to the
      river Esk", for an unlawful purpose, offence at Whitby — OK, no
      fixes needed (no home stated, correctly null). Captured with both
      Church Street and River Esk as locations of offence, consistent
      with the source explicitly naming both — a defensible reading,
      not treated as an error.
1675: William Dixon (jet worker, Whitby) drunk on the licensed premises
      of Joseph Marsay, refusing to leave when asked by Edward Weeks, a
      police constable — FIXED sex (7339 Marsay, 7340 Weeks, both
      male). Same date (31 March 1875) and premises as the earlier
      confirmed 3-person Marsay incident (records 1114/1180/1186), but
      a different informant (Weeks rather than Hall/Nicholson) —
      logged as a plausible fourth member, weaker link given the
      informant mismatch.
1676: John Nuttall, labourer, home Newholm-cum-Dunsley, begging in East
      Row, offence at Newholm-cum-Dunsley — OK, no fixes needed.
1677: Daniel Robinson (labourer, Whitby) assaulting John Griffiths (jet
      worker, Whitby); informant is Griffiths himself — FIXED sex
      (7341, male).
1678: Henry William Plaxton (fruiterer, Whitby) drunk and disorderly in
      Church Street; informants John Nicholson and George Richard
      Lazenby, both police constables — FIXED sex (7342 Nicholson,
      7343 Lazenby, both male). Twenty-third sighting of Nicholson and
      ninth of Lazenby — updating both candidate entries.

**Progress: id 1674-1678 done (5 of 5 fully resolved). 5 sex fixes, 2
same-person candidate entries updated, 1 new (weaker) candidate
logged.**

## Records 1679-1683

1679: Frederick Clark (jet worker, Whitby) assaulting Edmund Barrett,
      offence "on or about 2 July 1887" — FIXED sex (7344, male) and
      FIXED a genuinely empty `offence_date` field despite
      `offence_date_raw` correctly holding "on or about 2 July 1887" —
      populated it as 1887-07-02 (the text does state a specific date,
      just with an "on or about" qualifier; not fabrication).
1680: Francis Feaster, jet worker, Whitby, drunk — OK, no fixes needed.
1681: Robert Burnett (farm servant, Hawsker cum Stainsacre) driving a
      waggon drawn by three horses furiously in Baxtergate, offence at
      Whitby — OK, no fixes needed. Shares a name with the recurring
      Burnett candidates but a different township/occupation from the
      Ruswarp farmer family (1540/1543/1546) — not linked.
1682: Henry Joyce, jet worker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1683: Robert Frankland not maintaining himself and his family, whereby
      his wife Hannah Frankland and their son Robert Frankland (Jr)
      became chargeable to the Whitby Union — FOUND a real relationship
      bug: Hannah's "wife" relationship pointed to her son (7346)
      instead of her husband (1765). FIXED by repointing it to 1765.
      FIXED sex (7344 → male, already done above; 7345 Hannah female)
      and inferred Robert Sr's home as Whitby (4) from "became
      chargeable to the Whitby Union", matching the record 1558 (Isaac
      Tose) precedent.

**Progress: id 1679-1683 done (5 of 5 fully resolved). 3 sex fixes, 1
real relationship-pointer bug fixed, 1 empty offence_date field filled
in from its own raw text, 1 inferred-home fix.**

**Scope check**: searched for other "wife/husband relationship pointing
at a person who is themselves someone else's child" — the exact shape
of the 1683 bug — across the whole corpus. Zero other matches; confirmed
isolated, not swept further.

## Records 1684-1688

1684: Hannah Burns (singlewoman, Whitby) using obscene language;
      informant Thomas Archer (inspector of police) — FIXED sex (7347,
      male). Third sighting of Archer — updating the candidate entry.
1685: Charles Robson, labourer, Whitby, drunk and disorderly in
      Victoria Square — OK, no fixes needed.
1686: William Turnbull (stonemason, home Loftus) drunk and riotous in
      "Staithes High Street"; informant Thomas Stamper Dale (police
      constable, Hinderwell) — FIXED sex (7348, male); correctly
      resolves to the existing "High Street" node under Staithes (a
      genuinely distinct street from Staithes Lane/Street). Fourth
      sighting of Dale — updating the candidate entry.
1687: James Nellist (miner, Eskdaleside-cum-Ugglebarnby) trespassing in
      pursuit of conies on land in the possession of John Watson,
      offence at Egton — FIXED sex (7349, male). Matches record 1350's
      recurring landowner John Watson.
1688: Francis Jackson, labourer, Ruswarp, begging in "Ruswarp Town
      Street" — OK, no fixes needed; correctly resolves to Ruswarp
      itself.

**Progress: id 1684-1688 done (5 of 5 fully resolved). 3 sex fixes, 2
same-person candidate entries updated, 1 new candidate logged.**

## Records 1689-1693

1689: John Blakeley (plasterer, Whitby) assaulting Samuel Braithwaite
      (photographer, Whitby); informant is Braithwaite himself — FIXED
      sex (7350, male).
1690: John Wood (labourer, home Eskdaleside-cum-Ugglebarnby) owning a
      cow and heifer found straying on "the Ugglebarnby and Littlebeck
      highway"; informant Andrew Thompson (police constable, Ruswarp)
      — FIXED sex (7351, male) and FIXED a missing location link to the
      existing "Ugglebarnby & Littlebeck Highway" node (id 19). Scope
      check found two more gaps for the same highway (4985, 5065) and
      fixed both alongside this one.
1691: Richard Rooke (butcher, Whitby) drunk in charge of a horse and
      cart in "Staithes Lane", offence at Hinderwell — FIXED a missing
      location-specificity fix: was linked to the coarser "Staithes"
      instead of the existing "Staithes Lane" node (id 402). Same gap
      as record 1623; scope check found five more "Staithes Lane"
      offence-location gaps (1722, 1725, 2792, 3168, 5091) and fixed
      all alongside this one. Also found a **distinct related place**,
      "Staithes Lane End" (an existing node, id 378, already used by
      record 13) — ten more records use this exact phrase (mostly
      begging convictions and three "of Staithes Lane End" home
      statements); fixed all: six offence-location links (2014, 2538,
      2915, 4313, 4573, 4954) and three home-location upgrades from the
      coarser Staithes/Hinderwell (1444, 4483, 5565). Self-caught and
      corrected a slip mid-fix: briefly created a duplicate "Staithes
      Lane End" node before noticing the existing one and deleting the
      duplicate.
1692: Newark Legg (butcher, Ruswarp) having unwholesome meat for sale;
      informant Hugh McGregor (inspector of nuisances, Ruswarp) —
      FIXED sex (7352, male).
1693: William Lund (jet worker, Whitby) drunk on the licensed premises
      of Edwin Marshall, refusing to leave when asked by Robert
      Needham — FIXED sex (7353 Marshall, 7354 Needham, both male).
      Fifth sighting of Needham — updating the candidate entry.

**Progress: id 1689-1693 done (5 of 5 fully resolved). 5 sex fixes, 2
missing-highway-link fixes (3 more found via scope check), 1
location-specificity fix with a much larger "Staithes Lane End" sweep
(9 more records fixed), 1 same-person candidate entry updated.**

## Records 1694-1698

1694: Francis Chapman, alias Hook (labourer, Ruswarp), lodging in the
      open air in Spring Vale — OK, no fixes needed; alias correctly
      captured.
1695: John Quinn assaulting Sarah Wilson Cunvin, aged five, offence at
      Whitby — FIXED sex (7355, female). No home stated for either,
      correctly null.
1696: David Theaker (miner, Hinderwell) drunk in "Runswick town
      street"; informant William Hammond (police constable, Hinderwell)
      — FIXED sex (7356, male). Checked whether this should resolve to
      the separate plain "Runswick" node (298) instead of "Runswick
      Bay" (169) — confirmed consistent with three other "Runswick town
      street" records (3753/3807/3825), all resolving to Runswick Bay;
      Runswick and Runswick Bay are the same real fishing village
      historically, not a bug. Fifth sighting of Hammond — updating the
      candidate entry.
1697: Shafto Pearson Richardson, licensed victualler, Whitby, drunk in
      Baxtergate — OK, no fixes needed.
1698: William Farndale (servant in husbandry, Egton) assaulting Ann
      Miller (domestic servant, Eskdaleside), offence at Eskdaleside —
      FIXED sex (7357, female).

**Progress: id 1694-1698 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry updated, 1 location choice double-checked
and confirmed correct.**

## Records 1699-1703

1699: Hannah Santon, wife of Christopher Viscent Santon (labourer),
      assaulting Kezia Belt, wife of Benjamin Belt (blacksmith), both
      of the township of Whitby — FIXED sex (7358 Kezia female, 9975
      Christopher male, 10215 Benjamin male) and FIXED missing homes on
      both husbands (Whitby) — pattern #6 on each.
1700: Robert Wilson (fish dealer, Whitby) drunk on the licensed
      premises of Shafto Pearson Richardson — FIXED sex (7359, male).
      Same date (6 July 1887) and premises as record 1703 — confirmed
      same-incident pair.
1701: William Wilson (mason, Egton) assaulting Richard Francis
      Dickinson (farmer, Egton), offence at Eskdaleside — FIXED sex
      (7360, male).
1702: George Noble (farm servant, Hawsker cum Stainsacre) too far from
      his cart to control the horse, offence at Whitby — OK, no fixes
      needed.
1703: Patrick Joyce (bricklayer, Whitby) also drunk on Shafto Pearson
      Richardson's licensed premises — FIXED sex (7361, male). Third
      sighting of this recurring Patrick Joyce (also 1583, 1634) and
      confirmed same-incident pair with 1700.

**Progress: id 1699-1703 done (5 of 5 fully resolved). 6 sex fixes, 2
pattern-#6 missing-home fixes, 1 confirmed same-incident pair.**

## Records 1704-1708

1704: Thomas Sneaton, mariner, Whitby, drunk — OK, no fixes needed.
1705: John Aldwinkle (furnaceman, Eskdaleside-cum-Ugglebarnby)
      assaulting Joseph Lawson (licensed victualler); witnesses
      "[blank] Lawson", his wife, Richard Dickinson (labourer), and
      William Swales (farmer), all Eskdaleside — FIXED sex (7362
      Joseph male, 7363 wife female, 7364 Dickinson male, 7365 Swales
      male). Wife relationship already correctly captured despite the
      blank first name. Shares a name with record 1350's landowner
      Joseph Lawson but different township/occupation — not linked.
1706: Isabella Bryan, wife of William Bryan (stonemason), of the
      township of Whitby, drunk and disorderly in Victoria Square —
      FIXED missing home on William Bryan (9976, Whitby) — pattern #6.
1707: John Fletcher, an apprentice seaman aboard the ship "Garland",
      deserting and later found at Hawsker cum Stainsacre — OK, no
      fixes needed (no home stated, correctly null; occupation
      reasonably summarized as "apprentice seaman" from the fuller
      description).
1708: Robert Parks (butcher, Hinderwell) having an unjust scale;
      informant John Ryder, superintendent of police and inspector of
      weights and measures — FIXED sex (7366, male). Sixth sighting of
      Ryder as superintendent — updating the candidate entry.

**Progress: id 1704-1708 done (5 of 5 fully resolved). 6 sex fixes, 1
pattern-#6 missing-home fix, 1 same-person candidate entry updated.**

## Records 1709-1713

1709: William Newton (beerhouse keeper, Fylingdales) drunk on the
      licensed premises of John Russell — FIXED sex (7367, male). Same
      recurring defendant as record 927.
1710: Thomas Pattison, jet worker, Whitby, drunk and riotous in Grape
      Lane — OK, no fixes needed.
1711: Joseph Toes (rag gatherer, Hinderwell) wilfully damaging a
      policeman's coat; informants William Hammond and Thomas Hodgson
      (butcher), both Hinderwell — FIXED sex (7368 Hammond, 7369
      Hodgson, both male). Same recurring name as the Joseph Tose
      candidate (spelling variant "Toes" here). Sixth sighting of
      Hammond — updating the candidate entry.
1712: John Henry Smith, fish hawker, Whitby, drunk and disorderly in
      Henrietta Street — OK, no fixes needed. Same recurring defendant
      as records 1270/1273.
1713: Robert Pearson (cartman, Hinderwell) driving a cart furiously on
      "the highway called Hinderwell Street"; informant James Wright
      (police constable, Hinderwell) — FIXED sex (7370, male) and FIXED
      a missing location link to the existing "Hinderwell Street" node
      (id 361, already used by record 611). Scope check found four more
      gaps for this street (1716, 1728, 2914, 3492) and fixed all
      alongside this one. This James Wright (Hinderwell) is a different
      township from record 1544's James Wright (Egton) — not linked.

**Progress: id 1709-1713 done (5 of 5 fully resolved). 4 sex fixes, 5
missing-location links fixed (4 out-of-sequence), 1 same-person
candidate entry updated.**

## Records 1714-1718

1714: Thomas Thompson, Stephen Kingston, and John Harrison (all jet
      workers, Whitby) wilfully damaging grass belonging to John
      Turner, offence at Hawsker cum Stainsacre — FIXED sex (7371,
      male).
1715: Michael O'Brien, labourer, Whitby, drunk and disorderly in
      Henrietta Street — OK, no fixes needed.
1716: George Wake (cartman, Hinderwell) driving a cart furiously on the
      highway called Hinderwell Street; informant James Wright (police
      constable, Hinderwell) — FIXED sex (7372, male); location already
      fixed above. Same date, street, and officer as record 1713
      (Robert Pearson) — confirmed same-day pair, two cartmen driving
      furiously on the same street that day.
1717: George Burnett (miller, Hawsker cum Stainsacre) owning two cows
      and a calf found straying on "the Hawsker and Mitten Hill
      highway"; informant Hannah Lacy, wife of William Lacy (farmer),
      of the township of Hawsker cum Stainsacre — FIXED sex (7373
      Hannah female, 10216 William male) and FIXED missing home on
      William Lacy (10216, Hawsker-cum-Stainsacre) — pattern #6. No
      existing location node for "Hawsker and Mitten Hill" highway —
      checked scope (single mention only) and left unlinked rather than
      create a node for a one-off; noted for awareness.
1718: William Small, of William Street, Scarborough, assaulting John
      Newton, offence at Fylingdales — FIXED sex (7374, male); "William
      Street" already correctly parented under Scarborough (255), not
      confused with any Whitby-area street of the same name — verified,
      not a bug.

**Progress: id 1714-1718 done (5 of 5 fully resolved). 5 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-day pair.**

**Self-caught cleanup**: found that the earlier "Staithes Lane" (6
records) and "Staithes Lane End" (6 records) out-of-sequence fixes had
only *added* the specific-site link without removing the coarser
"Staithes" township link they already carried — inconsistent with the
established "specific site replaces the coarser link" convention (which
I did apply correctly for the single record 1623 in the same batch).
Fixed by deleting the redundant "Staithes" link from all 12 affected
records (1691, 1722, 1725, 2792, 3168, 5091, 2014, 2538, 2915, 4313,
4573, 4954).

## Records 1719-1723

1719: Ann Galleway, common prostitute, indecent behaviour in Church
      Street, offence at Whitby — OK, no fixes needed (no home stated,
      correctly null).
1720: Thomas Murphy, begging in "Hinderwell town street", offence at
      Hinderwell — OK, no fixes needed; correctly resolves to
      Hinderwell itself.
1721: Thomas Howard (of Arguments Yard in Whitby) not sending his
      daughter Caroline Howard to school — FIXED sex (7375, female —
      self-caught a slip where I first set this to male by mistake in
      a batched UPDATE, corrected immediately). Offence location
      correctly resolves to Arguments Yard per the truancy rule.
1722: Walter Thompson, home South Stockton, fish hawker, drunk and
      riotous in Staithes Lane, offence at Hinderwell — OK, already
      fixed above (location link + duplicate cleanup).
1723: Charles Aaron Blackstone (jet worker, Whitby) drunk and
      disorderly on Marine Parade; informants William Matson
      (shoemaker) and John Ryder (superintendent of police) — FIXED sex
      (7376 Matson, 7377 Ryder, both male). Seventh sighting of Ryder
      as superintendent — updating the candidate entry. Matches the
      recurring Charles Aaron Blackstone/Blakeston candidate.

**Progress: id 1719-1723 done (5 of 5 fully resolved). 3 sex fixes (1
self-corrected), 12 duplicate-location links cleaned up, 1 same-person
candidate entry updated.**

## Records 1724-1728

1724: Thomas Siddle (hawker, home Scarborough) damaging a garden door
      and two door posts belonging to George Fawcett, offence at
      Ruswarp — FIXED sex (7378, male). Same date (16 July 1887) and
      victim as record 1727 — confirmed same-incident pair.
1725: William Turnbull, home South Stockton, fish hawker, drunk and
      riotous in Staithes Lane, offence at Hinderwell — OK, already
      fixed above (location link + duplicate cleanup).
1726: Charles Partridge and George Dodd, both miners, home Liverton,
      trespassing in pursuit of game on land in the possession of
      William Pearson and others, offence at Roxby — FIXED sex (7379,
      male).
1727: Isaac Carlton (jet worker, Whitby) also damaging George
      Fawcett's garden door and posts — FIXED sex (7380, male).
      Confirmed same-incident pair with 1724.
1728: John Sanderson, waggoner, Hinderwell, driving a waggon furiously
      on the highway called Hinderwell Street — OK, already fixed
      above (location link). Third man driving furiously on Hinderwell
      Street on 27 September 1867 (also 1713, 1716) — updating the
      candidate entry to a trio.

**Progress: id 1724-1728 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate entry extended
to a trio.**

## Records 1729-1733

1729: Francis Murray, metal carrier, Glaisdale, on the Stockton and
      Whitby branch after being warned off — OK, already fixed above
      (part of the resolved North Eastern Railway sweep).
1730: Robert Robinson (jet worker, Whitby) also damaging George
      Fawcett's garden door and posts — FIXED sex (7382, male). Third
      member of the 16 July 1887 garden-damage incident (with 1724,
      1727) — updating the candidate entry.
1731: James Mackey (shoemaker, Whitby) wilfully damaging a geranium
      plant in Whitby cemetery; informant James Webster (gardener,
      Hawsker cum Stainsacre) — FIXED sex (7383, male).
1732: Samuel Jones, begging in "Goldsborough town street", offence at
      Lythe — OK, no fixes needed; correctly resolves to Goldsborough
      itself.
1733: Thomas Siddle again, stealing onions belonging to George
      Fawcett, growing in his garden — FIXED sex (7384, male). Same
      date, victim, and defendant as record 1724 — a second charge
      from the same incident/visit to Fawcett's garden.

**Progress: id 1729-1733 done (5 of 5 fully resolved). 4 sex fixes, 1
same-person candidate entry extended (now 4 people plus a repeat
charge).**

## Records 1734-1738

1734: Thomas Riding assaulting Christiana Agar, offence at Whitby —
      FIXED sex (7385, female). No home stated for either, correctly
      null.
1735: Joseph Marshall, keeping a dog without a licence, offence at
      Whitby — OK, no fixes needed (no home stated, correctly null).
1736: Isaac Carlton also stealing onions from George Fawcett's garden
      — FIXED sex (7386, male). Fifth member (and second charge) of the
      16 July 1887 Fawcett garden incident; updating the candidate
      entry.
1737: John Robinson (fruiterer, Whitby) assaulting John Burton
      (labourer, Whitby); informant is Burton himself — FIXED sex
      (7387, male).
1738: Johnson Cross, keeping a dog without a licence, offence at
      Ruswarp — OK, no fixes needed (no home stated, correctly null).

**Progress: id 1734-1738 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry extended.**

## Records 1739-1743

1739: Robert Robinson also stealing onions from George Fawcett's garden
      — FIXED sex (7388, male). Sixth confirmed member of the Fawcett
      garden incident — updating the candidate entry.
1740: Peter Harrison (jet worker, Whitby), apprentice of William Wright
      (jet ornament manufacturer), threatening to stab foreman George
      Robinson and neglecting his work — FIXED sex (7389 Robinson,
      10289 Wright, both male). Apprentice/master relationship already
      correctly captured.
1741: John Thompson, begging in "East Row town street", offence at
      Newholm-cum-Dunsley — OK, no fixes needed; correctly resolves to
      East Row itself.
1742: Thomas Siddle (hawker, Scarborough) damaging a garden door
      belonging to Joseph Readman, offence at Ruswarp — FIXED sex
      (7390, male). Same date (16 July 1887) as the Fawcett incident
      but a different victim — Siddle apparently on a spree of garden
      vandalism across Ruswarp that day; logged as a related but
      separate incident.
1743: William Child, shoemaker, home Egton, drunk, offence at Whitby —
      OK, no fixes needed.

**Progress: id 1739-1743 done (5 of 5 fully resolved). 4 sex fixes, 1
same-person candidate entry updated, 1 related-incident note logged.**

## Records 1744-1748

1744: William Jenkins, begging in "Ellerby town street", offence at
      Ellerby — OK, no fixes needed (no home stated, correctly null).
1745: Isaac Carlton also damaging Joseph Readman's garden door — FIXED
      sex (7391, male). Confirms the same trio (Siddle, Carlton,
      Robinson) hit both Fawcett's and Readman's gardens the same day —
      merging the two same-day incidents into one broader spree note.
1746: William Pattison, jet worker, Whitby, drunk and riotous in
      Baxtergate — OK, no fixes needed. Another entry in his long
      pattern of recurring convictions.
1747: Leonard White, keeping a dog without a licence, offence at
      Whitby — OK, no fixes needed (no home stated, correctly null).
1748: Robert Robinson also damaging Joseph Readman's garden door —
      FIXED sex (7392, male). Confirms Robinson hit both gardens too.

**Progress: id 1744-1748 done (5 of 5 fully resolved). 2 sex fixes, 1
same-person candidate entry merged/expanded.**

## Records 1749-1753

1749: John Joyce assaulting John Grier, offence at Whitby — FIXED sex
      (7393, male). No home stated for either, correctly null. Same
      date (15 November 1867) and victim as record 1752 — confirmed
      same-incident pair, likely two brothers (both surnamed Joyce).
1750: William Redhead, home Egton, keeping a dog without a licence,
      offence at Egton — OK, no fixes needed.
1751: Thomas Siddle stealing cherries from Joseph Readman's garden — a
      third charge from the same 16 July 1887 spree — FIXED sex (7394,
      male).
1752: Anthony Joyce also assaulting John Grier — FIXED sex (7395,
      male). Confirmed same-incident pair with 1749.
1753: William Thomas Stubbs, keeping a dog without a licence, offence
      at Ruswarp — OK, no fixes needed (no home stated, correctly
      null).

**Progress: id 1749-1753 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair, 1 same-person candidate entry
extended.**

## Records 1754-1758

1754: Isaac Carlton also stealing cherries from Readman's garden —
      FIXED sex (7396, male). Another entry in the same-day spree —
      updating the candidate entry.
1755: John Walker, labourer, Glaisdale, having an unseasonable salmon
      in his possession, offence at Glaisdale — OK, no fixes needed.
1756: Peter Kilpatrick assaulting Robert Boddy, offence at Whitby —
      FIXED sex (7397, male). No home stated for either, correctly
      null. Matches an existing "Peter Kilpatrick" candidate from an
      earlier session.
1757: Robert Robinson also stealing cherries from Readman's garden —
      FIXED sex (7398, male). Confirms the full trio hit both fruit and
      structural damage at both gardens.
1758: William Waters, jet worker, Whitby, drunk — OK, no fixes needed.

**Progress: id 1754-1758 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry extended twice.**

## Records 1759-1763

1759: Joseph Edwards, begging in "Staithes town street", offence at
      Hinderwell — OK, no fixes needed; correctly resolves to Staithes
      itself.
1760: Thomas Siddle stealing strawberries from a THIRD garden, belonging
      to Isaac Stamp — FIXED sex (7399, male). The spree now spans
      three properties (Fawcett, Readman, Stamp).
1761: Thomas Jefferson assaulting Bessy Jefferson, his wife, offence at
      Hinderwell — FIXED sex (7400, female). Relationship (wife)
      already correctly captured.
1762: William Ford acting as a pedlar offering to repair umbrellas
      without a certificate, offence at Eskdaleside — OK, no fixes
      needed (no home stated, correctly null).
1763: Isaac Carlton also stealing strawberries from Isaac Stamp's
      garden — FIXED sex (7401, male). Confirms Carlton hit all three
      gardens too.

**Progress: id 1759-1763 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry extended to a third property.**

## Records 1764-1768

1764: James Calvert (miner, Lythe) obstructing "the Goldsborough
      highway" by fighting there with Michael Calvert; informant
      William Featherstone, Lythe — FIXED sex (7402 Michael, 7403
      Featherstone, both male) and FIXED a missing location link: this
      phrasing ("the Goldsborough highway", no "Lythe and" prefix) was
      already established elsewhere in the corpus (records 1285, 3667)
      as resolving to the same "Lythe & Goldsborough Highway" node (id
      266) alongside the township — applied the same link here.
1765: George Jackson assaulting Hannah McNiel, offence at Lythe —
      FIXED sex (7404, female — self-caught a slip where a batched
      UPDATE briefly set this to male, corrected immediately).
1766: Larry Ragan, labourer, Ruswarp, begging in Upgang Lane — OK, no
      fixes needed.
1767: Michael Calvert also convicted for the same Goldsborough highway
      fight, informant James Calvert as the co-participant — FIXED sex
      (7405, male) and FIXED the same missing highway link as 1764.
      Confirmed same-incident pair (mirror-image convictions of the
      same fight).
1768: Daniel Blakey, begging in "Sleights town street", offence at
      Eskdaleside — OK, no fixes needed; correctly resolves to Sleights
      itself.

**Progress: id 1764-1768 done (5 of 5 fully resolved). 4 sex fixes (1
self-corrected), 2 missing-location links fixed, 1 confirmed
same-incident pair.**

## Records 1769-1773

1769: Elizabeth McFeterich, singlewoman, Ruswarp, begging in St
      Hilda's Terrace — OK, no fixes needed.
1770: Jane McGuire (hawker, Whitby) drunk; informant Joseph Hall
      Martindale (sergeant of police) — FIXED sex (7406, male).
1771: James Osborne, begging in "Glaisdale town street", offence at
      Glaisdale — OK, no fixes needed; correctly resolves to Glaisdale
      itself.
1772: Robert Steel (fisherman, Whitby) drunk, refusing to leave Thomas
      Wadsworth's licensed premises — FIXED sex (7407, male). Same
      recurring defendant as record 1211.
1773: Charles Brown (servant in husbandry, Lythe) refusing to begin his
      contracted service with William Davison, farmer; informant George
      Henderson (farmer, Egton) — FOUND a real duplicate-person-stub
      bug: William Davison had been created twice on this record (7408
      "employer", 10286 "prospective employer") — the relationship
      link only pointed at 7408, confirming 10286 was the redundant
      stub. FIXED by deleting the duplicate person row (and its orphaned
      occupation row). FIXED sex (7408 Davison, 7409 Henderson, both
      male).

**Progress: id 1769-1773 done (5 of 5 fully resolved). 4 sex fixes, 1
duplicate-person-stub bug fixed.**

## Records 1774-1780 (1776, 1779 skipped by the source scrape)

1774: Robert Dixon, jet worker, Whitby, drunk and disorderly in
      Brewster Lane — OK, no fixes needed.
1775: Robert Steel assaulting Thomas Wadsworth — FIXED sex (7410,
      male). Same date (23 July 1887) as record 1772 (refusing to
      leave Wadsworth's premises) — confirmed same-day spree.
1777: Ralph Gibson (farmer, Hutton Mulgrave) using two dogs to take
      hares, offence at Hutton Mulgrave — OK, no fixes needed.
1778: Robert Steel again, drunk and disorderly on the Pier, two days
      later (25 July 1887) — OK, no fixes needed; a third conviction in
      this short stretch for the same man.
1780: William Breckon (miner, home Liverton) trespassing in pursuit of
      game on land in the possession of William Pearson and others,
      offence at Roxby — FIXED sex (7411, male). Matches record 1726's
      recurring landowner William Pearson.

**Progress: id 1774-1780 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-day spree logged.**

## Records 1781-1785

1781: Pearson Campion, jet worker, Whitby, drunk and disorderly in
      Church Street — OK.
1782: John Fox, hawker, Whitby, drunk — OK.
1783: George Raw, plumber, Whitby, drunk and disorderly in "Robin
      Hood's Bay town street", offence at Fylingdales — OK; correctly
      resolves to Robin Hood's Bay itself.
1784: Thomas Flinn, labourer, Whitby, begging in Church Street — OK.
1785: George Wheatley, stone mason, home Eskdaleside-cum-Ugglebarnby,
      drunk, offence at Egton — OK.

**Progress: id 1781-1785 done (5 of 5 fully resolved). A clean
batch — no fixes needed.**

## Records 1786-1790

1786: John Frankland (farmer, Egton) owning livestock found straying on
      "the Egton and Guisborough highway" — FIXED a missing location:
      created a new "Egton & Guisborough Highway" node (id 411, under
      Highways) — only mention in the corpus, matching the two-endpoint
      highway convention (Guisborough being genuinely outside the usual
      townships).
1787: Margaret Ann Hansill, wife of William George Hansill (jet
      worker), of the township of Whitby, drunk and disorderly on the
      Pier — FIXED missing home on William George Hansill (9977,
      Whitby) — pattern #6. Same date (25 July 1887) as record 1790 —
      confirmed same-day spree.
1788: William Ford (carrier, Lythe) allowing his horse to stray on "the
      highway leading from Lythe to Goldsborough" — FIXED a missing
      location link: this is the same physical road as the existing
      "Lythe & Goldsborough Highway" node (266), matching the precedent
      already applied at records 1764/1767.
1789: Thomas Crowford (labourer, Hinderwell) drunk and disorderly in
      "Staithes town street"; informant William Hammond (police
      constable, Hinderwell) — FIXED sex (7412, male). Correctly
      resolves to Staithes. Seventh sighting of Hammond — updating the
      candidate entry. Note: offence_date (10 October 1875) predates
      the QSB 1877 bundle it's filed under — an archival quirk, not an
      extraction error.
1790: Margaret Ann Hansill again, assaulting Herbert Storey — FIXED sex
      (7413 Storey male) and the same missing home on William George
      Hansill (9978, Whitby) — pattern #6. Confirmed same-day spree
      with 1787.

**Progress: id 1786-1790 done (5 of 5 fully resolved). 3 sex fixes, 2
pattern-#6 missing-home fixes, 1 new location created, 1 missing
location link fixed, 1 confirmed same-day spree, 1 same-person
candidate entry updated.**

## Records 1791-1795

1791: Joseph Hall assaulting Mary Hall, his wife, offence at Whitby —
      FIXED sex (7414, female). Relationship already correctly
      captured.
1792: George Marshall (licensed victualler, Hinderwell) selling gin
      without a licence — OK, no fixes needed.
1793: Robert Wilson (fish hawker, Whitby) assaulting John Mitchell —
      FIXED sex (7415, male). Same recurring defendant as record 1700.
1794: Richard Bell (labourer, Hutton Mulgrave) using two sheep dogs to
      kill a hare on land in the possession of "[blank] Botham",
      without a game licence — OK as extracted; blank first name
      correctly left null (no occupation/name to infer sex from).
1795: Thomas Dixon assaulting John Alderson Wallace, a constable for
      the North Riding, offence at Whitby — FIXED sex (7417, male). No
      home stated for either, correctly null.

**Progress: id 1791-1795 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 1796-1800

1796: Henry Douglas, carpenter, Whitby, drunk and disorderly on the
      Pier — OK, no fixes needed. Same date range as record 1799 —
      logged as a recurring-defendant candidate rather than a
      same-incident pair (two separate offences, two days apart).
1797: William Mead (farmer, Hutton Mulgrave) using two sheep dogs to
      kill a hare on land in the possession of "[blank] Botham" — OK as
      extracted (blank first name correctly left null). Same date and
      landowner as record 1794 (Richard Bell) — confirmed same-day
      group poaching, two men on Botham's land together.
1798: Elizabeth Housley, wife of John Housley (miner), of Sleights in
      the township of Eskdaleside, assaulting Ralph Stonehouse;
      informants Stonehouse himself and William Davison, both
      labourers, Eskdaleside — FIXED sex (7419 Stonehouse, 7420
      Davison, 9979 John Housley, all male) and FIXED missing home on
      John Housley (9979, Sleights — the more specific site named in
      the "of Sleights..." clause) — pattern #6. Shares a name with
      record 1773's William Davison but a different occupation there
      (farmer vs labourer here) — not linked.
1799: Henry Douglas again, same offence, two days later — OK, no fixes
      needed; logged as the same recurring defendant as 1796.
1800: James Calvert (miner, Eskdaleside-cum-Ugglebarnby) drunk and
      riotous in "Grosmont Street"; informant William Pickering (police
      constable) — FIXED sex (7421, male). Correctly resolves to
      Grosmont itself. Fourth sighting of William Pickering — updating
      the candidate entry.

**Progress: id 1796-1800 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 1 confirmed same-day incident, 1
recurring-defendant note, 1 same-person candidate entry updated.**

## Records 1801-1805

1801: John McClain (hawker, Whitby) drunk on the licensed premises of
      Turton Smithson, refusing to leave when asked by John Alderson
      Wallace, a police constable — FIXED sex (7422 Smithson, 7423
      Wallace, both male). Shares a full name with record 1795's
      victim John Alderson Wallace — plausibly the same officer;
      logged as a candidate.
1802: James Hawkes, bricklayer, Sneaton, lodging in a hay stack,
      offence at Sneaton — OK, no fixes needed.
1803: James Smith, begging in Fishburn Road, offence at Ruswarp — OK,
      no fixes needed (no home stated, correctly null; already
      correctly resolved to the existing Fishburn Road node, distinct
      from Fishburn Park).
1804: Owen Murphy (rag gatherer, Whitby) drunk and disorderly on "the
      Whitby and Ruswarp highway" — FIXED a missing location link to
      the existing "Whitby & Ruswarp Highway" node (id 377, already
      used by record 6). Checked scope — no other gaps found.
1805: William Grier (heater, Whitby) assaulting William Jameson,
      offence at Ruswarp — FIXED sex (7424, male).

**Progress: id 1801-1805 done (5 of 5 fully resolved). 3 sex fixes, 1
missing-location link fixed, 1 same-person candidate logged.**

## Records 1806-1810

1806: Elizabeth Lumsden, Whitby, drunk — OK, no fixes needed.
1807: Robert Dixon assaulting John Alderson Wallace, offence at
      Whitby — FIXED sex (7425, male). Same date (31 March 1877) and
      victim as record 1795 (Thomas Dixon) — two Dixons (plausibly
      related) assaulting the same officer the same day; confirmed
      same-incident pair.
1808: Francis Glandine, labourer, Ruswarp, begging in "Ruswarp Town
      Street" — OK, no fixes needed; correctly resolves to Ruswarp
      itself.
1809: William Greenwood stealing a terrier dog worth £3, belonging to
      Roger Dobson, "on or about 20 January 1867" — FIXED sex (7426,
      male) and FIXED another empty `offence_date` field despite
      `offence_date_raw` correctly holding the approximate date —
      populated as 1867-01-20 (same gap pattern as record 1679).
1810: Peter Campion, licensed victualler, Lythe, allowing drunkenness
      on his licensed premises — OK, no fixes needed.

**Progress: id 1806-1810 done (5 of 5 fully resolved). 2 sex fixes, 1
empty offence_date field filled in, 1 confirmed same-incident pair.**

**Scope check on empty `offence_date` with a populated `offence_date_raw`**:
found 7 more corpus-wide (140, 2512, 2947, 4966, 5008, 5074, 5523). Fixed
the three with an unambiguous single date ("on or about X" — 2512, 2947,
4966), same treatment as 1679/1809. Left the other four alone: 140
("February 1822") and 5008/5074 (both "December 1871") only give a
month, and 5523 ("between 24 April 1882 and 27 June 1882") is a range —
filling in a specific day for any of these would be fabrication, not
completion.

## Records 1811-1815

1811: Mary Howard, wife of Thomas Howard (labourer), of the township of
      Whitby, drunk and disorderly on the Pier — FIXED missing home on
      Thomas Howard (9980, Whitby) — pattern #6. Matches record 1721's
      Thomas Howard (of Arguments Yard) — plausibly the same man.
1812: Robert Barrett driving a cart furiously in Baxtergate, offence at
      Whitby — OK, no fixes needed (no home stated, correctly null).
1813: Thomas Dixon (labourer, Whitby) drunk and disorderly in Brewster
      Lane — OK, no fixes needed. Same defendant and exact date (31
      March 1877) as record 1795 (assaulting constable Wallace) —
      confirmed same-day spree, and a third Dixon-related conviction
      that date alongside 1807's Robert Dixon.
1814: Solomon Marshall, jet worker, Whitby, lodging in an unoccupied
      tenement — OK, no fixes needed. Same recurring defendant as
      record 1488.
1815: William Shandy, wilfully destroying his own clothes while relieved
      in the Whitby Union workhouse — OK, no fixes needed; already
      correctly linked.

**Progress: id 1811-1815 done (5 of 5 fully resolved). 1 pattern-#6
missing-home fix, 1 confirmed same-day spree, 1 candidate logged.**

## Records 1816-1820

1816: Peter Patton, jet worker, Whitby, drunk and disorderly at the
      Bridge — OK, no fixes needed.
1817: Joseph Storr (jet worker, Whitby) drunk on the licensed premises
      of James Barker, refusing to leave — FIXED sex (7427, male).
      Same recurring defendant as record 1232. Same date (6 August
      1887) as record 1820 — confirmed same-incident pair.
1818: Catherine Johnson, begging in George Street, offence at Ruswarp —
      OK, no fixes needed (no home stated, correctly null).
1819: Edward Raw, labourer, Whitby, drunk and disorderly in Sandgate —
      OK, no fixes needed. Same recurring defendant as records
      1244/1247/1250.
1820: Edwin Renwick also drunk on James Barker's premises, refusing to
      leave — FIXED sex (7428, male). Same recurring defendant as
      record 1279. Confirmed same-incident pair with 1817.

**Progress: id 1816-1820 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair.**

## Records 1821-1825

1821: John Robinson (greengrocer, Whitby) assaulting Edward Locker;
      informant is Locker himself — FIXED sex (7429, male).
1822: George Martin (jet worker, Whitby) drunk on the licensed premises
      of Turton Smithson — FIXED sex (7430, male). Same recurring
      defendant as 1238/1470/1590. Matches record 1801's recurring
      licensee Turton Smithson.
1823: Thomas Joyce also drunk on James Barker's premises, refusing to
      leave — FIXED sex (7431, male). Third confirmed member of the 6
      August 1887 Barker incident (with 1817, 1820) — updating the
      candidate entry.
1824: Catherine Smith, widow, Whitby, drunk — OK, no fixes needed.
1825: John Thompson, labourer, Whitby, drunk and riotous in "Egton
      Bridge town street" — OK, no fixes needed; correctly resolves to
      Egton Bridge itself.

**Progress: id 1821-1825 done (5 of 5 fully resolved). 3 sex fixes, 1
same-person candidate entry extended.**

## Records 1826-1830

1826: Francis Fewster also drunk on James Barker's premises — FIXED
      sex (7432, male). Fourth confirmed member of the 6 August 1887
      Barker incident — updating the candidate entry. Same recurring
      defendant as records 1471/1638.
1827: Mary Howden, begging in George Street, offence at Ruswarp — OK,
      no fixes needed (no home stated, correctly null). Same date and
      location as record 1818's Catherine Johnson — confirmed
      same-incident pair.
1828: William Redhead (farmer, Egton) owning swine found straying on
      "the Egton and Grosmont highway" — FIXED a missing location:
      created a new "Egton & Grosmont Highway" node (id 412, under
      Highways) after finding a second mention (record 2135); fixed
      both.
1829: Agnes Baker, wife of William George Baker (jet worker), of the
      township of Whitby, drunk and disorderly on the Pier — FIXED
      missing home on William George Baker (9981, Whitby) — pattern
      #6.
1830: Ann Scanlings, begging in Flowergate, offence at Whitby — OK, no
      fixes needed (no home stated, correctly null).

**Progress: id 1826-1830 done (5 of 5 fully resolved). 2 sex fixes, 1
pattern-#6 missing-home fix, 1 new location created (used by 2 records),
1 confirmed same-incident pair, 1 same-person candidate entry
updated.**

## Records 1831-1835

1831: William Swales, plumber, Whitby, drunk and disorderly in "Robin
      Hood's Bay town street" — OK, no fixes needed; correctly resolves
      to Robin Hood's Bay. Same date and location as record 1834 —
      confirmed same-incident pair.
1832: Henry Krence, labourer, Whitby, begging in Baxtergate — OK, no
      fixes needed.
1833: Robert Blair, begging in Clarkson Street, offence at Ruswarp —
      OK, no fixes needed (no home stated, correctly null).
1834: Thomas Raw, joiner, Whitby, drunk and disorderly in "Robin Hood's
      Bay town street" — OK, no fixes needed; confirmed same-incident
      pair with 1831.
1835: Isaac Harrison Crispin (Hinderwell) stealing apples belonging to
      Joseph Verrill — FIXED sex (7433, male). Shares a surname with
      the recurring Verrill family (truancy records 1560/1566/1569,
      also Staithes/Hinderwell) — plausibly related, not linked without
      more evidence.

**Progress: id 1831-1835 done (5 of 5 fully resolved). 1 sex fix, 1
confirmed same-incident pair.**

## Records 1836-1840

1836: William Wilson (stonemason, Egton) trespassing in pursuit of
      conies on land in the possession of John Agar, offence at Egton
      — FIXED sex (7434, male).
1837: Edward Gritton and John Knaggs, both labourers from Grosmont
      (Eskdaleside), using a dog to kill hares, offence at Roxby — OK,
      no fixes needed.
1838: Richard Dix (Hinderwell) also stealing apples from Joseph
      Verrill's garden — FIXED sex (7435, male). Same date (7 August
      1887) as record 1835 — confirmed same-incident pair.
1839: Patrick Magonira assaulting Susannah Rogers, offence at Ugthorpe
      — FIXED sex (7436, female). No home stated for either, correctly
      null.
1840: Francis Fewster (jet worker, Whitby) drunk on the licensed
      premises of Frederick William Judge, refusing to leave when asked
      by William Nicholson, a police constable — FIXED sex (7437
      Judge, 7438 Nicholson, both male). Another sighting of the
      recurring Francis Fewster (also 1471, 1638, 1826).

**Progress: id 1836-1840 done (5 of 5 fully resolved). 5 sex fixes, 1
confirmed same-incident pair.**

## Records 1841-1845

1841: Joseph Cassedy, tinner, Whitby, lodging in the "Post Office
      Yard" — OK, no fixes needed; correctly resolves to the existing
      "Old Post Office Yard" node.
1842: James Locker, jet worker, Whitby, drunk — OK, no fixes needed.
1843: Andrew Hill (jet worker, Whitby) drunk on the licensed premises
      of Joseph Garside Rhodes, refusing to leave when asked by
      William Nicholson — FIXED sex (7439 Rhodes, 7440 Nicholson, both
      male). Second sighting of William Nicholson (also 1840) —
      logging as a candidate distinct from the much more prolific John
      Nicholson.
1844: Robert Henry Waller, jet worker, Whitby, drunk and disorderly in
      Church Street — OK, no fixes needed.
1845: John McGloine, lodging house keeper, Whitby, obscene language in
      Sandgate — OK, no fixes needed. Matches the recurring McCloin/
      McGloin/McGloine candidate (also 1271, 1486).

**Progress: id 1841-1845 done (5 of 5 fully resolved). 2 sex fixes, 1
new candidate logged.**

## Records 1846-1850

1846: Francis Hutchinson (miner, Aislaby) found on the licensed
      premises of Thomas Readman Sleightholm outside licensing hours,
      offence at Newholm-cum-Dunsley — FIXED sex (7441, male).
1847: Robert Henry Waller (jet worker, Whitby) wilfully damaging a
      coat belonging to the North Riding Constabulary — OK, no fixes
      needed. Same defendant and exact date (13 August 1887) as record
      1844 — confirmed same-day spree.
1848: John Parkin, interrupting the road leading from Victoria Square
      to Esk Terrace while driving a carriage, offence at Ruswarp — OK,
      already fixed above (location link).
1849: Samuel Willis, begging in "Lythe town street", offence at Lythe
      — OK, no fixes needed; correctly resolves to Lythe itself.
1850: John Dixon, jet worker, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.

**Progress: id 1846-1850 done (5 of 5 fully resolved). 1 sex fix, 1
confirmed same-day spree logged.**

## Records 1851-1855

1851: James Kelly (photographer, Whitby) drunk and quarrelsome on
      licensed premises, refusing to leave when asked by Thomas
      Atkinson, the occupier — FIXED sex (7442, male). Matches an
      existing "Thomas Atkinson" candidate from an earlier session.
1852: Francis Murray, using obscene language on North Eastern Railway
      Company premises at Glaisdale — OK, already fixed above (part of
      the resolved railway sweep, Glaisdale Station).
1853: Edward Canfield, tailor, Whitby, begging in St Ann's Staith —
      OK, no fixes needed.
1854: Bridget Ruehorn, wife of William Ruehorn (labourer), of the
      township of Whitby, assaulting William Gay; informant is Gay
      himself — FIXED sex (7444 Gay male, 9982 William Ruehorn male)
      and FIXED missing home on William Ruehorn (9982, Whitby) —
      pattern #6. Matches the recurring Ruehorn family.
1855: John Smith (gentleman, Egton) drunk and disorderly in "Egton
      Bridge town street"; informant James Wright (police constable,
      Egton) — FIXED sex (7445, male). Correctly resolves to Egton
      Bridge itself. Second sighting of this James Wright (also
      1544) — updating the candidate entry.

**Progress: id 1851-1855 done (5 of 5 fully resolved). 4 sex fixes, 1
pattern-#6 missing-home fix, 2 same-person candidate entries
updated/confirmed.**

## Records 1856-1860

1856: Edward Garth (cab driver, Whitby) too far from his carriage to
      control the horse, offence in George Street, Ruswarp — OK, no
      fixes needed; correctly resolves to George Street under West
      Cliff.
1857: Samuel Winterburn, miner, home Eskdaleside-cum-Ugglebarnby, drunk
      and riotous in a public thoroughfare — OK, no fixes needed. Same
      date (27 July 1867) and offence as record 1859 — logging as a
      candidate.
1858: Thomas Morton (farm servant, Sneaton) drunk and riotous "in the
      road leading from the railway station to Sneaton Road";
      informant John Alderson Wallace (police constable, home Ruswarp
      here rather than Whitby) — FIXED sex (7446, male); correctly
      resolves to the existing Sneaton Road node. Matches the recurring
      John Alderson Wallace candidate (also 1795, 1801, 1807), though
      his home varies across sightings — noted, not treated as
      disqualifying.
1859: Francis Schofield, miner, home Eskdaleside-cum-Ugglebarnby, drunk
      and riotous in a public thoroughfare — OK, no fixes needed. Same
      recurring defendant as records 1668/1785. Confirmed same-incident
      pair with 1857.
1860: Catherine McKewin, begging in "Sleights town street", offence at
      Eskdaleside — OK, no fixes needed; correctly resolves to
      Sleights itself.

**Progress: id 1856-1860 done (5 of 5 fully resolved). 1 sex fix, 1
confirmed same-incident pair, 1 same-person candidate entry
extended.**

## Records 1861-1865

1861: John Backhouse, jet worker, Whitby, drunk and disorderly in
      Bridge Street — OK, no fixes needed. Matches the recurring
      Backhouse candidate cluster.
1862: Anthony Jackson (shoemaker, Whitby) drunk; informant Charles
      Tempest Clarkson (superintendent of police) — FIXED sex (7447,
      male). Same recurring defendant as record 1588. Sixth sighting of
      Clarkson — updating the candidate entry.
1863: Ruth Jenders, begging in Hanover Terrace, offence at Whitby — OK,
      no fixes needed (no home stated, correctly null).
1864: William Proctor, found intoxicated on North Eastern Railway
      premises at Glaisdale — OK, already fixed above (part of the
      resolved railway sweep).
1865: Henry Plews, begging in St Hilda's Terrace, offence at Ruswarp —
      OK, no fixes needed (no home stated, correctly null).

**Progress: id 1861-1865 done (5 of 5 fully resolved). 1 sex fix, 1
same-person candidate entry updated.**

## Records 1866-1870

1866: Edmund Steele, begging in "East Barnby town street", offence at
      Barnby — OK, no fixes needed; correctly resolves to East Barnby,
      confirming the Barnby tree restructure from earlier this session
      is holding.
1867: James Wilson, wire worker, Whitby, drunk and disorderly on the
      Bridge — OK, no fixes needed.
1868: George Dixon, labourer, Whitby, drunk and riotous in Church
      Street — OK, no fixes needed.
1869: Isaac Abraham, fisherman, home Hinderwell, drunk and disorderly
      in "Staithes town street" — OK, no fixes needed; correctly
      resolves to Staithes.
1870: Francis Sherwood, groom, home Ruswarp, drunk and disorderly in
      Bagdale, offence at Ruswarp — OK, no fixes needed. Same recurring
      defendant as record 1426; Bagdale correctly under West Cliff.

**Progress: id 1866-1870 done (5 of 5 fully resolved). A clean
batch — no fixes needed.**

## Records 1871-1875

1871: Margaret Barnold, Whitby, drunk — OK, no fixes needed.
1872: William Lowe, farmer, Hinderwell, drunk and disorderly in
      "Staithes town street" — OK, no fixes needed; correctly resolves
      to Staithes. Same date and location as record 1869 (Isaac
      Abraham) — confirmed same-incident pair.
1873: Joseph Thomas Dence (Whitby) stealing beans intended for cattle
      food, belonging to James Richardson, offence at Hawsker cum
      Stainsacre — FIXED sex (7448, male).
1874: John Smithson (sawyer, Hinderwell) assaulting Frank Crosier,
      offence at Hinderwell — FIXED sex (7449, male). Matches record
      1286's recurring licensee Frank Crosier.
1875: Mary Ann Stonehouse, singlewoman, Whitby, drunk and disorderly in
      Haggersgate — OK, no fixes needed. Matches the existing flagged
      occupation-inconsistency candidate.

**Progress: id 1871-1875 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair.**

## Records 1876-1880

1876: Joseph Morrison also stealing beans from James Richardson's
      land, same date as record 1873 — FIXED sex (7450, male).
      Confirmed same-incident pair.
1877: William Headlam (woodman, Hinderwell) also assaulting Frank
      Crosier, same date as record 1874 — FIXED sex (7451, male).
      Confirmed same-incident pair, two men assaulting Crosier the
      same day.
1878: Thomas Hutchinson assaulting John Thomas Readman, offence at
      Whitby — FIXED sex (7452, male). No home stated for either,
      correctly null.
1879: John Johnson, labourer, Whitby, drunk and disorderly in Church
      Street — OK, no fixes needed.
1880: Charles Smith, wilfully destroying his own clothes while
      maintained in the Whitby Union workhouse — OK, no fixes needed;
      already correctly linked.

**Progress: id 1876-1880 done (5 of 5 fully resolved). 3 sex fixes, 2
confirmed same-incident pairs.**

## Records 1881-1885

1881: Blanch Wellburn drunk and disorderly, Church Street, Whitby —
      FIXED sex (7454, Ann Marshall, female). Two blank-first-name
      witnesses ("Freeman" workhouse nurse, "Leng") correctly left
      sex NULL — occupation alone doesn't justify inference, and no
      given name to check.
1882: Matthew McCauley drunk on Andrew Harland's licensed premises,
      refusing to leave for William Dobson — FIXED sex (7456 Harland
      male, 7457 Dobson male). Both recurring names — Harland now 6th
      sighting, Dobson 20+ sightings — logged to
      same-person-candidates.md.
1883: John Joyce drunk, on the oath of Charles Tempest Clarkson,
      superintendent of police — FIXED sex (7458, male). Clarkson now
      6th individually-tracked sighting (record 1883); logged.
1884: Matthew Cooper drunk and disorderly, Robin Hood's Bay town
      street (correctly resolves to Robin Hood's Bay itself), on the
      oath of George Eli North — FIXED sex (7459, male). North now
      5th sighting; logged.
1885: Joseph Donald drunk and disorderly on the Bridge, Whitby — OK,
      no fixes needed; already correctly linked.

**Progress: id 1881-1885 done (5 of 5 fully resolved). 5 sex fixes, 3
recurring-name sightings logged.**

## Records 1886-1890

1886: John Melton allowing cows/horse to stray on the highway leading
      from Sneaton to Ruswarp — FIXED location: created "Sneaton &
      Ruswarp Highway" (413) under Highways (106), two-endpoint
      highway convention, added alongside Sneaton.
1887: Mary Howard wife of Thomas Howard, drunk on St Ann's Staith
      (already correctly linked, no change) — FIXED Thomas Howard
      (9983): home Whitby + sex male via pattern #6 ("of the township
      of Whitby labourer" attaches to the preceding named spouse).
1888: Samuel Trueman assaulting Thomas Smith, Whitby — OK, no fixes
      needed; victim correctly has no fabricated details.
1889: George Walker resisting constable John Norman — FIXED sex
      (7461, male; unambiguous given name, independent of the
      occupation-only-null rule).
1890: William Ward, pedlar, offering bath bricks without a
      certificate, Whitby — OK, no fixes needed.

**Progress: id 1886-1890 done (5 of 5 fully resolved). 1 new highway
node, 2 sex fixes, 1 home fix.**

## Records 1891-1895

1891: Alfred Johnson of Sleights, drunk in charge of a pony and cart
      in Lythe Town Street (resolves to Lythe itself) — OK, no fixes
      needed; already correctly linked.
1892: Susan Grady wilfully obstructing Church Street, Whitby — OK, no
      fixes needed; no home stated in source, correctly null.
1893: Christopher White, hawker, offering bath bricks without a
      certificate, Whitby, 8 June 1877 — OK, no fixes needed. Same
      offence/date as record 1890 (William Ward) — likely two hawkers
      cited together; logged as same-incident candidate.
1894: Sarah Ann Davidson wife of John Davidson, drunk on the New Quay
      — FIXED John Davidson (9984): home Whitby + sex male via
      pattern #6.
1895: John McGloine, common lodging house keeper, not cleansing his
      lodging house, on the oath of Martin Dickinson, inspector of
      police — FIXED sex (7462, male; unambiguous given name).

**Progress: id 1891-1895 done (5 of 5 fully resolved). 2 sex fixes, 1
home fix, 1 same-incident candidate logged.**

## Records 1896-1900

1896: Joseph Storr drunk on George Gallilee's licensed premises, on
      the oaths of John Ryder (superintendent), Miles Moody
      (inspector), John Kirby Peacock (constable) — FIXED sex on all
      four (7463 Gallilee, 7464 Ryder, 7465 Moody, 7466 Peacock, all
      male). Ryder now has 80+ recurring sightings (standing Whitby
      police superintendent), not individually re-tracked further.
1897: Henry Douglas drunk and disorderly in Victoria Square — OK, no
      fixes needed.
1898: Sarah Ann Robinson wilfully obstructing Church Street — OK, no
      fixes needed; no home stated, correctly null.
1899: Thomas Walker damaging doors owned by John Chapman Walker,
      offence at Ruswarp, witnesses [blank] Soulsby/John Thomas
      Soulsby/Elizabeth Adamson/Thomas Sleightholm — FIXED sex on four
      (7467 Walker male, 7469 J T Soulsby male, 7470 Adamson female,
      7471 Sleightholm male); blank-first-name Soulsby (7468) left
      null correctly. John Chapman Walker recurs as property owner
      across three separate incidents/dates (1899, 1596-1620 group
      vandalism, 5887); logged.
1900: John Shaw drunk and disorderly in Baxtergate — OK, no fixes
      needed.

**Progress: id 1896-1900 done (5 of 5 fully resolved). 8 sex fixes, 1
recurring-property-owner note logged.**

## Records 1901-1905

1901: Robert Watson assaulting Joseph Featherstone, Ruswarp — FIXED sex
      (7472, male).
1902: Robert Foster, coal porter, drunk and disorderly in Haggersgate
      — OK, no fixes needed.
1903: Francis Dolby, Ruswarp labourer, begging at Spring Hill — OK,
      no fixes needed. Raised the Ruswarp/Spring Hill parent-mismatch
      question with the user (see reextraction-audit-notes.md);
      resolved as intentional, no DB change.
1904: Thomas Bradley begging in North Terrace, Ruswarp — OK, no fixes
      needed; no home stated in source, correctly null. Same
      Ruswarp/North Terrace question, same resolution.
1905: Ann Knaggs, Ugglebarnby, keeping a dog without a licence — OK,
      no fixes needed.

**Progress: id 1901-1905 done (5 of 5 fully resolved). 1 sex fix, 1
schema question raised and resolved with the user (Spring
Hill/North Terrace parenting, left as-is).**

## Records 1906-1910

1906: Patrick Flanigan begging in Baxtergate, Whitby — OK, no fixes
      needed.
1907: Patrick Kelly frequenting Whitby railway station with intent to
      commit a felony, offence at Ruswarp — FIXED location: added
      Whitby Railway Station (246) alongside the existing Ruswarp
      link (same Ruswarp/modern-Whitby-site exception as the previous
      batch — genuinely missing, not just an alongside-vs-replace
      question).
1908: John Smith of Cliff Lane, Whitby, disorderly on Robert
      Jefferson's licensed premises, refusing to leave for Mary
      Jefferson — FIXED Robert Jefferson (10219): home Whitby + sex
      male via pattern #6 ("of the township of Whitby licensed
      victualler" attaches to the preceding named Robert, not Mary);
      FIXED Mary Jefferson (7473) sex female.
1909: William Wilson, stonemason, begging in Silver Street — OK, no
      fixes needed.
1910: William Jones playing dice in Bagdale, offence at Ruswarp — OK,
      no fixes needed; already correctly carries both the Ruswarp
      township link and the Bagdale site link.

**Progress: id 1906-1910 done (5 of 5 fully resolved). 1 location fix,
3 sex/home fixes.**

## Records 1911-1915

1911: William Pattison drunk on Runswick Bank Top, offence at
      Hinderwell — OK, no fixes needed; Runswick Bank Top already
      correctly nested under Hinderwell, replacing the coarser link.
1912: Andrew Cockburn (Loftus, tailor) assaulting constable Joseph
      Monkman, offence at Egton — FIXED sex (7474, male). Same-incident
      pair with 1915 (see below).
1913: John Oliver frequenting the pier with intent to steal from Mary
      Ann Bell — FIXED sex (7475, female).
1914: John Mead, Ugglebarnby, keeping a dog without a licence — OK, no
      fixes needed.
1915: Joseph Hodgson (Loftus, shoemaker) assaulting constable Joseph
      Monkman, offence at Egton — FIXED sex (7476, male). Confirmed
      same-incident pair with 1912 — same constable, same date, both
      of Loftus; logged.

**Progress: id 1911-1915 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair.**

## Records 1916-1920

1916: Thomas Stabler assaulting William Ward (fruiterer), Whitby —
      FIXED sex (7477, male). Same-incident pair with 1919 (below).
1917: James White begging in East Barnby town street, offence at
      Barnby — OK, no fixes needed; already correctly resolves to
      East Barnby, replacing the coarser link.
1918: Andrew Cockburn suspected of poaching with Joseph Hodgson,
      caught by constable Joseph Monkman, offence at Eskdaleside cum
      Ugglebarnby — FIXED sex (7478, Monkman, male). Confirmed
      3-record connected cluster with 1912/1915; logged.
1919: Thomas Stabler assaulting Mary Ward, wife of William Ward
      (fruiterer, Whitby) — FIXED sex (7479 Mary female, 10220
      William male) + home (10220, Whitby) via pattern #6. Confirmed
      same-incident pair with 1916 (husband and wife both assaulted
      same day); logged.
1920: John King begging in Grosmont town street, offence at
      Eskdaleside — OK, no fixes needed; already correctly resolves
      to Grosmont.

**Progress: id 1916-1920 done (5 of 5 fully resolved). 5 sex fixes, 1
home fix, 2 confirmed same-incident clusters logged.**

## Records 1921-1925

1921: Joseph Hodgson suspected of poaching with Andrew Cockburn,
      caught by constable Joseph Monkman, offence at Eskdaleside cum
      Ugglebarnby — FIXED sex (7480, male). Extends the 3
      September 1887 cluster to 4 records (1912/1915/1918/1921);
      updated.
1922: Sarah Pattison begging in Skinner Street, offence at Ruswarp —
      OK, no fixes needed; correctly carries both the Ruswarp
      township link and the Skinner Street site link (same exception
      as Spring Hill/North Terrace).
1923: Mark Dryden assaulting John Thomas Readman, "parish of Whitby"
      — FIXED sex (7481, male).
1924: John Stafford (Fylingdales, labourer) begging in Robin Hood's
      Bay Lane — OK, no fixes needed; already correctly resolves to
      the specific lane.
1925: Dorothy Hewison wife of Thomas Hewison (joiner), drunk, Whitby
      — FIXED Thomas Hewison (9985): home Whitby + sex male via
      pattern #6.

**Progress: id 1921-1925 done (5 of 5 fully resolved). 3 sex fixes, 1
home fix, cluster note updated.**

## Records 1926-1930

1926: Joseph Paylor trespassing after conies on Francis Norman's
      land, Ruswarp — FIXED sex (7482, male). Same-incident pair with
      1929 (below).
1927: Thomas Watson (Glaisdale, late innkeeper), drunk in Lealholm
      Town Street, offence at Glaisdale — OK, no fixes needed; already
      correctly resolves to Lealholm.
1928: George Wake ill-treating a horse, Lythe — OK, no fixes needed.
1929: Robert Bulmer trespassing after conies on Francis Norman's land,
      Ruswarp — FIXED sex (7483, male). Confirmed same-incident pair
      with 1926; logged.
1930: Thomas Gatenby drunk on Mary Taylor's licensed premises, Whitby
      — FIXED sex (7484, female).

**Progress: id 1926-1930 done (5 of 5 fully resolved). 3 sex fixes, 1
confirmed same-incident pair.**

## Records 1931-1935

1931: Thomas Gatenby, owner of a foxhound that damaged William
      Green's lambs, Lythe — FIXED sex (7485, male). No home stated
      for Gatenby in source, correctly null; different Thomas Gatenby
      from record 1930 (20 years apart, no shared detail beyond name)
      — not logged as a candidate.
1932: Turton Smithson allowing drunkenness on licensed premises, on
      the oaths of John Alderson Wallace (constable) and Peter
      Gilmartin (labourer) — FIXED sex (7486 Wallace, 7487 Gilmartin,
      both male). Wallace now 5th individually-tracked sighting;
      updated.
1933: William George Hansell drunk and disorderly, Church Street,
      Whitby — OK, no fixes needed.
1934: George Wilson, alehouse keeper, opening licensed premises
      before 12.30pm on a Sunday, Ruswarp — OK, no fixes needed.
1935: James Filburn disorderly on Joseph Shaw's licensed premises,
      refusing to leave for "the said Joseph Shaw" — FIXED sex (7488,
      male); reused person row for "the said Joseph Shaw" already
      correct.

**Progress: id 1931-1935 done (5 of 5 fully resolved). 4 sex fixes, 1
recurring-name sighting logged.**

## Records 1936-1940

1936: William George Hansell drunk and disorderly at the Bridge End —
      OK, no fixes needed. Third sighting in 4 days (with 1933, 1939);
      logged.
1937: John Stainthorpe trespassing after conies on Matthew Gray's
      land, Fylingdales — FIXED sex (7489, male).
1938: Alexander Butcher drunk and disorderly, Church Street, Whitby —
      OK, no fixes needed.
1939: Margaret Ann Hansell wife of William George Hansell, drunk at
      the Bridge End, same day as 1936 — FIXED William George Hansell
      (9986): home Whitby + sex male via pattern #6. Confirmed
      same-incident pair with 1936; logged.
1940: Charles Constable assaulting Annie Allan, parish of Whitby —
      FIXED sex (7490, female); no home stated for Constable,
      correctly null.

**Progress: id 1936-1940 done (5 of 5 fully resolved). 3 sex fixes, 1
home fix, 1 recurring/same-incident note logged.**

## Records 1941-1945

1941: Chapman Pearson drunk and riotous on the road leading from the
      railway station to Sneaton Road, on the oath of John Alderson
      Wallace (of Ruswarp) — FIXED sex (7491, male). Wallace now 6th
      sighting; updated.
1942: George Sell drunk in charge of two horses in Green Lane,
      offence at Hawsker cum Stainsacre — FIXED location: corpus-wide
      sweep found Green Lane (parented under Whitby/East Cliff)
      systematically missing the stated Hawsker cum Stainsacre
      township link (6 of 8 records affected); added alongside for
      all 6, documented in reextraction-audit-notes.md.
1943: Richard Brigham (Goathland) assaulting Thomas Robinson, "the
      said Thomas Robinson" (Goathland furnaceman) — FIXED sex (7492,
      male); reused person row already correct.
1944: James Duell and John Sanderson (Hinderwell millers) having an
      incorrect scale, found by John Ryder, inspector of weights and
      measures — FIXED sex (7493, male). Another Ryder sighting
      (80+), not individually tracked further.
1945: William Featherstone, sailor, drunk and disorderly in Church
      Street, Whitby — OK, no fixes needed.

**Progress: id 1941-1945 done (5 of 5 fully resolved). 3 sex fixes, 1
corpus-wide location sweep (6 records fixed: Green Lane/Hawsker cum
Stainsacre).**

## Records 1946-1950

1946: Stephen Stainthorpe, Aaron Johnson, Richard Emmerson (all
      Fylingdales servants in husbandry) killing a hare on a Sunday —
      OK, no fixes needed.
1947: Edward Lamb exhibiting a diseased cow for sale, offence at
      Hutton Mulgrave, on the oath of John Ryder — FIXED sex (7494,
      male). Another Ryder sighting, not individually tracked further.
1948: John Robson begging in Prospect Place, Ruswarp — OK, no fixes
      needed; already correctly carries both the Ruswarp township
      link and the Prospect Place site link (same exception pattern).
1949: Henry Miller assaulting his wife Ann Miller, "the said Ann
      Miller" — FIXED sex (7495, female; self-caught a slip where I
      initially applied a male batch-update to this row, corrected
      immediately). Known recurring Miller couple, consistent with
      prior sightings.
1950: Mary Ann Jefferson wife of Robert Jefferson (licensed
      victualler), assaulting John Smith, witnessed by William Cowen,
      Isaac Hugill, Thomas Tinley — FIXED sex on five (7496 Smith,
      7497 Cowen, 7498 Hugill, 7499 Tinley, all male; 9987 Robert
      Jefferson male) + home (9987, Whitby) via pattern #6. Robert
      Jefferson now confirmed 12x recurring licensee; logged as a
      standing candidate.

**Progress: id 1946-1950 done (5 of 5 fully resolved). 7 sex fixes
(1 self-corrected), 1 home fix, 1 recurring-licensee note added.**

## Records 1951-1955

1951: John Thompson begging in Glaisdale Town Street, offence at
      Glaisdale — OK, no fixes needed; already correctly resolves to
      Glaisdale.
1952: William Hewson absenting himself from master James Mickman's
      service, "the said James Mickman" reused — FIXED sex (7500,
      male).
1953: Thomas Robson Cornforth drunk on George Gallilee's licensed
      premises, on the oaths of John Ryder/Miles Moody/John Kirby
      Peacock — FIXED sex on four (7501 Gallilee, 7502 Ryder, 7503
      Moody, 7504 Peacock, all male). Confirmed same-incident pair
      with 1896 (same premises, date, officers); logged.
1954: Henry Elders (Whitby, cab driver) ill-treating a horse, offence
      at Ruswarp — OK, no fixes needed.
1955: James Gavan assaulting James Ryan (Glaisdale labourer), "the
      said James Ryan" reused — FIXED sex (7505, male).

**Progress: id 1951-1955 done (5 of 5 fully resolved). 6 sex fixes, 1
confirmed same-incident pair logged.**

## Records 1956-1960

1956: George Sedman, George Pearson, William Knaggs, John Waters (all
      Whitby), trespassing after conies on John Weighill's land,
      Ruswarp — FIXED sex (7506, male). Four-defendant single
      incident, already correctly modelled as one record with four
      defendants (not split).
1957: Charles Winn begging on the Whitby to Ruswarp highway, offence
      at Ruswarp — FIXED location: added the existing "Whitby &
      Ruswarp Highway" (377) node alongside the Ruswarp link,
      consistent with record 1804's precedent for the same highway.
1958: Michael Boan assaulting James Ryan (source has a "[sic - recte
      James Ryan]" self-correcting annotation, already reflected
      correctly in the structured fields — Boan defendant, Ryan
      victim, no DB error) — FIXED sex (7507, male). Confirmed
      same-incident pair with 1955 (same victim, same date); logged.
1959: Daniel James Stewart drunk and disorderly in Baxtergate, on the
      oaths of Thomas Archer (inspector) and George Hewison
      (constable) — FIXED sex (7508, 7509, both male).
1960: Edwin Renwick (Hawsker-cum-Stainsacre butcher) drunk on William
      Clark's licensed premises, offence at Whitby — FIXED sex (7510,
      male).

**Progress: id 1956-1960 done (5 of 5 fully resolved). 6 sex fixes, 1
location fix, 1 confirmed same-incident pair.**

## Records 1961-1965

1961: John Rock assaulting Christopher Scales, "the said Christopher
      Scales" reused — FIXED sex (7511, male).
1962: Barnard Marshall, Robert Welford, Christopher Todd (all
      Brotton) and Thomas Dobson (Easington) trespassing after game on
      William Hayes's land, offence at Lythe — FIXED sex (7512,
      male); Brotton/Easington homes already correctly captured (new
      towns to this stretch, both already existed in the tree).
1963: Robert Garbutt drunk on William Clark's licensed premises,
      Whitby — FIXED sex (7513, male). Confirmed same-incident pair
      with 1960; logged.
1964: John Codling the younger assaulting John Codling the elder,
      "the said John Codling the elder" reused — FIXED sex (7514,
      male) + name_postfix on both (2057 "the younger", 7514 "the
      elder" — previously missing despite being stated in the source).
1965: George Adamson (Hinderwell) drunk and disorderly in Staithes
      town street, on the oath of William Hammond — FIXED sex (7515,
      male). Hammond now 8th sighting; updated.

**Progress: id 1961-1965 done (5 of 5 fully resolved). 5 sex fixes, 2
name_postfix fixes, 1 same-incident pair, 1 recurring-name sighting.**

## Records 1966-1970

1966: Edwin Renwick drunk and disorderly in Baxtergate — OK, no fixes
      needed. Recurring name (day after record 1960); logged.
1967: William Evans trespassing after conies on William Hodgson's
      land, Egton — FIXED sex (7516, male).
1968: William Sanderson disorderly on John Sellar's licensed
      premises, "the said John Sellar" reused twice (informant +
      licensee, single row) — FIXED sex (7517, male).
1969: James Wood assaulting George Frith, parish of Whitby — FIXED
      sex (7518, male).
1970: Thomas Wallis the younger and Robert Turnbull (Hinderwell fish
      hawkers), drunk and riotous — FIXED name_postfix (2063, "the
      younger" — previously missing despite being stated).

**Progress: id 1966-1970 done (5 of 5 fully resolved). 3 sex fixes, 1
name_postfix fix, 1 recurring-name note logged.**

## Records 1971-1975

1971: Richard Holmes disorderly on Thomas Watson's licensed premises,
      "the said Thomas Watson", witnessed by S.A. Thompson/Ralph
      Speedy/William Nawton/Edward Watson/Joseph Philpot/F. Harrison —
      FIXED sex on five full-named witnesses (7520 Speedy, 7521
      Nawton, 7522 Watson licensee, 7523 Edward Watson, 7524 Philpot,
      all male); initials-only "S.A. Thompson" (7519) and "F.
      Harrison" (7525) correctly left null (no full given name in
      this record's text). Extends the Sarah A. Thompson/Thomas
      Watson witness-group cluster (previously 447/466/482) to a
      confirmed same-night spree with 1974; updated.
1972: James Wood drunk on North Eastern Railway Company premises
      called Whitby (Town) Station — OK, no fixes needed; already
      correctly linked to Whitby (Town) Station (408) from the
      earlier NER resolution.
1973: Thomas Wallis the elder and Miles Turnbull (Hinderwell fish
      hawkers) drunk and riotous, on the oath of James Waite — FIXED
      sex (7526, male). Same date/township/offence as 1970 but a
      DIFFERENT pair (Wallis "the elder" not "the younger", Miles not
      Robert Turnbull) — correctly distinguished, not a duplicate.
1974: William Barrett disorderly on Thomas Watson's licensed
      premises, same night as 1971 — FIXED sex on six full-named
      witnesses (7529 Nawton, 7530 Watson licensee, 7531 "Ed." Watson,
      7532 Philpot, 7533 Francis Harrison, all male); initials-only
      "R. Speedy" (7527) and "S.A. Thompson" (7528) left null.
1975: Henry Davis destroying his own clothes while receiving relief
      in the Whitby Union workhouse — OK, no fixes needed.

**Progress: id 1971-1975 done (5 of 5 fully resolved). 16 sex fixes,
1 same-incident cluster extended to 4 records (updated).**

## Records 1976-1980

1976: Robert Lilleystone damaging William Appleton's windows,
      Newholm-cum-Dunsley, "the said William Appleton" reused —
      FIXED sex (7534, male).
1977: Robert Arnold (soldier) disorderly on Thomas Watson's premises,
      same night as 1971/1974 — FIXED sex on four full-named
      witnesses (7537 Nawton, 7538 Watson licensee, 7539 Edward
      Watson, 7540 Philpot, all male); initials-only witnesses left
      null. Extends the Thomas Watson group-ejection cluster.
1978: George Walmsley destroying his own clothes in the Whitby Union
      workhouse, same day as 1975 — OK, no fixes needed.
1979: John Brooks selling beer without a licence to William Ridley,
      parish of Danby — FIXED sex (7542, male).
1980: Edward Barrett disorderly on Thomas Watson's premises, same
      night as 1971/1974/1977 — FIXED sex on five full-named
      witnesses (7544 Speedy, 7545 Nawton, 7546 Watson licensee, 7547
      Edward Watson, 7548 Philpot, all male). Thomas Watson cluster
      now confirmed 6 records; updated.

**Progress: id 1976-1980 done (5 of 5 fully resolved). 11 sex fixes,
1 cluster note extended to 6 records.**

## Records 1981-1985

1981: William Hall destroying his own clothes in the Whitby Union
      workhouse, third such record on 15 September 1887 (with 1975,
      1978) — OK, no fixes needed.
1982: Henry Harrison assaulting Robert Rudd, "the said Robert Rudd"
      reused — FIXED sex (7550, male).
1983: Richard Holmes, Robert Wilson, Edward Barrett and Robert Arnold
      (four defendants from the 1971/1974/1977/1980 Thomas Watson
      cluster) convicted together of assaulting Edward Watson — FIXED
      sex on three full-named witnesses (7551 Edward Watson victim,
      7553 Speedy, 7554 Nawton, 7555 Watson, all male); initials-only
      left null. Resolves the open "two Watsons" question from the
      cluster note and confirms the whole group is one real incident;
      updated.
1984: Morris Wilson (Ruswarp, retired ironmonger) drunk and
      disorderly, Church Street, offence at Whitby — OK, no fixes
      needed.
1985: William Fergusson drunk and riotous, Church Street, on the oath
      of John Weatherald — FIXED sex (7558, male).

**Progress: id 1981-1985 done (5 of 5 fully resolved). 6 sex fixes, 1
cluster resolved/updated.**

## Records 1986-1990

1986: John Robinson begging in Baxtergate — OK, no fixes needed.
1987: Robert Steel drunk on Thomas Wadsworth's licensed premises,
      refusing to leave for William Honeyman (constable) — FIXED sex
      (7559 Wadsworth, 7560 Honeyman, both male).
1988: John McKenzie assaulting Eliza Marsay, "a child," Eskdaleside —
      FIXED sex (7561, female).
1989: Edward Francis begging on the Whitby and Robin Hood's Bay
      highway, offence at Fylingdales — OK, no fixes needed; already
      correctly linked to both.
1990: Margaret Ann Hansell wife of William George Hansell, drunk in
      Church Street — FIXED William George Hansell (9988): home
      Whitby + sex male + occupation jet worker (previously missing
      entirely) via pattern #6. Fifth sighting of this recurring
      couple (with 1933/1936/1939).

**Progress: id 1986-1990 done (5 of 5 fully resolved). 4 sex fixes, 1
home fix, 1 occupation fix.**

## Records 1991-1995

1991: William Sayers of Filey, East Riding, drunk and riotous, Whitby
      — OK, no fixes needed; Filey already correctly linked.
1992: Alexander Moore drunk and disorderly, Robin Hood's Bay town
      street, offence at Fylingdales — OK, no fixes needed; already
      correctly resolves to Robin Hood's Bay.
1993: Richard Lyth drunk and disorderly, Baxtergate — OK, no fixes
      needed.
1994: Richard Steel assaulting Thomas Bowron (constable), "the said
      Thomas Bowron" reused — FIXED sex (7562, male).
1995: Francis Dolkin assaulting Mary Jane Purvis, Lythe — FIXED sex
      (7563, female).

**Progress: id 1991-1995 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 1996-2000

1996: Margaret Ann Hansill wife of William George Hansill, drunk in
      Church Street — FIXED William George Hansill (9989): home
      Whitby + sex male (occupation already correctly jet worker) via
      pattern #6. Third sighting of this couple (spelled "Hansill");
      flagged as a likely spelling-variant match to the "Hansell"
      couple logged separately; not merged.
1997: William Thurkell riding a horse furiously in Baxtergate, on the
      oath of James Wright (Ruswarp police constable) — FIXED sex
      (7564, male). A third distinct "James Wright" context (after
      the existing Hinderwell/Egton pair); logged as a separate
      sighting, not assumed to be either.
1998: John Conroyed assaulting George Wellburn, Fylingdales — FIXED
      sex (7565, male).
1999: Eliza Dixon wife of William Dixon, drunk in Church Street —
      FIXED William Dixon (9990): home Whitby + sex male (occupation
      already correctly jet worker) via pattern #6.
2000: John Harrison riding a horse furiously in Baxtergate, on the
      information of Hugh McGregor (superintendent of police) —
      FIXED sex (7566, male).

**Progress: id 1996-2000 done (5 of 5 fully resolved). 6 sex fixes, 2
home fixes, 1 spelling-variant note logged.**

## Records 2001-2005

2001: Edmund Waterson assaulting Emma Waterson — FIXED sex (7567,
      female); shared surname noted but no relationship stated in
      source, correctly not linked as spouse/kin.
2002: Thomas Mennell begging in Baxtergate — OK, no fixes needed.
2003: William Bower of Filey, drunk and riotous, same day as 1991 —
      OK, no fixes needed; already correctly linked to Filey.
      Likely same-incident pair with 1991; logged.
2004: James Rattie begging in Victoria Square, offence at Ruswarp —
      OK, no fixes needed; already correctly carries both links (same
      exception pattern as Spring Hill/North Terrace).
2005: Edwin Renwick drunk and disorderly on the Whitby to Robin
      Hood's Bay highway, offence at Hawsker cum Stainsacre — FIXED
      location: added the existing "Whitby & Robin Hood's Bay
      Highway" (136) alongside the Hawsker-cum-Stainsacre link
      (previously missing).

**Progress: id 2001-2005 done (5 of 5 fully resolved). 1 sex fix, 1
location fix, 1 likely same-incident pair logged.**

## Records 2006-2010

2006: John Sanderson riding a horse furiously in Bridge Street, on
      the information of Hugh McGregor — FIXED sex (7568, male).
      Third "furious riding" record on 6 August 1865 (with 1997,
      2000); logged as a likely enforcement sweep.
2007: Franz Bomhena begging on the Pier — OK, no fixes needed.
2008: Solomon Marshall begging in Arundel Place, offence at Ruswarp —
      OK, no fixes needed; already correctly carries both links (same
      exception pattern).
2009: James Cunningham (Doncaster, pot hawker) assaulting Charles
      Tempest Clarkson, "the said Charles Tempest Clarkson" reused —
      FIXED sex (7569, male). Another Clarkson sighting (55+), not
      individually tracked further.
2010: Patrick Murphy hawking umbrellas without a certificate, Lythe —
      OK, no fixes needed.

**Progress: id 2006-2010 done (5 of 5 fully resolved). 2 sex fixes, 1
enforcement-sweep note logged.**

## Records 2011-2015

2011: Solomon Marshall assaulting constable William Marshall, offence
      at Ruswarp, same day as record 2008 — FIXED sex (7570, male).
      Logged as a same-day pair.
2012: Joseph Crispin drunk and riotous in the Red Lion, refusing to
      leave for James Waite, Hinderwell — OK, no fixes needed.
2013: Ellen Hick wife of Isaac Hick, drunk on Church Street — FIXED
      Isaac Hick (9991): home Whitby + sex male (occupation already
      correct) via pattern #6. Extends the known Hick couple cluster;
      updated.
2014: Henry Batty begging at Staithes Lane End, Hinderwell — OK, no
      fixes needed; already correctly linked without the redundant
      coarser Staithes link.
2015: Thomas Crooks drunk and riotous in the Black Lion, refusing to
      leave for James Waite, on the information of Hugh McGregor —
      FIXED sex (7571, male). Logged as a likely enforcement pair with
      2012.

**Progress: id 2011-2015 done (5 of 5 fully resolved). 3 sex fixes, 1
home fix, 2 same-day clusters logged.**

## Records 2016-2020

2016: William Earl assaulting Robert Stones, Whitby — FIXED sex
      (7572, male).
2017: Robert Forth Turner maliciously damaging a YMCA book, Whitby —
      OK, no fixes needed.
2018: Thomas Jefferson (Hinderwell) drunk and riotous, on the
      information of Hugh McGregor, same day as 2012/2015 — FIXED
      sex (7573, male). Extends the Hinderwell enforcement cluster to
      3 records; updated.
2019: George Ogden Stephenson assaulting Mary Ogden Stephenson —
      FIXED sex (7574, female); shared middle name noted but no
      relationship stated in source, correctly not linked.
2020: Thomas Stewart begging on the Sleights and Grosmont highway,
      offence at Eskdaleside cum Ugglebarnby — OK, no fixes needed;
      already correctly linked to both.

**Progress: id 2016-2020 done (5 of 5 fully resolved). 3 sex fixes, 1
cluster note extended.**

## Records 2021-2025

2021: George Porritt drunk and riotous in the Red Lion, refusing to
      leave for James Waite, same day as 2012/2015/2018 — OK, no
      fixes needed. Extends the Hinderwell cluster to 4 records;
      updated.
2022: William Pattison drunk and riotous in Baxtergate — OK, no fixes
      needed; no home stated, correctly null.
2023: Thomas Cook begging on the Sleights and Grosmont highway, same
      day as 2020 — OK, no fixes needed; already correctly linked.
      Logged as a same-day pair.
2024: James Curssey ill-treating a horse, offence at Eskdaleside — OK,
      no fixes needed.
2025: William Thornton begging in Robin Hood's Bay town street,
      offence at Fylingdales — OK, no fixes needed; already correctly
      resolves to Robin Hood's Bay.

**Progress: id 2021-2025 done (5 of 5 fully resolved). 0 fixes needed
(all already correct), 2 cluster notes updated.**

## Records 2026-2030

2026: Michael Joyce peddling buttons and combs without a licence,
      Fylingdales — OK, no fixes needed.
2027: John Kelly assaulting constable Hugh McGregor, "the said Hugh
      McGregor" reused — FIXED sex (7575, male). Another McGregor
      sighting.
2028: William Pattison drunk and riotous in Baxtergate, same
      recurring pattern as 2022 — OK, no fixes needed; logged as a
      likely recurring individual.
2029: William Bryan Stubbs (schoolboy) ill-treating an ass,
      Fylingdales — OK, no fixes needed.
2030: George Dixon assaulting constable William Horsley Bell, "the
      said William Horsley Bell" reused — FIXED sex (7576, male).

**Progress: id 2026-2030 done (5 of 5 fully resolved). 2 sex fixes, 1
recurring-name note logged.**

## Records 2031-2035

2031: John Brown begging in Flowergate — OK, no fixes needed.
2032: William Stubbs (schoolboy) ill-treating an ass, same day/charge
      as 2029/2035 — OK, no fixes needed. Confirmed 3-person group
      incident; logged.
2033: William Harland assaulting Jane Gatenby, wife of Richard
      Gatenby — FIXED sex (7577 Jane female, 10222 Richard male) +
      home (10222, Whitby; occupation already correct) via pattern
      #6.
2034: Samuel Williams begging on the Whitby and Robin Hood's Bay
      highway, offence at Fylingdales — OK, no fixes needed; already
      correctly linked to both.
2035: John Richardson Dixon (schoolboy) ill-treating an ass, same
      incident as 2029/2032 — OK, no fixes needed.

**Progress: id 2031-2035 done (5 of 5 fully resolved). 2 sex fixes, 1
home fix, 1 confirmed 3-person group incident logged.**

## Records 2036-2040

2036: Andrew McDonald drunk, on the information of Hugh McGregor —
      FIXED sex (7578, male).
2037: William Lorrains drunk and disorderly, Bridge Street — OK, no
      fixes needed.
2038: Margaret Ann Hansill wife of William George Hansill, drunk in
      Church Street — FIXED William George Hansill (9992): home
      Whitby + sex male (occupation already correct) via pattern #6.
      Fourth sighting of this couple; updated.
2039: Matthew Flynn damaging James Nicholson Clarkson's window in
      Grape Lane, on the oath of Henry Simpson (gentleman, Ruswarp) —
      FIXED sex (7579 Clarkson, 7580 Simpson, both male). Note: James
      Nicholson Clarkson is a distinct person from the recurring
      Charles Tempest Clarkson — different given name, not conflated.
2040: George Hoggarth drunk and disorderly in the Old Market Place —
      OK, no fixes needed.

**Progress: id 2036-2040 done (5 of 5 fully resolved). 4 sex fixes, 1
home fix, 1 recurring-couple sighting updated.**

## Records 2041-2045

2041: George Wood drunk and disorderly, Baxtergate — OK, no fixes
      needed.
2042: William Harland drunk, on the oath of Martin Dickinson
      (sergeant of police), same date as record 2033 (also William
      Harland) — FIXED sex (7581, male). Logged as a likely same-person
      same-day pair.
2043: William Brodrick drunk and disorderly on the Pier — OK, no
      fixes needed.
2044: Edward Raw drunk and disorderly on the pier — OK, no fixes
      needed.
2045: George Robson (jet miner) drunk, Whitby — OK, no fixes needed.

**Progress: id 2041-2045 done (5 of 5 fully resolved). 1 sex fix, 1
same-day pair logged.**

## Records 2046-2050

2046: Patrick Doran begging in Thorpe town street, offence at
      Fylingdales — OK, no fixes needed; already correctly resolves
      to Fylingthorpe.
2047: William Griffin assaulting John Arnold, Whitby — FIXED sex
      (7582, male).
2048: George Porritt drunk and riotous, on the oath of James Waite,
      Hinderwell, different date from the earlier Red Lion sighting —
      FIXED sex (7583, male). Recurring name, separate incident.
2049: James Brown (Easington) drunk and riotous in Staithes town
      street, offence at Hinderwell — OK, no fixes needed; already
      correctly resolves to Staithes.
2050: Herbert Pearson (Newholm-cum-Dunsley) obstructing Staithes High
      Street with a cart, offence at Hinderwell — OK, no fixes needed;
      already correctly linked to High Street under Staithes.

**Progress: id 2046-2050 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 2051-2055

2051: John Sherwood assaulting Mary Allison, "the said Mary Allison"
      reused — FIXED sex (7584, female).
2052: Thomas Stokes drunk and riotous, St Ann's Staith — OK, no fixes
      needed.
2053: Francis Fewster drunk on Thomas Wadsworth's licensed premises —
      FIXED sex (7585, male). Wadsworth recurs (with 1987).
2054: John Robinson assaulting constable Frank Crosier — FIXED sex
      (7586, male). Record has a "[Date endorsed as August, but
      September written in the text]" annotation — part of the
      already-flagged, deprioritized documentation-only sweep, not
      actioned. Frank Crosier is a recurring name (assault victim in
      1874/1877 too, different incidents).
2055: Charles Boyce drunk in Church Street — OK, no fixes needed.

**Progress: id 2051-2055 done (5 of 5 fully resolved). 4 sex fixes.**

## Records 2056-2060

2056: Joseph Sparks drunk on Henry Levy Leslie's licensed premises —
      FIXED sex (7587, male).
2057: Richard Collier drunk, Whitby — OK, no fixes needed.
2058: James Wood drunk and disorderly, Church Street — OK, no fixes
      needed.
2059: William Price assaulting Mary Gibson, Egton — FIXED sex (7588,
      female).
2060: John Shaw drunk on Hannah Dawson's licensed premises — FIXED
      sex (7589, female).

**Progress: id 2056-2060 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 2061-2065

2061: Thomas Grady drunk and disorderly, Victoria Square — OK, no
      fixes needed.
2062: Elisabeth Sedman wife of George Sedman, drunk — FIXED George
      Sedman (9993): home Whitby + sex male (occupation already
      correct) via pattern #6. Different George Sedman context from
      the jet-worker defendant in 1956 (that one's occupation was jet
      worker, not labourer) — not assumed to be the same person.
2063: Joseph Paylor drunk and riotous, Victoria Square, offence at
      Ruswarp — OK, no fixes needed; already correctly carries both
      links.
2064: Frederick Heatson destroying his own clothes in the Whitby
      Union workhouse — OK, no fixes needed.
2065: Moses Thompson (Lythe) drunk, on the oath of William Tillson —
      FIXED sex (7590, male).

**Progress: id 2061-2065 done (5 of 5 fully resolved). 2 sex fixes, 1
home fix.**

## Records 2066-2070

2066: Susan Backhouse (widow) drunk and disorderly, St Ann's Staith —
      OK, no fixes needed.
2067: Caroline Sanders (Ruswarp) begging in St Hilda's Terrace — OK,
      no fixes needed; already correctly carries both links.
2068: William Pattison (fisherman) drunk, Whitby, 1865 — OK, no fixes
      needed. Distinct from the other William Pattison contexts
      already logged (different occupation/decade); not conflated.
2069: John Wilson drunk and disorderly, Sandgate — OK, no fixes
      needed.
2070: Andrew Thompson begging, St Ann's Staith — OK, no fixes needed.

**Progress: id 2066-2070 done (5 of 5 fully resolved). 0 fixes
needed.**

## Records 2071-2075

2071: Hannah Palmer wife of George Palmer, drunk — FIXED George
      Palmer (9994): home Whitby + sex male (occupation already
      correct) via pattern #6.
2072: Charles Hughes drunk and riotous, St Ann's Staith — OK, no
      fixes needed. Same-incident pair with 2075; logged.
2073: John Smith begging in Crescent Terrace — OK, no fixes needed;
      already correctly linked despite the source omitting "township
      of" wording.
2074: James McIntyre begging, Ruswarp — OK, no fixes needed.
2075: William Souter drunk and riotous, St Ann's Staith, same day as
      2072 — OK, no fixes needed. Confirmed same-incident pair.

**Progress: id 2071-2075 done (5 of 5 fully resolved). 1 home fix, 1
confirmed same-incident pair.**

## Records 2076-2080

2076: Francis Fewster drunk and disorderly, Church Street — OK, no
      fixes needed. Same-day pair with 2079; logged.
2077: William Chambers (Glaisdale) trespassing after conies on John
      White's land, Egton — FIXED sex (7591, male).
2078: Thomas Hedley Robinson (Hinderwell) drunk and riotous, Staithes
      town street — OK, no fixes needed; already correctly resolves
      to Staithes.
2079: Francis Fewster assaulting Thomas Loftus, same day as 2076 —
      FIXED sex (7592, male). Confirmed same-day pair.
2080: George Wheatley drunk, on the oath of William Pickering,
      offence at Eskdaleside — FIXED sex (7593, male).

**Progress: id 2076-2080 done (5 of 5 fully resolved). 3 sex fixes, 1
same-day pair logged.**

## Records 2081-2085

2081: "[blank] Conowski" (dealer in patent medicines) obstructing
      Sandgate, on the oath of William Spence — FIXED sex (7594,
      male); blank-first-name defendant correctly left sex/first name
      null.
2082: Francis Fewster assaulting constable William Dobson, third
      conviction same day (with 2076/2079) — FIXED sex (7595, male).
      Cluster note updated to 3 records/one escalating night.
2083: Robert Cummins (Hinderwell) drunk — OK, no fixes needed.
2084: Christopher Sunley (Ruswarp) assaulting Jane Winter (barmaid),
      witnessed by James Duffey and Burton Newbald — FIXED sex (7596
      Winter female, 7597 Duffey male, 7598 Newbald male).
2085: William Ward of Stonegate, Glaisdale, keeping a dog without a
      licence — OK, no fixes needed; already correctly linked to
      Stonegate.

**Progress: id 2081-2085 done (5 of 5 fully resolved). 5 sex fixes, 1
cluster note updated.**

## Records 2086-2090

2086: Isaac Wilson assaulting his wife Elisabeth Wilson, "said
      Elisabeth Wilson" reused — FIXED sex (7599, female).
2087: George Wilks and Marshall Wright trespassing after game on
      land occupied by the North Eastern Railway Company and John
      Watson, offence at Egton — FIXED sex (7600, male). NER Company
      mention correctly left unlinked (generic, consistent with the
      earlier NER sweep resolution).
2088: Robert Jones destroying his own clothes in the Whitby Union
      workhouse — OK, no fixes needed.
2089: John McDonnell assaulting constable Hugh McGregor — FIXED sex
      (7601, male).
2090: John Porritt (Hinderwell) drunk and riotous, Staithes town
      street — OK, no fixes needed; distinct from the recurring
      George Porritt (different first name).

**Progress: id 2086-2090 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 2091-2095

2091: William Murphy damaging churchyard soil/herbage, property of
      Revd George Austen — FIXED sex (7602, male). Same-incident pair
      with 2094; logged.
2092: John McDonnell drunk and riotous, same day as 2089 — OK, no
      fixes needed; likely same person, logged as a same-day pair.
2093: William Codling (innkeeper) keeping licensed premises open
      outside hours, Hinderwell — OK, no fixes needed.
2094: Thomas Maddison damaging the same churchyard, same day as 2091
      — FIXED sex (7603, male). Confirmed same-incident pair.
2095: Michael Hurrell of Yarmouth, Norfolk, assaulting constable
      William Metcalfe, "the said William Metcalfe" reused — FIXED
      sex (7604, male); Yarmouth already correctly linked.

**Progress: id 2091-2095 done (5 of 5 fully resolved). 3 sex fixes, 2
same-day/incident pairs logged.**

## Records 2096-2100

2096: Robert Smith in the highway behind John Street with intent to
      commit a felony, offence at Ruswarp — OK, no fixes needed;
      already correctly carries both links.
2097: Richard Duck (Fylingdales) drunk and disorderly, Robin Hood's
      Bay town street — OK, no fixes needed; already correctly
      resolves to Robin Hood's Bay.
2098: Edward Romford assaulting Sarah Amelia Wyllie, Fylingdales —
      FIXED sex (7605, female).
2099: Robert Dixon trespassing after game on North Eastern Railway
      Company/John Watson land, same day as 2087 — FIXED sex (7606,
      male). Confirmed 3-person group trespass with 2087; NER Company
      mention correctly left unlinked (consistent with the earlier
      sweep).
2100: James Garrett not appearing for annual militia training at
      Richmond — OK, no fixes needed; no offence-location link
      exists since this offence type (a failure to appear) has no
      clear physical offence location the way others do — correctly
      not fabricated.

**Progress: id 2096-2100 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed group-trespass incident logged.**

## Records 2101-2105

2101: William Campion damaging Joseph Featherstone's butter, Whitby
      — FIXED sex (7607, male).
2102: Luke Walker fishing for salmon before 6am, offence at Hawsker
      cum Stainsacre — OK, no fixes needed.
2103: Matthew Flanagan drunk and disorderly, Church Street — OK, no
      fixes needed.
2104: Angus Lamond (Glaisdale) drunk, offence at Eskdaleside — OK, no
      fixes needed.
2105: John Conroyed drunk and disorderly in Robin Hood's Bay town
      street, on the oath of William Woardley, same day as record
      1998 — FIXED sex (7608, male). Logged as a likely same-person
      same-day pair.

**Progress: id 2101-2105 done (5 of 5 fully resolved). 2 sex fixes, 1
same-day pair logged.**

## Records 2106-2110

2106: Luke Lyons (Sneaton) begging in Sneaton town street — OK, no
      fixes needed; already correctly resolves to Sneaton.
2107: John Watkins assaulting constable William Horsley Bell, "the
      said William Horsley Bell" reused — FIXED sex (7609, male).
      Same day as 2110; logged.
2108: William Pattison (jet worker) drunk and riotous, Flowergate —
      OK, no fixes needed. Yet another William Pattison
      occupation-context; not conflated with the others already
      logged.
2109: Joseph Bridges assaulting Sarah Davison, Whitby — FIXED sex
      (7610, female).
2110: James Kelly drunk, on the oath of William Horsley Bell, same
      day as 2107 — FIXED sex (7611, male). Logged as an enforcement
      pair.

**Progress: id 2106-2110 done (5 of 5 fully resolved). 3 sex fixes, 1
same-day pair logged.**

## Records 2111-2115

2111: George Dobson of Hag House, stealing apples from William Ray's
      garden, Ugglebarnby — FIXED sex (7612, male); Hag House already
      correctly linked.
2112: Joseph Deking begging in Sleights town street, offence at
      Eskdaleside cum Ugglebarnby — OK, no fixes needed; already
      correctly resolves to Sleights.
2113: George Dixon drunk and riotous, Church Street, on the oath of
      Martin Dickinson — FIXED sex (7613, male). Another Dickinson
      sighting.
2114: William Souter assaulting constable John Nicholson, same day as
      2075 — FIXED sex (7614, male). Second same-day conviction for
      Souter; cluster note updated. John Nicholson is the
      super-recurring Whitby constable (23+ sightings), not
      individually tracked further.
2115: Robert Harrowing (Aislaby, shipowner) drunk and disorderly,
      Marine Parade — OK, no fixes needed.

**Progress: id 2111-2115 done (5 of 5 fully resolved). 3 sex fixes, 1
cluster note updated.**

## Records 2116-2120

2116: William Leighton drunk, Whitby — OK, no fixes needed; no home
      stated, correctly null.
2117: Thomas Peart drunk and riotous, Sandgate — OK, no fixes needed.
2118: Isaac Bailey (Glaisdale) begging in Lealholm town street — OK,
      no fixes needed; already correctly resolves to Lealholm.
2119: Francis Wrightson trespassing after game on land of Sir John
      Vanden Bempde Johnstone, baronet — landowner (7615) already
      correctly captured (title "Sir", office "2nd Baronet of
      Hackness Hall", sex, home) per the established esquire/baronet
      rule in reextraction-audit-notes.md. CORRECTION (see records
      2233/2236 note below): I initially and wrongly added "baronet"
      as a new occupation here, duplicating a mistake already
      resolved with the user once before ("baronet" is explicitly
      documented as never an occupation). Reverted — occupation row
      deleted, no DB change remains from this record. No fixes
      needed; already correct.
2120: William White drunk on Hannah Dawson's licensed premises —
      FIXED sex (7616, female).

**Progress: id 2116-2120 done (5 of 5 fully resolved). 1 new
occupation created + linked, 1 sex fix.**

## Records 2121-2125

2121: Joseph Atkins begging in Grosmont town street, offence at
      Eskdaleside cum Ugglebarnby — OK, no fixes needed; already
      correctly resolves to Grosmont.
2122: Elizabeth Sedman wife of George Sedman, assaulting William
      Lloyd — FIXED sex (7617 Lloyd male) + George Sedman (9995): home
      Whitby + sex male (occupation already correct) via pattern #6.
      Recurring Sedman couple; logged.
2123: Mark Aylan resisting constable John Nicholson, same day as
      2114 — FIXED sex (7618, male). Extends the day's resisting-arrest
      cluster; logged.
2124: William Hoilton destroying his own clothes in the Whitby Union
      workhouse — OK, no fixes needed.
2125: Benjamin Walker absenting himself from service to Charles
      Bagnall and Thomas Bagnall the younger (ironmasters), on the
      oath of William Henry Talbot — FIXED sex on three (7619
      Charles Bagnall, 7620 Thomas Bagnall, 7621 Talbot, all male);
      Thomas Bagnall's "the younger" postfix and Talbot's full name
      already correctly captured.

**Progress: id 2121-2125 done (5 of 5 fully resolved). 6 sex fixes, 1
home fix, 2 cluster/recurring notes logged.**

## Records 2126-2131 (2127 does not exist — scrape gap, verified)

2126: James Bales destroying whins on Daniel Stephens's land,
      Hinderwell — FIXED sex (7622, male).
2128: William Bright (Hinderwell) trespassing after conies on the
      Marquis of Normanby's woodland — OK, no fixes needed; landowner
      already correctly identified as the real historical peer
      Constantine Henry Phipps, sex already male.
2129: John Telford drunk and riotous, Staithes town street, on the
      oath of William Hammond — FIXED sex (7623, male). Hammond now
      9th sighting; updated.
2130: Thomas Parker (Ruswarp) begging in Flowergate, offence at
      Ruswarp — OK, no fixes needed; already correctly carries both
      links (same exception pattern as Spring Hill/North Terrace).
2131: Thomas Jefferson (Hinderwell) drunk and riotous, on the oath of
      Charles Tempest Clarkson — FIXED sex (7624, male). Another
      Clarkson sighting (56+), not individually tracked further.

**Progress: id 2126-2131 done (5 of 5 fully resolved, 1 gap
verified). 4 sex fixes, 1 recurring-name sighting logged.**

## Records 2132-2136

2132: William Gray trespassing after conies on land of Francis Scarth
      and William Scarth, Hinderwell — FIXED sex (7625, 7626, both
      male).
2133: Paul Marshall playing a game of chance with coins, offence at
      Hawsker cum Stainsacre — OK, no fixes needed.
2134: Ward Burden absenting himself from James Sanderson's service,
      "the said James Sanderson" reused — FIXED sex (7627, male).
2135: Matthew Raw drunk in charge of a horse and cart on the Egton
      and Grosmont highway — OK, no fixes needed; already correctly
      linked to both.
2136: Thomas William Welham playing a game of chance with coins,
      offence at Hawsker cum Stainsacre, 2 days after 2133 — OK, no
      fixes needed; similar recurring offence type, not same incident
      (different date).

**Progress: id 2132-2136 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 2137-2141

2137: William Willes absenting himself from Charles/Thomas Bagnall's
      service, on the oath of William Henry Talbot — FIXED sex on
      three (7628 Charles, 7629 Thomas, 7630 Talbot, all male);
      "the younger" postfix already correctly captured. No offence
      date at all in source (offence_date_raw also null) — correctly
      left blank, not a fabrication opportunity.
2138: Francis Fewster drunk and riotous, Flowergate, 1874 (13 years
      before the May 1887 Fewster cluster) — OK, no fixes needed; not
      conflated with the later Fewster given the large gap.
2139: Kate Ward (widow) drunk and disorderly, Church Street — OK, no
      fixes needed.
2140: John Shaw drunk, Whitby — OK, no fixes needed.
2141: Hannah Dawson allowing drunkenness on her own licensed
      premises, same day as 2138 — OK, no fixes needed; recurring
      licensee (with 2060/2120).

**Progress: id 2137-2141 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 2142-2146

2142: Hannah Scales (widow) drunk and disorderly, Church Street, same
      day as 2139 — OK, no fixes needed. Confirmed same-day pair;
      logged.
2143: Joseph Harland assaulting William Readman, "the said William
      Readman" reused — FIXED sex (7631, male).
2144: Thomas Atkinson using obscene language, Sandgate — OK, no
      fixes needed.
2145: Isaac Hicks drunk on Shafto Pearson Richardson's licensed
      premises, refusing to leave for Alfred Longstaffe — FIXED sex
      (7632, 7633, both male). "Hicks" spelling here vs the recurring
      "Hick" couple — different spelling, not conflated.
2146: James Caw in Charles Davy's dwelling house with intent to
      commit felony — FIXED sex (7634, male).

**Progress: id 2142-2146 done (5 of 5 fully resolved). 5 sex fixes, 1
confirmed same-day pair logged.**

## Records 2147-2151

2147: John Ayres assaulting Frederick Collinwood, aged 10 — FIXED sex
      (7635, male); birth_year already correctly computed (1864).
2148: William Martin assaulting Jane Thompson — FIXED sex (7636,
      female).
2149: Thomas Davis damaging Thomas Wood's door, "the said Thomas
      Wood" reused, Glaisdale — FIXED sex (7637, male).
2150: Max Freeman hawking pictures without a certificate — OK, no
      fixes needed.
2151: Charles Fox (Hinderwell) begging in Ugthorpe town street,
      offence at Ugthorpe — OK, no fixes needed; already correctly
      resolves to Ugthorpe.

**Progress: id 2147-2151 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 2152-2156

2152: Harding Shepherd lodging in a pigsty with no visible means of
      subsistence, Ruswarp — OK, no fixes needed.
2153: John Daley frequenting the Market Place, intent to steal from
      Margaret Jane Harding, James Harding named as owner of the
      money — FIXED sex (7638 James male, 7639 Margaret Jane female).
2154: Charles Fox assaulting constable Jonah Hawkins, offence at
      Mickleby, same day as 2151 (Fox begging at Ugthorpe) — FIXED sex
      (7640, male). Very likely one continuous incident (begging,
      caught, resisted); logged.
2155: George Dixon drunk and riotous, Church Street, on the oath of
      Henry Wheat — FIXED sex (7641, male).
2156: George Hoggarth drunk and disorderly, Church Street, on the
      oath of George Eli North "of the township of Whitby" — FIXED sex
      (7642, male). Flagged as a discrepancy: every other George Eli
      North sighting states Fylingdales, not Whitby; not assumed to be
      the same person, logged in same-person-candidates.md.

**Progress: id 2152-2156 done (5 of 5 fully resolved). 5 sex fixes, 1
likely same-incident pair, 1 discrepancy flagged.**

## Records 2157-2161

2157: John Vennon (Lythe) begging in Lythe town street — OK, no fixes
      needed; already correctly resolves to Lythe.
2158: John Backhouse drunk and riotous, Church Street, on the oath of
      Henry Wheat, same day as 2155 — FIXED sex (7643, male). Logged
      as an enforcement pair.
2159: James Ketton (retired miller) drunk, Bridge Street — OK, no
      fixes needed.
2160: Jane Telford (Ruswarp) begging in Abbey Terrace — OK, no fixes
      needed; already correctly carries both links.
2161: George Porter assaulting constable William Pickering, Egton —
      FIXED sex (7644, male).

**Progress: id 2157-2161 done (5 of 5 fully resolved). 2 sex fixes, 1
enforcement pair logged.**

## Records 2162-2166

2162: Belleriana Agrippa lodging in a shed with no visible means of
      subsistence, Lythe — OK, no fixes needed; sex already correctly
      male based on the source's own "not giving a good account of
      himself" pronoun, correctly overriding the name's female-sounding
      appearance.
2163: John Wilson of Cote Bank trespassing after conies on Richard
      Rudgard's land, Egton — FIXED sex (7645, male); Cote Bank
      already correctly linked.
2164: John Egton assaulting William Harrison, "the said William
      Harrison" reused — FIXED sex (7646, male).
2165: Thomas Clarkson resisting constable John Smith — FIXED sex
      (7647, male). Distinct from the recurring Charles Tempest
      Clarkson (different given name), not conflated.
2166: Thomas Lee begging in Lealholm, offence at Glaisdale — FIXED
      location: replaced the coarser Glaisdale link with the specific
      Lealholm link (previously missing), consistent with the
      established single-destination-site convention.

**Progress: id 2162-2166 done (5 of 5 fully resolved). 3 sex fixes, 1
location fix.**

## Records 2167-2171

2167: Robert Smith absenting himself from John Harland's service,
      "the said John Harland" reused — FIXED sex (7648, male).
2168: Charles Boyce assaulting constable John Smith, witnessed by
      John Smith and Urban Bird — FIXED sex (7649, 7650, both male).
      Third record of the day involving constable Smith (with 2165);
      logged.
2169: John Riley (Ruswarp) begging in Gray Street — OK, no fixes
      needed; already correctly carries both links.
2170: Robert Stephenson, John Pearson, Thomas Stabler and Thomas
      Harland stealing conies from Robert Middleton, Hawsker cum
      Stainsacre — FIXED sex (7651, male); four-defendant group theft
      already correctly modelled as one record.
2171: Charles Boyce ALSO resisting constable John Smith, same day as
      2168 — FIXED sex (7652, male). Confirmed second same-day charge
      for Boyce; cluster note updated.

**Progress: id 2167-2171 done (5 of 5 fully resolved). 5 sex fixes, 1
3-record cluster logged.**

## Records 2172-2176

2172: William Wood (Mickleby) begging in Mickleby town street — OK,
      no fixes needed; already correctly resolves to Mickleby.
2173: Thomas Stanway (alehouse keeper) allowing drunkenness on his
      licensed premises — OK, no fixes needed.
2174: John Backhouse drunk and disorderly, Sandgate — OK, no fixes
      needed.
2175: James Smith (Borrowby) begging in Dale House, offence at
      Borrowby — OK, no fixes needed; already correctly linked.
2176: Marshall Pearson and John Black damaging John Wood's dwelling
      house, Egton — FIXED sex (7653, male).

**Progress: id 2172-2176 done (5 of 5 fully resolved). 1 sex fix.**

## Records 2177-2181

2177: John Beswick of Runswick, unramming a misfired charge in an
      ironstone mine, Hinderwell — OK, no fixes needed.
2178: George Burnett's horse found straying on the Scarborough and
      Whitby highway — FIXED location: created "Scarborough & Whitby
      Highway" (414) under Highways (106), two-endpoint highway
      convention, added alongside Hawsker-cum-Stainsacre.
2179: Robert Pearson assaulting Jane Snowdon, "the said Jane Snowdon"
      reused, offence at Hawsker cum Stainsacre — FIXED sex (7654,
      female).
2180: William Bruce lodging in a cow-house with no visible means of
      subsistence, Fylingdales — OK, no fixes needed; sex already
      correctly male via the source's own "himself" pronoun.
2181: Frederick Hubbard of Scarborough begging on the Whitby and
      Stainsacre highway — OK, no fixes needed; already correctly
      linked to both.

**Progress: id 2177-2181 done (5 of 5 fully resolved). 1 new highway
node, 1 sex fix.**

## Records 2182-2186

2182: Thomas Nicholson drunk, Ruswarp — OK, no fixes needed.
2183: James Theaker and Joseph Verrill assaulting constable William
      Hammond, Hinderwell — FIXED sex (7655, male). Hammond now 10th
      sighting; updated.
2184: John William Masham of Scarborough begging on the Whitby and
      Stainsacre highway, same day as 2181 — OK, no fixes needed;
      already correctly linked to both. Logged as a likely
      same-incident pair with 2181.
2185: William Ward (fruiterer) assaulting Josephine Wray — FIXED sex
      (7656, female). Possibly the same recurring William Ward
      fruiterer from 1916/1919, 3 years earlier; logged, not merged.
2186: Robert Dixon drunk and disorderly, Church Street — OK, no fixes
      needed.

**Progress: id 2182-2186 done (5 of 5 fully resolved). 2 sex fixes, 3
recurring/same-incident notes logged.**

## Records 2187-2193 (2188, 2191 do not exist — scrape gaps, verified)

2187: George Bowering of Scarborough begging on the Whitby and
      Stainsacre highway, same day as 2181/2184 — OK, no fixes
      needed. Extends the cluster to 3; updated.
2189: William Dixon drunk and disorderly, Church Street, same day as
      2186 (Robert Dixon, different first name) — OK, no fixes
      needed; not asserted as related.
2190: Thomas Readman (Egton) drunk in charge of a waggon and horses,
      St Hilda's Terrace, offence at Ruswarp — OK, no fixes needed;
      already correctly carries both links.
2192: Mary Wray wife of Cuthbert Wray, drunk in Grape Lane — FIXED
      Cuthbert Wray (9996): home Whitby + sex male (occupation
      already correct) via pattern #6.
2193: Henry Penny (Newholm-cum-Dunsley) begging in East Row — OK, no
      fixes needed.

**Progress: id 2187-2193 done (5 of 5 fully resolved, 2 gaps
verified). 1 home fix, 1 cluster note updated.**

## Records 2194-2198

2194: Mary Fealay wife of John Fealay, assaulting Bridget McCarty —
      FIXED sex (7657 McCarty female) + John Fealay (9997): home
      Whitby + sex male (occupation already correct) via pattern #6.
      Same-day pair with 2197; logged.
2195: John Hodgson drunk and disorderly on the Pier — OK, no fixes
      needed.
2196: John Cleming Grenfell begging in St Hilda's Terrace, offence at
      Ruswarp — OK, no fixes needed; already correctly carries both
      links.
2197: John Fealay assaulting William Walsh, same day as 2194 — FIXED
      sex (7658, male). Confirmed same-day couple with 2194.
2198: Annie Major lodging in a hay house with no visible means of
      subsistence, Ruswarp — OK, no fixes needed; sex already
      correctly female (both name and the source's own "herself"
      pronoun agree).

**Progress: id 2194-2198 done (5 of 5 fully resolved). 4 sex fixes, 1
home fix, 1 same-day pair logged.**

## Records 2199-2203

2199: John Cleming Grenfell begging in the Esplanade, offence at
      Ruswarp, day after record 2196 — OK, no fixes needed; already
      correctly carries both links. Recurring name (likely same
      person, second day begging).
2200: Leightowner Stainthorpe assaulting Joseph Wright, "the said
      Joseph Wright," Eskdaleside — FIXED sex (7659, male).
2201: Henry Whittaker trespassing after conies on land occupied by
      "Henry Whittaker [sic]" — OK, no fixes needed; the source's own
      "[sic]" flag marks this self-referential landowner name as an
      anomaly, correctly modelled as a single person row rather than
      a fabricated duplicate.
2202: Robert Harrison (Egton) drunk and disorderly on the Glaisdale
      highway, offence at Glaisdale — OK, no fixes needed; verified
      consistent with the only other record using this "Glaisdale
      Highway" node (3887) — both correctly keep the plain Glaisdale
      link alongside the highway link for this particular named
      highway, unlike the "replaces" convention used elsewhere.
2203: Jane Readman assaulting Elizabeth Readman, wife of John Readman
      (rope maker) — FIXED sex (7660 Elizabeth female) + John Readman
      (10224): home Whitby + sex male (occupation already correct)
      via pattern #6.

**Progress: id 2199-2203 done (5 of 5 fully resolved). 3 sex fixes, 1
home fix.**

## Records 2204-2208

2204: George Cass drunk and disorderly, Haggersgate — OK, no fixes
      needed.
2205: Solomon Marshall lodging in a pig sty, offence at Hawsker cum
      Stainsacre — OK, no fixes needed; third sighting, logged.
2206: William Fergusson (late of Ruswarp) begging in Broad Ings — OK,
      no fixes needed; already correctly resolves to "Broadings."
2207: Mary Wray using obscene language in Grape Lane, same day as
      2192 — FIXED Cuthbert Wray (9998): home Whitby + sex male
      (occupation already correct) via pattern #6. Confirmed same-day
      pair; logged.
2208: John Brown (Glaisdale) begging in Lealholm town street — OK, no
      fixes needed; already correctly resolves to Lealholm.

**Progress: id 2204-2208 done (5 of 5 fully resolved). 1 home fix, 2
recurring/same-day notes logged.**

## Records 2209-2213

2209: William Potts assaulting John Henry Roberts, Whitby — FIXED sex
      (7661, male). Same-incident pair with 2212; logged.
2210: John Waller drunk and disorderly on the pier — OK, no fixes
      needed.
2211: James Hedley (Lythe) begging in Lythe town street — OK, no
      fixes needed; already correctly resolves to Lythe.
2212: John Wilson assaulting John Henry Roberts, same day as 2209 —
      FIXED sex (7662, male). Confirmed same-incident pair.
2213: Joseph Paylor using indecent language in Marton's Yard — OK, no
      fixes needed.

**Progress: id 2209-2213 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair.**

## Records 2214-2218

2214: Hannah Elizabeth Peacock wife of John Peacock, begging in
      Hanover Terrace, offence at Ruswarp — FIXED John Peacock
      (9999): home Whitby + sex male (occupation already correct) via
      pattern #6. Already correctly carries both location links.
2215: Thomas Smith assaulting John Henry Roberts, same day as
      2209/2212 — FIXED sex (7663, male). Confirmed 3-person gang
      assault; cluster note updated.
2216: David Wood drunk and disorderly, Church Street — OK, no fixes
      needed.
2217: Robert Harrison (Glaisdale, quarryman) drunk and disorderly,
      Wellington Road — OK, no fixes needed. Likely the same recurring
      man as 2202, a week later; logged.
2218: Frances Midgley (singlewoman, Hinderwell) lodging in a coal
      house, no visible means of subsistence — OK, no fixes needed;
      sex already correctly female.

**Progress: id 2214-2218 done (5 of 5 fully resolved). 2 sex fixes, 1
home fix, 2 cluster/recurring notes logged.**

## Records 2219-2223

2219: George Robinson Hodgson drunk and disorderly on the Pier — OK,
      no fixes needed.
2220: Malachey Kelly (Hinderwell) drunk and disorderly, Staithes town
      street — OK, no fixes needed. Same-day pair with 2223; logged.
2221: Thomas Jefferson (Hinderwell) drunk and riotous, "Staithes
      Street" — OK, no fixes needed; already correctly resolves to
      Staithes itself.
2222: William Thompson lodging under a straw stack, no visible means
      of subsistence, Hawsker cum Stainsacre — OK, no fixes needed;
      sex already correctly male via the "himself" pronoun.
2223: Margaret Kelly wife of Malachey Kelly, drunk, same day/place as
      2220 — FIXED Malachey Kelly (10000): home Hinderwell + sex male
      (occupation already correct) via pattern #6. Confirmed same-day
      couple; logged.

**Progress: id 2219-2223 done (5 of 5 fully resolved). 1 home fix, 1
confirmed same-day couple logged.**

## Records 2224-2228

2224: George Porritt drunk and riotous, Staithes Street, same day as
      2221 — OK, no fixes needed; already correctly resolves to
      Staithes. Logged as a likely same-day pattern.
2225: George Wood drunk and disorderly, Church Street — OK, no fixes
      needed.
2226: Robert Purvis assaulting Hannah Atkinson — FIXED sex (7664,
      female); no offence township stated in source, correctly no
      location link.
2227: William Gaskin drunk and riotous, Haggersgate — OK, no fixes
      needed.
2228: John Porritt (Eskdaleside) drunk and disorderly, Grosmont town
      street — OK, no fixes needed; already correctly resolves to
      Grosmont.

**Progress: id 2224-2228 done (5 of 5 fully resolved). 1 sex fix, 1
same-day note logged.**

## Records 2229-2233

2229: Robert Purvis assaulting Mary Jane Mathews, same day as 2226 —
      FIXED sex (7665, female). Confirmed same-day two-conviction
      pattern; logged.
2230: Francis Harrison assaulting Thomas Bissill — FIXED sex (7666,
      male).
2231: William Green of Lands (Lythe, gamekeeper) failing to vaccinate
      his children Edith and Ruth Green — FIXED sex on both (7667,
      7668, female) and corrected role from generic "unspecified" to
      the schema's existing "child" role.
2232: George Jones begging on the Eskdaleside highway, offence at
      Eskdaleside cum Ugglebarnby — OK, no fixes needed; already
      correctly linked to both.
2233: Zachariah Fletcher trespassing after conies on the Marquis of
      Normanby's land, parish of Lythe — landowner row (10343) already
      correctly captured (office "1st Marquess of Normanby (Viscount
      Normanby 1812 - 1831; Earl of Mulgrave 1831 - 1838)", per the
      rule already resolved with the user for all 17 of this real
      person's rows). CORRECTION: I initially and wrongly set
      title="Marquis" here (and on 10342/10344), fabricating a value
      never used anywhere else in the corpus and duplicating/
      contradicting the already-correct `office` field, which my
      query didn't even select. Reverted on all 3 rows — title back
      to NULL, matching the other 14 Phipps rows. No fixes needed;
      already correct. See reextraction-audit-notes.md and the new
      feedback_check_precedent_before_categorical_fields memory for
      the full postmortem.

**Progress: id 2229-2233 done (5 of 5 fully resolved). 4 sex fixes, 1
role correction, 0 title fixes (self-corrected error, reverted).**

## Records 2234-2238

2234: Charles Bald (Easington) drunk and riotous, Staithes town
      street, offence at Hinderwell — OK, no fixes needed; already
      correctly resolves to Staithes.
2235: John Codling keeping a dog without a licence, Hinderwell — OK,
      no fixes needed.
2236: John Frankland trespassing after conies on the Marquis of
      Normanby's land, same day as 2233 — landowner row (10344)
      already correctly captured via `office` (see correction note at
      2233). Title fabrication reverted here too. Confirmed 2-person
      group trespass with 2233; logged.
2237: Henry Dearlove obtaining money/food from Thomas Featherstone
      under false pretences, Hinderwell — FIXED sex (7669, male).
2238: John Harrison begging on Sleights town street, offence at
      Eskdaleside cum Ugglebarnby — OK, no fixes needed; already
      correctly resolves to Sleights.

**Progress: id 2234-2238 done (5 of 5 fully resolved). 1 sex fix, 1
title fix, 1 confirmed group-trespass incident logged.**

## Records 2239-2243

2239: Henry McLaughlin drunk, Whitby — OK, no fixes needed.
2240: William Child (Egton) drunk and disorderly, Grosmont town
      street, offence at Eskdaleside — OK, no fixes needed; already
      correctly resolves to Grosmont.
2241: James Hindhaugh (Ruswarp) begging in Flowergate Cross — OK, no
      fixes needed; already correctly linked (resolves to plain
      Flowergate alongside Ruswarp).
2242: William Jefferson assaulting Joseph Parks, "the said Joseph
      Parks" reused, Ruswarp — FIXED sex (7670, male).
2243: James Robinson playing pitch and toss in Saltwick Scar, on the
      oaths of John Nicholson and John Ryder — FIXED sex (7671, 7672,
      both male). Two more sightings of the corpus's most recurring
      police names, not individually tracked further.

**Progress: id 2239-2243 done (5 of 5 fully resolved). 3 sex fixes.**

## Records 2244-2248

2244: Edward Binns drunk and disorderly on the Pier — OK, no fixes
      needed. Same-day pair with 2247; logged.
2245: Samuel Stephenson, deserter from the Artillery Regiment of
      Militia, on the oath of Joseph Schofield (Kingston upon Hull) —
      FIXED sex (7673, male); Hull already correctly linked.
2246: Joseph Blythman driving an omnibus furiously in Victoria
      Square, offence at Ruswarp, witnessed by John Ryder and James
      Wood — FIXED sex (7674, 7675, both male). Already correctly
      carries both location links.
2247: Edward Binns assaulting constable William Cook, same day as
      2244 — FIXED sex (7676, male). Confirmed same-day pair.
2248: Mary Smith wife of William Smith (Rosedale miner), drunk, on
      the oath of John Watson — FIXED sex (7677 Watson male) +
      William Smith (10001): home Rosedale + sex male (occupation
      already correct) via pattern #6.

**Progress: id 2244-2248 done (5 of 5 fully resolved). 5 sex fixes, 1
home fix, 1 same-day pair logged.**

## Records 2249-2253

2249: Joseph Stewart resisting constable Alfred Barker, witnessed by
      William Hammond, Hinderwell — FIXED sex (7678, 7679, both
      male). Barker now 3rd sighting, Hammond 11th; both updated.
2250: James Reeves drunk and disorderly, Haggersgate — OK, no fixes
      needed. Same-day pair with 2253; logged.
2251: Sarah Seymour (common prostitute) behaving indecently, Church
      Street — OK, no fixes needed.
2252: Walter Horne drunk and disorderly, Church Street — OK, no fixes
      needed.
2253: James Reeves assaulting constable George Lambert, same day as
      2250 — FIXED sex (7680, male). Confirmed same-day pair.

**Progress: id 2249-2253 done (5 of 5 fully resolved). 3 sex fixes, 2
recurring/same-day notes logged.**

## Records 2254-2258

2254: Thomas Ward driving a horse and cart furiously on the Staithes
      highway, Hinderwell — OK, no fixes needed; already correctly
      linked to both.
2255: James Wilson driving a waggon furiously, Haggersgate — OK, no
      fixes needed.
2256: Pearson Campion drunk and disorderly, Haggersgate, same day as
      2250/2253 — OK, no fixes needed; different person, not
      conflated.
2257: Thomas Hodgson riding a horse furiously, on the oath of Thomas
      Redhead — FIXED sex (7681, male).
2258: Edward Row drunk and disorderly, Church Street — OK, no fixes
      needed.

**Progress: id 2254-2258 done (5 of 5 fully resolved). 1 sex fix.**

## Records 2259-2263

2259: John Wright and William Porritt trespassing after conies on
      John Watson's land, Egton — FIXED sex (7682, male).
2260: Mary Ann Stonehouse drunk and disorderly, Church Street, on the
      oaths of James Kidson (pawnbroker) and George Eli North — FIXED
      sex (7683, 7684, both male). Second "Whitby" George Eli North
      sighting (with 2156); cluster note updated.
2261: Larry Ragan begging in St Hilda's Terrace, offence at Ruswarp —
      OK, no fixes needed; already correctly carries both links.
2262: John Sanderson (Hinderwell) driving a horse and cart furiously
      on the Staithes highway — OK, no fixes needed; already
      correctly linked to both.
2263: William Lorrains assaulting constable John Nicholson — FIXED
      sex (7685, male).

**Progress: id 2259-2263 done (5 of 5 fully resolved). 4 sex fixes, 1
recurring-name note updated.**

## Records 2264-2268

2264: Francis Fewster drunk and disorderly on the Bridge — OK, no
      fixes needed. 5th sighting; same-day pair with 2267; logged.
2265: John Lorton begging in Church Street — OK, no fixes needed.
2266: Jacob Pearson (Loftus) drunk and disorderly, Hinderwell town
      street, on the oaths of Alfred Barker and John Stonehouse —
      FIXED sex (7686, 7687, both male). Barker now 4th sighting;
      updated.
2267: Joseph Storr drunk and disorderly on the Bridge, same day as
      2264 — OK, no fixes needed. Confirmed same-day pair.
2268: Elizabeth Smallwood using obscene language in the Whitby Union
      workhouse — OK, no fixes needed.

**Progress: id 2264-2268 done (5 of 5 fully resolved). 2 sex fixes, 2
recurring/same-day notes logged.**

## Records 2269-2273

2269: Walter Horne assaulting constable George Richard Lazenby, same
      day as 2252 — FIXED sex (7688, male). Lazenby now 10th sighting;
      same-day pair logged.
2270: John Smith begging on the Whitby and Sandsend highway, offence
      at Newholm cum Dunsley — OK, no fixes needed; already correctly
      linked to both.
2271: John York assaulting Job Allison, Glaisdale — FIXED sex (7689,
      male).
2272: Chapman Lorains drunk and riotous, Church Street — OK, no fixes
      needed.
2273: William Broderick (Hinderwell) begging in Port Mulgrave town
      street — OK, no fixes needed; already correctly resolves to
      Port Mulgrave.

**Progress: id 2269-2273 done (5 of 5 fully resolved). 2 sex fixes, 2
recurring/same-day notes logged.**

## Records 2274-2278

2274: Thomas Grady drunk, Whitby — OK, no fixes needed.
2275: Stephen Kingston drunk and riotous, Church Street — OK, no
      fixes needed.
2276: Thomas Jones (Hinderwell) begging in Port Mulgrave town street,
      same day as 2273 — OK, no fixes needed; already correctly
      resolves to Port Mulgrave. Logged as a likely same-day pair.
2277: James Thorn destroying his own clothes, Whitby Union workhouse
      — OK, no fixes needed.
2278: George Robinson (Hinderwell) assaulting constable Edward Weeks,
      witnessed by John Nicholson — FIXED sex (7690, 7691, both
      male).

**Progress: id 2274-2278 done (5 of 5 fully resolved). 2 sex fixes, 1
same-day note logged.**

## Records 2279-2283

2279: Thomas Paylor drunk and disorderly, Grape Lane — OK, no fixes
      needed. Has a "[Endorsed 5 March 1887]" annotation — already on
      the deprioritized "dated X but endorsed Y" documentation-only
      list, not actioned.
2280: James Murphy drunk, Whitby — OK, no fixes needed.
2281: William Smith drunk in Victoria Square, offence at Ruswarp, on
      the oaths of George Hewison and John Ryder — FIXED sex (7692,
      7693, both male). Already correctly carries both location
      links.
2282: Henry Douglas drunk and disorderly, Flowergate — OK, no fixes
      needed.
2283: John Smith destroying his own clothes, Whitby Union workhouse —
      OK, no fixes needed.

**Progress: id 2279-2283 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 2284-2288

2284: William Verrill keeping two dogs on a single licence, on the
      oath of William Hammond, Hinderwell — FIXED sex (7694, male).
      Hammond now 12th sighting; updated.
2285: William Clark (Glaisdale) begging in Glaisdale town street —
      OK, no fixes needed; already correctly resolves to Glaisdale.
2286: James Brogan destroying his own clothes, Whitby Union
      workhouse, same day as 2283 — OK, no fixes needed.
2287: Thomas McGuire causing William McGuire, aged 6, to beg in Egton
      Bridge town street — FIXED sex (7695, male) and corrected role
      from "unspecified" to the schema's "child" role; birth_year
      already correctly computed (1868); Egton Bridge already
      correctly linked.
2288: Eliza Collins (Hinderwell) begging in Mickleby town street,
      offence at Hinderwell — FIXED location: added Mickleby (175)
      alongside the existing Hinderwell link. Verified this is an
      established, already-consistently-applied pattern (Mickleby is
      its own standalone township in the tree, but a handful of
      records — including 2154 fixed earlier this stretch, plus
      pre-existing 415/421/427/3836 — genuinely state "township of
      Hinderwell" as the offence location while the specific place is
      Mickleby; both links are kept side by side, same shape as the
      Spring Hill/North Terrace exception).

**Progress: id 2284-2288 done (5 of 5 fully resolved). 2 sex fixes, 1
role correction, 1 location fix.**

## Records 2289-2293

2289: Harriet Coates (common prostitute) behaving indecently, the
      Shambles — OK, no fixes needed.
2290: Addison Verrill and John Peirson destroying George Moon's
      beans, Hinderwell — FIXED sex (7696, male).
2291: Richard Noble drunk in charge of a horse on the Whitby and
      Hawsker highway — OK, no fixes needed; already correctly
      linked to both.
2292: Robert Foster absenting himself from William Ward's service,
      Hutton Mulgrave — FIXED sex (7697, male); different William
      Ward context from the others already logged, not conflated.
2293: Richard Granger (Ruswarp, master mariner) drunk and disorderly,
      Thorpe town street, offence at Fylingdales — OK, no fixes
      needed; already correctly resolves to Fylingthorpe.

**Progress: id 2289-2293 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 2294-2298

2294: George Atkinson drunk and disorderly, Grosmont town street,
      offence at Eskdaleside cum Ugglebarnby — OK, no fixes needed;
      already correctly resolves to Grosmont.
2295: Hugh William Hughes (printer) drunk, Whitby — OK, no fixes
      needed. Same-day as 2298 (also a printer); logged.
2296: William Thomas Gray assaulting Joseph Wood, witnessed by Joshua
      Cass and Thomas Archer — FIXED sex (7698, 7699, 7700, all
      male).
2297: William Freeman drunk in charge of a horse and cab on the
      Whitby and Hawsker highway — OK, no fixes needed; already
      correctly linked to both.
2298: Lindsay Anderson (printer) drunk, same day as 2295 — OK, no
      fixes needed.

**Progress: id 2294-2298 done (5 of 5 fully resolved). 3 sex fixes, 1
possible-connection note logged.**

## Records 2299-2303

2299: Henry Vasey deserting from the ship "Othello" while an
      apprentice — OK, no fixes needed.
2300: Thomas Duffy drunk and disorderly, Church Street — OK, no fixes
      needed.
2301: William Graham absenting himself from William Wright's service
      — FIXED sex (7701, male).
2302: William Corpse drunk and riotous, Henrietta Street — OK, no
      fixes needed.
2303: John Simpson (East Barnby) begging on East Barnby town street —
      OK, no fixes needed; already correctly resolves to East Barnby.

**Progress: id 2299-2303 done (5 of 5 fully resolved). 1 sex fix.**

## Records 2304-2308

2304: James Raw drunk and riotous, Hinderwell — OK, no fixes needed.
      Same-day as 2307; logged.
2305: George Brewster too far from his cart to control the horse,
      Church Street — OK, no fixes needed.
2306: Elizabeth Hamilton wife of Robert Hamilton, pedlar of scissors/
      buttons/braid without a certificate, offence at Fylingdales —
      FIXED Robert Hamilton (10002): home Whitby + sex male
      (occupation already correct) via pattern #6.
2307: John Jackson (Brotton) drunk and riotous, on the oath of Frank
      Crosier (constable), Hinderwell, same day as 2304 — FIXED sex
      (7702, male).
2308: George Sedman (cartman) too far from his cart on the Pier —
      OK, no fixes needed; a third distinct occupation context for
      this recurring name, not conflated with the others.

**Progress: id 2304-2308 done (5 of 5 fully resolved). 2 sex fixes, 1
home fix, 1 same-day note logged.**

## Records 2309-2313

2309: Shafto Pearson Richardson permitting drunkenness on his
      licensed premises — OK, no fixes needed; recurring licensee
      (with 2145).
2310: Thomas Joyce damaging North Eastern Railway Company shrubs, on
      the oath of Thomas Ainslie, offence at Ruswarp — FIXED sex
      (7703, male). NER Company mention correctly left unlinked
      (matches the earlier sweep — this record was already on the
      "genuinely non-specific" list).
2311: George Brewster obstructing Haggersgate with his cart, same day
      as 2308 — OK, no fixes needed. Confirmed same-day pair; logged.
2312: Francis Fewster drunk and disorderly, Church Street — OK, no
      fixes needed. 6th sighting.
2313: Patrick Flannagan begging in Bridge Street — OK, no fixes
      needed.

**Progress: id 2309-2313 done (5 of 5 fully resolved). 1 sex fix, 1
same-day pair logged.**

## Records 2314-2318

2314: William Levell drunk and disorderly on the pier, on the oath of
      Edward Weeks — FIXED sex (7704, male).
2315: Matthew Fox drunk and disorderly, Baxtergate — OK, no fixes
      needed.
2316: George Webster drunk, Whitby — OK, no fixes needed.
2317: William Milne drunk and disorderly at the Bridge End — OK, no
      fixes needed.
2318: James Easom (Roxby) stealing plums from Thomas Bailey Forster's
      garden — FIXED sex (7705, male); Roxby already correctly
      linked.

**Progress: id 2314-2318 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 2319-2323

2319: William Thompson drunk, on the oath of George Hood — FIXED sex
      (7706, male).
2320: Jane Forden wife of John Forden, assaulting Hannah Gildroy —
      FIXED sex (7707 Gildroy female) + John Forden (10003): home
      Whitby + sex male (occupation already correct) via pattern #6.
2321: John Hodgson drunk and disorderly, St Ann's Staith — OK, no
      fixes needed.
2322: William Webster assaulting John Readman, "the said John
      Readman" reused — FIXED sex (7708, male).
2323: Edward Row assaulting constable Miles Moody, same day as 2258 —
      FIXED sex (7709, male). Confirmed same-day pair; logged.

**Progress: id 2319-2323 done (5 of 5 fully resolved). 4 sex fixes, 1
home fix, 1 same-day pair logged.**

## Records 2324-2328

2324: James Knox drunk and disorderly, Spring Hill, offence
      explicitly at Whitby — OK, no fixes needed; this is the
      pre-identified Whitby-township outlier in the Spring Hill set,
      already correctly linked without a Ruswarp link (consistent
      with its own stated text).
2325: Ellen Hick drunk, Whitby — OK, no fixes needed; recurring name
      (Isaac/Ellen Hick couple), standalone appearance this time.
2326: Thomas Atkinson drunk and disorderly, Sandgate — OK, no fixes
      needed.
2327: Thomas Loftus assaulting Mary Murphy — FIXED sex (7710,
      female).
2328: Cuthbert Wray assaulting Sarah Ann Robinson, "the said Sarah
      Ann Robinson" reused — FIXED sex (7711, female); Wray himself
      already correctly self-consistent as direct defendant here.

**Progress: id 2324-2328 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 2329-2333

2329: John Backhouse drunk and disorderly, Sandgate, on the oath of
      Edward Weeks — FIXED sex (7712, male).
2330: George Tweedy not sending son John Andrew Tweedy to school —
      FIXED sex (7713, male) and role ("unspecified" -> "child");
      offence location already correctly the defendant's own home
      (Whitby) per the truancy rule, not the School Board district.
2331: Francis Schofield assaulting John Smallwood, "the said John
      Smallwood" reused, Eskdaleside — FIXED sex (7714, male).
2332: John Conwell drunk and disorderly, Flowergate — OK, no fixes
      needed.
2333: William Arnold of Tate Hill not sending daughter Mary Arnold to
      school — FIXED sex (7715, female) and role ("unspecified" ->
      "child"); offence location already correctly Tate Hill (the
      defendant's own home) per the truancy rule.

**Progress: id 2329-2333 done (5 of 5 fully resolved). 4 sex fixes, 2
role corrections.**

## Records 2334-2338

2334: Richard Davy assaulting John Smallwood, same day as 2331 —
      FIXED sex (7716, male). Confirmed same-incident pair; logged.
2335: Henry Harrison drunk, St Ann's Staith — OK, no fixes needed.
2336: Stephen Palmer not sending son George Palmer to school, same
      day as 2330/2333 — FIXED sex (7717, male) and role
      ("unspecified" -> "child"); offence location already correctly
      Whitby (the defendant's own home). Third truancy record same
      day; logged as an enforcement sweep.
2337: George Braithwaite throwing snowballs, Brunswick Street — OK,
      no fixes needed.
2338: John Simpson of Briggswath assaulting Annie Keenan, witnessed
      by Ellen and James Keenan — FIXED sex on three (7718, 7719
      female, 7720 male); Briggswath already correctly linked.

**Progress: id 2334-2338 done (5 of 5 fully resolved). 5 sex fixes, 1
role correction, 2 cluster notes logged.**

## Records 2339-2343

2339: William Boyes found with snares, St Hilda's Terrace, on the
      information of William Cook — FIXED sex (7721, male).
2340: Valentine Austin throwing snowballs, Brunswick Street, same day
      as 2337 — OK, no fixes needed; sex already correctly male.
      Confirmed same-incident pair; logged.
2341: Thomas Atkinson drunk on William Willison's licensed premises,
      refusing to leave for John Nicholson, "the said John Nicholson"
      reused — FIXED sex (7722 Willison, 7723 Nicholson, both male).
2342: Mary Arnold wife of William Arnold (jet worker), assaulting
      Margaret Jane Cummins — FIXED sex (7724 Cummins female) +
      William Arnold (10004): home Whitby + sex male (occupation
      already correct) via pattern #6. Same two given names as
      record 2333's truancy case (William Arnold/daughter Mary) but a
      clearly different pair — one is a father/child, this is a
      husband/wife, different occupations stated — not conflated.
2343: William Lawson using a greyhound to kill hares on the Marquis
      of Normanby's moorland, parish of Lythe — OK, no fixes needed;
      landowner (10345) already correctly has `office` set (this is
      one of the rows that was already right before this session
      touched anything nearby — good confirmation the established
      rule holds elsewhere).

**Progress: id 2339-2343 done (5 of 5 fully resolved). 5 sex fixes, 1
home fix, 1 confirmed same-incident pair.**

## Records 2344-2348

2344: William Lightfoot too far from his carriage, Baxtergate, on the
      oath of John Nicholson — FIXED sex (7725, male).
2345: Joseph Storr drunk and disorderly, Bridge Street — OK, no fixes
      needed.
2346: George Nellist fighting with Isaac Wilson, on the oath of John
      Sigsworth — FIXED sex (7726, 7727, both male); "co-participant"
      role for Wilson already correctly distinct from a victim role
      (mutual fighting, not one-sided assault).
2347: Martin White drunk and disorderly, Church Street, on the oath
      of George Richard Lazenby — FIXED sex (7728, male).
2348: John Higgins drunk on Joseph Shaw's licensed premises — FIXED
      sex (7729, male).

**Progress: id 2344-2348 done (5 of 5 fully resolved). 5 sex fixes.**

## Records 2349-2353

2349: Isaac Wilson fighting with George Nellist, mirror conviction of
      2346 — FIXED sex (7730, male). Confirmed mutual-fighting pair;
      logged.
2350: Robert Watson drunk and disorderly, Sandgate, on the oath of
      John Nicholson — FIXED sex (7731, male).
2351: Peter Campion drunk and disorderly, Victoria Square (offence
      directly at Whitby this time, no Ruswarp exception needed) — OK,
      no fixes needed.
2352: John Cavannaugh begging in Upgang Lane, offence at Ruswarp —
      OK, no fixes needed; already correctly carries both links.
2353: Joseph Storr drunk and disorderly, Flowergate — OK, no fixes
      needed.

**Progress: id 2349-2353 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed mutual-incident pair logged.**

## Records 2354-2358

2354: John Harland catching salmon in the close season, Hawsker cum
      Stainsacre — OK, no fixes needed. Same-day pair with 2357;
      logged.
2355: Henry Readman having unjust scales aboard the ship "Friends,"
      found by Charles Tempest Clarkson (inspector of weights and
      measures) — FIXED sex (7732, male). Another Clarkson sighting.
2356: Thomas Dibb found drunk at Grosmont Bridge, on the oath of
      James Wright (Egton constable) — FIXED sex (7733, male);
      Grosmont Bridge already correctly nested under
      Grosmont/Eskdaleside. Yet another distinct James Wright context
      (with Ruswarp/Hinderwell/Egton already logged); not conflated.
2357: John Backhouse catching salmon, same day as 2354 — OK, no
      fixes needed. Confirmed same-incident pair; logged.
2358: John Carter drunk, Whitby — OK, no fixes needed.

**Progress: id 2354-2358 done (5 of 5 fully resolved). 2 sex fixes, 1
confirmed same-incident pair logged.**

## Records 2359-2363

2359: Mary Holmes wife of Richard Holmes, drunk in Sandgate, on the
      oaths of George Richard Lazenby and Ann Gallilee (wife of John
      Gallilee) — FIXED sex on four (7734 Lazenby male, 7735 Gallilee
      female, 10005 Richard Holmes male, 10225 John Gallilee male) +
      home (10005, 10225 both Whitby) via pattern #6 for both spousal
      stubs (occupations already correct: jet worker, joiner). Logged
      possible link to the recurring Richard Holmes.
2360: Anderson Hobson playing dice, St Hilda's Terrace, offence at
      Ruswarp — OK, no fixes needed; already correctly carries both
      links. Same-incident pair with 2363; logged.
2361: Mary Harland having unjust scales aboard her ship "Hopewell,"
      found by Charles Tempest Clarkson — FIXED sex (7736, male).
      Same weights-and-measures offence as 2355 four days earlier,
      different ship/defendant.
2362: Edward Doughty assaulting Anderson Hobson, witnessed by John
      Backhouse — FIXED sex (7737, 7738, both male). Different
      Anderson Hobson appearance from 2360 (12 years apart); logged.
2363: William John Blackstone playing dice, same day/place as 2360 —
      OK, no fixes needed; already correctly carries both links.
      Confirmed same-incident pair.

**Progress: id 2359-2363 done (5 of 5 fully resolved). 6 sex fixes, 2
home fixes, 3 recurring/same-incident notes logged.**

## Records 2364-2368

2364: William White drunk, Whitby — OK, no fixes needed.
2365: Dominick Griffin and James McGrath stealing pears from Thomas
      Pressick Yeoman's garden, Ruswarp — FIXED sex (7739, male).
2366: James Pearson playing dice, same time/place as 2360/2363 —
      OK, no fixes needed; already correctly carries both links.
      Extends the dice-game incident to 3; updated.
2367: Anthony Jackson having unjust scales on the ship "Fowler,"
      found by Charles Tempest Clarkson, same day as 2355/2361 —
      FIXED sex (7740, male). Extends the harbour inspection sweep to
      3; logged.
2368: Matthew Elders keeping a dog without a licence, parish of
      Barnby, on the oath of Isaac Pearson (Inland Revenue officer) —
      FIXED sex (7741, male); already correctly resolves to plain
      Barnby (no sub-place stated).

**Progress: id 2364-2368 done (5 of 5 fully resolved). 3 sex fixes, 2
cluster notes extended.**

## Records 2369-2373

2369: Larry Ragan begging in Hudson Street, offence at Ruswarp — OK,
      no fixes needed; already correctly carries both links.
      Recurring name (with 2261).
2370: Francis Orsbone assaulting John Wilkinson, "the said John
      Wilkinson" reused — FIXED sex (7742, male).
2371: Thomas Adams alias George Wilson assaulting constable Thomas
      Dennis, Lythe — FIXED sex (7743, male); alias already correctly
      captured.
2372: Bridget Ruehorn wife of William Ruehorn, drunk in Church Street
      — FIXED William Ruehorn (10006): home Whitby + sex male
      (occupation already correct) via pattern #6.
2373: John Brough opening his licensed premises early on a Sunday, on
      the oath of Charles Tempest Clarkson — FIXED sex (7744, male).
      Recurring innkeeper (with 1251/1298/1394) and another Clarkson
      sighting.

**Progress: id 2369-2373 done (5 of 5 fully resolved). 4 sex fixes, 1
home fix.**

## Records 2374-2378

2374: William Dixon drunk and disorderly, Church Street, on the
      oaths of George Richard Lazenby and John Ryder — FIXED sex
      (7745, 7746, both male).
2375: Stephen Kingston drunk and disorderly, Flowergate — OK, no
      fixes needed. Same-day pair with 2378; logged.
2376: Henry Harrison drunk, Whitby — OK, no fixes needed.
2377: John Wray assaulting Lucy Jackson (wife of Robert Jackson,
      fisherman), witnessed by Elizabeth Harland and Jane Mortrem —
      FIXED sex on four (7747 Lucy female, 7748 Harland female, 7749
      Mortrem female, 10226 Robert male; occupation already correct).
      Robert Jackson's home left null — the "all of the township of
      Whitby" clause grammatically covers the three named witnesses,
      not him, so not fabricated.
2378: Stephen Kingston damaging John Readman's trousers, same day as
      2375 — FIXED sex (7750, male). Confirmed same-day pair.

**Progress: id 2374-2378 done (5 of 5 fully resolved). 6 sex fixes, 1
same-day pair logged.**

## Records 2379-2383

2379: George Hansell assaulting Robert Sawdon, Whitby — FIXED sex
      (7751, male).
2380: Robert Foster (sailor) drunk and disorderly, Haggersgate — OK,
      no fixes needed.
2381: Robert Scott begging in Grosmont town street, offence at
      Eskdaleside cum Ugglebarnby — OK, no fixes needed; already
      correctly resolves to Grosmont.
2382: Charles Brockett assaulting William Hopper, "the said William
      Hopper," Goathland — FIXED sex (7752, male).
2383: Robert Purvis and George Gatenby playing pitch and toss on the
      Fish Pier — OK, no fixes needed; different Robert Purvis
      context (jet worker here, fruiterer elsewhere), not conflated.

**Progress: id 2379-2383 done (5 of 5 fully resolved). 2 sex fixes.**

## Records 2384-2388

2384: John Watson begging in Grosmont town street, same day as
      2381 — OK, no fixes needed; already correctly resolves to
      Grosmont. Logged as a likely same-day pair.
2385: Henry Tindale "otherwise Tindale Harry" assaulting William
      Hopper, same day as 2382 — FIXED sex (7753, male); alias
      already correctly captured. Confirmed 3-person gang assault
      with 2382/2388; logged.
2386: John Borrow assaulting John Lloyd, witnessed by James Gates and
      Robert Bewick, Eskdaleside — FIXED sex (7754, 7755, 7756, all
      male).
2387: Francis Smith (Aislaby) begging in Aislaby town street — OK, no
      fixes needed; already correctly resolves to Aislaby.
2388: Joseph Baxter "otherwise Baxter Joe" assaulting William Hopper,
      same day as 2382/2385 — FIXED sex (7757, male); alias already
      correctly captured. Confirmed 3-person gang assault.

**Progress: id 2384-2388 done (5 of 5 fully resolved). 5 sex fixes, 2
confirmed cluster incidents logged.**

## Records 2389-2393

2389: Thomas Adams alias George Wilson found with a rabbit and
      partridge, same day as 2371 — FIXED sex (7758, male). Confirmed
      same-day pair; logged.
2390: Isaac Smith (Aislaby, plumber) begging in Aislaby town street —
      OK, no fixes needed. Same-day cluster with 2387/2393; logged.
2391: Jonathan Sherwood assaulting William Metcalfe, Whitby — FIXED
      sex (7759, male).
2392: James Slack trying to procure charitable contributions under
      false pretences, Ruswarp — OK, no fixes needed.
2393: Sarah Jane Smith wife of Isaac Smith, begging in Aislaby town
      street, same day/place as 2390 — FIXED Isaac Smith (10007):
      home Aislaby + sex male (occupation already correct) via
      pattern #6. Confirmed same-day couple; logged.

**Progress: id 2389-2393 done (5 of 5 fully resolved). 3 sex fixes, 1
home fix, 2 same-day clusters logged.**

## Records 2394-2398

2394: John Codling emptying ballast into the River Esk, Whitby
      harbour — OK, no fixes needed; already correctly linked to
      River Esk (Rivers category).
2395: William Sines hawking bootlaces without a certificate, Whitby —
      OK, no fixes needed.
2396: Francis Smith assaulting constable James Side, Aislaby, same
      day as 2387/2390/2393 — FIXED sex (7760, male). Confirms Francis
      Smith was genuinely part of the same event; cluster note
      updated to 4 records.
2397: Francis Walker drunk and riotous, Church Street — OK, no fixes
      needed.
2398: Jabez Verney begging on the road between Robin Hood's Bay and
      Peak, Fylingdales — OK, no fixes needed; already correctly
      linked to the existing "Robin Hood's Bay and Peak Road" node.

**Progress: id 2394-2398 done (5 of 5 fully resolved). 1 sex fix, 1
cluster note updated to 4 records.**
