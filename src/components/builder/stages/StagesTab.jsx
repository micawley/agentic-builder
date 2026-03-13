import { useState } from 'react'
import { useBuilder } from '../../../store/BuilderContext'
import StageCard from './StageCard'
import StageImportModal from './StageImportModal'

export default function StagesTab() {
  const { state, addStage } = useBuilder()
  const { stages } = state
  const [showImport, setShowImport] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {showImport && <StageImportModal onClose={() => setShowImport(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>Stages & Steps</h3>
          <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            Define the workflow stages for your demo
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowImport(true)}
            style={{
              background: '#fff',
              color: '#7C3AED',
              border: '1.5px solid #DDD6FE',
              borderRadius: 10,
              padding: '9px 14px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              boxShadow: '0 1px 4px rgba(124,58,237,0.1)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#7C3AED" strokeWidth="2" />
              <path d="M8.5 13.5l2-2.5 2 2.5 2-3 2 3" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Import Screenshot
          </button>
          <button
            onClick={addStage}
            style={{
              background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 18px',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add Stage
          </button>
        </div>
      </div>

      {stages.length === 0 ? (
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontWeight: 600, color: '#1E293B', marginBottom: 4 }}>No stages yet</p>
            <p style={{ fontSize: 13, color: '#94A3B8' }}>
              Add a stage manually or import from a screenshot
            </p>
          </div>
          <button
            onClick={() => setShowImport(true)}
            style={{
              background: '#F5F3FF',
              color: '#7C3AED',
              border: '1.5px dashed #C4B5FD',
              borderRadius: 10,
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#7C3AED" strokeWidth="2" />
              <path d="M8.5 13.5l2-2.5 2 2.5 2-3 2 3" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Import from Screenshot
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stages.map((stage, index) => (
            <StageCard key={stage.id} stage={stage} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}