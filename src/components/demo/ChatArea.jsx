import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

export default function ChatArea({ messages, animatingIdx, branding, onMessageClick, topPad = 0, showBotTyping = false, disableAutoScroll = false }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!disableAutoScroll) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, animatingIdx, disableAutoScroll])

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
      {messages.map((msg, idx) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          branding={branding}
          isNew={idx === messages.length - 1 && animatingIdx === -1}
          onClick={onMessageClick ? () => onMessageClick(msg.id) : undefined}
        />
      ))}

      {showBotTyping && <TypingIndicator branding={branding} />}

      <div ref={bottomRef} />
    </div>
  )
}
