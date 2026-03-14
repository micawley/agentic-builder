import { useState, useEffect, useRef } from 'react'
import BadgesPanel from './BadgesPanel'
import CaseSearchPanel from './CaseSearchPanel'
import StagesPanel from './StagesPanel'

function getEffectivePanel(allMessages, currentScene) {
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

function panelKey(panel) {
  if (!panel || panel.mode === 'empty') return 'empty'
  return panel.mode
}

export default function RightPanel({ panelConfig, stages, currentScene, allMessages, completedSteps: completedStepsProp, extrasPanel }) {
  const { panel: effectivePanel, sourceIdx } =
    panelConfig && panelConfig.mode !== 'same'
      ? { panel: panelConfig, sourceIdx: currentScene - 1 }
      : getEffectivePanel(allMessages, currentScene)

  const completedSteps = completedStepsProp ?? buildCompletedSteps(allMessages, currentScene)

  const currentKey = panelKey(effectivePanel)
  const prevKeyRef = useRef(currentKey)
  const prevPanelRef = useRef(effectivePanel)
  const [exitPanel, setExitPanel] = useState(null)
  const exitTimerRef = useRef(null)

  useEffect(() => {
    if (prevKeyRef.current !== currentKey) {
      // Snapshot the outgoing panel and trigger exit animation
      const outgoing = prevPanelRef.current
      if (outgoing && outgoing.mode !== 'same') {
        if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
        setExitPanel({ panel: outgoing, id: prevKeyRef.current })
        exitTimerRef.current = setTimeout(() => setExitPanel(null), 350)
      }
      prevKeyRef.current = currentKey
      prevPanelRef.current = effectivePanel
    }
  }, [currentKey, effectivePanel])

  useEffect(() => () => { if (exitTimerRef.current) clearTimeout(exitTimerRef.current) }, [])

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'visible',
        position: 'relative',
      }}
    >
      {/* Exiting panel — plays exit animation then unmounts */}
      {exitPanel && (
        <div
          key={`exit-${exitPanel.id}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 5,
            animation: 'panelExit 0.32s ease forwards',
            pointerEvents: 'none',
          }}
        >
          <PanelContent panel={exitPanel.panel} stages={stages} activeStageId={null} activeStepId={null} completedSteps={completedSteps} currentScene={currentScene} sourceIdx={-1} />
        </div>
      )}

      {/* Active panel — plays enter animation on key change */}
      <div
        key={`panel-${currentKey}`}
        style={{
          position: 'absolute',
          inset: 0,
          animation: 'panelEnter 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        }}
      >
        <PanelContent
          panel={effectivePanel}
          stages={stages}
          activeStageId={effectivePanel?.mode === 'stages' ? effectivePanel.stageId : null}
          activeStepId={effectivePanel?.mode === 'stages' ? effectivePanel.stepId : null}
          completedSteps={completedSteps}
          currentScene={currentScene}
          sourceIdx={sourceIdx}
          extrasPanel={extrasPanel}
        />
      </div>
    </div>
  )
}

function PanelContent({ panel, stages, activeStageId, activeStepId, completedSteps, currentScene, sourceIdx, extrasPanel }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      {(!panel || panel.mode === 'empty') && (
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

      {panel?.mode === 'badges' && (
        <BadgesPanel badges={panel.badges} />
      )}

      {panel?.mode === 'caseSearch' && (
        <CaseSearchPanel
          key={`cs-${sourceIdx}`}
          caseSearch={panel.caseSearch}
          animate={panel.caseSearch?.isNew !== false}
        />
      )}

      {panel?.mode === 'stages' && !extrasPanel?.hideStages && (
        <StagesPanel
          key={`stages-${currentScene}`}
          stages={stages}
          activeStageId={activeStageId}
          activeStepId={activeStepId}
          completedSteps={completedSteps}
        />
      )}

      {/* Overlay — floats over (or replaces) the stages panel when auto-sync is on */}
      {extrasPanel && (
        <div
          key={`overlay-${currentScene}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 10,
            borderRadius: 16,
            background: extrasPanel.hideStages ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.55)',
            backdropFilter: extrasPanel.hideStages ? 'none' : 'blur(10px)',
            WebkitBackdropFilter: extrasPanel.hideStages ? 'none' : 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
            animation: 'overlayFadeIn 0.3s ease',
          }}
        >
          {extrasPanel.mode === 'badges' && (
            <BadgesPanel badges={extrasPanel.badges} />
          )}
          {extrasPanel.mode === 'caseSearch' && (
            <CaseSearchPanel
              key={`overlay-cs-${currentScene}`}
              caseSearch={extrasPanel.caseSearch}
              animate={extrasPanel.caseSearch?.isNew !== false}
            />
          )}
        </div>
      )}
    </div>
  )
}
