import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, RefreshCw } from 'lucide-react';


interface TestPlaygroundProps {
    agentName: string;
    onFinish: () => void;
}

export const TestPlayground: React.FC<TestPlaygroundProps> = ({ agentName, onFinish }) => {
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
        { role: 'assistant', content: `Привет! Я ${agentName}. Я готов общаться с вашими клиентами. Проверим мои навыки?` }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsTyping(true);

        // Mock AI Response
        setTimeout(() => {
            const responses = [
                "Отличный вопрос! Я могу записать вас на прием или рассказать о наших услугах.",
                "Я понимаю. Могу предложить свободное время на завтра в 14:00.",
                "Стоимость услуги составит 5000 рублей. Оформить?",
                "Конечно, я передам информацию менеджеру, если вопрос требует личного участия."
            ];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <div className="w-full max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 h-auto md:h-[600px] flex flex-col md:flex-row gap-6 md:gap-8 p-4 md:p-0">

            {/* Left: Info */}
            <div className="w-full md:w-1/3 pt-0 md:pt-10 order-2 md:order-1">
                <div className="flex items-center justify-between md:block mb-4">
                    <h2 className="text-2xl md:text-4xl font-light text-white">Тест-драйв</h2>
                    <div className="md:hidden">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>

                <p className="text-zinc-500 mb-6 md:mb-8 leading-relaxed text-sm md:text-base hidden md:block">
                    Пообщайтесь с созданным агентом прямо сейчас. <br />
                    Это безопасная среда («песочница»).
                </p>

                <div className="space-y-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hidden md:block">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" /> Активные навыки
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded-md border border-indigo-500/20">Календарь</span>
                            <span className="px-2 py-1 bg-purple-500/10 text-purple-300 text-xs rounded-md border border-purple-500/20">База знаний</span>
                            <span className="px-2 py-1 bg-emerald-500/10 text-emerald-300 text-xs rounded-md border border-emerald-500/20">Продажи</span>
                        </div>
                    </div>

                    <button
                        onClick={onFinish}
                        className="w-full bg-white text-black py-3 md:py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] mt-2 md:mt-4"
                    >
                        Завершить настройку
                    </button>
                </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="w-full md:flex-1 h-[60vh] md:h-full glass-card rounded-3xl border border-white/10 flex flex-col overflow-hidden relative order-1 md:order-2">
                {/* Header */}
                <div className="h-14 md:h-16 border-b border-white/5 flex items-center px-4 md:px-6 gap-3 bg-white/[0.02]">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg text-sm md:text-base">
                        {agentName[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm md:text-base">{agentName}</h3>
                        <div className="flex items-center gap-1.5 md:hidden">
                            <span className="text-[10px] text-zinc-400">Бот</span>
                        </div>
                        <div className="hidden md:flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-zinc-400">Online</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setMessages([])}
                        className="ml-auto p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-500 hover:text-white"
                        title="Очистить чат"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-br-none shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                                    : 'bg-white/10 text-zinc-100 rounded-bl-none border border-white/5'
                                    }`}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 p-4 rounded-2xl rounded-bl-none border border-white/5 flex gap-1 items-center">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-white/[0.02]">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Напишите сообщение..."
                            className="w-full pl-6 pr-14 py-4 bg-black/30 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-none text-white placeholder-zinc-600 transition-all font-medium"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="absolute right-2 top-2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-indigo-600"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
