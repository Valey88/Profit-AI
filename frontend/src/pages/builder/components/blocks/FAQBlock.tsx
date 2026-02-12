import React from 'react';

interface FAQBlockProps {
    content: {
        items: Array<{ question: string; answer: string }>;
    };
    onChange?: (newContent: any) => void;
    readOnly?: boolean;
}

export const FAQBlock: React.FC<FAQBlockProps> = ({ content, onChange, readOnly }) => {

    const handleItemChange = (index: number, field: 'question' | 'answer', value: string) => {
        if (onChange) {
            const newItems = [...content.items];
            newItems[index] = { ...newItems[index], [field]: value };
            onChange({ ...content, items: newItems });
        }
    }

    const addItem = () => {
        if (onChange) {
            onChange({ ...content, items: [...content.items, { question: 'New Question?', answer: 'New Answer.' }] });
        }
    }

    return (
        <div className="w-full space-y-2">
            {content.items.map((item, index) => (
                <div key={index} className="border rounded p-3 bg-white">
                    {readOnly ? (
                        <details>
                            <summary className="font-semibold cursor-pointer">{item.question}</summary>
                            <p className="mt-2 text-gray-600 pl-4 border-l-2 border-gray-200">{item.answer}</p>
                        </details>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <input
                                className="font-semibold w-full border-b focus:outline-none focus:border-blue-500"
                                value={item.question}
                                onChange={(e) => handleItemChange(index, 'question', e.target.value)}
                                placeholder="Question"
                            />
                            <textarea
                                className="w-full text-gray-600 focus:outline-none resize-none"
                                value={item.answer}
                                onChange={(e) => handleItemChange(index, 'answer', e.target.value)}
                                placeholder="Answer"
                            />
                        </div>
                    )}
                </div>
            ))}
            {!readOnly && (
                <button onClick={addItem} className="text-sm text-blue-500 hover:text-blue-700">
                    + Add FAQ Item
                </button>
            )}
        </div>
    );
};
