import { useRef } from 'react'
import { useBuilder } from '../../../store/BuilderContext'

export default function LogoUpload() {
  const { state, setLogo, setBranding } = useBuilder()
  const fileRef = useRef(null)
  const logo = state.branding.logo

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setLogo(ev.target.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>Logo</label>
      <div
        onClick={() => !logo && fileRef.current?.click()}
        style={{
          border: logo ? '2px solid #E2E8F0' : '2px dashed #CBD5E1',
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 10,
          cursor: logo ? 'default' : 'pointer',
          background: logo ? '#FAFBFF' : '#F8FAFF',
          minHeight: 120,
          transition: 'all 0.15s',
        }}
        onMouseOver={(e) => {
          if (!logo) e.currentTarget.style.background = '#EFF4FF'
        }}
        onMouseOut={(e) => {
          if (!logo) e.currentTarget.style.background = '#F8FAFF'
        }}
      >
        {logo ? (
          <>
            <img
              src={logo}
              alt="Logo preview"
              style={{ maxHeight: 72, maxWidth: 180, objectFit: 'contain', borderRadius: 6 }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
                  border: '1px solid #E2E8F0',
                  background: '#fff',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer',
                  color: '#2563EB',
                }}
              >
                Replace
              </button>
              <button
                onClick={() => setBranding({ logo: null })}
                style={{
                  padding: '6px 14px',
                  borderRadius: 7,
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
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: '#DBEAFE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="3" stroke="#2563EB" strokeWidth="1.5" />
                <circle cx="8.5" cy="8.5" r="1.5" fill="#2563EB" />
                <path d="M3 15l5-5 4 4 3-3 6 6" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#2563EB' }}>Click to upload logo</p>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>PNG, JPG, SVG up to 2MB</p>
            </div>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
    </div>
  )
}
