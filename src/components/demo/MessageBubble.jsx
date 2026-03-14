import chatbotIcon from '../../assets/chatbot.svg?url'

export default function MessageBubble({ message, branding, isNew, onClick }) {
  const isBot = message.type === 'bot'
  const dark = branding?.darkShell

  const botBubbleBg   = dark ? '#1E3A5F' : '#fff'
  const botBubbleText = dark ? '#E2E8F0' : '#1E293B'
  const botAvatarBg   = dark ? '#334155' : '#E1E7EF'
  const userAvatarBg  = dark ? '#334155' : '#E2E8F0'

  return (
    <div
      className={isNew ? 'animate-in' : ''}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        padding: '4px 0',
        justifyContent: isBot ? 'flex-start' : 'flex-end',
        cursor: onClick ? 'pointer' : 'default',
      }}
    >
      {isBot && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: botAvatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img src={chatbotIcon} alt="" style={{ width: 18, height: 18, filter: dark ? 'brightness(0) invert(0.6)' : 'none' }} />
        </div>
      )}

      <div
        style={{
          maxWidth: '75%',
          padding: '10px 14px',
          borderRadius: isBot ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
          background: isBot ? botBubbleBg : '#007AFF',
          color: isBot ? botBubbleText : '#fff',
          fontSize: 13,
          lineHeight: 1.6,
          boxShadow: dark ? '0 1px 4px rgba(0,0,0,0.25)' : '0 1px 4px rgba(0,0,0,0.08)',
          wordBreak: 'break-word',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message.text || (isBot ? '…' : '…')}
      </div>

      {!isBot && (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background: userAvatarBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {branding.customerAvatar ? (
            <img src={branding.customerAvatar} alt="" style={{ width: 28, height: 28, objectFit: 'cover' }} />
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke={dark ? '#64748B' : '#64748B'} strokeWidth="2" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={dark ? '#64748B' : '#64748B'} strokeWidth="2" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}
