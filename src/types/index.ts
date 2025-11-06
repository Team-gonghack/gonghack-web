// 활동 상태 타입 (웨어러블 기반)
export type ActivityState = "walking" | "running" | "stopped";

// 위험도 레벨 타입 (활동 상태 기반으로 자동 계산)
export type RiskLevel = "safe" | "warning" | "danger";

// 웨어러블 디바이스 데이터
export interface WearableData {
  accuracy: number; // 0-100%
  heartRate: number; // BPM
  activityState: ActivityState;
  stepCount?: number; // 걸음수
  timestamp: number;
}

// WebSocket 메시지 타입 (웨어러블 기반)
export interface PostureData {
  activityState: ActivityState; // 활동 상태 (걷기/달리기/멈춤)
  riskLevel: RiskLevel; // 위험도
  timestamp: number;
  wearable: WearableData; // 웨어러블 데이터 (필수)
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

// 레벨 타입
export type UserLevel = 1 | 2 | 3;

// 레벨 정보
export interface LevelInfo {
  level: UserLevel;
  title: string;
  description: string;
  minDays: number;
  maxDays?: number;
}

// 미션 타입
export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
}

// 사용자 진행 상황
export interface UserProgress {
  level: UserLevel;
  points: number;
  daysActive: number;
  weeklyScore: number;
  totalGoodPostureTime: number; // 분 단위
  currentStreak: number; // 연속 일수
  totalSteps: number; // 총 걸음수
  todaySteps: number; // 오늘 걸음수
}

// 성장 인사이트
export interface GrowthInsight {
  type: "improvement" | "achievement" | "warning";
  title: string;
  message: string;
  icon: string;
}
