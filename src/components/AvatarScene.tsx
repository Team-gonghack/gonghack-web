"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { PosturePattern, RiskLevel } from "@/types";
import { getRiskColor } from "@/utils/postureMapping";

interface AvatarSceneProps {
  pattern: PosturePattern;
  riskLevel: RiskLevel;
}

export function AvatarScene({ pattern, riskLevel }: AvatarSceneProps) {
  const { primary } = getRiskColor(riskLevel);
  const controlsRef = useRef<any>(null);

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden bg-linear-to-br from-gray-900 to-gray-800">
      {/* 시점 초기화 버튼 */}
      <button
        onClick={handleResetView}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 text-white rounded-lg backdrop-blur-sm border border-gray-600 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        title="시점 초기화"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm font-medium">시점 초기화</span>
      </button>

      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 1, 4]} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          maxPolarAngle={Math.PI / 2}
        />

        {/* 그리드 바닥 */}
        <gridHelper args={[10, 10, primary, "gray"]} position={[0, -1, 0]} />

        {/* 3D 아바타 */}
        <Avatar pattern={pattern} riskColor={primary} />

        {/* 배경 안개 효과 */}
        <fog attach="fog" args={[primary, 5, 15]} />
      </Canvas>
    </div>
  );
}
