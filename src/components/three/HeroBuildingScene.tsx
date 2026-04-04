'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ─── Constants ──────────────────────────────────────────────── */
const BW      = 5.5;    // building width
const BD      = 3.5;    // building depth
const FH      = 2.4;    // floor height
const FOUND_H = 0.35;   // foundation slab height
const COL_W   = 0.18;   // column section
const SLAB_H  = 0.16;   // floor slab thickness
const DROP    = 9;      // how far above target each floor starts
const CYCLE   = 13;     // seconds per loop (assembly → hold → fade reset)
const FLOORS  = 3;      // storeys above foundation

/* When each floor group starts dropping (seconds into cycle) */
const ANIM_START = [0, 1.6, 3.2, 4.8] as const;
const ANIM_DUR   = 1.3;

/* Target Y for each floor group when fully assembled */
const TARGET_Y = [
  0,
  FOUND_H,
  FOUND_H + FH,
  FOUND_H + FH * 2,
] as const;

/* 4 corner column positions (local XZ) */
const CORNERS: [number, number][] = [
  [-BW / 2 + COL_W / 2, -BD / 2 + COL_W / 2],
  [ BW / 2 - COL_W / 2, -BD / 2 + COL_W / 2],
  [-BW / 2 + COL_W / 2,  BD / 2 - COL_W / 2],
  [ BW / 2 - COL_W / 2,  BD / 2 - COL_W / 2],
];

/* Helpers */
const c01     = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* Colors */
const C_FOUND   = '#7C3AED';   // purple — foundation edge
const C_SLAB    = '#7080B0';   // cool blue-gray — slab
const C_STRUCT  = '#A0AACE';   // lighter blue-gray — columns / beams
const C_WIN     = '#4C5A88';   // dim — window frames

/* ─── WireBox ─────────────────────────────────────────────────── */
function WireBox({
  w, h, d, x = 0, y = 0, z = 0, color,
}: {
  w: number; h: number; d: number;
  x?: number; y?: number; z?: number;
  color: string;
}) {
  const geo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [w, h, d],
  );
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 }),
    [color],
  );
  return <lineSegments geometry={geo} material={mat} position={[x, y, z]} />;
}

/* ─── Camera aim ─────────────────────────────────────────────── */
function CameraAim() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, FOUND_H + FH * 1.4, 0);
  }, [camera]);
  return null;
}

/* ─── Building ───────────────────────────────────────────────── */
function Building() {
  const rootRef  = useRef<THREE.Group>(null!);
  const glowRef  = useRef<THREE.PointLight>(null!);

  /* Four floor group refs: [0]=foundation, [1-3]=storeys */
  const g0 = useRef<THREE.Group>(null!);
  const g1 = useRef<THREE.Group>(null!);
  const g2 = useRef<THREE.Group>(null!);
  const g3 = useRef<THREE.Group>(null!);
  const groups = [g0, g1, g2, g3];

  useFrame((state) => {
    const t = state.clock.elapsedTime % CYCLE;

    /* Slow continuous rotation */
    if (rootRef.current) {
      rootRef.current.rotation.y = state.clock.elapsedTime * 0.14;
    }

    let activeY   = 0;
    let hasActive = false;

    groups.forEach((ref, f) => {
      const group = ref.current;
      if (!group) return;

      const prog   = c01((t - ANIM_START[f]) / ANIM_DUR);
      const eased  = easeOut(prog);
      const opacity = c01(prog * 5);

      /* Drop from above to target position */
      group.position.y = TARGET_Y[f] + DROP * (1 - eased);

      /* Update all LineSegments opacity inside the group */
      group.traverse(obj => {
        if (obj instanceof THREE.LineSegments) {
          (obj.material as THREE.LineBasicMaterial).opacity = opacity;
        }
      });

      /* Track which floor is actively animating for glow */
      if (prog > 0.04 && prog < 0.97) {
        activeY   = group.position.y + (f === 0 ? 0.2 : FH * 0.5);
        hasActive = true;
      }
    });

    if (glowRef.current) {
      glowRef.current.position.y = activeY;
      glowRef.current.visible    = hasActive;
      glowRef.current.intensity  = 8 + Math.sin(state.clock.elapsedTime * 5) * 3;
    }
  });

  return (
    <group ref={rootRef}>
      {/* Purple construction glow — tracks active floor */}
      <pointLight
        ref={glowRef}
        color="#7C3AED"
        intensity={8}
        distance={16}
        decay={2}
        visible={false}
      />

      {/* ── Foundation slab ── */}
      <group ref={g0}>
        <WireBox w={BW + 1.0} h={FOUND_H} d={BD + 1.0} y={FOUND_H / 2} color={C_FOUND} />
        <WireBox w={BW - 0.3} h={FOUND_H * 0.5} d={BD - 0.3} y={FOUND_H * 0.25} color={C_SLAB} />
      </group>

      {/* ── Ground floor ── */}
      <group ref={g1}>
        {/* 4 corner columns — local Y from 0 → FH */}
        {CORNERS.map(([cx, cz], i) => (
          <WireBox key={i} w={COL_W} h={FH} d={COL_W} x={cx} y={FH / 2} z={cz} color={C_STRUCT} />
        ))}
        {/* Mid-span column front */}
        <WireBox w={COL_W} h={FH} d={COL_W} x={0} y={FH / 2} z={-BD / 2 + COL_W / 2} color={C_STRUCT} />
        {/* Top slab */}
        <WireBox w={BW} h={SLAB_H} d={BD} y={FH - SLAB_H / 2} color={C_SLAB} />
        {/* Perimeter beams */}
        <WireBox w={BW} h={0.12} d={0.10} y={FH - SLAB_H} z={-BD / 2 + 0.05} color={C_STRUCT} />
        <WireBox w={BW} h={0.12} d={0.10} y={FH - SLAB_H} z={ BD / 2 - 0.05} color={C_STRUCT} />
        {/* Window frames (front face) */}
        <WireBox w={0.82} h={1.1} d={0.02} x={-BW / 2 + 1.2} y={FH * 0.42} z={-BD / 2} color={C_WIN} />
        <WireBox w={0.82} h={1.1} d={0.02} x={ BW / 2 - 1.2} y={FH * 0.42} z={-BD / 2} color={C_WIN} />
        <WireBox w={0.82} h={1.1} d={0.02} x={0}            y={FH * 0.42} z={-BD / 2} color={C_WIN} />
      </group>

      {/* ── First floor ── */}
      <group ref={g2}>
        {CORNERS.map(([cx, cz], i) => (
          <WireBox key={i} w={COL_W} h={FH} d={COL_W} x={cx} y={FH / 2} z={cz} color={C_STRUCT} />
        ))}
        <WireBox w={COL_W} h={FH} d={COL_W} x={0} y={FH / 2} z={-BD / 2 + COL_W / 2} color={C_STRUCT} />
        <WireBox w={BW} h={SLAB_H} d={BD} y={FH - SLAB_H / 2} color={C_SLAB} />
        <WireBox w={BW} h={0.12} d={0.10} y={FH - SLAB_H} z={-BD / 2 + 0.05} color={C_STRUCT} />
        <WireBox w={BW} h={0.12} d={0.10} y={FH - SLAB_H} z={ BD / 2 - 0.05} color={C_STRUCT} />
        <WireBox w={0.82} h={1.1} d={0.02} x={-BW / 2 + 1.2} y={FH * 0.42} z={-BD / 2} color={C_WIN} />
        <WireBox w={0.82} h={1.1} d={0.02} x={ BW / 2 - 1.2} y={FH * 0.42} z={-BD / 2} color={C_WIN} />
        <WireBox w={0.82} h={1.1} d={0.02} x={0}            y={FH * 0.42} z={-BD / 2} color={C_WIN} />
      </group>

      {/* ── Roof level ── */}
      <group ref={g3}>
        {CORNERS.map(([cx, cz], i) => (
          <WireBox key={i} w={COL_W} h={FH * 0.55} d={COL_W} x={cx} y={FH * 0.55 / 2} z={cz} color={C_STRUCT} />
        ))}
        {/* Roof slab with slight overhang */}
        <WireBox w={BW + 0.5} h={SLAB_H * 2} d={BD + 0.5} y={FH * 0.55 + SLAB_H} color={C_SLAB} />
        {/* Parapet walls */}
        <WireBox w={BW + 0.5} h={0.45} d={0.08} y={FH * 0.55 + SLAB_H * 2 + 0.22} z={-BD / 2 - 0.25 + 0.04} color={C_STRUCT} />
        <WireBox w={BW + 0.5} h={0.45} d={0.08} y={FH * 0.55 + SLAB_H * 2 + 0.22} z={ BD / 2 + 0.25 - 0.04} color={C_STRUCT} />
        <WireBox w={0.08} h={0.45} d={BD + 0.5} y={FH * 0.55 + SLAB_H * 2 + 0.22} x={-BW / 2 - 0.25 + 0.04} color={C_STRUCT} />
        <WireBox w={0.08} h={0.45} d={BD + 0.5} y={FH * 0.55 + SLAB_H * 2 + 0.22} x={ BW / 2 + 0.25 - 0.04} color={C_STRUCT} />
      </group>
    </group>
  );
}

/* ─── Ground grid ─────────────────────────────────────────────── */
function GroundGrid() {
  const ref = useRef<THREE.GridHelper>(null!);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.08 + Math.sin(state.clock.elapsedTime * 0.4) * 0.025;
    }
  });
  return (
    <gridHelper
      ref={ref}
      args={[36, 18, '#3A3060', '#28204A']}
      position={[0, 0, 0]}
    />
  );
}

/* ─── Floating dust particles ──────────────────────────────────── */
function Particles() {
  const COUNT = 110;
  const ref   = useRef<THREE.Points>(null!);

  const { positions, velocities } = useMemo(() => {
    const positions  = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
      velocities[i * 3]     = (Math.random() - 0.5) * 0.005;
      velocities[i * 3 + 1] = 0.002 + Math.random() * 0.004;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.005;
    }
    return { positions, velocities };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      p[i * 3]     += velocities[i * 3];
      p[i * 3 + 1] += velocities[i * 3 + 1];
      p[i * 3 + 2] += velocities[i * 3 + 2];
      if (p[i * 3 + 1] > 15) {
        p[i * 3 + 1] = 0;
        p[i * 3]     = (Math.random() - 0.5) * 22;
        p[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={COUNT}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#8888CC" transparent opacity={0.28} sizeAttenuation />
    </points>
  );
}

/* ─── Scene ───────────────────────────────────────────────────── */
function Scene() {
  return (
    <>
      <color attach="background" args={['#0C0A09']} />
      <ambientLight intensity={0.25} color="#8090C0" />
      <directionalLight position={[10, 14, 10]} intensity={0.55} color="#B0C0E0" />
      <directionalLight position={[-6, 10, -6]} intensity={0.2} color="#6050A0" />

      <GroundGrid />
      <Building />
      <Particles />
      <CameraAim />

      <EffectComposer>
        <Bloom intensity={1.4} luminanceThreshold={0.55} luminanceSmoothing={0.85} />
      </EffectComposer>
    </>
  );
}

/* ─── Canvas export ───────────────────────────────────────────── */
export default function HeroBuildingScene() {
  return (
    <Canvas
      camera={{ position: [9, 6, 12], fov: 42 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.8]}
      style={{ width: '100%', height: '100%', background: '#0C0A09' }}
    >
      <Scene />
    </Canvas>
  );
}
