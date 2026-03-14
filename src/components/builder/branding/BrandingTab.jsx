import { useRef, useState } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import LogoUpload from './LogoUpload'
import ColorPicker from './ColorPicker'

function VoicePreviewButton({ voiceId, apiKey }) {
  const [loading, setLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(null)
  const cacheRef = useRef({})

  const SAMPLE = 'Hello! I am ready to assist you with your request today.'

  const handlePlay = async () => {
    if (!apiKey) return
    if (playing) {
      audioRef.current?.pause()
      setPlaying(false)
      return
    }
    if (cacheRef.current[voiceId]) {
      const audio = new Audio(cacheRef.current[voiceId])
      audioRef.current = audio
      audio.onended = () => setPlaying(false)
      audio.play()
      setPlaying(true)
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: SAMPLE, model_id: 'eleven_multilingual_v2' }),
      })
      if (!res.ok) return
      const url = URL.createObjectURL(await res.blob())
      cacheRef.current[voiceId] = url
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => setPlaying(false)
      audio.play()
      setPlaying(true)
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }

  const disabled = !apiKey
  return (
    <button
      onClick={handlePlay}
      disabled={disabled}
      title={disabled ? 'Add an ElevenLabs API key to preview voices' : playing ? 'Stop preview' : 'Preview voice'}
      style={{
        width: 32, height: 32, borderRadius: 8, border: '1px solid #E2E8F0',
        background: playing ? '#EFF6FF' : '#fff',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: disabled ? '#CBD5E1' : playing ? '#2563EB' : '#64748B',
        flexShrink: 0, transition: 'all 0.15s',
      }}
    >
      {loading ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="28 56" />
        </svg>
      ) : playing ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 4l14 8-14 8V4z" />
        </svg>
      )}
    </button>
  )
}

function SplashLogoUpload({ value, onChange, onClear }) {
  const ref = useRef(null)
  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 12,
        background: value ? '#F8FAFC' : '#F1F5F9',
        border: value ? '2px solid #E2E8F0' : '2px dashed #CBD5E1',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {value ? (
          <img src={value} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#94A3B8" strokeWidth="1.5" />
            <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => ref.current?.click()} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #E2E8F0', background: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#2563EB' }}>
          {value ? 'Replace' : 'Upload logo'}
        </button>
        {value && (
          <button onClick={onClear} style={{ padding: '7px 14px', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', fontSize: 12, fontWeight: 500, cursor: 'pointer', color: '#EF4444' }}>
            Remove
          </button>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </div>
  )
}

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
  const { state, setBranding, savePreset, loadPreset, deletePreset } = useBuilder()
  const { branding, presets = [] } = state
  const customerAvatarRef = useRef(null)
  const [presetName, setPresetName] = useState('')
  const [showPresetInput, setShowPresetInput] = useState(false)

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

        {/* Shell picker */}
        <div>
          <label style={labelStyle}>Chat Shell</label>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              {
                value: 'phone',
                label: 'Phone',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="7" y="2" width="10" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                    <circle cx="12" cy="18.5" r="1" fill="currentColor" />
                    <line x1="10" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
              },
              {
                value: 'container',
                label: 'Container',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                    <path d="M3 9h18" stroke="currentColor" strokeWidth="1.5" />
                    <rect x="6" y="13" width="7" height="3" rx="1" fill="currentColor" opacity="0.3" />
                    <rect x="6" y="11.5" width="4" height="1" rx="0.5" fill="currentColor" opacity="0.5" />
                  </svg>
                ),
              },
              {
                value: 'webchat',
                label: 'Webchat',
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
                    <rect x="2" y="3" width="20" height="5" rx="2.5" fill="currentColor" opacity="0.15" />
                    <rect x="4" y="11" width="8" height="2" rx="1" fill="currentColor" opacity="0.3" />
                    <path d="M8 21h8M12 18v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                ),
              },
            ].map(({ value, label, icon }) => {
              const active = (branding.shell || 'phone') === value
              return (
                <button
                  key={value}
                  onClick={() => setBranding({ shell: value })}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: 10,
                    border: active ? '2px solid #2563EB' : '2px solid #E2E8F0',
                    background: active ? '#EFF6FF' : '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 6,
                    color: active ? '#2563EB' : '#64748B',
                    transition: 'all 0.15s',
                  }}
                >
                  {icon}
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Phone input style — only when phone shell is selected */}
        {(branding.shell || 'phone') === 'phone' && (
          <div>
            <label style={labelStyle}>Phone Input Style</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                {
                  value: 'voice',
                  label: 'Voice Bars',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="3"  y="12" width="2" height="8" rx="1" fill="currentColor" opacity="0.4" />
                      <rect x="7"  y="8"  width="2" height="12" rx="1" fill="currentColor" opacity="0.6" />
                      <rect x="11" y="5"  width="2" height="15" rx="1" fill="currentColor" />
                      <rect x="15" y="8"  width="2" height="12" rx="1" fill="currentColor" opacity="0.6" />
                      <rect x="19" y="12" width="2" height="8" rx="1" fill="currentColor" opacity="0.4" />
                    </svg>
                  ),
                },
                {
                  value: 'voicetotext',
                  label: 'Voice to Text',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="7" width="20" height="10" rx="5" stroke="currentColor" strokeWidth="1.6" />
                      <circle cx="18" cy="12" r="3" fill="currentColor" opacity="0.3" />
                      <path d="M6 12h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  ),
                },
                {
                  value: 'text',
                  label: 'Text',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="6" width="20" height="12" rx="3" stroke="currentColor" strokeWidth="1.6" />
                      <path d="M6 12h5M15 9v6M13 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                },
              ].map(({ value, label, icon }) => {
                const active = (branding.phoneInputStyle || 'voice') === value
                return (
                  <button
                    key={value}
                    onClick={() => setBranding({ phoneInputStyle: value })}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      borderRadius: 10,
                      border: active ? '2px solid #2563EB' : '2px solid #E2E8F0',
                      background: active ? '#EFF6FF' : '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      color: active ? '#2563EB' : '#64748B',
                      transition: 'all 0.15s',
                    }}
                  >
                    {icon}
                    <span style={{ fontSize: 11, fontWeight: 600 }}>{label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

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

      {/* Splash screen settings */}
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
            Intro Screen
          </h3>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Shown on the phone before the conversation starts
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              type="text"
              value={branding.splashTitle ?? 'Agentic AI'}
              onChange={(e) => setBranding({ splashTitle: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              placeholder="e.g. Agentic AI"
            />
          </div>
          <div>
            <label style={labelStyle}>Subtitle</label>
            <input
              type="text"
              value={branding.splashSubtitle ?? 'Powered by Pega'}
              onChange={(e) => setBranding({ splashSubtitle: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              placeholder="e.g. Powered by Pega"
            />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Intro Logo <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional — shown below subtitle)</span></label>
          <SplashLogoUpload
            value={branding.splashLogo}
            onChange={(val) => setBranding({ splashLogo: val })}
            onClear={() => setBranding({ splashLogo: null })}
          />
        </div>

        {(branding.shell || 'phone') === 'webchat' && (
          <div>
            <label style={labelStyle}>"Powered by" label <span style={{ color: '#94A3B8', fontWeight: 400 }}>(shown in webchat footer)</span></label>
            <input
              type="text"
              value={branding.poweredByLabel ?? 'PEGA'}
              onChange={(e) => setBranding({ poweredByLabel: e.target.value })}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
              placeholder="e.g. PEGA"
            />
          </div>
        )}
      </div>

      {/* Demo Appearance */}
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
            Demo Appearance
          </h3>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>
            Customize the demo stage background and shell theme
          </p>
        </div>

        {/* Demo background */}
        <div>
          <label style={labelStyle}>Demo Background</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
            {[
              { label: 'Default', value: null },
              { label: 'Slate', value: '#1E293B' },
              { label: 'Navy', value: '#0F2044' },
              { label: 'White', value: '#FFFFFF' },
              { label: 'Sand', value: '#FAF7F2' },
              { label: 'Forest', value: '#0D2B1E' },
              { label: 'Plum', value: '#1E0A2E' },
              { label: 'Blush', value: '#FDF2F8' },
            ].map(({ label, value }) => {
              const active = (branding.demoBackground ?? null) === value
              return (
                <button
                  key={label}
                  onClick={() => setBranding({ demoBackground: value })}
                  title={label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                    border: active ? '2px solid #2563EB' : '2px solid #E2E8F0',
                    background: active ? '#EFF6FF' : '#fff',
                    fontSize: 12, fontWeight: active ? 600 : 400,
                    color: active ? '#2563EB' : '#64748B',
                    transition: 'all 0.15s',
                  }}
                >
                  {value ? (
                    <span style={{ width: 14, height: 14, borderRadius: 3, background: value, border: '1px solid rgba(0,0,0,0.1)', display: 'inline-block', flexShrink: 0 }} />
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M12 3a9 9 0 100 18A9 9 0 0012 3z" stroke="#94A3B8" strokeWidth="1.5" />
                      <path d="M12 3v18M3 12h18" stroke="#94A3B8" strokeWidth="1" strokeDasharray="2 2" />
                    </svg>
                  )}
                  {label}
                </button>
              )
            })}
          </div>
          {/* Animated backgrounds */}
          {[
            { label: 'Aurora', value: 'anim:aurora', from: '#0D4D2F', to: '#0F3460' },
            { label: 'Sunset', value: 'anim:sunset', from: '#7c1d6f', to: '#c0392b' },
            { label: 'Midnight', value: 'anim:midnight', from: '#020c1b', to: '#172a45' },
            { label: 'Cosmos', value: 'anim:cosmos', from: '#0f0c29', to: '#302b63' },
          ].map(({ label, value, from, to }) => {
            const active = (branding.demoBackground ?? null) === value
            return (
              <button
                key={label}
                onClick={() => setBranding({ demoBackground: value })}
                title={label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '7px 12px', borderRadius: 8, cursor: 'pointer',
                  border: active ? '2px solid #2563EB' : '2px solid #E2E8F0',
                  background: active ? '#EFF6FF' : '#fff',
                  fontSize: 12, fontWeight: active ? 600 : 400,
                  color: active ? '#2563EB' : '#64748B',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  width: 14, height: 14, borderRadius: 3, flexShrink: 0, display: 'inline-block',
                  background: `linear-gradient(135deg, ${from}, ${to})`,
                  border: '1px solid rgba(0,0,0,0.1)',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <span style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)',
                    animation: 'bgAurora 2s ease infinite',
                  }} />
                </span>
                {label} ✦
              </button>
            )
          })}

          {/* Custom color picker row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ ...labelStyle, margin: 0, flexShrink: 0 }}>Custom</label>
            <input
              type="color"
              value={branding.demoBackground || '#E8EEF7'}
              onChange={(e) => setBranding({ demoBackground: e.target.value })}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid #E2E8F0', cursor: 'pointer', padding: 2 }}
            />
            {branding.demoBackground && (
              <button
                onClick={() => setBranding({ demoBackground: null })}
                style={{ fontSize: 12, color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}
              >
                Reset to default
              </button>
            )}
          </div>
        </div>

        {/* Playback speed */}
        <div>
          <label style={labelStyle}>Auto-play Speed</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ v: 0.5, l: '0.5×' }, { v: 0.75, l: '0.75×' }, { v: 1, l: '1×' }, { v: 1.5, l: '1.5×' }, { v: 2, l: '2×' }].map(({ v, l }) => {
              const active = (branding.playbackSpeed || 1) === v
              return (
                <button key={v} onClick={() => setBranding({ playbackSpeed: v })} style={{ flex: 1, padding: '8px 4px', borderRadius: 8, border: `1.5px solid ${active ? '#2563EB' : '#E2E8F0'}`, background: active ? '#EFF6FF' : '#fff', color: active ? '#2563EB' : '#64748B', fontSize: 12, fontWeight: active ? 700 : 400, cursor: 'pointer', transition: 'all 0.15s' }}>
                  {l}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dark shell */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: branding.darkShell ? '#0F172A' : '#F8FAFC', borderRadius: 12, border: `1px solid ${branding.darkShell ? '#334155' : '#E2E8F0'}`, transition: 'all 0.3s ease' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: branding.darkShell ? '#E2E8F0' : '#1E293B' }}>Dark shell</p>
            <p style={{ fontSize: 11, color: branding.darkShell ? '#64748B' : '#94A3B8', marginTop: 1 }}>Dark background for the chat interface</p>
          </div>
          <button
            onClick={() => setBranding({ darkShell: !branding.darkShell })}
            style={{
              width: 44, height: 24, borderRadius: 12, border: 'none',
              background: branding.darkShell ? '#2563EB' : '#E2E8F0',
              cursor: 'pointer', position: 'relative', flexShrink: 0,
              transition: 'background 0.2s ease',
            }}
          >
            <div style={{
              position: 'absolute', top: 2,
              left: branding.darkShell ? 22 : 2,
              width: 20, height: 20, borderRadius: '50%',
              background: '#fff', transition: 'left 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            }} />
          </button>
        </div>
      </div>

      {/* Branding Presets */}
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
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginBottom: 4 }}>Branding Presets</h3>
          <p style={{ fontSize: 13, color: '#94A3B8' }}>Save and restore complete branding configurations</p>
        </div>

        {presets.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {presets.map((p) => (
              <div
                key={p.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 10px 6px 14px',
                  borderRadius: 20,
                  border: '1.5px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: 12, fontWeight: 500, color: '#1E293B',
                }}
              >
                <span
                  onClick={() => loadPreset(p.branding)}
                  style={{ cursor: 'pointer' }}
                  title="Load preset"
                >
                  {p.name}
                </span>
                <button
                  onClick={() => loadPreset(p.branding)}
                  title="Load"
                  style={{
                    padding: '2px 8px', borderRadius: 10, border: '1px solid #BFDBFE',
                    background: '#EFF6FF', color: '#2563EB', fontSize: 11, fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Load
                </button>
                <button
                  onClick={() => deletePreset(p.id)}
                  title="Delete preset"
                  style={{
                    width: 18, height: 18, borderRadius: '50%', border: 'none',
                    background: 'transparent', cursor: 'pointer', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#CBD5E1',
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#EF4444' }}
                  onMouseOut={(e) => { e.currentTarget.style.color = '#CBD5E1' }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {showPresetInput ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && presetName.trim()) { savePreset(presetName.trim()); setPresetName(''); setShowPresetInput(false) }
                if (e.key === 'Escape') { setPresetName(''); setShowPresetInput(false) }
              }}
              placeholder="Preset name…"
              autoFocus
              style={{ ...inputStyle, flex: 1, padding: '8px 12px', fontSize: 13 }}
              onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
              onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            />
            <button
              onClick={() => {
                if (presetName.trim()) { savePreset(presetName.trim()); setPresetName(''); setShowPresetInput(false) }
              }}
              style={{
                padding: '8px 16px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Save
            </button>
            <button
              onClick={() => { setPresetName(''); setShowPresetInput(false) }}
              style={{
                padding: '8px 12px', borderRadius: 10, border: '1px solid #E2E8F0',
                background: '#fff', color: '#64748B', fontSize: 13, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowPresetInput(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 16px', borderRadius: 10,
              border: '1.5px dashed #CBD5E1',
              background: '#F8FAFC', color: '#64748B',
              fontSize: 13, fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.15s', alignSelf: 'flex-start',
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563EB'; e.currentTarget.style.color = '#2563EB' }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#64748B' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Save current as preset
          </button>
        )}
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
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={branding.botVoiceId || '21m00Tcm4TlvDq8ikWAM'}
                onChange={(e) => setBranding({ botVoiceId: e.target.value })}
                style={{ ...selectStyle, flex: 1 }}
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <VoicePreviewButton voiceId={branding.botVoiceId || '21m00Tcm4TlvDq8ikWAM'} apiKey={branding.elevenLabsApiKey} />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Customer Voice</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select
                value={branding.customerVoiceId || 'TxGEqnHWrfWFTfGW9XjX'}
                onChange={(e) => setBranding({ customerVoiceId: e.target.value })}
                style={{ ...selectStyle, flex: 1 }}
              >
                {VOICES.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <VoicePreviewButton voiceId={branding.customerVoiceId || 'TxGEqnHWrfWFTfGW9XjX'} apiKey={branding.elevenLabsApiKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
