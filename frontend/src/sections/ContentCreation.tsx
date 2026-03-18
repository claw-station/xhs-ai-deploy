import { useState, useRef, useEffect } from 'react'
import { 
  Sparkles, 
  Loader2, 
  ArrowRight, 
  Check,
  Image as ImageIcon,
  X,
  Send,
  ChevronLeft,
  Wand2,
  TrendingUp,
  Heart,
  Bookmark
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import type { GeneratedContent, TrendingPost, ViewType } from '@/App'
import { cn } from '@/lib/utils'
import { API_BASE_URL } from '@/config'

interface ContentCreationProps {
  onSave: (content: GeneratedContent) => void
  onNavigate: (view: ViewType) => void
}

type CreationStep = 'input' | 'analyzing' | 'selecting' | 'generating' | 'editing'

const quickTags = ['美妆护肤', '时尚穿搭', '美食探店', '旅行攻略', '健身运动', '读书学习', '家居生活', '职场成长']

const mockTrendingPosts: TrendingPost[] = [
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
    highlights: ['真实测评', '性价比超高', '学生党友好']
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
    highlights: ['简单易上手', '新手友好', '持妆一整天']
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
    highlights: ['亲测有效', '成分党必看', '医学护肤']
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
    highlights: ['试色真实', '大牌平替', '持久不脱色']
  },
  {
    id: '5',
    title: '熬夜党眼霜推荐，黑眼圈细纹说拜拜',
    coverImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop',
    author: '熬夜修复师',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    likes: 9870,
    collects: 3780,
    comments: 445,
    tags: ['眼霜', '抗老', '黑眼圈'],
    highlights: ['熬夜救星', '淡纹有效', '性价比高']
  },
  {
    id: '6',
    title: '学生党护肤全套不过百，平价好物分享',
    coverImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop',
    author: '省钱小能手',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
    likes: 18760,
    collects: 9230,
    comments: 678,
    tags: ['学生党', '平价护肤', '好物分享'],
    highlights: ['白菜价', '效果惊艳', '无限回购']
  }
]

const generateMockContent = (topic: string, _selectedTrends: TrendingPost[]): Partial<GeneratedContent> => {
  const titles = [
    `${topic}必看！这份攻略帮你避坑省钱`,
    `被问爆的${topic}秘籍，今天全分享`,
    `${topic}新手入门，看这一篇就够了`,
    `亲测有效！${topic}的正确打开方式`,
    `${topic}干货合集，建议收藏`
  ]
  
  const contents = [
    `姐妹们，今天来分享我的${topic}心得！\n\n✨首先，一定要做好功课，不要盲目跟风\n\n💡我的建议是：\n1. 先了解自己的需求\n2. 多看真实测评\n3. 从小样开始尝试\n\n🌟亲测好用的几个小技巧：\n• 坚持是关键\n• 记录变化过程\n• 及时调整方法\n\n希望这篇分享对你们有帮助！记得点赞收藏哦～`,
    
    `关于${topic}，我真的有太多话要说！\n\n🔥踩过无数坑后总结的经验：\n\n❌不要这样做：\n• 盲目跟风\n• 期望过高\n• 三天打鱼两天晒网\n\n✅正确做法：\n• 制定合理计划\n• 循序渐进\n• 保持耐心\n\n💕坚持下来的效果真的惊艳！\n\n有问题评论区留言，看到都会回复～`,
    
    `${topic}入门指南，新手必看！\n\n📌准备工作：\n了解基础知识和注意事项\n\n📌执行步骤：\n1. 第一步：做好前期准备\n2. 第二步：按计划执行\n3. 第三步：及时调整优化\n\n📌常见误区：\n很多人一开始就错了...\n\n💫我的亲身经历告诉大家，方法对了事半功倍！\n\n觉得有用的话点个❤️吧！`
  ]
  
  const tags = [
    [topic, '干货分享', '新手必看'],
    [topic, '经验分享', '避坑指南'],
    [topic, '好物推荐', '真实测评'],
    [topic, '日常分享', '生活记录']
  ]
  
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    content: contents[Math.floor(Math.random() * contents.length)],
    tags: tags[Math.floor(Math.random() * tags.length)],
    images: []
  }
}

export default function ContentCreation({ onSave, onNavigate }: ContentCreationProps) {
  const [step, setStep] = useState<CreationStep>('input')
  const [inputText, setInputText] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [analyzingProgress, setAnalyzingProgress] = useState(0)
  const [selectedTrends, setSelectedTrends] = useState<TrendingPost[]>([])
  const [, setGeneratedContent] = useState<Partial<GeneratedContent> | null>(null)
  const [editingContent, setEditingContent] = useState<GeneratedContent | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Analyzing progress animation
  useEffect(() => {
    if (step === 'analyzing') {
      const interval = setInterval(() => {
        setAnalyzingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStep('selecting'), 500)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [step])

  const handleStartAnalysis = () => {
    if (!inputText.trim()) {
      toast.error('请先描述您的内容需求')
      return
    }
    setAnalyzingProgress(0)
    setStep('analyzing')
  }

  const handleSelectTrend = (trend: TrendingPost) => {
    setSelectedTrends(prev => {
      const exists = prev.find(t => t.id === trend.id)
      if (exists) {
        return prev.filter(t => t.id !== trend.id)
      }
      if (prev.length >= 3) {
        toast.info('最多选择3篇参考爆款')
        return prev
      }
      return [...prev, trend]
    })
  }

  const handleGenerate = async () => {
    if (selectedTrends.length === 0) {
      toast.error('请至少选择一篇爆款文章作为参考')
      return
    }
    setStep('generating')
    
    try {
      const topic = selectedTags[0] || inputText.slice(0, 10)
      
      // 调用真实API
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: inputText,
          category: topic
        })
      })
      
      if (!response.ok) {
        throw new Error('生成失败')
      }
      
      const generated = await response.json()
      setGeneratedContent(generated)
      
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        title: generated.title || '',
        content: generated.content || '',
        images: [],
        tags: generated.tags || [],
        status: 'draft',
        createdAt: new Date()
      }
      
      setEditingContent(newContent)
      setStep('editing')
      toast.success('内容生成成功！')
    } catch (error) {
      toast.error('生成失败，请检查API配置')
      setStep('selecting')
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !editingContent) return
    
    const newImages: string[] = []
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push(e.target.result as string)
          if (newImages.length === files.length) {
            setEditingContent(prev => prev ? {
              ...prev,
              images: [...prev.images, ...newImages],
              coverImage: prev.coverImage || newImages[0]
            } : null)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (index: number) => {
    if (!editingContent) return
    setEditingContent(prev => prev ? {
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      coverImage: prev.coverImage === prev.images[index] 
        ? (prev.images.filter((_, i) => i !== index)[0] || '')
        : prev.coverImage
    } : null)
  }

  const handleSave = () => {
    if (!editingContent) return
    if (!editingContent.title.trim() || !editingContent.content.trim()) {
      toast.error('标题和内容不能为空')
      return
    }
    
    onSave(editingContent)
    toast.success('内容已保存到草稿箱')
    onNavigate('publish')
  }

  const handlePublish = () => {
    if (!editingContent) return
    if (!editingContent.title.trim() || !editingContent.content.trim()) {
      toast.error('标题和内容不能为空')
      return
    }
    
    const toPublish = { ...editingContent, status: 'pending' as const }
    onSave(toPublish)
    toast.success('内容已提交发布！')
    onNavigate('publish')
  }

  const renderInputStep = () => (
    <div className="max-w-3xl mx-auto animate-fadeIn">
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#FF2442] to-[#FF6B7A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">描述你的内容需求</h2>
            <p className="text-gray-500">AI将帮你找到相似爆款并生成优质内容</p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                你想创作什么内容？
              </label>
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="例如：我想写一篇关于夏日防晒的小红书笔记，目标受众是18-25岁的女大学生，希望分享一些平价好用的防晒产品..."
                className="min-h-[140px] resize-none border-gray-200 focus:border-[#FF2442] focus:ring-[#FF2442]/20 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                选择内容类别（可选）
              </label>
              <div className="flex flex-wrap gap-2">
                {quickTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      )
                    }}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                      selectedTags.includes(tag)
                        ? "bg-[#FF2442] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleStartAnalysis}
              className="w-full bg-[#FF2442] hover:bg-[#E0203C] text-white h-12 rounded-xl text-base font-medium"
            >
              <Wand2 className="w-5 h-5 mr-2" />
              开始AI分析
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAnalyzingStep = () => (
    <div className="max-w-2xl mx-auto text-center py-20 animate-fadeIn">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-[#FF2442]/20 rounded-full animate-pulse-ring"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF2442] to-[#FF6B7A] rounded-full flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-white animate-spin" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">正在分析爆款内容...</h2>
      <p className="text-gray-500 mb-8">AI正在搜索相似领域的爆款文章，提取高互动元素</p>
      <div className="max-w-md mx-auto">
        <Progress value={analyzingProgress} className="h-2" />
        <p className="text-sm text-gray-400 mt-2">{Math.min(Math.round(analyzingProgress), 100)}%</p>
      </div>
    </div>
  )

  const renderSelectingStep = () => (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#FF2442]" />
            发现相似爆款文章
          </h2>
          <p className="text-gray-500 text-sm mt-1">选择1-3篇作为参考，AI将学习其成功模式</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            已选择 {selectedTrends.length}/3 篇
          </span>
          <Button
            variant="outline"
            onClick={() => setStep('input')}
            className="rounded-full"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            返回
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={selectedTrends.length === 0}
            className="bg-[#FF2442] hover:bg-[#E0203C] text-white rounded-full"
          >
            生成内容
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {mockTrendingPosts.map((post) => {
          const isSelected = selectedTrends.find(t => t.id === post.id)
          return (
            <Card 
              key={post.id}
              onClick={() => handleSelectTrend(post)}
              className={cn(
                "border-2 cursor-pointer card-hover overflow-hidden",
                isSelected 
                  ? "border-[#FF2442] ring-2 ring-[#FF2442]/20" 
                  : "border-transparent hover:border-gray-200"
              )}
            >
              <div className="relative aspect-square">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute inset-0 bg-[#FF2442]/20 flex items-center justify-center">
                    <div className="w-12 h-12 bg-[#FF2442] rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge className="bg-black/60 text-white text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    爆款
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 line-clamp-2 mb-2">{post.title}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> {post.likes > 10000 ? `${(post.likes/10000).toFixed(1)}w` : post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="w-3 h-3" /> {post.collects > 10000 ? `${(post.collects/10000).toFixed(1)}w` : post.collects}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {post.highlights.map(highlight => (
                    <span key={highlight} className="text-xs bg-[#FFF0F2] text-[#FF2442] px-2 py-0.5 rounded">
                      {highlight}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )

  const renderGeneratingStep = () => (
    <div className="max-w-2xl mx-auto text-center py-20 animate-fadeIn">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF2442] to-[#FF6B7A] rounded-full opacity-20 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF2442] to-[#FF6B7A] rounded-full flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white animate-pulse" />
        </div>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">正在生成内容...</h2>
      <p className="text-gray-500">AI正在结合爆款模式，为您创作优质小红书内容</p>
    </div>
  )

  const renderEditingStep = () => {
    if (!editingContent) return null
    
    return (
      <div className="animate-fadeIn h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep('selecting')}
              className="rounded-full"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              返回
            </Button>
            <h2 className="text-lg font-bold text-gray-900">编辑内容</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleSave}
              className="rounded-full"
            >
              保存草稿
            </Button>
            <Button
              onClick={handlePublish}
              className="bg-[#FF2442] hover:bg-[#E0203C] text-white rounded-full"
            >
              <Send className="w-4 h-4 mr-1" />
              发布到小红书
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 h-full">
          {/* Editor */}
          <div className="space-y-4 overflow-auto pr-2">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标题
                  </label>
                  <Input
                    value={editingContent.title}
                    onChange={(e) => setEditingContent(prev => prev ? { ...prev, title: e.target.value } : null)}
                    className="border-gray-200 focus:border-[#FF2442] focus:ring-[#FF2442]/20"
                    placeholder="输入标题..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    正文内容
                  </label>
                  <Textarea
                    value={editingContent.content}
                    onChange={(e) => setEditingContent(prev => prev ? { ...prev, content: e.target.value } : null)}
                    className="min-h-[300px] resize-none border-gray-200 focus:border-[#FF2442] focus:ring-[#FF2442]/20"
                    placeholder="输入内容..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    话题标签
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {editingContent.tags.map((tag, index) => (
                      <Badge 
                        key={index} 
                        variant="secondary"
                        className="bg-[#FFF0F2] text-[#FF2442] hover:bg-[#FFE0E4] cursor-pointer"
                        onClick={() => {
                          setEditingContent(prev => prev ? {
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index)
                          } : null)
                        }}
                      >
                        #{tag}
                        <X className="w-3 h-3 ml-1" />
                      </Badge>
                    ))}
                    <button
                      onClick={() => {
                        const newTag = prompt('输入新标签')
                        if (newTag && editingContent) {
                          setEditingContent(prev => prev ? {
                            ...prev,
                            tags: [...prev.tags, newTag]
                          } : null)
                        }
                      }}
                      className="px-3 py-1 rounded-full border border-dashed border-gray-300 text-gray-500 text-sm hover:border-[#FF2442] hover:text-[#FF2442] transition-colors"
                    >
                      + 添加标签
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图片
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {editingContent.images.map((img, index) => (
                      <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          onClick={() => handleRemoveImage(index)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                        {editingContent.coverImage === img && (
                          <div className="absolute top-1 left-1 bg-[#FF2442] text-white text-xs px-1.5 py-0.5 rounded">
                            封面
                          </div>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:border-[#FF2442] hover:text-[#FF2442] transition-colors"
                    >
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-xs mt-1">添加</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="bg-gray-100 rounded-2xl p-6 overflow-auto">
            <div className="max-w-[375px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-xl" style={{ aspectRatio: '9/16', maxHeight: '700px' }}>
              {/* Phone Header */}
              <div className="bg-black text-white px-6 py-2 flex items-center justify-between text-xs">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
              
              {/* XHS Content */}
              <div className="flex-1 overflow-auto hide-scrollbar">
                {/* User Info */}
                <div className="flex items-center gap-3 p-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2442] to-[#FF6B7A] flex items-center justify-center">
                    <span className="text-white font-medium text-sm">创</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">创作者账号</p>
                    <p className="text-xs text-gray-400">刚刚</p>
                  </div>
                  <button className="ml-auto px-4 py-1.5 bg-[#FF2442] text-white text-xs rounded-full">
                    关注
                  </button>
                </div>

                {/* Images */}
                {editingContent.images.length > 0 ? (
                  <div className="aspect-square bg-gray-100">
                    <img 
                      src={editingContent.images[0]} 
                      alt="" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-base mb-2">{editingContent.title || '标题'}</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{editingContent.content || '内容'}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {editingContent.tags.map((tag, index) => (
                      <span key={index} className="text-[#FF2442] text-sm">#{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-around py-4 border-t border-gray-100">
                  <button className="flex items-center gap-1 text-gray-600">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">点赞</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600">
                    <Bookmark className="w-5 h-5" />
                    <span className="text-sm">收藏</span>
                  </button>
                  <button className="flex items-center gap-1 text-gray-600">
                    <Send className="w-5 h-5" />
                    <span className="text-sm">分享</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">小红书预览效果</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {step === 'input' && renderInputStep()}
      {step === 'analyzing' && renderAnalyzingStep()}
      {step === 'selecting' && renderSelectingStep()}
      {step === 'generating' && renderGeneratingStep()}
      {step === 'editing' && renderEditingStep()}
    </div>
  )
}
