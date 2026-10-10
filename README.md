# English Learning 3D AI Assistant

Python backend (LangGraph + FastAPI + Kokoro ONNX TTS) + React frontend.

## Architecture

```
User input → FastAPI /chat → LangGraph
  → llm_node (Groq openai/gpt-oss-120b)
  → tts_node (Kokoro ONNX local TTS)
  → returns text + base64 WAV
→ Frontend plays audio + animates avatar
```

## Setup (Linux + uv)

### 1. Backend

```bash
cd backend
uv venv
source .venv/bin/activate
uv pip install -r requirements.txt
```

Download Kokoro model files (one time):

```bash
python download_models.py
```

Create `backend/.env`:

```
GROQ_API_KEY=gsk_your_key_here
```

Start server:

```bash
uvicorn main:app --reload --port 8000
```

### 2. Frontend

```bash
# from project root
npm install
npm run dev
```

Open http://localhost:5173

Type a message and Send — you will hear Kokoro TTS.
