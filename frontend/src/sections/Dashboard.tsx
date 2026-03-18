import { useEffect, useState } from 'react'
import { 
  FileText, 
  Eye, 
  Heart, 
  Bookmark, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Zap,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { GeneratedContent, ViewType } from '@/App'
import { cn } from '@/lib/utils'

interface DashboardProps {
  contents: GeneratedContent[]
  onNavigate: (view: ViewType) => void
}

interface StatsData {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalCollects: number
}

export default function Dashboard({ contents, onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<StatsData>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalCollects: 0
  })

  useEffect(() => {
    const published = contents.filter(c => c.status === 'published')
    setStats({
      totalPosts: published.length,
      totalViews: published.reduce((sum, c) => sum + (c.stats?.views || 0), 0),
      totalLikes: published.reduce((sum, c) => sum + (c.stats?.likes || 0), 0),
      totalCollects: published.reduce((sum, c) => sum + (c.stats?.collects || 0), 0)
    })
  }, [contents])

  const statCards = [
    { 
      label: '总发布数', 
      value: stats.totalPosts, 
      icon: FileText, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: '总阅读量', 
      value: stats.totalViews > 10000 ? `${(stats.totalViews / 10000).toFixed(1)}w` : stats.totalViews, 
      icon: Eye, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: '总点赞数', 
      value: stats.totalLikes > 10000 ? `${(stats.totalLikes / 10000).toFixed(1)}w` : stats.totalLikes, 
      icon: Heart, 
      color: 'from-[#FF2442] to-[#FF6B7A]',
      bgColor: 'bg-red-50'
    },
    { 
      label: '总收藏数', 
      value: stats.totalCollects > 10000 ? `${(stats.totalCollects / 10000).toFixed(1)}w` : stats.totalCollects, 
      icon: Bookmark, 
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    },
  ]

  const recentContents = contents.slice(0, 5)

  const quickActions = [
    {
      title: 'AI智能创作',
      desc: '描述需求，一键生成小红书内容',
      icon: Sparkles,
      color: 'from-[#FF2442] to-[#FF6B7A]',
      action: () => onNavigate('create')
    },
    {
      title: '爆款分析',
      desc: '分析热门内容，获取创作灵感',
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('trends')
    },
    {
      title: '发布管理',
      desc: '管理草稿和已发布内容',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('publish')
    },
  ]

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF2442] to-[#FF6B7A] p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">欢迎使用 AI小红书助手</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">让AI帮你打造爆款小红书内容</h2>
          <p className="text-white/80 text-sm max-w-lg mb-4">
            智能分析爆款模式，一键生成高质量图文内容，自动发布到您的小红书账号
          </p>
          <Button 
            onClick={() => onNavigate('create')}
            className="bg-white text-[#FF2442] hover:bg-white/90 rounded-full px-6"
          >
            立即开始创作
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="card-hover border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bgColor)}>
                    <Icon className={cn("w-5 h-5", `bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`)} 
                      style={{ color: stat.color.includes('red') ? '#FF2442' : undefined }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h3>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Card 
                key={action.title} 
                className="card-hover border-0 shadow-sm cursor-pointer group"
                onClick={action.action}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center flex-shrink-0", action.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 group-hover:text-[#FF2442] transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recent Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">最近创作</h3>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-[#FF2442]"
            onClick={() => onNavigate('publish')}
          >
            查看全部
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {recentContents.length > 0 ? (
          <div className="space-y-3">
            {recentContents.map((content) => (
              <Card key={content.id} className="border-0 shadow-sm card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {content.coverImage ? (
                      <img 
                        src={content.coverImage} 
                        alt={content.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{content.title}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          content.status === 'published' && "bg-green-100 text-green-600",
                          content.status === 'draft' && "bg-gray-100 text-gray-600",
                          content.status === 'pending' && "bg-amber-100 text-amber-600",
                          content.status === 'failed' && "bg-red-100 text-red-600",
                        )}>
                          {content.status === 'published' && '已发布'}
                          {content.status === 'draft' && '草稿'}
                          {content.status === 'pending' && '待发布'}
                          {content.status === 'failed' && '发布失败'}
                        </span>
                        <span className="text-xs text-gray-400">
                          {content.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {content.stats && (
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {content.stats.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {content.stats.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="w-4 h-4" /> {content.stats.collects}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-1">还没有创作内容</h4>
              <p className="text-sm text-gray-500 mb-4">开始您的第一次AI创作吧</p>
              <Button 
                onClick={() => onNavigate('create')}
                className="bg-[#FF2442] hover:bg-[#E0203C] text-white rounded-full"
              >
                开始创作
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
