import { useRef, useEffect, useLayoutEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTweaks } from "use-tweaks";

import { useNormalizedMouseRef } from "../hooks";
import { generateVertices } from "./generateVertices";
import { vertex } from "./vertex";
import { fragment } from "./fragment";

const subdivisions = 49;
const uniforms = {
  // Tweaks
  uTime: { value: 0 },
  uPointSize: { value: 7 },
  uSpeed: { value: 0.25 },
  uFrequency: { value: 2 },
  uMouseRadius: { value: 1.0 },
  uMouseHeight: { value: 0.4 },
  uWaveHeight: { value: 0.3 },
  uMouseColor: { value: new THREE.Color(0x000000) },
  uPeakColor: { value: new THREE.Color(0x000000) },
  uValleyColor: { value: new THREE.Color(0x000000) },
  // Non-Tweaks
  uMousePos: { value: new THREE.Vector2(0, 0) }
};

export function ParticlePlane() {
  const {
    pointSize,
    speed,
    frequency,
    numberOfSquares,
    waveHeight,
    mouseHeight,
    mouseRadius,
    mouseColor,
    peakColor,
    valleyColor
  } = {
    mouseColor: "#752337",
    peakColor: "#17444D",
    valleyColor: "#5D1A5C",
    pointSize: 10,
    numberOfSquares: 49,
    speed: 0.3,
    frequency: 2.0,
    waveHeight: 0.3,
    mouseHeight: 0.4,
    mouseRadius: 1.0
  };

  const materialRef = useRef();
  const geometryRef = useRef();
  const normalizedMouseRef = useNormalizedMouseRef({
    smoothing: 0.05
  });

  useEffect(() => {
    materialRef.current.uniforms.uMouseColor.value.set(mouseColor);
    materialRef.current.uniforms.uPeakColor.value.set(peakColor);
    materialRef.current.uniforms.uValleyColor.value.set(valleyColor);
    materialRef.current.uniforms.uPointSize.value = pointSize;
    materialRef.current.uniforms.uSpeed.value = speed;
    materialRef.current.uniforms.uFrequency.value = frequency;
    materialRef.current.uniforms.uWaveHeight.value = waveHeight;
    materialRef.current.uniforms.uMouseHeight.value = mouseHeight;
    materialRef.current.uniforms.uMouseRadius.value = mouseRadius;
  }, [
    pointSize,
    speed,
    frequency,
    waveHeight,
    mouseHeight,
    mouseRadius,
    mouseColor,
    peakColor,
    valleyColor
  ]);

  useFrame((state) => {
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    materialRef.current.uniforms.uMousePos.value.set(
      ...normalizedMouseRef.current
    );
  });

  useLayoutEffect(() => {
    const positions = generateVertices({
      numVerticalPoints: numberOfSquares,
      zPosition: 0,
      height: 3,
      width: 8
    });
    geometryRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }, [numberOfSquares]);

  return (
    <points>
      <bufferGeometry ref={geometryRef} />
      <shaderMaterial
        ref={materialRef}
        depthWrite={false}
        vertexColors={true}
        transparent={true}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </points>
  );
}
