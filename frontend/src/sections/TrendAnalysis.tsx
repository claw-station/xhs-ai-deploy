import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Search, 
  Filter, 
  Heart, 
  Bookmark, 
  MessageCircle,
  ArrowUpRight,
  Lightbulb,
  Target,
  Zap,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { API_BASE_URL } from '@/config'

interface TrendData {
  id: string
  title: string
  coverImage: string
  author: string
  authorAvatar: string
  likes: number
  collects: number
  comments: number
  tags: string[]
  category: string
  publishTime: string
  growthRate: number
}

const mockTrends: TrendData[] = [
  {
    id: '1',
    title: '夏日防晒必看！这5款防晒霜真的不踩雷',
    coverImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop',
    author: '美妆达人小A',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    likes: 12580,
    collects: 3420,
    comments: 568,
    tags: ['防晒', '护肤', '夏日必备'],
    category: '美妆护肤',
    publishTime: '2天前',
    growthRate: 156
  },
  {
    id: '2',
    title: '早八人5分钟快速出门妆，被同事夸了一整天',
    coverImage: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=400&h=400&fit=crop',
    author: '职场美妆师',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    likes: 8930,
    collects: 2150,
    comments: 423,
    tags: ['通勤妆', '快速化妆', '职场妆容'],
    category: '美妆护肤',
    publishTime: '3天前',
    growthRate: 89
  },
  {
    id: '3',
    title: '油痘肌护肤Routine，3个月皮肤变好了',
    coverImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop',
    author: '护肤分享站',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
    likes: 15230,
    collects: 5680,
    comments: 892,
    tags: ['油痘肌', '护肤routine', '平价好物'],
    category: '美妆护肤',
    publishTime: '1天前',
    growthRate: 234
  },
  {
    id: '4',
    title: '黄皮显白口红合集，这8支真的绝',
    coverImage: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop',
    author: '口红控小王',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
    likes: 22150,
    collects: 8920,
    comments: 1205,
    tags: ['口红', '显白', '黄皮友好'],
    category: '美妆护肤',
    publishTime: '5天前',
    growthRate: 178
  },
  {
    id: '5',
    title: '上海探店｜这家brunch真的绝了',
    coverImage: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=400&fit=crop',
    author: '美食探索家',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: 6780,
    collects: 2340,
    comments: 345,
    tags: ['上海美食', 'brunch', '探店'],
    category: '美食探店',
    publishTime: '2天前',
    growthRate: 67
  },
  {
    id: '6',
    title: '小个子穿搭法则，显高10cm不是梦',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
    author: '穿搭博主小李',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    likes: 18760,
    collects: 7230,
    comments: 678,
    tags: ['小个子穿搭', '显高', '穿搭技巧'],
    category: '时尚穿搭',
    publishTime: '3天前',
    growthRate: 145
  }
]

const categories = ['全部', '美妆护肤', '时尚穿搭', '美食探店', '旅行攻略', '健身运动', '家居生活']

const hotTopics = [
  { topic: '夏日防晒', count: 12580, trend: 'up' },
  { topic: '早八妆容', count: 8930, trend: 'up' },
  { topic: '油痘肌护肤', count: 15230, trend: 'up' },
  { topic: '显白口红', count: 22150, trend: 'up' },
  { topic: '小个子穿搭', count: 18760, trend: 'up' },
  { topic: '平价好物', count: 9870, trend: 'down' },
]

const contentPatterns = [
  {
    title: '真实测评类',
    desc: '亲测产品效果，分享真实体验',
    engagement: '高互动',
    tips: ['使用前后对比', '详细使用感受', '优缺点分析']
  },
  {
    title: '干货教程类',
    desc: '步骤清晰，易学易懂的教程',
    engagement: '高收藏',
    tips: ['步骤分解', '配图说明', '注意事项']
  },
  {
    title: '好物分享类',
    desc: '推荐优质产品，分享购买心得',
    engagement: '高转化',
    tips: ['价格信息', '购买渠道', '使用场景']
  },
  {
    title: '经验总结类',
    desc: '总结个人经验，提供参考价值',
    engagement: '高关注',
    tips: ['亲身经历', '避坑指南', '建议总结']
  }
]

export default function TrendAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [trendingPosts, setTrendingPosts] = useState<TrendData[]>(mockTrends)
  
  useEffect(() => {
    // 从API获取爆款数据
    fetch(`${API_BASE_URL}/api/trends`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTrendingPosts(data.map((post: any) => ({
            ...post,
            category: '美妆护肤',
            publishTime: '2天前',
            growthRate: Math.floor(Math.random() * 200) + 50
          })))
        }
      })
      .catch(err => console.error('Failed to load trends:', err))
  }, [])

  const filteredTrends = trendingPosts.filter(trend => {
    const matchesCategory = selectedCategory === '全部' || trend.category === selectedCategory
    const matchesSearch = trend.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trend.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#FF2442]" />
            爆款内容分析
          </h2>
          <p className="text-gray-500 text-sm mt-1">分析热门内容趋势，获取创作灵感</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder="搜索爆款内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-10 w-64 rounded-full border-gray-200"
            />
          </div>
          <Button variant="outline" className="rounded-full">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
          <TabsTrigger value="trends" className="rounded-full data-[state=active]:bg-[#FF2442] data-[state=active]:text-white">
            热门爆款
          </TabsTrigger>
          <TabsTrigger value="topics" className="rounded-full data-[state=active]:bg-[#FF2442] data-[state=active]:text-white">
            热门话题
          </TabsTrigger>
          <TabsTrigger value="patterns" className="rounded-full data-[state=active]:bg-[#FF2442] data-[state=active]:text-white">
            内容模式
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="mt-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === category
                    ? "bg-[#FF2442] text-white"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Trends Grid */}
          <div className="grid grid-cols-3 gap-4">
            {filteredTrends.map((trend) => (
              <Card key={trend.id} className="border-0 shadow-sm card-hover overflow-hidden">
                <div className="relative aspect-square">
                  <img 
                    src={trend.coverImage} 
                    alt={trend.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-[#FF2442] text-white text-xs">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +{trend.growthRate}%
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-black/60 text-white text-xs">
                      {trend.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{trend.title}</h3>
                  
                  {/* Author */}
                  <div className="flex items-center gap-2 mb-3">
                    <img 
                      src={trend.authorAvatar} 
                      alt={trend.author}
                      className="w-5 h-5 rounded-full"
                    />
                    <span className="text-xs text-gray-500">{trend.author}</span>
                    <span className="text-xs text-gray-400">· {trend.publishTime}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> 
                      {trend.likes > 10000 ? `${(trend.likes/10000).toFixed(1)}w` : trend.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bookmark className="w-3 h-3" /> 
                      {trend.collects > 10000 ? `${(trend.collects/10000).toFixed(1)}w` : trend.collects}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> 
                      {trend.comments}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {trend.tags.map(tag => (
                      <span key={tag} className="text-xs bg-[#FFF0F2] text-[#FF2442] px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="topics" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Hot Topics List */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#FF2442]" />
                  热门话题排行
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {hotTopics.map((topic, index) => (
                    <div key={topic.topic} className="flex items-center gap-4">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
                        index < 3 ? "bg-[#FF2442] text-white" : "bg-gray-100 text-gray-500"
                      )}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">#{topic.topic}</p>
                        <p className="text-xs text-gray-500">{topic.count.toLocaleString()} 篇笔记</p>
                      </div>
                      <Badge variant="outline" className={cn(
                        "text-xs",
                        topic.trend === 'up' ? "text-green-500 border-green-200" : "text-red-500 border-red-200"
                      )}>
                        {topic.trend === 'up' ? '↑' : '↓'} 热度
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Topic Insights */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-amber-500" />
                  话题洞察
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-[#FFF0F2] to-[#FFF8F9] rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-[#FF2442]" />
                    <span className="font-medium text-gray-900">最佳发布时间</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    美妆护肤类内容在 <span className="text-[#FF2442] font-medium">晚上8-10点</span> 发布效果最佳，
                    此时用户活跃度高，互动率提升 <span className="text-[#FF2442] font-medium">35%</span>
                  </p>
                </div>
                
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-900">内容长度建议</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    爆款笔记平均字数 <span className="text-blue-500 font-medium">300-500字</span>，
                    配图 <span className="text-blue-500 font-medium">6-9张</span> 时互动率最高
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight className="w-4 h-4 text-amber-500" />
                    <span className="font-medium text-gray-900">增长趋势</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    本周 <span className="text-amber-500 font-medium">护肤routine</span> 话题增长最快，
                    相关笔记平均点赞数上涨 <span className="text-amber-500 font-medium">67%</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <div className="grid grid-cols-2 gap-4">
            {contentPatterns.map((pattern) => (
              <Card key={pattern.title} className="border-0 shadow-sm card-hover">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900">{pattern.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{pattern.desc}</p>
                    </div>
                    <Badge className="bg-[#FF2442]/10 text-[#FF2442]">
                      {pattern.engagement}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-xs text-gray-400 uppercase tracking-wide">创作要点</p>
                    {pattern.tips.map((tip, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-[#FF2442] rounded-full"></div>
                        {tip}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
