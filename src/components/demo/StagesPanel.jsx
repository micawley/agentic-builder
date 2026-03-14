import { useState, useEffect, useRef } from 'react'
import { StepTypeIcon } from '../../stepTypes'

const ARROW = 14

function getHeaderClip(idx, total) {
  const isFirst = idx === 0
  const isLast = idx === total - 1
  if (total === 1) return 'none'
  if (isFirst) return `polygon(0 0, calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%, 0 100%)`
  if (isLast)  return `polygon(0 0, 100% 0, 100% 100%, 0 100%, ${ARROW}px 50%)`
  return `polygon(0 0, calc(100% - ${ARROW}px) 0, 100% 50%, calc(100% - ${ARROW}px) 100%, 0 100%, ${ARROW}px 50%)`
}

export default function StagesPanel({ stages, activeStageId, activeStepId, completedSteps }) {
  const prevActiveKeyRef = useRef(null)
  const [flashKey, setFlashKey] = useState(null)
  const flashTimerRef = useRef(null)

  useEffect(() => {
    const newKey = activeStageId && activeStepId ? `${activeStageId}:${activeStepId}` : null
    const oldKey = prevActiveKeyRef.current
    prevActiveKeyRef.current = newKey

    // If the old active step is now in completedSteps, flash its checkmark
    if (oldKey && oldKey !== newKey && completedSteps?.has(oldKey)) {
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current)
      setFlashKey(oldKey)
      flashTimerRef.current = setTimeout(() => setFlashKey(null), 700)
    }

    return () => { if (flashTimerRef.current) clearTimeout(flashTimerRef.current) }
  }, [activeStageId, activeStepId, completedSteps])

  if (!stages || stages.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94A3B8', fontSize: 14 }}>
        No stages configured
      </div>
    )
  }

  const activeStageIdx = stages.findIndex(s => s.id === activeStageId)
  const focusIdx = Math.max(0, activeStageIdx)

  const getStepStatus = (stageId, stepId) => {
    const key = `${stageId}:${stepId}`
    if (completedSteps?.has(key)) return 'completed'
    if (stageId === activeStageId && stepId === activeStepId) return 'active'
    return 'pending'
  }

  return (
    <div style={{ width: '100%', height: '100%', overflow: 'visible', position: 'relative' }}>
      {stages.map((stage, idx) => {
        const dist = idx - focusIdx
        const offset = dist * 50
        const opacity = dist <= -3 ? 0 : dist === -2 ? 0.25 : dist === -1 ? 0.5 : dist === 0 ? 1 : dist === 1 ? 0.5 : dist === 2 ? 0.25 : 0
        const headerColor = stage.green ? '#1D8740' : dist > 0 ? '#3B82F6' : '#1E3A5F'
        const zIndex = stages.length - idx

        return (
          <div
            key={stage.id}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: `${offset}%`,
              width: '50%',
              paddingTop: 14,
              paddingBottom: 14,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              transition: 'left 0.45s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
              opacity,
              zIndex,
              pointerEvents: opacity === 0 ? 'none' : 'auto',
            }}
          >
            {/* Chevron stage header */}
            <div
              style={{
                background: headerColor,
                clipPath: getHeaderClip(idx, stages.length),
                padding: `11px 20px 11px ${idx === 0 ? 14 : ARROW + 16}px`,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                flexShrink: 0,
                transition: 'background 0.35s ease',
              }}
            >
              <GripDots color="rgba(255,255,255,0.35)" />
              <span
                style={{
                  flex: 1,
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                  lineHeight: 1.3,
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {stage.name}
              </span>
              <ThreeDots color="rgba(255,255,255,0.45)" />
            </div>

            {/* Steps */}
            {stage.steps.length > 0 && (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  padding: '6px 0',
                  margin: '0 8px',
                }}
              >
                {stage.steps.map((step) => {
                  const status = getStepStatus(stage.id, step.id)
                  const isActive = status === 'active'
                  const isCompleted = status === 'completed'
                  const stepKey = `${stage.id}:${step.id}`
                  const isFlashing = flashKey === stepKey

                  return (
                    <div
                      key={step.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '8px 12px',
                        background: isActive ? '#F5F3FF' : '#F5F5F5',
                        borderRadius: 6,
                        margin: 8,
                        borderLeft: `3px solid ${isActive ? '#A78BFA' : isCompleted && isFlashing ? '#22C55E' : 'transparent'}`,
                        transition: 'background 0.3s ease, border-left-color 0.3s ease',
                      }}
                    >
                      <GripDots color="#D1D5DB" />

                      {/* Step icon with completion badge */}
                      <div style={{ position: 'relative', flexShrink: 0 }}>
                        <StepTypeIcon typeId={step.stepType} size={32} />
                        {isCompleted && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: -1,
                              right: -1,
                              width: 13,
                              height: 13,
                              borderRadius: '50%',
                              background: '#22C55E',
                              border: '1.5px solid #fff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              animation: isFlashing ? 'checkmarkPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
                            }}
                          >
                            <svg width="7" height="7" viewBox="0 0 10 10" fill="none">
                              <path d="M2 5.2l2 2.2L8 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>

                      <span
                        style={{
                          flex: 1,
                          fontSize: 12,
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? '#1E1B4B' : isCompleted ? '#6B7280' : '#374151',
                          lineHeight: 1.3,
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.name}
                      </span>

                      <ThreeDots color="#CBD5E1" />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function GripDots({ color = '#CBD5E1' }) {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="2"  cy="2"  r="1.5" fill={color} />
      <circle cx="8"  cy="2"  r="1.5" fill={color} />
      <circle cx="2"  cy="7"  r="1.5" fill={color} />
      <circle cx="8"  cy="7"  r="1.5" fill={color} />
      <circle cx="2"  cy="12" r="1.5" fill={color} />
      <circle cx="8"  cy="12" r="1.5" fill={color} />
    </svg>
  )
}

function ThreeDots({ color = '#CBD5E1' }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="5"  r="1.8" fill={color} />
      <circle cx="12" cy="12" r="1.8" fill={color} />
      <circle cx="12" cy="19" r="1.8" fill={color} />
    </svg>
  )
}
