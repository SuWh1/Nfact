from pydantic import ValidationError
from scripts.generate_notes import Note
import json

def test_note_schema():
    with open("exam_notes.json") as f:
        data = json.load(f)
    for item in data["notes"]:
        Note(**item)