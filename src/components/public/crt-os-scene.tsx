import React, { Suspense, useState, useCallback, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SadOfficeRoom } from './sad-office-room';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';

// Helper to log the world position of the model so we can set the orbit target
function SceneInspector({ onTargetFound }: { onTargetFound: (pos: THREE.Vector3) => void }) {
  const { scene } = useThree();
  
  React.useEffect(() => {
    // Walk through the scene to find the first mesh and compute its world center
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);
        onTargetFound(worldPos);
        return;
      }
    });
  }, [scene, onTargetFound]);

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  const [screenConfig, setScreenConfig] = useState({
    x: 0, y: 0, z: 0,
    rx: 0, ry: 0, rz: 0,
    scale: 1
  });

  const [orbitTarget, setOrbitTarget] = useState<[number, number, number]>([0, 0, 0]);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleTargetFound = useCallback((pos: THREE.Vector3) => {
    const target: [number, number, number] = [pos.x, pos.y, pos.z];
    setOrbitTarget(target);
    if (controlsRef.current) {
      controlsRef.current.target.set(pos.x, pos.y, pos.z);
      controlsRef.current.update();
    }
  }, []);

  return (
    <div 
      className="w-full h-full bg-black relative"
      style={{ touchAction: 'none' }}
    >
      {/* 3D Canvas — zero DOM overlays, pure WebGL */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
        camera={{ position: [0, 0, 15], fov: 50 }}
      >
        {/* Lighting */}
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <SadOfficeRoom screenConfig={screenConfig} />
          <SceneInspector onTargetFound={handleTargetFound} />
        </Suspense>

        {/* OrbitControls — completely unconstrained */}
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
          target={orbitTarget}
          makeDefault
        />
      </Canvas>

      {/* Calibration UI — pure HTML overlay with pointer-events only on itself */}
      <div 
        className="absolute inset-0 z-[10000]" 
        style={{ pointerEvents: 'none' }}
      >
        <div 
          className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white flex flex-col gap-2 w-72 text-sm font-mono border border-white/20"
          style={{ pointerEvents: 'auto' }}
        >
          <div className="font-bold mb-2 border-b border-white/20 pb-1 text-green-400">⬛ Screen Calibration</div>
          <p className="text-[10px] text-gray-400 mb-2">
            Move the green rectangle over the CRT screen glass. Send me the numbers when aligned.
          </p>
          {Object.entries(screenConfig).map(([key, value]) => (
            <label key={key} className="flex justify-between items-center gap-2">
              <span className="w-10 uppercase font-bold text-green-300">{key}</span>
              <input 
                type="range" 
                min={key === 'scale' ? 0.01 : -50} 
                max={key === 'scale' ? 5 : 50} 
                step={key === 'scale' ? 0.01 : 0.1} 
                value={value} 
                onChange={(e) => setScreenConfig(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
                className="flex-1 accent-green-400"
              />
              <span className="w-14 text-right text-xs text-green-200 font-mono">{value.toFixed(2)}</span>
            </label>
          ))}
          <div className="mt-2 p-2 bg-black/60 rounded text-[10px] text-gray-400 break-all select-all">
            {JSON.stringify(screenConfig)}
          </div>
        </div>
      </div>
    </div>
  );
}
