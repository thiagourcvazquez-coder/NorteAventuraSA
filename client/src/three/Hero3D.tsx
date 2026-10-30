import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fbm, rng } from './noise';

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

function Ridge({ z, y, seed, amp }: { z: number; y: number; seed: number; amp: number }) {
  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(90, 9, 120, 14);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const low = new THREE.Color('#0b4a35');
    const mid = new THREE.Color('#1f8a5f');
    const high = new THREE.Color('#ffd97a');
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const zz = pos.getZ(i);
      const n = fbm(x * 0.08 + seed, zz * 0.22 + seed * 2, seed);
      const taper = Math.max(1 - Math.abs(zz) / 4.5, 0);
      const h = Math.pow(n, 1.8) * amp * 2.4 * (0.3 + 0.7 * taper);
      pos.setY(i, h);
      const t = Math.min(h / (amp * 1.6), 1);
      if (t < 0.55) c.copy(low).lerp(mid, t / 0.55);
      else c.copy(mid).lerp(high, ((t - 0.55) / 0.45) * 0.55);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [seed, amp]);

  return (
    <mesh geometry={geometry} position={[0, y, z]}>
      <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
    </mesh>
  );
}

function Sun() {
  const rays = useRef<THREE.Group>(null);
  const glow = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, 'rgba(255,200,59,0.85)');
    grad.addColorStop(0.35, 'rgba(255,200,59,0.28)');
    grad.addColorStop(1, 'rgba(255,200,59,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (rays.current) rays.current.rotation.z += delta * 0.04;
  });

  return (
    <group position={[0, 7.5, -38]}>
      <mesh position={[0, 0, -0.2]}>
        <planeGeometry args={[46, 46]} />
        <meshBasicMaterial map={glow} transparent depthWrite={false} fog={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <group ref={rays}>
        {Array.from({ length: 40 }).map((_, i) => (
          <mesh key={i} rotation={[0, 0, (i / 40) * Math.PI * 2]}>
            <mesh position={[0, 11.5, 0]}>
              <planeGeometry args={[i % 2 ? 0.18 : 0.34, i % 2 ? 7 : 11]} />
              <meshBasicMaterial color="#ffc83b" transparent opacity={0.22} fog={false} depthWrite={false} />
            </mesh>
          </mesh>
        ))}
      </group>
      <mesh>
        <circleGeometry args={[6.2, 64]} />
        <meshBasicMaterial color="#ffc83b" fog={false} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <circleGeometry args={[4.6, 64]} />
        <meshBasicMaterial color="#ffd96b" fog={false} />
      </mesh>
    </group>
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
      <Sun />
      <Ridge z={-26} y={-0.4} seed={4} amp={6} />
      <Ridge z={-17} y={-0.6} seed={9} amp={4.8} />
      <Ridge z={-10} y={-0.7} seed={13} amp={3.6} />
      <Ridge z={-4} y={-0.9} seed={21} amp={2.6} />
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
