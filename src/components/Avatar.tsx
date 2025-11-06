"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { ActivityState } from "@/types";
import { getActivityAngles } from "@/utils/postureMapping";

interface AvatarProps {
  activityState: ActivityState;
  riskColor: string;
}

export function Avatar({ activityState, riskColor }: AvatarProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Mesh>(null);
  const upperBodyRef = useRef<THREE.Group>(null);
  const spineRef = useRef<THREE.Mesh>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);

  // 애니메이션 업데이트
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const angles = getActivityAngles(activityState, t);

    // 상체(머리+몸통) 움직임
    if (upperBodyRef.current) {
      upperBodyRef.current.rotation.x = angles.spine;
    }

    // 팔 움직임 (걷기/달리기 시 자연스러운 흔들림)
    if (leftArmRef.current && rightArmRef.current) {
      leftArmRef.current.rotation.x = angles.leftShoulder;
      rightArmRef.current.rotation.x = angles.rightShoulder;
    }

    // 다리 움직임 (걷기/달리기)
    if (leftLegRef.current && rightLegRef.current) {
      leftLegRef.current.rotation.x = angles.leftLeg || 0;
      rightLegRef.current.rotation.x = angles.rightLeg || 0;
    }

    // 전체 몸 움직임 (걷기/달리기 시 상하 움직임)
    if (groupRef.current) {
      if (activityState === "walking") {
        groupRef.current.position.y = Math.abs(Math.sin(t * 2)) * 0.05;
      } else if (activityState === "running") {
        groupRef.current.position.y = Math.abs(Math.sin(t * 4)) * 0.075;
      } else {
        // 멈춤 시 자연스러운 호흡
        groupRef.current.position.y = Math.sin(t * 1.5) * 0.025;
      }
    }
  });

  // 재질 설정
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        metalness: 0.1,
        roughness: 0.5,
        emissive: "#f0f0f0",
        emissiveIntensity: 0.1,
      }),
    [riskColor]
  );

  return (
    <group ref={groupRef}>
      {/* 조명 */}
      <ambientLight intensity={0.6} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        intensity={1.2}
        castShadow
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      {/* 상체 그룹 (머리 + 몸통 + 팔 + 다리) */}
      <group ref={upperBodyRef}>
        {/* 머리 - 둥근 블록 */}
        <mesh
          ref={headRef}
          position={[0, 1.25, 0]}
          castShadow
          material={material}
        >
          <boxGeometry args={[0.4, 0.4, 0.4]} />
        </mesh>

        {/* 상체 - 큰 블록 */}
        <mesh
          ref={spineRef}
          position={[0, 0.7, 0]}
          castShadow
          material={material}
        >
          <boxGeometry args={[0.6, 0.7, 0.3]} />
        </mesh>

        {/* 왼쪽 팔 - 긴 블록 */}
        <group ref={leftArmRef} position={[-0.4, 1.0, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow material={material}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
          </mesh>
        </group>

        {/* 오른쪽 팔 - 긴 블록 */}
        <group ref={rightArmRef} position={[0.4, 1.0, 0]}>
          <mesh position={[0, -0.4, 0]} castShadow material={material}>
            <boxGeometry args={[0.2, 0.8, 0.2]} />
          </mesh>
        </group>

        {/* 왼쪽 다리 - 블록 */}
        <group ref={leftLegRef} position={[-0.15, 0.35, 0]}>
          <mesh position={[0, -0.5, 0]} castShadow material={material}>
            <boxGeometry args={[0.25, 1.0, 0.25]} />
          </mesh>
        </group>

        {/* 오른쪽 다리 - 블록 */}
        <group ref={rightLegRef} position={[0.15, 0.35, 0]}>
          <mesh position={[0, -0.5, 0]} castShadow material={material}>
            <boxGeometry args={[0.25, 1.0, 0.25]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
