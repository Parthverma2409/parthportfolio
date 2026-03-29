"use client";
import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Torus } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { heroProgress } from "@/lib/heroProgress";

const WARM_GOLD  = new THREE.Color("#d49030");
const BG_COLOR   = "#05050f";
const CAM_Z_START = 9.5;
const CAM_Z_END   = -1.5;

const STAGE_SPHERE_END     = 0.38;
const STAGE_TRANSITION_END = 0.60;

// ── glowing golden sphere ─────────────────────────────────────────────────
function GoldenSphere() {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.14;
    meshRef.current.rotation.x += delta * 0.05;

    const p     = heroProgress.value;
    const range = STAGE_TRANSITION_END - STAGE_SPHERE_END;
    const t     = p <= STAGE_SPHERE_END
      ? 1
      : Math.max(0, 1 - (p - STAGE_SPHERE_END) / range);

    meshRef.current.scale.setScalar(t * 1.5);
    meshRef.current.visible = t > 0.01;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* meshStandardMaterial + strong emissive = glows without env map */}
        <meshStandardMaterial
          color="#b87820"
          emissive="#e06010"
          emissiveIntensity={1.8}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </Float>
  );
}

// ── ring layer — torus geometry arcs at various depths ────────────────────
const RING_DEFS = [
  { z:  3.0, r: 2.0, tube: 0.006, rotSpeed: [0.18, 0.10, 0] },
  { z:  0.5, r: 2.5, tube: 0.005, rotSpeed: [-0.12, 0, 0.07] },
  { z: -2.0, r: 2.2, tube: 0.007, rotSpeed: [0.08, -0.15, 0] },
  { z: -4.5, r: 2.8, tube: 0.005, rotSpeed: [-0.20, 0.06, 0] },
  { z: -7.0, r: 2.4, tube: 0.006, rotSpeed: [0.10, 0, -0.12] },
  { z:-10.0, r: 2.6, tube: 0.004, rotSpeed: [-0.08, 0.18, 0] },
];

function RingLayer({ def, groupOpacityRef }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * def.rotSpeed[0];
    meshRef.current.rotation.y += delta * def.rotSpeed[1];
    meshRef.current.rotation.z += delta * def.rotSpeed[2];

    // drive opacity from heroProgress
    const p     = heroProgress.value;
    const range = STAGE_TRANSITION_END - STAGE_SPHERE_END;
    const t     = p <= STAGE_SPHERE_END
      ? 0
      : Math.min(1, (p - STAGE_SPHERE_END) / range);
    meshRef.current.material.opacity = t * 0.55;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, def.z]}>
      <torusGeometry args={[def.r, def.tube, 6, 128]} />
      <meshStandardMaterial
        color="#c88030"
        emissive="#a06020"
        emissiveIntensity={2.5}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </mesh>
  );
}

// ── outer decorative dot rings (small spheres on circle) ──────────────────
function DotRing({ radius, z, count, speed }) {
  const groupRef = useRef();
  const positions = useMemo(() => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return pts;
  }, [radius, count]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * speed;
    }
    // drive opacity
    const p     = heroProgress.value;
    const range = STAGE_TRANSITION_END - STAGE_SPHERE_END;
    const t     = p <= STAGE_SPHERE_END
      ? 0
      : Math.min(1, (p - STAGE_SPHERE_END) / range);
    if (groupRef.current) {
      groupRef.current.children.forEach((c) => {
        if (c.material) c.material.opacity = t * 0.7;
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, z]}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshStandardMaterial
            color="#e8a040"
            emissive="#e8a040"
            emissiveIntensity={3}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── ambient dust particles ────────────────────────────────────────────────
function Dust({ count = 400 }) {
  const pointsRef = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 28 - 5;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#d49030"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// ── camera dolly ─────────────────────────────────────────────────────────
function CameraRig() {
  useFrame((state, delta) => {
    const p = heroProgress.value;
    const tunnelT = p <= STAGE_TRANSITION_END
      ? 0
      : (p - STAGE_TRANSITION_END) / (1 - STAGE_TRANSITION_END);

    const targetZ = CAM_Z_START - tunnelT * (CAM_Z_START - CAM_Z_END);
    state.camera.position.z += (targetZ - state.camera.position.z) * Math.min(delta * 3, 1);
    state.camera.position.y += ((-tunnelT * 0.15) - state.camera.position.y) * Math.min(delta * 2, 1);
  });
  return null;
}

// ── scene ─────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <color attach="background" args={[BG_COLOR]} />
      <fog attach="fog" args={[BG_COLOR, 16, 42]} />

      {/* Warm key light */}
      <ambientLight intensity={0.4} color="#ffcc80" />
      <pointLight position={[0, 0, 3]}  intensity={6}   color="#ff9020" distance={10} decay={2} />
      <pointLight position={[3, 3, 2]}  intensity={3}   color="#ffa040" distance={12} decay={2} />
      <pointLight position={[-3, -2, 2]} intensity={2}  color="#ff8010" distance={10} decay={2} />
      <directionalLight position={[0, 5, 5]} intensity={1.5} color="#ffd080" />

      <CameraRig />
      <GoldenSphere />
      <Dust />

      {RING_DEFS.map((def, i) => (
        <RingLayer key={i} def={def} />
      ))}

      <DotRing radius={2.2} z={2.5}  count={24} speed={ 0.20} />
      <DotRing radius={2.6} z={-1.0} count={32} speed={-0.14} />
      <DotRing radius={2.4} z={-4.5} count={28} speed={ 0.18} />
      <DotRing radius={2.8} z={-8.0} count={36} speed={-0.10} />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          intensity={2.0}
        />
      </EffectComposer>
    </>
  );
}

// ── export ────────────────────────────────────────────────────────────────
export default function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, CAM_Z_START], fov: 34, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
