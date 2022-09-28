import { useRef, forwardRef, useLayoutEffect } from "react";
import { useMatcapTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import { useNormalizedMouseRef } from "../hooks";

const MatCapTexure = function () {
  const [matcapTexture] = useMatcapTexture(24, 1024);
  return <meshMatcapMaterial matcap={matcapTexture} />;
};

export const Cylinder = forwardRef(function (
  { position, height, radius },
  ref
) {
  return (
    <mesh ref={ref} position={position}>
      <cylinderGeometry args={[radius, radius, height, 64]} />
      <MatCapTexure />
    </mesh>
  );
});

const radius = 0.5;
const height = 0.25 * radius;
const gaskets = new Array(3).fill(null);
export const Gaskets = forwardRef(function ({ position, isLeft }, ref) {
  const cylindersRef = useRef([...gaskets]);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    const angle = Math.PI / cylindersRef.current.length;
    cylindersRef.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.y = Math.sin(angle * i - elapsedTime * 2.5) * 0.2;
      }
    });
  });

  return (
    <group ref={ref} position={position}>
      {gaskets.map((_, i) => (
        <Cylinder
          key={`cylinder-${i}`}
          ref={(v) => (cylindersRef.current[i] = v)}
          position={[(i - 1) * radius * 2, 0, i * 0.2 * (isLeft ? -1 : 1)]}
          height={height}
          radius={radius}
        />
      ))}
    </group>
  );
});

export const Engine = forwardRef(function ({ position }, ref) {
  const boxRef = useRef();
  const leftGaskets = useRef();
  const rightGaskets = useRef();
  const leftGasketsWrapper = useRef();
  const rightGasketsWrapper = useRef();
  const normalizedMouseRef = useNormalizedMouseRef({ smoothing: 0.005 });

  useLayoutEffect(() => {
    leftGaskets.current.rotation.y = Math.PI * 0.5;
    leftGaskets.current.rotation.z = Math.PI * 0.075;
    rightGaskets.current.rotation.y = Math.PI * 0.5;
    rightGaskets.current.rotation.z = Math.PI * 0.075;
    leftGasketsWrapper.current.rotation.z = Math.PI * 0.16;
    rightGasketsWrapper.current.rotation.z = Math.PI * -0.16;
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    if (boxRef.current) {
      boxRef.current.position.y = Math.sin(elapsedTime * 0.5) * 0.25;
      boxRef.current.rotation.y =
        elapsedTime * 0.1 + normalizedMouseRef.current[1];
      boxRef.current.rotation.x = Math.PI * 2 * normalizedMouseRef.current[0];
    }
  });

  return (
    <group ref={ref} position={position}>
      <mesh ref={boxRef}>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <MatCapTexure />
      </mesh>
      <group ref={leftGasketsWrapper}>
        <Gaskets ref={leftGaskets} position={[-2, 0, 0.5]} isLeft />
      </group>
      <group ref={rightGasketsWrapper}>
        <Gaskets ref={rightGaskets} position={[2, 0, 0.5]} />
      </group>
    </group>
  );
});
