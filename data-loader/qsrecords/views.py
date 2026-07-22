"""SQL views built on top of the normalized schema.

These aren't part of the core pipeline -- they exist to make the user's
actual research question ("incidents in Whitby, or involving Whitby people")
a single query, per the plan's discussion of why Town/Street are normalized
rather than stored as free text. Recreated on every init_db() call so the
definition can't drift out of sync with this file after a code change.
"""

from sqlalchemy import text
from sqlmodel import Session

# Deliberately excludes court_location_town_id: a case merely *heard* at
# Whitby's Petty Sessions, with no other tie to the town, doesn't count.
# NOTE: this makes it the wrong tool for identifying scrape false positives
# -- it excludes ~2,011 of 6,257 convictions (verified), the large majority
# of which are genuine surrounding-township cases heard at Whitby's Petty
# Sessions. See whitby_in_scope_conviction below for that purpose instead.
WHITBY_CONNECTED_CONVICTION_VIEW = """
CREATE VIEW whitby_connected_conviction AS
SELECT DISTINCT sc.*
FROM summary_conviction sc
LEFT JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
LEFT JOIN defendant d ON d.id = scd.defendant_id
LEFT JOIN involved_persons ip ON ip.summary_conviction_id = sc.id
LEFT JOIN person p ON p.id = ip.person_id
WHERE sc.offence_location_town_id = (SELECT id FROM town WHERE name = 'whitby')
   OR d.town_id = (SELECT id FROM town WHERE name = 'whitby')
   OR p.town_id = (SELECT id FROM town WHERE name = 'whitby')
"""

# The scrape (scraper/01_list_resources.py) found records via a free-text
# "whitby" keyword search against the archive catalogue, with no structured
# place filter -- this inevitably catches some records by pure textual
# coincidence (a defendant surnamed "Whitby" who never lived near the town,
# a pub called the "Whitby Arms Inn", a railway/road merely *named* after
# Whitby). Unlike whitby_connected_conviction above, this INCLUDES
# court_location_town_id as a genuine in-scope signal -- a case heard at
# Whitby's Petty Sessions reflects real Whitby Strand jurisdiction over its
# surrounding townships, which is squarely this project's documented scope,
# regardless of where the underlying offence physically occurred. Verified
# by hand against every one of the ~26 records this flags as out of scope
# (see OUT_OF_SCOPE_REVIEW.md at the repo root) before anything was removed.
WHITBY_IN_SCOPE_CONVICTION_VIEW = """
CREATE VIEW whitby_in_scope_conviction AS
SELECT DISTINCT sc.*
FROM summary_conviction sc
LEFT JOIN summary_conviction_defendant scd ON scd.summary_conviction_id = sc.id
LEFT JOIN defendant d ON d.id = scd.defendant_id
LEFT JOIN involved_persons ip ON ip.summary_conviction_id = sc.id
LEFT JOIN person p ON p.id = ip.person_id
WHERE sc.offence_location_town_id = (SELECT id FROM town WHERE name = 'whitby')
   OR sc.court_location_town_id = (SELECT id FROM town WHERE name = 'whitby')
   OR d.town_id = (SELECT id FROM town WHERE name = 'whitby')
   OR p.town_id = (SELECT id FROM town WHERE name = 'whitby')
"""


def create_views(session: Session) -> None:
    # session.execute() (inherited from SQLAlchemy's Session), not
    # session.exec() -- SQLModel's exec() is typed for Select statements only.
    session.execute(text("DROP VIEW IF EXISTS whitby_connected_conviction"))
    session.execute(text(WHITBY_CONNECTED_CONVICTION_VIEW))
    session.execute(text("DROP VIEW IF EXISTS whitby_in_scope_conviction"))
    session.execute(text(WHITBY_IN_SCOPE_CONVICTION_VIEW))
