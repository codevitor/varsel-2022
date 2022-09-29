import {
  Suspense,
  useRef,
  useEffect,
  useCallback,
  useState,
  useLayoutEffect,
} from "react";
import { useNormalizedMouseRef } from "./hooks";
import { Canvas } from "@react-three/fiber";
import { useTweaks } from "use-tweaks";

import { ParticlePlane } from "./particlePlane";
import { Engine } from "./engine";

import "./styles.css";

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
    onChange: handleMouseUpdate,
  });

  return <div ref={ref} className="cursor" />;
}

function Headline() {
  return (
    <div className="headline-content">
      <h1 className="heading v-number">Agilidade & Qualidade.</h1>
      <h2 className="heading package">
        Aqui sua imaginação se torna realidade.
      </h2>
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
          href="#"
          rel="noopener noreferrer"
          className="link top-left poimandres"
        >
          <img
            src="https://cdn.discordapp.com/attachments/957964801517170688/1024704723128959036/Frame_36597.png"
            alt=""
            width={200}
          />
        </a>
        <a href="#" rel="noopener noreferrer" className="link bottom-left">
          Instagram
        </a>
        <a
          href="https://www.npmjs.com/package/react-three-fiber"
          rel="noopener noreferrer"
          className="link bottom-right"
        >
          Projetos
        </a>
        <div className="stable">
          <span className="low-opacity">[ </span>
          Mais de 260 empresas trabalham com a Varsel
          <span className="low-opacity"> ] </span>
        </div>
      </div>
    </div>
  );
}

export default App;
