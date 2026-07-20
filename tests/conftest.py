import pytest
from sqlmodel import Session, SQLModel, create_engine

import qsrecords.models  # noqa: F401 -- registers tables with SQLModel.metadata


@pytest.fixture
def session():
    engine = create_engine("sqlite://")
    SQLModel.metadata.create_all(engine)
    with Session(engine) as s:
        yield s


class FakeProvider:
    """No-network stand-in for ExtractionProvider, driven by a scripted plan.

    `plan` is a list of one entry per expected extract_batch() call:
    - a list of ExtractionOutcome (one per input record, matched positionally
      here since the fake controls exactly what's returned) to simulate a
      normal (possibly partial-failure) response, or
    - an Exception instance/class to simulate a whole-batch transport failure.
    """

    name = "fake"
    model = "fake-model"

    def __init__(self, plan):
        self._plan = list(plan)
        self.calls = []

    def extract_batch(self, records):
        self.calls.append(list(records))
        outcome = self._plan.pop(0)
        if isinstance(outcome, Exception):
            raise outcome
        if isinstance(outcome, type) and issubclass(outcome, Exception):
            raise outcome("scripted failure")
        return outcome
