import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GameState, Peg } from '../engine/types';

interface HoundsBoard3DProps {
  gameState: GameState;
}

const Peg3D = ({ peg, position }: { peg: Peg; position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = peg.side === 'hounds' ? '#C9A227' : '#2B547E';

  return (
    <mesh ref={meshRef} position={position} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.8, 16]} />
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.5} />
      {/* Decorative head */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </mesh>
  );
};

export const HoundsBoard3D: React.FC<HoundsBoard3DProps> = ({ gameState }) => {
  const trackPoints = useMemo(() => {
    const generateTrack = (isLeft: boolean) => {
      const points: THREE.Vector3[] = [];
      const startX = isLeft ? -1.5 : 1.5;
      const startZ = 4;
      for (let i = 0; i < 30; i++) {
        let x = startX;
        let z = startZ - i * 0.3;
        if (i > 15) {
          x = isLeft ? startX + 0.8 : startX - 0.8;
          z = startZ - (29 - i) * 0.3;
        }
        points.push(new THREE.Vector3(x, 0.3, z));
      }
      return points;
    };
    return { hounds: generateTrack(true), jackals: generateTrack(false) };
  }, []);

  return (
    <div className="w-full h-full bg-black rounded-2xl overflow-hidden border border-gold/20 shadow-gold-glow">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 10, 8]} fov={45} />
        <OrbitControls maxPolarAngle={Math.PI / 2.5} minDistance={6} maxDistance={15} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#C9A227" />

        {/* Board */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.25, 0]} receiveShadow>
          <boxGeometry args={[6, 10, 0.5]} />
          <meshStandardMaterial color="#3d2b1f" roughness={0.8} />
        </mesh>

        {/* Holes Visualization */}
        {[...trackPoints.hounds, ...trackPoints.jackals].map((p, i) => (
          <mesh key={i} position={[p.x, -0.01, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.08, 16]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        ))}

        {/* Pegs */}
        {gameState.pegs.filter(p => !p.isFinished && p.position >= 0).map((peg) => (
          <Peg3D 
            key={peg.id} 
            peg={peg} 
            position={trackPoints[peg.side][peg.position]} 
          />
        ))}

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};
