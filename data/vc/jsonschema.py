import jsonschema
from jsonschema import validate, ValidationError

# Updated JSON Schema with reusable "person" definition
schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "url": {
            "type": "string",
            "pattern": "^(https?://).+"
        },
        "defendants": {
            "type": "array",
            "minItems": 1,
            "items": { "$ref": "#/$defs/person" }
        },
        "involved_persons": {
            "type": "array",
            "minItems": 0,
            "items": { "$ref": "#/$defs/person" }
        },
        "date": {
            "type": "string",
            "pattern": r"^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
        }
    },
    "required": ["url", "defendants", "date"],
    "additionalProperties": False,
    "$defs": {
        "person": {
            "type": "object",
            "properties": {
                "forenames": { "type": "string", "minLength": 1 },
                "surname": { "type": "string", "minLength": 1 },
                "age": { "type": "integer", "minimum": 0, "maximum": 120 }
            },
            "required": ["forenames", "surname", "age"],
            "additionalProperties": False
        }
    }
}

def validate_data(data, schema):
    try:
        validate(instance=data, schema=schema)
        print("Validation successful!")
    except ValidationError as e:
        print(f"Validation error: {e.message}")

# Example valid data with involved_persons
valid_data = {
    "url": "https://example.com/2",
    "defendants": [
        {"forenames": "Jane", "surname": "Doe", "age": 30}
    ],
    "involved_persons": [
        {"forenames": "Mark", "surname": "Lee", "age": 40},
        {"forenames": "Anna", "surname": "Bell", "age": 25}
    ],
    "date": "15/05/2023"
}

# Example invalid data: empty involved_persons item, missing age
invalid_data = {
    "url": "https://example.com",
    "defendants": [
        {"forenames": "Jane", "surname": "Doe", "age": 30}
    ],
    "involved_persons": [
        {"forenames": "", "surname": "Lee", "age": 40},   # invalid: empty forenames
        {"forenames": "Anna", "surname": "Bell"}          # invalid: missing age
    ],
    "date": "15/05/2023"
}

print("Validating valid_data:")
validate_data(valid_data, schema)

print("\nValidating invalid_data:")
validate_data(invalid_data, schema)