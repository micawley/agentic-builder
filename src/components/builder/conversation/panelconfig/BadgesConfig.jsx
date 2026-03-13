import { useBuilder } from '../../../../store/BuilderContext'

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', hex: '#2563EB' },
  { value: 'green', label: 'Green', hex: '#10B981' },
  { value: 'purple', label: 'Purple', hex: '#7C3AED' },
  { value: 'orange', label: 'Orange', hex: '#F59E0B' },
  { value: 'red', label: 'Red', hex: '#EF4444' },
]

export default function BadgesConfig({ msgId, badges, target }) {
  const { addBadge, removeBadge, updateBadge } = useBuilder()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {badges.map((badge, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            background: '#F8FAFF',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: COLOR_OPTIONS.find((c) => c.value === badge.color)?.hex || '#2563EB',
              flexShrink: 0,
            }}
          />
          <input
            type="text"
            value={badge.label}
            onChange={(e) => updateBadge(msgId, target, idx, 'label', e.target.value)}
            style={{
              flex: 1,
              padding: '5px 8px',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
              fontSize: 12,
              background: '#fff',
              outline: 'none',
              fontFamily: 'inherit',
              color: '#1E293B',
            }}
            placeholder="Badge label"
          />
          <select
            value={badge.color}
            onChange={(e) => updateBadge(msgId, target, idx, 'color', e.target.value)}
            style={{
              padding: '5px 8px',
              borderRadius: 6,
              border: '1px solid #E2E8F0',
              fontSize: 12,
              background: '#fff',
              color: '#1E293B',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => removeBadge(msgId, target, idx)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 6,
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
      <button
        onClick={() => addBadge(msgId, target)}
        style={{
          padding: '7px 14px',
          borderRadius: 8,
          border: '1px dashed #CBD5E1',
          background: 'transparent',
          fontSize: 12,
          fontWeight: 500,
          color: '#64748B',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          alignSelf: 'flex-start',
          transition: 'all 0.15s',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#2563EB'
          e.currentTarget.style.color = '#2563EB'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#CBD5E1'
          e.currentTarget.style.color = '#64748B'
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Add Badge
      </button>
    </div>
  )
}
