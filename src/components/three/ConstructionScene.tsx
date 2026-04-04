'use client';

import React, { useRef, useMemo, useEffect, MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ─── Helpers ─────────────────────────────────────────────── */
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const eio  = (t: number) => t < 0.5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);

/* ─── Scene constants ─────────────────────────────────────── */
const FLOORS  = 18;
const FLOOR_H = 2.0;
const BW      = 8.5;   // building width  (x)
const BD      = 5.5;   // building depth  (z)
const COL_W   = 0.30;  // column section
const TOTAL_H = FLOORS * FLOOR_H;

/* 6 columns: 4 corners + 2 mid-span on long faces */
const COL_XZ: [number, number][] = [
  [-BW / 2, -BD / 2],
  [0,       -BD / 2],
  [BW / 2,  -BD / 2],
  [-BW / 2,  BD / 2],
  [0,        BD / 2],
  [BW / 2,   BD / 2],
];

/** Scroll progress at which floor f starts building */
const floorStart = (f: number) => 0.04 + f * 0.028;

/* ─── Camera that rises with the building ─────────────────── */
function CameraRig({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const { camera } = useThree();

  // 4 waypoints camera moves through as scroll goes 0 → 1
  const PATH = [
    { px: 14,  py: 3,  pz: 20, lx: 0, ly: 4  },
    { px: 12,  py: 12, pz: 22, lx: 0, ly: 12 },
    { px: 13,  py: 22, pz: 24, lx: 0, ly: 20 },
    { px: 15,  py: 32, pz: 26, lx: 0, ly: 28 },
  ];

  useFrame(() => {
    const p   = scrollRef.current;
    const seg = Math.min(Math.floor(p * 3), 2);
    const t   = eio((p * 3) - seg);
    const a   = PATH[seg];
    const b   = PATH[seg + 1];

    camera.position.x = lerp(a.px, b.px, t);
    camera.position.y = lerp(a.py, b.py, t);
    camera.position.z = lerp(a.pz, b.pz, t);
    camera.lookAt(lerp(a.lx, b.lx, t), lerp(a.ly, b.ly, t), 0);
  });

  return null;
}

/* ─── Building ────────────────────────────────────────────── */
function Building({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  /* Per-floor refs — 4 objects per floor, stored flat */
  const colGroupRefs  = useRef<(THREE.Group | null)[]>(new Array(FLOORS).fill(null));
  const slabRefs      = useRef<(THREE.Mesh  | null)[]>(new Array(FLOORS).fill(null));
  const beamRefs      = useRef<(THREE.Group | null)[]>(new Array(FLOORS).fill(null));
  const glassRefs     = useRef<(THREE.Mesh  | null)[]>(new Array(FLOORS).fill(null));
  const bandRef       = useRef<THREE.Mesh>(null!);
  const bandLightRef  = useRef<THREE.PointLight>(null!);

  useFrame(() => {
    const scroll = scrollRef.current;

    let topBuiltY = 0;

    for (let f = 0; f < FLOORS; f++) {
      /* structural progress for this floor (0 → 1) */
      const fp = c01((scroll - floorStart(f)) / 0.035);

      /* ── Column group: grows from floor base ─── */
      const cg = colGroupRefs.current[f];
      if (cg) {
        cg.visible = fp > 0;
        if (fp > 0) {
          cg.children.forEach((child) => {
            const m = child as THREE.Mesh;
            const s = Math.max(fp, 0.001);
            m.scale.y    = s;
            m.position.y = s * FLOOR_H / 2;   // pin bottom at floor base
          });
        }
      }

      /* ── Slab: fades in after columns are 55% built ─── */
      const slabP = c01((fp - 0.55) / 0.45);
      const slab  = slabRefs.current[f];
      if (slab) {
        slab.visible = slabP > 0;
        (slab.material as THREE.MeshStandardMaterial).opacity = slabP;
      }

      /* ── Perimeter beams: appear with slab ─── */
      const bg = beamRefs.current[f];
      if (bg) bg.visible = slabP > 0.15;

      /* ── Glass curtain wall: second-wave scroll ─── */
      const glassP = c01((scroll - (0.58 + f * 0.012)) / 0.04);
      const glass  = glassRefs.current[f];
      if (glass) {
        glass.visible = glassP > 0;
        if (glassP > 0) {
          const mat = glass.material as THREE.MeshStandardMaterial;
          mat.opacity = glassP * 0.62;
          /* warm emissive glow when building is near-complete */
          const litP = c01((scroll - 0.85) / 0.15);
          mat.emissiveIntensity = litP * 0.45;
        }
      }

      if (fp > 0.05) topBuiltY = f * FLOOR_H + fp * FLOOR_H;
    }

    /* ── Active construction band (purple glow) ─── */
    if (bandRef.current) {
      bandRef.current.position.y = topBuiltY;
      bandRef.current.visible = scroll > 0.03 && scroll < 0.96;
      const mat = bandRef.current.material as THREE.MeshStandardMaterial;
      /* pulse */
      mat.emissiveIntensity = 2.8 + Math.sin(Date.now() * 0.005) * 1.0;
    }
    if (bandLightRef.current) {
      bandLightRef.current.position.y = topBuiltY + 1;
      bandLightRef.current.visible = scroll > 0.03 && scroll < 0.96;
    }
  });

  return (
    <group>
      {/* Purple construction-level band */}
      <mesh ref={bandRef} visible={false}>
        <boxGeometry args={[BW + 1.4, 0.28, BD + 1.4]} />
        <meshStandardMaterial
          color="#7C3AED"
          emissive="#7C3AED"
          emissiveIntensity={3}
          transparent
          opacity={0.92}
        />
      </mesh>
      <pointLight
        ref={bandLightRef}
        color="#8B5CF6"
        intensity={14}
        distance={18}
        decay={2}
        visible={false}
      />

      {/* Floor units */}
      {Array.from({ length: FLOORS }, (_, f) => {
        const baseY = f * FLOOR_H;
        return (
          <group key={f} position={[0, baseY, 0]}>

            {/* [columns] — scale.y animated to grow from base */}
            <group ref={(el) => { colGroupRefs.current[f] = el; }} visible={false}>
              {COL_XZ.map(([cx, cz], i) => (
                /* position.y set each frame in useFrame */
                <mesh key={i} position={[cx, 0, cz]}>
                  <boxGeometry args={[COL_W, FLOOR_H, COL_W]} />
                  <meshStandardMaterial color="#0D1118" metalness={0.75} roughness={0.18} />
                </mesh>
              ))}
            </group>

            {/* [slab] */}
            <mesh
              ref={(el) => { slabRefs.current[f] = el; }}
              position={[0, FLOOR_H - 0.075, 0]}
              visible={false}
            >
              <boxGeometry args={[BW - 0.12, 0.15, BD - 0.12]} />
              <meshStandardMaterial color="#1A2030" roughness={0.80} transparent opacity={0} />
            </mesh>

            {/* [perimeter beams] */}
            <group ref={(el) => { beamRefs.current[f] = el; }} visible={false}>
              <mesh position={[0,       FLOOR_H - 0.16, -BD / 2]}>
                <boxGeometry args={[BW, 0.22, 0.18]} />
                <meshStandardMaterial color="#0A0E16" metalness={0.72} roughness={0.25} />
              </mesh>
              <mesh position={[0,       FLOOR_H - 0.16,  BD / 2]}>
                <boxGeometry args={[BW, 0.22, 0.18]} />
                <meshStandardMaterial color="#0A0E16" metalness={0.72} roughness={0.25} />
              </mesh>
              <mesh position={[-BW / 2, FLOOR_H - 0.16, 0]}>
                <boxGeometry args={[0.18, 0.22, BD]} />
                <meshStandardMaterial color="#0A0E16" metalness={0.72} roughness={0.25} />
              </mesh>
              <mesh position={[BW / 2,  FLOOR_H - 0.16, 0]}>
                <boxGeometry args={[0.18, 0.22, BD]} />
                <meshStandardMaterial color="#0A0E16" metalness={0.72} roughness={0.25} />
              </mesh>
            </group>

            {/* [glass curtain wall] */}
            <mesh
              ref={(el) => { glassRefs.current[f] = el; }}
              position={[0, FLOOR_H / 2 - 0.075, 0]}
              visible={false}
            >
              <boxGeometry args={[BW - 0.14, FLOOR_H - 0.18, BD - 0.14]} />
              <meshStandardMaterial
                color="#1C2840"
                emissive="#2A3A60"
                emissiveIntensity={0}
                metalness={0.55}
                roughness={0.02}
                transparent
                opacity={0}
                side={THREE.DoubleSide}
              />
            </mesh>

          </group>
        );
      })}
    </group>
  );
}

/* ─── Tower crane ─────────────────────────────────────────── */
function TowerCrane({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const armRef   = useRef<THREE.Group>(null!);
  const rootRef  = useRef<THREE.Group>(null!);
  const MAST_H   = TOTAL_H + 5;

  useFrame((state) => {
    const scroll = scrollRef.current;
    if (rootRef.current) rootRef.current.visible = scroll > 0.01;
    if (armRef.current) {
      /* arm rises to stay 2 floors above current build height */
      armRef.current.position.y = Math.max(scroll * TOTAL_H + 2, 3);
      armRef.current.rotation.y = state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group ref={rootRef} position={[BW / 2 + 3.0, 0, 0]} visible={false}>
      {/* Mast */}
      <mesh position={[0, MAST_H / 2, 0]}>
        <boxGeometry args={[0.30, MAST_H, 0.30]} />
        <meshStandardMaterial color="#6B7A8A" metalness={0.70} roughness={0.32} />
      </mesh>
      {/* Mast bracing (X-pattern) */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh key={i} position={[0, 3 + i * 3.8, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.52, 0.05, 0.05]} />
          <meshStandardMaterial color="#4B5563" />
        </mesh>
      ))}

      {/* Arm group — rotates + rises */}
      <group ref={armRef}>
        {/* Main jib */}
        <mesh position={[-7, 0, 0]}>
          <boxGeometry args={[16, 0.24, 0.24]} />
          <meshStandardMaterial color="#F59E0B" emissive="#D97706" emissiveIntensity={0.4} metalness={0.4} />
        </mesh>
        {/* Counter jib */}
        <mesh position={[5.5, 0, 0]}>
          <boxGeometry args={[9, 0.20, 0.20]} />
          <meshStandardMaterial color="#D97706" metalness={0.4} />
        </mesh>
        {/* A-frame left */}
        <mesh position={[-3.5, 1.8, 0]} rotation={[0, 0, -0.38]}>
          <boxGeometry args={[0.10, 4.0, 0.10]} />
          <meshStandardMaterial color="#F59E0B" />
        </mesh>
        {/* A-frame right */}
        <mesh position={[2.5, 1.8, 0]} rotation={[0, 0, 0.32]}>
          <boxGeometry args={[0.10, 4.2, 0.10]} />
          <meshStandardMaterial color="#D97706" />
        </mesh>
        {/* Hook cable */}
        <mesh position={[-10, -5.5, 0]}>
          <boxGeometry args={[0.04, 11, 0.04]} />
          <meshStandardMaterial color="#9CA3AF" />
        </mesh>
        {/* Hook block — glows amber */}
        <mesh position={[-10, -11, 0]}>
          <boxGeometry args={[0.65, 0.65, 0.65]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={2.2} metalness={0.5} />
        </mesh>
        {/* Cab (operator cabin) */}
        <mesh position={[-0.5, 0.5, 0]}>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshStandardMaterial color="#4B5563" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Warning beacon */}
        <mesh position={[0, 0.7, 0]}>
          <sphereGeometry args={[0.22, 8, 8]} />
          <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={6} />
        </mesh>
        <pointLight position={[0, 0.7, 0]} color="#EF4444" intensity={5} distance={10} decay={2} />
      </group>
    </group>
  );
}

/* ─── Construction sparks (welding) ──────────────────────── */
function ConstructionSparks({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  const COUNT = 80;
  const ref   = useRef<THREE.Points>(null!);
  const { pos, vel, life } = useMemo(() => ({
    pos:  new Float32Array(COUNT * 3),
    vel:  new Float32Array(COUNT * 3),
    life: new Float32Array(COUNT).map(() => Math.random()),
  }), []);

  useFrame(() => {
    if (!ref.current) return;
    const p   = ref.current.geometry.attributes.position.array as Float32Array;
    const prog = c01(scrollRef.current);
    const baseY = prog * TOTAL_H;

    for (let i = 0; i < COUNT; i++) {
      life[i] -= 0.025;
      if (life[i] <= 0) {
        p[i*3]   = (Math.random() - 0.5) * (BW + 2);
        p[i*3+1] = baseY;
        p[i*3+2] = (Math.random() - 0.5) * (BD + 2);
        vel[i*3]   = (Math.random() - 0.5) * 0.16;
        vel[i*3+1] = Math.random() * 0.22 + 0.07;
        vel[i*3+2] = (Math.random() - 0.5) * 0.16;
        life[i] = 0.5 + Math.random() * 0.55;
      }
      p[i*3]   += vel[i*3];
      p[i*3+1] += vel[i*3+1];
      p[i*3+2] += vel[i*3+2];
      vel[i*3+1] -= 0.007;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.visible = prog > 0.02 && prog < 0.96;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.22} color="#FCD34D" transparent opacity={0.96} sizeAttenuation />
    </points>
  );
}

/* ─── Dust particles ──────────────────────────────────────── */
function DustParticles() {
  const COUNT = 180;
  const ref   = useRef<THREE.Points>(null!);
  const { pos, vel } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const v = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      p[i*3]   = (Math.random() - 0.5) * 60;
      p[i*3+1] = Math.random() * 30;
      p[i*3+2] = (Math.random() - 0.5) * 50;
      v[i*3]   = (Math.random() - 0.5) * 0.007;
      v[i*3+1] = 0.003 + Math.random() * 0.005;
      v[i*3+2] = (Math.random() - 0.5) * 0.007;
    }
    return { pos: p, vel: v };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      p[i*3]   += vel[i*3];
      p[i*3+1] += vel[i*3+1];
      p[i*3+2] += vel[i*3+2];
      if (p[i*3+1] > 34) {
        p[i*3+1] = 0;
        p[i*3]   = (Math.random() - 0.5) * 60;
        p[i*3+2] = (Math.random() - 0.5) * 50;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#8090A4" transparent opacity={0.14} sizeAttenuation />
    </points>
  );
}

/* ─── Site floodlight tower ───────────────────────────────── */
function LightTower({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null!);
  useFrame((state) => {
    if (lightRef.current) {
      lightRef.current.intensity = 55 + Math.sin(state.clock.elapsedTime * 8 + position[0]) * 5;
    }
  });
  return (
    <group position={position}>
      <mesh position={[0, 5, 0]}>
        <cylinderGeometry args={[0.04, 0.08, 10, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 10.2, 0]}>
        <boxGeometry args={[1.2, 0.22, 0.30]} />
        <meshStandardMaterial color="#4B5563" metalness={0.7} />
      </mesh>
      {/* Glowing fixture face — Bloom amplifies this */}
      <mesh position={[0, 10.1, 0.16]}>
        <planeGeometry args={[0.9, 0.16]} />
        <meshStandardMaterial color="#FCD34D" emissive="#FCD34D" emissiveIntensity={9} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 10, 0]} intensity={55} color="#F59E0B" distance={48} decay={2} />
    </group>
  );
}

/* ─── Background city silhouette ──────────────────────────── */
function CityHorizon() {
  const bgs = useMemo(() => [
    { p: [-22, 0, -18] as [number,number,number], h: 21, w: 5,   d: 3.5 },
    { p: [ 20, 0, -16] as [number,number,number], h: 16, w: 4.5, d: 3.5 },
    { p: [-14, 0, -22] as [number,number,number], h: 13, w: 4,   d: 3   },
    { p: [ 13, 0, -20] as [number,number,number], h: 11, w: 3.5, d: 3   },
    { p: [ 30, 0, -10] as [number,number,number], h: 8,  w: 3,   d: 3   },
    { p: [-30, 0,  -6] as [number,number,number], h: 14, w: 4,   d: 3   },
    { p: [  5, 0, -28] as [number,number,number], h: 12, w: 3.5, d: 3   },
    { p: [ -6, 0, -26] as [number,number,number], h: 10, w: 3,   d: 2.5 },
    { p: [ 40, 0,  -8] as [number,number,number], h: 6,  w: 2.5, d: 2.5 },
    { p: [-40, 0,  -4] as [number,number,number], h: 8,  w: 3,   d: 2.5 },
  ], []);

  return (
    <>
      {bgs.map((b, i) => (
        <group key={i} position={[b.p[0], b.h / 2, b.p[2]]}>
          <mesh>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial color="#1A1E26" />
          </mesh>
          {Array.from({ length: Math.floor(b.h / 2.4) }, (_, wi) => {
            if ((i * 7 + wi * 3) % 5 !== 0) return null;
            return (
              <mesh key={wi} position={[
                ((i + wi) % 3 - 1) * b.w * 0.22,
                wi * 2.3 - b.h / 2 + 1.3,
                b.d / 2 + 0.01,
              ]}>
                <planeGeometry args={[0.45, 0.50]} />
                <meshBasicMaterial color="#F59E0B" transparent opacity={0.28 + (wi % 3) * 0.12} />
              </mesh>
            );
          })}
        </group>
      ))}
    </>
  );
}

/* ─── Blueprint ground ────────────────────────────────────── */
function SiteGround() {
  const fineRef = useRef<THREE.GridHelper>(null!);
  useFrame((state) => {
    if (fineRef.current) {
      const mat = fineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.18 + Math.sin(state.clock.elapsedTime * 0.3) * 0.04;
    }
  });
  return (
    <>
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 220]} />
        <meshStandardMaterial color="#E8E4DC" roughness={1} />
      </mesh>
      <gridHelper ref={fineRef} args={[130, 65, '#C0BCBA', '#D0CCCA']} />
      <gridHelper args={[130, 13, '#A89A96', '#C0BCBA']} position={[0, 0.01, 0]} />
    </>
  );
}

/* ─── Star field ──────────────────────────────────────────── */
function StarField() {
  const COUNT = 500;
  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const y = 18 + Math.random() * 80;
      const r = 55 + Math.random() * 65;
      arr[i * 3]     = Math.cos(theta) * r;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = Math.sin(theta) * r;
    }
    return arr;
  }, []);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.10} color="#8090A8" transparent opacity={0.20} sizeAttenuation />
    </points>
  );
}

/* ─── Purple atmosphere pulse ─────────────────────────────── */
function AtmosphereLight() {
  const ref = useRef<THREE.PointLight>(null!);
  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = 0.7 + Math.sin(state.clock.elapsedTime * 1.2) * 0.3;
    }
  });
  return <pointLight ref={ref} position={[0, 30, 8]} color="#6D28D9" intensity={0.25} />;
}

/* ─── Full scene ──────────────────────────────────────────── */
function Scene({ scrollRef }: { scrollRef: MutableRefObject<number> }) {
  return (
    <>
      <fog attach="fog" args={['#F0F2F6', 55, 160]} />

      <ambientLight intensity={1.4} color="#F8F6F2" />
      <directionalLight position={[-10, 35, -15]} intensity={2.2} color="#FFFFFF" castShadow />
      <directionalLight position={[14, 22, 22]} intensity={1.0} color="#EEF2FF" />
      <directionalLight position={[0, -5, 20]} intensity={0.3} color="#E8F0FF" />
      <AtmosphereLight />

      <SiteGround />
      <StarField />
      <CityHorizon />

      <Building           scrollRef={scrollRef} />
      <ConstructionSparks scrollRef={scrollRef} />
      <DustParticles />
      <TowerCrane         scrollRef={scrollRef} />

      <LightTower position={[-14,  0,  16]} />
      <LightTower position={[ 17,  0,  -9]} />
      <LightTower position={[  3,  0,  22]} />

      <CameraRig scrollRef={scrollRef} />

      <EffectComposer>
        <Bloom intensity={2.2} luminanceThreshold={0.45} luminanceSmoothing={0.9} />
        <Vignette eskil={false} offset={0.12} darkness={0.92} />
      </EffectComposer>
    </>
  );
}

/* ─── Exported canvas ─────────────────────────────────────── */
export default function ConstructionScene({
  scrollRef,
  style,
}: {
  scrollRef: MutableRefObject<number>;
  style?: React.CSSProperties;
}) {
  return (
    <Canvas
      camera={{ position: [14, 3, 20], fov: 52 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.8]}
      style={{ background: '#F0F2F6', ...style }}
    >
      <Scene scrollRef={scrollRef} />
    </Canvas>
  );
}
