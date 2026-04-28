import React, { useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, useTexture, ContactShadows, Text } from '@react-three/drei';
import * as THREE from 'three';

const ForceResize = () => {
    useEffect(() => {
        // Dispatches global resize events to force React-Three-Fiber to recalculate
        // its pixel bounding box exactly after Framer Motion finishes scaling the parent.
        const t1 = setTimeout(() => window.dispatchEvent(new Event('resize')), 100);
        const t2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 900); // Exceeds the 0.8s animation duration
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);
    return null;
};

const GlobeGlobe = () => {
    return (
        <group>
            <Sphere args={[3.6, 64, 64]}>
                <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.3} />
            </Sphere>

            <Text position={[0, 0, 3.8]} fontSize={4.5} color="#000000" outlineColor="#cca630" outlineWidth={0.05}>
                𓂀
            </Text>
            <Text position={[0, 0, -3.8]} rotation={[0, Math.PI, 0]} fontSize={4.5} color="#000000" outlineColor="#cca630" outlineWidth={0.05}>
                𓂀
            </Text>
            <Text position={[3.8, 0, 0]} rotation={[0, Math.PI / 2, 0]} fontSize={4.5} color="#000000" outlineColor="#cca630" outlineWidth={0.05}>
                𓂀
            </Text>
            <Text position={[-3.8, 0, 0]} rotation={[0, -Math.PI / 2, 0]} fontSize={4.5} color="#000000" outlineColor="#cca630" outlineWidth={0.05}>
                𓂀
            </Text>

            <ContactShadows opacity={0.8} scale={10} blur={2.5} far={5} color="#000000" position={[0, -4, 0]} />
        </group>
    );
};

const Viewer360 = ({ image }: { image: string }) => {
    const textureUrl = (import.meta.env.BASE_URL || '/') + image;
    const texture = useTexture(textureUrl);

    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.repeat.x = 1; // Native orientation for inside viewing
    }, [texture]);

    return (
        <Sphere args={[500, 64, 40]}>
            <meshBasicMaterial map={texture} side={THREE.BackSide} />
        </Sphere>
    );
};

export const ScryingOrb = ({ mode = "globe", image = "panorama.jpg" }: { mode?: "globe" | "viewer", image?: string }) => {
    return (
        <div className={`relative w-full h-full z-20 overflow-hidden bg-black/60`}>
            <Canvas camera={{ position: mode === 'viewer' ? [0.1, 0, 0] : [0, 0, 10], fov: mode === 'viewer' ? 80 : 45 }} className={`absolute inset-0 w-full h-full ${mode === 'globe' ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'}`}>
                <ForceResize />
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2.5} />
                <directionalLight position={[-10, 10, -5]} intensity={1} />
                <React.Suspense fallback={null}>
                    {mode === 'globe' ? <GlobeGlobe /> : <Viewer360 image={image} />}
                </React.Suspense>

                {mode === 'globe' ? (
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={true}
                        autoRotateSpeed={1.5}
                    />
                ) : (
                    <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        rotateSpeed={-0.4}
                        target={[0, 0, 0]}
                    />
                )}
            </Canvas>
        </div>
    );
};
