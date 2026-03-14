import ChatArea from './ChatArea'
import chatbotIcon from '../../assets/chatbot.svg?url'

export default function ContainerShell({ branding, messages, animatingIdx, botSpeaking, userSpeaking, onMessageClick, onBranchChoice, branchChoices, showBotTyping, disableAutoScroll = false }) {
  const color = branding.primaryColor || '#2563EB'
  const accentColor = branding.accentColor || '#7C3AED'
  const dark = branding.darkShell
  const shellBg   = dark ? '#1E293B' : '#fff'
  const border    = dark ? '#334155' : '#F1F5F9'
  const nameColor = dark ? '#E2E8F0' : '#1E293B'
  const chatBg    = dark ? '#0F172A' : '#fff'

  return (
    <div
      style={{
        width: 360,
        height: 580,
        borderRadius: 20,
        background: shellBg,
        boxShadow: dark
          ? '0 4px 32px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2)'
          : '0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          borderBottom: `1px solid ${border}`,
          flexShrink: 0,
        }}
      >
        {/* Avatar with speaking animation */}
        <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0, animation: botSpeaking ? 'speakingBounce 1.6s ease-in-out infinite' : 'none' }}>
          {botSpeaking && [0, 0.65, 1.3].map((delay, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: `2px solid ${accentColor}`,
                animation: `speakingRipple 1.95s ease-out ${delay}s infinite`,
              }}
            />
          ))}
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 1,
              animation: botSpeaking ? 'speakingGlow 2s ease-in-out infinite' : 'none',
              '--speaking-color': `${accentColor}66`,
            }}
          >
            {branding.logo ? (
              <img src={branding.logo} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} />
            ) : (
              <img src={chatbotIcon} alt="" style={{ width: 20, height: 20, filter: 'brightness(0) invert(1)' }} />
            )}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: nameColor, lineHeight: 1.2 }}>
            {branding.botName || 'Customer Agent'}
          </div>
          <div style={{ fontSize: 11, color: '#10B981', fontWeight: 500, marginTop: 1 }}>
            {botSpeaking ? 'Speaking…' : 'Online'}
          </div>
        </div>
      </div>

      {/* Chat area — clipped to bottom corners */}
      <div style={{ flex: 1, background: chatBg, borderRadius: userSpeaking ? '0' : '0 0 20px 20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {messages.length === 0 ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: nameColor, letterSpacing: -0.3 }}>
              {branding.splashTitle || 'Agentic AI'}
            </span>
            <span style={{ fontSize: 12, fontWeight: 500, color: dark ? '#64748B' : '#64748B' }}>
              {branding.splashSubtitle || 'Powered by Pega'}
            </span>
            {branding.splashLogo && (
              <img src={branding.splashLogo} alt="" style={{ width: 56, height: 56, objectFit: 'contain', marginTop: 8, opacity: 0.85 }} />
            )}
          </div>
        ) : (
          <ChatArea messages={messages} animatingIdx={animatingIdx} branding={branding} onMessageClick={onMessageClick} onBranchChoice={onBranchChoice} branchChoices={branchChoices} showBotTyping={showBotTyping} disableAutoScroll={disableAutoScroll} />
        )}
      </div>

      {/* Voice bar */}
      <div
        style={{
          padding: '10px 14px 12px',
          background: shellBg,
          borderTop: `1px solid ${border}`,
          borderRadius: '0 0 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          flexShrink: 0,
        }}
      >
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
            width: 38,
            height: 38,
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="9" y="2" width="6" height="12" rx="3" fill="#fff" />
            <path d="M5 11a7 7 0 0 0 14 0" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <line x1="9"  y1="22" x2="15" y2="22" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

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
    </div>
  )
}
