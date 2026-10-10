import os
import io
import base64
from typing import TypedDict, List, Dict
from dotenv import load_dotenv
from langgraph.graph import StateGraph, END
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from kokoro_onnx import Kokoro
import soundfile as sf
import numpy as np

load_dotenv()

# Initialize Kokoro ONNX (downloads model on first use if needed)
# You can also place kokoro-v1.0.onnx and voices-v1.0.bin in the backend folder
tts = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")

class AgentState(TypedDict):
    messages: List[Dict]
    reply: str
    audio_base64: str

def llm_node(state: AgentState) -> AgentState:
    """Call Groq LLM to generate English tutor reply."""
    llm = ChatGroq(
        model="openai/gpt-oss-120b",
        temperature=0.7,
        api_key=os.getenv("GROQ_API_KEY")
    )

    system = SystemMessage(content=(
        "You are a friendly English tutor. Correct mistakes gently, "
        "explain grammar simply, encourage the student, and keep responses "
        "concise and conversational. Focus on helping the user improve spoken and written English."
    ))

    lc_messages = [system]
    for m in state["messages"][-8:]:
        if m["role"] == "user":
            lc_messages.append(HumanMessage(content=m["content"]))
        else:
            lc_messages.append(AIMessage(content=m["content"]))

    response = llm.invoke(lc_messages)
    state["reply"] = response.content
    return state

def tts_node(state: AgentState) -> AgentState:
    """Generate speech with Kokoro ONNX and return base64 WAV."""
    text = state["reply"]
    if not text:
        state["audio_base64"] = ""
        return state

    try:
        samples, sample_rate = tts.create(text, voice="af_heart", speed=1.0)
        buffer = io.BytesIO()
        sf.write(buffer, samples, sample_rate, format="WAV")
        buffer.seek(0)
        audio_bytes = buffer.read()
        state["audio_base64"] = base64.b64encode(audio_bytes).decode("utf-8")
    except Exception as e:
        print("TTS error:", e)
        state["audio_base64"] = ""
    return state

# Build graph
workflow = StateGraph(AgentState)
workflow.add_node("llm", llm_node)
workflow.add_node("tts", tts_node)
workflow.set_entry_point("llm")
workflow.add_edge("llm", "tts")
workflow.add_edge("tts", END)

graph = workflow.compile()
