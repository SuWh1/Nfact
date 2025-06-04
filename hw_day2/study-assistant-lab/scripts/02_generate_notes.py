import json
from typing import Optional, List
from pydantic import BaseModel, Field
from openai import OpenAI
from dotenv import load_dotenv
import os
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

with open("ids.json", "r") as f:
    ids = json.load(f)

assistant_id = ids["assistant_id"]
vector_store_id = ids["vector_store_id"]
file_id = ids["file_id"]
thread_id = ids["thread_id"]

# Update assistant with your vector store (if not done already)
client.beta.assistants.update(
    assistant_id=assistant_id,
    tool_resources={"file_search": {"vector_store_ids": [vector_store_id]}}
)

class Note(BaseModel):
    id: int = Field(..., ge=1, le=10)
    heading: str = Field(..., example="Mean Value Theorem")
    summary: str = Field(..., max_length=150)
    page_ref: Optional[int] = Field(None, description="Page number in source PDF")

def main():
    system_prompt = (
        "You are a study summarizer. "
        "Return exactly 10 unique notes that will help prepare for the exam. "
        "Respond *only* with valid JSON matching the Note[] schema."
        "[\n"
        "  {\"id\": 1, \"heading\": \"Note heading\", \"summary\": \"Short summary\", \"page_ref\": null},\n"
        "  ... up to 10 notes\n"
        "]"
    )

    # Send system prompt first (optional, but recommended for context)
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=system_prompt
    )

    # Run the assistant on this thread (wait until completion)
    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    if run.status != "completed":
        print(f"Run failed with status: {run.status}")
        return

    # Fetch all messages in the thread to find the assistant's reply
    messages = client.beta.threads.messages.list(thread_id=thread_id)
    # Get the content text from that message (assuming content is a list and text is the first)
    latest = messages.data[0].content[0].text.value

    if latest.startswith("```json"):
        latest = latest.strip("```json").strip("```").strip()
    elif latest.startswith("```"):
        latest = latest.strip("```").strip()

    try:
        data = json.loads(latest)
        notes = [Note(**note) for note in data]
        print("notes generated successfully")

        for note in notes:
            print(f"\n🧠 Note {note.id}: {note.heading}")
            print(f"Summary: {note.summary}")
            if note.page_ref is not None:
                print(f"📄 Page Reference: {note.page_ref}")

        with open("exam_notes.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)

    except Exception as e:
        print("Failed to decode JSON from assistant response:", e)
        print("Raw assistant response:")
        print(latest)
        
if __name__ == "__main__":
    main()
