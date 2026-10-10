# English Learning 3D AI Assistant

Python backend (LangGraph + FastAPI + Kokoro TTS) + React frontend.

## Architecture

```
User input → FastAPI /chat → LangGraph
  → llm_node (Groq openai/gpt-oss-120b)
  → tts_node (Kokoro local TTS)
  → returns text + base64 WAV
→ Frontend plays audio + animates avatar
```

## Setup

### 1. Backend (Python)

```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
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

## Notes

- First Kokoro run downloads the model (~300MB).
- Mic still uses browser Web Speech API (STT later).
- Avatar is still simple; we can swap in a GLB later.
