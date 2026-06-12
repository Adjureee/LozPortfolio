import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera } from '@react-three/drei';
import { Model as IbmPc } from './ibm-pc';
import { EnvironmentModel } from './environment';
import { DecorModel } from './decor';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  return (
    <div className="w-full h-full bg-black">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1.5, 5]} fov={50} />
        
        {/* We keep environment reflection for the beige plastic, but lighting comes from baked textures mostly */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            {/* The room and desk */}
            <EnvironmentModel position={[0, 0, 0]} />
            <DecorModel position={[0, 0, 0]} />
            
            {/* The IBM PC Monitor */}
            <IbmPc 
              position={[-0.3, 0.72, -0.5]} 
              scale={0.5} 
              isBootingOS={isBootingOS} 
              onCompleteBoot={onCompleteBoot} 
            />
          </group>
          <Environment preset="city" />
        </Suspense>

        {/* Strict controls to prevent looking under the desk */}
        <OrbitControls 
          enablePan={false} 
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from dropping below the desk surface
          maxAzimuthAngle={Math.PI / 4} // Limit side-to-side panning to keep the focus on the desk
          minAzimuthAngle={-Math.PI / 4}
          minDistance={2}
          maxDistance={8}
        />
      </Canvas>
    </div>
  );
}
