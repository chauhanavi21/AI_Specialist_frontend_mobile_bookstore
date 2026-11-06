import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BOOKS } from '../data/books';

// Draws a cover onto a canvas so each 3D book wears the same artwork as the 2D cards.
function coverTexture(book) {
  const c = document.createElement('canvas');
  c.width = 400;
  c.height = 560;
  const g = c.getContext('2d');
  g.fillStyle = book.cover.bg;
  g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = book.cover.fg;
  g.textAlign = 'center';
  g.font = '800 54px "IBM Plex Sans", Arial, sans-serif';
  const words = book.title.toUpperCase().split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (g.measureText(`${cur} ${w}`.trim()).width > 330 && cur) {
      lines.push(cur);
      cur = w;
    } else cur = `${cur} ${w}`.trim();
  }
  lines.push(cur);
  lines.forEach((l, i) => g.fillText(l, 200, 110 + i * 62));
  g.fillStyle = book.cover.accent;
  g.fillRect(170, 440, 60, 8);
  g.fillStyle = book.cover.fg;
  g.font = '700 26px "IBM Plex Sans", Arial, sans-serif';
  g.fillText(book.author.toUpperCase(), 200, 495);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const LAYOUT = [
  { pos: [-3.1, 0.5, -0.4], rot: [0.1, 0.5, -0.12], speed: 0.9, scale: 1.0 },
  { pos: [-1.5, -0.9, 0.8], rot: [-0.05, 0.35, 0.08], speed: 1.2, scale: 1.1 },
  { pos: [0.1, 0.55, 0.2], rot: [0.08, -0.2, 0.05], speed: 0.8, scale: 1.25 },
  { pos: [1.7, -0.75, 0.9], rot: [-0.1, -0.4, -0.06], speed: 1.1, scale: 1.05 },
  { pos: [3.1, 0.6, -0.5], rot: [0.05, -0.55, 0.14], speed: 1.0, scale: 1.0 },
];

function FloatingBook({ book, pos, rot, speed, scale, index }) {
  const group = useRef();
  const texture = useMemo(() => coverTexture(book), [book]);
  const spine = useMemo(() => new THREE.Color(book.cover.bg).multiplyScalar(0.7), [book]);

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime * speed + index * 1.7;
    const g = group.current;
    g.position.y = pos[1] + Math.sin(t) * 0.18;
    // Ease toward the pointer so the cluster feels weighty, not twitchy.
    g.rotation.y += (rot[1] + pointer.x * 0.5 - g.rotation.y) * 0.05;
    g.rotation.x += (rot[0] - pointer.y * 0.3 + Math.sin(t * 0.7) * 0.05 - g.rotation.x) * 0.05;
    g.rotation.z = rot[2] + Math.sin(t * 0.5) * 0.03;
  });

  // Box faces: +x, -x, +y, -y, +z (front cover), -z (back)
  const mats = useMemo(
    () => [
      new THREE.MeshStandardMaterial({ color: '#f2ead8', roughness: 0.9 }), // page edge
      new THREE.MeshStandardMaterial({ color: spine, roughness: 0.6 }), // spine
      new THREE.MeshStandardMaterial({ color: '#f2ead8', roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: '#f2ead8', roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: texture, roughness: 0.45 }),
      new THREE.MeshStandardMaterial({ color: spine, roughness: 0.6 }),
    ],
    [texture, spine],
  );

  return (
    <group ref={group} position={pos} rotation={rot} scale={scale}>
      <mesh material={mats}>
        <boxGeometry args={[1.25, 1.75, 0.22]} />
      </mesh>
    </group>
  );
}

function Particles() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(160 * 3);
    for (let i = 0; i < arr.length; i += 3) {
      arr[i] = (Math.random() - 0.5) * 12;
      arr[i + 1] = (Math.random() - 0.5) * 6;
      arr[i + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, []);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#a6c8ff" transparent opacity={0.65} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  const picks = useMemo(() => {
    const order = ['midnight-hour', 'beneath-the-stars', 'joy-of-minimalism', 'final-frontier', 'lost-kitten'];
    return order.map((id) => BOOKS.find((b) => b.id === id));
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#be95ff" />
      <pointLight position={[4, 2, 2]} intensity={14} color="#78a9ff" />
      {picks.map((b, i) => (
        <FloatingBook key={b.id} book={b} index={i} {...LAYOUT[i]} />
      ))}
      <Particles />
    </Canvas>
  );
}
