import { useState } from 'react'
import BuilderHeader from '../components/builder/BuilderHeader'
import TabNav from '../components/builder/TabNav'
import BrandingTab from '../components/builder/branding/BrandingTab'
import StagesTab from '../components/builder/stages/StagesTab'
import ConversationTab from '../components/builder/conversation/ConversationTab'

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState('branding')

  return (
    <div style={{ minHeight: '100vh', background: '#E8EEF7' }}>
      <BuilderHeader />

      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: '32px 24px 80px',
        }}
      >
        <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

        <div>
          {activeTab === 'branding' && <BrandingTab />}
          {activeTab === 'stages' && <StagesTab />}
          {activeTab === 'conversation' && <ConversationTab />}
        </div>
      </div>
    </div>
  )
}
