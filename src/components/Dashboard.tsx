"use client";

import { useEffect, useState, useRef } from "react";
import { AvatarScene } from "./AvatarScene";
import { AnalysisReport } from "./AnalysisReport";
import { GamificationPanel } from "./GamificationPanel";
import { GrowthTracking } from "./GrowthTracking";
import { WearableMonitor } from "./WearableMonitor";
import { useBluetooth } from "@/hooks/useBluetooth";
import {
  getRiskColor,
  getRiskClasses,
  getRiskLevelFromActivity,
} from "@/utils/postureMapping";
import {
  DailyStats,
  TimelineData,
  ActivityState,
  RiskLevel,
  UserProgress,
  Mission,
  GrowthInsight,
} from "@/types";

type TabType = "monitor" | "analysis" | "gamification" | "growth" | "wearable";

export function Dashboard() {
  const {
    isConnected: isBluetoothConnected,
    isConnecting: isBluetoothConnecting,
    error: bluetoothError,
    wearableData,
    connect: connectBluetooth,
    disconnect: disconnectBluetooth,
  } = useBluetooth();
  const [activeTab, setActiveTab] = useState<TabType>("monitor");
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    safe: 0,
    warning: 0,
    danger: 0,
  });
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<string>("-");
  const [mounted, setMounted] = useState(false);

  // 게이미피케이션 데이터 (시뮬레이션)
  const [userProgress] = useState<UserProgress>({
    level: 2,
    points: 1250,
    daysActive: 15,
    weeklyScore: 82,
    totalGoodPostureTime: 450, // 7시간 30분
    currentStreak: 5,
    totalSteps: 45230, // 총 걸음수
    todaySteps: 7842, // 오늘 걸음수
  });

  const [missions] = useState<Mission[]>([
    {
      id: "1",
      title: "바른 자세로 30분 유지하기",
      description: "오늘 바른 자세를 30분 이상 유지하세요",
      progress: 22,
      total: 30,
      reward: 100,
      completed: false,
    },
    {
      id: "2",
      title: "불량 자세 3초 내 교정 5회",
      description: "달리기 발생 후 3초 안에 자세를 교정하세요",
      progress: 5,
      total: 5,
      reward: 150,
      completed: true,
    },
    {
      id: "3",
      title: "주간 평균 자세 점수 90점 달성",
      description: "이번 주 평균 점수를 90점 이상으로 달성하세요",
      progress: 82,
      total: 90,
      reward: 300,
      completed: false,
    },
  ]);

  // 성장 트래킹 데이터
  const [weeklyScores] = useState<number[]>([75, 78, 80, 79, 82, 85, 88]);
  const [monthlyScores] = useState<number[]>([72, 78, 83, 86]);
  const [growthInsights] = useState<GrowthInsight[]>([
    {
      type: "improvement",
      title: "목 각도 15° 개선!",
      message: "이번 주 평균 목 각도가 지난 주 대비 15° 개선되었습니다.",
      icon: "🎉",
    },
    {
      type: "achievement",
      title: "5일 연속 출석 달성",
      message: "꾸준한 자세 관리로 연속 출석 기록을 갱신했습니다!",
      icon: "🔥",
    },
    {
      type: "warning",
      title: "오후 3~5시 집중 관리 필요",
      message: "이 시간대에 자세가 가장 나빠지는 경향이 있습니다.",
      icon: "⚠️",
    },
  ]);

  // 현재 상태 (웨어러블 데이터 기반)
  const currentActivity: ActivityState =
    wearableData?.activityState || "stopped";
  const currentRiskLevel: RiskLevel = getRiskLevelFromActivity(
    currentActivity,
    wearableData?.heartRate
  );
  const { primary, shadow } = getRiskColor(currentRiskLevel);

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // 달리기음 초기화
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Web Audio API를 사용한 달리기음 생성
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContext) {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.frequency.value = 800;
        oscillator.type = "sine";
        gainNode.gain.value = 0;

        audioRef.current = { context, oscillator, gainNode } as any;
      }
    }
  }, []);

  // 위험 상태일 때 달리기음 재생
  useEffect(() => {
    if (currentRiskLevel === "danger") {
      if (!isAlarmPlaying && audioRef.current) {
        setIsAlarmPlaying(true);
        const { context, oscillator, gainNode } = audioRef.current as any;

        try {
          if (context.state === "suspended") {
            context.resume();
          }

          // 비프음 패턴 (빠른 반복)
          const now = context.currentTime;
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(0, now);

          for (let i = 0; i < 3; i++) {
            const startTime = now + i * 0.4;
            gainNode.gain.linearRampToValueAtTime(0.3, startTime);
            gainNode.gain.linearRampToValueAtTime(0, startTime + 0.15);
          }

          setTimeout(() => setIsAlarmPlaying(false), 1200);
        } catch (e) {
          console.error("Audio error:", e);
          setIsAlarmPlaying(false);
        }
      }
    }
  }, [currentRiskLevel, isAlarmPlaying]);

  // 웨어러블 데이터 수신 시 통계 업데이트
  useEffect(() => {
    if (wearableData) {
      // 일일 통계 업데이트
      setDailyStats((prev) => ({
        ...prev,
        [currentRiskLevel]: prev[currentRiskLevel] + 1,
      }));

      // 타임라인 데이터 업데이트 (최근 20개만 유지)
      const time = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const riskScore =
        currentRiskLevel === "safe"
          ? 30
          : currentRiskLevel === "warning"
          ? 60
          : 90;

      setTimelineData((prev) => {
        const newData = [...prev, { time, riskScore }];
        return newData.slice(-20);
      });

      // 마지막 업데이트 시간 갱신
      setLastUpdateTime(
        new Date(wearableData.timestamp).toLocaleTimeString("ko-KR")
      );
    }
  }, [wearableData, currentRiskLevel]);

  return (
    <div
      className={`h-screen overflow-hidden bg-gray-950 transition-all duration-500 flex flex-col`}
      style={{
        boxShadow: `inset 0 0 100px ${shadow}`,
      }}
    >
      {/* 헤더 */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 shrink-0">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <h1 className="text-2xl font-bold text-white">
                자세 모니터링 대시보드
              </h1>
              <p className="text-gray-400 text-sm mt-0.5">
                실시간 자세 분석 시스템
              </p>
            </div>

            {/* 연결 상태 */}
            <div className="flex items-center gap-4">
              {/* 블루투스 연결 상태 */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isBluetoothConnected ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                />
                <span className="text-sm text-gray-400">
                  {isBluetoothConnected
                    ? "Bluetooth Connected"
                    : "Bluetooth Disconnected"}
                </span>
              </div>

              {/* 블루투스 연결 버튼 */}
              <button
                onClick={
                  isBluetoothConnected ? disconnectBluetooth : connectBluetooth
                }
                disabled={isBluetoothConnecting}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2 ${
                  isBluetoothConnected
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isBluetoothConnecting
                  ? "연결 중..."
                  : isBluetoothConnected
                  ? "연결 해제하기"
                  : "웨어러블 연결"}
              </button>

              {/* 현재 활동 상태 표시 */}
              {wearableData && (
                <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                  <span className="text-sm text-gray-400">Activity: </span>
                  <span className="text-white font-semibold">
                    {currentActivity === "stopped"
                      ? "🧍 멈춤"
                      : currentActivity === "walking"
                      ? "🚶 걷기"
                      : "🏃 달리기"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex gap-2 mt-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab("monitor")}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === "monitor"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              실시간 모니터링
            </button>
            <button
              onClick={() => setActiveTab("gamification")}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === "gamification"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              레벨 & 미션
            </button>
            <button
              onClick={() => setActiveTab("growth")}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === "growth"
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              성장 트래킹
            </button>
            <button
              onClick={() => setActiveTab("wearable")}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === "wearable"
                  ? "bg-pink-600 text-white shadow-lg shadow-pink-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              웨어러블 데이터
            </button>
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-4 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap text-sm ${
                activeTab === "analysis"
                  ? "bg-orange-600 text-white shadow-lg shadow-orange-500/50"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              AI 예측 분석
            </button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-4">
          {/* 블루투스 연결 안내 */}
          {!isBluetoothConnected &&
            !isBluetoothConnecting &&
            !bluetoothError && (
              <div className="mb-3 p-3 bg-blue-500/10 border border-blue-500 rounded-lg text-blue-400 text-sm">
                <div className="flex items-center gap-2">
                  <div>
                    <strong>웨어러블 디바이스 연결:</strong> 상단의 "웨어러블
                    연결" 버튼을 클릭하여 블루투스 디바이스를 연결해주세요.
                  </div>
                </div>
              </div>
            )}

          {/* 블루투스 에러 표시 */}
          {bluetoothError && (
            <div className="mb-3 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-400 text-sm">
              <strong>블루투스 오류:</strong> {bluetoothError}
            </div>
          )}

          {/* 탭 컨텐츠 */}
          {activeTab === "wearable" ? (
            <WearableMonitor
              data={wearableData}
              isConnected={isBluetoothConnected}
            />
          ) : activeTab === "gamification" ? (
            <GamificationPanel progress={userProgress} missions={missions} />
          ) : activeTab === "growth" ? (
            <GrowthTracking
              weeklyScores={weeklyScores}
              monthlyScores={monthlyScores}
              insights={growthInsights}
            />
          ) : activeTab === "analysis" ? (
            <AnalysisReport />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* 3D 아바타 뷰 */}
              <div className="lg:col-span-2">
                <div
                  className={`bg-gray-900/50 rounded-2xl p-4 border-2 transition-all duration-500 ${getRiskClasses(
                    currentRiskLevel
                  )}`}
                  style={{ boxShadow: shadow }}
                >
                  <h2 className="text-lg font-semibold text-white mb-3">
                    디지털 트윈 - 실시간 활동
                  </h2>
                  <div className="aspect-4/3 w-full">
                    <AvatarScene
                      activityState={currentActivity}
                      riskLevel={currentRiskLevel}
                    />
                  </div>

                  {/* 위험도 인디케이터 */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          currentRiskLevel === "danger"
                            ? "animate-ping"
                            : "animate-pulse"
                        }`}
                        style={{ backgroundColor: primary }}
                      />
                      <span className="text-white font-semibold text-base">
                        {currentRiskLevel === "safe"
                          ? "멈춤"
                          : currentRiskLevel === "warning"
                          ? "걷기"
                          : "달리기"}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {mounted ? lastUpdateTime : "-"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 자세 점수 + 웨어러블 요약 */}
              <div className="space-y-4">
                <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
                  <h2 className="text-lg font-semibold text-white mb-3">
                    자세 점수
                  </h2>
                  <div className="flex flex-col items-center justify-center py-4">
                    {/* 점수 표시 */}
                    <div className="flex items-baseline gap-1">
                      <div className="text-6xl font-bold text-white">
                        {userProgress.weeklyScore}
                      </div>
                      <div className="text-2xl font-medium text-gray-400 pb-1">
                        / 100
                      </div>
                    </div>

                    {/* 점수 게이지 */}
                    <div className="w-full mt-5">
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 rounded-full"
                          style={{
                            width: `${userProgress.weeklyScore}%`,
                            background:
                              userProgress.weeklyScore >= 90
                                ? "linear-gradient(90deg, #22c55e, #16a34a)"
                                : userProgress.weeklyScore >= 70
                                ? "linear-gradient(90deg, #eab308, #ca8a04)"
                                : "linear-gradient(90deg, #ef4444, #dc2626)",
                          }}
                        />
                      </div>
                    </div>

                    {/* 등급 표시 */}
                    <div className="mt-3 text-center">
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          userProgress.weeklyScore >= 90
                            ? "bg-green-500/20 text-green-400 border border-green-500/50"
                            : userProgress.weeklyScore >= 70
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                            : "bg-red-500/20 text-red-400 border border-red-500/50"
                        }`}
                      >
                        {userProgress.weeklyScore >= 90
                          ? "🏆 우수"
                          : userProgress.weeklyScore >= 70
                          ? "⭐ 양호"
                          : "⚠️ 주의"}
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        이번 주 평균 자세 점수
                      </p>
                    </div>
                  </div>
                </div>

                {/* 웨어러블 요약 */}
                {wearableData && (
                  <div className="bg-gray-900/50 rounded-2xl p-4 border border-gray-800">
                    <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <span>📱</span>
                      웨어러블 데이터
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 text-sm">❤️</span>
                          <span className="text-gray-400 text-sm">심박수</span>
                        </div>
                        <span className="text-lg font-bold text-white">
                          {wearableData.heartRate} BPM
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {wearableData.activityState === "walking"
                              ? "🚶"
                              : wearableData.activityState === "running"
                              ? "🏃"
                              : "🧍"}
                          </span>
                          <span className="text-gray-400 text-sm">활동</span>
                        </div>
                        <span className="text-base font-semibold text-white">
                          {wearableData.activityState === "walking"
                            ? "걷기"
                            : wearableData.activityState === "running"
                            ? "달리기"
                            : "멈춤"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">📊</span>
                          <span className="text-gray-400 text-sm">정확도</span>
                        </div>
                        <span className="text-base font-semibold text-white">
                          {wearableData.accuracy}%
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
