import React from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBuilderStore } from './store/builderStore';
import { DraggableBlock } from './components/DraggableBlock';
import { TextBlock } from './components/blocks/TextBlock';
import { ImageBlock } from './components/blocks/ImageBlock';
import { SliderBlock } from './components/blocks/SliderBlock';
import { FAQBlock } from './components/blocks/FAQBlock';
import { Plus, Type, Image, Layers, HelpCircle, Save, Eye, ArrowLeft } from 'lucide-react';


import { TemplatesModal } from './components/TemplatesModal';

interface BuilderPageProps {
    onBack: () => void;
}

const BuilderPage: React.FC<BuilderPageProps> = ({ onBack }) => {
    const { currentPage, addBlock, moveBlock, selectBlock, selectedBlockId, updateBlock, setCurrentPage } = useBuilderStore();
    const [isTemplatesOpen, setIsTemplatesOpen] = React.useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            moveBlock(active.id as string, over?.id as string);
        }
    };

    const renderBlock = (block: any) => {
        const isSelected = block.id === selectedBlockId;
        const commonProps = {
            content: block.content,
            onChange: (newContent: any) => updateBlock(block.id, newContent),
            readOnly: !isSelected
        };

        let Component;
        switch (block.type) {
            case 'text':
                Component = TextBlock;
                break;
            case 'image':
                Component = ImageBlock;
                break;
            case 'slider':
                Component = SliderBlock;
                break;
            case 'faq':
                Component = FAQBlock;
                break;
            default:
                return null;
        }

        return (
            <div onClick={() => selectBlock(block.id)} className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                <Component {...commonProps} />
            </div>
        );
    };

    if (!currentPage) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-black text-zinc-100 overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-72 glass-panel border-r border-white/5 flex flex-col gap-6 p-6 z-20">
                <div className="flex items-center gap-3 mb-2">
                    <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-lg tracking-tight">Website Builder</h1>
                        <p className="text-xs text-zinc-500">Create your landing page</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => setIsTemplatesOpen(true)}
                        className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-500 text-white p-3 rounded-xl font-medium transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]"
                    >
                        <Layers size={18} />
                        <span>Choose Template</span>
                    </button>
                </div>

                <div className="space-y-1">
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest px-1 mb-2">Components</p>
                    <button onClick={() => addBlock('text')} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 text-left transition-all group">
                        <Type size={18} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Text Block</span>
                    </button>
                    <button onClick={() => addBlock('image')} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 text-left transition-all group">
                        <Image size={18} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Image</span>
                    </button>
                    <button onClick={() => addBlock('slider')} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 text-left transition-all group">
                        <Layers size={18} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">Slider</span>
                    </button>
                    <button onClick={() => addBlock('faq')} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl border border-white/5 hover:border-white/10 text-left transition-all group">
                        <HelpCircle size={18} className="text-zinc-400 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-sm font-medium text-zinc-300 group-hover:text-white">FAQ</span>
                    </button>
                </div>

                <div className="mt-auto">
                    <button className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-zinc-700 text-white p-3 rounded-xl border border-white/10 transition-all">
                        <Save size={18} />
                        <span>Save Changes</span>
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-hidden relative bg-zinc-950 flex flex-col">
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-900/0 to-zinc-900/0"></div>

                {/* Toolbar / Breadcrumbs could go here */}

                <div className="flex-1 overflow-y-auto p-8 flex justify-center custom-scrollbar relative z-10">
                    <div className="w-full max-w-5xl min-h-[800px] bg-white text-black shadow-2xl rounded-xl transition-all" style={{ boxShadow: "0 0 50px rgba(0,0,0,0.5)" }}>
                        {/* Note: The canvas page itself stays WHITE because it represents a website. 
                            We could add a dark mode toggle for the website itself later. 
                        */}
                        <div className="p-8 min-h-full">
                            <DndContext
                                sensors={sensors}
                                collisionDetection={closestCenter}
                                onDragEnd={handleDragEnd}
                            >
                                <SortableContext
                                    items={currentPage.blocks.map(b => b.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {currentPage.blocks.length === 0 && (
                                        <div className="flex flex-col items-center justify-center h-64 text-zinc-400 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
                                            <p className="text-lg font-medium">Your page is empty</p>
                                            <p className="text-sm">Drag blocks from the sidebar to start building</p>
                                        </div>
                                    )}
                                    <div className="space-y-4">
                                        {currentPage.blocks.map((block) => (
                                            <DraggableBlock key={block.id} id={block.id}>
                                                {renderBlock(block)}
                                            </DraggableBlock>
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>
                </div>
            </div>

            <TemplatesModal
                isOpen={isTemplatesOpen}
                onClose={() => setIsTemplatesOpen(false)}
                onSelect={(template) => {
                    if (currentPage) {
                        setCurrentPage({
                            ...currentPage,
                            name: template.name,
                            blocks: template.blocks
                        });
                        setIsTemplatesOpen(false);
                    }
                }}
            />
        </div>
    );
};

export default BuilderPage;
