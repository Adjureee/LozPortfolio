import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { SadOfficeRoom } from './sad-office-room';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  // Calibration lives HERE (outside Canvas) so it cannot block pointer events
  const [screenConfig, setScreenConfig] = useState({
    x: 0, y: 15, z: 0,
    rx: 0, ry: 0, rz: 0,
    scale: 0.1
  });

  return (
    <div className="w-full h-full bg-black relative">
      {/* 3D Canvas — receives ALL pointer events cleanly */}
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        onPointerMissed={() => {}} // prevents clicks from propagating out
      >
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <group position={[0, -2, 0]}>
            <SadOfficeRoom 
              isBootingOS={isBootingOS} 
              onCompleteBoot={onCompleteBoot}
              screenConfig={screenConfig}
            />
          </group>
        </Suspense>

        {/* OrbitControls — no angle or distance constraints for calibration */}
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={1.5}
          makeDefault
        />
      </Canvas>

      {/* Calibration UI — pure HTML overlay, outside Canvas entirely */}
      <div className="absolute top-4 left-4 bg-white/90 p-4 rounded-lg shadow-xl text-black flex flex-col gap-2 w-64 text-sm font-mono z-[10000] pointer-events-auto">
        <div className="font-bold mb-2 border-b pb-1">Screen Calibration</div>
        {Object.entries(screenConfig).map(([key, value]) => (
          <label key={key} className="flex justify-between items-center gap-2">
            <span className="w-10 uppercase font-bold">{key}</span>
            <input 
              type="range" 
              min={key === 'scale' ? 0.01 : -50} 
              max={key === 'scale' ? 2 : 50} 
              step={key === 'scale' ? 0.01 : 0.1} 
              value={value} 
              onChange={(e) => setScreenConfig(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))}
              className="flex-1"
            />
            <span className="w-12 text-right text-xs">{value.toFixed(2)}</span>
          </label>
        ))}
        <p className="text-[10px] text-gray-500 mt-2">
          Align the OS screen over the monitor glass, then send me these numbers.
        </p>
      </div>
    </div>
  );
}
