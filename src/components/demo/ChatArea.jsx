import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatArea({ messages, animatingIdx, branding, onMessageClick }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, animatingIdx])

  const showTyping =
    animatingIdx > -1 &&
    animatingIdx < messages.length + 1 &&
    messages[animatingIdx]?.type === 'bot'

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      {messages.map((msg, idx) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          branding={branding}
          isNew={idx === messages.length - 1 && animatingIdx === -1}
          onClick={onMessageClick ? () => onMessageClick(msg.id) : undefined}
        />
      ))}

      {showTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  )
}
