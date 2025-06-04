import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Load IDs
with open("ids.json", "r") as f:
    ids = json.load(f)

assistant_id = ids.get("assistant_id")
vector_store_id = ids.get("vector_store_id")
file_id = ids.get("file_id")
thread_id = ids.get("thread_id")

def cleanup():
    print("🧹 Starting cleanup...")

    # Optionally delete the file
    if file_id:
        try:
            client.files.delete(file_id)
            print(f"🗑️ Deleted file: {file_id}")
        except Exception as e:
            print(f"⚠️ Could not delete file: {file_id}", e)

    # Optionally delete the vector store
    if vector_store_id:
        try:
            client.vector_stores.delete(vector_store_id)
            print(f"🗑️ Deleted vector store: {vector_store_id}")
        except Exception as e:
            print(f"⚠️ Could not delete vector store: {vector_store_id}", e)

    # Optionally delete the assistant
    if assistant_id:
        try:
            client.beta.assistants.delete(assistant_id)
            print(f"🗑️ Deleted assistant: {assistant_id}")
        except Exception as e:
            print(f"⚠️ Could not delete assistant: {assistant_id}", e)
            
    if thread_id:
        try:
            client.beta.threads.delete(thread_id)
            print(f"🗑️ Deleted thread: {thread_id}")
        except Exception as e:
            print(f"⚠️ Could not delete thread: {thread_id}", e)

    print("✅ Cleanup complete.")

if __name__ == "__main__":
    cleanup()
