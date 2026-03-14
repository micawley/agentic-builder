import { useEffect, useRef, useState } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import PanelConfig from './panelconfig/PanelConfig'

export default function MessageCard({ message, index, scrollToId, onScrolled }) {
  const { state, removeMessage, updateMessage, duplicateMessage } = useBuilder()
  const isBranch = message.type === 'branch'
  const isBot = message.type === 'bot'
  const cardRef = useRef(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    if (scrollToId === message.id && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      onScrolled?.()
    }
  }, [scrollToId, message.id, onScrolled])

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,.05)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          background: isBot ? '#F0F7FF' : '#F5F3FF',
          borderBottom: '1px solid #E2E8F0',
          cursor: 'grab',
        }}
      >
        {/* Drag handle */}
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
          <circle cx="2"  cy="2"  r="1.5" fill="#64748B" />
          <circle cx="8"  cy="2"  r="1.5" fill="#64748B" />
          <circle cx="2"  cy="7"  r="1.5" fill="#64748B" />
          <circle cx="8"  cy="7"  r="1.5" fill="#64748B" />
          <circle cx="2"  cy="12" r="1.5" fill="#64748B" />
          <circle cx="8"  cy="12" r="1.5" fill="#64748B" />
        </svg>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#94A3B8',
            background: '#E2E8F0',
            padding: '2px 8px',
            borderRadius: 20,
          }}
        >
          #{index + 1}
        </span>

        <div
          style={{
            display: 'flex',
            background: '#fff',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
        >
          {['bot', 'user', 'branch'].map((type) => {
            const isActive = message.type === type
            const color = type === 'bot' ? '#2563EB' : type === 'user' ? '#7C3AED' : '#D97706'
            return (
              <button
                key={type}
                onClick={() => updateMessage(message.id, type === 'branch'
                  ? { type, options: message.options || [{ id: `opt_${Date.now()}a`, label: 'Option A', targetId: '' }, { id: `opt_${Date.now()}b`, label: 'Option B', targetId: '' }] }
                  : { type }
                )}
                style={{
                  padding: '5px 14px',
                  border: 'none',
                  background: isActive ? color : 'transparent',
                  color: isActive ? '#fff' : '#94A3B8',
                  fontSize: 12,
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  textTransform: 'capitalize',
                }}
              >
                {type === 'branch' ? '⑂ Branch' : type}
              </button>
            )
          })}
        </div>

        <div style={{ flex: 1 }} />

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
          style={{
            width: 28, height: 28, borderRadius: 7, border: 'none',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#CBD5E1', transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            style={{ transform: collapsed ? 'rotate(-90deg)' : 'none', transition: 'transform 0.2s ease' }}>
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Duplicate */}
        <button
          onClick={() => duplicateMessage(message.id)}
          title="Duplicate message"
          style={{
            width: 28, height: 28, borderRadius: 7, border: 'none',
            background: 'transparent', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#CBD5E1', transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B' }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#CBD5E1' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <rect x="8" y="8" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 8V5a2 2 0 00-2-2H5a2 2 0 00-2 2v9a2 2 0 002 2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <button
          onClick={() => removeMessage(message.id)}
          style={{
            width: 28,
            height: 28,
            borderRadius: 7,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#CBD5E1',
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#FEF2F2'
            e.currentTarget.style.color = '#EF4444'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#CBD5E1'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Collapsed preview */}
      {collapsed && message.text && (
        <div style={{ padding: '8px 16px', borderTop: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 12, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {message.text}
          </p>
        </div>
      )}

      {/* Branch body */}
      {!collapsed && isBranch && (
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            Viewer picks one — demo jumps to the target message.
          </p>
          {(message.options || []).map((opt, oi) => (
            <div key={opt.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D97706', background: '#FEF3C7', borderRadius: 6, padding: '3px 8px', flexShrink: 0 }}>
                {String.fromCharCode(65 + oi)}
              </span>
              <input
                type="text"
                value={opt.label}
                onChange={(e) => {
                  const opts = message.options.map((o) => o.id === opt.id ? { ...o, label: e.target.value } : o)
                  updateMessage(message.id, { options: opts })
                }}
                placeholder="Option label…"
                style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 12, color: '#1E293B', outline: 'none', fontFamily: 'inherit' }}
                onFocus={(e) => (e.target.style.borderColor = '#D97706')}
                onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              />
              <select
                value={opt.targetId}
                onChange={(e) => {
                  const opts = message.options.map((o) => o.id === opt.id ? { ...o, targetId: e.target.value } : o)
                  updateMessage(message.id, { options: opts })
                }}
                style={{ padding: '7px 8px', borderRadius: 8, border: '1px solid #E2E8F0', fontSize: 11, color: '#475569', outline: 'none', cursor: 'pointer', background: '#fff', maxWidth: 130 }}
              >
                <option value="">→ nowhere</option>
                {state.messages.filter((m) => m.id !== message.id).map((m) => (
                  <option key={m.id} value={m.id}>
                    → #{state.messages.indexOf(m) + 1} {m.type === 'branch' ? '(branch)' : (m.text?.slice(0, 20) || `(${m.type})`)}
                  </option>
                ))}
              </select>
              {message.options.length > 2 && (
                <button
                  onClick={() => updateMessage(message.id, { options: message.options.filter((o) => o.id !== opt.id) })}
                  style={{ width: 22, height: 22, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', color: '#CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#EF4444' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#CBD5E1' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
                </button>
              )}
            </div>
          ))}
          {(message.options || []).length < 5 && (
            <button
              onClick={() => updateMessage(message.id, { options: [...(message.options || []), { id: `opt_${Date.now()}`, label: `Option ${String.fromCharCode(65 + (message.options || []).length)}`, targetId: '' }] })}
              style={{ alignSelf: 'flex-start', fontSize: 12, fontWeight: 500, color: '#D97706', background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0', display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /></svg>
              Add option
            </button>
          )}
        </div>
      )}

      {/* Body */}
      {!collapsed && !isBranch && (
      <div style={{ padding: '14px 16px' }}>
        <textarea
          value={message.text}
          onChange={(e) => updateMessage(message.id, { text: e.target.value })}
          placeholder={isBot ? 'Bot message text…' : 'User message text…'}
          rows={3}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: 10,
            border: '1px solid #E2E8F0',
            fontSize: 13,
            color: '#1E293B',
            background: '#FAFBFF',
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.6,
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        />

        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 10,
            cursor: 'pointer',
            fontSize: 12,
            color: message.speak !== false ? '#2563EB' : '#94A3B8',
            fontWeight: 500,
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={message.speak !== false}
            onChange={(e) => updateMessage(message.id, { speak: e.target.checked })}
            style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#2563EB' }}
          />
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {message.speak !== false && (
              <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
          Read aloud
        </label>

        {!state.branding.autoSyncStages && <PanelConfig message={message} />}
        {state.branding.autoSyncStages && <PanelConfig message={message} overlayMode={true} />}
        {state.branding.autoSyncStages && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, padding: '10px 12px', background: message.advanceStep ? '#EFF6FF' : '#F8FAFF', borderRadius: 10, border: `1px solid ${message.advanceStep ? '#BFDBFE' : '#E2E8F0'}`, transition: 'all 0.2s ease' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: message.advanceStep ? '#1D4ED8' : '#64748B' }}>Advance step</p>
              <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Mark previous step complete after this message</p>
            </div>
            <button
              onClick={() => updateMessage(message.id, { advanceStep: !message.advanceStep })}
              style={{
                width: 40, height: 22, borderRadius: 11, border: 'none',
                background: message.advanceStep ? '#2563EB' : '#E2E8F0',
                cursor: 'pointer', position: 'relative', flexShrink: 0,
                transition: 'background 0.2s ease',
              }}
            >
              <div style={{
                position: 'absolute', top: 2,
                left: message.advanceStep ? 20 : 2,
                width: 18, height: 18, borderRadius: '50%',
                background: '#fff', transition: 'left 0.2s ease',
                boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
              }} />
            </button>
          </div>
        )}
      </div>
      )}
    </div>
  )
}
