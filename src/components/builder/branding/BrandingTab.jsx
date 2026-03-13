import { useRef } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import LogoUpload from './LogoUpload'
import ColorPicker from './ColorPicker'

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #E2E8F0',
  fontSize: 14,
  color: '#1E293B',
  background: '#fff',
  outline: 'none',
  transition: 'border-color 0.15s',
  fontFamily: 'inherit',
}

const labelStyle = {
  fontSize: 13,
  fontWeight: 500,
  color: '#64748B',
  marginBottom: 6,
  display: 'block',
}

const VOICES = [
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah — soft, friendly (F)' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice — confident, professional (F)' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda — warm, natural (F)' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily — expressive, clear (F)' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica — conversational (F)' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric — professional, calm (M)' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian — deep, authoritative (M)' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam — warm, friendly (M)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel — rich, clear (M)' },
  { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill — mature, steady (M)' },
]

const selectStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: 10,
  border: '1px solid #E2E8F0',
  fontSize: 14,
  color: '#1E293B',
  background: '#fff',
  outline: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  appearance: 'auto',
}

export default function BrandingTab() {
  const { state, setBranding } = useBuilder()
  const { branding } = state
  const customerAvatarRef = useRef(null)

  const handleCustomerAvatar = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setBranding({ customerAvatar: ev.target.result })
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
            Brand Identity
          </h3>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Customize the visual identity of your demo
          </p>
        </div>

        <LogoUpload />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Bot Name <span style={{ color: '#94A3B8', fontWeight: 400 }}>(will be shown in header)</span></label>
            <input
              type="text"
              value={branding.botName}
              onChange={(e) => setBranding({ botName: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              placeholder="e.g. Customer Agent"
            />
          </div>
          <div>
            <label style={labelStyle}>Customer Name</label>
            <input
              type="text"
              value={branding.customerName}
              onChange={(e) => setBranding({ customerName: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              placeholder="e.g. Mr. Bishop"
            />
          </div>
        </div>

        {/* Demo Labels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>Demo Labels</p>

          <div>
            <label style={labelStyle}>Agent Workspace Title <span style={{ color: '#94A3B8', fontWeight: 400 }}>(leave blank to hide)</span></label>
            <input
              type="text"
              value={branding.workspaceTitle ?? 'Agent Workspace'}
              onChange={(e) => setBranding({ workspaceTitle: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              placeholder="e.g. Agent Workspace"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { key: 'showAgentNameInWorkspace', label: 'Show bot name below workspace title' },
              { key: 'showActivePill', label: 'Show "Active" pill' },
              { key: 'showSpeakingPill', label: 'Show chatbot speaking animation' },
            ].map(({ key, label }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#374151', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={branding[key] !== false}
                  onChange={(e) => setBranding({ [key]: e.target.checked })}
                  style={{ width: 14, height: 14, cursor: 'pointer', accentColor: '#2563EB' }}
                />
                {label}
              </label>
            ))}
          </div>

          {branding.showSpeakingPill !== false && (
            <div>
              <label style={labelStyle}>Chatbot Speaking Name <span style={{ color: '#94A3B8', fontWeight: 400 }}>(leave blank to use bot name)</span></label>
              <input
                type="text"
                value={branding.speakingPillLabel || ''}
                onChange={(e) => setBranding({ speakingPillLabel: e.target.value })}
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
                onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
                placeholder={branding.botName || 'Customer Agent'}
              />
            </div>
          )}
        </div>

        {/* Customer avatar upload */}
        <div>
          <label style={labelStyle}>Customer Avatar</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: branding.customerAvatar ? '#F8FAFC' : '#F1F5F9',
                border: branding.customerAvatar ? '2px solid #E2E8F0' : '2px dashed #CBD5E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              {branding.customerAvatar ? (
                <img src={branding.customerAvatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#94A3B8" strokeWidth="1.5" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={() => customerAvatarRef.current?.click()}
                style={{
                  padding: '7px 14px',
                  borderRadius: 8,
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#2563EB',
                }}
              >
                {branding.customerAvatar ? 'Replace' : 'Upload photo'}
              </button>
              {branding.customerAvatar && (
                <button
                  onClick={() => setBranding({ customerAvatar: null })}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    border: '1px solid #FECACA',
                    background: '#FEF2F2',
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    color: '#EF4444',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          <input ref={customerAvatarRef} type="file" accept="image/*" onChange={handleCustomerAvatar} style={{ display: 'none' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <ColorPicker
            label="Primary Color"
            colorKey="primaryColor"
            value={branding.primaryColor}
            onChange={(key, val) => setBranding({ [key]: val })}
          />
          <ColorPicker
            label="Accent Color"
            colorKey="accentColor"
            value={branding.accentColor}
            onChange={(key, val) => setBranding({ [key]: val })}
          />
        </div>
      </div>

      {/* ElevenLabs voice settings */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          marginTop: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>
            Voice Narration
          </h3>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Add an ElevenLabs API key to give each speaker a distinct AI voice
          </p>
        </div>

        <div>
          <label style={labelStyle}>ElevenLabs API Key</label>
          <input
            type="password"
            value={branding.elevenLabsApiKey || ''}
            onChange={(e) => setBranding({ elevenLabsApiKey: e.target.value })}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            placeholder="sk-..."
            autoComplete="off"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Bot Voice</label>
            <select
              value={branding.botVoiceId || '21m00Tcm4TlvDq8ikWAM'}
              onChange={(e) => setBranding({ botVoiceId: e.target.value })}
              style={selectStyle}
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Customer Voice</label>
            <select
              value={branding.customerVoiceId || 'TxGEqnHWrfWFTfGW9XjX'}
              onChange={(e) => setBranding({ customerVoiceId: e.target.value })}
              style={selectStyle}
            >
              {VOICES.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
