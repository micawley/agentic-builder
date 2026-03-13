import { useBuilder } from '../../../../store/BuilderContext'

export default function StagesStepsConfig({ msgId, panel }) {
  const { state, updateStageStep } = useBuilder()
  const { stages } = state

  const selectedStage = stages.find((s) => s.id === panel.stageId)

  const handleStageChange = (e) => {
    updateStageStep(msgId, e.target.value, '')
  }

  const handleStepChange = (e) => {
    updateStageStep(msgId, panel.stageId, e.target.value)
  }

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #E2E8F0',
    fontSize: 13,
    color: '#1E293B',
    background: '#fff',
    outline: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {stages.length === 0 ? (
        <p style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic' }}>
          No stages defined. Add stages in the Stages &amp; Steps tab.
        </p>
      ) : (
        <>
          <div>
            <label
              style={{ fontSize: 12, fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 6 }}
            >
              Active Stage
            </label>
            <select value={panel.stageId || ''} onChange={handleStageChange} style={selectStyle}>
              <option value="">Select a stage...</option>
              {stages.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              style={{ fontSize: 12, fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 6 }}
            >
              Active Step
            </label>
            <select
              value={panel.stepId || ''}
              onChange={handleStepChange}
              disabled={!panel.stageId}
              style={{ ...selectStyle, opacity: !panel.stageId ? 0.5 : 1, cursor: !panel.stageId ? 'not-allowed' : 'pointer' }}
            >
              <option value="">Select a step...</option>
              {(selectedStage?.steps || []).map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
    </div>
  )
}
