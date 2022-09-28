import { glsl } from "../utils";

export const fragment = glsl`
  uniform vec3 uMouseColor;
  uniform vec3 uPeakColor;
  uniform vec3 uValleyColor;

  varying float vElevation;
  varying vec4 vModelPosition;
  varying float vMouseElevation;

  void main() {
    // Generate circle for each point's uv
    float dist = distance(gl_PointCoord, vec2(0.5));
    float circle = 1.0 - smoothstep(0.4, 0.5, dist);
    
    // Change color based on sin zIndex alteration
    vec3 elevatedColor = mix(uValleyColor, uPeakColor, vElevation);

    // Change color based on mouse position
    vec3 color = mix(elevatedColor, uMouseColor, vMouseElevation);
    
    // Debugging
    // vec2 uv = vModelPosition.xy;
    // float debugger = step(1.0, distance(uv, vec2(0.0)));
    // color = mix(color, vec3(1.0, 0.0, 1.0), debugger);

    gl_FragColor = vec4(color, circle);
  }
`;
