import { useState } from 'react'
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

  // API key is loaded from .env at build time (VITE_ prefix required)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || ''

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <Canvas camera={{ position: [0, 1.4, 3.2], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Environment preset="city" />
          <Avatar isSpeaking={isSpeaking} mouthOpen={mouthOpen} />
          <OrbitControls target={[0, 1.3, 0]} enablePan={false} />
        </Canvas>
      </div>

      <Chat
        messages={messages}
        setMessages={setMessages}
        apiKey={apiKey}
        setIsSpeaking={setIsSpeaking}
        setMouthOpen={setMouthOpen}
      />
    </div>
  )
}
