import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PhoneMockup from '../components/demo/PhoneMockup'
import RightPanel from '../components/demo/RightPanel'
import DemoNavBar from '../components/demo/DemoNavBar'
import DemoSidebar from '../components/demo/DemoSidebar'
import { useBuilder } from '../store/BuilderContext'

export default function DemoPage() {
  const { state: config } = useBuilder()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrollToId, setScrollToId] = useState(null)
  const error = config.messages.length === 0 && config.stages.length === 0
  const [currentScene, setCurrentScene] = useState(0)
  const [animatingIdx, setAnimatingIdx] = useState(-1)
  const [botSpeaking, setBotSpeaking] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const timerRef = useRef(null)
  const botSpeakTimerRef = useRef(null)
  const botSpeakPollRef = useRef(null)
  const autoPlayTimerRef = useRef(null)
  const audioRef = useRef(null)
  const audioCacheRef = useRef(new Map())
  const audioEndedRef = useRef(true)

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  const playMessage = useCallback(async (msg, branding) => {
    audioEndedRef.current = false
    if (!msg?.text || msg.speak === false) { audioEndedRef.current = true; return }
    const apiKey = branding?.elevenLabsApiKey
    if (!apiKey) { audioEndedRef.current = true; return }
    const voiceId = msg.type === 'bot'
      ? (branding.botVoiceId || 'cjVigY5qzO86Huf0OWal')
      : (branding.customerVoiceId || 'EXAVITQu4vr4xnSDxMaL')
    stopAudio()
    const onEnd = () => { audioEndedRef.current = true }
    const cacheKey = msg.id
    if (audioCacheRef.current.has(cacheKey)) {
      const audio = new Audio(audioCacheRef.current.get(cacheKey))
      audioRef.current = audio
      audio.addEventListener('ended', onEnd)
      audio.play()
      return
    }
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.text, model_id: 'eleven_multilingual_v2' }),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => res.status)
        console.error('[ElevenLabs] TTS error', res.status, errText)
        audioEndedRef.current = true
        return
      }
      const url = URL.createObjectURL(await res.blob())
      audioCacheRef.current.set(cacheKey, url)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.addEventListener('ended', onEnd)
      audio.play()
    } catch (e) { console.error('[ElevenLabs] fetch error', e); audioEndedRef.current = true }
  }, [stopAudio])

  const messages = useMemo(() => config?.messages || [], [config])
  const total = messages.length

  const shownMessages = messages.slice(0, currentScene)

  const currentPanel =
    currentScene > 0 ? messages[currentScene - 1]?.panel : { mode: 'empty' }

  const goReset = useCallback(() => {
    if (autoPlayTimerRef.current) { clearTimeout(autoPlayTimerRef.current); autoPlayTimerRef.current = null }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    setAnimatingIdx(-1)
    setIsPlaying(false)
    stopAudio()
    audioEndedRef.current = true
    setBotSpeaking(false)
    setCurrentScene(0)
  }, [stopAudio])

  const goNext = useCallback(() => {
    if (currentScene >= total) return
    if (timerRef.current) return // animation in progress

    // Clear bot speaking indicator immediately on every advance
    if (botSpeakTimerRef.current) clearTimeout(botSpeakTimerRef.current)
    setBotSpeaking(false)

    const nextMsg = messages[currentScene]
    const nextIdx = currentScene

    if (nextMsg?.type === 'bot') {
      audioEndedRef.current = false
      setAnimatingIdx(nextIdx)
      timerRef.current = setTimeout(() => {
        setAnimatingIdx(-1)
        setCurrentScene((s) => s + 1)
        timerRef.current = null
      }, 1200)
    } else {
      setCurrentScene((s) => s + 1)
    }
  }, [currentScene, total, messages, setBotSpeaking])

  const goPrev = useCallback(() => {
    if (currentScene === 0) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      setAnimatingIdx(-1)
    }
    stopAudio()
    setCurrentScene((s) => s - 1)
  }, [currentScene, stopAudio])

  useEffect(() => {
    if (currentScene === 0 || !messages.length || !config) return
    const msg = messages[currentScene - 1]
    playMessage(msg, config.branding)
  }, [currentScene, config, messages, playMessage])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  // Clamp currentScene if messages are removed via sidebar
  useEffect(() => {
    setCurrentScene(s => Math.min(s, messages.length))
  }, [messages.length])

  // Set botSpeaking true when bot animation starts; timer fallback for click-through
  useEffect(() => {
    if (animatingIdx < 0) return
    if (botSpeakTimerRef.current) clearTimeout(botSpeakTimerRef.current)
    setBotSpeaking(true)
    if (!isPlaying) {
      botSpeakTimerRef.current = setTimeout(() => setBotSpeaking(false), 10000)
    }
  }, [animatingIdx, isPlaying])

  // In auto-play: keep botSpeaking alive until audio finishes, then turn off
  useEffect(() => {
    if (!botSpeaking || !isPlaying) return
    if (botSpeakPollRef.current) clearInterval(botSpeakPollRef.current)
    botSpeakPollRef.current = setInterval(() => {
      if (audioEndedRef.current) {
        clearInterval(botSpeakPollRef.current)
        botSpeakPollRef.current = null
        setBotSpeaking(false)
      }
    }, 200)
    return () => {
      if (botSpeakPollRef.current) { clearInterval(botSpeakPollRef.current); botSpeakPollRef.current = null }
    }
  }, [botSpeaking, isPlaying])

  // Re-play current message TTS when resuming auto-play (isPlaying: false → true)
  useEffect(() => {
    if (!isPlaying) return
    if (currentScene > 0 && animatingIdx < 0) {
      playMessage(messages[currentScene - 1], config?.branding)
    }
  }, [isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play: advance after animation finishes + audio ends (poll every 300ms)
  useEffect(() => {
    if (!isPlaying) return
    if (currentScene >= total) { setIsPlaying(false); return }
    if (animatingIdx >= 0) return // wait for animation to finish

    const check = () => {
      if (!audioEndedRef.current) {
        autoPlayTimerRef.current = setTimeout(check, 300)
        return
      }
      autoPlayTimerRef.current = setTimeout(() => {
        autoPlayTimerRef.current = null
        goNext()
      }, 1500)
    }
    autoPlayTimerRef.current = setTimeout(check, 300)
    return () => { if (autoPlayTimerRef.current) { clearTimeout(autoPlayTimerRef.current); autoPlayTimerRef.current = null } }
  }, [isPlaying, currentScene, total, animatingIdx, goNext])

  useEffect(() => {
    const cache = audioCacheRef.current
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (botSpeakTimerRef.current) clearTimeout(botSpeakTimerRef.current)
      if (botSpeakPollRef.current) clearInterval(botSpeakPollRef.current)
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current)
      stopAudio()
      cache.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [stopAudio])

  if (error) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          background: '#E8EEF7',
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 20,
            padding: 40,
            textAlign: 'center',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            maxWidth: 360,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: '#FEF2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1E293B', marginBottom: 8 }}>
            No demo configuration found
          </h2>
          <p style={{ fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 1.6 }}>
            Please use the builder to create and launch a demo first.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 20px',
              borderRadius: 10,
              background: '#2563EB',
              color: '#fff',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Go to Builder
          </Link>
        </div>
      </div>
    )
  }

  const branding = config?.branding || {}
  const stages = config.stages || []

  // Resolve effective panel mode (walk back past 'same' entries)
  const effectiveMode = (() => {
    for (let i = currentScene - 1; i >= 0; i--) {
      const mode = messages[i]?.panel?.mode
      if (mode && mode !== 'same') return mode
    }
    return 'empty'
  })()
  const hasContent = effectiveMode !== 'empty'

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: `linear-gradient(135deg, ${branding.primaryColor}18 0%, ${branding.accentColor}12 100%), #E8EEF7`,
        overflow: 'hidden',
      }}
    >
      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '20px 40px 84px',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Left: Phone — expands to full width when no content */}
        <div
          style={{
            width: hasContent ? '45%' : '100%',
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* Bot speaking indicator — above phone */}
          {branding.showSpeakingPill !== false && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                background: '#fff',
                borderRadius: 20,
                padding: '6px 14px 6px 10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                marginBottom: 12,
                opacity: botSpeaking ? 1 : 0,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}
            >
              <div style={{
                width: 22, height: 22, borderRadius: '50%',
                background: branding.primaryColor || '#2563EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {[4, 8, 11, 8, 4].map((h, i) => (
                  <div key={i} style={{
                    width: 3, height: h, borderRadius: 2,
                    background: branding.primaryColor || '#2563EB',
                    animation: botSpeaking ? `voiceBar 0.8s ease-in-out ${i * 0.12}s infinite alternate` : 'none',
                  }} />
                ))}
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', whiteSpace: 'nowrap' }}>
                {branding.speakingPillLabel || branding.botName || 'Assistant'}
              </span>
            </div>
          )}

          <PhoneMockup
            branding={branding}
            messages={shownMessages}
            animatingIdx={animatingIdx}
            onMessageClick={(id) => { setIsPlaying(false); setScrollToId(id); setSidebarOpen(true) }}
          />
        </div>

        {/* Right: Panel canvas — slides in when content present */}
        <div
          style={{
            width: hasContent ? '55%' : '0%',
            flexShrink: 0,
            height: '100%',
            maxHeight: 700,
            opacity: hasContent ? 1 : 0,
            transform: `translateX(${hasContent ? 0 : 24}px)`,
            overflow: 'visible',
            display: 'flex',
            flexDirection: 'column',
            paddingLeft: hasContent ? 40 : 0,
            transition: 'width 0.55s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s, padding-left 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Panel header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 12,
              padding: '0 4px',
              flexShrink: 0,
            }}
          >
            {/* Left: labels */}
            <div>
              {branding.workspaceTitle !== '' && branding.workspaceTitle !== undefined && (
                <p style={{ fontSize: 11, fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {branding.workspaceTitle ?? 'Agent Workspace'}
                </p>
              )}
              {branding.showAgentNameInWorkspace !== false && (
                <p style={{ fontSize: 16, fontWeight: 700, color: '#1E293B', marginTop: 2 }}>
                  {branding.botName}
                </p>
              )}
            </div>

            {/* Right: Active pill */}
            {branding.showActivePill !== false && (
              <div
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  background: '#D1FAE5',
                  color: '#059669',
                  fontSize: 12,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  flexShrink: 0,
                }}
              >
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
                Active
              </div>
            )}
          </div>

          <div
            style={{
              flex: 1,
              overflow: 'visible',
              minHeight: 0,
            }}
          >
            <RightPanel
              panelConfig={currentPanel}
              stages={stages}
              currentScene={currentScene}
              allMessages={messages}
            />
          </div>
        </div>
      </div>

      <DemoNavBar
        currentScene={currentScene}
        total={total}
        onPrev={goPrev}
        onNext={goNext}
        onReset={goReset}
        isPlaying={isPlaying}
        onPlayPause={() => {
          setIsPlaying((p) => {
            if (p) { stopAudio(); audioEndedRef.current = true }
            return !p
          })
        }}
        onOpenSettings={() => setSidebarOpen(true)}
      />

      <DemoSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} scrollToId={scrollToId} onScrolled={() => setScrollToId(null)} />
    </div>
  )
}
