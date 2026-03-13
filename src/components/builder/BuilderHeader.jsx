import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBuilder } from '../../store/BuilderContext'

export default function BuilderHeader() {
  const { state, importConfig } = useBuilder()
  const navigate = useNavigate()
  const importRef = useRef(null)
  const [importError, setImportError] = useState(false)

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
        // Basic validation
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
    // Reset so the same file can be re-imported if needed
    e.target.value = ''
  }

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
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

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
    </header>
  )
}
