import React from 'react';
import { Scissors, Car, Home, ShoppingBag, Sparkles, GraduationCap } from 'lucide-react';

interface Template {
    id: string;
    label: string;
    icon: React.ElementType;
    description: string;
    gradient: string;
}

interface TemplatesStepProps {
    onSelect: (templateId: string) => void;
}

const templates: Template[] = [
    {
        id: 'beauty',
        label: 'Салон Красоты',
        icon: Scissors,
        description: 'Запись клиентов, напоминания, прайс-лист.',
        gradient: 'from-pink-500 to-rose-500'
    },
    {
        id: 'auto',
        label: 'Автосервис',
        icon: Car,
        description: 'Запись на ТО, статус ремонта, заказ запчастей.',
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'real_estate',
        label: 'Недвижимость',
        icon: Home,
        description: 'Подбор объектов, запись на просмотр, ипотека.',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        id: 'retail',
        label: 'Ритейл / E-com',
        icon: ShoppingBag,
        description: 'Помощь с выбором, статус заказа, возврат.',
        gradient: 'from-orange-500 to-amber-500'
    },
    {
        id: 'education',
        label: 'Онлайн-школа',
        icon: GraduationCap,
        description: 'Расписание, домашние задания, FAQ.',
        gradient: 'from-violet-500 to-purple-500'
    },
    {
        id: 'custom',
        label: 'Свой шаблон',
        icon: Sparkles,
        description: 'Настройте агента с нуля под ваши задачи.',
        gradient: 'from-zinc-500 to-zinc-400'
    }
];

export const TemplatesStep: React.FC<TemplatesStepProps> = ({ onSelect }) => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl font-light text-white mb-3 text-center">Выберите Нишу</h2>
            <p className="text-zinc-500 mb-10 text-center">Мы подготовили для вас преднастроенные шаблоны.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {templates.map((template) => (
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.id)}
                        className="group relative p-6 rounded-3xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all hover:scale-[1.02] text-left overflow-hidden"
                    >
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br ${template.gradient}`}></div>

                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-gradient-to-br ${template.gradient} shadow-lg shadow-white/5`}>
                            <template.icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2">{template.label}</h3>
                        <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {template.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
};
