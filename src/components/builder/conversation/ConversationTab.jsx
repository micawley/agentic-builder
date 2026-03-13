import { useState } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import MessageCard from './MessageCard'

export default function ConversationTab({ scrollToId, onScrolled }) {
  const { state, addMessage, insertMessage, reorderMessages } = useBuilder()
  const { messages } = state

  const [dragIdx, setDragIdx] = useState(null)
  const [dragOverIdx, setDragOverIdx] = useState(null)

  const handleDragStart = (e, idx) => {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, idx) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (idx !== dragIdx) setDragOverIdx(idx)
  }

  const handleDrop = (e, idx) => {
    e.preventDefault()
    if (dragIdx !== null && dragIdx !== idx) reorderMessages(dragIdx, idx)
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const handleDragEnd = () => {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  const AddButtons = () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <button
        onClick={() => addMessage('bot')}
        style={{
          background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '9px 16px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        Bot Message
      </button>
      <button
        onClick={() => addMessage('user')}
        style={{
          background: 'linear-gradient(135deg, #7C3AED, #6D28D9)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '9px 16px',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          boxShadow: '0 2px 8px rgba(124,58,237,0.25)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        User Message
      </button>
    </div>
  )

  const InsertGap = ({ afterIndex }) => {
    const isDropTarget = dragIdx !== null && dragOverIdx === afterIndex + 1
    return (
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          gap: 6,
        }}
      >
        {isDropTarget && (
          <div style={{ position: 'absolute', left: 0, right: 0, height: 2, background: '#2563EB', borderRadius: 1 }} />
        )}
        <button
          onClick={() => insertMessage(afterIndex + 1, 'bot')}
          style={{
            background: '#EFF6FF',
            color: '#2563EB',
            border: '1.5px dashed #93C5FD',
            borderRadius: 8,
            padding: '4px 12px',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Insert Bot
        </button>
        <button
          onClick={() => insertMessage(afterIndex + 1, 'user')}
          style={{
            background: '#F5F3FF',
            color: '#7C3AED',
            border: '1.5px dashed #C4B5FD',
            borderRadius: 8,
            padding: '4px 12px',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#7C3AED" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Insert User
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>Conversation</h3>
        <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
          Build the message flow for your demo
        </p>
      </div>

      {messages.length === 0 ? (
        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 48,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            border: '2px dashed #E2E8F0',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>No messages yet</p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              Add bot and user messages to build the conversation flow
            </p>
          </div>
          <AddButtons />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {messages.map((msg, index) => (
            <div key={msg.id}>
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                style={{
                  opacity: dragIdx === index ? 0.4 : 1,
                  outline: dragOverIdx === index && dragIdx !== index ? '2px solid #2563EB' : 'none',
                  borderRadius: 14,
                  transition: 'opacity 0.15s, outline 0.1s',
                }}
              >
                <MessageCard
                  message={msg}
                  index={index}
                  scrollToId={scrollToId}
                  onScrolled={onScrolled}
                />
              </div>
              {index < messages.length - 1 && <InsertGap afterIndex={index} />}
            </div>
          ))}
          <div style={{ marginTop: 8 }}>
            <AddButtons />
          </div>
        </div>
      )}
    </div>
  )
}