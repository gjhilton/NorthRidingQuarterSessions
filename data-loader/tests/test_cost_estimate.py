from qsrecords import cost_estimate
from qsrecords.models.extraction_schema import ExtractionBatchInput


def _make_inputs(n):
    return [
        ExtractionBatchInput(
            raw_case_id=i,
            reference_number=f"QSB 1800 1/10/{i}",
            title="Summary conviction: Someone",
            description="Summary conviction of Someone for something.",
            archive_url=f"https://example.org/{i}",
        )
        for i in range(n)
    ]


def test_unknown_model_returns_none():
    inputs = _make_inputs(5)
    result = cost_estimate.estimate_total_cost("openai", "not-a-real-model", 25, inputs)
    assert result is None


def test_no_pending_records_returns_none():
    result = cost_estimate.estimate_total_cost("openai", "gpt-4o-2024-08-06", 25, [])
    assert result is None


def test_openai_uses_heuristic_not_measured(monkeypatch):
    # Anthropic's count_tokens should never be called for the openai provider.
    monkeypatch.setattr(
        cost_estimate,
        "_count_input_tokens_anthropic",
        lambda model, records: (_ for _ in ()).throw(AssertionError("should not be called")),
    )
    inputs = _make_inputs(3)
    result = cost_estimate.estimate_total_cost("openai", "gpt-4o-2024-08-06", 25, inputs)
    assert result is not None
    assert result.input_tokens_measured is False
    assert result.record_count == 3


def test_anthropic_falls_back_to_heuristic_when_count_tokens_unavailable(monkeypatch):
    # Simulate no network/API key -- _count_input_tokens_anthropic returns None.
    monkeypatch.setattr(cost_estimate, "_count_input_tokens_anthropic", lambda model, records: None)
    inputs = _make_inputs(3)
    result = cost_estimate.estimate_total_cost("anthropic", "claude-opus-4-8", 25, inputs)
    assert result is not None
    assert result.input_tokens_measured is False


def test_scales_across_multiple_full_batches(monkeypatch):
    # Fixed 1000 input tokens per batch of 10, regardless of content, to make the math exact.
    monkeypatch.setattr(cost_estimate, "_estimate_one_batch", lambda provider, model, records: (1000, True))
    inputs = _make_inputs(30)  # exactly 3 batches of 10
    result = cost_estimate.estimate_total_cost("openai", "gpt-4o-2024-08-06", 10, inputs)
    assert result.input_tokens == 3000
    assert result.estimated_output_tokens == 30 * cost_estimate.ESTIMATED_OUTPUT_TOKENS_PER_RECORD
    assert result.record_count == 30


def test_prorates_partial_final_batch(monkeypatch):
    monkeypatch.setattr(cost_estimate, "_estimate_one_batch", lambda provider, model, records: (1000, True))
    inputs = _make_inputs(25)  # 2 full batches of 10 + a partial batch of 5
    result = cost_estimate.estimate_total_cost("openai", "gpt-4o-2024-08-06", 10, inputs)
    # 2 full batches @ 1000 + prorated partial (5/10 * 1000 = 500)
    assert result.input_tokens == 2500
    assert result.record_count == 25


def test_total_cost_is_input_plus_output(monkeypatch):
    monkeypatch.setattr(cost_estimate, "_estimate_one_batch", lambda provider, model, records: (1_000_000, True))
    inputs = _make_inputs(1)
    result = cost_estimate.estimate_total_cost("openai", "gpt-4o-2024-08-06", 25, inputs)
    # gpt-4o-2024-08-06: $2.50/$10.00 per million
    expected_input_cost = 2.50
    expected_output_cost = (cost_estimate.ESTIMATED_OUTPUT_TOKENS_PER_RECORD / 1_000_000) * 10.00
    assert abs(result.input_cost - expected_input_cost) < 1e-9
    assert abs(result.output_cost - expected_output_cost) < 1e-9
    assert abs(result.total_cost - (expected_input_cost + expected_output_cost)) < 1e-9
