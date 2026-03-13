import { createContext, useContext, useReducer, useEffect } from 'react'

const STORAGE_KEY = 'demoBuilderState'

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const genId = (prefix) => `${prefix}_${Date.now()}${Math.random().toString(36).slice(2, 5)}`

const initialState = {
  branding: {
    logo: null,
    customerAvatar: null,
    primaryColor: '#2563EB',
    accentColor: '#7C3AED',
    botName: 'Customer Agent',
    customerName: 'Mr. Bishop',
    elevenLabsApiKey: '',
    botVoiceId: 'cjVigY5qzO86Huf0OWal',
    customerVoiceId: 'EXAVITQu4vr4xnSDxMaL',
    workspaceTitle: 'Agent Workspace',
    showAgentNameInWorkspace: true,
    showActivePill: true,
    showSpeakingPill: true,
    speakingPillLabel: '',
  },
  stages: [],
  messages: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_BRANDING':
      return { ...state, branding: { ...state.branding, ...action.updates } }

    case 'SET_LOGO':
      return { ...state, branding: { ...state.branding, logo: action.base64 } }

    case 'ADD_STAGE':
      return {
        ...state,
        stages: [...state.stages, { id: genId('stage'), name: 'New Stage', steps: [] }],
      }

    case 'REMOVE_STAGE':
      return { ...state, stages: state.stages.filter((s) => s.id !== action.id) }

    case 'IMPORT_STAGES': {
      const imported = action.stages.map((s) => ({
        id: genId('stage'),
        name: s.name || 'Stage',
        green: false,
        steps: (s.steps || []).map((st) => ({
          id: genId('step'),
          name: st.name || 'Step',
          stepType: 'collect_information',
        })),
      }))
      return { ...state, stages: [...state.stages, ...imported] }
    }

    case 'UPDATE_STAGE_NAME':
      return {
        ...state,
        stages: state.stages.map((s) => (s.id === action.id ? { ...s, name: action.name } : s)),
      }

    case 'UPDATE_STAGE':
      return {
        ...state,
        stages: state.stages.map((s) => (s.id === action.id ? { ...s, ...action.updates } : s)),
      }

    case 'ADD_STEP':
      return {
        ...state,
        stages: state.stages.map((s) =>
          s.id === action.stageId
            ? { ...s, steps: [...s.steps, { id: genId('step'), name: 'New Step', stepType: 'collect_information' }] }
            : s
        ),
      }

    case 'REMOVE_STEP':
      return {
        ...state,
        stages: state.stages.map((s) =>
          s.id === action.stageId
            ? { ...s, steps: s.steps.filter((st) => st.id !== action.stepId) }
            : s
        ),
      }

    case 'UPDATE_STEP_NAME':
      return {
        ...state,
        stages: state.stages.map((s) =>
          s.id === action.stageId
            ? {
                ...s,
                steps: s.steps.map((st) =>
                  st.id === action.stepId ? { ...st, name: action.name } : st
                ),
              }
            : s
        ),
      }

    case 'UPDATE_STEP_TYPE':
      return {
        ...state,
        stages: state.stages.map((s) =>
          s.id === action.stageId
            ? {
                ...s,
                steps: s.steps.map((st) =>
                  st.id === action.stepId ? { ...st, stepType: action.stepType } : st
                ),
              }
            : s
        ),
      }

    case 'INSERT_MESSAGE': {
      const newMsg = {
        id: genId('msg'),
        type: action.msgType,
        text: '',
        speak: true,
        panel: { mode: 'same', badges: [], caseSearch: { category: '', types: [], match: '', badges: [], isNew: true }, stageId: '', stepId: '' },
      }
      const msgs = [...state.messages]
      msgs.splice(action.index, 0, newMsg)
      return { ...state, messages: msgs }
    }

    case 'REORDER_MESSAGES': {
      const arr = [...state.messages]
      const [item] = arr.splice(action.from, 1)
      arr.splice(action.to, 0, item)
      return { ...state, messages: arr }
    }

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            id: genId('msg'),
            type: action.msgType,
            text: '',
            speak: true,
            panel: { mode: 'same', badges: [], caseSearch: { category: '', types: [], match: '', badges: [], isNew: true }, stageId: '', stepId: '' },
          },
        ],
      }

    case 'REMOVE_MESSAGE':
      return { ...state, messages: state.messages.filter((m) => m.id !== action.id) }

    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.id ? { ...m, ...action.updates } : m
        ),
      }

    case 'UPDATE_PANEL_MODE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.msgId
            ? { ...m, panel: { ...m.panel, mode: action.mode } }
            : m
        ),
      }

    case 'ADD_BADGE': {
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id !== action.msgId) return m
          if (action.target === 'cs') {
            return {
              ...m,
              panel: {
                ...m.panel,
                caseSearch: {
                  ...m.panel.caseSearch,
                  badges: [...m.panel.caseSearch.badges, { label: 'Badge', color: 'blue' }],
                },
              },
            }
          }
          return {
            ...m,
            panel: {
              ...m.panel,
              badges: [...m.panel.badges, { label: 'Badge', color: 'blue' }],
            },
          }
        }),
      }
    }

    case 'REMOVE_BADGE':
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id !== action.msgId) return m
          if (action.target === 'cs') {
            return {
              ...m,
              panel: {
                ...m.panel,
                caseSearch: {
                  ...m.panel.caseSearch,
                  badges: m.panel.caseSearch.badges.filter((_, i) => i !== action.idx),
                },
              },
            }
          }
          return {
            ...m,
            panel: {
              ...m.panel,
              badges: m.panel.badges.filter((_, i) => i !== action.idx),
            },
          }
        }),
      }

    case 'UPDATE_BADGE':
      return {
        ...state,
        messages: state.messages.map((m) => {
          if (m.id !== action.msgId) return m
          if (action.target === 'cs') {
            const newBadges = m.panel.caseSearch.badges.map((b, i) =>
              i === action.idx ? { ...b, [action.field]: action.val } : b
            )
            return {
              ...m,
              panel: {
                ...m.panel,
                caseSearch: { ...m.panel.caseSearch, badges: newBadges },
              },
            }
          }
          const newBadges = m.panel.badges.map((b, i) =>
            i === action.idx ? { ...b, [action.field]: action.val } : b
          )
          return { ...m, panel: { ...m.panel, badges: newBadges } }
        }),
      }

    case 'ADD_CASE_TYPE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.msgId
            ? {
                ...m,
                panel: {
                  ...m.panel,
                  caseSearch: {
                    ...m.panel.caseSearch,
                    types: [...m.panel.caseSearch.types, action.value],
                  },
                },
              }
            : m
        ),
      }

    case 'REMOVE_CASE_TYPE':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.msgId
            ? {
                ...m,
                panel: {
                  ...m.panel,
                  caseSearch: {
                    ...m.panel.caseSearch,
                    types: m.panel.caseSearch.types.filter((_, i) => i !== action.idx),
                  },
                },
              }
            : m
        ),
      }

    case 'UPDATE_CASE_SEARCH':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.msgId
            ? {
                ...m,
                panel: {
                  ...m.panel,
                  caseSearch: { ...m.panel.caseSearch, [action.field]: action.val },
                },
              }
            : m
        ),
      }

    case 'UPDATE_STAGE_STEP':
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.msgId
            ? {
                ...m,
                panel: { ...m.panel, stageId: action.stageId, stepId: action.stepId },
              }
            : m
        ),
      }

    case 'IMPORT_CONFIG':
      return action.config

    default:
      return state
  }
}

const BuilderContext = createContext(null)

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, loadSavedState() ?? initialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // storage full (e.g. large logo) — fail silently
    }
  }, [state])

  const actions = {
    setBranding: (updates) => dispatch({ type: 'SET_BRANDING', updates }),
    setLogo: (base64) => dispatch({ type: 'SET_LOGO', base64 }),
    addStage: () => dispatch({ type: 'ADD_STAGE' }),
    removeStage: (id) => dispatch({ type: 'REMOVE_STAGE', id }),
    updateStageName: (id, name) => dispatch({ type: 'UPDATE_STAGE_NAME', id, name }),
    updateStage: (id, updates) => dispatch({ type: 'UPDATE_STAGE', id, updates }),
    importStages: (stages) => dispatch({ type: 'IMPORT_STAGES', stages }),
    addStep: (stageId) => dispatch({ type: 'ADD_STEP', stageId }),
    removeStep: (stageId, stepId) => dispatch({ type: 'REMOVE_STEP', stageId, stepId }),
    updateStepName: (stageId, stepId, name) =>
      dispatch({ type: 'UPDATE_STEP_NAME', stageId, stepId, name }),
    updateStepType: (stageId, stepId, stepType) =>
      dispatch({ type: 'UPDATE_STEP_TYPE', stageId, stepId, stepType }),
    insertMessage: (index, msgType) => dispatch({ type: 'INSERT_MESSAGE', index, msgType }),
    reorderMessages: (from, to) => dispatch({ type: 'REORDER_MESSAGES', from, to }),
    addMessage: (msgType) => dispatch({ type: 'ADD_MESSAGE', msgType }),
    removeMessage: (id) => dispatch({ type: 'REMOVE_MESSAGE', id }),
    updateMessage: (id, updates) => dispatch({ type: 'UPDATE_MESSAGE', id, updates }),
    updatePanelMode: (msgId, mode) => dispatch({ type: 'UPDATE_PANEL_MODE', msgId, mode }),
    addBadge: (msgId, target) => dispatch({ type: 'ADD_BADGE', msgId, target }),
    removeBadge: (msgId, target, idx) => dispatch({ type: 'REMOVE_BADGE', msgId, target, idx }),
    updateBadge: (msgId, target, idx, field, val) =>
      dispatch({ type: 'UPDATE_BADGE', msgId, target, idx, field, val }),
    addCaseType: (msgId, value) => dispatch({ type: 'ADD_CASE_TYPE', msgId, value }),
    removeCaseType: (msgId, idx) => dispatch({ type: 'REMOVE_CASE_TYPE', msgId, idx }),
    updateCaseSearch: (msgId, field, val) =>
      dispatch({ type: 'UPDATE_CASE_SEARCH', msgId, field, val }),
    updateStageStep: (msgId, stageId, stepId) =>
      dispatch({ type: 'UPDATE_STAGE_STEP', msgId, stageId, stepId }),
    importConfig: (config) => dispatch({ type: 'IMPORT_CONFIG', config }),
  }

  return (
    <BuilderContext.Provider value={{ state, ...actions }}>
      {children}
    </BuilderContext.Provider>
  )
}

export function useBuilder() {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used within BuilderProvider')
  return ctx
}
