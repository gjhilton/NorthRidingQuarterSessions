# Full re-extraction audit log — part 3 (records 2399+)

Continues directly from `full-audit-log-2.md` (part 2, records 1401-2398).
Same methodology throughout: read every conviction's `raw_record` text
directly, cross-check every proper name/location/relationship against
the database, fix real gaps via direct SQL, log every record
individually (one-line OK or detailed FIXED entry), log same-person
candidates to `same-person-candidates.md` without merging, and populate
`summary_conviction.anomalies` for any new source-side artifacts found.
See `reextraction-audit-notes.md` for the established rules (sex
inference, pattern #6, specific-site rules, truancy rule,
silence-implies-local, title/office/esquire/baronet/licensee
conventions, Highways/Rivers/Railways category, etc — and the
title/office incident postmortem logged there).

Person-lookup queries now include `office` in the standard column list
(added after the Marquis of Normanby incident — see
reextraction-audit-notes.md and the
feedback_check_precedent_before_categorical_fields memory).

This file will close out at record ~3400 (1000 more records) and hand
off to `full-audit-log-4.md`, and so on every 1000 records.

## Records 2399-2403

2399: Isaac Smith ALSO assaulting constable James Side, same day as
      2396 — FIXED sex (7761, male). Aislaby cluster now 5 records;
      updated.
2400: Joseph Porritt of Castleton moving a cow contrary to
      regulations, Glaisdale — OK, no fixes needed; Castleton already
      correctly linked.
2401: Mary Campbell wife of James Campbell, drunk and disorderly,
      Flowergate — FIXED James Campbell (10008): sex male; no
      home/occupation stated for him in source, correctly left null.
2402: Stephen Kingston stealing celery from Thomas Mennell's garden,
      offence at Hawsker cum Stainsacre, one day before his other two
      convictions (2375/2378, 25 Oct) — FIXED sex (7762, male). Third
      Kingston conviction within two days; not re-logged as a new
      cluster given the different offence township.
2403: Henry Harrison (surveyor of the highway) charged over two
      out-of-repair Egton Bridge highways, on the oath of William
      Pickering — FIXED sex (7763, male); no offence_date field
      populated (the date is embedded in the charge description
      itself, "On 1 February 1867..." — correctly not duplicated into
      a separate field beyond what's already captured in
      raw_record/charge_description).

**Progress: id 2399-2403 done (5 of 5 fully resolved). 4 sex fixes, 1
cluster note updated to 5 records.**

## Records 2404-2408

2404: James Stewart drunk and disorderly, Robin Hood's Bay town
      street, offence at Fylingdales — OK, no fixes needed; already
      correctly resolves to Robin Hood's Bay.
2405: Patrick Dixon drunk on Shafto Pearson Richardson's licensed
      premises — FIXED sex (7764, male). Same-day pair with 2408;
      logged.
2406: Edward Doughty assaulting James Clayton, "the said James
      Clayton" reused — FIXED sex (7765, male).
2407: Charles Heath drunk on Thomas Bryan's licensed premises, on the
      oath of Miles Moody — FIXED sex (7766, 7767, both male).
2408: Mary Jane Knaggs wife of John Knaggs, drunk on Shafto Pearson
      Richardson's premises, same day as 2405 — FIXED sex (7768,
      male) + John Knaggs (10009): home Whitby + sex male (occupation
      already correct) via pattern #6. Confirmed same-day pair;
      logged.

**Progress: id 2404-2408 done (5 of 5 fully resolved). 6 sex fixes, 1
home fix, 1 confirmed same-incident pair logged.**
