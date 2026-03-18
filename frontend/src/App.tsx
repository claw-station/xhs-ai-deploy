import { useState, useEffect, useCallback } from 'react'
import './App.css'
import Sidebar from './sections/Sidebar'
import Header from './sections/Header'
import Dashboard from './sections/Dashboard'
import ContentCreation from './sections/ContentCreation'
import TrendAnalysis from './sections/TrendAnalysis'
import PublishManager from './sections/PublishManager'
import DataStats from './sections/DataStats'
import { Toaster } from '@/components/ui/sonner'
import { API_BASE_URL } from './config'

export type ViewType = 'dashboard' | 'create' | 'trends' | 'publish' | 'stats'

export interface GeneratedContent {
  id: string
  title: string
  content: string
  images: string[]
  tags: string[]
  coverImage?: string
  status: 'draft' | 'pending' | 'published' | 'failed'
  createdAt: Date
  publishedAt?: Date
  stats?: {
    views: number
    likes: number
    collects: number
    comments: number
  }
}

export interface TrendingPost {
  id: string
  title: string
  coverImage: string
  author: string
  authorAvatar: string
  likes: number
  collects: number
  comments: number
  tags: string[]
  highlights: string[]
}

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard')
  const [generatedContents, setGeneratedContents] = useState<GeneratedContent[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 从后端API加载数据
  const loadContents = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contents`)
      if (response.ok) {
        const data = await response.json()
        setGeneratedContents(data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          publishedAt: item.publishedAt ? new Date(item.publishedAt) : undefined
        })))
      }
    } catch (error) {
      console.error('Failed to load contents:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadContents()
  }, [loadContents])

  const handleSaveContent = async (content: GeneratedContent) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...content,
          createdAt: content.createdAt.toISOString(),
          publishedAt: content.publishedAt?.toISOString()
        })
      })
      
      if (response.ok) {
        await loadContents() // 重新加载数据
      }
    } catch (error) {
      console.error('Failed to save content:', error)
    }
  }

  const handleDeleteContent = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contents/${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setGeneratedContents(prev => prev.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete content:', error)
    }
  }

  const handlePublishContent = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contents/${id}/publish`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setGeneratedContents(prev => prev.map(c => 
          c.id === id 
            ? { ...c, status: 'published' as const, publishedAt: new Date() }
            : c
        ))
      }
    } catch (error) {
      console.error('Failed to publish content:', error)
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2442]"></div>
        </div>
      )
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard 
          contents={generatedContents} 
          onNavigate={setCurrentView}
        />
      case 'create':
        return <ContentCreation 
          onSave={handleSaveContent}
          onNavigate={setCurrentView}
        />
      case 'trends':
        return <TrendAnalysis />
      case 'publish':
        return <PublishManager 
          contents={generatedContents}
          onDelete={handleDeleteContent}
          onPublish={handlePublishContent}
        />
      case 'stats':
        return <DataStats contents={generatedContents} />
      default:
        return <Dashboard contents={generatedContents} onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
      <Toaster position="top-center" />
    </div>
  )
}

export default App
