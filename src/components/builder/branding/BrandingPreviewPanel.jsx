import { useMemo } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import PhoneMockup from '../../demo/PhoneMockup'
import ContainerShell from '../../demo/ContainerShell'
import WebchatShell from '../../demo/WebchatShell'

const SAMPLE_MESSAGES = [
  { id: 'sp1', type: 'bot',  text: 'Hi! How can I help you today?', speak: false },
  { id: 'sp2', type: 'user', text: 'I need help with my account.' },
  { id: 'sp3', type: 'bot',  text: "Of course! I'd be happy to assist you with that.", speak: false },
]

// Shell natural widths (used to compute zoom scale)
const SHELL_DIMS = {
  phone:     { w: 300 },
  container: { w: 360 },
  webchat:   { w: 360 },
}

// Panel inner width after 20px padding each side
const PANEL_W = 280

export default function BrandingPreviewPanel({ activeTab = 'branding' }) {
  const { state } = useBuilder()
  const { branding, messages, stages } = state
  const shell = branding.shell || 'phone'

  const previewMessages = useMemo(() => {
    if (activeTab === 'conversation' && messages.length >= 1) return messages.slice(0, 5)
    if (messages.length >= 2) return messages.slice(0, 3)
    return SAMPLE_MESSAGES
  }, [messages, activeTab])

  const sharedProps = {
    branding,
    messages: previewMessages,
    animatingIdx: previewMessages.length - 1,
    botSpeaking: false,
    userSpeaking: false,
    isPlaying: false,
    onMessageClick: () => {},
    showBotTyping: false,
    disableAutoScroll: true,
  }

  const { w: shellW } = SHELL_DIMS[shell] || SHELL_DIMS.phone
  const scale = PANEL_W / shellW

  const footerNote =
    activeTab === 'conversation' && messages.length >= 1
      ? `Showing ${Math.min(messages.length, 5)} of ${messages.length} messages`
      : messages.length >= 2
      ? 'Showing your first messages'
      : 'Showing sample messages'

  const contextLabel = {
    branding: 'Branding',
    stages: stages.length > 0 ? `${stages.length} stage${stages.length !== 1 ? 's' : ''}` : 'Stages',
    conversation: messages.length > 0 ? `${messages.length} msg` : 'Conversation',
  }[activeTab] ?? shell

  return (
    <div
      style={{
        width: 320,
        flexShrink: 0,
        position: 'sticky',
        top: 88,
        alignSelf: 'flex-start',
      }}
    >
      {/* Panel card */}
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 12px rgba(0,0,0,.06)',
          overflow: 'hidden',
        }}
      >
        {/* Panel header */}
        <div
          style={{
            padding: '14px 20px',
            borderBottom: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div
            style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#22C55E', boxShadow: '0 0 0 2px rgba(34,197,94,0.25)',
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#64748B', letterSpacing: 0.3 }}>
            LIVE PREVIEW
          </span>
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#CBD5E1', fontWeight: 500, textTransform: 'capitalize' }}>
            {contextLabel}
          </span>
        </div>

        {/* Shell preview */}
        <div
          style={{
            padding: '20px',
            background: '#F0F4FA',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div style={{ zoom: scale, pointerEvents: 'none', userSelect: 'none', flexShrink: 0 }}>
            {shell === 'phone'     && <PhoneMockup     {...sharedProps} />}
            {shell === 'container' && <ContainerShell  {...sharedProps} />}
            {shell === 'webchat'   && <WebchatShell    {...sharedProps} />}
          </div>
        </div>

        {/* Footer note */}
        <div
          style={{
            padding: '10px 16px',
            borderTop: '1px solid #F1F5F9',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#94A3B8" strokeWidth="1.8" />
            <path d="M12 8v4M12 16h.01" stroke="#94A3B8" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>{footerNote}</span>
        </div>
      </div>
    </div>
  )
}
