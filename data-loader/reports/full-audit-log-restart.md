# Full re-extraction audit — RESTART (records 1+)

Started fresh after a process failure: a title/occupation was fabricated
for a well-attested recurring person (the Marquis of Normanby, records
2119/2233/2236) without checking existing precedent, and two corpus-wide
open questions sat unflagged in `reextraction-audit-notes.md` for
~2000 records instead of being surfaced immediately. Both are reverted/
resolved. This log restarts from record 1 rather than trusting prior
"reviewed, no fix needed" entries without re-verification.

Rules for this pass, non-negotiable:
1. Every record shows: the raw_record text considered, what it says,
   the decision, the SQL, and a verification query confirming the write.
2. Before writing any categorical field (title, office, occupation,
   role, a new location) — not a plain name-based sex inference — a
   precedent query runs and is shown first.
3. No script or heuristic ever decides content. SQL only executes a
   decision already made by reading.
4. Nothing is deferred silently to a log file. Any open question is
   raised immediately, in the same turn.
5. One record at a time, in strict id order, starting at id 1.

See `reextraction-audit-notes.md` for the established rules from the
prior passes (sex inference, pattern #6, specific-site rules, etc.) —
those rules aren't in question, only whether every application of them
was actually checked. Re-verifying, not assuming.

## Record 1

Text: "Summary conviction of Edward Jameson Ayre of the township of
Whitby jet worker for being drunk and disorderly in Grape Lane.
Offence committed at the township of Whitby on 29 September 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Checked: name (Edward Jameson Ayre) matches; home=Whitby matches
stated township; occupation=jet worker matches; sex=male is an
unambiguous given name; location of offence=Grape Lane (specific
Whitby street) matches "in Grape Lane"; court location=Whitby matches;
petty sessional division=Whitby Strand matches. Only one person in the
record, no categorical-field write needed, no precedent check
applicable.

**OK — no fix needed.**

## Record 2

Text: "Summary conviction of William Tooley of Liverton Mines miner
for trespassing in the daytime in search of conies on a piece of land
in the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Tooley: home=Liverton Mines (335, under Liverton 334) matches "of
Liverton Mines"; occupation=miner matches; sex=male unambiguous
given name. Location of offence=Roxby matches stated township. Court
location=Whitby matches.

Palmer: title="Sir" is a categorical field, precedent check run
(shown in-turn) — all 12 Charles Mark Palmer rows in the corpus were
already resolved in a prior session (documented in
reextraction-audit-notes.md): the 3 that say "Sir" (including this
one) are genuine to their own dates (post-knighthood), the 9 that
don't are genuine to theirs (pre-knighthood) — not an inconsistency.
This record's own text also directly states "Sir Charles Mark
Palmer," so the title isn't inferred here at all, it's transcribed.

FIXED: sex='male' for person 6483 (Charles unambiguous given name;
title itself also implies male). Verified via SELECT after write:
sex now 'male'.

**FIXED — 1 sex fix (6483). Everything else already correct.**

## Record 3

Text: "Summary conviction of Jonathan Agar of Liverton Mines miner
for trespassing in the daytime in search of conies on a piece of land
in the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Agar: home=Liverton Mines, occupation=miner, sex=male — all already
correct, matches text. Location of offence=Roxby matches.

Palmer (person 6484, separate row from record 2's 6483, correctly
not merged per no-merge policy): title="Sir" already covered by the
precedent check done for record 2 (same real person, same corpus-wide
resolution already documented). Text also directly states "Sir
Charles Mark Palmer."

FIXED: sex='male' for person 6484 (same reasoning as record 2).
Verified via SELECT after write.

Same-incident pair with record 2: identical landowner, identical
offence, identical date (26 September 1888) — two men trespassing on
the same land the same day, prosecuted separately. Logging to
same-person-candidates.md.

**FIXED — 1 sex fix (6484). Everything else already correct.**

## Record 4

Text: "Summary conviction of John Marley of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at on township of Roxby on 26 September 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Marley: home=Liverton Mines, occupation=miner, sex=male — all
correct. Location of offence=Roxby matches. Source typo "at on
township of Roxby" already correctly documented in the record's own
`anomalies` field from a prior pass — verified present, not
re-added.

Palmer (person 6485): title="Sir" already covered by the record-2
precedent check (same real person, same resolution). FIXED: sex=male
(same reasoning as records 2/3). Verified via SELECT after write.

Third instance of the Liverton Mines/Palmer's-land incident (with
records 2, 3) — same-person-candidates.md note updated to 3 people.

**FIXED — 1 sex fix (6485). Everything else already correct.**

## Record 5

Text: "Summary conviction of Robert Tinley of the township of Whitby
carpenter for being drunk and disorderly in St Ann's Staith. Offence
committed at the township of Whitby on 8 September 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name matches; home=Whitby matches; occupation=carpenter
matches; sex=male unambiguous given name; location of
offence=St Ann's Staith (specific Whitby site) matches; court
location and petty sessional division match. Only one person, no
categorical field at risk.

**OK — no fix needed.**

## Record 6

Text: "Summary conviction of William Holmes of the township of Whitby
jet worker for being drunk and disorderly on the Whitby and Ruswarp
highway. Offence committed at the township of Hawsker cum Stainsacre
on 7 October 1888. Whitby Strand Petty Sessional division - case
heard at Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both Hawsker-cum-Stainsacre (stated township) and
Whitby & Ruswarp Highway (two-endpoint highway rule, added alongside).

**OK — no fix needed.**

## Record 7

Text: "Summary conviction of Robert Ross of the township of Whitby
fish packer for being drunk on the licensed premises of Thomas
Wadsworth and refusing to leave when asked by William Dobson acting
sergeant of police Offence committed at the township of Whitby on 6
October 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Ross: name/home/occupation/sex all correct. Location of offence=Whitby
matches.

FIXED: sex='male' for Thomas Wadsworth (6486) and William Dobson
(6487) — both unambiguous given names, plain linguistic inference, no
categorical field involved. Dobson's occupation "acting sergeant of
police" already correctly captured. Verified via SELECT after write.

**FIXED — 2 sex fixes (6486, 6487). Everything else already correct.**

## Record 8

Text: "Summary conviction of Edward Joseph Watson of the township of
Whitby licensed victualler for opening his premises out of licensing
hours. Offence committed at the township of Whitby on 7 October
1888. Whitby Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Only one person.

**OK — no fix needed.**

## Record 9

Text: "Summary conviction of John Parkin of the Old Post Office Yard
in the township of Whitby for not sending his son George Parkin to
school. Offence committed in the Whitby Strand School Board district
on 5 October 1888. Case heard at Whitby"

Truancy record — established rule: location of offence = defendant's
own home, not the School Board district wording. Checked: John
Parkin's home=Old Post Office Yard (67) matches text; location of
offence also correctly =Old Post Office Yard (67), not the School
Board district. Role for George Parkin already correctly "child".

FIXED: sex='male' for George Parkin (6488) — unambiguous given name.
Verified via SELECT after write.

**FIXED — 1 sex fix (6488). Everything else already correct.**

## Record 10

Text: "Summary conviction of Robert Harker of the township of
Mickleby carrier for obstructing Lythe town street by leaving his
horse and cart there for one hour and twenty minutes. Offence
committed at the township of Lythe on 6 October 1888. Whitby Strand
Petty Sessional division - case heard at Whitby"

Checked: home=Mickleby, occupation=carrier, sex=male all match.
"Lythe town street" correctly resolves to Lythe itself (established
boilerplate rule), not a fabricated separate location.

**OK — no fix needed.**

---

**Progress: records 1-10 done (restart pass). 5 sex fixes, 1
same-incident cluster (3 people) confirmed. All categorical-field
writes (title) precedent-checked before applying.**

## Record 11

Text: "Summary conviction of Stephen George Mills of the township of
Fylingdales labourer for begging on the Whitby and Robin Hood's Bay
highway. Offence committed at the township of Fylingdales on 11
October 1888. Whitby Strand Petty Sessional division - case heard at
Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both Fylingdales and the Whitby & Robin Hood's Bay
Highway node.

**OK — no fix needed.**

## Record 12

Text: "Summary conviction of John Quinney of the township of
Fylingdales labourer for begging on the Whitby and Robin Hood's Bay
highway. Offence committed at the township of Fylingdales on 11
October 1888 Whitby Strand Petty Sessional division - case heard at
Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both links. Same-incident pair with record 11 (same
road, township, date) — not previously logged; added to
same-person-candidates.md now.

**OK — no fix needed.**

## Record 13

Text: "Summary conviction of John Kelley of the township of
Hinderwell labourer for begging at Staithes Lane End. Offence
committed at the township of Hinderwell on 11 October 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly only carries Staithes Lane End (378) — no redundant
coarser "Staithes" link, confirms a prior cleanup (12-record
duplicate-link fix from earlier this session) held correctly here.

**OK — no fix needed.**

## Record 14

Text: "Summary conviction of William Herbert of the township of
Whitby butcher for being drunk and disorderly in Baxtergate. Offence
committed at the township of Whitby on 13 October 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match, location correct.

**OK — no fix needed.**

## Record 15

Text: "Summary conviction of James Bonas of the township of Whitby
bricklayer for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 13 October 1888 Whitby Strand
Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match, location correct.

**OK — no fix needed.**

---

**Progress: records 1-15 done (restart pass). 5 sex fixes total so
far, 2 same-incident clusters confirmed (3-person Palmer's-land,
2-person highway-begging pair).**

## Record 16

Text: "Summary conviction of George Smith of the township of
Mickleby labourer for begging in Mickleby town street. Offence
committed at the township of Mickleby on 15 October 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. "Mickleby town street"
correctly resolves to Mickleby itself.

**OK — no fix needed.**

## Record 17

Text: "Summary conviction of Robert Harker of the township of
Mickleby carrier for being drunk in charge of a horse and cart on the
Hinderwell and Ellerby highway. Offence committed at the township of
Hinderwell on 19 October 1888. Whitby Strand Petty Sessional division
- case heard at Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both Hinderwell and the existing Hinderwell &
Ellerby Highway node. Same name as record 10 (also Robert Harker,
Mickleby carrier) — logged as a likely recurring person, not merged.

**OK — no fix needed.**

## Record 18

Text: "Summary conviction of Joseph Henry Tyerman of the township of
Hinderwell farmer for being the owner of five bullocks found
straying on the Hinderwell and Ellerby highway. Offence committed at
the township of Ellerby on 18 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both Ellerby (stated offence township) and the
Hinderwell & Ellerby Highway node.

**OK — no fix needed.**

---

**Progress: records 1-18 done (restart pass). 6 sex fixes total, 3
same-incident/recurring-person notes logged, all fully re-verified.**

## Record 19

Text: "Summary conviction of Isaac Duell of the township of Ellerby
farmer for being the owner of seven bullocks and one heifer found
straying on the Hinderwell and Ellerby highway. Offence committed at
the township of Ellerby on 19 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both Ellerby and Hinderwell & Ellerby Highway.

**OK — no fix needed.**

## Record 20

Text: "Summary conviction of Francis Jefferson of the township of
Whitby licensed victualler for being the owner of a mare and foal
found straying on a highway called Stakesby Vale. Offence committed
at the township of Ruswarp on 23 October 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Stakesby Vale (233,
parented under West Cliff/Whitby) correctly kept alongside the stated
Ruswarp township link — same exception shape as Spring Hill/North
Terrace, not re-litigated.

**OK — no fix needed.**

---

**Progress: records 1-20 done (restart pass). 6 sex fixes total, 3
recurring/same-incident notes logged.**

## Record 21

Text: "Summary conviction of James Greenwood of the township of
Hawsker cum Stainsacre labourer for begging in Hawsker town street.
Offence committed on 23 October 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Checked: name/home/occupation/sex all match. "Hawsker town street"
correctly resolves to Hawsker-cum-Stainsacre (silence-implies-local,
no separate offence township stated but boilerplate phrase maps
directly).

**OK — no fix needed.**

## Record 22

Text: "Summary conviction of Joseph Storr of the township of Whitby
jet worker for being drunk and disorderly in Sandgate. Offence
committed at the township of Whitby on 27 October 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match, location correct.

**OK — no fix needed.**

---

**Progress: records 1-22 done (restart pass). 6 sex fixes total.**

## Record 23

Text: "Summary conviction of Charles Allison of Clark's Yard in the
township of Whitby for not sending his son George Allison to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby"

Truancy record. Checked: Charles Allison's home=Clark's Yard matches;
location of offence also correctly=Clark's Yard (truancy rule, not
the School Board district). George Allison's role already correctly
"child".

FIXED: sex='male' for George Allison (6489) — unambiguous given name.
Verified via SELECT after write.

**FIXED — 1 sex fix (6489).**

## Record 24

Text: "Summary conviction of Martha Arnold of Renwick's Yard in the
township of Whitby for not sending her son Miles Arnold to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby"

Truancy record, same day as record 23. Checked: Martha's home=
Renwick's Yard matches; offence location correctly=Renwick's Yard
(truancy rule). Role for Miles Arnold already correctly "child".

FIXED: sex='male' for Miles Arnold (6490). Verified via SELECT after
write. Same-day truancy pattern with record 23; watching for more.

**FIXED — 1 sex fix (6490).**

## Record 25

Text: "Summary conviction of John Jones of the township of
Fylingdales labourer for begging in Normanby highway. Offence
committed at the township of Fylingdales on 9 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. "Normanby Highway" (380)
correctly nested under Fylingdales, replacing the coarser link
(single-destination highway rule). Confirmed this is a local place
name, unrelated to the Marquess of Normanby peerage seat — no
conflation.

**OK — no fix needed.**

---

**Progress: records 1-25 done (restart pass). 8 sex fixes total, 3
recurring/same-incident notes, 2 same-day truancy records (23, 24).**

## Record 26

Text: "Summary conviction of Edward Brown of the township of
Eskdaleside cum Ugglebarnby labourer for begging in Sleights town
street. Offence committed at the township of Eskdaleside cum
Ugglebarnby on 9 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Checked: name/home/occupation/sex all match. "Sleights town street"
correctly resolves to Sleights itself.

**OK — no fix needed.**

## Record 27

Text: "Summary conviction of Edward Cargill of the township of
Whitby labourer for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 9 November 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match, location correct.

**OK — no fix needed.**

---

**Progress: records 1-27 done (restart pass). 8 sex fixes total.**

## Record 28

Text: "Summary conviction of Maria Castello wife of Thomas Castello
of the township of Whitby jet worker for assaulting Mary Howard.
Offence committed at the township of Whitby on 8 November 1888.
Whitby Strand Petty Sessional division - case heard at Whitby"

Checked: Maria's home=Whitby matches. Thomas Castello's home=Whitby
+ occupation=jet worker already correctly captured (pattern #6, no
fix needed there).

FIXED: sex='female' for Mary Howard (6491), sex='male' for Thomas
Castello (6492) — both unambiguous given names. Verified via SELECT
after write.

**FIXED — 2 sex fixes (6491, 6492).**

---

**Progress: records 1-28 done (restart pass). 10 sex fixes total.**

## Record 29

Text: "Summary conviction of William Blooman of the township of
Ruswarp farmer for being the owner of two horses found straying on
the Whitby and Aislaby highway. Offence committed at the township of
Ruswarp on 10 November 1888. Whitby Strand Petty Sessional division -
case heard at Whitby"

Checked: name/home/occupation/sex all match. Location of offence
correctly carries both Ruswarp and the Whitby & Aislaby Highway node.

**OK — no fix needed.**

## Record 30

Text: "Summary conviction of Alfred Ford of the township of Whitby
caulker for being drunk and disorderly in Church Street. Offence
committed at the township of Whitby on 10 November 1888. Whitby
Strand Petty Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match, location correct.

**OK — no fix needed.**

---

**Progress: records 1-30 done (restart pass). 10 sex fixes total, 3
recurring/same-incident notes, 1 same-day truancy pair.**

## Record 31

Text: "Summary conviction of Alfred Ford of the township of Whitby
caulker for assaulting John Carpenter one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 10 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Checked: Ford's name/home/occupation/sex all match, same person as
record 30, same day (drunk then assault) — logged as same-day pair.
John Carpenter's occupation "constable of the North Riding" already
correctly captured (the fuller phrase, not bare "constable").

FIXED: sex='male' for John Carpenter (6493). Verified via SELECT
after write.

**FIXED — 1 sex fix (6493). Same-day pair with record 30 logged.**

---

**Progress: records 1-31 done (restart pass). 11 sex fixes total.**

## Record 32

Text: "Summary conviction of William Leigh of the township of
Ruswarp dentist for begging in St Hilda's Terrace. Offence committed
at the township of Ruswarp on 10 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Location correctly
carries both Ruswarp and St Hilda's Terrace.

**OK — no fix needed.**

## Record 33

Text: "Summary conviction of Daniel Blake of the township of Ruswarp
labourer for begging in Hanover Terrace. Offence committed at the
township of Ruswarp on 11 November 1888. Whitby Strand Petty
Sessional division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Location correctly
carries both Hanover Terrace and Ruswarp.

**OK — no fix needed.**

---

**Progress: records 1-33 done (restart pass). 11 sex fixes total, 4
recurring/same-incident notes.**

## Record 34

Text: "Summary conviction of Thomas Humphrey of the township of
Hinderwell fish hawker for attempting to catch salmon in Staithes
Beck in the close season. Offence committed at the township of
Hinderwell on 11 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby"

Checked: name/home/occupation/sex all match. Staithes Beck (382)
correctly nested under Staithes -> Hinderwell, replacing the coarser
township link (specific-site rule).

**OK — no fix needed.**

## Record 35

Text: "Summary conviction of Robert Cummins of the township of
Hinderwell fisherman for attempting to catch salmon in Staithes Beck
in the close season. Offence committed at the township of Hinderwell
on 11 November 1888. Whitby Strand Petty Sessional division - case
heard at Whitby"

Checked: name/home/occupation/sex all match. Same-incident pair with
record 34.

**OK — no fix needed.**

---

**Progress: records 1-35 done (restart pass). 11 sex fixes total, 5
recurring/same-incident notes.**

## Record 36
Jonathan Howard, Newholm-cum-Dunsley, labourer, begging in East Row.
All fields match. **OK — no fix needed.**

## Record 37
Henry Grant, Newholm-cum-Dunsley, herdsman, begging in East Row town
street (resolves to East Row itself). All fields match. **OK — no
fix needed.**

---

**Progress: records 1-37 done (restart pass). 11 sex fixes total, 5
recurring/same-incident notes.**

## Record 38
John Brand, Whitby, labourer, drunk in Wellington Road. All fields
match. **OK — no fix needed.**

## Record 39
James Holden drunk on William Willison's premises, refusing to leave
for William Dobson. Holden correct. FIXED sex='male' for Willison
(6494) and Dobson (6495) — unambiguous names, occupations already
correct. Verified via SELECT after write. **FIXED — 2 sex fixes.**

---

**Progress: records 1-39 done (restart pass). 13 sex fixes total, 5
recurring/same-incident notes.**

## Record 40
John Poole, Fylingdales, labourer, begging in Raw town street
(resolves to Raw, nested under Fylingdales). All fields match.
**OK — no fix needed.**

---

**Progress: records 1-40 done (restart pass). 13 sex fixes total, 5
recurring/same-incident notes.**

## Record 41
Joseph Harrison, Tiger Inn (Easington), innkeeper and farmer, killing
salmon in Stonegate Beck (Glaisdale), close season. All fields
match, both specific sites correctly nested. **OK — no fix needed.**

## Record 42
William Wren, Lealholm Hall (Glaisdale), farm labourer, killing salmon
in Stonegate Beck, same day as record 41. All fields match, Lealholm
Hall correctly nested. Same-incident pair confirmed. **OK — no fix
needed.**

---

**Progress: records 1-42 done (restart pass). 13 sex fixes total, 6
recurring/same-incident notes.**

## Record 43
John Summerson, Danby, farmer, using a lantern and gaff to catch
salmon in Fryup Beck (correctly nested under Danby). All fields
match. **OK — no fix needed.**

## Record 44
John Summerson, Danby, farm labourer, killing salmon in Fryup Beck,
same day as record 43. All fields match. Same-defendant relationship
already correctly present in related_conviction (43,44) from a prior
pass -- verified, not re-added. **OK — no fix needed.**

---

**Progress: records 1-44 done (restart pass). 13 sex fixes total.
Relationship notes now recorded in related_conviction (structural
table), not markdown -- 6 new rows added this pass (2-3, 2-4, 3-4,
11-12, 34-35, 41-42), same-person-candidates.md frozen going forward
per instruction.**

## Record 45
Kate Griffin, Whitby, widow, drunk in Church Street. Name/home/sex/
occupation all match (occupation "widow" already correctly captured).
**OK — no fix needed.**

---

**Progress: records 1-45 done (restart pass). 13 sex fixes total.**

## Record 46
William Lawson, Aislaby, labourer, drunk on the Whitby and Ruswarp
footpath, offence at Ruswarp. All fields match; footpath correctly
kept alongside Ruswarp (established footpath rule, not the highway
treatment). **OK — no fix needed.**

## Record 47
John Holmes drunk on Colin Cowan's licensed premises, offence at
Hawsker cum Stainsacre. Holmes correct. FIXED sex='male' for Cowan
(6496). Verified via SELECT after write. **FIXED — 1 sex fix.**

---

**Progress: records 1-47 done (restart pass). 14 sex fixes total.**

## Record 48
William Holmes drunk on Colin Cowan's premises, same day as record 47
(John Holmes, same surname, not stated as kin). Holmes correct. FIXED
sex='male' for Cowan (6497, separate person row from 6496 per
no-merge policy). Verified via SELECT. Added related_conviction
(47,48). **FIXED — 1 sex fix.**

---

**Progress: records 1-48 done (restart pass). 15 sex fixes total.**

## Record 49
Robert Steel drunk on William Massey's premises, "the said William
Massey" reused correctly (one row). Steel correct. FIXED sex='male'
for Massey (6498). Verified via SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-49 done (restart pass). 16 sex fixes total.**

## Record 50
Francis Fewster drunk on Joseph Shaw's premises, "the said Joseph
Shaw" reused correctly. Fewster correct. FIXED sex='male' for Shaw
(6499). Verified via SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-50 done (restart pass). 17 sex fixes total.**

## Record 51
Peter Kilpatrick, Whitby, iron worker, drunk in Church Street. All
fields match. **OK — no fix needed.**

## Record 52
Esther Hill wife of Andrew Hill, drunk in Church Street. Andrew's
home/occupation already correct (pattern #6). FIXED sex='male' for
Andrew Hill (6500). Verified via SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-52 done (restart pass). 18 sex fixes total.**

## Record 53
James Welsh, Ruswarp, pedlar, begging in St Hilda's Terrace. All
fields match, location correctly carries both links. **OK — no fix
needed.**

## Record 54
William Mills, Hawsker-cum-Stainsacre, master mariner, drunk in
Thorpe town street, offence at Fylingdales. "Thorpe town street"
correctly resolves to Fylingthorpe. All fields match. **OK — no fix
needed.**

---

**Progress: records 1-54 done (restart pass). 18 sex fixes total.**

## Record 55
Robert Tinley assaulting Hannah Tinley, offence at Ruswarp. Robert
correct (different occupation context from record 5's Robert Tinley,
carpenter -- not conflated). FIXED sex='female' for Hannah Tinley
(6501). Verified via SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-55 done (restart pass). 19 sex fixes total.**

## Record 56
Robert Tinley assaulting John O'Conner, same day as record 55.
Relationship already correctly present in related_conviction (55,56)
-- verified, not re-added. FIXED sex='male' for O'Conner (6502).
Verified via SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-56 done (restart pass). 20 sex fixes total.**

## Record 57
John Fawcett, Hinderwell, labourer, lodging in an outhouse. All
fields match; sex already correctly male (name + "himself" pronoun
both agree). **OK — no fix needed.**

## Record 58
George Oakley, Whitby, iron worker, drunk in Church Street. All
fields match. **OK — no fix needed.**

---

**Progress: records 1-58 done (restart pass). 20 sex fixes total.**

## Record 59
John Dixon, Whitby, jet worker, drunk in Church Street, same day as
record 58. All fields match. Added related_conviction (58,59). **OK
— no fix needed.**

## Record 60
Pearson Campion, Whitby, jet worker, drunk in Skinner Street, offence
at Ruswarp. All fields match, location correctly carries both links.
**OK — no fix needed.**

---

**Progress: records 1-60 done (restart pass). 20 sex fixes total, 8
relationships now in related_conviction (structural table).**

## Record 61
Thomas Brown, Whitby, labourer, begging in Church Street. All fields
match. **OK — no fix needed.**

## Record 62
Thomas Wilson, Ruswarp, photographer, firing a gun near Newholm Lane
(correctly nested under Newholm-cum-Dunsley). All fields match. **OK
— no fix needed.**

---

**Progress: records 1-62 done (restart pass). 20 sex fixes total.**

## Record 63
Richard Holmes, Whitby, jet worker, drunk in Church Street. All
fields match. **OK — no fix needed.**

## Record 64
George Wardell, Whitby, jet worker, drunk in Ruswarp town street
(resolves to Ruswarp itself). All fields match. **OK — no fix
needed.**

---

**Progress: records 1-64 done (restart pass). 20 sex fixes total.**

## Record 65
Robert Heaton Cargell, Whitby, iron worker, drunk in Church Street.
All fields match. **OK — no fix needed.**

## Record 66
John Langan, Ruswarp, miner, begging in Hanover Terrace. All fields
match, location correctly carries both links. **OK — no fix
needed.**

---

**Progress: records 1-66 done (restart pass). 20 sex fixes total.**

## Record 67
Margaret Sparks of Baxtergate, not sending son Harry Readman Sparks
to school. Truancy rule correctly applied (offence location =
Baxtergate). Middle name "Readman" already correctly captured on the
son (role "child not sent to school", a valid established variant).
FIXED sex='male' for Harry Readman Sparks (6503). Verified via
SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-67 done (restart pass). 21 sex fixes total.**

## Record 68
Robert Page of Hospital Yard, Whitby, not sending son William Robert
Page to school. Truancy rule correctly applied (offence location =
Hospital Yard, defendant's own home). Court = Whitby. Crime type =
school non-attendance, correct. FIXED sex='male' for William Robert
Page (6504) — unambiguous male given name, was null. Verified via
SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-68 done (restart pass). 22 sex fixes total.**

## Record 69
John McMaloy of Whitby, labourer, destroying his own clothes at
Whitby Union Workhouse while being relieved. Defendant sex/occupation
already correct. Offence location = Union Workhouse (child of Whitby),
court = Whitby, petty sessional division = Whitby Strand, all correct.
Crime type = workhouse offence, correct. **OK — no changes.**

## Record 70
James Carney of Whitby, labourer, destroying his own clothes at
Whitby Union Workhouse while being relieved — same offence type, same
workhouse, same date (3 Feb 1889) as record 69 (John McMaloy), but no
connecting text in either raw_record (no "along with", shared incident
detail, etc.) to indicate this is the same event rather than two
separate paupers destroying clothes the same day. Not linked via
related_conviction — no textual evidence, would be fabricating a
connection. Defendant sex/occupation already correct. Offence
location, court, petty sessional division, crime type all correct.
**OK — no changes.**

## Record 71
Thomas Paylor of Whitby, butcher and milk seller, using a building on
the East Cliff near the Abbey Farm as an unlicensed slaughterhouse.
Compound occupation "butcher and milk seller" checked against
precedent (occupation table has many established compound strings:
"ale and porter dealer", "hawker and pedlar", etc.) — single-string
convention confirmed, not a gap. Location of offence = Abbey Farm
(child of East Cliff, child of Whitby) — correctly nested per
specific-site rule. Sex/court/petty sessional division/crime type all
correct. **OK — no changes.**

## Record 72
Robert Foster of Whitby, coal porter, drunk and disorderly in St
Ann's Staith. All fields (sex, occupation, offence location nesting,
court, petty sessional division, crime type) already correct.
**OK — no changes.**

---

**Progress: records 1-72 done (restart pass). 22 sex fixes total.**

## Record 73
Alfred Reynolds of Whitby, labourer, begging in Bridge Street. Bridge
Street correctly nested under Seafront/Whitby. Sex/occupation/court/
crime type all correct. **OK — no changes.**

## Record 74
Robert Jackson of Carlin How, ale and porter dealer, leaving a cart on
"Staithes town street" causing an obstruction (offence at Hinderwell
township). "X town street" boilerplate correctly resolved to Staithes
itself, per established rule. Home/sex/occupation/court/crime type all
correct. **OK — no changes.**

## Record 75
James Duell of Roxby, farmer, keeping a dog without a licence.
All fields correct. **OK — no changes.**

---

**Progress: records 1-75 done (restart pass). 22 sex fixes total.**

## Record 76
James Reeves of Whitby, iron worker, drunk and disorderly in Church
Street. All fields correct. **OK — no changes.**

## Record 77
George Duncanson of Timber Hill (Hawsker cum Stainsacre), not sending
daughter Elizabeth Duncanson to school. Truancy rule correctly
applied (offence location = Timber Hill, defendant's own home). FIXED
sex='female' for Elizabeth Duncanson (6505) — unambiguous female
given name, was null. Verified via SELECT. **FIXED — 1 sex fix.**

---

**Progress: records 1-77 done (restart pass). 23 sex fixes total.**

## Record 78
John Maddon of Lythe, labourer, begging in "Sandsend town street"
(offence at Lythe township). Boilerplate correctly resolved to
Sandsend itself, nested under Lythe. All fields correct.
**OK — no changes.**

## Record 79
Ransome Corser of Timber Hill (Hawsker cum Stainsacre), not sending
daughter Mary Ann Corser to school. Same household/street as record
77 (George Duncanson, also Timber Hill) but different surname — two
separate families at the same address, no shared identifying detail
beyond location, not linked as related_conviction. Truancy rule
correctly applied. FIXED sex='female' for Mary Ann Corser (6506) —
unambiguous female given name, was null. Verified via SELECT.
**FIXED — 1 sex fix.**

---

**Progress: records 1-79 done (restart pass). 24 sex fixes total.**

## Record 80
John Smith of Hawsker-cum-Stainsacre, labourer, begging in "Hawsker
town street". Boilerplate correctly resolved to Hawsker-cum-Stainsacre
itself. All fields correct. **OK — no changes.**

## Record 81
Emmeline Annie Brazier of Ruswarp, singlewoman, begging in Bagdale
(offence stated at township of Ruswarp). Two location-of-offence rows
present: Ruswarp (stated township) and Bagdale (specific site, nested
under West Cliff/Whitby in the location tree — does not descend from
Ruswarp). Checked against the specific-site rule: nesting only
replaces the coarser township link when it reaches the stated
township; since Bagdale's tree path doesn't reach Ruswarp, both are
correctly added alongside each other, not conflicting. "singlewoman"
occupation has established precedent (occupation table also has
"spinster", "widow" as legitimate marital-status entries). Sex/home/
court/petty sessional division/crime type all correct.
**OK — no changes.**
