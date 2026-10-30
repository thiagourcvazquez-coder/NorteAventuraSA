import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { rng } from './noise';

const BG = '#093628';

interface Input {
  mx: number;
  my: number;
  scroll: number;
}

function useInput(): React.RefObject<Input> {
  const input = useRef<Input>({ mx: 0, my: 0, scroll: 0 });
  useEffect(() => {
    const move = (e: PointerEvent) => {
      input.current.mx = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const scroll = () => {
      input.current.scroll = Math.min(window.scrollY / window.innerHeight, 1.2);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('scroll', scroll, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('scroll', scroll);
    };
  }, []);
  return input;
}

function BlenderRange() {
  const { scene } = useGLTF('/models/norte-range.glb');
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((o) => {
      if (o instanceof THREE.Mesh && o.material instanceof THREE.MeshStandardMaterial) {
        if (o.material.name === 'Sun') {
          o.material.fog = false;
          o.material.emissive = new THREE.Color('#ffc83b');
          o.material.emissiveIntensity = 1.6;
          o.material.toneMapped = false;
        }
      }
    });
    return clone;
  }, [scene]);
  return (
    <group position={[0, -3.2, -17]} scale={2.1}>
      <primitive object={model} />
    </group>
  );
}

function SunGlow() {
  const glow = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,200,59,0.75)');
    grad.addColorStop(0.35, 'rgba(255,200,59,0.25)');
    grad.addColorStop(1, 'rgba(255,200,59,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <mesh position={[0, 14.5, -39]}>
      <planeGeometry args={[52, 52]} />
      <meshBasicMaterial map={glow} transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const r = rng(7);
    const arr = new Float32Array(220 * 3);
    for (let i = 0; i < 220; i++) {
      arr[i * 3] = (r() - 0.5) * 36;
      arr[i * 3 + 1] = r() * 10 - 0.5;
      arr[i * 3 + 2] = -r() * 26 + 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = Math.sin(t * 0.05) * 0.08;
    ref.current.position.y = Math.sin(t * 0.4) * 0.15;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffc83b" size={0.09} sizeAttenuation transparent opacity={0.75} depthWrite={false} fog={false} />
    </points>
  );
}

function Rig({ input, still }: { input: React.RefObject<Input>; still: boolean }) {
  useFrame((state, delta) => {
    if (still) return;
    const { mx, my, scroll } = input.current;
    const cam = state.camera;
    const k = 1 - Math.pow(0.001, delta);
    cam.position.x += (mx * 1.6 - cam.position.x) * k * 0.6;
    cam.position.y += (2.4 - my * 0.5 + scroll * 1.2 - cam.position.y) * k * 0.6;
    cam.position.z += (9 - scroll * 7 - cam.position.z) * k * 0.6;
    cam.lookAt(0, 2 + scroll * 0.5, -14);
  });
  return null;
}

function Scene({ still }: { still: boolean }) {
  const input = useInput();
  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 14, 58]} />
      <ambientLight intensity={1.1} color="#fffbf2" />
      <directionalLight position={[0, 8, -30]} intensity={2.6} color="#ffc83b" />
      <directionalLight position={[6, 9, 12]} intensity={1.5} color="#fffbf2" />
      <SunGlow />
      <Suspense fallback={null}>
        <BlenderRange />
      </Suspense>
      <Dust />
      <Rig input={input} still={still} />
    </>
  );
}

export default function Hero3D() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const still = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0">
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [0, 2.4, 9], fov: 50, near: 0.1, far: 120 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <Scene still={still} />
      </Canvas>
    </div>
  );
}

useGLTF.preload('/models/norte-range.glb');
