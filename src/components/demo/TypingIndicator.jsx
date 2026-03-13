export default function TypingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: 8,
        padding: '8px 0',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" fill="#fff" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="#fff" />
        </svg>
      </div>

      <div
        style={{
          background: '#fff',
          borderRadius: '16px 16px 16px 4px',
          padding: '10px 16px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          display: 'flex',
          gap: 5,
          alignItems: 'center',
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#94A3B8',
              animation: 'bounce 1.2s ease infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
