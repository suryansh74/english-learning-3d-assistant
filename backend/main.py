from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from graph import graph

app = FastAPI(title="English Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class ChatResponse(BaseModel):
    reply: str
    audio_base64: str

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    messages = [m.dict() for m in request.messages]
    result = graph.invoke({
        "messages": messages,
        "reply": "",
        "cleaned_reply": "",
        "audio_base64": ""
    })
    return ChatResponse(
        reply=result.get("cleaned_reply") or result.get("reply", ""),
        audio_base64=result["audio_base64"]
    )

@app.get("/health")
async def health():
    return {"status": "ok"}
