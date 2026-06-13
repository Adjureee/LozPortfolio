import React, { Suspense, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Commodore64 } from './commodore-64';

import { useFrame, useThree } from '@react-three/fiber';

export type CameraState = 'BOOTING' | 'AT_SCREEN' | 'ZOOMED_OUT';

function CameraAnimator({ target, cameraState }: { target: [number, number, number], cameraState: CameraState }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    // Only animate if we have a valid target
    if (target[0] !== 0) {
      if (cameraState === 'BOOTING' || cameraState === 'AT_SCREEN') {
        // Frame the monitor perfectly
        targetPos.current.set(target[0], target[1] + 0.2, target[2] + 4.5);
      } else if (cameraState === 'ZOOMED_OUT') {
        // Overarching view of the desk
        targetPos.current.set(0, 4, 12); // Slightly closer than 15 for better desk view
      }
      
      // Smoothly fly towards the target position
      camera.position.lerp(targetPos.current, 2.5 * delta);
      // Ensure the camera always looks at the center of the monitor
      camera.lookAt(target[0], target[1], target[2]);
    }
  });

  return null;
}

export function CRTOsScene({ isBootingOS, onCompleteBoot }: { isBootingOS: boolean, onCompleteBoot: () => void }) {
  const [cameraTarget, setCameraTarget] = useState<[number, number, number]>([0, 0, 0]);
  
  // Camera State Machine
  const [cameraState, setCameraState] = useState<CameraState>(isBootingOS ? 'BOOTING' : 'ZOOMED_OUT');
  
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
    if (cameraState === 'BOOTING') return; // Lock camera while booting
    
    if (cameraState === 'ZOOMED_OUT' && isHoveringMonitor) {
      setCameraState('AT_SCREEN');
    } else if (cameraState === 'AT_SCREEN' && !isHoveringMonitor) {
      setCameraState('ZOOMED_OUT');
    }
  }, [isHoveringMonitor, cameraState]);

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
        
        <CameraAnimator target={cameraTarget} cameraState={cameraState} />
        
        <Suspense fallback={null}>
          <Commodore64 
            isBootingOS={isBootingOS} 
            onCompleteBoot={onCompleteBoot}
            onAutoAlign={handleAutoAlign}
            onMonitorEnter3D={() => setIsHovering3D(true)}
            onMonitorLeave3D={() => setIsHovering3D(false)}
            onMonitorEnterHTML={() => setIsHoveringHTML(true)}
            onMonitorLeaveHTML={() => setIsHoveringHTML(false)}
          />
        </Suspense>
        
        {/* OrbitControls has been removed to allow cinematic CameraAnimator to fully control the camera */}
      </Canvas>
    </div>
  );
}
