import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, MoreHorizontal, Loader2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/shared/api/client';

interface AdminUser {
    id: number;
    email: string;
    full_name: string;
    role: string;
    status: string;
    is_online: boolean;
    created_at: string;
}

interface UserListResponse {
    users: AdminUser[];
    total: number;
}

export const AdminPage: React.FC = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin', 'users'],
        queryFn: async () => {
            const token = localStorage.getItem('auth_token');
            const res = await axios.get<UserListResponse>(`${API_BASE_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full text-red-500">
                Ошибка доступа или загрузки (403 Forbidden?)
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-8 relative">
            <div className="max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            <Shield className="w-8 h-8 text-indigo-500" />
                            Admin Panel
                        </h1>
                        <p className="text-zinc-500 mt-2 text-sm">Управление пользователями и подписками.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-zinc-400 text-sm font-mono">
                        Total Users: <span className="text-white font-bold">{data?.total}</span>
                    </div>
                </header>

                <div className="glass-card rounded-3xl overflow-hidden border border-white/10 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                                <th className="p-4 pl-6">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Subscription</th>
                                <th className="p-4">Registered</th>
                                <th className="p-4 text-right pr-6">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data?.users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="p-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-zinc-500 text-sm">
                                                {user.full_name?.[0] || user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-white text-sm">{user.full_name || 'No Name'}</div>
                                                <div className="text-xs text-zinc-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${user.role === 'owner' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            user.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                                                'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {user.is_online ? (
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                            ) : (
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                                            )}
                                            <span className="text-xs text-zinc-400 font-medium">
                                                {user.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs font-mono text-zinc-500">Free</span>
                                    </td>
                                    <td className="p-4">
                                        <span className="text-xs text-zinc-500">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right pr-6">
                                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-500 hover:text-white">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
