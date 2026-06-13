import React, { Suspense, useRef, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraControls, PerspectiveCamera } from '@react-three/drei';
import type CameraControlsImpl from 'camera-controls';
import * as THREE from 'three';
import { Commodore64 } from './commodore-64';

export type CameraState = 'BOOTING' | 'AT_SCREEN' | 'ZOOMED_OUT';

export function CRTOsScene({ isBootingOS, isAwaitingBoot, onCompleteBoot }: { isBootingOS: boolean, isAwaitingBoot?: boolean, onCompleteBoot: () => void }) {
  const cameraControlsRef = useRef<CameraControlsImpl>(null);
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  
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
    if (!cameraControlsRef.current || cameraTarget[0] === 0) return;

    if (cameraState === 'BOOTING' || cameraState === 'AT_SCREEN') {
      // Smoothly fly towards the monitor
      cameraControlsRef.current.setLookAt(
        cameraTarget[0], cameraTarget[1] + 0.2, cameraTarget[2] + 4.5, // Camera position
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
        
        <Suspense fallback={null}>
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
    </div>
  );
}
