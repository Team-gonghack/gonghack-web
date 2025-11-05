import { PosturePattern, RiskLevel } from "@/types";

// 자세 패턴에 따른 본(Bone) 각도 매핑
export function getPostureAngles(pattern: PosturePattern) {
  const angleMap: Record<
    PosturePattern,
    {
      neck: number;
      spine: number;
      leftShoulder: number;
      rightShoulder: number;
      leftElbow: number;
      rightElbow: number;
    }
  > = {
    "Class 1": {
      neck: 0,
      spine: 0,
      leftShoulder: -0.3,
      rightShoulder: 0.3,
      leftElbow: -1.5,
      rightElbow: 1.5,
    },
    "Class 2": {
      neck: 0.3,
      spine: 0.2,
      leftShoulder: -0.5,
      rightShoulder: 0.5,
      leftElbow: -1.8,
      rightElbow: 1.8,
    },
    "Class 3": {
      neck: 0.5,
      spine: 0.4,
      leftShoulder: -0.7,
      rightShoulder: 0.7,
      leftElbow: -2.0,
      rightElbow: 2.0,
    },
    "Class 4": {
      neck: 0.7,
      spine: 0.6,
      leftShoulder: -0.9,
      rightShoulder: 0.9,
      leftElbow: -2.2,
      rightElbow: 2.2,
    },
    "Class 5": {
      neck: 1.0,
      spine: 0.8,
      leftShoulder: -1.1,
      rightShoulder: 1.1,
      leftElbow: -2.5,
      rightElbow: 2.5,
    },
  };

  return angleMap[pattern];
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
