def analyse(input_string: str):
    return {
        "input_length": len(input_string),
        "first_character": input_string[0] if input_string else None,
    }