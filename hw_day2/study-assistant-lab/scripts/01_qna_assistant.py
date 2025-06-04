from openai import OpenAI
from dotenv import load_dotenv
import json
import os
import time
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load saved IDs
with open("ids.json", "r") as f:
    ids = json.load(f)

assistant_id = ids["assistant_id"]
vector_store_id = ids["vector_store_id"]
file_id = ids["file_id"]
thread_id = ids["thread_id"]

client.beta.assistants.update(
    assistant_id=assistant_id,
    tool_resources={"file_search": {"vector_store_ids": [vector_store_id]}}
)

def ask_question(prompt: str):
    client.beta.threads.messages.create(
        thread_id=thread_id,
        role="user",
        content=prompt
    )

    run = client.beta.threads.runs.create_and_poll(
        thread_id=thread_id,
        assistant_id=assistant_id
    )

    if run.status != "completed":
        print(f"Run failed with status: {run.status}")
        return

    messages = client.beta.threads.messages.list(thread_id=thread_id)

    print("\n--- assistant response ---")
    if not messages.data:
        print("No messages returned.")
        return
    
    for message in messages.data:
        print(f"\n[Message role: {message.role}]")
        if message.role == "assistant":
            for content in message.content:
                if hasattr(content, "text") and hasattr(content.text, "value"):
                    print(content.text.value)
                else:
                    print("No text content found.")

            if message.metadata and "citations" in message.metadata:
                print("\n--- Citations ---")
                print(message.metadata["citations"])

if __name__ == "__main__":
    questions = [
        "Explain me the Integration by Parts so that i Understand it easily.",
        "Explain how to use integrals to find Volumes of Revolution."
    ]

    for q in questions:
        ask_question(q)
