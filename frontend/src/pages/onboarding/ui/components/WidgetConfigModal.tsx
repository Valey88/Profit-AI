import React, { useState, useEffect } from 'react';
import { X, Globe, Copy, Check, Palette, Layout, MessageSquare } from 'lucide-react';

interface WidgetConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (config: any) => void;
    initialConfig?: any;
}

export const WidgetConfigModal: React.FC<WidgetConfigModalProps> = ({ isOpen, onClose, onSave, initialConfig }) => {
    const [config, setConfig] = useState({
        color: '#6366f1',
        position: 'right', // 'left' | 'right'
        welcomeMessage: 'Привет! Я виртуальный ассистент. Чем могу помочь?',
        theme: 'dark' // 'light' | 'dark'
    });

    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (initialConfig) {
            setConfig(prev => ({ ...prev, ...initialConfig }));
        }
    }, [initialConfig]);

    if (!isOpen) return null;

    const handleCopyCode = () => {
        const code = `<script src="https://cdn.profitflow.ai/widget.js" data-id="YOUR_AGENT_ID" data-color="${config.color}"></script>`;
        navigator.clipboard.writeText(code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-y-auto md:overflow-hidden">
            <div className="bg-[#0f0f11] w-full max-w-6xl min-h-[80vh] md:h-[80vh] rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row overflow-hidden relative my-auto">

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 z-[60] p-2 bg-black/50 rounded-full hover:bg-white/10 transition-colors border border-white/5">
                    <X className="w-5 h-5 text-white" />
                </button>

                {/* Left Panel: Configuration */}
                <div className="w-full md:w-1/3 bg-[#131316] border-b md:border-b-0 md:border-r border-white/5 p-6 md:p-8 overflow-y-auto">
                    <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                            <Globe className="w-5 h-5 text-cyan-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Настройка Виджета</h2>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        {/* Section: Appearance */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Palette className="w-3 h-3" /> Внешний вид
                            </h3>

                            <div className="mb-4">
                                <label className="block text-sm text-zinc-400 mb-2">Основной цвет</label>
                                <div className="flex gap-3 flex-wrap">
                                    {['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'].map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setConfig({ ...config, color })}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${config.color === color ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                            style={{ backgroundColor: color }}
                                        />
                                    ))}
                                    <input
                                        type="color"
                                        value={config.color}
                                        onChange={(e) => setConfig({ ...config, color: e.target.value })}
                                        className="w-8 h-8 rounded-full overflow-hidden cursor-pointer border-0 p-0"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-2">Тема</label>
                                <div className="flex bg-black/30 p-1 rounded-lg border border-white/5">
                                    <button
                                        onClick={() => setConfig({ ...config, theme: 'light' })}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${config.theme === 'light' ? 'bg-white text-black shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                                    >
                                        Светлая
                                    </button>
                                    <button
                                        onClick={() => setConfig({ ...config, theme: 'dark' })}
                                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${config.theme === 'dark' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                                    >
                                        Темная
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Section: Position and Text */}
                        <div>
                            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Layout className="w-3 h-3" /> Расположение
                            </h3>

                            <div className="flex bg-black/30 p-1 rounded-lg border border-white/5 mb-6">
                                <button
                                    onClick={() => setConfig({ ...config, position: 'left' })}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${config.position === 'left' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Слева
                                </button>
                                <button
                                    onClick={() => setConfig({ ...config, position: 'right' })}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${config.position === 'right' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-white'}`}
                                >
                                    Справа
                                </button>
                            </div>

                            <div>
                                <label className="block text-sm text-zinc-400 mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3" /> Приветствие
                                </label>
                                <textarea
                                    value={config.welcomeMessage}
                                    onChange={(e) => setConfig({ ...config, welcomeMessage: e.target.value })}
                                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none text-sm text-zinc-200 resize-none h-24"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Код для вставки</h3>
                        <div className="bg-black/50 p-4 rounded-xl border border-white/10 relative group">
                            <code className="text-[10px] text-zinc-400 font-mono break-all block">
                                script src="https://cdn.profitflow.ai/widget.js"...
                            </code>
                            <button
                                onClick={handleCopyCode}
                                className="absolute top-2 right-2 p-1.5 bg-white/10 rounded-md hover:bg-white/20 transition-colors"
                            >
                                {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-white" />}
                            </button>
                        </div>

                        <button
                            onClick={() => onSave(config)}
                            className="w-full mt-6 bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Сохранить и подключить
                        </button>
                    </div>
                </div>

                {/* Right Panel: Live Preview */}
                <div className="w-full md:w-2/3 bg-[#0a0a0c] relative flex items-center justify-center p-4 md:p-12 bg-grid-white/[0.02] min-h-[400px] md:min-h-0">
                    {/* Mock Website Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-black to-black opacity-50"></div>

                    <div className="w-full h-full bg-[#ffffff] rounded-2xl shadow-2xl relative overflow-hidden flex flex-col scale-[0.85] md:scale-95 border border-white/5">
                        {/* Mock Browser Header */}
                        <div className="h-8 bg-zinc-100 border-b flex items-center px-4 gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        {/* Mock Content */}
                        <div className="flex-1 p-8 bg-white text-zinc-900 overflow-y-auto">
                            <div className="h-40 bg-zinc-100 rounded-xl mb-6"></div>
                            <div className="space-y-4">
                                <div className="h-4 bg-zinc-100 w-3/4 rounded"></div>
                                <div className="h-4 bg-zinc-100 w-1/2 rounded"></div>
                                <div className="h-4 bg-zinc-100 w-full rounded"></div>
                                <div className="h-4 bg-zinc-100 w-5/6 rounded"></div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mt-8">
                                <div className="h-32 bg-zinc-100 rounded-xl"></div>
                                <div className="h-32 bg-zinc-100 rounded-xl"></div>
                                <div className="h-32 bg-zinc-100 rounded-xl"></div>
                            </div>
                        </div>

                        {/* WIDGET PREVIEW */}
                        <div
                            className={`absolute bottom-6 flex flex-col items-end gap-4 transition-all duration-500 ease-spring ${config.position === 'left' ? 'left-6 items-start' : 'right-6'}`}
                        >
                            {/* Chat Bubble (Open State Simulation) */}
                            <div className={`bg-white rounded-2xl shadow-xl w-80 overflow-hidden border border-zinc-100 origin-bottom scale-100 opacity-100 transition-all`}>
                                <div className="p-4 text-white flex items-center gap-3" style={{ backgroundColor: config.color }}>
                                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                        <MessageSquare className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="font-bold text-sm">Ассистент</span>
                                </div>
                                <div className="p-4 bg-zinc-50 h-60 flex flex-col gap-3">
                                    <div className="self-start bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[90%] text-sm text-zinc-600 border border-zinc-100">
                                        {config.welcomeMessage}
                                    </div>
                                </div>
                                <div className="p-3 bg-white border-t border-zinc-100">
                                    <div className="h-10 bg-zinc-50 rounded-full border border-zinc-100"></div>
                                </div>
                            </div>

                            {/* Trigger Button */}
                            <button
                                className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg shadow-black/20 hover:scale-110 active:scale-95 transition-all"
                                style={{ backgroundColor: config.color }}
                            >
                                <MessageSquare className="w-6 h-6 fill-current" />
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};
