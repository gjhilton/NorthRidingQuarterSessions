// The live database schema -- see
// /Users/gjh/.claude/plans/humming-painting-pearl.md (the schema redesign
// plan) for the reasoning behind each table.
export const SCHEMA_ERD = `
erDiagram
    SUMMARY_CONVICTION {
        int id PK
        string record_number
        string title
        date conviction_date
        date offence_date
        string offence_date_raw
        string offence_time
        text charge_description
        text raw_record
    }

    LOCATION {
        int id PK
        string name
        int parent_id FK
        text notes_public
        text notes_private
        float latitude
        float longitude
        text path_geometry
    }

    PERSON {
        int id PK
        string first_name
        string middle_name
        string last_name
        string name_postfix
        string title
        string sex
        int birth_year
        int home_location_id FK
        string alias
    }

    OCCUPATION {
        int id PK
        string name
        bool is_police
    }

    PERSON_OCCUPATION {
        int person_id FK
        int occupation_id FK
    }

    RELATIONSHIP_TYPE {
        int id PK
        string name
    }

    RELATIONSHIP_TYPE_RECIPROCAL {
        int id PK
        int relationship_type_id FK
        string related_sex
        int reciprocal_relationship_type_id FK
    }

    PERSON_RELATIONSHIP {
        int id PK
        int person_id FK
        int relationship_type_id FK
        int related_person_id FK
    }

    CRIME_TYPE {
        int id PK
        string name
        int parent_id FK
        bool is_seeded
        int sort_order
    }

    SUMMARY_CONVICTION_PERSON {
        int id PK
        int summary_conviction_id FK
        int person_id FK
        string role
    }

    SUMMARY_CONVICTION_LOCATION {
        int id PK
        int summary_conviction_id FK
        int location_id FK
        string role
    }

    SUMMARY_CONVICTION_CRIME_TYPE {
        int summary_conviction_id FK
        int crime_type_id FK
    }

    RELATED_CONVICTION {
        int summary_conviction_id_a FK
        int summary_conviction_id_b FK
        text note
    }

    SUMMARY_CONVICTION ||--o{ SUMMARY_CONVICTION_PERSON : "has"
    PERSON ||--o{ SUMMARY_CONVICTION_PERSON : "involved in"
    SUMMARY_CONVICTION ||--o{ SUMMARY_CONVICTION_LOCATION : "has"
    LOCATION ||--o{ SUMMARY_CONVICTION_LOCATION : "site of"
    SUMMARY_CONVICTION ||--o{ SUMMARY_CONVICTION_CRIME_TYPE : "charged as"
    CRIME_TYPE ||--o{ SUMMARY_CONVICTION_CRIME_TYPE : "charged in"
    SUMMARY_CONVICTION ||--o{ RELATED_CONVICTION : "linked as A"
    SUMMARY_CONVICTION ||--o{ RELATED_CONVICTION : "linked as B"
    PERSON }o--o| LOCATION : "lives in"
    PERSON ||--o{ PERSON_OCCUPATION : "has"
    OCCUPATION ||--o{ PERSON_OCCUPATION : "held by"
    PERSON ||--o{ PERSON_RELATIONSHIP : "has"
    RELATIONSHIP_TYPE ||--o{ PERSON_RELATIONSHIP : "typed as"
    RELATIONSHIP_TYPE ||--o{ RELATIONSHIP_TYPE_RECIPROCAL : "reverses"
    LOCATION }o--o| LOCATION : "parent place"
    CRIME_TYPE }o--o| CRIME_TYPE : "parent category"
`;
