import { glsl } from "../utils";

export const vertex = glsl`
  #define PI 3.1415926538
  #define TAU 2.0 * PI

  // Tweaks
  uniform float uPointSize;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uFrequency;
  uniform float uWaveHeight;
  uniform float uMouseHeight;
  uniform float uMouseRadius;
  
  // Non-Tweaks
  uniform vec2 uMousePos;
  
  varying float vElevation;
  varying vec2 vUv;
  varying vec4 vModelPosition;
  varying float vMouseElevation;

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Alter model position to have sin elevation shifts
    float elevation = sin(modelPosition.x * uFrequency - uTime * uSpeed);
    modelPosition.z += elevation * uWaveHeight;

    // Transform z position and rotate based on mouse position
    float distanceFromMouse = distance(modelPosition.xy, uMousePos);
    float mouseElevation = 1.0 - smoothstep(0.01, uMouseRadius, distanceFromMouse);
    modelPosition.z += mouseElevation * uMouseHeight;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Set point size scale according to z posigion
    gl_PointSize = uPointSize;
    gl_PointSize *= 1.0 / -viewPosition.z;

    // Pass on varyings to vertex shader
    vElevation = elevation;
    vUv = uv;
    vModelPosition = modelPosition;
    vMouseElevation = mouseElevation;
  }
`;
