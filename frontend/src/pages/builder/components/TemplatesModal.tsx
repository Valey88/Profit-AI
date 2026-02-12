import React from 'react';
import { templates } from '../templates/templates';
import { X } from 'lucide-react';

interface TemplatesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (template: typeof templates[0]) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, onSelect }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-white">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-2xl font-bold tracking-tight">Choose a Template</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-zinc-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 custom-scrollbar">
                    {templates.map((template) => (
                        <div key={template.id} className="border border-white/10 bg-white/5 rounded-xl overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all cursor-pointer group" onClick={() => onSelect(template)}>
                            <div className="h-40 bg-zinc-800 flex items-center justify-center text-zinc-500 font-medium group-hover:bg-zinc-700 transition-colors">
                                Preview
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">{template.name}</h3>
                                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{template.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
