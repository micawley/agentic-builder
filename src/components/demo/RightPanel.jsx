import BadgesPanel from './BadgesPanel'
import CaseSearchPanel from './CaseSearchPanel'
import StagesPanel from './StagesPanel'

function getEffectivePanel(allMessages, currentScene) {
  // Walk back through messages[0..currentScene-1] to find last non-'same' panel
  for (let i = currentScene - 1; i >= 0; i--) {
    const msg = allMessages[i]
    if (msg && msg.panel && msg.panel.mode !== 'same') {
      return { panel: msg.panel, sourceIdx: i }
    }
  }
  return { panel: { mode: 'empty' }, sourceIdx: -1 }
}

function buildCompletedSteps(allMessages, currentScene) {
  const completed = new Set()
  for (let i = 0; i < currentScene - 1; i++) {
    const msg = allMessages[i]
    if (msg?.panel?.mode === 'stages' && msg.panel.stageId && msg.panel.stepId) {
      completed.add(`${msg.panel.stageId}:${msg.panel.stepId}`)
    }
  }
  return completed
}

export default function RightPanel({ panelConfig, stages, currentScene, allMessages }) {
  const { panel: effectivePanel, sourceIdx } =
    panelConfig && panelConfig.mode !== 'same'
      ? { panel: panelConfig, sourceIdx: currentScene - 1 }
      : getEffectivePanel(allMessages, currentScene)

  const completedSteps = buildCompletedSteps(allMessages, currentScene)

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {(!effectivePanel || effectivePanel.mode === 'empty') && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            flexDirection: 'column',
            gap: 12,
            color: '#94A3B8',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M7 12h10M7 8h10M7 16h6" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 13 }}>No panel content</span>
        </div>
      )}

      {effectivePanel?.mode === 'badges' && (
        <BadgesPanel badges={effectivePanel.badges} />
      )}

      {effectivePanel?.mode === 'caseSearch' && (
        <CaseSearchPanel
          key={`cs-${sourceIdx}`}
          caseSearch={effectivePanel.caseSearch}
          animate={effectivePanel.caseSearch?.isNew !== false}
        />
      )}

      {effectivePanel?.mode === 'stages' && (
        <StagesPanel
          key={`stages-${currentScene}`}
          stages={stages}
          activeStageId={effectivePanel.stageId}
          activeStepId={effectivePanel.stepId}
          completedSteps={completedSteps}
        />
      )}
    </div>
  )
}
