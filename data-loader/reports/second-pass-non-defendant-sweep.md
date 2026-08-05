# Second-pass sweep: non-defendant person completeness

Started 2026-08-05, triggered by a finding at record 1101 of the main
restart-2 audit pass: `sex` was never being checked for non-defendant
roles (informant, victim, witness, landowner, licensee, spouse, child,
etc.) with the same rigor as for defendants -- a structural gap, since
the original extraction schema (`ExtractedInvolvedPerson` in
`extraction_schema.py`) never even requested `sex` outside the
defendant role. A follow-up rigorous spot-check (20 random non-defendant
people, cross-checked against their own record's raw_record text) also
found two further confirmed bugs in this same population:
- Licensees/premises-owners mislabeled as generic "informant" with no
  occupation captured, when the record's own text names them as "the
  licensed premises of X" (confirmed in records 2888, 3265, 3550, 5219;
  corpus-wide scope: only 103/253 "licensed premises of X" mentions
  correctly got the "licensee" occupation).
- Titled names dumped whole into `last_name` with no title/first_name
  split (confirmed: "Sir George Elliot", records 6174/6181; corpus-wide
  scope: 12 confirmed instances of Sir/Lord/Lady/Rev/Dr/Colonel/
  Captain/Major titles not split out).

New standing rule written into `audit-rulebook.md` (rule 7): all
inferable fields, for every linked entity, every record, every time --
not just the defendant. Boundary unchanged: only fill a field when the
record's own text (or an established, precedent-checked inference
convention) supports it; a genuinely silent field stays null.

**Scope of this sweep**: the 479 already-swept records (id <= 1100,
main restart-2 pass) that have at least one non-defendant person (608
distinct non-defendant people, 609 person-role rows total). This does
NOT re-verify defendant/location/crime_type/related_conviction fields
already rigorously checked in the main pass -- only non-defendant
person completeness (sex, occupation, home, name components, role
correctness).

Full id list saved to `/tmp/second_pass_ids.txt` for reference (not
committed, regenerable via: `SELECT DISTINCT summary_conviction_id
FROM summary_conviction_person WHERE summary_conviction_id <= 1100 AND
role != 'defendant' ORDER BY summary_conviction_id;`).

---

## Record 2

"Summary conviction of William Tooley of Liverton Mines miner for
trespassing in the daytime in search of conies on a piece of land in
the possession and occupation of Sir Charles Mark Palmer. Offence
committed at the township of Roxby on 26 September 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- landowner
Sir Charles Mark Palmer (person 6483): title="Sir", first_name
="Charles", middle_name="Mark", last_name="Palmer", sex=male, all
correctly captured. No home/occupation stated for him in text,
correctly absent (not fabricated). Useful comparison point: this
confirms the "Sir George Elliot" title-mangling bug (found earlier at
records 6174/6181) is inconsistent/behavioral, not a universal
failure -- the extraction sometimes correctly splits a titled name and
sometimes doesn't.

**OK — no changes.**

---

## Record 3

Same incident as record 2 (Jonathan Agar, same landowner Sir Charles
Mark Palmer, same date/location) -- landowner (person 6484) correctly
distinct person row, title/first/middle/last/sex all correctly
captured, matching record 2.

**OK — no changes.**

---

## Record 4

Same incident again (John Marley, same landowner Sir Charles Mark
Palmer, same date/location) -- landowner (person 6485) correctly
distinct row, all fields correctly captured.

**OK — no changes.**

---

## Record 7

"Summary conviction of Robert Ross of the township of Whitby fish
packer for being drunk on the licensed premises of Thomas Wadsworth
and refusing to leave when asked by William Dobson acting sergeant of
police Offence committed at the township of Whitby on 6 October 1888.
Whitby Strand Petty Sessional division - case heard at Whitby" --
police informant William Dobson (person 6487), home Whitby, occupation
"acting sergeant of police", sex male, all correctly captured. Thomas
Wadsworth (person 6486), the licensed-premises owner, had role
"premises owner" (a one-off variant -- checked precedent, only 1 row
corpus-wide uses this exact label) and no occupation captured at all,
despite the established convention elsewhere (records 1017/1053/1085/
1088/1091) being role="licensee" + occupation="licensee" for this
exact phrasing pattern. Same underlying bug class as the
already-confirmed licensee-mislabeling issue (2888/3265/3550/5219),
just a different mislabel ("premises owner" instead of "informant").

**FIXED — normalized role from "premises owner" to "licensee" and
added missing occupation "licensee" for Thomas Wadsworth (person
6486).**

---

## Record 9

"Summary conviction of John Parkin of the Old Post Office Yard in the
township of Whitby for not sending his son George Parkin to school.
Offence committed in the Whitby Strand School Board district on 5
October 1888. Case heard at Whitby" -- child George Parkin (person
6488), role="child", sex already correctly male (unambiguous name),
no occupation/home fabricated (none stated for a child). Note: same
truancy-son pattern used role="child" here vs "unspecified" at records
1578/5997 -- a role-label inconsistency worth a precedent sweep later,
but not urgent since "child" (48 rows corpus-wide) appears to be the
more established label, not clearly wrong here.

**OK — no changes.**

---

## Record 23

"Summary conviction of Charles Allison of Clark's Yard in the
township of Whitby for not sending his son George Allison to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby" -- child George Allison (person
6489), role="child", sex already correctly male. No occupation/home
fabricated.

**OK — no changes.**

---

## Record 24

"Summary conviction of Martha Arnold of Renwick's Yard in the
township of Whitby for not sending her son Miles Arnold to school.
Offence committed in the Whitby Strand School Board district on 26
October 1888. Case heard at Whitby" -- child Miles Arnold (person
6490), role="child", sex already correctly male. No occupation/home
fabricated.

**OK — no changes.**

---

## Record 28

"Summary conviction of Maria Castello wife of Thomas Castello of the
township of Whitby jet worker for assaulting Mary Howard. Offence
committed at the township of Whitby on 8 November 1888. Whitby Strand
Petty Sessional division - case heard at Whitby" -- husband Thomas
Castello (person 6492), home Whitby, occupation jet worker, sex male,
all correctly captured. Victim Mary Howard (person 6491), sex already
correctly female. No fixes needed.

**OK — no changes.**

---

## Record 31

"Summary conviction of Alfred Ford of the township of Whitby caulker
for assaulting John Carpenter one of the constables of the North
Riding in the execution of his duty. Offence committed at the
township of Whitby on 10 November 1888. Whitby Strand Petty Sessional
division - case heard at Whitby" -- victim John Carpenter (person
6493), constable, sex already correctly male, home not stated
(correctly absent). No fixes needed.

**OK — no changes.**

---

## Record 39

"Summary conviction of James Holden of the township of Whitby
botanist for being drunk on the licensed premises of William Willison
and refusing to leave when asked by William Dobson acting sergeant of
police. Offence committed at the township of Whitby on 26 November
1888. Whitby Strand Petty Sessional division - case heard at Whitby"
-- licensee William Willison (person 6494), home Whitby, occupation
"licensee", sex male, correctly captured (contrast with record 7's
mislabeled Thomas Wadsworth). Police officer William Dobson (person
6495), home Whitby, occupation "acting sergeant of police", sex male,
correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 47

"Summary conviction of John Holmes of the township of Whitby jet
worker for being drunk on the licensed premises of Colin Cowan.
Offence committed at the township of Hawsker cum Stainsacre on 23
December 1888. Whitby Strand Petty Sessional division - case heard at
Whitby" -- licensee Colin Cowan (person 6496), role="licensee of
premises" (a valid existing variant, precedent-checked: 2 rows
corpus-wide), sex already correctly male, no home stated (correctly
absent). Occupation was missing despite the role clearly implying
"licensee" -- same missing-occupation pattern as record 7.

**FIXED — added missing occupation "licensee" for Colin Cowan
(person 6496).**

---

## Record 48

"Summary conviction of William Holmes of the township of Whitby jet
worker for being drunk on the licensed premises of Colin Cowan.
Offence committed at the township of Hawsker cum Stainsacre on 23
December 1888. Whitby Strand Petty Sessional division - case heard at
Whitby" -- licensee Colin Cowan (person 6497, distinct from record
47's Colin Cowan per no-cross-conviction-merge), role="licensee of
premises", sex already correctly male. Occupation was missing.

**FIXED — added missing occupation "licensee" for Colin Cowan
(person 6497).**

**Targeted sweep note**: after finding this pattern 3 times (records
7, 47, 48), ran a full check of every "licensed premises of X" mention
in the already-swept range (id <= 1100): 39 total, all now correctly
labeled role="licensee"/"licensee of premises" and all now have
occupation="licensee" captured. This specific sub-pattern is fully
clean for id <= 1100. (Corpus-wide, outside this range, up to ~150
more may remain per the earlier scoping check -- to be handled when
the linear audit reaches them, or via a separate explicitly-approved
sweep.)

---

## Record 49

"Summary conviction of Robert Steel of the township of Whitby
fisherman for being drunk on the licensed premises of William Massey
and refusing to leave when asked by the said William Massey. Offence
committed at the township of Whitby on 26 December 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- licensee
William Massey (person 6498), home Whitby, occupation "licensee", sex
male, all correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 50

"Summary conviction of Francis Fewster of the township of Whitby jet
worker for being drunk on the licensed premises of Joseph Shaw and
refusing to leave when asked by the said Joseph Shaw Offence
committed at the township of Whitby on 27 December 1888. Whitby
Strand Petty Sessional division - case heard at Whitby" -- licensee
Joseph Shaw (person 6499), home Whitby, occupation "licensee", sex
male, all correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 52

"Summary conviction of Esther Hill wife of Andrew Hill of the
township of Whitby jet worker for being drunk and disorderly in
Church Street. Offence committed at the township of Whitby on 22
December 1888. Whitby Strand Petty Sessional division - case heard
at Whitby" -- husband Andrew Hill (person 6500), home Whitby,
occupation jet worker, sex male, all correctly captured. Same names
as record 1008's Esther/Andrew Hill but a different date -- correctly
a distinct person row (repeat-offender pattern, not a merge issue).
Role label "husband" (1 row corpus-wide) is another variant of the
spouse-role fragmentation already noted at record 52's peers
("spouse of offender" 308 rows, "husband of offender" 32, "husband of
defendant" 2) -- logged for the role-label consistency watch list, not
fixed now per the case-by-case role-normalization precedent.

**OK — no changes** (completeness fields all correct; role-label
fragmentation noted separately, not actioned).

---

## Record 55

"Summary conviction of Robert Tinley of the township of Whitby joiner
for assaulting Hannah Tinley. Offence committed at the township of
Ruswarp on 6 January 1889 Whitby Strand Petty Sessional division -
case heard at Whitby" -- victim Hannah Tinley (person 6501), sex
already correctly female. No occupation/home stated for her, correctly
absent. No fixes needed.

**OK — no changes.**

---

## Record 56

"Summary conviction of Robert Tinley of the township of Whitby joiner
for assaulting John O'Conner. Offence committed at the township of
Whitby on 6 January 1889 Whitby Strand Petty Sessional division -
case heard at Whitby" -- victim John O'Conner (person 6502), sex
already correctly male. No occupation/home stated, correctly absent.
Same defendant/date as record 55 (multiple charges, one arrest) --
related_conviction linking is main-pass scope, not re-checked here.
No fixes needed.

**OK — no changes.**

---

## Record 67

"Summary conviction of Margaret Sparks of Baxtergate in the township
of Whitby for not sending her son Harry Readman Sparks to school
Offence committed in the Whitby Strand School Board district on 18
January 1889. Case heard at Whitby" -- child Harry Readman Sparks
(person 6503), role="child not sent to school" (third variant of the
truancy role label seen so far, alongside "child" and "unspecified"),
sex already correctly male, middle name captured. No occupation/home
fabricated. No fixes needed.

**OK — no changes.**

---

## Record 68

"Summary conviction of Robert Page of Hospital Yard in the township
of Whitby for not sending his son William Robert Page to school
Offence committed in the Whitby Strand School Board district on 18
January 1889. Case heard at Whitby" -- child William Robert Page
(person 6504), role="child not sent to school", sex already correctly
male, middle name captured. No fixes needed.

**OK — no changes.**

---

## Record 77

"Summary conviction of George Duncanson of Timber Hill in the
township of Hawsker cum Stainsacre for not sending his daughter
Elizabeth Duncanson to school Offence committed in the Whitby Strand
School Board district on 8 February 1889. Case heard at Whitby" --
child Elizabeth Duncanson (person 6505), role="child not sent to
school", sex already correctly female. No fixes needed.

**OK — no changes.**

---

## Record 79

"Summary conviction of Ransome Corser of Timber Hill in the township
of Hawsker cum Stainsacre for not sending his daughter Mary Ann
Corser to school Offence committed in the Whitby Strand School Board
district on 19 February 1889. Case heard at Whitby" -- child Mary Ann
Corser (person 6506), role="child not sent to school", sex already
correctly female, middle name captured. No fixes needed.

**OK — no changes.**

---

## Record 132

"Summary conviction of Robert Arnold of the township of Whitby
soldier for assaulting Thomas Watson; on the oath of Joseph Philpot
of the township of Whitby jet worker. Offence committed at the
township of Whitby on 11 November 1876. Whitby Strand - case heard at
Whitby" -- victim Thomas Watson (person 6507), sex already correctly
male, no home stated (correctly absent). Witness Joseph Philpot
(person 6508), home Whitby, occupation jet worker, sex male, all
correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 134

"Summary conviction of William Burkit of Glasgow in North Britain for
distributing hand bills or advertisements for selling drapery goods
at the King's Head Inn in Church Street in Whitby under the name of
John Spark and Co from Glasgow without the words "Licensed Hawker"
and the number on his licence being inserted in the advertisements;
on the information of Joseph Thornhill" -- informant Joseph Thornhill
(person 6509), sex now correctly male (fixed earlier in this session
during the initial 24-person scoping fix). Impersonated entity "John
Spark and Co" (person 10340) correctly has no sex (a company, not a
person) -- matches the established impersonation-handling convention.
No fixes needed.

**OK — no changes.**

---

## Record 135

"Summary conviction of Harris Lyon for trading as a hawker without a
certificate, selling six silver teaspoons to William Bell of the
parish of Whitby excise officer; on the information of John Meek.
Offence committed at Whitby. With bill of prosecution expenses dated
24 September 1814 and an undated note relating to Lyon's fine" --
buyer William Bell (person 6511), home Whitby, occupation excise
officer, sex male (fixed earlier). Informant John Meek (person 6510),
sex male (fixed earlier), no home/occupation stated for him,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 136

"Summary conviction of James Benson, John Barker, James Robinson and
Margaret his wife, and Joseph Grotes and Mary his wife, for vagrancy;
on the information of John Morley constable of the township of
Whitby. Offence committed at the township of Whitby on 26 January
1822. Case heard at Whitby" -- informant John Morley (person 6512),
home Whitby, occupation "constable of the township of Whitby", sex
male (fixed earlier), all correctly captured. All 6 named parties are
role=defendant (main-pass scope, not re-checked here) -- only
non-defendant is the informant. No fixes needed.

**OK — no changes.**

---

## Record 137

"Summary conviction of Francis Thompson of the township of Hawsker
cum Stainsacre farmer for driving two horses on the Whitby and
Pickering railway; on the information of Alfred Jefferson of the
township of Ruswarp collector of tolls on the Whitby and Pickering
railway. Offence committed at the township of Hawsker cum Stainsacre
on 1 July 1839. Case heard at Whitby" -- informant Alfred Jefferson
(person 6513), home Ruswarp, occupation "collector of tolls on the
Whitby and Pickering railway", sex male (fixed earlier), all correct.
No fixes needed.

**OK — no changes.**

---

## Record 138

"Summary conviction of Thomas Argument of the township of Whitby
hawker for encamping on the public highway; on the information of
William Barton. Offence committed at the township of Sand Hutton on
28 August 1844. Case heard at Lobster House in the township of
Claxton" -- informant William Barton (person 6514), sex male (fixed
earlier), no home/occupation stated for him, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 140

"Summary conviction of Mary Egins, Peter Kelley, James Coil, John
Camble and John Thompson for vagrancy; on the information of John
Morley constable of the township of Whitby. Offence committed at the
township of Whitby in February 1822. Case heard at Whitby" --
informant John Morley (person 6515, distinct from record 136's Morley
per no-cross-conviction-merge), home Whitby, occupation "constable of
the township of Whitby", sex male, all correct. No fixes needed.

**OK — no changes.**

---

## Record 141

Same railway-toll incident type as record 137 (George Jackson, same
informant Alfred Jefferson, same date, correctly distinct person row)
-- informant Alfred Jefferson (person 6516), home Ruswarp, occupation
"collector of tolls on the Whitby and Pickering railway", sex male,
all correct. No fixes needed.

**OK — no changes.**

---

## Record 142

"Summary conviction of Jane Harrison of the township of Whitby
singlewoman for not maintaining her three bastard children, namely
Dorothy aged 10 years, William aged 7 years, and Jane aged 5 years,
whereby they became chargeable to the township of Whitby. Offence
committed at the township of Whitby on 6 April 1844. Case heard at
Whitby" -- three children Dorothy/William/Jane Harrison (persons
6517/6518/6519), role="unspecified" (no established "dependent child"
role for this poor-law context, not clearly wrong), sex correctly set
for all three from unambiguous names, and birth_year correctly derived
from stated ages (1834/1837/1839 = 1844 minus 10/7/5). No fixes
needed.

**OK — no changes.**

---

## Record 143

"Summary conviction of George Watson of the township of Whitby
labourer for cutting down 25 larch trees, the property of Henry
Linton of the township of Newholm cum Dunsley spirit merchant, and
causing ten-shillingsworth of damage. Offence committed at the
township of Hawsker cum Stainsacre on 29 July 1853. Case heard at
Whitby" -- victim Henry Linton (person 6520), home
Newholm-cum-Dunsley, occupation spirit merchant, sex male (fixed
earlier), all correct. No fixes needed.

**OK — no changes.**

---

## Record 146

Same railway-toll incident type (Thomas Beeforth the younger, same
informant Alfred Jefferson, same date) -- informant (person 6521),
home Ruswarp, occupation correctly captured, sex male (fixed
earlier). No fixes needed.

**OK — no changes.**

---

## Record 148

"Summary conviction of John Dixon of the township of Whitby labourer
for exposing himself and using very obscene and indecent language in
St Ann's Staith; on the oath of Edward Barker of the township of
Whitby assistant constable. Offence committed at the township of
Whitby on 4 August 1853. Case heard at Whitby" -- informant Edward
Barker (person 6522), home Whitby, occupation assistant constable, sex
male (fixed earlier), all correct. No fixes needed.

**OK — no changes.**

---

## Record 153

"Summary conviction of Thomas Rodgers of the township of Hinderwell
miner for assaulting Michael Theaker; on the oath of the said Michael
Theaker of the township of Hinderwell constable. Offence committed at
the township of Hinderwell on 1 September 1853. Case heard at Whitby"
-- victim Michael Theaker (person 6523), home Hinderwell, occupation
constable, sex male (fixed earlier), all correct. No fixes needed.

**OK — no changes.**

---

## Record 157

"Summary conviction of John Humphrey apprentice to Harrison Waller of
the township of Lythe shoemaker for misconduct and ill-behaviour
towards his master. In particular, on 1 November 1844 Humphrey
absented himself from his master's service without leave, and
continued absent for a week. Case heard at Whitby" -- master Harrison
Waller (person 6524), home Lythe, occupation shoemaker, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 158

"Summary conviction of Martha Dixon of the township of Whitby
singlewoman for assaulting Sarah Hardcastle; on the oath of the said
Sarah Hardcastle wife of William Hardcastle of the township of Whitby
labourer. Offence committed at the township of Whitby on 17 September
1853. Case heard at Whitby" -- victim Sarah Hardcastle (person 6525),
home Whitby, sex female. Husband William Hardcastle (person 6526),
home Whitby, occupation labourer, sex male, all correctly captured.
No fixes needed.

**OK — no changes.**

---

## Record 161

"Summary conviction of William Bell of the township of Egton butcher
for assaulting Edward Turner of the township of Whitby cabinet maker,
striking him several times on the face with his fist. Offence
committed at the township of Whitby on 6 July 1839. Division of
Whitby Strand - case heard at Whitby" -- victim Edward Turner (person
6527), home Whitby, occupation cabinet maker, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 163

"Summary conviction of William Peart of the township of Whitby
fisherman for assaulting Matthew Leadley; on the oath of the said
Matthew Leadley of the township of Whitby mariner. Offence committed
at the township of Whitby on 27 September 1853. Case heard at
Whitby" -- victim Matthew Leadley (person 6528), home Whitby,
occupation mariner, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 166

"Summary conviction of Edward Smith Wormald of the township of
Newholm cum Dunsley farmer for assaulting William Thompson of the
township of Whitby butcher, by striking him several times on the arms
and shoulders with a stick. Offence committed at the township of
Whitby on 16 August 1839. Division of Whitby Strand - case heard at
Whitby" -- victim William Thompson (person 6529), home Whitby,
occupation butcher, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 167

"Summary conviction of John Reed of the township of Whitby blacksmith
for assaulting Jane Reed his wife, by striking her several times on
the head with great force and violence. Offence committed at the
township of Whitby on 6 September 1844. Case heard at Whitby" --
victim Jane Reed (person 6530), sex already correctly female, "wife"
relationship correctly linked to John Reed. No occupation/home stated
for her, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 168

"Summary conviction of Robert Brooks of the township of Eskdaleside
miner for having eight salmon trout in his possession which had been
caught in the river Esk during the close season; on the complaint of
William Wilkinson the younger of the township of Whitby superintendent
of police. Offence committed at the township of Eskdaleside on 8
October 1853. Case heard at Whitby" -- complainant William Wilkinson
(person 6531), name_postfix "the younger" correctly captured, home
Whitby, occupation superintendent of police, sex male, all correct.
No fixes needed.

**OK — no changes.**

---

## Record 171

"Summary conviction of William Pinkney Whitby shipwright and John
Young sawyer, both of Whitby, for taking other than by angling five
salmon trout value 5s, from the river Esk where John Elgie of the
township of Ruswarp miller had a private right of fishing. Offence
committed at the township of Sneaton on 10 August 1839. Case heard at
Whitby" -- fishing-rights owner John Elgie (person 6532), home
Ruswarp, occupation miller, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 176

"Summary conviction of Elizabeth Wood for being drunk; on the
information of William Taylor of the township of Whitby mariner.
Offence committed at the township of Whitby on 11 August 1839. Case
heard at Whitby" -- informant William Taylor (person 6533), home
Whitby, occupation mariner, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 177

"Summary conviction of George Robinson for entering at night on a
piece of woodland called Overdale Plantation belonging to and
occupied by the Marquis of Normanby, ad taking three pheasants
Offence committed at the township of Lythe at 11 p.m. on 23 January
1845. Case heard at Whitby" -- landowner Constantine Henry Phipps
(person 6534), office="1st Marquess of Normanby..." (peerage
precedent applied correctly), sex already correctly male. No
home/occupation fabricated (office covers his identity). No fixes
needed.

**OK — no changes.**

---

## Record 178

"Summary conviction of Ralph Storr apprentice to Sampson Storm of the
township of Ruswarp ship owner for absconding from the service of his
master. Offence committed on 7 April 1857. Case heard at Whitby" --
master Sampson Storm (person 6535), home Ruswarp, occupation ship
owner, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 181

"Summary conviction of Charles Alcrow apprentice to Thomas Marwood
the younger of the township of Ruswarp shipowner for absenting
himself from his master's service. Offence committed on 25 September
1839. Case heard at Whitby" -- master Thomas Marwood (person 6536,
"the younger" postfix correctly captured), home Ruswarp, occupation
shipowner, sex male (fixed earlier). No fixes needed for this pass.

**OK — no changes.**

---

## Record 184

"Summary conviction dated 14 May 1818 of John Gardner of Hexham for
distributing handbills advertising a sale by auction, at the house of
William Harland at the sign of the Butchers Arms near the Fish Market
at Whitby... Information given by Henderson Skaife and John Bulmer.
Case heard at Whitby. Information dated 18 May 1818 of David Hartley
of Whitby pawnbroker, witness in the case against John Gardner" --
householder William Harland (person 6537), home Whitby, sex male, no
occupation stated (correctly absent). Informants Henderson Skaife
(6538) and John Bulmer (6539), sex already correctly male, no home/
occupation stated (correctly absent). Witness David Hartley (6540),
home Whitby, occupation pawnbroker, sex male, all correct. No fixes
needed.

**OK — no changes.**

---

## Record 186

"Summary conviction of Margaret Clark of the township of Whitby
singlewoman for assaulting John Adamson of the township of Whitby
shoemaker by striking him several times on the shoulder with a
poker. Offence committed at the township of Whitby on 26 September
1839. Whitby Strand division - case heard at Whitby" -- victim John
Adamson (person 6541), home Whitby, occupation shoemaker, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 191

"Summary conviction of David Elders of the township of Whitby pilot
for refusing to unmoor the vessel called the Canegrove of Whitby when
directed to do so by William Clark harbour master. Offence committed
at the township of Whitby on 15 April 1839. Case heard in the
division of Whitby Strand" -- official William Clark (person 6542),
occupation harbour master, sex already correctly male; no home stated
for him, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 192

"Summary conviction of Edward Binns of the township of Whitby joiner
for assaulting Emma Binns his wife by striking her several times on
the head with great force and violence. Offence committed at the
township of Whitby on 26 February 1845. Division of Whitby Strand -
case heard at Whitby" -- victim Emma Binns (person 6543), sex already
correctly female, "wife" relationship correctly linked. No fixes
needed.

**OK — no changes.**

---

## Record 193

"Summary conviction of Henry Raw of the township of Whitby jeweller
for assaulting Margaret Croft; on the oath of the said Margaret Croft
of the township of Whitby widow. Offence committed at the township of
Whitby on 26 March 1857. Case heard at Whitby" -- victim Margaret
Croft (person 6544), home Whitby, occupation widow, sex already
correctly female, all correct. This is the record referenced in the
tracked-notes marital-status gap history as previously misread by a
wide-join query; confirmed genuinely fixed now.

**OK — no changes.**

---

## Record 196

"Summary conviction of John Laray hawker for selling books without a
licence; on the information of Robert Kirby. Offence committed at the
township of Whitby on 7 May 1839. Case heard at Whitby" -- informant
Robert Kirby (person 6545), sex male (fixed earlier), no home/
occupation stated for him, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 197

"Summary conviction of Benjamin Granger of the township of Whitby
mariner for having the charge of the ship called the "William" and
refusing to take up the anchor when directed by William Clark harbour
master of the port of Whitby. Offence committed at the township of
Whitby on 7 March 1845" -- official William Clark (person 6546,
distinct from record 191's William Clark per no-cross-conviction-
merge), occupation harbour master, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 198

"Summary conviction of George Laverick of the township of Whitby
postman for being drunk in possession of a letter addressed to Edmund
Hall of Church Street in Whitby; on the oath of George Lee of the
township of Whitby letter carrier. Offence committed at the parish of
Whitby on 17 April 1857. Case heard at Whitby" -- letter addressee
Edmund Hall (person 6547), home correctly resolved to street-level
"Church Street", sex already correctly male, no occupation stated
(correctly absent). Witness George Lee (person 6548), home Whitby,
occupation letter carrier, sex male, all correct. No fixes needed.

**OK — no changes.**

---

## Record 201

"Summary conviction of James Ward of the township of Aislaby for
assaulting Ralph Dowson of the township of Goathland labourer by
striking him on the face with his fist several times. Offence
committed at the township of Aislaby on 8 May 1839. Case heard at
Whitby" -- victim Ralph Dowson (person 6549), home Goathland,
occupation labourer, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 205

"Summary conviction of David Watson of Whitby hatter for breaking
three squares of glass value 5s in the window of Elen Stirling's
house. Offence committed at Whitby at midnight on Saturday 15 June
1822" -- property owner Elen Stirling (person 6550), sex already
correctly female, no home/occupation stated for her, correctly
absent. No fixes needed.

**OK — no changes.**

---

## Record 206

"Summary conviction of William Pearson apprentice to William Burn of
the township of Whitby cabinet maker for absenting himself without
leave for three days. Offence committed on 3 June 1839. Case heard
at Whitby" -- master William Burn (person 6551), home Whitby,
occupation cabinet maker, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 208

"Summary conviction of William Gash and Sidement Gardiner, both of
the township of Hinderwell miners, for threatening Michael Hodgson
and William Gazzard, miners employed by William Henry Palmer, and
forcing them to leave his employment; on the oath of Joseph Fairley
of the township of Hinderwell miner. Offence committed at the
township of Hinderwell on 27 May 1857. Case heard at Whitby" --
victims Michael Hodgson (6552) and William Gazzard (6553), both
occupation miner, sex male, no home stated (correctly absent).
Employer William Henry Palmer (6554), sex male, no home/occupation
stated (correctly absent, nothing more said about him). Informant
Joseph Fairley (6555), home Hinderwell, occupation miner, sex male.
All correct. No fixes needed.

**OK — no changes.**

---

## Record 210

"Summary conviction of Caral otherwise Charles Anderson for obtaining
money and clothes from Lars Kiersta of Whitby tailor by falsely
pretending to be a shipwrecked sailor. Offence committed at the
township of Whitby on 18 February 1824" -- victim Lars Kiersta (person
6556), home Whitby, occupation tailor, sex already correctly male
(foreign name correctly handled). Defendant's alias "Charles Anderson"
also correctly captured (outside strict scope but verified in
passing). No fixes needed.

**OK — no changes.**

---

## Record 211

Same master as record 206 (William Burn, correctly distinct person
row) -- master (person 6557), home Whitby, occupation cabinet maker,
sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 213

"Summary conviction of William O'Grady late of the township of
Hinderwell labourer for assaulting Philip Pigg; on the oath of the
said Philip Pigg of the township of Hinderwell police constable.
Offence committed at the township of Hinderwell on 1 June 1857. Case
heard at Whitby" -- victim Philip Pigg (person 6558), home Hinderwell,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 216

"Summary conviction of George Bolton for being drunk; on the
information of Thomas Linskill of the township of Whitby policeman.
Offence committed at the township of Whitby on 2 June 1839. Case
heard at Whitby" -- informant Thomas Linskill (person 6559), home
Whitby, occupation policeman, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 218

"Summary conviction of William Seymour of the township of Hinderwell
Innkeeper for opening his house for the sale of fermented liquors
before 6 p.m.; on the information and oath of Philip Pigg of the
township of Hinderwell police constable. Offence committed at the
township of Hinderwell on 31 May 1857. Case heard at Whitby" --
informant Philip Pigg (person 6560, distinct from record 213's Philip
Pigg per no-cross-conviction-merge), home Hinderwell, occupation
police constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 223

"Summary conviction of George Lockey of the township of Whitby for
being drunk; on the information of William Wilkinson of the township
of Whitby" -- informant William Wilkinson (person 6561), home Whitby,
sex already correctly male, no occupation stated (correctly absent).
No fixes needed.

**OK — no changes.**

---

## Record 224

"Summary conviction of William Bell, William Winspear and Joseph
Messenger for trespassing with three greyhounds in the daytime in
search of game on the lands of Robert Carey Elwes esquire. Offence
committed in the township of Egton on 28 September 1833. Case heard
at Whitby" -- landowner Robert Carey Elwes (person 6562), sex male
(fixed earlier), "esquire" correctly ignored per established
convention, no home/occupation stated for him, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 225

"Summary conviction of Patrick Caulder Cawney of the city of Limerick
coachmaker for assaulting William Wilkinson of the township of Whitby
police officer by striking him on the head with his hands and
kicking him on the body with his feet. Offence committed at the
township of Egton on 1 July 1842. Case heard at Whitby" -- victim
William Wilkinson (person 6563), home Whitby, occupation police
officer, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 226

"Summary conviction of Jane Thompson of the township of Whitby widow
for assaulting Ellen Moore; on the oath of the said Ellen Moore wife
of Joseph Moore of the township of Whitby widow [sic] Offence
committed at the township of Whitby on 31 May 1857. Case heard at
Whitby" -- victim Ellen Moore (person 6564), home Whitby, occupation
"widow", sex already correctly female. Spouse Joseph Moore (person
10189), home Whitby, sex male, correctly captured. The source's own
[sic]-flagged contradiction ("wife of Joseph Moore" + "widow" in the
same sentence) is already documented in `anomalies` and both facts
preserved as stated, not silently resolved -- correct handling. No
fixes needed.

**OK — no changes.**

---

## Record 229

"Summary conviction of John Pearson of the township of Whitby
labourer for assaulting Richard Cockerill. Offence committed at the
township of Whitby on 30 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- victim Richard Cockerill (person
6565), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 232

"Summary conviction of Charles Goldsmith for assaulting William
Lynass of [Whitby] grocer. Offence committed at Whitby on the evening
of Sunday 19 January 1834. Whitby Strand division - case heard at
Whitby" -- victim William Lynass (person 6566), home Whitby (bracket
notation correctly resolved), occupation grocer, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 234

"Summary conviction of Catherine Brown wife of George Brown late of
the township of Whitby labourer for using obscene and indecent
language in Flowergate; on the oath of Robert Nickson of the township
of Whitby constable. Offence committed at the township of Whitby on
14 June 1857. Case heard at Whitby" -- husband George Brown (person
6567), home Whitby, occupation labourer, sex male. Informant Robert
Nickson (person 6568), home Whitby, occupation constable, sex male.
All correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 236

"Summary conviction of John Eccles of the township of Whitby sailor
for assaulting Ann Hustler; on the oath of [blank] Smith of the
township of Whitby. Offence committed at the township of Whitby on 20
November 1876. Whitby Strand - case heard at Whitby" -- victim Ann
Hustler (person 6569), sex already correctly female, no home/
occupation stated (correctly absent). Witness [blank] Smith (person
6570), home Whitby, correctly no first_name/sex (matches source's own
"[blank]" notation, not fabricated). No fixes needed.

**OK — no changes.**

---

## Record 239

"Summary conviction of James Smith, James Broughton, Thomas Hart and
Mary Hart for begging; on the information of John Morley of Whitby
constable. Offence committed at the township of Whitby on 3 October
1818" -- informant John Morley (person 6571, distinct row per
no-cross-conviction-merge), home Whitby, occupation constable, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 246

"Summary conviction of Annie Booth of the township of Fylingdales
singlewoman for assaulting Emma Coates. Offence committed at the
township of Fylingdales on 16 July 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- victim Emma Coates
(person 6572), sex already correctly female, no home/occupation
stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 247

"Summary conviction of Margaret Bretton, Isabella Bretton, Margaret
Bretton junior and Rebecca Robinson for going door-to-door as petty
chapmen without being licensed; on the information of John Morley of
Whitby constable. Offence committed at the township of Whitby on 3
October 1818" -- informant John Morley (person 6573, distinct row),
home Whitby, occupation constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 249

"Summary conviction of James Toms late of the township of Whitby
hawker for selling pots without a licence; on the information of
Robert Kirby of Whitby sub-distributor of stamps. The offence was
committed at the township of Fylingdales on 14 February 1834. Case
heard at Whitby" -- informant Robert Kirby (person 6574, distinct
from record 196's Robert Kirby), home Whitby, occupation
"sub-distributor of stamps", sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 250

"Summary conviction of David Storrey of the township of Whitby
blacksmith for assaulting Elizabeth Trueman wife of Charles Trueman
of the township of Whitby mariner by striking her on the face and
body with his hands. Offence committed at the township of Whitby on
19 July 1842. Case heard at Whitby" -- victim Elizabeth Trueman
(person 6575), home Whitby, sex female. Spouse Charles Trueman
(person 10190), home Whitby, occupation mariner, sex male. All
correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 252

"Summary conviction of John Bakehouse of the township of Whitby jet
worker for being drunk on the licensed premises of Sovina Short and
refusing to leave when asked by Thomas Ridley a constable of the
North Riding. Offence committed at the township of Whitby on 24
December 1869. Whitby Strand - case heard at Whitby" -- licensee
Sovina Short (person 6576), role="licensee", occupation "licensee",
sex female, no home stated (correctly absent). Informant Thomas
Ridley (person 6577), occupation "constable of the North Riding", sex
male, no home stated (correctly absent). No fixes needed.

**OK — no changes.**

---

## Record 256

Same informant pattern as record 249 (Robert Kirby, sub-distributor
of stamps, same date -- likely same real person but correctly a
distinct row per conviction) -- person 6578, home Whitby, occupation
correctly captured, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 258

"Summary conviction of John Ryan of the township of Whitby tailor for
assaulting John Clemmett; on the oath of the said John Clemmett of
the township of Hawsker cum Stainsacre labourer. Offence committed at
the township of Whitby on 3 November 1859. Case heard at Whitby" --
victim John Clemmett (person 6579), home Hawsker-cum-Stainsacre,
occupation labourer, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 260

Same informant pattern as records 249/256 (Robert Kirby, sub-
distributor of stamps) -- person 6580, home Whitby, occupation
correctly captured, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 264

"Summary conviction of Thomas Howard of the township of Whitby
fisherman for assaulting Mary Jane Howard. Offence committed at the
township of Whitby on 29 October 1876. Whitby Strand - case heard at
Whitby" -- victim Mary Jane Howard (person 6581), sex already
correctly female, no home/occupation stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 265

"Summary conviction of Mary Pritchard wife of Thomas Pritchard of the
township of Ruswarp pedlar for being drunk and disorderly in St
Hilda's Terrace. Offence committed at the township of Ruswarp on 20
June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- spouse Thomas Pritchard (person 9898), home Ruswarp,
occupation pedlar, sex male, all correctly captured (verified earlier
in this session as the example shown to the user). No fixes needed.

**OK — no changes.**

---

## Record 267

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6582, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 271

"Summary conviction of James Winspear of the township of Whitby
fisherman for being drunk on the licensed premises of William
Dowthwaite and refusing to leave when asked by Thomas Merryweather a
police constable. Offence committed at the township of Whitby on 2
October 1876. Whitby Strand - case heard at Whitby" -- licensee
William Dowthwaite (person 6583), occupation "licensee", sex already
correctly male. Informant Thomas Merryweather (person 6584),
occupation police constable, sex male. Both correct. No fixes needed.

**OK — no changes.**

---

## Record 272

"Summary conviction of John Midgeley of the township of Hinderwell
fisherman for being drunk on the licensed premises of Robert
Ashworth. Offence committed at the township of Hinderwell on 10 June
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- licensee Robert Ashworth (person 6585), occupation "licensee", sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 275

"Summary conviction of Jeremiah Eskdale of the township of Whitby
block and mast maker for assaulting Ann Scott of the township of
Ruswarp singlewoman. Offence committed at the township of Whitby on 8
August 1842. Case heard at Whitby" -- victim Ann Scott (person 6586),
home Ruswarp, occupation singlewoman, sex already correctly female.
This is the original record where the marital-status occupation gap
was first discovered; confirmed genuinely fixed. No fixes needed.

**OK — no changes.**

---

## Record 277

"Summary conviction of George Patton of the township of Hinderwell
fisherman for assaulting George Taylor; on the oath of the said
George Taylor of the township of Hinderwell fisherman. Offence
committed at the township of Hinderwell on 19 December 1869. Whitby
Strand - case heard at Whitby" -- victim George Taylor (person 6587),
home Hinderwell, occupation fisherman, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 285

"Summary conviction of Douglas Munroe of the township of Ruswarp
hawker for being drunk on the licensed premises of William Knaggs and
refusing to leave when asked by Andrew Thompson a police constable;
on the oath of Andrew Thompson police constable for the North Riding.
Offence committed at the township of Ruswarp on 22 August 1876.
Whitby Strand - case heard at Whitby" -- licensee William Knaggs
(person 6588), occupation "licensee", sex male. Informant Andrew
Thompson (person 6589), occupation "police constable for the North
Riding", sex male. Both correct. No fixes needed.

**OK — no changes.**

---

## Record 287

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6590, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 288

"Summary conviction of John Swales of the township of Whitby
labourer for assaulting James Pearson of the township of Hawsker cum
Stainsacre labourer by striking him on the arm and body. Offence
committed at the township of Hawsker cum Stainsacre on 15 September
1842. Division of Whitby Strand - case heard at Whitby" -- victim
James Pearson (person 6591), home Hawsker-cum-Stainsacre, occupation
labourer, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 290

"Summary conviction of Hannah Palmer of the township of Whitby
singlewoman for being drunk; on the oath of [blank] Harnby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 8 October 1869. Whitby Strand - case heard at
Whitby" -- informant [blank] Harnby (person 6592), home Whitby,
occupation police constable, correctly no sex set (no first name or
pronoun in this record's own text) -- matches the corrected precedent
from the earlier "[blank] Selby" stray-sex case (record 674/734),
not a gap. No fixes needed.

**OK — no changes.**

---

## Record 291

"Summary conviction of George Harrison jet worker and Francis
Harrison stonemason, both of the township of Newholm cum Dunsley, for
trespassing in the daytime in search of conies in a close of land in
the possession and occupation of William Burnett. Offence committed
at township of Newholm cum Dunsley on 24 September 1876. Whitby
Strand - case heard at Whitby" -- landowner William Burnett (person
6593), sex already correctly male, no home/occupation stated,
correctly absent. Note: defendant "Francis Harrison" (male spelling)
correctly sex=male, consistent with the Francis/Frances spelling
convention noted earlier at record 5997. No fixes needed.

**OK — no changes.**

---

## Record 294

"Summary conviction of Elizabeth Wood of the township of Whitby
singlewoman for assaulting Sarah Hudson wife of John Hudson of the
township of Whitby labourer by striking her on the head with his
hands. Offence committed at the township of Whitby on 1 October 1842.
Division of Whitby Strand - case heard at Whitby" -- victim Sarah
Hudson (person 6594), home Whitby, sex female. Spouse John Hudson
(person 10191), home Whitby, occupation labourer, sex male. Both
correctly captured. Note: source text says "with his hands" despite
the defendant being female -- likely an authentic period scribal
quirk, not an extraction error; not actioned (outside this pass's
scope, and not a fabrication/loss issue). No fixes needed.

**OK — no changes.**

---

## Record 295

"Summary conviction of William Stephenson, Thomas Hebron and Isaac
Tose for assaulting John Grainger one of the constables for the North
Riding in the execution of his duty. Offence committed at the
township of Hinderwell on 9 November 1859. Case heard at Whitby" --
victim John Grainger (person 6595), constable, sex already correctly
male (directly named before "one of the constables"). No fixes
needed.

**OK — no changes.**

---

## Record 298

"Summary conviction of Thomas Crake the younger of the township of
Hinderwell fisherman for being drunk on the licensed premises of
Thomas Spink. Offence committed at the township of Hinderwell on 10
June 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- licensee Thomas Spink (person 6596), occupation
"licensee", sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 299

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6597, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 300

"Summary conviction of William Thompson of the township of Whitby
butcher for assaulting William Brunton of the township of Whitby
butcher by striking him several times on the body and kicking him
with his feet with great force and violence. Offence committed at
the township of Whitby on 29 September 1842. Division of Whitby
Strand - case heard at Whitby" -- victim William Brunton (person
6598), home Whitby, occupation butcher, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 301

Same incident as record 295 (John Grainger, same date/township,
constable, correctly distinct person row) -- sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 302

Same date/informant pattern as record 290 ([blank] Harnby, police
constable, distinct person row) -- correctly no sex set (no first
name/pronoun stated). No fixes needed.

**OK — no changes.**

---

## Record 305

"Summary conviction of Christopher White of Whitby common brewer for
trespassing in search or pursuit of game on waste or moor land.
Offence committed on 12 August 1834 at the township of Moorsholm in
the manor of Skelton of which John Wharton esquire is lord of the
manor. Case heard at Guisborough" -- landowner John Wharton (person
6601), sex already correctly male, "esquire" correctly ignored. But
"lord of the manor of Skelton" was stored as an `occupation` string
rather than the `office` field, violating the established convention
(memory: lord-of-the-manor phrases go in `person.office`, per the
George Cholmley precedent at record 372). Checked: only this 1 person
used this exact occupation string, safe to move. Swept for other
"lord of the manor" occupation-table misplacements corpus-wide --
none found, this was the only instance.

**FIXED — moved "lord of the manor of Skelton" from person_occupation
to person.office for John Wharton (person 6601); deleted the
now-redundant person_occupation row.**

---

## Record 310

Same licensee pattern as record 298 (Thomas Spink, same date,
distinct person row) -- occupation "licensee" correctly captured, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 313

"Summary conviction of Richard Knaggs of the township of Ellerby
labourer for trespassing in the daytime in search and pursuit of game
on land in the possession and occupation of William Hodgson; on the
information of Henry William Siggs of the township of Lythe
gamekeeper. Offence committed at the township of Ellerby at 3 p.m. on
20 June 1857. Case heard at Whitby" -- landowner William Hodgson
(person 6603), sex already correctly male, no home/occupation stated
(correctly absent). Informant Henry William Siggs (person 6604), home
Lythe, occupation gamekeeper, sex male. Both correct. No fixes
needed.

**OK — no changes.**

---

## Record 314

"Summary conviction of Hannah Palmer of the township of Whitby
singlewoman for being drunk; on the oath of Francis Selby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 14 October 1869. Whitby Strand - case heard at
Whitby" -- informant Francis Selby (person 6605), home Whitby,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 316

"Summary conviction of Louis Cleeton of the township of Whitby for
assaulting Mary Cleeton. Offence committed at the township of Whitby
on 11 June 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- victim Mary Cleeton (person 6606), sex already
correctly female, no home/occupation stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 317

"Summary conviction of Samuel Morris for having medicines called
Dutch Drops and Riga Balsams for sale without the products being
labelled; on the information of Robert Kirby of the township of
Whitby sub-distributor of stamps, and on the oath of William
Wilkinson. Offence committed in Whitby on 30 May 1834. Case heard at
Whitby" -- informant Robert Kirby (person 6607), home Whitby,
occupation correctly captured, sex male. Witness William Wilkinson
(person 6608), sex already correctly male, no home/occupation stated
(correctly absent). No fixes needed.

**OK — no changes.**

---

## Record 319

"Summary conviction of Henry Webster of the township of Whitby
labourer for assaulting and resisting Hugh MacGregor in the execution
of his office; on the oath of the said Hugh MacGregor of the township
of Ruswarp superintendent of police and constable. Offence committed
at the township of Whitby on 4 July 1857. Case heard at Whitby" --
victim Hugh MacGregor (person 6609), home Ruswarp, occupation
"superintendent of police and constable", sex already correctly male.
This is the exact record referenced in the constable-sex-gap memory
as the false-positive risk example (the antecedent of "his" here is
McGregor, not any co-offender) -- confirmed correctly handled. No
fixes needed.

**OK — no changes.**

---

## Record 320

Same date/informant as record 314 (Francis Selby, distinct row) --
occupation/home correctly captured, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 323

Same "Dutch Drops and Riga Balsams" incident type as record 317 (same
informant Robert Kirby, different witness John Moody) -- both
correctly captured, sex already correctly male on both. No fixes
needed.

**OK — no changes.**

---

## Record 325

Same defendant/date as record 319 (Henry Webster, 4 July 1857) --
victim George Jackson (person 6613), home Whitby, occupation police
constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 326

Same informant Francis Selby type (distinct row), home Whitby,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 327

"Summary conviction of James Bennett of the township of Egton miner
for assaulting Andrew Harland; on the oath of the said Andrew Harland
and John Green both of the township of Eskdaleside miners. Offence
committed at the township of Eskdaleside on 22 January 1876. Whitby
Strand - case heard at Whitby" -- victim Andrew Harland (person
6615), witness John Green (person 6616), both home
Eskdaleside-cum-Ugglebarnby, occupation miner, sex male. All
correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 328

Same licensee Thomas Spink pattern as records 298/310 (distinct row,
same date) -- occupation "licensee" correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 329

"Summary conviction of John Campion of the township of Ruswarp
mariner for assaulting Robert Howard apprentice to Thomas Yeoman of
Whitby druggist. Offence committed at the township of Whitby on the
morning of Sunday 1 February 1835. Case heard at Whitby" -- victim
Robert Howard (person 6618), sex already correctly male, no home/
occupation stated for him beyond "apprentice" role, correctly absent.
Master Thomas Yeoman (person 10326), home Whitby, occupation
druggist, sex male (fixed earlier). No fixes needed.

**OK — no changes.**

---

## Record 331

"Summary conviction of Thomas Walker apprentice by an indenture dated
11 May 1857 to John Milburn of the township of Ruswarp shipowner,
for absconding from his master's service. Offence committed on 11
May 1857. Case heard at Whitby" -- master John Milburn (person
10288), home Ruswarp, occupation shipowner, sex male (fixed earlier).
No fixes needed.

**OK — no changes.**

---

## Record 333

"Summary conviction of William Barrett of the township of Whitby jet
worker for assaulting Thomas Watson; on the oath of Joseph Philpot of
the township of Whitby jet worker. Offence committed at the township
of Whitby on 11 November 1876. Whitby Strand - case heard at Whitby"
-- victim Thomas Watson (person 6619), sex already correctly male, no
home stated (correctly absent). Witness Joseph Philpot (person 6620),
home Whitby, occupation jet worker, sex male. Pre-existing
related_conviction link to 132 (same victim, same date, "one specific
altercation, two men prosecuted separately") already correctly
captured in the main pass -- confirmed. No fixes needed.

**OK — no changes.**

---

## Record 334

Same licensee Thomas Spink pattern as records 298/310/328 (distinct
row, same date) -- occupation "licensee" correctly captured, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 337

"Summary conviction of Ralph Nunn of the township of Whitby ship
carpenter for assaulting John Mason of the township of Whitby
butcher; on the oath of the said John Mason and another. Offence
committed at the township of Whitby on 19 July 1857. Case heard at
Whitby" -- victim John Mason (person 6622), home Whitby, occupation
butcher, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 340

"Summary conviction of Mary Dryden wife of William Dryden of the
township of Whitby fisherman for assaulting Jane Harland. Offence
committed at the township of Whitby on 22 July 1889. Whitby Strand
Petty Sessional division - case heard at Whitby" -- victim Jane
Harland (person 6623), sex already correctly female, no home/
occupation stated (correctly absent). Spouse William Dryden (person
9899), home Whitby, occupation fisherman, sex male. No fixes needed.

**OK — no changes.**

---

## Record 341

"Summary conviction of Robert Dixon, Thomas Graham, Joseph Gath,
Thomas Storr and William Storr, all of the township of Whitby, for
assaulting Robert Stevenson, Jonathan Harrison and Margaret Short,
all of the township of Hawsker cum Stainsacre. Offence committed at
the township of Whitby on the night of Sunday 22 February 1835. Case
heard at Whitby" -- three victims Robert Stevenson (6624), Jonathan
Harrison (6625), Margaret Short (6626), all home
Hawsker-cum-Stainsacre, sex correctly set (2 male, 1 female). No
occupation stated for any, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 343

"Summary conviction of George Wilson of the township of Whitby ship
carpenter for assaulting John Mason of the township of Whitby
butcher; on the oath of the said John Mason and others. Offence
committed at the township of Whitby on 19 July 1857. Case heard at
Whitby" -- victim John Mason (person 6627), home Whitby, occupation
butcher, sex already correctly male. Pre-existing related_conviction
link to 337 (same victim, same date), already correctly captured in
the main pass -- confirmed. No fixes needed.

**OK — no changes.**

---

## Record 347

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6628, home Whitby, occupation correctly captured, sex already
correctly male. This is the record referenced in the resolved
title/raw_record mismatch note (title Hobson->Hodgson fix). No fixes
needed for this pass.

**OK — no changes.**

---

## Record 351

"Summary conviction of John Watson Liddell of the township of Whitby
cartman for being disorderly on the licensed premises of Bailiff
Appleton and refusing to leave when asked by Mary Ann Appleton agent
of the said Bailiff Appleton. Offence committed at the township of
Whitby on 5 October 1876. Whitby Strand - case heard at Whitby" --
licensee "Bailiff" Appleton (person 6629), title="Bailiff" (the
majority-form precedent from the documented Bailiff Appleton title
field case), occupation "licensee", sex male, no first_name (matches
source). Informant Mary Ann Appleton (person 6630), sex already
correctly female, no home/occupation stated for her beyond "agent"
role, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 353

"Summary conviction of Robert Plowman of Whitby the township of
Whitby mariner for assaulting Mary Plowman of Whitby spinster.
Offence committed at the township of Whitby on the morning of Sunday
8 March 1835. Case heard at Whitby" -- victim Mary Plowman (person
6631), home Whitby, occupation "spinster" (marital-status occupation
correctly captured for a non-defendant), sex already correctly
female. No fixes needed.

**OK — no changes.**

---

## Record 355

"Summary conviction of Esther Anthony wife of Joyce Anthony of the
township of Whitby mariner for using obscene and indecent language in
Church Street; on the oath of Robert Nickson of the township of
Whitby police constable. Offence committed at the township of Whitby
on 26 July 1857. Case heard at Whitby" -- spouse Joyce Anthony
(person 9900), home Whitby, occupation mariner, sex correctly male --
notable because "Joyce" is an ambiguous/now-typically-female name, but
sex is correctly derived from the stated "husband" relationship, not
guessed from the first name alone. Informant Robert Nickson (person
6632, distinct from record 234's Nickson), home Whitby, occupation
police constable, sex male. No fixes needed.

**OK — no changes.**

---

## Record 356

"Summary conviction of James Filburn of the township of Aislaby jet
worker for resisting Charles Tempest Clarkson one of the constables
for the North Riding in the execution of his duty. Offence committed
at the township of Whitby on 16 October 1869. Whitby Strand - case
heard at Whitby" -- victim Charles Tempest Clarkson (person 6633,
distinct from records 1012/1068's Clarksons), constable, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 357

"Summary conviction of John Telford of Brotton miner for being drunk
on the licensed premises of Samuel Adams and refusing to leave when
asked by the said Samuel Adams; on the oath of William Hammond of the
township of Hinderwell police constable. Offence committed at the
township of Hinderwell on 7 October 1876. Whitby Strand division -
case heard at Whitby" -- licensee Samuel Adams (person 6634),
occupation "licensee", sex male. Informant William Hammond (person
6635), home Hinderwell, occupation police constable, sex male. Both
correct. No fixes needed.

**OK — no changes.**

---

## Record 358

"Summary conviction of William Tose of Imperial Yard in the township
of Whitby for maliciously killing five young ducks, the property of
William Spence Offence committed at the parish of Whitby on 1 July
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- property owner William Spence (person 6636), sex already correctly
male, no home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 361

Same date/informant as record 355 (Robert Nickson, distinct row) --
home Whitby, occupation police constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 362

"Summary conviction of Margaret Corner of the township of Whitby
singlewoman for being drunk; on the oath of Simpson Harnby of the
township of Whitby police constable. Offence committed at the
township of Whitby on 22 October 1869. Whitby Strand - case heard at
Whitby" -- informant Simpson Harnby (person 6638), home Whitby,
occupation police constable, sex already correctly male. Likely the
same real individual as the "[blank] Harnby" instances at records
290/302, correctly kept as a separate row since those records' own
text doesn't state his first name. No fixes needed.

**OK — no changes.**

---

## Record 363

"Summary conviction of Jacob Pearson and William Sanders for
assaulting Joseph Watson. Offence committed at the township of
Hinderwell on 4 November 1876. Whitby Strand - case heard at Whitby"
-- victim Joseph Watson (person 6639), sex already correctly male, no
home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 365

Same informant pattern (Robert Kirby, sub-distributor of stamps,
"esquire" correctly ignored per convention) -- person 6640, home
Whitby, occupation correctly captured, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 366

"Summary conviction of Robert Stephenson of the township of
Fylingdales farmer for trespassing in the daytime in search of game
on waste or common land belonging to George Cholmley esquire as lord
of the manor of Fylingdales. Offence committed at the township of
Fylingdales on 20 December 1847. Case heard at Whitby" -- landowner
George Cholmley (person 6641), office="Lord of the Manor of
Fylingdales" (correctly in the office field, matching the established
Cholmley precedent from record 372), "esquire" correctly ignored, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 368

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for assaulting Charles Tempest Clarkson one of the
constables for the North Riding in the execution of his duty. Offence
committed at the township of Whitby on 16 October 1869. Whitby
Strand - case heard at Whitby" -- victim Charles Tempest Clarkson
(person 6642), constable, sex already correctly male, all completeness
fields correct. Cross-checked against record 356 (James Filburn
"resisting" the same Clarkson, same date) -- no link existed, despite
this record already being linked to 332 (same Atkinson, "allowing
disorderly conduct on his licensed premises") and 517 (John Harrison
drunk on Atkinson's premises, refused to leave when asked by
Clarkson) as the same enforcement-visit cluster. Added the missing
link.

**FIXED — added related_conviction link (356, 368): "Same date, same
officer (Charles Tempest Clarkson) -- Filburn resisting Clarkson and
Atkinson assaulting Clarkson are part of the same enforcement visit
at Atkinson's licensed premises (see also 332/517)."**

---

## Record 369

"Summary conviction of Francis Fewster of the township of Whitby jet
worker for being drunk and disorderly in Baxtergate; on the oath of
William Holmes of the township of Whitby police constable. Offence
committed at the township of Whitby on 14 October 1876. Whitby
Strand - case heard at Whitby" -- informant William Holmes (person
6643), home Whitby, occupation police constable, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 371

"Summary conviction of William Stonehouse for assaulting Thomas
Skerry of Whitby flaxdresser, by striking him several blows over the
head and arms. Offence committed at the township of Whitby on the
morning of Sunday 19 July 1835. Division of Whitby Strand - case
heard at Whitby" -- victim Thomas Skerry (person 6644), home Whitby,
occupation flaxdresser, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 372

This is the original "George Cholmley, Lord of the Manor of
Fylingdales" precedent record (memory: `project_lord_of_the_manor_office_field`)
-- landowner (person 6645), office correctly set, "esquire" correctly
ignored, sex already correctly male. Confirmed correctly handled. No
fixes needed.

**OK — no changes.**

---

## Record 375

"Summary conviction of Robert Foster of the township of Whitby coal
porter for being drunk and disorderly in Haggersgate; on the oath of
George Hewison and John Alderson Wallace both of the township of
Whitby police constables. Offence committed at the township of Whitby
on 14 October 1876. Whitby Strand - case heard at Whitby" -- two
informants George Hewison (6646, distinct from record 822's Hewison)
and John Alderson Wallace (6647), both home Whitby, occupation police
constable, sex male. Both correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 377

"Summary conviction of Fanny Mackey for assaulting Eleanor Law of
Whitby singlewoman. Offence committed at the township of Whitby on 1
August 1835. Costs paid to William Wilkinson constable of Whitby.
Division of Whitby Strand - case heard at Whitby" -- victim Eleanor
Law (person 6648), home Whitby, occupation singlewoman, sex already
correctly female. Recipient of costs William Wilkinson (person 6649),
occupation "constable of Whitby", sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 378

"Summary conviction of James Newton of the township of Egton for
assaulting Luke Hoggart of the township of Egton by seizing him by
his thigh and threatening to throw him behind the fire in his
[Hoggart's] dwelling house. Offence committed at the township of
Egton on 14 January 1848. Division of Whitby Strand - case heard at
Whitby" -- victim Luke Hoggart (person 6650), home Egton, sex already
correctly male, no occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 379

"Summary conviction of Mark Herbert of the township of Fylingdales
farmer for being drunk; on the oath of George Bushell of the township
of Fylingdales police constable. Offence committed at the township of
Fylingdales on 11 September 1857. Case heard at Whitby" -- informant
George Bushell (person 6651), home Fylingdales, occupation police
constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 380

"Summary conviction of Joseph Priestley [Priestly] for assaulting
Thomas Bowron a police constable in the execution of his duty.
Offence committed at the township of Egton on 5 November 1869. Whitby
Strand - case heard at Whitby" -- victim Thomas Bowron (person 6652,
distinct from the Thomas Bowron fixed at record 854/person 6893), sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 382

"Summary conviction of William Agar of Blacksmith's Arms Yard in the
township of Whitby for maliciously killing five young ducks, the
property of William Spence Offence committed at the parish of Whitby
on 1 July 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- property owner William Spence (person 6653), sex
already correctly male, no home stated (correctly absent).
Pre-existing related_conviction link to 358 (same property owner,
same date, same five ducks), already correctly captured in the main
pass -- confirmed. No fixes needed.

**OK — no changes.**

---

## Record 383

"Summary conviction of Thomas Hill of Whitby joiner for assaulting
Sarah Turner of Ruswarp singlewoman. Offence committed at the
township of Ruswarp on 24 July 1835. Division of Whitby Strand - case
heard at Whitby" -- victim Sarah Turner (person 6654), home Ruswarp,
occupation singlewoman, sex already correctly female. No fixes
needed.

**OK — no changes.**

---

## Record 384

"Summary conviction of John Smith and Patrick Cock, both of the
township of Hinderwell labourers, for wilfully breaking a pane of
glass value 1s in the window of the dwelling house of John Peacock
overseer of the poor of the township of Hinderwell. Offence committed
at the township of Hinderwell on 16 January 1848. Case heard at
Whitby" -- property owner John Peacock (person 6655), occupation
"overseer of the poor of the township of Hinderwell", sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 385

"Summary conviction of John Furniss late of the parish of Hartlepool
in county Durham fisherman for wilfully damaging two herring nets
value £5, the property of Robert Harrison; on the oath of the said
Robert Harrison of the parish of Durham [sic] fisherman. Offence
committed at the parish of Whitby on 28 September 1857. Case heard at
Whitby" -- property owner Robert Harrison (person 6656), home
"Durham" (the archive's own [sic]-flagged "parish of Durham" oddity
preserved, not silently corrected), occupation fisherman, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 386

"Summary conviction of Catherine Hunt of the township of Whitby tramp
for being drunk; on the oath of Charles Albert Martindale of the
township of Whitby police constable. Offence committed at the
township of Whitby on 4 November 1869. Whitby Strand - case heard at
Whitby" -- informant Charles Albert Martindale (person 6657, likely
the same real individual as the victim in the 1083/1086/1089 cluster,
correctly a distinct row here), home Whitby, occupation police
constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 388

"Summary conviction of Eleanor Olliver wife of Robert Olliver of the
township of Hawsker cum Stainsacre iron worker for assaulting Mary
Ann Corser. Offence committed at the township of Hawsker cum
Stainsacre on 6 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- victim Mary Ann Corser (person 6658, likely
grown-up namesake of the child in record 79, correctly a distinct
row), sex already correctly female, no home stated (correctly absent).
Spouse Robert Olliver (person 9901), home Hawsker-cum-Stainsacre,
occupation iron worker, sex male. No fixes needed.

**OK — no changes.**

---

## Record 389

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6659, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 391

Same Hugh McGregor pattern as record 319 (distinct row, similar
phrasing) -- home Ruswarp, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 392

"Summary conviction of John Wilks of the township of Lythe farm
servant for trespassing in the daytime in pursuit of conies on land
in the possession and occupation of Joseph Cranston. Offence
committed at the township of Lythe on 31 October 1869. Whitby Strand
- case heard at Whitby" -- landowner Joseph Cranston (person 6661),
sex already correctly male, no home/occupation stated, correctly
absent. No fixes needed.

**OK — no changes.**

---

## Record 393

"Summary conviction of Edward Ayre of the township of Whitby jet
worker for assaulting Sarah Ann Readman; on the oath of the said
Sarah Ann Readman of the township of Whitby singlewoman. Offence
committed at the township of Whitby on 26 July 1876. Whitby Strand -
case heard at Whitby" -- victim Sarah Ann Readman (person 6662), home
Whitby, occupation singlewoman, sex already correctly female. No
fixes needed.

**OK — no changes.**

---

## Record 395

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6663, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 396

"Summary conviction of James Cunningham apprentice to John Smith of
the township of Whitby ship owner, for absenting himself from the
service of his master for about ten hours; on the information of the
said John Smith. Offence committed on 19 February 1848. Case heard at
Whitby" -- John Smith (person 6664), home Whitby, occupation "ship
owner", sex already correctly male -- completeness fields all
correct. Note: role captured as "informant", but the text also
explicitly establishes him as "master" (apprentice to John Smith...
ship owner), and 5 other apprentice-absconding records (157/178/206/
211/331) use role="master" for this same relational pattern. Since no
field is actually missing (occupation present either way, just role
label differs) this is a softer judgment call than the licensee bug --
logged as a role-label question, not unilaterally changed, per the
case-by-case role-normalization precedent.

**OK — no changes** (occupation/home/sex complete; role-label
question noted, not actioned).

---

## Record 397

Same informant pattern as record 313 (Henry William Siggs, distinct
row) -- home Lythe, occupation gamekeeper, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 398

"Summary conviction of James Chappel of the township of Eskdaleside
miner for assaulting Joseph Robinson; on the oath of the said Joseph
Robinson of the township of Eskdaleside manager of ironstone mines.
Offence committed at the township of Eskdaleside on 3 December 1869.
Whitby Strand - case heard at Whitby" -- victim Joseph Robinson
(person 6666), home Eskdaleside-cum-Ugglebarnby, occupation "manager
of ironstone mines", sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 399

"Summary conviction of William Cuthbert of Runswick in the township
of Hinderwell for trespassing in the daytime in search of conies in a
close of land in the possession and occupation of Thomas Vaughan.
Offence committed at the township of Barnby on 18 November 1876.
Whitby Strand - case heard at Whitby" -- landowner Thomas Vaughan
(person 6667), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 401

Same informant pattern as record 223 (William Wilkinson, distinct
row) -- home Whitby, occupation police officer, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 402

Same "informant" vs "master" role-label pattern as record 396 (Paul
Stokill, apprentice's master, role captured as informant) --
completeness fields all correct: home Ruswarp, occupation ship owner,
sex already correctly male. No fixes needed (role-label question
noted, not actioned, consistent with 396).

**OK — no changes.**

---

## Record 403

"Summary conviction of Joseph Breckon of the township of Whitby
stonemason for killing a hare; on the information of Henry William
Siggs of the township of Lythe gamekeeper and others. Offence
committed at the township of Lythe on Sunday 13 September 1857. Case
heard at Whitby" -- informant Henry William Siggs (person 6670,
distinct row), home Lythe, occupation gamekeeper, sex already
correctly male. Pre-existing related_conviction links to 397/409
(same enforcement sweep), already correctly captured in the main pass
-- confirmed. No fixes needed.

**OK — no changes.**

---

## Record 405

"Summary conviction of Thomas Dixon of the township of Whitby
cartman for trespassing in the daytime in search of game in a close
of land in the possession and occupation of Robert Robinson the
younger. Offence committed at the township of Hutton Mulgrave on 25
September 1876. Whitby Strand - case heard at Whitby" -- landowner
Robert Robinson (person 6671, "the younger" correctly captured), sex
already correctly male, no home/occupation stated, correctly absent.
No fixes needed.

**OK — no changes.**

---

## Record 406

"Summary conviction of John Dean of the township of Ruswarp for
stealing a quantity of peas value 2s 6d, the property of William
Gibbons and growing in his garden Offence committed at the township
of Ruswarp on 11 July 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- property owner William Gibbons (person
6672), sex already correctly male, no home/occupation stated,
correctly absent. This is the peas-theft cluster seed record referenced
elsewhere in the audit notes. No fixes needed.

**OK — no changes.**

---

## Record 409

Same Siggs enforcement-sweep cluster as records 397/403 (distinct
row) -- home Lythe, occupation gamekeeper, sex already correctly
male. Related_conviction links to 397/403 already confirmed at record
403. No fixes needed.

**OK — no changes.**

---

## Record 410

Same Charles Tempest Clarkson type (distinct row) -- home Whitby,
occupation police superintendent, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 411

Same John Alderson Wallace type as record 375 (distinct row) -- home
Whitby, occupation police constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 416

"Summary conviction of Thomas Joyce of the township of Whitby jet
worker for wilfully damaging the glass of windows, the property of
Benjamin Garminsway; on the oath of John Ryder of the township of
Whitby inspector of police and others. Offence committed at the
township of Whitby on 8 December 1869. Whitby Strand - case heard at
Whitby" -- property owner Benjamin Garminsway (person 6676), sex
already correctly male, no home stated (correctly absent). Informant
John Ryder (person 6677), home Whitby, occupation inspector of
police, sex male. Both correct. No fixes needed.

**OK — no changes.**

---

## Record 417

"Summary conviction of Charles Wright, William Beckham and John
Appleby, all of Liverton miners, for trespassing in the daytime in
search of conies on a parcel of land in the possession and occupation
of William Pearson and others. Offence committed at the township of
Roxby on 23 October 1876. Whitby Strand - case heard at Whitby" --
landowner William Pearson (person 6678), sex already correctly male,
no home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 418

"Summary conviction of Hannah Mary Pearson wife of William Pearson of
the township of Whitby labourer for being drunk and disorderly in St
Ann's Staith. Offence committed at the township of Whitby on 27 July
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- spouse William Pearson (person 9902, distinct from record 417's
landowner), home Whitby, occupation labourer, sex male. No fixes
needed.

**OK — no changes.**

---

## Record 423

"Summary conviction of Andrew Hill of the township of Whitby jet
worker for being drunk on the licensed premises of Joseph Garside
Rhodes and refusing to leave when asked by John Alderson Wallace a
police constable. Offence committed at the township of Whitby on 30
October 1876. Whitby Strand - case heard at Whitby" -- licensee
Joseph Garside Rhodes (person 6679), occupation "licensee", sex male.
Informant John Alderson Wallace (person 6680, distinct row), home
Whitby, occupation police constable, sex male. Both correct. No fixes
needed.

**OK — no changes.**

---

## Record 428

"Summary conviction of George Jackson of the township of Lythe
carpenter for assaulting Arthur Hood. Offence committed at the
township of Lythe on 10 October 1869. Whitby Strand - case heard at
Whitby" -- victim Arthur Hood (person 6681), sex already correctly
male, no home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 432

"Summary conviction of Ann Butler wife of Patrick Butler for begging.
Offence committed at the township of Whitby on 6 March 1848. Case
heard at Whitby" -- spouse Patrick Butler (person 9903), sex already
correctly male, no home/occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 436

This is the "riot incident" related_conviction pattern seed record
(memory: `project_related_conviction_riot_incident_pattern`) --
victim William Lee (person 6682), constable, sex already correctly
male. Confirmed correctly handled. No fixes needed.

**OK — no changes.**

---

## Record 439

"Summary conviction of Thomas Edwards of the township of Whitby
sawyer for assaulting Jane Wilmot of the township of Whitby widow.
Offence committed at the township of Whitby on 26 October 1855. Case
heard at Whitby" -- victim Jane Wilmot (person 6683), home Whitby,
occupation widow, sex already correctly female. No fixes needed.

**OK — no changes.**

---

## Record 441

"Summary conviction of Jacob Pearson of Loftus miner for being
disorderly on the licensed premises of John Sellar and refusing to
leave when asked by the said John Sellar; on the oath of the said
John Sellar of the township of Hinderwell licensed victualler.
Offence committed at the township of Hinderwell on 4 November 1876.
Whitby Strand - case heard at Whitby" -- licensee John Sellar (person
6684), home Hinderwell, sex already correctly male. Note: has two
occupation rows ("licensed victualler" from the specific stated text,
plus a generic "licensee" tag) -- not a completeness gap (both facts
are true), just mild redundancy pre-existing from before this
session; not actioned, outside this pass's scope.

**OK — no changes.**

---

## Record 445

"Summary conviction of George Russell of the township of Fylingdales
mariner for assaulting Thomas Brewster of the township of Fylingdales
mariner; on the oath of the said Thomas Brewster. Offence committed
at the township of Fylingdales on 3 November 1855. Case heard at
Whitby" -- victim Thomas Brewster (person 6685), home Fylingdales,
occupation mariner, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 446

"Summary conviction of Patrick Seward for assaulting David Bell.
Offence committed at the township of Glaisdale on 30 October 1869.
Whitby Strand - case heard at Whitby" -- victim David Bell (person
6686), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 447

"Summary conviction of William Barrett of the township of Whitby
labourer for assaulting Edward Watson; on the oath of Sarah A.
Thompson, Ralph Speedy, William Nawton, Thomas Watson, Joseph Philpot
and Francis Harrison. Offence committed at the township of Whitby on
11 November 1876. Whitby Strand - case heard at Whitby" -- victim
Edward Watson (6687) and 5 witnesses (Sarah A. Thompson 6688, Ralph
Speedy 6689, William Nawton 6690, Thomas Watson 6691, Joseph Philpot
6692, Francis Harrison 6693), all sex correctly set from unambiguous
names (1 female, 5 male), no home/occupation stated for any,
correctly absent. Thomas Watson and Joseph Philpot share names with
the 132/333 cluster (likely same real individuals, correctly distinct
rows here). Pre-existing related_conviction link to 333 (same
defendant, same date), already correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 450

Same "informant" vs "master" role-label pattern as records 396/402
(James Arthur, apprentice's master) -- completeness fields correct:
home Ruswarp, occupation ship owner, sex already correctly male. No
fixes needed (role-label question noted, not actioned).

**OK — no changes.**

---

## Record 451

"Summary conviction of John Webster of the township of Whitby
carpenter for assaulting Mary Webster his wife. Offence committed at
the township of Whitby on 1 December 1855. Case heard at Whitby" --
victim Mary Webster (person 6695), sex already correctly female,
"wife" relationship correctly linked. No fixes needed.

**OK — no changes.**

---

## Record 452

"Summary conviction of John Thompson of the township of Whitby jet
worker for assaulting Mary wife of John Abdallah; on the oath of the
said John Abdallah of the township of Whitby labourer. Offence
committed at the township of Whitby on 2 October 1869. Whitby Strand
- case heard at Whitby" -- victim Mary (person 6696), no last name
stated in text so correctly left blank (not assumed to be "Abdallah"
by marriage), sex already correctly female, "wife" relationship
correctly linked to John Abdallah. John Abdallah (person 10193)
correctly has TWO summary_conviction_person rows (informant + spouse
of victim) -- verified this is a legitimate dual-role capture, not a
duplicate bug, since the text states both facts about him. Home
Whitby, occupation labourer, sex male. No fixes needed.

**OK — no changes.**

---

## Record 456

"Summary conviction of John Bamfield of the township of Whitby
labourer for assaulting Elizabeth Kelly wife of John Kelly of the
township of Whitby labourer by striking her on the face with his
fists several times. Offence committed at the township of Whitby on
28 March 1848. Case heard at Whitby" -- victim Elizabeth Kelly
(person 6697), home Whitby, sex female. Spouse John Kelly (person
10194), home Whitby, occupation labourer, sex male. Both correctly
captured. No fixes needed.

**OK — no changes.**

---

## Record 460

"Summary conviction of James Loftus of the township of Whitby
labourer for obstructing Philip Hoggart of the township of Ruswarp
constable in the execution of his duty; on the oath of the said
Philip Hoggart. Offence committed in Baxtergate at the township of
Whitby on 26 December 1855. Case heard at Whitby" -- victim Philip
Hoggart (person 6698), home Ruswarp, occupation constable, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 465

"Summary conviction of Mary Wray wife of Cuthbert Wray of the
township of Whitby fruit hawker for obstructing a street; on the
oath of Robert Ridley of the township of Whitby police constable.
Offence committed at the township of Whitby on 7 October 1869. Whitby
Strand - case heard at Whitby" -- informant Robert Ridley (person
6699), home Whitby, occupation police constable, sex male. Spouse
Cuthbert Wray (person 9904), home Whitby, occupation fruit hawker,
sex male. Both correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 466

"Summary conviction of Robert Wilson of the township of Whitby
labourer for being disorderly on the licensed premises of Thomas
Watson and refusing to leave when asked by the said Thomas Watson;
on the oath of S.A. Thompson, R. Speedy, William Nawton, T. Watson,
E. Watson, J. Philpot and F. Harrison, all of the township of Whitby.
Offence committed at the township of Whitby on 11 November 1876.
Whitby Strand - case heard at Whitby" -- same witness group as
records 132/333/447 (initials here vs full names there -- S.A.
Thompson=Sarah A. Thompson, R. Speedy=Ralph Speedy, T. Watson=Thomas
Watson, E. Watson=Edward Watson, J. Philpot=Joseph Philpot, F.
Harrison=Francis Harrison), sex correctly cross-referenced from the
fuller-named instances, all home Whitby. Licensee Thomas Watson
(person 6700), occupation "licensee", sex male. Checked the whole
cluster's related_conviction links (132/333/447/466/482/1971/1974/
1977/1980/1983) -- already thoroughly and correctly linked in the
main pass, no gaps found. No fixes needed.

**OK — no changes.**

---

## Record 468

"Summary conviction of James Scott of Whitby for assaulting Jane
Thompson of the township of Whitby spinster. Offence committed at the
township of Whitby on 2 November 1834. Case heard at Whitby" --
victim Jane Thompson (person 6708), home Whitby, occupation
spinster, sex already correctly female. No fixes needed.

**OK — no changes.**

---

## Record 469

"Summary conviction of John Norton of the township of Whitby
labourer for trespassing in the daytime in search of conies on land
in the possession and occupation of [blank] Wilson. Offence committed
at the township of Ingleby Greenhow on 15 November 1869. Case heard
at Stokesley" -- landowner [blank] Wilson (person 6709), correctly no
first_name/sex (matches source), no home stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 470

"Summary conviction of Thomas Sugden of the township of Whitby
bricklayer for being drunk and disorderly on the Whitby and
Stainsacre highway; on the oath of William Nicholson police constable
and [blank] Wilson gatekeeper, both of Whitby. Offence committed at
the township of Hawsker cum Stainsacre on 11 December 1876. Whitby
Strand - case heard at Whitby" -- informant William Nicholson (person
6710), home Whitby, occupation police constable, sex male. Informant
[blank] Wilson (person 6711), home Whitby, occupation gatekeeper,
correctly no first_name/sex. No fixes needed.

**OK — no changes.**

---

## Record 471

"Summary conviction of James Richardson of the township of Hawsker
cum Stainsacre farmer for assaulting Thomas Jones Offence committed
at the township of Hawsker cum Stainsacre on 22 August 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- victim
Thomas Jones (person 6712), sex already correctly male, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 472

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6713, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 474

"Summary conviction of George Morley and John Morley, both of the
township of Egton farmers, for attempting to kill salmon in a
tributary of the river Esk during the close season; on the oath of
James Wright police constable and William Pearson gamekeeper, both of
the township of Egton. Offence committed at the township of Egton on
19 November 1876. Whitby Strand - case heard at Whitby" -- informants
James Wright (6714) and William Pearson (6715), both home Egton,
occupation correctly captured, sex male. No fixes needed.

**OK — no changes.**

---

## Record 475

"Summary conviction of Catherine Lee wife of Adam Lee of the township
of Whitby hawker for being drunk and disorderly in Church Street.
Offence committed at the township of Whitby on 21 August 1889. Whitby
Strand Petty Sessional division - case heard at Whitby" -- spouse
Adam Lee (person 9905), home Whitby, occupation hawker, sex male. No
fixes needed.

**OK — no changes.**

---

## Record 476

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6716, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 477

Same "[blank] Harnby" pattern as records 290/302 -- person 6717,
correctly no sex, home/occupation correct. No fixes needed.

**OK — no changes.**

---

## Record 478

"Summary conviction of William Harrison of the township of Whitby
coal porter for being drunk and disorderly on the Whitby and
Guisborough highway; on the oath of George Holmes police constable,
Miles Moody inspector of police and John Ryder superintendent of
police, all of the township of Whitby. Offence committed at the
township of Aislaby on 18 November 1876. Whitby Strand - case heard
at Whitby" -- three informants George Holmes (6718), Miles Moody
(6719), John Ryder (6720), all home Whitby, occupation correctly
captured, sex male. Pre-existing related_conviction links to the
128/130/510 cluster (same road/date/officers), already correctly
captured in the main pass -- confirmed. No fixes needed.

**OK — no changes.**

---

## Record 480

"Summary conviction of Elizabeth Thompson wife of [blank] Thompson
and Esther Thompson spinster, both of Hawsker cum Stainsacre, for
assaulting Thomas Lincoln of the township of Hawsker cum Stainsacre
labourer. Offence committed at the township of Hawsker cum Stainsacre
on 7 November 1834. Case heard at Whitby" -- victim Thomas Lincoln
(person 6721), home Hawsker-cum-Stainsacre, occupation labourer, sex
already correctly male. Husband [blank] Thompson (person 9906),
correctly no first_name, sex correctly male, home correctly left
blank -- "both of Hawsker cum Stainsacre" grammatically attaches to
the two named women (Elizabeth/Esther), not explicitly to him, so
not assumed. No fixes needed.

**OK — no changes.**

---

## Record 482

Same Thomas Watson licensed-premises cluster as record 466 (initials
matching the same witness group), already confirmed thoroughly linked
in the main pass. Licensee Thomas Watson (person 6722), occupation
"licensee", sex male. All 6 witnesses correctly sex-inferred, home
Whitby. No fixes needed.

**OK — no changes.**

---

## Record 486

"Summary conviction of Rees Jones of the township of Whitby licensed
victualler for allowing gaming with dice for a goose on his licensed
premises; on the oath of John Ryder superintendent and Thomas Dennis
sergeant of police, both of the township of Whitby. Offence committed
at the township of Whitby on 18 November 1876. Whitby Strand - case
heard at Whitby" -- informants John Ryder (6729) and Thomas Dennis
(6730), both home Whitby, occupation correctly captured, sex male. No
fixes needed.

**OK — no changes.**

---

## Record 489

"Summary conviction of Patrick Seward for assaulting Thomas Bowron.
Offence committed at the township of Glaisdale on 30 October 1869.
Whitby Strand - case heard at Whitby" -- victim Thomas Bowron (person
6731, distinct row from records 380/854), sex already correctly male.
Pre-existing related_conviction link to 446 (same defendant, same
date), already correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 490

Same Joseph Garside Rhodes licensee as record 423 (distinct row) --
occupation "licensee", sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 491

Licensee Edward Cleeton (person 6733), occupation "licensee", sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 492

"Summary conviction of Thomas Robison for attempting to get
charitable contributions by falsely pretending to be a shipwrecked
sailor; on the oath of Mary Pawley wife of Richard Pawley of Whitby
officer in the Preventive Service. Offence committed at Whitby on 27
October 1835. Case heard at Whitby" -- informant Mary Pawley (person
6734), home Whitby, sex already correctly female. Spouse Richard
Pawley (person 10195), home Whitby, occupation "officer in the
Preventive Service", sex male. Both correctly captured. No fixes
needed.

**OK — no changes.**

---

## Record 493

"Summary conviction of Henry Smith of the township of Whitby fruit
hawker for obstructing Church Street; on the oath of Francis Selby of
the township of Whitby police constable. Offence committed at the
township of Whitby on 2 October 1869. Whitby Strand - case heard at
Whitby" -- informant Francis Selby (person 6735, distinct row), home
Whitby, occupation police constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 495

"Summary conviction of John Moon of the township of Whitby labourer
for stealing apples value 1s, the property of James Whittle and
growing in his garden. Offence committed at the township of Hawsker
cum Stainsacre on 28 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- property owner James Whittle
(person 6736), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 497

"Summary conviction of James Pearson of the township of Whitby
blacksmith for trespassing in the daytime in pursuit of game on a
close of land in the possession and occupation of Thomas Beeforth.
Offence committed at the township of Sneaton on 3 October 1869.
Whitby Strand - case heard at Whitby" -- landowner Thomas Beeforth
(person 6737), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 500

"Summary conviction of Charlotte Clark for encouraging two children,
Samuel Clark and Charles Clarke, to beg. Offence committed at Whitby
on 27 October 1837" -- children Samuel Clark (10269) and Charles
Clarke (10270), sex male on both (fixed earlier), role="child". No
fixes needed for this pass.

**OK — no changes.**

---

## Record 501

"Summary conviction of Robert Marley of the township of Glaisdale
shoemaker for being drunk and riotous in Glaisdale Street; on the
oath of Thomas Bowron of the township of Glaisdale police constable.
Offence committed at the township of Glaisdale on 28 September 1869.
Whitby Strand - case heard at Whitby" -- informant Thomas Bowron
(person 6738, distinct row from records 380/489/854), home Glaisdale,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 504

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6739, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 505

Same Charles Tempest Clarkson type (distinct row) -- home Whitby,
occupation superintendent of police, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 508

"Summary conviction of John Hayes for attempting to gather alms by
exposing wounds or deformities; on the oath of Robert Hunt of the
township of Whitby special constable. Offence committed at the
township of Egton on 5 November 1835. Case heard at Whitby" --
informant Robert Hunt (person 6741), home Whitby, occupation special
constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 509

Same Thomas Bowron/Glaisdale type as record 501 (distinct row) --
home Glaisdale, occupation police constable, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 510

Already verified in the earlier 20-sample rigorous check and in
context of record 478 -- informant George Holmes (person 6745), home
Whitby, occupation police constable, sex already correctly male. Part
of the 128/130/478/510/514 highway-drunkenness cluster, already
correctly linked. No fixes needed.

**OK — no changes.**

---

## Record 512

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6746, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 513

"Summary conviction of Thomas Hewson of the township of Fylingdales
mariner for assaulting Andrew Thompson one of the constables for the
North Riding in the execution of his duty; on the oath of the said
Andrew Thompson of the township of Fylingdales police constable.
Offence committed at the township of Fylingdales on 9 December 1869.
Whitby Strand - case heard at Whitby" -- victim Andrew Thompson
(person 6747, distinct row from record 285's Andrew Thompson), home
Fylingdales, occupation police constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 514

"Summary conviction of John Jones of the township of Whitby coal
porter for assaulting George Holmes one of the constables for the
North Riding in the execution of his duty; on the oath of Thomas
Holmes of the township of Whitby police constable. Offence committed
at the township of Aislaby on 18 November 1876. Whitby Strand - case
heard at Whitby" -- victim George Holmes (person 6748, constable, sex
already correctly male). Informant Thomas Holmes (person 6749), home
Whitby, occupation police constable, sex male. Part of the 128/130/
478/510/514 cluster (John Jones, same date), already correctly
linked to 510. No fixes needed.

**OK — no changes.**

---

## Record 516

"Summary conviction of John Havelock of the township of Ruswarp
esquire for trespassing in the daytime in search or pursuit of game
on lands belonging to Edmund Turton esquire. Offence committed at
Rigg Hill in the township of Hawsker cum Stainsacre on Wednesday 13
January 1836. Case heard at Whitby" -- landowner Edmund Turton
(person 6750), sex already correctly male, "esquire" correctly
ignored on both defendant and landowner, no home stated for Turton,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 517

Part of the already-verified Atkinson/Clarkson enforcement cluster
(record 368). Licensee Thomas Atkinson (person 6751), occupation
"licensee", sex male, home correctly left blank here since this
record's own text doesn't restate it (stated in linked records
332/368 instead -- per-record fidelity, not a gap). Informant Charles
Tempest Clarkson (person 6752), home Whitby, occupation superintendent
of police, sex male. No fixes needed.

**OK — no changes.**

---

## Record 518

"Summary conviction of Thomas Martin of the township of Whitby jet
worker for being drunk and disorderly in Church Street; on the oath
of John Alderson Wallace and John Smedley, both of the township of
Whitby police constables. Offence committed at the township of Whitby
on 9 December 1876. Whitby Strand - case heard at Whitby" -- two
informants John Alderson Wallace (6753, distinct row) and John
Smedley (6754), both home Whitby, occupation police constable, sex
male. No fixes needed.

**OK — no changes.**

---

## Record 520

"Summary conviction of John Handysides of the township of Egton
farmer for using a cart on the public highway without having his name
and place of abode painted on it; on the information of William
Wilkinson. Offence committed at the township of Whitby on 16 January
1836. Case heard at Whitby" -- informant William Wilkinson (person
6755, distinct row), sex already correctly male, no home/occupation
stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 521

Same Francis Selby type as record 493 (distinct row) -- home Whitby,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 523

"Summary conviction of Thomas Smith of the township of Eskdaleside
cum Ugglebarnby labourer for assaulting James Side. Offence committed
at the township of Eskdaleside cum Ugglebarnby on 6 September 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
victim James Side (person 6757), sex already correctly male, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 524

"Summary conviction of John Wyley of Guisborough common carrier for
assaulting Robert Steel of the township of Whitby carpenter. Offence
committed at the township of Whitby on 11 December 1835. Case heard
at Whitby" -- victim Robert Steel (person 6758, distinct from records
1050/1053's Robert Steel), home Whitby, occupation carpenter, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 525

"Summary conviction of James Chappel of the township of Eskdaleside
miner for assaulting Robert Cooper; on the oath of the said Robert
Cooper of the township of Eskdaleside weighman. Offence committed at
the township of Eskdaleside on 3 December 1869. Whitby Strand - case
heard at Whitby" -- victim Robert Cooper (person 6759), home
Eskdaleside-cum-Ugglebarnby, occupation weighman, sex already
correctly male. Pre-existing related_conviction link to 398 (same
defendant, same date), already correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 526

Already verified in the earlier 20-sample rigorous check -- informants
William Nicholson (6760) and Thomas Archer (6761), both home Whitby,
occupation correctly captured, sex male. No fixes needed.

**OK — no changes.**

---

## Record 527

"Summary conviction of Henry Holmes of the township of Whitby jet
worker for stealing apples value 1s, the property of James Fletcher
and growing in his garden. Offence committed at the township of
Whitby on 30 August 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- property owner James Fletcher (person 6762),
sex already correctly male, no home/occupation stated, correctly
absent. No fixes needed.

**OK — no changes.**

---

## Record 528

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6763, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 529

"Summary conviction of John Nunns of the township of Whitby tinner
and brazier for assaulting Samuel Braithwaite; on the oath of the
said Samuel Braithwaite of the township of Whitby photographer.
Offence committed at the township of Whitby on 9 October 1869. Whitby
Strand - case heard at Whitby" -- victim Samuel Braithwaite (person
6764), home Whitby, occupation photographer, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 532

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6765, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 533

"Summary conviction of Ellen McDermott wife of John McDermott of the
township of Whitby labourer for obstructing Church Street; on the
oath of Francis Selby of the township of Whitby police constable.
Offence committed at the township of Whitby on 9 October 1869. Whitby
Strand - case heard at Whitby" -- informant Francis Selby (person
6766, distinct row), home Whitby, occupation police constable, sex
male. Spouse John McDermott (person 9907), home Whitby, occupation
labourer, sex male. Pre-existing related_conviction link to 521 (same
date/street), already correctly captured -- confirmed. Record 493
(different date, 2 October) correctly not linked. No fixes needed.

**OK — no changes.**

---

## Record 537

"Summary conviction of Mary Ward wife of Thomas Ward of the township
of Whitby common lodging house keeper for being drunk; on the oath of
Robert Ridley of the township of Whitby police constable. Offence
committed at the township of Whitby on 24 October 1869. Whitby
Strand - case heard at Whitby" -- informant Robert Ridley (person
6767, distinct row from record 465), home Whitby, occupation police
constable, sex male. Spouse Thomas Ward (person 9908), home Whitby,
occupation "common lodging house keeper", sex male. Both correctly
captured. No fixes needed.

**OK — no changes.**

---

## Record 541

"Summary conviction of John Mead of the township of Egton farmer for
being the owner of three [blank] found straying on the highway called
Lease Rigg; on the oath of James Wright of the township of Egton
police constable. Offence committed at the township of Egton on 19
October 1869. Whitby Strand - case heard at Whitby" -- informant
James Wright (person 6768, distinct row from record 474), home Egton,
occupation police constable, sex already correctly male. Animal type
genuinely "[blank]" in source (illegible), correctly not fabricated
as a species. No fixes needed.

**OK — no changes.**

---

## Record 542

"Summary conviction of Thomas Gaines of the township of Whitby
fisherman for assaulting John Nicholson one of the constables for the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 2 October 1875. Whitby Strand - case heard at
Whitby" -- victim John Nicholson (person 6769), constable, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 544

"Summary conviction of William Bell and Joseph Newton for trespassing
in the daytime in search of game on the lands of the Earl of
Mulgrave. Offence committed at the township of Lythe on 30 October
1833. Case heard at Whitby" -- landowner Constantine Henry Phipps
(person 10341), correctly identified as the same historical peer as
record 177/544 (he held "Earl of Mulgrave" specifically 1831-1838,
and the offence date 1833 falls within that period -- genuinely
verifiable, not guessed), office field correctly captured, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 545

"Summary conviction of Daniel Stuart of the township of Whitby jet
worker for being drunk on the licensed premises of Thomas Duck and
refusing to leave when asked by Simpson Harnby; on the oath of the
said Simpson Harnby of the township of Whitby police constable.
Offence committed at the township of Whitby on 14 December 1869.
Whitby Strand - case heard at Whitby" -- licensee Thomas Duck (person
6770), occupation "licensee", sex male, no home stated (correctly
absent). Informant Simpson Harnby (person 6771, matches record 362),
home Whitby, occupation police constable, sex male. No fixes needed.

**OK — no changes.**

---

## Record 547

"Summary conviction of Isabel Barker of the township of Whitby
singlewoman for assaulting Ann Oliver Offence committed at the
township of Whitby on 9 September 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- victim Ann Oliver (person 6772),
sex already correctly female, no home/occupation stated, correctly
absent. This is the record referenced as "resolved as of record 547"
in the marital-status gap tracked-notes -- confirmed consistent. No
fixes needed.

**OK — no changes.**

---

## Record 548

"Summary conviction of Hannah Cail wife of Richard Cail of Whitby
currier, and Hannah Cail and Helina Cail, for assaulting Jeffrey
Holmes of the township of Ruswarp gentleman. Offence committed at the
township of Ruswarp on Saturday 1 November 1833. Case heard at Whitby
in the division of Whitby Strand" -- victim Jeffrey Holmes (person
6773), home Ruswarp, occupation "gentleman", sex already correctly
male. Spouse Richard Cail (person 9909), home Whitby, occupation
currier, sex male. Both correctly captured; only one Hannah Cail
defendant row exists despite the name appearing twice in raw text
(likely an archival duplication/scribal artifact) -- correctly not
duplicated, though outside this pass's non-defendant-field scope. No
fixes needed for this pass.

**OK — no changes.**

---

## Record 549

Same licensee (Thomas Duck, person 6774) and informant (Simpson
Harnby, person 6775) as record 545, same date -- occupation/home
correctly captured, sex already correctly male. Pre-existing
related_conviction link to 545, already correctly captured. No fixes
needed.

**OK — no changes.**

---

## Record 552

Already verified earlier this session (housekeeping check at record
1097) -- victim Isabella Jolly (person 6776), home Whitby, occupation
spinster, sex already correctly female. Spouse Enock Anderson (person
9910), home Whitby, occupation tailor, sex male. No fixes needed.

**OK — no changes.**

---

## Record 553

"Summary conviction of Henry Freeman of the township of Whitby
mariner and master of a vessel called the William Ash... for not
delivering to Peter George Coble collector of rates... the name of
the consignee... on the oath of the said Peter George Coble of the
parish of Whitby collector of rates and dues of the harbour of
Whitby, and another. Offence committed at the township of Whitby on
23 October 1869. Whitby Strand - case heard at Whitby" -- informant
Peter George Coble (person 6777), home Whitby, occupation "collector
of rates and dues of the harbour of Whitby", sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 554

"Summary conviction of Mary Robinson wife of John Robinson of the
township of Whitby labourer for assaulting Francis Calvert; on the
oath of the said Francis Calvert of the township of Goathland farmer.
Offence committed at the township of Whitby on 2 October 1875. Whitby
Strand - case heard at Whitby" -- victim Francis Calvert (person
6778, same name as record 577's informant, correctly distinct row),
home Goathland, occupation farmer, sex already correctly male.
Spouse John Robinson (person 9911), home Whitby, occupation labourer,
sex male. No fixes needed.

**OK — no changes.**

---

## Record 556

"Summary conviction of Robert Stephenson of Whitby labourer for using
two greyhounds to kill game on the lands of Thomas Peirson and Job
Allison. Offence committed at the township of Sneaton on Friday 1
November 1833. Case heard at Whitby" -- landowners Thomas Peirson
(6779) and Job Allison (6780), sex correctly male on both, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 557

"Summary conviction of Robert Watson of the township of Whitby
labourer for assaulting Winefred Readman; on the oath of the said
Winefred Readman wife of Thomas Readman of the township of Whitby
miner. Offence committed at the township of Whitby on 12 June 1869.
Whitby Strand - case heard at Whitby" -- victim Winefred Readman
(person 6781), home Whitby, sex correctly female (period spelling of
Winifred). Spouse Thomas Readman (person 10196), home Whitby,
occupation miner, sex male. Both correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 558

"Summary conviction of Thomas Brown for being in the Market Place
with intent to steal from the person of Robert Baines. Offence
committed at the township of Whitby on 6 November 1875. Whitby
Strand - case heard at Whitby" -- intended victim Robert Baines
(person 6782), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 559

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6783, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 561

"Summary conviction of William Foxton of the township of Whitby
labourer for maliciously throwing down part of a wooden fence, the
property of Robert Dobson, and causing sixpence-worth of damage; on
the oath of Robert Dobson of the township of Barnby farmer. Offence
committed at the township of Barnby on 5 October 1875. Whitby Strand
- case heard at Whitby" -- property owner Robert Dobson (person
6784), home Barnby, occupation farmer, sex male (fixed earlier). No
fixes needed for this pass.

**OK — no changes.**

---

## Record 563

Same informant pattern (Robert Kirby, sub-distributor of stamps) --
person 6785, home Whitby, occupation correctly captured, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 564

"Summary conviction of John Heselton of the township of Whitby jet
worker for being drunk and riotous in Church Street; on the oath of
Joseph Gatenby of the township of Whitby police constable. Offence
committed at the township of Whitby on 20 June 1869 Whitby Strand -
case heard at Whitby" -- informant Joseph Gatenby (person 6786), home
Whitby, occupation police constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 566

"Summary conviction of Mary Sams wife of Charles Sams of the township
of Whitby labourer for being drunk and disorderly in St Ann's Lane.
Offence committed at the township of Whitby on 15 September 1889.
Whitby Strand Petty Sessional division - case heard at Whitby" --
spouse Charles Sams (person 9912), home Whitby, occupation labourer,
sex male. No fixes needed.

**OK — no changes.**

---

## Record 567

"Summary conviction of William Douglass of Whitby pilot for
disobeying the instruction he had received from George Willis harbour
master of the port of Whitby, by running a brig called the "Mary of
Newcastle" under sail through the temporary wooden bridge erected
across Whitby harbour. Offence committed on 29 November 1833" --
informant George Willis (person 6787), occupation "harbour master of
the port of Whitby", sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 571

"Summary conviction of Reuben Raybold of Whitby for hawking a number
of almanacs that were unstamped; on the information of Robert Hunt of
the township of Whitby special constable. Offence committed at
Whitby on 26 December 1833. Case heard at Whitby" -- informant Robert
Hunt (person 6788, distinct from record 508's Robert Hunt), home
Whitby, occupation special constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 572

"Summary conviction of Alfred Stuart and William Brown, both of the
township of Whitby jet workers, for trespassing in the daytime in
pursuit of conies on a close of land in the possession and occupation
of Francis Norman. Offence committed at the township of Ruswarp on 20
June 1869. Whitby Strand - case heard at Whitby" -- landowner Francis
Norman (person 6789), sex already correctly male (male spelling
"Francis"), no home/occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 574

Licensee Matthew Green (person 6790), occupation "licensee", sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 575

"Summary conviction of John Watson and Matthew Fawcett, both of the
township of Fylingdales farmers, for refusing to take on the office
of surveyors of the highways of the township of Fylingdales, or to
provide deputies, after they had been elected; on the information of
William Gray of the township of Fylingdales in the parish of Whitby
farmer. Case heard at Whitby" -- informant William Gray (person
6791), home Fylingdales, occupation farmer, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 576

"Summary conviction of David Lund and Valentine Austin, both of the
township of Whitby jet workers, for stealing a quartern of
gooseberries value 6d, the property of Gideon Smales and stolen from
his garden. Offence committed at the township of Ruswarp on 27 June
1869. Whitby Strand - case heard at Whitby" -- property owner Gideon
Smales (person 6792), sex already correctly male, no home/occupation
stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 577

"Summary conviction of Emma Robinson of the township of Whitby
singlewoman for resisting Mark Boggett one of the constables for the
North Riding in the execution of his duty; on the oath of Mark
Boggett of the township of Whitby police constable, William Willison
of Whitby innkeeper and Francis Calvert of the township of Goathland
farmer. Offence committed at the township of Whitby on 2 October
1875. Whitby Strand - case heard at Whitby" -- victim Mark Boggett
(person 6793), home Whitby, occupation police constable, sex already
correctly male. Witnesses William Willison (6794, innkeeper) and
Francis Calvert (6795, matches record 554's Francis Calvert), both
correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 581

"Summary conviction of Robert Parkin of the township of Whitby cab
driver for being too far from his carriage to have proper control of
the horse drawing it; on the oath of Thomas Hall of the township of
Whitby police constable. Offence committed at the township of Whitby
on 20 October 1875. Whitby Strand - case heard at Whitby" --
informant Thomas Hall (person 6796, distinct row from record 1084's
Thomas Hall), home Whitby, occupation police constable, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 582

"Summary conviction of William Moody of the township of Whitby
labourer for assaulting Richard Thompson Offence committed at the
township of Whitby on 10 September 1889. Whitby Strand Petty
Sessional division - case heard at Whitby" -- victim Richard Thompson
(person 6797, distinct from records 700/845/966's Thompson), sex
already correctly male, no home/occupation stated, correctly absent.
No fixes needed.

**OK — no changes.**

---

## Record 583

Same William Wilkinson informant type (distinct row) -- sex already
correctly male, no home/occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 584

"Summary conviction of Thomas Atkinson of the township of Whitby
innkeeper for allowing drunkenness on his licensed premises; on the
oath of Charles Tempest Clarkson of the township of Whitby
superintendent of police. Offence committed at the township of
Whitby on 25 June 1869. Whitby Strand - case heard at Whitby" -- same
names as the 332/368/517 Atkinson/Clarkson cluster but a different
date (25 June vs 16 October), correctly distinct person rows (637,
6799), home Whitby, occupation correctly captured, sex male on both.
No fixes needed.

**OK — no changes.**

---

## Record 586

"Summary conviction of Thomas Loftus of the township of Whitby
bricklayer for assaulting Mary Hellewell Offence committed at the
township of Whitby on 9 September 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- victim Mary Hellewell (person
6800) had blank sex despite "Mary" being an unambiguous female name.

**FIXED — set sex=female for Mary Hellewell (person 6800).**

---

## Record 587

Same William Wilkinson informant type (distinct row) -- sex already
correctly male, no home/occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 588

"Summary conviction of William Stockdale for assaulting Elizabeth
Lemon. Offence committed at the township of Aislaby on 27 June 1869.
Whitby Strand - case heard at Whitby" -- victim Elizabeth Lemon
(person 6802) had blank sex despite "Elizabeth" being unambiguous.

**FIXED — set sex=female for Elizabeth Lemon (person 6802).**

---

## Record 589

"Summary conviction of John de Wart for assaulting George Richard
Lazenby one of the constables for the North Riding in the execution
of his duty. Offence committed at the township of Hawsker cum
Stainsacre on 3 October 1875. Whitby Strand - case heard at Whitby"
-- victim George Richard Lazenby (person 6803), constable, sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 591

Same William Wilkinson informant type (distinct row) -- sex already
correctly male, no home/occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 595

"Summary conviction of Thomas Breckon of Whitby butcher for beating a
dog belonging to William Cavallier of the township of Whitby cabinet
maker. Offence committed at the township of Whitby on 4 June 1836.
Case heard at Whitby" -- property owner William Cavallier (person
6805), home Whitby, occupation cabinet maker, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 597

Already verified earlier this session (housekeeping check at record
1097) -- victim Mary Feeley (person 6806), sex already correctly
female, no home/occupation stated (correctly absent). Spouse John
Feeley (person 10197), home Whitby, sex male. No fixes needed.

**OK — no changes.**

---

## Record 601

"Summary conviction of Walter Adam of the township of Whitby iron
worker for assaulting Alfred Lait Offence committed at the township
of Whitby on 22 June 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- victim Alfred Lait (person 6807), sex
already correctly male, no home/occupation stated, correctly absent.
No fixes needed.

**OK — no changes.**

---

## Record 604

"Summary conviction of William Dixon of the township of Whitby jet
worker for assaulting Mary Dixon Offence committed at the township of
Whitby on 21 September 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- victim Mary Dixon (person 6808) had blank
sex despite "Mary" being unambiguous.

**FIXED — set sex=female for Mary Dixon (person 6808).**

---

## Record 605

"Summary conviction of Catherine Brannan for collecting alms under
false pretences from Elizabeth Ann Green, by claiming that a young
woman had recently been confined in the Old Post Office Yard and was
now destitute. Offence committed at the township of Whitby on 5 July
1869. Whitby Strand - case heard at Whitby" -- victim Elizabeth Ann
Green (person 6809), sex already correctly female, no home/occupation
stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 607

"Summary conviction of James Cockrin of the township of Whitby
labourer for assaulting Charles Finks. Offence committed at the
township of Whitby on 15 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- victim Charles Finks (person
6810), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 614

"Summary conviction of John Shepherd of the township of Glaisdale
miner for interfering with the comfort of other passengers on the
Cleveland and North Yorkshire line of the North Eastern Railway; on
the oath of Michael Underwood and others. Offence committed at the
township of Eskdaleside on 3 July 1869. Whitby Strand - case heard at
Whitby" -- informant Michael Underwood (person 6811), sex already
correctly male, no home/occupation stated, correctly absent. Location
correctly linked to the "Cleveland & North Yorkshire Railway"
cross-parish node (388), matching the established convention. No
fixes needed.

**OK — no changes.**

---

## Record 615

"Summary conviction of Peter Gorley of the township of Whitby jet
worker for assaulting Mary Ann Stonehouse. Offence committed at the
township of Whitby on 16 November 1875. Whitby Strand - case heard at
Whitby" -- victim Mary Ann Stonehouse (person 6812, same name as
record 526's defendant, correctly a distinct row here), sex already
correctly female, no home/occupation stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 619

"Summary conviction of Margaret Ann Hansell wife of William George
Hansell of the township of Whitby jet worker for being drunk and
disorderly in St Ann's Staith. Offence committed at the township of
Whitby on 19 August 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- spouse William George Hansell (person 9913),
home Whitby, occupation jet worker, sex male. No fixes needed.

**OK — no changes.**

---

## Record 622

Same property owner James Whittle as record 495, same date --
already correctly linked (495/622/625 cluster). Property owner
(person 6813), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 624

Same Thomas Hall informant type as records 581/1084 (distinct row) --
home Whitby, occupation police constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 625

Third instance of the James Whittle apple-theft cluster (495/622/625)
-- property owner (person 6815), sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 626

Already verified earlier this session (housekeeping check at record
1097) -- spouse Robert Austin (person 9914), home Whitby, occupation
fisherman, sex male. No fixes needed.

**OK — no changes.**

---

## Record 627

"Summary conviction of William Martin of the township of Whitby for
wilfully damaging a lamp belonging to the Whitby Gas Company. Offence
committed at the township of Ruswarp on 1 December 1875. Whitby
Strand - case heard at Whitby" -- property owner "Whitby Gas Company"
(person 10373), correctly no sex (a company, not a person). No fixes
needed.

**OK — no changes.**

---

## Record 629

"Summary conviction of George Wedgewood of the township of Newholm
cum Dunsley for trespassing in the daytime in search of conies on a
piece of land in the possession and occupation of Elizabeth Harris.
Offence committed at the township of Newholm cum Dunsley on 13 July
1869. Whitby Strand - case heard at Whitby" -- landowner Elizabeth
Harris (person 6816), sex already correctly female, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 638

"Summary conviction of William Cook of the township of Whitby
labourer for assaulting Joseph Gatenby one of the constables for the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 16 July 1869. Whitby Strand - case heard at
Whitby" -- victim Joseph Gatenby (person 6817, same name as record
564's informant, correctly distinct row), constable, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 639

"Summary conviction of William Gaskin for assaulting Jane Gaskin.
Offence committed at the township of Whitby on 17 June 1875. Whitby
Strand - case heard at Whitby" -- victim Jane Gaskin (person 6818),
sex already correctly female, no home/occupation stated, correctly
absent. No fixes needed.

**OK — no changes.**

---

## Record 642

"Summary conviction of Richard Steel for assaulting Alice Steel.
Offence committed at the township of Whitby on 29 June 1875. Whitby
Strand - case heard at Whitby" -- victim Alice Steel (person 6819),
sex already correctly female, no home/occupation stated, correctly
absent. No fixes needed.

**OK — no changes.**

---

## Record 643

"Summary conviction of Robert Hill of the township of Fylingdales
gardener for being drunk on the licensed premises of John Steel and
refusing to leave when asked to do so by Joseph Scaife a police
constable. Offence committed at the township of Fylingdales on 15
July 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- licensee John Steel (person 6820), occupation "licensee",
sex male. Informant Joseph Scaife (person 6821), occupation police
constable, sex male. No fixes needed.

**OK — no changes.**

---

## Record 645

"Summary conviction of Robert Watson for assaulting Thomas Watson.
Offence committed at the township of Whitby on 9 July 1875. Whitby
Strand - case heard at Whitby" -- victim Thomas Watson (person 6822,
distinct from records 132/447/466 cluster's Thomas Watson), sex
already correctly male, no home/occupation stated, correctly absent.
No fixes needed.

**OK — no changes.**

---

## Record 646

Part of the confirmed "riot incident" related_conviction cluster
(436/646/652/664/670) -- victim William Dobson (person 6823,
constable, distinct from records 7/39's William Dobson), sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 651

"Summary conviction of Thomas Weatherill for assaulting Alice
Weatherill. Offence committed at the township of Whitby on 28 July
1875. Whitby Strand - case heard at Whitby" -- victim Alice
Weatherill (person 6824), sex already correctly female, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 652

Part of the confirmed "riot incident" cluster -- victim William Lee
(person 6825, distinct row from record 436's William Lee), constable,
sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 653

"Summary conviction of Ellen Hick wife of Isaac Hick for assaulting
Joseph Gatenby. Offence committed at the township of Whitby on 20
July 1869. Whitby Strand - case heard at Whitby" -- victim Joseph
Gatenby (person 6826, distinct row), home Whitby, occupation police
constable, sex already correctly male. Spouse Isaac Hick (person
9915), sex male, no home stated (correctly absent, not restated in
this record's text). Another distinct Ellen/Isaac Hick pair. No fixes
needed.

**OK — no changes.**

---

## Record 655

"Summary conviction of Annie Craven wife of Amos Craven of Kingston
upon Hull labourer for begging on the Whitby and Hawsker highway.
Offence committed at the township of Hawsker cum Stainsacre on 6
August 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- spouse Amos Craven (person 9916, same name as record
1077's defendant, correctly distinct row), home Kingston upon Hull,
occupation labourer, sex male. No fixes needed.

**OK — no changes.**

---

## Record 656

"Summary conviction of John Mead of the township of Egton farmer for
being the owner of a horse found straying on the Pickering and Stape
highway; on the oath of William Pickering of the township of Egton
police constable. Offence committed at the township of Egton on 22
July 1869. Whitby Strand - case heard at Whitby" -- informant William
Pickering (person 6827, distinct row from record 2403), home Egton,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 658

Part of the confirmed peas-theft cluster (406/658/661/667) --
property owner William Gibbons (person 6828, distinct row), sex
already correctly male, no home/occupation stated, correctly absent.
No fixes needed.

**OK — no changes.**

---

## Record 661

Same peas-theft cluster (406/658/661/667) -- property owner William
Gibbons (person 6829, distinct row), sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 663

"Summary conviction of Francis Dalkin for assaulting Jane Ann Storm.
Offence committed at the township of Whitby on 24 July 1875. Whitby
Strand - case heard at Whitby" -- victim Jane Ann Storm (person
6830), sex already correctly female, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 664

Part of the confirmed "riot incident" cluster -- same names as
record 646 (James Loftus, William Lee) but a distinct victim person
row (6831), sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 666

"Summary conviction of James Pounder for assaulting William Burdon.
Offence committed at the township of Whitby on 12 August 1875. Whitby
Strand - case heard at Whitby" -- victim William Burdon (person
6832), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 667

Last of the peas-theft cluster (406/658/661/667) -- property owner
William Gibbons (person 6833, distinct row), sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 670

This is the original record where the 213-row constable-sex gap was
first discovered (memory: `project_constable_sex_gap_tracked`) --
victim John Cook (person 6834), constable, sex correctly male
(fixed earlier this session). Also part of the confirmed "riot
incident" cluster (436/646/652/664/670). No fixes needed for this
pass.

**OK — no changes.**

---

## Record 674

This is the original "[blank] Selby" record where a stray sex='male'
value was found and corrected back to NULL earlier in the audit
(person 6835, no first_name and no pronoun stated). Confirmed still
correctly NULL. Home Whitby, occupation police constable both
correct. No fixes needed.

**OK — no changes.**

---

## Record 675

Part of the confirmed poaching-gang cluster (675/705/717/878) --
landowner Thomas Vaughan (person 6836, distinct row from record
399's Thomas Vaughan), sex already correctly male, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 676

"Summary conviction of Ralph Jordison of the township of Whitby
painter for being drunk and disorderly on the licensed premises Ralph
Brown Longhorn. Offence committed at the township of Whitby on 20
September 1889. Whitby Strand Petty Sessional division - case heard
at Whitby" -- licensee Ralph Brown Longhorn (person 6837), occupation
"licensee", sex already correctly male. Note: raw text is missing
"of" before the licensee's name (likely a scan/transcription artifact
in the source), not corrected -- source fidelity preserved. No fixes
needed.

**OK — no changes.**

---

## Record 680

"Summary conviction of Edward Coates of the township of Scarborough
fish hawker for ill-treating a mare by working it when it was unfit;
on the oath of Charles Tempest Clarkson of the township of Whitby
superintendent of police. Offence committed at the township of
Hawsker cum Stainsacre on 7 July 1869. Whitby Strand - case heard at
Whitby" -- informant Charles Tempest Clarkson (person 6838, distinct
row), home Whitby, occupation superintendent of police, sex already
correctly male. No fixes needed.

**OK — no changes.**

---

## Record 687

"Summary conviction of Isaac Hick of the township of Whitby jet
worker for assaulting John Arnold. Offence committed at the township
of Whitby on 22 September 1875. Whitby Strand - case heard at
Whitby" -- victim John Arnold (person 6839, distinct from record
482's defendant), sex already correctly male, no home/occupation
stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 688

"Summary conviction of James Coleman of the township of Whitby
labourer for assaulting Joseph Scaife one of the constables of the
North Riding in the execution of his duty. Offence committed at the
township of Whitby on 15 August 1889. Whitby Strand Petty Sessional
division - case heard at Whitby" -- victim Joseph Scaife (person
6840, distinct row from record 643), constable, sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 689

"Summary conviction of James Raw of the township of Hinderwell
labourer for being drunk and riotous in Staithes Street; on the oath
of John Atkinson of the township of Hinderwell police constable.
Offence committed at the township of Hinderwell on 26 July 1869.
Whitby Strand - case heard at Whitby" -- informant John Atkinson
(person 6841, distinct row from record 1018), home Hinderwell,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 694

**CORRECTION**: my first pass at this entry wrongly described a
different record (I confused a defendant's `person.id` value, 694,
with this record's actual `summary_conviction.id`). Re-fetched and
verified against this record's real content below.

"Summary conviction of John Pearson of the township of Whitby
labourer for being drunk on the licensed premises of Ralph Brown
Longhorn and refusing to leave when asked to do so by Kate
McLaughlan. Offence committed at the township of Whitby on 30 August
1889. Whitby Strand Petty Sessional division - case heard at Whitby"
-- licensee Ralph Brown Longhorn (person 6842, distinct row from
record 676's licensee of the same name), occupation "licensee", sex
male. Informant Kate McLaughlan (person 6843), sex already correctly
female, no home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 699

"Summary conviction of Benjamin Wilson of the township of Whitby
hawker for being drunk and disorderly on Tate Hill; on the oath of
George Richard Lazenby of the township of Whitby police constable.
Offence committed at the township of Whitby on 19 June 1875. Whitby
Strand - case heard at Whitby" -- informant George Richard Lazenby
(person 6844, distinct row from record 589), home Whitby, occupation
police constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 700

Same defendant William Moody, same date as record 582 -- already
correctly linked. Licensee Richard Thompson (person 6845), occupation
"licensee", sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 702

"Summary conviction of John Denham of the township of Whitby jet
worker for obstructing Church Street by wilfully preventing persons
from passing him; on the oath of Thomas Hall of the township of
Whitby police constable. Offence committed at the township of Whitby
on 13 June 1875. Whitby Strand - case heard at Whitby" -- informant
Thomas Hall (person 6846, distinct row), home Whitby, occupation
police constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 703

"Summary conviction of John Smith the elder of the township of
Hawsker cum Stainsacre groom for applying for relief from the
Guardians of the Poor of Whitby Union on behalf of his children John,
Annie and Charles all aged under 16 years, and then running away
leaving his children chargeable. Offence committed at the township of
Whitby on 15 September 1889. Whitby Strand Petty Sessional division -
case heard at Whitby" -- three children John (10276, sex male, fixed
earlier), Annie (10277, sex BLANK despite unambiguous name), Charles
(10278, sex male, fixed earlier).

**FIXED — set sex=female for Annie Smith (person 10277).**

---

## Record 705

Same poaching-gang cluster as record 675 -- landowner Thomas Vaughan
(person 6847, distinct row), sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 710

"Summary conviction of Elizabeth Brough wife of John Brough of the
township of Pickering stonemason for being drunk. Offence committed
at the township of Whitby on 7 August 1869. Whitby Strand - case
heard at Whitby" -- spouse John Brough (person 9917), home Pickering,
occupation stonemason, sex male. No fixes needed.

**OK — no changes.**

---

## Record 713

"Summary conviction of Michael Mallon for assaulting Mary Jane
Harvey. Offence committed at the township of Glaisdale on 7 August
1869. Whitby Strand - case heard at Whitby" -- victim Mary Jane
Harvey (person 6848), sex already correctly female, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 714

"Summary conviction of Margaret Harland of the township of Whitby
domestic servant for assaulting Mary Ellen Colley. Offence committed
at the township of Whitby on 8 July 1875. Whitby Strand - case heard
at Whitby" -- victim Mary Ellen Colley (person 6849), sex already
correctly female, no home/occupation stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 716

"Summary conviction of George Watson of the township of Glaisdale
miner for assaulting Mary Hannah Storr. Offence committed at the
township of Glaisdale on 6 August 1869. Whitby Strand - case heard
at Whitby" -- victim Mary Hannah Storr (person 6850), sex already
correctly female, no home/occupation stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 717

Last of the poaching-gang cluster (675/705/717/878) -- landowner
Thomas Vaughan (person 6851, distinct row), sex already correctly
male. No fixes needed.

**OK — no changes.**

---

## Record 722

"Summary conviction of Joseph McCabe of the township of Whitby
licensed hawker for being drunk; on the oath of Charles Albert
Martindale of the township of Whitby police constable Offence
committed at the township of Ruswarp on 18 August 1869. Whitby
Strand - case heard at Whitby" -- informant Charles Albert Martindale
(person 6852, distinct row from record 386), home Whitby, occupation
police constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 729

"Summary conviction of James Marshall of the township of Hinderwell
miner for being drunk and disorderly in Staithes town street; on the
oath of William Hammond of the township of Hinderwell police
constable. Offence committed at the township of Hinderwell on 12 June
1875. Whitby Strand - case heard at Whitby" -- informant William
Hammond (person 6853, distinct row from record 357), home Hinderwell,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 732

"Summary conviction of William Corpse of the township of Whitby jet
worker for being drunk and disorderly in Bridge Street; on the oath
of Edward Weeks of the township of Whitby police constable. Offence
committed at the township of Whitby on 6 July 1875. Whitby Strand -
case heard at Whitby" -- informant Edward Weeks (person 6854), home
Whitby, occupation police constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 734

"Summary conviction of George Duck of the township of Whitby cart
driver for driving a carriage furiously in the street; on the oath of
[blank] Tomlinson of the township of Whitby police constable. Offence
committed at the township of Whitby on 18 August 1869. Whitby
Strand - case heard at Whitby" -- informant [blank] Tomlinson (person
6855), home Whitby, occupation police constable, correctly no
first_name/sex (matches source's own "[blank]" notation). No fixes
needed.

**OK — no changes.**

---

## Record 737

"Summary conviction of Henry Sherwood and Robert Campion for stealing
a bushel of apples value 2s, the property of Joseph Dotchen and
growing in his garden. Offence committed at the township of Ruswarp
on 15 August 1869. Whitby Strand - case heard at Whitby" -- property
owner Joseph Dotchen (person 6856), sex already correctly male, no
home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 740

"Summary conviction of William Arnold for assaulting Mary Harland.
Offence committed at the township of Hawsker cum Stainsacre on 18
August 1869. Whitby Strand - case heard at Whitby" -- victim Mary
Harland (person 6857), sex already correctly female, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 745

Licensee Thomas Coulson (person 6858), occupation "licensee", sex
already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 748

"Summary conviction of Hannah Smith wife of John Henry Smith of the
township of Whitby fish hawker for being drunk and disorderly in
Henrietta Street. Offence committed at the township of Whitby on 13
April 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- spouse John Henry Smith (person 9918, distinct row from
record 1089's defendant of the same name), home Whitby, occupation
fish hawker, sex male. No fixes needed.

**OK — no changes.**

---

## Record 751

"Summary conviction of James Foster of Elbow Yard in the township of
Whitby for not sending his son John Foster to school. Offence
committed in the Whitby Strand School Board district on 23 May 1889.
Case heard at Whitby" -- child John Foster (person 10271), sex male
(fixed earlier). No fixes needed for this pass.

**OK — no changes.**

---

## Record 753

"Summary conviction of William Arnold of the township of Whitby jet
worker for assaulting John Brown. Offence committed at the township
of Whitby on 2 September 1875. Whitby Strand - case heard at Whitby"
-- victim John Brown (person 6859), sex already correctly male, no
home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 754

"Summary conviction of Sarah Ann Fisher wife of Thomas Fisher of the
township of Whitby riveter for being drunk and disorderly in
Henrietta Street. Offence committed at the township of Whitby on 11
May 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- spouse Thomas Fisher (person 9919), home Whitby, occupation
riveter, sex male. No fixes needed.

**OK — no changes.**

---

## Record 756

Same defendant (Robert Watson) and date as record 645 -- part of the
already-linked 645/750/756 cluster. Victim Edward Weeks (person 6860,
distinct row from record 732), constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 758

"Summary conviction of William Lawson of the township of Newholm cum
Dunsley labourer for being drunk on the licensed premises of John
Appleby and refusing to leave when asked by the said John Appleby ;
on the oath of William Dickinson of the township of Lythe police
constable. Offence committed at the township of Whitby on 23 August
1869. Whitby Strand - case heard at Whitby" -- licensee John Appleby
(person 6861), occupation "licensee", sex male. Informant William
Dickinson (person 6862), home Lythe, occupation police constable, sex
male. No fixes needed.

**OK — no changes.**

---

## Record 759

Another distinct Ellen Hick/Isaac Hick pair -- spouse Isaac Hick
(person 9920), home Whitby, occupation jet worker, sex male. No fixes
needed.

**OK — no changes.**

---

## Record 761

"Summary conviction of William Turnbull of the township of Hinderwell
fish hawker for using his cart on the Staithes and Hinderwell highway
without having his name painted on it; on the oath of Charles Tempest
Clarkson of the township of Whitby superintendent of police. Offence
committed at the township of Hinderwell on 31 August 1869. Whitby
Strand - case heard at Whitby" -- informant Charles Tempest Clarkson
(person 6863, distinct row), home Whitby, occupation superintendent
of police, sex already correctly male. Location correctly includes
both Hinderwell and the Staithes & Hinderwell cross-parish highway
node (106), matching the established convention. No fixes needed.

**OK — no changes.**

---

## Record 762

"Summary conviction of Ann Gatenby wife of Richard Gatenby of the
township of Whitby fisherman for using obscene language. Offence
committed at the township of Whitby on 11 July 1875. Whitby Strand -
case heard at Whitby" -- spouse Richard Gatenby (person 9921), home
Whitby, occupation fisherman, sex male. No fixes needed.

**OK — no changes.**

---

## Record 764

Same John Atkinson type as record 689 (distinct row) -- home
Hinderwell, occupation police constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 766

Already verified in the earlier 20-sample rigorous check -- victim
Dorothy Pennock (person 6865), sex already correctly female, no
home/occupation stated (correctly absent). Spouse Thomas Pennock
(person 9922), home Whitby, occupation iron worker, sex male. No
fixes needed.

**OK — no changes.**

---

## Record 769

"Summary conviction of William Bradley of The Fox and Hounds Inn at
Ainthorpe in Danby in the township of Danby for assaulting Warner
Coleman. Offence committed at the township of Eskdaleside cum
Ugglebarnby on 13 April 1889. Whitby Strand Petty Sessional division
- case heard at Whitby" -- victim Warner Coleman (person 6866), sex
already correctly male, no home/occupation stated, correctly absent.
No fixes needed.

**OK — no changes.**

---

## Record 770

Same Thomas Bowron type as records 380/489/501 (distinct row) -- home
Egton, occupation police constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 772

Seed record for the confirmed dead-fence cluster (772/784/867/876) --
property owner Thomas Beeforth (person 6868, distinct row from
record 497), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 773

Same Staithes Street/John Atkinson cluster as record 764 -- already
thoroughly linked (764/773/782/785/791/806/809/812). Informant John
Atkinson (person 6869, distinct row), home Hinderwell, occupation
police constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 774

This is the original "William Henry Heath, Hinderwell licensee"
record referenced when auditing record 996 (a different William
Henry Heath, Whitby farmer, was correctly kept distinct) -- licensee
(person 6870), occupation "licensee", sex already correctly male.
Informant William Hammond (person 6871, distinct row from records
357/729), home not stated for him here, occupation police constable,
sex male. No fixes needed.

**OK — no changes.**

---

## Record 776

"Summary conviction of Thomas Hedley Robinson of the township of
Hinderwell fisherman for assaulting John Atkinson one of the
constables of the North Riding in the execution of his duty. Offence
committed at the township of Hinderwell on 28 August 1869. Whitby
Strand - case heard at Whitby" -- victim John Atkinson (person 6872,
distinct row, same real constable likely policing the Staithes Street
cluster 764/773/etc.), sex already correctly male. Pre-existing
related_conviction link to 806 (same defendant, same date), already
correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 778

"Summary conviction of James Dixon of Kiln Yard in the township of
Whitby for not sending his daughter Jane Elizabeth Dixon to school.
Offence committed in the Whitby Strand School Board district on 27
May 1889. Case heard at Whitby" -- child Jane Elizabeth Dixon (person
10272) had blank sex despite "Jane" being unambiguous.

**FIXED — set sex=female for Jane Elizabeth Dixon (person 10272).**

---

## Record 781

"Summary conviction of John Parkin of Old Post Office Yard in the
township of Whitby for not sending his daughter Sarah Parkin to
school. Offence committed in the Whitby Strand School Board district
on 24 May 1889. Case heard at Whitby" -- child Sarah Parkin (person
10273) had blank sex despite "Sarah" being unambiguous.

**FIXED — set sex=female for Sarah Parkin (person 10273).**

**Targeted sweep note**: after finding this pattern 5 times in a row
(586, 588, 604, 703, 778, 781), ran two full sweeps across the
already-swept range (id <= 1100): (1) all "child"-type roles with
blank sex + common female first name -- found 3 more (Caroline Howard
796, Mary Ellen Atkinson 909, Amelia Smithies 957), all verified
against raw_record ("his daughter X") before fixing; (2) all
non-defendant, non-child roles with blank sex + common female first
name -- found zero additional (confirms the individually-found
victims Mary Hellewell/Elizabeth Lemon/Mary Dixon were the full set
for that category). Also checked the equivalent male-name pattern for
children -- zero gaps, sons were reliably captured already. The
already-swept range (id <= 1100) is now clean for this specific
gap pattern.

---

## Record 782

Same Staithes Street cluster as 764/773 -- informant John Atkinson
(person 6873, distinct row), home Hinderwell, occupation police
constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 783

"Summary conviction of Ann Jackson wife of Charles Jackson for
lodging in a shed with no visible means of subsistence and not giving
a good account of herself. Offence committed at the parish of Whitby
on 25 July 1875. Whitby Strand - case heard at Whitby" -- spouse
Charles Jackson (person 9923), sex already correctly male, no home/
occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 784

Same dead-fence cluster as record 772 -- property owner Thomas
Beeforth (person 6874, distinct row), sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 790

"Summary conviction of Agnes Baker wife of William George Baker of
the township of Whitby jet worker for being drunk and disorderly at
the Bridge End. Offence committed at the township of Whitby on 21
April 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- spouse William George Baker (person 9924), home Whitby,
occupation jet worker, sex male. No fixes needed.

**OK — no changes.**

---

## Record 792

"Summary conviction of Ann Miller wife of James Miller of the
township of Whitby stonemason for assaulting Henry Douglas. Offence
committed at the township of Whitby on 2 August 1875. Whitby Strand -
case heard at Whitby" -- victim Henry Douglas (person 6875, distinct
row from record 1082's defendant), sex already correctly male, no
home/occupation stated, correctly absent. Spouse James Miller (person
9925), home Whitby, occupation stonemason, sex male. No fixes needed.

**OK — no changes.**

---

## Record 794

"Summary conviction of George Porritt of the township of Hinderwell
fisherman for assaulting John Atkinson one of the constables for the
North Riding in the execution of his duty. Offence committed at the
township of Hinderwell on 28 August 1869. Whitby Strand - case heard
at Whitby" -- victim John Atkinson (person 6876, distinct row), sex
already correctly male. Same victim, offence, and date as record 776
(Thomas Hedley Robinson assaulting the same constable) -- no link
existed. Added one.

**FIXED — added related_conviction link (776, 794): "Same victim
(constable John Atkinson), same offence (assault), same date --
likely one incident during the same Staithes Street enforcement
action, two men prosecuted separately."**

---

## Record 796

Already fixed as part of the sweep at record 781 -- child Caroline
Howard (person 10274), sex set to female. No further fixes needed.

**OK — no changes** (fix already applied during sweep).

---

## Record 797

Third man assaulting John Atkinson on 28 August 1869 (776/794/797) --
victim (person 6877), constable, sex already correctly male. Swept
`offence_date='1869-08-28' AND raw_record LIKE '%assaulting John
Atkinson%'` and confirmed exactly 3 records, no more. Added the link.

**FIXED — added related_conviction link (776, 797). Cluster confirmed
complete (3 of 3).**

---

## Record 799

Same names as record 790 (Agnes/William George Baker) but a
different date -- correctly distinct rows (858, 9926). Spouse home
Whitby, occupation jet worker, sex male. No fixes needed.

**OK — no changes.**

---

## Record 800

"Summary conviction of Elizabeth Sneaton [Elizabeth Skinner] of the
township of Whitby for obstructing a street; on the oath of Charles
Albert Martindale of the township of Whitby police constable. Offence
committed at the township of Whitby on 27 August 1869. Whitby Strand
- case heard at Whitby" -- defendant's bracketed alternate name
"[Elizabeth Skinner]" correctly captured in the `alias` field.
Informant Charles Albert Martindale (person 6878, distinct row), home
Whitby, occupation police constable, sex already correctly male. No
fixes needed.

**OK — no changes.**

---

## Record 802

"Summary conviction of Jane Storm wife of Sampson Storm of the
township of Whitby iron worker for being drunk and disorderly in
Henrietta Street. Offence committed at the township of Whitby on 23
April 1889. Whitby Strand Petty Sessional division - case heard at
Whitby" -- spouse Sampson Storm (person 9927, distinct row from
record 178's Sampson Storm), home Whitby, occupation iron worker, sex
male. No fixes needed.

**OK — no changes.**

---

## Record 803

"Summary conviction of George Henderson of the township of Egton for
assaulting Joseph Wedgewood. Offence committed at the township of
Egton on 28 August 1869. Whitby Strand - case heard at Whitby" --
victim Joseph Wedgewood (person 6879), sex already correctly male, no
home/occupation stated, correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 807

"Summary conviction of John Thompson of the township of Whitby jet
worker for being drunk and disorderly in Church Street; on the oath
of Mark Boggett of the township of Whitby police constable. Offence
committed at the township of Whitby on 12 August 1875. Whitby Strand
- case heard at Whitby" -- informant Mark Boggett (person 6880,
distinct row from record 577's victim of the same name), home Whitby,
occupation police constable, sex already correctly male. No fixes
needed.

**OK — no changes.**

---

## Record 810

This is the Dixon/Weeks related_conviction pair seed record (memory
note references pair 810/920) -- victim Edward Weeks (person 6881,
distinct row from record 732), constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 815

"Summary conviction of Joseph Lemarte for assaulting Michael Maloney.
Offence committed at the township of Whitby on 9 September 1869.
Whitby Strand - case heard at Whitby" -- victim Michael Maloney
(person 6882), sex already correctly male, no home/occupation stated,
correctly absent. No fixes needed.

**OK — no changes.**

---

## Record 816

"Summary conviction of Peter Elder Leck of the Longsteps in the
township of Whitby for assaulting Sarah Mary Leck; on the oath of the
said Sarah Mary Leck wife of Simon Robert Leck of the township of
Whitby jet worker. Offence committed at the township of Whitby on 13
August 1875. Whitby Strand - case heard at Whitby" -- victim Sarah
Mary Leck (person 6883), home Whitby, sex female. Spouse Simon Robert
Leck (person 10198), home Whitby, occupation jet worker, sex male.
Both correctly captured. No fixes needed.

**OK — no changes.**

---

## Record 818

"Summary conviction of Robert Dixon of the township of Whitby sailor
for assaulting John Ryder one of the constables for the North Riding
in the execution of his duty. Offence committed at the township of
Whitby on 9 September 1869. Whitby Strand - case heard at Whitby" --
victim John Ryder (person 6884, distinct row from records 416/486),
constable, sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 822

Already fixed earlier this session (widow occupation for Jane
Thompson) -- informant George Hewison (person 6885, distinct row
from records 375/807), home Whitby, occupation police constable, sex
already correctly male. No fixes needed for this pass.

**OK — no changes.**

---

## Record 828

"Summary conviction of John Nellist of the township of Fylingdales
licensed victualler for opening his licensed premises outside
licensing hours; on the oath of George Eli North of the township of
Fylingdales police constable. Offence committed at the township of
Fylingdales at 12.05 p.m. on 22 August 1875. Whitby Strand - case
heard at Whitby" -- informant George Eli North (person 6886), home
Fylingdales, occupation police constable, sex already correctly male.
No fixes needed.

**OK — no changes.**

---

## Record 830

"Summary conviction of William Harland for assaulting Alice
Weatherill. Offence committed at the township of Whitby on 9
September 1869. Whitby Strand - case heard at Whitby" -- victim Alice
Weatherill (person 6887, distinct row from record 651), sex already
correctly female, no home/occupation stated, correctly absent. No
fixes needed.

**OK — no changes.**

---

## Record 836

"Summary conviction of David Adamson of the township of Whitby
fisherman for assaulting Samuel Hutchings. Offence committed at the
township of Whitby on 13 September 1869. Whitby Strand - case heard
at Whitby" -- victim Samuel Hutchings (person 6888), sex already
correctly male, no home/occupation stated, correctly absent. No fixes
needed.

**OK — no changes.**

---

## Record 840

"Summary conviction of John Jones of the township of Whitby coal
porter for being drunk on the licensed premises of Joseph Fletcher
and refusing to leave when asked by John Nicholson a police
constable. Offence committed at the township of Whitby on 30 August
1875. Whitby Strand - case heard at Whitby" -- licensee Joseph
Fletcher (person 6889), occupation "licensee", sex male. Informant
John Nicholson (person 6890, distinct row from records 518/542), home
Whitby, occupation police constable, sex male. No fixes needed.

**OK — no changes.**

---

## Record 843

Licensee Frederick William Judge (person 6891), occupation
"licensee", sex already correctly male. No fixes needed.

**OK — no changes.**

---

## Record 853

Victim Alice Joyce (person 6892), sex correctly female from
unambiguous first name. Spouse William Hobson (person 9928) fully
populated (home Whitby, occupation sailor, sex male) from earlier
fix. No changes needed.

**OK — no changes.**

---

## Record 854

Informant Thomas Bowron (person 6893) fully populated (home
Glaisdale, occupation police constable, sex male). No changes
needed. (Distinct person from other Thomas Bowron rows elsewhere in
corpus, per no-cross-conviction-merge.)

**OK — no changes.**

---

## Record 856

Victim Elizabeth Hobson (person 6894), sex correctly female.
Spouse Patrick Joyce (person 9929) fully populated (home Whitby,
occupation bricklayer, sex male). Completeness fields all correct —
no fix needed there.

**FIXED (related_conviction only)** — this is the mirror-image
charge to record 853: Elizabeth Hobson convicted of assaulting
Alice Joyce (853), Alice Joyce convicted of assaulting Elizabeth
Hobson (856), same township (Whitby) and same offence date (20
April 1889) — a mutual assault, each summonsed against the other.
Not previously linked. Added related_conviction (853, 856) with a
note. This is a same-named-party+offence+date link, consistent with
established linking patterns; no new pattern type invoked.

---

## Record 860

Witnesses Hannah Cooper (6895) and Harriet Hicks (6896) fully
populated (home Whitby, occupation singlewoman, sex female). Spouse
Thomas Gaines (9930) fully populated. No changes needed.

**OK — no changes.**

---

## Record 863

Victim Emma Walden (person 6897), sex correctly female. No
home/occupation stated in source for anyone (defendants or victim)
— correctly left null, not fabricated. "and another" unnamed second
victim correctly not invented as a person row. No changes needed.

**OK — no changes.**

---

## Record 864

Victim William Bradley (person 6898), sex correctly male. No
home/occupation stated for victim in source. No changes needed.

**OK — no changes.**

---

## Record 867

Property owner Thomas Beeforth (person 6899), sex correctly male.
No home/occupation stated in source. No changes needed.

**OK — no changes.**

---

## Record 868

Informant Charles Albert Martindale (person 6900) fully populated
(home Whitby, occupation police constable, sex male, middle_name
Albert correctly captured — confirmed by re-querying with the
middle_name column, not visible in the standard query template used
for this sweep). Spouse William Hezlewood (9931) fully populated.
No changes needed.

**OK — no changes.**

---
