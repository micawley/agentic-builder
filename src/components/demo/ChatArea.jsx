import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatArea({ messages, animatingIdx, branding, onMessageClick, onBranchChoice, branchChoices = {}, topPad = 0, showBotTyping = false, disableAutoScroll = false }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!disableAutoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, animatingIdx, disableAutoScroll])

  const primary = branding?.primaryColor || '#2563EB'

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        paddingTop: topPad + 12,
        paddingBottom: 12,
        paddingLeft: 14,
        paddingRight: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {messages.map((msg, idx) => {
        if (msg.type === 'branch') {
          const isLast = idx === messages.length - 1
          const chosenId = branchChoices[msg.id]
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 4px', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: '#D97706', letterSpacing: '0.06em', textTransform: 'uppercase', paddingLeft: 2 }}>Choose a path</span>
              {(msg.options || []).map((opt) => {
                const isChosen = chosenId === opt.id
                const canClick = isLast && !chosenId && opt.targetId
                return (
                  <button
                    key={opt.id}
                    onClick={canClick ? () => onBranchChoice?.(msg.id, opt.id, opt.targetId) : undefined}
                    style={{
                      padding: '8px 16px',
                      borderRadius: 20,
                      border: `2px solid ${isChosen ? primary : '#E2E8F0'}`,
                      background: isChosen ? primary : '#fff',
                      color: isChosen ? '#fff' : canClick ? primary : '#94A3B8',
                      fontSize: 13, fontWeight: 600,
                      cursor: canClick ? 'pointer' : 'default',
                      transition: 'all 0.15s',
                      opacity: chosenId && !isChosen ? 0.45 : 1,
                    }}
                  >
                    {opt.label || 'Option'}
                    {isChosen && ' ✓'}
                  </button>
                )
              })}
            </div>
          )
        }

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            branding={branding}
            isNew={idx === messages.length - 1 && animatingIdx === -1}
            onClick={onMessageClick ? () => onMessageClick(msg.id) : undefined}
          />
        )
      })}

      {showBotTyping && <TypingIndicator branding={branding} />}

      <div ref={bottomRef} />
    </div>
  )
}
