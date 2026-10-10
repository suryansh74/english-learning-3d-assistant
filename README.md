# English Learning 3D AI Assistant

A completely free English learning application with a 3D personal assistant.

## Pipeline

```
User speech → Web Speech API (STT) → Groq LLM (openai/gpt-oss-120b) → Web Speech Synthesis (TTS) → Frame generator (duration + energy based mouth frames) → Three.js renderer with lip-sync
```

## Features

- Real-time speech-to-text (browser Web Speech API — free)
- Conversational AI tutor powered by Groq (`openai/gpt-oss-120b`)
- Text-to-speech responses (browser SpeechSynthesis — free)
- 3D avatar with animated mouth / head motion driven by speech length and speaking state
- English practice focused (grammar, vocabulary, conversation)
- API key stored only in localStorage (never sent to any backend)

## Tech Stack (100% free)

| Layer | Technology |
|-------|------------|
| Frontend | React + Vite |
| 3D | Three.js + React Three Fiber |
| STT | Web Speech API |
| LLM | Groq API (`openai/gpt-oss-120b`) |
| TTS | Web Speech Synthesis API |
| Animation | Custom frame generator based on audio duration + amplitude |

## Setup

1. Clone the repo
2. `npm install`
3. `npm run dev`
4. Open the app, click the settings icon, and paste your free Groq API key
   - Get a key at https://console.groq.com (free tier available)
5. Click the microphone and start practicing English

## How the Frame Generator Works

1. TTS generates speech and we estimate duration from text length
2. A simple frame sequence is created (mouthOpen values over time)
3. While audio plays, the 3D avatar interpolates mouth openness and subtle head movement
4. Idle animations (blinking, breathing) run continuously

## Future Improvements (still free)

- Replace browser TTS with local Kokoro TTS for better quality
- Add Rhubarb Lip Sync for proper visemes
- Load custom VRoid / GLB models with ARKit blendshapes
- NVIDIA Audio2Face integration for higher-quality facial frames

## License

MIT
