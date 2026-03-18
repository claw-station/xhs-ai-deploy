import { useState } from 'react'
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  MoreHorizontal,
  Edit3,
  Trash2,
  Play,
  Eye,
  Heart
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import type { GeneratedContent } from '@/App'
import { cn } from '@/lib/utils'

interface PublishManagerProps {
  contents: GeneratedContent[]
  onDelete: (id: string) => void
  onPublish: (id: string) => void
}

export default function PublishManager({ contents, onDelete, onPublish }: PublishManagerProps) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<string | null>(null)

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(contents.map(c => c.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id])
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id))
    }
  }

  const handleDelete = (id: string) => {
    setItemToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete)
      toast.success('内容已删除')
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleBatchDelete = () => {
    if (selectedItems.length > 0) {
      selectedItems.forEach(id => onDelete(id))
      setSelectedItems([])
      toast.success(`已删除 ${selectedItems.length} 项内容`)
    }
  }

  const handlePublishNow = (id: string) => {
    onPublish(id)
    toast.success('内容已提交发布！')
  }

  const getStatusBadge = (status: GeneratedContent['status']) => {
    switch (status) {
      case 'draft':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-600">草稿</Badge>
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-600 hover:bg-amber-100">待发布</Badge>
      case 'published':
        return <Badge className="bg-green-100 text-green-600 hover:bg-green-100">已发布</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-600 hover:bg-red-100">发布失败</Badge>
    }
  }

  const getStatusIcon = (status: GeneratedContent['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4 text-gray-400" />
      case 'pending':
        return <Clock className="w-4 h-4 text-amber-500" />
      case 'published':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Send className="w-6 h-6 text-[#FF2442]" />
            发布管理
          </h2>
          <p className="text-gray-500 text-sm mt-1">管理您的内容草稿和已发布内容</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedItems.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={handleBatchDelete}
              className="rounded-full"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              删除选中 ({selectedItems.length})
            </Button>
          )}
        </div>
      </div>

      {/* Content List */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          {/* Table Header */}
          <div className="flex items-center gap-4 p-4 border-b border-gray-100 bg-gray-50/50">
            <Checkbox 
              checked={selectedItems.length === contents.length && contents.length > 0}
              onCheckedChange={handleSelectAll}
            />
            <div className="flex-1 grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
              <div className="col-span-5">内容</div>
              <div className="col-span-2">状态</div>
              <div className="col-span-2">创建时间</div>
              <div className="col-span-2">数据</div>
              <div className="col-span-1">操作</div>
            </div>
          </div>

          {/* Table Body */}
          {contents.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {contents.map((content) => (
                <div 
                  key={content.id} 
                  className={cn(
                    "flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors",
                    selectedItems.includes(content.id) && "bg-[#FFF0F2]/50"
                  )}
                >
                  <Checkbox 
                    checked={selectedItems.includes(content.id)}
                    onCheckedChange={(checked) => handleSelectItem(content.id, checked as boolean)}
                  />
                  <div className="flex-1 grid grid-cols-12 gap-4 items-center">
                    {/* Content Info */}
                    <div className="col-span-5 flex items-center gap-3">
                      {content.coverImage ? (
                        <img 
                          src={content.coverImage} 
                          alt={content.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{content.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {content.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-xs text-[#FF2442] bg-[#FFF0F2] px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center gap-2">
                      {getStatusIcon(content.status)}
                      {getStatusBadge(content.status)}
                    </div>

                    {/* Create Time */}
                    <div className="col-span-2 text-sm text-gray-500">
                      {content.createdAt.toLocaleDateString()}
                      <br />
                      <span className="text-xs text-gray-400">
                        {content.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="col-span-2">
                      {content.stats ? (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {content.stats.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {content.stats.likes}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit3 className="w-4 h-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          {content.status === 'draft' && (
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              onClick={() => handlePublishNow(content.id)}
                            >
                              <Play className="w-4 h-4 mr-2" />
                              立即发布
                            </DropdownMenuItem>
                          )}
                          {content.status === 'published' && (
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="w-4 h-4 mr-2" />
                              查看详情
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-500"
                            onClick={() => handleDelete(content.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 font-medium mb-1">暂无内容</h4>
              <p className="text-sm text-gray-500">开始创作您的第一篇小红书内容吧</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              删除后内容将无法恢复，是否确认删除？
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              确认删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
