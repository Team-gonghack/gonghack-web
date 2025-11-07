interface SessionData {
  period: string;
  corrections: number;
  duration: number;
}

const SESSION_STORAGE_KEY = "recentSessionData";

/**
 * 세션 스토리지에 최근 연결 세션 데이터 저장
 */
export function saveSessionData(data: SessionData[]): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
      console.log("✅ 세션 데이터 저장 완료");
    } catch (error) {
      console.error("❌ 세션 데이터 저장 실패:", error);
    }
  }
}

/**
 * 세션 스토리지에서 최근 연결 세션 데이터 불러오기
 */
export function loadSessionData(): SessionData[] | null {
  if (typeof window !== "undefined") {
    try {
      const storedData = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error("❌ 세션 데이터 불러오기 실패:", error);
    }
  }
  return null;
}

/**
 * 특정 시간대의 교정 횟수 업데이트
 */
export function updateSessionCorrections(
  periodIndex: number,
  corrections: number
): void {
  const data = loadSessionData();
  if (data && data[periodIndex]) {
    data[periodIndex].corrections = corrections;
    saveSessionData(data);
  }
}

/**
 * 세션 데이터 초기화
 */
export function clearSessionData(): void {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
    console.log("🗑️ 세션 데이터 초기화 완료");
  }
}

/**
 * 기본 세션 데이터 생성
 */
export function createDefaultSessionData(): SessionData[] {
  return [
    { period: "0-10분", corrections: 5, duration: 10 },
    { period: "10-20분", corrections: 0, duration: 10 },
    { period: "20-30분", corrections: 1, duration: 10 },
    { period: "30-40분", corrections: 2, duration: 10 },
    { period: "40-50분", corrections: 4, duration: 10 },
    { period: "50-60분", corrections: 4, duration: 10 },
  ];
}
