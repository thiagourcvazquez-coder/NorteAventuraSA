import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { jitter } from './noise';

function Mountain({ radius, height, seed, color }: { radius: number; height: number; seed: number; color: string }) {
  const geometry = useMemo(() => {
    const g = new THREE.ConeGeometry(radius, height, 7, 6, true);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const base = new THREE.Color(color);
    const snow = new THREE.Color('#fffbf2');
    const sun = new THREE.Color('#ffc83b');
    const c = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const t = (y + height / 2) / height;
      const k = (1 - t) * 0.35;
      pos.setXYZ(i, x + jitter(x, y, z, seed) * k * radius, y + jitter(z, x, y, seed + 1) * k * 0.6, z + jitter(y, z, x, seed + 2) * k * radius);
      c.copy(base);
      if (t > 0.72) c.lerp(snow, (t - 0.72) / 0.28);
      else if (t > 0.45) c.lerp(sun, ((t - 0.45) / 0.27) * 0.18);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [radius, height, seed, color]);

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
      <ambientLight intensity={0.8} color="#fffbf2" />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#fffbf2" />
      <directionalLight position={[-5, 3, -4]} intensity={1.4} color="#ffc83b" />
      <mesh ref={sun}>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color="#ffc83b" />
      </mesh>
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6}>
        <group ref={group} position={[0, -0.6, 0]}>
          <mesh position={[0, -2.15, 0.2]}>
            <cylinderGeometry args={[3.7, 2.3, 0.7, 9, 1]} />
            <meshStandardMaterial color="#0b3d2c" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, -1.78, 0.2]}>
            <cylinderGeometry args={[3.5, 3.7, 0.05, 9, 1]} />
            <meshStandardMaterial color="#ffc83b" flatShading roughness={0.8} />
          </mesh>
          <Mountain radius={2.3} height={3.8} seed={3} color="#0f5a41" />
          <group position={[1.9, -0.55, 0.6]}>
            <Mountain radius={1.5} height={2.4} seed={8} color="#0d4a36" />
          </group>
          <group position={[-1.8, -0.7, 0.9]}>
            <Mountain radius={1.2} height={1.9} seed={15} color="#093628" />
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
