import React from 'react';
import { MessageCircle, Globe, Check, Smartphone, ArrowRight } from 'lucide-react';

interface ChannelsStepProps {
    connectedChannels: string[];
    onConfigure: (channel: string) => void;
    onNext: () => void;
}

export const ChannelsStep: React.FC<ChannelsStepProps> = ({ connectedChannels, onConfigure, onNext }) => {
    const isConnected = (type: string) => connectedChannels.includes(type);

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-light text-white mb-3 text-center">Выбор Каналов</h2>
            <p className="text-zinc-500 mb-10 text-center">Где ваш AI-ассистент будет общаться с клиентами?</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* VK Bot */}
                <div
                    onClick={() => onConfigure('vk')}
                    className={`group relative p-8 rounded-3xl border cursor-pointer transition-all hover:scale-[1.02] overflow-hidden ${isConnected('vk') ? 'bg-blue-500/10 border-blue-500/50 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-blue-500/20 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                            <span className="font-bold text-xl text-blue-500">VK</span>
                        </div>
                        {isConnected('vk') && (
                            <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                                <Check className="w-4 h-4 text-blue-400" />
                            </div>
                        )}
                    </div>

                    <h3 className="font-bold text-2xl text-white mb-2">ВКонтакте</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        Сообщества и боты VK. <br />
                        <span className="text-blue-400 font-medium">Популярно в РФ.</span>
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                        <Smartphone className="w-3 h-3" /> Social
                    </div>
                </div>

                {/* Website Widget */}
                <div
                    onClick={() => onConfigure('widget')}
                    className={`group relative p-8 rounded-3xl border cursor-pointer transition-all hover:scale-[1.02] overflow-hidden ${isConnected('widget') ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'}`}
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none group-hover:bg-cyan-500/20 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                            <Globe className="w-7 h-7 text-cyan-400" />
                        </div>
                        {isConnected('widget') && (
                            <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                                <Check className="w-4 h-4 text-cyan-400" />
                            </div>
                        )}
                    </div>

                    <h3 className="font-bold text-2xl text-white mb-2">Виджет на сайт</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                        Красивый бабл чата для вашего лендинга. <br />
                        Удерживает посетителей.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-wider">
                        <Globe className="w-3 h-3" /> Web SDK
                    </div>
                </div>

                {/* Telegram Bot (Disabled) */}
                <div
                    className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] opacity-60 grayscale cursor-not-allowed overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <MessageCircle className="w-7 h-7 text-zinc-500" />
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                            Скоро
                        </div>
                    </div>

                    <h3 className="font-bold text-2xl text-zinc-400 mb-2">Telegram Bot</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                        Временно недоступно. <br />
                        Ведутся технические работы.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                        <Smartphone className="w-3 h-3" /> Mobile First
                    </div>
                </div>

                {/* Avito (Disabled) */}
                <div
                    className="group relative p-8 rounded-3xl border border-white/5 bg-white/[0.02] opacity-60 grayscale cursor-not-allowed overflow-hidden"
                >
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                            <span className="font-bold text-zinc-500 text-xl">Av</span>
                        </div>
                        <div className="px-3 py-1 bg-white/10 rounded-full border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                            Скоро
                        </div>
                    </div>

                    <h3 className="font-bold text-2xl text-zinc-400 mb-2">Avito</h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6">
                        Автоответы на сообщения. <br />
                        Интеграция в разработке.
                    </p>

                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-700 uppercase tracking-wider">
                        <Smartphone className="w-3 h-3" /> Classifieds
                    </div>
                </div>
            </div>

            <div className="mt-12 flex justify-center">
                <button
                    onClick={onNext}
                    className="group bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center gap-3"
                >
                    Завершить настройку
                    <ArrowRight className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>
        </div>
    );
};
