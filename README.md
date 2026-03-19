# DemoX Agentic Builder

A browser-based tool for building and playing back interactive AI agent conversation demos. Build a scripted conversation once, then present it live with animated stages, branching paths, voice playback, and a polished UI shell — no coding required during the demo.

---

## What it does

**Build screen** — Compose a conversation between a bot and a user. Add stages/steps that animate alongside the chat. Configure branding, voice, shell type, and background. Save presets to reuse your setup.

**Demo screen** — Play back the conversation with real text-to-speech, animated stage progress, keyboard controls, and the ability to branch into different conversation paths live. Export to video if needed.

---

## Features

- **Three shell types** — Phone mockup, floating webchat widget, or embedded container
- **Animated backgrounds** — Solid color or animated Aurora / Sunset / Midnight / Cosmos
- **Text-to-speech** — Per-message voice playback via ElevenLabs (bot & customer voices)
- **Conditional branching** — Add choice buttons mid-conversation; playback follows the chosen path
- **Stage panels** — Animated chevron stages with steps that complete as the demo progresses
- **Case search & badge panels** — Visual side panels for richer storytelling
- **Playback controls** — Play/pause/reset, speed (0.5×–2×), keyboard shortcuts (Space, R, arrow keys)
- **Jump to scene** — Skip to any message from a dropdown
- **Undo / Redo** — Full history (Cmd+Z / Cmd+Shift+Z)
- **Drag to reorder** — Drag messages and stages into any order
- **Find & Replace** — Search across all message text and replace in bulk
- **Duplicate** — Duplicate any message or stage in one click
- **Branding presets** — Save and load named branding configurations
- **Screenshot import** — Upload a screenshot; AI extracts stages & steps automatically
- **Export to video** — Screen-capture the demo directly to a `.webm` file
- **Fully local** — All state is saved in your browser's localStorage. Nothing is sent to any server (except API calls you initiate).

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node)

### Install & run

```bash
git clone https://github.com/YOUR_USERNAME/DemoX-Agentic-Builder.git
cd DemoX-Agentic-Builder
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## API keys

All API keys are entered in the app UI and saved only in your browser's localStorage. They are never stored on any server.

### ElevenLabs (text-to-speech) — optional

Used for voice playback in the demo. Without it the demo runs silently.

1. Sign up at [elevenlabs.io](https://elevenlabs.io)
2. Go to your profile → API Keys → copy your key
3. In the builder, open the **Branding** tab and paste it into the **ElevenLabs API Key** field

### AI screenshot import — optional

Used to extract stages and steps from a screenshot automatically. You can use any of:

| Provider | Model | Get a key |
|---|---|---|
| Anthropic | claude-opus-4-6 | [console.anthropic.com](https://console.anthropic.com) |
| OpenAI | gpt-4o | [platform.openai.com](https://platform.openai.com) |
| Google | gemini-2.0-flash | [aistudio.google.com](https://aistudio.google.com) |

In the builder, go to the **Stages** tab → click **Import Screenshot** → choose your provider → paste your key → upload an image.

---

## How to build a demo

### 1. Configure branding
Open the **Branding** tab. Set:
- Bot name and customer name
- Logo and avatar images
- Primary and accent colors
- Shell type (Phone / Webchat / Container)
- Background (solid color or animated)
- ElevenLabs API key and voice selections

### 2. Add stages
Open the **Stages** tab. Stages appear in the right panel during the demo as animated chevrons.
- Add stages manually, or click **Import Screenshot** to extract them from an image using AI
- Add steps inside each stage (they tick off as the demo progresses)
- Drag to reorder stages

### 3. Write the conversation
Open the **Conversation** tab. Add messages:
- **Bot** — what the AI agent says
- **User** — what the customer says
- **Branch** — presents the user with choice buttons mid-demo; each choice jumps to a different message

For each message you can:
- Toggle **Speak** on/off (whether TTS plays for that message)
- Toggle **Advance step** (whether this message ticks off the next stage step)
- Set a **Panel override** to show a different panel (stages, case search, badges) for that message

### 4. Run the demo
Navigate to [http://localhost:5173/demo](http://localhost:5173/demo) or click the **Demo** link.

| Key | Action |
|---|---|
| Space | Play / Pause |
| R | Reset to beginning |
| → | Step forward one message |
| ← | Step back one message |

Use the top bar to change speed, jump to a specific scene, or start a video recording.

---

## Exporting

**Export JSON** — In the builder header, click **Export** to download a `.json` file of your entire demo (messages, stages, branding). Share this file and anyone can import it.

**Import JSON** — Click **Import** in the builder header and upload a previously exported file.

**Export video** — In the demo screen, click the record button in the top bar. Play through your demo, then click stop. A `.webm` file downloads automatically.

---

## Project structure

```
src/
  pages/
    BuilderPage.jsx       # Builder shell with tab navigation
    DemoPage.jsx          # Demo playback page
  store/
    BuilderContext.jsx    # All state, reducer, localStorage persistence
  components/
    builder/
      branding/           # Branding tab, color picker, logo upload, preview panel
      conversation/       # Conversation tab, message cards, find & replace
      stages/             # Stages tab, stage cards, screenshot import modal
    demo/
      ChatArea.jsx        # Chat bubbles and branch choice buttons
      RightPanel.jsx      # Routes to stages / case search / badges panel
      StagesPanel.jsx     # Animated chevron stages
      DemoNavBar.jsx      # Playback controls bar
      PhoneMockup.jsx     # Phone shell
      WebchatShell.jsx    # Webchat floating widget shell
      ContainerShell.jsx  # Embedded container shell
```

---

## Tech stack

- [React 19](https://react.dev) + [Vite 8](https://vite.dev)
- [React Router v7](https://reactrouter.com)
- [ElevenLabs API](https://elevenlabs.io/docs) for TTS
- Anthropic / OpenAI / Google AI APIs for screenshot import
- No CSS framework — inline styles throughout
- No backend — runs entirely in the browser

---

## License

MIT
