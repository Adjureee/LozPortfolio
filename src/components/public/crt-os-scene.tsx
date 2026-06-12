import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Model as IbmPc } from './ibm-pc';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            <IbmPc isBootingOS={isBootingOS} onCompleteBoot={onCompleteBoot} />
          </group>
          {/* Default environment to make the beige plastic look good */}
          <Environment preset="city" />
        </Suspense>

        {/* Let the user look around the physical monitor! */}
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}
