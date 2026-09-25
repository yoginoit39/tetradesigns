'use client';

import { useRef, useMemo, useEffect, createRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   Realistic mid-rise STEEL FRAME, drawn like a structural model /
   architect's plan: column grid, girders + infill beams, floor
   slabs, braced bays, core shaft, footings, rooftop plant, and
   architectural gridlines. Assembles floor by floor, then a
   "plan level" highlight sweeps up through the floors.
   ───────────────────────────────────────────────────────────── */

/* Building grid */
const BAYS_X = 4, BAYS_Z = 3, BAY = 3.0;
const FLOORS = 7;
const GROUND_FH = 1.5;   // taller ground storey
const FH = 1.15;
const W = BAYS_X * BAY, D = BAYS_Z * BAY;
const SETBACK_FROM = FLOORS - 1;  // top two floors step back one bay on +X

/* Member sections */
const COL = 0.14, BD = 0.2, BW = 0.1, SLAB = 0.08;

/* Level elevations: y[0]=ground, y[f]=top of floor f */
const Y: number[] = [0];
for (let f = 1; f <= FLOORS; f++) Y.push(GROUND_FH + (f - 1) * FH);
const H = Y[FLOORS];

const gx = (i: number) => i * BAY - W / 2;
const gz = (j: number) => j * BAY - D / 2;
const baysX = (f: number) => (f >= SETBACK_FROM ? BAYS_X - 1 : BAYS_X);

/* Colours — blueprint steel */
const C_STEEL = '#C0C8E0';
const C_BEAM  = '#8F99C2';
const C_SLAB  = '#5A6490';
const C_BRACE = '#8B5CF6';
const C_CORE  = '#7C3AED';
const C_FOUND = '#6D28D9';
const C_GRID  = '#6C66A8';
const C_SWEEP = '#A78BFA';

const DROP = 6;
const c01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/* Timing */
const NGROUP = 1 + FLOORS + 1;   // foundation + floors + roof
const GAP = 0.55, DUR = 0.9;
const ANIM_START = Array.from({ length: NGROUP }, (_, g) => g * GAP);
const T_ASSEMBLE = ANIM_START[NGROUP - 1] + DUR;
const T_SWEEP = 2.6, T_HOLD = 2.2, T_FADE = 1.0;
const CYCLE = T_ASSEMBLE + T_SWEEP + T_HOLD + T_FADE;

/* ─── Primitives (opacity driven by parent group; maxO caps it) ── */
function WireBox({ w, h, d, x = 0, y = 0, z = 0, color, maxO = 1 }:
  { w: number; h: number; d: number; x?: number; y?: number; z?: number; color: string; maxO?: number }) {
  const geo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)), [w, h, d]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 }), [color]);
  return <lineSegments geometry={geo} material={mat} position={[x, y, z]} userData={{ maxO }} />;
}

function Line({ a, b, color, maxO = 1 }:
  { a: [number, number, number]; b: [number, number, number]; color: string; maxO?: number }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([...a, ...b], 3));
    return g;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a[0], a[1], a[2], b[0], b[1], b[2]]);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0 }), [color]);
  return <lineSegments geometry={geo} material={mat} userData={{ maxO }} />;
}

/* ─── Foundation + architectural gridlines ─────────────────────── */
function Foundation() {
  const items: React.ReactNode[] = [];
  // footings under every column
  for (let i = 0; i <= BAYS_X; i++) for (let j = 0; j <= BAYS_Z; j++) {
    items.push(<WireBox key={`ft${i}-${j}`} w={0.8} h={0.4} d={0.8} x={gx(i)} y={-0.2} z={gz(j)} color={C_FOUND} />);
  }
  // ground beams
  for (let j = 0; j <= BAYS_Z; j++) items.push(<Line key={`gbx${j}`} a={[gx(0), -0.02, gz(j)]} b={[gx(BAYS_X), -0.02, gz(j)]} color={C_FOUND} maxO={0.7} />);
  for (let i = 0; i <= BAYS_X; i++) items.push(<Line key={`gbz${i}`} a={[gx(i), -0.02, gz(0)]} b={[gx(i), -0.02, gz(BAYS_Z)]} color={C_FOUND} maxO={0.7} />);
  // architectural gridlines extending past the footprint, with end markers
  const ext = 2.2;
  for (let j = 0; j <= BAYS_Z; j++) {
    items.push(<Line key={`gl-x${j}`} a={[gx(0) - ext, 0, gz(j)]} b={[gx(BAYS_X) + ext, 0, gz(j)]} color={C_GRID} maxO={0.35} />);
    items.push(<WireBox key={`gm-x${j}`} w={0.34} h={0.001} d={0.34} x={gx(0) - ext - 0.2} y={0} z={gz(j)} color={C_GRID} maxO={0.5} />);
  }
  for (let i = 0; i <= BAYS_X; i++) {
    items.push(<Line key={`gl-z${i}`} a={[gx(i), 0, gz(0) - ext]} b={[gx(i), 0, gz(BAYS_Z) + ext]} color={C_GRID} maxO={0.35} />);
    items.push(<WireBox key={`gm-z${i}`} w={0.34} h={0.001} d={0.34} x={gx(i)} y={0} z={gz(0) - ext - 0.2} color={C_GRID} maxO={0.5} />);
  }
  return <>{items}</>;
}

/* ─── One storey: columns, girders, infill beams, slab, bracing, core ── */
function Storey({ f }: { f: number }) {
  const yb = Y[f - 1], yt = Y[f];
  const nbx = baysX(f);
  const items: React.ReactNode[] = [];
  const beamY = yt - SLAB - BD / 2;

  // columns
  for (let i = 0; i <= nbx; i++) for (let j = 0; j <= BAYS_Z; j++) {
    items.push(<WireBox key={`c${i}-${j}`} w={COL} h={yt - yb} d={COL} x={gx(i)} y={(yb + yt) / 2} z={gz(j)} color={C_STEEL} />);
  }
  // girders along X
  for (let j = 0; j <= BAYS_Z; j++) for (let i = 0; i < nbx; i++) {
    items.push(<WireBox key={`gxb${i}-${j}`} w={BAY} h={BD} d={BW} x={gx(i) + BAY / 2} y={beamY} z={gz(j)} color={C_BEAM} />);
  }
  // girders along Z
  for (let i = 0; i <= nbx; i++) for (let j = 0; j < BAYS_Z; j++) {
    items.push(<WireBox key={`gzb${i}-${j}`} w={BW} h={BD} d={BAY} x={gx(i)} y={beamY} z={gz(j) + BAY / 2} color={C_BEAM} />);
  }
  // floor slab
  items.push(<WireBox key="slab" w={nbx * BAY} h={SLAB} d={D} x={gx(0) + (nbx * BAY) / 2} y={yt - SLAB / 2} z={0} color={C_SLAB} />);

  // braced bays: both short end faces, middle Z bay; plus one on the long face
  const brace = (x1: number, z1: number, x2: number, z2: number, key: string) => {
    items.push(<Line key={`${key}a`} a={[x1, yb, z1]} b={[x2, yt - SLAB, z2]} color={C_BRACE} />);
    items.push(<Line key={`${key}b`} a={[x2, yb, z2]} b={[x1, yt - SLAB, z1]} color={C_BRACE} />);
  };
  brace(gx(0), gz(1), gx(0), gz(2), `bL${f}`);
  brace(gx(nbx), gz(1), gx(nbx), gz(2), `bR${f}`);

  // core shaft (stairs / lifts)
  items.push(<WireBox key="core" w={BAY} h={yt - yb} d={BAY} x={gx(1) + BAY / 2} y={(yb + yt) / 2} z={gz(1) + BAY / 2} color={C_CORE} maxO={0.85} />);

  return <>{items}</>;
}

/* ─── Roof: parapet + plant room + units ────────────────────────── */
function Roof() {
  const nbx = baysX(FLOORS);
  const wTop = nbx * BAY;
  const cx = gx(0) + wTop / 2;
  return (
    <>
      {/* parapet */}
      <WireBox w={wTop + 0.1} h={0.35} d={0.06} x={cx} y={H + 0.175} z={gz(0)} color={C_STEEL} maxO={0.8} />
      <WireBox w={wTop + 0.1} h={0.35} d={0.06} x={cx} y={H + 0.175} z={gz(BAYS_Z)} color={C_STEEL} maxO={0.8} />
      <WireBox w={0.06} h={0.35} d={D + 0.1} x={gx(0)} y={H + 0.175} z={0} color={C_STEEL} maxO={0.8} />
      <WireBox w={0.06} h={0.35} d={D + 0.1} x={gx(nbx)} y={H + 0.175} z={0} color={C_STEEL} maxO={0.8} />
      {/* plant room over the core */}
      <WireBox w={BAY * 1.15} h={0.95} d={BAY * 1.05} x={gx(1) + BAY / 2} y={H + 0.475} z={gz(1) + BAY / 2} color={C_CORE} />
      {/* rooftop units */}
      <WireBox w={0.7} h={0.45} d={0.5} x={gx(1) - 0.4} y={H + 0.225} z={gz(0) + 0.9} color={C_BEAM} />
      <WireBox w={0.7} h={0.45} d={0.5} x={gx(1) + 0.6} y={H + 0.225} z={gz(0) + 0.9} color={C_BEAM} />
      <WireBox w={0.5} h={0.6} d={0.5} x={gx(nbx) - 0.9} y={H + 0.3} z={gz(BAYS_Z) - 0.8} color={C_BEAM} />
    </>
  );
}

/* ─── Building assembly rig ────────────────────────────────────── */
function Building() {
  const rootRef  = useRef<THREE.Group>(null!);
  const glowRef  = useRef<THREE.PointLight>(null!);
  const sweepRef = useRef<THREE.LineSegments>(null!);
  const groups = useMemo(() => Array.from({ length: NGROUP }, () => createRef<THREE.Group>()), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const t = time % CYCLE;
    if (rootRef.current) rootRef.current.rotation.y = time * 0.1;

    // global fade at end of cycle
    const tf = t - (CYCLE - T_FADE);
    const fade = tf >= 0 ? 1 - c01(tf / T_FADE) : 1;

    let activeY = 0, has = false;

    groups.forEach((ref, g) => {
      const grp = ref.current;
      if (!grp) return;
      const prog = c01((t - ANIM_START[g]) / DUR);
      const eased = easeOut(prog);
      const opacity = c01(prog * 4) * fade;
      grp.position.y = DROP * (1 - eased);
      grp.traverse(obj => {
        if (obj instanceof THREE.LineSegments) {
          const maxO = (obj.userData?.maxO as number | undefined) ?? 1;
          (obj.material as THREE.LineBasicMaterial).opacity = opacity * maxO;
        }
      });
      if (prog > 0.04 && prog < 0.97) {
        activeY = g === 0 ? 0.2 : g <= FLOORS ? Y[g] - 0.4 + grp.position.y : H + 0.4 + grp.position.y;
        has = true;
      }
    });

    // plan-level sweep after assembly
    const ts = t - T_ASSEMBLE;
    let sweepOn = false, sweepY = 0;
    if (ts >= 0 && ts < T_SWEEP) {
      sweepOn = true;
      sweepY = easeOut(ts / T_SWEEP) * (H + 0.1);
    }
    if (sweepRef.current) {
      sweepRef.current.visible = sweepOn && fade > 0.05;
      sweepRef.current.position.y = sweepY;
      (sweepRef.current.material as THREE.LineBasicMaterial).opacity = sweepOn ? 0.9 * fade : 0;
    }

    if (glowRef.current) {
      const on = (has || sweepOn) && fade > 0.05;
      glowRef.current.visible = on;
      glowRef.current.position.set(0, sweepOn ? sweepY : activeY, 0);
      glowRef.current.intensity = (8 + Math.sin(time * 5) * 3) * fade;
    }
  });

  const sweepGeo = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(W + 1.2, 0.01, D + 1.2)), []);
  const sweepMat = useMemo(() => new THREE.LineBasicMaterial({ color: C_SWEEP, transparent: true, opacity: 0 }), []);

  return (
    <group ref={rootRef}>
      <pointLight ref={glowRef} color="#7C3AED" intensity={8} distance={22} decay={2} visible={false} />
      <group ref={groups[0]}><Foundation /></group>
      {Array.from({ length: FLOORS }, (_, i) => (
        <group key={i} ref={groups[i + 1]}><Storey f={i + 1} /></group>
      ))}
      <group ref={groups[FLOORS + 1]}><Roof /></group>
      <lineSegments ref={sweepRef} geometry={sweepGeo} material={sweepMat} visible={false} />
    </group>
  );
}

function CameraAim() {
  const { camera } = useThree();
  useEffect(() => { camera.lookAt(1.4, H * 0.42, 0); }, [camera]);
  return null;
}

function GroundGrid() {
  const ref = useRef<THREE.GridHelper>(null!);
  useFrame((state) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.07 + Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
    }
  });
  return <gridHelper ref={ref} args={[60, 30, '#3A3060', '#28204A']} position={[0, -0.42, 0]} />;
}

function Particles() {
  const COUNT = 110;
  const ref = useRef<THREE.Points>(null!);
  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const velocities = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = Math.random() * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      velocities[i * 3] = (Math.random() - 0.5) * 0.004;
      velocities[i * 3 + 1] = 0.002 + Math.random() * 0.003;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.004;
    }
    return { positions, velocities };
  }, []);
  useFrame(() => {
    if (!ref.current) return;
    const p = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < COUNT; i++) {
      p[i * 3] += velocities[i * 3]; p[i * 3 + 1] += velocities[i * 3 + 1]; p[i * 3 + 2] += velocities[i * 3 + 2];
      if (p[i * 3 + 1] > 15) p[i * 3 + 1] = 0;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#8888CC" transparent opacity={0.22} sizeAttenuation />
    </points>
  );
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#0C0A09']} />
      <ambientLight intensity={0.35} />
      <GroundGrid />
      <Building />
      <Particles />
      <CameraAim />
      <EffectComposer>
        <Bloom intensity={1.1} luminanceThreshold={0.55} luminanceSmoothing={0.85} />
      </EffectComposer>
    </>
  );
}

export default function HeroBuildingScene() {
  return (
    <Canvas
      camera={{ position: [19, 11, 24.5], fov: 36 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.8]}
      style={{ width: '100%', height: '100%', background: '#0C0A09' }}
    >
      <Scene />
    </Canvas>
  );
}
