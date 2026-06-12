import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SadOfficeRoom } from './sad-office-room';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        {/* Lights for the MeshStandardMaterial */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <group position={[0, -2, 0]}>
            <SadOfficeRoom isBootingOS={isBootingOS} onCompleteBoot={onCompleteBoot} />
          </group>
        </Suspense>

        {/* Camera Limits */}
        <OrbitControls 
          enablePan={true} 
          target={[0, -1, 0]}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 + 0.1} // Allow looking down at the keyboard, but not too far under the desk
          minDistance={0.5}
          maxDistance={12}
        />
      </Canvas>
    </div>
  );
}
