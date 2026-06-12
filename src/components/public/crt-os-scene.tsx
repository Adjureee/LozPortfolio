import React, { Suspense, useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { SadOfficeRoom } from './sad-office-room';

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  const [screenConfig, setScreenConfig] = useState({
    x: 0, y: 0, z: 0,
    rx: 0, ry: 0, rz: 0,
    scale: 1
  });

  const [transformMode, setTransformMode] = useState<'translate' | 'rotate' | 'scale'>('translate');
  const [enableClickToPlace, setEnableClickToPlace] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div 
      className="w-full h-full bg-black relative"
      style={{ touchAction: 'none' }}
    >
      <Canvas
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true }}
      >
        <PerspectiveCamera makeDefault position={[0, 4, -20]} fov={45} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <SadOfficeRoom 
            screenConfig={screenConfig} 
            transformMode={transformMode}
            onTransformChange={setScreenConfig}
            enableClickToPlace={enableClickToPlace}
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
          target={[0, 0, -25]}
          makeDefault
        />
      </Canvas>

      {/* Calibration UI */}
      <div className="absolute inset-0 z-[10000]" style={{ pointerEvents: 'none' }}>
        <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm p-4 rounded-lg shadow-xl text-white flex flex-col gap-2 w-80 text-sm font-mono border border-white/20" style={{ pointerEvents: 'auto' }}>
          <div className="font-bold mb-2 border-b border-white/20 pb-1 text-red-400">🚨 ALIGNMENT FIXER 🚨</div>
          
          <button 
            onClick={() => setEnableClickToPlace(!enableClickToPlace)}
            className={`py-2 px-2 rounded text-xs font-bold border transition-colors ${enableClickToPlace ? 'bg-red-500 text-black border-red-500 animate-pulse' : 'bg-black/50 text-white border-red-500 hover:bg-red-500 hover:text-black'}`}
          >
            {enableClickToPlace ? "CLICK ON CRT GLASS NOW..." : "1. ACTIVATE CLICK-TO-SNAP"}
          </button>
          
          <p className="text-[10px] text-gray-400 mb-2 leading-tight">
            The previous alignment suffered from 'parallax error' (it looked aligned, but was actually floating 7 meters behind the desk!). <br/><br/>
            <strong>Fix it:</strong> Click the 'ACTIVATE CLICK-TO-SNAP' button, then click directly on the CRT monitor glass in the 3D scene. The green screen will physically snap to the glass. Then use Rotate/Scale to adjust it.
          </p>

          <div className="flex gap-2 mb-2 mt-2">
            {(['translate', 'rotate', 'scale'] as const).map(mode => (
              <button 
                key={mode}
                onClick={() => setTransformMode(mode)}
                className={`flex-1 py-1 rounded text-xs uppercase font-bold border transition-colors ${transformMode === mode ? 'bg-green-500 text-black border-green-500' : 'bg-black/50 text-gray-400 border-white/20 hover:border-green-500 hover:text-green-400'}`}
              >
                {mode}
              </button>
            ))}
          </div>

          {Object.entries(screenConfig).map(([key, value]) => (
            <label key={key} className="flex justify-between items-center gap-2">
              <span className="w-10 uppercase font-bold text-green-300">{key}</span>
              <input 
                id={`calib-${key}`}
                type="number" 
                step={key === 'scale' ? 0.01 : 0.1} 
                defaultValue={Number(value).toFixed(2)} 
                onChange={(e) => setScreenConfig(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                className="flex-1 bg-black/50 text-white border border-white/20 rounded px-2 py-1 outline-none focus:border-green-400 font-mono text-right"
              />
            </label>
          ))}
          <div id="calib-json" className="mt-2 p-2 bg-black/60 rounded text-[10px] text-gray-400 break-all select-all leading-tight">
            {JSON.stringify(screenConfig)}
          </div>
        </div>
      </div>
    </div>
  );
}
