'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ─────────────────────────────────────────────────────────────
   Structural "stick model" analysis view — the way analysis
   software draws a frame: line members + joint nodes. A gravity
   load case cycles: columns tint blue (compression), girders
   tint magenta and visibly sag at midspan (beams are subdivided
   so bending shows), then the frame releases. Minimal + precise.
   ───────────────────────────────────────────────────────────── */

const NX = 3, NZ = 2, BAY = 2.2;
const LEVELS = 4;
const GROUND = 1.4, FH = 1.1;
const NSUB = 4;              // beam subdivisions (for visible sag)
const SAG = 0.16;            // midspan deflection amplitude (exaggerated)

const W = NX * BAY, D = NZ * BAY;
const Y: number[] = [0];
for (let L = 1; L <= LEVELS; L++) Y.push(GROUND + (L - 1) * FH);
const H = Y[LEVELS];
const gx = (i: number) => i * BAY - W / 2;
const gz = (j: number) => j * BAY - D / 2;

const COL = {
  N: [0.72, 0.76, 0.90] as const,  // neutral steel
  C: [0.34, 0.66, 1.00] as const,  // compression → blue
  T: [1.00, 0.36, 0.62] as const,  // tension / bending → magenta
  F: [0.49, 0.23, 0.93] as const,  // footings → brand purple
};

const c01 = (v: number) => Math.max(0, Math.min(1, v));
const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

type Seg = {
  a: [number, number, number]; aw: number;   // base pos + sag weight
  b: [number, number, number]; bw: number;
  col: readonly [number, number, number]; mag: number; fixed?: boolean;
};

function buildModel() {
  const segs: Seg[] = [];
  const nodes: [number, number, number][] = [];
  const push = (a: [number, number, number], aw: number, b: [number, number, number], bw: number,
                col: readonly [number, number, number], mag: number, fixed = false) =>
    segs.push({ a, aw, b, bw, col, mag, fixed });

  // joint nodes
  for (let L = 0; L <= LEVELS; L++) for (let i = 0; i <= NX; i++) for (let j = 0; j <= NZ; j++) nodes.push([gx(i), Y[L], gz(j)]);

  // columns — compression, heaviest at base
  for (let i = 0; i <= NX; i++) for (let j = 0; j <= NZ; j++) for (let L = 0; L < LEVELS; L++) {
    push([gx(i), Y[L], gz(j)], 0, [gx(i), Y[L + 1], gz(j)], 0, COL.C, (1 - L / LEVELS) * 0.75 + 0.25);
  }
  // girders (subdivided) — bending, peak at midspan
  const sagW = (u: number) => 4 * u * (1 - u);
  for (let L = 1; L <= LEVELS; L++) {
    for (let j = 0; j <= NZ; j++) for (let i = 0; i < NX; i++) for (let k = 0; k < NSUB; k++) {
      const u0 = k / NSUB, u1 = (k + 1) / NSUB, um = (u0 + u1) / 2;
      push([gx(i) + u0 * BAY, Y[L], gz(j)], sagW(u0), [gx(i) + u1 * BAY, Y[L], gz(j)], sagW(u1), COL.T, sagW(um));
    }
    for (let i = 0; i <= NX; i++) for (let j = 0; j < NZ; j++) for (let k = 0; k < NSUB; k++) {
      const u0 = k / NSUB, u1 = (k + 1) / NSUB, um = (u0 + u1) / 2;
      push([gx(i), Y[L], gz(j) + u0 * BAY], sagW(u0), [gx(i), Y[L], gz(j) + u1 * BAY], sagW(u1), COL.T, sagW(um));
    }
  }
  // X-bracing on both end faces (bay j=0)
  for (const i of [0, NX]) for (let L = 0; L < LEVELS; L++) {
    push([gx(i), Y[L], gz(0)], 0, [gx(i), Y[L + 1], gz(1)], 0, L % 2 ? COL.C : COL.T, 0.55);
    push([gx(i), Y[L], gz(1)], 0, [gx(i), Y[L + 1], gz(0)], 0, L % 2 ? COL.T : COL.C, 0.55);
  }
  // footings — small pads under each column (fixed colour)
  const s = 0.28;
  for (let i = 0; i <= NX; i++) for (let j = 0; j <= NZ; j++) {
    const x = gx(i), z = gz(j), y = -0.02;
    push([x - s, y, z - s], 0, [x + s, y, z - s], 0, COL.F, 0, true);
    push([x + s, y, z - s], 0, [x + s, y, z + s], 0, COL.F, 0, true);
    push([x + s, y, z + s], 0, [x - s, y, z + s], 0, COL.F, 0, true);
    push([x - s, y, z + s], 0, [x - s, y, z - s], 0, COL.F, 0, true);
  }
  return { segs, nodes };
}

/* Load cycle */
const T_LOAD = 1.7, T_HOLD = 1.6, T_RELEASE = 1.5, T_REST = 2.2;
const CYCLE = T_LOAD + T_HOLD + T_RELEASE + T_REST;

function Frame() {
  const groupRef = useRef<THREE.Group>(null!);
  const memRef = useRef<THREE.LineSegments>(null!);
  const nodeRef = useRef<THREE.Points>(null!);
  const { segs, nodes } = useMemo(buildModel, []);

  const buf = useMemo(() => ({
    mp: new Float32Array(segs.length * 6),
    mc: new Float32Array(segs.length * 8),
    np: new Float32Array(nodes.length * 3),
    nc: new Float32Array(nodes.length * 4),
  }), [segs.length, nodes.length]);

  // node positions never move (columns are axially stiff)
  useEffect(() => {
    nodes.forEach((n, i) => { buf.np[i * 3] = n[0]; buf.np[i * 3 + 1] = n[1]; buf.np[i * 3 + 2] = n[2]; });
    const g = nodeRef.current?.geometry;
    if (g) (g.attributes.position as THREE.BufferAttribute).copyArray(buf.np).needsUpdate = true;
  }, [nodes, buf]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const t = time % CYCLE;
    let load = 0;
    if (t < T_LOAD) load = easeInOut(t / T_LOAD);
    else if (t < T_LOAD + T_HOLD) load = 1;
    else if (t < T_LOAD + T_HOLD + T_RELEASE) load = 1 - easeInOut((t - T_LOAD - T_HOLD) / T_RELEASE);
    const fadeIn = c01(time / 1.2);

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.16;
      groupRef.current.rotation.x = Math.sin(time * 0.15) * 0.04;
    }

    const { mp, mc } = buf;
    for (let k = 0; k < segs.length; k++) {
      const s = segs[k];
      mp[k * 6]     = s.a[0]; mp[k * 6 + 1] = s.a[1] - SAG * s.aw * load; mp[k * 6 + 2] = s.a[2];
      mp[k * 6 + 3] = s.b[0]; mp[k * 6 + 4] = s.b[1] - SAG * s.bw * load; mp[k * 6 + 5] = s.b[2];
      let r: number, g: number, b: number;
      if (s.fixed) { [r, g, b] = s.col; }
      else {
        const f = load * s.mag;
        r = COL.N[0] + (s.col[0] - COL.N[0]) * f;
        g = COL.N[1] + (s.col[1] - COL.N[1]) * f;
        b = COL.N[2] + (s.col[2] - COL.N[2]) * f;
      }
      const alpha = (s.fixed ? 0.7 : 0.95) * fadeIn;
      for (let v = 0; v < 2; v++) { const o = k * 8 + v * 4; mc[o] = r; mc[o + 1] = g; mc[o + 2] = b; mc[o + 3] = alpha; }
    }
    const mg = memRef.current?.geometry;
    if (mg) {
      (mg.attributes.position as THREE.BufferAttribute).copyArray(mp).needsUpdate = true;
      (mg.attributes.color as THREE.BufferAttribute).copyArray(mc).needsUpdate = true;
    }

    const { nc } = buf;
    const glow = 0.55 + 0.45 * load;
    for (let i = 0; i < nodes.length; i++) {
      nc[i * 4] = 0.78; nc[i * 4 + 1] = 0.70; nc[i * 4 + 2] = 1.0; nc[i * 4 + 3] = glow * fadeIn;
    }
    const ng = nodeRef.current?.geometry;
    if (ng) (ng.attributes.color as THREE.BufferAttribute).copyArray(nc).needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, -H * 0.5, 0]}>
      <lineSegments ref={memRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buf.mp, 3]} count={segs.length * 2} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[buf.mc, 4]} count={segs.length * 2} itemSize={4} />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent />
      </lineSegments>
      <points ref={nodeRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buf.np, 3]} count={nodes.length} itemSize={3} />
          <bufferAttribute attach="attributes-color" args={[buf.nc, 4]} count={nodes.length} itemSize={4} />
        </bufferGeometry>
        <pointsMaterial size={0.11} vertexColors transparent sizeAttenuation />
      </points>
    </group>
  );
}

function CameraAim() {
  const { camera } = useThree();
  useEffect(() => { camera.lookAt(0, 0.1, 0); }, [camera]);
  return null;
}

/* ─── Exported component ──────────────────────────────── */
export default function StructureViewer() {
  return (
    <div style={{
      position: 'relative',
      height: '100%',
      minHeight: '420px',
      background: 'radial-gradient(ellipse at 50% 40%, #16121F 0%, #0C0A09 70%)',
      borderRadius: '4px',
      border: '1px solid rgba(109,40,217,0.22)',
      overflow: 'hidden',
    }}>
      {/* Blueprint grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(109,40,217,0.07) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(109,40,217,0.07) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '30px 30px',
        maskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 30%, transparent 85%)',
      }} />

      {/* Corner bracket marks */}
      {[
        { top: '12px',    left: '12px',  borderTop: '1px solid rgba(167,139,250,0.5)', borderLeft:  '1px solid rgba(167,139,250,0.5)' },
        { top: '12px',    right: '12px', borderTop: '1px solid rgba(167,139,250,0.5)', borderRight: '1px solid rgba(167,139,250,0.5)' },
        { bottom: '12px', left: '12px',  borderBottom: '1px solid rgba(167,139,250,0.5)', borderLeft:  '1px solid rgba(167,139,250,0.5)' },
        { bottom: '12px', right: '12px', borderBottom: '1px solid rgba(167,139,250,0.5)', borderRight: '1px solid rgba(167,139,250,0.5)' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', ...s }} />
      ))}

      {/* Labels */}
      <div style={{
        position: 'absolute', bottom: '14px', left: '16px', zIndex: 1,
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: '0.58rem', letterSpacing: '0.22em',
        color: 'rgba(196,181,253,0.6)', textTransform: 'uppercase',
      }}>
        Steel Frame — Gravity Load Case
      </div>
      <div style={{
        position: 'absolute', top: '14px', right: '16px', zIndex: 1,
        fontFamily: 'var(--font-barlow), monospace',
        fontSize: '0.55rem', color: 'rgba(167,139,250,0.55)', letterSpacing: '0.12em',
      }}>
        REF-TDC-STR-01
      </div>
      {/* Force legend */}
      <div style={{
        position: 'absolute', bottom: '14px', right: '16px', zIndex: 1,
        display: 'flex', gap: '0.9rem',
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(230,220,208,0.5)',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '14px', height: '2px', background: '#57A8FF' }} /> Compression
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '14px', height: '2px', background: '#FF5C9E' }} /> Bending
        </span>
      </div>

      <Canvas
        camera={{ position: [10.5, 5.8, 12.5], fov: 34 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.8]}
        style={{ width: '100%', height: '100%', minHeight: '420px' }}
      >
        <ambientLight intensity={0.4} />
        <Frame />
        <CameraAim />
        <EffectComposer>
          <Bloom intensity={1.0} luminanceThreshold={0.5} luminanceSmoothing={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
