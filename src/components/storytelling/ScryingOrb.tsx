/// <reference types="@react-three/fiber" />
import React, { useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const Viewer360 = ({ image }: { image: string }) => {
    const textureUrl = (import.meta.env.BASE_URL || '/') + image;
    const texture = useTexture(textureUrl);

    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = 1;
    }, [texture]);

    return (
        <Sphere args={[500, 64, 40]}>
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </Sphere>
    );
};

export const ScryingOrb = ({ mode = 'globe', image = 'panorama.jpg' }: { mode?: 'globe' | 'viewer', image?: string }) => {
    const isViewer = mode === 'viewer';

    return (
        <div className="relative w-full h-full z-20 overflow-hidden rounded-lg bg-black/60">
            <AnimatePresence mode="wait">
                {isViewer ? (
                    /* High-end 3D Viewer Mode (Inside) */
                    <motion.div 
                        key="viewer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                    >
                        <Canvas 
                            camera={{ position: [0.1, 0, 0], fov: 80 }} 
                            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
                        >
                            <ambientLight intensity={1.5} />
                            <directionalLight position={[10, 10, 5]} intensity={2.5} />
                            <Suspense fallback={null}>
                                <Viewer360 image={image} />
                            </Suspense>
                            <OrbitControls
                                enableZoom={true}
                                enablePan={false}
                                rotateSpeed={-0.4}
                                target={[0, 0, 0]}
                            />
                        </Canvas>
                        
                        {/* Legend for Viewer Mode */}
                        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex items-center gap-3 rounded-lg border border-gold/20 bg-black/45 px-4 py-3 backdrop-blur-md z-30">
                            <div className="h-2 w-2 rounded-full bg-gold-light animate-pulse" />
                            <div>
                                <div className="font-display text-sm text-gold-light uppercase tracking-widest">𓂀 Heritage Viewer</div>
                                <div className="text-xs text-muted-foreground italic">Drag to explore the sacred chamber</div>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Classic CSS/Framer Motion Globe Mode (Outside) - RESTORED EXACTLY */
                    <motion.div 
                        key="globe"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
                            className="absolute h-[72%] w-[72%] rounded-full border border-gold/20"
                        />
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
                            className="absolute h-[54%] w-[54%] rounded-full border border-turquoise/20"
                        />
                        <motion.div
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="relative flex h-36 w-36 items-center justify-center rounded-full border border-gold/35 bg-[radial-gradient(circle_at_35%_25%,hsl(var(--gold-light)/0.85),hsl(var(--gold)/0.42)_34%,hsl(var(--lapis-deep)/0.85)_72%,hsl(var(--obsidian))_100%)] shadow-[0_0_70px_hsl(var(--gold)/0.28)]"
                        >
                            <div className="absolute inset-4 rounded-full border border-white/10" />
                            <span className="text-6xl text-obsidian drop-shadow-gold-glow select-none">𓂀</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
