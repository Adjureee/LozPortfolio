import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Commodore64 } from './commodore-64';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  
  // Calibration State
  const [scaleFactor, setScaleFactor] = useState(0.025);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [posZ, setPosZ] = useState(0);

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
      {/* Calibration UI Overlay */}
      <div className="absolute top-4 left-4 z-[10000] bg-white/90 p-4 rounded-lg shadow-xl text-black font-mono text-sm border border-gray-300 flex flex-col gap-2">
        <h3 className="font-bold border-b pb-1 mb-1">Calibration Tools</h3>
        
        <div className="flex items-center gap-2">
          <span className="w-12">Scale:</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setScaleFactor(s => +(s - 0.001).toFixed(4))}>-</button>
          <span className="w-16 text-center">{scaleFactor}</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setScaleFactor(s => +(s + 0.001).toFixed(4))}>+</button>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300 text-xs" onClick={() => setScaleFactor(s => +(s + 0.01).toFixed(4))}>+10x</button>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-12">Pos X:</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPosX(s => +(s - 0.01).toFixed(3))}>-</button>
          <span className="w-16 text-center">{posX}</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPosX(s => +(s + 0.01).toFixed(3))}>+</button>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-12">Pos Y:</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPosY(s => +(s - 0.01).toFixed(3))}>-</button>
          <span className="w-16 text-center">{posY}</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPosY(s => +(s + 0.01).toFixed(3))}>+</button>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-12">Pos Z:</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPosZ(s => +(s - 0.01).toFixed(3))}>-</button>
          <span className="w-16 text-center">{posZ}</span>
          <button className="px-2 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setPosZ(s => +(s + 0.01).toFixed(3))}>+</button>
        </div>
      </div>

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
            scaleFactor={scaleFactor}
            positionOffset={[posX, posY, posZ]}
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
