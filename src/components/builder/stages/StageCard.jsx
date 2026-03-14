import { useBuilder } from '../../../store/BuilderContext'
import StepRow from './StepRow'

export default function StageCard({ stage, index }) {
  const { removeStage, updateStageName, updateStage, addStep } = useBuilder()

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 14,
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,.05)',
      }}
    >
      {/* Stage header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          background: '#F8FAFF',
          borderBottom: stage.steps.length > 0 ? '1px solid #E2E8F0' : 'none',
        }}
      >
        {/* Drag handle */}
        <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ flexShrink: 0, opacity: 0.3, cursor: 'grab' }}>
          <circle cx="2"  cy="2"  r="1.5" fill="#64748B" />
          <circle cx="8"  cy="2"  r="1.5" fill="#64748B" />
          <circle cx="2"  cy="7"  r="1.5" fill="#64748B" />
          <circle cx="8"  cy="7"  r="1.5" fill="#64748B" />
          <circle cx="2"  cy="12" r="1.5" fill="#64748B" />
          <circle cx="8"  cy="12" r="1.5" fill="#64748B" />
        </svg>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {index + 1}
        </div>
        <input
          type="text"
          value={stage.name}
          onChange={(e) => updateStageName(stage.id, e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #E2E8F0',
            fontSize: 14,
            fontWeight: 600,
            color: '#1E293B',
            background: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          placeholder="Stage name"
        />
        <button
          onClick={() => removeStage(stage.id)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
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
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

      {/* Green stage toggle */}
      <div style={{ padding: '8px 16px', borderBottom: stage.steps.length > 0 ? '1px solid #E2E8F0' : 'none', background: '#FAFBFF' }}>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 12, color: stage.green ? '#1D8740' : '#64748B', fontWeight: 500, userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={!!stage.green}
            onChange={(e) => updateStage(stage.id, { green: e.target.checked })}
            style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#1D8740' }}
          />
          Green stage
        </label>
      </div>

      {/* Steps */}
      {stage.steps.length > 0 && (
        <div style={{ padding: '8px 16px' }}>
          {stage.steps.map((step) => (
            <StepRow key={step.id} stageId={stage.id} step={step} />
          ))}
        </div>
      )}

      {/* Add step */}
      <div style={{ padding: '10px 16px', borderTop: stage.steps.length > 0 ? '1px solid #F1F5F9' : 'none' }}>
        <button
          onClick={() => addStep(stage.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 0',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Add step
        </button>
      </div>
    </div>
  )
}
