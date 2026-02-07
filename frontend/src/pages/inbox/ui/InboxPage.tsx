import React, { useState, useEffect } from 'react';
import {
  MoreHorizontal,
  Paperclip,
  MessageCircle,
  ShoppingBag,
  Globe,
  User,
  Search,
  Instagram,
  CheckCheck,
  ArrowRight,
  Info,
  Sparkles,
  Zap,
  Loader2
} from 'lucide-react';
import { useChats, useChat, useAddMessage, useUpdateChatStatus, useUpdateNotes } from '@/shared/api/hooks';
import type { Chat } from '@/shared/api/client';

type ChannelType = 'telegram' | 'avito' | 'web' | 'whatsapp' | 'instagram' | 'vk';

export const InboxPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [inputText, setInputText] = useState('');
  const [showQuickStart, setShowQuickStart] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks
  const { data: chats = [], isLoading: chatsLoading, error: chatsError } = useChats();
  const { data: selectedChat, isLoading: chatLoading } = useChat(selectedChatId);
  const addMessageMutation = useAddMessage();
  const updateStatusMutation = useUpdateChatStatus();
  const updateNotesMutation = useUpdateNotes();

  // Select first chat when chats load
  useEffect(() => {
    if (chats.length > 0 && !selectedChatId) {
      setSelectedChatId(chats[0].id);
    }
  }, [chats, selectedChatId]);

  // Filter chats by search
  const filteredChats = chats.filter(chat =>
    chat.client?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSendMessage = async () => {
    if (!inputText.trim() || !selectedChatId) return;

    try {
      await addMessageMutation.mutateAsync({
        chatId: selectedChatId,
        content: inputText
      });
      setInputText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const toggleAIStatus = async () => {
    if (!selectedChat) return;

    const newStatus = selectedChat.status === 'AI' ? 'HUMAN' : 'AI';
    try {
      await updateStatusMutation.mutateAsync({
        chatId: selectedChat.id,
        status: newStatus
      });
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleNotesChange = async (notes: string) => {
    if (!selectedChatId) return;
    try {
      await updateNotesMutation.mutateAsync({
        chatId: selectedChatId,
        notes
      });
    } catch (error) {
      console.error('Failed to update notes:', error);
    }
  };

  const getChannelIcon = (type: ChannelType) => {
    switch (type) {
      case 'telegram': return <MessageCircle className="w-3.5 h-3.5" />;
      case 'avito': return <ShoppingBag className="w-3.5 h-3.5" />;
      case 'web': return <Globe className="w-3.5 h-3.5" />;
      case 'whatsapp': return <MessageCircle className="w-3.5 h-3.5" />;
      case 'instagram': return <Instagram className="w-3.5 h-3.5" />;
      case 'vk': return <span className="text-[10px] font-bold">VK</span>;
      default: return <MessageCircle className="w-3.5 h-3.5" />;
    }
  };

  const getLastMessage = (chat: Chat) => {
    if (chat.messages.length === 0) return '';
    return chat.messages[chat.messages.length - 1].content;
  };

  const getLastMessageTime = (chat: Chat) => {
    if (chat.messages.length === 0) return '';
    const date = new Date(chat.messages[chat.messages.length - 1].created_at);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isLastFromBusiness = (chat: Chat) => {
    if (chat.messages.length === 0) return false;
    const lastMsg = chat.messages[chat.messages.length - 1];
    return lastMsg.role === 'assistant';
  };

  if (chatsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (chatsError) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4">
        <div className="text-red-400">Ошибка загрузки чатов</div>
        <div className="text-zinc-500 text-sm">Убедитесь, что backend сервер запущен</div>
      </div>
    );
  }

  return (
    <div className="flex h-full relative overflow-hidden">

      {/* 1. Chat List Panel (Glass) */}
      <div className="w-[320px] glass-panel border-r border-white/5 flex flex-col h-full z-10 backdrop-blur-xl">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="font-semibold text-lg text-white tracking-tight">Входящие</h2>
            <div className="px-2 py-0.5 rounded-full bg-white/10 text-xs font-bold text-zinc-300 border border-white/5">{filteredChats.length}</div>
          </div>
          <div className="relative group">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/20 border border-white/5 rounded-xl pl-9 py-2 text-sm focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all placeholder:text-zinc-600 text-zinc-200"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-6 text-center text-zinc-500 text-sm">
              {searchQuery ? 'Чаты не найдены' : 'Нет чатов'}
            </div>
          ) : (
            filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`px-4 py-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 group relative ${selectedChatId === chat.id
                  ? 'bg-white/5'
                  : 'bg-transparent'
                  }`}
              >
                {selectedChatId === chat.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-indigo-500 to-purple-500 shadow-[0_0_10px_#6366f1]"></div>
                )}

                <div className="flex justify-between items-start mb-1.5">
                  <span className={`text-sm font-medium ${selectedChatId === chat.id ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {chat.client?.name || 'Unknown'}
                  </span>
                  <span className="text-[10px] text-zinc-600 font-medium">{getLastMessageTime(chat)}</span>
                </div>

                <p className={`text-xs truncate mb-3 leading-relaxed ${selectedChatId === chat.id ? 'text-zinc-300' : 'text-zinc-500 group-hover:text-zinc-400'}`}>
                  {isLastFromBusiness(chat) && <span className="text-indigo-400/80">Вы: </span>}
                  {getLastMessage(chat)}
                </p>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 border border-white/5 text-zinc-400">
                    {getChannelIcon(chat.platform as ChannelType)}
                    {chat.platform}
                  </div>

                  {chat.status === 'AI' && (
                    <span className="ml-auto text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center gap-1 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 shadow-[0_0_8px_rgba(99,102,241,0.1)]">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> AI
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-transparent relative z-0">

        {/* Quick Start Guide Overlay (Floating Glass) */}
        {showQuickStart && (
          <div className="absolute top-6 left-6 right-6 glass-card p-4 rounded-2xl z-20 flex items-center justify-between animate-in slide-in-from-top-4 duration-500 border-indigo-500/20">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Info className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Добро пожаловать в Ethereal Mode</h3>
                <p className="text-xs text-zinc-400">У вас осталось 3 дня. Подключите Telegram и загрузите базу знаний.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-xs font-bold text-zinc-400 hover:text-white transition-colors" onClick={() => setShowQuickStart(false)}>Закрыть</button>
              <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]">Перейти к настройке</button>
            </div>
          </div>
        )}

        {selectedChat ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] shrink-0 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-xl flex items-center justify-center text-zinc-400 font-bold border border-white/5 shadow-inner">
                  {selectedChat.client?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-100 text-sm">{selectedChat.client?.name || 'Unknown'}</h3>
                  <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold uppercase tracking-wide drop-shadow-[0_0_3px_rgba(52,211,153,0.5)]">
                    Онлайн
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  onClick={toggleAIStatus}
                  className={`cursor-pointer flex items-center gap-3 px-3 py-1.5 rounded-xl border transition-all select-none duration-300 ${selectedChat.status === 'AI' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/5 text-zinc-500 hover:border-white/20'}`}
                >
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_5px_currentColor] ${selectedChat.status === 'AI' ? 'bg-indigo-400 animate-pulse' : 'bg-zinc-600'}`}></div>
                  <span className="text-xs font-bold tracking-wide">
                    AI AGENT
                  </span>
                  {updateStatusMutation.isPending && <Loader2 className="w-3 h-3 animate-spin" />}
                </div>

                <button className="text-zinc-500 hover:text-zinc-300 hover:bg-white/5 p-2 rounded-lg transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {chatLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
                </div>
              ) : (
                selectedChat.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex w-full ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex max-w-[70%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'} gap-3 items-end group`}>
                      <div className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center text-[10px] font-bold overflow-hidden shadow-sm">
                        {msg.role === 'user' ? (
                          <div className="w-full h-full bg-zinc-900 border border-white/10 text-zinc-500 flex items-center justify-center">
                            {selectedChat.client?.name?.charAt(0) || '?'}
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white bg-gradient-to-br from-indigo-600 to-purple-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <div className={`px-5 py-3.5 text-sm leading-relaxed backdrop-blur-sm transition-all duration-300 hover:scale-[1.01] ${msg.role === 'user'
                        ? 'bg-zinc-900/60 text-zinc-200 border border-white/5 rounded-2xl rounded-bl-none shadow-sm'
                        : 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-100 border border-indigo-500/20 rounded-2xl rounded-br-none shadow-[0_0_15px_rgba(99,102,241,0.05)]'
                        }`}>
                        {msg.content}
                        <div className="text-[9px] mt-1.5 flex items-center justify-end gap-1 opacity-50 font-medium">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.role !== 'user' && <CheckCheck className="w-3 h-3" />}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
              <div className="relative flex items-end gap-2 p-2 bg-white/5 border border-white/10 rounded-2xl focus-within:ring-1 focus-within:ring-white/20 focus-within:border-white/20 transition-all shadow-inner">
                <button className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-white/5 rounded-xl transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <textarea
                    rows={1}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                    placeholder={selectedChat.status === 'AI' ? "Перехватить управление..." : "Написать сообщение..."}
                    className="w-full py-2 bg-transparent border-none focus:ring-0 text-sm resize-none placeholder:text-zinc-600 text-zinc-100"
                    style={{ minHeight: '40px' }}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-white text-black rounded-xl hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:shadow-none active:scale-95"
                  disabled={!inputText.trim() || addMessageMutation.isPending}
                >
                  {addMessageMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-zinc-500">
            Выберите чат для начала общения
          </div>
        )}
      </div>

      {/* 3. Client Details Sidebar (Glass) */}
      {selectedChat && (
        <div className="w-[300px] glass-panel border-l border-white/5 flex flex-col z-10">
          <div className="p-6 border-b border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-zinc-100">Профиль</h3>
              <button className="text-xs text-indigo-400 font-bold hover:text-indigo-300 hover:underline">Изменить</button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 border border-white/10 font-bold text-lg shadow-inner">
                  {selectedChat.client?.name?.charAt(0) || '?'}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedChat.client?.name || 'Unknown'}</p>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">ID: {selectedChat.client?.id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">Заказы</div>
                  <div className="text-sm font-bold text-white">{selectedChat.client?.history?.length || 0}</div>
                </div>
                <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                  <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-1">LTV</div>
                  <div className="text-sm font-bold text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]">—</div>
                </div>
              </div>

              {selectedChat.client?.phone && (
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-xs text-zinc-500">Телефон</span>
                  <span className="text-xs font-mono font-medium text-zinc-300">{selectedChat.client.phone}</span>
                </div>
              )}

              {selectedChat.client?.email && (
                <div className="flex items-center justify-between py-3 border-b border-white/5">
                  <span className="text-xs text-zinc-500">Email</span>
                  <span className="text-xs font-medium text-zinc-300 truncate max-w-[150px]">{selectedChat.client.email}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            <div className="mb-6">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                <Zap className="w-3 h-3 text-yellow-500" /> Заметки
              </label>
              <textarea
                className="w-full text-sm p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-100/80 focus:outline-none focus:ring-1 focus:ring-yellow-500/50 min-h-[100px] resize-none placeholder:text-yellow-500/30"
                defaultValue={selectedChat.client?.notes || ''}
                placeholder="Добавить заметку..."
                onBlur={(e) => handleNotesChange(e.target.value)}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 block">История событий</label>
              <div className="space-y-4 relative pl-2">
                <div className="absolute left-[11px] top-2 bottom-2 w-[1px] bg-white/10"></div>
                {selectedChat.client?.history && selectedChat.client.history.length > 0 ? (
                  selectedChat.client.history.map((item, i) => (
                    <div key={i} className="flex gap-3 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 ring-4 ring-zinc-900 shrink-0 z-10 mt-1.5"></div>
                      <div>
                        <p className="text-xs font-medium text-zinc-300">{item}</p>
                        <p className="text-[10px] text-zinc-600">—</p>
                      </div>
                    </div>
                  ))
                ) : <span className="text-xs text-zinc-600 italic">История пуста</span>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};