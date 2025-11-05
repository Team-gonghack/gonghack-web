"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import * as THREE from "three";
import { PosturePattern } from "@/types";
import { getPostureAngles } from "@/utils/postureMapping";

interface AvatarProps {
  pattern: PosturePattern;
  riskColor: string;
}

export function Avatar({ pattern, riskColor }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const spineRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  // 자세 패턴에 따른 각도 가져오기
  const targetAngles = useMemo(() => getPostureAngles(pattern), [pattern]);

  // 스프링 애니메이션 설정
  const { neck, spine, leftShoulder, rightShoulder } = useSpring({
    neck: targetAngles.neck,
    spine: targetAngles.spine,
    leftShoulder: targetAngles.leftShoulder,
    rightShoulder: targetAngles.rightShoulder,
    config: { tension: 120, friction: 14 },
  });

  // 자연스러운 호흡 애니메이션
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.05;
    }
  });

  // 재질 설정
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: riskColor,
        metalness: 0.3,
        roughness: 0.4,
        emissive: riskColor,
        emissiveIntensity: 0.3,
      }),
    [riskColor]
  );

  return (
    <group ref={groupRef}>
      {/* 조명 */}
      <ambientLight intensity={0.5} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* 머리 */}
      <animated.mesh
        ref={headRef}
        position={[0, 1.5, 0]}
        rotation-x={neck}
        castShadow
      >
        <sphereGeometry args={[0.25, 32, 32]} />
        <primitive object={material} />
      </animated.mesh>

      {/* 목 */}
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <primitive object={material} />
      </mesh>

      {/* 척추/몸통 */}
      <animated.mesh
        ref={spineRef}
        position={[0, 0.5, 0]}
        rotation-x={spine}
        castShadow
      >
        <boxGeometry args={[0.5, 1.0, 0.3]} />
        <primitive object={material} />
      </animated.mesh>

      {/* 왼쪽 팔 */}
      <animated.group
        ref={leftArmRef}
        position={[-0.4, 0.9, 0]}
        rotation-z={leftShoulder}
      >
        {/* 상완 */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <primitive object={material} />
        </mesh>
        {/* 하완 */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.6, 16]} />
          <primitive object={material} />
        </mesh>
      </animated.group>

      {/* 오른쪽 팔 */}
      <animated.group
        ref={rightArmRef}
        position={[0.4, 0.9, 0]}
        rotation-z={rightShoulder}
      >
        {/* 상완 */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
          <primitive object={material} />
        </mesh>
        {/* 하완 */}
        <mesh position={[0, -0.9, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.6, 16]} />
          <primitive object={material} />
        </mesh>
      </animated.group>

      {/* 왼쪽 다리 */}
      <mesh position={[-0.15, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.0, 16]} />
        <primitive object={material} />
      </mesh>

      {/* 오른쪽 다리 */}
      <mesh position={[0.15, -0.5, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 1.0, 16]} />
        <primitive object={material} />
      </mesh>
    </group>
  );
}
