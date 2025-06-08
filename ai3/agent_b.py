from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uvicorn
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.settings import Settings
from llama_index.core.tools import QueryEngineTool
import os

Settings.openai_api_key = os.getenv("OPENAI_API_KEY")
if not Settings.openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set. Make sure it's in your environment variables.")

app = FastAPI()

documents = SimpleDirectoryReader("docs").load_data()
index = VectorStoreIndex.from_documents(documents)
query_engine = index.as_query_engine()

class SimpleQueryTool:
    def __init__(self, query_engine):
        self.query_engine = query_engine
    def run(self, query):
        response = self.query_engine.query(query)
        return response.response
    
tool = QueryEngineTool.from_defaults(
    query_engine=query_engine,
    name="CustomQueryTool",
    description="Answers to questions on uploaded documents"
)

llm = OpenAI(model="gpt-3.5-turbo")
agent = OpenAIAgent.from_tools(
    tools=[tool],
    llm=llm,
    verbose=True
)

class RespondRequest(BaseModel):
    sender: str
    receiver: str
    type: str
    content: str

@app.post("/respond")
async def respond(request: RespondRequest):
    try:
        query = request.content
        result = agent.chat(query)
        return JSONResponse({"response": str(result)})
    except Exception as e:
        print("ERROR:", e)
        return JSONResponse({"error": str(e)}, status_code=500)

if __name__ == "__main__":
    uvicorn.run("agent_b:app", host="0.0.0.0", port=5001, reload=False)
