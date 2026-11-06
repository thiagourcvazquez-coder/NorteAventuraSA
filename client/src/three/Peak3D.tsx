import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { jitter } from './noise';

// Estratos tipo Hornocal / Cerro de los 14 Colores (de base a cima)
const STRATA = ['#4a2418', '#6e3220', '#96432a', '#b85c2b', '#cf7d38', '#dc9d4e', '#e5b876', '#c9a08a', '#f0e6d4'];

function bandColor(t: number, out: THREE.Color, darken: number) {
  const idx = Math.min(STRATA.length - 1, Math.floor(t * STRATA.length));
  out.set(STRATA[idx]);
  // leve mezcla hacia la banda siguiente para suavizar bordes
  if (idx < STRATA.length - 1) {
    const f = t * STRATA.length - idx;
    if (f > 0.75) out.lerp(new THREE.Color(STRATA[idx + 1]), (f - 0.75) / 0.25);
  }
  out.offsetHSL(0, 0, -darken);
  return out;
}

function Mountain({
  radius,
  height,
  seed,
  darken = 0,
}: {
  radius: number;
  height: number;
  seed: number;
  darken?: number;
}) {
  const geometry = useMemo(() => {
    const g = new THREE.ConeGeometry(radius, height, 7, 6, true);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const t = (y + height / 2) / height;
      const k = (1 - t) * 0.35;
      pos.setXYZ(
        i,
        x + jitter(x, y, z, seed) * k * radius,
        y + jitter(z, x, y, seed + 1) * k * 0.6,
        z + jitter(y, z, x, seed + 2) * k * radius,
      );
      bandColor(t, c, darken);
      // variación sutil por vértice para realzar las facetas
      c.offsetHSL(0, 0, jitter(x * 3, y, z * 3, seed + 7) * 0.03);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [radius, height, seed, darken]);

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial vertexColors flatShading roughness={0.9} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Composition({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const group = useRef<THREE.Group>(null);
  const sun = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (g) {
      const k = 1 - Math.pow(0.002, delta);
      g.rotation.y += (state.clock.elapsedTime * 0.18 + pointer.current.x * 0.9 - g.rotation.y) * k * 0.5;
      g.rotation.x += (pointer.current.y * 0.18 - g.rotation.x) * k;
    }
    if (sun.current) {
      const t = state.clock.elapsedTime * 0.6;
      sun.current.position.set(Math.cos(t) * 3.2, 1.7 + Math.sin(t) * 0.6, Math.sin(t) * 1.6 - 2.4);
    }
  });

  return (
    <>
      <ambientLight intensity={0.75} color="#f7f8ee" />
      <directionalLight position={[4, 6, 5]} intensity={1.5} color="#fff2df" />
      <directionalLight position={[-5, 3, -4]} intensity={1.3} color="#fb950e" />
      <mesh ref={sun}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color="#fb950e" />
      </mesh>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        <group ref={group} position={[0, -0.6, 0]}>
          <mesh position={[0, -2.15, 0.2]}>
            <cylinderGeometry args={[3.7, 2.3, 0.7, 9, 1]} />
            <meshStandardMaterial color="#241407" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, -1.78, 0.2]}>
            <cylinderGeometry args={[3.5, 3.7, 0.05, 9, 1]} />
            <meshStandardMaterial color="#e5b876" flatShading roughness={0.8} />
          </mesh>
          <Mountain radius={2.3} height={3.8} seed={3} />
          <group position={[1.9, -0.55, 0.6]}>
            <Mountain radius={1.5} height={2.4} seed={8} darken={0.06} />
          </group>
          <group position={[-1.8, -0.7, 0.9]}>
            <Mountain radius={1.2} height={1.9} seed={15} darken={0.12} />
          </group>
        </group>
      </Float>
    </>
  );
}

export default function Peak3D() {
  const pointer = useRef({ x: 0, y: 0 });
  return (
    <div
      className="h-full w-full"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      }}
    >
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0.9, 10.5], fov: 40 }} gl={{ alpha: true, antialias: true }}>
        <Composition pointer={pointer} />
      </Canvas>
    </div>
  );
}
