import { ActivityState, RiskLevel } from "@/types";

// 활동 상태에 따른 본(Bone) 각도 매핑
export function getActivityAngles(activity: ActivityState, time: number = 0) {
  const angleMap: Record<
    ActivityState,
    {
      neck: number;
      spine: number;
      leftShoulder: number;
      rightShoulder: number;
      leftElbow: number;
      rightElbow: number;
      leftLeg?: number;
      rightLeg?: number;
    }
  > = {
    stopped: {
      // 멈춤 - 바른 자세 (팔을 자연스럽게 내림)
      neck: 0,
      spine: 0,
      leftShoulder: 0,
      rightShoulder: 0,
      leftElbow: 0,
      rightElbow: 0,
      leftLeg: 0,
      rightLeg: 0,
    },
    walking: {
      // 걷기 - 자연스러운 팔다리 스윙
      neck: 0.05,
      spine: 0.05,
      // 팔은 앞뒤로 자연스럽게 흔들림 (반대로 움직임)
      leftShoulder: Math.sin(time * 2) * 0.6,
      rightShoulder: -Math.sin(time * 2) * 0.6,
      leftElbow: 0,
      rightElbow: 0,
      // 다리도 반대로 움직임 (팔과 동기화)
      leftLeg: -Math.sin(time * 2) * 0.5,
      rightLeg: Math.sin(time * 2) * 0.5,
    },
    running: {
      // 달리기 - 더 빠르고 큰 움직임
      neck: 0.1,
      spine: 0.15,
      // 팔을 더 크게 흔들림
      leftShoulder: Math.sin(time * 4) * 1.0,
      rightShoulder: -Math.sin(time * 4) * 1.0,
      leftElbow: 0,
      rightElbow: 0,
      // 다리를 더 크게 움직임
      leftLeg: -Math.sin(time * 4) * 0.8,
      rightLeg: Math.sin(time * 4) * 0.8,
    },
  };

  return angleMap[activity];
}

// 활동 상태에 따른 위험도 자동 계산
export function getRiskLevelFromActivity(
  activity: ActivityState,
  heartRate?: number
): RiskLevel {
  // 멈춤 = 멈춤
  if (activity === "stopped") return "safe";

  // 걷기 = 걷기 (심박수에 따라 조정)
  if (activity === "walking") {
    if (heartRate && heartRate > 120) return "danger";
    return "warning";
  }

  // 달리기 = 위험 (심박수가 낮으면 걷기)
  if (activity === "running") {
    if (heartRate && heartRate < 100) return "warning";
    return "danger";
  }

  return "safe";
}

// 위험도에 따른 색상 반환
export function getRiskColor(riskLevel: RiskLevel): {
  primary: string;
  glow: string;
  shadow: string;
} {
  const colorMap: Record<
    RiskLevel,
    { primary: string; glow: string; shadow: string }
  > = {
    safe: {
      primary: "#22c55e",
      glow: "rgba(34, 197, 94, 0.5)",
      shadow: "0 0 30px rgba(34, 197, 94, 0.6)",
    },
    warning: {
      primary: "#eab308",
      glow: "rgba(234, 179, 8, 0.5)",
      shadow: "0 0 30px rgba(234, 179, 8, 0.6)",
    },
    danger: {
      primary: "#ef4444",
      glow: "rgba(239, 68, 68, 0.5)",
      shadow: "0 0 30px rgba(239, 68, 68, 0.6)",
    },
  };

  return colorMap[riskLevel];
}

// 위험도에 따른 Tailwind CSS 클래스
export function getRiskClasses(riskLevel: RiskLevel): string {
  const classMap: Record<RiskLevel, string> = {
    safe: "shadow-green-500/50 border-green-500",
    warning: "shadow-yellow-500/50 border-yellow-500",
    danger: "shadow-red-500/50 border-red-500",
  };

  return classMap[riskLevel];
}
