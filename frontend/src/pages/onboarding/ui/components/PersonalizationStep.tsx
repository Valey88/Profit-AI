import React from 'react';
import { User, MessageSquare, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

interface PersonalizationProps {
    form: {
        name?: string;
        role?: string;
        tone?: string;
    };
    onChange: (field: string, value: string) => void;
    onNext: () => void;
    isLoading?: boolean;
}


export const PersonalizationStep: React.FC<PersonalizationProps> = ({ form, onChange, onNext, isLoading }) => {
    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-light text-white mb-3 text-center">Личность Агента</h2>
            <p className="text-zinc-500 mb-10 text-center">Как вашего ассистента будут звать клиенты?</p>

            <div className="glass-card p-8 md:p-10 rounded-3xl space-y-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                {/* Name Input */}
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <User className="w-3 h-3" /> Имя
                    </label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => onChange('name', e.target.value)}
                        placeholder="Анна, Максим, Jarvis..."
                        className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-zinc-700 text-lg"
                        autoFocus
                    />
                </div>

                {/* Role Input */}
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Роль
                    </label>
                    <input
                        type="text"
                        value={form.role}
                        onChange={(e) => onChange('role', e.target.value)}
                        placeholder="Менеджер поддержки, Администратор..."
                        className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white placeholder-zinc-700"
                    />
                </div>

                {/* Tone Input */}
                <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <MessageSquare className="w-3 h-3" /> Тон общения
                    </label>
                    <select
                        value={form.tone}
                        onChange={(e) => onChange('tone', e.target.value)}
                        className="w-full px-5 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-zinc-300 appearance-none cursor-pointer"
                    >
                        <option value="">Выберите тон</option>
                        <option value="friendly">Дружелюбный и заботливый</option>
                        <option value="professional">Строгий и профессиональный</option>
                        <option value="empathetic">Эмпатичный и мягкий</option>
                        <option value="energetic">Энергичный и продающий</option>
                    </select>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        onClick={onNext}
                        disabled={isLoading || !form.name || !form.role}
                        className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Продолжить <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
