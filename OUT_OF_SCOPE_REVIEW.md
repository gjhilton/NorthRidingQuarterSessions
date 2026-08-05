# Out-of-scope record review log

Manual review of the 26 records identified as likely false positives from
the "whitby" free-text keyword scrape (see the planning session that
produced this list — `qsrecords.views.whitby_in_scope_conviction` is the
reproducible rule that generated this candidate set: a record is flagged
here if none of {offence town, court town, any defendant's town, any
involved person's town} is Whitby).

Each entry is reviewed one at a time with the project owner before any
removal happens. Status is `pending` until explicitly confirmed, then
`confirmed` (remove) or `rejected` (keep — rule misfired, investigate why).

**Review complete: 26/26 confirmed for removal.** Removal not yet executed
against `data/db.sqlite` — see the plan file for the migration script that
will act on this list.

---

## 1/26 — QSB 1803 1/10/3/6 — status: confirmed

> Summary conviction of Thomas Whitby of Old Malton for having in his
> possession one false and defective two-pound weight. Offence committed
> at New Malton on 24 August 1802. Case heard at a Petty Sessions held at
> Kirby Moorside for the wapentake of Ryedale.

- Offence town: New Malton
- Court town: Kirby Moorside
- Defendant: Thomas Whitby, town = Old Malton
- Involved persons: none
- **Flagged reason**: matched only because the defendant's surname is
  "Whitby" — lives in Old Malton, offence in New Malton, heard at Kirby
  Moorside (Ryedale wapentake). No connection to the town of Whitby.

---

## 2/26 — QSB 1803 4/10/1 — status: confirmed

> Summary conviction of John Law of Grosmont Haggs in the parish of Egton
> farmer and John Watson of Aislaby near Whitby gardener for taking fish
> in a stream called Thornton Beck above the town of Thornton in the
> parish of Thornton, which stream and fishery were the property of John
> Gilby of Thornton clerk and John Ward of Yedingham in the East Riding
> clerk. Offence committed on 7 June 1803 at Thornton.

- Offence town: Thornton
- Court town: (none recorded)
- Defendants: John Law, town = Egton; John Watson, town = Aislaby
- Involved persons: John Gilby, town = Thornton (owner of stream/fishery);
  John Ward, town = Yedingham (owner of stream/fishery)
- **Flagged reason**: matched only via the descriptive phrase "of Aislaby
  *near Whitby*" — the extracted town is Aislaby (correctly, a distinct
  town), not Whitby itself. Offence and every named person's town are all
  in the Thornton/Egton/Yedingham area, unrelated to Whitby or its
  jurisdiction.

---

## 3/26 — QSB 1818 2/10/13 — status: confirmed

(Note: briefly queried whether John Nicholson might be a known Whitby
figure from outside knowledge; the raw text itself gives no place for him
at all — unlike John Steel, explicitly "of Winteringham" — so there's no
textual basis to keep this in scope, and it was confirmed for removal on
that basis.)

> Summary conviction of James Wilson, extra guard of the mail from Whitby
> to the city of York, for receiving a pheasant from John Nicholson; on
> the information of John Steel of Winteringham servant to George
> Strickland esquire, and witnessed by John Nicholson. Offence committed
> at the parish of St Michael in New Malton on 3 February 1818.

- Offence town: New Malton
- Court town: (none recorded)
- Defendant: James Wilson, town = (blank); occupation = "extra guard of
  the mail from Whitby to York" (names Whitby as one end of a mail route,
  not a residence)
- Involved persons: John Nicholson, town = (blank), witness; John Steel,
  town = Winteringham, informant; George Strickland, town = (blank)
- **Flagged reason**: matched only via the defendant's occupation
  description naming Whitby as the origin of a mail route. Offence is in
  New Malton; no one named has any residential connection to Whitby.

---

## 4/26 — QSB 1818 2/10/14 — status: confirmed

> Summary conviction of William Holdsworth, driver and waggoner of the
> common carrier waggon from Whitby to the city of York, for purchasing
> nine pheasants from John Nicholson; on the information of John Steel of
> Winteringham servant to George Strickland esquire, and witnessed by John
> Nicholson. Offence committed at the parish of St Michael in New Malton
> on 21 January 1818.

- Offence town: New Malton
- Court town: (none recorded)
- Defendant: William Holdsworth, town = (blank); occupation = "driver and
  waggoner of the common carrier waggon from Whitby to the city of York"
- Involved persons: John Steel, town = Winteringham, informant; John
  Nicholson, town = (blank), witness; George Strickland, town = (blank)
- **Flagged reason**: companion case to #3 (same people, same date range,
  different defendant) — Whitby appears only via a waggon-route
  description, no residential connection to Whitby for anyone named.

---

## 5/26 — QSB 1834 4/10/40 — status: confirmed

> Summary conviction dated 25 September 1834 of Johnson Whitby of the
> township of Scarborough labourer for assaulting Ann Holliday of the
> township of Scarborough widow. Offence committed at the township of
> Newby on 21 September 1834. Case heard at Scarborough. With receipt
> dated 2 October 1834 for a £1 fine paid by Johnson Whitby to John
> Smallwood, one of the overseers of the poor of the township of Newby.

- Offence town: Newby
- Court town: Scarborough
- Defendant: Johnson Whitby, town = Scarborough
- Involved persons: Ann Holliday, town = Scarborough (victim); John
  Smallwood, town = Newby (overseer of the poor)
- **Flagged reason**: matched only because the defendant's surname is
  "Whitby" — he lives in Scarborough, offence in Newby, heard at
  Scarborough. No connection to the town of Whitby at all.

---

## 6/26 — QSB 1835 3/10/22 — status: confirmed

> Summary conviction of Henry Swinton Walker of Woodlands in the township
> of Aislaby in the parish of Whitby, land steward, for obstructing the
> Whitby and Pickering Railway by placing rails across a bridge. Offence
> committed at the township of Egton in the parish of Lythe on Tuesday 5
> May 1835. Case heard at Pickering.

- Offence town: Egton
- Court town: Pickering
- Defendant: Henry Swinton Walker, town = Aislaby (correctly extracted as
  a distinct town from the "parish of Whitby" administrative reference)
- Involved persons: none
- **Flagged reason**: matched via "in the parish of Whitby" (an
  administrative/parish qualifier on Aislaby, not the town itself) and
  the railway's name ("Whitby and Pickering Railway"). Offence in Egton,
  heard in Pickering, defendant's actual town is Aislaby.

---

## 7/26 — QSB 1839 4/10/92 — status: confirmed

> Summary conviction of Richard Thompson of the township of Sneaton farmer
> for driving two horses on the Whitby and Pickering railway; on the
> information of Alfred Jefferson of the township of Ruswarp collector of
> tolls on the Whitby and Pickering railway. Offence committed at the
> township of Hawsker cum Stainsacre on 1 July 1839.

- Offence town: Hawsker cum Stainsacre
- Court town: (none recorded)
- Defendant: Richard Thompson, town = Sneaton
- Involved persons: Alfred Jefferson, town = Ruswarp
- **Flagged reason**: no field literally matches "whitby" (every place
  named — Sneaton, Ruswarp, Hawsker cum Stainsacre — is a genuine
  surrounding township, not a coincidence), and no court town is
  recorded. Flagged as a possible rule gap rather than a clear false
  positive; removal confirmed by the project owner regardless.

---

## 8/26 — QSB 1856 1/10/13/15 — status: confirmed

> Summary conviction of George Booth for travelling in a railway carriage
> on the Whitby and Pickering branch of the North Eastern Railway Company
> from Sleights to Pickering without having bought a ticket. Offence
> committed on 24 October 1855. Case heard at New Malton.

- Offence town: (none recorded)
- Court town: New Malton
- Defendant: George Booth, town = (blank), no occupation recorded
- Involved persons: none
- **Flagged reason**: "Sleights" (a genuine Whitby-area village on this
  railway line) appears in the text but wasn't extracted as anyone's
  town, so no field literally matches "whitby" or a known surrounding
  township. Initially kept as an exception, then reconsidered — **project
  owner confirmed removal, no exceptions.**

---

## 9/26 — QSB 1864 2/10/13/42 — status: confirmed

> Summary conviction of Richard Bishop of the borough of Middlesbrough
> puddler for being drunk and disorderly on licensed premises called the
> "Whitby Arms Inn" in Stockton Street, and not leaving when asked by
> Robert Henderson of the borough of Middlesbrough innkeeper. Offence
> committed at the borough of Middlesbrough on 21 June 1863. Case heard
> at the borough of Middlesbrough.

- Offence town: Middlesbrough
- Court town: Middlesbrough
- Defendant: Richard Bishop, town = Middlesbrough
- Involved persons: Robert Henderson, town = Middlesbrough
- **Flagged reason**: matched purely via a pub's brand name ("Whitby Arms
  Inn"). Everyone and everything in this record is Middlesbrough; no
  connection to the town of Whitby.

---

## 10/26 — QSB 1865 1/10/14/18 — status: confirmed

> Summary conviction of George Stockill of Pickering farmer for removing
> soil and turf from the side of the Whitby and Pickering Highway.
> Offence committed at the township of Pickering on 3 November 1864.
> Case heard at Pickering.

- Offence town: Pickering
- Court town: Pickering
- Defendant: George Stockill, town = Pickering
- **Flagged reason**: matched purely via a road's name ("Whitby and
  Pickering Highway"). Defendant lives in Pickering, offence and court
  both in Pickering — no connection to Whitby.

---

## 11/26 — QSB 1865 1/10/14/8 — status: confirmed

> Summary conviction of Thomas Wallis of Pickering labourer for
> obstructing Whitby Road by "baiting" a horse there and leaving it for
> 10 minutes without just cause. Offence committed at the township of
> Pickering on 3 July 1864. Case heard at Pickering.

- Offence town: Pickering
- Court town: Pickering
- Defendant: Thomas Wallis, town = Pickering
- **Flagged reason**: matched purely via a street name ("Whitby Road" in
  Pickering). Everyone and everything here is Pickering.

---

## 12/26 — QSB 1866 1/10/4/2 — status: confirmed

> Summary conviction of Richard Whitby of the township of Hudswell
> labourer for trespassing in the daytime in search of game on land in
> the possession and occupation of John Eddy. Offence committed at the
> township of Hudswell on 23 September 1865. Case heard at Richmond.

- Offence town: Hudswell / Court town: Richmond
- Defendant: Richard Whitby, town = Hudswell
- Involved persons: John Eddy, town = (blank), landowner
- **Flagged reason**: surname coincidence only. Confirmed by delegated
  judgment (clear-cut, same pattern as #1/#5/#18).

---

## 13/26 — QSB 1868 1/10/12/86 — status: confirmed

> Summary conviction of Thomas Darcey of the borough of Middlesbrough
> labourer for assaulting Matthew Robinson of Newholm near Whitby farmer.
> Offence committed at the borough of Middlesbrough on 28 November 1867.
> Case heard at the borough of Middlesbrough.

- Offence town: Middlesbrough / Court town: Middlesbrough
- Defendant: Thomas Darcey, town = Middlesbrough
- Involved persons: Matthew Robinson, town = Newholm cum Dunsley (victim)
- **Flagged reason**: the victim's town (Newholm cum Dunsley) is a
  genuine Whitby-area township, not a coincidence — but the assault
  itself, the defendant, and the court are all squarely Middlesbrough,
  nothing Whitby-area about the incident itself. Same pattern as #14
  (companion case, same victim, same incident, different co-defendant).
  Raised for judgment given this one; project owner confirmed removal —
  the incident itself isn't Whitby-relevant even though the victim is
  from the area.

---

## 14/26 — QSB 1868 1/10/12/87 — status: confirmed

> Summary conviction of Emanuel Harker of the borough of Middlesbrough
> labourer for assaulting Matthew Robinson of Newholm near Whitby farmer.
> Offence committed at the borough of Middlesbrough on 28 November 1867.
> Case heard at the borough of Middlesbrough.

- Offence town: Middlesbrough / Court town: Middlesbrough
- Defendant: Emanuel Harker, town = Middlesbrough
- Involved persons: Matthew Robinson, town = Newholm cum Dunsley (victim)
- **Flagged reason**: companion case to #13 — same victim, same incident,
  different co-defendant. Same reasoning and confirmation as #13.

---

## 15/26 — QSB 1868 4/10/14/2 — status: confirmed

> Summary conviction of John Pennock of Pickering labourer for wilfully
> interfering with the comfort of other passengers whilst a passenger on
> the Malton and Whitby line of the North Eastern Railway. Offence
> committed at the township of Pickering on 7 November 1864. Case heard
> at Pickering.

- Offence town: Pickering / Court town: Pickering
- Defendant: John Pennock, town = Pickering
- **Flagged reason**: railway-line name coincidence only. Confirmed by
  delegated judgment.

---

## 16/26 — QSB 1868 4/10/14/29 — status: confirmed

> Summary conviction of Elizabeth Pamley for behaving in an indecent
> manner in Whitby Lane. Offence committed at the parish of Pickering on
> 28 August 1865.

- Offence town: (parish of Pickering) / Court town: (none recorded)
- Defendant: Elizabeth Pamley, town = (blank)
- **Flagged reason**: street-name coincidence only ("Whitby Lane" in
  Pickering). Confirmed by delegated judgment.

---

## 17/26 — QSB 1868 4/10/14/59 — status: confirmed

> Summary conviction of William Wallace of Pickering labourer for moving
> a cow into Whitby Lane in the parish of Pickering when there was an
> order prohibiting such movement. Offence committed at the township of
> Pickering on 14 April 1866. Case heard at Pickering.

- Offence town: Pickering / Court town: Pickering
- Defendant: William Wallace, town = Pickering
- **Flagged reason**: street-name coincidence only ("Whitby Lane" in
  Pickering). Confirmed by delegated judgment.

---

## 18/26 — QSB 1875 2/10/7/179 — status: confirmed

> Summary conviction of Hugh Whitby of Redcar labourer for being drunk in
> the highway. Offence committed at the township of Redcar on 6 February
> 1875. Case heard at Guisborough.

- Offence town: Redcar / Court town: Guisborough
- Defendant: Hugh Whitby, town = Redcar
- **Flagged reason**: surname coincidence only. Confirmed by delegated
  judgment.

---

## 19/26 — QSB 1884 1/10/6/47 — status: confirmed

> Summary conviction of David Johnson of Loftus farmer for going on the
> Loftus and Whitby branch line of the North Eastern Railway having been
> warned not to go there by Thomas Groves a servant of the Railway
> Company. Offence committed at the township of Loftus on 22 September
> 1883. Case heard at Loftus.

- Offence town: Loftus / Court town: Loftus
- Defendant: David Johnson, town = Loftus
- Involved persons: Thomas Groves, town = (blank), informant
- **Flagged reason**: railway-line name coincidence only. Confirmed by
  delegated judgment.

---

## 20/26 — QSB 1885 2/10/7/40 — status: confirmed

> Summary conviction of Robert William Mays of Staithes miner for
> travelling on the Loftus and Whitby railway without having paid his
> fare and with intent to avoid payment. Offence committed at the
> township of Loftus on 22 November 1884. Case heard at Guisborough.

- Offence town: Loftus / Court town: Guisborough
- Defendant: Robert William Mays, town = Staithes
- **Flagged reason**: railway-line name coincidence only. Confirmed by
  delegated judgment (companion case to #21/#22).

---

## 21/26 — QSB 1885 2/10/7/41 — status: confirmed

> Summary conviction of William Duck of Staithes miner for travelling on
> the Loftus and Whitby railway without having paid his fare and with
> intent to avoid payment. Offence committed at the township of Loftus on
> 22 November 1884. Case heard at Guisborough.

- Offence town: Loftus / Court town: Guisborough
- Defendant: William Duck, town = Staithes
- **Flagged reason**: companion case to #20/#22, same railway-line name
  coincidence. Confirmed by delegated judgment.

---

## 22/26 — QSB 1885 2/10/7/42 — status: confirmed

> Summary conviction of George Daniels of Staithes miner for travelling
> on the Loftus and Whitby railway without having paid his fare and with
> intent to avoid payment. Offence committed at the township of Loftus on
> 22 November 1884. Case heard at Guisborough.

- Offence town: Loftus / Court town: Guisborough
- Defendant: George Daniels, town = Staithes
- **Flagged reason**: companion case to #20/#21, same railway-line name
  coincidence. Confirmed by delegated judgment.

---

## 23/26 — QSB 1885 4/10/7/71 — status: confirmed

> Summary conviction of Thomas Jackson of Brotton miner for interfering
> with the comfort of other passengers in a carriage on the Saltburn and
> Whitby line of the North Eastern Railway Company. Offence committed at
> the township of Brotton on 17 August 1885. Case heard at Guisborough.

- Offence town: Brotton / Court town: Guisborough
- Defendant: Thomas Jackson, town = Brotton
- **Flagged reason**: railway-line name coincidence only. Confirmed by
  delegated judgment.

---

## 24/26 — QSB 1886 2/10/11/10 — status: confirmed

> Summary conviction of Mary Elizabeth Ward for travelling between
> Scarborough and Hayburn Wyke on the Scarborough and Whitby Railway
> without having paid her fare and with intent to avoid payment. Offence
> committed on 2 February 1886. Case heard at Scarborough.

- Offence town: (none recorded) / Court town: Scarborough
- Defendant: Mary Elizabeth Ward, town = (blank)
- **Flagged reason**: railway-line name coincidence only. Confirmed by
  delegated judgment.

---

## 25/26 — QSB 1887 1/10/6/78 — status: confirmed

> Summary conviction of Thomas Simpson, Richard Laudon, James Smith and
> William Kitchen, all of Brotton miners, and Edward Dack of North
> Skelton miner for playing pitch and toss with coins on the Guisborough
> and Whitby highway. Offence committed at the township of Stanghow on 28
> November 1886. Case heard at Guisborough.

- Offence town: Stanghow / Court town: Guisborough
- Defendants: Thomas Simpson, Richard Laudon, James Smith, William
  Kitchen (all Brotton); Edward Dack (North Skelton)
- **Flagged reason**: road-name coincidence only ("Guisborough and Whitby
  highway"). Confirmed by delegated judgment.

---

## 26/26 — QSB 1887 3/10/9/9 — status: confirmed

> Summary conviction of Robertshaw Murgatroyd for entering a carriage of
> a train on the Scarborough and Whitby Railway while the train was in
> motion. Offence committed at the township of Stainton Dale on 13 April
> 1887. Case heard at Scarborough.

- Offence town: Stainton Dale / Court town: Scarborough
- Defendant: Robertshaw Murgatroyd, town = (blank)
- **Flagged reason**: railway-line name coincidence only. Confirmed by
  delegated judgment.
