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


def create_views(session: Session) -> None:
    # session.execute() (inherited from SQLAlchemy's Session), not
    # session.exec() -- SQLModel's exec() is typed for Select statements only.
    session.execute(text("DROP VIEW IF EXISTS whitby_connected_conviction"))
    session.execute(text(WHITBY_CONNECTED_CONVICTION_VIEW))
