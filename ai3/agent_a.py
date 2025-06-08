from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse
import uvicorn
from langchain_community.agent_toolkits.load_tools import load_tools
from langchain.agents import initialize_agent, AgentType
from langchain_openai import ChatOpenAI
import requests
import os

if not os.getenv("OPENAI_API_KEY"):
    raise ValueError("OPENAI_API_KEY is not set in environment variables.")

if not os.getenv("SERPAPI_API_KEY"):
    raise ValueError("SERPAPI_API_KEY is not set in environment variables.")

llm = ChatOpenAI(
    temperature=0,
    openai_api_key=os.getenv("OPENAI_API_KEY")
)

app = FastAPI()

# Загружаем инструменты из langchain-community, передаем API-ключ через переменную окружения
tools = load_tools(["serpapi"])

if not tools:
    raise ValueError("No tools loaded. Please check tool names and API keys.")

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)

class AskRequest(BaseModel):
    query: str

@app.post("/ask")
async def ask(request: AskRequest):
    user_input = request.query
    refined_question = agent.run(f"Преобразуй в чёткий исследовательский запрос: {user_input}")
    a2a_msg = {
        "sender": "agent_a",
        "receiver": "agent_b",
        "type": "query",
        "content": refined_question
    }
    res = requests.post("http://localhost:5001/respond", json=a2a_msg)
    answer = res.json()
    return JSONResponse({
        "original_input": user_input,
        "refined_question": refined_question,
        "answer_from_agent_b": answer.get("response", "Ошибка от Agent B")
    })

if __name__ == "__main__":
    uvicorn.run("agent_a:app", host="0.0.0.0", port=5000, reload=False)
