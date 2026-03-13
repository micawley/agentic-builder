import { useBuilder } from '../../../../store/BuilderContext'
import BadgesConfig from './BadgesConfig'
import CaseSearchConfig from './CaseSearchConfig'
import StagesStepsConfig from './StagesStepsConfig'

const MODES = [
  { id: 'same', label: 'Same as before' },
  { id: 'empty', label: 'Empty' },
  { id: 'badges', label: 'Chatbot Background Process Box' },
  { id: 'caseSearch', label: 'Case Search' },
  { id: 'stages', label: 'Stages & Steps' },
]

export default function PanelConfig({ message }) {
  const { updatePanelMode } = useBuilder()
  const { panel, id } = message

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 10,
        background: '#F8FAFF',
        border: '1px solid #E8EFFE',
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Right Panel Visual
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {MODES.map((mode) => {
          const isActive = panel.mode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => updatePanelMode(id, mode.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                border: `1px solid ${isActive ? '#2563EB' : '#E2E8F0'}`,
                background: isActive ? '#2563EB' : '#fff',
                color: isActive ? '#fff' : '#64748B',
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {mode.label}
            </button>
          )
        })}
      </div>

      {panel.mode === 'badges' && (
        <BadgesConfig msgId={id} badges={panel.badges || []} target="main" />
      )}

      {panel.mode === 'caseSearch' && (
        <CaseSearchConfig msgId={id} caseSearch={panel.caseSearch || { category: '', types: [], match: '', badges: [] }} />
      )}

      {panel.mode === 'stages' && (
        <StagesStepsConfig msgId={id} panel={panel} />
      )}
    </div>
  )
}
