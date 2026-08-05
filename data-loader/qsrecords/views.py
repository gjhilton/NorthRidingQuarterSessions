"""SQL views built on top of the normalized schema.

These aren't part of the core pipeline -- they exist to make the user's
actual research question ("incidents in Whitby, or involving Whitby people")
a single query, per the plan's discussion of why Location is normalized
rather than stored as free text. Recreated on every create_views() call so
the definition can't drift out of sync with this file after a code change.

v3 unified schema note: Town/Street/Place (and the old flat
offence_location_town_id/court_location_town_id scalar columns) are gone --
locations now live in one self-referential `location` tree
(qsrecords.models.reference.Location), and a conviction's location ties are
rows in summary_conviction_location (role='location of offence'/'court
location'/'petty sessional division'), a person's home is
person.home_location_id. "At or under Whitby" is resolved with a SQLite
`WITH RECURSIVE` CTE that walks the tree from the row named "whitby" (case-
insensitively -- location names aren't consistently cased) down through
every descendant, rather than a single equality test against one town_id.
"""

from sqlalchemy import text
from sqlmodel import Session

# Every location at or under the node named "whitby" (case-insensitive --
# location.name casing isn't consistently normalized across the corpus).
# Shared by both views below.
_WHITBY_SUBTREE_CTE = """
WITH RECURSIVE whitby_subtree(id) AS (
    SELECT id FROM location WHERE lower(name) = 'whitby'
    UNION ALL
    SELECT loc.id FROM location loc
    JOIN whitby_subtree ws ON loc.parent_id = ws.id
)
"""

# Deliberately excludes the 'court location' role: a case merely *heard* at
# Whitby's Petty Sessions, with no other tie to the town, doesn't count.
# NOTE: this makes it the wrong tool for identifying scrape false positives
# -- it excludes the large majority of genuine surrounding-township cases
# heard at Whitby's Petty Sessions. See whitby_in_scope_conviction below for
# that purpose instead.
WHITBY_CONNECTED_CONVICTION_VIEW = f"""
CREATE VIEW whitby_connected_conviction AS
{_WHITBY_SUBTREE_CTE}
SELECT DISTINCT sc.*
FROM summary_conviction sc
LEFT JOIN summary_conviction_location scl
    ON scl.summary_conviction_id = sc.id AND scl.role = 'location of offence'
LEFT JOIN summary_conviction_person scp ON scp.summary_conviction_id = sc.id
LEFT JOIN person p ON p.id = scp.person_id
WHERE scl.location_id IN (SELECT id FROM whitby_subtree)
   OR p.home_location_id IN (SELECT id FROM whitby_subtree)
"""

# The scrape (scraper/01_list_resources.py) found records via a free-text
# "whitby" keyword search against the archive catalogue, with no structured
# place filter -- this inevitably catches some records by pure textual
# coincidence (a defendant surnamed "Whitby" who never lived near the town,
# a pub called the "Whitby Arms Inn", a railway/road merely *named* after
# Whitby). Unlike whitby_connected_conviction above, this INCLUDES the
# 'court location' role as a genuine in-scope signal -- a case heard at
# Whitby's Petty Sessions reflects real Whitby Strand jurisdiction over its
# surrounding townships, which is squarely this project's documented scope,
# regardless of where the underlying offence physically occurred. Verified
# by hand against every one of the ~26 records this flags as out of scope
# (see OUT_OF_SCOPE_REVIEW.md at the repo root) before anything was removed.
WHITBY_IN_SCOPE_CONVICTION_VIEW = f"""
CREATE VIEW whitby_in_scope_conviction AS
{_WHITBY_SUBTREE_CTE}
SELECT DISTINCT sc.*
FROM summary_conviction sc
LEFT JOIN summary_conviction_location scl
    ON scl.summary_conviction_id = sc.id
   AND scl.role IN ('location of offence', 'court location')
LEFT JOIN summary_conviction_person scp ON scp.summary_conviction_id = sc.id
LEFT JOIN person p ON p.id = scp.person_id
WHERE scl.location_id IN (SELECT id FROM whitby_subtree)
   OR p.home_location_id IN (SELECT id FROM whitby_subtree)
"""


def create_views(session: Session) -> None:
    # session.execute() (inherited from SQLAlchemy's Session), not
    # session.exec() -- SQLModel's exec() is typed for Select statements only.
    session.execute(text("DROP VIEW IF EXISTS whitby_connected_conviction"))
    session.execute(text(WHITBY_CONNECTED_CONVICTION_VIEW))
    session.execute(text("DROP VIEW IF EXISTS whitby_in_scope_conviction"))
    session.execute(text(WHITBY_IN_SCOPE_CONVICTION_VIEW))
