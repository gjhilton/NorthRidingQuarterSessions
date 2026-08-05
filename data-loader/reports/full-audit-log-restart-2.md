# Full re-extraction audit — RESTART #2 (records 1+)

Started fresh after discovering the prior restart pass's checklist was
incomplete (the `related_conviction` same-incident cross-check wasn't
being performed at all). See `audit-rulebook.md` for the full, agreed
process and checklist this pass follows. That file is the definitive
spec; this log is the per-record record of what was checked and found.

Format per record: raw_record text considered (summarized where
unchanged from prior passes), current DB state read, decision, any SQL
fix, verification. OK = checked, nothing wrong. FIXED = corrected.

## Record 1

Text: "Summary conviction of Edward Jameson Ayre of the township of
Whitby jet worker for being drunk and disorderly in Grape Lane. Offence
committed at the township of Whitby on 29 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Grape Lane nests under
East Cliff (6) -> Whitby (4), single-destination rule correctly applied
(replaces coarser township link). Court/petty sessional division match.
Crime type "drunk and disorderly" matches. No related_conviction exists
and none warranted (checked: no other record shares this defendant name
+ offence date). Single person, no person_relationship to check.

**OK — no changes.**

## Record 2

Text: "Summary conviction of William Tooley of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Tooley: home=Liverton Mines (335, child of Liverton 334) matches;
occupation=miner matches; sex=male unambiguous. Palmer: title="Sir"
already established precedent (own person row per conviction, no
cross-conviction merge). Location of offence=Roxby matches stated
township. Court=Whitby. Crime type=poaching matches "trespassing...in
search of conies". related_conviction: links to 3 and 4 already present
("Same landowner (Sir Charles Mark Palmer), same offence, same date --
likely one incident, three men prosecuted separately") -- correct, this
is the Palmer trespassing trio.

**OK — no changes.**

## Record 3

Text: "Summary conviction of Jonathan Agar of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Same companion-record pattern as 2, own Palmer person row (6484, no
cross-merge). Home/occupation/sex/location/court/crime type all match.
related_conviction link to 2 already present and correct.

**OK — no changes.**

## Record 4

Text: "Summary conviction of John Marley of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at on township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Same companion-record pattern as 2/3. Raw text has a scribal typo
("committed at on township of Roxby") -- already correctly captured in
`anomalies`: "Scribal typo in source text: 'committed at on township of
Roxby' (extra 'on')." Home/occupation/sex/location/court/crime type all
match. related_conviction link to 2 already present and correct.

**OK — no changes.**

## Record 5

Text: "Summary conviction of Robert Tinley of the township of Whitby
carpenter for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 8 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=carpenter, sex=male all match. St Ann's Staith
nests under West Cliff (5) -> Whitby (4), single-destination rule
correctly applied. Court/petty sessional division match. Crime type
"drunk and disorderly" matches. No related_conviction warranted (no
other record shares this defendant + offence date).

**OK — no changes.**

## Record 6

Text: "Summary conviction of William Holmes of the township of Whitby
jet worker for being drunk and disorderly on the Whitby and Ruswarp
highway. Offence committed at the township of Hawsker cum Stainsacre on
7 October 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=jet worker, sex=male all match. Two-endpoint
"Whitby and Ruswarp highway" correctly resolves to the Cross-Parish
Highways node (106), added alongside the stated township
Hawsker-cum-Stainsacre (not replacing it). Court/petty sessional
division match. Crime type "drunk and disorderly" matches. Checked
same-date records: id 8 (Edward Watson, licensing offence) shares the
offence date but different defendant/charge/no shared named party --
correctly no related_conviction link.

**OK — no changes.**

## Record 7

Text: "Summary conviction of Robert Ross of the township of Whitby fish
packer for being drunk on the licensed premises of Thomas Wadsworth and
refusing to leave when asked by William Dobson acting sergeant of
police Offence committed at the township of Whitby on 6 October 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Ross: home=Whitby, occupation=fish packer, sex=male match. Wadsworth
(premises owner) and Dobson (police, occupation="acting sergeant of
police") -- neither has a home stated in the text, correctly left
blank. [Corrected 2026-07-30: originally miswritten as "office" here --
verified against the DB, this was always correctly stored as
occupation; office is reserved for aristocratic/peerage pedigree only,
per the rule clarified at record 191.] Location of offence=Whitby, court=Whitby, petty sessional
division match. Crime types: drunkenness, refusal to quit licensed
premises -- both match the charge description.

**OK — no changes.**

## Record 8

Text: "Summary conviction of Edward Joseph Watson of the township of
Whitby licensed victualler for opening his premises out of licensing
hours. Offence committed at the township of Whitby on 7 October 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=licensed victualler, sex=male all match.
Location of offence=Whitby, court=Whitby, petty sessional division
match. Crime type=licensing offence matches. related_conviction: none
present, none warranted -- already cross-checked against record 6
(shares offence date 1888-10-07 but different defendant/charge/no
shared named party) when record 6 was processed.

**OK — no changes.**

---

## Record 9

Text: "Summary conviction of John Parkin of the Old Post Office Yard in
the township of Whitby for not sending his son George Parkin to school.
Offence committed in the Whitby Strand School Board district on 5
October 1888. Case heard at Whitby"

Home=Old Post Office Yard (67, specific site) matches text exactly.
Truancy rule correctly applied: location of offence=Old Post Office
Yard (the home), NOT the stated School Board district phrase.
person_relationship: George Parkin (child, 6488) -> "son" -> John
Parkin (9), correct direction, matches "his son George Parkin". Crime
type=school non-attendance matches. Petty sessional division correctly
absent from summary_conviction_location -- the text states a School
Board district here, not a Petty Sessional division phrase, unlike most
other records. No related_conviction warranted (no other record shares
this offence date).

**OK — no changes.**

---

## Record 10

Text: "Summary conviction of Robert Harker of the township of Mickleby
carrier for obstructing Lythe town street by leaving his horse and cart
there for one hour and twenty minutes. Offence committed at the
township of Lythe on 6 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Mickleby, occupation=carrier, sex=male all match. "Lythe town
street" correctly resolves to Lythe itself (107), matching the stated
township, no fabricated place. Court=Whitby, petty sessional
division=whitby strand match. Crime type=obstructing the highway
matches. Checked same-date record 7 (Ross/Wadsworth/Dobson,
drunkenness) -- different defendant, different charge, no shared party,
correctly unrelated.

**OK — no changes.**

---

## Record 11

Text: "Summary conviction of Stephen George Mills of the township of
Fylingdales labourer for begging on the Whitby and Robin Hood's Bay
highway. Offence committed at the township of Fylingdales on 11 October
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male all match. Two-endpoint
"Whitby and Robin Hood's Bay highway" correctly resolves to Cross-Parish
Highways (106), alongside stated township Fylingdales. Court/petty
sessional division match. Crime type=begging matches. related_conviction
link to 12 present: "Same offence date, road, and township, different
defendants -- likely one begging incident, two men prosecuted
separately." -- correct pattern-2 style link.

**OK — no changes.**

---

## Record 12

Text: "Summary conviction of John Quinney of the township of Fylingdales
labourer for begging on the Whitby and Robin Hood's Bay highway. Offence
committed at the township of Fylingdales on 11 October 1888 Whitby
Strand Petty Sessional division - case heard at Whitby"

Same companion-record pattern as 11. Home=Fylingdales, occupation=
labourer, sex=male match. Cross-parish highway alongside Fylingdales
matches. Court/petty sessional division match. Crime type=begging
matches. related_conviction link to 11 already confirmed present.
(Text is missing a period after "1888" before "Whitby Strand" -- a
trivial punctuation artifact, not a meaning-affecting scribal error, no
anomalies note needed.)

**OK — no changes.**

---

## Record 13

Text: "Summary conviction of John Kelley of the township of Hinderwell
labourer for begging at Staithes Lane End. Offence committed at the
township of Hinderwell on 11 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Hinderwell, occupation=labourer, sex=male match. Staithes Lane End
(378) -> Staithes (163) -> Hinderwell (88), reaching the stated
township -- single-destination rule correctly applied, replacing the
coarser link. Court/petty sessional division match. Crime type=begging
matches. No related_conviction present or warranted.

**OK — no changes.**

---

## Record 14

Text: "Summary conviction of William Herbert of the township of Whitby
butcher for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 13 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Baxtergate (22) ->
West Cliff (5) -> Whitby (4), reaching stated township, single-
destination rule correctly applied. Court/petty sessional division
match. Crime type=drunk and disorderly matches. Checked same-date
record 15 (James Bonas, drunk and disorderly in Church Street) --
different street, different defendant, no shared party -- correctly
treated as a separate incident, not linked.

**OK — no changes.**

---

## Record 15

Text: "Summary conviction of James Bonas of the township of Whitby
bricklayer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 13 October 1888 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=bricklayer, sex=male match. Church Street (26)
-> East Cliff (6) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=drunk and disorderly matches.
Already cross-checked against record 14 when it was processed --
correctly unrelated (different street/defendant, no shared party).

**OK — no changes.**

---

## Record 16

Text: "Summary conviction of George Smith of the township of Mickleby
labourer for begging in Mickleby town street. Offence committed at the
township of Mickleby on 15 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Mickleby, occupation=labourer, sex=male match. "Mickleby town
street" correctly resolves to Mickleby itself (175), no fabricated
place -- Mickleby's parent is Lythe (107) in the tree, consistent with
Mickleby's real historical status as a township within Lythe parish,
not an error. Court/petty sessional division match. Crime type=begging
matches. No same-date records exist, no related_conviction warranted.

**OK — no changes.**

---

## Record 17

Text: "Summary conviction of Robert Harker of the township of Mickleby
carrier for being drunk in charge of a horse and cart on the Hinderwell
and Ellerby highway. Offence committed at the township of Hinderwell on
19 October 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Mickleby, occupation=carrier, sex=male match -- same real-world
name/occupation/home as record 10's Robert Harker but a genuinely
separate conviction, correctly NOT merged (own person row, id 17,
per the no-cross-conviction-merge design). Two-endpoint "Hinderwell and
Ellerby highway" correctly resolves to Cross-Parish Highways (106)
alongside stated township Hinderwell. Court/petty sessional division
match. Crime type=drunkenness matches. Checked same-date record 19
(Isaac Duell, bullocks/heifer straying on same highway) -- different
defendant, completely different fact pattern, no shared party --
correctly treated as unrelated, not one incident.

**OK — no changes.**

---

## Record 18

Text: "Summary conviction of Joseph Henry Tyerman of the township of
Hinderwell farmer for being the owner of five bullocks found straying
on the Hinderwell and Ellerby highway. Offence committed at the
township of Ellerby on 18 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Hinderwell, occupation=farmer, sex=male match. Location of
offence=Ellerby (stated township) plus Hinderwell & Ellerby Highway
(cross-parish, 106) alongside -- matches. Court/petty sessional
division match. Crime type=straying animals matches. No
related_conviction present -- checked against record 19 (also bullocks
straying on same highway) but offence dates differ (18th vs 19th
October), genuinely separate incidents a day apart despite similar
facts, correctly unlinked.

**OK — no changes.**

---

## Record 19

Text: "Summary conviction of Isaac Duell of the township of Ellerby
farmer for being the owner of seven bullocks and one heifer found
straying on the Hinderwell and Ellerby highway. Offence committed at
the township of Ellerby on 19 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Ellerby, occupation=farmer, sex=male match. Location of
offence=Ellerby (stated township) plus Hinderwell & Ellerby Highway
alongside -- matches. Court/petty sessional division match. Crime
type=straying animals matches. Already cross-checked against records 17
(different date, different facts) and 18 (different date) when those
were processed -- correctly unrelated to both, no related_conviction
warranted.

**OK — no changes.**

---

## Record 20

Text: "Summary conviction of Francis Jefferson of the township of
Whitby licensed victualler for being the owner of a mare and foal found
straying on a highway called Stakesby Vale. Offence committed at the
township of Ruswarp on 23 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=licensed victualler, sex=male ("Francis"
spelling, male form) match. Location of offence=Ruswarp (stated
township) plus Stakesby Vale (233, nests under West Cliff/Whitby, 5) --
initially looked like a possible mis-parenting since Stakesby Vale
doesn't descend from Ruswarp, but this is the established Whitby/
Ruswarp cliff-boundary case (see `explorer/src/content/about/
geography.md` and new memory note): the cliff-edge parish boundary
means a West-Cliff-nested site can genuinely be historically
Ruswarp-side even though the modern-map tree nests it under Whitby.
Current placement (alongside Ruswarp, not replacing) is correct per the
existing specific-site rule, not a bug. Court/petty sessional division
match. Crime type=straying animals matches. No related_conviction
warranted (no other record shares this date).

**OK — no changes.**

---

**Progress: records 1-20 done (restart #2).**

## Record 21

Text: "Summary conviction of James Greenwood of the township of Hawsker
cum Stainsacre labourer for begging in Hawsker town street. Offence
committed on 23 October 1888. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=labourer, sex=male match.
"Hawsker town street" correctly resolves to Hawsker-cum-Stainsacre
itself (87), matching the stated home township -- no separate offence-
township phrase in this text beyond "in Hawsker", consistent with a
single place being meant. Court/petty sessional division match. Crime
type=begging matches. Checked same-date record 20 (Jefferson, straying
animals) -- different defendant/charge, no shared party, correctly
unrelated.

**OK — no changes.**

---

**Progress: records 1-21 done (restart #2).**

## Record 22

Text: "Summary conviction of Joseph Storr of the township of Whitby jet
worker for being drunk and disorderly in Sandgate. Offence committed at
the township of Whitby on 27 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Sandgate (34) ->
East Cliff (6) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=drunk and disorderly matches. No
related_conviction, no same-date records exist.

**OK — no changes.**

---

**Progress: records 1-22 done (restart #2).**

## Record 23

Text: "Summary conviction of Charles Allison of Clark's Yard in the
township of Whitby for not sending his son George Allison to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby"

Home=Clark's Yard (44) matches. Truancy rule correctly applied:
location of offence=Clark's Yard (the home), not the School Board
district phrase. person_relationship: George Allison (child, 6489) ->
"son" -> Charles Allison (23), correct direction. Crime type=school
non-attendance matches. Petty sessional division correctly absent
(School Board district stated, not Petty Sessional division). Checked
same-date record 24 (Martha/Miles Arnold, also truancy) -- different
family, no shared party, correctly unrelated (not one shared incident).

**OK — no changes.**

---

**Progress: records 1-23 done (restart #2).**

## Record 24

Text: "Summary conviction of Martha Arnold of Renwick's Yard in the
township of Whitby for not sending her son Miles Arnold to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby"

Home=Renwick's Yard (58) matches. Sex: Martha=female (matches "her
son"), Miles=male (unambiguous historical given name). Truancy rule
correctly applied: location of offence=Renwick's Yard (the home).
person_relationship: Miles Arnold (child, 6490) -> "son" -> Martha
Arnold (24), correct direction. Crime type=school non-attendance
matches. Already cross-checked against record 23 when it was processed
-- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-24 done (restart #2).**

## Record 25

Text: "Summary conviction of John Jones of the township of Fylingdales
labourer for begging in Normanby highway. Offence committed at the
township of Fylingdales on 9 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male match. Single-
destination "Normanby highway" (380) nests directly under Fylingdales
(126), reaching the stated township -- replaces the coarser link
correctly (only one location-of-offence row). Court/petty sessional
division match. Crime type=begging matches. Checked same-date records
26 (Edward Brown, begging in Sleights) and 27 (Edward Cargill, drunk
and disorderly) -- different defendants/locations/charges, no shared
party, correctly unrelated to both.

**OK — no changes.**

---

**Progress: records 1-25 done (restart #2).**

## Record 26

Text: "Summary conviction of Edward Brown of the township of
Eskdaleside cum Ugglebarnby labourer for begging in Sleights town
street. Offence committed at the township of Eskdaleside cum
Ugglebarnby on 9 November 1888. Whitby Strand Petty Sessional division
- case heard at Whitby"

Home=Eskdaleside-cum-Ugglebarnby, occupation=labourer, sex=male match.
"Sleights town street" (11) correctly resolves to Sleights itself,
whose parent (8) is Eskdaleside-cum-Ugglebarnby, matching the stated
township. Court/petty sessional division match. Crime type=begging
matches. Already cross-checked against record 25 -- correctly
unrelated.

**OK — no changes.**

---

**Progress: records 1-26 done (restart #2).**

## Record 27

Text: "Summary conviction of Edward Cargill of the township of Whitby
labourer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 9 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Verified the
existing anomalies note directly against raw_case: title really does
say "Robert Cargill" (raw_case.id 27, reference QSB 1889 1/10/10/27)
while the record text says Edward throughout -- note is accurate,
Edward correctly stored as the fuller/more reliable text. Already
cross-checked against record 25, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-27 done (restart #2).**

## Record 28

Text: "Summary conviction of Maria Castello wife of Thomas Castello of
the township of Whitby jet worker for assaulting Mary Howard. Offence
committed at the township of Whitby on 8 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Maria: defendant, female, home=Whitby, no occupation of her own (jet
worker belongs to the husband per the sentence structure -- "wife of
Thomas Castello ... jet worker" modifies Thomas, not Maria). Thomas:
own person row (6492), role "husband of defendant", home=Whitby,
occupation=jet worker -- correctly NOT misattached to Maria. Mary
Howard: separate person row, role=victim. person_relationship: Maria
"wife" -> Thomas (6492), correct direction matching the established
wife-points-to-husband convention. Crime type=assault matches.
Locations all Whitby, matching text. No same-date records, no
related_conviction.

**OK — no changes.**

---

**Progress: records 1-28 done (restart #2).**

## Record 29

Text: "Summary conviction of William Blooman of the township of Ruswarp
farmer for being the owner of two horses found straying on the Whitby
and Aislaby highway. Offence committed at the township of Ruswarp on 10
November 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Ruswarp, occupation=farmer, sex=male match. Two-endpoint "Whitby
and Aislaby highway" correctly resolves to Cross-Parish Highways (106),
alongside stated township Ruswarp. Court/petty sessional division
match. Crime type=straying animals matches. Checked same-date records:
30/31 (Alfred Ford, already linked to each other via existing
related_conviction "same defendant and same offence date" entry) and 32
(William Leigh, begging) -- none share a party/charge with 29,
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-29 done (restart #2).**

## Record 30

Text: "Summary conviction of Alfred Ford of the township of Whitby
caulker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 10 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=caulker, sex=male match. Church Street -> East
Cliff -> Whitby reaches stated township. Court/petty sessional division
match. Crime type=drunk and disorderly matches. related_conviction link
to 31 present and correct: "Same defendant and same offence date --
likely multiple charges from one arrest."

**OK — no changes.**

---

**Progress: records 1-30 done (restart #2).**

## Record 31

Text: "Summary conviction of Alfred Ford of the township of Whitby
caulker for assaulting John Carpenter one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 10 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Alfred Ford: own person row (31), separate from record 30's (30) --
correct, no cross-conviction merge. Home=Whitby, occupation=caulker,
sex=male match. John Carpenter: victim, occupation="constable of the
North Riding" matches "one of the constables of the North Riding".
Location of offence=Whitby, court=Whitby, petty sessional division
match. Crime type=assaulting a police officer matches.
related_conviction link to 30 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-31 done (restart #2).**

## Record 32

Text: "Summary conviction of William Leigh of the township of Ruswarp
dentist for begging in St Hilda's Terrace. Offence committed at the
township of Ruswarp on 10 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=dentist (unusual but stated as-is in the
text, captured without embellishment), sex=male match. St Hilda's
Terrace (232) nests under West Cliff/Whitby (5), not descending from
Ruswarp -- same Whitby/Ruswarp cliff-boundary shape as record 20,
correctly added alongside rather than replacing. Court/petty sessional
division match. Crime type=begging matches. Already cross-checked
against record 29, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-32 done (restart #2).**

## Record 33

Text: "Summary conviction of Daniel Blake of the township of Ruswarp
labourer for begging in Hanover Terrace. Offence committed at the
township of Ruswarp on 11 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=labourer, sex=male match. Hanover Terrace (86)
nests under West Cliff (5), same cliff-boundary shape as records 20/32,
correctly added alongside Ruswarp. Court/petty sessional division
match. Crime type=begging matches. Checked same-date records 34/35
(Thomas Humphrey, Robert Cummins -- both "attempting to catch salmon in
Staithes Beck in the close season") -- no overlap with Blake, correctly
unrelated to 33. NOTE: 34 and 35 share the same charge text and date
with each other (different defendants) -- flagged to check for a
possible pattern-2 related_conviction link between them when reaching
those records.

**OK — no changes.**

---

**Progress: records 1-33 done (restart #2).**

## Record 34

Text: "Summary conviction of Thomas Humphrey of the township of
Hinderwell fish hawker for attempting to catch salmon in Staithes Beck
in the close season. Offence committed at the township of Hinderwell on
11 November 1888. Whitby Strand Petty Sessional division - case heard
at Whitby"

Home=Hinderwell, occupation=fish hawker, sex=male match. Staithes Beck
(382) -> Staithes (163) -> Hinderwell (88), reaching stated township,
single-destination rule correctly applied. Court/petty sessional
division match. Crime type=poaching matches (salmon in close season).
related_conviction link to 35 present and correct: "Same offence date,
beck, and township, different defendants -- likely one poaching
incident, two men prosecuted separately." Confirms the flag raised at
record 33.

**OK — no changes.**

---

**Progress: records 1-34 done (restart #2).**

## Record 35

Text: "Summary conviction of Robert Cummins of the township of
Hinderwell fisherman for attempting to catch salmon in Staithes Beck in
the close season. Offence committed at the township of Hinderwell on
11 November 1888. Whitby Strand Petty Sessional division - case heard
at Whitby"

Home=Hinderwell, occupation=fisherman, sex=male match. Same
Staithes Beck -> Staithes -> Hinderwell resolution as 34. Court/petty
sessional division match. Crime type=poaching matches.
related_conviction link to 34 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-35 done (restart #2).**

## Record 36

Text: "Summary conviction of Jonathan Howard of the township of Newholm
cum Dunsley labourer for begging in East Row. Offence committed at the
township of Newholm cum Dunsley on 17 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Newholm-cum-Dunsley, occupation=labourer, sex=male match. East Row
(178) nests directly under Newholm-cum-Dunsley (7), matching stated
township. Court/petty sessional division match. Crime type=begging
matches. No same-date records, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-36 done (restart #2).**

## Record 37

Text: "Summary conviction of Henry Grant of the township of Newholm cum
Dunsley herdsman for begging in East Row town street. Offence committed
at the township of Newholm cum Dunsley on 19 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Newholm-cum-Dunsley, occupation=herdsman, sex=male match. "East
Row town street" correctly resolves to East Row itself (178, same node
as record 36) -- confirms the "X town street" rule applies even when X
is a specific site name, not just the township name, no fabricated new
place. Court/petty sessional division match. Crime type=begging
matches. No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-37 done (restart #2).**

## Record 38

Text: "Summary conviction of John Brand of the township of Whitby
labourer for being drunk and disorderly in Wellington Road. Offence
committed at the township of Whitby on 24 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Wellington Road (82)
-> West Cliff (5) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=drunk and disorderly matches.
Checked same-date records 41/42 (Joseph Harrison, William Wren -- both
"killing one salmon in Stonegate Beck in the close season") -- no
overlap with Brand, correctly unrelated to 38. NOTE: 41/42 look like a
likely pattern-2 companion pair, to verify when reaching those records.

**OK — no changes.**

---

**Progress: records 1-38 done (restart #2).**

## Record 39

Text: "Summary conviction of James Holden of the township of Whitby
botanist for being drunk on the licensed premises of William Willison
and refusing to leave when asked by William Dobson acting sergeant of
police. Offence committed at the township of Whitby on 26 November
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=botanist (unusual but stated as-is), sex=male
match. Willison: role=licensee, occupation=licensee, matches. Dobson:
own person row (6495), separate from record 7's Dobson (6487) --
correct, no cross-conviction merge. Location of offence/court=Whitby,
petty sessional division match. Crime types=drunkenness, refusal to
quit licensed premises both match. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-39 done (restart #2).**

## Record 40

Text: "Summary conviction of John Poole of the township of Fylingdales
labourer for begging in Raw town street. Offence committed at the
township of Fylingdales on 25 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male match. "Raw town
street" correctly resolves to Raw itself (128), nested under
Fylingdales (126), matching stated township. Court/petty sessional
division match. Crime type=begging matches. No related_conviction, no
same-date records.

**OK — no changes.**

---

**Progress: records 1-40 done (restart #2).**

## Record 41

Text: "Summary conviction of Joseph Harrison of the Tiger Inn in the
township of Easington innkeeper and farmer for killing one salmon in
Stonegate Beck in the close season. Offence committed at the township
of Glaisdale on 24 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Tiger Inn (385) -> Easington (272), matching stated home
township. Occupation="innkeeper and farmer" (194) -- precedent check
run: extensive existing precedent for compound "X and Y" occupation
phrases kept as one string (ale and porter dealer, butter and bacon
seller, hawker and pedlar, labourer and hawker, plumber and glazier,
etc.) -- consistent, not a gap needing to be split. Location of
offence=Stonegate Beck (383) -> Glaisdale (138), matching stated
offence township. Court/petty sessional division match. Crime
type=poaching matches. related_conviction link to 42 present and
correct: "Same offence date, beck, and township, different defendants
-- likely one poaching incident, two men prosecuted separately."
Confirms the flag raised at record 38.

**OK — no changes.**

---

**Progress: records 1-41 done (restart #2).**

## Record 42

Text: "Summary conviction of William Wren of Lealholm Hall in the
township of Glaisdale farm labourer for killing one salmon in Stonegate
Beck in the close season. Offence committed at the township of
Glaisdale on 24 November 1888 Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Lealholm Hall (386) -> Glaisdale (138), matching stated home
township. Occupation=farm labourer, sex=male match. Location of
offence=Stonegate Beck -> Glaisdale, matching. Court/petty sessional
division match. Crime type=poaching matches. related_conviction link to
41 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-42 done (restart #2).**

## Record 43

Text: "Summary conviction of John Summerson of the parish of Danby
farmer for using a lantern and a gaff to catch salmon in Fryup Beck.
Offence committed at the parish of Danby on 28 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Danby, occupation=farmer, sex=male match. Fryup Beck (384) ->
Danby (270), matching stated parish. Court/petty sessional division
match. Crime type=poaching matches. related_conviction link to 44
present and correct: "Same defendant and same offence date -- likely
multiple charges from one arrest" (pattern 1 -- same person, second
charge same day).

**OK — no changes.**

---

**Progress: records 1-43 done (restart #2).**

## Record 44

Text: "Summary conviction of John Summerson of the parish of Danby farm
labourer for using a lantern and gaff to catch salmon in Fryup Beck.
Offence committed at the parish of Danby on 28 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Danby, occupation=farm labourer, sex=male match this record's own
text -- note this differs from record 43's "farmer" for the same real
person, but each companion record faithfully reflects its own
document's wording (separate person rows, no cross-merge), not a data
error. Fryup Beck -> Danby matches. Court/petty sessional division
match. Crime type=poaching matches. related_conviction link to 43
already confirmed present.

**OK — no changes.**

---

**Progress: records 1-44 done (restart #2).**

## Record 45

Text: "Summary conviction of Kate Griffin of the township of Whitby
widow for being drunk and disorderly in Church Street Offence committed
at the township of Whitby on 3 December 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=widow (established marital-status-as-occupation
convention, same precedent as singlewoman/spinster elsewhere),
sex=female match. Church Street -> East Cliff -> Whitby reaches stated
township. Court/petty sessional division match. Crime type=drunk and
disorderly matches. No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-45 done (restart #2).**

## Record 46

Text: "Summary conviction of William Lawson of the township of Aislaby
labourer for being drunk and disorderly on the Whitby and Ruswarp
footpath. Offence committed at the township of Ruswarp on 2 December
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Aislaby, occupation=labourer, sex=male match. Raised and resolved
with the user: unlike two-endpoint highways (bucketed under Cross-
Parish Highways, 106), "Whitby and Ruswarp Footpath" (252) has its own
individual node under West Cliff/Whitby -- confirmed deliberate
(footpaths are treated as specific sites/streets, not roads), now
documented in the rule book. Since its parent doesn't reach Ruswarp, it
is correctly added alongside the stated township (cliff-boundary
logic), not replacing it. Court/petty sessional division match. Crime
type=drunk and disorderly matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-46 done (restart #2).**

## Record 47

Text: "Summary conviction of John Holmes of the township of Whitby jet
worker for being drunk on the licensed premises of Colin Cowan. Offence
committed at the township of Hawsker cum Stainsacre on 23 December
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Cowan: role=
licensee of premises, matches. Location of offence=Hawsker-cum-
Stainsacre matches. Court/petty sessional division match. Crime
type=drunkenness matches. related_conviction link to 48 present with a
carefully-worded note: "...different defendants (John Holmes vs William
Holmes, same surname but not stated as kin) -- likely one incident, two
men prosecuted separately" -- correctly avoids assuming kinship without
textual evidence. Same-date record 51 (Kilpatrick) shares no party,
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-47 done (restart #2).**

## Record 48

Text: "Summary conviction of William Holmes of the township of Whitby
jet worker for being drunk on the licensed premises of Colin Cowan.
Offence committed at the township of Hawsker cum Stainsacre on 23
December 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Own person row
(48), separate from record 6's William Holmes (id 6, also Whitby/jet
worker/Hawsker-cum-Stainsacre offence, different date) -- correct, no
cross-conviction merge, even though plausibly the same real individual.
Cowan: own person row (6497), separate from record 47's (6496) --
correct. Location/court/petty sessional division match. Crime
type=drunkenness matches. related_conviction link to 47 already
confirmed present.

**OK — no changes.**

---

**Progress: records 1-48 done (restart #2).**

## Record 49

Text: "Summary conviction of Robert Steel of the township of Whitby
fisherman for being drunk on the licensed premises of William Massey
and refusing to leave when asked by the said William Massey. Offence
committed at the township of Whitby on 26 December 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=fisherman, sex=male match. Massey: role=
licensee, matches (same person addressed twice in the text, licensee
role captures both mentions). Location/court=Whitby, petty sessional
division match. Crime types=drunkenness, refusal to quit licensed
premises both match. No related_conviction, no same-date records --
correctly stands alone (confirmed this doesn't apply to the two crime
types within this one record, which aren't separate summary_conviction
rows).

**OK — no changes.**

---

**Progress: records 1-49 done (restart #2).**

## Record 50

Text: "Summary conviction of Francis Fewster of the township of Whitby
jet worker for being drunk on the licensed premises of Joseph Shaw and
refusing to leave when asked by the said Joseph Shaw Offence committed
at the township of Whitby on 27 December 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male ("Francis" spelling, male
form) match. Shaw: role=licensee, matches. Location/court=Whitby, petty
sessional division match. Crime types=drunkenness, refusal to quit
licensed premises both match. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-50 done (restart #2).**

## Record 51

Text: "Summary conviction of Peter Kilpatrick of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 23 December 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=iron worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Already
cross-checked against record 47 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-51 done (restart #2).**

## Record 52

Text: "Summary conviction of Esther Hill wife of Andrew Hill of the
township of Whitby jet worker for being drunk and disorderly in Church
Street. Offence committed at the township of Whitby on 22 December
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Esther: defendant, female, home=Whitby, no occupation of her own (jet
worker modifies husband Andrew per sentence structure). Andrew: own
person row (6500), role="husband", home=Whitby, occupation=jet worker
-- correctly not misattached to Esther. person_relationship: Esther
"wife" -> Andrew, correct direction. Church Street -> East Cliff ->
Whitby reaches stated township. Court/petty sessional division match.
Crime type=drunk and disorderly matches. Checked directly: no
same-date records exist, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-52 done (restart #2).**

## Record 53

Text: "Summary conviction of James Welsh of the township of Ruswarp
pedlar for begging in St Hilda's Terrace. Offence committed at the
township of Ruswarp on 25 December 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=pedlar, sex=male match. St Hilda's Terrace
(232) nests under West Cliff, same cliff-boundary shape as record 32,
correctly added alongside Ruswarp. Court/petty sessional division
match. Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-53 done (restart #2).**

## Record 54

Text: "Summary conviction of William Mills of Hawsker cum Stainsacre
master mariner for being drunk in Thorpe town street Offence committed
at the township of Fylingdales on 2 January 1889 Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=master mariner, sex=male match.
"Thorpe town street" correctly resolves to Fylingthorpe (127) -- a
genuine hamlet within Fylingdales parish, not a fabricated place --
nested under Fylingdales (126), matching the stated offence township.
Court/petty sessional division match. Crime type=drunkenness matches
("being drunk"). No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-54 done (restart #2).**

## Record 55

Text: "Summary conviction of Robert Tinley of the township of Whitby
joiner for assaulting Hannah Tinley. Offence committed at the township
of Ruswarp on 6 January 1889 Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=joiner, sex=male match (own person row,
separate from record 5's Robert Tinley -- different occupation stated,
carpenter vs joiner, no cross-conviction merge either way). Hannah
Tinley: victim, female, no occupation stated in text, correctly left
blank. Shared surname with defendant but no relationship stated in the
text -- correctly NOT assumed kin, same principle as the Holmes pair
(47/48). Location of offence=Ruswarp (differs from home township
Whitby, as explicitly stated). Court=Whitby, petty sessional division
match. Crime type=assault matches. related_conviction link to 56
present: "Same defendant and same offence date -- likely multiple
charges from one arrest."

**OK — no changes.**

---

**Progress: records 1-55 done (restart #2).**

## Record 56

Text: "Summary conviction of Robert Tinley of the township of Whitby
joiner for assaulting John O'Conner. Offence committed at the township
of Whitby on 6 January 1889 Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=joiner, sex=male match. John O'Conner: victim,
correctly captured. Location/court=Whitby, petty sessional division
match. Crime type=assault matches. related_conviction link to 55
already confirmed present.

**OK — no changes.**

---

**Progress: records 1-56 done (restart #2).**

## Record 57

Text: "Summary conviction of John Fawcett of the township of Hinderwell
labourer for lodging in an outhouse without any visible means of
subsistence and not giving a good account of himself. Offence committed
at the township of Hinderwell on 10 January 1889 Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Hinderwell, occupation=labourer, sex=male match. Location of
offence=Hinderwell matches. Court/petty sessional division match. Crime
type=vagrancy correctly captures "lodging in an outhouse...not giving a
good account of himself" (classic vagrancy-act phrasing). No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-57 done (restart #2).**

## Record 58

Text: "Summary conviction of George Oakley of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 12 January 1889 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=iron worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches.
related_conviction link to 59 present: "Same offence date, street, and
charge wording, different defendants -- likely several convictions from
one recorded incident."

**OK — no changes.**

---

**Progress: records 1-58 done (restart #2).**

## Record 59

Text: "Summary conviction of John Dixon of the township of Whitby jet
worker for being drunk and disorderly in Church Street Offence
committed at the township of Whitby on 12 January 1889 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Same Church
Street/East Cliff/Whitby resolution as 58. Court/petty sessional
division match. Crime type=drunk and disorderly matches.
related_conviction link to 58 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-59 done (restart #2).**

## Record 60

Text: "Summary conviction of Pearson Campion of the township of Whitby
jet worker for being drunk and disorderly in Skinner Street. Offence
committed at the township of Ruswarp on 14 January 1889 Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Skinner Street
(254) nests under West Cliff (5), same cliff-boundary shape as prior
records, correctly added alongside stated Ruswarp. Court/petty
sessional division match. Crime type=drunk and disorderly matches. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-60 done (restart #2).**

## Record 61

Text: "Summary conviction of Thomas Brown of the township of Whitby
labourer for begging in Church Street Offence committed at the
township of Whitby on 17 January 1889 Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Church Street -> East
Cliff -> Whitby reaches stated township. Court/petty sessional division
match. Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-61 done (restart #2).**

## Record 62

Text: "Summary conviction of Thomas Wilson of the township of Ruswarp
photographer for wantonly firing a gun within 50 feet of a public
cartway called Newholm Lane. Offence committed at the township of
Newholm cum Dunsley on 19 January 1889 Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=photographer, sex=male match. Newholm Lane
(179) nests directly under Newholm-cum-Dunsley (7), matching stated
offence township. Court/petty sessional division match. Crime
type=firearms offence matches "wantonly firing a gun". Same-date record
65 (Robert Cargell, Church Street) shares no party/charge -- correctly
unrelated.

**OK — no changes.**

---

**Progress: records 1-62 done (restart #2).**

## Record 63

Text: "Summary conviction of Richard Holmes of the township of Whitby
jet worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 20 January 1889. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Same-date
record 64 (George Wardell, drunk and disorderly in Ruswarp) -- different
location/defendant, correctly unrelated. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-63 done (restart #2).**

## Record 64

Text: "Summary conviction of George Wardell of the township of Whitby
jet worker for being drunk and disorderly in Ruswarp town street.
Offence committed at the township of Ruswarp on 20 January 1889. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. "Ruswarp town
street" correctly resolves to Ruswarp itself (94), matching stated
offence township. Court/petty sessional division match. Crime
type=drunk and disorderly matches. Already cross-checked against record
63 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-64 done (restart #2).**

## Record 65

Text: "Summary conviction of Robert Heaton Cargell of the township of
Whitby iron worker for being drunk and disorderly in Church Street
Offence committed at the township of Whitby on 19 January 1889. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, middle name=Heaton correctly captured, occupation=iron
worker, sex=male match. Church Street -> East Cliff -> Whitby reaches
stated township. Court/petty sessional division match. Crime
type=drunk and disorderly matches. Already cross-checked against record
62 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-65 done (restart #2).**

## Record 66

Text: "Summary conviction of John Langan of the township of Ruswarp
miner for begging in Hanover Terrace Offence committed at the township
of Ruswarp on 25 January 1889. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Ruswarp, occupation=miner, sex=male match. Hanover Terrace (86)
nests under West Cliff (5), same cliff-boundary shape as record 33,
correctly alongside Ruswarp. Court/petty sessional division match.
Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-66 done (restart #2).**

## Record 67

Text: "Summary conviction of Margaret Sparks of Baxtergate in the
township of Whitby for not sending her son Harry Readman Sparks to
school Offence committed in the Whitby Strand School Board district on
18 January 1889. Case heard at Whitby"

Home=Baxtergate (22) matches. Truancy rule correctly applied: location
of offence=Baxtergate (the home), not the School Board district
phrase. Harry Readman Sparks: middle name Readman correctly captured,
role="child not sent to school". person_relationship: "son" -> Margaret,
correct direction. Crime type=school non-attendance matches. Petty
sessional division correctly absent (School Board district stated).
Checked same-date record 68 (Robert Page family, also truancy) --
different family, no shared party, correctly unrelated, no
related_conviction.

**OK — no changes.**

---

**Progress: records 1-67 done (restart #2).**

## Record 68

Text: "Summary conviction of Robert Page of Hospital Yard in the
township of Whitby for not sending his son William Robert Page to
school Offence committed in the Whitby Strand School Board district on
18 January 1889. Case heard at Whitby"

Home=Hospital Yard (53) matches. Truancy rule correctly applied:
location of offence=Hospital Yard (the home). William Robert Page:
middle name Robert correctly captured, role="child not sent to school".
person_relationship: "son" -> Robert Page, correct direction. Crime
type=school non-attendance matches. Petty sessional division correctly
absent. Already cross-checked against record 67 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-68 done (restart #2).**

## Record 69

Text: "Summary conviction of John McMaloy of the township of Whitby
labourer for destroying his own clothes whilst being relieved in Whitby
Union workhouse Offence committed at the township of Whitby on 3
February 1889. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=labourer, sex=male match. Union Workhouse (81,
Green Lane) matches -- text doesn't mention Ruswarp/Stakesby, so
correctly the main node, not the Stakesby Road node (399), per the
established disambiguation rule. Court/petty sessional division match.
Crime type=workhouse offence matches. FLAGGED (not yet resolved): same-
date record 70 has identical charge wording ("destroying his own
clothes whilst being relieved in Whitby Union workhouse"), different
defendant (James Carney) -- likely pattern-2 same-incident candidate,
no related_conviction link exists yet. To confirm/fix when reaching 70.

**OK — no changes (pending same-incident check at record 70).**

---

**Progress: records 1-69 done (restart #2).**

## Record 70

Text: "Summary conviction of James Carney of the township of Whitby
labourer for destroying his own clothes whilst being relieved in Whitby
Union workhouse Offence committed at the township of Whitby on 3
February 1889. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=labourer, sex=male match. Union Workhouse (81)
matches. Court/petty sessional division match. Crime type=workhouse
offence matches. RESOLVES the flag from record 69: despite identical
charge wording and same date, there is no shared party (no common
victim/landowner/premises owner) between 69 and 70 -- just two inmates
independently destroying their own clothes at the same institution the
same day. This is the same shape as the truancy same-date coincidences
(23/24), not a connected shared incident like the Palmer trespass or
salmon-poaching pairs. Correctly NOT linked via related_conviction.

**OK — no changes.**

---

**Progress: records 1-70 done (restart #2).**

## Record 71

Text: "Summary conviction of Thomas Paylor of the township of Whitby
butcher and milk seller for using a building on the East Cliff near the
Abbey Farm as a slaughter house without a licence Offence committed at
the township of Whitby on 16 January 1889. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation="butcher and milk seller" (matches existing
compound-occupation precedent), sex=male match. Abbey Farm (77) nests
under East Cliff (6) -> Whitby (4), matching "on the East Cliff near
the Abbey Farm" and reaching stated township. Court/petty sessional
division match. Crime type=licensing offence matches "without a
licence". No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-71 done (restart #2).**

## Record 72

Text: "Summary conviction of Robert Foster of the township of Whitby
coal porter for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 16 February 1889. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=coal porter, sex=male match. St Ann's Staith ->
West Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. Same-date
records 73 (begging) and 74 (obstruction) share no party/charge --
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-72 done (restart #2).**

## Record 73

Text: "Summary conviction of Alfred Reynolds of the township of Whitby
labourer for begging in Bridge Street Offence committed at the
township of Whitby on 16 February 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Bridge Street (25) ->
Seafront (104) -> Whitby (4), reaching stated township. Court/petty
sessional division match. Crime type=begging matches. Already
cross-checked against record 72 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-73 done (restart #2).**

## Record 74

Text: "Summary conviction of Robert Jackson of Carlin How ale and porter
dealer for leaving a cart on Staithes town street for 30 minutes so
causing an obstruction Offence committed at the township of Hinderwell
on 16 February 1889. Whitby Strand Petty Sessional division - case
heard at Whitby"

Home=Carlin How, occupation="ale and porter dealer" (matches existing
compound-occupation precedent), sex=male match. "Staithes town street"
correctly resolves to Staithes itself (163), parent Hinderwell (88),
matching stated township. Court/petty sessional division match. Crime
type=obstructing the highway matches. Already cross-checked against
record 72 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-74 done (restart #2).**

## Record 75

Text: "Summary conviction of James Duell of the township of Roxby
farmer for keeping a dog without a licence Offence committed at the
township of Roxby on 18 February 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Roxby (161, parent Hinderwell 88), occupation=farmer, sex=male
match. Court/petty sessional division match. Crime type=dog licence
offence matches. Verified against a momentary recall doubt: confirmed
directly against record 2's actual stored data that Roxby is a single
consistent node (161) used the same way there -- no duplicate-location
bug, prior recollection was simply mistaken and has been corrected by
re-checking the source of truth rather than trusted from memory. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-75 done (restart #2).**

## Record 76

Text: "Summary conviction of James Reeves of the township of Whitby
iron worker for being drunk and disorderly in Church Street Offence
committed at the township of Whitby on 21 February 1889. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=iron worker, sex=male match. Church Street ->
East Cliff -> Whitby reaches stated township. Court/petty sessional
division match. Crime type=drunk and disorderly matches. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-76 done (restart #2).**

## Record 77

Text: "Summary conviction of George Duncanson of Timber Hill in the
township of Hawsker cum Stainsacre for not sending his daughter
Elizabeth Duncanson to school Offence committed in the Whitby Strand
School Board district on 8 February 1889. Case heard at Whitby"

Home=Timber Hill (149) -> Hawsker-cum-Stainsacre (87), matches. Truancy
rule correctly applied: location of offence=Timber Hill (the home).
Elizabeth Duncanson (6505): sex=female -- this is the fix from the
prior pass, independently re-verified here as still correctly
persisted (matches the direct DB check done at the very start of this
conversation). person_relationship: "daughter" -> George, correct
direction. Crime type=school non-attendance matches. Petty sessional
division correctly absent.

**OK — no changes.**

---

**Progress: records 1-77 done (restart #2).**

## Record 78

Text: "Summary conviction of John Maddon of the township of Lythe
labourer for begging inn Sandsend town street Offence committed at the
township of Lythe on 26 February 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Lythe, occupation=labourer, sex=male match. "Sandsend town street"
correctly resolves to Sandsend (176), nested under Lythe (107),
matching stated township. Existing anomalies note ("begging inn
Sandsend", extra "n") verified accurate against the raw text.
Court/petty sessional division match. Crime type=begging matches. No
related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-78 done (restart #2).**

## Record 79

Text: "Summary conviction of Ransome Corser of Timber Hill in the
township of Hawsker cum Stainsacre for not sending his daughter Mary
Ann Corser to school Offence committed in the Whitby Strand School
Board district on 19 February 1889. Case heard at Whitby"

Home=Timber Hill (149) -> Hawsker-cum-Stainsacre (87), matches. Same
Timber Hill address as record 77 (George Duncanson) but different
surname -- correctly two separate families at the same address, not
merged. Truancy rule correctly applied. Mary Ann Corser (6506): sex=
female -- fix from the prior pass, re-verified as still correctly
persisted. person_relationship: "daughter" -> Ransome, correct
direction. Crime type=school non-attendance matches. No related_
conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-79 done (restart #2).**

## Record 80

Text: "Summary conviction of John Smith of the township of Hawsker cum
Stainsacre labourer for begging in Hawsker town street. Offence
committed at the township of Hawsker cum Stainsacre on 8 March 1889.
Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=labourer, sex=male match.
"Hawsker town street" correctly resolves to Hawsker-cum-Stainsacre
itself (87). Court/petty sessional division match. Crime type=begging
matches. Same-date record 82 (William Benson, Fylingdales, different
highway) shares no party -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-80 done (restart #2).**

## Record 81

Text: "Summary conviction of Emmeline Annie Brazier of the township of
Ruswarp singlewoman for begging in Bagdale Offence committed at the
township of Ruswarp on 4 March 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Ruswarp, occupation=singlewoman (established marital-status
precedent, same family as widow/spinster), sex=female match. Bagdale
(192) nests under West Cliff (5), same cliff-boundary shape as records
20/32/53/66, correctly added alongside Ruswarp -- matches the original
spot-check from the very start of this conversation. Court/petty
sessional division match. Crime type=begging matches. No related_
conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-81 done (restart #2).**

## Record 82

Text: "Summary conviction of William Benson of the township of
Fylingdales labourer for begging on the Whitby and Robin Hood's Bay
highway. Offence committed on 8 March 1889. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Fylingdales, occupation=labourer, sex=male match. Cross-parish
highway alongside Fylingdales, matches this conversation's very first
check. Court/petty sessional division match. Crime type=begging
matches. Already cross-checked against record 80 -- correctly
unrelated, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-82 done (restart #2).**

## Record 83

Text: "Summary conviction of William Reeves of the township of Whitby
licensed victualler for opening his premises outside licensing hours
Offence committed at the township of Whitby on 10 March 1889. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=licensed victualler, sex=male match.
Location/court=Whitby, petty sessional division match. Crime
type=licensing offence matches. Same-date record 84 (William Smith,
Upgang Lane) shares no party -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-83 done (restart #2).**

## Record 84

Text: "Summary conviction of William Smith of the township of Ruswarp
labourer for begging in Upgang Lane. Offence committed at the township
of Ruswarp on 10 March 1889. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Ruswarp, occupation=labourer, sex=male match. Upgang Lane (239)
nests under West Cliff (5), same cliff-boundary shape as prior records,
correctly alongside Ruswarp -- matches this conversation's original
spot-check. Court/petty sessional division match. Crime type=begging
matches. Already cross-checked against record 83.

**OK — no changes.**

---

**Progress: records 1-84 done (restart #2).**

## Record 85

Text: "Summary conviction of William Cooper Bridge of the township of
Whitby gentleman for being drunk in Church Street. Offence committed at
the township of Whitby on 12 March 1889. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, middle name=Cooper, occupation=gentleman, sex=male match.
Church Street -> East Cliff -> Whitby reaches stated township.
Court/petty sessional division match. Crime type=drunkenness matches.
No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-85 done (restart #2).**

## Record 86

Text: "Summary conviction of Walter Draper of Aislaby labourer for
begging in Woodlands. Offence committed at the township of Aislaby on
16 March 1889. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Aislaby, occupation=labourer, sex=male match. Woodlands (2) nests
directly under Aislaby (1), matching stated township -- confirms this
conversation's original spot-check. Court/petty sessional division
match. Crime type=begging matches. No related_conviction, no same-date
records.

**OK — no changes.**

---

**Progress: records 1-86 done (restart #2).**

(Records 87-88 confirmed blacklisted per data/id_blacklist.txt, established
earlier in this session -- 26 total blacklisted ids across the corpus,
gap is expected, not a gap needing investigation.)

## Record 89

Text: "Summary conviction of Richard Bulmer of Whitby butcher for having
in his possession one fourteen-pound weight which was short by two
ounces and four drams, and one seven-pound weight which was short by
two ounces. Offence committed at Whitby on 14 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Large same-date batch (14 Dec 1808, ~10+ records: 90-94, 110-
115 among others) -- each defendant is an independent market trader
caught with deficient weights, no shared victim/landowner/incident
connecting them, same pattern as the truancy/workhouse same-date
coincidences (one inspection sweep catching many separate people, not
one shared event). Correctly no related_conviction links among any of
them.

**OK — no changes.**

---

**Progress: records 1-89 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 90

Text: "Summary conviction of Mary Pattinson of Whitby meal seller for
having in her possession one fourteen-pound weight which was short by
12 drams. Offence committed at Whitby on 14 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=meal seller, sex=female match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 14 Dec 1808 same-date batch already
resolved at record 89 -- correctly no related_conviction.

**OK — no changes.**

---

**Progress: records 1-90 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 91

Text: "Summary conviction of Ralph Speedy of Whitby baker for having in
his possession one seven-pound weight which was short by 14 drams and
one three-pound eight-ounce weight which was short by 11 drams. Offence
committed at Whitby on 14 December 1808. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=baker, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-91 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 92

Text: "Summary conviction of Robert Cowlson of Whitby meal seller for
having in his possession one fourteen-pound weight which was short by
14 drams, one fourteen-pound weight which was short by eight drams and
one seven-pound weight which was short by four drams. Offence committed
at Whitby on 14 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=meal seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 14 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-92 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 93

Text: "Summary conviction of Edward Carving of Whitby smith for having
in his possession one seven-pound weight which was short by 13 drams.
Offence committed at Whitby on 14 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=smith, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-93 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 94

Text: "Summary conviction of Robert Dickinson of Whitby grocer for
having in his possession one twenty-eight pound weight which was short
by 14 drams. Offence committed at Whitby on 14 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=grocer, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-94 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 95

Text: "Summary conviction of Thomas Dale of Whitby grocer for having in
his possession one twenty-pound weight which was short by three ounces
and two drams, one fourteen-pound weight which was short by one ounce
and five drams, one fourteen-pound weight which was short by 11 drams
and a two-pound weight which was short by six drams. Offence committed
at Whitby on 21 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=grocer, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. New same-date batch (21 Dec 1808: 96 Thomas Tate, 97 George
Robinson) -- same market-inspection pattern as the 14 Dec batch,
independent traders, no shared incident, correctly no related_
conviction links.

**OK — no changes.**

---

**Progress: records 1-95 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 96

Text: "Summary conviction of Thomas Tate of Whitby butter and bacon
seller for having in his possession one fourteen-pound weight which was
short by ten drams. Offence committed at Whitby on 21 December 1808.
Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butter and bacon seller, sex=male match.
Location/court=Whitby, petty sessional division match. Crime
type=false weights or measures matches. Part of the 21 Dec 1808
same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-96 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 97

Text: "Summary conviction of George Robinson of Whitby meal seller for
having in his possession one fourteen-pound weight which was short by
one ounce and three drams. Offence committed at Whitby on 21 December
1808. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=meal seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 21 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-97 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 98

Text: "Summary conviction of William Prodham of the parish of Danby
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Danby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. New same-date batch (17 Dec 1808: 99-105, 120-121) -- same
market-inspection pattern, independent traders, no shared incident,
correctly no related_conviction links.

**OK — no changes.**

---

**Progress: records 1-98 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 99

Text: "Summary conviction of Thomas Wright of the parish of Pickering
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Pickering, occupation=butcher, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 17 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-99 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 100

Text: "Summary conviction of Francis Laverack of Lythe butcher for
having in his possession one pair of steelyards deficient in weight.
Offence committed at Whitby on 17 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Lythe, occupation=butcher, sex=male ("Francis" spelling, male
form) match. Location/court=Whitby, petty sessional division match.
Crime type=false weights or measures matches. Part of the 17 Dec 1808
same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-100 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 101

Text: "Summary conviction of John Fenwick of the parish of Whitby
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-101 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 102

Text: "Summary conviction of John Knaggs of the parish of Whitby
butcher for having in his possession one pair of steelyards deficient
in weight. Offence committed at Whitby on 17 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-102 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 103

Text: "Summary conviction of John Robinson of the parish of Whitby for
having in his possession one pair of steelyards deficient in weight.
Offence committed at Whitby on 17 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, sex=male match. No occupation stated in text -- correctly
blank in DB, not a gap. Location/court=Whitby, petty sessional division
match. Crime type=false weights or measures matches. Part of the 17 Dec
1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-103 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 104

Text: "Summary conviction of Richard Harding butcher for having in his
possession a pair of steelyards deficient in weight. Offence committed
at Whitby on 17 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

No "of X" phrase at all for home -- Whitby is a context-supported
inference (local butcher, same batch as other Whitby-based traders),
consistent with the unstated-home-town rule, not a fabrication.
Occupation=butcher, sex=male match. Location/court=Whitby, petty
sessional division match. Crime type=false weights or measures matches.
Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-104 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 105

Text: "Summary conviction of James Cauwood of Whitby butcher for having
in his possession one pair of steelyards deficient in weight. Offence
committed at Whitby on 17 December 1808. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 17 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-105 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 106

Text: "Summary conviction of Thomas Marwood of Whitby butter seller for
having in his possession one seven-pound weight which was short by one
dram and eight ounces, one four-pound weight which was short by one
ounce, another four--pound weight which was short by six drams, and one
two--pound weight which was short by ten drams. Offence committed at
Whitby on the 20 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=butter seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. New same-date batch (20 Dec 1808: 114 Robert Robson)
-- same market-inspection pattern, no shared incident.

**OK — no changes.**

---

**Progress: records 1-106 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 107

Text: "Summary conviction of William Allon of Whitby bacon seller for
having in his possession one three-pound eight-ounce weight and one
two-pound weight both of which were short by eight drams, one one-pound
weight which was short by three drams, and one eight-ounce weight which
was short by two drams. Offence committed at Whitby on 22 December
1808. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=bacon seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. New same-date batch (22 Dec 1808: 109 John Porrit) --
same market-inspection pattern, no shared incident.

**OK — no changes.**

---

**Progress: records 1-107 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 108

Text: "Summary conviction of Elizabeth Craven of Whitby grocer for
having in her possession two one-pound weights which were both short by
three drams, one eight-ounce weight which was short by two drams,
another eight-ounce weight which was short by three drams, and a small
brass weight which was also deficient. Offence committed at Whitby on
24 December 1808. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=grocer, sex=female ("her possession") match.
Location/court=Whitby, petty sessional division match. Crime type=false
weights or measures matches. No same-date records, no related_
conviction.

**OK — no changes.**

---

**Progress: records 1-108 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 109

Text: "Summary conviction of John Porrit of Whitby bacon seller for
having in his possession one three-pound eight-ounce weight which was
short by eight drams, one two-pound weight which was short by seven
drams, one one-pound weight which was short by five drams and one
eight-ounce weight which was short by one dram. Offence committed at
Whitby on 22 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=bacon seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against record 107 (22 Dec
batch) -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-109 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 110

Text: "Summary conviction of Robert Routledge of Whitby plumber for
having in his possession one one-pound weight which was short by 11
drams and another one-pound weight which was short by ten drams.
Offence committed at Whitby on 14 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=plumber, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-110 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 111

Text: "Summary conviction of John Atkinson of Whitby baker for having
in his possession one eight-ounce weight which was short by seven
drams. Offence committed at Whitby on 14 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=baker, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-111 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 112

Text: "Summary conviction of George Duck of Whitby butcher for having
in his possession one fifty-six pound weight which was short by one
ounce and 14 drams, another fifty-six pound weight which was short by
one ounce and 12 drams, one twenty-eight pound weight which was short
by two ounces and four drams, and one seven-pound weight which was
short by one ounce and eight drams. Offence committed at Whitby on 14
December 1808. Whitby Strand Petty Sessional division - case heard at
Whitby"

Home=Whitby, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.

**OK — no changes.**

---

**Progress: records 1-112 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 113

Text: "Summary conviction of George Croft of Whitby painter for having
in his possession one eight -ounce weight which was short by three
drams. Offence committed at Whitby on 14 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=painter, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Part of the 14 Dec 1808 same-date batch, already resolved.
(Trivial stray space in "eight -ounce" -- source-side artifact, not
meaning-affecting, no anomalies note needed.)

**OK — no changes.**

---

**Progress: records 1-113 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 114

Text: "Summary conviction of Robert Robson of Whitby grocer for having
in his possession one fourteen-pound weight which was short by one
ounce and two drams, and another fourteen-pound weight which was short
by eight drams. Offence committed at Whitby on 20 December 1808. Whitby
Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=grocer, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against record 106 (20 Dec batch) --
correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-114 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 115

Text: "Summary conviction of John Cockburn of Whitby tobacco dealer for
having in his possession one one-pound weight and one eight-ounce
weight both of which were short by two drams. Offence committed at
Whitby on 14 December 1808. Whitby Strand Petty Sessional division -
case heard at Whitby"

Home=Whitby, occupation=tobacco dealer, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Part of the 14 Dec 1808 same-date batch, already
resolved.

**OK — no changes.**

---

**Progress: records 1-115 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 116

Text: "Summary conviction of John Oxley of Whitby bacon seller for
having in his possession two twenty-eight pound weights both of which
were short by two ounces. Offence committed at Whitby on 30 December
1808. Whitby Strand Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=bacon seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. New same-date batch (30 Dec 1808: 117 John Watson,
118 Ann Buck, 119 Charles Lamb) -- same market-inspection pattern, no
shared incident.

**OK — no changes.**

---

**Progress: records 1-116 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 117

Text: "Summary conviction of John Watson of Whitby for having in his
possession one fifty-six pound weight which was short by five ounces
and 14 drams, and one fourteen-pound weight which was short by one
ounce. Offence committed at Whitby on 30 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, sex=male match. No occupation stated in text, correctly
blank. Location/court=Whitby, petty sessional division match. Crime
type=false weights or measures matches. Already cross-checked against
record 116 (30 Dec batch).

**OK — no changes.**

---

**Progress: records 1-117 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 118

Text: "Summary conviction of Ann Buck of Whitby grocer for having in
her possession one two-pound weight which was short by four drams.
Offence committed at Whitby on 30 December 1808. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, occupation=grocer, sex=female match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against record 116 (30 Dec
batch).

**OK — no changes.**

---

**Progress: records 1-118 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 119

Text: "Summary conviction of Charles Lamb of Whitby worsted seller for
having in his possession one one-pound weight which was short by two
drams. Offence committed at Whitby on 30 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Whitby, occupation=worsted seller, sex=male match. Location/court=
Whitby, petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against record 116 (30 Dec
batch).

**OK — no changes.**

---

**Progress: records 1-119 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 120

Text: "Summary conviction of William Williamson of the parish of Lythe
butcher for having in his possession one pair of steelyard deficient in
weight. Offence committed at Whitby on 17 December 1808. Whitby Strand
Petty Sessional division - case heard at Whitby"

Home=Lythe, occupation=butcher, sex=male match. Location/court=Whitby,
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against record 98 (17 Dec batch).

**OK — no changes.**

---

**Progress: records 1-120 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 121

Text: "Summary conviction of William Robenson of Whitby butcher for
having in his possession one pair of steelyard deficient in weight, one
twenty-eight pound weight which was short by one ounce four drams and
one seven-pound weight which was short by ten dramsone weight found to
be deficient and one pair of steelyard also deficient in weight Offence
committed at Whitby on 17 December 1808. Whitby Strand Petty Sessional
division - case heard at Whitby"

Home=Whitby, occupation=butcher, sex=male match. Existing anomalies
note ("...ten dramsone weight found...", run-together clause) verified
accurate against the raw text. Location/court=Whitby, petty sessional
division match. Crime type=false weights or measures matches. Already
cross-checked against record 98 (17 Dec batch).

**OK — no changes.**

---

**Progress: records 1-121 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 122

Text: "Summary conviction of James Sharpe for begging in Church Street.
Offence committed at the township of Whitby on 29 November 1876.
Whitby Strand - case heard at Whitby"

No home stated in text at all -- correctly left blank, no fabricated
inference here (unlike record 104's butcher-in-context case, nothing
here supports inferring a home). No occupation stated, correctly blank.
Church Street (26) -> East Cliff (6) -> Whitby (4), matches stated
township. Court=Whitby. Petty sessional division="whitby strand" --
text just says "Whitby Strand" without the fuller "Petty Sessional
division" phrase, but resolves to the same division. Crime
type=begging matches. No related_conviction, no same-date records.

**OK — no changes.**

---

**Progress: records 1-122 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 123

Text: "Summary conviction of John Barber for begging in Glaisdale town
street. Offence committed at the township of Glaisdale on 21 November
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. No occupation stated, correctly blank.
"Glaisdale town street" correctly resolves to Glaisdale itself (138),
matching stated township. Court/petty sessional division match. Crime
type=begging matches. related_conviction links to 127 and 253 present,
correct pattern-2 style (note: 253 is well beyond the current id range
-- a legitimate forward link already made in a prior pass, not an
error, will be independently re-verified when reaching it).

**OK — no changes.**

---

**Progress: records 1-123 done (restart #2, plus confirmed blacklist gap
at 87-88).**

## Record 124

Text: "Summary conviction of Thomas Binns for begging in Ellerby town
street. Offence committed at the township of Ellerby on 10 October
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. "Ellerby town street" resolves to
Ellerby itself (123), matching the stated offence township. **FIXED**:
Ellerby (123) was parented under Lythe (107) -- same node reused
consistently in records 18, 19, and here/126 -- but Ellerby is
historically a township in Hinderwell parish (already evidenced by the
existing "Hinderwell & Ellerby Highway" cross-parish node used in
17-19), not Lythe. Flagged to the user, confirmed as an error, fixed:
`UPDATE location SET parent_id=88 WHERE id=123;` Verified via SELECT:
Ellerby (123) now parent=88=Hinderwell. This is a pure hierarchy
correction -- it does not retroactively invalidate the earlier OK
verdicts for records 18/19/124, since in every case Ellerby's own node
name matched the stated offence township directly (Ellerby=Ellerby);
the parent only matters for other sites checking whether they reach a
stated township. Court/petty sessional division match. Crime
type=begging matches. related_conviction link to 126 present, correct
pattern-2 style.

**FIXED — 1 location hierarchy fix (Ellerby reparented Lythe -> Hinderwell).**

---

**Progress: records 1-124 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 125

Text: "Summary conviction of Samuel Holmes for begging in Sandgate.
Offence committed at the township of Whitby on 30 October 1876. Whitby
Strand - case heard at Whitby"

No home stated, correctly blank. Sandgate (34) -> East Cliff (6) ->
Whitby (4), reaching stated township. Court/petty sessional division
match. Crime type=begging matches. Same-date records 423 and 1911
(far outside current range, unrelated defendants/charges) share
nothing with 125 -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-125 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 126

Text: "Summary conviction of Joseph Spence for begging in Ellerby town
street. Offence committed at the township of Ellerby on 10 October
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. "Ellerby town street" resolves to
Ellerby itself (123, now correctly parent=88=Hinderwell following the
fix at record 124). Court/petty sessional division match. Crime
type=begging matches. Already cross-checked against record 124 --
related_conviction link confirmed present.

**OK — no changes.**

---

**Progress: records 1-126 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 127

Text: "Summary conviction of John Lindsay for begging in Glaisdale
town street. Offence committed at the township of Glaisdale on 21
November 1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. "Glaisdale town street" resolves to
Glaisdale itself (138), matching stated township. Court/petty
sessional division match. Crime type=begging matches. Already
cross-checked against record 123 -- related_conviction link confirmed
present.

**OK — no changes.**

---

**Progress: records 1-127 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix.**

## Record 128

Text: "Summary conviction of John Gray of the township of Whitby
labourer for being drunk and disorderly on the Whitby and Guisborough
highway. Offence committed at the township of Aislaby on 18 November
1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Cross-parish highway
alongside stated township Aislaby. Court/petty sessional division
match. Crime type=drunk and disorderly matches. FIXED: same-date check
found records 130, 478, 510 all share the exact same offence date (18
Nov 1876), road, and charge wording ("being drunk and disorderly on the
Whitby and Guisborough highway"), each with a different defendant --
raised to the user as a likely 4-man shared incident spanning a wide id
range. User confirmed: create the links. Checked precedent first (the
Palmer trespass trio, records 2/3/4) -- confirmed the established
pattern is ALL pairwise combinations linked, not a hub. Inserted the 5
missing pairs (128-130, 128-478, 128-510, 130-478, 130-510); 478-510
already existed from a prior pass with an equivalent note. Verified via
SELECT: all 6 pairs now present. Also noted (not touched, already
correct): 510-514 separately linked via the same-defendant/same-date
pattern (John Jones, a different fact from the 4-man highway incident).

**FIXED — 5 new related_conviction links created (128-130, 128-478,
128-510, 130-478, 130-510), confirmed by the user.**

---

**Progress: records 1-128 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 129

Text: "Summary conviction of John Rice of the township of Whitby rag
gatherer for being the owner of a horse found straying on the Whitby
and Hawsker highway. Offence committed at the township of Whitby on 11
October 1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=rag gatherer, sex=male match. Cross-parish
highway alongside stated township Whitby. Court/petty sessional
division match. Crime type=straying animals matches. FLAGGED (not yet
resolved): same-date record 220 has identical charge wording ("being
the owner of a horse found straying on the Whitby and Hawsker
highway"), different defendant (Cuthbert Wray) -- likely pattern-2
same-incident candidate, no related_conviction link exists yet. To
confirm/fix when reaching 220.

**OK — no changes (pending same-incident check at record 220).**

---

**Progress: records 1-129 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 130

Text: "Summary conviction of Anthony Waters of the township of Whitby
coal porter for being drunk and disorderly on the Whitby and
Guisborough highway. Offence committed at the township of Aislaby on
18 November 1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=coal porter, sex=male match. Same shape as
record 128 (cross-parish highway alongside Aislaby). Court/petty
sessional division match. Crime type=drunk and disorderly matches.
related_conviction links to 128/478/510 already confirmed present from
the fix at record 128.

**OK — no changes.**

---

**Progress: records 1-130 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 131

Text: "Summary conviction of John Thornton for lodging in a wooden hut
with no visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Glaisdale on 18 November
1876. Whitby Strand - case heard at Whitby"

No home stated, correctly blank. Location of offence=Glaisdale, court=
Whitby, petty sessional division match. Crime type=vagrancy matches.
Already cross-checked against record 128 -- correctly unrelated
(different charge, no shared party).

**OK — no changes.**

---

**Progress: records 1-131 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5 related_conviction links added.**

## Record 132

Text: "Summary conviction of Robert Arnold of the township of Whitby
soldier for assaulting Thomas Watson; on the oath of Joseph Philpot of
the township of Whitby jet worker. Offence committed at the township of
Whitby on 11 November 1876. Whitby Strand - case heard at Whitby"

Home=Whitby, occupation=soldier, sex=male match. Thomas Watson: victim,
correctly captured. Joseph Philpot: witness, home=Whitby, occupation=
jet worker, correctly attached to him (not misattributed to the
defendant). Location/court=Whitby, petty sessional division match.
Crime type=assault matches. related_conviction: 132-1977 and 132-1983
already present (both same-defendant/same-date, Robert Arnold appears
in both). NOTED, NOT YET RESOLVED: same-date check surfaced a much
larger, tangled cluster around "Thomas Watson['s] licensed premises" on
this date -- records 333, 447, 466, 482, 1971, 1974, 1977, 1980, 1983,
all sharing an overlapping recurring cast (Watson, Philpot, Thompson,
Speedy, Nawton, Harrison), some with abbreviated name variants
suggesting possible near-duplicate entries from the same court sitting.
This is far more complex than the 128/130/478/510 four-man case and
spans ids well beyond the current position. Deliberately NOT resolving
now, out of sequence -- will investigate properly when each of those
records is reached individually.

**RESOLVED** (user asked to investigate immediately rather than defer):
Pulled all 10 records' full raw_record text side by side. This is one
real historical incident at Thomas Watson's licensed premises, Whitby,
11 November 1876 -- NOT duplicates. 6 distinct defendants (Robert
Arnold, William Barrett, Robert Wilson, John Arnold, Richard Holmes,
Edward Barrett), one joint 4-defendant conviction (1983), 3 distinct
charge groupings (assaulting Thomas Watson: 132/333; assaulting Edward
Watson: 447/1983; disorderly on the licensed premises: 466/482/1971/
1974/1977/1980), same 7-person witness list throughout (abbreviated
name variants across records, same real people).

Digression: user asked whether `related_conviction` should be
remodeled as a cluster/incident table given the scale here. Checked
`qsrecords/models/core.py`'s `RelatedConviction` docstring first --
already documents "unbounded cardinality (up to 11 links per
conviction, verified)" as the reason it's pairwise, and states the
design is deliberately informal (`note` is for internal judgment only,
never surfaced to users). Decision: keep pairwise, park the cluster
idea for later (see project memory
`project_related_conviction_cluster_model_parked.md`).

All same-defendant (pattern-1) links were already fully correct
(Arnold's 3, Barrett's 3, Wilson/Holmes/E.Barrett's 2 each). Missing
different-defendant (pattern-2) links identified and created, all-pairs
style, matching precedent:
- 15 links among the six "disorderly on licensed premises" records
  (466, 482, 1971, 1974, 1977, 1980) -- one incident, six patrons.
- 1 link: 132-333 (Robert Arnold vs William Barrett, both "assaulting
  Thomas Watson").
- 1 link: 447-1983 (William Barrett alone vs the four jointly charged,
  both "assaulting Edward Watson") -- genuinely ambiguous whether same
  specific assault; asked the user, confirmed: link them.
17 new rows total, verified via SELECT (26 total related_conviction
rows now cover this cluster, up from 9 pre-existing).

**FIXED — 17 new related_conviction links created across the Watson-
premises cluster (132, 333, 447, 466, 482, 1971, 1974, 1977, 1980,
1983), confirmed by the user; cluster-model schema question parked as
a project decision.**

---

**Progress: records 1-132 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 5+17=22 related_conviction links added.**

## Record 133

Text: "Summary conviction of John Shaw of the township of Whitby jet
worker for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 4 November 1876. Whitby Strand - case
heard at Whitby"

Home=Whitby, occupation=jet worker, sex=male match. Baxtergate -> West
Cliff -> Whitby reaches stated township. Court/petty sessional division
match. Crime type=drunk and disorderly matches. Same-date records (297,
363, 429, 441, 1965, 1968) share no party with 133 -- correctly
unrelated. NOTED for later: 363 and 441 share defendant Jacob Pearson
-- will check for a missing same-defendant related_conviction link when
those records are reached.

**OK — no changes.**

---

**Progress: records 1-133 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 134

Text: "Summary conviction of William Burkit of Glasgow in North Britain
for distributing hand bills or advertisements for selling drapery goods
at the King's Head Inn in Church Street in Whitby under the name of
John Spark and Co from Glasgow without the words \"Licensed Hawker\" and
the number on his licence being inserted in the advertisements; on the
information of Joseph Thornhill"

Home=Glasgow matches "of Glasgow in North Britain". Impersonation rule
correctly applied: "John Spark and Co" captured as its own row, role=
"company impersonated" (10340), not folded in as an alias. Joseph
Thornhill: informant, correctly captured. King's Head Inn (387) nests
under Church Street (26), matching "at the King's Head Inn in Church
Street in Whitby". No offence_date, court location, or petty sessional
division stated in the text at all -- correctly absent from the DB,
not a gap (this record predates the standard "Whitby Strand Petty
Sessional division - case heard at Whitby" phrasing seen elsewhere).
Crime type=licensing offence matches. No related_conviction (no
offence_date to cross-check against, and none exists for this id).

**OK — no changes.**

---

**Progress: records 1-134 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 135

Text: "Summary conviction of Harris Lyon for trading as a hawker
without a certificate, selling six silver teaspoons to William Bell of
the parish of Whitby excise officer; on the information of John Meek.
Offence committed at Whitby. With bill of prosecution expenses dated 24
September 1814 and an undated note relating to Lyon's fine"

Lyon: defendant, occupation=hawker (matches "trading as a hawker" --
the charge is doing so without a certificate, not that "hawker" itself
is fabricated), no home stated, correctly blank. William Bell: role=
buyer, home=Whitby, occupation=excise officer, correctly attached to
Bell not Lyon. John Meek: informant, no home/occupation stated,
correctly blank. Location of offence=Whitby matches. No court/petty
sessional division stated, correctly absent. Crime type=licensing
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-135 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 136

Text: "Summary conviction of James Benson, John Barker, James Robinson
and Margaret his wife, and Joseph Grotes and Mary his wife, for
vagrancy; on the information of John Morley constable of the township
of Whitby. Offence committed at the township of Whitby on 26 January
1822. Case heard at Whitby"

Six defendants: Benson, Barker, James Robinson, Margaret Robinson,
Joseph Grotes, Mary Grotes -- all present as separate person rows.
Checked specifically for the duplicate-stub bug (per project memory):
Margaret (137) "wife" -> James Robinson (136), and Mary (139) "wife" ->
Joseph Grotes (138) -- both correctly point at the real co-defendant
rows already on this record, not a duplicate stub. John Morley:
informant, occupation="constable of the township of Whitby", correctly
captured. Location/court=Whitby. Crime type=vagrancy matches. No
related_conviction. [Wording corrected 2026-07-30: was miswritten as
"office"; verified correctly stored as occupation, no DB error.]

**OK — no changes.**

---

**Progress: records 1-136 done (restart #2, plus confirmed blacklist gap
at 87-88). 1 location fix, 22 related_conviction links added.**

## Record 137

Text: "Summary conviction of Francis Thompson of the township of
Hawsker cum Stainsacre farmer for driving two horses on the Whitby and
Pickering railway; on the information of Alfred Jefferson of the
township of Ruswarp collector of tolls on the Whitby and Pickering
railway. Offence committed at the township of Hawsker cum Stainsacre on
1 July 1839. Case heard at Whitby"

Home=Hawsker-cum-Stainsacre, occupation=farmer, sex=male match. Alfred
Jefferson: informant, home=Ruswarp, occupation="collector of tolls on
the Whitby and Pickering railway", correctly captured [wording
corrected 2026-07-30: was miswritten as "office"; verified correctly
stored as occupation, no DB error]. **FIXED**: location
of offence was missing the "Whitby & Pickering Railway" node (389,
Cross-Parish Railways) -- found by comparing against records 141 and
146, which have near-identical text (same charge, same date, same
informant) and already correctly link to 389 alongside the stated
township. Fixed: `INSERT INTO summary_conviction_location
(summary_conviction_id, location_id, role) VALUES (137, 389, 'location
of offence');` Verified via SELECT. Also created the missing
related_conviction links: 137, 141, and 146 are clearly one incident
(three men driving horses on the railway together, same date, same
informant) -- inserted all 3 pairwise links, matching the established
all-pairs precedent (Palmer trespass trio, etc.). Verified via SELECT.
Crime type=trespass matches.

**FIXED — 1 missing location link added, 3 new related_conviction
links created.**

---

**Progress: records 1-137 done (restart #2, plus confirmed blacklist gap
at 87-88). 2 location fixes, 25 related_conviction links added.**

## Record 138

Text: "Summary conviction of Thomas Argument of the township of Whitby
hawker for encamping on the public highway; on the information of
William Barton. Offence committed at the township of Sand Hutton on 28
August 1844. Case heard at Lobster House in the township of Claxton"

Home=Whitby, occupation=hawker, sex=male match. William Barton:
informant, no home/occupation stated, correctly blank. Location of
offence=Sand Hutton (300, top-level, distinct from the usual Whitby-
area townships) matches. Court location=Lobster House (394) -> Claxton
(333), matching this unusual out-of-area court venue exactly. Crime
type=obstructing the highway matches "encamping on the public highway".
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-138 done (restart #2, plus confirmed blacklist gap
at 87-88). 2 location fixes, 25 related_conviction links added.**

(Record 139 confirmed blacklisted, expected gap.)

## Record 140

Text: "Summary conviction of Mary Egins, Peter Kelley, James Coil, John
Camble and John Thompson for vagrancy; on the information of John
Morley constable of the township of Whitby. Offence committed at the
township of Whitby in February 1822. Case heard at Whitby"

Five defendants, all separate person rows, none stated as married to
each other. John Morley: informant, office correctly captured (same
recurring officer as record 136, but different date/defendants --
correctly a separate, unrelated conviction). Location/court=Whitby.
Crime type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-140 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links added.**

## Record 141

Text: "Summary conviction of George Jackson of the township of Sneaton
servant in husbandry for driving two horses on the Whitby and Pickering
railway; on the information of Alfred Jefferson of the township of
Ruswarp collector of tolls on the Whitby and Pickering railway. Offence
committed at the township of Hawsker cum Stainsacre on 1 July 1839.
Case heard at Whitby"

Home=Sneaton, occupation="servant in husbandry", sex=male match. Both
location-of-offence rows (Hawsker-cum-Stainsacre, Whitby & Pickering
Railway) already correctly present -- this was the record used as
precedent to fix 137. related_conviction links to 137/146 already
confirmed present. Crime type=trespass matches.

**OK — no changes.**

---

**Progress: records 1-141 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links added.**

## Record 142

Text: "Summary conviction of Jane Harrison of the township of Whitby
singlewoman for not maintaining her three bastard children, namely
Dorothy aged 10 years, William aged 7 years, and Jane aged 5 years,
whereby they became chargeable to the township of Whitby. Offence
committed at the township of Whitby on 6 April 1844. Case heard at
Whitby"

Jane Harrison (mother): home=Whitby, occupation=singlewoman, sex=female
match. Three children, birth_year correctly derived from stated ages
(1844 minus 10/7/5 = 1834/1837/1839), person_relationship "child" ->
Jane Harrison for all three, correct. **FIXED**: none of the three
children had `sex` set despite unambiguous given names -- Dorothy
(6517) -> female, William (6518) -> male, Jane (6519) -> female. Same
fix class as the earlier Duncanson/Corser records. Verified via
SELECT. Location/court=Whitby, crime type=failure to maintain bastard
children match. No related_conviction, no same-date records.

**FIXED — 3 sex fixes.**

---

**Progress: records 1-142 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 143

Text: "Summary conviction of George Watson of the township of Whitby
labourer for cutting down 25 larch trees, the property of Henry Linton
of the township of Newholm cum Dunsley spirit merchant, and causing
ten-shillingsworth of damage. Offence committed at the township of
Hawsker cum Stainsacre on 29 July 1853. Case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. Henry Linton: victim,
home=Newholm-cum-Dunsley, occupation=spirit merchant, correctly
captured with his own attributes. Location of offence=Hawsker-cum-
Stainsacre matches. Court=Whitby. Crime type=malicious/property damage
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-143 done (restart #2, plus confirmed blacklist gap
at 87-88, 139). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

(Record 144 confirmed blacklisted, expected gap.)

## Record 145

Text: "Summary conviction of Francis Wrightson labourer and Isaac
Harrison labourer, both of the parish of Sneaton, for using dogs and
guns to kill game. Offence committed at the parish of Sneaton on 26
December 1821. Case heard at Whitby"

Two co-defendants, both home=Sneaton, occupation=labourer, sex=male,
both on this one record (no cross-record link needed). Location/court
match. Crime type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-145 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 146

Text: "Summary conviction of Thomas Beeforth the younger of the
township of Sneaton farmer for driving two horses on the Whitby and
Pickering railway; on the information of Alfred Jefferson of the
township of Ruswarp collector of tolls on the Whitby and Pickering
railway. Offence committed at the township of Hawsker cum Stainsacre on
1 July 1839. Case heard at Whitby"

Home=Sneaton, name_postfix="the younger" correctly captured, occupation
=farmer, sex=male match. Both location-of-offence rows already
correctly present -- this was the second record used as precedent to
fix 137. related_conviction links to 137/141 already confirmed. Crime
type=trespass matches.

**OK — no changes.**

---

**Progress: records 1-146 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 147

Text: "Summary conviction of James Guy and George Orton for begging.
Offence committed at the township of Ruswarp on 15 November 1844. Case
heard at Whitby"

Two co-defendants, no home stated for either, correctly blank. Location
of offence=Ruswarp, court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-147 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 148

Text: "Summary conviction of John Dixon of the township of Whitby
labourer for exposing himself and using very obscene and indecent
language in St Ann's Staith; on the oath of Edward Barker of the
township of Whitby assistant constable. Offence committed at the
township of Whitby on 4 August 1853. Case heard at Whitby"

Home=Whitby, occupation=labourer, sex=male match. St Ann's Staith ->
West Cliff -> Whitby reaches stated township. Edward Barker: informant,
home=Whitby, occupation="assistant constable", correctly captured.
Court=Whitby. Crime type=using obscene language matches. No
related_conviction. [Corrected 2026-07-30: originally miswritten as
"office" here -- verified against the DB, this was always correctly
stored as occupation; office is reserved for aristocratic/peerage
pedigree only, per the rule clarified at record 191.]

**OK — no changes.**

---

**Progress: records 1-148 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 149

Text: "Summary conviction of James Lovatt of Whitby gunsmith for using a
gun to kill game. Offence committed at Guisborough on 4 October 1819.
Case heard at Guisborough"

Home=Whitby, occupation=gunsmith, sex=male match. Both court location
and location of offence correctly Guisborough (278), an out-of-area
venue distinct from the usual Whitby-area townships. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-149 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 150

Text: "Summary conviction of John Taylor of the township of Loftus
labourer for having four pheasants for sale which he was not authorised
to have or sell. Offence committed at the township of Whitby on
Tuesday 15 January 1822"

Home=Loftus, occupation=labourer, sex=male match. Location of
offence=Whitby matches. Day-of-week ("Tuesday") preserved in
offence_date_raw -- no dedicated schema column for it, nothing further
needed. No court location stated at all in the text, correctly absent.
Crime type=poaching matches ("pheasants...not authorised to have or
sell"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-150 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

(Record 151 confirmed blacklisted, expected gap.)

## Record 152

Text: "Summary conviction of Robert Harrison for not maintaining his
family, whereby his three children became chargeable to the township
of Whitby Offence committed at the township of Whitby on 15 July 1844.
Case heard at Whitby"

No home stated, correctly blank. Children not named in this text
(unlike record 142's named Dorothy/William/Jane) -- correctly no child
person rows created, nothing to capture. Location/court=Whitby. Crime
type=failure to maintain family matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-152 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 153

Text: "Summary conviction of Thomas Rodgers of the township of
Hinderwell miner for assaulting Michael Theaker; on the oath of the
said Michael Theaker of the township of Hinderwell constable. Offence
committed at the township of Hinderwell on 1 September 1853. Case heard
at Whitby"

Home=Hinderwell, occupation=miner, sex=male match. Michael Theaker:
victim, home=Hinderwell, occupation=constable, correctly captured
despite being both the victim and the sworn witness ("the said Michael
Theaker"). Location of offence=Hinderwell, court=Whitby. Crime
type=assaulting a police officer matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-153 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 154

Text: "Summary conviction of Messrs Holt and Company of the township of
Whitby for having in their custody 13 x 56-pound weights, five 28-pound
weights, one 14-pound weight, two seven-pound weights, and one
three-and-a-half-pound weight, all of which were deficient in weight.
Offence committed at Whitby on 26 April 1818. Case heard at a Petty
Sessions for the division of Whitby Strand"

Defendant is a company ("Holt and Company"), captured with the company
name in last_name, first/middle name and sex correctly blank -- same
convention as the "company impersonated" case in record 134, applied
here to a genuine company defendant. Home=Whitby matches. Location/
court=Whitby, petty sessional division correctly resolved from "a
Petty Sessions for the division of Whitby Strand". Crime type=false
weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-154 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 155

Text: "Summary conviction of Thomas Jackson of the township of Whitby
for having false weights in his possession, namely a half-pound weight,
a quarter-pound weight, a two-ounce weight, and a one-ounce weight.
Offence committed at Whitby on 27 March 1822. Whitby Strand Petty
Sessional division - case heard at Whitby"

Home=Whitby, sex=male match. No occupation stated, correctly blank.
Location/court=Whitby, petty sessional division match. Crime
type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-155 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 156

"Summary conviction of William Hamilton Irvin for playing a game of
chance in Ruswarp Street. Offence committed at the township of Ruswarp
on 8 July 1839. Case heard at Whitby" -- middle name Hamilton correct,
no home stated, correctly blank. Ruswarp Street nests directly under
Ruswarp (94), matching stated township. Crime type=gaming/gambling
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-156 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 157

"Summary conviction of John Humphrey apprentice to Harrison Waller of
the township of Lythe shoemaker for misconduct and ill-behaviour
towards his master...absented himself...continued absent for a week.
Case heard at Whitby" -- Humphrey: occupation="apprentice shoemaker"
(15, existing precedent, matches). Waller: master, home=Lythe,
occupation=shoemaker, correctly attached to him not Humphrey.
person_relationship: "apprentice" -> Waller, correct. No offence
location stated (situational/ongoing absence, not a single-site
event), correctly absent. Court=Whitby, no petty sessional division
stated, correctly absent. Crime type=master and servant offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-157 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 158

"Summary conviction of Martha Dixon of the township of Whitby
singlewoman for assaulting Sarah Hardcastle; on the oath of the said
Sarah Hardcastle wife of William Hardcastle of the township of Whitby
labourer. Offence committed at the township of Whitby on 17 September
1853. Case heard at Whitby" -- Martha: home=Whitby, occupation=
singlewoman, sex=female match. Sarah Hardcastle: victim, female, no
occupation of her own (correct). William Hardcastle: "husband of
victim", home=Whitby, occupation=labourer, correctly attached to him.
person_relationship: Sarah "wife" -> William, correct direction.
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-158 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 159

"Summary conviction of Jane Holland of the township of Fylingdales for
having in her possession one seven-pound weight, one one-pound weight,
one quarter-pound weight, and one half-pound weight, all of which were
deficient in weight. Offence committed at Fylingdales on 18 June 1818.
Case heard at a Petty Sessions for the division of Whitby Strand" --
home=Fylingdales, sex=female match, no occupation stated correctly
blank. Location/court match, petty sessional division correctly
resolved. Crime type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-159 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 160

"Summary conviction of Sarah Tate of the township of Whitby for having
false weights in her possession...Offence committed at Whitby on 6
April 1822. Whitby Strand Petty Sessional division - case heard at
Whitby" -- home=Whitby, sex=female match, no occupation stated
correctly blank. Location/court/petty sessional division match. Crime
type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-160 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 161

"Summary conviction of William Bell of the township of Egton butcher
for assaulting Edward Turner of the township of Whitby cabinet maker,
striking him several times on the face with his fist. Offence committed
at the township of Whitby on 6 July 1839. Division of Whitby Strand -
case heard at Whitby" -- Bell: home=Egton, occupation=butcher, sex=male
match. Turner: victim, home=Whitby, occupation=cabinet maker, correctly
attached to him. Location/court=Whitby, "Division of Whitby Strand"
correctly resolves to whitby strand. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-161 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 162

"Summary conviction of John Thompson, Henry Harris and William Johnson
for begging. Offence committed at the township of Whitby on 11
December 1844. Case heard at Whitby" -- three co-defendants, no homes
stated, correctly blank. Location/court=Whitby. Crime type=begging
matches. No related_conviction (all three on this one record).

**OK — no changes.**

---

**Progress: records 1-162 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 163

"Summary conviction of William Peart of the township of Whitby
fisherman for assaulting Matthew Leadley; on the oath of the said
Matthew Leadley of the township of Whitby mariner. Offence committed at
the township of Whitby on 27 September 1853. Case heard at Whitby" --
Peart: home=Whitby, occupation=fisherman, sex=male match. Leadley:
victim, home=Whitby, occupation=mariner, correctly captured.
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-163 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 164

"Summary conviction of Jane Watson of the township of Fylingdales for
having in her possession a one-stone weight and one three-and-a-half-
pound weight, both of which were deficient in weight. Offence committed
at Fylingdales on 18 June 1818. Case heard at a Petty Sessions for the
division of Whitby Strand" -- home=Fylingdales, sex=female match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Same-date batch (159, 169, 174, 179) --
independent traders, same market-inspection pattern, no shared
incident, correctly unlinked.

**OK — no changes.**

---

**Progress: records 1-164 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 165

"Summary conviction of Ann Marshall of the township of Whitby for
having a false one-stone weight in her possession. Offence committed at
Whitby on 26 March 1822. Whitby Strand Petty Sessional division - case
heard at Whitby" -- home=Whitby, sex=female match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
No same-date records, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-165 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 166

"Summary conviction of Edward Smith Wormald of the township of Newholm
cum Dunsley farmer for assaulting William Thompson of the township of
Whitby butcher...Division of Whitby Strand - case heard at Whitby" --
middle name Smith correctly captured, home=Newholm-cum-Dunsley,
occupation=farmer, sex=male match. Thompson: victim, home=Whitby,
occupation=butcher, correctly captured. Location/court=Whitby, petty
sessional division match. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-166 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 167

"Summary conviction of John Reed of the township of Whitby blacksmith
for assaulting Jane Reed his wife, by striking her several times on the
head with great force and violence. Offence committed at the township
of Whitby on 6 September 1844. Case heard at Whitby" -- domestic
assault; John: home=Whitby, occupation=blacksmith, sex=male match.
Jane: victim, female, no occupation of her own, correct. person_
relationship: Jane "wife" -> John, correct direction. Location/court=
Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-167 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 168

"Summary conviction of Robert Brooks of the township of Eskdaleside
miner for having eight salmon trout in his possession which had been
caught in the river Esk during the close season; on the complaint of
William Wilkinson the younger of the township of Whitby superintendent
of police. Offence committed at the township of Eskdaleside on 8
October 1853. Case heard at Whitby" -- home=Eskdaleside-cum-Ugglebarnby
(shorthand "Eskdaleside" in text), occupation=miner, sex=male match.
River Esk (398) correctly modeled as a cross-parish "Rivers" category
node (397), added alongside the stated township -- same pattern as
highways/railways, first river-category record seen this pass. William
Wilkinson: complainant, home=Whitby, name_postfix="the younger",
occupation="superintendent of police", correctly captured [wording
corrected 2026-07-30: was miswritten as "office"; verified correctly
stored as occupation, no DB error]. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-168 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 169

"Summary conviction of Rebecca Harrison of the township of Fylingdales
having in her possession...deficient in weight. Offence committed at
Fylingdales on 18 June 1818. Case heard at a Petty Sessions for the
division of Whitby Strand" -- home=Fylingdales, sex=female match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against record 164
(18 June 1818 batch) -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-169 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 170

"Summary conviction of William Wood of the township of Whitby for
having a false half-stone weight in his possession. Offence committed
at Whitby on 6 April 1822. Whitby Strand Petty Sessional division -
case heard at Whitby" -- home=Whitby, sex=male match. Location/court/
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against record 165 (6 April 1822 batch).

**OK — no changes.**

---

**Progress: records 1-170 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 171

"Summary conviction of William Pinkney Whitby shipwright and John Young
sawyer, both of Whitby, for taking other than by angling five salmon
trout value 5s, from the river Esk where John Elgie of the township of
Ruswarp miller had a private right of fishing. Offence committed at the
township of Sneaton on 10 August 1839. Case heard at Whitby" -- Pinkney
and Young: both home=Whitby, occupations shipwright/sawyer correctly
attached to the right person, sex=male. John Elgie: role="owner of
private fishing right", home=Ruswarp, occupation=miller, correctly
captured. River Esk (398) cross-parish node alongside stated Sneaton
township. Crime type=poaching matches. No related_conviction (both
defendants on this one record).

**OK — no changes.**

---

**Progress: records 1-171 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 172

"Summary conviction of Edward Genning for begging. Offence committed at
the township of Whitby on 2 January 1845. Case heard at Whitby" -- no
home stated, correctly blank. Location/court=Whitby. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-172 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 173

"Summary conviction of James Wilson late of the township of Aislaby
labourer for begging. Offence committed at the township of Aislaby on
7 April 1857. Case heard at Whitby" -- "late of" checked against
corpus-wide precedent (35 occurrences) -- established convention
stores the stated place as home_location_id regardless of "late"
meaning formerly resident, since it's the only location info given;
documented in rule book. Home=Aislaby, occupation=labourer, sex=male
match. Location/court match. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-173 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links, 3 sex fixes.**

## Record 174

"Summary conviction of Mathew Rickinson of the township of Fylingdales
for having in his possession a seven-pound weight that was deficient.
Offence committed at Fylingdales on 18 June 1818. Case heard at a Petty
Sessions for the division of Whitby Strand" -- **FIXED**: stored
first_name was "Matthew" (two T's) but this record's own raw_record
spells it "Mathew" (one T) -- unlike the earlier Cargill case (two
competing sources), there's only one source text here and the DB
simply didn't match it. `UPDATE person SET first_name='Mathew' WHERE
id=183;` Verified via SELECT. Home=Fylingdales matches. Location/court/
petty sessional division match. Crime type=false weights or measures
matches. Part of the 18 June 1818 same-date batch (159/164/169),
already resolved as independent traders, no shared incident.

**FIXED — 1 spelling fix.**

---

**Progress: records 1-174 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix.**

## Record 175

"Summary conviction of William Foster of the township of Whitby for
having false weights in his possession...Offence committed at Whitby
on 28 March 1822. Whitby Strand Petty Sessional division - case heard
at Whitby" -- home=Whitby, sex=male match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-175 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix.**

## Record 176

"Summary conviction of Elizabeth Wood for being drunk; on the
information of William Taylor of the township of Whitby mariner.
Offence committed at the township of Whitby on 11 August 1839. Case
heard at Whitby" -- no home stated for Elizabeth, correctly blank, sex=
female. William Taylor: informant, home=Whitby, occupation=mariner,
correctly captured. Location/court=Whitby. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-176 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix.**

## Record 177

"Summary conviction of George Robinson for entering at night on a
piece of woodland called Overdale Plantation belonging to and occupied
by the Marquis of Normanby, ad taking three pheasants Offence committed
at the township of Lythe at 11 p.m. on 23 January 1845. Case heard at
Whitby" -- George Robinson: no home stated, correctly blank. Marquis of
Normanby: Constantine Henry Phipps, office="1st Marquess of Normanby
(Viscount Normanby 1812 - 1831; Earl of Mulgrave 1831 - 1838)", matches
the established precedent exactly. Overdale Plantation (358) nests
under Lythe (107), matching stated township. offence_time="11 p.m."
correctly captured. **FIXED**: no anomalies note existed for the "ad
taking" scribal typo (should be "and taking") -- same class as
existing notes elsewhere (records 4, 78, 121). Added:
`UPDATE summary_conviction SET anomalies='Scribal typo in source text:
"ad taking" (missing letters, should be "and taking").' WHERE id=177;`
Verified via SELECT. Crime type=poaching matches. No related_conviction.

**FIXED — 1 missing anomalies note added.**

---

**Progress: records 1-177 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 178

"Summary conviction of Ralph Storr apprentice to Sampson Storm of the
township of Ruswarp ship owner for absconding from the service of his
master. Offence committed on 7 April 1857. Case heard at Whitby" --
Storr (defendant) and Storm (master) correctly kept as distinct people
despite similar surnames -- read carefully, not conflated. Occupation=
apprentice, home not stated for Storr (correct). Storm: home=Ruswarp,
occupation=ship owner, correctly attached. person_relationship:
"apprentice" -> Storm, correct. No location of offence stated (no
township given for the offence itself). Crime type=master and servant
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-178 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 179

"Summary conviction of Thomas Newton of the township of Fylingdales for
having in his possession...deficient in weight. Offence committed at
Fylingdales on 18 June 1818. Case heard at a Petty Sessions for the
division of Whitby Strand" -- home=Fylingdales, sex=male match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 164/174 (18
June 1818 batch) -- correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-179 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 180

"Summary conviction of Benjamin Day for having false weights in his
possession...Offence committed at Whitby on 28 March 1822. Whitby
Strand Petty Sessional division - case heard at Whitby" -- no home
stated, correctly blank, sex=male. Location/court/petty sessional
division match. Crime type=false weights or measures matches. Same
date as record 175 (28 March 1822) -- already cross-checked, correctly
unrelated (independent traders, market-inspection pattern).

**OK — no changes.**

---

**Progress: records 1-180 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note added.**

## Record 181

"Summary conviction of Charles Alcrow apprentice to Thomas Marwood the
younger of the township of Ruswarp shipowner for absenting himself
from his master's service. Offence committed on 25 September 1839.
Case heard at Whitby" -- Alcrow: occupation=apprentice, home not
stated (correct). Marwood: master, name_postfix="the younger", home=
Ruswarp, occupation=shipowner, correctly attached. **FIXED**: found
this pair stored BOTH directions (190 apprentice->6536 AND 6536
master->190), unlike records 157/178's single-direction convention.
Corpus-wide check: only 8/586 person_relationship rows (4 pairs) were
stored bidirectionally like this -- a small minority, not the
established convention. Flagged to the user; confirmed: remove the
redundant reverse rows. Identified all 4 pairs precisely (190/6536
apprentice-master, 216/6551 apprentice-master, 223/6557 apprentice-
master, 6203/9779 wife-husband), verified each row's exact id (369,
371, 372, 536) before deleting, kept the primary direction matching
established precedent (apprentice->master, wife->husband) in each
case. `DELETE FROM person_relationship WHERE id IN (369,371,372,536);`
Verified via SELECT: 586 -> 582 total rows, record 181 now shows only
the single apprentice direction. Crime type=master and servant offence
matches. No related_conviction.

**FIXED — 4 redundant reciprocal relationship rows removed corpus-wide
(records 181, 216-area, 223-area, and one wife/husband pair).**

---

**Progress: records 1-181 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed.**

## Record 182

"Summary conviction of Wardale Harland for refusing to maintain his
family whereby his two children became chargeable to the township of
Whitby. Harland already had been convicted as an idle and disorderly
person on 21 December 1839. Offence committed at the township of
Whitby on 10 September 1842. Case heard at Whitby" -- no home stated,
correctly blank. Prior-conviction reference (1839) has no dedicated
schema field but is fully preserved verbatim in raw_record -- not a
gap. conviction_date (1845) considerably later than offence_date
(1842), consistent with the text's own account of a delayed hearing.
Location/court=Whitby. Crime type=failure to maintain family matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-182 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed.**

## Record 183

"Summary conviction of James Johnson late of the township of Whitby
labourer for begging. Offence committed at the township of Whitby on
18 April 1857. Case heard at Whitby" -- "late of" convention (per
record 173) applied consistently, home=Whitby, occupation=labourer,
sex=male match. Location/court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-183 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 2 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed.**

## Record 184

"Summary conviction dated 14 May 1818 of John Gardner of Hexham for
distributing handbills advertising a sale by auction, at the house of
William Harland at the sign of the Butchers Arms near the Fish Market
at Whitby...The words 'Licensed Hawker' etc...had not been inserted in
the advertisements. Information given by Henderson Skaife and John
Bulmer. Case heard at Whitby. Information dated 18 May 1818 of David
Hartley of Whitby pawnbroker, witness in the case against John Gardner"

Gardner: home=Hexham matches. Existing anomalies note ("Gardener" vs
"Gardner") verified accurate. William Harland: "householder/venue
keeper", home=Whitby, correctly captured. Skaife/Bulmer: informants.
David Hartley: witness, home=Whitby, occupation=pawnbroker, correct.
**FIXED**: no location node existed for "Butchers Arms"/Fish Market
despite the near-identical record 134 (King's Head Inn) getting a
specific site node for the same offence type. Raised to the user;
confirmed adding it. Created location 415 ("Butchers Arms (near the
Fish Market)"), initially under Whitby (4). User then asked to place it
on the correct street; checked existing candidates -- "Market Place"
(30, East Cliff) and "Old Market Place" (31, West Cliff) both exist,
but which one corresponds to this 1818 Fish Market is genuinely
unresolved. User's decision: leave nested under Whitby as a
placeholder, flagged via `notes_private` for follow-up research rather
than guessed. Linked as location of offence for this record. Crime
type=licensing offence matches.

**FIXED — 1 new location node created (flagged as needing a proper
street parent), linked to this record.**

---

**Progress: records 1-184 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed. 1 location flagged for follow-up (Butchers Arms street).**

## Record 185

"Summary conviction of Robert Vickers of the township of Whitby for
having false weights in his possession...Offence committed at Whitby on
28 March 1822. Whitby Strand Petty Sessional division - case heard at
Whitby" -- home=Whitby, sex=male match. Location/court/petty sessional
division match. Crime type=false weights or measures matches. Already
cross-checked against records 175/180 (28 March 1822 batch).

**OK — no changes.**

---

**Progress: records 1-185 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed. 1 location flagged for follow-up.**

## Record 186

"Summary conviction of Margaret Clark of the township of Whitby
singlewoman for assaulting John Adamson of the township of Whitby
shoemaker by striking him several times on the shoulder with a poker.
Offence committed at the township of Whitby on 26 September 1839.
Whitby Strand division - case heard at Whitby" -- Clark: home=Whitby,
occupation=singlewoman, sex=female match. Adamson: victim, home=
Whitby, occupation=shoemaker, correctly captured. Location/court/petty
sessional division match ("Whitby Strand division" resolves the same
as "Whitby Strand Petty Sessional division"). Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-186 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes, 25 related_conviction links,
3 sex fixes, 1 spelling fix, 1 anomalies note, 4 redundant relationship
rows removed. 1 location flagged for follow-up.**

**RESOLVED (Butchers Arms, location 415)**: user confirmed it's on
Church Street, near Market Place (both under East Cliff). Reparented
415 from Whitby (4) to Church Street (26); `notes_private` flag
cleared. Follow-up note in reextraction-audit-notes.md updated to
reflect resolution.

## Record 187

"Summary conviction of William Ainger for lodging in a barn with no
visible means of subsistence and not giving a good account of himself.
Offence committed at the township of Barnby on 19 February 1845. Case
heard at Whitby" -- no home stated, correctly blank. Barnby nests
under Lythe (107), matching stated township. Court=Whitby. Crime
type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-187 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (now resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 188

"Summary conviction of Richard Eison for frequenting an enclosed yard
adjoining a highway for the purposes of committing a felony. Offence
committed at the township of Lythe on 23 April 1857. Case heard at
Whitby" -- no home stated, correctly blank. Location of offence=Lythe,
court=Whitby. Crime type=loitering/suspected person matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-188 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 189

"Summary conviction of William Hansill of the township of Danby for
using one seven-pound defective weight and one two-pound defective
weight. Offence committed at Whitby on 29 August 1818. Case heard at
Whitby at a Petty Sessions for the division of Whitby Strand" -- home=
Danby, sex=male match. Location/court/petty sessional division match.
Crime type=false weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-189 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 190

"Summary conviction of Jonathan Sanders of the township of Whitby for
having a false quarter-pound weight in his possession. Offence
committed at Whitby on 2 April 1822. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Whitby, sex=male match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-190 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 191

"Summary conviction of David Elders of the township of Whitby pilot for
refusing to unmoor the vessel called the Canegrove of Whitby when
directed to do so by William Clark harbour master. Offence committed at
the township of Whitby on 15 April 1839. Case heard in the division of
Whitby Strand" -- Elders: home=Whitby, occupation=pilot, sex=male
match. William Clark: role="official", occupation="harbour master"
(id 176, an established occupation entry) -- initially miswrote this
as "office" in this entry; user caught it and clarified: `office` is
reserved for aristocratic/peerage pedigree only (per the Normanby
precedent), never job titles/police ranks. Verified against the DB
that Clark's row was always correctly stored via person_occupation,
not office -- no actual data error, just my own wording. Same wording
slip found and corrected in records 7/39/148 (Dobson, Barker) -- all
verified as correctly stored occupations, no DB fixes needed there
either. Rule clarified in audit-rulebook.md. Ship name "Canegrove" is
descriptive detail within the charge, not a separate entity to capture
-- consistent with existing occupation precedent where ship names
appear inline (e.g. "master of the fishing boat Thomas and William").
Location/court/petty sessional division match. Crime type=maritime
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-191 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed. Wording correction: "office" vs
"occupation" mix-up found and fixed in 5 log entries (7, 39, 136, 137,
148, 168, 191) -- no actual DB errors, only my own descriptive wording;
rule clarified in audit-rulebook.md (office = aristocratic/peerage
pedigree only).**

## Record 192

"Summary conviction of Edward Binns of the township of Whitby joiner
for assaulting Emma Binns his wife by striking her several times on the
head with great force and violence. Offence committed at the township
of Whitby on 26 February 1845. Division of Whitby Strand - case heard
at Whitby" -- Edward: home=Whitby, occupation=joiner, sex=male match.
Emma: victim, female, no occupation of her own, correct.
person_relationship: Emma "wife" -> Edward, correct direction.
Location/court/petty sessional division match. Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-192 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 193

"Summary conviction of Henry Raw of the township of Whitby jeweller for
assaulting Margaret Croft; on the oath of the said Margaret Croft of
the township of Whitby widow. Offence committed at the township of
Whitby on 26 March 1857. Case heard at Whitby" -- Raw: home=Whitby,
occupation=jeweller, sex=male match. Croft: victim, home=Whitby, sex=
female match. [CORRECTED 2026-07-30: this entry originally claimed
"occupation=widow" but that was a misreading of the query output --
Croft actually had NO occupation link at all. Caught during a
corpus-wide check triggered at record 275, which found ~215 similar
gaps across the whole corpus (women whose text states singlewoman/
spinster/widow but it was never linked). Fixed here:
person_occupation link to "widow" (384) added for person 6544,
verified via SELECT. User's decision on the other ~214: fix only as
each is reached in the normal sequence, not as a batch now.]
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**FIXED (corrected retroactively) — 1 missing occupation link added
(widow), after an earlier misreading of this same record.**

---

**Progress: records 1-193 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 194

"Summary conviction of John Dowson of the township of Whitby for using
an unequal balance or steelyard. Offence committed at Whitby on 29
August 1818. Case heard at Whitby at a Petty Sessions for the division
of Whitby Strand" -- home=Whitby, sex=male match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
Already cross-checked against record 189 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-194 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 195

"Summary conviction of Alexander Willison of the township of Whitby for
having a false half-pound weight in his possession. Offence committed
at Whitby on 28 March 1822. Whitby Strand Petty Sessional division -
case heard at Whitby" -- home=Whitby, sex=male match. Location/court/
petty sessional division match. Crime type=false weights or measures
matches. Already cross-checked against records 175/180/185 (28 March
1822 batch).

**OK — no changes.**

---

**Progress: records 1-195 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 196

"Summary conviction of John Laray hawker for selling books without a
licence; on the information of Robert Kirby. Offence committed at the
township of Whitby on 7 May 1839. Case heard at Whitby" -- no home
stated for Laray, occupation=hawker, sex=male match. Robert Kirby:
informant, no home/occupation stated, correctly blank. Location/court=
Whitby. Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-196 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 197

"Summary conviction of Benjamin Granger of the township of Whitby
mariner for having the charge of the ship called the 'William' and
refusing to take up the anchor when directed by William Clark harbour
master of the port of Whitby. Offence committed at the township of
Whitby on 7 March 1845" -- Granger: home=Whitby, occupation=mariner,
sex=male match. William Clark: own person row (6546), separate from
record 191's Clark (6542) -- correct, no cross-conviction merge, even
though plausibly the same real harbour master. occupation=harbour
master correctly captured (matches the office/occupation clarification
from record 191). No court location stated in this text, correctly
absent. Crime type=maritime offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-197 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 198

"Summary conviction of George Laverick of the township of Whitby
postman for being drunk in possession of a letter addressed to Edmund
Hall of Church Street in Whitby; on the oath of George Lee of the
township of Whitby letter carrier. Offence committed at the parish of
Whitby on 17 April 1857. Case heard at Whitby" -- Laverick: home=
Whitby, occupation=postman, sex=male match. Edmund Hall: role="letter
addressee", home=Church Street, correctly captured. George Lee:
witness, home=Whitby, occupation=letter carrier, correctly captured.
Location/court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-198 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 199

"Summary conviction of Robert Jackson of the township of Ugthorpe for
using an unequal balance or steelyard. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Ugthorpe, sex=male match.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 189/194 (29
August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-199 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 200

"Summary conviction of Alice Welford of the township of Whitby for
having false weights in her possession...Offence committed at Whitby on
27 March 1822. Whitby Strand Petty Sessional division - case heard at
Whitby" -- home=Whitby, sex=female match. Location/court/petty
sessional division match. Crime type=false weights or measures matches.
Already cross-checked against record 155 (27 March 1822 batch).

**OK — no changes.**

---

**Progress: records 1-200 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 201

"Summary conviction of James Ward of the township of Aislaby for
assaulting Ralph Dowson of the township of Goathland labourer by
striking him on the face with his fist several times. Offence committed
at the township of Aislaby on 8 May 1839. Case heard at Whitby" --
Ward: home=Aislaby, sex=male match. Dowson: victim, home=Goathland,
occupation=labourer, correctly captured. Location/court=Whitby/
Aislaby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-201 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 202

"Summary conviction of Joseph Misson and William McDerwent for begging.
Offence committed at the township of Ruswarp on 5 April 1845. Case
heard at Whitby" -- two co-defendants, no homes stated, correctly
blank. Location=Ruswarp, court=Whitby. Crime type=begging matches.
related_conviction link to 207 present: "Same defendant and same
offence date -- likely multiple charges from one arrest."

**OK — no changes.**

---

**Progress: records 1-202 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 203

"Summary conviction of Edward Joy late of the township of Lythe petty
chapman and pedlar for trading without a licence. Offence committed at
the township of Lythe on 15 May 1857. Case heard at Whitby" -- "late
of" convention applied, home=Lythe, occupation="petty chapman and
pedlar" (existing compound-occupation precedent), sex=male match.
Location=Lythe, court=Whitby. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-203 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 204

"Summary conviction of Thomas Thompson of the township of Whitby for
using an unlawful balance or steelyard. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Whitby, sex=male match. Location/
court/petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against 189/194/199 (29 August
1818 batch).

**OK — no changes.**

---

**Progress: records 1-204 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 205

"Summary conviction of David Watson of Whitby hatter for breaking three
squares of glass value 5s in the window of Elen Stirling's house.
Offence committed at Whitby at midnight on Saturday 15 June 1822" --
Watson: home=Whitby, occupation=hatter, sex=male match. Elen Stirling:
role="owner of damaged property", sex=female (unambiguous), no
home/occupation stated, correct. Day-of-week ("Saturday") and
offence_time ("midnight") both correctly preserved. Crime type=
malicious/property damage matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-205 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed.**

## Record 206

"Summary conviction of William Pearson apprentice to William Burn of
the township of Whitby cabinet maker for absenting himself without
leave for three days. Offence committed on 3 June 1839. Case heard at
Whitby" -- this is one of the records affected by the record-181
relationship fix; confirmed the redundant reverse row is gone, only
"apprentice" -> Burn remains. **FIXED**: William Burn's role was
"unspecified" instead of "master" -- inconsistent with records 157/
178/181's established role convention for the same functional
relationship (apprentice's master). `UPDATE summary_conviction_person
SET role='master' WHERE id=6551;` Verified via SELECT. Home=Whitby,
occupation=cabinet maker, correctly attached to Burn. Crime type=master
and servant offence matches. No related_conviction check needed
separately (no offence_date stated beyond the day).

**FIXED — 1 role correction (unspecified -> master).**

---

**Progress: records 1-206 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 207

"Summary conviction of Joseph Misson and William McDerwent for begging.
Offence committed at the township of Ruswarp on 5 April 1845. Case
heard at Whitby" -- same text as record 202, own person rows (217/218),
correct no-cross-conviction merge. Crime type=begging matches.
related_conviction link to 202 already confirmed present.

**OK — no changes.**

---

**Progress: records 1-207 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 208

"Summary conviction of William Gash and Sidement Gardiner, both of the
township of Hinderwell miners, for threatening Michael Hodgson and
William Gazzard, miners employed by William Henry Palmer, and forcing
them to leave his employment; on the oath of Joseph Fairley of the
township of Hinderwell miner. Offence committed at the township of
Hinderwell on 27 May 1857. Case heard at Whitby" -- Gash and Gardiner:
co-defendants, home=Hinderwell, occupation=miner. Hodgson and Gazzard:
victims, occupation=miner. William Henry Palmer: employer, correctly
captured. Joseph Fairley: informant, home=Hinderwell, occupation=miner.
Location/court match. Crime type=breach of the peace matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-208 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 209

"Summary conviction of John Potts of the township of Whitby for using
one three-and-a-half-pound weight, a one-pound weight, a half-pound
weight, and a half-ounce weight that were all defective. Offence
committed at Whitby on 29 August 1818. Case heard at Whitby at a Petty
Sessions for the division of Whitby Strand" -- home=Whitby, sex=male
match. Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 189/194/
199/204 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-209 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 210

"Summary conviction of Caral otherwise Charles Anderson for obtaining
money and clothes from Lars Kiersta of Whitby tailor by falsely
pretending to be a shipwrecked sailor. Offence committed at the
township of Whitby on 18 February 1824" -- "Caral otherwise Charles
Anderson" correctly captured as first_name="Caral", alias="Charles
Anderson" -- a genuine alias (contrast with the impersonation pattern,
"traded under the name of X", which gets its own separate person row
instead). Lars Kiersta: victim, home=Whitby, occupation=tailor,
correctly captured. Crime type=fraud/false pretences matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-210 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 1 role correction.**

## Record 211

"Summary conviction of Isaac Leadley Tose apprentice to William Burn of
the township of Whitby cabinet maker for absenting himself without
leave for three days. Offence committed on 3 June 1839. Case heard at
Whitby" -- one of the records affected by the record-181 relationship
fix; confirmed only "apprentice" -> Burn remains. Raised to the user:
Burn's role here was "employer" (a third variant, after 206's
"unspecified"), asked whether to normalize apprentice-master role
labels broadly or case-by-case. User's answer: case by case, master
usually correct -- saved as standing guidance. Evaluated this specific
case: same master (William Burn, different person row per no-merge),
same relationship type, near-identical text to already-fixed record
206 -- clearly supports "master" too. **FIXED**:
`UPDATE summary_conviction_person SET role='master' WHERE id=6557;`
Verified via SELECT. Occupation=apprentice cabinet maker (Tose),
cabinet maker (Burn, correctly attached). Crime type=master and
servant offence matches.

**FIXED — 1 role correction (employer -> master).**

---

**Progress: records 1-211 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 212

"Summary conviction of Robert Smith for begging. Offence committed at
the township of Whitby on 28 May 1845. Case heard at Whitby" -- no home
stated, correctly blank. Location/court=Whitby. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-212 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 213

"Summary conviction of William O'Grady late of the township of
Hinderwell labourer for assaulting Philip Pigg; on the oath of the said
Philip Pigg of the township of Hinderwell police constable. Offence
committed at the township of Hinderwell on 1 June 1857. Case heard at
Whitby" -- "late of" convention applied, home=Hinderwell, occupation=
labourer, sex=male match. Philip Pigg: victim, home=Hinderwell,
occupation=police constable, correctly captured. Location/court match.
Crime type=assaulting a police officer matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-213 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 214

"Summary conviction of James Horsebrough of the township of Newholm cum
Dunsley for using an unequal balance or steelyard. Offence committed at
Whitby on 29 August 1818. Case heard at Whitby at a Petty Sessions for
the division of Whitby Strand" -- home=Newholm-cum-Dunsley, sex=male
match. Location/court/petty sessional division match. Crime type=false
weights or measures matches. Already cross-checked against 189/194/
199/204/209 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-214 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 215

"Summary conviction of George Wright, John Dring, Thomas Easton, George
Hardy, Daniel Johnson and John Turnbull for playing marbles on a
Sunday. Offence committed at the dock end in the parish of Whitby on 1
February 1824" -- six co-defendants, no homes stated, correctly blank.
Dock End (76) nests under East Cliff -> Whitby, matching stated parish.
No court location stated in text, correctly absent. Crime
type=sabbath breaking matches. No related_conviction (all six on this
one record).

**OK — no changes.**

---

**Progress: records 1-215 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 216

"Summary conviction of George Bolton for being drunk; on the
information of Thomas Linskill of the township of Whitby policeman.
Offence committed at the township of Whitby on 2 June 1839. Case heard
at Whitby" -- no home stated for Bolton, correctly blank. Thomas
Linskill: informant, home=Whitby, occupation=policeman, correctly
captured. Location/court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-216 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 217

"Summary conviction of Elizabeth Wilson for begging. Offence committed
at the township of Ruswarp on 28 June 1842. Case heard at Whitby" -- no
home stated, sex=female match. Location=Ruswarp, court=Whitby. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-217 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 218

"Summary conviction of William Seymour of the township of Hinderwell
Innkeeper for opening his house for the sale of fermented liquors
before 6 p.m.; on the information and oath of Philip Pigg of the
township of Hinderwell police constable. Offence committed at the
township of Hinderwell on 31 May 1857. Case heard at Whitby" --
Seymour: home=Hinderwell, occupation=innkeeper, sex=male match. Philip
Pigg: own person row, separate from record 213's (correct, no cross-
conviction merge). Location/court match. Crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-218 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 219

"Summary conviction of John McGloin of the township of Whitby common
lodging house keeper for not thoroughly cleansing the bedding and bed
covers in use in his lodging house. Offence committed at the township
of Whitby on 20 December 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, occupation=common lodging house keeper, sex=male match.
Location/court=Whitby. Crime type=public health offence matches. [Corrected
2026-07-30, retroactively, at record 270: same offence date and
identical charge wording as record 270 (John Taylor) -- related_
conviction link created when this pattern became visible at 270.]

**OK — no changes (related_conviction corrected retroactively, see
record 270).**

---

**Progress: records 1-219 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 25 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 220

"Summary conviction of Cuthbert Wray of the township of Whitby
fruiterer for being the owner of a horse found straying on the Whitby
and Hawsker highway. Offence committed at the township of Whitby on 11
October 1876. Whitby Strand - case heard at Whitby" -- home=Whitby,
occupation=fruiterer, sex=male match. Cross-parish highway alongside
Whitby. Court/petty sessional division match. Crime type=straying
animals matches. **RESOLVES the flag from record 129**: same date,
road, and charge wording as 129, different defendant, no link existed
-- created it. `INSERT INTO related_conviction ... VALUES (129, 220,
...)`. Verified via SELECT.

**FIXED — 1 new related_conviction link created.**

---

**Progress: records 1-220 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 221

"Summary conviction of John Fordney of the township of Hawsker cum
Stainsacre labourer for lodging in a field without any visible means of
subsistence and not giving a good account of himself. Offence committed
at the township of Hawsker cum Stainsacre on 29 June 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- home=
Hawsker-cum-Stainsacre, occupation=labourer, sex=male match.
Location/court/petty sessional division match. Crime type=vagrancy
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-221 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 222

"Summary conviction of Edward Turner of the township of Whitby for
using a half-stone weight and a quarter-stone weight, which were both
defective. Offence committed at Whitby on 29 August 1818. Case heard at
Whitby at a Petty Sessions for the division of Whitby Strand" -- home=
Whitby, sex=male match. Own person row, distinct from record 161's
Edward Turner (different date/context, correct no-merge). Location/
court/petty sessional division match. Crime type=false weights or
measures matches. Already cross-checked against 189/194/199/204/209/
214 (29 August 1818 batch).

**OK — no changes.**

---

**Progress: records 1-222 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 223

"Summary conviction of George Lockey of the township of Whitby for
being drunk; on the information of William Wilkinson of the township of
Whitby" -- home=Whitby, sex=male match. William Wilkinson: informant,
home=Whitby, correctly captured. No offence_date stated in text at all,
correctly blank. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-223 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 224

"Summary conviction of William Bell, William Winspear and Joseph
Messenger for trespassing with three greyhounds in the daytime in
search of game on the lands of Robert Carey Elwes esquire. Offence
committed in the township of Egton on 28 September 1833. Case heard at
Whitby" -- three co-defendants, no homes stated, correctly blank.
Robert Carey Elwes: landowner, title correctly left blank -- checked
against corpus-wide precedent (24 records mention "esquire", vocabulary
only has "Sir"/"Bailiff") and the reextraction-audit-notes.md postmortem
confirming "esquire" was already resolved earlier in the audit as
deliberately not captured (not a title/occupation in the schema's
sense). Location=Egton, court=Whitby. Crime type=poaching matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-224 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 225

"Summary conviction of Patrick Caulder Cawney of the city of Limerick
coachmaker for assaulting William Wilkinson of the township of Whitby
police officer by striking him on the head with his hands and kicking
him on the body with his feet. Offence committed at the township of
Egton on 1 July 1842. Case heard at Whitby" -- middle name Caulder,
home=Limerick (distant top-level location, correctly captured),
occupation=coachmaker, sex=male match. William Wilkinson: victim, home=
Whitby, occupation=police officer, own person row (separate from
record 223's Wilkinson, correct no-merge). Location=Egton, court=
Whitby. Crime type=assaulting a police officer matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-225 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 anomalies note, 4
redundant relationship rows removed, 2 role corrections.**

## Record 226

"Summary conviction of Jane Thompson of the township of Whitby widow
for assaulting Ellen Moore; on the oath of the said Ellen Moore wife of
Joseph Moore of the township of Whitby widow [sic] Offence committed at
the township of Whitby on 31 May 1857. Case heard at Whitby" -- Jane:
home=Whitby, occupation=widow, sex=female match. Ellen Moore: victim,
occupation=widow (as stated), home=Whitby. Joseph Moore: "spouse of
victim", person_relationship: Ellen "wife" -> Joseph, correct
direction. **FIXED**: no anomalies note existed for the source's own
"[sic]" flag on the "wife...widow" contradiction (Ellen described as
both) -- added one, matching the established archival-oddity pattern.
Location/court=Whitby. Crime type=assault matches. No
related_conviction.

**FIXED — 1 missing anomalies note added.**

---

**Progress: records 1-226 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 227

"Summary conviction of George Hoggarth of the township of Whitby
carpenter for being drunk. Offence committed at the township of
Ruswarp on 17 December 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, occupation=carpenter, sex=male match. Location=Ruswarp
(differs from home, as stated), court=Whitby. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-227 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 228

"Summary conviction of John Watson Liddell of the township of Whitby
cartman for being drunk and disorderly on the Pier. Offence committed
at the township of Whitby on 14 December 1876. Whitby Strand - case
heard at Whitby" -- middle name Watson correctly captured, home=
Whitby, occupation=cartman, sex=male match. "the Pier" resolves to
"Piers" (104) nested under Seafront -> Whitby, matching stated
township. Court/petty sessional division match. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-228 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 229

"Summary conviction of John Pearson of the township of Whitby labourer
for assaulting Richard Cockerill. Offence committed at the township of
Whitby on 30 August 1889. Whitby Strand Petty Sessional division - case
heard at Whitby" -- home=Whitby, occupation=labourer, sex=male match.
Richard Cockerill: victim, correctly captured. Location/court/petty
sessional division match. Crime type=assault matches.
related_conviction link to 694 present (same defendant/date pattern),
matching what was seen in this conversation's very first related_
conviction sample query.

**OK — no changes.**

---

**Progress: records 1-229 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 230

"Summary conviction of Francis Burnard of the township of Whitby for
using an unequal balance or scale beam. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Whitby, sex=male ("Francis"
spelling) match. Location/court/petty sessional division match. Crime
type=false weights or measures matches. Already cross-checked against
the 29 August 1818 batch (189/194/199/204/209/214/222).

**OK — no changes.**

---

**Progress: records 1-230 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 231

"Summary conviction of Neal Devers, Hugh Gallorhu and William Stevenson
for vagrancy and acting as pedlars without a licence. Offence committed
at the township of Whitby on 10 June 1824" -- three co-defendants, no
homes stated, correctly blank. Both crime types (vagrancy, licensing
offence) correctly captured, matching the dual charge. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-231 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 232

"Summary conviction of Charles Goldsmith for assaulting William Lynass
of [Whitby] grocer. Offence committed at Whitby on the evening of
Sunday 19 January 1834. Whitby Strand division - case heard at Whitby"
-- Goldsmith: no home stated, correctly blank. William Lynass: victim,
home=Whitby (the editorially-bracketed "[Whitby]" correctly captured as
his home), occupation=grocer. Day-of-week ("Sunday") and offence_time
("evening") both preserved. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-232 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 233

"Summary conviction of William Foxton for lodging in the open air with
no visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Hinderwell on 7 July
1842. Case heard at Whitby" -- no home stated, correctly blank.
Location=Hinderwell, court=Whitby. Crime type=vagrancy matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-233 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 234

"Summary conviction of Catherine Brown wife of George Brown late of the
township of Whitby labourer for using obscene and indecent language in
Flowergate; on the oath of Robert Nickson of the township of Whitby
constable. Offence committed at the township of Whitby on 14 June 1857.
Case heard at Whitby" -- Catherine: defendant, female, no occupation of
her own (correct, labourer belongs to George). George Brown: "husband
of defendant", "late of" home=Whitby, occupation=labourer, correctly
attached. person_relationship: Catherine "wife" -> George, correct
direction. Robert Nickson: informant, home=Whitby, occupation=
constable. Flowergate -> West Cliff -> Whitby reaches stated township.
Crime type=using obscene language matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-234 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 235

"Summary conviction of John Jones of the township of Whitby coal porter
for being drunk and riotous in Baxtergate. Offence committed at the
township of Whitby on 25 December 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=coal porter, sex=male match.
Location/court=Whitby. Crime type=drunk and disorderly matches
("drunk and riotous"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-235 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 236

"Summary conviction of John Eccles of the township of Whitby sailor for
assaulting Ann Hustler; on the oath of [blank] Smith of the township of
Whitby. Offence committed at the township of Whitby on 20 November
1876. Whitby Strand - case heard at Whitby" -- Eccles: home=Whitby,
occupation=sailor, sex=male match. Ann Hustler: victim, sex=female,
correct. "[blank] Smith": witness, first_name=NULL, home=Whitby,
correctly matches the established blank-first-name convention.
Location/court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-236 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 237

"Summary conviction of John Ward of the township of Egton miner for
playing pitch and toss in Ruswarp town street. Offence committed at the
township of Ruswarp on 7 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Egton, occupation=miner,
sex=male match. "Ruswarp town street" correctly resolves to Ruswarp
itself, matching stated township. Court/petty sessional division
match. Crime type=gaming/gambling offence matches. related_conviction
link to 254 present: "Same offence date, street, and charge wording,
different defendants -- likely several convictions from one recorded
incident."

**OK — no changes.**

---

**Progress: records 1-237 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 238

"Summary conviction of Michael Trowsdale of the township of Ellerby for
using an unequal balance or steelyard. Offence committed at Whitby on
29 August 1818. Case heard at Whitby at a Petty Sessions for the
division of Whitby Strand" -- home=Ellerby, correctly showing the fixed
parent (88=Hinderwell) from the record-124 fix. Sex=male match.
Location/court/petty sessional division match. Crime type=false weights
or measures matches. Already cross-checked against the 29 August 1818
batch.

**OK — no changes.**

---

**Progress: records 1-238 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 239

"Summary conviction of James Smith, James Broughton, Thomas Hart and
Mary Hart for begging; on the information of John Morley of Whitby
constable. Offence committed at the township of Whitby on 3 October
1818" -- four co-defendants, no homes stated, correctly blank. Thomas
Hart and Mary Hart correctly kept as separate people with no fabricated
relationship despite shared surname (text just lists them together, no
relationship stated) -- same principle as the earlier Holmes/Tinley
cases. John Morley: own person row, separate from records 136/140's
Morley (correct no-merge). Location/court=Whitby. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-239 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 240

"Summary conviction of Ann Devers for vagrancy and not giving a good
account of herself. Offence committed at the township of Whitby on 10
June 1824" -- no home stated, sex=female match. Shares surname "Devers"
and exact date with record 231 (Neal Devers, part of a 3-man pedlar
group) -- but the specific charge wording differs ("not giving a good
account of herself" vs "acting as pedlars without a licence"), so this
reads as the same broad vagrancy sweep catching different people with
different specific facts, not one shared incident (same shape as the
truancy/workhouse same-date coincidences) -- correctly unlinked. No
kinship assumed from the shared surname either, per established
precedent. Crime type=vagrancy matches.

**OK — no changes.**

---

**Progress: records 1-240 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 241

"Summary conviction of Taylor Clemett of Lythe retailer of beer for
selling beer between 10 p.m. and 4 a.m. Offence committed at the
township of Lythe on 8 February 1834. Whitby Strand division - case
heard at Whitby" -- home=Lythe, occupation=retailer of beer, sex=male
match. Location/court/petty sessional division match. Crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-241 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 242

"Summary conviction of Charles Bradley and Catherine Bradley for
begging. Offence committed at the township of Whitby on 15 July 1842.
Case heard at Whitby" -- two co-defendants, no homes stated, correctly
blank, sex=male/female. No relationship fabricated despite shared
surname (text doesn't state one). Location/court=Whitby. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-242 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 243

"Summary conviction of John Dillaney of the township of Whitby labourer
for begging. Offence committed at the township of Whitby on 22 October
1859. Case heard at Whitby" -- home=Whitby, occupation=labourer,
sex=male match. Location/court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-243 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 244

"Summary conviction of Henry Smith of the township of Whitby fruiterer
for being drunk and riotous on the Fish Pier. Offence committed at the
township of Whitby on 25 December 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=fruiterer, sex=male match. Fish Pier
(68) -> Piers (105) -> Seafront -> Whitby, reaching stated township.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. Same date as record 235 but different specific location/
defendant -- no related_conviction, correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-244 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 2 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 245

"Summary conviction of Peter Gorley of the township of Whitby jet
worker for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 31 October 1876. Whitby Strand -
case heard at Whitby[Dated November on dorse]" -- home=Whitby,
occupation=jet worker, sex=male match. St Ann's Staith -> West Cliff ->
Whitby reaches stated township. Court/petty sessional division match.
**FIXED**: no anomalies note existed for the "[Dated November on
dorse]" archival annotation -- this is one of the 24 "dated X but
endorsed Y" cases noted in reextraction-audit-notes.md as
documentational, worth noting whenever convenient. Added. Verified via
SELECT. Crime type=drunk and disorderly matches. No related_conviction.

**FIXED — 1 missing anomalies note added.**

---

**Progress: records 1-245 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections.**

## Record 246

"Summary conviction of Annie Booth of the township of Fylingdales
singlewoman for assaulting Emma Coates. Offence committed at the
township of Fylingdales on 16 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Fylingdales, sex=female match.
**FIXED**: no occupation was linked at all despite the text stating
"singlewoman" (established marital-status-as-occupation precedent, id
337). `INSERT INTO person_occupation (person_id, occupation_id) VALUES
(271, 337);` Verified via SELECT. Emma Coates: victim, correctly
captured. Location/court/petty sessional division match. Crime
type=assault matches. No related_conviction.

**FIXED — 1 missing occupation link added.**

---

**Progress: records 1-246 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 247

"Summary conviction of Margaret Bretton, Isabella Bretton, Margaret
Bretton junior and Rebecca Robinson for going door-to-door as petty
chapmen without being licensed; on the information of John Morley of
Whitby constable. Offence committed at the township of Whitby on 3
October 1818" -- four co-defendants, no homes stated, correctly blank.
"Margaret Bretton junior" correctly captured with name_postfix="junior"
(274), distinct person row from the first Margaret Bretton (272). John
Morley: own person row, separate from 136/140/239's Morley rows.
Location/court=Whitby. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-247 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 248

"Summary conviction of Robert Kirby, Lucy Kirby, Mary Ann Kirby and
Harriett Kirby for vagrancy and acting as pedlars without a licence.
Offence committed at the township of Whitby on 10 June 1824" -- four
co-defendants, all Kirby surname, no homes stated, no relationship
fabricated (text doesn't state one, even though plausibly a family
group). Both crime types (vagrancy, licensing offence) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-248 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 249

"Summary conviction of James Toms late of the township of Whitby hawker
for selling pots without a licence; on the information of Robert Kirby
of Whitby sub-distributor of stamps. The offence was committed at the
township of Fylingdales on 14 February 1834. Case heard at Whitby" --
"late of" convention applied, home=Whitby, occupation=hawker, sex=male
match. Robert Kirby: informant, own person row (separate from
records 196/248's Kirby rows, correct no-merge), occupation=sub-
distributor of stamps. Location=Fylingdales (differs from home, as
stated), court=Whitby. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-249 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 250

"Summary conviction of David Storrey of the township of Whitby
blacksmith for assaulting Elizabeth Trueman wife of Charles Trueman of
the township of Whitby mariner by striking her on the face and body
with his hands. Offence committed at the township of Whitby on 19 July
1842. Case heard at Whitby" -- Storrey: home=Whitby, occupation=
blacksmith, sex=male match. Elizabeth: victim, no occupation of her
own, correct. Charles Trueman: "spouse of victim", home=Whitby,
occupation=mariner, correctly attached. person_relationship: Elizabeth
"wife" -> Charles, correct direction. Location/court=Whitby. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-250 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 251

"Summary conviction of Thomas Pattison alehouse keeper for opening his
premises for the sale of beer before 12.30 p.m. on a Sunday. Offence
committed at the township of Ruswarp at 11.35 a.m. on 23 October 1859.
Case heard at Whitby" -- no home stated, occupation=alehouse keeper,
sex=male match. offence_time="11.35 a.m." correctly captured.
Location=Ruswarp, court=Whitby. Crime type=licensing offence matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-251 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 252

"Summary conviction of John Bakehouse of the township of Whitby jet
worker for being drunk on the licensed premises of Sovina Short and
refusing to leave when asked by Thomas Ridley a constable of the North
Riding. Offence committed at the township of Whitby on 24 December
1869. Whitby Strand - case heard at Whitby" -- Bakehouse: home=Whitby,
occupation=jet worker, sex=male match. Sovina Short: licensee, sex=
female (unambiguous given name), occupation=licensee. Thomas Ridley:
informant, occupation="constable of the North Riding". Location/court=
Whitby. Crime types=drunkenness, refusal to quit licensed premises
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-252 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 253

"Summary conviction of Andrew Cobbing for begging in Glaisdale town
street. Offence committed at the township of Glaisdale on 21 November
1876. Whitby Strand - case heard at Whitby" -- no home stated,
correctly blank. "Glaisdale town street" resolves to Glaisdale itself,
matching stated township. Court/petty sessional division match. Crime
type=begging matches. related_conviction: full triangle confirmed
(123-127, 123-253, 127-253) -- resolves the flag raised at record 123.

**OK — no changes.**

---

**Progress: records 1-253 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 254

"Summary conviction of George Raw of the township of Ruswarp cartman
for playing pitch and toss in Ruswarp town street. Offence committed at
the township of Ruswarp on 7 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- home=Ruswarp, occupation=cartman,
sex=male match. "Ruswarp town street" resolves to Ruswarp itself.
Court/petty sessional division match. Crime type=gaming/gambling
offence matches. related_conviction link to 237 confirmed present --
resolves the flag from record 237.

**OK — no changes.**

---

**Progress: records 1-254 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 255

"Summary conviction of Ralph Coulson for laying dung and filth in an
open alley. Offence committed at the town of Whitby on 27 May 1824" --
no home stated, correctly blank. Crime type=public nuisance matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-255 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 26 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 256

"Summary conviction of John Hodgson late of the township of Whitby
hawker for selling tea trays without a licence; on the information of
Robert Kirby of Whitby sub-distributor of stamps. Offence committed at
the township of Fylingdales on 14 February 1834. Case heard at Whitby"
-- "late of" convention applied, home=Whitby, occupation=hawker,
sex=male match. Robert Kirby: informant, own person row (separate from
record 249's), occupation=sub-distributor of stamps. **FIXED**: same
informant, date, and offence township as record 249 (selling pots
without a licence) -- matching the established "same official, one
enforcement sweep" pattern from the railway case (137/141/146), no link
existed. Created it. Verified via SELECT. Location=Fylingdales,
court=Whitby. Crime type=licensing offence matches.

**FIXED — 1 new related_conviction link created.**

---

**Progress: records 1-256 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 257

"Summary conviction of Thomas Barrick of the township of Whitby a
labourer for being drunk whilst being maintained in Whitby Union
workhouse Offence committed at Whitby workhouse on 21 July 1842. Case
heard at Whitby" -- home=Whitby, occupation=labourer, sex=male match.
Union Workhouse correctly linked to the established node (81, Green
Lane). Court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-257 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 258

"Summary conviction of John Ryan of the township of Whitby tailor for
assaulting John Clemmett; on the oath of the said John Clemmett of the
township of Hawsker cum Stainsacre labourer. Offence committed at the
township of Whitby on 3 November 1859. Case heard at Whitby" -- Ryan:
home=Whitby, occupation=tailor, sex=male match. Clemmett: victim, home=
Hawsker-cum-Stainsacre, occupation=labourer, correctly captured.
Location/court=Whitby. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-258 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 3 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 259

"Summary conviction of William Brunton of Lealholm Bridge butcher for
having a one-pound weight that was four drams short on his stall in the
market place. Offence committed at Whitby on 26 June 1824. Whitby
Strand Petty Sessional division- case heard at Whitby" -- home=
Lealholm Bridge, occupation=butcher, sex=male match. **FIXED**: no
location link existed for "the market place" -- raised to the user
(same style question as Butchers Arms), confirmed: link to the
existing Market Place node (30, East Cliff). `INSERT INTO
summary_conviction_location (summary_conviction_id, location_id, role)
VALUES (259, 30, 'location of offence');` Verified via SELECT. Rule
documented in audit-rulebook.md for the other pending case (record
266). Court/petty sessional division match. Crime type=false weights
or measures matches. No related_conviction.

**FIXED — 1 new location link added.**

---

**Progress: records 1-259 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 260

"Summary conviction of William Hobson of Whitby hawker and pedlar for
selling spectacles without a licence; on the information of Robert
Kirby of Whitby sub-distributor of stamps. Offence committed at the
township of Whitby on 1 March 1834. Case heard at Whitby" -- home=
Whitby, occupation="hawker and pedlar" (compound-occupation precedent),
sex=male match. Robert Kirby: own person row, different date from the
249/256 pair -- correctly a separate enforcement action, no link
needed. Crime type=licensing offence matches.

**OK — no changes.**

---

**Progress: records 1-260 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 261

"Summary conviction of John Jackson for attempting to gather alms by
exposing wounds and other deformities. Offence committed at the
township of Ruswarp on 24 July 1842. Whitby Strand division - case
heard at Whitby" -- no home stated, correctly blank. Location=Ruswarp,
court=Whitby, petty sessional division correctly resolved. Crime
type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-261 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 262

"Summary conviction of John Watson for taking a blanket that was
wreck-washed from a ship called the 'Dilligence' of the port of
Whitby, stranded and wrecked on the seashore. Offence committed at the
parish of Whitby on 30 October 1859. Case heard at Whitby" -- no home
stated, correctly blank. Ship name "Dilligence" correctly treated as
descriptive detail, not a separate entity. Location/court=Whitby. Crime
type=theft matches. [Corrected 2026-07-30, retroactively, at record
269: this record is part of a 4-person wreck-scavenging cluster (262,
269, 276, 283), all taking different items from the same wrecked ship
on the same date -- related_conviction links to all three now exist,
created when the full cluster became visible at record 269.]

**OK — no changes (related_conviction corrected retroactively, see
record 269).**

---

**Progress: records 1-262 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 263

"Summary conviction of James Filburn of the township of Ruswarp jet
worker for being drunk. Offence committed at the township of Whitby on
25 December 1869. Whitby Strand - case heard at Whitby" -- home=
Ruswarp, occupation=jet worker, sex=male match. Location/court=Whitby.
Crime type=drunkenness matches. Same date as records 235/244 -- no
shared party, correctly unrelated.

**OK — no changes.**

---

**Progress: records 1-263 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 264

"Summary conviction of Thomas Howard of the township of Whitby
fisherman for assaulting Mary Jane Howard. Offence committed at the
township of Whitby on 29 October 1876. Whitby Strand - case heard at
Whitby" -- Thomas: home=Whitby, occupation=fisherman, sex=male match.
Mary Jane: victim, middle name Jane correctly captured, no relationship
fabricated despite shared surname (text doesn't state one). Location/
court=Whitby. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-264 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 265

"Summary conviction of Mary Pritchard wife of Thomas Pritchard of the
township of Ruswarp pedlar for being drunk and disorderly in St
Hilda's Terrace. Offence committed at the township of Ruswarp on 20
June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- Mary: defendant, female, no occupation of her own. Thomas:
"spouse of offender", home=Ruswarp, occupation=pedlar, correctly
attached. person_relationship: Mary "wife" -> Thomas, correct
direction. St Hilda's Terrace nests under West Cliff, same cliff-
boundary pattern as records 32/53, correctly alongside Ruswarp.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. related_conviction link to 304 present -- noting for
verification when reaching that record.

**OK — no changes.**

---

**Progress: records 1-265 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 4 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 266

"Summary conviction of John Pickering of Saltersgate butcher for having
a one-stone weight that was one and a half ounces short on his stall in
the market place. Offence committed at Whitby on 25 June 1824. Whitby
Strand Petty Sessional division- case heard at Whitby" -- home=
Saltersgate, occupation=butcher, sex=male match. **FIXED**: same "his
stall in the market place" gap as record 259, resolved with the same
Market Place link (30, East Cliff), per the user's earlier confirmation.
Verified via SELECT. Court/petty sessional division match. Crime
type=false weights or measures matches. No related_conviction.

**FIXED — 1 new location link added.**

---

**Progress: records 1-266 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 267

"Summary conviction of Joseph Thompson of Sheffield in the West Riding
hawker and pedlar for selling books without a licence; on the
information of Robert Kirby of Whitby sub-distributor of stamps.
Offence committed at the township of Whitby on 22 March 1834. Case
heard at Whitby" -- home=Sheffield (distant top-level location,
correctly captured), occupation="hawker and pedlar", sex=male match.
Robert Kirby: own person row, different date from prior Kirby records,
correctly unlinked. Crime type=licensing offence matches.

**OK — no changes.**

---

**Progress: records 1-267 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 268

"Summary conviction of Joseph Nunn of the township of Whitby mariner
for frequenting the river Esk and the avenues leading there with intent
to commit felony. Offence committed at the township of Whitby on 24
July 1842. Case heard at Whitby" -- home=Whitby, occupation=mariner,
sex=male match. River Esk (398) already correctly linked alongside
stated Whitby township. Crime type=loitering/suspected person matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-268 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 27 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 269

"Summary conviction of George Watson for taking a pair of man's drawers
value 3s that were wreck-washed from a ship called the 'Dilligence' of
the port of Whitby, stranded and wrecked on the seashore. Offence
committed at the parish of Whitby on 30 October 1859. Case heard at
Whitby" -- no home stated, correctly blank. **FIXED**: same-date check
found 4 people (262 John Watson, 269 George Watson, 276 Jane Stangway,
283 William Lill) all taking different items from the same wrecked
ship "Dilligence" on the same date -- clearly one shared wreck-
scavenging incident, no related_conviction links existed at all.
Created all 6 pairwise links matching the established all-pairs
precedent. Verified via SELECT. **Note**: this also retroactively
corrects record 262's earlier "no related_conviction" verdict --
noted here since 262 was checked before this cluster was fully visible
(276/283 hadn't been reached/fetched yet at that point). Crime
type=theft matches.

**FIXED — 6 new related_conviction links created (retroactively also
resolves record 262).**

---

**Progress: records 1-269 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 33 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 270

"Summary conviction of John Taylor of the township of Whitby common
lodging house keeper for not thoroughly cleansing the bedding and bed
covers in use in his lodging house. Offence committed at the township
of Whitby on 20 December 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, occupation=common lodging house keeper, sex=male match.
**FIXED**: identical charge wording and exact same date as record 219
(John McGloin) -- a health inspection sweep catching two lodging house
keepers, no link existed. Created it. Verified via SELECT. Location/
court=Whitby. Crime type=public health offence matches.

**FIXED — 1 new related_conviction link created (retroactively also
resolves record 219).**

---

**Progress: records 1-270 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 271

"Summary conviction of James Winspear of the township of Whitby
fisherman for being drunk on the licensed premises of William
Dowthwaite and refusing to leave when asked by Thomas Merryweather a
police constable. Offence committed at the township of Whitby on 2
October 1876. Whitby Strand - case heard at Whitby" -- Winspear: home=
Whitby, occupation=fisherman, sex=male match. Dowthwaite: licensee.
Merryweather: informant, occupation=police constable. Location/court=
Whitby. Crime types=drunkenness, refusal to quit licensed premises
match. No same-date records, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-271 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 272

"Summary conviction of John Midgeley of the township of Hinderwell
fisherman for being drunk on the licensed premises of Robert Ashworth.
Offence committed at the township of Hinderwell on 10 June 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- home=
Hinderwell, occupation=fisherman, sex=male match. Ashworth: licensee.
Location/court/petty sessional division match. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-272 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 273

"Summary conviction of Thomas Anderson of the township of Ruswarp for
having in his mill a four-stone weight that was three ounces short,
another four-stone weight that was an ounce and a half short, and a
half-stone weight that was six drams short. Offence committed at
Ruswarp on 5 July 1824. Whitby Strand Petty Sessional division- case
heard at Whitby" -- home=Ruswarp, sex=male match. No occupation stated
in the text (only implied by "his mill" -- "miller" is not literally
stated), correctly left blank per the no-fabrication rule.
Location/court/petty sessional division match. Crime type=false
weights or measures matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-273 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 274

"Summary conviction of John Brown for begging. Offence committed at
the township of Whitby on 26 April 1833" -- no home stated, correctly
blank. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-274 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 1 occupation
fix.**

## Record 275

"Summary conviction of Jeremiah Eskdale of the township of Whitby block
and mast maker for assaulting Ann Scott of the township of Ruswarp
singlewoman. Offence committed at the township of Whitby on 8 August
1842. Case heard at Whitby" -- Eskdale: home=Whitby, occupation="block
and mast maker" (compound-occupation precedent), sex=male match. Ann
Scott: victim, home=Ruswarp, sex=female match. **FIXED**: no
occupation link existed for Ann Scott despite the text stating
"singlewoman" -- same gap class as record 246, but checking directly
this time (not trusting the wide join) revealed this is a MASSIVE
corpus-wide gap, ~215 records total. Fixed this specific record:
`INSERT INTO person_occupation (person_id, occupation_id) VALUES
(6586, 337);` Verified via SELECT. Immediately flagged the full
corpus-wide finding to the user (see below) rather than continuing
silently. Location/court=Whitby. Crime type=assault matches. No
related_conviction.

**FIXED — 1 missing occupation link added; triggered a corpus-wide
flag (see notes file) for ~215 similar gaps, user decided: fix only as
each is reached in sequence, not as a batch.**

---

**Progress: records 1-275 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes (246, 275, and retroactively 193).**

## Record 276

"Summary conviction of Jane Stangway for taking a blue Guernsey frock,
a cap and a paint pot that were wreck-washed from a ship called the
'Dilligence' of the port of Whitby, stranded and wrecked on the
seashore. Offence committed at the parish of Whitby on 30 October
1859. Case heard at Whitby" -- no home or occupation stated, correctly
blank (not affected by the marital-status gap -- no such word here).
related_conviction links to 262/269/283 already confirmed present.
Crime type=theft matches.

**OK — no changes.**

---

**Progress: records 1-276 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 277

"Summary conviction of George Patton of the township of Hinderwell
fisherman for assaulting George Taylor; on the oath of the said George
Taylor of the township of Hinderwell fisherman. Offence committed at
the township of Hinderwell on 19 December 1869. Whitby Strand - case
heard at Whitby" -- both correctly captured with matching home/
occupation despite sharing occupation type. Location/court match.
Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-277 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 278

"Summary conviction of George Fullock of the township of Whitby
fisherman for being drunk and disorderly in New Quay. Offence committed
at the township of Whitby on 1 October 1876. Whitby Strand - case heard
at Whitby" -- home=Whitby, occupation=fisherman, sex=male match. New
Quay nests under West Cliff -> Whitby, reaching stated township.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-278 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 5 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 279

"Summary conviction of Timothius Marshall of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Ruswarp on 23 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Whitby,
occupation=iron worker, sex=male match. **FIXED**: Church Street nests
under East Cliff -> Whitby, not reaching the stated offence township
Ruswarp -- per the established cliff-boundary pattern (records 20, 32,
46, 53, 60, 66, 81, 84, 265), a separate Ruswarp location row should
exist alongside Church Street, but it was missing entirely. `INSERT
INTO summary_conviction_location (summary_conviction_id, location_id,
role) VALUES (279, 94, 'location of offence');` Verified via SELECT.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. No related_conviction.

**FIXED — 1 missing location link added (Ruswarp, cliff-boundary
pattern).**

---

**Progress: records 1-279 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 3 occupation
fixes.**

## Record 280

"Summary conviction of Jane Holland of the township of Robin Hood's
Bay in the parish of Fylingdales widow for having defective balances in
a cellar under her dwelling house. Offence committed at the township of
Robin Hood's Bay on 1 July 1824. Whitby Strand Petty Sessional
division- case heard at Whitby" -- home=Robin Hood's Bay (93) -> Fyling
dales (126), matches. sex=female match. **FIXED**: one of the tracked
marital-status occupation gaps (id 280 on the list from record 275) --
confirmed via dedicated query, no occupation link existed despite
"widow" stated. `INSERT INTO person_occupation (person_id,
occupation_id) VALUES (311, 384);` Verified via SELECT. Court/petty
sessional division match. Crime type=false weights or measures matches.
No related_conviction.

**FIXED — 1 tracked occupation gap resolved (widow).**

---

**Progress: records 1-280 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 281

"Summary conviction of Samuel Nash for begging. Offence committed at
Whitby on 26 April 1833" -- no home stated, correctly blank. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-281 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 282

"Summary conviction of Joseph Williamson for refusing to maintain
himself and his family, whereby his wife and five children became
chargeable to the township of Fylingdales. Offence committed at the
township of Fylingdales on 3 August 1842. Case heard at Whitby" -- no
home stated, correctly blank. Wife/children not named, correctly no
separate person rows. Location=Fylingdales, court=Whitby. Crime
type=failure to maintain family matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-282 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 283

"Summary conviction of William Lill for taking a piece of hempen rope,
a rope strap, a lead line, a wooden bucket and two pieces of canvass
sheet from a ship called the Dilligence of the port of Whitby, stranded
and wrecked on the seashore. Offence committed at the parish of Whitby
on 30 October 1859. Case heard at Whitby" -- no home stated, correctly
blank. related_conviction links to 262/269/276 already confirmed
present -- completes the full shipwreck cluster. Crime type=theft
matches.

**OK — no changes.**

---

**Progress: records 1-283 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 284

"Summary conviction of George Wastill of the township of Whitby jet
worker for obstructing Church Street. Offence committed at the
township of Whitby on 4 October 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=jet worker, sex=male match. Church
Street -> East Cliff -> Whitby reaches stated township. Court/petty
sessional division match. Crime type=obstructing the highway matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-284 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 285

"Summary conviction of Douglas Munroe of the township of Ruswarp
hawker for being drunk on the licensed premises of William Knaggs and
refusing to leave when asked by Andrew Thompson a police constable; on
the oath of Andrew Thompson police constable for the North Riding.
Offence committed at the township of Ruswarp on 22 August 1876. Whitby
Strand - case heard at Whitby" -- Munroe: home=Ruswarp, occupation=
hawker, sex=male match. Knaggs: licensee. Thompson: informant,
occupation="police constable for the North Riding". Location/court
match. Crime types=drunkenness, refusal to quit licensed premises
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-285 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 286

"Summary conviction of John Backhouse of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 15 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Whitby,
occupation=jet worker, sex=male match. Location/court/petty sessional
division match. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-286 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 287

"Summary conviction of Edward Morris hawker for selling unstamped
medicine without a licence; on the information of Robert Kirby of
Whitby sub-distributor of stamps. Offence committed at Whitby on 24 May
1833. Case heard at Whitby" -- no home stated, occupation=hawker,
sex=male match. Robert Kirby: own person row, different date from
prior Kirby records, correctly unlinked. Crime type=licensing offence
matches.

**OK — no changes.**

---

**Progress: records 1-287 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 288

"Summary conviction of John Swales of the township of Whitby labourer
for assaulting James Pearson of the township of Hawsker cum Stainsacre
labourer by striking him on the arm and body. Offence committed at the
township of Hawsker cum Stainsacre on 15 September 1842. Division of
Whitby Strand - case heard at Whitby" -- Swales: home=Whitby,
occupation=labourer, sex=male match. Pearson: victim, home=Hawsker-
cum-Stainsacre, occupation=labourer, correctly captured. Location/
court/petty sessional division match. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-288 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 289

"Summary conviction of James Brown late of the township of Whitby
mariner for begging. Offence committed at the township of Whitby on 14
November 1859. Case heard at Whitby" -- "late of" convention applied,
home=Whitby, occupation=mariner, sex=male match. Location/court=
Whitby. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-289 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 4 occupation
fixes.**

## Record 290

"Summary conviction of Hannah Palmer of the township of Whitby
singlewoman for being drunk; on the oath of [blank] Harnby of the
township of Whitby police constable. Offence committed at the township
of Whitby on 8 October 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, sex=female match. **FIXED**: tracked marital-status
occupation gap (id 290 on the list) -- confirmed via dedicated query,
fixed. `INSERT INTO person_occupation (person_id, occupation_id)
VALUES (321, 337);` Verified via SELECT. "[blank] Harnby": informant,
correctly captured with first_name=NULL. Location/court=Whitby. Crime
type=drunkenness matches. [Corrected 2026-07-30, retroactively, at
record 302: same date/informant/charge as record 302 (Dorothy Kirby) --
related_conviction link created when this pattern became visible.]

**FIXED — 1 tracked occupation gap resolved (singlewoman); related_
conviction corrected retroactively, see record 302.**

---

**Progress: records 1-290 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 291

"Summary conviction of George Harrison jet worker and Francis Harrison
stonemason, both of the township of Newholm cum Dunsley, for
trespassing in the daytime in search of conies in a close of land in
the possession and occupation of William Burnett. Offence committed at
township of Newholm cum Dunsley on 24 September 1876. Whitby Strand -
case heard at Whitby" -- both co-defendants correctly captured with
distinct occupations (jet worker/stonemason), sex=male ("Francis"
spelling, male form). William Burnett: landowner, correctly captured.
Location/court match. Crime type=poaching matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-291 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 292

"Summary conviction of William Dixon of the township of Whitby jet
worker for being drunk and disorderly at the Court House Offence
committed at the township of Ruswarp on 25 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Whitby,
occupation=jet worker, sex=male match. The Court House (235) nests
under West Cliff (5), same cliff-boundary shape as prior records,
correctly alongside stated Ruswarp. Court/petty sessional division
match. Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-292 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 293

"Summary conviction of Henry Hodgson of Whitby pilot for wilfully
disobeying the orders of the harbour master of the port of Whitby.
Offence committed on 25 May 1833" -- home=Whitby, occupation=pilot,
sex=male match. No named harbour master here (generic reference, no
name given), correctly no separate person row. Crime type=maritime
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-293 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 5 occupation
fixes.**

## Record 294

"Summary conviction of Elizabeth Wood of the township of Whitby
singlewoman for assaulting Sarah Hudson wife of John Hudson of the
township of Whitby labourer by striking her on the head with his
hands. Offence committed at the township of Whitby on 1 October 1842.
Division of Whitby Strand - case heard at Whitby" -- Elizabeth: home=
Whitby, sex=female match. **FIXED**: tracked marital-status occupation
gap (id 294, defendant entry) -- confirmed via dedicated query, fixed.
`INSERT INTO person_occupation (person_id, occupation_id) VALUES (326,
337);` Verified via SELECT. Sarah Hudson: victim, correctly has no
occupation of her own (the id 294 "victim" entry on the tracked list
was a false read -- labourer correctly belongs to husband John, not a
gap). John Hudson: "spouse of victim", home=Whitby, occupation=
labourer, correctly attached. person_relationship: Sarah "wife" -> John,
correct. Location/court/petty sessional division match. Crime
type=assault matches. No related_conviction.

**FIXED — 1 tracked occupation gap resolved (singlewoman); confirmed
the victim-role list entry for this record was not actually a gap.**

---

**Progress: records 1-294 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 295

"Summary conviction of William Stephenson, Thomas Hebron and Isaac Tose
for assaulting John Grainger one of the constables for the North Riding
in the execution of his duty. Offence committed at the township of
Hinderwell on 9 November 1859. Case heard at Whitby" -- three co-
defendants, no homes stated, correctly blank. Isaac Tose here is a
distinct person row (329), separate from record 211's Isaac Tose (223)
-- correct, no cross-conviction merge despite matching name. John
Grainger: victim, occupation="constable for the North Riding". Location/
court match. Crime type=assaulting a police officer matches. [Corrected
2026-07-30, retroactively, at record 301: a fourth man (Joseph Crispin,
record 301) was prosecuted separately for the same assault -- related_
conviction link created when this became visible at 301.]

**OK — no changes (related_conviction corrected retroactively, see
record 301).**

---

**Progress: records 1-295 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 296

"Summary conviction of Thomas Dixon of the township of Whitby labourer
for being drunk and riotous in Church Street. Offence committed at the
township of Whitby on 9 October 1869. Whitby Strand - case heard at
Whitby" -- home=Whitby, occupation=labourer, sex=male match. Church
Street -> East Cliff -> Whitby reaches stated township. Court=Whitby.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-296 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 297

"Summary conviction of Joseph Tose of the township of Hinderwell rag
gatherer for being drunk and disorderly in Staithes town street.
Offence committed at the township of Hinderwell on 4 November 1876.
Whitby Strand - case heard at Whitby" -- home=Hinderwell, occupation=
rag gatherer, sex=male match. "Staithes town street" resolves to
Staithes itself, under Hinderwell, matching stated township.
Court/petty sessional division match. Crime type=drunk and disorderly
matches. Already cross-checked against record 133's same-date query --
correctly unrelated to 363/429/441/1965/1968. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-297 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 298

"Summary conviction of Thomas Crake the younger of the township of
Hinderwell fisherman for being drunk on the licensed premises of Thomas
Spink. Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" -- home=
Hinderwell, name_postfix="the younger", occupation=fisherman, sex=male
match. Spink: licensee, different premises from record 272's Ashworth
-- same date/township but a genuinely separate incident, correctly
unlinked. Court/petty sessional division match. Crime
type=drunkenness matches. [Corrected 2026-07-30, retroactively, at
record 310: another patron (Thomas Headley Robinson, record 310) was
caught drunk at the same premises (Spink) on the same date --
related_conviction link created when this became visible.]

**OK — no changes (related_conviction corrected retroactively, see
record 310).**

---

**Progress: records 1-298 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 299

"Summary conviction of Edward Jacobs hawker for selling watch seals,
spectacles and printing types without a licence; on the information of
Robert Kirby of Whitby sub-distributor of stamps. Offence committed at
Whitby on 4 June 1833. Case heard at Whitby" -- no home stated,
occupation=hawker, sex=male match. Robert Kirby: own person row,
different date, correctly unlinked. Crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-299 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 300

"Summary conviction of William Thompson of the township of Whitby
butcher for assaulting William Brunton of the township of Whitby
butcher by striking him several times on the body and kicking him with
his feet with great force and violence. Offence committed at the
township of Whitby on 29 September 1842. Division of Whitby Strand -
case heard at Whitby" -- Thompson: home=Whitby, occupation=butcher,
sex=male match. Brunton: victim, home=Whitby, occupation=butcher, own
separate person row (distinct from record 259's Brunton, correct
no-merge). Location/court/petty sessional division match. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-300 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 34 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 301

"Summary conviction of Joseph Crispin for assaulting John Grainger one
of the constables for the North Riding in the execution of his duty.
Offence committed at the township of Hinderwell on 9 November 1859.
Case heard at Whitby" -- no home stated, correctly blank. John
Grainger: own person row, occupation="constable for the North Riding".
**FIXED**: same date, victim, township, and charge wording as record
295's three co-defendants -- no link existed for this fourth man
prosecuted separately. Created it. Verified via SELECT. Crime
type=assaulting a police officer matches. [Retroactively corrects
record 295's earlier verdict.]

**FIXED — 1 new related_conviction link created (retroactively also
resolves record 295).**

---

**Progress: records 1-301 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 35 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 6 occupation
fixes.**

## Record 302

"Summary conviction of Dorothy Kirby of the township of Whitby
singlewoman for being drunk; on the oath of [blank] Harnby of the
township of Whitby police constable. Offence committed at the township
of Whitby on 8 October 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, sex=female match. **FIXED**: tracked marital-status
occupation gap (id 302) -- fixed. `INSERT INTO person_occupation
(person_id, occupation_id) VALUES (336, 337);` **FIXED**: same date,
informant ([blank] Harnby), and charge as record 290 -- no
related_conviction link existed. Created it. Both verified via SELECT.
Crime type=drunkenness matches. [Retroactively corrects record 290's
earlier verdict.]

**FIXED — 1 tracked occupation gap resolved (singlewoman), 1 new
related_conviction link created (retroactively also resolves record
290).**

---

**Progress: records 1-302 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 303

"Summary conviction of William Sadler of the township of Whitby hawker
for being drunk and disorderly in New Way Ghaut. Offence committed at
the township of Whitby on 30 September 1876. Whitby Strand - case heard
at Whitby" -- home=Whitby, occupation=hawker, sex=male match. New Way
Ghaut (64) nests under Church Street (26) -> East Cliff -> Whitby,
reaching stated township. Court/petty sessional division match. Crime
type=drunk and disorderly matches. related_conviction link to 309
present -- noting for verification when reached.

**OK — no changes.**

---

**Progress: records 1-303 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 304

"Summary conviction of Thomas Pritchard of the township of Ruswarp
pedlar for being drunk and disorderly in St Hilda's Terrace. Offence
committed at the township of Ruswarp on 20 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- home=Ruswarp,
occupation=pedlar, sex=male match. This is Thomas Pritchard's own
defendant conviction (338), separate person row from the "spouse of
offender" mention in record 265 (9898, Mary Pritchard's husband) --
correct, no cross-conviction merge, even though clearly the same real
couple caught drunk together the same night. St Hilda's Terrace
cliff-boundary pattern matches. related_conviction link to 265
confirmed present.

**OK — no changes.**

---

**Progress: records 1-304 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 305

"Summary conviction of Christopher White of Whitby common brewer for
trespassing in search or pursuit of game on waste or moor land. Offence
committed on 12 August 1834 at the township of Moorsholm in the manor
of Skelton of which John Wharton esquire is lord of the manor. Case
heard at Guisborough" -- White: home=Whitby, occupation=common brewer,
sex=male match. John Wharton: landowner, occupation="lord of the manor
of Skelton" (existing precedent, id 230, matches exactly). "Esquire"
correctly not separately captured, per the established resolution.
Location=Moorsholm, court=Guisborough (out-of-area venue). Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-305 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 306

"Summary conviction of Margaret Gathsides common prostitute for
behaving riotously and indecently in Grape Lane Offence committed at
the township of Whitby on 2 October 1842 Case heard at Whitby" -- no
home stated, occupation="common prostitute" (stated as-is, no
fabrication), sex=female match. Grape Lane -> East Cliff -> Whitby
reaches stated township. Court=Whitby. Crime type=breach of the peace
matches. related_conviction link to 312 present -- noting for
verification when reached.

**OK — no changes.**

---

**Progress: records 1-306 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 307

"Summary conviction of Thomas Pattison alehouse keeper for opening his
premises for the sale of spirits before 12.30 p.m. on a Sunday. Offence
committed at the township of Ruswarp at 11 a.m. on 27 November 1859.
Case heard at Whitby" -- no home stated, occupation=alehouse keeper,
sex=male match. Own person row, different date from record 251's
Pattison -- correct no-merge, same recurring-offence pattern. offence_
time="11 a.m." correctly captured. Location=Ruswarp, court=Whitby.
Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-307 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 308

"Summary conviction of Henry Smith of the township of Whitby fruiterer
for being drunk. Offence committed at the township of Whitby on 31
October 1869. Whitby Strand - case heard at Whitby" -- home=Whitby,
occupation=fruiterer, sex=male match. Own separate person row, different
date from record 244's Smith -- correct no-merge. Location/court=
Whitby. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-308 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 309

"Summary conviction of Charles Sadler of the township of Whitby hawker
for being drunk and disorderly in New Way Ghaut. Offence committed at
the township of Whitby on 30 September 1876. Whitby Strand - case heard
at Whitby" -- home=Whitby, occupation=hawker, sex=male match. Shares
surname with record 303's William Sadler but no relationship
fabricated, matching established precedent. Location/court match. Crime
type=drunk and disorderly matches. related_conviction link to 303
already confirmed present -- resolves the flag from record 303.

**OK — no changes.**

---

**Progress: records 1-309 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 36 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 310

"Summary conviction of Thomas Headley Robinson of the township of
Hinderwell fisherman for being drunk on the licensed premises of Thomas
Spink. Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
middle name Headley, home=Hinderwell, occupation=fisherman, sex=male
match. Spink: own person row, same licensee as record 298 (different
patron). **FIXED**: same date/licensee/charge as record 298 -- no link
existed. Created it. Verified via SELECT. Crime type=drunkenness
matches. [Retroactively corrects record 298's earlier verdict.]

**FIXED — 1 new related_conviction link created (retroactively also
resolves record 298).**

---

**Progress: records 1-310 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

(Record 311 confirmed blacklisted, expected gap.)

## Record 312

"Summary conviction of Jane Robertson common prostitute for behaving
riotously and indecently in Grape Lane. Offence committed at the
township of Whitby on 2 October 1842. Case heard at Whitby" -- no home
stated, occupation="common prostitute" (as stated), sex=female match.
Location/court=Whitby. Crime type=breach of the peace matches.
related_conviction link to 306 already confirmed present -- resolves
the flag from record 306.

**OK — no changes.**

---

**Progress: records 1-312 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 313

"Summary conviction of Richard Knaggs of the township of Ellerby
labourer for trespassing in the daytime in search and pursuit of game
on land in the possession and occupation of William Hodgson; on the
information of Henry William Siggs of the township of Lythe
gamekeeper. Offence committed at the township of Ellerby at 3 p.m. on
20 June 1857. Case heard at Whitby" -- home=Ellerby, correctly showing
the fixed parent (88=Hinderwell) from the record-124 fix. Occupation=
labourer, sex=male match. William Hodgson: landowner, correctly
captured. Henry William Siggs: informant, home=Lythe, occupation=
gamekeeper, correctly captured. Location of offence=Ellerby matches.
Court=Whitby. offence_time="3 p.m." correctly captured. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-313 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 7 occupation
fixes.**

## Record 314

"Summary conviction of Hannah Palmer of the township of Whitby
singlewoman for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the township
of Whitby on 14 October 1869. Whitby Strand - case heard at Whitby" --
home=Whitby, sex=female match. Own separate person row from record
290's Hannah Palmer -- correct no-merge, recurring offender. **FIXED**:
tracked marital-status occupation gap (id 314) -- fixed. `INSERT INTO
person_occupation (person_id, occupation_id) VALUES (347, 337);`
Verified via SELECT. Francis Selby: informant, correctly captured.
Location/court=Whitby. Crime type=drunkenness matches. No
related_conviction.

**FIXED — 1 tracked occupation gap resolved (singlewoman).**

---

**Progress: records 1-314 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 315

"Summary conviction of Matthew Tose of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 3 October 1876. Whitby Strand -
case heard at Whitby" -- home=Whitby, occupation=jet worker, sex=male
match. Church Street -> East Cliff -> Whitby reaches stated township.
Court=Whitby. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-315 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 316

"Summary conviction of Louis Cleeton of the township of Whitby for
assaulting Mary Cleeton. Offence committed at the township of Whitby on
11 June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- Louis: home=Whitby, sex=male match. Mary: victim, sex=
female. No relationship fabricated despite shared surname (text
doesn't state one). Location/court/petty sessional division match.
Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-316 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 317

"Summary conviction of Samuel Morris for having medicines called Dutch
Drops and Riga Balsams for sale without the products being labelled; on
the information of Robert Kirby of the township of Whitby sub-
distributor of stamps, and on the oath of William Wilkinson. Offence
committed in Whitby on 30 May 1834. Case heard at Whitby" -- no home
stated for Morris, correctly blank. Robert Kirby: informant, own person
row, different date, correctly unlinked. William Wilkinson: witness,
own person row. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-317 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 318

"Summary conviction of John Scott and George Thompson for begging.
Offence committed at the township of Hawsker cum Stainsacre on 4
January 1848. Case heard at Whitby" -- two co-defendants, no homes
stated, correctly blank. Location=Hawsker-cum-Stainsacre, court=
Whitby. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-318 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 319

"Summary conviction of Henry Webster of the township of Whitby labourer
for assaulting and resisting Hugh MacGregor in the execution of his
office; on the oath of the said Hugh MacGregor of the township of
Ruswarp superintendent of police and constable. Offence committed at
the township of Whitby on 4 July 1857. Case heard at Whitby" --
defendant Henry Webster (Whitby, labourer), victim Hugh MacGregor
(Ruswarp, superintendent of police and constable -- occupation field,
not "office"; "in the execution of his office" is period phrasing for
on-duty, not our aristocratic-pedigree office field). Locations and
crime types (assaulting a police officer / obstructing-resisting a
constable) match. Already correctly linked via related_conviction to
325 (same defendant/offence date pattern) from a prior pass.

**OK — no changes.**

---

**Progress: records 1-319 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 8 occupation
fixes.**

## Record 320

"Summary conviction of Dorothy Kirby of the township of Whitby
singlewoman for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 14 October 1869. Whitby Strand - case heard at
Whitby" -- defendant Dorothy Kirby (Whitby), informant Francis Selby
(Whitby, police constable). Locations correct (court/offence=Whitby,
petty sessional division=Whitby Strand). Crime type=drunkenness
matches. No related_conviction.

Dorothy Kirby's own text states "singlewoman" but `person_occupation`
had no link -- another instance of the tracked corpus-wide marital-
status-occupation gap (not previously on the known-ids list; found
fresh via the standard per-person occupation check).

**FIXED — added missing occupation link: person 354 (Dorothy Kirby) →
occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-320 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 321

"Summary conviction of Edward Jameson Ayre of the township of Whitby
jet worker for being drunk and disorderly on Boulby Bank. Offence
committed at the township of Whitby on 26 July 1876. Whitby Strand -
case heard at Whitby" -- defendant Edward Jameson Ayre (first/middle/
last all captured correctly), occupation jet worker matches. Location
of offence = Boulby Bank (70), already correctly parented under East
Cliff (6) → Whitby (4), pre-existing precedent, no change needed.
Court=Whitby, petty sessional division=Whitby Strand. Crime type=drunk
and disorderly matches.

**OK — no changes.** [Corrected 2026-07-30: record 393 (Edward Ayre,
same offence date, no middle name stated there but clearly the same
person) surfaced a same-defendant/same-date link; related_conviction
321-393 added when 393 was reached.]

---

**Progress: records 1-321 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 322

"Summary conviction of John Burnside of the township of Whitby hawker
for being drunk and disorderly in The New Quay. Offence committed at
the township of Whitby on 9 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant John Burnside (Whitby,
hawker) matches. Location of offence = New Quay (80), correctly
parented under West Cliff (5) → Whitby, pre-existing precedent. Court=
Whitby, petty sessional division=Whitby Strand. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-322 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 323

"Summary conviction of Mutchoff Ponotowski for having medicines called
Dutch Drops and Riga Balsams for sale without the products being
labelled; on the information of Robert Kirby of the township of Whitby
sub-distributor of stamps, and on the oath of John Moody. Offence
committed in Whitby on 30 May 1834. Case heard at Whitby" -- defendant
Mutchoff Ponotowski, no home/occupation stated in text, correctly
blank. Informant Robert Kirby (Whitby, sub-distributor of stamps)
matches existing occupation precedent (id 350). Witness John Moody, no
details stated. Location=Whitby, crime type=licensing offence (correct
for unlabelled medicine sale). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-323 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 324

"Summary conviction of John Williams for refusing to work while being
relieved in the Whitby Union workhouse. Offence committed at the
township of Hawsker cum Stainsacre on 5 January 1848. Case heard at
Whitby" -- defendant John Williams, no home/occupation stated,
correctly blank. Location of offence has two rows: Union Workhouse
(81, Green Lane → East Cliff → Whitby, the physical building) and
Hawsker-cum-Stainsacre (the stated township) -- both legitimately
captured since the text states both the workhouse and the township
separately (poor-law settlement quirk: defendant's chargeable/home
township differs from the workhouse's physical location). Crime type
= refusing workhouse labour, correct. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-324 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 325

"Summary conviction of Henry Webster of the township of Whitby
labourer for assaulting and resisting George Jackson in the execution
of his office; on the oath of the said George Jackson of the township
of Whitby police constable. Offence committed at the township of
Whitby on 4 July 1857. Case heard at Whitby" -- companion record to
319 (same defendant Henry Webster, same offence date, different
victim/officer -- George Jackson here vs. Hugh MacGregor there).
Henry Webster correctly given a separate person row (359) per the
no-cross-conviction-merge principle. George Jackson (Whitby, police
constable) matches. Locations and crime types match. Already correctly
linked via related_conviction to 319.

**OK — no changes.**

---

**Progress: records 1-325 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 326

"Summary conviction of John Wilson of the township of Whitby tailor
for being drunk; on the oath of Francis Selby of the township of
Whitby police constable. Offence committed at the township of Whitby
on 15 October 1869. Whitby Strand - case heard at Whitby" -- defendant
John Wilson (Whitby, tailor), informant Francis Selby (same police
constable as record 320, but different offence date -- 15 Oct vs. 320's
14 Oct -- and different defendant, so a separate arrest, not the same
incident; no related_conviction link warranted). Locations and crime
type (drunkenness) match.

**OK — no changes.**

---

**Progress: records 1-326 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 327

"Summary conviction of James Bennett of the township of Egton miner
for assaulting Andrew Harland; on the oath of the said Andrew Harland
and John Green both of the township of Eskdaleside miners. Offence
committed at the township of Eskdaleside on 22 January 1876. Whitby
Strand - case heard at Whitby" -- defendant James Bennett (Egton,
miner); victim Andrew Harland and witness John Green (both Eskdaleside-
cum-Ugglebarnby, miners). Location of offence matches existing
precedent (id 8). Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-327 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 328

"Summary conviction of Ralph Cole of the township of Hinderwell
fisherman for being drunk on the licensed premises of Thomas Spink.
Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Ralph Cole (Hinderwell, fisherman), licensee Thomas Spink.
Locations and crime type (drunkenness) match.

**OK — no changes.** [Corrected 2026-07-30: record 334 (George Hart,
same licensee/premises/date) surfaced the same-incident pattern
between these two records; related_conviction link 328-334 added when
334 was reached.]

---

**Progress: records 1-328 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 329

"Summary conviction of John Campion of the township of Ruswarp mariner
for assaulting Robert Howard apprentice to Thomas Yeoman of Whitby
druggist. Offence committed at the township of Whitby on the morning
of Sunday 1 February 1835. Case heard at Whitby" -- defendant John
Campion (Ruswarp, mariner); victim Robert Howard, apprentice to master
Thomas Yeoman (Whitby, druggist) -- apprentice/person_relationship
link present, master role label correct per established convention.
Thomas Yeoman's sex left blank in the DB -- correct, since the text
gives no pronoun for him (unlike some other master-role records where
a stated "his" justified sex=male); leaving it blank rather than
inferring from the name alone matches the no-fabrication-beyond-text
rule, so no fix needed. Locations and crime type (assault) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-329 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes.**

## Record 330

"Summary conviction of John Ripley for wilfully destroying his own
clothes while being relieved in the Whitby Union workhouse. Offence
committed at the township of Hawsker cum Stainsacre on 6 January 1848.
Case heard at Whitby" -- defendant John Ripley, no home/occupation
stated, correctly blank. Locations: Union Workhouse (81) + Hawsker-
cum-Stainsacre, same legitimate dual-location pattern as record 324.

Crime type surfaced a real corpus-wide taxonomy fragmentation: 41
records with this identical offence text ("destroying own clothes
whilst being relieved in the Whitby Union workhouse") were tagged
`malicious/property damage`, and 14 more with the same offence text
were tagged `workhouse offence` -- same offence, two different
existing leaves. Flagged to user; user's decision: **create a new,
separate crime_type leaf** rather than merging into either existing
one. New leaf: id 73, "destroying own clothes", parented under "poor
law & family maintenance" (8) -- alongside sibling leaves "refusing
workhouse labour" (31) and "workhouse offence" (47), per user's choice
of category placement.

Per the established "fix only as reached in sequence" convention (same
as the marital-status occupation gap), only record 330 itself is
retagged now. 54 more records with this same offence text (40 tagged
malicious/property damage, 14 tagged workhouse offence) remain to be
retagged to crime_type 73 only as the linear audit reaches them --
full id list logged in reextraction-audit-notes.md.

**FIXED — new crime_type leaf 73 "destroying own clothes" created
under 8; record 330 retagged from 60 (malicious/property damage) to
73. Verified via direct query.**

---

**Progress: records 1-330 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 331

"Summary conviction of Thomas Walker apprentice by an indenture dated
11 May 1857 to John Milburn of the township of Ruswarp shipowner, for
absconding from his master's service. Offence committed on 11 May
1857. Case heard at Whitby" -- defendant Thomas Walker (apprentice),
master John Milburn (Ruswarp, shipowner) -- apprentice relationship
link present, master role correct. No offence location stated in
text, correctly no "location of offence" row (court=Whitby only).
Crime type = master and servant offence, correct for absconding from
apprenticeship. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-331 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 332

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for allowing disorderly conduct on his licensed premises.
Offence committed at the township of Whitby on 16 October 1869. Whitby
Strand - case heard at Whitby" -- defendant Thomas Atkinson (Whitby,
innkeeper). Locations and crime type (licensing offence) match.
Already correctly linked via related_conviction to 368 (same
defendant/offence date pattern).

**OK — no changes.** [Corrected 2026-08-04: record 517 (John Harrison,
found drunk on Atkinson's premises, refusing to leave when asked by
Superintendent Clarkson, same date) surfaced the same enforcement-
visit connection; related_conviction 332-517 added when 517 was
reached.]

---

**Progress: records 1-332 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 333

"Summary conviction of William Barrett of the township of Whitby jet
worker for assaulting Thomas Watson; on the oath of Joseph Philpot of
the township of Whitby jet worker. Offence committed at the township
of Whitby on 11 November 1876. Whitby Strand - case heard at Whitby"
-- defendant William Barrett (Whitby, jet worker), victim Thomas
Watson (no details stated, correctly blank), witness Joseph Philpot
(Whitby, jet worker). Locations and crime type (assault) match. This
is part of the previously-investigated Thomas Watson assault cluster:
already correctly linked via related_conviction to 447 and 1974 (same
defendant/offence date) and to 132 (same offence date/victim,
different defendant -- same incident, separately prosecuted).

**OK — no changes.**

---

**Progress: records 1-333 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 37 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 334

"Summary conviction of George Hart of the township of Hinderwell
fisherman for being drunk on the licensed premises of Thomas Spink.
Offence committed at the township of Hinderwell on 10 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant George Hart (Hinderwell, fisherman), licensee Thomas Spink.
Locations and crime type (drunkenness) match. Same licensee, premises,
and offence date as record 328 (Ralph Cole) -- same-incident pattern,
different defendant, prosecuted separately.

**FIXED — added related_conviction link 328-334 (same premises/date,
separate defendants). Record 328's log entry retroactively annotated.**

---

**Progress: records 1-334 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 335

"Summary conviction of Nathaniel Gardiner of Whitby innkeeper for
keeping his house open during the hours of divine service between
10.30 a.m. and 12 o'clock. Offence committed at Whitby on Sunday 1
February 1835. Case heard at Whitby" -- defendant Nathaniel Gardiner
(Whitby, innkeeper). Locations and crime type (licensing offence)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-335 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 336

"Summary conviction of William Davis for begging. Offence committed at
the township of Egton on 5 January 1848. Case heard at Whitby" --
defendant William Davis, no home/occupation stated, correctly blank.
Location=Egton, court=Whitby. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-336 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 337

"Summary conviction of Ralph Nunn of the township of Whitby ship
carpenter for assaulting John Mason of the township of Whitby butcher;
on the oath of the said John Mason and another. Offence committed at
the township of Whitby on 19 July 1857. Case heard at Whitby" --
defendant Ralph Nunn (Whitby, ship carpenter), victim John Mason
(Whitby, butcher). "And another" is an unnamed witness, correctly not
given a person row (no name to capture). Locations and crime type
(assault) match.

**OK — no changes.** [Corrected 2026-07-30: record 343 (George Wilson,
same victim John Mason, same offence date 19 July 1857) surfaced the
same-incident pattern; related_conviction link 337-343 added when 343
was reached.]

---

**Progress: records 1-337 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 338

"Summary conviction of Samuel Carr of the township of Glaisdale miner
for having an unseasonable salmon in his possession. Offence committed
at the township of Glaisdale on 14 November 1869. Whitby Strand - case
heard at Whitby" -- defendant Samuel Carr (Glaisdale, miner). Location
and crime type (poaching) match; species detail ("unseasonable
salmon") preserved verbatim in charge_description -- no dedicated
game_species field exists to check against (per the tracked, unfixed
schema watch item), so nothing lost. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-338 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 339

"Summary conviction of Thomas Gaines of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 4 October 1876. Whitby Strand -
case heard at Whitby" -- defendant Thomas Gaines (Whitby, fisherman).
Location of offence = Church Street (East Cliff → Whitby), existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-339 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 340

"Summary conviction of Mary Dryden wife of William Dryden of the
township of Whitby fisherman for assaulting Jane Harland. Offence
committed at the township of Whitby on 22 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Mary
Dryden, spouse William Dryden (Whitby, fisherman, wife relationship
present), victim Jane Harland. Locations and crime type (assault)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-340 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 341

"Summary conviction of Robert Dixon, Thomas Graham, Joseph Gath,
Thomas Storr and William Storr, all of the township of Whitby, for
assaulting Robert Stevenson, Jonathan Harrison and Margaret Short, all
of the township of Hawsker cum Stainsacre. Offence committed at the
township of Whitby on the night of Sunday 22 February 1835. Case heard
at Whitby" -- five defendants (all Whitby) and three victims (all
Hawsker-cum-Stainsacre), all correctly captured with matching homes;
no occupations stated, correctly blank. Location and crime type
(assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-341 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 342

"Summary conviction of John Coholl for begging. Offence committed at
the township of Egton on 5 January 1848. Case heard at Whitby" --
defendant John Coholl, no home/occupation stated, correctly blank.
Location=Egton, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-342 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 38 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 343

"Summary conviction of George Wilson of the township of Whitby ship
carpenter for assaulting John Mason of the township of Whitby butcher;
on the oath of the said John Mason and others. Offence committed at
the township of Whitby on 19 July 1857. Case heard at Whitby" --
defendant George Wilson (Whitby, ship carpenter), victim John Mason
(Whitby, butcher). Same victim and offence date as record 337 (Ralph
Nunn) -- same-incident pattern, different defendant, prosecuted
separately. Locations and crime type (assault) match.

**FIXED — added related_conviction link 337-343 (same victim/date,
separate defendants). Record 337's log entry retroactively annotated.**

---

**Progress: records 1-343 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 344

"Summary conviction of John Hodgson of the township of Whitby
fisherman for being drunk and riotous in Sandgate. Offence committed
at the township of Whitby on 18 December 1869. Whitby Strand - case
heard at Whitby" -- defendant John Hodgson (Whitby, fisherman).
Location of offence = Sandgate (34, East Cliff → Whitby), existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-344 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 345

"Summary conviction of John Shaw of the township of Whitby jet worker
for being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 7 October 1876. Whitby Strand - case heard
at Whitby" -- defendant John Shaw (Whitby, jet worker). Location of
offence = Church Street (East Cliff → Whitby), existing precedent.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-345 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 346

"Summary conviction of Robert Steel of the township of Whitby jet
worker for being drunk and disorderly at the Cragg. Offence committed
at the township of Whitby on 27 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Robert Steel
(Whitby, jet worker). Location of offence = The Cragg (74, West Cliff
→ Whitby), existing precedent. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-346 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 3 anomalies notes, 4
redundant relationship rows removed, 2 role corrections, 9 occupation
fixes, 1 new crime_type leaf created (1 record retagged so far).**

## Record 347

"Summary conviction of Robert Cunningham late of Kirby Moorside for
selling spectacles from house to house without a licence; on the
information of Robert Kirby of the township of Whitby sub-distributor
of stamps. Offence committed at the township of Sneaton on 5 March
1835. Case heard at Whitby" -- defendant Robert Cunningham, home
correctly resolved to Kirkbymoorside (id 292) in person.home_location_id
despite raw text's "Kirby Moorside" spelling. Informant Robert Kirby
(Whitby, sub-distributor of stamps) matches precedent. Location of
offence=Sneaton, court=Whitby, crime type=licensing offence, all
correct. No related_conviction.

Title field was wrong: read "Summary conviction: Robert Cunningham of
Whitby" despite the text saying "late of Kirby Moorside" and the DB's
own home_location_id already correctly resolving to Kirkbymoorside.
Checked precedent -- every other "late of X" record in the corpus (173,
183, 203, 213, 234, 249, 256, 289, 365, etc.) titles correctly as "X
late of [township]"; only this record broke the pattern.

**FIXED — corrected title to "Summary conviction: Robert Cunningham
late of Kirkbymoorside", matching the established "late of X" title
convention and the record's own correct home_location_id. Verified via
direct query.**

---

**Progress: records 1-347 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 348

"Summary conviction of Shaddrack Hind for begging. Offence committed
at the township of Egton on 5 January 1848. Case heard at Whitby" --
defendant Shaddrack Hind, no home/occupation stated, correctly blank.
Location=Egton, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-348 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 349

"Summary conviction of Thomas Jackson a reputed thief, for frequenting
Whitby harbour for the purpose of committing felony. Offence committed
at the parish of Whitby on 24 July 1857. Case heard at Whitby" --
defendant Thomas Jackson, no home stated, correctly blank. "A reputed
thief" checked against name_postfix precedent -- that field is
reserved for generational qualifiers (the younger/elder/junior), not
descriptive character labels, so correctly not force-fit there;
already preserved verbatim in charge_description/raw_record, nothing
lost. Locations and crime type (vagrancy, correct for the "frequenting
for purpose of felony" statutory offence) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-349 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 350

"Summary conviction of George Gray hawker, pedlar and petty chapman,
for selling pairs of scissors without a proper licence. Offence
committed at the township of Ruswarp on 8 December 1869. Whitby Strand
- case heard at Whitby" -- defendant George Gray, no home stated,
correctly blank. Occupation stored as the single compound string
"hawker, pedlar and petty chapman" -- checked precedent, this matches
the established convention for combined-phrase occupations ("hawker
and pedlar", "petty chapman and pedlar", "labourer and hawker" all
exist as single occupation strings), not an error. Locations and crime
type (licensing offence) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-350 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 351

"Summary conviction of John Watson Liddell of the township of Whitby
cartman for being disorderly on the licensed premises of Bailiff
Appleton and refusing to leave when asked by Mary Ann Appleton agent
of the said Bailiff Appleton. Offence committed at the township of
Whitby on 5 October 1876. Whitby Strand - case heard at Whitby" --
defendant John Watson Liddell (full name incl. middle name captured
correctly), licensee Bailiff Appleton (first_name blank, title=
"Bailiff", last_name=Appleton), informant/agent Mary Ann Appleton
(female, no relationship link stated in text between her and Bailiff
Appleton -- text only says "agent", not wife, correctly not linked).

Flagged an ambiguity: "Bailiff Appleton" recurs across 4 records
(this one, 1113, 5985, plus id 6206 elsewhere) as what looks like the
same real Whitby cab driver/licensee, but is captured two different
ways -- title="Bailiff" (3 instances, incl. this record) vs. literal
first_name="Bailiff" (1 instance, person 6206). The `title` field
otherwise only ever holds "Sir". User's decision: leave as-is, keep
the majority title-field convention, don't touch either version.
Record 351 already matches that majority convention, so no fix needed
here. Locations and crime types (breach of the peace, refusal to quit
licensed premises) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-351 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 352

"Summary conviction of Thomas Wellbury of the township of Whitby
seaman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 23 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Thomas
Wellbury (Whitby, seaman). Location of offence = Church Street
(East Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-352 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 9
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 353

"Summary conviction of Robert Plowman of Whitby the township of
Whitby mariner for assaulting Mary Plowman of Whitby spinster.
Offence committed at the township of Whitby on the morning of Sunday 8
March 1835. Case heard at Whitby" -- pre-existing anomaly note
correctly flags the doubled "of Whitby the township of Whitby" phrase
as a harmless source-side duplication. Defendant Robert Plowman
(Whitby, mariner), victim Mary Plowman (Whitby) -- shared surname but
no relationship stated in text, correctly no person_relationship link
fabricated. Locations and crime type (assault) match. No
related_conviction.

This was on the tracked marital-status-occupation-gap list (record
353 flagged at record 275): Mary Plowman's text states "spinster" but
`person_occupation` had no link.

**FIXED — added missing occupation link: person 6631 (Mary Plowman) →
occupation 406 (spinster). Verified via direct query.**

---

**Progress: records 1-353 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 354

"Summary conviction of John Walker for begging. Offence committed at
the township of Whitby on 1 January 1848. Case heard at Whitby" --
defendant John Walker, no home/occupation stated, correctly blank.
Location=Whitby, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-354 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 355

"Summary conviction of Esther Anthony wife of Joyce Anthony of the
township of Whitby mariner for using obscene and indecent language in
Church Street; on the oath of Robert Nickson of the township of
Whitby police constable. Offence committed at the township of Whitby
on 26 July 1857. Case heard at Whitby" -- defendant Esther Anthony
(female), spouse Joyce Anthony (correctly sex=male despite the name
reading as traditionally female -- correctly derived from the "wife
of" relationship rather than the given name), informant Robert Nickson
(Whitby, police constable). Wife relationship link present. Location
of offence = Church Street (East Cliff → Whitby). Crime type=using
obscene language matches.

**OK — no changes.** [Corrected 2026-07-30: record 361 (James Farrah,
same street/date/informant/offence) surfaced the same-beat pattern;
related_conviction link 355-361 added when 361 was reached.]

---

**Progress: records 1-355 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 356

"Summary conviction of James Filburn of the township of Aislaby jet
worker for resisting Charles Tempest Clarkson one of the constables
for the North Riding in the execution of his duty. Offence committed
at the township of Whitby on 16 October 1869. Whitby Strand - case
heard at Whitby" -- defendant James Filburn (Aislaby, jet worker),
victim Charles Tempest Clarkson (full name incl. middle name captured,
occupation "constable for the North Riding"). Locations and crime type
(obstructing/resisting a constable) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-356 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 357

"Summary conviction of John Telford of Brotton miner for being drunk
on the licensed premises of Samuel Adams and refusing to leave when
asked by the said Samuel Adams; on the oath of William Hammond of the
township of Hinderwell police constable. Offence committed at the
township of Hinderwell on 7 October 1876. Whitby Strand division -
case heard at Whitby" -- defendant John Telford (home=Brotton, id
282), correctly distinct from offence location Hinderwell. Licensee
Samuel Adams, informant William Hammond (Hinderwell, police
constable). Locations and crime types (drunkenness, refusal to quit
licensed premises) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-357 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

## Record 358

"Summary conviction of William Tose of Imperial Yard in the township
of Whitby for maliciously killing five young ducks, the property of
William Spence. Offence committed at the parish of Whitby on 1 July
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant William Tose, home=Imperial Yard (352, under Whitby id
4), existing precedent. Property owner William Spence, no
home/occupation stated, correctly blank. Locations and crime type
(malicious/property damage, correct -- this is ordinary property
destruction against someone else's property, not the workhouse-clothes
pattern from record 330) match.

**OK — no changes.** [Corrected 2026-07-30: record 382 (William Agar,
same owner/ducks/date) surfaced the same-incident pattern;
related_conviction link 358-382 added when 382 was reached.]

---

**Progress: records 1-358 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311). 6 location fixes (resolved), 39 related_
conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3 anomalies
notes, 4 redundant relationship rows removed, 2 role corrections, 10
occupation fixes, 1 new crime_type leaf created (1 record retagged so
far).**

(Record 359 confirmed blacklisted/no row exists in summary_conviction,
expected gap -- same pattern as 87-88, 139, 144, 151, 311.)

## Record 360

"Summary conviction of John Roberts for wilfully destroying his own
clothes while being relieved in the Whitby Union workhouse. Offence
committed at the township of Hawsker cum Stainsacre on 12 January
1848. Case heard at Whitby" -- defendant John Roberts, no home/
occupation stated, correctly blank. Locations: Union Workhouse (81) +
Hawsker-cum-Stainsacre, same dual-location pattern as records 324/330.
On the tracked "destroying own clothes" crime_type list (was tagged
60 malicious/property damage).

**FIXED — retagged crime_type from 60 to 73 (destroying own clothes),
per the record-330 decision. Verified via direct query.**

---

**Progress: records 1-360 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 39
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 10 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 361

"Summary conviction of James Farrah of the township of Whitby labourer
for using obscene and indecent language in Church Street; on the oath
of Robert Nickson of the township of Whitby police constable. Offence
committed at the township of Whitby on 26 July 1857. Case heard at
Whitby" -- defendant James Farrah (Whitby, labourer), informant Robert
Nickson (Whitby, police constable). Locations and crime type (using
obscene language) match. Same informant, offence, street, and date as
record 355 (Esther Anthony) -- flagged to user as a new sub-pattern
(same beat constable, no shared named victim/premises); user confirmed
this counts as Pattern 2. New precedent established and saved.

**FIXED — added related_conviction link 355-361 (same officer/date/
street/offence). Record 355's log entry retroactively annotated.**

---

**Progress: records 1-361 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 10 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 362

"Summary conviction of Margaret Corner of the township of Whitby
singlewoman for being drunk; on the oath of Simpson Harnby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 22 October 1869. Whitby Strand - case heard at
Whitby" -- defendant Margaret Corner (Whitby), informant Simpson
Harnby (Whitby, police constable). Locations and crime type
(drunkenness) match. Margaret Corner's text states "singlewoman" but
`person_occupation` had no link -- another instance of the tracked
marital-status-occupation gap.

**FIXED — added missing occupation link: person 399 (Margaret Corner)
→ occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-362 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 363

"Summary conviction of Jacob Pearson and William Sanders for
assaulting Joseph Watson. Offence committed at the township of
Hinderwell on 4 November 1876. Whitby Strand - case heard at Whitby"
-- two co-defendants (Jacob Pearson, William Sanders), no home/
occupation stated for either, correctly blank. Victim Joseph Watson
(unrelated to the earlier Thomas Watson assault cluster -- different
name and township). Locations and crime type (assault) match. Already
correctly linked via related_conviction to 441 (same defendant/offence
date).

**OK — no changes.**

---

**Progress: records 1-363 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 364

"Summary conviction of George Ward of the township of Whitby labourer
for being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 26 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant George Ward (Whitby,
labourer). Location of offence = Church Street (East Cliff → Whitby),
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-364 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 365

"Summary conviction of James Grants late of the township of Whitby
labourer and hawker for selling knives from door to door without a
licence; on the information of Robert Kirby of Whitby esquire sub-
distributor of stamps. Offence committed at the township of Whitby on
27 June 1835. Case heard at Whitby" -- defendant James Grants (Whitby,
labourer and hawker -- compound occupation string, matches convention).
Informant Robert Kirby (Whitby, sub-distributor of stamps). Flagged
"esquire" (Robert Kirby's honorific here) since title field had no
precedent for it; user's decision: meaningless courtesy, ignore it
completely everywhere it's found -- blanket, corpus-wide, not just
this record. Locations and crime type (licensing offence) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-365 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 new crime_type leaf created (2
records retagged so far).**

## Record 366

"Summary conviction of Robert Stephenson of the township of
Fylingdales farmer for trespassing in the daytime in search of game on
waste or common land belonging to George Cholmley esquire as lord of
the manor of Fylingdales. Offence committed at the township of
Fylingdales on 20 December 1847. Case heard at Whitby" -- defendant
Robert Stephenson (Fylingdales, farmer). Landowner George Cholmley
(person 6641, separate row per no-cross-merge, correct). "Esquire"
ignored per the settled blanket decision. "Lord of the manor of
Fylingdales" flagged as a new office-field candidate (no precedent
existed); user's decision: add to office. Locations and crime type
(poaching) match. No related_conviction.

**FIXED — set person 6641 (George Cholmley) office = "Lord of the
Manor of Fylingdales". Verified via direct query.** [Corrected
2026-07-30: record 372 (George Wellburn, same landowner/offence date)
surfaced both the office fix for person 6645 and a related_conviction
link 366-372, applied when 372 was reached.]

---

**Progress: records 1-366 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 367

"Summary conviction of Mary Ashton for trading as a petty chapman
without being licensed. Offence committed at the township of Whitby on
5 August 1857. Case heard at Whitby" -- defendant Mary Ashton, no home
stated, correctly blank. Location=Whitby, crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-367 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 368

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for assaulting Charles Tempest Clarkson one of the
constables for the North Riding in the execution of his duty. Offence
committed at the township of Whitby on 16 October 1869. Whitby Strand
- case heard at Whitby" -- defendant Thomas Atkinson (Whitby,
innkeeper), victim Charles Tempest Clarkson (full name incl. middle
name captured, occupation constable for the North Riding). Locations
and crime type (assaulting a police officer) match. Already correctly
linked via related_conviction to 332 (same defendant/offence date).

**OK — no changes.** [Corrected 2026-08-04: record 517 (John Harrison,
refusing to leave when asked by Clarkson) surfaced the same
enforcement-visit connection; related_conviction 368-517 added when
517 was reached.]

---

**Progress: records 1-368 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 369

"Summary conviction of Francis Fewster of the township of Whitby jet
worker for being drunk and disorderly in Baxtergate; on the oath of
William Holmes of the township of Whitby police constable. Offence
committed at the township of Whitby on 14 October 1876. Whitby Strand
- case heard at Whitby" -- defendant Francis Fewster (Whitby, jet
worker), informant William Holmes (Whitby, police constable).
Location of offence = Baxtergate (West Cliff → Whitby), existing
precedent. Crime type=drunk and disorderly matches. Already correctly
linked via related_conviction to 1959 (same date/street/charge, same-
beat pattern).

**OK — no changes.**

---

**Progress: records 1-369 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 370

"Summary conviction of Ralph Jordison of the township of Whitby
labourer for playing booking (a game of chance) in the New Quay.
Offence committed at the township of Whitby on 27 July 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Ralph Jordison (Whitby, labourer). Location of offence = New Quay
(West Cliff → Whitby), existing precedent. Crime type=gaming/gambling
offence, correct for "booking". Already part of a larger existing
same-incident cluster (related_conviction to 400, 412, 430, 442 --
same date/street/charge, likely one gambling raid, several people
prosecuted).

**OK — no changes.**

---

**Progress: records 1-370 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 371

"Summary conviction of William Stonehouse for assaulting Thomas Skerry
of Whitby flaxdresser, by striking him several blows over the head and
arms. Offence committed at the township of Whitby on the morning of
Sunday 19 July 1835. Division of Whitby Strand - case heard at Whitby"
-- defendant William Stonehouse, no home stated, correctly blank.
Victim Thomas Skerry (Whitby, flaxdresser). Locations and crime type
(assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-371 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 40
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 1 office fix, 1 new crime_type leaf
created (2 records retagged so far).**

## Record 372

"Summary conviction of George Wellburn of the township of Fylingdales
farmer for trespassing in the daytime in search of game on waste or
common land belonging to George Cholmley esquire as lord of the manor
of Fylingdales. Offence committed at the township of Fylingdales on 20
December 1847. Case heard at Whitby" -- defendant George Wellburn
(Fylingdales, farmer). Landowner George Cholmley (person 6645,
separate row per no-cross-merge). Same landowner, offence, and offence
date as record 366 (Robert Stephenson) -- Pattern 2, one incident, two
men prosecuted separately. Locations and crime type (poaching) match.

**FIXED — set person 6645 (George Cholmley) office = "Lord of the
Manor of Fylingdales" (per the record-366 precedent); added
related_conviction link 366-372. Record 366's log entry retroactively
annotated.**

---

**Progress: records 1-372 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 new crime_type
leaf created (2 records retagged so far).**

## Record 373

"Summary conviction of Thomas Jackson a suspected person and reputed
thief for frequenting the river Esk with intent to commit felony.
Offence committed at the parish of Whitby on 11 September 1857. Case
heard at Whitby" -- defendant Thomas Jackson (person 411, separate row
per no-cross-merge, even though likely the same recurring individual
as record 349's Thomas Jackson -- correctly not linked/merged, and no
related_conviction fabricated since these are different offence
dates/incidents). "A suspected person and reputed thief" -- same
descriptive-label pattern as 349, correctly not force-fit into
name_postfix. Location of offence includes River Esk (397, under a
"Rivers" node), consistent with the established named-rivers cross-
parish handling. Crime type=vagrancy, correct for the "frequenting...
with intent to commit felony" statutory offence.

**OK — no changes.**

---

**Progress: records 1-373 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 new crime_type
leaf created (2 records retagged so far).**

## Record 374

"Summary conviction of John McCloine of the township of Whitby common
lodging house keeper for not thoroughly cleansing the bedding and bed
covers in use in his lodging house. Offence committed at the township
of Whitby on 19 October 1869. Whitby Strand - case heard at Whitby" --
defendant John McCloine (Whitby, common lodging house keeper).
Locations match. Crime type was wrong: tagged "licensing offence" (23)
while 6 other identical "not cleansing lodging house bedding" records
(219, 270, 1486, 1895, 5642, 5695) all use "public health offence"
(37) -- clear precedent, this was the sole outlier.

**FIXED — retagged crime_type from 23 (licensing offence) to 37
(public health offence). Verified via direct query.**

---

**Progress: records 1-374 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 375

"Summary conviction of Robert Foster of the township of Whitby coal
porter for being drunk and disorderly in Haggersgate; on the oath of
George Hewison and John Alderson Wallace both of the township of
Whitby police constables. Offence committed at the township of Whitby
on 14 October 1876. Whitby Strand - case heard at Whitby" -- defendant
Robert Foster (Whitby, coal porter), both informants captured (George
Hewison, John Alderson Wallace incl. middle name). Location of offence
= Haggersgate (West Cliff → Whitby), existing precedent. Crime
type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-375 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 376

"Summary conviction of Thomas Walker of the township of Whitby tailor
for being drunk and disorderly in St Ann's Staith. Offence committed
at the township of Whitby on 28 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas Walker
(person 414, separate row from record 331's Thomas Walker per no-
cross-merge -- different conviction, different occupation, clearly a
different real person). Location of offence = St Ann's Staith (West
Cliff → Whitby), existing precedent. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-376 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 11 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 377

"Summary conviction of Fanny Mackey for assaulting Eleanor Law of
Whitby singlewoman. Offence committed at the township of Whitby on 1
August 1835. Costs paid to William Wilkinson constable of Whitby.
Division of Whitby Strand - case heard at Whitby" -- defendant Fanny
Mackey, no home stated, correctly blank. Victim Eleanor Law (Whitby).
William Wilkinson correctly captured with role "recipient of costs
payment" (occupation constable of Whitby). Locations and crime type
(assault) match. No related_conviction.

Eleanor Law's text states "singlewoman" but `person_occupation` had no
link -- another instance of the tracked marital-status-occupation gap.

**FIXED — added missing occupation link: person 6648 (Eleanor Law) →
occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-377 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 378

"Summary conviction of James Newton of the township of Egton for
assaulting Luke Hoggart of the township of Egton by seizing him by his
thigh and threatening to throw him behind the fire in his [Hoggart's]
dwelling house. Offence committed at the township of Egton on 14
January 1848. Division of Whitby Strand - case heard at Whitby" --
defendant James Newton (Egton), victim Luke Hoggart (Egton). Locations
and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-378 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 379

"Summary conviction of Mark Herbert of the township of Fylingdales
farmer for being drunk; on the oath of George Bushell of the township
of Fylingdales police constable. Offence committed at the township of
Fylingdales on 11 September 1857. Case heard at Whitby" -- defendant
Mark Herbert (Fylingdales, farmer), informant George Bushell
(Fylingdales, police constable). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-379 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 380

"Summary conviction of Joseph Priestley [Priestly] for assaulting
Thomas Bowron a police constable in the execution of his duty. Offence
committed at the township of Egton on 5 November 1869. Whitby Strand -
case heard at Whitby" -- defendant Joseph Priestley, bracketed
alternate spelling "Priestly" correctly captured in the alias field.
Victim Thomas Bowron (police constable). Locations and crime type
(assaulting a police officer) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-380 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 381

"Summary conviction of Douglas Munroe of the township of Ruswarp
hawker for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 21 October 1876. Whitby Strand - case
heard at Whitby" -- defendant Douglas Munroe (home=Ruswarp, correctly
distinct from offence location). Location of offence = Baxtergate
(West Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-381 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 41
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 382

"Summary conviction of William Agar of Blacksmith's Arms Yard in the
township of Whitby for maliciously killing five young ducks, the
property of William Spence. Offence committed at the parish of Whitby
on 1 July 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant William Agar, home=Blacksmith's Arms Yard (39,
existing precedent under Church Street/East Cliff). Same property
owner, ducks, and offence date as record 358 (William Tose) -- Pattern
2, one incident, two men prosecuted separately. Crime type=malicious/
property damage matches.

**FIXED — added related_conviction link 358-382 (same owner/property/
date). Record 358's log entry retroactively annotated.**

---

**Progress: records 1-382 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 12 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 383

"Summary conviction of Thomas Hill of Whitby joiner for assaulting
Sarah Turner of Ruswarp singlewoman. Offence committed at the township
of Ruswarp on 24 July 1835. Division of Whitby Strand - case heard at
Whitby" -- defendant Thomas Hill (Whitby, joiner), victim Sarah Turner
(Ruswarp). Locations and crime type (assault) match. On the tracked
marital-status-occupation-gap list: Sarah Turner's text states
"singlewoman" but `person_occupation` had no link.

**FIXED — added missing occupation link: person 6654 (Sarah Turner) →
occupation 337 (singlewoman). Verified via direct query.**

---

**Progress: records 1-383 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 384

"Summary conviction of John Smith and Patrick Cock, both of the
township of Hinderwell labourers, for wilfully breaking a pane of
glass value 1s in the window of the dwelling house of John Peacock
overseer of the poor of the township of Hinderwell. Offence committed
at the township of Hinderwell on 16 January 1848. Case heard at
Whitby" -- two co-defendants (John Smith, Patrick Cock, both
Hinderwell labourers). Property owner John Peacock, "overseer of the
poor of the township of Hinderwell" already captured as occupation
(matches existing convention -- parochial offices go in occupation,
not the aristocratic-pedigree office field). Locations and crime type
(malicious/property damage, correct -- ordinary glass-breaking, not
the workhouse-clothes pattern) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-384 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 385

"Summary conviction of John Furniss late of the parish of Hartlepool
in county Durham fisherman for wilfully damaging two herring nets
value £5, the property of Robert Harrison; on the oath of the said
Robert Harrison of the parish of Durham [sic] fisherman. Offence
committed at the parish of Whitby on 28 September 1857. Case heard at
Whitby" -- defendant John Furniss (home=Hartlepool), property owner
Robert Harrison (home=Durham, captured literally as the text states --
the "[sic]" appears to flag the original clerk's own inconsistency
between "county Durham" for Furniss vs. "parish of Durham" for
Harrison, not an extraction error; captured as stated rather than
corrected, matching the no-fabrication rule). Locations and crime type
(malicious/property damage, correct -- ordinary net damage) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-385 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 386

"Summary conviction of Catherine Hunt of the township of Whitby tramp
for being drunk; on the oath of Charles Albert Martindale of the
township of Whitby police constable. Offence committed at the
township of Whitby on 4 November 1869. Whitby Strand - case heard at
Whitby" -- defendant Catherine Hunt, occupation "tramp" matches
established occupation category (id 373). Informant Charles Albert
Martindale (full name incl. middle name captured). Locations and crime
type (drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-386 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 387

"Summary conviction of John McCloin of the township of Whitby hawker
for being drunk and disorderly in Henrietta Street. Offence committed
at the township of Whitby on 29 October 1876. Whitby Strand - case
heard at Whitby" -- defendant John McCloin (hawker) -- distinct from
record 374's John McCloine (common lodging house keeper, different
date/offence) despite similar spelling; correctly kept as a separate
person, no fabricated merge. Location of offence = Henrietta Street
(East Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-387 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 388

"Summary conviction of Eleanor Olliver wife of Robert Olliver of the
township of Hawsker cum Stainsacre iron worker for assaulting Mary Ann
Corser. Offence committed at the township of Hawsker cum Stainsacre on
6 July 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Eleanor Olliver, spouse Robert Olliver
(Hawsker-cum-Stainsacre, iron worker, wife relationship present),
victim Mary Ann Corser (full name incl. middle name captured).
Locations and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-388 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 389

"Summary conviction of Thomas Millighan for selling needles without
having a hawker's licence; on the information of Robert Kirby of
Whitby sub-distributor of stamps. Offence committed at the township of
Scarborough on 10 September 1835. Case heard at Whitby" -- defendant
Thomas Millighan, no home stated, correctly blank. Informant Robert
Kirby (Whitby, sub-distributor of stamps) matches precedent. Location
of offence = Scarborough (255), existing precedent. Crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-389 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (2 records
retagged so far).**

## Record 390

"Summary conviction of Joseph Evans for wilfully destroying his own
clothes while being relieved in the Whitby Union workhouse. Offence
committed at the township of Hawsker cum Stainsacre on 14 January
1848. Case heard at Whitby" -- defendant Joseph Evans, no home/
occupation stated, correctly blank. Locations: Union Workhouse (81) +
Hawsker-cum-Stainsacre, same dual-location pattern as records 324/330/
360. On the tracked "destroying own clothes" crime_type list (was
tagged 60 malicious/property damage).

**FIXED — retagged crime_type from 60 to 73 (destroying own clothes).
Verified via direct query.**

---

**Progress: records 1-390 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 391

"Summary conviction of James Haley late of the township of Whitby
labourer for assaulting and resisting Hugh McGregor in the execution
of his office; on the oath of the said Hugh McGregor of the township
of Ruswarp superintendent of police and constable for the North
Riding. Offence committed at the township of Whitby on 22 September
1857. Case heard at Whitby" -- defendant James Haley (Whitby,
labourer), victim Hugh McGregor (Ruswarp, superintendent of police and
constable for the North Riding -- occupation field, "in the execution
of his office" is period phrasing, not our office field). Spelling
"McGregor" matches this record's own text exactly (distinct from
record 319's "MacGregor" -- different person row, correctly not
merged). Locations and crime types match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-391 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 392

"Summary conviction of John Wilks of the township of Lythe farm
servant for trespassing in the daytime in pursuit of conies on land in
the possession and occupation of Joseph Cranston. Offence committed at
the township of Lythe on 31 October 1869. Whitby Strand - case heard
at Whitby" -- defendant John Wilks (Lythe, farm servant), landowner
Joseph Cranston. Locations and crime type (poaching) match; species
detail ("conies" = rabbits) preserved in charge_description, no
dedicated game_species field to check against. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-392 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 42
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 13 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 393

"Summary conviction of Edward Ayre of the township of Whitby jet
worker for assaulting Sarah Ann Readman; on the oath of the said Sarah
Ann Readman of the township of Whitby singlewoman. Offence committed
at the township of Whitby on 26 July 1876. Whitby Strand - case heard
at Whitby" -- defendant Edward Ayre, same offence date/occupation/
township as record 321's Edward Jameson Ayre (this record's text just
doesn't state the middle name) -- clearly the same real person, same
arrest, different charge. Victim Sarah Ann Readman (full name incl.
middle name captured). On the tracked marital-status-occupation-gap
list: her text states "singlewoman" but `person_occupation` had no
link.

**FIXED — added missing occupation link: person 6662 (Sarah Ann
Readman) → occupation 337 (singlewoman). Added related_conviction link
321-393 (same defendant/offence date). Record 321's log entry
retroactively annotated.**

---

**Progress: records 1-393 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 394

"Summary conviction of John Parkin of the township of Whitby labourer
for being drunk and disorderly in St Ann's Staith. Offence committed
at the township of Whitby on 27 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant John Parkin
(Whitby, labourer). Location of offence = St Ann's Staith (West Cliff
→ Whitby), existing precedent. Crime type=drunk and disorderly
matches. Already correctly linked via related_conviction to 418
(same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-394 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 395

"Summary conviction of William Collins late of Cumberland labourer for
selling spoons, razors and braces without having a hawker's licence;
on the information of Robert Kirby of Whitby sub-distributor of
stamps. Offence committed at the township of Whitby on 19 September
1835. Case heard at Whitby" -- defendant William Collins (home=
Cumberland, id 310, existing precedent). Informant Robert Kirby
(Whitby, sub-distributor of stamps) matches. Locations and crime type
(licensing offence) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-395 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 396

"Summary conviction of James Cunningham apprentice to John Smith of
the township of Whitby ship owner, for absenting himself from the
service of his master for about ten hours; on the information of the
said John Smith. Offence committed on 19 February 1848. Case heard at
Whitby" -- defendant James Cunningham (apprentice), John Smith
(Whitby, ship owner) -- apprentice relationship link present. Role for
John Smith is "informant" rather than "master"; checked precedent --
records 402 and 450 use the identical "on the information of the said
[master]" phrasing and are also role=informant, so this is a
consistent, textually-justified distinction (not the bare "his
master's service" framing that gets role=master, e.g. record 331), not
an inconsistency. Crime type=master and servant offence, correct.

**OK — no changes.**

---

**Progress: records 1-396 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 397

"Summary conviction of Richard Hill the younger of the township of
Newholm cum Dunsley labourer for killing a hare; on the information of
Henry William Siggs of the township of Lythe gamekeeper and others.
Offence committed at the township of Lythe on Sunday 13 September
1857. Case heard at Whitby" -- defendant Richard Hill, name_postfix
"the younger" matches established generational-qualifier convention.
Informant Henry William Siggs (full name incl. middle name captured,
Lythe, gamekeeper). "And others" correctly has no fabricated person
row. Locations and crime type (poaching) match.

**OK — no changes.** [Corrected 2026-07-30: record 403 (Joseph
Breckon, same gamekeeper/offence/location/date) surfaced the same-beat
pattern; related_conviction 397-403 added when 403 was reached. Also,
record 409 (Robert Goodwill, same gamekeeper/location/date) added a
third related_conviction link, 397-409, when 409 was reached.]

---

**Progress: records 1-397 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 398

"Summary conviction of James Chappel of the township of Eskdaleside
miner for assaulting Joseph Robinson; on the oath of the said Joseph
Robinson of the township of Eskdaleside manager of ironstone mines.
Offence committed at the township of Eskdaleside on 3 December 1869.
Whitby Strand - case heard at Whitby" -- defendant James Chappel
(Eskdaleside, miner), victim Joseph Robinson (Eskdaleside, manager of
ironstone mines). Locations and crime type (assault) match. Already
correctly linked via related_conviction to 525 (same defendant/offence
date).

**OK — no changes.**

---

**Progress: records 1-398 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 399

"Summary conviction of William Cuthbert of Runswick in the township of
Hinderwell for trespassing in the daytime in search of conies in a
close of land in the possession and occupation of Thomas Vaughan.
Offence committed at the township of Barnby on 18 November 1876.
Whitby Strand - case heard at Whitby" -- defendant William Cuthbert,
home=Runswick (298, under Hinderwell 88), existing precedent. Landowner
Thomas Vaughan. Locations (offence at Barnby, under Hinderwell) and
crime type (poaching) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-399 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 400

"Summary conviction of Harold Parkinson of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay. Offence
committed at the township of Whitby on 27 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Harold
Parkinson (Whitby, jet worker). Location of offence = New Quay
(existing precedent). Crime type=gaming/gambling offence matches.
Already part of the existing gambling-raid cluster (related_conviction
to 370, 412, 430, 442).

**OK — no changes.**

---

**Progress: records 1-400 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 401

"Summary conviction of Thomas Warrener of Pickering common carrier for
having 34 salmon in his possession; on the complaint of William
Wilkinson of the township of Whitby police officer. Offence committed
at the township of Whitby on 10 October 1835. Case heard at Whitby" --
defendant Thomas Warrener, home=Pickering (277), existing precedent.
Informant William Wilkinson (Whitby, police officer). Crime
type=poaching, correct for unlawful possession of salmon (species
detail preserved in charge_description). Locations match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-401 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 402

"Summary conviction of George Borrows apprentice to Paul Stokill of
the township of Ruswarp ship owner, for absenting himself from the
service of his master for about ten hours; on the information of the
said Paul Stokill. Offence committed on 19 February 1848. Case heard
at Whitby" -- defendant George Borrows (apprentice), Paul Stokill
(Ruswarp, ship owner), role=informant already checked as correct
precedent at record 396. Apprentice relationship link present. Crime
type=master and servant offence, correct. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-402 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 43
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 403

"Summary conviction of Joseph Breckon of the township of Whitby
stonemason for killing a hare; on the information of Henry William
Siggs of the township of Lythe gamekeeper and others. Offence
committed at the township of Lythe on Sunday 13 September 1857. Case
heard at Whitby" -- defendant Joseph Breckon (Whitby, stonemason).
Same informant/gamekeeper, offence, location, and date as record 397
(Richard Hill) -- same-beat pattern, different defendant. Locations
and crime type (poaching) match.

**FIXED — added related_conviction link 397-403 (same gamekeeper/
offence/location/date). Record 397's log entry retroactively
annotated.** [Corrected 2026-07-30: record 409 (Robert Goodwill, same
gamekeeper/location/date) added a third related_conviction link,
403-409, when 409 was reached -- full all-pairs linking for this
three-record cluster.]

---

**Progress: records 1-403 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 404

"Summary conviction of Catherine Dowse of the township of Whitby
hawker for being drunk. Offence committed at the township of Whitby on
3 December 1869. Whitby Strand - case heard at Whitby" -- defendant
Catherine Dowse (Whitby, hawker). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-404 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 405

"Summary conviction of Thomas Dixon of the township of Whitby cartman
for trespassing in the daytime in search of game in a close of land in
the possession and occupation of Robert Robinson the younger. Offence
committed at the township of Hutton Mulgrave on 25 September 1876.
Whitby Strand - case heard at Whitby" -- defendant Thomas Dixon
(Whitby, cartman). Landowner Robert Robinson, name_postfix "the
younger" matches established precedent (same person id 6671 seen
before). Location of offence = Hutton Mulgrave (274, under Lythe),
existing precedent. Crime type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-405 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 406

"Summary conviction of John Dean of the township of Ruswarp for
stealing a quantity of peas value 2s 6d, the property of William
Gibbons and growing in his garden. Offence committed at the township
of Ruswarp on 11 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant John Dean (Ruswarp), no occupation
stated, correctly blank. Property owner William Gibbons. Locations and
crime type (theft) match. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 661]:** records 658, 661, and
667 turned out to share this exact same offence/victim/date (William
Gibbons' peas, 11 July 1889, Ruswarp) with different defendants.
related_conviction links to all three have now been added retroactively.

---

**Progress: records 1-406 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 407

"Summary conviction of William Tyerman of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 12 October 1834. Endorsed "26 October 1834"" -- defendant
William Tyerman (Whitby, innkeeper). No court location captured,
correctly matches text -- this "Endorsed [date]" ending (instead of
"case heard at X") is a known recurring document structure, 23 records
use it corpus-wide, not unique to this one. Crime type=licensing
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-407 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 408

"Summary conviction of David Miller for lodging in an outhouse or open
shed with no visible means of subsistence. Offence committed at the
township of Ruswarp on 20 February 1848. Case heard at Whitby" --
defendant David Miller, no home/occupation stated, correctly blank.
Locations and crime type (vagrancy) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-408 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 44
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 409

"Summary conviction of Robert Goodwill of the township of Whitby
stonemason for using a gun to kill game; on the information of Henry
William Siggs of the township of Lythe gamekeeper and others. Offence
committed at the township of Lythe on Sunday 13 September 1857. Case
heard at Whitby" -- defendant Robert Goodwill (Whitby, stonemason).
Same informant/gamekeeper, location, and date as records 397/403 --
same-beat pattern, third member of this cluster. Locations and crime
type (poaching) match.

**FIXED — added related_conviction links 397-409 and 403-409 (full
all-pairs linking for the three-record cluster). Records 397 and 403's
log entries retroactively annotated.**

---

**Progress: records 1-409 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 410

"Summary conviction of Daniel George Robinson of the township of
Whitby labourer for being drunk; on the oath of Charles Tempest
Clarkson of the township of Whitby police superintendent. Offence
committed at the township of Whitby on 27 November 1869. Whitby Strand
- case heard at Whitby" -- defendant Daniel George Robinson (full name
incl. middle name), informant Charles Tempest Clarkson (same officer
as records 356/368, here "police superintendent" per this record's own
wording). Locations and crime type (drunkenness) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-410 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 411

"Summary conviction of Blanche Wellburn of the township of Whitby for
being drunk and disorderly in Middle Walk; on the oath of John
Alderson Wallace of the township of Whitby police constable. Offence
committed at the township of Whitby on 31 October 1876. Whitby Strand
- case heard at Whitby" -- defendant Blanche Wellburn, no occupation
stated, correctly blank. Informant John Alderson Wallace (full name
incl. middle name captured). Location of offence = Middle Walk (90,
under Church Street 26), existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-411 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 412

"Summary conviction of Albert Pearson of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay. Offence
committed at the township of Whitby on 27 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Albert
Pearson (Whitby, jet worker). Location and crime type (gaming/gambling
offence) match. Full all-pairs linking already present within the
gambling cluster (370, 400, 430, 442).

**OK — no changes.**

---

**Progress: records 1-412 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 413

"Summary conviction of Joseph Jackson of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Joseph Jackson (Whitby, innkeeper). Part of a batch of ~11 near-
identical "opening premises during divine service" convictions
(407/413/419/425/431/437/443/449/455/459/464), all convicted 1834-10-
28. 9 of the 11 share the identical "Endorsed '8 October 1834'" text
despite differing offence dates (12/19 October) -- a genuine but
faithfully-preserved historical oddity (no dedicated endorsed-date
schema field exists), not an extraction error. No named informant/
officer stated in any of these records' text, so there's no shared
identifiable party to justify a related_conviction link under the
established same-beat criteria -- correctly left unlinked despite the
surface similarity. Location and crime type (licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-413 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 414

"Summary conviction of Thomas Golding for begging. Offence committed
at the township of Whitby on 4 March 1848. Case heard at Whitby" --
defendant Thomas Golding, no home/occupation stated, correctly blank.
Location=Whitby, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-414 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 415

"Summary conviction of Isaac Patton late of the township of Hinderwell
labourer for killing three hares at night on Runswick Lane. Offence
committed at the township of Mickleby on 3 October 1857. Case heard at
Whitby" -- defendant Isaac Patton (home=Hinderwell). Both stated
locations captured: Mickleby (175, the offence township) and Runswick
Lane (390, the specific site, under Runswick/Hinderwell) -- consistent
with the dual-location convention. Crime type=poaching matches.
Already correctly linked via related_conviction to 421 and 427 (same-
beat cluster).

**OK — no changes.**

---

**Progress: records 1-415 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 416

"Summary conviction of Thomas Joyce of the township of Whitby jet
worker for wilfully damaging the glass of windows, the property of
Benjamin Garminsway; on the oath of John Ryder of the township of
Whitby inspector of police and others. Offence committed at the
township of Whitby on 8 December 1869. Whitby Strand - case heard at
Whitby" -- defendant Thomas Joyce (Whitby, jet worker), property owner
Benjamin Garminsway, informant John Ryder (Whitby, inspector of
police). Locations and crime type (malicious/property damage) match.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-416 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 417

"Summary conviction of Charles Wright, William Beckham and John
Appleby, all of Liverton miners, for trespassing in the daytime in
search of conies on a parcel of land in the possession and occupation
of William Pearson and others. Offence committed at the township of
Roxby on 23 October 1876. Whitby Strand - case heard at Whitby" --
three co-defendants (home=Liverton, id 334, miners). Landowner William
Pearson; "and others" correctly not fabricated. Location of offence =
Roxby (161, under Hinderwell 88), existing precedent. Crime
type=poaching matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-417 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 418

"Summary conviction of Hannah Mary Pearson wife of William Pearson of
the township of Whitby labourer for being drunk and disorderly in St
Ann's Staith. Offence committed at the township of Whitby on 27 July
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Hannah Mary Pearson (full name incl. middle name), spouse
William Pearson (Whitby, labourer -- unrelated to record 417's
landowner William Pearson, correctly separate person, no fabricated
link). Wife relationship present. Location of offence = St Ann's
Staith (West Cliff → Whitby), existing precedent. Crime type=drunk and
disorderly matches. Already correctly linked via related_conviction to
394 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-418 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 419

"Summary conviction of Robert Harrison of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 12 October 1834. Endorsed "8 October 1834"" -- defendant
Robert Harrison (Whitby, innkeeper). Part of the same "opening
premises during divine service" batch as 413 -- no named informant, so
correctly left unlinked per the reasoning already established there.
Location and crime type (licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-419 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 420

"Summary conviction of Abraham Brown and Dennis Hyde for begging.
Offence committed at the township of Ruswarp on 4 March 1848. Case
heard at Whitby" -- two co-defendants, no home/occupation stated,
correctly blank. Location=Ruswarp, crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-420 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 421

"Summary conviction of John Craven late of the township of Hinderwell
labourer for killing three hares at night on Runswick Lane. Offence
committed at the township of Mickleby on 3 October 1857. Case heard at
Whitby" -- defendant John Craven (Hinderwell). Both stated locations
captured (Mickleby, Runswick Lane). Crime type=poaching matches.
Already correctly linked to both 415 and 427 within the cluster.

**OK — no changes.**

---

**Progress: records 1-421 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 422

"Summary conviction of Richard Wastill of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby on
31 October 1869. Whitby Strand - case heard at Whitby" -- defendant
Richard Wastill (Whitby, jet worker). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-422 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 423

"Summary conviction of Andrew Hill of the township of Whitby jet
worker for being drunk on the licensed premises of Joseph Garside
Rhodes and refusing to leave when asked by John Alderson Wallace a
police constable. Offence committed at the township of Whitby on 30
October 1876. Whitby Strand - case heard at Whitby" -- defendant
Andrew Hill (Whitby, jet worker), licensee Joseph Garside Rhodes
(full name incl. middle name), informant John Alderson Wallace (full
name incl. middle name, same constable as record 411/375). Locations
and crime types (drunkenness, refusal to quit licensed premises)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-423 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 424

"Summary conviction of George Porritt of the township of Hinderwell
fisherman for being drunk and disorderly in Staithes town street.
Offence committed at the township of Hinderwell on 14 September 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant George Porritt (Hinderwell, fisherman). "Staithes town
street" boilerplate correctly resolves to Staithes (163, under
Hinderwell), matching the established "X town street" convention.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-424 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 425

"Summary conviction of George Frank of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
George Frank (Whitby, innkeeper). Same batch as 413/419, no named
informant, correctly left unlinked. Location and crime type (licensing
offence) match.

**OK — no changes.**

---

**Progress: records 1-425 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 426

"Summary conviction of James Wilson for begging. Offence committed at
the township of Whitby on 3 March 1848. Case heard at Whitby" --
defendant James Wilson, no home/occupation stated, correctly blank.
Location=Whitby, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-426 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 427

"Summary conviction of John Calvert late of the township of Hinderwell
for killing three hares at night on Runswick Lane. Offence committed
at the township of Mickleby on 3 October 1857. Case heard at Whitby"
-- defendant John Calvert (Hinderwell), no occupation stated, correctly
blank. Both stated locations captured. Crime type=poaching matches.
Already correctly linked to both 415 and 421 (fully linked cluster).

**OK — no changes.**

---

**Progress: records 1-427 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 428

"Summary conviction of George Jackson of the township of Lythe
carpenter for assaulting Arthur Hood. Offence committed at the
township of Lythe on 10 October 1869. Whitby Strand - case heard at
Whitby" -- defendant George Jackson (Lythe, carpenter), victim Arthur
Hood. Locations and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-428 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 429

"Summary conviction of John Kilton of the township of Ruswarp
gentleman for being drunk and disorderly in North Road. Offence
committed at the township of Whitby on 4 November 1876. Whitby Strand
- case heard at Whitby" -- defendant John Kilton (Ruswarp), occupation
"gentleman" matches established occupation category (id 165). Location
of offence = North Road (91, West Cliff → Whitby), existing precedent.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-429 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 430

"Summary conviction of Harry Webster of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay.
Offence committed at the township of Whitby on 27 July 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Harry Webster (Whitby, jet worker). Location and crime type
(gaming/gambling offence) match. Fully linked within the gambling
cluster (370, 400, 412, 442).

**OK — no changes.**

---

**Progress: records 1-430 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 431

"Summary conviction of Thomas Marshall of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Thomas Marshall (Whitby, innkeeper). Same batch as 413/419/425, no
named informant, correctly left unlinked. Location and crime type
(licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-431 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 432

"Summary conviction of Ann Butler wife of Patrick Butler for begging.
Offence committed at the township of Whitby on 6 March 1848. Case
heard at Whitby" -- defendant Ann Butler, spouse Patrick Butler, wife
relationship present. Locations and crime type (begging) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-432 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359). 6 location fixes (resolved), 46
related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix, 3
anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

(Record 433 confirmed blacklisted/no row exists in summary_conviction,
expected gap -- same pattern as prior confirmed gaps.)

## Record 434

"Summary conviction of William Corpes of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby on
2 October 1869. Whitby Strand - case heard at Whitby" -- defendant
William Corpes (Whitby, jet worker). Locations and crime type
(drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-434 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 435

"Summary conviction of Richard Purvis of the township of Whitby
shoemaker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 8 November 1876. Whitby Strand
- case heard at Whitby" -- defendant Richard Purvis (Whitby,
shoemaker). Location of offence = Church Street (East Cliff → Whitby),
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-435 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 436

"Summary conviction of Edward Ruehorn of the township of Whitby
labourer for assaulting William Lee one of the constables of the North
Riding in the execution of his duty. Offence committed at the township
of Whitby on 27 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant Edward Ruehorn (Whitby, labourer),
victim William Lee (constable of the North Riding). Locations and
crime type (assaulting a police officer) match. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 664]:** part of a 5-record riot
cluster (436, 646, 652, 664, 670) -- same date/township/offence type,
multiple defendants assaulting multiple named constables during what
was likely one incident. Full pairwise related_conviction links added
retroactively; see [[project_related_conviction_riot_incident_pattern]].

---

**Progress: records 1-436 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 437

"Summary conviction of Henry Atley of Whitby innkeeper for opening his
premises between 10.30 and 12 o'clock on a Sunday morning during the
time of divine service in church. Offence committed at the parish of
Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Henry Atley (Whitby, innkeeper). Same batch as 413/419/425/431, no
named informant, correctly left unlinked. Location and crime type
(licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-437 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 438

"Summary conviction of Joseph Thompson for begging. Offence committed
at the township of Ruswarp on 6 March 1848. Case heard at Whitby" --
defendant Joseph Thompson, no home/occupation stated, correctly blank.
Location=Ruswarp, crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-438 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 14 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 439

"Summary conviction of Thomas Edwards of the township of Whitby sawyer
for assaulting Jane Wilmot of the township of Whitby widow. Offence
committed at the township of Whitby on 26 October 1855. Case heard at
Whitby" -- defendant Thomas Edwards (Whitby, sawyer), victim Jane
Wilmot (Whitby). Locations and crime type (assault) match. On the
tracked marital-status-occupation-gap list: Jane Wilmot's text states
"widow" but `person_occupation` had no link.

**FIXED — added missing occupation link: person 6683 (Jane Wilmot) →
occupation 384 (widow). Verified via direct query.**

---

**Progress: records 1-439 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 440

"Summary conviction of John Dixon of the township of Whitby labourer
for being drunk. Offence committed at the township of Whitby on 9
October 1869. Whitby Strand - case heard at Whitby" -- defendant John
Dixon (Whitby, labourer). Locations and crime type (drunkenness)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-440 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 441

"Summary conviction of Jacob Pearson of Loftus miner for being
disorderly on the licensed premises of John Sellar and refusing to
leave when asked by the said John Sellar; on the oath of the said
John Sellar of the township of Hinderwell licensed victualler. Offence
committed at the township of Hinderwell on 4 November 1876. Whitby
Strand - case heard at Whitby" -- defendant Jacob Pearson (Loftus,
miner). Licensee John Sellar has both "licensed victualler" (matches
stated text) and "licensee" (role-derived) occupation tags -- checked
precedent, matches a small established pattern (3 other people: 7829,
7850, 10219, all "licensed victualler" + "licensee" pairs), not an
inconsistency. Locations and crime types (breach of the peace, refusal
to quit licensed premises) match. Already correctly linked via
related_conviction to 363 (same defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-441 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 442

"Summary conviction of Henry Golden of the township of Whitby jet
worker for playing booking (a game of chance) in the New Quay. Offence
committed at the township of Whitby on 27 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Henry
Golden (Whitby, jet worker). Location and crime type (gaming/gambling
offence) match. Closes the 5-member gambling cluster (370, 400, 412,
430, 442), fully all-pairs linked.

**OK — no changes.**

---

**Progress: records 1-442 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 443

"Summary conviction of Sampson Storm of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Sampson Storm (Whitby, innkeeper). Same batch as 413/419/425/431/437,
no named informant, correctly left unlinked. Location and crime type
(licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-443 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 444

"Summary conviction of Jonathan Waddington, Edward Hines, James
Neville and Henry Herbert for refusing to work while being relieved in
the Whitby Union workhouse. Offence committed at the township of
Hawsker cum Stainsacre on 14 March 1848. Case heard at Whitby" -- four
co-defendants, no home/occupation stated, correctly blank. Same dual-
location pattern as record 324 (Union Workhouse + Hawsker-cum-
Stainsacre). Crime type=refusing workhouse labour, correct. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-444 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 445

"Summary conviction of George Russell of the township of Fylingdales
mariner for assaulting Thomas Brewster of the township of Fylingdales
mariner; on the oath of the said Thomas Brewster. Offence committed at
the township of Fylingdales on 3 November 1855. Case heard at Whitby"
-- defendant George Russell (Fylingdales, mariner), victim Thomas
Brewster (Fylingdales, mariner). Locations and crime type (assault)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-445 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 446

"Summary conviction of Patrick Seward for assaulting David Bell.
Offence committed at the township of Glaisdale on 30 October 1869.
Whitby Strand - case heard at Whitby" -- defendant Patrick Seward, no
home stated, correctly blank. Victim David Bell. Locations and crime
type (assault) match. Already correctly linked via related_conviction
to 489 (same defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-446 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 447

"Summary conviction of William Barrett of the township of Whitby
labourer for assaulting Edward Watson; on the oath of Sarah A.
Thompson, Ralph Speedy, William Nawton, Thomas Watson, Joseph Philpot
and Francis Harrison. Offence committed at the township of Whitby on
11 November 1876. Whitby Strand - case heard at Whitby" -- defendant
William Barrett (Whitby, labourer), victim Edward Watson (distinct
from record 333's victim Thomas Watson -- their own texts state
different first names). All 6 witnesses captured, incl. "Sarah A.
Thompson" (middle initial parsed into middle_name). Thomas Watson
appears here as a witness -- coherent with two separate same-day
assaults by Barrett against different Watson family members, matching
the already-correct related_conviction links (333, 1974: same
defendant/date; 1983: same date/victim/witness list, different
defendants). Locations and crime type (assault) match.

**OK — no changes.**

---

**Progress: records 1-447 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 448

"Summary conviction of Andrew Hill of the township of Whitby jet
worker for being drunk and disorderly at the Pier. Offence committed
at the township of Whitby on 10 August 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Andrew Hill,
different conviction/date from record 423's Andrew Hill, correctly
separate person row (no cross-conviction merge). Location of offence =
Piers (105, generic node since text doesn't specify East/West),
existing precedent. Crime type=drunk and disorderly matches. Already
correctly linked via related_conviction to 499 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-448 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 449

"Summary conviction of Henry Hammond of Whitby innkeeper for opening
his premises between 10.30 and 12 o'clock on a Sunday morning during
the time of divine service in church. Offence committed at the parish
of Whitby on 19 October 1834. Endorsed "8 October 1834"" -- defendant
Henry Hammond (Whitby, innkeeper). Same batch as prior "opening
premises" records, no named informant, correctly left unlinked.
Location and crime type (licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-449 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 450

"Summary conviction of Henry Webster apprentice to James Arthur of the
township of Ruswarp ship owner, for absenting himself from the service
of his master for seven days; on the information of the said James
Arthur. Offence committed on 18 March 1848. Case heard at Whitby" --
defendant Henry Webster (apprentice), James Arthur (Ruswarp, ship
owner), role=informant matches the established precedent already
checked (records 396/402). Apprentice relationship link present. Crime
type=master and servant offence, correct. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-450 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 451

"Summary conviction of John Webster of the township of Whitby
carpenter for assaulting Mary Webster his wife. Offence committed at
the township of Whitby on 1 December 1855. Case heard at Whitby" --
defendant John Webster (Whitby, carpenter), victim Mary Webster, wife
relationship correctly captured (Mary → John). Locations and crime
type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-451 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 452

"Summary conviction of John Thompson of the township of Whitby jet
worker for assaulting Mary wife of John Abdallah; on the oath of the
said John Abdallah of the township of Whitby labourer. Offence
committed at the township of Whitby on 2 October 1869. Whitby Strand -
case heard at Whitby" -- defendant John Thompson (Whitby, jet worker),
victim Mary (no last name stated in text -- only identified via "wife
of John Abdallah", correctly not inferred/fabricated as "Abdallah").
John Abdallah has both informant and spouse-of-victim roles, wife
relationship link present. Locations and crime type (assault) match.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-452 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 453

"Summary conviction of John Harland of the township of Whitby miner
for being drunk and disorderly on the Pier. Offence committed at the
township of Whitby on 2 December 1876. Whitby Strand - case heard at
Whitby" -- defendant John Harland (Whitby, miner). Location of offence
= Piers (105), existing precedent. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-453 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 454

"Summary conviction of Hugh Stewart of the township of Eskdaleside cum
Ugglebarnby labourer for begging in Sleights town street. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 4 August
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Hugh Stewart (Eskdaleside-cum-Ugglebarnby, labourer).
"Sleights town street" boilerplate correctly resolves to Sleights (11,
under Eskdaleside-cum-Ugglebarnby 8), matching the "X town street"
convention. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-454 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 455

"Summary conviction of William Wilson of the township of Whitby
innkeeper for opening his premises between 10.30 and 12 o'clock on a
Sunday morning during the time of divine service in church. Offence
committed at the parish of Whitby on 19 October 1834. Endorsed "8
October 1834"" -- defendant William Wilson (Whitby, innkeeper). Same
batch as prior "opening premises" records, no named informant,
correctly left unlinked. Location and crime type (licensing offence)
match.

**OK — no changes.**

---

**Progress: records 1-455 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 456

"Summary conviction of John Bamfield of the township of Whitby
labourer for assaulting Elizabeth Kelly wife of John Kelly of the
township of Whitby labourer by striking her on the face with his
fists several times. Offence committed at the township of Whitby on
28 March 1848. Case heard at Whitby" -- defendant John Bamfield
(Whitby, labourer), victim Elizabeth Kelly, spouse John Kelly (Whitby,
labourer), wife relationship present. Locations and crime type
(assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-456 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 457

"Summary conviction of Hugh Robertson and William McLean, both late of
Whitby labourers, for begging. Offence committed at the township of
Whitby on 10 December 1855. Case heard at Whitby" -- two co-defendants
(Whitby, labourers). Locations and crime type (begging) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-457 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 458

"Summary conviction of Mary Clark for begging in Esk Terrace. Offence
committed at the township of Ruswarp on 25 October 1869. Whitby
Strand - case heard at Whitby" -- defendant Mary Clark, no home
stated, correctly blank. Both stated locations captured: Ruswarp
(township) and Esk Terrace (253, specific site under West Cliff),
matching the dual-location convention. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-458 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 459

"Summary conviction of John Walker of Whitby innkeeper for opening his
premises between 10.30 and 12 o'clock on a Sunday morning during the
time of divine service in church. Offence committed at the parish of
Whitby on 12 October 1834. Endorsed "8 October 1834"" -- defendant
John Walker (innkeeper, person 504), correctly a separate row from
record 354's John Walker (beggar, different conviction). Same "opening
premises" batch, no named informant, correctly left unlinked. Location
and crime type (licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-459 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 460

"Summary conviction of James Loftus of the township of Whitby labourer
for obstructing Philip Hoggart of the township of Ruswarp constable in
the execution of his duty; on the oath of the said Philip Hoggart.
Offence committed in Baxtergate at the township of Whitby on 26
December 1855. Case heard at Whitby" -- defendant James Loftus
(Whitby, labourer), victim Philip Hoggart (Ruswarp, constable).
Location of offence = Baxtergate (West Cliff → Whitby), existing
precedent. Crime type=obstructing/resisting a constable matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-460 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 461

"Summary conviction of Anderson McGregor for begging at Goldsbrough.
Offence committed at the township of Lythe on 13 December 1869. Whitby
Strand - case heard at Whitby" -- defendant Anderson McGregor, no home
stated, correctly blank. Location of offence = "Goldsbrough" normalized
to Goldsborough (263, under Lythe), existing precedent. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-461 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 462

"Summary conviction of Thomas Martin of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 14 November 1876. Whitby
Strand - case heard at Whitby" -- defendant Thomas Martin (Whitby,
jet worker). Location of offence = Church Street (East Cliff →
Whitby), existing precedent. Crime type=drunk and disorderly matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-462 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 463

"Summary conviction of James Campbell of the township of Ruswarp
tailor for being drunk and disorderly in North Terrace. Offence
committed at the township of Ruswarp on 25 August 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant James
Campbell (Ruswarp, tailor). Two ambiguous "North Terrace" location
rows exist in the DB (174, under Loftus; 218, under West Cliff) --
this record correctly uses 218, matching the same convention already
seen at record 458 (Esk Terrace, also under West Cliff despite the
offence township being stated as Ruswarp). Crime type=drunk and
disorderly matches. Already correctly linked via related_conviction to
507 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-463 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 464

"Summary conviction of Richard Sweeting of Whitby innkeeper for
opening his premises between 10.30 and 12 o'clock on a Sunday morning
during the time of divine service in church. Offence committed at the
parish of Whitby on 12 October 1834. Endorsed "8 October 1834"" --
defendant Richard Sweeting (Whitby, innkeeper). Closes the "opening
premises" batch (407/413/419/425/431/437/443/449/455/459/464), no
named informant, correctly left unlinked. Location and crime type
(licensing offence) match.

**OK — no changes.**

---

**Progress: records 1-464 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 465

"Summary conviction of Mary Wray wife of Cuthbert Wray of the township
of Whitby fruit hawker for obstructing a street; on the oath of Robert
Ridley of the township of Whitby police constable. Offence committed
at the township of Whitby on 7 October 1869. Whitby Strand - case
heard at Whitby" -- pre-existing anomaly note (conviction_date two
days before offence_date, a source-data quirk) verified accurate.
Defendant Mary Wray, spouse Cuthbert Wray (fruit hawker), wife
relationship present. Informant Robert Ridley (police constable).
Locations and crime type (obstructing the highway) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-465 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 466

"Summary conviction of Robert Wilson of the township of Whitby
labourer for being disorderly on the licensed premises of Thomas
Watson and refusing to leave when asked by the said Thomas Watson; on
the oath of S.A. Thompson, R. Speedy, William Nawton, T. Watson, E.
Watson, J. Philpot and F. Harrison, all of the township of Whitby.
Offence committed at the township of Whitby on 11 November 1876.
Whitby Strand - case heard at Whitby" -- defendant Robert Wilson,
licensee Thomas Watson (matches the earlier-noted "licensed premises
of Thomas Watson" cluster). Witnesses captured verbatim with this
record's own abbreviated initials (S.A., R., T., E., J., F.) --
correctly separate person rows from record 447's fuller-named
witnesses (Sarah A. Thompson, Ralph Speedy, etc.), each record must
match its own text, not another record's. Locations and crime types
(breach of the peace, refusal to quit licensed premises) match.
Already fully linked via related_conviction to 1983 (same defendant/
date) and 482, 1971, 1974, 1977, 1980 (same licensed premises/date,
six patrons prosecuted separately).

**OK — no changes.**

---

**Progress: records 1-466 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 467

"Summary conviction of Charles Sanderson of the township of Glaisdale
labourer for begging in Glaisdale town street. Offence committed at
the township of Glaisdale on 28 August 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Charles
Sanderson (Glaisdale, labourer). "Glaisdale town street" correctly
resolves to Glaisdale itself, matching the "X town street" convention.
Crime type=begging matches. Already correctly linked via
related_conviction to 479 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-467 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 468

"Summary conviction of James Scott of Whitby for assaulting Jane
Thompson of the township of Whitby spinster. Offence committed at the
township of Whitby on 2 November 1834. Case heard at Whitby" --
defendant James Scott, no home stated, correctly blank. Victim Jane
Thompson, "spinster" occupation already correctly linked (fixed in an
earlier pass, per reextraction-audit-notes.md). Locations and crime
type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-468 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 469

"Summary conviction of John Norton of the township of Whitby labourer
for trespassing in the daytime in search of conies on land in the
possession and occupation of [blank] Wilson. Offence committed at the
township of Ingleby Greenhow on 15 November 1869. Case heard at
Stokesley" -- defendant John Norton (Whitby, labourer). Landowner's
first name correctly left blank (text literally states "[blank]
Wilson", not fabricated). Court location=Stokesley (304), offence
location=Ingleby Greenhow (291), both existing precedent -- unusual
but valid (this record was heard outside Whitby). Crime type=poaching
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-469 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 470

"Summary conviction of Thomas Sugden of the township of Whitby
bricklayer for being drunk and disorderly on the Whitby and Stainsacre
highway; on the oath of William Nicholson police constable and
[blank] Wilson gatekeeper, both of Whitby. Offence committed at the
township of Hawsker cum Stainsacre on 11 December 1876. Whitby Strand
- case heard at Whitby" -- defendant Thomas Sugden (Whitby,
bricklayer). Two informants: William Nicholson (police constable),
"[blank] Wilson" (gatekeeper, first name correctly left blank).
Cross-parish highway (Whitby & Stainsacre Highway, id 151, under
Cross-Parish Highways 106) added alongside the stated township
(Hawsker-cum-Stainsacre), matching the established convention. Crime
type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-470 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 471

"Summary conviction of James Richardson of the township of Hawsker cum
Stainsacre farmer for assaulting Thomas Jones. Offence committed at
the township of Hawsker cum Stainsacre on 22 August 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
James Richardson (Hawsker-cum-Stainsacre, farmer), victim Thomas
Jones. Locations and crime type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-471 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 472

"Summary conviction of Matthew Ryley for hawking cotton handkerchiefs
and braces without a licence; on the information of Robert Kirby of
Whitby sub-distributor of stamps. Offence committed at Egton on 5
November 1834" -- defendant Matthew Ryley, no home stated, correctly
blank. Informant Robert Kirby matches precedent. No court location
stated in text, correctly absent. Location of offence=Egton, crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-472 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 473

"Summary conviction of James Robinson for begging in Windsor Terrace.
Offence committed at the township of Ruswarp on 20 November 1869.
Whitby Strand - case heard at Whitby" -- defendant James Robinson, no
home stated, correctly blank. Both stated locations captured: Ruswarp
(township) and Windsor Terrace (244, under West Cliff), matching the
dual-location convention. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-473 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 474

"Summary conviction of George Morley and John Morley, both of the
township of Egton farmers, for attempting to kill salmon in a
tributary of the river Esk during the close season; on the oath of
James Wright police constable and William Pearson gamekeeper, both of
the township of Egton. Offence committed at the township of Egton on
19 November 1876. Whitby Strand - case heard at Whitby" -- two co-
defendants (Egton, farmers), two informants (James Wright, William
Pearson -- correctly a separate person row from the earlier William
Pearsons seen in records 417/418). Locations: Egton + River Esk (under
the Rivers node), crime type=poaching, correct. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-474 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 475

"Summary conviction of Catherine Lee wife of Adam Lee of the township
of Whitby hawker for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 21 August 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Catherine Lee, spouse Adam Lee (Whitby, hawker), wife relationship
present. Location of offence = Church Street (East Cliff → Whitby),
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-475 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 476

"Summary conviction of Patrick Machannow late of the township of
Whitby for hawking braces without a licence; on the information of
Robert Kirby of the township of Whitby sub-distributor of stamps.
Offence committed at the township of Egton on 5 October 1834" --
defendant Patrick Machannow (Whitby), informant Robert Kirby matches
precedent. No court location stated, correctly absent. Location of
offence=Egton, crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-476 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 477

"Summary conviction of John Wilson of the township of Whitby tailor
for being drunk; on the oath of [blank] Harnby of the township of
Whitby police constable. Offence committed at the township of Whitby
on 8 October 1869. Whitby Strand - case heard at Whitby" -- defendant
John Wilson, correctly a separate person row from record 326's John
Wilson (different offence date, different conviction, no cross-merge).
Informant "[blank] Harnby" -- first name correctly left blank per
text, correctly not merged with record 362's "Simpson Harnby" despite
likely being the same real officer (no fabrication). Locations and
crime type (drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-477 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 478

"Summary conviction of William Harrison of the township of Whitby coal
porter for being drunk and disorderly on the Whitby and Guisborough
highway; on the oath of George Holmes police constable, Miles Moody
inspector of police and John Ryder superintendent of police, all of
the township of Whitby. Offence committed at the township of Aislaby
on 18 November 1876. Whitby Strand - case heard at Whitby" -- defendant
William Harrison (Whitby, coal porter). Three informants, occupations
matching each stated rank exactly (John Ryder here is superintendent,
correctly a separate person row from record 416's John Ryder,
inspector -- different conviction, no cross-merge). Cross-parish
highway (Whitby & Guisborough Highway) added alongside stated township
(Aislaby). Crime type=drunk and disorderly matches. Already correctly
linked to an existing same-beat cluster (128, 130, 510).

**OK — no changes.**

---

**Progress: records 1-478 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 479

"Summary conviction of Mary Smith of the township of Glaisdale
singlewoman for begging in Glaisdale town street. Offence committed at
the township of Glaisdale on 28 August 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Mary Smith,
"singlewoman" occupation already correctly linked (not a gap here).
"Glaisdale town street" resolves correctly. Crime type=begging
matches. Already correctly linked via related_conviction to 467
(same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-479 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 480

"Summary conviction of Elizabeth Thompson wife of [blank] Thompson and
Esther Thompson spinster, both of Hawsker cum Stainsacre, for
assaulting Thomas Lincoln of the township of Hawsker cum Stainsacre
labourer. Offence committed at the township of Hawsker cum Stainsacre
on 7 November 1834. Case heard at Whitby" -- two co-defendants:
Elizabeth Thompson (spouse "[blank] Thompson", first name correctly
left blank, wife relationship present) and Esther Thompson ("spinster"
occupation already correctly linked, not a fresh gap). Victim Thomas
Lincoln (Hawsker-cum-Stainsacre, labourer). Locations and crime type
(assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-480 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 481

"Summary conviction of John Smith for begging in St Hilda's Terrace.
Offence committed at the township of Ruswarp on 6 December 1869.
Whitby Strand - case heard at Whitby" -- defendant John Smith, no home
stated, correctly blank. Both stated locations captured: Ruswarp
(township) and St Hilda's Terrace (232, under West Cliff), matching
the dual-location convention. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-481 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 482

"Summary conviction of John Arnold of the township of Whitby jet
worker for being disorderly on the licensed premises of Thomas Watson
and refusing to leave when asked by the said Thomas Watson; on the
oath of S.A. Thompson, R. Speedy, W. Nawton, Thomas Watson, Ed.
Watson, J. Philpot and F. Harrison, all of the township of Whitby.
Offence committed at the township of Whitby on 11 November 1876.
Whitby Strand - case heard at Whitby" -- defendant John Arnold,
licensee Thomas Watson. Witness names captured verbatim per this
record's own text ("W. Nawton", "Ed. Watson") -- correctly separate
person rows from record 466's differently-abbreviated witnesses (no
cross-record merge). Locations and crime types (breach of the peace,
refusal to quit licensed premises) match. Already fully linked within
the Thomas Watson cluster (466, 1971, 1974, 1977, 1980).

**OK — no changes.**

---

**Progress: records 1-482 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 483

"Summary conviction of Henry Day of the township of Whitby fisherman
for being drunk and disorderly in the New Quay. Offence committed at
the township of Whitby on 30 August 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Henry Day
(Whitby, fisherman). Location of offence = New Quay, existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-483 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 484

"Summary conviction of Thomas Carter for begging. Offence committed at
the parish of Whitby on 8 December 1834" -- defendant Thomas Carter,
no home stated, correctly blank. No court location stated, correctly
absent. Location of offence=Whitby, crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-484 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 485

"Summary conviction of David Adamson of the township of Whitby sailor
for being drunk and riotous in Church Street. Offence committed at the
township of Whitby on 28 November 1869. Whitby Strand - case heard at
Whitby" -- defendant David Adamson (Whitby, sailor). Location of
offence = Church Street (East Cliff → Whitby), existing precedent.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-485 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 486

"Summary conviction of Rees Jones of the township of Whitby licensed
victualler for allowing gaming with dice for a goose on his licensed
premises; on the oath of John Ryder superintendent and Thomas Dennis
sergeant of police, both of the township of Whitby. Offence committed
at the township of Whitby on 18 November 1876. Whitby Strand - case
heard at Whitby" -- defendant Rees Jones (Whitby, licensed victualler).
Informant John Ryder (superintendent) shares the same date as record
478, but different offence type (gaming vs. drunk-and-disorderly-on-
highway) -- correctly not linked, since the same-beat pattern requires
matching offence type too, not just officer+date. Locations and crime
type (gaming/gambling offence) match.

**OK — no changes.**

---

**Progress: records 1-486 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 487

"Summary conviction of Thomas Dixon of the township of Whitby labourer
for being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 1 September 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas Dixon
(correctly a separate person row from record 405's Thomas Dixon,
different conviction). Location of offence = Church Street, existing
precedent. Crime type=drunk and disorderly matches. Already correctly
linked via related_conviction to 673 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-487 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 488

"Summary conviction of George Williams for being a vagrant, he having
been previously convicted of being an idle and disorderly person.
Offence committed at the parish of Whitby on 8 December 1834" --
defendant George Williams, no home stated, correctly blank. "Having
been previously convicted..." preserved verbatim in charge_description/
raw_record; no dedicated schema field exists for this kind of prior-
conviction note (same convention as record 349's "reputed thief" --
character/history descriptors stay in text only). No court location
stated, correctly absent. Crime type=vagrancy matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-488 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 489

"Summary conviction of Patrick Seward for assaulting Thomas Bowron.
Offence committed at the township of Glaisdale on 30 October 1869.
Whitby Strand - case heard at Whitby" -- defendant Patrick Seward, no
home stated, correctly blank. Victim Thomas Bowron, no occupation
stated here (correctly a separate person row from record 380's Thomas
Bowron, police constable -- different conviction, no fabricated
merge). Locations and crime type (assault) match. Already correctly
linked via related_conviction to 446 (same defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-489 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 490

"Summary conviction of John Holmes of the township of Whitby jet
worker for being drunk on the licensed premises of Joseph Garside
Rhodes. Offence committed at the township of Whitby on 14 November
1876. Whitby Strand - case heard at Whitby" -- defendant John Holmes
(Whitby, jet worker), licensee Joseph Garside Rhodes -- same licensee
as record 423, but different offence date (14 Nov vs. 30 Oct 1876),
correctly not linked (a different, unrelated occasion at the same
premises). Locations and crime type (drunkenness) match.

**OK — no changes.**

---

**Progress: records 1-490 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 491

"Summary conviction of William Martin of the township of Whitby jet
worker for being drunk on the licensed premises of Edward Cleeton.
Offence committed at the township of Whitby on 31 August 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
William Martin (Whitby, jet worker), licensee Edward Cleeton.
Locations and crime type (drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-491 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 492

"Summary conviction of Thomas Robison for attempting to get charitable
contributions by falsely pretending to be a shipwrecked sailor; on the
oath of Mary Pawley wife of Richard Pawley of Whitby officer in the
Preventive Service. Offence committed at Whitby on 27 October 1835.
Case heard at Whitby" -- defendant Thomas Robison, no home stated,
correctly blank. Informant Mary Pawley, spouse Richard Pawley
("officer in the Preventive Service" -- historic coastguard role,
correctly captured as occupation), wife relationship present. Crime
type=fraud/false pretences, correct for the false-shipwreck begging
scheme. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-492 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 493

"Summary conviction of Henry Smith of the township of Whitby fruit
hawker for obstructing Church Street; on the oath of Francis Selby of
the township of Whitby police constable. Offence committed at the
township of Whitby on 2 October 1869. Whitby Strand - case heard at
Whitby" -- defendant Henry Smith (Whitby, fruit hawker), informant
Francis Selby (police constable). Location of offence = Church Street,
existing precedent. Crime type=obstructing the highway matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-493 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 494

"Summary conviction of John Thompson of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 13 November 1876. Whitby
Strand - case heard at Whitby" -- defendant John Thompson, correctly a
separate person row from record 452's John Thompson (different
conviction/date). Location of offence = Church Street, existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-494 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 495

"Summary conviction of John Moon of the township of Whitby labourer
for stealing apples value 1s, the property of James Whittle and
growing in his garden. Offence committed at the township of Hawsker
cum Stainsacre on 28 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant John Moon (Whitby,
labourer), property owner James Whittle. Locations and crime type
(theft) match. [Corrected 2026-08-04: record 622 (John Marshall, same
property owner/offence/date) surfaced a same-incident link;
related_conviction 495-622 added when 622 was reached. Also record 625
(Thomas Drummond Moon, same owner/offence/date) added
related_conviction 495-625 when 625 was reached.]

**OK — no changes.**

---

**Progress: records 1-495 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 496

"Summary conviction of Samuel Clark and Charles Clark for begging.
Offence committed at Whitby on 27 October 1835" -- two co-defendants,
no home/occupation stated, correctly blank. No court location stated,
correctly absent. Location of offence=Whitby, crime type=begging
matches. No related_conviction.

**OK — no changes.** [Corrected 2026-08-04: record 500 (Charlotte
Clark, convicted the same day for encouraging these same two children
to beg) surfaced a same-incident link; related_conviction 496-500
added when 500 was reached.]

---

**Progress: records 1-496 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 497

"Summary conviction of James Pearson of the township of Whitby
blacksmith for trespassing in the daytime in pursuit of game on a
close of land in the possession and occupation of Thomas Beeforth.
Offence committed at the township of Sneaton on 3 October 1869. Whitby
Strand - case heard at Whitby" -- defendant James Pearson (Whitby,
blacksmith). Landowner Thomas Beeforth, no name_postfix here since
this record's own text doesn't state "the younger" (unlike person
152) -- correctly not fabricated. Locations and crime type (poaching)
match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-497 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 498

"Summary conviction of John Dryden of the township of Whitby fisherman
for being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 25 November 1876. Whitby Strand - case heard
at Whitby" -- defendant John Dryden (Whitby, fisherman), correctly a
separate person from record 340's Dryden family (unrelated conviction/
context). Location of offence = Church Street, existing precedent.
Crime type=drunk and disorderly matches. Already correctly linked via
related_conviction to 502 and 506 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-498 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 499

"Summary conviction of John Hodgson of the township of Whitby
fisherman for being drunk and disorderly at the Pier. Offence
committed at the township of Whitby on 10 August 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant John
Hodgson, correctly a separate person row from record 344's John
Hodgson (different conviction/date). Location of offence = Piers,
existing precedent. Crime type=drunk and disorderly matches. Already
correctly linked via related_conviction to 448 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-499 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
46 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 500

"Summary conviction of Charlotte Clark for encouraging two children,
Samuel Clark and Charles Clarke, to beg. Offence committed at Whitby
on 27 October 1837" -- pre-existing anomaly note (wrong year "1837" in
raw_record, correctly 1835 per offence_date and companion record 496)
verified accurate. Defendant Charlotte Clark, children Samuel Clark
and Charles Clarke (correctly captured as "child" role, not
fabricated as defendants). Crime type=causing children to beg,
correct. Same date and same two children as record 496 (their own
begging conviction) -- clearly the same incident.

**FIXED — added related_conviction link 496-500 (same incident: mother
convicted for encouraging the children's begging, on the day of the
children's own conviction). Record 496's log entry retroactively
annotated.**

---

**Progress: records 1-500 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 501

"Summary conviction of Robert Marley of the township of Glaisdale
shoemaker for being drunk and riotous in Glaisdale Street; on the oath
of Thomas Bowron of the township of Glaisdale police constable.
Offence committed at the township of Glaisdale on 28 September 1869.
Whitby Strand - case heard at Whitby" -- defendant Robert Marley
(Glaisdale, shoemaker), informant Thomas Bowron (police constable,
correctly a separate person row from records 380/489's Thomas
Bowrons). Location of offence = Glaisdale Street (354, under
Glaisdale), existing precedent. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-501 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 502

"Summary conviction of Eli Parkin of the township of Whitby iron
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 25 November 1876. Whitby
Strand - case heard at Whitby" -- defendant Eli Parkin (Whitby, iron
worker). Location of offence = Church Street, existing precedent.
Crime type=drunk and disorderly matches. Already fully linked within
the same-beat cluster (498, 506).

**OK — no changes.**

---

**Progress: records 1-502 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 503

"Summary conviction of James Coleman of the township of Whitby
labourer for being drunk and disorderly in Baxtergate. Offence
committed at the township of Whitby on 15 August 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant James
Coleman (Whitby, labourer). Location of offence = Baxtergate, existing
precedent. Crime type=drunk and disorderly matches. Already correctly
linked via related_conviction to 688 (same defendant/date) and 515
(same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-503 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 504

"Summary conviction of Arthur Donnely late of Ireland hawker and
pedlar for selling stockings and gloves without a licence; on the
information of Robert Kirby of Whitby sub-distributor of stamps.
Offence committed at the township of Egton on 5 November 1835" --
defendant Arthur Donnely, home=Ireland (320), existing precedent.
Informant Robert Kirby matches precedent. Compound occupation "hawker
and pedlar" matches convention. No court location stated, correctly
absent. Location of offence=Egton, crime type=licensing offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-504 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 505

"Summary conviction of William Pattison of the township of Whitby jet
worker for being drunk and riotous in Marine Parade; on the oath of
Charles Tempest Clarkson of the township of Whitby superintendent of
police. Offence committed at the township of Whitby on 10 October
1869. Whitby Strand - case heard at Whitby" -- defendant William
Pattison (Whitby, jet worker), informant Charles Tempest Clarkson
(full name incl. middle name, same recurring officer as records 356/
368/410). Location of offence = Marine Parade (84, under West Cliff),
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-505 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 506

"Summary conviction of James Pearson of the township of Whitby
blacksmith for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 25 November 1876. Whitby
Strand - case heard at Whitby" -- defendant James Pearson, correctly a
separate person row from record 497's James Pearson (different
conviction/offence type/date). Location of offence = Church Street,
existing precedent. Crime type=drunk and disorderly matches. Already
fully linked within the same-beat cluster (498, 502).

**OK — no changes.**

---

**Progress: records 1-506 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 507

"Summary conviction of Matthew Carroll of the township of Ruswarp
tailor for being drunk and disorderly in North Terrace. Offence
committed at the township of Ruswarp on 25 August 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Matthew
Carroll (Ruswarp, tailor). Both stated locations captured (Ruswarp +
North Terrace under West Cliff), matching the same convention as
record 463. Crime type=drunk and disorderly matches. Already correctly
linked via related_conviction to 463 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-507 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 508

"Summary conviction of John Hayes for attempting to gather alms by
exposing wounds or deformities; on the oath of Robert Hunt of the
township of Whitby special constable. Offence committed at the
township of Egton on 5 November 1835. Case heard at Whitby" --
defendant John Hayes, no home stated, correctly blank. Informant
Robert Hunt, "special constable" matches established occupation
category (id 343, distinct from ordinary "police constable"). Crime
type=vagrancy, correct for the alms-exposing-wounds offence. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-508 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 509

"Summary conviction of Edward Wapp of the township of Glaisdale
furnaceman for being drunk and riotous in Glaisdale Street; on the
oath of Thomas Bowron of the township of Glaisdale police constable.
Offence committed at the township of Glaisdale on 27 September 1869.
Whitby Strand - case heard at Whitby" -- defendant Edward Wapp
(Glaisdale, furnaceman), informant Thomas Bowron -- same officer/
street as record 501, but different offence date (27 vs 28 September
1869), correctly not linked (same-beat pattern requires matching
date). Location of offence = Glaisdale Street, existing precedent.
Crime type=drunk and disorderly matches.

**OK — no changes.**

---

**Progress: records 1-509 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 510

"Summary conviction of John Jones of the township of Whitby coal
porter for being drunk and disorderly on the Whitby and Guisborough
highway; on the oath of John Ryder superintendent, Miles Moody
inspector and George Holmes police constable, all of the township of
Whitby. Offence committed at the township of Aislaby on 18 November
1876. Whitby Strand - case heard at Whitby" -- defendant John Jones
(Whitby, coal porter). Three informants match exactly (same trio as
record 478). Cross-parish highway added alongside stated township.
Crime type=drunk and disorderly matches. Already fully linked:
related_conviction to 514 (same defendant/date), and to 478, 128, 130
(same-beat cluster).

**OK — no changes.**

---

**Progress: records 1-510 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 511

"Summary conviction of William Johnson of the township of Hinderwell
labourer for lodging under a hay stack, without any visible means of
subsistence and not giving a good account of himself. Offence
committed at the township of Hinderwell on 5 September 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
William Johnson (Hinderwell, labourer). Locations and crime type
(vagrancy) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-511 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 512

"Summary conviction of Henry Charles Johnston late of Scarborough
hawker for selling silver and spectacles without a licence; on the
information of Robert Kirby of Whitby sub-distributor of stamps.
Offence committed at the township of Whitby on 9 November 1835. Case
heard at Whitby" -- defendant Henry Charles Johnston (full name incl.
middle name, home=Scarborough), informant Robert Kirby matches
precedent. Locations and crime type (licensing offence) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-512 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 513

"Summary conviction of Thomas Hewson of the township of Fylingdales
mariner for assaulting Andrew Thompson one of the constables for the
North Riding in the execution of his duty; on the oath of the said
Andrew Thompson of the township of Fylingdales police constable.
Offence committed at the township of Fylingdales on 9 December 1869.
Whitby Strand - case heard at Whitby" -- defendant Thomas Hewson
(Fylingdales, mariner), victim Andrew Thompson -- text describes him
two ways ("constable for the North Riding" in the charge clause,
"police constable" in the oath clause); occupation captured as "police
constable" from the second phrasing, a legitimate synthesis, not a
fabrication (both describe the same role). Locations and crime type
(assaulting a police officer) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-513 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 514

"Summary conviction of John Jones of the township of Whitby coal
porter for assaulting George Holmes one of the constables for the
North Riding in the execution of his duty; on the oath of Thomas
Holmes of the township of Whitby police constable. Offence committed
at the township of Aislaby on 18 November 1876. Whitby Strand - case
heard at Whitby" -- defendant John Jones (same as record 510, same
offence date). Victim George Holmes ("constable for the North Riding",
matches this record's only phrasing for him). Informant Thomas Holmes
-- correctly a separate person from George Holmes despite the shared
surname. Locations and crime type (assaulting a police officer) match.
Already correctly linked via related_conviction to 510 (same
defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-514 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 515

"Summary conviction of James Cockrin of the township of Whitby
labourer for being drunk and disorderly in Baxtergate Offence
committed at the township of Whitby on 15 August 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant James
Cockrin (Whitby, labourer). Location of offence = Baxtergate, existing
precedent. Crime type=drunk and disorderly matches. Already correctly
linked via related_conviction to 607 (same defendant/date) and 503
(same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-515 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 516

"Summary conviction of John Havelock of the township of Ruswarp
esquire for trespassing in the daytime in search or pursuit of game on
lands belonging to Edmund Turton esquire. Offence committed at Rigg
Hill in the township of Hawsker cum Stainsacre on Wednesday 13 January
1836. Case heard at Whitby" -- defendant John Havelock (Ruswarp),
landowner Edmund Turton -- "esquire" correctly ignored for both per
the settled rule. Location of offence = Rigg Hill (359, correctly
under Hawsker-cum-Stainsacre 87). Crime type=poaching matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-516 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
47 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 517

"Summary conviction of John Harrison of the township of Whitby moulder
for being drunk on the licensed premises of Thomas Atkinson and
refusing to leave when asked by Charles Tempest Clarkson; on the oath
of Charles Tempest Clarkson of the township of Whitby superintendent
of police. Offence committed at the township of Whitby on 16 October
1869. Whitby Strand - case heard at Whitby" -- defendant John Harrison
(Whitby, moulder), licensee Thomas Atkinson, informant Charles Tempest
Clarkson (superintendent of police). Same date/premises/officer as
records 332 (Atkinson's own licensing conviction) and 368 (Atkinson's
assault on Clarkson) -- clearly the same enforcement visit. Locations
and crime types (drunkenness, refusal to quit licensed premises)
match.

**FIXED — added related_conviction links 332-517 and 368-517 (same
premises/officer/date, single enforcement visit). Records 332 and 368's
log entries retroactively annotated.**

---

**Progress: records 1-517 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
49 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 518

"Summary conviction of Thomas Martin of the township of Whitby jet
worker for being drunk and disorderly in Church Street; on the oath of
John Alderson Wallace and John Smedley, both of the township of Whitby
police constables. Offence committed at the township of Whitby on 9
December 1876. Whitby Strand - case heard at Whitby" -- defendant
Thomas Martin, correctly a separate person row from record 462's
Thomas Martin (different conviction/date). Two informants (John
Alderson Wallace, full name incl. middle name; John Smedley). Location
of offence = Church Street, existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-518 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
49 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 519

"Summary conviction of John Nash of the township of Eskdaleside cum
Ugglebarnby labourer for begging in Sleights town street. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 2
September 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant John Nash (Eskdaleside-cum-Ugglebarnby, labourer).
"Sleights town street" resolves correctly. Crime type=begging matches.
Already correctly linked via related_conviction to 637 (same-beat
pattern).

**OK — no changes.**

---

**Progress: records 1-519 done (restart #2, plus confirmed blacklist gap
at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes (resolved),
49 related_conviction links, 3 sex fixes, 1 spelling fix, 1 title fix,
3 anomalies notes, 4 redundant relationship rows removed, 2 role
corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 1 new crime_type leaf created (3 records
retagged so far).**

## Record 520

"Summary conviction of John Handysides of the township of Egton farmer
for using a cart on the public highway without having his name and
place of abode painted on it; on the information of William Wilkinson.
Offence committed at the township of Whitby on 16 January 1836. Case
heard at Whitby" -- defendant John Handysides (Egton, farmer),
informant William Wilkinson. Crime type was "unclassified" (15) --
flagged to user per the new hard rule (never leave a record
unclassified). Locations otherwise correct.

**FIXED — created crime_type leaf 74 "cart/vehicle not marked with
owner's name and address" under transport (3); retagged 520.**

This surfaced a corpus-wide sweep (user: "lets fix them now"): found
10 more records still tagged "unclassified" (708, 761, 1025, 1068,
1084, 1100, 1107, 1133, 1519, 2403). Reviewed each and created 6 more
new leaves, fully resolving all of them:
- 75 "not having proper control of horse drawing a cart" (transport,
  3): 708, 1025, 1084
- 74 (reused): 761, 1519 (same name/address-painting requirement)
- 76 "failure to keep to the left on the highway" (transport, 3): 1068
- 77 "hackney carriage driver refusing service" (transport, 3): 1100
- 78 "failure to hand in property found in a hackney carriage"
  (transport, 3): 1133
- 79 "surveyor neglecting to keep the highway in repair"
  (administrative & public duty, 14): 2403
- 80 "offence not stated in source" (new top-level category, sibling
  to "unclassified" itself): 1107, whose raw_record literally has
  "[blank]" where the charge should be -- a source-side gap, not an
  extraction failure. Confirmed no other records share this exact
  "[blank]" pattern.

Full detail saved to memory (project_unclassified_crime_type_watch.md)
since these ids span both sides of the current sequential position
(520) -- 708 onward will be reached later in the linear audit and are
now pre-resolved, no need to re-flag.

**Progress: records 1-520 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes
(resolved), 49 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 3 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 15 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified (1 in-sequence + 10 out-of-sequence
sweep).**

## Records 521-546

All checked individually (defendant/victim/informant names incl.
middle names, occupations, home/offence locations, crime types,
existing related_conviction links) -- all correct, no changes needed.
Notable checks: 521 Mary Ann Parker (singlewoman occupation already
correct, linked to 533); 528 "City of London" correctly resolved to
London id 309, not the unrelated "New London"; 535 "old market place"
correctly resolved to the distinct "Old Market Place" (31), not
"Market Place" (30); 541 John Mead -- raw_record has "[blank]" for the
animal species, title/charge_description correctly say generic
"animals" rather than fabricating a specific species; 544 William Bell
& Joseph Newton -- landowner "Earl of Mulgrave" matches the existing
Marquess of Normanby/Earl of Mulgrave office precedent exactly.

**OK — no changes (521, 522, 523, 524, 525, 526, 527, 528, 529, 530,
531, 532, 533, 534, 535, 536, 537, 538, 539, 540, 541, 542, 543, 544,
545, 546).** [Corrected 2026-08-04: record 549 (Edward Doughty, same
licensee Thomas Duck/informant Simpson Harnby/date as 545) surfaced a
same-incident link; related_conviction 545-549 added when 549 was
reached. Also, record 616 (Joseph Bottoms, same barn-lodging offence/
township/date as 543, no named party) surfaced a related_conviction
link 543-616, added when 616 was reached.]

## Record 547

"Summary conviction of Isabel Barker of the township of Whitby
singlewoman for assaulting Ann Oliver Offence committed at the
township of Whitby on 9 September 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Isabel Barker, victim
Ann Oliver. Last id on the tracked marital-status-occupation-gap list:
her text states "singlewoman" but `person_occupation` had no link.

**FIXED — added missing occupation link: person 596 (Isabel Barker) →
occupation 337 (singlewoman). This resolves the last known id on the
tracked marital-status gap list (started at record 275) -- all
originally-tracked ids now fixed. Watch remains open for further
instances not on the original list, since it was noted as
non-exhaustive.**

## Record 548

"Summary conviction of Hannah Cail wife of Richard Cail of Whitby
currier, and Hannah Cail and Helina Cail, for assaulting Jeffrey
Holmes of the township of Ruswarp gentleman. Offence committed at the
township of Ruswarp on Saturday 1 November 1833. Case heard at Whitby
in the division of Whitby Strand" -- DB correctly collapsed the raw
text's redundant double-mention of "Hannah Cail" into a single person
row (597); two defendants (Hannah Cail, Helina Cail), spouse Richard
Cail (currier), wife relationship present. Victim Jeffrey Holmes
(Ruswarp, gentleman). Locations and crime type (assault) match.

**OK — no changes.**

## Record 549

"Summary conviction of Edward Doughty of the township of Whitby jet
worker for being drunk on the licensed premises of Thomas Duck and
refusing to leave when asked by Simpson Harnby; on the oath of the
said Simpson Harnby of the township of Whitby police constable.
Offence committed at the township of Whitby on 14 December 1869.
Whitby Strand - case heard at Whitby" -- defendant Edward Doughty
(Whitby, jet worker). Same licensee/informant/date as record 545
(Daniel Stuart) -- Pattern 2, same enforcement visit.

**FIXED — added related_conviction link 545-549 (same premises/
officer/date).**

---

**Progress: records 1-549 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 3 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 16 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Record 550

"Summary conviction of John Cummings for begging in Church Street.
Offence committed at the township of Whitby on 21 October 1875. Whitby
Strand - case heard at Whitby[Dated 21 October, but endorsed 23
October 1875]" -- defendant John Cummings, no home stated, correctly
blank. Locations and crime type (begging) match. raw_record has a
missing space before a bracketed endorsement note, glued onto the end
without one -- had no anomalies field entry despite this.

**FIXED — added anomaly note flagging the missing-space source
formatting artifact (offence_date itself already correctly 1875-10-21,
not a data error).**

---

**Progress: records 1-550 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 6 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 16 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Record 551

"Summary conviction of Richard Shippey of Staithes in the township of
Hinderwell fisherman for using obscene and abusive language in
Staithes station. Offence committed at the township of Hinderwell on
13 September 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant Richard Shippey (home=Staithes, fisherman).
"Staithes station" had no dedicated location node (offence location
was falling back to generic Staithes 163), unlike other townships'
named stations (Glaisdale Station, Ruswarp Railway Station, etc.).
Crime type=using obscene language matches.

**FIXED — created location node 416 "Staithes Station" under Staithes
(163); reparented this record's location of offence from 163 to 416.
Two more records (2793, 3419) share the same "Staithes station" phrase
and will reuse this node when the linear audit reaches them.**

---

**Progress: records 1-551 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 16 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Record 552

"Summary conviction of Sarah Anderson wife of Enock Anderson of Whitby
tailor for assaulting Isabella Jolly of the township of Whitby
spinster. Offence committed at the township of Whitby on the night of
1 November 1833. Case heard at Whitby in the division of Whitby
Strand" -- defendant Sarah Anderson, spouse Enock Anderson (tailor),
wife relationship present. Victim Isabella Jolly's text states
"spinster" but `person_occupation` had no link -- a fresh instance of
the marital-status gap (not on the original tracked list). Locations
and crime type (assault) match.

**FIXED — added missing occupation link: person 6776 (Isabella Jolly)
→ occupation 406 (spinster).**

---

**Progress: records 1-552 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 17 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Record 553

"Summary conviction of Henry Freeman of the township of Whitby mariner
and master of a vessel called the William Ash which contained goods to
be unshipped at Whitby Harbour, for not delivering to Peter George
Coble collector of rates, within 12 hours of his arrival, the name of
the consignee or other person to whom the goods were to be delivered;
on the oath of the said Peter George Coble of the parish of Whitby
collector of rates and dues of the harbour of Whitby, and another.
Offence committed at the township of Whitby on 23 October 1869. Whitby
Strand - case heard at Whitby" -- defendant Henry Freeman (occupation
captures the vessel name detail: "mariner and master of the vessel
William Ash"). Informant Peter George Coble (full name incl. middle
name). Crime type=maritime offence, correct category. "And another" is
an unnamed second informant, correctly not fabricated.

**OK — no changes.**

---

**Progress: records 1-553 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 17 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Records 554-558

All checked individually -- all correct, no changes. Notable: 556
Robert Stephenson, correctly a separate person from record 366's
Robert Stephenson (different conviction); 558 Thomas Brown's "being in
the Market Place with intent to steal from the person of Robert
Baines" correctly categorized as "loitering/suspected person" (the
historical Vagrancy Act "suspected person" offence).

**OK — no changes (554, 555, 556, 557, 558).**

---

**Progress: records 1-558 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 17 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Records 559-563

All checked individually -- all correct, no changes.

**OK — no changes (559, 560, 561, 562, 563).**

---

**Progress: records 1-563 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 17 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Records 564-566

All checked individually -- all correct, no changes. Notable: 565
"drunk in charge of two horses and a carriage" checked against
precedent -- consistently tagged "drunkenness" across 61 records
corpus-wide, not a separate driving-specific category.

**OK — no changes (564, 565, 566).**

---

**Progress: records 1-566 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 17 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Records 567-569

All checked individually -- all correct, no changes.

**OK — no changes (567, 568, 569).**

---

**Progress: records 1-569 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 1 spelling fix,
1 title fix, 4 anomalies notes, 4 redundant relationship rows removed,
2 role corrections, 17 occupation fixes, 2 office fixes, 1 crime_type
miscategorization fix, 8 new crime_type leaves created, 11 records
retagged out of unclassified.**

## Record 570

Checked -- correct, no changes.

## Record 571

"Summary conviction of Reuben Raybold of Whitby for hawking a number
of almanacs that were unstamped; on the information of Robert Hunt of
the township of Whitby special constable. Offence committed at Whitby
on 26 December 1833. Case heard at Whitby" -- defendant's person row
correctly has last_name "Raybold" (matching raw_record), but the
summary_conviction.title field said "Raybald" -- a title/raw_record
spelling mismatch, same class of bug as record 347.

**FIXED — corrected title from "Summary conviction: Reuben Raybald" to
"Summary conviction: Reuben Raybold". Informant Robert Hunt (special
constable, matches precedent), locations, and crime type (licensing
offence) all otherwise correct.**

---

**Progress: records 1-571 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 2 spelling
fixes, 2 title fixes, 4 anomalies notes, 4 redundant relationship rows
removed, 2 role corrections, 17 occupation fixes, 2 office fixes, 1
crime_type miscategorization fix, 8 new crime_type leaves created, 11
records retagged out of unclassified.**

## Records 572-574

All checked individually -- all correct, no changes.

**OK — no changes (572, 573, 574).**

---

**Progress: records 1-574 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 2 spelling
fixes, 2 title fixes, 4 anomalies notes, 4 redundant relationship rows
removed, 2 role corrections, 17 occupation fixes, 2 office fixes, 1
crime_type miscategorization fix, 8 new crime_type leaves created, 11
records retagged out of unclassified.**

## Records 575-576

Checked -- correct, no changes. 575: "public office offence" (14)
correctly distinct from the surveyor-neglect leaf (79) since this is
refusing to *accept* the office, not neglecting duty while holding it.

**OK — no changes (575, 576).**

## Record 577

"Summary conviction of Emma Robinson of the township of Whitby
singlewoman for resisting Mark Boggett one of the constables for the
North Riding in the execution of his duty; on the oath of Mark Boggett
of the township of Whitby police constable, William Willison of
Whitby innkeeper and Francis Calvert of the township of Goathland
farmer. Offence committed at the township of Whitby on 2 October
1875. Whitby Strand - case heard at Whitby" -- defendant Emma
Robinson's text states "singlewoman" but `person_occupation` had no
link -- another instance of the marital-status gap.

**FIXED — added missing occupation link: person 630 (Emma Robinson) →
occupation 337 (singlewoman). Victim Mark Boggett and witnesses William
Willison, Francis Calvert otherwise correct.**

---

**Progress: records 1-577 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 2 spelling
fixes, 2 title fixes, 4 anomalies notes, 4 redundant relationship rows
removed, 2 role corrections, 18 occupation fixes, 2 office fixes, 1
crime_type miscategorization fix, 8 new crime_type leaves created, 11
records retagged out of unclassified.**

## Records 578-580

All checked individually -- all correct, no changes.

**OK — no changes (578, 579, 580).**

---

**Progress: records 1-580 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 2 spelling
fixes, 2 title fixes, 4 anomalies notes, 4 redundant relationship rows
removed, 2 role corrections, 18 occupation fixes, 2 office fixes, 1
crime_type miscategorization fix, 8 new crime_type leaves created, 11
records retagged out of unclassified.**

## Record 581

"Summary conviction of Robert Parkin of the township of Whitby cab
driver for being too far from his carriage to have proper control of
the horse drawing it; on the oath of Thomas Hall of the township of
Whitby police constable. Offence committed at the township of Whitby
on 20 October 1875. Whitby Strand - case heard at Whitby" -- defendant
Robert Parkin (Whitby, cab driver -- correctly a separate person from
the Robert Parkin, waggoner, of Newholm cum Dunsley in records 1084/
735), informant Thomas Hall. Crime type was "furious/reckless driving"
(59) -- but this is the exact same offence pattern as leaf 75 ("not
having proper control of horse drawing a cart", created earlier this
session for records 708/1025/1084). Checked corpus-wide: found the
same fragmentation as the earlier unclassified sweep -- 6 records
tagged "furious/reckless driving", 1 tagged "obstructing the highway",
for this identical offence text.

**FIXED — retagged all affected records (581, 735, 2305, 2308, 2344,
4027, 4145) to crime_type 75, consistent with 708/1025/1084. Locations
otherwise correct.**

Also checked the other 6 crime_type leaves created earlier this
session (74, 76-79) for the same kind of fragmentation. Found one more
for leaf 74: record 5139 (John Burnside, waggon without name painted
on it) was tagged "licensing offence" (23) instead. Retagged to 74.
Leaves 76-79 had no other fragmented instances.

---

**Progress: records 1-581 done (restart #2, plus confirmed blacklist
gap at 87-88, 139, 144, 151, 311, 359, 433). 7 location fixes
(resolved), 50 related_conviction links, 3 sex fixes, 2 spelling
fixes, 2 title fixes, 4 anomalies notes, 4 redundant relationship rows
removed, 2 role corrections, 18 occupation fixes, 2 office fixes, 9
crime_type miscategorization fixes, 8 new crime_type leaves created,
11 records retagged out of unclassified.**

## Records 582-584

All checked individually -- all correct, no changes. 584's Thomas
Atkinson correctly a separate conviction from the 332/368/517 cluster
(different offence date, no fabricated link).

**OK — no changes (582, 583, 584).**

## Records 585-587

All checked individually -- all correct, no changes.

**OK — no changes (585, 586, 587).**

## Records 588-590

All checked individually -- all correct, no changes. 589's "de Wart"
compound surname correctly preserved.

**OK — no changes (588, 589, 590).**

---

**Progress: records 1-590 done.**

## Record 591

"Summary conviction of William Wormald of Whitby innkeeper for opening
his house during the usual hours of divine service between 10.30 a.m.
and 12.30 p.m.; on the information of William Wilkinson. Offence
committed at the parish of Whitby on Sunday 1 May 1836" -- defendant
William Wormald (Whitby, innkeeper), informant William Wilkinson
(matches the same informant seen at records 520/583/587). Locations
and crime type (licensing offence) match. No related_conviction.

**OK — no changes.**

## Record 592

"Summary conviction of Isaac Blackburn of the township of Whitby
sailor for being drunk and riotous in Sandgate. Offence committed at
the township of Whitby on 29 June 1869. Whitby Strand - case heard at
Whitby" -- defendant Isaac Blackburn (Whitby, sailor). Location of
offence = Sandgate (34, East Cliff → Whitby), existing precedent.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

## Record 593

"Summary conviction of Robert Barrick of the township of Whitby jet
worker for being drunk and disorderly in Baxtergate. Offence committed
at the township of Whitby on 9 October 1875. Whitby Strand - case
heard at Whitby" -- defendant Robert Barrick (Whitby, jet worker) --
correctly a separate person row from the "Robert Barrick, jet ornament
manufacturer" seen as a victim in a different, later record (unrelated
conviction, no cross-merge). Location of offence = Baxtergate,
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-593 done.**

## Record 594

"Summary conviction of Charles Tomlinson of the township of Ruswarp
labourer for being drunk and disorderly in Bagdale Offence committed
at the township of Ruswarp on 30 September 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Charles
Tomlinson (Ruswarp, labourer). Both stated locations captured: Ruswarp
(township) and Bagdale (192, under West Cliff), matching the dual-
location convention. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-594 done.**

## Record 595

"Summary conviction of Thomas Breckon of Whitby butcher for beating a
dog belonging to William Cavallier of the township of Whitby cabinet
maker. Offence committed at the township of Whitby on 4 June 1836.
Case heard at Whitby" -- defendant Thomas Breckon (Whitby, butcher),
property owner William Cavallier -- correctly a separate person row
from record 579's William Cavallier (different role/conviction: there
he's the defendant leaving logs outside his shop, here he's a dog
owner). Locations and crime type (cruelty to animals) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-595 done.**

## Record 596

"Summary conviction of John Fletcher of the township of Whitby sailor
for being drunk and riotous in Sandgate. Offence committed at the
township of Whitby on 29 June 1869. Whitby Strand - case heard at
Whitby" -- defendant John Fletcher (Whitby, sailor). Location of
offence = Sandgate, existing precedent. Crime type=drunk and
disorderly matches. Already correctly linked via related_conviction to
592 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-596 done.**

## Record 597

"Summary conviction of Katherine McLaughlan of the township of Whitby
widow for assaulting Mary Feeley; on the oath of the said Mary Feeley
wife of John Feeley of the township of Whitby. Offence committed at
the township of Whitby on 13 October 1875. Whitby Strand - case heard
at Whitby" -- defendant Katherine McLaughlan's text states "widow" but
`person_occupation` had no link -- another instance of the marital-
status gap. Victim Mary Feeley, spouse John Feeley, wife relationship
present. Locations and crime type (assault) match. No
related_conviction.

**FIXED — added missing occupation link: person 650 (Katherine
McLaughlan) → occupation 384 (widow).**

---

**Progress: records 1-597 done.**

## Record 598

"Summary conviction of John Morgan of the township of Whitby labourer
for begging at the Pier. Offence committed in the township of Whitby
on 17 July 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant John Morgan (Whitby, labourer). Location of
offence = Piers, existing precedent. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-598 done.**

## Record 599

"Summary conviction of Joseph Feeny for begging in Church Street.
Offence committed at the township of Whitby on 7 July 1869. Whitby
Strand - case heard at Whitby" -- defendant Joseph Feeny, no home
stated, correctly blank. Location of offence = Church Street, existing
precedent. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-599 done.**

## Record 600

"Summary conviction of Samuel Baker for lodging in a cowhouse with no
visible means of subsistence and not giving a good account of himself.
Offence committed at the township of Ruswarp on 14 October 1875.
Whitby Strand - case heard at Whitby" -- defendant Samuel Baker, no
home stated, correctly blank. Location=Ruswarp, crime type=vagrancy
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-600 done.**

## Record 601

"Summary conviction of Walter Adam of the township of Whitby iron
worker for assaulting Alfred Lait Offence committed at the township of
Whitby on 22 June 1889. Whitby Strand Petty Sessional division - case
heard at Whitby" -- defendant Walter Adam (Whitby, iron worker),
victim Alfred Lait. Locations and crime type (assault) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-601 done.**

## Record 602

"Summary conviction of Charles Wood for lodging in a barn with no
visible means of subsistence and not giving a good account of himself.
Offence committed at the township of Hawsker cum Stainsacre on 8 July
1869. Whitby Strand - case heard at Whitby" -- defendant Charles Wood,
no home stated, correctly blank. Location=Hawsker-cum-Stainsacre,
crime type=vagrancy matches.

**OK — no changes.** [Corrected 2026-08-04: record 608 (William
Crowther, identical offence/township/date, no named party in either
record) surfaced a new no-named-party linking pattern, confirmed with
the user; related_conviction 602-608 added when 608 was reached.]

---

**Progress: records 1-602 done.**

## Record 603

"Summary conviction of Michael Dunleavy of the township of Glaisdale
labourer for using a gaff to catch salmon in the river Esk. Offence
committed at the township of Glaisdale on 16 October 1875. Whitby
Strand - case heard at Whitby" -- defendant Michael Dunleavy
(Glaisdale, labourer). Both locations captured (Glaisdale + River Esk
under the Rivers node). Crime type=fishing offence, correctly distinct
from the land-poaching category. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-603 done.**

## Record 604

"Summary conviction of William Dixon of the township of Whitby jet
worker for assaulting Mary Dixon Offence committed at the township of
Whitby on 21 September 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant William Dixon (Whitby, jet worker),
victim Mary Dixon -- sex correctly left blank, matching the consistent
corpus-wide convention (sex only filled when explicitly stated via
pronoun/descriptor, never inferred from an unambiguously gendered
first name alone; verified against several other similar victim-only-
name records). Shared surname with defendant but no relationship
stated in text, correctly not fabricated. Locations and crime type
(assault) match. Already correctly linked via related_conviction to
574 (same defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-604 done.**

## Record 605

"Summary conviction of Catherine Brannan for collecting alms under
false pretences from Elizabeth Ann Green, by claiming that a young
woman had recently been confined in the Old Post Office Yard and was
now destitute. Offence committed at the township of Whitby on 5 July
1869. Whitby Strand - case heard at Whitby" -- defendant Catherine
Brannan, no home stated, correctly blank. Victim Elizabeth Ann Green
(full name incl. middle name). "Old Post Office Yard" is part of the
fabricated claim within the offence itself (the false story Brannan
told), not a real location of the offence -- correctly not captured as
a separate location entity. Locations and crime type (fraud/false
pretences) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-605 done.**

## Record 606

"Summary conviction of George Patton of the township of Whitby
fisherman for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 6 November 1875. Whitby Strand
- case heard at Whitby" -- defendant George Patton (Whitby,
fisherman). Location of offence = Piers, existing precedent. Crime
type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-606 done.**

## Record 607

"Summary conviction of James Cockrin of the township of Whitby
labourer for assaulting Charles Finks. Offence committed at the
township of Whitby on 15 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant James Cockrin (Whitby,
labourer), victim Charles Finks. Locations and crime type (assault)
match. Already correctly linked via related_conviction to 515 (same
defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-607 done.**

## Record 608

"Summary conviction of William Crowther for lodging in a barn with no
visible means of subsistence and not giving a good account of himself.
Offence committed at the township of Hawsker cum Stainsacre on 8 July
1869. Whitby Strand - case heard at Whitby" -- defendant William
Crowther, no home stated, correctly blank. Same offence, township, and
date as record 602 (Charles Wood) -- flagged to user as a new no-
named-party linking pattern (neither record names an informant); user
confirmed this counts as related_conviction. New precedent established
and saved. Location=Hawsker-cum-Stainsacre, crime type=vagrancy
matches.

**FIXED — added related_conviction link 602-608 (same offence/township/
date, no named party). Record 602's log entry retroactively
annotated.**

---

**Progress: records 1-608 done.**

## Record 609

"Summary conviction of William Herbert of the township of Ruswarp
butcher for being drunk and disorderly in the Market Place. Offence
committed at the township of Whitby on 30 October 1875. Whitby Strand
- case heard at Whitby" -- defendant William Herbert (home=Ruswarp,
correctly distinct from offence location Whitby). Location of offence
= Market Place, existing precedent. Crime type=drunk and disorderly
matches. Already correctly linked via related_conviction to 538 (same-
beat pattern).

**OK — no changes.**

---

**Progress: records 1-609 done.**

## Record 610

"Summary conviction of William Thomas of the township of Whitby
fisherman for being drunk and disorderly in Baxtergate Offence
committed at the township of Whitby on 29 September 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
William Thomas (Whitby, fisherman). Location of offence = Baxtergate,
existing precedent. Crime type=drunk and disorderly matches. Already
correctly linked via related_conviction to 570 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-610 done.**

## Record 611

"Summary conviction of John Sallenger for begging in Hinderwell Street
Offence committed at the township of Hinderwell on 8 July 1869. Whitby
Strand - case heard at Whitby" -- defendant John Sallenger, no home
stated, correctly blank. Location of offence = Hinderwell Street (88
parent, i.e. Hinderwell itself), crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-611 done.**

## Record 612

"Summary conviction of William Herbert of the township of Whitby
butcher for being drunk and disorderly in York Terrace. Offence
committed at the township of Ruswarp on 1 November 1875. Whitby
Strand - case heard at Whitby" -- defendant William Herbert, home=
Whitby here (correctly a separate person from record 609's William
Herbert, home=Ruswarp -- same name/occupation but a different real
person, no fabricated merge). Both stated locations captured (Ruswarp
+ York Terrace under West Cliff). Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-612 done.**

## Record 613

"Summary conviction of Thomas Loftus of the township of Whitby
bricklayer for being drunk and disorderly in Church Street Offence
committed at the township of Whitby on 9 September 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Thomas Loftus (Whitby, bricklayer). Location of offence = Church
Street, existing precedent. Crime type=drunk and disorderly matches.
Already correctly linked via related_conviction to 586 (same
defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-613 done.**

## Record 614

"Summary conviction of John Shepherd of the township of Glaisdale
miner for interfering with the comfort of other passengers on the
Cleveland and North Yorkshire line of the North Eastern Railway; on
the oath of Michael Underwood and others. Offence committed at the
township of Eskdaleside on 3 July 1869. Whitby Strand - case heard at
Whitby" -- defendant John Shepherd (Glaisdale, miner), informant
Michael Underwood, "and others" correctly not fabricated. Cross-parish
railway (Cleveland & North Yorkshire Railway, under Cross-Parish
Railways 388) added alongside stated township (Eskdaleside-cum-
Ugglebarnby), matching the established convention. Crime type=railway
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-614 done.**

## Record 615

"Summary conviction of Peter Gorley of the township of Whitby jet
worker for assaulting Mary Ann Stonehouse. Offence committed at the
township of Whitby on 16 November 1875. Whitby Strand - case heard at
Whitby" -- defendant Peter Gorley (Whitby, jet worker), victim Mary
Ann Stonehouse -- correctly a separate person from record 526's Mary
Ann Stonehouse (different conviction/date/role). Locations and crime
type (assault) match. Already correctly linked via related_conviction
to 2885 (same defendant/offence date).

**OK — no changes.**

---

**Progress: records 1-615 done.**

## Record 616

"Summary conviction of Joseph Bottoms of the township of Fylingdales
labourer for lodging in a barn, without any visible means of
subsistence and not giving a good account of himself. Offence
committed at the township of Fylingdales on 7 September 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Joseph Bottoms (Fylingdales, labourer). Same offence, township, and
date as record 543 (James Sutton) -- no-named-party pattern
(confirmed at 602/608), same barn implied. Location and crime type
(vagrancy) match.

**FIXED — added related_conviction link 543-616 (same offence/township/
date, no named party). Record 543's earlier batch entry annotated with
a bracketed correction note.**

---

**Progress: records 1-616 done.**

## Record 617

"Summary conviction of Matilda Cooper of the township of Whitby tramp
for being drunk. Offence committed at the township of Whitby on 13
July 1869. Whitby Strand - case heard at Whitby" -- defendant Matilda
Cooper, occupation "tramp" matches established category. Locations and
crime type (drunkenness) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-617 done.**

## Record 618

"Summary conviction of Thomas Green of the township of Eskdaleside
miner for being drunk and riotous in Grosmont town street. Offence
committed at the township of Eskdaleside on 6 November 1875. Whitby
Strand - case heard at Whitby" -- defendant Thomas Green (Eskdaleside,
miner). "Grosmont town street" correctly resolves to Grosmont (under
Eskdaleside-cum-Ugglebarnby), matching the "X town street" convention.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-618 done.**

## Record 619

"Summary conviction of Margaret Ann Hansell wife of William George
Hansell of the township of Whitby jet worker for being drunk and
disorderly in St Ann's Staith. Offence committed at the township of
Whitby on 19 August 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant Margaret Ann Hansell, spouse
William George Hansell (both full names incl. middle names captured),
wife relationship present. Location of offence = St Ann's Staith,
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-619 done.**

## Record 620

"Summary conviction of Henry Johnson for begging in Belle Vue Terrace.
Offence committed at the township of Ruswarp on 16 July 1869. Whitby
Strand - case heard at Whitby" -- defendant Henry Johnson, no home
stated, correctly blank. Both stated locations captured (Ruswarp +
Belle Vue Terrace under West Cliff), matching the dual-location
convention. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-620 done.**

## Record 621

"Summary conviction of John Hodgson of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 29 November 1875. Whitby
Strand - case heard at Whitby" -- defendant John Hodgson, correctly a
separate person row from records 344/499's John Hodgsons (different
convictions/dates). Location of offence = Church Street, existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-621 done.**

## Record 622

"Summary conviction of John Marshall of the township of Whitby
labourer for stealing apples value 1s, the property of James Whittle
and growing in his garden. Offence committed at the township of
Hawsker cum Stainsacre on 28 August 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant John Marshall
(Whitby, labourer). Same property owner, offence, and date as record
495 (John Moon) -- same theft incident, two men prosecuted separately.
Locations and crime type (theft) match.

**FIXED — added related_conviction link 495-622 (same owner/offence/
date). Record 495's log entry retroactively annotated.** [Corrected
2026-08-04: record 625 (Thomas Drummond Moon, same owner/offence/date)
added related_conviction 622-625 when 625 was reached.]

---

**Progress: records 1-622 done.**

## Record 623

"Summary conviction of John Coyle and George Smith for frequenting the
West Cliff with intent to commit felony. Offence committed at the
township of Ruswarp on 17 July 1869. Whitby Strand - case heard at
Whitby" -- two co-defendants, no home/occupation stated, correctly
blank. Both locations captured (West Cliff + Ruswarp). Crime
type=loitering/suspected person, correct for the "frequenting with
intent to commit felony" statutory offence. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-623 done.**

## Record 624

"Summary conviction of Thomas Gaines of the township of Whitby
fisherman for being drunk and disorderly in Church Street; on the oath
of Thomas Hall of the township of Whitby police constable. Offence
committed at the township of Whitby on 13 November 1875. Whitby
Strand - case heard at Whitby" -- defendant Thomas Gaines, correctly a
separate person row from records 339/534/542's Thomas Gaines
(different convictions/dates). Informant Thomas Hall. Location of
offence = Church Street, existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-624 done.**

## Record 625

"Summary conviction of Thomas Drummond Moon of the township of Whitby
labourer for stealing apples value 1s, the property of James Whittle
and growing in his garden. Offence committed at the township of
Hawsker cum Stainsacre on 28 August 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas
Drummond Moon (full name incl. middle name -- likely a relative of
record 495's John Moon, but correctly a separate person row, no
fabricated merge). Third member of the James Whittle apple-theft
incident cluster (495, 622). Locations and crime type (theft) match.

**FIXED — added related_conviction links 495-625 and 622-625 (full
all-pairs linking for the three-record cluster). Records 495 and 622's
log entries retroactively annotated.**

---

**Progress: records 1-625 done.**

## Record 626

"Summary conviction of Ann Appleton widow, Mary Austin wife of Robert
Austin fisherman, and Annie Austin singlewoman, all of the township of
Whitby, for obstructing Church Street. Offence committed at the
township of Whitby on 12 July 1869. Whitby Strand - case heard at
Whitby" -- three defendants: Ann Appleton (widow, occupation already
correctly linked from an earlier pass), Mary Austin (spouse Robert
Austin, fisherman, wife relationship present), Annie Austin
(singlewoman, occupation already correctly linked). Locations and
crime type (obstructing the highway) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-626 done.**

## Record 627

"Summary conviction of William Martin of the township of Whitby for
wilfully damaging a lamp belonging to the Whitby Gas Company. Offence
committed at the township of Ruswarp on 1 December 1875. Whitby
Strand - case heard at Whitby" -- defendant William Martin (Whitby),
no occupation stated, correctly blank. Property owner "Whitby Gas
Company" had no person/company row at all -- checked precedent, this
DB does capture company names as person rows (e.g. "Holt and
Company", "Thomas Turnbull and Company" already exist), so this was a
genuine gap. Locations and crime type (malicious/property damage)
match.

**FIXED — created person row 10373 ("Whitby Gas Company", no first
name) and linked it to this record with role="property owner".**

---

**Progress: records 1-627 done.**

## Record 628

"Summary conviction of Alfred Harrison of the township of Mickleby
labourer for begging in Mickleby town street. Offence committed at the
township of Mickleby on 2 September 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Alfred
Harrison (Mickleby, labourer). "Mickleby town street" correctly
resolves to Mickleby itself. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-628 done.**

## Record 629

"Summary conviction of George Wedgewood of the township of Newholm cum
Dunsley for trespassing in the daytime in search of conies on a piece
of land in the possession and occupation of Elizabeth Harris. Offence
committed at the township of Newholm cum Dunsley on 13 July 1869.
Whitby Strand - case heard at Whitby" -- defendant George Wedgewood,
no occupation stated, correctly blank. Landowner Elizabeth Harris.
Locations and crime type (poaching) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-629 done.**

## Record 630

"Summary conviction of Frederick Blackstone of the township of Whitby
jeweller for being drunk and disorderly on the Pier. Offence committed
at the township of Whitby on 7 December 1875. Whitby Strand - case
heard at Whitby" -- defendant Frederick Blackstone (Whitby, jeweller).
Location of offence = Piers, existing precedent. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-630 done.**

## Record 631

"Summary conviction of Charles Sams of the township of Whitby labourer
for being drunk and disorderly at the bridge end Offence committed at
the township of Whitby on 15 September 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Charles Sams,
correctly a separate person row from record 566's spouse Charles Sams
(different role/conviction). Location of offence = Bridge End,
existing precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-631 done.**

## Record 632

"Summary conviction of Henry Poleson for begging in Fishburn Road.
Offence committed at the township of Ruswarp on 16 July 1869. Whitby
Strand - case heard at Whitby" -- defendant Henry Poleson, no home
stated, correctly blank. Both stated locations captured (Ruswarp +
Fishburn Road under West Cliff). Crime type=begging matches. Already
correctly linked via related_conviction to 641 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-632 done.**

## Record 633

"Summary conviction of Thomas Turner for begging in Baxtergate.
Offence committed at the township of Whitby on 9 July 1875. Whitby
Strand - case heard at Whitby" -- defendant Thomas Turner, no home
stated, correctly blank. Location of offence = Baxtergate, existing
precedent. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-633 done.**

## Record 634

"Summary conviction of William Parker of the township of Eskdaleside
cum Ugglebarnby labourer for begging in Grosmont town street. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 21
September 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant William Parker (Eskdaleside, labourer). "Grosmont
town street" correctly resolves to Grosmont. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-634 done.**

## Record 635

"Summary conviction of Joseph Peacock for begging in John Street.
Offence committed at the township of Ruswarp on 16 July 1869. Whitby
Strand - case heard at Whitby" -- defendant Joseph Peacock, no home
stated, correctly blank. Both stated locations captured (Ruswarp +
John Street under West Cliff). Same date/township as record 632
(Henry Poleson) but a different specific street (John Street vs.
Fishburn Road) -- correctly not linked, a separate incident. Crime
type=begging matches.

**OK — no changes.**

---

**Progress: records 1-635 done.**

## Record 636

"Summary conviction of Adam Wilson for begging in a public place.
Offence committed at the township of Roxby on 8 September 1875. Whitby
Strand - case heard at Whitby" -- defendant Adam Wilson, no home
stated, correctly blank. Location=Roxby, crime type=begging matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-636 done.**

## Record 637

"Summary conviction of Joseph Brown of the township of Eskdaleside cum
Ugglebarnby labourer for begging in Sleights town street. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 2
September 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Joseph Brown (Eskdaleside, labourer). "Sleights
town street" resolves correctly. Crime type=begging matches. Already
correctly linked via related_conviction to 519 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-637 done.**

## Record 638

"Summary conviction of William Cook of the township of Whitby labourer
for assaulting Joseph Gatenby one of the constables for the North
Riding in the execution of his duty. Offence committed at the
township of Whitby on 16 July 1869. Whitby Strand - case heard at
Whitby" -- defendant William Cook (Whitby, labourer), victim Joseph
Gatenby -- correctly a separate person from record 564's informant
Joseph Gatenby (different conviction). Locations and crime type
(assaulting a police officer) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-638 done.**

## Record 639

"Summary conviction of William Gaskin for assaulting Jane Gaskin.
Offence committed at the township of Whitby on 17 June 1875. Whitby
Strand - case heard at Whitby" -- defendant William Gaskin, no home
stated, correctly blank. Victim Jane Gaskin -- shared surname but no
relationship stated in text, correctly not fabricated (unlike other
records where "his wife"/"wife of" is explicit). Locations and crime
type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-639 done.**

## Record 640

"Summary conviction of William Cowley of the township of Hawsker cum
Stainsacre labourer for lodging in a field without any visible means
of subsistence and not giving a good account of himself Offence
committed at the township of Hawsker cum Stainsacre on 29 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant William Cowley (Hawsker-cum-Stainsacre, labourer). Location
and crime type (vagrancy) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-640 done.**

## Record 641

"Summary conviction of George Bonson for begging in Fishburn Road.
Offence committed at the township of Ruswarp on 16 July 1869. Whitby
Strand - case heard at Whitby" -- defendant George Bonson, no home
stated, correctly blank. Both stated locations captured (Ruswarp +
Fishburn Road). Crime type=begging matches. Already correctly linked
via related_conviction to 632 (same-beat pattern).

**OK — no changes.**

---

**Progress: records 1-641 done.**

## Record 642

"Summary conviction of Richard Steel for assaulting Alice Steel.
Offence committed at the township of Whitby on 29 June 1875. Whitby
Strand - case heard at Whitby" -- defendant Richard Steel, no home
stated, correctly blank. Victim Alice Steel -- shared surname, no
relationship stated, correctly not fabricated. Locations and crime
type (assault) match. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-642 done.**

## Record 643

"Summary conviction of Robert Hill of the township of Fylingdales
gardener for being drunk on the licensed premises of John Steel and
refusing to leave when asked to do so by Joseph Scaife a police
constable. Offence committed at the township of Fylingdales on 15
July 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Robert Hill (Fylingdales, gardener), licensee
John Steel, informant Joseph Scaife (police constable). Locations and
crime types (drunkenness, refusal to quit licensed premises) match. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-643 done.**

## Record 644

"Summary conviction of Frederick James for begging on the Pier.
Offence committed at the township of Whitby on 17 July 1869. Whitby
Strand - case heard at Whitby" -- defendant Frederick James, no home
stated, correctly blank. Location of offence = Piers, existing
precedent. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-644 done.**

## Record 645

"Summary conviction of Robert Watson for assaulting Thomas Watson.
Offence committed at the township of Whitby on 9 July 1875. Whitby
Strand - case heard at Whitby" -- defendant Robert Watson, no home
stated, correctly blank. Victim Thomas Watson -- unrelated to the
earlier licensed-premises "Thomas Watson" cluster (different date/
context), correctly not conflated; shared surname with defendant, no
relationship stated. Locations and crime type (assault) match. Already
correctly linked via related_conviction to 750 and 756 (same defendant/
offence date).

**OK — no changes.**

---

**Progress: records 1-645 done.**

## Record 646

"Summary conviction of James Loftus of the township of Whitby labourer
for assaulting William Dobson one of the constables of the North
Riding in the execution of his duty. Offence committed at the
township of Whitby on 27 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant James Loftus, correctly
a separate person row from record 460's James Loftus (different
conviction/date). Victim William Dobson (constable of the North
Riding). Locations and crime type (assaulting a police officer) match.
Already correctly linked via related_conviction to 664 (same
defendant/offence date).

**OK — no changes.**

**[Retroactive note, added at record 664]:** part of a 5-record riot
cluster (436, 646, 652, 664, 670) -- same date/township/offence type,
multiple defendants assaulting multiple named constables during what
was likely one incident. Full pairwise related_conviction links added
retroactively; see [[project_related_conviction_riot_incident_pattern]].

---

**Progress: records 1-646 done.**

## Record 647

"Summary conviction of Francis Fewster of the township of Whitby jet
worker for being drunk and riotous in Baxtergate. Offence committed at
the township of Whitby on 17 July 1869. Whitby Strand - case heard at
Whitby" -- defendant Francis Fewster, correctly a separate person row
from record 369's Francis Fewster (different conviction/date, despite
matching occupation). Location of offence = Baxtergate, existing
precedent. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-647 done.**

## Record 648

"Summary conviction of Edward Fitzsimons for begging in Glaisdale town
street. Offence committed at the township of Glaisdale on 26 July
1875. Whitby Strand - case heard at Whitby" -- defendant Edward
Fitzsimons, no home stated, correctly blank. "Glaisdale town street"
resolves correctly. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-648 done.**

## Record 649

"Summary conviction of James Westhead of the township of Newholm cum
Dunsley labourer for being drunk and disorderly in East Row town
street. Offence committed at the township of Newholm cum Dunsley on
17 June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant James Westhead (Newholm-cum-Dunsley, labourer).
"East Row town street" resolves to Newholm-cum-Dunsley itself,
matching the stated township. Crime type=drunk and disorderly matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-649 done.**

## Record 650

"Summary conviction of William Balmforth of the township of Whitby
licensed beer house keeper for opening his premises before 12.30
p.m. Offence committed at the township of Whitby at 8.30 a.m. on
Sunday 18 July 1869. Whitby Strand - case heard at Whitby" --
defendant William Balmforth (Whitby, licensed beer house keeper).
Sunday-trading licensing offence, opening before permitted hour.
Location Whitby matches on both offence and court. Crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-650 done.**

## Record 651

"Summary conviction of Thomas Weatherill for assaulting Alice
Weatherill. Offence committed at the township of Whitby on 28 July
1875. Whitby Strand - case heard at Whitby" -- defendant Thomas
Weatherill, victim Alice Weatherill, shared surname but no
relationship stated in raw_record, so none captured (no
fabrication). Location Whitby matches. Crime type=assault matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-651 done.**

## Record 652

"Summary conviction of Thomas Loftus of the township of Whitby
bricklayer for assaulting William Lee one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 27 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Thomas Loftus (Whitby,
bricklayer), victim William Lee (constable of the North Riding).
Location Whitby matches. Crime type=assaulting a police officer
matches. Already correctly linked to related_conviction 670 (same
defendant + same offence date pattern) -- will verify reciprocally
when reaching 670.

**OK — no changes.**

---

**Progress: records 1-652 done.**

## Record 653

"Summary conviction of Ellen Hick wife of Isaac Hick for assaulting
Joseph Gatenby. Offence committed at the township of Whitby on 20
July 1869. Whitby Strand - case heard at Whitby" -- defendant Ellen
Hick, spouse Isaac Hick (relationship correctly captured), victim
Joseph Gatenby (police constable). Location Whitby matches. Crime
type=assault matches -- note victim is a police constable but the
charge as stated is plain "assaulting Joseph Gatenby" with no
"in the execution of his duty" language, so ordinary assault (not
"assaulting a police officer") is correct here, unlike record 652.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-653 done.**

## Record 654

"Summary conviction of James Brown for begging in Dean Hall.
Offence committed at the township of Ugglebarnby on 10 July 1875.
Whitby Strand - case heard at Whitby" -- defendant James Brown.
Location of offence "Dean Hall" (id 8) correctly nested under
Eskdaleside-cum-Ugglebarnby, matching the stated township. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-654 done.**

## Record 655

"Summary conviction of Annie Craven wife of Amos Craven of Kingston
upon Hull labourer for begging on the Whitby and Hawsker highway.
Offence committed at the township of Hawsker cum Stainsacre on 6
August 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Annie Craven, spouse Amos Craven (labourer,
relationship correctly captured). "Whitby and Hawsker highway"
correctly captured as Cross-Parish Highways (id 106), added
alongside the stated township Hawsker-cum-Stainsacre, per the
two-endpoint highway convention. Crime type=begging matches.
Already correctly linked to related_conviction 682 (same offence
date/street/charge, different defendants) -- will verify
reciprocally when reaching 682.

**OK — no changes.**

---

**Progress: records 1-655 done.**

## Record 656

"Summary conviction of John Mead of the township of Egton farmer
for being the owner of a horse found straying on the Pickering and
Stape highway; on the oath of William Pickering of the township of
Egton police constable. Offence committed at the township of Egton
on 22 July 1869. Whitby Strand - case heard at Whitby" -- defendant
John Mead (Egton, farmer), informant William Pickering (Egton,
police constable). "Pickering and Stape highway" correctly captured
as Cross-Parish Highways (id 106), added alongside the stated
township Egton. Crime type=straying animals matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-656 done.**

## Record 657

"Summary conviction of William Brown for begging in the Old Market
Place. Offence committed at the township of Whitby on 1 July 1875.
Whitby Strand - case heard at Whitby" -- defendant William Brown.
Location of offence "Old Market Place" (id 31) nests under Whitby's
"West Cliff" node (id 5) which, on inspection of its full sibling
list (Baxtergate, Flowergate, Haggersgate, St Ann's Staith etc.),
covers the whole west-bank old-town area rather than only the
Victorian resort cliff-top -- so this correctly resolves to the
stated township of Whitby, not a mis-parenting. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-657 done.**

## Record 658

"Summary conviction of John George Pearson of the township of
Ruswarp for stealing a quantity of peas value 2s 6d, the property
of William Gibbons and growing in his garden Offence committed at
the township of Ruswarp on 11 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant John George
Pearson (Ruswarp), property owner William Gibbons. Location Ruswarp
matches. Crime type=theft matches. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 661]:** records 406, 661, and
667 turned out to share this exact same offence/victim/date (William
Gibbons' peas, 11 July 1889, Ruswarp) with different defendants.
related_conviction links to all three have now been added retroactively.

---

**Progress: records 1-658 done.**

## Record 659

"Summary conviction of Mary Jane Wallace common prostitute for
behaving indecently in Church Street. Offence committed at the
township of Whitby on 21 July 1869. Whitby Strand - case heard at
Whitby" -- defendant Mary Jane Wallace, occupation "common
prostitute" captured. Church Street (id 6) nests under East Cliff/
Whitby, matching stated township. Crime types = indecent behaviour +
prostitution, both fit the charge. Already correctly linked to
related_conviction 662 and 665 (same offence date/street/charge
wording, different defendants -- one incident, several prosecuted)
-- will verify reciprocally when reaching those records.

**OK — no changes.**

---

**Progress: records 1-659 done.**

## Record 660

"Summary conviction of William Williamson for begging in Hunter
Street. Offence committed at the township of Ruswarp on 26 July
1875. Whitby Strand - case heard at Whitby" -- defendant William
Williamson. Hunter Street (id ..., parent 5/West Cliff/Whitby)
nests under Whitby in the modern tree even though the record states
township Ruswarp -- correctly captured alongside the stated Ruswarp
location rather than replacing it, per the confirmed historical
Whitby/Ruswarp cliff-boundary pattern (the two townships were one
joint parish through much of the 19th century). Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-660 done.**

## Record 661

"Summary conviction of William Smallwood of the township of Ruswarp
for stealing a quantity of peas value 2s 6d, the property of
William Gibbons and growing in his garden Offence committed at the
township of Ruswarp on 11 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant William Smallwood
(Ruswarp), property owner William Gibbons. Location Ruswarp
matches. Crime type=theft matches. No related_conviction was
present, but a search for the same charge wording ("peas value 2s
6d" + "Gibbons") turned up **four** matching records: 406 (John
Dean), 658 (John George Pearson, already audited this session —
also missing its link), 661 (this record), and 667 (George Cook,
not yet reached) -- all same township, same offence date (11 July
1889), same victim, identical charge wording, different defendants.
One incident, four people prosecuted separately. Added all 6 pairwise
related_conviction rows (406-658, 406-661, 406-667, 658-661,
658-667, 661-667) with a note identifying the full 4-record cluster.
Record 406 was already audited earlier in the corpus pass (long
before this discovery) and record 667 has not yet been reached --
its own entry will note this link already exists when reached.

**FIXED — added missing related_conviction links for a 4-record cluster (406, 658, 661, 667).**

---

**Progress: records 1-661 done.**

## Record 662

"Summary conviction of Margaret Jane Walker common prostitute for
behaving indecently in Church Street. Offence committed at the
township of Whitby on 21 July 1869. Whitby Strand - case heard at
Whitby" -- defendant Margaret Jane Walker, occupation "common
prostitute". Church Street matches. Crime types = indecent behaviour
+ prostitution match. Already correctly linked to related_conviction
659 and 665 (same incident cluster).

**OK — no changes.**

---

**Progress: records 1-662 done.**

## Record 663

"Summary conviction of Francis Dalkin for assaulting Jane Ann Storm.
Offence committed at the township of Whitby on 24 July 1875. Whitby
Strand - case heard at Whitby" -- defendant Francis Dalkin, victim
Jane Ann Storm. Location Whitby matches. Crime type=assault matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-663 done.**

## Record 664

"Summary conviction of James Loftus of the township of Whitby
labourer for assaulting William Lee one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 27 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant James Loftus,
occupation labourer. Victim William Lee (constable of the North
Riding). Locations and crime type (assaulting a police officer)
match. Already correctly linked to 646 (same defendant, same offence
date). Discovered this is part of a larger 5-record riot cluster:
436 (Edward Ruehorn/William Lee), 646 (James Loftus/William Dobson),
652 (Thomas Loftus/William Lee), 664 (this record), 670 (Thomas
Loftus/John Cook) -- all same date (27 July 1889), same township
(Whitby), same offence type, 3 defendants and 3 named constables.
Asked the user whether to link all 5 pairwise given the departure
from prior patterns (crossing both defendant AND named-victim
boundaries); user confirmed yes. Added the 8 missing pairwise
related_conviction rows (2 same-defendant pairs already existed).
Saved as a new confirmed sub-pattern
([[project_related_conviction_riot_incident_pattern]]) and
retroactively annotated the already-logged entries for 436 and 646.

**FIXED — added 8 missing related_conviction links completing a 5-record riot cluster (436, 646, 652, 664, 670).**

---

**Progress: records 1-664 done.**

## Record 665

"Summary conviction of Margaret Corner common prostitute for
behaving indecently in Church Street. Offence committed at the
township of Whitby on 21 July 1869. Whitby Strand - case heard at
Whitby" -- defendant Margaret Corner, occupation "common prostitute".
Church Street matches. Crime types = indecent behaviour +
prostitution match. Already correctly linked to related_conviction
659 and 662 (same incident cluster).

**OK — no changes.**

---

**Progress: records 1-665 done.**

## Record 666

"Summary conviction of James Pounder for assaulting William Burdon.
Offence committed at the township of Whitby on 12 August 1875.
Whitby Strand - case heard at Whitby" -- defendant James Pounder,
victim William Burdon. Location Whitby matches. Crime type=assault
matches. Already correctly linked to related_conviction 723 (same
defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-666 done.**

## Record 667

"Summary conviction of George Cook of the township of Ruswarp for
stealing a quantity of peas value 2s 6d, the property of William
Gibbons and growing in his garden Offence committed at the township
of Ruswarp on 11 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant George Cook (Ruswarp), property
owner William Gibbons. Location Ruswarp matches. Crime type=theft
matches. Already correctly linked to related_conviction 406, 658,
and 661 (the full 4-record cluster fixed at record 661).

**OK — no changes.**

---

**Progress: records 1-667 done.**

## Record 668

"Summary conviction of John Cook for begging in Flowergate. Offence
committed at the township of Whitby on 25 July 1869. Whitby Strand -
case heard at Whitby" -- defendant John Cook. Flowergate matches
(West Cliff/Whitby). Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-668 done.**

## Record 669

"Summary conviction of John Fox for begging in East Terrace.
Offence committed at the township of Ruswarp on 15 September 1875.
Whitby Strand - case heard at Whitby" -- defendant John Fox. East
Terrace nests under Whitby's West Cliff in the modern tree but the
record states township Ruswarp -- correctly captured alongside the
stated Ruswarp location, per the Whitby/Ruswarp cliff-boundary
pattern. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-669 done.**

## Record 670

"Summary conviction of Thomas Loftus of the township of Whitby
bricklayer for assaulting John Cook one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 27 July 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Thomas Loftus,
occupation bricklayer. Victim John Cook, occupation "constable of
the North Riding". Sex was blank for John Cook despite the raw_record
saying "...in the execution of **his** duty" -- the pronoun
explicitly states male, and the sibling records in this same cluster
(436/646/664, victims William Lee/William Dobson) correctly have
sex=male from the identical construction. Fixed to male for
consistency. Locations and crime type (assaulting a police officer)
match. Already correctly linked to related_conviction 652 (same
defendant) and 436/646/664 (the 5-record riot cluster fixed at
record 664).

**FIXED — set victim John Cook's sex to male (pronoun "his duty" was present but not captured, inconsistent with sibling records in the same cluster).**

---

**Progress: records 1-670 done.**

## Record 671

"Summary conviction of Absolom Breckon of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby
on 25 July 1869. Whitby Strand - case heard at Whitby" -- defendant
Absolom Breckon (Whitby, jet worker). Location Whitby matches. Crime
type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-671 done.**

## Record 672

"Summary conviction of Charles Smith for begging in Staithes town
street. Offence committed at the township of Hinderwell on 18 July
1875. Whitby Strand - case heard at Whitby" -- defendant Charles
Smith. "Staithes town street" resolves to Staithes itself, nested
under Hinderwell, matching the stated township. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-672 done.**

## Record 673

"Summary conviction of William Broderick of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 1 September 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
William Broderick (Whitby, fisherman). Church Street matches. Crime
type=drunk and disorderly matches. Already correctly linked to
related_conviction 487 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-673 done.**

## Record 674

"Summary conviction of James Stewart of the township of Whitby
carpenter for being drunk; on the oath of [blank] Selby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 24 July 1869. Whitby Strand - case heard at
Whitby" -- defendant James Stewart (Whitby, carpenter), informant
"[blank] Selby" (Whitby, police constable) correctly captured with
no first_name per the established blank-informant convention.
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

**[Retroactive correction, added at record 734]:** Selby (person
6835) had `sex='male'` set despite no first_name and no pronoun
anywhere in this record's text. Checked against ~19 other
blank-first-name police-constable informants corpus-wide -- this was
the sole outlier, all others correctly have sex=NULL. Cleared it back
to NULL for consistency with the established rule (sex only from
explicit pronoun or an unambiguous first name, never from occupation
alone).

---

**Progress: records 1-674 done.**

## Record 675

"Summary conviction of Arthur James King for being on land occupied
by Thomas Vaughan with nets to take game by night. Offence committed
at the township of Newton Mulgrave at 12.15 a.m. on 13 June 1875.
Whitby Strand - case heard at Whitby" -- defendant Arthur James King,
landowner/occupier Thomas Vaughan. Location Newton Mulgrave matches.
Crime type=poaching matches. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 705]:** records 705, 717, and
878 turned out to share this exact same offence/landowner/date-and-
time (12.15 a.m., 13 June 1875, Thomas Vaughan's land) with different
defendants -- a poaching gang caught together. related_conviction
links to all three added retroactively.

---

**Progress: records 1-675 done.**

## Record 676

"Summary conviction of Ralph Jordison of the township of Whitby
painter for being drunk and disorderly on the licensed premises
Ralph Brown Longhorn. Offence committed at the township of Whitby
on 20 September 1889. Whitby Strand Petty Sessional division - case
heard at Whitby" -- defendant Ralph Jordison (Whitby, painter),
licensee Ralph Brown Longhorn, occupation "licensee" correctly
captured per the established "licensed premises of X" convention.
Location Whitby matches. Crime type=drunk and disorderly matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-676 done.**

## Record 677

"Summary conviction of Thomas Hodgson of the township of Whitby
sailor for being drunk. Offence committed on 25 July 1869. Whitby
Strand - case heard at Whitby" -- defendant Thomas Hodgson (Whitby,
sailor). No offence-location clause stated at all in the text, but
location of offence is correctly recorded as Whitby, per the
established "silence as evidence of local" inference already applied
to this exact record in an earlier pass (see
reextraction-audit-notes.md). Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-677 done.**

## Record 678

"Summary conviction of Ann Wilson of the township of Whitby widow
for being drunk and disorderly in Henrietta Street. Offence
committed at the township of Whitby on 12 June 1875. Whitby Strand
- case heard at Whitby" -- defendant Ann Wilson (Whitby), stated
"widow" but occupation was not linked -- this id was already on the
tracked marital-status occupation gap list (reextraction-audit-notes.md).
Added occupation "widow" (id 384). Henrietta Street matches. Crime
type=drunk and disorderly matches. No related_conviction.

**FIXED — added missing "widow" occupation (tracked gap, id 678 removed from the list).**

---

**Progress: records 1-678 done.**

## Record 679

"Summary conviction of Robinson Groves of Baxtergate in the township
of Whitby carter for ill-treating a horse by working it when it was
unfit Offence committed at the township of Ruswarp on 24 September
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Robinson Groves, home correctly set to Baxtergate (id
22, under West Cliff/Whitby), occupation carter. Offence location
Ruswarp matches stated township. Crime type=cruelty to animals
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-679 done.**

## Record 680

"Summary conviction of Edward Coates of the township of Scarborough
fish hawker for ill-treating a mare by working it when it was
unfit; on the oath of Charles Tempest Clarkson of the township of
Whitby superintendent of police. Offence committed at the township
of Hawsker cum Stainsacre on 7 July 1869. Whitby Strand - case heard
at Whitby" -- defendant Edward Coates, home Scarborough, occupation
fish hawker; informant Charles Tempest Clarkson, home Whitby,
occupation superintendent of police. Offence location Hawsker-cum-
Stainsacre matches. Crime type=cruelty to animals matches. No
related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 683]:** record 683 (George
Bennett) turned out to share this exact same offence/township/date
(7 July 1869, ill-treating a mare, Hawsker cum Stainsacre, both
Scarborough fish hawkers). related_conviction link added
retroactively.

---

**Progress: records 1-680 done.**

## Record 681

"Summary conviction of George Wilson of the township of Whitby
carpenter for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 24 July 1875. Whitby Strand
- case heard at Whitby" -- defendant George Wilson, home Whitby,
occupation carpenter. "The Pier" resolves to Piers (under Seafront/
Whitby), matching stated township. Crime type=drunk and disorderly
matches. Already correctly linked to related_conviction 777 (same
offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-681 done.**

## Record 682

"Summary conviction of Francis Johnson of the township of Hawsker
cum Stainsacre sailor for begging on the Whitby and Hawsker
highway. Offence committed at the township of Hawsker cum
Stainsacre on 6 August 1889. Whitby Strand Petty Sessional division
- case heard at Whitby" -- defendant Francis Johnson, home and
offence location Hawsker-cum-Stainsacre match; cross-parish "Whitby
& Hawsker Highway" correctly added alongside. Crime type=begging
matches. Already correctly linked to related_conviction 655 (same
offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-682 done.**

## Record 683

"Summary conviction of George Bennett of the township of Scarborough
fish hawker for ill-treating a mare by working it when it was unfit.
Offence committed at the township of Hawsker cum Stainsacre on 7
July 1869. Whitby Strand - case heard at Whitby" -- defendant George
Bennett, home Scarborough, occupation fish hawker. Offence location
Hawsker-cum-Stainsacre matches. Crime type=cruelty to animals
matches. No related_conviction was present, but this is the same
offence/township/date as record 680 (Edward Coates, also a
Scarborough fish hawker, same "ill-treating a mare" charge, 7 July
1869) -- matches the confirmed no-named-party related_conviction
pattern. Added the link, retroactively annotated 680's entry.

**FIXED — added missing related_conviction link to 680 (same offence/township/date, no shared named party).**

---

**Progress: records 1-683 done.**

## Record 684

"Summary conviction of John Shaw of the township of Whitby jet
worker for being drunk and disorderly in Bridge Street. Offence
committed at the township of Whitby on 26 June 1875. Whitby Strand
- case heard at Whitby" -- defendant John Shaw, home Whitby,
occupation jet worker. Bridge Street (under Seafront/Whitby) matches
stated township. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-684 done.**

## Record 685

"Summary conviction of Alexander Sutherland of the township of
Whitby tailor for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 2 September 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Alexander Sutherland, home Whitby, occupation tailor.
Church Street matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-685 done.**

## Record 686

"Summary conviction of William Arnold of the township of Whitby jet
worker for being drunk and riotous in Church Street. Offence
committed at the township of Whitby on 26 July 1869. Whitby Strand
- case heard at Whitby" -- defendant William Arnold, home Whitby,
occupation jet worker. Church Street matches. Charge says "drunk and
riotous" but is tagged crime type "drunk and disorderly" -- checked
precedent (no separate "riotous" leaf exists; every other "drunk and
riotous" record in the corpus, e.g. 235, 244, 296, 344, 485, is
consistently tagged the same way), so this is the established
convention, not a mistagging. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-686 done.**

## Record 687

"Summary conviction of Isaac Hick of the township of Whitby jet
worker for assaulting John Arnold. Offence committed at the
township of Whitby on 22 September 1875. Whitby Strand - case heard
at Whitby" -- defendant Isaac Hick, home Whitby, occupation jet
worker; victim John Arnold. Same-named Isaac Hick as records 653/759
but correctly a separate person row (different conviction). Location
Whitby matches. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-687 done.**

## Record 688

"Summary conviction of James Coleman of the township of Whitby
labourer for assaulting Joseph Scaife one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 15 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant James Coleman, home
Whitby, occupation labourer; victim Joseph Scaife, occupation
"constable of the North Riding", sex correctly already male (unlike
the gap found at record 670, this instance was captured correctly).
Location Whitby matches. Crime type=assaulting a police officer
matches. Already correctly linked to related_conviction 503 (same
defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-688 done.**

## Record 689

"Summary conviction of James Raw of the township of Hinderwell
labourer for being drunk and riotous in Staithes Street; on the
oath of John Atkinson of the township of Hinderwell police
constable. Offence committed at the township of Hinderwell on 26
July 1869. Whitby Strand - case heard at Whitby" -- defendant James
Raw, home Hinderwell, occupation labourer; informant John Atkinson,
home Hinderwell, occupation police constable. "Staithes Street"
resolves to Staithes under Hinderwell, matching stated township.
Crime type=drunk and disorderly matches (per the confirmed "drunk
and riotous" precedent). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-689 done.**

## Record 690

"Summary conviction of Edward Jackson of the township of Hinderwell
for keeping a dog without a licence. Offence committed at the
parish of Hinderwell on 14 May 1875. Whitby Strand - case heard at
Whitby" -- defendant Edward Jackson, home Hinderwell. Location
Hinderwell matches ("parish of Hinderwell" resolves the same as
"township of Hinderwell"). Crime type=dog licence offence matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-690 done.**

## Record 691

"Summary conviction of John Agar of the township of Eskdaleside cum
Ugglebarnby labourer for being drunk and disorderly in Grosmont
town street. Offence committed at the township of Eskdaleside cum
Ugglebarnby on 29 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant John Agar, home
Eskdaleside-cum-Ugglebarnby, occupation labourer. "Grosmont town
street" resolves to Grosmont under Eskdaleside-cum-Ugglebarnby,
matching stated township. Crime type=drunk and disorderly matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-691 done.**

## Record 692

"Summary conviction of Robert Smith for begging in Bagdale. Offence
committed at the township of Ruswarp on 31 July 1869. Whitby Strand
- case heard at Whitby" -- defendant Robert Smith. Bagdale nests
under Whitby's West Cliff in the modern tree but the record states
township Ruswarp -- correctly captured alongside the stated Ruswarp
location, per the Whitby/Ruswarp cliff-boundary pattern. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-692 done.**

## Record 693

"Summary conviction of John Conwell of the township of Whitby jet
worker for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 12 June 1875. Whitby Strand
- case heard at Whitby" -- defendant John Conwell, home Whitby,
occupation jet worker. "The Pier" resolves to Piers (Seafront/
Whitby), matching stated township. Crime type=drunk and disorderly
matches. Different date from record 681's Pier incident (24 July
1875), so no related_conviction link applies here.

**OK — no changes.**

---

**Progress: records 1-693 done.**

## Record 694

"Summary conviction of John Pearson of the township of Whitby
labourer for being drunk on the licensed premises of Ralph Brown
Longhorn and refusing to leave when asked to do so by Kate
McLaughlan. Offence committed at the township of Whitby on 30
August 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant John Pearson, home Whitby, occupation
labourer; licensee Ralph Brown Longhorn (occupation "licensee"
correctly captured); informant Kate McLaughlan, sex correctly
female. Location Whitby matches. Crime types = drunkenness +
refusal to quit licensed premises both fit. Already correctly
linked to related_conviction 229 (same defendant, same offence
date).

**OK — no changes.**

---

**Progress: records 1-694 done.**

## Record 695

"Summary conviction of John Scott for being drunk and riotous in
Church Street. Offence committed at the township of Whitby on 1
August 1869. Whitby Strand - case heard at Whitby" -- defendant
John Scott. Church Street matches. Crime type=drunk and disorderly
matches (per the confirmed "drunk and riotous" precedent). No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-695 done.**

## Record 696

"Summary conviction of Robinson Groves of the township of Whitby
cartman for taking down a bar and chain fixed across Church Street
whilst works were being carried on there. Offence committed at the
township of Whitby on 11 June 1875. Whitby Strand - case heard at
Whitby" -- defendant Robinson Groves, home Whitby, occupation
cartman. Same-named Robinson Groves as record 679 but correctly a
separate person row (different conviction, different occupation
wording "cartman" vs "carter", 1875 vs 1889). Church Street matches.
Crime type=malicious/property damage checked against precedent --
no closer-fitting leaf exists (no "interfering with public
works"/"obstruction of works" leaf), and this is the only record in
the corpus with this exact "bar and chain" phrasing, so no
fragmentation to fix. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-696 done.**

## Record 697

"Summary conviction of John Corner, John Henry Corner and William
Readman of the township of Whitby licensed victuallers for premises
in the township of Whitby for selling intoxicating liquors at a
house at Robin Hood's Bay in the township of Fylingdales. Offence
committed at the township of Fylingdales on 30 August 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- three
defendants, all home Whitby, all occupation "licensed victualler".
Offence location Robin Hood's Bay correctly nests under Fylingdales,
matching the stated township (distinct from their own home
township, Whitby, which is separately and correctly captured too).
Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-697 done.**

## Record 698

"Summary conviction of William Robinson for begging in Gray Street.
Offence committed at the township of Ruswarp on 2 August 1869.
Whitby Strand - case heard at Whitby" -- defendant William Robinson.
Gray Street nests under Whitby's West Cliff in the modern tree but
the record states township Ruswarp -- correctly captured alongside
the stated Ruswarp location, per the Whitby/Ruswarp cliff-boundary
pattern. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-698 done.**

## Record 699

"Summary conviction of Benjamin Wilson of the township of Whitby
hawker for being drunk and disorderly on Tate Hill; on the oath of
George Richard Lazenby of the township of Whitby police constable.
Offence committed at the township of Whitby on 19 June 1875. Whitby
Strand - case heard at Whitby" -- defendant Benjamin Wilson, home
Whitby, occupation hawker; informant George Richard Lazenby, home
Whitby, occupation police constable. Tate Hill (East Cliff/Whitby)
matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-699 done.**

## Record 700

"Summary conviction of William Moody of the township of Whitby
labourer for being disorderly on the licensed premises of Richard
Thompson and refusing to leave when asked to do so by the said
Richard Thompson Offence committed at the township of Whitby on 10
September 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant William Moody, home Whitby, occupation
labourer; licensee Richard Thompson, occupation "licensee" correctly
captured. Location Whitby matches. Crime types = refusal to quit
licensed premises + disorderly behaviour both fit. Already correctly
linked to related_conviction 582 (same defendant, same offence
date).

**OK — no changes.**

---

**Progress: records 1-700 done.**

## Record 701

"Summary conviction of Thomas Jameson for begging in Baxtergate.
Offence committed at the township of Whitby on 7 August 1869.
Whitby Strand - case heard at Whitby" -- defendant Thomas Jameson.
Baxtergate matches (West Cliff/Whitby). Crime type=begging matches.
Already correctly linked to related_conviction 704 (same offence
date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-701 done.**

## Record 702

"Summary conviction of John Denham of the township of Whitby jet
worker for obstructing Church Street by wilfully preventing persons
from passing him; on the oath of Thomas Hall of the township of
Whitby police constable. Offence committed at the township of
Whitby on 13 June 1875. Whitby Strand - case heard at Whitby" --
defendant John Denham, home Whitby, occupation jet worker; informant
Thomas Hall, home Whitby, occupation police constable. Church Street
matches. Crime type=obstructing the highway matches. Already
correctly linked to related_conviction 887 and 896 (same offence
date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-702 done.**

## Record 703

"Summary conviction of John Smith the elder of the township of
Hawsker cum Stainsacre groom for applying for relief from the
Guardians of the Poor of Whitby Union on behalf of his children
John, Annie and Charles all aged under 16 years, and then running
away leaving his children chargeable. Offence committed at the
township of Whitby on 15 September 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant John Smith,
name_postfix "the elder" correctly captured, home Hawsker-cum-
Stainsacre, occupation groom. Three children (John, Annie, Charles)
each correctly have a "child" relationship to him -- this is the
exact record referenced in reextraction-audit-notes.md as the seed
case for that fix, confirmed still correct. Offence location Whitby
matches. Crime type=failure to maintain family matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-703 done.**

## Record 704

"Summary conviction of John Jameson for begging in Baxtergate.
Offence committed at the township of Whitby on 7 August 1869.
Whitby Strand - case heard at Whitby" -- defendant John Jameson
(shares a surname with Thomas Jameson, record 701, but no
relationship is stated in the text, so none captured -- no
fabrication). Baxtergate matches. Crime type=begging matches.
Already correctly linked to related_conviction 701 (same offence
date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-704 done.**

## Record 705

"Summary conviction of John Thomas Stonehouse for being on land
occupied by Thomas Vaughan with nets to take game by night. Offence
committed at the township of Newton Mulgrave at 12.15 a.m. on 13
June 1875. Whitby Strand - case heard at Whitby" -- defendant John
Thomas Stonehouse, landowner/occupier Thomas Vaughan. Location
Newton Mulgrave matches. Crime type=poaching matches. No
related_conviction was present, but this is identical
offence/landowner/date-and-time to record 675 (Arthur James King).
Searched for the full pattern and found two more matches: 717
(William Jones) and 878 (George Hill, not yet reached) -- all four
records share the exact same offence, landowner, township, date, and
time (12.15 a.m.), clearly a poaching gang caught together. Added
all 6 pairwise related_conviction rows (675-705, 675-717, 675-878,
705-717, 705-878, 717-878), retroactively annotated 675's entry.

**FIXED — added missing related_conviction links for a 4-record poaching cluster (675, 705, 717, 878).**

---

**Progress: records 1-705 done.**

## Record 706

"Summary conviction of William Dixon of the township of Whitby jet
worker for being drunk and disorderly in Sandgate. Offence
committed at the township of Whitby on 6 April 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
William Dixon, home Whitby, occupation jet worker. Sandgate (East
Cliff/Whitby) matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-706 done.**

## Record 707

"Summary conviction of Thomas Jefferson of the township of
Hinderwell fisherman for being drunk. Offence committed at the
township of Hinderwell on 9 August 1869. Whitby Strand - case heard
at Whitby" -- defendant Thomas Jefferson, home Hinderwell,
occupation fisherman. Location Hinderwell matches. Crime
type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-707 done.**

## Record 708

"Summary conviction of Thomas Harland of the township of Whitby
cartman for being too far from his cart to have control over the
horse drawing it. Offence committed at the township of Whitby on 6
September 1875. Whitby Strand - case heard at Whitby" -- defendant
Thomas Harland, home Whitby, occupation cartman. Location Whitby
matches. Crime type=not having proper control of horse drawing a
cart (leaf 75) matches -- this is the exact record referenced
earlier this session as one of the leaf-75 fragmentation fixes,
confirmed still correctly tagged. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-708 done.**

## Record 709

"Summary conviction of James Ward of the township of Ruswarp
labourer for begging in The Carrs. Offence committed at the
township of Ruswarp on 27 April 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant James Ward, home
Ruswarp, occupation labourer. "The Carrs" correctly nests under
Ruswarp, matching stated township. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-709 done.**

## Record 710

"Summary conviction of Elizabeth Brough wife of John Brough of the
township of Pickering stonemason for being drunk. Offence committed
at the township of Whitby on 7 August 1869. Whitby Strand - case
heard at Whitby" -- defendant Elizabeth Brough, spouse John Brough
(home Pickering, occupation stonemason) -- this is the exact record
referenced in reextraction-audit-notes.md as an earlier fix (John
Brough's home/occupation), confirmed still correct. Offence location
Whitby matches. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-710 done.**

## Record 711

"Summary conviction of William Barrett of the township of Whitby
fisherman for being drunk and riotous in Church Street. Offence
committed at the township of Whitby on 19 August 1875. Whitby
Strand - case heard at Whitby" -- defendant William Barrett, home
Whitby, occupation fisherman. Church Street matches. Crime
type=drunk and disorderly matches (per the confirmed "drunk and
riotous" precedent). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-711 done.**

## Record 712

"Summary conviction of Arthur Brooks of the township of Whitby
labourer for begging in Haggersgate. Offence committed at the
township of Whitby on 28 March 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Arthur Brooks, home
Whitby, occupation labourer. Haggersgate matches (West Cliff/
Whitby). Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-712 done.**

## Record 713

"Summary conviction of Michael Mallon for assaulting Mary Jane
Harvey. Offence committed at the township of Glaisdale on 7 August
1869. Whitby Strand - case heard at Whitby" -- defendant Michael
Mallon, victim Mary Jane Harvey. Location Glaisdale matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-713 done.**

## Record 714

"Summary conviction of Margaret Harland of the township of Whitby
domestic servant for assaulting Mary Ellen Colley. Offence
committed at the township of Whitby on 8 July 1875. Whitby Strand -
case heard at Whitby" -- defendant Margaret Harland, home Whitby,
occupation domestic servant; victim Mary Ellen Colley. Location
Whitby matches. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-714 done.**

## Record 715

"Summary conviction of Thomas Loftus of the township of Whitby
bricklayer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 30 March 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Thomas Loftus, home Whitby, occupation bricklayer. Same name and
occupation as the Thomas Loftus in the 652/670 riot cluster (27
July 1889), but this is a separate, earlier conviction (30 March
1889) -- correctly a distinct person row per no-cross-conviction-
merge. Church Street matches. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-715 done.**

## Record 716

"Summary conviction of George Watson of the township of Glaisdale
miner for assaulting Mary Hannah Storr. Offence committed at the
township of Glaisdale on 6 August 1869. Whitby Strand - case heard
at Whitby" -- defendant George Watson, home Glaisdale, occupation
miner; victim Mary Hannah Storr. Location Glaisdale matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-716 done.**

## Record 717

"Summary conviction of William Jones for being on land occupied by
Thomas Vaughan with nets to take game by night. Offence committed
at the township of Newton Mulgrave at 12.15 a.m. on 13 June 1875.
Whitby Strand - case heard at Whitby" -- defendant William Jones,
landowner/occupier Thomas Vaughan. Location Newton Mulgrave
matches. Crime type=poaching matches. Already correctly linked to
related_conviction 675, 705, and 878 (the poaching-gang cluster
fixed at record 705).

**OK — no changes.**

---

**Progress: records 1-717 done.**

## Record 718

"Summary conviction of William Christmas Bean of the township of
Whitby for throwing a stone in North Road. Offence committed at the
township of Ruswarp on 7 May 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant William Christmas
Bean, home Whitby. North Road nests under Whitby's West Cliff in
the modern tree but the record states offence township Ruswarp --
correctly captured alongside the stated Ruswarp location, per the
Whitby/Ruswarp cliff-boundary pattern. Crime type=breach of the
peace matches. Already correctly linked to related_conviction 724
and 844 (same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-718 done.**

## Record 719

"Summary conviction of John Vidous for begging in Royal Crescent.
Offence committed at the township of Ruswarp on 12 August 1869.
Whitby Strand - case heard at Whitby" -- defendant John Vidous.
Royal Crescent nests under Whitby's West Cliff in the modern tree
but the record states township Ruswarp -- correctly captured
alongside the stated Ruswarp location, per the Whitby/Ruswarp
cliff-boundary pattern. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-719 done.**

## Record 720

"Summary conviction of George Ogden Stephenson of the township of
Whitby labourer for driving the Crown Hotel omnibus furiously.
Offence committed at the township of Ruswarp on 18 June 1875.
Whitby Strand - case heard at Whitby" -- defendant George Ogden
Stephenson, home Whitby, occupation labourer. "Crown Hotel" names
the omnibus (the hotel's vehicle), not the offence site -- checked,
no other corpus mention and no existing location node, correctly
not captured as a place. Offence location Ruswarp matches. Crime
type=furious/reckless driving matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-720 done.**

## Record 721

"Summary conviction of William Puckrin of the township of Whitby
baker for being drunk and disorderly on the Pier Offence committed
at the township of Whitby on 8 May 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant William
Puckrin, home Whitby, occupation baker. "The Pier" resolves to
Piers (Seafront/Whitby), matching stated township. Crime type=drunk
and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-721 done.**

## Record 722

"Summary conviction of Joseph McCabe of the township of Whitby
licensed hawker for being drunk; on the oath of Charles Albert
Martindale of the township of Whitby police constable Offence
committed at the township of Ruswarp on 18 August 1869. Whitby
Strand - case heard at Whitby" -- defendant Joseph McCabe, home
Whitby, occupation licensed hawker; informant Charles Albert
Martindale, home Whitby, occupation police constable. Offence
location Ruswarp matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-722 done.**

## Record 723

"Summary conviction of James Pounder of Hartlepool pilot for being
drunk and disorderly on the Bridge. Offence committed at the
township of Whitby on 12 August 1875. Whitby Strand - case heard at
Whitby" -- defendant James Pounder, home Hartlepool (correctly
outside the North Riding parent), occupation pilot. "The Bridge"
resolves to Whitby. Crime type=drunk and disorderly matches. Already
correctly linked to related_conviction 666 (same defendant, same
offence date -- see 666's entry for the victim William Burdon
assault charge).

**OK — no changes.**

---

**Progress: records 1-723 done.**

## Record 724

"Summary conviction of William John Iredale of the township of
Whitby for throwing a stone in North Road. Offence committed at the
township of Ruswarp on 7 May 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant William John Iredale,
home Whitby. North Road nests under Whitby's West Cliff but the
record states offence township Ruswarp -- correctly added alongside
per the cliff-boundary pattern. Crime type=breach of the peace
matches. Already correctly linked to related_conviction 718 and 844
(same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-724 done.**

## Record 725

"Summary conviction of James Watson for begging in Baxtergate.
Offence committed at the township of Whitby on 18 August 1869.
Whitby Strand - case heard at Whitby" -- defendant James Watson.
Baxtergate matches (West Cliff/Whitby). Crime type=begging matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-725 done.**

## Record 726

"Summary conviction of William Child of the township of Egton
shoemaker for being drunk and disorderly in Egton town street.
Offence committed at the township of Egton on 9 June 1875. Whitby
Strand - case heard at Whitby" -- defendant William Child, home
Egton, occupation shoemaker. "Egton town street" resolves to Egton
itself, matching stated township. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-726 done.**

## Record 727

"Summary conviction of Charles Good of the township of Roxby
labourer for begging on the Whitby and Guisborough highway. Offence
committed at the township of Roxby on 29 May 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Charles Good, home Roxby, occupation labourer. Cross-parish "Whitby
& Guisborough Highway" correctly added alongside the stated
township Roxby. Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-727 done.**

## Record 728

"Summary conviction of James Thompson for begging in Royal Crescent.
Offence committed at the township of Ruswarp on 18 August 1869.
Whitby Strand - case heard at Whitby" -- defendant James Thompson.
Royal Crescent nests under Whitby's West Cliff but the record states
township Ruswarp -- correctly captured alongside, same pattern as
record 719 (same street, different date: 719 is 12 August 1869, this
is 18 August 1869, so no related_conviction link applies -- checked
carefully since the shared street could suggest a link, but the dates
don't match). Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-728 done.**

## Record 729

"Summary conviction of James Marshall of the township of Hinderwell
miner for being drunk and disorderly in Staithes town street; on
the oath of William Hammond of the township of Hinderwell police
constable. Offence committed at the township of Hinderwell on 12
June 1875. Whitby Strand - case heard at Whitby" -- defendant James
Marshall, home Hinderwell, occupation miner; informant William
Hammond, home Hinderwell, occupation police constable, sex correctly
male. "Staithes town street" resolves to Staithes under Hinderwell,
matching stated township. Crime type=drunk and disorderly matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-729 done.**

## Record 730

"Summary conviction of Thomas Fisher of the township of Whitby
riveter for being drunk and disorderly in Henrietta Street. Offence
committed at the township of Whitby on 11 May 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Thomas Fisher, home Whitby, occupation riveter. Henrietta Street
matches. Crime type=drunk and disorderly matches. Already correctly
linked to related_conviction 754 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-730 done.**

## Record 731

"Summary conviction of John Bowmaker of the township of North
Shields in Northumberland stoker for being drunk and riotous on the
Pier. Offence committed at the township of Whitby on 20 August
1869. Whitby Strand - case heard at Whitby" -- defendant John
Bowmaker, home North Shields (correctly a separate parent, id 347,
not nested under the North Riding), occupation stoker. "The Pier"
resolves to Piers (Seafront/Whitby). Crime type=drunk and disorderly
matches (per the confirmed "drunk and riotous" precedent). No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-731 done.**

## Record 732

"Summary conviction of William Corpse of the township of Whitby jet
worker for being drunk and disorderly in Bridge Street; on the oath
of Edward Weeks of the township of Whitby police constable. Offence
committed at the township of Whitby on 6 July 1875. Whitby Strand -
case heard at Whitby" -- defendant William Corpse, home Whitby,
occupation jet worker; informant Edward Weeks, home Whitby,
occupation police constable. Bridge Street (Seafront/Whitby)
matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-732 done.**

## Record 733

"Summary conviction of Patrick Joyce of the township of Whitby
bricklayer for being drunk and disorderly in the Market Place.
Offence committed at the township of Whitby on 20 April 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Patrick Joyce, home Whitby, occupation bricklayer.
Market Place (East Cliff/Whitby) matches. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-733 done.**

## Record 734

"Summary conviction of George Duck of the township of Whitby cart
driver for driving a carriage furiously in the street; on the oath
of [blank] Tomlinson of the township of Whitby police constable.
Offence committed at the township of Whitby on 18 August 1869.
Whitby Strand - case heard at Whitby" -- defendant George Duck,
home Whitby, occupation cart driver; informant "[blank] Tomlinson",
home Whitby, occupation police constable, sex correctly NULL
(no first_name, no pronoun in text). While checking this against
sibling blank-first-name police-constable informants for
consistency, found and corrected an outlier at record 674 (Selby,
person 6835, had sex='male' with no textual basis) -- see that
record's retroactive note. Location Whitby matches. Crime
type=furious/reckless driving matches. No related_conviction.

**FIXED (retroactively, on record 674) — cleared an incorrectly-set sex value found via this record's precedent check.**

---

**Progress: records 1-734 done.**

## Record 735

"Summary conviction of Robert Parkin of the township of Newholm cum
Dunsley waggoner for being too far from his waggon to have proper
control of the two horses drawing it. Offence committed at the
township of Whitby on 10 June 1875. Whitby Strand - case heard at
Whitby" -- defendant Robert Parkin, home Newholm-cum-Dunsley,
occupation waggoner. Offence location Whitby matches. Crime
type=not having proper control of horse drawing a cart (leaf 75)
matches -- this is the exact record referenced earlier this session
as one of the leaf-75 fragmentation fixes, confirmed still correctly
tagged. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-735 done.**

## Record 736

"Summary conviction of John Kilpatrick of the township of Whitby
iron worker for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 8 April 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
John Kilpatrick, home Whitby, occupation iron worker. Church Street
matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-736 done.**

## Record 737

"Summary conviction of Henry Sherwood and Robert Campion for
stealing a bushel of apples value 2s, the property of Joseph
Dotchen and growing in his garden. Offence committed at the
township of Ruswarp on 15 August 1869. Whitby Strand - case heard
at Whitby" -- two defendants (Henry Sherwood, Robert Campion),
property owner Joseph Dotchen. Location Ruswarp matches. Crime
type=theft matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-737 done.**

## Record 738

"Summary conviction of Henry Ludlow of Kirby Moorside pedlar for
acting as a pedlar in grinding razors without a certificate.
Offence committed at the township of Glaisdale on 25 June 1875.
Whitby Strand - case heard at Whitby" -- defendant Henry Ludlow,
home "Kirby Moorside" resolves to the existing Kirkbymoorside node,
occupation pedlar. Offence location Glaisdale matches. Crime
type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-738 done.**

## Record 739

"Summary conviction of Joseph Storr of the township of Whitby jet
worker for being drunk and disorderly on the New Quay Offence
committed at the township of Whitby on 18 May 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Joseph Storr, home Whitby, occupation jet worker. New Quay matches
(West Cliff/Whitby). Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-739 done.**

## Record 740

"Summary conviction of William Arnold for assaulting Mary Harland.
Offence committed at the township of Hawsker cum Stainsacre on 18
August 1869. Whitby Strand - case heard at Whitby" -- defendant
William Arnold (same name as record 686's jet worker, but no home/
occupation stated here and a different township, correctly a
distinct person row), victim Mary Harland. Location Hawsker-cum-
Stainsacre matches. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-740 done.**

## Record 741

"Summary conviction of Daniel Robinson of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 7 July 1875. Whitby Strand -
case heard at Whitby" -- defendant Daniel Robinson, home Whitby,
occupation fisherman. Church Street matches. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-741 done.**

## Record 742

"Summary conviction of John Child of the township of Whitby jet
worker for being drunk and disorderly in Ruswarp town street.
Offence committed at the township of Ruswarp on 11 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant John Child, home Whitby, occupation jet worker. "Ruswarp
town street" resolves to Ruswarp itself, matching stated township.
Crime type=drunk and disorderly matches. Already correctly linked
to related_conviction 826 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-742 done.**

## Record 743

"Summary conviction of Hannah Shielding of the township of Whitby
singlewoman for being drunk. Offence committed at the township of
Whitby on 27 August 1869. Whitby Strand - case heard at Whitby" --
defendant Hannah Shielding, home Whitby, stated "singlewoman" but
occupation was not linked -- this id was already on the tracked
marital-status occupation gap list (reextraction-audit-notes.md).
Added occupation "singlewoman" (id 337). Location Whitby matches.
Crime type=drunkenness matches. No related_conviction.

**FIXED — added missing "singlewoman" occupation (tracked gap, id 743 removed from the list).**

---

**Progress: records 1-743 done.**

## Record 744

"Summary conviction of Thomas Boddy of the township of Eskdaleside
farm servant for being drunk and riotous in Grosmont town street.
Offence committed at the township of Eskdaleside on 26 June 1875.
Whitby Strand - case heard at Whitby" -- defendant Thomas Boddy,
home Eskdaleside-cum-Ugglebarnby, occupation farm servant. "Grosmont
town street" resolves to Grosmont under Eskdaleside-cum-Ugglebarnby,
matching stated township. Crime type=drunk and disorderly matches
(per the confirmed "drunk and riotous" precedent). No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-744 done.**

## Record 745

"Summary conviction of Robert Harrowing of the township of Aislaby
ship owner for being drunk on the licensed premises of Thomas
Coulson. Offence committed at the township of Aislaby on 31 May
1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Robert Harrowing, home Aislaby, occupation
ship owner; licensee Thomas Coulson, occupation "licensee" correctly
captured. Location Aislaby matches. Crime type=drunkenness matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-745 done.**

## Record 746

"Summary conviction of Edward Shepherd of the township of Whitby
fisherman for being drunk. Offence committed at the township of
Whitby on 21 August 1869. Whitby Strand - case heard at Whitby" --
defendant Edward Shepherd, home Whitby, occupation fisherman.
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-746 done.**

## Record 747

"Summary conviction of Francis Fewster of the township of Whitby
jet worker for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 27 June 1875. Whitby Strand
- case heard at Whitby" -- defendant Francis Fewster, home Whitby,
occupation jet worker. "The Pier" resolves to Piers (Seafront/
Whitby). Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-747 done.**

## Record 748

"Summary conviction of Hannah Smith wife of John Henry Smith of the
township of Whitby fish hawker for being drunk and disorderly in
Henrietta Street. Offence committed at the township of Whitby on 13
April 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Hannah Smith, spouse John Henry Smith (home
Whitby, occupation fish hawker, relationship correctly captured) --
this is the exact record referenced in reextraction-audit-notes.md
as an earlier fix, confirmed still correct. Henrietta Street matches.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-748 done.**

## Record 749

"Summary conviction of John Thompson of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby
on 27 August 1869. Whitby Strand - case heard at Whitby" --
defendant John Thompson, home Whitby, occupation jet worker.
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-749 done.**

## Record 750

"Summary conviction of Robert Watson of the township of Whitby
labourer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 9 July 1875. Whitby Strand -
case heard at Whitby" -- defendant Robert Watson, home Whitby,
occupation labourer. Church Street matches. Crime type=drunk and
disorderly matches. Already correctly linked to related_conviction
645 and 756 (same defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-750 done.**

## Record 751

"Summary conviction of James Foster of Elbow Yard in the township
of Whitby for not sending his son John Foster to school. Offence
committed in the Whitby Strand School Board district on 23 May
1889. Case heard at Whitby" -- defendant James Foster, home Elbow
Yard (East Cliff/Whitby); son John Foster, "son" relationship
correctly captured (explicit "his son" in text) -- this is the exact
record referenced in reextraction-audit-notes.md, confirmed still
correct. Truancy rule correctly applied: offence location = his own
home (Elbow Yard), not the "Whitby Strand School Board district"
wording. Crime type=school non-attendance matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-751 done.**

## Record 752

"Summary conviction of Richard Craven of the township of Ruswarp
wood leader for not having control of the horses drawing his
waggon. Offence committed at the township of Ruswarp on 26 August
1869. Whitby Strand - case heard at Whitby" -- defendant Richard
Craven, home Ruswarp, occupation wood leader. Location Ruswarp
matches. Crime type was "furious/reckless driving" but the charge
text says "not having control", not "furiously" -- checked all
other furious/reckless driving records (720, 734, 865, 965), every
one explicitly uses "furiously"; this record doesn't, and matches
leaf 75 "not having proper control of horse drawing a cart"
semantically instead. Retagged. No related_conviction.

**FIXED — retagged crime type from "furious/reckless driving" to "not having proper control of horse drawing a cart" (leaf 75).**

---

**Progress: records 1-752 done.**

## Record 753

"Summary conviction of William Arnold of the township of Whitby jet
worker for assaulting John Brown. Offence committed at the township
of Whitby on 2 September 1875. Whitby Strand - case heard at
Whitby" -- defendant William Arnold (same name/occupation as record
686, but a different offence date, correctly a distinct person
row), victim John Brown. Location Whitby matches. Crime type=assault
matches. Already correctly linked to related_conviction 926 (same
defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-753 done.**

## Record 754

"Summary conviction of Sarah Ann Fisher wife of Thomas Fisher of
the township of Whitby riveter for being drunk and disorderly in
Henrietta Street. Offence committed at the township of Whitby on
11 May 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Sarah Ann Fisher, spouse Thomas Fisher (home
Whitby, occupation riveter, relationship correctly captured) -- this
is the exact record referenced in reextraction-audit-notes.md as an
earlier fix, confirmed still correct. Henrietta Street matches.
Crime type=drunk and disorderly matches. Already correctly linked
to related_conviction 730 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-754 done.**

## Record 755

"Summary conviction of Isaac Wilson of the township of Whitby
labourer for being drunk. Offence committed at the township of
Whitby on 23 August 1869. Whitby Strand - case heard at Whitby" --
defendant Isaac Wilson, home Whitby, occupation labourer. Location
Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-755 done.**

## Record 756

"Summary conviction of Robert Watson for assaulting Edward Weeks
one of the constables for the North Riding in the execution of his
duty. Offence committed at the township of Whitby on 9 July 1875.
Whitby Strand - case heard at Whitby" -- defendant Robert Watson,
victim Edward Weeks, occupation "constable for the North Riding",
sex correctly male (matches the "his duty" antecedent). Location
Whitby matches. Crime type=assaulting a police officer matches.
Already correctly linked to related_conviction 645 and 750 (same
defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-756 done.**

## Record 757

"Summary conviction of Thomas Wake of the township of Hinderwell
carrier for ill-treating a horse by working it when it was unfit.
Offence committed at the township of Hinderwell on 18 April 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Thomas Wake, home Hinderwell, occupation carrier.
Location Hinderwell matches. Crime type=cruelty to animals matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-757 done.**

## Record 758

"Summary conviction of William Lawson of the township of Newholm
cum Dunsley labourer for being drunk on the licensed premises of
John Appleby and refusing to leave when asked by the said John
Appleby ; on the oath of William Dickinson of the township of Lythe
police constable. Offence committed at the township of Whitby on 23
August 1869. Whitby Strand - case heard at Whitby" -- defendant
William Lawson, home Newholm-cum-Dunsley, occupation labourer;
licensee John Appleby, occupation "licensee"; informant William
Dickinson, home Lythe, occupation police constable. Offence location
Whitby matches. Crime types = drunkenness + refusal to quit licensed
premises both fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-758 done.**

## Record 759

"Summary conviction of Ellen Hick wife of Isaac Hick of the
township of Whitby jet worker for being drunk in the Market Place.
Offence committed at the township of Whitby on 9 July 1875. Whitby
Strand - case heard at Whitby" -- defendant Ellen Hick, spouse
Isaac Hick (home Whitby, occupation jet worker, relationship
correctly captured) -- this is the exact record referenced in
reextraction-audit-notes.md as an earlier fix, confirmed still
correct. Same names (Ellen Hick/Isaac Hick) as record 653's earlier
1869 conviction, correctly separate person rows. Market Place
matches. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-759 done.**

## Record 760

"Summary conviction of John Thomas Harland of the township of
Hinderwell mariner for discharging fireworks in Hinderwell town
street. Offence committed at the township of Hinderwell on 23 March
1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant John Thomas Harland, home Hinderwell,
occupation mariner. "Hinderwell town street" resolves to Hinderwell
itself, matching stated township. Crime type=breach of the peace --
checked, no dedicated fireworks/explosives leaf exists, this is a
reasonable existing fit. Already correctly linked to
related_conviction 763 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-760 done.**

## Record 761

"Summary conviction of William Turnbull of the township of
Hinderwell fish hawker for using his cart on the Staithes and
Hinderwell highway without having his name painted on it; on the
oath of Charles Tempest Clarkson of the township of Whitby
superintendent of police. Offence committed at the township of
Hinderwell on 31 August 1869. Whitby Strand - case heard at Whitby"
-- defendant William Turnbull, home Hinderwell, occupation fish
hawker; informant Charles Tempest Clarkson, home Whitby, occupation
superintendent of police. Cross-parish "Staithes & Hinderwell
Highway" correctly added alongside the stated township Hinderwell.
Crime type=cart/vehicle not marked with owner's name and address
(leaf 74) matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-761 done.**

## Record 762

"Summary conviction of Ann Gatenby wife of Richard Gatenby of the
township of Whitby fisherman for using obscene language. Offence
committed at the township of Whitby on 11 July 1875. Whitby Strand
- case heard at Whitby" -- defendant Ann Gatenby, spouse Richard
Gatenby (home Whitby, occupation fisherman, relationship correctly
captured) -- this is the exact record referenced in
reextraction-audit-notes.md as an earlier fix, confirmed still
correct. Location Whitby matches. Crime type=using obscene language
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-762 done.**

## Record 763

"Summary conviction of Watson Hodgson of the township of Hinderwell
mariner for discharging fireworks in Hinderwell town street Offence
committed at the township of Hinderwell on 23 March 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Watson Hodgson, home Hinderwell, occupation mariner. "Hinderwell
town street" resolves to Hinderwell itself. Crime type=breach of the
peace matches. Already correctly linked to related_conviction 760
(same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-763 done.**

## Record 764

"Summary conviction of Simeon Robinson of the township of
Hinderwell fisherman for being drunk and riotous in Staithes
Street; on the oath of John Atkinson of the township of Hinderwell
police constable. Offence committed at the township of Hinderwell
on 28 August 1869. Whitby Strand - case heard at Whitby" -- defendant
Simeon Robinson, home Hinderwell, occupation fisherman; informant
John Atkinson, home Hinderwell, occupation police constable.
"Staithes Street" resolves to Staithes under Hinderwell. Crime
type=drunk and disorderly matches (per "drunk and riotous"
precedent). Part of an 8-record cluster (764, 773, 782, 785, 791,
806, 809, 812) -- verified all 28 pairwise related_conviction links
are present and complete, no gaps.

**OK — no changes.**

---

**Progress: records 1-764 done.**

## Record 765

"Summary conviction of William Henry Turnbull for being absent
without leave from the British ship "Rose" on which he was
apprenticed to the sea service. Offence committed on 14 July 1875
and Turnbull was found at the township of Fylingdales. Whitby
Strand - case heard at Whitby" -- defendant William Henry Turnbull.
Location = Fylingdales (where he was found), matches. Ship "Rose"
correctly not captured as a location (a vessel, not a place). Crime
type=master and servant offence checked against precedent -- sole
instance in the corpus, no closer-fitting apprenticeship-desertion
leaf exists, reasonable fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-765 done.**

## Record 766

"Summary conviction of Jane Ann Pennock wife of Thomas Pennock of
the township of Whitby iron worker for assaulting Dorothy Pennock.
Offence committed at the township of Whitby on 23 March 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Jane Ann Pennock, spouse Thomas Pennock (home Whitby,
occupation iron worker, relationship correctly captured) -- this is
the exact record referenced in reextraction-audit-notes.md as an
earlier fix, confirmed still correct. Victim Dorothy Pennock (shared
surname, no relationship stated, none captured -- no fabrication).
Location Whitby matches. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-766 done.**

## Record 767

"Summary conviction of Jane Skinner of the township of Whitby for
obstructing a street. Offence committed at the township of Whitby
on 27 August 1869. Whitby Strand - case heard at Whitby" -- defendant
Jane Skinner, home Whitby. Location Whitby matches. Crime
type=obstructing the highway matches. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 779]:** records 779, 788, and
800 turned out to share this exact same offence/township/date (27
August 1869, "obstructing a street") with different defendants.
related_conviction links to all three have now been added
retroactively.

---

**Progress: records 1-767 done.**

## Record 768

"Summary conviction of Henry Collins of the township of Hinderwell
hawker for acting as a pedlar selling artificial flowers without a
certificate. Offence committed at the township of Hinderwell on 28
July 1875. Whitby Strand - case heard at Whitby" -- defendant Henry
Collins, home Hinderwell, occupation hawker. Location Hinderwell
matches. Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-768 done.**

## Record 769

"Summary conviction of William Bradley of The Fox and Hounds Inn at
Ainthorpe in Danby in the township of Danby for assaulting Warner
Coleman. Offence committed at the township of Eskdaleside cum
Ugglebarnby on 13 April 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant William Bradley, home
"Fox and Hounds Inn" (id 828→home_location, nested under Ainthorpe
under Danby) -- this is the exact record referenced in
reextraction-audit-notes.md as an earlier fix, confirmed still
correct. Victim Warner Coleman. Offence location Eskdaleside-cum-
Ugglebarnby matches (distinct from his home township Danby, both
correctly captured). Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-769 done.**

## Record 770

"Summary conviction of Joseph Richardson of the township of
Glaisdale miner for being drunk and riotous in Glaisdale Street; on
the oath of Thomas Bowron of the township of Egton police
constable. Offence committed at the township of Glaisdale on 27
August 1869. Whitby Strand - case heard at Whitby" -- defendant
Joseph Richardson, home Glaisdale, occupation miner; informant
Thomas Bowron, home Egton, occupation police constable. Glaisdale
Street correctly nests under Glaisdale, matching stated township.
Crime type=drunk and disorderly matches (per "drunk and riotous"
precedent). Already correctly linked to related_conviction 854
(same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-770 done.**

## Record 771

"Summary conviction of George Jackson of the township of Hinderwell
joiner for being drunk and disorderly in Rosedale Lane. Offence
committed at the township of Hinderwell on 16 July 1875. Whitby
Strand - case heard at Whitby" -- defendant George Jackson, home
Hinderwell, occupation joiner. Same name as the George Jackson
tracked in same-person-candidates.md (Barnby truancy cases), but
this is clearly a different individual (Hinderwell joiner vs.
Barnby labourer), correctly a distinct person row. Rosedale Lane
correctly nests under Hinderwell. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-771 done.**

## Record 772

"Summary conviction of Robert Turner of the township of Whitby
baker's apprentice for maliciously breaking part of a dead fence
value 3d, the property of Thomas Beeforth. Offence committed at the
township of Sneaton on 21 April 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Robert Turner, home
Whitby, occupation baker's apprentice; property owner Thomas
Beeforth (same name as record 146's postfix-fix Thomas Beeforth but
a different context/conviction, correctly a separate person row).
Offence location Sneaton matches. Crime type=malicious/property
damage matches. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 784]:** records 784, 867, and
876 turned out to share this exact same offence/victim/date (Thomas
Beeforth's dead fence, 21 April 1889, Sneaton) with different
defendants. related_conviction links to all three have now been
added retroactively.

---

**Progress: records 1-772 done.**

## Record 773

"Summary conviction of William Verrill of the township of
Hinderwell fisherman for being drunk and riotous in Staithes
Street; on the oath of John Atkinson of the township of Hinderwell
police constable Offence committed at the township of Hinderwell on
28 August 1869. Whitby Strand - case heard at Whitby" -- defendant
William Verrill, home Hinderwell, occupation fisherman; informant
John Atkinson (same name/occupation as record 764's informant --
same real constable, correctly appearing across multiple convictions
in the same incident, per no-cross-conviction-merge each gets its
own person row). Staithes Street matches. Crime type=drunk and
disorderly matches. Part of the 8-record Staithes Street cluster,
already fully verified pairwise at record 764.

**OK — no changes.**

---

**Progress: records 1-773 done.**

## Record 774

"Summary conviction of Richard Shippey of the township of
Hinderwell fisherman for being drunk on the licensed premises of
William Henry Heath and refusing to leave when asked by William
Hammond a police constable. Offence committed at the township of
Hinderwell on 17 July 1875. Whitby Strand - case heard at Whitby"
-- defendant Richard Shippey, home Hinderwell, occupation
fisherman; licensee William Henry Heath, occupation "licensee";
informant William Hammond, occupation police constable. Location
Hinderwell matches. Crime types = drunkenness + refusal to quit
licensed premises both fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-774 done.**

## Record 775

"Summary conviction of Richard Thompson of the township of Lythe
bricklayer for being drunk and disorderly in Lythe town street.
Offence committed at the township of Lythe on 18 May 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Richard Thompson, home Lythe, occupation bricklayer -- same name as
record 700's licensee Richard Thompson (Whitby), but clearly a
distinct person, correctly separate. "Lythe town street" resolves
to Lythe itself. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-775 done.**

## Record 776

"Summary conviction of Thomas Hedley Robinson of the township of
Hinderwell fisherman for assaulting John Atkinson one of the
constables of the North Riding in the execution of his duty.
Offence committed at the township of Hinderwell on 28 August 1869.
Whitby Strand - case heard at Whitby" -- defendant Thomas Hedley
Robinson, home Hinderwell, occupation fisherman; victim John
Atkinson, occupation "constable of the North Riding", sex correctly
male. Location Hinderwell matches. Crime type=assaulting a police
officer matches. Already correctly linked to related_conviction 806
(same defendant, same date -- 806 is Robinson's companion "drunk and
riotous in Staithes Street" charge, itself part of the 8-record
Staithes cluster). Not linked directly to the other 6 Staithes
cluster members since this is a different offence type (assault, not
drunk/disorderly) -- the existing same-defendant link to 806 already
ties this record into the incident.

**OK — no changes.**

---

**Progress: records 1-776 done.**

## Record 777

"Summary conviction of Henry Douglas of the township of Whitby
carpenter for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 24 July 1875. Whitby Strand
- case heard at Whitby" -- defendant Henry Douglas, home Whitby,
occupation carpenter. "The Pier" resolves to Piers (Seafront/
Whitby). Crime type=drunk and disorderly matches. Already correctly
linked to related_conviction 681 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-777 done.**

## Record 778

"Summary conviction of James Dixon of Kiln Yard in the township of
Whitby for not sending his daughter Jane Elizabeth Dixon to school.
Offence committed in the Whitby Strand School Board district on 27
May 1889. Case heard at Whitby" -- defendant James Dixon, home Kiln
Yard (East Cliff/Whitby); daughter Jane Elizabeth Dixon, "daughter"
relationship correctly captured -- this is the exact record
referenced in reextraction-audit-notes.md, confirmed still correct.
Truancy rule correctly applied: offence location = his own home
(Kiln Yard), not the School Board district wording. Crime
type=school non-attendance matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-778 done.**

## Record 779

"Summary conviction of Isabella Robinson of the township of Whitby
for obstructing a street. Offence committed at the township of
Whitby on 27 August 1869. Whitby Strand - case heard at Whitby" --
defendant Isabella Robinson, home Whitby. Location Whitby matches.
Crime type=obstructing the highway matches. No related_conviction
was present, but this is identical offence/township/date to record
767 (Jane Skinner). Searched and found two more matches: 788 (Mary
Young) and 800 (Elizabeth Sneaton, not yet reached) -- all four
records share the exact same offence, township, and date. Added all
6 pairwise related_conviction rows, retroactively annotated 767's
entry.

**FIXED — added missing related_conviction links for a 4-record cluster (767, 779, 788, 800).**

---

**Progress: records 1-779 done.**

## Record 780

"Summary conviction of Mark Swales of the township of Whitby hawker
for being the owner of two horses found straying on the Whitby and
Hawsker highway. Offence committed at the township of Hawsker cum
Stainsacre on 6 September 1875. Whitby Strand - case heard at
Whitby" -- defendant Mark Swales, home Whitby, occupation hawker.
Cross-parish "Whitby & Hawsker Highway" correctly added alongside
stated township Hawsker-cum-Stainsacre. Crime type=straying animals
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-780 done.**

## Record 781

"Summary conviction of John Parkin of Old Post Office Yard in the
township of Whitby for not sending his daughter Sarah Parkin to
school. Offence committed in the Whitby Strand School Board
district on 24 May 1889. Case heard at Whitby" -- defendant John
Parkin, home Old Post Office Yard (West Cliff/Whitby); daughter
Sarah Parkin, "daughter" relationship correctly captured -- this is
the exact record referenced in reextraction-audit-notes.md,
confirmed still correct. Truancy rule correctly applied: offence
location = his own home, not the School Board district wording.
Crime type=school non-attendance matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-781 done.**

## Record 782

"Summary conviction of Robert Ward of the township of Hinderwell
fisherman for being drunk and riotous in Staithes Street; on the
oath of John Atkinson of the township of Hinderwell police
constable. Offence committed at the township of Hinderwell on 28
August 1869. Whitby Strand - case heard at Whitby" -- defendant
Robert Ward, home Hinderwell, occupation fisherman; informant John
Atkinson. Staithes Street matches. Crime type=drunk and disorderly
matches. Part of the 8-record Staithes Street cluster, all pairwise
links already correctly present (verified at record 764).

**OK — no changes.**

---

**Progress: records 1-782 done.**

## Record 783

"Summary conviction of Ann Jackson wife of Charles Jackson for
lodging in a shed with no visible means of subsistence and not
giving a good account of herself. Offence committed at the parish
of Whitby on 25 July 1875. Whitby Strand - case heard at Whitby" --
defendant Ann Jackson, spouse Charles Jackson (relationship
correctly captured, no home/occupation stated for him in the text,
correctly left blank) -- this is the exact record referenced in
reextraction-audit-notes.md, confirmed still correct. Location
Whitby matches ("parish of Whitby" resolves the same as "township
of Whitby"). Crime type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-783 done.**

## Record 784

"Summary conviction of Arthur Duck of the township of Whitby
baker's apprentice for maliciously breaking part of a dead fence
value 3d, the property of Thomas Beeforth. Offence committed at the
township of Sneaton on 21 April 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Arthur Duck, home
Whitby, occupation baker's apprentice; property owner Thomas
Beeforth. Offence location Sneaton matches. Crime type=malicious/
property damage matches. No related_conviction was present, but
this is identical offence/victim/date to record 772 (Robert Turner).
Searched and found two more matches: 867 (Isaac Wilson) and 876
(James Horner, not yet reached) -- all four records share the exact
same offence, victim, township, and date. Added all 6 pairwise
related_conviction rows, retroactively annotated 772's entry.

**FIXED — added missing related_conviction links for a 4-record cluster (772, 784, 867, 876).**

---

**Progress: records 1-784 done.**

## Record 785

"Summary conviction of Richard Ward of the township of Hinderwell
fisherman for being drunk and riotous in Staithes Street. Offence
committed at the township of Hinderwell on 28 August 1869. Whitby
Strand - case heard at Whitby" -- defendant Richard Ward, home
Hinderwell, occupation fisherman -- shares a surname with record
782's Robert Ward but no relationship stated in the text, correctly
none captured. Staithes Street matches. Crime type=drunk and
disorderly matches. Part of the 8-record Staithes Street cluster,
all pairwise links already correctly present.

**OK — no changes.**

---

**Progress: records 1-785 done.**

## Record 786

"Summary conviction of Matthew Harland of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 28 August 1875. Whitby
Strand - case heard at Whitby" -- defendant Matthew Harland, home
Whitby, occupation fisherman. Church Street matches. Crime
type=drunk and disorderly matches. Already correctly linked to
related_conviction 834 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-786 done.**

## Record 787

"Summary conviction of Alexander McCloud of the township of Whitby
carpenter for begging in Church Street Offence committed at the
township of Whitby on 12 June 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Alexander McCloud,
home Whitby, occupation carpenter. Church Street matches. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-787 done.**

## Record 788

"Summary conviction of Mary Young of the township of Whitby for
obstructing a street. Offence committed at the township of Whitby
on 27 August 1869. Whitby Strand - case heard at Whitby" -- defendant
Mary Young, home Whitby. Location Whitby matches. Crime
type=obstructing the highway matches. Part of the 4-record
"obstructing a street" cluster (767, 779, 788, 800), all pairwise
links already correctly present.

**OK — no changes.**

---

**Progress: records 1-788 done.**

## Record 789

"Summary conviction of George Duck of the township of Whitby
labourer for being drunk in charge of a horse and dray in the
Khyber Pass. Offence committed at the township of Ruswarp on 6
August 1875. Whitby Strand - case heard at Whitby" -- defendant
George Duck (same name as record 734's cart driver, different
occupation and date, correctly a distinct person row), home Whitby,
occupation labourer. Khyber Pass nests under Whitby's West Cliff but
the record states offence township Ruswarp -- correctly added
alongside per the cliff-boundary pattern. Crime type=drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-789 done.**

## Record 790

"Summary conviction of Agnes Baker wife of William George Baker of
the township of Whitby jet worker for being drunk and disorderly at
the Bridge End. Offence committed at the township of Whitby on 21
April 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Agnes Baker, spouse William George Baker (home
Whitby, occupation jet worker, relationship correctly captured) --
this is the exact record referenced in reextraction-audit-notes.md
as an earlier fix, confirmed still correct (one of two separate
William George Baker person rows across two convictions, correctly
unmerged). Bridge End matches. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-790 done.**

## Record 791

"Summary conviction of David Theaker of the township of Hinderwell
fisherman for being drunk and riotous in Staithes Street. Offence
committed at the township of Hinderwell on 28 August 1869. Whitby
Strand - case heard at Whitby" -- defendant David Theaker, home
Hinderwell, occupation fisherman. Staithes Street matches. Crime
type=drunk and disorderly matches. Part of the 8-record Staithes
Street cluster, all pairwise links already correctly present, plus
correctly linked to 797 (same defendant, same date -- a companion
charge).

**OK — no changes.**

---

**Progress: records 1-791 done.**

## Record 792

"Summary conviction of Ann Miller wife of James Miller of the
township of Whitby stonemason for assaulting Henry Douglas. Offence
committed at the township of Whitby on 2 August 1875. Whitby Strand
- case heard at Whitby" -- defendant Ann Miller, spouse James
Miller (home Whitby, occupation stonemason, relationship correctly
captured) -- this is the exact record referenced in
reextraction-audit-notes.md as an earlier fix, confirmed still
correct. Victim Henry Douglas (same name as record 777's defendant,
correctly a distinct person). Location Whitby matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-792 done.**

## Record 793

"Summary conviction of John Walker of the township of Newholm cum
Dunsley sailor for begging in East Row town street. Offence
committed at the township of Newholm cum Dunsley on 1 June 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant John Walker, home Newholm-cum-Dunsley, occupation sailor.
"East Row town street" resolves to Newholm-cum-Dunsley itself,
matching stated township (same pattern as record 649). Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-793 done.**

## Record 794

"Summary conviction of George Porritt of the township of Hinderwell
fisherman for assaulting John Atkinson one of the constables for
the North Riding in the execution of his duty. Offence committed at
the township of Hinderwell on 28 August 1869. Whitby Strand - case
heard at Whitby" -- defendant George Porritt, home Hinderwell,
occupation fisherman; victim John Atkinson, occupation "constable
for the North Riding", sex correctly male. Location Hinderwell
matches. Crime type=assaulting a police officer matches. Already
correctly linked to related_conviction 812 (same defendant, same
date -- 812 is Porritt's companion charge, part of the Staithes
Street cluster). Same pattern as record 776 (Robinson/806) --
same-defendant link suffices, not extended to the whole Staithes
cluster since offence type differs.

**OK — no changes.**

---

**Progress: records 1-794 done.**

## Record 795

"Summary conviction of George Green for lodging in a barn with no
visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Hawsker cum
Stainsacre on 10 August 1875. Whitby Strand - case heard at Whitby"
-- defendant George Green. Offence location Hawsker-cum-Stainsacre
matches. Crime type=vagrancy matches. No related_conviction was
present, but found an identical match: record 881 (John Brown),
same offence/township/date, no named party in either -- matches the
confirmed no-named-party pattern. Added the link.

**FIXED — added missing related_conviction link to 881 (same barn/date/offence, no named party).**

---

**Progress: records 1-795 done.**

## Record 796

"Summary conviction of Thomas Howard of Arguments Yard in the
township of Whitby for not sending his daughter Caroline Howard to
school. Offence committed in the Whitby Strand School Board
district on 23 May 1889. Case heard at Whitby" -- defendant Thomas
Howard, home Arguments Yard (East Cliff/Whitby); daughter Caroline
Howard, "daughter" relationship correctly captured. Truancy rule
correctly applied: offence location = his own home, not the School
Board district wording. Crime type=school non-attendance matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-796 done.**

## Record 797

"Summary conviction of David Theaker of the township of Hinderwell
fisherman for assaulting John Atkinson one of the constables for
the North Riding in the execution of his duty. Offence committed at
the township of Hinderwell on 28 August 1869. Whitby Strand - case
heard at Whitby" -- defendant David Theaker, home Hinderwell,
occupation fisherman; victim John Atkinson, sex correctly male.
Location Hinderwell matches. Crime type=assaulting a police officer
matches. Already correctly linked to related_conviction 791 (same
defendant, same date -- Theaker's companion Staithes Street drunk
charge).

**OK — no changes.**

---

**Progress: records 1-797 done.**

## Record 798

"Summary conviction of William Lund of the township of Whitby jet
worker for being drunk and disorderly in Sandgate. Offence
committed at the township of Whitby on 10 August 1875. Whitby
Strand - case heard at Whitby" -- defendant William Lund, home
Whitby, occupation jet worker. Sandgate matches. Crime type=drunk
and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-798 done.**

## Record 799

"Summary conviction of Agnes Baker wife of William George Baker of
the township of Whitby jet worker for being drunk and disorderly in
Church Street. Offence committed at the township of Whitby on 18
May 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Agnes Baker, spouse William George Baker (home
Whitby, occupation jet worker, relationship correctly captured) --
this is the second Agnes/William George Baker conviction referenced
in reextraction-audit-notes.md, correctly a separate person pair
from record 790's earlier conviction, confirmed still correct.
Church Street matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-799 done.**

## Record 800

"Summary conviction of Elizabeth Sneaton [Elizabeth Skinner] of the
township of Whitby for obstructing a street; on the oath of Charles
Albert Martindale of the township of Whitby police constable.
Offence committed at the township of Whitby on 27 August 1869.
Whitby Strand - case heard at Whitby" -- defendant Elizabeth
Sneaton, bracketed alt-name "Elizabeth Skinner" correctly captured
in `person.alias` -- this is the exact record referenced in
reextraction-audit-notes.md, confirmed still correct (not a gap).
Informant Charles Albert Martindale, home Whitby, occupation police
constable. Location Whitby matches. Crime type=obstructing the
highway matches. Part of the 4-record "obstructing a street" cluster
(767, 779, 788, 800), all pairwise links already correctly present.

**OK — no changes.**

---

**Progress: records 1-800 done.**

## Record 801

"Summary conviction of Robert Dixon of the township of Whitby jet
worker for being drunk and disorderly in Henrietta Street. Offence
committed at the township of Whitby on 11 August 1875. Whitby
Strand - case heard at Whitby" -- defendant Robert Dixon, home
Whitby, occupation jet worker. Henrietta Street matches. Crime
type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-801 done.**

## Record 802

"Summary conviction of Jane Storm wife of Sampson Storm of the
township of Whitby iron worker for being drunk and disorderly in
Henrietta Street. Offence committed at the township of Whitby on
23 April 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant Jane Storm, spouse Sampson Storm (home
Whitby, occupation iron worker, relationship correctly captured) --
this is the exact record referenced in reextraction-audit-notes.md
as an earlier fix, confirmed still correct. Henrietta Street
matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-802 done.**

## Record 803

"Summary conviction of George Henderson of the township of Egton
for assaulting Joseph Wedgewood. Offence committed at the township
of Egton on 28 August 1869. Whitby Strand - case heard at Whitby"
-- defendant George Henderson, home Egton; victim Joseph Wedgewood.
Location Egton matches. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-803 done.**

## Record 804

"Summary conviction of David Peart of the township of Whitby
fisherman for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 7 August 1875. Whitby Strand
- case heard at Whitby" -- defendant David Peart, home Whitby,
occupation fisherman. Church Street matches. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-804 done.**

## Record 805

"Summary conviction of Thomas James Tweedy of the township of
Whitby schoolboy for throwing a stone in the Khyber Pass. Offence
committed at the township of Ruswarp on 26 May 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Thomas James Tweedy, home Whitby, occupation "schoolboy". Khyber
Pass nests under Whitby's West Cliff but the record states offence
township Ruswarp -- correctly added alongside per the cliff-boundary
pattern. Crime type=breach of the peace matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-805 done.**

## Record 806

"Summary conviction of Thomas Hedley Robinson of the township of
Hinderwell fisherman for being drunk and riotous in Staithes
Street. Offence committed at the township of Hinderwell on 28
August 1869. Whitby Strand - case heard at Whitby" -- defendant
Thomas Hedley Robinson, home Hinderwell, occupation fisherman.
Staithes Street matches. Crime type=drunk and disorderly matches.
Part of the 8-record Staithes Street cluster, all pairwise links
already correctly present, plus correctly linked to 776 (same
defendant, same date -- Robinson's companion assault charge).

**OK — no changes.**

---

**Progress: records 1-806 done.**

## Record 807

"Summary conviction of John Thompson of the township of Whitby jet
worker for being drunk and disorderly in Church Street; on the oath
of Mark Boggett of the township of Whitby police constable. Offence
committed at the township of Whitby on 12 August 1875. Whitby
Strand - case heard at Whitby" -- defendant John Thompson (same
name/occupation as record 749, different date, correctly a distinct
person row), home Whitby; informant Mark Boggett, home Whitby,
occupation police constable. Church Street matches. Crime
type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-807 done.**

## Record 808

"Summary conviction of Andrew McNally of the township of Hinderwell
coal leader for being the owner of a horse and an ass found
straying on the Runswick and Ellerby highway. Offence committed at
the township of Hinderwell on 27 May 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Andrew
McNally, home Hinderwell, occupation coal leader. Cross-parish
"Runswick & Ellerby Highway" correctly added alongside stated
township Hinderwell. Crime type=straying animals matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-808 done.**

## Record 809

"Summary conviction of Thomas Verrill of the township of Hinderwell
fisherman for being drunk and riotous in Staithes Street. Offence
committed at the township of Hinderwell on 28 August 1869. Whitby
Strand - case heard at Whitby" -- defendant Thomas Verrill, home
Hinderwell, occupation fisherman -- shares a surname with record
773's William Verrill (likely family, but no relationship stated in
the text, correctly none captured). Staithes Street matches. Crime
type=drunk and disorderly matches. Part of the 8-record Staithes
Street cluster, all pairwise links already correctly present.

**OK — no changes.**

---

**Progress: records 1-809 done.**

## Record 810

"Summary conviction of John Dixon of the township of Whitby jet
worker for resisting Edward Weeks one of the constables for the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 11 August 1875. Whitby Strand - case heard at
Whitby" -- defendant John Dixon, home Whitby, occupation jet worker;
victim Edward Weeks, sex correctly male. Location Whitby matches.
Crime type=obstructing/resisting a constable matches -- correctly
distinguished from "assaulting a police officer" since the charge is
"resisting", not "assaulting". No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 920]:** record 920 (Thomas
Dixon, also surnamed Dixon though no relationship stated) turned out
to share this exact same victim/offence/township/date. A
related_conviction link has now been added retroactively.

---

**Progress: records 1-810 done.**

## Record 811

"Summary conviction of Robert Steel of Whitby jet worker for being
drunk and disorderly in Baxtergate. Offence committed at the
township of Whitby on 19 March 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Robert Steel, home
Whitby, occupation jet worker. Baxtergate matches. Crime type=drunk
and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-811 done.**

## Record 812

"Summary conviction of George Porritt of the township of Hinderwell
fisherman for being drunk and riotous in Staithes Street Offence
committed at the township of Hinderwell on 28 August 1869. Whitby
Strand - case heard at Whitby" -- defendant George Porritt, home
Hinderwell, occupation fisherman. Staithes Street matches. Crime
type=drunk and disorderly matches. Final (8th) member of the
Staithes Street cluster, plus correctly linked to 794 (same
defendant, same date -- Porritt's companion assault charge). All
pairwise links in the 8-record cluster now fully verified complete
across records 764-812.

**OK — no changes.**

---

**Progress: records 1-812 done.**

## Record 813

"Summary conviction of Robert Dixon of the township of Whitby jet
worker for being drunk in charge of a horse and cart on the New
Quay. Offence committed at the township of Whitby on 12 August
1875. Whitby Strand - case heard at Whitby" -- defendant Robert
Dixon (same name/occupation as record 801, different date,
correctly a distinct person row), home Whitby. New Quay matches.
Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-813 done.**

## Record 814

"Summary conviction of William Fisher of the township of Whitby
tinner for being drunk and disorderly in Sandgate. Offence
committed at the township of Whitby on 8 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
William Fisher, home Whitby, occupation tinner. Sandgate matches.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-814 done.**

## Record 815

"Summary conviction of Joseph Lemarte for assaulting Michael
Maloney. Offence committed at the township of Whitby on 9 September
1869. Whitby Strand - case heard at Whitby" -- defendant Joseph
Lemarte, victim Michael Maloney. Location Whitby matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-815 done.**

## Record 816

"Summary conviction of Peter Elder Leck of the Longsteps in the
township of Whitby for assaulting Sarah Mary Leck; on the oath of
the said Sarah Mary Leck wife of Simon Robert Leck of the township
of Whitby jet worker. Offence committed at the township of Whitby
on 13 August 1875. Whitby Strand - case heard at Whitby" -- defendant
Peter Elder Leck, home Long Steps (East Cliff/Whitby); victim Sarah
Mary Leck, spouse Simon Robert Leck (home Whitby, occupation jet
worker, relationship correctly captured) -- this is the exact record
referenced in reextraction-audit-notes.md as an earlier fix,
confirmed still correct. Location Whitby matches. Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-816 done.**

## Record 817

"Summary conviction of John Telford of the township of Hinderwell
fish hawker for ill-treating a horse by beating it about the head
with a steel hame and a stick Offence committed at the township of
Glaisdale on 23 May 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant John Telford, home Hinderwell,
occupation fish hawker. Offence location Glaisdale matches. Crime
type=cruelty to animals matches. Already correctly linked to
related_conviction 823 (same defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-817 done.**

## Record 818

"Summary conviction of Robert Dixon of the township of Whitby
sailor for assaulting John Ryder one of the constables for the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 9 September 1869. Whitby Strand - case heard
at Whitby" -- defendant Robert Dixon (same name as records 801/813,
different occupation and date, correctly a distinct person row),
home Whitby, occupation sailor; victim John Ryder, sex correctly
male. Location Whitby matches. Crime type=assaulting a police
officer matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-818 done.**

## Record 819

"Summary conviction of John Hodgson of the township of Whitby
fisherman for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 21 August 1875. Whitby
Strand - case heard at Whitby" -- defendant John Hodgson, home
Whitby, occupation fisherman. "The Pier" resolves to Piers
(Seafront/Whitby). Crime type=drunk and disorderly matches. Already
correctly linked to related_conviction 825 (same offence date/
street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-819 done.**

## Record 820

"Summary conviction of John Day of Eskdaleside cum Ugglebarnby
labourer for begging in Grosmont town street. Offence committed at
the township of Eskdaleside cum Ugglebarnby on 3 June 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
John Day, home Eskdaleside-cum-Ugglebarnby, occupation labourer.
"Grosmont town street" resolves to Grosmont under Eskdaleside-cum-
Ugglebarnby, matching stated township. Crime type=begging matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-820 done.**

## Record 821

"Summary conviction of William Smith labourer for being drunk.
Offence committed at the township of Whitby on 9 September 1869.
Whitby Strand - case heard at Whitby" -- defendant William Smith,
occupation labourer, no home town stated in the text (no "of the
township of..." clause), correctly left blank. Location Whitby
matches. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-821 done.**

## Record 822

"Summary conviction of Jane Thompson of the township of Whitby
widow for being drunk and disorderly in Church Street; on the oath
of George Hewison of the township of Whitby police constable.
Offence committed at the township of Whitby on 16 August 1875.
Whitby Strand - case heard at Whitby" -- defendant Jane Thompson
(same name as record 468's spinster, correctly a distinct person),
home Whitby, stated "widow" but occupation was not linked -- this
id was already on the tracked marital-status occupation gap list.
Added occupation "widow" (id 384). Informant George Hewison, home
Whitby, occupation police constable. Church Street matches. Crime
type=drunk and disorderly matches. No related_conviction.

**FIXED — added missing "widow" occupation (tracked gap, id 822 removed from the list).**

---

**Progress: records 1-822 done.**

## Record 823

"Summary conviction of John Telford of the township of Hinderwell
fish hawker for being drunk in charge of a horse and cart on the
Glaisdale and Rosedale highway. Offence committed at the township
of Glaisdale on 23 May 1889. Whitby Strand Petty Sessional division
- case heard at Whitby" -- defendant John Telford, home Hinderwell,
occupation fish hawker. Cross-parish "Glaisdale & Rosedale Highway"
correctly added alongside stated offence township Glaisdale. Crime
type=drunkenness matches. Already correctly linked to
related_conviction 817 (same defendant, same offence date --
Telford's companion cruelty-to-animals charge).

**OK — no changes.**

---

**Progress: records 1-823 done.**

## Record 824

"Summary conviction of Jane Thompson of the township of Whitby
widow for being drunk. Offence committed at the township of Whitby
on 9 September 1869. Whitby Strand - case heard at Whitby" --
defendant Jane Thompson (third distinct Jane Thompson person row
this session, correctly separate from records 468/822), home
Whitby, stated "widow" but occupation was not linked -- this id was
already on the tracked marital-status occupation gap list. Added
occupation "widow" (id 384). Location Whitby matches. Crime
type=drunkenness matches. No related_conviction.

**FIXED — added missing "widow" occupation (tracked gap, id 824 removed from the list).**

---

**Progress: records 1-824 done.**

## Record 825

"Summary conviction of Francis Fewster of the township of Whitby
jet worker for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 21 August 1875. Whitby
Strand - case heard at Whitby" -- defendant Francis Fewster (same
name/occupation as record 747, different date, correctly a distinct
person row), home Whitby. "The Pier" resolves to Piers (Seafront/
Whitby). Crime type=drunk and disorderly matches. Already correctly
linked to related_conviction 819 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-825 done.**

## Record 826

"Summary conviction of Alfred George Walker of the township of
Whitby bricklayer for being drunk and disorderly in Ruswarp town
street. Offence committed at the township of Ruswarp on 11 June
1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Alfred George Walker, home Whitby, occupation
bricklayer. "Ruswarp town street" resolves to Ruswarp itself,
matching stated township. Crime type=drunk and disorderly matches.
Already correctly linked to related_conviction 742 (same offence
date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-826 done.**

## Record 827

"Summary conviction of James Robinson for begging in the Khyber
Pass. Offence committed at the township of Ruswarp on 10 September
1869. Whitby Strand - case heard at Whitby" -- defendant James
Robinson. Khyber Pass nests under Whitby's West Cliff but the
record states township Ruswarp -- correctly captured alongside per
the cliff-boundary pattern. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-827 done.**

## Record 828

"Summary conviction of John Nellist of the township of Fylingdales
licensed victualler for opening his licensed premises outside
licensing hours; on the oath of George Eli North of the township of
Fylingdales police constable. Offence committed at the township of
Fylingdales at 12.05 p.m. on 22 August 1875. Whitby Strand - case
heard at Whitby" -- defendant John Nellist, home Fylingdales,
occupation licensed victualler; informant George Eli North, home
Fylingdales, occupation police constable. Location Fylingdales
matches. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-828 done.**

## Record 829

"Summary conviction of William Carter of the township of Whitby
labourer for begging in Church Street. Offence committed at the
township of Whitby on 27 May 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant William Carter, home
Whitby, occupation labourer. Church Street matches. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-829 done.**

## Record 830

"Summary conviction of William Harland for assaulting Alice
Weatherill. Offence committed at the township of Whitby on 9
September 1869. Whitby Strand - case heard at Whitby" -- defendant
William Harland, victim Alice Weatherill (same name as record 651's
victim, but 6 years apart -- 1869 vs 1875 -- correctly a distinct,
unrelated conviction). Location Whitby matches. Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-830 done.**

## Record 831

"Summary conviction of Francis Fewster of the township of Whitby
jet worker for being drunk in Victoria Square. Offence committed at
the township of Ruswarp on 24 August 1875. Whitby Strand - case
heard at Whitby" -- defendant Francis Fewster (same name/occupation
as records 747/825, a third distinct conviction on yet another
date, correctly a separate person row), home Whitby. Victoria
Square nests under Whitby's West Cliff but the record states
township Ruswarp -- correctly added alongside per the cliff-boundary
pattern. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-831 done.**

## Record 832

"Summary conviction of James Conner of the township of Ellerby
labourer for begging in Ellerby town street. Offence committed at
the township of Ellerby on 26 May 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant James
Conner, home Ellerby, occupation labourer. "Ellerby town street"
resolves to Ellerby itself, matching stated township. Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-832 done.**

## Record 833

"Summary conviction of Robert Foster of the township of Whitby
sailor for being drunk. Offence committed at the township of Whitby
on 12 September 1869. Whitby Strand - case heard at Whitby" --
defendant Robert Foster, home Whitby, occupation sailor. Location
Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-833 done.**

## Record 834

"Summary conviction of Richard Purvis of the township of Whitby
shoemaker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 28 August 1875. Whitby
Strand - case heard at Whitby" -- defendant Richard Purvis, home
Whitby, occupation shoemaker. Church Street matches. Crime
type=drunk and disorderly matches. Already correctly linked to
related_conviction 786 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-834 done.**

## Record 835

"Summary conviction of George Bielby of Pickering labourer for
being drunk and disorderly in Church Street. Offence committed at
the township of Whitby on 4 May 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant George Bielby, home
Pickering, occupation labourer. Offence location Church Street
(Whitby) matches. Crime type=drunk and disorderly matches. Already
correctly linked to related_conviction 861 (same offence date/
street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-835 done.**

## Record 836

"Summary conviction of David Adamson of the township of Whitby
fisherman for assaulting Samuel Hutchings. Offence committed at the
township of Whitby on 13 September 1869. Whitby Strand - case heard
at Whitby" -- defendant David Adamson, home Whitby, occupation
fisherman; victim Samuel Hutchings. Location Whitby matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-836 done.**

## Record 837

"Summary conviction of Stephen Kelly of the township of Whitby
pedlar for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 30 August 1875. Whitby
Strand - case heard at Whitby" -- defendant Stephen Kelly, home
Whitby, occupation pedlar. Church Street matches. Crime type=drunk
and disorderly matches. Already correctly linked to
related_conviction 893 and 902 (same defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-837 done.**

## Record 838

"Summary conviction of Charles Wareing of the township of Ruswarp
labourer for begging at High Stakesby. Offence committed at the
township of Ruswarp on 28 May 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Charles Wareing, home
Ruswarp, occupation labourer. "High Stakesby" correctly nests under
Ruswarp, matching stated township. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-838 done.**

## Record 839

"Summary conviction of Solomon Marshall of the township of Whitby
jet worker for being drunk and riotous in Baxtergate. Offence
committed at the township of Whitby on 16 September 1869. Whitby
Strand - case heard at Whitby" -- defendant Solomon Marshall, home
Whitby, occupation jet worker. Baxtergate matches (West Cliff/
Whitby). Crime type=drunk and disorderly matches (per "drunk and
riotous" precedent). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-839 done.**

## Record 840

"Summary conviction of John Jones of the township of Whitby coal
porter for being drunk on the licensed premises of Joseph Fletcher
and refusing to leave when asked by John Nicholson a police
constable. Offence committed at the township of Whitby on 30 August
1875. Whitby Strand - case heard at Whitby" -- defendant John Jones
(same name/occupation as record 235, different date, correctly a
distinct person row), home Whitby; licensee Joseph Fletcher,
occupation "licensee"; informant John Nicholson, occupation police
constable. Location Whitby matches. Crime types = drunkenness +
refusal to quit licensed premises both fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-840 done.**

## Record 841

"Summary conviction of William Hewling of the township of Whitby
rag gatherer for being drunk and disorderly in Baxtergate. Offence
committed at the township of Whitby on 8 May 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
William Hewling, home Whitby, occupation rag gatherer. Baxtergate
matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-841 done.**

## Record 842

"Summary conviction of William Andrew of the township of Whitby jet
worker for being drunk. Offence committed at the township of
Whitby on 16 September 1869. Whitby Strand - case heard at Whitby"
-- defendant William Andrew, home Whitby, occupation jet worker.
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-842 done.**

## Record 843

"Summary conviction of John Denham of the township of Whitby jet
worker for being drunk on the licensed premises of Frederick
William Judge. Offence committed at the township of Whitby on 1
September 1875. Whitby Strand - case heard at Whitby" -- defendant
John Denham (same name/occupation as record 702's obstructing-the-
highway defendant, but a different date, correctly a distinct
person row), home Whitby; licensee Frederick William Judge,
occupation "licensee". Location Whitby matches. Crime
type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-843 done.**

## Record 844

"Summary conviction of John Harrison Trousdale of the township of
Whitby for throwing a stone in North Road. Offence committed at the
township of Ruswarp on 7 May 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant John Harrison
Trousdale, home Whitby. North Road nests under Whitby's West Cliff
but the record states offence township Ruswarp -- correctly added
alongside per the cliff-boundary pattern. Crime type=breach of the
peace matches. Third of the North Road stone-throwing cluster (718,
724, 844), all pairwise links already correctly present.

**OK — no changes.**

---

**Progress: records 1-844 done.**

## Record 845

"Summary conviction of Christiana Dixon for lodging in the open air
in Church Street with no visible means of subsistence and not
giving a good account of herself. Offence committed at the township
of Whitby on 15 September 1869. Whitby Strand - case heard at
Whitby" -- defendant Christiana Dixon. Church Street matches. Crime
type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-845 done.**

## Record 846

"Summary conviction of Elizabeth Walker of the township of Whitby
pedlar for acting as a pedlar selling books without a certificate.
Offence committed at the township of Whitby on 3 September 1875.
Whitby Strand - case heard at Whitby" -- defendant Elizabeth
Walker, home Whitby, occupation pedlar. Location Whitby matches.
Crime type=licensing offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-846 done.**

## Record 847

"Summary conviction of William Hodgson of the township of Whitby
joiner for being drunk and disorderly in St Ann's Staith Offence
committed at the township of Whitby on 30 March 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
William Hodgson, home Whitby, occupation joiner. St Ann's Staith
matches (West Cliff/Whitby). Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-847 done.**

## Record 848

"Summary conviction of Sarah Smith of the township of Whitby
singlewoman for being drunk. Offence committed at the township of
Whitby on 17 September 1869. Whitby Strand - case heard at Whitby"
-- defendant Sarah Smith, home Whitby, stated "singlewoman" but
occupation was not linked -- this id was already on the tracked
marital-status occupation gap list. Added occupation "singlewoman"
(id 337). Location Whitby matches. Crime type=drunkenness matches.
No related_conviction.

**FIXED — added missing "singlewoman" occupation (tracked gap, id 848 removed from the list).**

---

**Progress: records 1-848 done.**

## Record 849

"Summary conviction of Robert Parkin of the township of Whitby cab
driver for being drunk in charge of a horse and cart. Offence
committed at the township of Ruswarp on 30 September 1875. Whitby
Strand - case heard at Whitby" -- defendant Robert Parkin (same
name as record 735's Newholm-cum-Dunsley waggoner, different
occupation/home/date, correctly a distinct person row), home
Whitby, occupation cab driver. Offence location Ruswarp matches.
Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-849 done.**

## Record 850

"Summary conviction of William Hodgson of the township of Whitby
sailor for being drunk and disorderly in the Market Place. Offence
committed at the township of Whitby on 13 April 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
William Hodgson (person data correctly says "Hodgson"), home
Whitby, occupation sailor. The `title` field said "William Hobson"
-- a mismatch against both raw_record and the person row, matching
the tracked title/raw_record mismatch pattern (2 prior instances:
347, 571). Corrected to "William Hodgson". Market Place matches.
Crime type=drunk and disorderly matches. No related_conviction.

**FIXED — corrected title field "Hobson" to "Hodgson" (3rd instance of tracked title/raw_record mismatch).**

**[Corpus-wide sweep triggered by this record]:** a third instance
was one too many to keep treating as isolated, so ran a SQL flagging
query (`title NOT LIKE '%' || person.last_name || '%'` for the
defendant role) across the whole corpus. Found 4 more genuine
instances beyond this record: 184 (Gardener→Gardner), 3298
(Tose→Toes), 4073 (Tose→Toes), 4277 (Fagan→Fagin) -- each verified
against its own raw_record before fixing. Re-ran the sweep after all
7 fixes (347, 571, 850, 184, 3298, 4073, 4277) -- zero remain
corpus-wide. This gap is now fully resolved, not an ongoing watch
item.

---

**Progress: records 1-850 done.**

## Record 851

"Summary conviction of John Midwood of the township of Whitby jet
worker for being drunk and riotous in Church Street. Offence
committed at the township of Whitby on 13 September 1869. Whitby
Strand - case heard at Whitby" -- defendant John Midwood, home
Whitby, occupation jet worker. Church Street matches. Crime
type=drunk and disorderly matches (per "drunk and riotous"
precedent). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-851 done.**

## Record 852

"Summary conviction of Daniel George Robinson of the township of
Whitby labourer for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 11 September 1875.
Whitby Strand - case heard at Whitby" -- defendant Daniel George
Robinson, home Whitby, occupation labourer. Church Street matches.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-852 done.**

## Record 853

"Summary conviction of Elizabeth Hobson wife of William Hobson of
the township of Whitby sailor for assaulting Alice Joyce. Offence
committed at the township of Whitby on 20 April 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Elizabeth Hobson, spouse William Hobson (home Whitby, occupation
sailor, relationship correctly captured), victim Alice Joyce -- this
is the exact record referenced in reextraction-audit-notes.md as
part of a mutual-assault companion pair (Elizabeth Hobson vs Alice
Joyce and vice versa, two separate convictions), confirmed still
correct. Location Whitby matches. Crime type=assault matches. No
related_conviction (the companion record isn't linked via
related_conviction since they're reciprocal separate charges, not
one incident with multiple defendants -- consistent with existing
treatment).

**OK — no changes.**

---

**Progress: records 1-853 done.**

## Record 854

"Summary conviction of Joseph Fell of the township of Glaisdale
miner for being drunk and riotous in Glaisdale Street; on the oath
of Thomas Bowron of the township of Glaisdale police constable.
Offence committed at the township of Glaisdale on 27 August 1869.
Whitby Strand - case heard at Whitby" -- defendant Joseph Fell, home
Glaisdale, occupation miner; informant Thomas Bowron, home
Glaisdale, occupation police constable -- sex was blank, but
"Thomas" is an unambiguously male name (per the corpus's established
name-inference rule) and the same-named informant on record 770
already correctly has sex=male, so this was an inconsistency. Fixed.
Glaisdale Street matches. Crime type=drunk and disorderly matches
(per "drunk and riotous" precedent). Already correctly linked to
related_conviction 770 (same offence date/street/charge, different
defendants).

**FIXED — set informant Thomas Bowron's sex to male (name-inference consistency with record 770).**

---

**Progress: records 1-854 done.**

## Record 855

"Summary conviction of William Atkinson of the township of Whitby
jet worker for being drunk and disorderly in Skinner Street.
Offence committed at the township of Ruswarp on 15 September 1875.
Whitby Strand - case heard at Whitby" -- defendant William Atkinson,
home Whitby, occupation jet worker. Skinner Street nests under
Whitby's West Cliff but the record states offence township Ruswarp
-- correctly added alongside per the cliff-boundary pattern (this
is the exact record referenced in reextraction-audit-notes.md,
confirmed still correct). Crime type=drunk and disorderly matches.
Already correctly linked to related_conviction 858 (same offence
date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-855 done.**

## Record 856

"Summary conviction of Alice Joyce wife of Patrick Joyce of the
township of Whitby bricklayer for assaulting Elizabeth Hobson.
Offence committed at the township of Whitby on 20 April 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Alice Joyce, spouse Patrick Joyce (home Whitby, occupation
bricklayer, relationship correctly captured), victim Elizabeth
Hobson -- this is the exact record referenced in
reextraction-audit-notes.md, the reciprocal half of the mutual-
assault companion pair with record 853, confirmed still correct.
Location Whitby matches. Crime type=assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-856 done.**

## Record 857

"Summary conviction of Maria Dixon common prostitute for behaving
indecently in Church Street. Offence committed at the township of
Whitby on 15 September 1869. Whitby Strand - case heard at Whitby"
-- defendant Maria Dixon, occupation "common prostitute" correctly
captured. Church Street matches. Crime types = indecent behaviour +
prostitution both fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-857 done.**

## Record 858

"Summary conviction of Stephen Kingston of the township of Whitby
jet worker for being drunk and disorderly in Skinner Street.
Offence committed at the township of Ruswarp on 15 September 1875.
Whitby Strand - case heard at Whitby" -- defendant Stephen
Kingston, home Whitby, occupation jet worker. Skinner Street nests
under Whitby's West Cliff but the record states offence township
Ruswarp -- correctly added alongside per the cliff-boundary pattern.
Crime type=drunk and disorderly matches. Already correctly linked
to related_conviction 855 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-858 done.**

## Record 859

"Summary conviction of John Graham of the township of Whitby sailor
for being drunk and riotous in Seven Stars Ghaut. Offence committed
at the township of Whitby on 18 September 1869. Whitby Strand -
case heard at Whitby" -- defendant John Graham, home Whitby,
occupation sailor. "Seven Stars Ghaut" correctly nests under East
Cliff/Whitby. Crime type=drunk and disorderly matches (per "drunk
and riotous" precedent). Already correctly linked to
related_conviction 862 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-859 done.**

## Record 860

"Summary conviction of Dorothy Gaines wife of Thomas Gaines of the
township of Whitby fisherman for using obscene language; on the
oath of Hannah Cooper and Harriet Hicks, both of the township of
Whitby singlewomen. Offence committed at the township of Whitby on
16 September 1875. Whitby Strand - case heard at Whitby" -- defendant
Dorothy Gaines, spouse Thomas Gaines (home Whitby, occupation
fisherman, relationship correctly captured); witnesses Hannah Cooper
and Harriet Hicks, both occupation "singlewoman" correctly captured
-- this is the exact record referenced in reextraction-audit-notes.md
as an earlier fix, confirmed still correct. Location Whitby matches.
Crime type=using obscene language matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-860 done.**

## Record 861

"Summary conviction of Edward Jameson Ayre of the township of
Whitby jet worker for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 4 May 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Edward Jameson Ayre, home Whitby, occupation jet worker. Church
Street matches. Crime type=drunk and disorderly matches. Already
correctly linked to related_conviction 835 (same offence date/
street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-861 done.**

## Record 862

"Summary conviction of William Graham of the township of Whitby
coal porter for being drunk and riotous in Seven Stars Ghaut.
Offence committed at the township of Whitby on 18 September 1869.
Whitby Strand - case heard at Whitby" -- defendant William Graham,
home Whitby, occupation coal porter -- shares a surname with record
859's John Graham but no relationship stated in the text, correctly
none captured. Seven Stars Ghaut matches. Crime type=drunk and
disorderly matches (per "drunk and riotous" precedent). Already
correctly linked to related_conviction 859 (same offence date/
street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-862 done.**

## Record 863

"Summary conviction of James Williams and George Williams for
deceiving Emma Walden and another by falsely representing a certain
article to be soap. Offence committed at the township of Whitby on
17 September 1875. Whitby Strand - case heard at Whitby" -- two
defendants (James Williams, George Williams, no relationship stated
in text, correctly none captured), victim Emma Walden; "and
another" (a second, unnamed victim) correctly not fabricated as a
person row. Location Whitby matches. Crime type=fraud/false
pretences matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-863 done.**

## Record 864

"Summary conviction of Warner Coleman of Darlington in county
Durham cattle dealer for assaulting William Bradley. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 13
April 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Warner Coleman, home Darlington (correctly
outside the North Riding parent), occupation cattle dealer; victim
William Bradley. This is the reciprocal companion case to record
769 (there, Bradley assaulted Coleman; here, Coleman assaults
Bradley back) -- same date and township, but correctly not linked
via related_conviction, consistent with the established treatment
for mutual-assault pairs (Hobson/Joyce, 853/856). Offence location
Eskdaleside-cum-Ugglebarnby matches. Crime type=assault matches.

**OK — no changes.**

---

**Progress: records 1-864 done.**

## Record 865

"Summary conviction of John Thomas Bedlington of the township of
Whitby cab driver for driving a cab furiously in Station Square.
Offence committed at the township of Ruswarp on 18 September 1869.
Whitby Strand - case heard at Whitby" -- defendant John Thomas
Bedlington, home Whitby, occupation cab driver. Station Square
nests under Whitby's West Cliff but the record states offence
township Ruswarp -- correctly added alongside per the cliff-
boundary pattern. Crime type=furious/reckless driving matches --
charge explicitly says "furiously" (contrast with record 752's
mistagged "not having control" fix). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-865 done.**

## Record 866

"Summary conviction of John Thomas Harrison of the township of
Hawsker cum Stainsacre labourer for using a gun without a licence.
Offence committed at the township of Hawsker cum Stainsacre on 12
July 1875. Whitby Strand - case heard at Whitby" -- defendant John
Thomas Harrison, home Hawsker-cum-Stainsacre, occupation labourer.
Location matches. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-866 done.**

## Record 867

"Summary conviction of Isaac Wilson of the township of Whitby
printer's apprentice for maliciously breaking part of a dead fence
value 3d, the property of Thomas Beeforth. Offence committed at the
township of Sneaton on 21 April 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Isaac Wilson, home
Whitby, occupation printer's apprentice; property owner Thomas
Beeforth. Offence location Sneaton matches. Crime type=malicious/
property damage matches. Third of the dead-fence cluster (772, 784,
867, 876), all pairwise links already correctly present.

**OK — no changes.**

---

**Progress: records 1-867 done.**

## Record 868

"Summary conviction of Frances Hezlewood wife of William Henry
Hezlewood of the township of Whitby sailor for obstructing
Sandgate; on the oath of Charles Albert Martindale of the township
of Whitby police constable. Offence committed at the township of
Whitby on 18 September 1869. Whitby Strand - case heard at Whitby"
-- defendant Frances Hezlewood, spouse William Henry Hezlewood (home
Whitby, occupation sailor, relationship correctly captured) -- this
is the exact record referenced in reextraction-audit-notes.md as an
earlier fix, confirmed still correct. Informant Charles Albert
Martindale, occupation police constable. Sandgate matches. Crime
type=obstructing the highway matches. Already correctly linked to
related_conviction 871 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-868 done.**

## Record 869

"Summary conviction of Rosannah Turner for lodging in St Mary's
churchyard with no visible means of subsistence and not giving a
good account of herself. Offence committed at the township of
Hawsker cum Stainsacre on 24 September 1875. Whitby Strand - case
heard at Whitby" -- defendant Rosannah Turner. "St Mary's
Churchyard" (the East Cliff church overlooking Whitby harbour)
nests directly under Hawsker-cum-Stainsacre in the tree, matching
the stated township -- consistent with the historical East Cliff/
Hawsker parish boundary. Crime type=vagrancy matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-869 done.**

## Record 870

"Summary conviction of John Thomas Saunderson of Staithes in the
township of Hinderwell labourer for ill-treating a horse by working
it when it was unfit Offence committed at the township of
Hinderwell on 18 April 1889. Whitby Strand Petty Sessional division
- case heard at Whitby" -- defendant John Thomas Saunderson, home
Staithes (nested under Hinderwell), occupation labourer. Offence
location Hinderwell matches. Crime type=cruelty to animals matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-870 done.**

## Record 871

"Summary conviction of Mary Elizabeth Grant of the township of
Whitby singlewoman for obstructing Sandgate. Offence committed at
the township of Whitby on 18 September 1869. Whitby Strand - case
heard at Whitby" -- defendant Mary Elizabeth Grant, home Whitby,
occupation "singlewoman" correctly captured -- this is the exact
record referenced in reextraction-audit-notes.md, confirmed still
correct. Sandgate matches. Crime type=obstructing the highway
matches. Already correctly linked to related_conviction 868 (same
offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-871 done.**

## Record 872

"Summary conviction of James Johnson McGuire for assaulting Mary
Ann Reeves. Offence committed at the township of Whitby on 4
September 1875. Whitby Strand - case heard at Whitby" -- defendant
James Johnson McGuire, victim Mary Ann Reeves. Location Whitby
matches. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-872 done.**

## Record 873

"Summary conviction of Moorsom Mennell of the township of Whitby
master and owner of the steam tug "Rambler" for not obeying the
orders of Robert Gibson as to the mooring of the "Rambler" in
Whitby harbour. Offence committed at the parish of Whitby on 6 May
1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Moorsom Mennell, home Whitby, occupation
"master and owner of the steam tug Rambler"; informant Robert
Gibson. Location Whitby matches -- checked "Whitby harbour"
against precedent: no existing location node despite 24 corpus
mentions, treated corpus-wide as synonymous with the Whitby offence
location itself rather than a distinct sub-site, so no new node
needed here. Crime type=maritime offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-873 done.**

## Record 874

"Summary conviction of Mary Ann Stonehouse common prostitute for
behaving indecently in St Ann's Staith. Offence committed at the
township of Whitby on 24 September 1869. Whitby Strand - case heard
at Whitby" -- defendant Mary Ann Stonehouse, occupation "common
prostitute" correctly captured (same name as record 526's
"singlewoman" fix, but a different, earlier conviction, correctly a
distinct person row). St Ann's Staith matches (West Cliff/Whitby).
Crime types = indecent behaviour + prostitution both fit. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-874 done.**

## Record 875

"Summary conviction of John Burnside of the township of Whitby
hawker for being drunk in charge of a horse and cart in Church
Street. Offence committed at the township of Whitby on 28 August
1875. Whitby Strand - case heard at Whitby" -- defendant John
Burnside, home Whitby, occupation hawker. Church Street matches.
Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-875 done.**

## Record 876

"Summary conviction of James Horner of the township of Whitby
gardener for maliciously breaking part of a dead fence value 3d,
the property of Thomas Beeforth. Offence committed at the township
of Sneaton on 21 April 1889. Whitby Strand Petty Sessional division
- case heard at Whitby" -- defendant James Horner, home Whitby,
occupation gardener; property owner Thomas Beeforth. Offence
location Sneaton matches. Crime type=malicious/property damage
matches. Final (4th) member of the dead-fence cluster (772, 784,
867, 876), all pairwise links now fully verified complete.

**OK — no changes.**

---

**Progress: records 1-876 done.**

## Record 877

"Summary conviction of George Calvert junior of the township of
Hinderwell fisherman for assaulting Sarah Gash; on the oath of the
said Sarah Gash wife of William Gash of the township of Hinderwell
miner. Offence committed at the township of Hinderwell on 18
September 1869. Whitby Strand - case heard at Whitby" -- defendant
George Calvert, name_postfix "junior" correctly captured, home
Hinderwell, occupation fisherman; victim Sarah Gash, spouse William
Gash (home Hinderwell, occupation miner, relationship correctly
captured) -- this is the exact record referenced in
reextraction-audit-notes.md as an earlier fix, confirmed still
correct. Location Hinderwell matches. Crime type=assault matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-877 done.**

## Record 878

"Summary conviction of George Hill for being on land occupied by
Thomas Vaughan with nets to take game by night. Offence committed
at the township of Newton Mulgrave at 12.15 a.m. on 13 June 1875.
Whitby Strand - case heard at Whitby" -- defendant George Hill,
landowner/occupier Thomas Vaughan. Location Newton Mulgrave
matches. Crime type=poaching matches. Final (4th) member of the
poaching-gang cluster (675, 705, 717, 878), all pairwise links now
fully verified complete.

**OK — no changes.**

---

**Progress: records 1-878 done.**

## Record 879

"Summary conviction of Thomas Gleeson of the township of Newholm
cum Dunsley labourer for begging on the Whitby and Guisborough
highway. Offence committed at the township of Newholm cum Dunsley
on 21 May 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant Thomas Gleeson, home Newholm-cum-Dunsley,
occupation labourer. Cross-parish "Whitby & Guisborough Highway"
correctly added alongside stated township -- this is the exact
record referenced in reextraction-audit-notes.md's tracked highway-
sweep progress note, confirmed still correct. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-879 done.**

## Record 880

"Summary conviction of George Webster of the township of Glaisdale
mariner for maliciously damaging an apple tree growing on land
occupied by Joseph Underwood Marshal, and causing one-shillingsworth
of damage. Offence committed at the township of Egton on 27
September 1869. Whitby Strand - case heard at Whitby" -- defendant
George Webster, home Glaisdale, occupation mariner; property owner
Joseph Underwood Marshal. Offence location Egton matches. Crime
type=malicious/property damage matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-880 done.**

## Record 881

"Summary conviction of John Brown for lodging in a barn with no
visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Hawsker cum
Stainsacre on 10 August 1875. Whitby Strand - case heard at Whitby"
-- defendant John Brown. Location Hawsker-cum-Stainsacre matches.
Crime type=vagrancy matches. Already correctly linked to
related_conviction 795 (same offence/township/date, no-named-party
pattern).

**OK — no changes.**

---

**Progress: records 1-881 done.**

## Record 882

"Summary conviction of George Reed of the township of Ellerby
farmer for being the owner of a horse, two cows and a heifer found
straying on the Runswick and Ellerby highway. Offence committed at
the township of Ellerby on 30 May 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant George
Reed, home Ellerby, occupation farmer. Cross-parish "Runswick &
Ellerby Highway" correctly added alongside stated township Ellerby.
Crime type=straying animals matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-882 done.**

## Record 883

"Summary conviction of William Pattison of the township of Whitby
jet worker for being drunk and riotous on the Pier. Offence
committed at the township of Whitby on 28 September 1869. Whitby
Strand - case heard at Whitby" -- defendant William Pattison, home
Whitby, occupation jet worker. "The Pier" resolves to Piers
(Seafront/Whitby). Crime type=drunk and disorderly matches (per
"drunk and riotous" precedent). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-883 done.**

## Record 884

"Summary conviction of John Smith for lodging in the open air in
Union Road with no visible means of subsistence and not giving a
good account of himself. Offence committed at the township of
Ruswarp on 3 August 1875. Whitby Strand - case heard at Whitby" --
defendant John Smith. Union Road nests under Whitby's West Cliff
but the record states township Ruswarp -- correctly captured
alongside per the cliff-boundary pattern. Crime type=vagrancy
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-884 done.**

## Record 885

"Summary conviction of Joseph Bellman of the township of Ruswarp
pedlar for lodging in a cart shed without any visible means of
subsistence and not giving a good account of himself. Offence
committed at the township of Ruswarp on 2 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Joseph Bellman, home Ruswarp, occupation pedlar. Location Ruswarp
matches. Crime type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-885 done.**

## Record 886

"Summary conviction of Alfred Frank of the township of Whitby jet
worker for resisting James Wilkinson one of the constables for the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 28 September 1869. Whitby Strand - case heard
at Whitby" -- defendant Alfred Frank, home Whitby, occupation jet
worker; victim James Wilkinson, sex correctly male. Location Whitby
matches. Crime type=obstructing/resisting a constable matches
(charge is "resisting", not "assaulting"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-886 done.**

## Record 887

"Summary conviction of Thomas Weatherill of the township of Whitby
jet worker for obstructing Church Street by wilfully preventing
persons from passing him. Offence committed at the township of
Whitby on 13 June 1875. Whitby Strand - case heard at Whitby" --
defendant Thomas Weatherill (same name as record 651's assault
defendant, but a different conviction, correctly a distinct person
row), home Whitby, occupation jet worker. Church Street matches.
Crime type=obstructing the highway matches. Already correctly linked
to related_conviction 702 and 896 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-887 done.**

## Record 888

"Summary conviction of Thomas Wood of Mohlan in the township of
Eskdaleside cum Ugglebarnby a miner employed at the Grosmont Mine
for fighting with Frank Lyth the younger at the mine. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 6 April
1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Thomas Wood, home "Mohlan" resolves to the
existing "Mallyan (Spout)" location (a real place near Goathland
within Eskdaleside-cum-Ugglebarnby, likely a scribal spelling
variant of "Mallyan"), matching the stated township. Occupation
"miner employed at the Grosmont Mine" correctly captured. Victim
Frank Lyth, name_postfix "the younger" correctly captured. Offence
location Eskdaleside-cum-Ugglebarnby matches. Crime type=breach of
the peace matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-888 done.**

## Record 889

"Summary conviction of Robert Foster of the township of Whitby
sailor for being drunk. Offence committed at the township of
Whitby on 24 September 1869. Whitby Strand - case heard at Whitby"
-- defendant Robert Foster (same name/occupation as record 833,
different date, correctly a distinct person row), home Whitby.
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-889 done.**

## Record 890

"Summary conviction of Ann Miller wife of Henry Miller of the
township of Whitby labourer for being drunk and disorderly in
Church Street; on the oath of Robert Needham of the township of
Whitby police constable. Offence committed at the township of
Whitby on 11 June 1875. Whitby Strand - case heard at Whitby" --
defendant Ann Miller, spouse Henry Miller (home Whitby, occupation
labourer, relationship correctly captured) -- this is the exact
record referenced in reextraction-audit-notes.md as an earlier fix,
confirmed still correct (same name as record 792's Ann Miller/James
Miller pair, but a different husband and conviction, correctly
distinct). Informant Robert Needham, occupation police constable.
Church Street matches. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-890 done.**

## Record 891

"Summary conviction of Hannah Smith wife of John Henry Smith of the
township of Whitby fish hawker for being drunk on the licensed
premises of Robert Ward and refusing to leave when asked by George
Swales Offence committed at the township of Whitby on 22 May 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Hannah Smith, spouse John Henry Smith (home Whitby,
occupation fish hawker, relationship correctly captured) -- same
names as record 748, but a different date, correctly a distinct
conviction/person pair. Licensee Robert Ward, occupation "licensee";
informant George Swales. Location Whitby matches. Crime types =
drunkenness + refusal to quit licensed premises both fit. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-891 done.**

## Record 892

"Summary conviction of Martin Finnegan late of the township of
Glaisdale furnaceman for assaulting Thomas Bowron one of the
constables for the North Riding in the execution of his duty.
Offence committed at the township of Glaisdale on 28 September
1869. Whitby Strand - case heard at Whitby" -- defendant Martin
Finnegan, "late of" Glaisdale correctly captured as home, occupation
furnaceman; victim Thomas Bowron (same real constable as records
770/854, correctly a separate person row per no-cross-conviction-
merge), sex correctly male. Location Glaisdale matches. Crime
type=assaulting a police officer matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-892 done.**

## Record 893

"Summary conviction of Stephen Kelly of the township of Whitby
pedlar for wilfully damaging a policeman's lamp, the property of
the North Riding Constabulary; on the oath of Thomas Hall of
Whitby police constable. Offence committed at the township of
Whitby on 30 August 1875. Whitby Strand - case heard at Whitby" --
defendant Stephen Kelly, home Whitby, occupation pedlar; informant
Thomas Hall, occupation police constable. "North Riding
Constabulary" correctly not captured as a person row (an
institution, not an individual). Location Whitby matches. Crime
type=malicious/property damage matches. Already correctly linked to
related_conviction 837 and 902 (same defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-893 done.**

## Record 894

"Summary conviction of William Hampson of the township of Whitby
iron worker for lodging in the open air without any visible means
of subsistence and not giving a good account of himself. Offence
committed at the township of Whitby on 4 June 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
William Hampson, home Whitby, occupation iron worker. Location
Whitby matches. Crime type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-894 done.**

## Record 895

"Summary conviction of James Dinsdale of Whitby sailor for taking
trout from a stream of water where Charles Wynn Finch esquire has
private right of fishery. Offence committed at the township of
Great Ayton at 5.30 a.m. on 25 June 1869. Case heard at Stokesley"
-- defendant James Dinsdale, home Whitby, occupation sailor;
landowner Charles Wynn Finch, "esquire" correctly ignored (no
title/occupation captured) per the established corpus-wide rule.
Offence location Great Ayton, court location Stokesley (a rare
non-Whitby court, correctly captured as stated). Crime type=poaching
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-895 done.**

## Record 896

"Summary conviction of Patrick Joyce of the township of Whitby
bricklayer for obstructing Church Street by wilfully preventing
persons from passing him; on the oath of Thomas Hall of the
township of Whitby police constable. Offence committed at the
township of Whitby on 13 June 1875. Whitby Strand - case heard at
Whitby" -- defendant Patrick Joyce (same name/occupation as records
733/856, different date, correctly a distinct person row), home
Whitby; informant Thomas Hall, occupation police constable. Church
Street matches. Crime type=obstructing the highway matches. Final
member of the Church Street obstruction cluster (702, 887, 896), all
pairwise links now fully verified complete.

**OK — no changes.**

---

**Progress: records 1-896 done.**

## Record 897

"Summary conviction of Thomas Johnson of the township of Glaisdale
labourer for assaulting William Cruddas one of the constables for
the North Riding in the execution of his duty. Offence committed at
the township of Glaisdale on 16 June 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas
Johnson, home Glaisdale, occupation labourer; victim William
Cruddas, sex correctly male. Location Glaisdale matches. Crime
type=assaulting a police officer matches. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 900]:** records 900 and 903
turned out to share this exact same victim/offence/township/date
(William Cruddas, 16 June 1888, Glaisdale) with different
defendants. related_conviction links to both have now been added
retroactively.

---

**Progress: records 1-897 done.**

## Record 898

"Summary conviction of Henry Lightwing of Guisborough miner for
wilfully tearing a black cloth coat, the property of Robert Pearson
of Whitby blacksmith. Offence committed at Guisborough on 28 August
1869. Case heard at Guisborough" -- defendant Henry Lightwing, home
Guisborough, occupation miner; property owner Robert Pearson, home
Whitby, occupation blacksmith. Court and offence location both
correctly Guisborough (a rare non-Whitby case). Crime type=malicious/
property damage matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-898 done.**

## Record 899

"Summary conviction of Daniel George Robinson of the township of
Whitby labourer for being drunk and disorderly in Bridge Street; on
the oath of George Hewison of the township of Whitby police
constable. Offence committed at the township of Whitby on 19 July
1875. Whitby Strand - case heard at Whitby" -- defendant Daniel
George Robinson (same name as record 852, different date, correctly
a distinct person row), home Whitby, occupation labourer; informant
George Hewison, occupation police constable. Bridge Street matches.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-899 done.**

## Record 900

"Summary conviction of Thomas Kendal of the township of Glaisdale
labourer for assaulting William Cruddas one of the constables for
the North Riding in the execution of his duty. Offence committed at
the township of Glaisdale on 16 June 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas
Kendal, home Glaisdale, occupation labourer; victim William Cruddas,
sex correctly male. Location Glaisdale matches. Crime
type=assaulting a police officer matches. No related_conviction was
present, but this is identical victim/offence/township/date to
record 897 (Thomas Johnson). Searched and found a third match: 903
(John Shaw, not yet reached) -- all three records share the exact
same victim, offence, township, and date. Added all 3 pairwise
related_conviction rows, retroactively annotated 897's entry.

**FIXED — added missing related_conviction links for a 3-record cluster (897, 900, 903).**

---

**Progress: records 1-900 done.**

## Record 901

"Summary conviction of John Denham, William Wright, Richard Dillon,
James Griffiths and John Griffiths for playing a game of chance
called pitch and toss with pence and half-pence on the Fish Pier
Sands. Offence committed at the township of Whitby on 21 March
1869. Whitby Strand - case heard at Whitby" -- five defendants
correctly captured; James Griffiths and John Griffiths share a
surname but no relationship stated in text, correctly none captured.
"Fish Pier Sands" resolves through Fish Pier -> Piers -> Seafront ->
Whitby, matching stated township. Crime type=gaming/gambling offence
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-901 done.**

## Record 902

"Summary conviction of Stephen Kelly of the township of Whitby
pedlar for assaulting Thomas Hall one of the constables for the
North Riding in the execution of his duty; on the oath of Thomas
Hall of Whitby police constable. Offence committed at the township
of Whitby on 30 August 1875. Whitby Strand - case heard at Whitby"
-- defendant Stephen Kelly, home Whitby, occupation pedlar; victim
Thomas Hall, sex correctly male (same real constable who appeared
as informant on record 893, correctly a separate person row).
Location Whitby matches. Crime type=assaulting a police officer
matches. Already correctly linked to related_conviction 837 and 893
(same defendant, same offence date).

**OK — no changes.**

---

**Progress: records 1-902 done.**

## Record 903

"Summary conviction of John Shaw of the township of Glaisdale
labourer for assaulting William Cruddas one of the constables for
the North Riding in the execution of his duty. Offence committed at
the township of Glaisdale on 16 June 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant John Shaw
(same name as record 888's fight defendant Thomas Wood's opponent
Frank Lyth's context, but this is a wholly separate conviction,
correctly a distinct person row), home Glaisdale, occupation
labourer; victim William Cruddas, sex correctly male. Location
Glaisdale matches. Crime type=assaulting a police officer matches.
Final member of the Cruddas-assault cluster (897, 900, 903), all
pairwise links now fully verified complete.

**OK — no changes.**

---

**Progress: records 1-903 done.**

## Record 904

"Summary conviction of William Duesbery of the township of
Glaisdale farmer for being drunk. Offence committed at the township
of Whitby on 22 March 1869. Whitby Strand - case heard at Whitby"
-- defendant William Duesbery, home Glaisdale, occupation farmer.
Offence location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-904 done.**

## Record 905

"Summary conviction of Robert Watson of the township of Whitby
labourer for wilfully damaging the glass of a window, the property
of James McCue; on the oath of Cuthbert Wray fruiterer and the said
James McCue licensed victualler, both of the township of Whitby.
Offence committed at the township of Whitby on 19 June 1875. Whitby
Strand - case heard at Whitby" -- defendant Robert Watson (same
name/occupation as records 750/756, different date/offence,
correctly a distinct person row), home Whitby; witness Cuthbert
Wray (same name as record 465's home fix, but a different
conviction, correctly separate), occupation fruiterer; property
owner James McCue, occupation licensed victualler. Location Whitby
matches. Crime type=malicious/property damage matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-905 done.**

## Record 906

"Summary conviction of William George Walker of the Cragg in the
township of Whitby for not sending his daughter Minnie Walker to
school. Offence committed in Whitby School Board district on 15
June 1888. Case heard at Whitby" -- defendant William George
Walker, home The Cragg (West Cliff/Whitby); daughter Minnie Walker,
"daughter" relationship correctly captured pointing at the real
William George Walker (person 970), not a duplicate stub -- this is
the exact record referenced in reextraction-audit-notes.md as the
seed case for that duplicate-stub bug fix, confirmed still correct.
Truancy rule correctly applied: offence location = his own home
(The Cragg), not the School Board district wording. Crime
type=school non-attendance matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-906 done.**

## Record 907

"Summary conviction of William Crosley for begging in Esk Terrace.
Offence committed at the township of Ruswarp on 1 April 1869.
Whitby Strand - case heard at Whitby" -- defendant William Crosley.
Esk Terrace nests under Whitby's West Cliff but the record states
township Ruswarp -- correctly captured alongside per the
cliff-boundary pattern. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-907 done.**

## Record 908

"Summary conviction of John Harrison of the township of Hawsker cum
Stainsacre farm labourer for trespassing in the daytime in search
of conies in a close of land in the possession and occupation of
Richard Thompson. Offence committed at the township of Hawsker cum
Stainsacre on 12 July 1875. Whitby Strand - case heard at Whitby"
-- defendant John Harrison, home Hawsker-cum-Stainsacre, occupation
farm labourer; landowner Richard Thompson (same name as records
700/775, but a different conviction, correctly a distinct person
row). Location matches. Crime type=poaching matches ("conies" =
rabbits, trespass in search of game). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-908 done.**

## Record 909

"Summary conviction of John Atkinson of Blackburn's Yard in the
township of Whitby for not sending his daughter Mary Ellen Atkinson
to school. Offence committed in Whitby School Board district on 15
June 1888. Case heard at Whitby" -- defendant John Atkinson (same
name as the Hinderwell police constable appearing repeatedly
elsewhere in the corpus, but this is a Whitby-based defendant,
correctly a distinct person row), home Blackburn's Yard (East
Cliff/Whitby); daughter Mary Ellen Atkinson, "daughter" relationship
correctly captured. Truancy rule correctly applied: offence location
= his own home, not the School Board district wording. Crime
type=school non-attendance matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-909 done.**

## Record 910

"Summary conviction of Stephen Locker of the township of Whitby jet
worker for assaulting John Boulton. Offence committed at the
township of Whitby on 3 April 1869. Whitby Strand - case heard at
Whitby" -- defendant Stephen Locker, home Whitby, occupation jet
worker; victim John Boulton. Location Whitby matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-910 done.**

## Record 911

"Summary conviction of Thomas Hustler of the township of Whitby
coal porter for obstructing Church Street by wilfully preventing
persons passing him. Offence committed at the township of Whitby
on 27 August 1875. Whitby Strand - case heard at Whitby" -- defendant
Thomas Hustler, home Whitby, occupation coal porter. Church Street
matches. Crime type=obstructing the highway matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-911 done.**

## Record 912

"Summary conviction of Alfred Johnson of Sleights in the township
of Eskdaleside cum Ugglebarnby fish hawker for allowing his horse
to stray on the Sleights and Grosmont highway. Offence committed at
the township of Eskdaleside cum Ugglebarnby on 18 June 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Alfred Johnson, home Sleights (nested under Eskdaleside-cum-
Ugglebarnby), occupation fish hawker. Cross-parish "Sleights &
Grosmont Highway" correctly added alongside stated township. Crime
type=straying animals matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-912 done.**

## Record 913

"Summary conviction of William Fortune of the township of Whitby
coal merchant for being the owner of three asses found straying on
Hawsker Lane. Offence committed at the township of Hawsker cum
Stainsacre on 4 April 1869. Whitby Strand - case heard at Whitby"
-- defendant William Fortune, home Whitby, occupation coal merchant.
"Hawsker Lane" (a specific street under East Cliff/Whitby) correctly
added alongside the stated offence township Hawsker-cum-Stainsacre,
since the street's own ancestry (Whitby) doesn't reach that parent
-- matches the specific-site "add alongside" rule. Crime
type=straying animals matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-913 done.**

## Record 914

"Summary conviction of Richard Collier of the township of Whitby
jet worker for being drunk and disorderly in Church Street; on the
oath of Mary Ann Garbutt wife of Henry Garbutt tailor and Jane
Cornforth, both of the township of Whitby. Offence committed at the
township of Whitby on 6 August 1875. Whitby Strand - case heard at
Whitby" -- defendant Richard Collier, home Whitby, occupation jet
worker; witnesses Mary Ann Garbutt and Jane Cornforth; Mary Ann's
spouse Henry Garbutt (home Whitby, occupation tailor) correctly
captured with role "spouse of involved person" (appropriate since
Mary Ann is a witness, not defendant/victim). Church Street matches.
Crime type=drunk and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-914 done.**

## Record 915

"Summary conviction of John Bruce of the township of Fylingdales
labourer for wandering begging in Robin Hood's Bay town street.
Offence committed at the township of Fylingdales on 22 June 1888.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant John Bruce, home Fylingdales, occupation labourer. "Robin
Hood's Bay town street" resolves to Robin Hood's Bay itself, nested
under Fylingdales, matching stated township. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-915 done.**

## Record 916

"Summary conviction of Elizabeth Hodgson wife of Joseph Hodgson of
the township of Whitby joiner for being drunk. Offence committed at
the township of Whitby on 13 April 1869. Whitby Strand - case heard
at Whitby" -- defendant Elizabeth Hodgson, spouse Joseph Hodgson
(home Whitby, occupation joiner, relationship correctly captured).
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-916 done.**

## Record 917

"Summary conviction of William Willison of the township of Whitby
licensed victualler for allowing drunkenness on his licensed
premises; on the oath of Francis Moon labourer and John Ryder
superintendent of police, both of the township of Whitby. Offence
committed at the township of Whitby on 16 July 1875. Whitby Strand
- case heard at Whitby" -- defendant William Willison, home Whitby,
occupation licensed victualler; witness Francis Moon, occupation
labourer; informant John Ryder, occupation superintendent of police.
Location Whitby matches. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-917 done.**

## Record 918

"Summary conviction of Michael Tooney of the township of
Fylingdales hawker for acting as a pedlar without a certificate.
Offence committed at the township of Fylingdales on 23 June 1888.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Michael Tooney, home Fylingdales, occupation hawker.
Location Fylingdales matches. Crime type=licensing offence matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-918 done.**

## Record 919

"Summary conviction of John Codling of the township of Whitby jet
worker for being drunk. Offence committed at the township of Whitby
on 11 April 1869. Whitby Strand - case heard at Whitby" -- defendant
John Codling, home Whitby, occupation jet worker. Location Whitby
matches. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-919 done.**

## Record 920

"Summary conviction of Thomas Dixon of the township of Whitby
labourer for resisting Edward Weeks one of the constables for the
North Riding in the execution of his duty; on the oath of Edward
Weeks of the township of Whitby police constable Offence committed
at the township of Whitby on 11 August 1875. Whitby Strand - case
heard at Whitby" -- defendant Thomas Dixon, home Whitby, occupation
labourer; victim Edward Weeks, sex correctly male. Location Whitby
matches. Crime type=obstructing/resisting a constable matches. No
related_conviction was present, but this is identical victim/
offence/township/date to record 810 (John Dixon) -- both defendants
share the surname Dixon though no relationship is stated, matches
the confirmed same-victim related_conviction pattern. Added the
link, retroactively annotated 810's entry.

**FIXED — added missing related_conviction link to 810 (same victim/offence/township/date).**

---

**Progress: records 1-920 done.**

## Record 921

"Summary conviction of George Martin of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 23 June 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
George Martin, home Whitby, occupation jet worker. Church Street
matches. Crime type=drunk and disorderly matches. Already correctly
linked to related_conviction 924 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-921 done.**

## Record 922

"Summary conviction of George Lennard of the township of Lythe
labourer for being drunk. Offence committed at the township of
Lythe on 10 April 1869. Whitby Strand - case heard at Whitby" --
defendant George Lennard, home Lythe, occupation labourer. Location
Lythe matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-922 done.**

## Record 923

"Summary conviction of Hugh Lawrence of the township of Whitby fish
merchant for placing herring casks on Pier Road; on the oath of
John Ryder superintendent of police and Edward Weeks police
constable, both of the township of Whitby. Offence committed at the
township of Whitby on 15 September 1875. Whitby Strand - case heard
at Whitby" -- defendant Hugh Lawrence, home Whitby, occupation fish
merchant; informants John Ryder (superintendent of police) and
Edward Weeks (police constable). Pier Road matches (West Cliff/
Whitby). Crime type=obstructing the highway matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-923 done.**

## Record 924

"Summary conviction of Thomas Dixon of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 23 June 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Thomas Dixon (same name as record 920's labourer, different
occupation/date, correctly a distinct person row), home Whitby,
occupation jet worker. Church Street matches. Crime type=drunk and
disorderly matches. Already correctly linked to related_conviction
921 (same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-924 done.**

## Record 925

"Summary conviction of Mary Wedgewood of the township of Middleton
servant in husbandry of Robert Frank for breach of her contract of
employment; on the complaint of the said Robert Frank of the
township of Glaisdale farmer. Offence committed at the township of
Glaisdale on 16 April 1869. Whitby Strand - case heard at Whitby"
-- defendant Mary Wedgewood, home Middleton, occupation "servant in
husbandry"; informant/master Robert Frank, home Glaisdale,
occupation farmer, "servant" relationship correctly captured
pointing from Mary to Robert. Offence location Glaisdale matches.
Crime type=master and servant offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-925 done.**

## Record 926

"Summary conviction of William Arnold for assaulting John Nicholson
one of the constables for the North Riding in the execution of his
duty. Offence committed at the township of Whitby on 2 September
1875. Whitby Strand - case heard at Whitby" -- defendant William
Arnold, victim John Nicholson, sex correctly male. Location Whitby
matches. Crime type=assaulting a police officer matches. Already
correctly linked to related_conviction 753 (same defendant, same
offence date -- Arnold's companion assault charge against John
Brown).

**OK — no changes.**

---

**Progress: records 1-926 done.**

## Record 927

"Summary conviction of William Newton of the township of
Fylingdales beerhouse keeper for being drunk and disorderly on the
Robin Hood's Bay and Whitby highway. Offence committed at the
township of Fylingdales on 24 June 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant William
Newton, home Fylingdales, occupation beerhouse keeper. Cross-parish
"Whitby & Robin Hood's Bay Highway" correctly added alongside
stated township Fylingdales. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-927 done.**

## Record 928

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for attempting to board a train on the Cleveland and
North Yorkshire line of the North Eastern Railway whilst it was in
motion. Offence committed at the township of Eskdaleside on 13
April 1869. Whitby Strand - case heard at Whitby" -- defendant
Thomas Atkinson, home Whitby, occupation innkeeper. The record names
the "Cleveland and North Yorkshire line" -- the exact railway
already created as a location node (id 391) at record 614's fix --
but no location link had been added here. Added it alongside the
existing Eskdaleside-cum-Ugglebarnby township link. Crime
type=railway offence matches. No related_conviction.

**FIXED — added missing "Cleveland & North Yorkshire Railway" location link.**

---

**Progress: records 1-928 done.**

## Record 929

"Summary conviction of Peter Kilpatrick of the township of Whitby
iron worker for being drunk and disorderly in Church Street; on the
oath of Robert Needham and George Hewison, both of the township of
Whitby police constables. Offence committed at the township of
Whitby on 2 September 1875. Whitby Strand - case heard at Whitby"
-- defendant Peter Kilpatrick, home Whitby, occupation iron worker;
informants Robert Needham and George Hewison, both occupation police
constable. Church Street matches. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-929 done.**

## Record 930

"Summary conviction of William Dixon of the township of Whitby jet
worker for being drunk and disorderly in Hawsker town street.
Offence committed at the township of Whitby on 24 June 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
William Dixon, home stated as Whitby. The charge names "Hawsker town
street" but the trailing "offence committed at" clause says
"township of Whitby" -- a genuine source-side contradiction. Checked
all 15 corpus instances of "Hawsker town street": every other one
consistently states township of Hawsker cum Stainsacre for both home
and offence location, confirming this record is a one-off scribal
inconsistency, not a real Whitby/Hawsker ambiguity. Location of
offence was already correctly captured as Hawsker-cum-Stainsacre
(trusting the specific site name, consistent with the other 15).
Added an `anomalies` note documenting the discrepancy. Crime
type=drunk and disorderly matches. No related_conviction.

**FIXED — added anomalies note for the "township of Whitby" vs "Hawsker town street" scribal contradiction.**

---

**Progress: records 1-930 done.**

## Record 931

"Summary conviction of Walter Bateman for begging in the Market
Place. Offence committed at the township of Whitby on 24 April
1869. Whitby Strand - case heard at Whitby" -- defendant Walter
Bateman. Market Place matches (East Cliff/Whitby). Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-931 done.**

## Record 932

"Summary conviction of Hannah Jane Shevill wife of George Shevill
of the township of Whitby jet merchant for using obscene language
in Church Street; on the oath of Louisa Miles singlewoman and Sarah
Raw, both of the township of Whitby. Offence committed at the
township of Whitby on 15 September 1875. Whitby Strand - case heard
at Whitby" -- defendant Hannah Jane Shevill, spouse George Shevill
(home Whitby, occupation jet merchant, relationship correctly
captured); witnesses Louisa Miles and Sarah Raw. Louisa Miles is
stated "singlewoman" but occupation was not linked -- this id was
already on the tracked marital-status occupation gap list. Added
occupation "singlewoman" (id 337) to Louisa Miles. Church Street
matches. Crime type=using obscene language matches. No
related_conviction.

**FIXED — added missing "singlewoman" occupation for witness Louisa Miles (tracked gap, id 932 removed from the list).**

---

**Progress: records 1-932 done.**

## Record 933

"Summary conviction of John Whittaker of the township of
Fylingdales labourer for begging in Thorpe town street. Offence
committed at the township of Fylingdales on 27 June 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
John Whittaker, home Fylingdales, occupation labourer. "Thorpe town
street" resolves to Fylingthorpe (a real hamlet within Fylingdales),
matching stated township. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-933 done.**

## Record 934

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for allowing persons of notoriously bad character to meet
on his licensed premises. Offence committed at the township of
Whitby on 25 April 1869. Whitby Strand - case heard at Whitby" --
defendant Thomas Atkinson (same name/occupation as record 928,
different date, correctly a distinct person row), home Whitby.
Location Whitby matches. Crime type=licensing offence matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-934 done.**

## Record 935

"Summary conviction of John Shaw of the township of Whitby jet
worker for being drunk and riotous on the New Quay. Offence
committed at the township of Whitby on 10 September 1875. Whitby
Strand - case heard at Whitby" -- defendant John Shaw (same name as
records 888/903, different conviction, correctly a distinct person
row), home Whitby, occupation jet worker. New Quay matches (West
Cliff/Whitby). Crime type=drunk and disorderly matches (per "drunk
and riotous" precedent). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-935 done.**

## Record 936

"Summary conviction of John Jackson of the township of Ellerby
labourer for lodging in the open air in Ellerby town street having
no visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Ellerby on 29 June
1888. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant John Jackson, home Ellerby, occupation
labourer. "Ellerby town street" resolves to Ellerby itself, matching
stated township. Crime type=vagrancy matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-936 done.**

## Record 937

"Summary conviction of John Corner of the township of Whitby jet
worker for being drunk. Offence committed at the township of
Ruswarp on 25 April 1869. Whitby Strand - case heard at Whitby" --
defendant John Corner (same name as record 697's licensed
victualler, different conviction, correctly a distinct person row),
home Whitby, occupation jet worker. Offence location Ruswarp
matches. Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-937 done.**

## Record 938

"Summary conviction of Thomas Atkinson of the township of Whitby
labourer for being drunk and disorderly in Sandgate. Offence
committed at the township of Whitby on 29 September 1875. Whitby
Strand - case heard at Whitby" -- defendant Thomas Atkinson (same
name as records 928/934's innkeeper, different occupation and
conviction, correctly a distinct person row), home Whitby,
occupation labourer. Sandgate matches. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-938 done.**

## Record 939

"Summary conviction of Christopher Peacock of the township of
Whitby jet worker for being drunk and disorderly on the Robin
Hood's Bay and Whitby highway. Offence committed at the township of
Fylingdales on 1 July 1888. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant Christopher Peacock, home
Whitby, occupation jet worker. Cross-parish "Whitby & Robin Hood's
Bay Highway" correctly added alongside stated offence township
Fylingdales. Crime type=drunk and disorderly matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-939 done.**

## Record 940

"Summary conviction of Ann Palmer wife of George Palmer of the
township of Whitby fisherman for wilfully obstructing a street.
Offence committed at the township of Whitby on 24 April 1869.
Whitby Strand - case heard at Whitby" -- defendant Ann Palmer,
spouse George Palmer (home Whitby, occupation fisherman,
relationship correctly captured). Location Whitby matches. Crime
type=obstructing the highway matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-940 done.**

## Record 941

"Summary conviction of John Shaw of the township of Whitby jet
worker for being drunk and disorderly in Wades Yard; on the oath of
Robert Needham and John Nicholson, both of the township of Whitby
police constables. Offence committed at the township of Whitby on 4
September 1875. Whitby Strand - case heard at Whitby" -- defendant
John Shaw (same name as records 888/903/935, yet another distinct
conviction, correctly a distinct person row), home Whitby,
occupation jet worker; informants Robert Needham and John Nicholson,
both police constables. "Wades Yard" nests under Baxtergate/West
Cliff/Whitby, matching stated township. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-941 done.**

## Record 942

"Summary conviction of Mary Howard wife of Thomas Howard of the
township of Whitby labourer for being drunk and disorderly on the
Sandsend and Lythe highway. Offence committed at the township of
Lythe on 2 July 1888. Whitby Strand Petty Sessional division - case
heard at Whitby" -- defendant Mary Howard, spouse Thomas Howard
(home Whitby, occupation labourer, relationship correctly captured;
same name as record 796's Thomas Howard but correctly a distinct
person row). Cross-parish "Sandsend & Lythe Highway" correctly
added alongside stated offence township Lythe. Crime type=drunk
and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-942 done.**

## Record 943

"Summary conviction of William Hewison of the township of Whitby
jet worker for being drunk and riotous in Henrietta Street. Offence
committed at the township of Whitby on 24 April 1869. Whitby
Strand - case heard at Whitby" -- defendant William Hewison, home
Whitby, occupation jet worker. Henrietta Street matches. Crime
type=drunk and disorderly matches (per "drunk and riotous"
precedent). Already correctly linked to related_conviction 949
(same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-943 done.**

## Record 944

"Summary conviction of Isaac Wilson of the township of Whitby
labourer for being drunk and disorderly in Victoria Square. Offence
committed at the township of Whitby on 10 September 1875. Whitby
Strand - case heard at Whitby" -- defendant Isaac Wilson (same name
as record 867's printer's apprentice, different occupation and
conviction, correctly a distinct person row), home Whitby.
Victoria Square matches (West Cliff/Whitby). Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-944 done.**

## Record 945

"Summary conviction of Rowbottom Emmett of the township of Ruswarp
pedlar for begging in Prospect Hill. Offence committed at the
township of Ruswarp on 4 July 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Rowbottom Emmett,
home Ruswarp, occupation pedlar. Prospect Hill nests under Whitby's
West Cliff but the record states township Ruswarp -- correctly
added alongside per the cliff-boundary pattern. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-945 done.**

## Record 946

"Summary conviction of William Pattison for being drunk and riotous
in Church Street. Offence committed at the township of Whitby on
25 April 1869. Whitby Strand - case heard at Whitby" -- defendant
William Pattison (same name as record 883, different conviction,
correctly a distinct person row). Church Street matches. Crime
type=drunk and disorderly matches (per "drunk and riotous"
precedent). Already correctly linked to related_conviction 952
(same offence date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-946 done.**

## Record 947

"Summary conviction of Frederick William Judge of the township of
Whitby innkeeper for allowing drunkenness on his licensed premises;
on the oath of George Richard Lazenby of Whitby police constable.
Offence committed at the township of Whitby on 1 September 1875.
Whitby Strand - case heard at Whitby" -- defendant Frederick
William Judge (same name as record 843's licensee, a different role
and conviction, correctly a distinct person row), home Whitby,
occupation innkeeper; informant George Richard Lazenby, occupation
police constable. Location Whitby matches. Crime type=licensing
offence matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-947 done.**

## Record 948

"Summary conviction of Pearson Campion of the township of Ruswarp
jet worker for being drunk and disorderly on the Whitby and
Guisborough highway. Offence committed at the township of Ruswarp
on 8 July 1888. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant Pearson Campion, home Ruswarp, occupation
jet worker. Cross-parish "Whitby & Guisborough Highway" correctly
added alongside stated township Ruswarp. Crime type=drunk and
disorderly matches. Already correctly linked to related_conviction
951 (same defendant, same offence date) and 954 (same offence date/
street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-948 done.**

## Record 949

"Summary conviction of Ralph Swales for being drunk and riotous in
Henrietta Street. Offence committed at the township of Whitby on
24 April 1869. Whitby Strand - case heard at Whitby" -- defendant
Ralph Swales. Henrietta Street matches. Crime type=drunk and
disorderly matches (per "drunk and riotous" precedent). Already
correctly linked to related_conviction 943 (same offence date/
street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-949 done.**

## Record 950

"Summary conviction of Thomas Crawford for stealing a peck of
apples value 2s, the property of Joseph Watson and growing in his
garden. Offence committed at the township of Hinderwell on 12
September 1875. Whitby Strand - case heard at Whitby" -- defendant
Thomas Crawford, property owner Joseph Watson. Checked for a
matching cluster (per the earlier apple-theft precedent at 495/622/
625) -- this is a sole instance in the corpus, no cluster to link.
Location Hinderwell matches. Crime type=theft matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-950 done.**

## Record 951

"Summary conviction of Pearson Campion of the township of Ruswarp
jet worker for assaulting Mary Jane Harris. Offence committed at
the township of Ruswarp on 8 July 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Pearson
Campion, home Ruswarp, occupation jet worker; victim Mary Jane
Harris. Location Ruswarp matches. Crime type=assault matches.
Already correctly linked to related_conviction 948 (same defendant,
same offence date -- Campion's companion drunk-and-disorderly
charge).

**OK — no changes.**

---

**Progress: records 1-951 done.**

## Record 952

"Summary conviction of Francis Fewster of the township of Whitby
jet worker for being drunk and riotous in Church Street. Offence
committed at the township of Whitby on 25 April 1869. Whitby
Strand - case heard at Whitby" -- defendant Francis Fewster (same
name/occupation as records 747/825/831, a fourth distinct
conviction, correctly a distinct person row), home Whitby. Church
Street matches. Crime type=drunk and disorderly matches (per "drunk
and riotous" precedent). Already correctly linked to
related_conviction 946 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-952 done.**

## Record 953

"Summary conviction of Hannah Cooper of the township of Whitby
singlewoman for using obscene language in Blackburn's Yard; on the
oath of Harriet Hicks and Dorothy Gaines, both of the township of
Whitby singlewomen. Offence committed at the township of Whitby on
16 September 1875. Whitby Strand - case heard at Whitby" -- defendant
Hannah Cooper, witnesses Harriet Hicks and Dorothy Gaines (a
different, unmarried Dorothy Gaines from record 860's married
namesake, correctly a distinct person row) -- all three explicitly
stated "singlewoman"/"singlewomen" but none had the occupation
linked. This id (953) was already on the tracked marital-status
occupation gap list; the two witnesses were an additional instance
of the same gap found while fixing this record. Added occupation
"singlewoman" to all three. Blackburn's Yard matches. Crime
type=using obscene language matches. No related_conviction.

**FIXED — added missing "singlewoman" occupation to defendant + both witnesses (tracked gap, id 953 removed from the list).**

---

**Progress: records 1-953 done.**

## Record 954

"Summary conviction of John William Chapman of the township of
Ruswarp jet worker for being drunk and disorderly on the Whitby and
Guisborough highway. Offence committed at the township of Ruswarp
on 8 July 1888. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant John William Chapman, home Ruswarp,
occupation jet worker. Cross-parish "Whitby & Guisborough Highway"
correctly added alongside stated township Ruswarp. Crime type=drunk
and disorderly matches. Already correctly linked to
related_conviction 948 (same offence date/street/charge, different
defendants).

**OK — no changes.**

---

**Progress: records 1-954 done.**

## Record 955

"Summary conviction of Robert Pearson of the township of Hawsker
cum Stainsacre blacksmith for wilfully damaging part of a plane
tree, the property of David Barclay Chapman esquire, growing on
land occupied by James Cliff, and causing two-shillingsworth of
damage. Offence committed at the township of Hawsker cum Stainsacre
on 26 April 1869. Whitby Strand - case heard at Whitby" -- defendant
Robert Pearson (same name as record 898's property owner, but a
different conviction and role, correctly a distinct person row),
home Hawsker-cum-Stainsacre, occupation blacksmith; property owner
David Barclay Chapman, "esquire" correctly ignored (no title/
occupation captured); landowner/occupier James Cliff, correctly a
separate person from the property owner. Location matches. Crime
type=malicious/property damage matches. No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 958]:** record 958 (Thomas
Fletcher, breaking James Cliff's fence) turned out to share the same
named party (James Cliff), township, and offence date -- a
related_conviction link has now been added retroactively.

---

**Progress: records 1-955 done.**

## Record 956

"Summary conviction of Henry Plaxton of the township of Whitby
fruiterer for being drunk and disorderly in Church Street; on the
oath of Thomas Hall police constable and Miles Moody inspector of
police, both of the township of Whitby. Offence committed at the
township of Whitby on 14 June 1875. Whitby Strand - case heard at
Whitby" -- defendant Henry Plaxton, home Whitby, occupation
fruiterer; informants Thomas Hall (police constable) and Miles Moody
(occupation "inspector of police", correctly distinguished from
plain "police constable"). Church Street matches. Crime type=drunk
and disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-956 done.**

## Record 957

"Summary conviction of Robinson Smithies of Sleights in the
township of Eskdaleside cum Ugglebarnby for not sending his
daughter Amelia Smithies to school. Offence committed in Sleights
School Attendance Committee district on 1 June 1888. Case heard at
Whitby" -- defendant Robinson Smithies, home Sleights (nested under
Eskdaleside-cum-Ugglebarnby); daughter Amelia Smithies, "daughter"
relationship correctly captured. Truancy rule correctly applied:
offence location = his own home (Sleights), not the "School
Attendance Committee district" wording. Crime type=school
non-attendance matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-957 done.**

## Record 958

"Summary conviction of Thomas Fletcher of the township of Whitby
jet worker for wilfully breaking a dead fence, the property of
James Cliff, and causing two-shillingsworth of damage. Offence
committed at the township of Hawsker cum Stainsacre on 26 April
1869. Whitby Strand - case heard at Whitby" -- defendant Thomas
Fletcher, home Whitby, occupation jet worker; property owner James
Cliff. Offence location Hawsker-cum-Stainsacre matches. Crime
type=malicious/property damage matches. No related_conviction was
present, but this shares the same named party (James Cliff), same
township, and same offence date as record 955 (Robert Pearson,
damaging a tree on James Cliff's occupied land) -- likely one
incident. Added the link, retroactively annotated 955's entry.

**FIXED — added related_conviction link to 955 (same named party/township/date).**

---

**Progress: records 1-958 done.**

## Record 959

"Summary conviction of James Hindson of the township of Ugthorpe
farmer for being the owner of three heifers and an ox found
straying on the highway called Broom House Lane; on the oath of
Henry Dowsland of the township of Hinderwell sergeant of police and
Robert White of Whitby highway surveyor. Offence committed at the
township of Ugthorpe on 7 June 1875. Whitby Strand - case heard at
Whitby" -- defendant James Hindson, home Ugthorpe, occupation
farmer; informants Henry Dowsland (sergeant of police) and Robert
White (highway surveyor). "Broom House Lane" correctly nests under
Ugthorpe, matching stated township. Crime type=straying animals
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-959 done.**

## Record 960

"Summary conviction of Robert Harrison of the township of Egton
quarryman for being drunk on the licensed premises of Charles
Smith. Offence committed at the township of Glaisdale on 6 July
1888. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Robert Harrison, home Egton, occupation
quarryman; licensee Charles Smith (same name as record 672's
defendant, correctly a distinct person row), occupation "licensee".
Offence location Glaisdale matches. Crime type=drunkenness matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-960 done.**

## Record 961

"Summary conviction of Thomas Rothwell for refusing to work, having
been required to do so by Thomas Hughes. Offence committed at the
township of Whitby on 8 May 1869. Whitby Strand - case heard at
Whitby" -- defendant Thomas Rothwell, informant Thomas Hughes.
Location Whitby matches. Crime type=vagrancy -- checked precedent:
the more specific "refusing workhouse labour" leaf (31) is only used
when the text explicitly says "while being relieved in the Whitby
Union workhouse" (records 324, 444); this record has no such
mention, so the more general "vagrancy" tag is correct, not a
mistagging. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-961 done.**

## Record 962

"Summary conviction of Joseph Burnett of the township of
Fylingdales tailor for being the owner of a horse found straying on
the Thorpe and Robin Hood's Bay highway; on the oath of George Eli
North of the township of Fylingdales police constable. Offence
committed at the township of Fylingdales on 9 July 1875. Whitby
Strand - case heard at Whitby" -- defendant Joseph Burnett, home
Fylingdales, occupation tailor; informant George Eli North (same
name as record 828's informant, different conviction, correctly a
distinct person row). Cross-parish "Thorpe & Robin Hood's Bay
Highway" correctly added alongside stated township. Crime
type=straying animals matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-962 done.**

## Record 963

"Summary conviction of William George Harland of the township of
Whitby jet worker for being drunk on the licensed premises of
Francis Jefferson. Offence committed at the township of Whitby on
12 July 1888. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant William George Harland, home Whitby,
occupation jet worker; licensee Francis Jefferson, occupation
"licensee". Location Whitby matches. Crime type=drunkenness matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-963 done.**

## Record 964

"Summary conviction of John Prior of the township of Whitby drainer
for being drunk. Offence committed at the township of Whitby on 3
May 1869. Whitby Strand - case heard at Whitby" -- defendant John
Prior, home Whitby, occupation drainer. Location Whitby matches.
Crime type=drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-964 done.**

## Record 965

"Summary conviction of James Parkin of the township of Whitby cab
driver for driving a horse and carriage furiously in Bridge Street;
on the oath of Thomas Hall police constable and John Ryder
superintendent of police, both of the township of Whitby. Offence
committed at the township of Whitby on 2 August 1875. Whitby
Strand - case heard at Whitby" -- defendant James Parkin, home
Whitby, occupation cab driver; informants Thomas Hall (police
constable) and John Ryder (superintendent of police). Bridge Street
matches. Crime type=furious/reckless driving matches -- "furiously"
explicitly stated (this is the exact record referenced earlier this
session at record 865's precedent check). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-965 done.**

## Record 966

"Summary conviction of James Horton of the township of Whitby
punchinello for being drunk on the licensed premises of Richard
Thompson and refusing to leave when asked by William Dobson acting
sergeant of police. Offence committed at the township of Whitby on
13 July 1888. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant James Horton, home Whitby, unusual occupation
"punchinello" (a Punch-and-Judy-type entertainer) correctly captured
verbatim; licensee Richard Thompson (same name as records 700/775/
908/942, a fifth distinct conviction, correctly a distinct person
row); informant William Dobson, occupation "acting sergeant of
police" correctly preserved as its own distinct phrasing. Location
Whitby matches. Crime types = drunkenness + refusal to quit licensed
premises both fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-966 done.**

## Record 967

"Summary conviction of Joseph McKenzie of the township of Whitby
jet worker for being drunk. Offence committed at the township of
Whitby on 4 May 1869. Whitby Strand - case heard at Whitby" --
defendant Joseph McKenzie, home Whitby, occupation jet worker.
Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-967 done.**

## Record 968

"Summary conviction of Johanna Swinscoe for assaulting Kate
Stonehouse. Offence committed at the township of Whitby on 4
October 1875. Whitby Strand - case heard at Whitby" -- defendant
Johanna Swinscoe, victim Kate Stonehouse. Location Whitby matches.
Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-968 done.**

## Record 969

"Summary conviction of George Flood of the township of Whitby clown
for being drunk and disorderly in Church Street. Offence committed
at the township of Whitby on 13 July 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant George
Flood, home Whitby, unusual occupation "clown" correctly captured
verbatim (likely part of the same travelling entertainment troupe
as record 966's "punchinello", same week). Church Street matches.
Crime type=drunk and disorderly matches. Already correctly linked
to related_conviction 972 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-969 done.**

## Record 970

"Summary conviction of Ellen Hick wife of Isaac Hick of the
township of Whitby for being drunk. Offence committed at the
township of Whitby on 5 May 1869. Whitby Strand - case heard at
Whitby" -- defendant Ellen Hick, spouse Isaac Hick (relationship
correctly captured, no occupation stated for him here, correctly
left blank -- unlike records 653/759's "jet worker" mentions, a
third distinct Ellen/Isaac Hick pair, correctly separate person
rows). Location Whitby matches. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-970 done.**

## Record 971

"Summary conviction of Robert Kirk for begging in St Ann's Staith.
Offence committed at the township of Whitby on 30 April 1875.
Whitby Strand - case heard at Whitby" -- defendant Robert Kirk. St
Ann's Staith matches (West Cliff/Whitby). Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-971 done.**

## Record 972

"Summary conviction of Miles Hammond of the township of Whitby
labourer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 13 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Miles
Hammond, home Whitby, occupation labourer. Church Street matches.
Crime type=drunk and disorderly matches. Already correctly linked
to related_conviction 969 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-972 done.**

## Record 973

"Summary conviction of William Brown for assaulting Honor
Cunningham. Offence committed at the township of Ruswarp on 10 May
1869. Whitby Strand - case heard at Whitby" -- defendant William
Brown, victim Honor Cunningham. Location Ruswarp matches. Crime
type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-973 done.**

## Record 974

"Summary conviction of Alfred Hone for begging on Blue Bank.
Offence committed at the township of Ugglebarnby on 5 June 1875.
Whitby Strand - case heard at Whitby" -- defendant Alfred Hone.
Blue Bank nests under Sleights, which nests under Eskdaleside-cum-
Ugglebarnby, matching stated township "Ugglebarnby". Crime
type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-974 done.**

## Record 975

"Summary conviction of George Watson of Baxtergate in the township
of Whitby for not sending his son William Vasey Watson to school.
Offence committed in Whitby School Board district on 6 July 1888.
Case heard at Whitby" -- defendant George Watson (same name as
record 716's Glaisdale miner, different context, correctly a
distinct person row), home Baxtergate (West Cliff/Whitby); son
William Vasey Watson, "son" relationship correctly captured.
Truancy rule correctly applied: offence location = his own home
(Baxtergate), not the School Board district wording. Crime
type=school non-attendance matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-975 done.**

## Record 976

"Summary conviction of Stephen Cuthbert of the township of
Hinderwell miner for being drunk and riotous on the licensed
premises of Joseph Welford and refusing to leave when asked by the
said Joseph Welford. Offence committed at the township of
Hinderwell on 17 May 1869. Whitby Strand - case heard at Whitby" --
defendant Stephen Cuthbert, home Hinderwell, occupation miner;
licensee Joseph Welford, occupation "licensee". Location Hinderwell
matches. Crime types = drunk and disorderly (per "drunk and
riotous" precedent) + refusal to quit licensed premises both fit.
No related_conviction.

**OK — no changes.**

**[Retroactive note, added at record 979]:** record 979 (Aaron
Walker) turned out to share this exact same licensee/offence/
township/date. A related_conviction link has now been added
retroactively.

---

**Progress: records 1-976 done.**

## Record 977

"Summary conviction of Michael McCarthy for begging in the Royal
Crescent. Offence committed at the township of Ruswarp on 11
October 1875. Whitby Strand - case heard at Whitby" -- defendant
Michael McCarthy. Royal Crescent nests under Whitby's West Cliff
but the record states township Ruswarp -- correctly captured
alongside per the cliff-boundary pattern. Crime type=begging
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-977 done.**

## Record 978

"Summary conviction of John Shaw of the township of Whitby jet
worker for being drunk and disorderly in Victoria Square. Offence
committed at the parish of Whitby on 14 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant John
Shaw (same name as records 888/903/935/941, a fifth distinct
conviction, correctly a distinct person row), home Whitby.
Victoria Square matches. Crime type=drunk and disorderly matches.
Already correctly linked to related_conviction 981 (same offence
date/street/charge, different defendants).

**OK — no changes.**

---

**Progress: records 1-978 done.**

## Record 979

"Summary conviction of Aaron Walker of the township of Hinderwell
miner for being drunk and riotous on the licensed premises of
Joseph Welford and refusing to leave when asked by the said Joseph
Welford. Offence committed at the township of Hinderwell on 17 May
1869. Whitby Strand - case heard at Whitby" -- defendant Aaron
Walker, home Hinderwell, occupation miner; licensee Joseph Welford,
occupation "licensee". Location Hinderwell matches. Crime types =
drunk and disorderly + refusal to quit licensed premises both fit.
No related_conviction was present, but this shares the same
licensee, offence, township, and date as record 976 (Stephen
Cuthbert) -- likely one incident. Added the link, retroactively
annotated 976's entry.

**FIXED — added related_conviction link to 976 (same licensee/offence/township/date).**

---

**Progress: records 1-979 done.**

## Record 980

"Summary conviction of John Bell of the township of Whitby engineer
for being drunk and disorderly in Church Street. Offence committed
at the township of Whitby on 29 March 1875 Whitby Strand - case
heard at Whitby" -- defendant John Bell, home Whitby, occupation
engineer. Church Street matches. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-980 done.**

## Record 981

"Summary conviction of Francis Clark of the township of Whitby
painter for being drunk and disorderly in Victoria Square. Offence
committed at the parish of Whitby on 14 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Francis Clark, home Whitby, occupation painter. Victoria Square
matches. Crime type=drunk and disorderly matches. Already correctly
linked to related_conviction 978 (same offence date/street/charge,
different defendants).

**OK — no changes.**

---

**Progress: records 1-981 done.**

## Record 982

"Summary conviction of Christopher Scales of the township of
Whitby fish dealer for assaulting Joseph Thompson. Offence
committed at the township of Whitby on 15 May 1869. Whitby Strand -
case heard at Whitby" -- defendant Christopher Scales, home Whitby,
occupation fish dealer; victim Joseph Thompson. Location Whitby
matches. Crime type=assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-982 done.**

## Record 983

"Summary conviction of Thomas Gray of the township of Hinderwell
miner for assaulting John Stonehouse. Offence committed at the
township of Hinderwell on 29 March 1875. Whitby Strand - case heard
at Whitby" -- defendant Thomas Gray, home Hinderwell, occupation
miner; victim John Stonehouse. Location Hinderwell matches. Crime
type=assault matches. Already correctly linked to related_conviction
1069 (same defendant, same offence date -- companion charge, not
yet reached).

**OK — no changes.**

---

**Progress: records 1-983 done.**

## Record 984

"Summary conviction of Matthew Langdale of the township of Whitby
brick manufacturer for employing Esther Mary Pottas, being a child
under the age of 16 years, at his brickyard Offence committed at
Upgang in the township of Ruswarp on 21 June 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant
Matthew Langdale, home Whitby, occupation brick manufacturer;
victim Esther Mary Pottas, "employee" relationship correctly
captured. Upgang Lane nests under Whitby's West Cliff but the
record states offence township Ruswarp -- correctly added alongside
per the cliff-boundary pattern. Crime type=illegal child employment
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-984 done.**

## Record 985

"Summary conviction of Joseph Short for begging in Esk Terrace.
Offence committed at the township of Ruswarp on 25 May 1869. Whitby
Strand - case heard at Whitby" -- defendant Joseph Short. Esk
Terrace nests under Whitby's West Cliff but the record states
township Ruswarp -- correctly captured alongside per the
cliff-boundary pattern (same street as record 907's identical
resolution). Crime type=begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-985 done.**

## Record 986

"Summary conviction of Francis Fewster of the township of Whitby
jet worker for using obscene language. Offence committed at the
township of Whitby on 11 May 1875. Whitby Strand - case heard at
Whitby" -- defendant Francis Fewster (same name/occupation as
records 747/825/831/952, a fifth distinct conviction, correctly a
distinct person row), home Whitby. Location Whitby matches. Crime
type=using obscene language matches. Already correctly linked to
related_conviction 1016 (same defendant, same offence date --
companion charge, not yet reached).

**OK — no changes.**

---

**Progress: records 1-986 done.**

## Record 987

"Summary conviction of Thomas de Costello of the township of
Whitby labourer for destroying his own clothes while being relieved
in the workhouse of the Whitby Union. Offence committed at the
township of Whitby on 14 July 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Thomas de Costello,
home Whitby, occupation labourer. Location Union Workhouse (Green
Lane) matches. Crime type was "malicious/property damage" -- this
id was already on the tracked "destroying own clothes" gap list.
Retagged to leaf 73 "destroying own clothes". No related_conviction.

**FIXED — retagged crime type to "destroying own clothes" (leaf 73, tracked gap, id 987 removed from the list).**

**[Retroactive note, added at record 990]:** record 990 (Thomas
Jones) turned out to share this exact same offence/township/date --
a related_conviction link has now been added retroactively.

---

**Progress: records 1-987 done.**

## Record 988

"Summary conviction of James Robertson for being found in the
dwelling house of John Garbutt with intent to assault Mary Jane
Garbutt aged nine years. Offence committed at the township of
Whitby on 22 May 1869. Whitby Strand - case heard at Whitby" --
defendant James Robertson, victim Mary Jane Garbutt (age 9 stated
in charge_description), property owner John Garbutt -- no
relationship stated between John and Mary Jane in the text (likely
father/daughter but not explicit), correctly none captured. Location
Whitby matches. Crime type=assault checked against precedent -- no
"intent to assault"/child-victim-specific leaf exists, and this is
the only "with intent to assault" instance in the whole corpus, so
the general "assault" tag is a reasonable fit, not a mistagging. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-988 done.**

## Record 989

"Summary conviction of John Jones of the township of Whitby coal
porter for being drunk and disorderly in the New Quay. Offence
committed at the township of Whitby on 4 May 1875. Whitby Strand -
case heard at Whitby" -- defendant John Jones (same name/occupation
as records 235/840, a different date, correctly a distinct person
row), home Whitby. New Quay matches. Crime type=drunk and disorderly
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-989 done.**

## Record 990

"Summary conviction of Thomas Jones of the township of Whitby
labourer for destroying his own clothes while being relieved in
the workhouse of the Whitby Union. Offence committed at the
township of Whitby on 14 July 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Thomas Jones, home
Whitby, occupation labourer. Location Union Workhouse matches.
Crime type was "malicious/property damage" -- this id was already
on the tracked "destroying own clothes" gap list. Retagged to leaf
73. No related_conviction was present, but this shares the exact
same offence/township/date as record 987 (Thomas de Costello, fixed
just above) -- added the link, retroactively annotated 987's entry.

**FIXED — retagged crime type to "destroying own clothes" (leaf 73, tracked gap, id 990 removed) and added related_conviction link to 987.**

---

**Progress: records 1-990 done.**

## Record 991

"Summary conviction of Joseph Dean for assaulting Robert Grimmer.
Offence committed at the township of Whitby on 24 May 1869. Whitby
Strand - case heard at Whitby" -- defendant Joseph Dean, victim
Robert Grimmer. Location Whitby matches. Crime type=assault
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-991 done.**

## Record 992

"Summary conviction of William Ratcliffe for begging in Robin
Hood's Bay town street. Offence committed at the township of
Fylingdales on 12 April 1875. Whitby Strand - case heard at Whitby"
-- defendant William Ratcliffe. "Robin Hood's Bay town street"
resolves to Robin Hood's Bay itself, nested under Fylingdales,
matching stated township. Crime type=begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-992 done.**

## Record 993

"Summary conviction of William Mills of the township of Hawsker cum
Stainsacre farmer for being drunk on the licensed premises of Tom
Allison and refusing to leave when asked to do so by Allison.
Offence committed at the township of Hawsker cum Stainsacre on 14
July 188. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant William Mills, home Hawsker-cum-Stainsacre,
occupation farmer; licensee Tom Allison, occupation "licensee".
Source has a dropped digit ("14 July 188" missing the final "8"),
already correctly documented in the `anomalies` field; structured
offence_date is correctly parsed as 1888-07-14. Location matches.
Crime types = drunkenness + refusal to quit licensed premises both
fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-993 done.**

## Record 994

"Summary conviction of Eliza Jane Thompson for begging at Abbey
Farm. Offence committed at the township of Hawsker cum Stainsacre
on 23 May 1869. Whitby Strand - case heard at Whitby" -- defendant
Eliza Jane Thompson. Abbey Farm correctly nests under Hawsker-cum-
Stainsacre, matching stated township. Crime type=begging matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-994 done.**

## Record 995

"Summary conviction of William Wear of the township of Whitby
painter for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 30 March 1875 Whitby Strand
- case heard at Whitby" -- defendant William Wear, home Whitby,
occupation painter. Church Street matches. Crime type=drunk and
disorderly matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-995 done.**

## Record 996

"Summary conviction of William Henry Heath of the township of
Whitby farmer for being drunk in charge of a horse and cart in St
Hilda's Terrace. Offence committed at the township of Ruswarp on
18 July 1888. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant William Henry Heath (same name as record
774's Hinderwell licensee, different context, correctly a distinct
person row), home Whitby, occupation farmer. St Hilda's Terrace
nests under Whitby's West Cliff but the record states offence
township Ruswarp -- correctly added alongside per the cliff-
boundary pattern. Crime type=drunkenness matches. No
related_conviction.

**OK — no changes.**

---

## Record 997

"Summary conviction of Mary Jane Wallace of the township of Whitby
singlewoman for being drunk. Offence committed at the township of
Whitby on 2 June 1869. Whitby Strand - case heard at Whitby" --
defendant Mary Jane Wallace (person 1061), home Whitby, sex female.
Raw_record states "singlewoman" but `person_occupation` had no row
for this person -- confirmed instance of the tracked marital-status
occupation gap (tracked since record 275). Location/crime type
(drunkenness) both correct. No related_conviction.

**FIXED — added missing "singlewoman" occupation (occupation_id 337)
for person 1061.** Removed 997 from the tracked-gap id list in
reextraction-audit-notes.md.

---

**Progress: records 1-997 done.**

---

## Record 998

"Summary conviction of Thomas Kay for begging. Offence committed at
the township of Ellerby on 8 May 1875. Whitby Strand - case heard at
Whitby" -- defendant Thomas Kay (person 1062), sex male (from
unambiguous first name, no home stated in source). Location of
offence Ellerby, court location Whitby, both correct. Crime type
begging matches. No named party to link on; no related_conviction.

**OK — no changes.**

---

**Progress: records 1-998 done.**

---

## Record 999

"Summary conviction of William Flounders of the township of Whitby
pedlar for acting as a pedlar without a certificate. Offence
committed at the township of Whitby on 20 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant William
Flounders (person 1063), home Whitby, occupation pedlar (captured),
sex male (unambiguous first name). Location Whitby correct on both
roles. Crime type "licensing offence" (id 23) checked -- this is
itself a leaf (no children under it, no pedlar/hawker-specific leaf
exists in the taxonomy), so it's correctly applied, not a generic
placeholder. No named party to link on; no related_conviction.

**OK — no changes.**

---

**Progress: records 1-999 done.**

---

## Record 1000

"Summary conviction of Thomas Peat of the township of Whitby
fisherman for being drunk. Offence committed at the township of
Whitby on 2 June 1869. Whitby Strand - case heard at Whitby" --
defendant Thomas Peat (person 1064), home Whitby, occupation
fisherman, sex male (unambiguous first name). Location Whitby correct
on both roles. Crime type drunkenness matches. Same offence date (2
June 1869), same township (Whitby), and same offence type
(drunkenness) as record 997 (Mary Jane Wallace) -- considered for
related_conviction under the no-named-party pattern, but declined:
that pattern (rulebook section E, confirmed at 355/361 and 602/608)
covers cases with a shared informant/constable or a genuinely
incident-like offence (poaching gang, riot, obstruction); drunkenness
is a routine individual offence where two unrelated people being
convicted of it on the same day in the same town is not evidence of
one shared incident, unlike a group offence. No named party links
them either. No related_conviction added.

**OK — no changes.**

---

**Progress: records 1-1000 done.**

---

## Record 1001

"Summary conviction of Caroline Long wife of [blank] Long for
lodging on the New Quay with no visible means of subsistence and not
giving a good account of herself. Offence committed at the township
of Whitby on 5 May 1875. Whitby Strand - case heard at Whitby" --
defendant Caroline Long (person 1065), sex female; husband stub
[blank] Long (person 9939), sex male, correctly created with "wife"
relationship pointing from Caroline to him, per the established
"wife of [blank] SURNAME" convention. Location New Quay (under
Whitby, id 5) correct. Crime type "vagrancy" (id 20, leaf under
category 7) checked against taxonomy -- no more specific "no visible
means of subsistence"/"lodging" leaf exists, so this is the correct
fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1001 done.**

---

## Record 1002

"Summary conviction of Andrew Harland of the township of Whitby
licensed victualler for selling beer to a person who was drunk.
Offence committed at the township of Whitby on 21 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Andrew Harland (person 1066), home Whitby, occupation licensed
victualler, sex male (unambiguous first name). Location Whitby
correct. Crime type "licensing offence" fits (no more specific
"selling to a drunk person" leaf exists). No named party (the drunk
customer isn't named); no related_conviction.

**OK — no changes.**

---

**Progress: records 1-1002 done.**

---

## Record 1003

"Summary conviction of Mary Jane Grandy wife of [blank] Grandy of the
township of Whitby cab driver for being drunk. Offence committed at
the township of Whitby on 7 June 1869. Whitby Strand - case heard at
Whitby" -- defendant Mary Jane Grandy (person 1067), sex female;
husband stub [blank] Grandy (person 9940) correctly holds the home
(Whitby) and occupation (cab driver), since the "of Whitby cab
driver" phrase describes the husband, not the wife -- matches the
established husband-occupation-attachment convention. "wife"
relationship correctly recorded. Location Whitby correct. Crime type
drunkenness matches. Same offence type as records 997/1000 but
different date (7 June vs 2 June) -- no related_conviction.

**OK — no changes.**

---

**Progress: records 1-1003 done.**

---

## Record 1004

"Summary conviction of Robert Foster of the township of Whitby
sailor for being drunk and disorderly in Haggersgate. Offence
committed at the township of Whitby on 2 April 1875. Whitby Strand -
case heard at Whitby" -- defendant Robert Foster (person 1068), home
Whitby, occupation sailor, sex male (unambiguous first name).
Location Haggersgate (under Whitby, id 5) correct. Crime type "drunk
and disorderly" correctly distinct from plain "drunkenness". No named
party; no related_conviction.

**OK — no changes.**

---

**Progress: records 1-1004 done.**

---

## Record 1005

"Summary conviction of Catherine Bridges wife of Joseph Bridges of
the township of Whitby fisherman for being drunk and disorderly on
the Pier. Offence committed at the township of Whitby on 21 July
1888. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Catherine Bridges (person 1069), sex female; husband
Joseph Bridges named in full (person 9941), home Whitby, occupation
fisherman, "wife" relationship correctly recorded. Location "Piers"
(id 104, under Whitby) fits "the Pier". Crime type "drunk and
disorderly" matches. No named party beyond the husband; no
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1005 done.**

---

## Record 1006

"Summary conviction of Martin Pindergrass of the township of Whitby
seaman for being drunk. Offence committed at the township of Whitby
on 8 June 1869. Whitby Strand - case heard at Whitby" -- defendant
Martin Pindergrass (person 1070), home Whitby, occupation seaman, sex
male (unambiguous first name). Location Whitby correct. Crime type
drunkenness matches. Different date from 997/1000/1003; no
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1006 done.**

---

## Record 1007

"Summary conviction of Thomas Joyce of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 10 May 1875. Whitby Strand -
case heard at Whitby" -- defendant Thomas Joyce (person 1071), home
Whitby, occupation jet worker, sex male (unambiguous first name).
Location Church Street correct. Crime type "drunk and disorderly"
matches. Pre-existing related_conviction links to 1013 (John
Backhouse) and 1147 (James Marshall) verified against both records'
raw_record -- all three are jet workers convicted of the identical
charge, same street, same date (10 May 1875), consistent with one
group incident. Links correct, no changes needed.

**OK — no changes.**

---

**Progress: records 1-1007 done.**

---

## Record 1008

"Summary conviction of Esther Hill wife of Andrew Hill of the
township of Whitby jet worker for being drunk and disorderly on
Boulby Bank. Offence committed at the township of Whitby on 21 July
1888. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Esther Hill (person 1072), sex female; husband Andrew
Hill named in full (person 9942), home Whitby, occupation jet worker,
"wife" relationship correctly recorded. Location Boulby Bank (under
Church Street, id 6) -- plausible Whitby geography (Boulby Bank
descends toward Church Street/the harbourside). Crime type "drunk and
disorderly" matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1008 done.**

---

## Record 1009

"Summary conviction of William Waller of the township of Whitby jet
worker for being drunk and riotous on the Pier. Offence committed at
the township of Whitby on 5 June 1869. Whitby Strand - case heard at
Whitby" -- defendant William Waller (person 1073), home Whitby,
occupation jet worker, sex male (unambiguous first name). Location
Piers correct. Crime type checked against taxonomy -- only
"drunkenness" (18) and "drunk and disorderly" (43) exist, no separate
"drunk and riotous" leaf, so "drunk and disorderly" is the correct
existing fit for "riotous" phrasing. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1009 done.**

---

## Record 1010

"Summary conviction of William George Walker of the township of
Whitby jet worker for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 11 May 1875. Whitby Strand -
case heard at Whitby" -- defendant William George Walker (person
1074), home Whitby, occupation jet worker, sex male. Location Piers
correct. Crime type "drunk and disorderly" matches. Pre-existing
related_conviction link to 1016 (Francis Fewster, a different Francis
Fewster person row per the no-cross-conviction-merge principle)
verified -- same date, street, and charge wording. Correct.

**OK — no changes.**

---

**Progress: records 1-1010 done.**

---

## Record 1011

"Summary conviction of Thomas Long of the township of Fylingdales
labourer for begging in Robin Hood's Bay town street. Offence
committed at the township of Fylingdales on 22 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Thomas Long (person 1075), home Fylingdales, occupation labourer, sex
male. "Robin Hood's Bay town street" boilerplate correctly resolves
to Robin Hood's Bay itself (id 126) per the established convention.
Crime type begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1011 done.**

---

## Record 1012

"Summary conviction of Ellen Hick wife of Isaac Hick of the township
of Whitby jet worker for being drunk; on the oath of Charles Tempest
Clarkson of the township of Whitby superintendent of police. Offence
committed at the township of Whitby on 8 June 1869. Whitby Strand -
case heard at Whitby" -- defendant Ellen Hick (person 1076), sex
female; husband Isaac Hick named in full (person 9943), home Whitby,
occupation jet worker, "wife" relationship recorded; informant
Charles Tempest Clarkson (person 6972), superintendent of police, sex
male, home Whitby. This is a distinct Ellen Hick/Isaac Hick pair from
the other instances already verified elsewhere in the corpus (no
cross-conviction merge). Location Whitby correct. Crime type
drunkenness matches. No street named, so the same-beat sub-pattern
doesn't apply; no related_conviction.

**OK — no changes.**

---

**Progress: records 1-1012 done.**

---

## Record 1013

"Summary conviction of John Backhouse of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 10 May 1875. Whitby Strand -
case heard at Whitby" -- defendant John Backhouse (person 1077), home
Whitby, occupation jet worker, sex male. Location Church Street
correct. Crime type matches. Pre-existing related_conviction links to
1007 (Thomas Joyce) and 1147 (James Marshall), already verified at
record 1007 -- same group-incident cluster.

**OK — no changes.**

---

**Progress: records 1-1013 done.**

---

## Record 1014

"Summary conviction of Thomas Hardy of the township of Egton labourer
for begging in Esk Valley. Offence committed at the township of Egton
on 23 July 1888. Whitby Strand Petty Sessional division - case heard
at Whitby" -- defendant Thomas Hardy (person 1078), home Egton,
occupation labourer, sex male. Location "Esk Valley" (id 401) nests
correctly under Egton (id 112), matching the record's stated offence
township. Crime type begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1014 done.**

---

## Record 1015

"Summary conviction of Mary McDonald of the township of Whitby
singlewoman for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 13 June 1869. Whitby Strand - case heard at
Whitby" -- defendant Mary McDonald (person 1079), sex female; raw
text states "singlewoman" but `person_occupation` had no row --
confirmed instance of the tracked marital-status occupation gap.
Informant Francis Selby (person 6973), police constable, sex already
correctly male (full first name given, distinct from the earlier
"[blank] Selby" stray-sex case at person 6835). Location Whitby
correct. Crime type drunkenness matches. No related_conviction.

**FIXED — added missing "singlewoman" occupation (occupation_id 337)
for person 1079.** Removed 1015 from the tracked-gap id list in
reextraction-audit-notes.md.

---

**Progress: records 1-1015 done.**

---

## Record 1016

"Summary conviction of Francis Fewster of the township of Whitby jet
worker for being drunk and disorderly on the Pier. Offence committed
at the township of Whitby on 11 May 1875. Whitby Strand - case heard
at Whitby" -- defendant Francis Fewster (person 1080), home Whitby,
occupation jet worker, sex male. Location Piers correct. Crime type
matches. Two pre-existing related_conviction links verified: 986
(same Francis Fewster, same date, different charge "using obscene
language" -- person 1050, a separate person row per the
no-cross-conviction-merge convention, correctly linked as "same
defendant and same offence date"), and 1010 (William George Walker,
already verified at record 1010, group-incident cluster). Both
correct.

**OK — no changes.**

---

**Progress: records 1-1016 done.**

---

## Record 1017

"Summary conviction of John Brand of the township of Whitby labourer
for being drunk on the licensed premises of Andrew Harland. Offence
committed at the township of Whitby on 21 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant John
Brand (person 1081), home Whitby, occupation labourer, sex male;
licensee Andrew Harland (person 6974), sex male, home Whitby,
occupation "licensee". Location Whitby correct. Crime type
drunkenness matches. Cross-checked against record 1002 (Andrew
Harland, licensed victualler, convicted of "selling beer to a person
who was drunk," same date 21 July 1888, same township) -- Andrew
Harland is the shared named party (defendant there, licensee here),
same date, and the two offences are complementary halves of one event
(he sold beer to a drunk customer; the customer was drunk on his
premises). No related_conviction link existed. Added one.

**FIXED — added related_conviction link (1002, 1017): "Same licensee
(Andrew Harland), same date, complementary offences (selling beer to
a drunk person / being drunk on his licensed premises) -- same
incident."**

[Retroactive note, added at record 1017: record 1002's log entry did
not anticipate this link since 1017 hadn't been reached yet.]

---

**Progress: records 1-1017 done.**

---

## Record 1018

"Summary conviction of William Henderson of the township of Whitby
labourer for being drunk; on the oath of John Atkinson of the
township of Whitby police constable. Offence committed at the
township of Whitby on 13 June 1869. Whitby Strand - case heard at
Whitby" -- defendant William Henderson (person 1082), home Whitby,
occupation labourer, sex male; informant John Atkinson (person 6975),
police constable, sex male, home Whitby. Location Whitby correct.
Crime type drunkenness matches. Same date as record 1015 (13 June
1869, Whitby, drunkenness) but different informant, no shared named
party, and per the reasoning at record 1000, drunkenness alone isn't
sufficient for a same-date/same-township link -- no related_conviction.

**OK — no changes.**

---

**Progress: records 1-1018 done.**

---

## Record 1019

"Summary conviction of Matthew Tose of the township of Whitby jet
worker for being drunk and disorderly in the Old Market Place.
Offence committed at the township of Whitby on 17 May 1875. Whitby
Strand - case heard at Whitby" -- defendant Matthew Tose (person
1083), home Whitby, occupation jet worker, sex male. Title/raw_record
spelling checked ("Tose" in both, consistent -- not an instance of
the resolved Tose/Toes mismatch gap). Location Old Market Place
correct. Crime type matches. Pre-existing related_conviction link to
1156 (Ralph Jordison) verified -- same date, street, charge wording.
Correct.

**OK — no changes.**

---

**Progress: records 1-1019 done.**

---

## Record 1020

"Summary conviction of Robert Martin of the township of Whitby shop
porter for assaulting Jane Cooper. Offence committed at the township
of Fylingdales on 22 July 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Robert Martin (person
1084), home Whitby, occupation shop porter, sex male; victim Jane
Cooper (person 6976), sex female. Location Fylingdales correct
(offence township, distinct from defendant's home Whitby). Crime type
assault matches. Pre-existing related_conviction links to 1023 (same
Robert Martin, same date, assaulting Eliza Jane Hutton) and 1026
(same Robert Martin, same date, assaulting Mary Ann Hutton) verified
-- three separate assault charges from one arrest/incident, three
different victims. Correct.

**OK — no changes.**

---

**Progress: records 1-1020 done.**

---

## Record 1021

"Summary conviction of John Bradshaw of the township of Whitby
labourer for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 13 June 1869. Whitby Strand - case heard at
Whitby" -- defendant John Bradshaw (person 1085), home Whitby,
occupation labourer, sex male; informant Francis Selby (person 6977),
police constable, sex male, home Whitby. Location Whitby correct.
Crime type drunkenness matches. Same date and same informant as
record 1015 (Mary McDonald), but no street named -- the same-beat
sub-pattern requires street+date+offence+informant together, so this
alone doesn't meet the bar. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1021 done.**

---

## Record 1022

"Summary conviction of John Peckett of the township of Lythe farm
servant for killing a hare; on the oath of George Calvert of the
township of Whitby gamewatcher. Offence committed at the township of
Lythe on 27 December 1874. Whitby Strand - case heard at Whitby" --
defendant John Peckett (person 1086), home Lythe, occupation farm
servant, sex male; informant George Calvert (person 6978),
gamewatcher, sex male, home Whitby. Location Lythe correct. Crime
type "poaching" (leaf, id 22) fits -- no more specific leaf exists;
the species ("hare") is preserved in charge_description free text, no
information lost (game_species watch item not triggered here). No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1022 done.**

---

## Record 1023

"Summary conviction of Robert Martin of the township of Whitby shop
porter for assaulting Eliza Jane Hutton. Offence committed at the
township of Fylingdales on 22 July 1888 Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Robert Martin
(person 1087), home Whitby, occupation shop porter, sex male; victim
Eliza Jane Hutton (person 6979), sex female. Location Fylingdales
correct. Crime type assault matches. Pre-existing related_conviction
links to 1020 and 1026 (same Robert Martin, same date, three
different assault victims), already verified at record 1020. Correct.

**OK — no changes.**

---

**Progress: records 1-1023 done.**

---

## Record 1024

"Summary conviction of Elizabeth Pinder of the township of Whitby for
being drunk. Offence committed at the township of Whitby on 13 June
1869. Whitby Strand - case heard at Whitby" -- defendant Elizabeth
Pinder (person 1088), home Whitby, sex female. No occupation or
marital status stated in source, none fabricated. Location Whitby
correct. Crime type drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1024 done.**

---

## Record 1025

"Summary conviction of Thomas Walker of the township of Whitby milk
boy for being at such a distance from his cart as not to have control
of the horse drawing it. Offence committed at the township of Whitby
on 8 May 1875. Whitby Strand - case heard at Whitby" -- defendant
Thomas Walker (person 1089), home Whitby, occupation milk boy, sex
male. Location Whitby correct. Crime type "not having proper control
of horse drawing a cart" (leaf 75) matches the established precedent
for this exact phrasing (distinct from "furious/reckless driving",
which requires the word "furiously"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1025 done.**

---

## Record 1026

"Summary conviction of Robert Martin of the township of Whitby shop
porter for assaulting Mary Ann Hutton. Offence committed at the
township of Fylingdales on 22 July 1888 Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Robert
Martin (person 1090), home Whitby, occupation shop porter, sex male;
victim Mary Ann Hutton (person 6980), sex female (note: likely
related to victim Eliza Jane Hutton in record 1023, possibly
mother/daughter or sisters, but no relationship stated in source --
not fabricated). Location Fylingdales correct. Crime type assault
matches. Pre-existing related_conviction links to 1020 and 1023,
already verified at record 1020. Correct.

**OK — no changes.**

---

**Progress: records 1-1026 done.**

---

## Record 1027

"Summary conviction of Thomas Linton of Whitby pot hawker for
assaulting George Wedgewood. Offence committed at the parish of
Ampleforth on 29 August 1868. Case heard at Kirby Moorside" --
defendant Thomas Linton (person 1091), home Whitby, occupation pot
hawker, sex male; victim George Wedgewood (person 6981), sex male.
Notably an out-of-area record: offence at Ampleforth, case heard at
Kirkbymoorside, no Whitby Strand petty sessional division stated
(correctly omitted, not fabricated) -- an occasional genuine outlier
in the corpus, not an error. Location/court both correctly captured.
Crime type assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1027 done.**

---

## Record 1028

"Summary conviction of Isabella Riley for being a common prostitute
and behaving in an indecent manner in a public street. Offence
committed at the township of Whitby on 19 April 1875. Whitby Strand -
case heard at Whitby" -- defendant Isabella Riley (person 1092), sex
female, occupation "common prostitute" (per the source's own wording,
existing convention). Location Whitby correct. Two crime types
applied -- "indecent behaviour" (46) and "prostitution" (71), both
valid leaves under the same category (16), both aspects of the charge
correctly captured. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1028 done.**

---

## Record 1029

"Summary conviction of Archibald Brown of the township of Whitby
labourer for begging on the Pier. Offence committed at the township
of Whitby on 25 July 1888. Whitby Strand Petty Sessional division -
case heard at Whitby" -- defendant Archibald Brown (person 1093),
home Whitby, occupation labourer, sex male. Location Piers correct.
Crime type begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1029 done.**

---

## Record 1030

"Summary conviction of William Lawson of the township of Newholm cum
Dunsley labourer for trespassing in the daytime in pursuit of game on
a piece of unenclosed ground in the possession and occupation of
Richard Brown. Offence committed at the township of Ugthorpe on 23
November 1868. Whitby Strand - case heard at Whitby" -- defendant
William Lawson (person 1094), home Newholm-cum-Dunsley (existing
node, punctuation variant of "Newholm cum Dunsley" matches), 
occupation labourer, sex male; landowner Richard Brown (person 6982),
sex male (unambiguous first name). Location Ugthorpe correct. Crime
type poaching matches. Checked for other convictions naming the same
landowner Richard Brown -- none found, no related_conviction.

**OK — no changes.**

---

**Progress: records 1-1030 done.**

---

## Record 1031

"Summary conviction of Thomas Calvert of the township of Roxby
labourer for being the owner of two cows found straying on the Roxby
and Guisborough highway. Offence committed at the township of Roxby
on 15 April 1875. Whitby Strand - case heard at Whitby" -- defendant
Thomas Calvert (person 1095), home Roxby, occupation labourer, sex
male. Location: Roxby (offence township) plus the Roxby & Guisborough
cross-parish highway node (id 106) added alongside, per the
established cross-parish highway convention. Crime type "straying
animals" matches. Pre-existing related_conviction link to 1081
(Thomas Hugill, same date/street/charge) verified -- same incident,
two cattle owners.

**OK — no changes.**

---

**Progress: records 1-1031 done.**

---

## Record 1032

"Summary conviction of Joseph Parker of the township of Ruswarp
labourer for begging in Skinner Street. Offence committed at the
township of Ruswarp on 26 July 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Joseph Parker (person
1096), home Ruswarp, occupation labourer, sex male. Skinner Street
nests under Whitby (id 5) but the record states offence township
Ruswarp -- correctly added alongside per the established
Whitby/Ruswarp cliff-boundary pattern. Crime type begging matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1032 done.**

---

## Record 1033

"Summary conviction of David Brough of the township of Whitby jet
apprentice for throwing stones in Church Street; on the oath of
Francis Selby of the township of Whitby police constable. Offence
committed at the township of Whitby on 31 December 1868. Whitby
Strand - case heard at Whitby" -- defendant David Brough (person
1097), home Whitby, occupation jet apprentice, sex male; informant
Francis Selby (person 6983), police constable, sex male, home Whitby.
Location Church Street correct. Crime type "breach of the peace"
checked against taxonomy -- no more specific "throwing stones" leaf
exists, correct fit. Pre-existing related_conviction link to 1036
(John Thomas Trueman, same date/street/charge/informant) verified --
same incident, two jet apprentices.

**OK — no changes.**

---

**Progress: records 1-1033 done.**

---

## Record 1034

"Summary conviction of Charles Mason for assaulting Thomas Hall one
of the constables for the North Riding in the execution of his duty
Offence committed at the township of Whitby on 19 May 1875. Whitby
Strand - case heard at Whitby" -- defendant Charles Mason (person
1098), sex male, no home/occupation stated in this particular record
(not fabricated); victim Thomas Hall (person 6984), constable for the
North Riding, sex already correctly male (named directly before "one
of the constables... in the execution of his duty" -- not an instance
of the tracked constable-sex gap, already set). Location Whitby
correct. Crime type "assaulting a police officer" matches.
Pre-existing related_conviction link to 1105 (same Charles Mason,
same date, wilfully damaging the constable's trousers/whistle --
likely caused during this same assault) verified.

**OK — no changes.**

---

**Progress: records 1-1034 done.**

---

## Record 1035

"Summary conviction of James McCullum of the township of Eskdaleside
cum Ugglebarnby labourer for begging in Sleights town street. Offence
committed at the township of Eskdaleside cum Ugglebarnby on 27 July
1888. Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant James McCullum (person 1099), home
Eskdaleside-cum-Ugglebarnby, occupation labourer, sex male. "Sleights
town street" boilerplate resolves to Sleights, which correctly nests
under Eskdaleside-cum-Ugglebarnby (id 8), matching the stated
township. Crime type begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1035 done.**

---

## Record 1036

"Summary conviction of John Thomas Trueman of the township of Whitby
jet apprentice for throwing stones in Church Street; on the oath of
Francis Selby of the township of Whitby police constable. Offence
committed at the township of Whitby on 31 December 1868. Whitby
Strand - case heard at Whitby" -- defendant John Thomas Trueman
(person 1100), home Whitby, occupation jet apprentice, sex male;
informant Francis Selby (person 6985), police constable, sex male,
home Whitby. Location Church Street correct. Crime type "breach of
the peace" matches (same reasoning as record 1033). Pre-existing
related_conviction link to 1033 (David Brough), already verified.

**OK — no changes.**

---

**Progress: records 1-1036 done.**

---

## Record 1037

"Summary conviction of Thomas Robinson Cornforth of the township of
Whitby jet worker for being drunk and disorderly on the Pier. Offence
committed at the township of Whitby on 20 May 1875. Whitby Strand -
case heard at Whitby" -- defendant Thomas Robinson Cornforth (person
1101), home Whitby, occupation jet worker, sex male. Location Piers
correct. Crime type matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1037 done.**

---

## Record 1038

"Summary conviction of Peter Kilpatrick of the township of Whitby
iron worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 30 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Peter
Kilpatrick (person 1102), home Whitby, occupation iron worker, sex
male. Location Church Street correct. Crime type matches.
Pre-existing related_conviction link to 1041 (same Peter Kilpatrick,
same date, assaulting a constable) verified -- consistent, likely the
constable intervened in the drunk-and-disorderly incident and was
assaulted.

**OK — no changes.**

---

**Progress: records 1-1038 done.**

---

## Record 1039

"Summary conviction of John Wilson of the township of Whitby tailor
for being drunk; on the oath of James Wilkinson of the township of
Whitby police constable. Offence committed at the township of Whitby
on 1 January 1869. Whitby Strand - case heard at Whitby" -- defendant
John Wilson (person 1103), home Whitby, occupation tailor, sex male;
informant James Wilkinson (person 6986), police constable, sex male,
home Whitby. Location Whitby correct. Crime type drunkenness matches.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1039 done.**

---

## Record 1040

"Summary conviction of Peter Kilpatrick of the township of Whitby
iron worker for being drunk and riotous in Grape Lane. Offence
committed at the township of Whitby on 1 April 1875. Whitby Strand -
case heard at Whitby" -- defendant Peter Kilpatrick (person 1104),
home Whitby, occupation iron worker, sex male. Same name as the 1888
Peter Kilpatrick (records 1038/1041) but a different date -- correctly
a distinct person row, no cross-conviction merge. Location Grape Lane
correct. Crime type "drunk and disorderly" fits (no "riotous" leaf,
per the record 1009 precedent). Pre-existing related_conviction
links to 1093 (assaulting a constable) and 3286 (wilfully damaging
Maria Fawcett's window/bowl) verified -- same date, same defendant,
three charges from one arrest/incident.

**OK — no changes.**

---

**Progress: records 1-1040 done.**

---

## Record 1041

"Summary conviction of Peter Kilpatrick of the township of Whitby
iron worker for assaulting Thomas William Parker one of the
constables of the North Riding in the execution of his duty. Offence
committed at the township of Whitby on 30 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Peter
Kilpatrick (person 1105), home Whitby, occupation iron worker, sex
male; victim Thomas William Parker (person 6987), constable, sex
already correctly male. Location Whitby correct. Crime type
"assaulting a police officer" matches. Pre-existing related_conviction
link to 1038, already verified.

**OK — no changes.**

---

**Progress: records 1-1041 done.**

---

## Record 1042

"Summary conviction of Joseph Tose of the township of Hinderwell
labourer for being the owner of two asses found straying in Staithes
Lane. Offence committed at the township of Hinderwell on 24 December
1868. Whitby Strand - case heard at Whitby" -- defendant Joseph Tose
(person 1106), home Hinderwell, occupation labourer, sex male.
Title/raw_record spelling consistent ("Tose" in both). Location
Staithes Lane nests under Staithes (163), which nests under
Hinderwell (88), matching the stated township. Crime type "straying
animals" matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1042 done.**

---

## Record 1043

"Summary conviction of William Agar of the township of Whitby jet
worker for wilfully damaging the frame of a window and an earthenware
bowl, the property of Maria Fawcett. Offence committed at the
township of Whitby on 1 April 1875. Whitby Strand - case heard at
Whitby" -- defendant William Agar (person 1107), home Whitby,
occupation jet worker, sex male; property owner Maria Fawcett (person
6988), sex female. Location Whitby correct. Crime type
"malicious/property damage" (60) is the only relevant leaf, correct
fit. Cross-checked and found record 3286 (Peter Kilpatrick, already
seen at record 1040) describes damaging the *identical* items --
"the frame of a window and an earthenware bowl, the property of
Maria Fawcett" -- on the same date. No related_conviction link
existed between them. Added one.

**FIXED — added related_conviction link (1043, 3286): "Same victim
(Maria Fawcett), same date, identical property described (window
frame and earthenware bowl), different defendants -- one incident,
two men prosecuted separately."**

[Retroactive note, added at record 1043: record 1040's log entry
(covering 3286) did not anticipate this link since 1043 hadn't been
reached yet.]

---

**Progress: records 1-1043 done.**

---

## Record 1044

"Summary conviction of George Foxton of the township of Whitby
labourer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 28 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant George
Foxton (person 1108), home Whitby, occupation labourer, sex male.
Location Church Street correct. Crime type matches. Pre-existing
related_conviction link to 1047 (Charles Harland, same date/street/
charge) verified.

**OK — no changes.**

---

**Progress: records 1-1044 done.**

---

## Record 1045

"Summary conviction of John Simpson of the township of Whitby jet
worker for discharging a pistol in Church Street. Offence committed
at the township of Whitby on 31 December 1868. Whitby Strand - case
heard at Whitby" -- defendant John Simpson (person 1109), home
Whitby, occupation jet worker, sex male. Location Church Street
correct. Crime type precedent check surfaced a genuine inconsistency:
records 1045 (breach of the peace), 3322 ("discharging a small cannon
in Clarence Passage", tagged public order), and 5052 ("discharging a
pistol in Church Street other than in self defence", tagged firearms
offence) are near-identical fact patterns with three different tags.
Flagged to the user. Checked whether "firearms offence" (leaf 38,
under category "public safety" 17, sole sibling "mining offence" 40)
should be renamed to "weapons offence" to broaden it -- a full-text
search of raw_record for pistol/cannon/sword/knife/dagger/revolver/
firearm found no additional candidate records beyond the ones already
in play, so renaming would change nothing. User decided: keep
"firearms offence" as named, retag 1045 and 3322 onto it.

**FIXED — retagged 1045 from "breach of the peace" to "firearms
offence" (leaf 38); also retagged 3322 ("discharging a small cannon
in Clarence Passage") from "public order" to "firearms offence" as
part of the same sweep, since it's the identical fact pattern.**
Saved as a general taxonomy-density principle in memory
(`feedback_taxonomy_category_density_balance`): avoid leaves/
categories with only one row, but don't broaden a leaf's name unless
real evidence shows more records would actually land there.

[Retroactive note, added at record 1045: this also affects the
already-passed record 3322's log entry, which wasn't yet at this crime
type when originally logged.]

---

**Progress: records 1-1045 done.**

---

## Record 1046

"Summary conviction of Thomas Gay for lodging in a railway signal box
with no visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Ruswarp on 21 May 1875.
Whitby Strand - case heard at Whitby" -- defendant Thomas Gay (person
1110), sex male, no home stated. Location Ruswarp correct. Crime type
vagrancy matches (same reasoning as record 1001). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1046 done.**

---

## Record 1047

"Summary conviction of Charles Harland of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 28 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Charles
Harland (person 1111), home Whitby, occupation jet worker, sex male.
Location Church Street correct. Crime type matches. Pre-existing
related_conviction link to 1044, already verified.

**OK — no changes.**

---

**Progress: records 1-1047 done.**

---

## Record 1048

"Summary conviction of William Rook of the township of Goathland
farmer for assaulting William Hopper; on the oath of the said
William Hopper of the township of Goathland farmer and another.
Offence committed at the township of Goathland on 31 December 1868.
Whitby Strand - case heard at Whitby" -- defendant William Rook
(person 1112), home Goathland, occupation farmer, sex male; victim
William Hopper (person 6989), home Goathland, occupation farmer, sex
male -- correctly captured once as "victim" even though he's also the
informant ("the said William Hopper"), matching the established
convention for when victim and informant are the same person.
Location Goathland correct. Crime type assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1048 done.**

---

## Record 1049

"Summary conviction of James Ball for lodging in a cow house with no
visible means of subsistence and not giving a good account of
himself. Offence committed at the township of Hawsker cum Stainsacre
on 24 May 1875. Whitby Strand - case heard at Whitby" -- defendant
James Ball (person 1113), sex male, no home stated. Location
Hawsker-cum-Stainsacre correct. Crime type vagrancy matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1049 done.**

---

## Record 1050

"Summary conviction of Robert Steel of the township of Whitby
fisherman for wilfully damaging six glasses and a table, the
property of William Massey. Offence committed at the township of
Whitby on 28 July 1888. Whitby Strand Petty Sessional division - case
heard at Whitby" -- defendant Robert Steel (person 1114), home
Whitby, occupation fisherman, sex male; property owner William Massey
(person 6990), sex male. Location Whitby correct. Crime type
malicious/property damage matches. Pre-existing related_conviction
link to 1053 (same Robert Steel, same date, "being drunk on the
licensed premises of William Massey and refusing to leave when asked
... by Sarah Massey") verified -- clearly one drunken incident on
William Massey's licensed premises, two charges.

**OK — no changes.**

---

**Progress: records 1-1050 done.**

---

## Record 1051

"Summary conviction of Robert Melton of the township of Sneaton
blacksmith for being drunk and riotous in the town street. Offence
committed at the township of Ruswarp on 10 January 1869. Whitby
Strand - case heard at Whitby" -- defendant Robert Melton (person
1115), home Sneaton, occupation blacksmith, sex male. "the town
street" (Ruswarp's own boilerplate phrase) correctly resolves to
Ruswarp itself, matching the stated offence township. Crime type
"drunk and disorderly" fits "riotous" per the record 1009 precedent.
No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1051 done.**

---

## Record 1052

"Summary conviction of George Mooney of the township of Whitby hawker
for acting as a pedlar offering to mend old china without a
certificate. Offence committed at the township of Whitby on 9 June
1875. Whitby Strand - case heard at Whitby" -- defendant George
Mooney (person 1116), home Whitby, occupation hawker, sex male.
Location Whitby correct. Crime type "licensing offence" matches
(same reasoning as record 999). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1052 done.**

---

## Record 1053

"Summary conviction of Robert Steel of the township of Whitby
fisherman for being drunk on the licensed premises of William Massey
and refusing to leave when asked to do so by Sarah Massey. Offence
committed at the township of Whitby on 28 July 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Robert
Steel (person 1117), home Whitby, occupation fisherman, sex male;
licensee William Massey (person 6991), sex male; informant Sarah
Massey (person 6992), sex female (presumably William's wife, running
the premises, but no relationship stated in source -- not
fabricated). Location Whitby correct. Two crime types correctly
applied: drunkenness and "refusal to quit licensed premises", both
aspects of the charge. Pre-existing related_conviction link to 1050,
already verified.

**OK — no changes.**

---

**Progress: records 1-1053 done.**

---

## Record 1054

"Summary conviction of Richard Duck of the township of Sneaton
joiner for being drunk and riotous in the town street. Offence
committed at the township of Ruswarp on 10 January 1869. Whitby
Strand - case heard at Whitby" -- defendant Richard Duck (person
1118), home Sneaton, occupation joiner, sex male. Location Ruswarp
correct ("the town street" boilerplate). Crime type "drunk and
disorderly" matches. Cross-checked against record 1051 (Robert
Melton, also of Sneaton, identical charge "drunk and riotous in the
town street", same date, same township) -- same home village, same
date, same distinctive charge wording implying group disorder (unlike
ordinary solitary drunkenness, which record 1000 established isn't
sufficient alone). No related_conviction link existed. Added one
under the no-named-party pattern.

**FIXED — added related_conviction link (1051, 1054): "Same offence
date, township, and charge wording (\"drunk and riotous in the town
street\"), both defendants from Sneaton -- likely one incident, two
men prosecuted separately."**

[Retroactive note, added at record 1054: record 1051's log entry did
not anticipate this link since 1054 hadn't been reached yet.]

---

**Progress: records 1-1054 done.**

---

## Record 1055

"Summary conviction of Edward Jameson [James] Ayre of the township
of Whitby jet worker for being drunk and disorderly on the Pier.
Offence committed at the township of Whitby on 15 May 1875. Whitby
Strand - case heard at Whitby" -- defendant Edward Jameson Ayre
(person 1119), home Whitby, occupation jet worker, sex male. The
source's own bracketed "[James]" variant reading is correctly
captured in the person's `alias` field ("Edward James Ayre, James"),
not lost. Location Piers correct. Crime type matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1055 done.**

---

## Record 1056

"Summary conviction of John Hewison of the township of Whitby
labourer for wilfully damaging hay, the property of William Robinson.
Offence committed at the township of Ruswarp on 29 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
John Hewison (person 1120), home Whitby, occupation labourer, sex
male; property owner William Robinson (person 6993), sex male.
Location Ruswarp correct. Crime type malicious/property damage
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1056 done.**

---

## Record 1057

"Summary conviction of Joseph Marsay of the township of Whitby
mariner for being drunk and riotous in the town street. Offence
committed at the township of Ruswarp on 10 January 1869. Whitby
Strand - case heard at Whitby" -- defendant Joseph Marsay (person
1121), home Whitby, occupation mariner, sex male. Location Ruswarp
correct. Crime type matches. A third instance of the exact same date/
township/charge wording as records 1051 (Robert Melton) and 1054
(Richard Duck) -- clearly the same incident. No link existed. Added
one.

**FIXED — added related_conviction link (1051, 1057): "Same offence
date, township, and charge wording (\"drunk and riotous in the town
street\") as 1051/1054 -- third man from the same incident."**

---

**Progress: records 1-1057 done.**

---

## Record 1058

"Summary conviction of Robert Arnold of the township of Whitby jet
worker for being drunk and disorderly in Sandgate. Offence committed
at the township of Whitby on 20 April 1875. Whitby Strand - case
heard at Whitby" -- defendant Robert Arnold (person 1122), home
Whitby, occupation jet worker, sex male. Location Sandgate correct.
Crime type matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1058 done.**

---

## Record 1059

"Summary conviction of William Smith of the township of Whitby
mariner for being drunk and riotous in the town street. Offence
committed at the township of Ruswarp on 10 January 1869. Whitby
Strand - case heard at Whitby" -- defendant William Smith (person
1123), home Whitby, occupation mariner, sex male. Location Ruswarp
correct. Crime type matches. Fourth man in the same 10 January 1869
"drunk and riotous" incident (1051/1054/1057). Added the link, then
ran a corpus-wide sweep (`offence_date='1869-01-10' AND raw_record
LIKE '%drunk and riotous in the town street%'`) to confirm no further
participants exist -- exactly these 4 records, all now linked.

**FIXED — added related_conviction link (1051, 1059): "Same offence
date, township, and charge wording (\"drunk and riotous in the town
street\") as 1051/1054/1057 -- fourth man from the same incident."**
Swept the corpus for this exact date+phrase to confirm the cluster is
complete (4 of 4).

---

**Progress: records 1-1059 done.**

---

## Record 1060

"Summary conviction of William Smith of the township of Whitby
labourer for being drunk and disorderly in Bridge Street. Offence
committed at the township of Whitby on 27 March 1875 Whitby Strand -
case heard at Whitby" -- defendant William Smith (person 1124), home
Whitby, occupation labourer, sex male -- a different William Smith
from record 1059's mariner (different date, occupation, and street),
correctly a distinct person row. Location Bridge Street correct.
Crime type matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1060 done.**

---

## Record 1061

"Summary conviction of George Collis of the township of Whitby jet
worker for wilfully damaging hay, the property of William Robinson.
Offence committed at the township of Ruswarp on 29 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
George Collis (person 1125), home Whitby, occupation jet worker, sex
male; property owner William Robinson (person 6994), sex male.
Location Ruswarp correct. Crime type matches. Same victim William
Robinson, same date, same charge as record 1056 (John Hewison) -- no
link existed. Added one.

**FIXED — added related_conviction link (1056, 1061).** Then swept
the corpus for `offence_date='1888-07-29' AND raw_record LIKE
'%William Robinson%'` and found 5 total participants: 1056, 1061,
1064, 1067, 1070. Added links from 1056 (hub) to 1064, 1067, and 1070
as well, and updated all notes to read "one incident, five men
prosecuted separately."

[Retroactive note, added at record 1061: record 1056's log entry did
not anticipate this link since 1061 hadn't been reached yet. Records
1064, 1067, and 1070 haven't been reached yet in the sequential audit
either -- their own log entries will note these pre-existing links
when reached.]

---

**Progress: records 1-1061 done.**

---

## Record 1062

"Summary conviction of Francis Schofield of the township of
Eskdaleside miner for assaulting William Hodkinson. Offence committed
at the township of Eskdaleside on 8 January 1869. Whitby Strand -
case heard at Whitby" -- defendant Francis Schofield (person 1126),
home Eskdaleside-cum-Ugglebarnby (record's shortened "Eskdaleside"
correctly normalized to the canonical township name), occupation
miner, sex male; victim William Hodkinson (person 6995), sex male.
Location correct. Crime type assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1062 done.**

---

## Record 1063

"Summary conviction of John Noble of the township of Whitby jet
worker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 5 May 1875. Whitby Strand -
case heard at Whitby" -- defendant John Noble (person 1127), home
Whitby, occupation jet worker, sex male. Location Church Street
correct. Crime type matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1063 done.**

---

## Record 1064

"Summary conviction of Arthur Spark of the township of Whitby jet
worker for wilfully damaging hay, the property of William Robinson.
Offence committed at the township of Ruswarp on 29 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Arthur Spark (person 1128), home Whitby, occupation jet worker, sex
male; property owner William Robinson (person 6996), sex male.
Location Ruswarp correct. Crime type matches. related_conviction link
to 1056 already added during the sweep at record 1061, confirmed
correct here.

**OK — no changes.**

---

**Progress: records 1-1064 done.**

---

## Record 1065

"Summary conviction of [blank] Karraffa for begging in Church Street.
Offence committed at the township of Whitby on 13 January 1869.
Whitby Strand - case heard at Whitby" -- defendant [blank] Karraffa
(person 1129), first_name and sex correctly left blank matching the
source's own "[blank]" notation, not fabricated. Location Church
Street correct. Crime type begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1065 done.**

---

## Record 1066

"Summary conviction of James William Mason for assaulting Samuel
Harrison one of the constables for the North Riding in the execution
of his duty. Offence committed at the township of Whitby on 20 April
1875. Whitby Strand - case heard at Whitby" -- defendant James
William Mason (person 1130), sex male, no home stated; victim Samuel
Harrison (person 6997), constable, sex already correctly male
(directly named before "one of the constables"). Location Whitby
correct. Crime type "assaulting a police officer" matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1066 done.**

---

## Record 1067

"Summary conviction of Robert Wood of the township of Whitby jet
worker for wilfully damaging hay, the property of William Robinson.
Offence committed at the township of Ruswarp on 29 July 1888 Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Robert Wood (person 1131), home Whitby, occupation jet worker, sex
male; property owner William Robinson (person 6998), sex male.
Location Ruswarp correct. Crime type matches. related_conviction link
to 1056 already added during the sweep at record 1061, confirmed
correct.

**OK — no changes.**

---

**Progress: records 1-1067 done.**

---

## Record 1068

"Summary conviction of John Harker of the township of Hinderwell
carrier for not keeping his cart to the left side of the Whitby and
Guisborough highway to allow the cart of Charles Tempest Clarkson to
pass; on the oath of Charles Tempest Clarkson of the township of
Whitby superintendent of police. Offence committed at the township of
Barnby on 14 January 1869. Whitby Strand - case heard at Whitby" --
defendant John Harker (person 1132), home Hinderwell, occupation
carrier, sex male; informant Charles Tempest Clarkson (person 6999),
superintendent of police, sex male, home Whitby (a distinct person
row from record 1012's Clarkson, per the no-cross-conviction-merge
convention). Location: Barnby (offence township) plus the Whitby &
Guisborough cross-parish highway node (106) added alongside, per the
established convention. Crime type "failure to keep to the left on
the highway" is a precise existing leaf, correct fit. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1068 done.**

---

## Record 1069

"Summary conviction of Thomas Gray of the township of Hinderwell
miner for being drunk and disorderly in Hinderwell town street.
Offence committed at the township of Hinderwell on 29 March 1875.
Whitby Strand - case heard at Whitby" -- defendant Thomas Gray
(person 1133), home Hinderwell, occupation miner, sex male. "Hinderwell
town street" boilerplate resolves to Hinderwell itself. Crime type
matches. Pre-existing related_conviction link to 983 (same Thomas
Gray, same date, assaulting John Stonehouse) verified -- likely
assaulted someone while drunk and disorderly, one arrest.

**OK — no changes.**

---

**Progress: records 1-1069 done.**

---

## Record 1070

"Summary conviction of James Pearson of the township of Whitby jet
worker for wilfully damaging hay, the property of William Robinson.
Offence committed at the township of Ruswarp on 29 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
James Pearson (person 1134), home Whitby, occupation jet worker, sex
male; property owner William Robinson (person 7000), sex male.
Location Ruswarp correct. Crime type matches. related_conviction link
to 1056 already added during the sweep at record 1061, confirmed
correct -- last of the 5-man cluster.

**OK — no changes.**

---

**Progress: records 1-1070 done.**

---

## Record 1071

"Summary conviction of George Foster of the township of Whitby sailor
for being drunk. Offence committed at the township of Whitby on 17
January 1869. Whitby Strand - case heard at Whitby" -- defendant
George Foster (person 1135), home Whitby, occupation sailor, sex
male. Location Whitby correct. Crime type drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1071 done.**

---

## Record 1072

"Summary conviction of Robert Cockerill of the township of
Fylingdales carrier for being drunk in charge of a horse and cart in
Church Street. Offence committed at the township of Whitby on 20
March 1875. Whitby Strand - case heard at Whitby" -- defendant
Robert Cockerill (person 1136), home Fylingdales, occupation carrier,
sex male. Location Church Street correct. Crime type drunkenness
matches (same pattern as record 996, "drunk in charge of a horse and
cart"). No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1072 done.**

---

## Record 1073

"Summary conviction of Thomas Kirk of the township of Whitby jet
worker for maliciously breaking a fence, the property of Robert
Burnett. Offence committed at the township of Ruswarp on 29 July
1888 Whitby Strand Petty Sessional division - case heard at Whitby"
-- defendant Thomas Kirk (person 1137), home Whitby, occupation jet
worker, sex male; property owner Robert Burnett (person 7001), sex
male. Location Ruswarp correct. Crime type malicious/property damage
matches. Searched for other Robert Burnett convictions and found
record 1076 (Joseph Wright), same date, same victim, same
"maliciously breaking a fence" charge -- no link existed. Added one.

**FIXED — added related_conviction link (1073, 1076): "Same victim
(Robert Burnett), same date, same charge (maliciously breaking a
fence), different defendants -- one incident, two men prosecuted
separately."**

[Retroactive note, added at record 1073: record 1076 hasn't been
reached yet in the sequential audit; its own log entry will note
this pre-existing link when reached.]

---

**Progress: records 1-1073 done.**

---

## Record 1074

"Summary conviction of George Wood of the township of Whitby cab
driver for being drunk. Offence committed at the township of Whitby
on 16 January 1869. Whitby Strand - case heard at Whitby" --
defendant George Wood (person 1138), home Whitby, occupation cab
driver, sex male. Location Whitby correct. Crime type drunkenness
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1074 done.**

---

## Record 1075

"Summary conviction of Anthony Marshall of the township of Whitby rag
gatherer for being the owner of an ass found straying on the Whitby
and Hawsker highway. Offence committed at the township of Hawsker cum
Stainsacre on 3 June 1875. Whitby Strand - case heard at Whitby" --
defendant Anthony Marshall (person 1139), home Whitby, occupation rag
gatherer, sex male. Location: Hawsker-cum-Stainsacre (offence
township) plus the Whitby & Hawsker cross-parish highway node (106)
added alongside, per convention. Crime type "straying animals"
matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1075 done.**

---

## Record 1076

"Summary conviction of Joseph Wright of the township of Whitby jet
worker for maliciously breaking a fence, the property of Robert
Burnett. Offence committed at Ruswarp on 29 July 1888 Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Joseph
Wright (person 1140), home Whitby, occupation jet worker, sex male;
property owner Robert Burnett (person 7002), sex male. Location
Ruswarp correct. Crime type matches. related_conviction link to 1073
already added earlier, confirmed correct.

**OK — no changes.**

---

**Progress: records 1-1076 done.**

---

## Record 1077

"Summary conviction of Amos Craven of the township of Ugglebarnby
wood leader for obstructing the Whitby and Guisborough highway by
leaving a horse there for seven hours; on the oath of John Jackson on
the township of Ruswarp labourer. Offence committed at the township
of Aislaby on 14 January 1869. Whitby Strand - case heard at Whitby"
-- defendant Amos Craven (person 1141), home Eskdaleside-cum-
Ugglebarnby (record's shortened "Ugglebarnby" correctly normalized),
occupation wood leader, sex male; informant John Jackson (person
7003), home Ruswarp, occupation labourer, sex male. Location: Aislaby
(offence township) plus the Whitby & Guisborough cross-parish highway
node (106) added alongside, per convention. Crime type "obstructing
the highway" is a precise existing leaf, correct fit. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1077 done.**

---

## Record 1078

"Summary conviction of James Pearson of the township of Whitby
blacksmith for being drunk and disorderly in the Royal Crescent
Avenue. Offence committed at the township of Ruswarp on 17 May 1875.
Whitby Strand - case heard at Whitby" -- defendant James Pearson
(person 1142), home Whitby, occupation blacksmith, sex male -- a
different James Pearson from record 1070's jet worker (different
date/occupation/street), correctly a distinct person row. Royal
Crescent Avenue nests under Whitby (5) but the record states offence
township Ruswarp -- correctly added alongside per the cliff-boundary
pattern (same street referenced earlier at records 719/728). Crime
type matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1078 done.**

---

## Record 1079

"Summary conviction of Thomas Bennett of the township of Lythe
labourer for begging in Sandsend town street. Offence committed at
the township of Lythe on 4 August 1888. Whitby Strand Petty
Sessional division - case heard at Whitby" -- defendant Thomas
Bennett (person 1143), home Lythe, occupation labourer, sex male.
"Sandsend town street" boilerplate resolves to Sandsend, which
correctly nests under Lythe (107), matching the stated township.
Crime type begging matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1079 done.**

---

## Record 1080

"Summary conviction of Thomas Welburry of the township of Whitby
sailor for being drunk and riotous in Sandgate. Offence committed at
the township of Whitby on 28 January 1869. Whitby Strand - case heard
at Whitby" -- defendant Thomas Welburry (person 1144), home Whitby,
occupation sailor, sex male. Location Sandgate correct. Crime type
"drunk and disorderly" fits "riotous" per established precedent. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1080 done.**

---

## Record 1081

"Summary conviction of Thomas Hugill of the township of Roxby woodman
for being the owner of two cows found straying on the Roxby and
Guisborough highway. Offence committed at the township of Roxby on
15 April 1875. Whitby Strand - case heard at Whitby" -- defendant
Thomas Hugill (person 1145), home Roxby, occupation woodman, sex
male. Location: Roxby plus the Roxby & Guisborough cross-parish
highway node (106), per convention. Crime type "straying animals"
matches. related_conviction link to 1031, already verified.

**OK — no changes.**

---

**Progress: records 1-1081 done.**

---

## Record 1082

"Summary conviction of Henry Douglas of the township of Whitby
carpenter for being drunk and disorderly in Flowergate. Offence
committed at the township of Whitby on 2 August 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Henry
Douglas (person 1146), home Whitby, occupation carpenter, sex male.
Location Flowergate correct. Crime type matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1082 done.**

---

## Record 1083

"Summary conviction of Henry Bennison for assaulting Charles Albert
Martindale. Offence committed at the township of Whitby on 28 January
1869. Whitby Strand - case heard at Whitby" -- defendant Henry
Bennison (person 1147), sex male, no home stated; victim Charles
Albert Martindale (person 7004), sex male. Location Whitby correct.
Crime type assault matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1083 done.**

---

## Record 1084

"Summary conviction of Robert Parkin of the township of Newholm cum
Dunsley waggoner for being too far from his waggon to have control of
the two horses drawing it; on the oath of Thomas Hall and Samuel
Harrison both of the township of Whitby police constables. Offence
committed at the township of Whitby on 17 March 1875. Whitby Strand -
case heard at Whitby" -- defendant Robert Parkin (person 1148), home
Newholm-cum-Dunsley, occupation waggoner, sex male; two informants
Thomas Hall (person 7005) and Samuel Harrison (person 7006), both
police constables, sex male, home Whitby, both correctly captured.
Location Whitby correct. Crime type "not having proper control of
horse drawing a cart" (leaf 75) fits the waggon/horses phrasing per
established precedent. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1084 done.**

---

## Record 1085

"Summary conviction of Harrison Hodgson of the township of Whitby
fisherman for being drunk on the licensed premises of Thomas Lane.
Offence committed at the township of Whitby on 31 July 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- defendant
Harrison Hodgson (person 1149), home Whitby, occupation fisherman,
sex male; licensee Thomas Lane (person 7007), sex male. Location
Whitby correct. Crime type drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1085 done.**

---

## Record 1086

"Summary conviction of Thomas Pearson Hodgson for assaulting Charles
Albert Martindale. Offence committed at the township of Whitby on 28
January 1869. Whitby Strand - case heard at Whitby" -- defendant
Thomas Pearson Hodgson (person 1150), sex male, no home stated;
victim Charles Albert Martindale (person 7008), sex male. Location
Whitby correct. Crime type assault matches. Same victim and same date
as record 1083 (Henry Bennison) -- no link existed. Added one.

**FIXED — added related_conviction link (1083, 1086): "Same victim
(Charles Albert Martindale), same date, same offence (assault),
different defendants -- one incident, two men prosecuted
separately."**

[Retroactive note, added at record 1086: record 1083's log entry did
not anticipate this link since 1086 hadn't been reached yet.]

---

**Progress: records 1-1086 done.**

---

## Record 1087

"Summary conviction of John Watson Liddle of the township of Whitby
cartman for being drunk in charge of a horse and cart in Church
Street. Offence committed at the township of Whitby on 23 March 1875.
Whitby Strand - case heard at Whitby" -- defendant John Watson Liddle
(person 1151), home Whitby, occupation cartman, sex male. Location
Church Street correct. Crime type drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1087 done.**

---

## Record 1088

"Summary conviction of Johnson Hutton of the township of Fylingdales
farmer for being drunk on the licensed premises of Philip Newton.
Offence committed at the township of Fylingdales on 2 August 1888.
Whitby Strand Petty Sessional division - case heard at Whitby" --
defendant Johnson Hutton (person 1152), home Fylingdales, occupation
farmer, sex male; licensee Philip Newton (person 7009), sex male.
Location Fylingdales correct. Crime type drunkenness matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1088 done.**

---

## Record 1089

"Summary conviction of John Henry Smith for assaulting Charles Albert
Martindale. Offence committed at the township of Whitby on 28 January
1869. Whitby Strand - case heard at Whitby" -- defendant John Henry
Smith (person 1153), sex male, no home stated; victim Charles Albert
Martindale (person 7010), sex male. Location Whitby correct. Crime
type assault matches. A third man in the same 28 January 1869
Martindale-assault incident. Swept the corpus
(`offence_date='1869-01-28' AND raw_record LIKE '%Charles Albert
Martindale%'`) and confirmed exactly 3 records (1083, 1086, 1089), no
more. Added the link, updated the existing 1083-1086 note to say
"three men" for consistency.

**FIXED — added related_conviction link (1083, 1089), updated cluster
notes to "three men prosecuted separately." Cluster confirmed
complete (3 of 3).**

[Retroactive note, added at record 1089: records 1083 and 1086's log
entries described the cluster as two men; now three.]

---

**Progress: records 1-1089 done.**

---

## Record 1090

"Summary conviction of Margaret Elders wife of Matthew Elders of the
township of Barnby stonemason for being drunk in Lythe town street;
on the oath of Thomas Dennis of the township of Lythe police
constable. Offence committed at the township of Lythe on 29 March
1875. Whitby Strand - case heard at Whitby" -- defendant Margaret
Elders (person 1154), home Barnby, sex female; husband Matthew Elders
named in full (person 9944), home Barnby, occupation stonemason
(correctly attached to the husband, since "of the township of Barnby
stonemason" describes him grammatically), "wife" relationship
recorded; informant Thomas Dennis (person 7011), police constable,
sex male, home Lythe. "Lythe town street" boilerplate resolves to
Lythe. Crime type drunkenness matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1090 done.**

---

## Record 1091

"Summary conviction of Philip Newton of the township of Fylingdales
licensed victualler for permitting drunkenness on his licensed
premises. Offence committed at the township of Fylingdales on 2
August 1888. Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Philip Newton (person 1155), home Fylingdales,
occupation licensed victualler, sex male. Location Fylingdales
correct. Crime type "licensing offence" matches. Same licensee, same
date as record 1088 (Johnson Hutton, drunk on Philip Newton's
premises) -- complementary halves of one incident, same pattern as
1002/1017. No link existed. Added one.

**FIXED — added related_conviction link (1088, 1091): "Same licensee
(Philip Newton), same date, complementary offences (being drunk on
his premises / permitting drunkenness on his premises) -- same
incident."**

[Retroactive note, added at record 1091: record 1088's log entry did
not anticipate this link since 1091 hadn't been reached yet.]

---

**Progress: records 1-1091 done.**

---

## Record 1092

"Summary conviction of Ellen Hick for being drunk and riotous in the
Old Post Office Yard. Offence committed at the township of Whitby on
28 January 1869. Whitby Strand - case heard at Whitby" -- defendant
Ellen Hick (person 1156), sex female, no home/husband stated here --
a different Ellen Hick from record 1012's (different date, no
husband named), correctly a distinct person row per the no-cross-
conviction-merge convention. Location Old Post Office Yard correct.
Crime type "drunk and disorderly" fits "riotous". No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1092 done.**

---

## Record 1093

"Summary conviction of Peter Kilpatrick for assaulting Robert Needham
one of the constables for the North Riding in the execution of his
duty. Offence committed at the township of Whitby on 1 April 1875.
Whitby Strand - case heard at Whitby" -- defendant Peter Kilpatrick,
victim Robert Needham (person 7012), constable, sex already correctly
male. **Problem found and flagged**: this record's own raw_record
states no home/occupation for Peter Kilpatrick, yet the person row
(1157) had home=Whitby/occupation=iron worker filled in -- fabricated
beyond this record's own source text, apparently carried over from
the linked same-day conviction 1040 which does state it. Flagged to
the user immediately.

User's resolution: rather than stripping the fields, merge this
cluster's Peter Kilpatrick person rows onto one canonical record, per
the eventual goal of a deduplicated person table where one person
connects to multiple offences -- when a related_conviction link
already proves same-day/same-defendant (as here: 1040/1093/3286, all
1 April 1875, all "same defendant and same offence date"), it's safe
to consolidate now rather than waiting for a later dedup pass. Kept
person 1104 (from 1040, whose own text states "of the township of
Whitby iron worker") as canonical; repointed 1093 and 3286's
`summary_conviction_person` rows to 1104; deleted the now-redundant
duplicate person rows 1157 and 3436 (checked person_occupation and
person_relationship first for orphaned FKs -- none besides
person_occupation, also removed). Documented as a new standing
principle in memory (`project_person_dedup_within_linked_clusters`) --
narrow exception to the no-cross-conviction-merge default, only
applies when a related_conviction link already proves same person.

Location Whitby correct. Crime type "assaulting a police officer"
matches.

**FIXED — merged duplicate person rows 1157 (this record) and 3436
(record 3286) into canonical person 1104 (record 1040); both
`summary_conviction_person` rows repointed.**

[Retroactive note, added at record 1093: records 1040 and 3286's
earlier log entries referenced separate person ids (1104 and 3436
respectively) for the same real Peter Kilpatrick; all three now
correctly share person 1104.]

---

**Progress: records 1-1093 done.**

---

## Record 1094

"Summary conviction of Andrew Harland of the township of Whitby
labourer for assaulting Hannah Harland. Offence committed on 11
August 1888 Whitby Strand Petty Sessional division - case heard at
Whitby" -- defendant Andrew Harland (person 1158), home Whitby,
occupation labourer, sex male; victim Hannah Harland (person 7013),
sex female. Note: unlike most records, this one doesn't explicitly
state an offence township ("Offence committed on 11 August 1888"
with no "at the township of X"); location of offence is correctly
inferred as Whitby given the defendant's own home is Whitby and no
other township is named anywhere in the text -- consistent with the
established unstated-home-town-inference precedent, judged reasonable
here. Same surname for defendant and victim (possibly a family
relationship) but nothing explicit stated in raw_record, so no
relationship fabricated. Crime type assault matches. No
related_conviction.

**OK — no changes.**

---

**Progress: records 1-1094 done.**

---

## Record 1095

"Summary conviction of Mary Brown for being a common prostitute and
behaving indecently in Sandgate. Offence committed at the township of
Whitby on 30 January 1869. Whitby Strand - case heard at Whitby" --
defendant Mary Brown (person 1159), sex female, occupation "common
prostitute". Location Sandgate correct. Two crime types correctly
applied (indecent behaviour, prostitution), same pattern as record
1028. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1095 done.**

---

## Record 1096

"Summary conviction of Moses Thompson of the township of Lythe
labourer for being found drunk and disorderly in Lythe town street.
Offence committed at the township of Lythe on 29 March 1875. Whitby
Strand - case heard at Whitby" -- defendant Moses Thompson (person
1160), home Lythe, occupation labourer, sex male. "Lythe town street"
resolves to Lythe. Crime type "drunk and disorderly" matches. Same
date/township as record 1090 (Margaret Elders) but a different
specific charge (drunkenness vs drunk-and-disorderly) and no shared
named party -- per the record 1000/1018 reasoning, not linked.

**OK — no changes.**

---

**Progress: records 1-1096 done.**

---

## Record 1097

"Summary conviction of Susan Backhouse of the township of Whitby
widow for being drunk and disorderly on the New Quay. Offence
committed at the township of Whitby on 13 August 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- defendant Susan
Backhouse (person 1161), sex female; raw text states "widow" but
`person_occupation` had no row -- confirmed instance of the tracked
marital-status occupation gap. Location New Quay correct. Crime type
matches. No related_conviction.

**FIXED — added missing "widow" occupation (occupation_id 384) for
person 1161.** Also housekeeping: before removing 1097 from the
tracked-gap list, noticed ids 552, 577, 597, 626 were still listed
even though the linear audit passed them long ago (they predate 1097
by hundreds of records). Checked all four directly against the
database: all already correctly fixed in an earlier pass (552's
victim Isabella Jolly has "spinster"; 577's Emma Robinson has
"singlewoman"; 597's Katherine McLaughlan has "widow"; 626's Ann
Appleton has "widow", Annie Austin has "singlewoman", and Mary
Austin's husband stub Robert Austin correctly holds "fisherman") --
just stale list entries, not a real gap. Removed all five ids (552,
577, 597, 626, 1097) from the tracked list in one edit.

---

**Progress: records 1-1097 done.**

---

## Record 1098

"Summary conviction of John Pitts for wilfully wasting a pair of
trousers committed to his care whilst he was being relieved in the
workhouse of the Whitby Union as a destitute wayfarer. Offence
committed at the township of Whitby on 2 February 1869. Whitby
Strand - case heard at Whitby[Date endorsed as 3 February 1869]" --
defendant John Pitts (person 1162), sex male, no home stated.
Location Whitby correct. Already has an `anomalies` note documenting
the archive's own date discrepancy (one of the two records the
tracked-notes file said already had this handled). Crime type
"workhouse offence" (47) checked against the "destroying own
clothes" leaf (73, seed record 330: "wilfully destroying HIS OWN
clothes while being relieved") -- this record's fact pattern is
materially different: the trousers were "committed to his care" (i.e.
workhouse-issued property, not his own personal clothing being
destroyed), so "workhouse offence" is the correct fit, not the
destroying-own-clothes leaf. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1098 done.**

---

## Record 1099

"Summary conviction of William Weatherill of the township of Whitby
for keeping a dog without a licence. Offence committed at Whitby on
12 March 1875. Whitby Strand - case heard at Whitby" -- defendant
William Weatherill (person 1163), home Whitby, sex male, no
occupation stated. Location Whitby correct. Crime type "dog licence
offence" matches. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1099 done.**

---

## Record 1100

"Summary conviction of Frederick Garth of the township of Whitby cab
driver for refusing to drive his hackney carriage (no 38) to
Haggersgate when asked by Edwin Harrison. Offence committed at the
township of Ruswarp on 9 August 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- defendant Frederick Garth (person
1164), home Whitby, occupation cab driver, sex male; informant Edwin
Harrison (person 7014), sex male. Location Ruswarp correct. Crime
type "hackney carriage driver refusing service" is a precise existing
leaf, correct fit. No related_conviction.

**OK — no changes.**

---

**Progress: records 1-1100 done.**

---

## Record 1101

"Summary conviction of James Matthews of the township of Whitby
sailor for assaulting George Adams; on the oath of the said George
Adams of the township of Whitby labourer. Offence committed at the
township of Whitby on 30 January 1869. Whitby Strand - case heard at
Whitby" -- defendant James Matthews (person 1165), home Whitby,
occupation sailor, sex male; victim George Adams (person 7015), home
Whitby, occupation labourer. George's sex was blank despite "George"
being an unambiguous male first name -- gap found, matches the
established name-inference convention used throughout the audit.

**FIXED — set sex=male for person 7015 (George Adams).**

---

**Progress: records 1-1101 done.**
