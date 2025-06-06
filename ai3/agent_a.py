from flask import Flask, request, jsonify
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

app = Flask(__name__)

# Загружаем инструменты из langchain-community, передаем API-ключ через переменную окружения
tools = load_tools(["serpapi"])

if not tools:
    raise ValueError("No tools loaded. Please check tool names and API keys.")

agent = initialize_agent(tools, llm, agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION)

@app.route("/ask", methods=["POST"])
def ask():
    user_input = request.json.get("query")

    # Обработка с помощью LangChain Agent
    refined_question = agent.run(f"Преобразуй в чёткий исследовательский запрос: {user_input}")

    # Отправка на второго агента
    a2a_msg = {
        "sender": "agent_a",
        "receiver": "agent_b",
        "type": "query",
        "content": refined_question
    }
    res = requests.post("http://localhost:5001/respond", json=a2a_msg)
    answer = res.json()

    return jsonify({
        "original_input": user_input,
        "refined_question": refined_question,
        "answer_from_agent_b": answer.get("response", "Ошибка от Agent B")
    })

if __name__ == "__main__":
    app.run(port=5000)
