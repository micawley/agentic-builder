import { useBuilder } from '../../../store/BuilderContext'
import { STEP_TYPES, StepTypeIcon } from '../../../stepTypes'

export default function StepRow({ stageId, step }) {
  const { removeStep, updateStepName, updateStepType } = useBuilder()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 0',
      }}
    >
      <StepTypeIcon typeId={step.stepType} size={22} />

      <input
        type="text"
        value={step.name}
        onChange={(e) => updateStepName(stageId, step.id, e.target.value)}
        style={{
          flex: 1,
          padding: '7px 10px',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          fontSize: 13,
          color: '#1E293B',
          background: '#FAFBFF',
          outline: 'none',
          fontFamily: 'inherit',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
        onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
        placeholder="Step name"
      />

      <select
        value={step.stepType ?? 'collect_information'}
        onChange={(e) => updateStepType(stageId, step.id, e.target.value)}
        style={{
          padding: '7px 6px',
          borderRadius: 8,
          border: '1px solid #E2E8F0',
          fontSize: 11,
          color: '#64748B',
          background: '#FAFBFF',
          outline: 'none',
          fontFamily: 'inherit',
          cursor: 'pointer',
          maxWidth: 130,
        }}
      >
        {STEP_TYPES.map((t) => (
          <option key={t.id} value={t.id}>{t.label}</option>
        ))}
      </select>

      <button
        onClick={() => removeStep(stageId, step.id)}
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}