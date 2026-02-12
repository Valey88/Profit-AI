import React from 'react';

interface TextBlockProps {
    content: {
        text: string;
        tag?: 'h1' | 'h2' | 'h3' | 'p';
        align?: 'left' | 'center' | 'right';
    };
    onChange?: (newContent: any) => void;
    readOnly?: boolean;
}

export const TextBlock: React.FC<TextBlockProps> = ({ content, onChange, readOnly = false }) => {
    const Tag = content.tag || 'p';

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (onChange) {
            onChange({ ...content, text: e.target.value });
        }
    }

    if (readOnly) {
        return <Tag style={{ textAlign: content.align || 'left' }}>{content.text}</Tag>;
    }

    return (
        <div className="w-full">
            <textarea
                className="w-full p-2 border-none bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-blue-300 rounded"
                value={content.text}
                onChange={handleChange}
                style={{ textAlign: content.align || 'left' }}
            />
        </div>
    );
};
