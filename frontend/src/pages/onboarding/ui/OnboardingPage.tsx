import React, { useState, useEffect } from 'react';
import {
    Zap,
    MessageCircle,
    LayoutTemplate,
    PlayCircle,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { useCompany, useUpdateCompany, useAgentConfig, useUpdateAgentConfig, useConnectChannel, useDisconnectChannel } from '@/shared/api/hooks';
import type { CompanyUpdate, AgentConfigUpdate } from '@/shared/api/client';

import { TemplatesStep } from './components/TemplatesStep';
import { PersonalizationStep } from './components/PersonalizationStep';
import { ChannelsStep } from './components/ChannelsStep';
import { WidgetConfigModal } from './components/WidgetConfigModal';
import { TestPlayground } from './components/TestPlayground';

interface OnboardingProps {
    onComplete: () => void;
}

export const OnboardingPage: React.FC<OnboardingProps> = ({ onComplete }) => {
    // API Hooks
    const { data: company, isLoading: isCompanyLoading } = useCompany();
    const updateCompanyMutation = useUpdateCompany();

    // Agent Hooks
    const { data: agentConfig, isLoading: isAgentLoading } = useAgentConfig();
    const updateAgentConfigMutation = useUpdateAgentConfig();

    // Channel Hooks
    const connectChannelMutation = useConnectChannel();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const disconnectChannelMutation = useDisconnectChannel();

    // State
    const [step, setStep] = useState(0);
    const [configuringChannel, setConfiguringChannel] = useState<string | null>(null);
    const [showWidgetModal, setShowWidgetModal] = useState(false);

    // Forms
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [companyForm, setCompanyForm] = useState<CompanyUpdate>({
        name: '',
        industry: '',
    });

    const [agentForm, setAgentForm] = useState<AgentConfigUpdate>({
        name: '',
        role: '',
        tone: '',
        system_prompt: '',
        skills: { payments: false, calendar: false, voiceToText: false }
    });
    const [telegramToken, setTelegramToken] = useState('');

    // Sync remote data
    useEffect(() => {
        if (company) {
            setCompanyForm(prev => ({ ...prev, name: company.name || '', industry: company.industry || '' }));
        }
    }, [company]);

    useEffect(() => {
        if (agentConfig) {
            setAgentForm(prev => ({
                ...prev,
                name: agentConfig.name || '',
                role: agentConfig.role || '',
                tone: agentConfig.tone || '',
                skills: agentConfig.skills || {}
            }));
        }
    }, [agentConfig]);

    // Handlers
    const handleTemplateSelect = async (templateId: string) => {
        // Map template to industry and preset agent details
        const industryMap: Record<string, string> = {
            'beauty': 'beauty',
            'auto': 'auto',
            'real_estate': 'real_estate',
            'retail': 'retail',
            'education': 'education',
            'custom': 'other'
        };

        const agentPresets: Record<string, Partial<AgentConfigUpdate>> = {
            'beauty': { role: 'Администратор салона', tone: 'friendly', skills: { calendar: true, payments: true, voiceToText: false } },
            'auto': { role: 'Мастер-приемщик', tone: 'professional', skills: { calendar: true, payments: false, voiceToText: true } },
            'real_estate': { role: 'Риелтор-помощник', tone: 'energetic', skills: { calendar: true, payments: false, voiceToText: false } },
            // ... add others
        };

        try {
            await updateCompanyMutation.mutateAsync({ industry: industryMap[templateId] || 'other' });

            if (templateId !== 'custom' && agentPresets[templateId]) {
                await updateAgentConfigMutation.mutateAsync(agentPresets[templateId]);
                // Update local state immediately for next step
                setAgentForm(prev => ({ ...prev, ...agentPresets[templateId] }));
            }

            setStep(2);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePersonalizationSave = async () => {
        try {
            await updateAgentConfigMutation.mutateAsync(agentForm);
            setStep(3);
        } catch (error) {
            console.error(error);
        }
    };

    const handleChannelConfigure = (channel: string) => {
        if (channel === 'widget') {
            setShowWidgetModal(true);
        } else {
            setConfiguringChannel(channel);
        }
    };

    const handleConnectChannel = async (type: string, config: any) => {
        try {
            await connectChannelMutation.mutateAsync({
                type,
                name: type === 'telegram' ? 'Telegram Bot' : 'Website Widget',
                config
            });
            setConfiguringChannel(null);
            setShowWidgetModal(false);
            setTelegramToken(''); // Clear token after success
        } catch (error: any) {
            // Show error to user
            const message = error?.message || 'Ошибка подключения канала';
            alert(type === 'telegram'
                ? 'Неверный токен бота. Проверьте токен и попробуйте снова.'
                : message);
            console.error(error);
        }
    };

    const getConnectedChannels = () => {
        return company?.channels
            .filter(c => c.status === 'connected')
            .map(c => c.type) || [];
    };

    if (isCompanyLoading || isAgentLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col font-sans text-zinc-100 relative overflow-hidden bg-black">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950/80 to-black"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] animate-pulse duration-1000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] animate-pulse duration-[4000ms]"></div>
            </div>

            {/* Header */}
            <div className="w-full py-6 px-10 flex items-center justify-between border-b border-white/5 bg-white/[0.02] backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-white/20">
                        <Zap className="w-4 h-4 text-white fill-current" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-white">Proft Flow AI</span>
                </div>
                {step > 0 && (
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-white' : 'w-2 bg-white/20'}`}></div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">

                {/* Step 0: Welcome */}
                {step === 0 && (
                    <div className="max-w-5xl w-full animate-in slide-in-from-bottom-10 duration-1000 fade-in flex flex-col items-center text-center">
                        <div className="mb-12">
                            <h1 className="text-6xl md:text-7xl font-extralight tracking-tight mb-8 text-white leading-[1.1]">
                                Цифровой разум <br />
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 animate-gradient">для вашего бизнеса</span>
                            </h1>
                            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                                За 3 минуты создайте AI-сотрудника, который заменит целый отдел продаж.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full">
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group">
                                <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
                                    <MessageCircle className="w-7 h-7 text-indigo-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 text-white">Омни-канальность</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">Telegram, Avito, WhatsApp. Все диалоги в едином стеклянном интерфейсе.</p>
                            </div>
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group delay-100">
                                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
                                    <LayoutTemplate className="w-7 h-7 text-purple-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 text-white">Нейро-база</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">RAG-технология мгновенно обучается на ваших PDF и DOCX файлах.</p>
                            </div>
                            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm hover:bg-white/10 transition-all group delay-200">
                                <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform">
                                    <Zap className="w-7 h-7 text-cyan-400" />
                                </div>
                                <h3 className="font-bold text-lg mb-3 text-white">Автопилот</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed">Бот ведет клиента по воронке, записывает на услуги и продает 24/7.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep(1)}
                            className="group bg-white text-black px-12 py-5 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-4 hover:gap-6"
                        >
                            <PlayCircle className="w-6 h-6" />
                            Запустить создание
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                        </button>
                    </div>
                )}

                {/* Step 1: Templates */}
                {step === 1 && (
                    <TemplatesStep onSelect={handleTemplateSelect} />
                )}

                {/* Step 2: Personalization */}
                {step === 2 && (
                    <PersonalizationStep
                        form={agentForm}
                        onChange={(field, value) => setAgentForm(prev => ({ ...prev, [field]: value }))}
                        onNext={handlePersonalizationSave}
                        isLoading={updateAgentConfigMutation.isPending}
                    />
                )}

                {/* Step 3: Channels */}
                {step === 3 && (
                    <ChannelsStep
                        connectedChannels={getConnectedChannels()}
                        onConfigure={handleChannelConfigure}
                        onNext={() => setStep(4)}
                    />
                )}

                {/* Step 4: Test Playground */}
                {step === 4 && (
                    <TestPlayground
                        agentName={agentForm.name || 'Агент'}
                        onFinish={onComplete}
                    />
                )}

            </div>

            {/* --- Modals --- */}

            {/* Widget Config Modal */}
            <WidgetConfigModal
                isOpen={showWidgetModal}
                onClose={() => setShowWidgetModal(false)}
                onSave={(config) => handleConnectChannel('widget', config)}
            />

            {/* Telegram Modal (Simplified inline for now based on previous code, can be extracted too) */}
            {configuringChannel === 'telegram' && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-[#0f0f11] w-full max-w-md rounded-3xl shadow-2xl p-8 border border-white/10 relative">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-xl text-white">Telegram Bot</h3>
                            <button onClick={() => setConfiguringChannel(null)}><div className="p-2 hover:bg-white/10 rounded-full"><div className="w-4 h-4 text-zinc-500">✕</div></div></button>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/5 mb-2">
                                <p className="text-xs text-zinc-400 mb-2">1. Откройте <a href="https://t.me/BotFather" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">@BotFather</a></p>
                                <p className="text-xs text-zinc-400 mb-2">2. Создайте бота /newbot</p>
                                <p className="text-xs text-zinc-400">3. Скопируйте токен</p>
                            </div>

                            <input
                                type="text"
                                placeholder="123456:ABC-DEF..."
                                value={telegramToken}
                                onChange={(e) => setTelegramToken(e.target.value)}
                                className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                            />

                            <button
                                onClick={() => handleConnectChannel('telegram', { token: telegramToken })}
                                disabled={!telegramToken.trim() || connectChannelMutation.isPending}
                                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {connectChannelMutation.isPending ? 'Подключение...' : 'Подключить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};