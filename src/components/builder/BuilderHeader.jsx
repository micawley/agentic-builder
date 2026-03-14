import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuilder } from '../../store/BuilderContext'

export default function BuilderHeader() {
  const { state, importConfig, undo, redo, canUndo, canRedo } = useBuilder()
  const navigate = useNavigate()
  const importRef = useRef(null)
  const [importError, setImportError] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Keyboard shortcuts: Ctrl/Cmd+Z = undo, Ctrl/Cmd+Shift+Z or Ctrl+Y = redo
  useEffect(() => {
    const handler = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (!mod) return
      if (e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (e.key === 'z' && e.shiftKey)  { e.preventDefault(); redo() }
      if (e.key === 'y')                 { e.preventDefault(); redo() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  const handleLaunch = () => {
    navigate('/demo', { state: { config: state } })
  }

  const handleExport = () => {
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `demo-config-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result)
        if (!parsed.branding || !Array.isArray(parsed.stages) || !Array.isArray(parsed.messages)) {
          throw new Error('Invalid config')
        }
        importConfig(parsed)
        setImportError(false)
      } catch {
        setImportError(true)
        setTimeout(() => setImportError(false), 3000)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const iconBtnStyle = (disabled) => ({
    width: 34,
    height: 34,
    borderRadius: 8,
    border: '1px solid #E2E8F0',
    background: disabled ? '#F8FAFC' : '#fff',
    color: disabled ? '#CBD5E1' : '#64748B',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
    flexShrink: 0,
  })

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        height: 64,
        boxShadow: '0 1px 3px rgba(0,0,0,.06)',
      }}
    >
      {/* Logo + title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1E293B', letterSpacing: '-0.3px' }}>
          DemoX Agentic Builder
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* Undo / Redo */}
        <div style={{ display: 'flex', gap: 4, marginRight: 4 }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            style={iconBtnStyle(!canUndo)}
            onMouseOver={(e) => { if (canUndo) e.currentTarget.style.borderColor = '#CBD5E1' }}
            onMouseOut={(e) => { if (canUndo) e.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 7h13a5 5 0 010 10H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M7 3L3 7l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Shift+Z)"
            style={iconBtnStyle(!canRedo)}
            onMouseOver={(e) => { if (canRedo) e.currentTarget.style.borderColor = '#CBD5E1' }}
            onMouseOut={(e) => { if (canRedo) e.currentTarget.style.borderColor = '#E2E8F0' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M21 7H8a5 5 0 000 10h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 3l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Shortcut reference */}
        <button
          onClick={() => setShowShortcuts(true)}
          title="Keyboard shortcuts"
          style={iconBtnStyle(false)}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#CBD5E1' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
            <path d="M12 17v-5M12 8v-.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#E2E8F0', marginRight: 4 }} />

        {/* Import */}
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImport} />
        <button
          onClick={() => importRef.current?.click()}
          title="Import a saved config JSON"
          style={{
            background: importError ? '#FEF2F2' : '#F8FAFC',
            color: importError ? '#EF4444' : '#64748B',
            border: `1px solid ${importError ? '#FECACA' : '#E2E8F0'}`,
            borderRadius: 9,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { if (!importError) e.currentTarget.style.borderColor = '#CBD5E1' }}
          onMouseOut={(e) => { if (!importError) e.currentTarget.style.borderColor = '#E2E8F0' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {importError ? 'Invalid file' : 'Import JSON'}
        </button>

        {/* Export */}
        <button
          onClick={handleExport}
          title="Download config as JSON"
          style={{
            background: '#F8FAFC',
            color: '#64748B',
            border: '1px solid #E2E8F0',
            borderRadius: 9,
            padding: '8px 14px',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            transition: 'all 0.15s',
          }}
          onMouseOver={(e) => { e.currentTarget.style.borderColor = '#CBD5E1' }}
          onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export JSON
        </button>

        {/* Launch */}
        <button
          onClick={handleLaunch}
          style={{
            background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 2px 8px rgba(37,99,235,0.35)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.4)'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(37,99,235,0.35)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 3l14 9-14 9V3z" fill="#fff" />
          </svg>
          Generate &amp; Launch Demo
        </button>
      </div>

      {/* Keyboard shortcuts modal */}
      {showShortcuts && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowShortcuts(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: '#fff', borderRadius: 18, width: 480, boxShadow: '0 20px 60px rgba(0,0,0,0.18)', overflow: 'hidden' }}
          >
            <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#1E293B' }}>Keyboard Shortcuts</h3>
              <button onClick={() => setShowShortcuts(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ padding: '16px 24px 24px', display: 'flex', gap: 24 }}>
              {[
                {
                  title: 'Builder',
                  rows: [
                    ['Ctrl / ⌘ + Z', 'Undo'],
                    ['Ctrl / ⌘ + Shift + Z', 'Redo'],
                    ['Ctrl / ⌘ + Y', 'Redo'],
                  ],
                },
                {
                  title: 'Demo playback',
                  rows: [
                    ['→ Arrow Right', 'Next message'],
                    ['← Arrow Left', 'Previous message'],
                    ['Space', 'Play / Pause'],
                    ['Click scene counter', 'Jump to scene'],
                  ],
                },
              ].map(({ title, rows }) => (
                <div key={title} style={{ flex: 1 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>{title}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {rows.map(([key, label]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                        <span style={{ fontSize: 12, color: '#64748B' }}>{label}</span>
                        <kbd style={{ fontSize: 11, background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: 6, padding: '3px 8px', color: '#475569', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>{key}</kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
