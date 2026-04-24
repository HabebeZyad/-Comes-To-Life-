import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export function LandscapePrompt() {
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            // Check if it's a mobile device (width < 768) and portrait mode
            const isMobilePortrait = window.matchMedia('(max-width: 767px) and (orientation: portrait)').matches;
            setShowPrompt(isMobilePortrait);
        };

        checkOrientation();
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);

        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
                >
                    <motion.div
                        animate={{ rotate: -90 }}
                        transition={{
                            repeat: Infinity,
                            repeatType: "reverse",
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                        className="mb-8 p-4 bg-gold/10 rounded-full border border-gold/30"
                    >
                        <RotateCcw className="w-16 h-16 text-gold" />
                    </motion.div>

                    <h2 className="text-4xl font-display text-gold-gradient mb-4">Rotate Device</h2>
                    <p className="text-muted-foreground font-body text-xl max-w-sm">
                        This ancient trial requires a wider view. Please rotate your device to landscape mode to continue your journey.
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
