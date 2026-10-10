import { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import Avatar from './components/Avatar'
import Chat from './components/Chat'

export default function App() {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(0)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your English tutor. Click the microphone and start speaking.' }
  ])
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || '')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (apiKey) localStorage.setItem('groq_api_key', apiKey)
  }, [apiKey])

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 1.4, 3], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Environment preset="city" />
          <Avatar isSpeaking={isSpeaking} mouthOpen={mouthOpen} />
          <OrbitControls target={[0, 1.2, 0]} />
        </Canvas>
        <button
          onClick={() => setShowSettings(true)}
          style={{
            position: 'absolute', top: 16, right: 16,
            background: '#333', color: 'white', border: 'none',
            padding: '8px 12px', borderRadius: 8, cursor: 'pointer'
          }}
        >
          Settings
        </button>
      </div>

      <Chat
        messages={messages}
        setMessages={setMessages}
        apiKey={apiKey}
        setIsSpeaking={setIsSpeaking}
        setMouthOpen={setMouthOpen}
      />

      {showSettings && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10
        }}>
          <div style={{ background: '#1a1a2e', padding: 24, borderRadius: 12, width: 400 }}>
            <h3>Groq API Key</h3>
            <p style={{ fontSize: 14, opacity: 0.8, margin: '8px 0' }}>
              Free key from <a href="https://console.groq.com" target="_blank" rel="noreferrer" style={{ color: '#4fc3f7' }}>console.groq.com</a>
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="gsk_..."
              style={{ width: '100%', padding: 10, margin: '12px 0', borderRadius: 6, border: 'none' }}
            />
            <button onClick={() => setShowSettings(false)} style={{
              background: '#4fc3f7', color: 'black', border: 'none', padding: '10px 20px', borderRadius: 6, cursor: 'pointer'
            }}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
