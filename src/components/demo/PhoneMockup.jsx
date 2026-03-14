import { useState, useEffect, useRef } from 'react'
import ChatArea from './ChatArea'
import chatbotIcon from '../../assets/chatbot.svg?url'

export default function PhoneMockup({ branding, messages, animatingIdx, botSpeaking, userSpeaking, isPlaying = true, onMessageClick, showBotTyping, disableAutoScroll = false }) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  const [recordSecs, setRecordSecs] = useState(0)
  const [justSent, setJustSent] = useState(false)
  const [typedText, setTypedText] = useState('')
  const recordIntervalRef = useRef(null)
  const justSentTimerRef = useRef(null)
  const typingIntervalRef = useRef(null)
  const prevUserSpeakingRef = useRef(false)

  const isVoiceToTextRef = useRef(false)
  isVoiceToTextRef.current = branding.phoneInputStyle === 'voicetotext'
  const isTextRef = useRef(false)
  isTextRef.current = branding.phoneInputStyle === 'text'

  // Recording timer — voicetotext only; supports pause/resume via isPlaying
  useEffect(() => {
    if (!isVoiceToTextRef.current) return
    const wasAlreadySpeaking = prevUserSpeakingRef.current
    prevUserSpeakingRef.current = userSpeaking

    if (userSpeaking) {
      if (!wasAlreadySpeaking) setRecordSecs(0)
      if (isPlaying) {
        if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
        recordIntervalRef.current = setInterval(() => setRecordSecs(s => s + 1), 1000)
      } else {
        if (recordIntervalRef.current) { clearInterval(recordIntervalRef.current); recordIntervalRef.current = null }
      }
    } else {
      if (recordIntervalRef.current) { clearInterval(recordIntervalRef.current); recordIntervalRef.current = null }
      if (recordSecs > 0) {
        setJustSent(true)
        justSentTimerRef.current = setTimeout(() => { setJustSent(false); setRecordSecs(0) }, 1400)
      }
    }
    return () => { if (recordIntervalRef.current) clearInterval(recordIntervalRef.current) }
  }, [userSpeaking, isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Typing animation — text only
  useEffect(() => {
    if (!isTextRef.current) return
    if (userSpeaking) {
      const fullText = messages[messages.length - 1]?.text || ''
      setTypedText('')
      let i = 0
      typingIntervalRef.current = setInterval(() => {
        i++
        setTypedText(fullText.slice(0, i))
        if (i >= fullText.length) { clearInterval(typingIntervalRef.current); typingIntervalRef.current = null }
      }, 40)
    } else {
      if (typingIntervalRef.current) { clearInterval(typingIntervalRef.current); typingIntervalRef.current = null }
      setTypedText('')
    }
    return () => { if (typingIntervalRef.current) clearInterval(typingIntervalRef.current) }
  }, [userSpeaking]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => {
    if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
    if (justSentTimerRef.current) clearTimeout(justSentTimerRef.current)
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
  }, [])

  const color = branding.primaryColor || '#2563EB'
  const accentColor = branding.accentColor || '#7C3AED'
  const isVoiceToText = branding.phoneInputStyle === 'voicetotext'
  const isText = branding.phoneInputStyle === 'text'

  // Dark mode vars
  const dark = branding.darkShell
  const screenBg       = dark ? '#0F172A' : '#F7F7F7'
  const headerGradient = dark
    ? `linear-gradient(to bottom, #0F172A 0%, #0F172A 60%, rgba(15,23,42,0) 100%)`
    : `linear-gradient(to bottom, #F7F7F7 0%, #F7F7F7 60%, rgba(247,247,247,0) 100%)`
  const timeColor      = dark ? '#E2E8F0' : '#000'
  const statusFill     = dark ? '#E2E8F0' : '#000'
  const statusDim      = dark ? 'rgba(226,232,240,0.25)' : 'rgba(0,0,0,0.25)'
  const inputBarBg     = dark ? '#1E293B' : '#F7F7F7'
  const inputBarBorder = dark ? '#334155' : 'rgba(0,0,0,0.08)'
  const pillBg         = dark ? '#1E293B' : '#fff'
  const pillBorder     = dark ? '#334155' : '#E5E5EA'
  const pillText       = dark ? '#94A3B8' : '#C7C7CC'
  const splashTitleClr = dark ? '#E2E8F0' : '#1E293B'
  const splashSubClr   = dark ? '#64748B' : '#64748B'

  // Hide the latest user message while the input animation is active
  const hideLastMsg = (
    (isVoiceToText && (userSpeaking || justSent)) ||
    (isText && userSpeaking)
  ) && messages[messages.length - 1]?.type === 'user'
  const displayMessages = hideLastMsg ? messages.slice(0, -1) : messages

  const formatSecs = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

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
          background: screenBg,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Floating header — gradient fade */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          background: headerGradient,
          backdropFilter: 'blur(1px)',
          WebkitBackdropFilter: 'blur(1px)',
        }}>

        {/* Status bar */}
        <div
          style={{
            height: 44,
            flexShrink: 0,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            padding: '0 14px',
          }}
        >
          <span style={{ color: timeColor, fontSize: 12, fontWeight: 700, letterSpacing: 0.3, zIndex: 2, flex: 1 }}>
            {time}
          </span>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 80, height: 24, background: '#000', borderRadius: 12, zIndex: 10 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, zIndex: 2 }}>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <rect x="0"    y="6"   width="2.5" height="4"   rx="0.5" fill={statusFill} />
              <rect x="3.5"  y="4"   width="2.5" height="6"   rx="0.5" fill={statusFill} />
              <rect x="7"    y="1.5" width="2.5" height="8.5" rx="0.5" fill={statusFill} />
              <rect x="10.5" y="0"   width="2.5" height="10"  rx="0.5" fill={statusDim} />
            </svg>
            <svg width="13" height="10" viewBox="0 0 22 16" fill="none">
              <path d="M11 13a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" fill={statusFill}/>
              <path d="M5.5 9a7.7 7.7 0 0 1 11 0" stroke={statusFill} strokeWidth="2" strokeLinecap="round"/>
              <path d="M1.5 5a13 13 0 0 1 19 0" stroke={statusDim} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <svg width="19" height="10" viewBox="0 0 22 12" fill="none">
              <rect x="0.5" y="0.5" width="18" height="11" rx="2.5" stroke={statusDim} strokeWidth="1.2"/>
              <rect x="2"   y="2"   width="13" height="8"  rx="1.5" fill={statusFill}/>
              <path d="M20 4v4a2 2 0 0 0 0-4z" fill={dark ? 'rgba(226,232,240,0.4)' : 'rgba(0,0,0,0.4)'}/>
            </svg>
          </div>
        </div>

        {/* Chat header — centered logo only */}
        <div style={{ padding: '4px 14px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: 36, height: 36, animation: botSpeaking ? 'speakingBounce 1.6s ease-in-out infinite' : 'none' }}>
            {botSpeaking && [0, 0.65, 1.3].map((delay, i) => (
              <div key={i} style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: `2px solid ${accentColor}`, animation: `speakingRipple 1.95s ease-out ${delay}s infinite`, '--speaking-color': accentColor }} />
            ))}
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', zIndex: 1, animation: botSpeaking ? 'speakingGlow 2s ease-in-out infinite' : 'none', '--speaking-color': `${accentColor}66` }}>
              {branding.logo ? (
                <img src={branding.logo} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
              ) : (
                <img src={chatbotIcon} alt="" style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }} />
              )}
            </div>
          </div>
        </div>

        </div>{/* end floating header */}

        {/* Chat area */}
        {messages.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, paddingBottom: 24 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: splashTitleClr, letterSpacing: -0.3 }}>{branding.splashTitle || 'Agentic AI'}</span>
            <span style={{ fontSize: 12, fontWeight: 500, color: splashSubClr }}>{branding.splashSubtitle || 'Powered by Pega'}</span>
            {branding.splashLogo && <img src={branding.splashLogo} alt="" style={{ width: 64, height: 64, objectFit: 'contain', marginTop: 8, opacity: 0.85 }} />}
          </div>
        ) : (
          <ChatArea messages={displayMessages} animatingIdx={animatingIdx} branding={branding} onMessageClick={onMessageClick} topPad={94} showBotTyping={showBotTyping} disableAutoScroll={disableAutoScroll} />
        )}

        {/* ── Voice input bar ── */}
        {isVoiceToText ? (
          /* iMessage style */
          <div style={{ padding: '8px 10px 10px', background: inputBarBg, borderTop: `1px solid ${inputBarBorder}`, flexShrink: 0 }}>
            {userSpeaking ? (
              /* Recording state */
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: dark ? '#1E293B' : '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1l12 12M13 1L1 13" stroke={dark ? '#64748B' : '#8E8E93'} strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, background: dark ? '#0F172A' : '#fff', borderRadius: 18, padding: '6px 10px', overflow: 'hidden' }}>
                  {[3,6,9,12,8,11,7,10,5,8,11,9,6,4].map((h, i) => (
                    <div key={i} style={{ width: 2.5, height: h, borderRadius: 2, background: '#FF3B30', animation: `voiceBar 0.7s ease-in-out ${i * 0.07}s infinite alternate` }} />
                  ))}
                </div>
                <span style={{ fontSize: 11, color: '#FF3B30', fontWeight: 600, letterSpacing: 0.3, flexShrink: 0 }}>
                  {formatSecs(recordSecs)}
                </span>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#FF3B30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#fff' }} />
                </div>
              </div>
            ) : justSent ? (
              /* Just sent flash */
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, background: dark ? '#0F172A' : '#fff', borderRadius: 18, padding: '8px 14px', border: `1px solid ${pillBorder}` }}>
                  <span style={{ fontSize: 12, color: pillText }}>iMessage</span>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M20 6L9 17l-5-5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            ) : (
              /* Idle state */
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.85 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ flex: 1, background: pillBg, borderRadius: 18, padding: '8px 12px', border: `1px solid ${pillBorder}` }}>
                  <span style={{ fontSize: 12, color: pillText }}>iMessage</span>
                </div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', border: `1.5px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: 0.7 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="9" y="2" width="6" height="12" rx="3" fill={color} />
                    <path d="M5 11a7 7 0 0 0 14 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
                    <line x1="9"  y1="22" x2="15" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : isText ? (
          /* Text typing style */
          <div style={{ padding: '8px 10px 10px', background: inputBarBg, borderTop: `1px solid ${inputBarBorder}`, flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                flex: 1, background: pillBg, borderRadius: 18, padding: '8px 12px',
                border: `1px solid ${typedText ? color + '66' : pillBorder}`,
                fontSize: 12, color: typedText ? (dark ? '#E2E8F0' : '#1E293B') : pillText,
                minHeight: 34, display: 'flex', alignItems: 'center',
                transition: 'border-color 0.2s ease',
                wordBreak: 'break-word',
              }}>
                {typedText || 'Message'}
                {userSpeaking && typedText && (
                  <span style={{ display: 'inline-block', width: 1.5, height: 13, background: color, marginLeft: 1, animation: 'textCursor 0.8s step-end infinite' }} />
                )}
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: typedText ? color : (dark ? '#334155' : '#E5E5EA'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s ease',
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        ) : (
          /* Original voice bars style */
          <div style={{ padding: '10px 12px 12px', background: dark ? '#1E293B' : '#fff', borderTop: `1px solid ${inputBarBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexShrink: 0 }}>
            {[3, 6, 10, 7, 4, 9, 5].map((h, i) => (
              <div key={i} style={{ width: 3, height: userSpeaking ? h * 2 : 4, borderRadius: 2, background: color, opacity: userSpeaking ? 0.35 : 0.15, transition: 'height 0.3s ease, opacity 0.3s ease', animation: userSpeaking ? `voiceBar 1.1s ease-in-out ${i * 0.13}s infinite alternate` : 'none' }} />
            ))}
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, position: 'relative', animation: userSpeaking ? 'micPulse 1.8s ease-in-out infinite' : 'none', opacity: userSpeaking ? 1 : 0.5, transition: 'opacity 0.3s ease', margin: '0 4px' }}>
              {userSpeaking && <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `2px solid ${color}`, opacity: 0.3, animation: 'micRing 1.8s ease-in-out infinite' }} />}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff" />
                <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <line x1="12" y1="18" x2="12" y2="22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <line x1="9"  y1="22" x2="15" y2="22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {[5, 9, 4, 7, 10, 6, 3].map((h, i) => (
              <div key={i} style={{ width: 3, height: userSpeaking ? h * 2 : 4, borderRadius: 2, background: color, opacity: userSpeaking ? 0.35 : 0.15, transition: 'height 0.3s ease, opacity 0.3s ease', animation: userSpeaking ? `voiceBar 1.1s ease-in-out ${i * 0.13 + 0.05}s infinite alternate` : 'none' }} />
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}
