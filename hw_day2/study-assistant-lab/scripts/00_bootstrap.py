from openai import OpenAI
from dotenv import load_dotenv
import os
import json


load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

assistant = client.beta.assistants.create(
    name="Study Q&A Assistant",
    instructions=(
        "You are a helpful tutor. "
        "Use the knowledge in the attached files to answer questions. "
        "Cite sources where possible."
    ),
    model="gpt-4o-mini",
    tools=[{"type": "file_search"}]
)

print("Assistant created with ID:", assistant.id)


file_path = "data/calc1.pdf"
with open(file_path, "rb") as f:
    result = client.files.create(
        file=f,
        purpose="assistants"
    )

file_id = result.id
print(f"--- file created: {file_id} ---")

vector_store = client.vector_stores.create(
    name="knowledge_base"
)
print(f"--- vector store created: {vector_store.id} ---")

client.vector_stores.files.create(
    vector_store_id=vector_store.id,
    file_id=file_id
)

result = client.vector_stores.files.list(
    vector_store_id=vector_store.id
)
print(f"--- vector store files: {result} ---")

thread = client.beta.threads.create()
ids = {
    "assistant_id": assistant.id,
    "vector_store_id": vector_store.id,
    "file_id": file_id,
    "thread_id": thread.id
}
with open("ids.json", "w") as f:
    json.dump(ids, f)
print("--- IDs saved to ids.json ---")