import React from 'react';
import { Sparkles, MessageCircle, Zap, LayoutTemplate, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
    onRegister: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
    return (
        <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Header */}
            <header className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">Profit Flow</span>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={onLogin}
                        className="text-zinc-400 hover:text-white font-medium transition-colors text-sm"
                    >
                        Войти
                    </button>
                    <button
                        onClick={onRegister}
                        className="bg-white text-black px-6 py-2.5 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] md:block hidden"
                    >
                        Начать бесплатно
                    </button>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 pt-20 pb-20 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                        AI-Employee v2.0 Released
                    </div>

                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
                        Ваш новый <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400">цифровой отдел продаж</span>
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        Profit Flow заменяет менеджеров: общается с клиентами, записывает на услуги и продает 24/7 во всех мессенджерах. Без выходных и зарплаты.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <button
                            onClick={onRegister}
                            className="w-full md:w-auto px-10 py-5 bg-white text-black text-lg font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                            <Zap className="w-5 h-5 fill-black" />
                            Создать сотрудника
                        </button>
                        <button className="w-full md:w-auto px-10 py-5 bg-white/5 text-white border border-white/10 text-lg font-bold rounded-full hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-3">
                            <ArrowRight className="w-5 h-5" />
                            Демонстрация
                        </button>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 max-w-6xl mx-auto text-left">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
                                <MessageCircle className="w-7 h-7 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Омни-канальность</h3>
                            <p className="text-zinc-500 leading-relaxed">
                                Объединяем VK, Telegram, Avito и WhatsApp в одном окне. Вы никогда не пропустите заявку.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20">
                                <LayoutTemplate className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">База Знаний (RAG)</h3>
                            <p className="text-zinc-500 leading-relaxed">
                                Загрузите PDF с прайсом, и AI мгновенно выучит ваши цены и услуги. Не нужно писать скрипты.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 backdrop-blur-sm hover:border-white/10 transition-colors">
                            <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20">
                                <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Авто-запись</h3>
                            <p className="text-zinc-500 leading-relaxed">
                                Бот интегрируется с YClients / Dikidi и сам записывает клиентов в свободные слоты календаря.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="border-t border-white/5 py-12 text-center text-zinc-600 text-sm relative z-10 bg-black">
                <p>&copy; 2026 Profit Flow AI. All rights reserved.</p>
            </footer>
        </div>
    );
};
