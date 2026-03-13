export const STEP_TYPES = [
  { id: 'collect_information', label: 'Collect information', bg: '#377D3A', iconColor: '#fff' },
  { id: 'approve_reject',      label: 'Approve/Reject',      bg: '#3B6BD4', iconColor: '#fff' },
  { id: 'automation',          label: 'Automation',          bg: '#D4A520', iconColor: '#5C3B00' },
  { id: 'create_case',         label: 'Create case',         bg: '#D4A520', iconColor: '#5C3B00' },
  { id: 'decision',            label: 'Decision',            bg: '#E05720', iconColor: '#fff' },
  { id: 'generate_document',   label: 'Generate document',   bg: '#D4A520', iconColor: '#5C3B00' },
  { id: 'ai_agent',            label: 'AI Agent',            bg: '#7C3AED', iconColor: '#fff' },
  { id: 'robotic_automation',  label: 'Robotic automation',  bg: '#D4A520', iconColor: '#5C3B00' },
  { id: 'send_notification',   label: 'Send notification',   bg: '#D4A520', iconColor: '#5C3B00' },
]

export const STEP_TYPE_MAP = Object.fromEntries(STEP_TYPES.map(t => [t.id, t]))

export function getStepType(id) {
  return STEP_TYPE_MAP[id] ?? STEP_TYPES[0]
}

export function StepTypeIcon({ typeId, size = 32 }) {
  const type = getStepType(typeId)
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.25),
        background: type.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <StepIcon typeId={typeId} color={type.iconColor} bgColor={type.bg} size={Math.round(size * 0.58)} />
    </div>
  )
}

function StepIcon({ typeId, color, bgColor, size }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none' }
  switch (typeId) {
    case 'collect_information':
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="3.5" fill={color} />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={color} />
        </svg>
      )
    case 'approve_reject':
      return (
        <svg {...p}>
          <path d="M4 12l5 5 11-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'automation':
      return (
        <svg {...p}>
          <path
            fill={color}
            d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46a.49.49 0 00-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.49.49 0 00-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.98s.03.66.07.98L2.46 14.59c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.61zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"
          />
          <path d="M10.5 10.5v3l3-1.5z" fill={bgColor} />
        </svg>
      )
    case 'create_case':
      return (
        <svg {...p}>
          <rect x="2" y="7" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
          <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" stroke={color} strokeWidth="2" />
        </svg>
      )
    case 'decision':
      return (
        <svg {...p}>
          <path d="M12 2l10 10-10 10L2 12z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </svg>
      )
    case 'generate_document':
      return (
        <svg {...p}>
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke={color} strokeWidth="2" />
          <path d="M14 2v6h6" stroke={color} strokeWidth="2" strokeLinejoin="round" />
          <line x1="8" y1="13" x2="16" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="8" y1="17" x2="13" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'ai_agent':
      return (
        <svg {...p}>
          <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" fill={color} />
          <path d="M19 14l.8 2.2 2.2.8-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z" fill={color} />
          <path d="M5 16l.5 1.5 1.5.5-1.5.5L5 20l-.5-1.5L3 18l1.5-.5z" fill={color} />
        </svg>
      )
    case 'robotic_automation':
      return (
        <svg {...p}>
          <rect x="5" y="8" width="14" height="11" rx="2" stroke={color} strokeWidth="2" />
          <circle cx="9" cy="13" r="1.5" fill={color} />
          <circle cx="15" cy="13" r="1.5" fill={color} />
          <line x1="9" y1="17" x2="15" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="4" x2="12" y2="8" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="3.5" r="1.5" fill={color} />
          <line x1="3" y1="13" x2="5" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
          <line x1="19" y1="13" x2="21" y2="13" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'send_notification':
      return (
        <svg {...p}>
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 01-3.46 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="8" r="3.5" fill={color} />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={color} />
        </svg>
      )
  }
}