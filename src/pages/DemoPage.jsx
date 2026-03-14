import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import PhoneMockup from '../components/demo/PhoneMockup'
import ContainerShell from '../components/demo/ContainerShell'
import WebchatShell from '../components/demo/WebchatShell'
import RightPanel from '../components/demo/RightPanel'
import DemoNavBar from '../components/demo/DemoNavBar'
import DemoSidebar from '../components/demo/DemoSidebar'
import { useBuilder } from '../store/BuilderContext'

function computeAutoSyncPanel(stages, botCount) {
  if (!stages.length) return { mode: 'empty' }
  let remaining = botCount
  for (let si = 0; si < stages.length; si++) {
    const stage = stages[si]
    const steps = stage.steps || []
    const stepCount = steps.length || 1
    if (remaining < stepCount) {
      return { mode: 'stages', stageId: stage.id, stepId: steps[remaining]?.id || '' }
    }
    remaining -= stepCount
  }
  const lastStage = stages[stages.length - 1]
  const lastSteps = lastStage.steps || []
  return { mode: 'stages', stageId: lastStage.id, stepId: lastSteps[lastSteps.length - 1]?.id || '' }
}

function computeAutoSyncCompleted(stages, botCount) {
  const completed = new Set()
  let remaining = botCount
  for (let si = 0; si < stages.length; si++) {
    const stage = stages[si]
    const steps = stage.steps || []
    const stepCount = steps.length || 1
    if (remaining < stepCount) {
      // current stage — steps before the active one are completed
      for (let sti = 0; sti < remaining; sti++) {
        if (steps[sti]) completed.add(`${stage.id}:${steps[sti].id}`)
      }
      break
    }
    // entire stage completed
    for (const step of steps) completed.add(`${stage.id}:${step.id}`)
    remaining -= stepCount
  }
  return completed
}

export default function DemoPage() {
  const { state: config } = useBuilder()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scrollToId, setScrollToId] = useState(null)
  const error = config.messages.length === 0 && config.stages.length === 0
  const [currentScene, setCurrentScene] = useState(0)
  const [animatingIdx, setAnimatingIdx] = useState(-1)
  const [botSpeaking, setBotSpeaking] = useState(false)
  const [userSpeaking, setUserSpeaking] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [presenterMode, setPresenterMode] = useState(false)
  const timerRef = useRef(null)
  const botSpeakTimerRef = useRef(null)
  const botSpeakPollRef = useRef(null)
  const autoPlayTimerRef = useRef(null)
  const audioRef = useRef(null)
  const audioCacheRef = useRef(new Map())
  const audioEndedRef = useRef(true)
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 30 }, audio: true })
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9') ? 'video/webm;codecs=vp9' : 'video/webm'
      const recorder = new MediaRecorder(stream, { mimeType })
      recordedChunksRef.current = []
      recorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunksRef.current.push(e.data) }
      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `demo-${new Date().toISOString().slice(0, 10)}.webm`
        a.click()
        URL.revokeObjectURL(url)
        stream.getTracks().forEach((t) => t.stop())
        setIsRecording(false)
      }
      stream.getVideoTracks()[0]?.addEventListener('ended', () => {
        if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop()
        setIsRecording(false)
      })
      recorder.start()
      mediaRecorderRef.current = recorder
      setIsRecording(true)
    } catch { setIsRecording(false) }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== 'inactive') mediaRecorderRef.current?.stop()
  }, [])

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }, [])

  const playMessage = useCallback(async (msg, branding) => {
    audioEndedRef.current = false
    if (!msg?.text || msg.speak === false) { audioEndedRef.current = true; setUserSpeaking(false); return }
    const apiKey = branding?.elevenLabsApiKey
    if (!apiKey) { audioEndedRef.current = true; setUserSpeaking(false); return }
    const voiceId = msg.type === 'bot'
      ? (branding.botVoiceId || 'cjVigY5qzO86Huf0OWal')
      : (branding.customerVoiceId || 'EXAVITQu4vr4xnSDxMaL')
    stopAudio()
    const onEnd = () => { audioEndedRef.current = true; setUserSpeaking(false) }
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
        audioEndedRef.current = true; setUserSpeaking(false)
        return
      }
      const url = URL.createObjectURL(await res.blob())
      audioCacheRef.current.set(cacheKey, url)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.addEventListener('ended', onEnd)
      audio.play()
    } catch (e) { console.error('[ElevenLabs] fetch error', e); audioEndedRef.current = true; setUserSpeaking(false) }
  }, [stopAudio, setUserSpeaking])

  const [branchChoices, setBranchChoices] = useState({}) // { [branchMsgId]: optionId }

  const messages = useMemo(() => config?.messages || [], [config])
  const total = messages.length

  // Build shown messages respecting branch choices (skip unchosen paths)
  const shownMessages = useMemo(() => {
    const result = []
    let skipUntil = -1
    for (let i = 0; i < currentScene && i < messages.length; i++) {
      if (i < skipUntil) continue
      const msg = messages[i]
      result.push(msg)
      if (msg.type === 'branch' && branchChoices[msg.id]) {
        const chosenOpt = (msg.options || []).find((o) => o.id === branchChoices[msg.id])
        if (chosenOpt?.targetId) {
          const targetIdx = messages.findIndex((m) => m.id === chosenOpt.targetId)
          if (targetIdx > i + 1) skipUntil = targetIdx
        }
      }
    }
    return result
  }, [messages, currentScene, branchChoices])

  // At a branch if current top of shown messages is a branch without a choice yet
  const currentBranch = shownMessages.length > 0 && shownMessages[shownMessages.length - 1]?.type === 'branch'
    && !branchChoices[shownMessages[shownMessages.length - 1]?.id]
    ? shownMessages[shownMessages.length - 1]
    : null

  const onBranchChoice = useCallback((branchMsgId, optId, targetId) => {
    setBranchChoices((prev) => ({ ...prev, [branchMsgId]: optId }))
    const targetIdx = messages.findIndex((m) => m.id === targetId)
    if (targetIdx >= 0) jumpToScene(targetIdx)
  }, [messages, jumpToScene])

  const showBotTyping = animatingIdx >= 0 && messages[animatingIdx]?.type === 'bot'

  const jumpToScene = useCallback((n) => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    if (autoPlayTimerRef.current) { clearTimeout(autoPlayTimerRef.current); autoPlayTimerRef.current = null }
    setAnimatingIdx(-1)
    setIsPlaying(false)
    stopAudio()
    audioEndedRef.current = true
    setBotSpeaking(false)
    setUserSpeaking(false)
    setCurrentScene(n)
  }, [stopAudio, setUserSpeaking])

  const goReset = useCallback(() => {
    if (autoPlayTimerRef.current) { clearTimeout(autoPlayTimerRef.current); autoPlayTimerRef.current = null }
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    setAnimatingIdx(-1)
    setIsPlaying(false)
    stopAudio()
    audioEndedRef.current = true
    setBotSpeaking(false)
    setUserSpeaking(false)
    setCurrentScene(0)
  }, [stopAudio, setUserSpeaking])

  const goNext = useCallback(() => {
    if (currentScene >= total) return
    if (timerRef.current) return // animation in progress

    // Cancel any pending auto-play timer so a manual advance can't race with it
    if (autoPlayTimerRef.current) { clearTimeout(autoPlayTimerRef.current); autoPlayTimerRef.current = null }

    // Stop stale audio from a previous scene
    stopAudio()
    audioEndedRef.current = true
    setUserSpeaking(false)

    // Clear bot speaking indicator immediately on every advance
    if (botSpeakTimerRef.current) clearTimeout(botSpeakTimerRef.current)
    setBotSpeaking(false)

    const nextMsg = messages[currentScene]
    const nextIdx = currentScene

    if (nextMsg?.type === 'branch') {
      // Show branch immediately — no animation, auto-play will pause
      setCurrentScene((s) => s + 1)
    } else if (nextMsg?.type === 'bot') {
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
  }, [currentScene, total, messages, setBotSpeaking, stopAudio, setUserSpeaking])

  const goPrev = useCallback(() => {
    if (currentScene === 0) return
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
      setAnimatingIdx(-1)
    }
    stopAudio()
    setUserSpeaking(false)
    setCurrentScene((s) => s - 1)
  }, [currentScene, stopAudio, setUserSpeaking])

  useEffect(() => {
    if (currentScene === 0 || !messages.length || !config) return
    const msg = messages[currentScene - 1]
    if (msg?.type === 'user') setUserSpeaking(true)
    playMessage(msg, config.branding)
  }, [currentScene, config, messages, playMessage, setUserSpeaking])

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === ' ') { e.preventDefault(); setIsPlaying(p => { if (p) { stopAudio(); audioEndedRef.current = true } return !p }) }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, stopAudio])

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
  // Skip if audio is already in progress (e.g. manual goNext triggered a scene change simultaneously)
  useEffect(() => {
    if (!isPlaying) return
    if (!audioEndedRef.current) return
    if (currentScene > 0 && animatingIdx < 0) {
      playMessage(messages[currentScene - 1], config?.branding)
    }
  }, [isPlaying]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-play: advance after animation finishes + audio ends (poll every 300ms)
  useEffect(() => {
    if (!isPlaying) return
    if (currentBranch) { setIsPlaying(false); return } // pause at branch — wait for viewer choice
    if (currentScene >= total) { setIsPlaying(false); return }
    if (animatingIdx >= 0) return // wait for animation to finish

    const check = () => {
      if (!audioEndedRef.current) {
        autoPlayTimerRef.current = setTimeout(check, 300)
        return
      }
      // voicetotext: wait for justSent animation (1400ms) + 200ms = 1600ms
      // text: bubble appears immediately when audio ends, 1500ms standard pause
      // all others: standard 1500ms read pause
      const currentMsg = messages[currentScene - 1]
      const style = branding?.phoneInputStyle
      const speed = branding?.playbackSpeed || 1
      const baseDelay = currentMsg?.type === 'user' && style === 'voicetotext' ? 1600 : 1500
      const delay = Math.round(baseDelay / speed)
      autoPlayTimerRef.current = setTimeout(() => {
        autoPlayTimerRef.current = null
        goNext()
      }, delay)
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

  // Presenter mode fullscreen
  useEffect(() => {
    if (presenterMode) {
      document.documentElement.requestFullscreen?.().catch(() => {})
    } else {
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {})
    }
  }, [presenterMode])

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setPresenterMode(false) }
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

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

  const stepsSoFar = shownMessages.filter(m => m.advanceStep).length +
    (animatingIdx >= 0 && messages[animatingIdx]?.advanceStep ? 1 : 0)

  const currentPanel = branding.autoSyncStages && stages.length > 0
    ? computeAutoSyncPanel(stages, stepsSoFar)
    : (currentScene > 0 ? messages[currentScene - 1]?.panel : { mode: 'empty' })

  const autoSyncCompletedSteps = branding.autoSyncStages && stages.length > 0
    ? computeAutoSyncCompleted(stages, stepsSoFar)
    : null

  // Overlay: badges/caseSearch that float over the auto-synced stages panel
  const currentMsgPanel = currentScene > 0 ? messages[currentScene - 1]?.panel : null
  const extrasPanel = branding.autoSyncStages && stages.length > 0 &&
    (currentMsgPanel?.mode === 'badges' || currentMsgPanel?.mode === 'caseSearch')
    ? currentMsgPanel
    : null

  const effectiveMode = branding.autoSyncStages && stages.length > 0
    ? 'stages'
    : (() => {
        for (let i = currentScene - 1; i >= 0; i--) {
          const mode = messages[i]?.panel?.mode
          if (mode && mode !== 'same') return mode
        }
        return 'empty'
      })()

  const hasContent = effectiveMode !== 'empty'

  const isAnimBg = typeof branding.demoBackground === 'string' && branding.demoBackground.startsWith('anim:')
  const animBgClass = isAnimBg ? `demo-bg-${branding.demoBackground.slice(5)}` : ''

  return (
    <div
      className={animBgClass}
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: isAnimBg
          ? undefined
          : branding.demoBackground
          ? branding.demoBackground
          : `linear-gradient(135deg, ${branding.primaryColor}18 0%, ${branding.accentColor}12 100%), #E8EEF7`,
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
          {(branding.shell || 'phone') === 'phone' && (
            <PhoneMockup
              branding={branding}
              messages={shownMessages}
              animatingIdx={animatingIdx}
              botSpeaking={botSpeaking}
              userSpeaking={userSpeaking}
              isPlaying={isPlaying}
              showBotTyping={showBotTyping}
              onMessageClick={(id) => { setIsPlaying(false); setScrollToId(id); setSidebarOpen(true) }}
              onBranchChoice={onBranchChoice}
              branchChoices={branchChoices}
            />
          )}
          {branding.shell === 'container' && (
            <ContainerShell
              branding={branding}
              messages={shownMessages}
              animatingIdx={animatingIdx}
              botSpeaking={botSpeaking}
              userSpeaking={userSpeaking}
              showBotTyping={showBotTyping}
              onMessageClick={(id) => { setIsPlaying(false); setScrollToId(id); setSidebarOpen(true) }}
              onBranchChoice={onBranchChoice}
              branchChoices={branchChoices}
            />
          )}
          {branding.shell === 'webchat' && (
            <WebchatShell
              branding={branding}
              messages={shownMessages}
              animatingIdx={animatingIdx}
              botSpeaking={botSpeaking}
              userSpeaking={userSpeaking}
              showBotTyping={showBotTyping}
              onMessageClick={(id) => { setIsPlaying(false); setScrollToId(id); setSidebarOpen(true) }}
              onBranchChoice={onBranchChoice}
              branchChoices={branchChoices}
            />
          )}
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
              completedSteps={autoSyncCompletedSteps}
              extrasPanel={extrasPanel}
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
        onOpenSettings={() => { if (!presenterMode) setSidebarOpen(true) }}
        presenterMode={presenterMode}
        onTogglePresenter={() => setPresenterMode(p => !p)}
        nextMessage={messages[currentScene]}
        onJumpToScene={jumpToScene}
        isRecording={isRecording}
        onStartRecord={startRecording}
        onStopRecord={stopRecording}
      />

      {!presenterMode && (
        <DemoSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} scrollToId={scrollToId} onScrolled={() => setScrollToId(null)} />
      )}
    </div>
  )
}
