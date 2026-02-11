import React from 'react';
import {
  MessageSquare,
  Bot,
  Users,
  CreditCard,
  LogOut,
  Zap,
  Settings,
  HelpCircle,
  RotateCcw,
  Shield
} from 'lucide-react';
import type { Page } from '@/app/App';
import { useMe } from '@/shared/api/hooks';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onLogout?: () => void;
  onRestartOnboarding?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout, onRestartOnboarding }) => {
  const { data: user } = useMe();

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';

  const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
    { id: 'inbox', label: 'Входящие', icon: MessageSquare },
    { id: 'agent', label: 'AI Агент', icon: Bot },
    { id: 'integrations', label: 'Интеграции', icon: Zap },
    { id: 'team', label: 'Команда', icon: Users },
    { id: 'billing', label: 'Тарифы', icon: CreditCard },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: Shield });
  }

  return (
    <aside className="w-[260px] glass-panel flex flex-col h-full shrink-0 z-50">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20">
          <Zap className="w-4 h-4 text-white fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-white tracking-wide leading-none">NotPeople</span>
          <span className="text-[10px] text-indigo-300/70 font-medium mt-0.5 tracking-wider">Business OS</span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Платформа</div>
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden ${isActive
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/5'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5'
                }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-indigo-500 rounded-r-full shadow-[0_0_10px_#6366f1]"></div>
              )}
              <item.icon className={`w-4 h-4 transition-colors ${isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.id === 'inbox' && (
                <span className="ml-auto bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded min-w-[20px] text-center shadow-[0_0_10px_rgba(99,102,241,0.2)]">3</span>
              )}
            </button>
          );
        })}

        <div className="mt-8 px-3 py-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Система</div>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-all">
          <Settings className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium">Настройки</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-all">
          <HelpCircle className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium">Помощь</span>
        </button>
        <button
          onClick={onRestartOnboarding}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-zinc-500" />
          <span className="text-sm font-medium">Заново (Онбординг)</span>
        </button>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white font-bold text-xs ring-2 ring-transparent group-hover:ring-zinc-700 transition-all">
            {user?.full_name?.charAt(0) || user?.email?.charAt(0) || '?'}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs font-semibold text-zinc-200 truncate">{user?.full_name || 'User'}</p>
            <p className="text-[10px] text-zinc-500 truncate group-hover:text-zinc-400">{user?.email || 'Loading...'}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onLogout?.();
            }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
            title="Выйти"
          >
            <LogOut className="w-4 h-4 text-zinc-600 hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </aside>
  );
};