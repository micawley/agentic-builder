import { useState, useRef } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import MessageCard from './MessageCard'

function parseBulkText(raw) {
  // Try JSON first
  try {
    const parsed = JSON.parse(raw.trim())
    if (Array.isArray(parsed)) {
      return parsed
        .filter((m) => m && typeof m.text === 'string')
        .map((m) => ({ type: m.type === 'user' ? 'user' : 'bot', text: m.text.trim() }))
        .filter((m) => m.text)
    }
  } catch { /* not JSON */ }

  // Plain text: lines prefixed "Bot:" / "User:" / "B:" / "U:", or alternating
  const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean)
  const hasPrefixes = lines.some((l) => /^(bot|user|b|u)\s*:/i.test(l))

  if (hasPrefixes) {
    return lines.map((line) => {
      const m = line.match(/^(bot|user|b|u)\s*:\s*/i)
      if (!m) return null
      const type = /^(b|bot)/i.test(m[1]) ? 'bot' : 'user'
      return { type, text: line.slice(m[0].length).trim() }
    }).filter(Boolean).filter((m) => m.text)
  }

  // Alternating lines: bot, user, bot, user...
  return lines.map((text, i) => ({ type: i % 2 === 0 ? 'bot' : 'user', text }))
}

function BulkImportModal({ onClose, onImport }) {
  const [raw, setRaw] = useState('')
  const [preview, setPreview] = useState(null)
  const [error, setError] = useState('')

  const handlePreview = () => {
    if (!raw.trim()) { setError('Paste some content first'); return }
    const msgs = parseBulkText(raw)
    if (!msgs.length) { setError('Could not parse any messages'); return }
    setPreview(msgs)
    setError('')
  }

  const handleImport = () => {
    const msgs = preview || parseBulkText(raw)
    if (!msgs.length) { setError('Nothing to import'); return }
    onImport(msgs)
    onClose()
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          background: '#fff', borderRadius: 18, width: 560,
          maxHeight: '80vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>Bulk Import Conversation</h3>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>
              Paste JSON, or plain lines prefixed with <strong>Bot:</strong> / <strong>User:</strong> (or alternating)
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <textarea
            value={raw}
            onChange={(e) => { setRaw(e.target.value); setPreview(null); setError('') }}
            placeholder={`Examples:\n\nBot: Hello, how can I help?\nUser: I need to file a claim.\nBot: Sure, let me pull that up.\n\n— or paste a JSON array —\n[{"type":"bot","text":"Hello"},{"type":"user","text":"Hi"}]`}
            rows={10}
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 10,
              border: '1px solid #E2E8F0', fontSize: 13, color: '#1E293B',
              background: '#FAFBFF', outline: 'none', resize: 'vertical',
              fontFamily: 'monospace', lineHeight: 1.6,
            }}
            onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          />

          {error && (
            <p style={{ fontSize: 12, color: '#EF4444', fontWeight: 500 }}>{error}</p>
          )}

          {preview && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 8 }}>
                Preview — {preview.length} message{preview.length !== 1 ? 's' : ''}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 220, overflowY: 'auto', padding: '2px 0' }}>
                {preview.map((m, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 8, alignItems: 'flex-start',
                  }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 10, flexShrink: 0, marginTop: 1,
                      background: m.type === 'bot' ? '#EFF6FF' : '#F5F3FF',
                      color: m.type === 'bot' ? '#2563EB' : '#7C3AED',
                    }}>
                      {m.type.toUpperCase()}
                    </span>
                    <span style={{ fontSize: 12, color: '#374151', lineHeight: 1.5 }}>{m.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 24px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={handlePreview}
            style={{
              padding: '9px 18px', borderRadius: 9, border: '1px solid #E2E8F0',
              background: '#F8FAFC', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#64748B',
            }}
          >
            Preview
          </button>
          <button
            onClick={handleImport}
            style={{
              padding: '9px 18px', borderRadius: 9, border: 'none',
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#fff',
              boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
            }}
          >
            Import {preview ? `${preview.length} messages` : 'Messages'}
          </button>
        </div>
      </div>
    </div>
  )
}

function estimateDuration(messages) {
  let secs = 0
  for (const msg of messages) {
    if (msg.type === 'bot') secs += 1.2 // typing animation
    const words = msg.text?.trim().split(/\s+/).filter(Boolean).length || 0
    secs += words / 2.5  // ~150 wpm read/listen pace
    secs += 1.5           // auto-advance pause
  }
  if (secs < 60) return `~${Math.round(secs)}s`
  const m = Math.floor(secs / 60)
  const s = Math.round(secs % 60)
  return s > 0 ? `~${m}m ${s}s` : `~${m}m`
}

export default function ConversationTab({ scrollToId, onScrolled }) {
  const { state, addMessage, insertMessage, reorderMessages, setBranding, bulkAddMessages, updateMessage, replaceInMessages } = useBuilder()
  const { messages } = state
  const autoSync = state.branding.autoSyncStages

  const [dragIdx, setDragIdx] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMatchIdx, setSearchMatchIdx] = useState(0)
  const [replaceMode, setReplaceMode] = useState(false)
  const [replaceQuery, setReplaceQuery] = useState('')
  const [bulkModalOpen, setBulkModalOpen] = useState(false)
  const searchRef = useRef(null)

  // Compute which message indices match the search
  const query = searchQuery.trim().toLowerCase()
  const matchIndices = query
    ? messages.reduce((acc, msg, i) => {
        if (msg.text.toLowerCase().includes(query)) acc.push(i)
        return acc
      }, [])
    : []

  const clampedMatchIdx = matchIndices.length > 0 ? searchMatchIdx % matchIndices.length : 0

  const handleSearchNav = (dir) => {
    if (!matchIndices.length) return
    setSearchMatchIdx((prev) => {
      const next = (prev + dir + matchIndices.length) % matchIndices.length
      return next
    })
  }

  const handleDragStart = (e, idx) => {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, idx) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== dragIdx) setDragOverIdx(idx)
  }

  const handleDrop = (e, idx) => {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== idx) reorderMessages(dragIdx, idx)
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const AddButtons = () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <button
        onClick={() => addMessage('bot')}
        style={{
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Bot Message
      </button>
      <button
        onClick={() => addMessage('user')}
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        User Message
      </button>
      <button
        onClick={() => addMessage('branch')}
        style={{
          background: 'linear-gradient(135deg, #D97706, #B45309)',
          color: '#fff', border: 'none', borderRadius: 10, padding: '9px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: '0 2px 8px rgba(217,119,6,0.25)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 3v7a6 6 0 006 6h0M6 3l4-2M6 3l4 2M18 21v-7a6 6 0 00-6-6h0M18 21l-4-2M18 21l4-2" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Branch
      </button>
      <button
        onClick={() => setBulkModalOpen(true)}
        style={{
          background: '#F8FAFC', color: '#64748B',
          border: '1px solid #E2E8F0', borderRadius: 10, padding: '9px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 6,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Bulk Import
      </button>
    </div>
  )

  const InsertGap = ({ afterIndex }) => {
    const isDropTarget = dragIdx !== null && dragOverIdx === afterIndex + 1
    return (
      <div
        style={{
          height: 36, display: 'flex', alignItems: 'center',
          justifyContent: 'center', position: 'relative', gap: 6,
        }}
      >
        {isDropTarget && (
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#2563EB', borderRadius: 1 }} />
        )}
        <button
          onClick={() => insertMessage(afterIndex + 1, 'bot')}
          style={{
            background: '#EFF6FF', color: '#2563EB',
            border: '1.5px dashed #93C5FD', borderRadius: 8,
            padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Insert Bot
        </button>
        <button
          onClick={() => insertMessage(afterIndex + 1, 'user')}
          style={{
            background: '#F5F3FF', color: '#7C3AED',
            border: '1.5px dashed #C4B5FD', borderRadius: 8,
            padding: '4px 12px', fontSize: 11, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Insert User
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>Conversation</h3>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            Build the message flow for your demo
            {messages.length > 0 && (
              <span style={{ marginLeft: 8, fontSize: 12, color: '#CBD5E1' }}>·</span>
            )}
            {messages.length > 0 && (
              <span style={{ marginLeft: 6, fontSize: 12, color: '#94A3B8' }}>
                {messages.length} msg · {estimateDuration(messages)}
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginTop: 2 }}>
          <span style={{ fontSize: 12, fontWeight: 500, color: autoSync ? '#2563EB' : '#94A3B8' }}>
            Stage auto-sync
          </span>
          <button
            onClick={() => setBranding({ autoSyncStages: !autoSync })}
            style={{
              width: 40, height: 22, borderRadius: 11, border: 'none',
              background: autoSync ? '#2563EB' : '#E2E8F0',
              cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{
              position: 'absolute', top: 2, left: autoSync ? 20 : 2,
              width: 18, height: 18, borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
            }} />
          </button>
        </div>
      </div>

      {/* Search / Find & Replace bar — only when there are messages */}
      {messages.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {/* Search row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Find & Replace toggle */}
            <button
              onClick={() => { setReplaceMode((v) => !v); setReplaceQuery('') }}
              title={replaceMode ? 'Hide replace' : 'Find & Replace'}
              style={{
                height: 28, borderRadius: 7, border: '1px solid #E2E8F0',
                background: replaceMode ? '#EFF6FF' : '#fff',
                color: replaceMode ? '#2563EB' : '#94A3B8',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'all 0.15s',
                padding: '0 10px', fontSize: 12, fontWeight: 500,
              }}
            >
              Replace
            </button>

            <div style={{ flex: 1, position: 'relative' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}>
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchMatchIdx(0) }}
                placeholder="Search messages…"
                style={{
                  width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                  borderRadius: 10, border: '1px solid #E2E8F0',
                  fontSize: 13, color: '#1E293B', background: '#fff', outline: 'none',
                  fontFamily: 'inherit', transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              />
            </div>

            {query && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: matchIndices.length ? '#64748B' : '#EF4444', fontWeight: 500 }}>
                  {matchIndices.length ? `${clampedMatchIdx + 1}/${matchIndices.length}` : 'No matches'}
                </span>
                <button onClick={() => handleSearchNav(-1)} disabled={matchIndices.length === 0}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: matchIndices.length ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button onClick={() => handleSearchNav(1)} disabled={matchIndices.length === 0}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: 6, width: 28, height: 28, cursor: matchIndices.length ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button onClick={() => { setSearchQuery(''); setReplaceQuery(''); setReplaceMode(false) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Replace row */}
          {replaceMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 36 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}>
                  <path d="M7 17v4M7 21h4M3 7h18M3 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input
                  type="text"
                  value={replaceQuery}
                  onChange={(e) => setReplaceQuery(e.target.value)}
                  placeholder="Replace with…"
                  style={{
                    width: '100%', paddingLeft: 36, paddingRight: 12, paddingTop: 9, paddingBottom: 9,
                    borderRadius: 10, border: '1px solid #E2E8F0',
                    fontSize: 13, color: '#1E293B', background: '#fff', outline: 'none',
                    fontFamily: 'inherit', transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#7C3AED')}
                  onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                />
              </div>
              <button
                disabled={!query || matchIndices.length === 0}
                onClick={() => {
                  const targetIdx = matchIndices[clampedMatchIdx]
                  const msg = messages[targetIdx]
                  if (!msg) return
                  const re = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
                  updateMessage(msg.id, { text: msg.text.replace(re, replaceQuery) })
                  setSearchMatchIdx(0)
                }}
                style={{
                  padding: '8px 14px', borderRadius: 9, border: '1px solid #E2E8F0',
                  background: query && matchIndices.length ? '#fff' : '#F8FAFC',
                  color: query && matchIndices.length ? '#64748B' : '#CBD5E1',
                  fontSize: 12, fontWeight: 600, cursor: query && matchIndices.length ? 'pointer' : 'not-allowed',
                  flexShrink: 0, transition: 'all 0.15s',
                }}
              >
                Replace
              </button>
              <button
                disabled={!query || matchIndices.length === 0}
                onClick={() => { replaceInMessages(query, replaceQuery); setSearchQuery(''); setReplaceQuery(''); setReplaceMode(false) }}
                style={{
                  padding: '8px 14px', borderRadius: 9, border: 'none',
                  background: query && matchIndices.length ? 'linear-gradient(135deg, #7C3AED, #6D28D9)' : '#E2E8F0',
                  color: '#fff', fontSize: 12, fontWeight: 600,
                  cursor: query && matchIndices.length ? 'pointer' : 'not-allowed',
                  flexShrink: 0, transition: 'all 0.15s',
                }}
              >
                Replace All ({matchIndices.length})
              </button>
            </div>
          )}
        </div>
      )}

      {messages.length === 0 ? (
        <div
          style={{
            background: '#fff', borderRadius: 16, padding: 48,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 12, border: '2px dashed #E2E8F0',
          }}
        >
          <div style={{ width: 56, height: 56, borderRadius: 14, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>No messages yet</p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              Add bot and user messages to build the conversation flow
            </p>
          </div>
          <AddButtons />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, index) => {
            const isMatch = query && matchIndices.includes(index)
            const isActiveMatch = query && matchIndices[clampedMatchIdx] === index
            const isDimmed = query && matchIndices.length > 0 && !isMatch

            return (
              <div key={msg.id}>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    opacity: dragIdx === index ? 0.4 : isDimmed ? 0.3 : 1,
                    outline: isActiveMatch
                      ? '2px solid #2563EB'
                      : isMatch
                      ? '2px solid #93C5FD'
                      : dragOverIdx === index && dragIdx !== index
                      ? '2px solid #2563EB'
                      : 'none',
                    borderRadius: 14,
                    transition: 'opacity 0.15s, outline 0.1s',
                    scrollMarginTop: 80,
                  }}
                  ref={isActiveMatch ? (el) => el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }) : null}
                >
                  <MessageCard
                    message={msg}
                    index={index}
                    scrollToId={scrollToId}
                    onScrolled={onScrolled}
                  />
                </div>
                {index < messages.length - 1 && <InsertGap afterIndex={index} />}
              </div>
            )
          })}
          <div style={{ marginTop: 8 }}>
            <AddButtons />
          </div>
        </div>
      )}

      {bulkModalOpen && (
        <BulkImportModal
          onClose={() => setBulkModalOpen(false)}
          onImport={bulkAddMessages}
        />
      )}
    </div>
  )
}
