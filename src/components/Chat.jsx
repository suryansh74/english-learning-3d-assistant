import { useState, useRef, useEffect } from 'react'

export default function Chat({ messages, setMessages, apiKey, setIsSpeaking, setMouthOpen }) {
  const [listening, setListening] = useState(false)
  const [input, setInput] = useState('')
  const [status, setStatus] = useState('')
  const recognitionRef = useRef(null)
  const messagesEndRef = useRef(null)

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
      setStatus('Listening...')
    }

    recognition.onresult = (e) => {
      let transcript = ''
      for (let i = 0; i < e.results.length; i++) {
        transcript += e.results[i][0].transcript
      }
      setInput(transcript)
      if (e.results[e.results.length - 1].isFinal) {
        setStatus('Got it! Sending...')
        handleSend(transcript)
      }
    }

    recognition.onend = () => {
      setListening(false)
      setStatus('')
    }

    recognition.onerror = (e) => {
      setListening(false)
      setStatus('Mic error: ' + e.error)
      setTimeout(() => setStatus(''), 3000)
    }

    recognitionRef.current = recognition
    try {
      recognition.start()
    } catch (err) {
      setStatus('Could not start mic')
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop()
    setListening(false)
    setStatus('')
  }

  const speak = (text) => {
    if (!window.speechSynthesis) return
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    utter.rate = 0.95

    const duration = Math.max(2, text.length * 0.06)
    const frames = []
    for (let i = 0; i < duration * 30; i++) {
      const t = i / (duration * 30)
      const open = Math.sin(t * Math.PI * 8) * 0.5 + 0.5
      frames.push(open)
    }

    let frameIdx = 0
    const interval = setInterval(() => {
      if (frameIdx < frames.length) {
        setMouthOpen(frames[frameIdx])
        frameIdx++
      }
    }, 1000 / 30)

    utter.onstart = () => setIsSpeaking(true)
    utter.onend = () => {
      setIsSpeaking(false)
      setMouthOpen(0)
      clearInterval(interval)
    }

    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utter)
  }

  const handleSend = async (text) => {
    if (!text.trim()) return
    if (!apiKey) {
      setStatus('Missing API key. Add VITE_GROQ_API_KEY to .env and restart.')
      return
    }

    const userMsg = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setStatus('')

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'openai/gpt-oss-120b',
          messages: [
            {
              role: 'system',
              content: 'You are a friendly English tutor. Correct mistakes gently, explain grammar simply, encourage the student, and keep responses concise and conversational. Focus on helping the user improve spoken and written English.'
            },
            ...newMessages.slice(-8)
          ],
          temperature: 0.7,
          max_tokens: 300
        })
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error.message)

      const reply = data.choices[0].message.content
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      speak(reply)
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }])
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
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: '1px solid #444',
            background: '#1e1e2e',
            color: '#ffffff',
            outline: 'none'
          }}
        />
        <button
          onClick={listening ? stopListening : startListening}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: 'none',
            background: listening ? '#ff5252' : '#4fc3f7',
            color: 'black',
            cursor: 'pointer',
            fontWeight: 'bold',
            minWidth: 70
          }}
        >
          {listening ? 'Stop' : 'Mic'}
        </button>
        <button
          onClick={() => handleSend(input)}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: 'none',
            background: '#66bb6a',
            color: 'black',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
