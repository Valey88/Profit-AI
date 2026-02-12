import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DraggableBlockProps {
    id: string;
    children: React.ReactNode;
}

export const DraggableBlock: React.FC<DraggableBlockProps> = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        border: '2px solid transparent', // Default border
        marginBottom: '10px',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group hover:border-blue-500 rounded p-2">
            {/* Drag Handle could be added here if needed, or entire block is draggable */}
            {children}
        </div>
    );
};
