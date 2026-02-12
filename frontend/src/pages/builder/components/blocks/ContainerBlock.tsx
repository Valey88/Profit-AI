import React from 'react';

interface ContainerBlockProps {
    content: {
        background?: string;
        padding?: string;
        children?: React.ReactNode;
    };
    children?: React.ReactNode;
    style?: React.CSSProperties;
    // For now container is just a wrapper for block styles, 
    // real nested dnd is complex so we might just use it as a section wrapper
}

export const ContainerBlock: React.FC<ContainerBlockProps> = ({ content, children, style }) => {
    return (
        <div style={{
            backgroundColor: content.background || 'transparent',
            padding: content.padding || '20px',
            ...style
        }}>
            {children}
        </div>
    )
}
