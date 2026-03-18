import { Bell, Search, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="搜索内容、话题、爆款..."
            className="pl-10 pr-4 h-10 bg-gray-50 border-0 focus:bg-white focus:ring-2 focus:ring-[#FF2442]/20 rounded-full text-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Help */}
        <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
          <HelpCircle className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF2442] text-[10px]">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 border-b border-gray-100">
              <p className="font-medium text-sm">通知消息</p>
            </div>
            <div className="max-h-64 overflow-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <p className="text-sm font-medium">内容生成完成</p>
                <p className="text-xs text-gray-500">您的夏日防晒笔记已生成完毕，请查看预览</p>
                <p className="text-xs text-gray-400">2分钟前</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <p className="text-sm font-medium">发布成功</p>
                <p className="text-xs text-gray-gray-500">您的笔记已成功发布到小红书</p>
                <p className="text-xs text-gray-400">1小时前</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <p className="text-sm font-medium">发现新爆款</p>
                <p className="text-xs text-gray-500">检测到3篇与您领域相关的新爆款文章</p>
                <p className="text-xs text-gray-400">3小时前</p>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Quick Create Button */}
        <Button 
          className="bg-[#FF2442] hover:bg-[#E0203C] text-white rounded-full px-5 h-10 text-sm font-medium"
        >
          + 快速创作
        </Button>
      </div>
    </header>
  )
}
