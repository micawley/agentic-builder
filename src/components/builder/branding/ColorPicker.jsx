import { useRef } from 'react'

export default function ColorPicker({ label, colorKey, value, onChange }) {
  const inputRef = useRef(null)

  const handleHexChange = (e) => {
    const val = e.target.value
    if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
      onChange(colorKey, val)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: '#64748B' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => inputRef.current?.click()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            border: '2px solid #E2E8F0',
            background: value,
            cursor: 'pointer',
            flexShrink: 0,
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
            transition: 'transform 0.1s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(colorKey, e.target.value)}
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
        />
        <input
          type="text"
          value={value}
          onChange={handleHexChange}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            fontSize: 13,
            fontFamily: 'monospace',
            color: '#1E293B',
            background: '#fff',
            outline: 'none',
          }}
        />
      </div>
    </div>
  )
}
