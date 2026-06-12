import * as THREE from 'three'
import React, { useRef, useState } from 'react'
import { useGLTF, TransformControls, Html } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    old_pc000_Room_mat_0_0: THREE.Mesh
    old_pc000_Room_mat_0_1: THREE.Mesh
  }
  materials: {
    Room_mat: THREE.MeshStandardMaterial
  }
  animations: unknown[]
}

type ScreenConfig = { x: number; y: number; z: number; rx: number; ry: number; rz: number; scale: number };

export function SadOfficeRoom(props: React.JSX.IntrinsicElements['group'] & { 
  screenConfig?: ScreenConfig;
  transformMode?: 'translate' | 'rotate' | 'scale';
  onTransformChange?: (config: ScreenConfig) => void;
  enableClickToPlace?: boolean;
}) {
  const { nodes, materials } = useGLTF('/Sad_Office_Room/Sad_Office_Room.glb') as unknown as GLTFResult
  
  const meshRef = useRef<THREE.Mesh>(null);
  const config = props.screenConfig ?? { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, scale: 1 };

  return (
    <group {...props} dispose={null}>
      <group position={[0.299, -5.067, -23.901]} rotation={[-1.476, 0, -1.024]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[-2.495, 4.612, -4.267]} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh 
              geometry={nodes.old_pc000_Room_mat_0_0.geometry} 
              material={materials.Room_mat} 
              onPointerDown={(e) => {
                if (props.enableClickToPlace && props.onTransformChange) {
                  e.stopPropagation();
                  // Snap to exact surface point to prevent parallax errors!
                  props.onTransformChange({
                    ...config,
                    x: e.point.x,
                    y: e.point.y,
                    z: e.point.z
                  });
                  if (meshRef.current) {
                    meshRef.current.position.copy(e.point);
                  }
                }
              }}
            />
            <mesh geometry={nodes.old_pc000_Room_mat_0_1.geometry} material={materials.Room_mat} />
          </group>
        </group>
      </group>

      <TransformControls 
        mode={props.transformMode || 'translate'}
        onDraggingChanged={(e) => { 
          if (!e?.value && props.onTransformChange && e?.target?.object) {
             const obj = e.target.object;
             props.onTransformChange({
                x: obj.position.x, y: obj.position.y, z: obj.position.z,
                rx: obj.rotation.x, ry: obj.rotation.y, rz: obj.rotation.z,
                scale: obj.scale.x / 4
             });
          }
        }}
        onObjectChange={(e) => {
          if (e?.target?.object) {
             const obj = e.target.object;
             const updateEl = (id: string, val: number) => {
               const el = document.getElementById(`calib-${id}`) as HTMLInputElement;
               if (el && document.activeElement !== el) el.value = val.toFixed(2);
             };
             updateEl('x', obj.position.x); updateEl('y', obj.position.y); updateEl('z', obj.position.z);
             updateEl('rx', obj.rotation.x); updateEl('ry', obj.rotation.y); updateEl('rz', obj.rotation.z);
             updateEl('scale', obj.scale.x / 4);
             
             const jsonEl = document.getElementById('calib-json');
             if (jsonEl) jsonEl.textContent = JSON.stringify({
                x: Number(obj.position.x.toFixed(3)), y: Number(obj.position.y.toFixed(3)), z: Number(obj.position.z.toFixed(3)),
                rx: Number(obj.rotation.x.toFixed(3)), ry: Number(obj.rotation.y.toFixed(3)), rz: Number(obj.rotation.z.toFixed(3)),
                scale: Number((obj.scale.x / 4).toFixed(3))
             });
          }
        }}
      >
        <mesh ref={meshRef} position={[config.x, config.y, config.z]} rotation={[config.rx, config.ry, config.rz]} scale={[config.scale * 4, config.scale * 3, 1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#00ff00" opacity={0.7} transparent side={THREE.DoubleSide} depthTest={false} />
        </mesh>
      </TransformControls>
    </group>
  )
}

useGLTF.preload('/Sad_Office_Room/Sad_Office_Room.glb')
