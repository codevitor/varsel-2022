import {
  Suspense,
  useRef,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect
} from "react";
import { useNormalizedMouseRef } from "./hooks";
import { Canvas } from "@react-three/fiber";
import { useTweaks } from "use-tweaks";

import { ParticlePlane } from "./particlePlane";
import { Engine } from "./engine";

import "./styles.css";

// Uncomment to see how scene is positioned
// import { OrbitControls } from "@react-three/drei";

function Scene() {
  const engineRef = useRef();
  const [shrinkEngine, setShrinkEngine] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShrinkEngine(window.innerWidth < 601);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useLayoutEffect(() => {
    const scale = shrinkEngine ? 0.15 : 0.3;
    const y = shrinkEngine ? 0 : 0.15;

    engineRef.current.scale.set(scale, scale, scale);
    engineRef.current.position.y = y;
  }, [shrinkEngine]);

  return (
    <scene>
      <ParticlePlane />
      <Engine ref={engineRef} position={[0, 0.15, 0.75]} />
    </scene>
  );
}

function BombA55FiberOptics() {
  return (
    <Canvas camera={{ fov: 45, position: [0, 0, 2.5], near: 0.01, far: 100 }}>
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      {/* Uncomment to see how
        scene is positioned
        <OrbitControls /> 
      */}
    </Canvas>
  );
}

function Cursor() {
  const ref = useRef();
  const handleMouseUpdate = useCallback((mousePos) => {
    if (ref.current) {
      const aspect = window.innerWidth / window.innerHeight;
      ref.current.style.transform = `translate3d(${
        ((mousePos[0] + aspect) / aspect) * 0.5 * window.innerWidth
      }px, ${(1 - (mousePos[1] + 1) * 0.5) * window.innerHeight}px, 0)`;
    }
  }, []);
  useNormalizedMouseRef({
    smoothing: 0.1,
    onChange: handleMouseUpdate
  });

  return <div ref={ref} className="cursor" />;
}

function Headline() {
  return (
    <div className="headline-content">
      <h1 className="heading v-number">Agilidade & Qualidade.</h1>
      <h2 className="heading package">Para divulgar sua empresa.</h2>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <BombA55FiberOptics />
      <div className="content">
        <Headline />
        <a
          href="https://pmnd.rs/"
          target="_blank"
          rel="noopener noreferrer"
          className="link top-left poimandres"
        >
          Varsel Agency
        </a>
        <a
          href="https://github.com/pmndrs/react-three-fiber"
          target="_blank"
          rel="noopener noreferrer"
          className="link bottom-left"
        >
          Instagram
        </a>
        <a
          href="https://www.npmjs.com/package/react-three-fiber"
          target="_blank"
          rel="noopener noreferrer"
          className="link bottom-right"
        >
          Projetos
        </a>
        <div className="stable">
          <span className="low-opacity">[ </span>
          <span className="status" />
          stable <span className="low-opacity">]</span>
        </div>
      </div>
    </div>
  );
}

export default App;
