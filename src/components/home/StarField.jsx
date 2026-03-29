"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export default function StarField({ count = 1500 }) {
  const points = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
      pos[i * 3 + 2] = -Math.random() * 15;

      // Mix of white, blue, and purple stars
      const r = Math.random();
      if (r < 0.6) {
        col[i * 3] = 1;
        col[i * 3 + 1] = 1;
        col[i * 3 + 2] = 1;
      } else if (r < 0.8) {
        col[i * 3] = 0.6;
        col[i * 3 + 1] = 0.7;
        col[i * 3 + 2] = 1;
      } else {
        col[i * 3] = 0.8;
        col[i * 3 + 1] = 0.5;
        col[i * 3 + 2] = 1;
      }
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (points.current) {
      points.current.rotation.y += delta * 0.02;
      points.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={colors.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
