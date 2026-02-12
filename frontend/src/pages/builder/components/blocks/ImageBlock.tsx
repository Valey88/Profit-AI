import React from 'react';

interface ImageBlockProps {
    content: {
        src: string;
        alt: string;
        width?: string;
    };
    onChange?: (newContent: any) => void;
    readOnly?: boolean;
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ content, onChange, readOnly }) => {

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) onChange({ ...content, src: e.target.value });
    }

    return (
        <div className="w-full flex flex-col items-center">
            <img
                src={content.src}
                alt={content.alt}
                style={{ width: content.width || '100%', maxWidth: '100%' }}
                className="rounded shadow-sm"
            />
            {!readOnly && (
                <input
                    type="text"
                    value={content.src}
                    onChange={handleUrlChange}
                    className="mt-2 text-xs p-1 border rounded w-full"
                    placeholder="Image URL"
                />
            )}
        </div>
    );
};
