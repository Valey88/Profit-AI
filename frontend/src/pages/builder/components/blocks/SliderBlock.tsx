import React from 'react';

interface SliderBlockProps {
    content: {
        slides: Array<{ src: string; caption: string }>;
    };
    onChange?: (newContent: any) => void;
    readOnly?: boolean;
}

export const SliderBlock: React.FC<SliderBlockProps> = ({ content, onChange, readOnly }) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % content.slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + content.slides.length) % content.slides.length);
    };

    const addSlide = () => {
        if (onChange) {
            onChange({ ...content, slides: [...content.slides, { src: 'https://via.placeholder.com/800x400', caption: 'New Slide' }] });
        }
    }

    return (
        <div className="relative w-full h-64 bg-gray-100 rounded overflow-hidden group">
            {content.slides.length > 0 && (
                <>
                    <img
                        src={content.slides[currentSlide].src}
                        alt={content.slides[currentSlide].caption}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center">
                        {content.slides[currentSlide].caption}
                    </div>

                    <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white text-black">
                        &larr;
                    </button>
                    <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white text-black">
                        &rarr;
                    </button>
                </>
            )}

            {!readOnly && (
                <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={addSlide} className="bg-blue-500 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Add Slide
                    </button>
                </div>
            )}
        </div>
    );
};
