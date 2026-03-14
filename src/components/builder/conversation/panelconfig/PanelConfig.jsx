import { useBuilder } from '../../../../store/BuilderContext'
import BadgesConfig from './BadgesConfig'
import CaseSearchConfig from './CaseSearchConfig'
import StagesStepsConfig from './StagesStepsConfig'

const MODES = [
  { id: 'same',       label: 'Same as before' },
  { id: 'empty',      label: 'Empty' },
  { id: 'badges',     label: 'Chatbot Background Process Box' },
  { id: 'caseSearch', label: 'Case Search' },
  { id: 'stages',     label: 'Stages & Steps' },
]

// Shown when auto-sync is on — only overlay extras, stages are driven automatically
const OVERLAY_MODES = [
  { id: 'same',       label: 'None' },
  { id: 'badges',     label: 'Background Process Box' },
  { id: 'caseSearch', label: 'Case Search' },
]

export default function PanelConfig({ message, overlayMode = false }) {
  const { updatePanelMode, updateMessage } = useBuilder()
  const { panel, id } = message
  const modes = overlayMode ? OVERLAY_MODES : MODES
  const activeColor = overlayMode ? '#7C3AED' : '#2563EB'

  return (
    <div
      style={{
        marginTop: 12,
        padding: 14,
        borderRadius: 10,
        background: overlayMode ? '#F5F3FF' : '#F8FAFF',
        border: `1px solid ${overlayMode ? '#DDD6FE' : '#E8EFFE'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
        {overlayMode && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" stroke="#7C3AED" strokeWidth="2" />
            <rect x="7" y="7" width="10" height="10" rx="2" fill="#7C3AED" opacity="0.4" />
          </svg>
        )}
        <p style={{ fontSize: 12, fontWeight: 600, color: overlayMode ? '#7C3AED' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {overlayMode ? 'Panel Overlay' : 'Right Panel Visual'}
        </p>
      </div>
      {overlayMode && (
        <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 10, marginTop: -6 }}>
          Floats over the auto-synced stages panel
        </p>
      )}

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {modes.map((mode) => {
          const isActive = panel.mode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => updatePanelMode(id, mode.id)}
              style={{
                padding: '5px 12px',
                borderRadius: 20,
                border: `1px solid ${isActive ? activeColor : '#E2E8F0'}`,
                background: isActive ? activeColor : '#fff',
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

      {overlayMode && (panel.mode === 'badges' || panel.mode === 'caseSearch') && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, cursor: 'pointer', userSelect: 'none' }}>
          <input
            type="checkbox"
            checked={panel.hideStages === true}
            onChange={(e) => updateMessage(id, { panel: { ...panel, hideStages: e.target.checked } })}
            style={{ width: 13, height: 13, cursor: 'pointer', accentColor: '#7C3AED' }}
          />
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 500 }}>Hide stages while overlay is active</span>
        </label>
      )}

      {panel.mode === 'badges' && (
        <BadgesConfig msgId={id} badges={panel.badges || []} target="main" />
      )}

      {panel.mode === 'caseSearch' && (
        <CaseSearchConfig msgId={id} caseSearch={panel.caseSearch || { category: '', types: [], match: '', badges: [] }} />
      )}

      {!overlayMode && panel.mode === 'stages' && (
        <StagesStepsConfig msgId={id} panel={panel} />
      )}
    </div>
  )
}
