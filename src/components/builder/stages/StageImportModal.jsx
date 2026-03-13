import { useState, useRef } from 'react'
import { useBuilder } from '../../../store/BuilderContext'

const API_KEY_STORAGE = 'anthropicApiKey'

export default function StageImportModal({ onClose }) {
  const { importStages } = useBuilder()
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(API_KEY_STORAGE) || '')
  const [image, setImage] = useState(null) // { base64, mediaType, previewUrl }
  const [status, setStatus] = useState('idle') // idle | loading | error | done
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef(null)
  const dropRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target.result
      const base64 = dataUrl.split(',')[1]
      setImage({ base64, mediaType: file.type, previewUrl: dataUrl })
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }

  const handleImport = async () => {
    if (!image) return setErrorMsg('Please upload a screenshot first.')
    if (!apiKey.trim()) return setErrorMsg('Please enter your Anthropic API key.')
    setErrorMsg('')
    setStatus('loading')
    localStorage.setItem(API_KEY_STORAGE, apiKey.trim())

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey.trim(),
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-opus-4-6',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: image.mediaType, data: image.base64 },
              },
              {
                type: 'text',
                text: 'Extract all stages and their steps from this screenshot. Return ONLY a valid JSON array with no explanation, markdown, or code fences. Each object must have a "name" string and a "steps" array of objects each with a "name" string. Example: [{"name":"Intake","steps":[{"name":"Collect info"},{"name":"Verify ID"}]}]',
              },
            ],
          }],
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err?.error?.message || `API error ${res.status}`)
      }

      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const jsonMatch = text.match(/\[[\s\S]*\]/)
      if (!jsonMatch) throw new Error('Could not find JSON in response.')
      const stages = JSON.parse(jsonMatch[0])
      if (!Array.isArray(stages)) throw new Error('Response was not a JSON array.')

      importStages(stages)
      setStatus('done')
      setTimeout(onClose, 800)
    } catch (e) {
      setStatus('error')
      setErrorMsg(e.message || 'Something went wrong.')
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 480,
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.2)',
          zIndex: 201,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: 15, color: '#1E293B' }}>Import from Screenshot</p>
            <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>Claude will extract stages & steps from your image</p>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div style={{ padding: '20px 24px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Image drop zone */}
          <div
            ref={dropRef}
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: image ? '2px solid #BFDBFE' : '2px dashed #CBD5E1',
              borderRadius: 14,
              background: image ? '#F0F7FF' : '#FAFBFF',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: image ? 'auto' : 140,
              overflow: 'hidden',
              transition: 'all 0.15s',
            }}
          >
            {image ? (
              <div style={{ position: 'relative', width: '100%' }}>
                <img src={image.previewUrl} alt="preview" style={{ width: '100%', maxHeight: 220, objectFit: 'contain', display: 'block' }} />
                <button
                  onClick={(e) => { e.stopPropagation(); setImage(null) }}
                  style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E0EAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M4 16l4-4 4 4 4-6 4 6" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#2563EB" strokeWidth="1.8" />
                  </svg>
                </div>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#1E293B' }}>Drop screenshot here</p>
                <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>or click to browse</p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFile(e.target.files[0])} />

          {/* API Key */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#64748B', display: 'block', marginBottom: 6 }}>Anthropic API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 13, color: '#1E293B', outline: 'none', fontFamily: 'inherit', background: '#FAFBFF', boxSizing: 'border-box' }}
              onFocus={(e) => e.target.style.borderColor = '#2563EB'}
              onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
            />
            <p style={{ fontSize: 11, color: '#94A3B8', marginTop: 5 }}>Saved locally in your browser. Never sent anywhere except Anthropic.</p>
          </div>

          {/* Error */}
          {errorMsg && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#DC2626' }}>
              {errorMsg}
            </div>
          )}

          {/* Footer buttons */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={onClose} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid #E2E8F0', background: '#fff', fontSize: 13, fontWeight: 600, color: '#64748B', cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={status === 'loading' || status === 'done'}
              style={{
                padding: '10px 20px',
                borderRadius: 10,
                border: 'none',
                background: status === 'done' ? '#10B981' : 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: status === 'loading' || status === 'done' ? 'default' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                transition: 'background 0.2s',
              }}
            >
              {status === 'loading' ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  Analyzing…
                </>
              ) : status === 'done' ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Imported!
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 16l4-4 4 4 4-6 4 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Import Stages
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </>
  )
}