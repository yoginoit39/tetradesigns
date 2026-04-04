'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

/* ─── Structural space frame ──────────────────────────── */
function SpaceFrame() {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.28;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.06;
    }
  });

  const w = 2.4, d = 1.7, h = 5.2;
  const floors = 8;
  const cols: [number, number][] = [[-w/2, -d/2], [w/2, -d/2], [w/2, d/2], [-w/2, d/2]];

  // Joint positions for glowing nodes
  const jointPosArray = useMemo(() => {
    const arr: number[] = [];
    for (let fi = 0; fi <= floors; fi++) {
      const y = (fi / floors) * h;
      cols.forEach(([cx, cz]) => arr.push(cx, y, cz));
    }
    return new Float32Array(arr);
  }, []);

  const braceCount = Math.floor(floors / 2);

  return (
    <group ref={groupRef} position={[0, -h / 2, 0]}>

      {/* Vertical columns — purple glow */}
      {cols.map(([cx, cz], i) => (
        <mesh key={`col-${i}`} position={[cx, h / 2, cz]}>
          <boxGeometry args={[0.07, h, 0.07]} />
          <meshStandardMaterial
            color="#A78BFA"
            emissive="#7C3AED"
            emissiveIntensity={0.5}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}

      {/* Horizontal perimeter beams at each floor */}
      {Array.from({ length: floors + 1 }, (_, fi) => {
        const y = (fi / floors) * h;
        return (
          <group key={`floor-${fi}`}>
            {[
              { pos: [0, y, -d/2] as [number,number,number], size: [w, 0.045, 0.045] as [number,number,number] },
              { pos: [0, y,  d/2] as [number,number,number], size: [w, 0.045, 0.045] as [number,number,number] },
              { pos: [-w/2, y, 0] as [number,number,number], size: [0.045, 0.045, d] as [number,number,number] },
              { pos: [ w/2, y, 0] as [number,number,number], size: [0.045, 0.045, d] as [number,number,number] },
            ].map(({ pos, size }, bi) => (
              <mesh key={bi} position={pos}>
                <boxGeometry args={size} />
                <meshStandardMaterial color="#8B5CF6" emissive="#6D28D9" emissiveIntensity={0.7} />
              </mesh>
            ))}
          </group>
        );
      })}

      {/* X-diagonal bracing — amber, every 2 floors */}
      {Array.from({ length: braceCount }, (_, i) => {
        const y1 = (i * 2 / floors) * h;
        const y2 = ((i * 2 + 2) / floors) * h;
        const dy = y2 - y1;
        const diagLen = Math.sqrt(w * w + dy * dy);
        const angle = Math.atan2(dy, w);
        return (
          <group key={`brace-${i}`}>
            <mesh position={[0, (y1 + y2) / 2, -d/2]} rotation={[0, 0, angle]}>
              <boxGeometry args={[diagLen, 0.038, 0.038]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.0} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, (y1 + y2) / 2, -d/2]} rotation={[0, 0, -angle]}>
              <boxGeometry args={[diagLen, 0.038, 0.038]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={1.0} transparent opacity={0.85} />
            </mesh>
            <mesh position={[-w/2, (y1 + y2) / 2, 0]} rotation={[angle, 0, 0]}>
              <boxGeometry args={[0.038, Math.sqrt(d * d + dy * dy), 0.038]} />
              <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.6} transparent opacity={0.6} />
            </mesh>
          </group>
        );
      })}

      {/* Glowing joint nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[jointPosArray, 3]}
            count={jointPosArray.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.13} color="#C4B5FD" sizeAttenuation />
      </points>
    </group>
  );
}

/* ─── Exported component ──────────────────────────────── */
export default function StructureViewer() {
  return (
    <div style={{
      position: 'relative',
      height: '100%',
      minHeight: '420px',
      background: 'linear-gradient(155deg, #040918 0%, #080F28 60%, #050818 100%)',
      borderRadius: '4px',
      border: '1px solid rgba(109,40,217,0.18)',
      overflow: 'hidden',
    }}>
      {/* Blueprint grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(29,78,216,0.07) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(29,78,216,0.07) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '30px 30px',
      }} />

      {/* Corner bracket marks */}
      {[
        { top: '12px',    left: '12px',  borderTop: '1px solid rgba(109,40,217,0.4)', borderLeft:  '1px solid rgba(109,40,217,0.4)' },
        { top: '12px',    right: '12px', borderTop: '1px solid rgba(109,40,217,0.4)', borderRight: '1px solid rgba(109,40,217,0.4)' },
        { bottom: '12px', left: '12px',  borderBottom: '1px solid rgba(109,40,217,0.4)', borderLeft:  '1px solid rgba(109,40,217,0.4)' },
        { bottom: '12px', right: '12px', borderBottom: '1px solid rgba(109,40,217,0.4)', borderRight: '1px solid rgba(109,40,217,0.4)' },
      ].map((s, i) => (
        <div key={i} style={{ position: 'absolute', width: '14px', height: '14px', ...s }} />
      ))}

      {/* Technical label */}
      <div style={{
        position: 'absolute', bottom: '14px', left: '16px', zIndex: 1,
        fontFamily: 'var(--font-barlow), sans-serif',
        fontSize: '0.58rem', letterSpacing: '0.22em',
        color: 'rgba(109,40,217,0.55)', textTransform: 'uppercase',
      }}>
        Structural Frame — 3D Analysis
      </div>

      {/* Dimension markers */}
      <div style={{
        position: 'absolute', top: '14px', right: '16px', zIndex: 1,
        fontFamily: 'var(--font-barlow), monospace',
        fontSize: '0.55rem', color: 'rgba(37,99,235,0.5)',
        letterSpacing: '0.1em',
      }}>
        REF-TDC-STR-01
      </div>

      <Canvas
        camera={{ position: [5, 2.5, 7.5], fov: 36 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: '100%', height: '100%', minHeight: '420px' }}
      >
        <ambientLight intensity={0.35} />
        <directionalLight position={[5, 10, 5]} intensity={0.5} color="#A78BFA" />
        <SpaceFrame />
        <EffectComposer>
          <Bloom intensity={1.2} luminanceThreshold={0.35} luminanceSmoothing={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
