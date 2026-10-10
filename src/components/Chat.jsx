import { useState, useRef, useEffect } from 'react'

const API_URL = "http://localhost:8000/chat"

export default function Chat({ messages, setMessages, setIsSpeaking, setMouthOpen }) {
  const [listening, setListening] = useState(false)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('')
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setStatus('Speech recognition not supported. Use Chrome.')
      return
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onstart = () => {
      setListening(true)
      setStatus('Listening... speak now')
    }

    recognition.onresult = (e) => {
      let transcript = ''
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setInput(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        setStatus('Sending...')
        handleSend(transcript)
      }
    }

    recognition.onend = () => {
      setListening(false)
      if (!status.includes('Sending')) setStatus('')
    }

    recognition.onerror = (e) => {
      setListening(false)
      setStatus(e.error === 'aborted' ? 'Listening aborted' : 'Mic: ' + e.error)
      setTimeout(() => setStatus(''), 2000)
    }

    recognitionRef.current = recognition
    try { recognition.start() } catch { setStatus('Could not start mic') }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
    setStatus('')
  }

  const playAudio = (base64) => {
    if (!base64) return
    const audio = new Audio("data:audio/wav;base64," + base64)
    audioRef.current = audio

    const duration = audio.duration || 3
    const frameCount = Math.floor(duration * 30) || 90
    const frames = []
    for (let i = 0; i < frameCount; i++) {
      const t = i / frameCount
      frames.push(0.3 + Math.abs(Math.sin(t * Math.PI * 6)) * 0.7)
    }

    let frameIdx = 0
    const interval = setInterval(() => {
      if (frameIdx < frames.length) {
        setMouthOpen(frames[frameIdx])
        frameIdx++
      }
    }, 1000 / 30)

    audio.onplay = () => {
      setIsSpeaking(true)
      setStatus('Speaking...')
    }
    audio.onended = () => {
      setIsSpeaking(false)
      setMouthOpen(0)
      setStatus('')
      clearInterval(interval)
    }
    audio.onerror = () => {
      setIsSpeaking(false)
      setMouthOpen(0)
      setStatus('Audio play error')
      clearInterval(interval)
    }

    audio.play().catch(err => {
      console.error(err)
      setStatus('Could not play audio')
    })
  }

  const handleSend = async (text) => {
    if (!text.trim()) return

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStatus('Thinking...')

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(-8) })
      })

      if (!res.ok) throw new Error('API error ' + res.status)

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      setStatus('')
      if (data.audio_base64) {
        playAudio(data.audio_base64)
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }])
      setStatus('')
    }
  }

  return (
    <div style={{
      width: 380, height: '100vh', background: '#16162a',
      display: 'flex', flexDirection: 'column', borderLeft: '1px solid #333'
    }}>
      <div style={{ padding: 16, borderBottom: '1px solid #333' }}>
        <h2 style={{ fontSize: 18 }}>English Tutor</h2>
        <p style={{ fontSize: 12, opacity: 0.7 }}>Speak or type to practice</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{
            marginBottom: 12,
            textAlign: m.role === 'user' ? 'right' : 'left'
          }}>
            <div style={{
              display: 'inline-block',
              background: m.role === 'user' ? '#4fc3f7' : '#2a2a4a',
              color: m.role === 'user' ? 'black' : 'white',
              padding: '10px 14px',
              borderRadius: 12,
              maxWidth: '85%',
              fontSize: 14
            }}>
              {m.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {status && (
        <div style={{ padding: '6px 16px', fontSize: 13, color: '#4fc3f7', textAlign: 'center' }}>
          {status}
        </div>
      )}

      <div style={{ padding: 16, borderTop: '1px solid #333', display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: 10, borderRadius: 8, border: '1px solid #444',
            background: '#1e1e2e', color: '#ffffff', outline: 'none', fontSize: 14
          }}
        />
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            padding: '10px 14px', borderRadius: 8, border: 'none',
            background: listening ? '#ff5252' : '#4fc3f7',
            color: 'black', cursor: 'pointer', fontWeight: 'bold', minWidth: 70
          }}
        >
          {listening ? 'Stop' : 'Mic'}
        </button>
        <button
          onClick={() => handleSend(input)}
          style={{
            padding: '10px 14px', borderRadius: 8, border: 'none',
            background: '#66bb6a', color: 'black', cursor: 'pointer', fontWeight: 'bold'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
