import React, { useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export function SizeChecker({ targetRef }) {
  const { scene } = useThree();
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(targetRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      console.log("TRUE WORLD SIZE OF TARGET:", size.x, size.y, size.z);
    }
  }, [targetRef]);
  return null;
}
