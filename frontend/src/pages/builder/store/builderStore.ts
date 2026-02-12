import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export interface Block {
    id: string;
    type: 'text' | 'image' | 'video' | 'slider' | 'faq' | 'container' | 'columns';
    content: any;
    styles?: Record<string, any>;
}

export interface Page {
    id: string;
    name: string;
    slug: string;
    blocks: Block[];
}

interface BuilderState {
    currentSite: any | null;
    currentPage: Page | null;
    selectedBlockId: string | null;

    setCurrentSite: (site: any) => void;
    setCurrentPage: (page: Page) => void;
    selectBlock: (blockId: string | null) => void;

    addBlock: (type: Block['type'], index?: number) => void;
    updateBlock: (blockId: string, content: any, styles?: any) => void;
    removeBlock: (blockId: string) => void;
    moveBlock: (activeId: string, overId: string) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
    currentSite: null,
    currentPage: {
        id: '1',
        name: 'Home',
        slug: 'home',
        blocks: [],
    },
    selectedBlockId: null,

    setCurrentSite: (site) => set({ currentSite: site }),
    setCurrentPage: (page) => set({ currentPage: page }),
    selectBlock: (blockId) => set({ selectedBlockId: blockId }),

    addBlock: (type, index) => set((state) => {
        if (!state.currentPage) return state;

        const newBlock: Block = {
            id: uuidv4(),
            type,
            content: getDefaultContentForType(type),
            styles: {},
        };

        const blocks = [...state.currentPage.blocks];
        if (typeof index === 'number') {
            blocks.splice(index, 0, newBlock);
        } else {
            blocks.push(newBlock);
        }

        return {
            currentPage: {
                ...state.currentPage,
                blocks,
            }
        };
    }),

    updateBlock: (blockId, content, styles) => set((state) => {
        if (!state.currentPage) return state;

        const blocks = state.currentPage.blocks.map((block) => {
            if (block.id === blockId) {
                return {
                    ...block,
                    content: { ...block.content, ...content },
                    styles: { ...block.styles, ...styles },
                };
            }
            return block;
        });

        return {
            currentPage: {
                ...state.currentPage,
                blocks,
            }
        };
    }),

    removeBlock: (blockId) => set((state) => {
        if (!state.currentPage) return state;

        const blocks = state.currentPage.blocks.filter((b) => b.id !== blockId);

        return {
            currentPage: {
                ...state.currentPage,
                blocks,
            },
            selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        };
    }),

    moveBlock: (activeId, overId) => set((state) => {
        if (!state.currentPage) return state;

        const oldIndex = state.currentPage.blocks.findIndex((b) => b.id === activeId);
        const newIndex = state.currentPage.blocks.findIndex((b) => b.id === overId);

        if (oldIndex === -1 || newIndex === -1) return state;

        const newBlocks = [...state.currentPage.blocks];
        const [movedBlock] = newBlocks.splice(oldIndex, 1);
        newBlocks.splice(newIndex, 0, movedBlock);

        return {
            currentPage: {
                ...state.currentPage,
                blocks: newBlocks,
            }
        };
    }),
}));

function getDefaultContentForType(type: Block['type']) {
    switch (type) {
        case 'text':
            return { text: 'Edit this text', tag: 'p', align: 'left' };
        case 'image':
            return { src: 'https://via.placeholder.com/300', alt: 'Placeholder', width: '100%' };
        case 'slider':
            return { slides: [{ src: 'https://via.placeholder.com/800x400', caption: 'Slide 1' }] };
        case 'faq':
            return { items: [{ question: 'Question?', answer: 'Answer.' }] };
        case 'container':
            return { padding: '20px', background: '#ffffff' };
        default:
            return {};
    }
}
