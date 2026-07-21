// Read-only row shapes matching the SQLite schema data-loader/qsrecords/models
// owns. Kept minimal -- only the columns the UI actually reads.

export interface Town {
  id: number;
  name: string;
}

export interface Street {
  id: number;
  name: string;
  town_id: number | null;
}

export interface OffenceType {
  id: number;
  name: string;
  is_seeded: number; // sqlite boolean
}

export interface SummaryConviction {
  id: number;
  raw_case_id: number;
  reference_number: string;
  conviction_date: string | null;
  conviction_date_raw: string;
  offence_date: string | null;
  offence_date_raw: string | null;
  offence_day_of_week: string | null;
  offence_day_of_month: number | null;
  offence_year: number | null;
  offence_time: string | null;
  charge_description: string;
  sentencing: string | null;
  raw_record: string;
  offence_location_town_id: number | null;
  offence_location_street_id: number | null;
  court_location_town_id: number | null;
  archive_url: string;
}

export interface Defendant {
  id: number;
  first_name: string | null;
  last_name: string | null;
  sex: string | null;
  occupation: string | null;
  relationships_and_details: string | null;
  prior_convictions: string | null;
  town_id: number | null;
  street_id: number | null;
  name_key: string;
}

export interface Alias {
  id: number;
  defendant_id: number;
  alias_name: string;
}

export interface Person {
  id: number;
  first_name: string | null;
  last_name: string | null;
  occupation: string | null;
  relationships_and_details: string | null;
  town_id: number | null;
  street_id: number | null;
  name_key: string;
}

export interface InvolvedPerson {
  id: number;
  summary_conviction_id: number;
  person_id: number;
  role: string | null;
}

export interface RawCase {
  id: number;
  archive_url: string;
  reference_number: string;
  title: string;
  document_date_raw: string;
  description: string;
  status: string;
  attempt_count: number;
  last_attempted_at: string | null;
  created_at: string;
}

export interface ExtractionAttempt {
  id: number;
  raw_case_id: number;
  batch_id: string;
  provider: string;
  model: string;
  attempted_at: string;
  success: number;
  error_message: string | null;
  raw_response: string | null;
  duration_ms: number | null;
}
