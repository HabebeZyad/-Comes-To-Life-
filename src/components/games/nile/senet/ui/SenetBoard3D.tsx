import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { GameState } from '../engine/types';
import { SenetEngine } from '../engine/SenetEngine';

interface SenetBoard3DProps {
  gameState: GameState;
  onPieceClick: (id: number) => void;
  legalMoves: number[];
}

const Piece3D = ({ 
  pieceType, 
  position, 
  isLegal,
  onClick 
}: { 
  pieceType: 'player1' | 'player2'; 
  position: THREE.Vector3; 
  isLegal: boolean;
  onClick: () => void;
}) => {
  const color = pieceType === 'player1' ? '#C9A227' : '#235D5A';

  return (
    <mesh 
      position={[position.x, position.y + 0.1, position.z]} 
      castShadow 
      onClick={(e) => {
        e.stopPropagation();
        if (isLegal) onClick();
      }}
      className="cursor-pointer"
    >
      {pieceType === 'player1' ? (
        // Gold Spool Piece for Player 1
        <group>
          <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.15} 
            emissive={isLegal ? '#ffe57f' : '#000'}
            emissiveIntensity={isLegal ? 0.3 : 0}
          />
        </group>
      ) : (
        // Lapis Cone Piece for Player 2
        <group>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.4} 
            roughness={0.3} 
            emissive={isLegal ? '#4db6ac' : '#000'}
            emissiveIntensity={isLegal ? 0.3 : 0}
          />
        </group>
      )}
    </mesh>
  );
};

export const SenetBoard3D: React.FC<SenetBoard3DProps> = ({ gameState, onPieceClick, legalMoves }) => {
  const getVisualPosition = (id: number) => {
    if (id <= 10) return { row: 0, col: id - 1 };
    if (id <= 20) return { row: 1, col: 20 - id };
    return { row: 2, col: id - 21 };
  };

  const get3DPosition = useMemo(() => {
    return (id: number) => {
      const { row, col } = getVisualPosition(id);
      const x = col - 4.5;
      const z = row - 1.0;
      return new THREE.Vector3(x, 0.25, z);
    };
  }, []);

  return (
    <div className="w-full h-full bg-obsidian rounded-2xl overflow-hidden border border-gold/20 shadow-gold-glow">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 7, 8]} fov={45} />
        <OrbitControls maxPolarAngle={Math.PI / 2.3} minDistance={5} maxDistance={12} />
        
        <ambientLight intensity={0.4} />
        <spotLight position={[5, 10, 5]} angle={0.3} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-5, 5, -5]} intensity={1} color="#C9A227" />

        {/* Sandstone/Wood Master Board Block */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]} receiveShadow>
          <boxGeometry args={[11, 4, 0.4]} />
          <meshStandardMaterial color="#221711" roughness={0.9} metalness={0.1} />
        </mesh>

        {/* Board Outline Accent */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.051, 0]}>
          <boxGeometry args={[10.3, 3.3, 0.02]} />
          <meshStandardMaterial color="#C9A227" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Squares Board Grid */}
        {Array.from({ length: 30 }, (_, i) => {
          const id = i + 1;
          const p = get3DPosition(id);
          const type = SenetEngine.getSquareType(id);
          const isLegal = legalMoves.includes(id);

          // Themed colored wood cells
          let color = '#3d2b1f'; // dark wood
          if ((Math.floor(i / 10) + (i % 10)) % 2 === 0) {
            color = '#2f2017'; // alternating square color
          }

          if (type === 'happiness') color = '#604f2d'; // House of Happiness - Gold wash
          if (type === 'water') color = '#1a3344';      // House of Water - Nile Blue
          if (type === 'rebirth') color = '#20443d';    // Rebirth - Turquoise Green
          if (type === 're-atum') color = '#552211';    // Eye of Horus - Deep Crimson
          if (type === 'last') color = '#483c66';       // Last square - Royal Purple

          return (
            <group key={id}>
              {/* Wooden Square Cell */}
              <mesh position={[p.x, 0.06, p.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[0.95, 0.95]} />
                <meshStandardMaterial 
                  color={color} 
                  roughness={0.85} 
                  metalness={0.15}
                />
              </mesh>

              {/* Glowing Interactive Ring if it's a legal moving cell */}
              {isLegal && (
                <mesh position={[p.x, 0.07, p.z]} rotation={[-Math.PI / 2, 0, 0]}>
                  <ringGeometry args={[0.35, 0.45, 32]} />
                  <meshStandardMaterial 
                    color="#C9A227" 
                    emissive="#C9A227" 
                    emissiveIntensity={1.5} 
                    roughness={0.2}
                  />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Render Active Pieces */}
        {gameState.board.map((square) => {
          if (!square.piece) return null;
          const p = get3DPosition(square.id);
          const isLegal = legalMoves.includes(square.id);
          return (
            <Piece3D 
              key={square.id}
              pieceType={square.piece}
              position={p}
              isLegal={isLegal}
              onClick={() => onPieceClick(square.id)}
            />
          );
        })}

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <Environment preset="night" />
      </Canvas>
    </div>
  );
};
