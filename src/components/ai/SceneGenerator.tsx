import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageIcon, Sparkles, Loader2, RefreshCw, ChevronDown, Download, Maximize2, X, Copy, Check } from 'lucide-react';
import { egyptianPeriods } from '@/data/egyptianPeriods';
import { EgyptianButton } from '@/components/ui/EgyptianButton';
import { EgyptianCard, EgyptianCardContent } from '@/components/ui/EgyptianCard';
import { useToast } from '@/hooks/use-toast';

interface GeneratedScene {
    imageUrl: string;
    description: string;
    prompt: string;
    period: string;
}

const artStyles = [
    { value: 'realistic', label: 'Photorealistic Historical' },
    { value: 'painting', label: 'Classical Oil Painting' },
    { value: 'illustration', label: 'Detailed Illustration' },
    { value: 'cinematic', label: 'Cinematic Epic' },
    { value: 'watercolor', label: 'Watercolor Sketch' },
];

const exampleScenes = [
    "A young scribe writing on papyrus in the House of Life at Karnak Temple",
    "Pharaoh Ramesses II receiving tribute from Nubian ambassadors",
    "Workers building a pyramid at Giza with the Nile at sunset",
    "A priestess performing rituals at the Temple of Isis at Philae",
    "A bustling marketplace in ancient Thebes with merchants",
];

export function SceneGenerator() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedScene, setGeneratedScene] = useState<GeneratedScene | null>(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const { toast } = useToast();

    // Form state
    const [sceneText, setSceneText] = useState('');
    const [period, setPeriod] = useState('');
    const [style, setStyle] = useState('realistic');

    const handleGenerate = async () => {
        if (!sceneText.trim()) {
            toast({
                title: "Scene Description Required",
                description: "Please describe the scene you want to visualize.",
                variant: "destructive",
            });
            return;
        }

        setIsGenerating(true);
        setGeneratedScene(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/scene-generator`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
                    },
                    body: JSON.stringify({
                        sceneText: sceneText.trim(),
                        period: egyptianPeriods.find(p => p.id === period)?.name || 'Ancient Egypt',
                        style: artStyles.find(s => s.value === style)?.label || 'Photorealistic Historical',
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again in a moment.');
                }
                if (response.status === 402) {
                    throw new Error('AI credits exhausted. Please add credits to continue.');
                }
                throw new Error(errorData.error || 'Failed to generate scene');
            }

            const data = await response.json();
            setGeneratedScene(data);

            toast({
                title: "Scene Generated! 🎨",
                description: "Your Egyptian scene has been brought to life.",
            });
        } catch (error) {
            console.error('Scene generation error:', error);
            toast({
                title: "Generation Failed",
                description: error instanceof Error ? error.message : 'Unable to generate scene. Please try again.',
                variant: "destructive",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedScene?.imageUrl) return;

        try {
            const link = document.createElement('a');
            link.href = generatedScene.imageUrl;
            link.download = `egyptian-scene-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Download Started",
                description: "Your scene is being downloaded.",
            });
        } catch (error) {
            toast({
                title: "Download Failed",
                description: "Unable to download the image.",
                variant: "destructive",
            });
        }
    };

    const handleReset = () => {
        setGeneratedScene(null);
    };

    const handleExampleClick = (example: string) => {
        setSceneText(example);
    };

    return (
        <>
            <EgyptianCard variant="interactive" className="overflow-hidden">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-turquoise/20 flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-turquoise" />
                        </div>
                        <div className="text-left">
                            <h3 className="font-display font-semibold text-foreground">
                                Scene Generation
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Transform stories into vivid visual scenes
                            </p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <EgyptianCardContent className="p-4 pt-0 space-y-4">
                                {!generatedScene ? (
                                    <>
                                        {/* Scene Description */}
                                        <div>
                                            <label className="block font-display text-sm text-foreground mb-2">
                                                Scene Description *
                                            </label>
                                            <textarea
                                                value={sceneText}
                                                onChange={(e) => setSceneText(e.target.value)}
                                                placeholder="Describe the Egyptian scene you want to visualize..."
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[100px] resize-none"
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Be specific about characters, setting, lighting, and atmosphere
                                            </p>
                                        </div>

                                        {/* Example Prompts */}
                                        <div>
                                            <label className="block font-display text-sm text-foreground mb-2">
                                                Try an example:
                                            </label>
                                            <div className="space-y-2">
                                                {exampleScenes.slice(0, 3).map((example, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleExampleClick(example)}
                                                        className={`w-full p-3 rounded-lg text-left transition-all border ${sceneText === example
                                                            ? 'border-turquoise bg-turquoise/10'
                                                            : 'border-border hover:border-turquoise/50'
                                                            }`}
                                                    >
                                                        <span className="text-sm">{example}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Period Selection */}
                                        <div>
                                            <label className="block font-display text-sm text-foreground mb-2">
                                                Historical Period (optional)
                                            </label>
                                            <select
                                                value={period}
                                                onChange={(e) => setPeriod(e.target.value)}
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                aria-label="Historical Period"
                                                title="Historical Period"
                                            >
                                                <option value="">Any period...</option>
                                                {egyptianPeriods.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} ({p.yearRange})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Art Style Selection */}
                                        <div>
                                            <label className="block font-display text-sm text-foreground mb-2">
                                                Art Style
                                            </label>
                                            <select
                                                value={style}
                                                onChange={(e) => setStyle(e.target.value)}
                                                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                aria-label="Art Style"
                                                title="Art Style"
                                            >
                                                {artStyles.map((s) => (
                                                    <option key={s.value} value={s.value}>
                                                        {s.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Generate Button */}
                                        <EgyptianButton
                                            variant="hero"
                                            className="w-full"
                                            onClick={handleGenerate}
                                            disabled={isGenerating || !sceneText.trim()}
                                        >
                                            {isGenerating ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Painting your scene...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="w-4 h-4" />
                                                    Generate Scene
                                                </>
                                            )}
                                        </EgyptianButton>

                                        {isGenerating && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center text-sm text-muted-foreground"
                                            >
                                                <p className="animate-pulse">
                                                    🎨 Consulting the ancient artists... This may take 15-30 seconds.
                                                </p>
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="space-y-4"
                                    >
                                        {/* Image Display */}
                                        <div className="relative group rounded-lg overflow-hidden border border-border">
                                            <motion.img
                                                src={generatedScene.imageUrl}
                                                alt="Generated Egyptian scene"
                                                className="w-full h-auto object-cover"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ duration: 0.5 }}
                                            />

                                            {/* Image Overlay Actions */}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                <EgyptianButton
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setShowFullscreen(true)}
                                                    className="bg-background/20 hover:bg-background/40"
                                                    title="View fullscreen"
                                                >
                                                    <Maximize2 className="w-5 h-5 text-white" />
                                                </EgyptianButton>
                                                <EgyptianButton
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleDownload}
                                                    className="bg-background/20 hover:bg-background/40"
                                                    title="Download image"
                                                >
                                                    <Download className="w-5 h-5 text-white" />
                                                </EgyptianButton>
                                            </div>
                                        </div>

                                        {/* Scene Info */}
                                        <div className="p-4 rounded-lg bg-turquoise/10 border border-turquoise/30">
                                            <h4 className="font-display text-sm font-semibold text-turquoise mb-2 flex items-center gap-2">
                                                <ImageIcon className="w-4 h-4" />
                                                Generated Scene
                                            </h4>
                                            <p className="font-body text-foreground italic">"{generatedScene.prompt}"</p>
                                            {generatedScene.period && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-display">
                                                    {generatedScene.period}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-3">
                                            <EgyptianButton variant="outline" className="flex-1" onClick={handleReset}>
                                                <RefreshCw className="w-4 h-4" />
                                                New Scene
                                            </EgyptianButton>
                                            <EgyptianButton variant="hero" className="flex-1" onClick={handleDownload}>
                                                <Download className="w-4 h-4" />
                                                Download
                                            </EgyptianButton>
                                        </div>
                                    </motion.div>
                                )}
                            </EgyptianCardContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </EgyptianCard>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {showFullscreen && generatedScene && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setShowFullscreen(false)}
                    >
                        <button
                            onClick={() => setShowFullscreen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            aria-label="Close fullscreen"
                            title="Close fullscreen"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                        <motion.img
                            src={generatedScene.imageUrl}
                            alt="Generated Egyptian scene"
                            className="max-w-full max-h-full object-contain rounded-lg"
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
