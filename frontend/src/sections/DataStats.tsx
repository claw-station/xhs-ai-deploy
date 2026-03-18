import { useEffect, useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  Heart, 
  Bookmark, 
  Target,
  Award
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import type { GeneratedContent } from '@/App'
import { cn } from '@/lib/utils'

interface DataStatsProps {
  contents: GeneratedContent[]
}

interface StatsOverview {
  totalPosts: number
  totalViews: number
  totalLikes: number
  totalCollects: number
  avgEngagement: number
  growthRate: number
}

const mockDailyData = [
  { date: '03/01', views: 1200, likes: 89, collects: 45 },
  { date: '03/02', views: 1800, likes: 134, collects: 67 },
  { date: '03/03', views: 1500, likes: 112, collects: 56 },
  { date: '03/04', views: 2200, likes: 178, collects: 89 },
  { date: '03/05', views: 2800, likes: 234, collects: 123 },
  { date: '03/06', views: 3200, likes: 289, collects: 156 },
  { date: '03/07', views: 4100, likes: 356, collects: 189 },
]

const topPerformingContents = [
  {
    title: '夏日防晒必看！这5款防晒霜真的不踩雷',
    views: 12580,
    likes: 2340,
    collects: 1120,
    engagement: '28.5%'
  },
  {
    title: '早八人5分钟快速出门妆',
    views: 8930,
    likes: 1890,
    collects: 890,
    engagement: '31.2%'
  },
  {
    title: '油痘肌护肤Routine分享',
    views: 15230,
    likes: 3450,
    collects: 1890,
    engagement: '35.1%'
  }
]

export default function DataStats({ contents }: DataStatsProps) {
  const [stats, setStats] = useState<StatsOverview>({
    totalPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalCollects: 0,
    avgEngagement: 0,
    growthRate: 12.5
  })

  useEffect(() => {
    const published = contents.filter(c => c.status === 'published')
    const totalViews = published.reduce((sum, c) => sum + (c.stats?.views || 0), 0)
    const totalLikes = published.reduce((sum, c) => sum + (c.stats?.likes || 0), 0)
    const totalCollects = published.reduce((sum, c) => sum + (c.stats?.collects || 0), 0)
    
    setStats({
      totalPosts: published.length,
      totalViews,
      totalLikes,
      totalCollects,
      avgEngagement: totalViews > 0 ? Math.round((totalLikes + totalCollects) / totalViews * 1000) / 10 : 0,
      growthRate: 12.5
    })
  }, [contents])

  const statCards = [
    {
      title: '总发布数',
      value: stats.totalPosts,
      icon: BarChart3,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      trend: '+3 本周'
    },
    {
      title: '总阅读量',
      value: stats.totalViews > 10000 ? `${(stats.totalViews / 10000).toFixed(1)}w` : stats.totalViews,
      icon: Eye,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      trend: '+15% 较上周'
    },
    {
      title: '总点赞数',
      value: stats.totalLikes > 10000 ? `${(stats.totalLikes / 10000).toFixed(1)}w` : stats.totalLikes,
      icon: Heart,
      color: 'text-[#FF2442]',
      bgColor: 'bg-red-50',
      trend: '+23% 较上周'
    },
    {
      title: '总收藏数',
      value: stats.totalCollects > 10000 ? `${(stats.totalCollects / 10000).toFixed(1)}w` : stats.totalCollects,
      icon: Bookmark,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
      trend: '+18% 较上周'
    }
  ]

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#FF2442]" />
          数据统计
        </h2>
        <p className="text-gray-500 text-sm mt-1">查看您的内容表现和增长趋势</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title} className="border-0 shadow-sm card-hover">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {card.trend}
                    </p>
                  </div>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", card.bgColor)}>
                    <Icon className={cn("w-6 h-6", card.color)} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
          <TabsTrigger value="overview" className="rounded-full data-[state=active]:bg-[#FF2442] data-[state=active]:text-white">
            数据概览
          </TabsTrigger>
          <TabsTrigger value="contents" className="rounded-full data-[state=active]:bg-[#FF2442] data-[state=active]:text-white">
            内容表现
          </TabsTrigger>
          <TabsTrigger value="audience" className="rounded-full data-[state=active]:bg-[#FF2442] data-[state=active]:text-white">
            受众分析
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Chart Area */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#FF2442]" />
                  7天数据趋势
                </CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#FF2442] rounded-full"></div>
                    <span className="text-gray-500">阅读量</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                    <span className="text-gray-500">点赞</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-500">收藏</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Simple Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-4">
                {mockDailyData.map((day) => {
                  const maxViews = Math.max(...mockDailyData.map(d => d.views))
                  const heightPercent = (day.views / maxViews) * 100
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center gap-1" style={{ height: '200px' }}>
                        <div 
                          className="w-2 bg-[#FF2442]/80 rounded-t"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        <div 
                          className="w-2 bg-amber-400/80 rounded-t"
                          style={{ height: `${(day.likes / day.views) * heightPercent * 3}%` }}
                        ></div>
                        <div 
                          className="w-2 bg-blue-400/80 rounded-t"
                          style={{ height: `${(day.collects / day.views) * heightPercent * 3}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{day.date}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FFF0F2] rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#FF2442]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">平均互动率</p>
                    <p className="text-xl font-bold text-gray-900">{stats.avgEngagement}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">高于同领域平均水平 15%</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">周增长率</p>
                    <p className="text-xl font-bold text-gray-900">+{stats.growthRate}%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">较上周增长 3.2%</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">最佳表现</p>
                    <p className="text-xl font-bold text-gray-900">35.1%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400">单篇内容最高互动率</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contents" className="mt-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-[#FF2442]" />
                热门内容排行
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformingContents.map((content, index) => (
                  <div 
                    key={content.title}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                      index === 0 ? "bg-amber-100 text-amber-600" :
                      index === 1 ? "bg-gray-200 text-gray-600" :
                      index === 2 ? "bg-orange-100 text-orange-600" :
                      "bg-gray-100 text-gray-500"
                    )}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{content.title}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" /> {content.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" /> {content.likes.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bookmark className="w-4 h-4" /> {content.collects.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-600">
                      互动率 {content.engagement}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">受众画像</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">性别分布</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">女性</span>
                        <span className="text-sm font-bold text-[#FF2442]">82%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[82%] bg-[#FF2442] rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">男性</span>
                        <span className="text-sm font-bold text-blue-500">18%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[18%] bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">年龄分布</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: '18-24岁', value: 45, color: 'bg-[#FF2442]' },
                      { label: '25-34岁', value: 35, color: 'bg-amber-400' },
                      { label: '35-44岁', value: 15, color: 'bg-blue-400' },
                      { label: '45岁以上', value: 5, color: 'bg-gray-400' }
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 w-20">{item.label}</span>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.value}%` }}></div>
                        </div>
                        <span className="text-sm font-medium w-10">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">活跃时段</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { time: '6-9点', label: '早晨', active: false },
                    { time: '9-12点', label: '上午', active: true },
                    { time: '12-14点', label: '午间', active: true },
                    { time: '14-18点', label: '下午', active: false },
                    { time: '18-20点', label: '傍晚', active: true },
                    { time: '20-22点', label: '晚上', active: true },
                    { time: '22-24点', label: '夜间', active: true },
                    { time: '0-6点', label: '凌晨', active: false },
                  ].map((slot) => (
                    <div 
                      key={slot.time}
                      className={cn(
                        "p-3 rounded-xl text-center",
                        slot.active 
                          ? "bg-[#FFF0F2] border border-[#FF2442]/20" 
                          : "bg-gray-50"
                      )}
                    >
                      <p className={cn(
                        "text-sm font-medium",
                        slot.active ? "text-[#FF2442]" : "text-gray-400"
                      )}>{slot.time}</p>
                      <p className="text-xs text-gray-400 mt-1">{slot.label}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  建议在这些时段发布内容，可获得更高曝光
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
