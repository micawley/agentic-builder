import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function DemoNavBar({ currentScene, total, onPrev, onNext, onReset, isPlaying, onPlayPause, onOpenSettings, presenterMode, onTogglePresenter, nextMessage, onJumpToScene, isRecording, onStartRecord, onStopRecord }) {
  const atStart = currentScene === 0
  const atEnd = currentScene === total
  const [editingScene, setEditingScene] = useState(false)
  const [sceneInput, setSceneInput] = useState('')
  const inputRef = useRef(null)

  const startEdit = () => {
    setSceneInput(String(currentScene))
    setEditingScene(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const commitJump = () => {
    const n = parseInt(sceneInput, 10)
    if (!isNaN(n) && onJumpToScene) onJumpToScene(Math.max(0, Math.min(n, total)))
    setEditingScene(false)
  }

  const handleSceneKeyDown = (e) => {
    if (e.key === 'Enter') commitJump()
    if (e.key === 'Escape') setEditingScene(false)
  }

  if (presenterMode) {
    return (
      <div style={{
        position: 'fixed',
        bottom: 28,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(16px)',
        borderRadius: 20,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        zIndex: 50,
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={atStart}
          style={{
            width: 34, height: 34, borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: atStart ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
            cursor: atStart ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: atStart ? 'rgba(255,255,255,0.25)' : '#fff',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Play/Pause */}
        <button
          onClick={onPlayPause}
          disabled={atEnd && !isPlaying}
          style={{
            width: 44, height: 44, borderRadius: 13,
            border: 'none',
            background: atEnd && !isPlaying ? 'rgba(255,255,255,0.08)' : '#2563EB',
            cursor: atEnd && !isPlaying ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: atEnd && !isPlaying ? 'rgba(255,255,255,0.25)' : '#fff',
            boxShadow: atEnd && !isPlaying ? 'none' : '0 4px 14px rgba(37,99,235,0.45)',
          }}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4l14 8-14 8V4z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button
          onClick={onNext}
          disabled={atEnd}
          style={{
            width: 34, height: 34, borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: atEnd ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.12)',
            cursor: atEnd ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: atEnd ? 'rgba(255,255,255,0.25)' : '#fff',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)' }} />

        {/* Next message preview */}
        {nextMessage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, maxWidth: 240 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: nextMessage.type === 'bot' ? '#60A5FA' : '#A78BFA', flexShrink: 0, textTransform: 'uppercase' }}>
              {nextMessage.type === 'bot' ? 'Bot' : 'You'}
            </span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {nextMessage.text?.slice(0, 60)}{nextMessage.text?.length > 60 ? '…' : ''}
            </span>
          </div>
        )}

        {/* Divider */}
        <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)' }} />

        {/* Scene counter — click to jump */}
        {editingScene ? (
          <input
            ref={inputRef}
            value={sceneInput}
            onChange={(e) => setSceneInput(e.target.value)}
            onKeyDown={handleSceneKeyDown}
            onBlur={commitJump}
            style={{
              width: 52, fontSize: 11, fontWeight: 600, textAlign: 'center',
              background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 6, color: '#fff', padding: '3px 6px', outline: 'none',
            }}
          />
        ) : (
          <span
            onClick={startEdit}
            title="Click to jump to scene"
            style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap', cursor: 'pointer' }}
          >
            {currentScene} / {total}
          </span>
        )}

        {/* Exit presenter */}
        <button
          onClick={onTogglePresenter}
          title="Exit presenter mode"
          style={{
            width: 34, height: 34, borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.08)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M8 3H5a2 2 0 00-2 2v3M16 3h3a2 2 0 012 2v3M21 16v3a2 2 0 01-2 2h-3M8 21H5a2 2 0 01-2-2v-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    )
  }

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

      {/* Right: scene counter + dots + settings + presenter toggle */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          {editingScene ? (
            <input
              ref={inputRef}
              value={sceneInput}
              onChange={(e) => setSceneInput(e.target.value)}
              onKeyDown={handleSceneKeyDown}
              onBlur={commitJump}
              style={{
                width: 56, fontSize: 11, fontWeight: 600, textAlign: 'center',
                background: '#fff', border: '1px solid #2563EB',
                borderRadius: 6, color: '#1E293B', padding: '2px 6px', outline: 'none',
              }}
            />
          ) : (
            <span
              onClick={startEdit}
              title="Click to jump to scene"
              style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', cursor: 'pointer' }}
            >
              {currentScene} / {total}
            </span>
          )}
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

        {/* Record button */}
        <button
          onClick={isRecording ? onStopRecord : onStartRecord}
          title={isRecording ? 'Stop recording & download' : 'Record demo as video'}
          style={{
            width: 36, height: 36, borderRadius: 9,
            border: `1px solid ${isRecording ? '#FECACA' : '#E2E8F0'}`,
            background: isRecording ? '#FEF2F2' : '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isRecording ? '#EF4444' : '#64748B',
            boxShadow: isRecording ? '0 0 0 3px rgba(239,68,68,0.15)' : '0 1px 4px rgba(0,0,0,0.06)',
            transition: 'all 0.15s',
          }}
        >
          {isRecording ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="4" y="4" width="16" height="16" rx="2" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="7" />
            </svg>
          )}
        </button>

        {/* Presenter mode toggle */}
        <button
          onClick={onTogglePresenter}
          title="Presenter mode"
          style={{
            width: 36, height: 36, borderRadius: 9,
            border: '1px solid #E2E8F0', background: '#fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#64748B', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

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
