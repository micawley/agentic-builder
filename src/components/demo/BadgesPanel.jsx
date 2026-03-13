import chatbotIcon from '../../assets/chatbot.svg?url'

const COLOR_MAP = {
  green: '#10B981',
  purple: '#7C3AED',
  blue: '#2563EB',
  orange: '#F59E0B',
  red: '#EF4444',
}

export default function BadgesPanel({ badges }) {
  if (!badges || badges.length === 0) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#94A3B8',
          fontSize: 14,
        }}
      >
        No badges configured
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        padding: '32px 24px',
        gap: 0,
        position: 'relative',
      }}
    >
      {badges.map((badge, idx) => {
        const color = COLOR_MAP[badge.color] || COLOR_MAP.blue
        const isLast = idx === badges.length - 1
        return (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: 'fadeSlideUp 0.4s ease forwards',
              animationDelay: `${idx * 0.12}s`,
              opacity: 0,
            }}
          >
            {idx > 0 && (
              <svg width="2.5" height="28" style={{ display: 'block' }}>
                <line
                  x1="1.25" y1="0" x2="1.25" y2="28"
                  stroke="#1E3A8A"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                />
              </svg>
            )}
            <div style={{ position: 'relative' }}>
              {isLast && (
                <div style={{
                  position: 'absolute',
                  inset: -4,
                  borderRadius: 18,
                  border: `2px solid ${color}`,
                  '--pulse-color': `${color}55`,
                  animation: 'badgeShadowPulse 2s ease-in-out infinite',
                  pointerEvents: 'none',
                }} />
              )}
            <div
              style={{
                background: '#fff',
                border: `2px solid ${color}22`,
                borderRadius: 14,
                padding: '12px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                boxShadow: `0 4px 16px ${color}18, 0 1px 4px rgba(0,0,0,0.06)`,
                minWidth: 180,
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: color,
                  boxShadow: `0 0 0 3px ${color}30`,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={chatbotIcon} alt="" style={{ width: 16, height: 16, filter: 'brightness(0) invert(1)' }} />
              </div>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#1E293B',
                }}
              >
                {badge.label}
              </span>
            </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
