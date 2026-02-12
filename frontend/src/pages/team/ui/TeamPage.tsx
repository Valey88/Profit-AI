import React, { useState } from 'react';
import { Plus, Shield, MoreHorizontal, Clock, Smartphone, Trash2, X, Loader2 } from 'lucide-react';
import { useUsers, useInviteUser, useDeleteUser } from '@/shared/api/hooks';
import type { User } from '@/shared/api/client';

export const TeamPage: React.FC = () => {
  const { data: users, isLoading } = useUsers();
  const inviteUserMutation = useInviteUser();
  const deleteUserMutation = useDeleteUser();

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: '', full_name: '', role: 'viewer' });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await inviteUserMutation.mutateAsync(inviteForm);
      setIsInviteModalOpen(false);
      setInviteForm({ email: '', full_name: '', role: 'viewer' });
    } catch (error) {
      console.error('Failed to invite user:', error);
    }
  };

  const handleDelete = async (userId: number) => {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      try {
        await deleteUserMutation.mutateAsync(userId);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
      case 'admin':
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 w-fit text-xs font-medium border border-indigo-500/20">
            <Shield className="w-3 h-3" />
            {role === 'owner' ? 'Владелец' : 'Админ'}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-400 w-fit text-xs font-medium">
            <Smartphone className="w-3 h-3" />
            Оператор
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_currentColor]"></div>
          Активен
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 text-xs font-medium text-amber-500/80">
        <Clock className="w-3 h-3" />
        Ожидание
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-light text-white tracking-tight">Команда</h1>
            <p className="text-zinc-500 mt-2 text-sm">Управление доступом нейросети и людей.</p>
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-white text-black text-sm font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Пригласить
          </button>
        </div>

        <div className="glass-card rounded-3xl border border-white/10 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Пользователь</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Роль</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Статус</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Права</th>
                <th className="px-6 py-4 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users?.map((user: User) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm ring-2 ring-transparent shadow-lg">
                          {user.full_name?.[0] || user.email[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-zinc-100 text-sm">{user.full_name || 'Неизвестно'}</p>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    {getRoleBadge(user.role)}
                  </td>
                  <td className="px-6 py-5">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-xs text-zinc-400">
                      {user.role === 'owner' ? 'Полный доступ + Биллинг' : 'Только чаты'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right relative">
                    <div className="group/menu relative inline-block">
                      <button className="text-zinc-600 hover:text-white transition-colors p-2 rounded hover:bg-white/5">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden hidden group-hover/menu:block z-10">
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Удалить
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {users?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-zinc-500 text-sm">
                    Нет пользователей
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-bold text-lg text-white">Пригласить участника</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white placeholder-zinc-600"
                  placeholder="colleague@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Имя</label>
                <input
                  type="text"
                  required
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white placeholder-zinc-600"
                  placeholder="Иван Петров"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Роль</label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                  className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white"
                >
                  <option value="viewer">Оператор (Viewer)</option>
                  <option value="admin">Администратор</option>
                  <option value="owner">Владелец</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={inviteUserMutation.isPending}
                  className="px-6 py-2 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {inviteUserMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  Отправить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};