const TABS = [
  { id: 'branding', label: 'Branding' },
  { id: 'stages', label: 'Stages & Steps' },
  { id: 'conversation', label: 'Conversation' },
]

export default function TabNav({ activeTab, onTabChange }) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 4,
        padding: '6px',
        background: '#EFF4FB',
        borderRadius: 14,
        width: 'fit-content',
        margin: '0 auto 24px',
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '8px 20px',
              borderRadius: 10,
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
              color: isActive ? '#2563EB' : '#64748B',
              background: isActive ? '#fff' : 'transparent',
              boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
