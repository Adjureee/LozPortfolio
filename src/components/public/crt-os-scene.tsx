import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SadOfficeRoom } from './sad-office-room';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  return (
    <div 
      className="w-full h-full bg-black relative"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
      >
        {/* Camera positioned to start near the screen, looking at it */}
        <PerspectiveCamera 
          makeDefault 
          position={[0, 4, -20]} // Adjust as needed to get a good initial view of the desk/screen
          fov={45} 
        />
        
        {/* Lighting */}
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <SadOfficeRoom 
            isBootingOS={isBootingOS} 
            onCompleteBoot={onCompleteBoot}
          />
        </Suspense>

        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.1}
          zoomSpeed={1.2}
          rotateSpeed={0.8}
          panSpeed={0.8}
          // Focus the orbit controls directly onto the CRT screen coordinates
          target={[6.237, 1.437, -31.029]}
          makeDefault
          // Optional constraints to keep user in the room
          minDistance={1}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2 + 0.2}
        />
      </Canvas>
    </div>
  );
}
