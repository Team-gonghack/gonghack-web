// 위험도 레벨 타입
export type RiskLevel = "safe" | "warning" | "danger";

// 자세 패턴 타입
export type PosturePattern =
  | "Class 1"
  | "Class 2"
  | "Class 3"
  | "Class 4"
  | "Class 5";

// WebSocket 메시지 타입
export interface PostureData {
  pattern: PosturePattern;
  riskLevel: RiskLevel;
  timestamp: number;
  angles?: {
    neck: number;
    spine: number;
    leftShoulder: number;
    rightShoulder: number;
    leftElbow: number;
    rightElbow: number;
  };
}

// 통계 데이터 타입
export interface DailyStats {
  safe: number;
  warning: number;
  danger: number;
}

// 시간대별 위험도 데이터
export interface TimelineData {
  time: string;
  riskScore: number;
}
