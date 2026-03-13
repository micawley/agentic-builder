import { useState, useEffect, useRef } from 'react'
import ChatArea from './ChatArea'
import chatbotIcon from '../../assets/chatbot.svg?url'

export default function PhoneMockup({ branding, messages, animatingIdx, onMessageClick }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const [userSpeaking, setUserSpeaking] = useState(false)
  const speakTimerRef = useRef(null)

  // Pulse for 10s when a customer message is added; stop immediately when a bot message is added
  useEffect(() => {
    const lastMsg = messages[messages.length - 1]
    if (speakTimerRef.current) clearTimeout(speakTimerRef.current)
    if (lastMsg?.type === 'user') {
      setUserSpeaking(true)
      speakTimerRef.current = setTimeout(() => setUserSpeaking(false), 10000)
    } else {
      setUserSpeaking(false)
    }
  }, [messages.length]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (speakTimerRef.current) clearTimeout(speakTimerRef.current) }, [])

  const color = branding.primaryColor || '#2563EB'

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
    <div
      style={{
        width: 300,
        height: 620,
        borderRadius: 44,
        background: '#1a1a1e',
        padding: 10,
        boxShadow:
          '0 24px 60px rgba(0,0,0,0.35), 0 8px 20px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.08)',
        position: 'relative',
        flexShrink: 0,
      }}
    >
      {/* Side buttons */}
      <div style={{ position: 'absolute', left: -3, top: 96,  width: 3, height: 28, background: '#2a2a2e', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 134, width: 3, height: 52, background: '#2a2a2e', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', left: -3, top: 194, width: 3, height: 52, background: '#2a2a2e', borderRadius: '2px 0 0 2px' }} />
      <div style={{ position: 'absolute', right: -3, top: 154, width: 3, height: 68, background: '#2a2a2e', borderRadius: '0 2px 2px 0' }} />

      {/* Screen */}
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 36,
          background: '#F1F5F9',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Status bar */}
        <div
          style={{
            height: 50,
            background: branding.primaryColor,
            flexShrink: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
          }}
        >
          {/* Time — left */}
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700, letterSpacing: 0.3, zIndex: 2, flex: 1 }}>
            {time}
          </span>

          {/* Dynamic Island — absolutely centered */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 24,
              background: '#000',
              borderRadius: 12,
              zIndex: 10,
            }}
          />

          {/* Icons — right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, zIndex: 2 }}>
            {/* Signal bars */}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <rect x="0"    y="6"   width="2.5" height="4"   rx="0.5" fill="white" />
              <rect x="3.5"  y="4"   width="2.5" height="6"   rx="0.5" fill="white" />
              <rect x="7"    y="1.5" width="2.5" height="8.5" rx="0.5" fill="white" />
              <rect x="10.5" y="0"   width="2.5" height="10"  rx="0.5" fill="rgba(255,255,255,0.35)" />
            </svg>
            {/* Wifi */}
            <svg width="13" height="10" viewBox="0 0 22 16" fill="none">
              <path d="M11 13a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill="white"/>
              <path d="M5.5 9a7.7 7.7 0 0 1 11 0"  stroke="white"                    strokeWidth="2" strokeLinecap="round"/>
              <path d="M1.5 5a13 13 0 0 1 19 0"    stroke="rgba(255,255,255,0.4)"    strokeWidth="2" strokeLinecap="round"/>
            </svg>
            {/* Battery */}
            <svg width="19" height="10" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke="white" strokeWidth="1.2"/>
              <rect x="2"   y="2"   width="13" height="8"  rx="1.5" fill="white"/>
              <path d="M20 4v4a2 2 0 0 0 0-4z" fill="rgba(255,255,255,0.55)"/>
            </svg>
          </div>
        </div>

        {/* Chat header */}
        <div
          style={{
            background: branding.primaryColor,
            padding: '8px 14px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexShrink: 0,
          }}
        >
          {branding.logo ? (
            <img
              src={branding.logo}
              alt=""
              style={{ height: 32, maxWidth: 80, objectFit: 'contain', borderRadius: 6, flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <img src={chatbotIcon} alt="" style={{ width: 22, height: 22 }} />
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {branding.botName}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: 10 }}>Online</span>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <ChatArea messages={messages} animatingIdx={animatingIdx} branding={branding} onMessageClick={onMessageClick} />

        {/* Voice input bar */}
        {(() => {
          return (
            <div
              style={{
                padding: '10px 12px 12px',
                background: '#fff',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                flexShrink: 0,
              }}
            >
              {/* Waveform bars — left */}
              {[3, 6, 10, 7, 4, 9, 5].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: userSpeaking ? h * 2 : 4,
                    borderRadius: 2,
                    background: color,
                    opacity: userSpeaking ? 0.35 : 0.15,
                    transition: 'height 0.3s ease, opacity 0.3s ease',
                    animation: userSpeaking ? `voiceBar 1.1s ease-in-out ${i * 0.13}s infinite alternate` : 'none',
                  }}
                />
              ))}

              {/* Mic button */}
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  background: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  animation: userSpeaking ? 'micPulse 1.8s ease-in-out infinite' : 'none',
                  opacity: userSpeaking ? 1 : 0.5,
                  transition: 'opacity 0.3s ease',
                  margin: '0 4px',
                }}
              >
                {/* Pulse ring — only when user is speaking */}
                {userSpeaking && (
                  <div style={{
                    position: 'absolute',
                    inset: -6,
                    borderRadius: '50%',
                    border: `2px solid ${color}`,
                    opacity: 0.3,
                    animation: 'micRing 1.8s ease-in-out infinite',
                  }} />
                )}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff" />
                  <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <line x1="12" y1="18" x2="12" y2="22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  <line x1="9"  y1="22" x2="15" y2="22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>

              {/* Waveform bars — right */}
              {[5, 9, 4, 7, 10, 6, 3].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: userSpeaking ? h * 2 : 4,
                    borderRadius: 2,
                    background: color,
                    opacity: userSpeaking ? 0.35 : 0.15,
                    transition: 'height 0.3s ease, opacity 0.3s ease',
                    animation: userSpeaking ? `voiceBar 1.1s ease-in-out ${i * 0.13 + 0.05}s infinite alternate` : 'none',
                  }}
                />
              ))}
            </div>
          )
        })()}
      </div>
    </div>
    </div>
  )
}
