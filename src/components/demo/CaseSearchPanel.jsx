import { useState, useEffect } from 'react'

const COLOR_MAP = {
  green: '#10B981',
  purple: '#7C3AED',
  blue: '#2563EB',
  orange: '#F59E0B',
  red: '#EF4444',
}

const PARTICLE_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315]

// Canvas constants
const CW = 380
const CH = 440
const CX = 190   // horizontal center
const CY = 200   // vertical center — scan icons above, record labels fan below
const ORBIT_R = 160
const DIAMOND = 136

// Scan icon positions ABOVE the diamond (shifted left 40px)
// Diamond top edge = CY - DIAMOND/2 = 200 - 68 = 132. Icon radius 34. Gap 5px → center at 132-5-34 = 93 → y = 93-CY = -107
const SCAN_POS = [
  { x: -130, y: -157 },
  { x:  -40, y: -157 },
  { x:   50, y: -157 },
]

// Animation timing (ms)
const SCAN_DELAY    = 420   // round start → first icon appears
const SCAN_INTERVAL = 310   // between icon appearances
const GREY_DELAY    = 290   // white → grey transition
const NODE_DELAY    = 360   // last grey → orbit node placed
const ROUND_GAP     = 260   // end of round → next round diamond update
const MATCH_DELAY   = 380   // after last round → show match

function BriefcaseIcon({ color = '#94A3B8', size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth="1.8" />
    </svg>
  )
}

export default function CaseSearchPanel({ caseSearch, animate = true }) {
  const [diamondVisible, setDiamondVisible] = useState(!animate)
  const [currentRound, setCurrentRound] = useState(0)
  // 'hidden' | 'white' | 'grey' | 'green'
  const [scanStates, setScanStates] = useState(['hidden', 'hidden', 'hidden'])
  const [placedNodes, setPlacedNodes] = useState(
    animate ? [] : (caseSearch?.types || []).map((_, i) => i)
  )
  const [showMatch, setShowMatch] = useState(!animate)
  const [particles, setParticles] = useState(false)

  useEffect(() => {
    if (!animate) return

    const types = caseSearch?.types || []

    setDiamondVisible(false)
    setCurrentRound(0)
    setScanStates(['hidden', 'hidden', 'hidden'])
    setPlacedNodes([])
    setShowMatch(false)
    setParticles(false)

    if (types.length === 0) {
      setTimeout(() => setShowMatch(true), 800)
      return
    }

    const timers = []
    let t = 0

    // Diamond appears
    t += 150
    timers.push(setTimeout(() => { setDiamondVisible(true); setParticles(true) }, t))
    timers.push(setTimeout(() => setParticles(false), t + 900))

    for (let i = 0; i < types.length; i++) {
      // From round 1 onward: update diamond to next type, reset scan icons
      if (i > 0) {
        t += ROUND_GAP
        const ri = i
        timers.push(setTimeout(() => {
          setCurrentRound(ri)
          setScanStates(['hidden', 'hidden', 'hidden'])
        }, t))
      }

      // 3 scan icons appear and transition
      for (let j = 0; j < 3; j++) {
        const appearT = t + SCAN_DELAY + j * SCAN_INTERVAL
        const greyT   = appearT + GREY_DELAY
        const isMatchIcon = i === types.length - 1 && j === 2
        const rj = j

        timers.push(setTimeout(() => {
          setScanStates(prev => { const n = [...prev]; n[rj] = 'white'; return n })
        }, appearT))

        timers.push(setTimeout(() => {
          setScanStates(prev => { const n = [...prev]; n[rj] = isMatchIcon ? 'green' : 'grey'; return n })
        }, greyT))
      }

      const lastGreyT = t + SCAN_DELAY + 2 * SCAN_INTERVAL + GREY_DELAY

      // Place orbit node for all but the last type
      if (i < types.length - 1) {
        const ri = i
        timers.push(setTimeout(() => {
          setPlacedNodes(prev => [...prev, ri])
        }, lastGreyT + NODE_DELAY))
      }

      t = lastGreyT + NODE_DELAY + 180
    }

    timers.push(setTimeout(() => setShowMatch(true), t + MATCH_DELAY))

    return () => timers.forEach(clearTimeout)
  }, [caseSearch, animate])

  const types  = caseSearch?.types  || []
  const badges = caseSearch?.badges || []
  const match  = caseSearch?.match  || 'Match Found'

  const orbitPositions = types.map((_, i) => {
    // Fan nodes across the lower semicircle (10° → 170°) — spread below the diamond
    const angle = (10 + (i / Math.max(types.length - 1, 1)) * 160) * (Math.PI / 180)
    return { x: Math.cos(angle) * ORBIT_R, y: Math.sin(angle) * ORBIT_R }
  })

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top badges */}
      {badges.length > 0 && diamondVisible && (
        <div
          style={{
            display: 'flex',
            gap: 8,
            marginBottom: 16,
            flexWrap: 'wrap',
            justifyContent: 'center',
            animation: 'fadeSlideUp 0.4s ease forwards',
          }}
        >
          {badges.map((b, i) => {
            const color = COLOR_MAP[b.color] || COLOR_MAP.blue
            return (
              <div
                key={i}
                style={{
                  padding: '5px 14px',
                  borderRadius: 20,
                  background: '#fff',
                  border: `1.5px solid ${color}30`,
                  fontSize: 12,
                  fontWeight: 600,
                  color,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: `0 2px 8px ${color}15`,
                }}
              >
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                {b.label}
              </div>
            )
          })}
        </div>
      )}

      {/* Graph area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {!showMatch ? (
          <div
            style={{
              width: CW,
              height: CH,
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* SVG: dotted lines from center to placed orbit nodes */}
            <svg
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
                zIndex: 1,
                pointerEvents: 'none',
              }}
              viewBox={`0 0 ${CW} ${CH}`}
            >
              {placedNodes.map(i => (
                <line
                  key={i}
                  x1={CX} y1={CY}
                  x2={CX + orbitPositions[i].x}
                  y2={CY + orbitPositions[i].y}
                  stroke="#1E3A8A"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  style={{ animation: 'fadeIn 0.35s ease forwards' }}
                />
              ))}
            </svg>

            {/* Central diamond */}
            {diamondVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: CY,
                  left: CX,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                }}
              >
                <div style={{ position: 'relative', width: DIAMOND, height: DIAMOND }}>
                  {/* Animated diamond shape */}
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                      boxShadow: '0 8px 32px rgba(37,99,235,0.45)',
                      animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards, circlePulse 2s ease-in-out 0.5s infinite',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      key={currentRound}
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: 'center',
                        lineHeight: 1.3,
                        maxWidth: 84,
                        userSelect: 'none',
                        animation: 'fadeIn 0.25s ease forwards',
                      }}
                    >
                      {types[currentRound]}
                    </span>
                  </div>

                  {/* Burst particles (outside clipPath so they're not clipped) */}
                  {particles &&
                    PARTICLE_ANGLES.map((angle, i) => {
                      const rad = (angle * Math.PI) / 180
                      return (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.85)',
                            '--dx': `${Math.cos(rad) * 80}px`,
                            '--dy': `${Math.sin(rad) * 80}px`,
                            animation: 'particleOut 0.7s ease forwards',
                            animationDelay: `${i * 0.05}s`,
                            zIndex: 5,
                          }}
                        />
                      )
                    })}
                </div>
              </div>
            )}

            {/* Placed orbit nodes */}
            {placedNodes.map(i => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: CY + orbitPositions[i].y,
                  left: CX + orbitPositions[i].x,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 3,
                }}
              >
                <div style={{ animation: 'scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.15s both' }}>
                  <div
                    style={{
                      padding: '7px 14px',
                      borderRadius: 20,
                      background: '#fff',
                      border: '1.5px solid #BFDBFE',
                      boxShadow: '0 2px 14px rgba(37,99,235,0.15)',
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#1D4ED8',
                      whiteSpace: 'nowrap',
                      maxWidth: 130,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      userSelect: 'none',
                    }}
                  >
                    {types[i]}
                  </div>
                </div>
              </div>
            ))}

            {/* Scan icons (appear below the diamond, one at a time) */}
            {SCAN_POS.map((pos, j) => {
              const state = scanStates[j]
              if (state === 'hidden') return null
              return (
                // Outer wrapper: keyed per round+icon so scaleIn replays each round
                <div
                  key={`scan-${j}-${currentRound}`}
                  style={{
                    position: 'absolute',
                    top: CY + pos.y,
                    left: CX + pos.x,
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    animation: 'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards',
                  }}
                >
                  {/* Inner: transitions colors */}
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: '50%',
                      background:
                        state === 'green' ? '#DCFCE7'
                        : state === 'grey'  ? '#EEF0F4'
                        : '#fff',
                      border: `2px solid ${
                        state === 'green' ? '#10B981'
                        : state === 'grey'  ? '#D1D5DB'
                        : '#E2E8F0'
                      }`,
                      boxShadow:
                        state === 'green'
                          ? '0 4px 16px rgba(16,185,129,0.25)'
                          : '0 2px 8px rgba(0,0,0,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
                    }}
                  >
                    <BriefcaseIcon
                      size={26}
                      color={
                        state === 'green' ? '#10B981'
                        : state === 'grey'  ? '#D1D5DB'
                        : '#94A3B8'
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Match found */
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              animation: 'scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards',
            }}
          >
            <div
              style={{
                width: 160,
                height: 160,
                borderRadius: '50%',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 32px rgba(16,185,129,0.2), 0 2px 8px rgba(0,0,0,0.1)',
                gap: 6,
              }}
            >
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2" />
                <path d="M8 12l3 3 5-5" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#64748B', textAlign: 'center', padding: '0 12px', lineHeight: 1.3 }}>
                {match}
              </span>
            </div>
            <div
              style={{
                padding: '5px 16px',
                borderRadius: 20,
                background: '#D1FAE5',
                color: '#059669',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.08em',
              }}
            >
              MATCH
            </div>
          </div>
        )}
      </div>
    </div>
  )
}