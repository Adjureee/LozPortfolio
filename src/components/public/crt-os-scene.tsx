import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera, Html, useProgress } from '@react-three/drei';
import type CameraControlsImpl from 'camera-controls';
import * as THREE from 'three';
import { AnimatePresence, motion } from 'framer-motion';
import { Commodore64 } from './commodore-64';

export type CameraState = 'BOOTING' | 'AT_SCREEN' | 'ZOOMED_OUT';

export function CRTOsScene({ isBootingOS, isAwaitingBoot, onCompleteBoot }: { isBootingOS: boolean, isAwaitingBoot?: boolean, onCompleteBoot: () => void }) {
  const cameraControlsRef = useRef<CameraControlsImpl>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number] | null>(null);
  
  // Camera State Machine
  const [cameraState, setCameraState] = useState<CameraState>(
    isAwaitingBoot ? 'ZOOMED_OUT' : (isBootingOS ? 'BOOTING' : 'ZOOMED_OUT')
  );
  
  // Unified Hover Hit-Detection
  const [isHovering3D, setIsHovering3D] = useState(false);
  const [isHoveringHTML, setIsHoveringHTML] = useState(false);
  const isHoveringMonitor = isHovering3D || isHoveringHTML;

  // Handle Boot Sequence Completion
  useEffect(() => {
    if (isBootingOS) {
      setCameraState('BOOTING');
    } else if (cameraState === 'BOOTING') {
      // Boot finished, transition to AT_SCREEN or ZOOMED_OUT depending on mouse position
      setCameraState(isHoveringMonitor ? 'AT_SCREEN' : 'ZOOMED_OUT');
    }
  }, [isBootingOS, cameraState, isHoveringMonitor]);

  // Handle Hover-to-Zoom Transitions
  useEffect(() => {
    if (cameraState === 'BOOTING' || isAwaitingBoot) return; // Lock camera while booting or awaiting
    
    if (cameraState === 'ZOOMED_OUT' && isHoveringMonitor) {
      setCameraState('AT_SCREEN');
    } else if (cameraState === 'AT_SCREEN' && !isHoveringMonitor) {
      setCameraState('ZOOMED_OUT');
    }
  }, [isHoveringMonitor, cameraState, isAwaitingBoot]);

  // Execute Camera Transition Animations
  useEffect(() => {
    if (!cameraControlsRef.current || !cameraTarget) return;

    if (cameraState === 'BOOTING' || cameraState === 'AT_SCREEN') {
      // Smoothly fly towards the monitor with a tighter zoom
      cameraControlsRef.current.setLookAt(
        cameraTarget[0], cameraTarget[1] + 0.05, cameraTarget[2] + 2.5, // Tighter camera position
        cameraTarget[0], cameraTarget[1], cameraTarget[2],             // Target position
        true // Enable smooth transition!
      );
    } else if (cameraState === 'ZOOMED_OUT') {
      // Pull back to wider desk view
      cameraControlsRef.current.setLookAt(
        0, 4, 12,                                                      // Camera position
        cameraTarget[0], cameraTarget[1], cameraTarget[2],             // Target position
        true // Enable smooth transition!
      );
    }
  }, [cameraState, cameraTarget]);

  const handleAutoAlign = useCallback((pos: [number, number, number]) => {
    setCameraTarget(pos);
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
        {/* We start at the zoomed out desk position */}
        <PerspectiveCamera makeDefault position={[0, 4, 12]} fov={45} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<CanvasLoader />}>
          <Commodore64 
            isBootingOS={isBootingOS} 
            isAwaitingBoot={isAwaitingBoot}
            onCompleteBoot={onCompleteBoot}
            onAutoAlign={handleAutoAlign}
            onMonitorEnter3D={() => setIsHovering3D(true)}
            onMonitorLeave3D={() => setIsHovering3D(false)}
            onMonitorEnterHTML={() => setIsHoveringHTML(true)}
            onMonitorLeaveHTML={() => setIsHoveringHTML(false)}
          />
        </Suspense>
        
        <CameraControls 
          ref={cameraControlsRef} 
          makeDefault 
          enabled={!isBootingOS && !isAwaitingBoot} // Lock controls during boot sequence and awaiting
        />
      </Canvas>

      <ZoomedOutOverlay isVisible={cameraState === 'ZOOMED_OUT'} />
    </div>
  );
}

function ZoomedOutOverlay({ isVisible }: { isVisible: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute top-12 left-12 md:top-16 md:left-16 z-50 pointer-events-none text-white font-display"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-2 drop-shadow-lg">John Lyold Lozada</h2>
          <div className="text-lg md:text-xl lg:text-2xl text-white/70 font-mono tracking-widest drop-shadow-md">
            {time.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CanvasLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center p-8 bg-black/80 backdrop-blur-md rounded-xl border border-[#333]">
        <div className="w-12 h-12 border-4 border-[#333] border-t-white rounded-full animate-spin mb-4" />
        <p className="text-white font-mono text-sm tracking-widest uppercase text-nowrap">Loading 3D Assets {progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}
