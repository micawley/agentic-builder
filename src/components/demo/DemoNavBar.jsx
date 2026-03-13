import { Link } from 'react-router-dom'

export default function DemoNavBar({ currentScene, total, onPrev, onNext, onReset, isPlaying, onPlayPause, onOpenSettings }) {
  const atStart = currentScene === 0
  const atEnd = currentScene === total

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 64,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        zIndex: 50,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
      }}
    >
      {/* Back to builder */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          left: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#64748B',
          textDecoration: 'none',
          fontSize: 13,
          fontWeight: 500,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Builder
      </Link>

      {/* Reset */}
      <button
        onClick={onReset}
        disabled={atStart}
        title="Reset"
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          border: '1px solid #E2E8F0',
          background: atStart ? '#F8FAFF' : '#fff',
          cursor: atStart ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: atStart ? '#CBD5E1' : '#64748B',
          transition: 'all 0.15s',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M19 12A7 7 0 1112 5M12 5V1M12 5L8 9M12 5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Prev */}
      <button
        onClick={onPrev}
        disabled={atStart}
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          border: '1px solid #E2E8F0',
          background: atStart ? '#F8FAFF' : '#fff',
          cursor: atStart ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: atStart ? '#CBD5E1' : '#1E293B',
          transition: 'all 0.15s',
          boxShadow: atStart ? 'none' : '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Play / Pause */}
      <button
        onClick={onPlayPause}
        disabled={atEnd && !isPlaying}
        title={isPlaying ? 'Pause' : 'Play'}
        style={{
          width: 48,
          height: 48,
          borderRadius: 14,
          border: 'none',
          background: atEnd && !isPlaying ? '#F8FAFF' : '#2563EB',
          cursor: atEnd && !isPlaying ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: atEnd && !isPlaying ? '#CBD5E1' : '#fff',
          transition: 'all 0.15s',
          boxShadow: atEnd && !isPlaying ? 'none' : '0 4px 14px rgba(37,99,235,0.35)',
        }}
      >
        {isPlaying ? (
          // Pause icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          // Play icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 4l14 8-14 8V4z" />
          </svg>
        )}
      </button>

      {/* Next */}
      <button
        onClick={onNext}
        disabled={atEnd}
        style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          border: '1px solid',
          borderColor: atEnd ? '#E2E8F0' : '#2563EB',
          background: atEnd ? '#F8FAFF' : '#2563EB',
          cursor: atEnd ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: atEnd ? '#CBD5E1' : '#fff',
          transition: 'all 0.15s',
          boxShadow: atEnd ? 'none' : '0 2px 8px rgba(37,99,235,0.3)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Right: scene counter + dots + settings */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8' }}>
            {currentScene} / {total}
          </span>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            {Array.from({ length: total + 1 }, (_, i) => (
              <div
                key={i}
                style={{
                  width: i === currentScene ? 16 : 5,
                  height: 5,
                  borderRadius: 3,
                  background: i === currentScene ? '#2563EB' : '#CBD5E1',
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Settings gear */}
        <button
          onClick={onOpenSettings}
          title="Edit conversation"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            border: '1px solid #E2E8F0',
            background: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748B',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    </div>
  )
}