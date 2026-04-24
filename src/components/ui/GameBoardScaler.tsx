import React, { useRef, useState, useEffect } from 'react';

interface GameBoardScalerProps {
    children: React.ReactNode;
    originalWidth: number;
    originalHeight: number;
    className?: string;
}

export function GameBoardScaler({ children, originalWidth, originalHeight, className = '' }: GameBoardScalerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                // Measure parent width and available vertical window height, buffering for UI
                const availableWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth - 32;

                // Subtract ~220px to account for the bottom nav bar, top headers, and padding.
                const availableHeight = window.innerHeight - 220;

                const scaleW = availableWidth / originalWidth;
                const scaleH = availableHeight / originalHeight;

                setScale(Math.max(0.2, Math.min(1, scaleW, scaleH)));
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        // Initial jump fix
        setTimeout(handleResize, 50);

        return () => window.removeEventListener('resize', handleResize);
    }, [originalWidth]);

    return (
        <div
            ref={containerRef}
            className={`w-full flex justify-center ${className}`}
            style={{ height: scale < 1 ? originalHeight * scale : originalHeight }}
        >
            <div
                style={{
                    width: originalWidth,
                    height: originalHeight,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                }}
            >
                {children}
            </div>
        </div>
    );
}
