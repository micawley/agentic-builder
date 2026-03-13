import { useState } from 'react'
import { useBuilder } from '../../../../store/BuilderContext'
import BadgesConfig from './BadgesConfig'

const inputStyle = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: 8,
  border: '1px solid #E2E8F0',
  fontSize: 13,
  color: '#1E293B',
  background: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
}

export default function CaseSearchConfig({ msgId, caseSearch }) {
  const { addCaseType, removeCaseType, updateCaseSearch } = useBuilder()
  const [typeInput, setTypeInput] = useState('')

  const handleAddType = () => {
    const val = typeInput.trim()
    if (!val) return
    addCaseType(msgId, val)
    setTypeInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddType()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: 8,
          background: caseSearch.isNew !== false ? '#EFF6FF' : '#F8FAFC',
          border: `1px solid ${caseSearch.isNew !== false ? '#BFDBFE' : '#E2E8F0'}`,
          transition: 'all 0.15s',
        }}
      >
        <input
          type="checkbox"
          checked={caseSearch.isNew !== false}
          onChange={(e) => updateCaseSearch(msgId, 'isNew', e.target.checked)}
          style={{ width: 15, height: 15, cursor: 'pointer', accentColor: '#2563EB' }}
        />
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>New Case Search</span>
          <p style={{ fontSize: 11, color: '#64748B', marginTop: 1 }}>
            {caseSearch.isNew !== false
              ? 'Animation will play when this message is reached'
              : 'Shows the end result without replaying the animation'}
          </p>
        </div>
      </label>

      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 6 }}>
          Top Badges (optional)
        </label>
        <BadgesConfig msgId={msgId} badges={caseSearch.badges || []} target="cs" />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 6 }}>
          Center Category Label
        </label>
        <input
          type="text"
          value={caseSearch.category}
          onChange={(e) => updateCaseSearch(msgId, 'category', e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          placeholder="e.g. Service"
        />
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 6 }}>
          Record Types
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
          {(caseSearch.types || []).map((type, idx) => (
            <span
              key={idx}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 10px',
                borderRadius: 20,
                background: '#DBEAFE',
                color: '#2563EB',
                fontSize: 12,
                fontWeight: 500,
              }}
            >
              {type}
              <button
                onClick={() => removeCaseType(msgId, idx)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#60A5FA',
                  display: 'flex',
                  alignItems: 'center',
                  padding: 0,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </button>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            type="text"
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ ...inputStyle, flex: 1 }}
            onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
            onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
            placeholder="Add type and press Enter"
          />
          <button
            onClick={handleAddType}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: 'none',
              background: '#2563EB',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: '#64748B', display: 'block', marginBottom: 6 }}>
          Match Result Label
        </label>
        <input
          type="text"
          value={caseSearch.match}
          onChange={(e) => updateCaseSearch(msgId, 'match', e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#2563EB')}
          onBlur={(e) => (e.target.style.borderColor = '#E2E8F0')}
          placeholder="e.g. Policy #A-7724"
        />
      </div>
    </div>
  )
}
