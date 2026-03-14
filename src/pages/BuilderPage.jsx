import { useState } from 'react'
import BuilderHeader from '../components/builder/BuilderHeader'
import TabNav from '../components/builder/TabNav'
import BrandingTab from '../components/builder/branding/BrandingTab'
import BrandingPreviewPanel from '../components/builder/branding/BrandingPreviewPanel'
import StagesTab from '../components/builder/stages/StagesTab'
import ConversationTab from '../components/builder/conversation/ConversationTab'

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState('branding')
  const [scrollToId, setScrollToId] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: '#E8EEF7' }}>
      <BuilderHeader />

      <div
        style={{
          maxWidth: 1140,
          margin: '0 auto',
          padding: '32px 24px 80px',
        }}
      >
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Main content column */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {activeTab === 'branding'      && <BrandingTab />}
            {activeTab === 'stages'        && <StagesTab />}
            {activeTab === 'conversation'  && <ConversationTab scrollToId={scrollToId} onScrolled={() => setScrollToId(null)} />}
          </div>

          {/* Sticky live preview — always visible */}
          <BrandingPreviewPanel activeTab={activeTab} />
        </div>
      </div>
    </div>
  )
}
