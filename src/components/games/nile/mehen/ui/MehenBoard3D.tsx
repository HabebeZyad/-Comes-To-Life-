import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Float, Stars, Environment, Text } from '@react-three/drei';
import * as THREE from 'three';
import { GameState, Piece } from '../engine/types';

interface MehenBoard3DProps {
  gameState: GameState;
  boardSize: number;
}

const Piece3D = ({ piece, position }: { piece: Piece; position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const color = piece.owner === 'player1' ? '#C9A227' : piece.owner === 'player2' ? '#2B7A78' : '#D4A51B';

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position}>
        {piece.isLion ? (
          <octahedronGeometry args={[0.25, 0]} />
        ) : (
          <sphereGeometry args={[0.15, 32, 32]} />
        )}
        <meshStandardMaterial 
          color={color} 
          metalness={0.8} 
          roughness={0.2} 
          emissive={color} 
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  );
};

const BoardMesh = ({ boardSize }: { boardSize: number }) => {
  const points = useMemo(() => {
    const p = [];
    const centerX = 0;
    const centerY = 0;
    const initialRadius = 4.5;
    const finalRadius = 0.5;
    const totalRotations = 3;
    
    for (let i = 0; i <= 200; i++) {
      const t = i / 200;
      const angle = t * totalRotations * Math.PI * 2;
      const radius = initialRadius - t * (initialRadius - finalRadius);
      p.push(new THREE.Vector3(Math.cos(angle) * radius, -0.1, Math.sin(angle) * radius));
    }
    return p;
  }, []);

  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <group>
      {/* Stone Base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <cylinderGeometry args={[6, 6, 0.5, 64]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Spiral Path */}
      <mesh rotation={[0, 0, 0]}>
        <tubeGeometry args={[curve, 200, 0.4, 8, false]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Glowing Accents */}
      <mesh rotation={[0, 0, 0]}>
        <tubeGeometry args={[curve, 200, 0.05, 8, false]} />
        <meshStandardMaterial color="#C9A227" emissive="#C9A227" emissiveIntensity={2} />
      </mesh>
    </group>
  );
};

export const MehenBoard3D: React.FC<MehenBoard3DProps> = ({ gameState, boardSize }) => {
  const spiralPoints = useMemo(() => {
    const p = [];
    const centerX = 0;
    const centerY = 0;
    const initialRadius = 4.5;
    const finalRadius = 0.5;
    const totalRotations = 3;
    
    for (let i = 0; i <= boardSize; i++) {
      const t = i / boardSize;
      const angle = t * totalRotations * Math.PI * 2;
      const radius = initialRadius - t * (initialRadius - finalRadius);
      p.push(new THREE.Vector3(Math.cos(angle) * radius, 0.3, Math.sin(angle) * radius));
    }
    return p;
  }, [boardSize]);

  return (
    <div className="w-full h-full bg-obsidian rounded-2xl overflow-hidden border border-gold/20 shadow-gold-glow">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 8, 10]} fov={50} />
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2.2} 
          minDistance={5} 
          maxDistance={15} 
        />
        
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#050505', 10, 25]} />
        
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        <spotLight position={[-10, 15, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />

        <BoardMesh boardSize={boardSize} />
        
        {gameState.pieces.filter(p => !p.isFinished).map((piece) => (
          <Piece3D 
            key={piece.id} 
            piece={piece} 
            position={spiralPoints[piece.position]} 
          />
        ))}

        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};
