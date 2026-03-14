import { useState, useEffect, useRef } from 'react'
import ChatArea from './ChatArea'
import chatbotIcon from '../../assets/chatbot.svg?url'

export default function WebchatShell({ branding, messages, animatingIdx, botSpeaking, userSpeaking, onMessageClick, onBranchChoice, branchChoices, showBotTyping, disableAutoScroll = false }) {
  const color = branding.primaryColor || '#2563EB'
  const dark = branding.darkShell
  const chatBg     = dark ? '#0F172A' : '#FAFAFA'
  const shellBg    = dark ? '#1E293B' : '#fff'
  const inputBorder = dark ? '#334155' : '#E2E8F0'
  const placeholderColor = dark ? '#475569' : '#94A3B8'
  const footerBg   = dark ? '#111827' : '#F8F8F8'
  const footerBorderColor = dark ? '#1E293B' : '#EFEFEF'
  const footerTextColor   = dark ? '#475569' : '#94A3B8'
  const footerBrandColor  = dark ? '#64748B' : '#475569'

  const [typedText, setTypedText] = useState('')
  const typingIntervalRef = useRef(null)

  // Type out user message text while audio plays
  useEffect(() => {
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
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
  }, [])

  // Hide the latest user message while typing
  const hideLastMsg = userSpeaking && messages[messages.length - 1]?.type === 'user'
  const displayMessages = hideLastMsg ? messages.slice(0, -1) : messages

  return (
    <div
      style={{
        width: 360,
        height: 580,
        borderRadius: 12,
        background: shellBg,
        boxShadow: dark
          ? '0 8px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)'
          : '0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {/* Colored header bar */}
      <div
        style={{
          background: color,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* Avatar with speaking animation */}
        <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0, animation: botSpeaking ? 'speakingBounce 1.6s ease-in-out infinite' : 'none' }}>
          {botSpeaking && [0, 0.65, 1.3].map((delay, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.6)',
                animation: `speakingRipple 1.95s ease-out ${delay}s infinite`,
              }}
            />
          ))}
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
              border: '2px solid rgba(255,255,255,0.4)',
            }}
          >
            {branding.logo ? (
              <img src={branding.logo} alt="" style={{ width: 24, height: 24, objectFit: 'contain' }} />
            ) : (
              <img src={chatbotIcon} alt="" style={{ width: 18, height: 18, filter: 'brightness(0) invert(1)' }} />
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>
            {branding.botName || 'Customer Agent'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)', fontWeight: 400, marginTop: 1 }}>
            {botSpeaking ? 'Typing…' : 'Online'}
          </div>
        </div>

        {/* Three-dot menu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, opacity: 0.8, cursor: 'default' }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />
          ))}
        </div>
      </div>

      {/* Chat area */}
      {displayMessages.length === 0 ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          background: chatBg,
        }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: dark ? '#E2E8F0' : '#1E293B', letterSpacing: -0.3 }}>
            {branding.splashTitle || 'Agentic AI'}
          </span>
          <span style={{ fontSize: 12, fontWeight: 500, color: '#64748B' }}>
            {branding.splashSubtitle || 'Powered by Pega'}
          </span>
          {branding.splashLogo && (
            <img src={branding.splashLogo} alt="" style={{ width: 56, height: 56, objectFit: 'contain', marginTop: 8, opacity: 0.85 }} />
          )}
        </div>
      ) : (
        <div style={{ flex: 1, background: chatBg, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          <ChatArea messages={displayMessages} animatingIdx={animatingIdx} branding={branding} onMessageClick={onMessageClick} onBranchChoice={onBranchChoice} branchChoices={branchChoices} showBotTyping={showBotTyping} disableAutoScroll={disableAutoScroll} />
        </div>
      )}

      {/* Input bar */}
      <div
        style={{
          padding: '10px 12px',
          borderTop: `1px solid ${inputBorder}`,
          background: shellBg,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
        }}
      >
        {/* Emoji icon */}
        <div style={{ color: dark ? '#475569' : color, opacity: 0.7, flexShrink: 0, cursor: 'default' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M8.5 14.5s1 2 3.5 2 3.5-2 3.5-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="9" cy="10" r="1" fill="currentColor" />
            <circle cx="15" cy="10" r="1" fill="currentColor" />
          </svg>
        </div>

        <div
          style={{
            flex: 1,
            fontSize: 13,
            color: typedText ? (dark ? '#E2E8F0' : '#1E293B') : placeholderColor,
            padding: '6px 0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {typedText || 'Type a message'}
          {userSpeaking && typedText && (
            <span style={{ display: 'inline-block', width: 1.5, height: 14, background: color, marginLeft: 1, animation: 'textCursor 0.8s step-end infinite' }} />
          )}
        </div>

        {/* Send icon */}
        <div style={{ color: typedText ? color : placeholderColor, opacity: typedText ? 1 : 0.65, flexShrink: 0, cursor: 'default', transition: 'color 0.2s ease, opacity 0.2s ease' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Powered by footer */}
      <div
        style={{
          padding: '6px 12px 8px',
          background: footerBg,
          borderTop: `1px solid ${footerBorderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 10, color: footerTextColor, fontWeight: 400 }}>Powered by</span>
        <span style={{ fontSize: 10, color: footerBrandColor, fontWeight: 800, letterSpacing: 0.5, textTransform: 'uppercase' }}>
          {branding.poweredByLabel || 'PEGA'}
        </span>
      </div>
    </div>
  )
}
