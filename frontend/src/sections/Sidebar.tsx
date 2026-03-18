import { 
  LayoutDashboard, 
  PenTool, 
  TrendingUp, 
  Send, 
  BarChart3, 
  Settings 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ViewType } from '@/App'

interface SidebarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

const menuItems = [
  { id: 'dashboard' as ViewType, label: '首页概览', icon: LayoutDashboard },
  { id: 'create' as ViewType, label: '内容创作', icon: PenTool },
  { id: 'trends' as ViewType, label: '爆款分析', icon: TrendingUp },
  { id: 'publish' as ViewType, label: '发布管理', icon: Send },
  { id: 'stats' as ViewType, label: '数据统计', icon: BarChart3 },
]

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-[#FF2442] to-[#FF6B7A] rounded-lg flex items-center justify-center mr-3">
          <span className="text-white font-bold text-sm">AI</span>
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 text-sm">AI小红书助手</h1>
          <p className="text-xs text-gray-400">智能内容创作平台</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-gradient-to-r from-[#FFF0F2] to-transparent text-[#FF2442] border-l-2 border-[#FF2442]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-[#FF2442]" : "text-gray-400"
                )} />
                {item.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
          <Settings className="w-5 h-5 text-gray-400" />
          账号设置
        </button>
        
        {/* User Profile */}
        <div className="mt-4 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#FFF0F2] to-[#FFF8F9] rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF2442] to-[#FF6B7A] flex items-center justify-center">
            <span className="text-white font-medium text-sm">用</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">创作者账号</p>
            <p className="text-xs text-gray-500 truncate">已连接小红书</p>
          </div>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        </div>
      </div>
    </aside>
  )
}
