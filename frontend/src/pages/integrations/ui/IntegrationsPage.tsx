import React, { useState } from 'react';
import { MessageCircle, ShoppingBag, Check, Zap, Instagram, Smartphone, X, Loader2, Plus, AlertCircle } from 'lucide-react';
import { useCompany, useConnectChannel, useDisconnectChannel } from '@/shared/api/hooks';

export const IntegrationsPage: React.FC = () => {
    const { data: company, isLoading } = useCompany();
    const connectChannelMutation = useConnectChannel();
    const disconnectChannelMutation = useDisconnectChannel();

    const [configuringChannel, setConfiguringChannel] = useState<string | null>(null);

    // Forms
    const [tgToken, setTgToken] = useState('');
    const [avitoId, setAvitoId] = useState('');
    const [avitoSecret, setAvitoSecret] = useState('');
    const [tgUserPhone, setTgUserPhone] = useState('');
    const [tgUserApiId, setTgUserApiId] = useState('');
    const [tgUserApiHash, setTgUserApiHash] = useState('');

    const isConnected = (type: string) => company?.channels.some(c => c.type === type && c.status === 'connected');

    const handleConnect = async (type: string, config: any) => {
        try {
            await connectChannelMutation.mutateAsync({
                type,
                name: type === 'telegram' ? 'Telegram Bot' : type === 'avito' ? 'Avito' : 'Channel',
                config
            });
            setConfiguringChannel(null);
            resetForms();
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    };

    const handleDisconnect = async (type: string) => {
        const channel = company?.channels.find(c => c.type === type);
        if (channel && confirm('Вы уверены, что хотите отключить этот канал?')) {
            try {
                await disconnectChannelMutation.mutateAsync(channel.id);
            } catch (error) {
                console.error('Failed to disconnect:', error);
            }
        }
    };

    const resetForms = () => {
        setTgToken('');
        setAvitoId('');
        setAvitoSecret('');
        setTgUserPhone('');
        setTgUserApiId('');
        setTgUserApiHash('');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    const channels = [
        {
            id: 'telegram',
            name: 'Telegram Bot',
            desc: 'Официальный бот для общения с клиентами.',
            icon: MessageCircle,
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/20'
        },
        {
            id: 'tgUser', // Note: backend uses 'telegram' type potentially for both or discerns by config? 
            // The backend model has ChannelType.TELEGRAM. 
            // To distinguish Userbot, we normally use a different type or config flag.
            // For simplicity here, assuming 'tgUser' maps to a channel type or config.
            // Let's assume frontend logic for now, but backend service maps 'tgUser' -> 'telegram' type with different config?
            // Actually, OnboardingPage used 'telegram' vs 'tgUser' button clicks but passed 'telegram' type?
            // Checking OnboardingPage: onClick={() => setConfiguringChannel('telegram')} vs 'tgUser'.
            // But step 2 only had 'telegram' implemented in my last code?
            // Wait, I see 'Telegram Userbot' as disabled in my OnboardingPage rewrite (grayed out).
            // So I will keep it disabled here too or just a placeholder.
            name: 'Telegram Userbot',
            desc: 'Личный аккаунт (MTProto).',
            icon: Smartphone,
            color: 'text-sky-400',
            bg: 'bg-sky-500/10',
            border: 'border-sky-500/20',
            disabled: true
        },
        {
            id: 'avito',
            name: 'Avito',
            desc: 'Интеграция с чатами Авито.',
            icon: ShoppingBag,
            color: 'text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/20'
        },
        {
            id: 'instagram',
            name: 'Instagram',
            desc: 'Direct сообщения (Facebook API).',
            icon: Instagram,
            color: 'text-pink-400',
            bg: 'bg-pink-500/10',
            border: 'border-pink-500/20',
            disabled: true
        }
    ];

    return (
        <div className="h-full overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-light text-white tracking-tight">Интеграции</h1>
                        <p className="text-zinc-500 mt-2 text-sm">Управление каналами связи.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {channels.map((channel) => {
                        const active = isConnected(channel.id);
                        const Icon = channel.icon;

                        return (
                            <div
                                key={channel.id}
                                className={`glass-card p-6 rounded-3xl border transition-all group ${active
                                    ? 'bg-white/[0.03] border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                    : channel.disabled
                                        ? 'opacity-50 grayscale cursor-not-allowed border-white/5'
                                        : 'hover:border-white/10 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${channel.bg} ${channel.border}`}>
                                        <Icon className={`w-6 h-6 ${channel.color}`} />
                                    </div>
                                    {active ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                                            Активен
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-600">
                                            <div className="w-2 h-2 rounded-full bg-zinc-700"></div>
                                        </div>
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{channel.name}</h3>
                                <p className="text-sm text-zinc-500 mb-6 min-h-[40px]">{channel.desc}</p>

                                {active ? (
                                    <button
                                        onClick={() => handleDisconnect(channel.id)}
                                        className="w-full py-3 rounded-xl text-sm font-bold bg-white/5 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                                    >
                                        Настройки
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => !channel.disabled && setConfiguringChannel(channel.id)}
                                        disabled={channel.disabled}
                                        className={`w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${channel.disabled
                                                ? 'bg-white/5 text-zinc-600'
                                                : 'bg-white text-black hover:bg-zinc-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                            }`}
                                    >
                                        <Plus className="w-4 h-4" />
                                        Подключить
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Modals - Reusing same design manually or components. For speed, inline here. */}
                {configuringChannel === 'telegram' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-indigo-400" /> Telegram Bot
                                </h3>
                                <button onClick={() => setConfiguringChannel(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">API Token</label>
                                    <input
                                        type="text"
                                        autoFocus
                                        value={tgToken}
                                        onChange={(e) => setTgToken(e.target.value)}
                                        placeholder="123456:ABC-DEF..."
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-sm text-white placeholder-zinc-600 font-mono"
                                    />
                                    <p className="text-[10px] text-zinc-500 mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Получить у @BotFather
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleConnect('telegram', { token: tgToken })}
                                    disabled={!tgToken || connectChannelMutation.isPending}
                                    className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {connectChannelMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Подключить
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {configuringChannel === 'avito' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                        <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-orange-400" /> Avito
                                </h3>
                                <button onClick={() => setConfiguringChannel(null)} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Client ID</label>
                                    <input
                                        type="text"
                                        value={avitoId}
                                        onChange={(e) => setAvitoId(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none text-sm text-white placeholder-zinc-600 font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Client Secret</label>
                                    <input
                                        type="password"
                                        value={avitoSecret}
                                        onChange={(e) => setAvitoSecret(e.target.value)}
                                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-1 focus:ring-orange-500 outline-none text-sm text-white placeholder-zinc-600 font-mono"
                                    />
                                </div>

                                <button
                                    onClick={() => handleConnect('avito', { id: avitoId, secret: avitoSecret })}
                                    disabled={!avitoId || !avitoSecret || connectChannelMutation.isPending}
                                    className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {connectChannelMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Подключить
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
