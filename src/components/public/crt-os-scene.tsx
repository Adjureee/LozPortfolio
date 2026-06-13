import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Commodore64 } from './commodore-64';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);

  const handleAutoAlign = useCallback((pos: [number, number, number]) => {
    // When the programmatic extraction finds the screen surface, 
    // it automatically passes the exact coordinates up here.
    // We dynamically update the OrbitControls target to center perfectly on the screen!
    setCameraTarget(pos);
    if (controlsRef.current) {
      controlsRef.current.target.set(pos[0], pos[1], pos[2]);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div 
      className="w-full h-full bg-black relative"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 4, 15]} fov={45} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <Commodore64 
            isBootingOS={isBootingOS} 
            onCompleteBoot={onCompleteBoot}
            onAutoAlign={handleAutoAlign}
          />
        </Suspense>

        <OrbitControls 
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.1}
          zoomSpeed={1.2}
          rotateSpeed={0.8}
          panSpeed={0.8}
          target={cameraTarget}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
