# English Learning 3D AI Assistant

A completely free English learning application with a 3D personal assistant.

## Pipeline

```
User speech → Web Speech API (STT) → Groq LLM (openai/gpt-oss-120b) → Web Speech Synthesis (TTS) → Frame generator → Three.js renderer
```

## Setup

1. Clone the repo
2. `npm install`
3. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

4. Edit `.env` and put your real Groq API key:

```
VITE_GROQ_API_KEY=gsk_your_actual_key_here
```

Get a free key at https://console.groq.com

5. Restart the dev server after changing `.env`:

```bash
npm run dev
```

6. Open http://localhost:5173

## Mic Tips

- Use **Google Chrome** for best speech recognition support.
- Allow microphone permission when the browser asks.
- The button turns red and shows “Listening...” while active.
- Speak clearly; it will send automatically when it detects the end of speech.

## 3D Model

The current avatar is a simple procedural character.  
To use your own model:

1. Export a **GLB** or **VRM** file (with morph targets / blendshapes if you want lip-sync).
2. Put the file in `public/models/avatar.glb`
3. Tell me the path and I can integrate it.

Free tools to create models:
- [VRoid Studio](https://vroid.com/en/studio) (anime style, free)
- Blender + export as GLB

## License

MIT
