"use client";

import { useEffect, useState } from "react";
import { AvatarScene } from "./AvatarScene";
import { DailyStatsChart } from "./DailyStatsChart";
import { TimelineChart } from "./TimelineChart";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getRiskColor, getRiskClasses } from "@/utils/postureMapping";
import { DailyStats, TimelineData, PosturePattern, RiskLevel } from "@/types";

// WebSocket URL (환경변수로 설정 가능)
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8080";

export function Dashboard() {
  const { data, isConnected, error } = useWebSocket(WS_URL);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    safe: 0,
    warning: 0,
    danger: 0,
  });
  const [timelineData, setTimelineData] = useState<TimelineData[]>([]);

  // 현재 상태
  const currentPattern: PosturePattern = data?.pattern || "Class 1";
  const currentRiskLevel: RiskLevel = data?.riskLevel || "safe";
  const { primary, shadow } = getRiskColor(currentRiskLevel);

  // 데이터 수신 시 통계 업데이트
  useEffect(() => {
    if (data) {
      // 일일 통계 업데이트
      setDailyStats((prev) => ({
        ...prev,
        [data.riskLevel]: prev[data.riskLevel] + 1,
      }));

      // 타임라인 데이터 업데이트 (최근 20개만 유지)
      const time = new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const riskScore =
        data.riskLevel === "safe" ? 30 : data.riskLevel === "warning" ? 60 : 90;

      setTimelineData((prev) => {
        const newData = [...prev, { time, riskScore }];
        return newData.slice(-20);
      });
    }
  }, [data]);

  return (
    <div
      className={`min-h-screen bg-gray-950 transition-all duration-500`}
      style={{
        boxShadow: `inset 0 0 100px ${shadow}`,
      }}
    >
      {/* 헤더 */}
      <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                자세 모니터링 대시보드
              </h1>
              <p className="text-gray-400 mt-1">실시간 환자 자세 분석 시스템</p>
            </div>

            {/* 연결 상태 */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                  } animate-pulse`}
                />
                <span className="text-sm text-gray-400">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {/* 현재 패턴 표시 */}
              <div className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700">
                <span className="text-sm text-gray-400">Pattern: </span>
                <span className="text-white font-semibold">
                  {currentPattern}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="container mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 3D 아바타 뷰 */}
          <div className="lg:col-span-2">
            <div
              className={`bg-gray-900/50 rounded-2xl p-6 border-2 transition-all duration-500 ${getRiskClasses(
                currentRiskLevel
              )}`}
              style={{ boxShadow: shadow }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">
                디지털 트윈 - 실시간 자세
              </h2>
              <div className="aspect-4/3 w-full">
                <AvatarScene
                  pattern={currentPattern}
                  riskLevel={currentRiskLevel}
                />
              </div>

              {/* 위험도 인디케이터 */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ backgroundColor: primary }}
                  />
                  <span className="text-white font-semibold">
                    {currentRiskLevel === "safe"
                      ? "안전"
                      : currentRiskLevel === "warning"
                      ? "주의"
                      : "경고"}
                  </span>
                </div>
                <div className="text-sm text-gray-400">
                  마지막 업데이트:{" "}
                  {data
                    ? new Date(data.timestamp).toLocaleTimeString("ko-KR")
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* 일일 자세 통계 */}
          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              일일 자세 통계
            </h2>
            <div className="h-64">
              <DailyStatsChart stats={dailyStats} />
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">총 측정 횟수:</span>
                <span className="text-white font-semibold">
                  {dailyStats.safe + dailyStats.warning + dailyStats.danger}회
                </span>
              </div>
            </div>
          </div>

          {/* 시간대별 위험도 */}
          <div className="lg:col-span-3 bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold text-white mb-4">
              시간대별 위험도 추이
            </h2>
            <div className="h-72">
              <TimelineChart data={timelineData} />
            </div>
          </div>

          {/* 통계 카드들 */}
          <div className="bg-linear-to-br from-green-500/20 to-green-600/20 rounded-2xl p-6 border border-green-500/50">
            <div className="text-green-400 text-sm font-medium mb-2">안전</div>
            <div className="text-4xl font-bold text-white">
              {dailyStats.safe}
            </div>
            <div className="text-sm text-gray-400 mt-2">정상 자세 유지</div>
          </div>

          <div className="bg-linear-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl p-6 border border-yellow-500/50">
            <div className="text-yellow-400 text-sm font-medium mb-2">주의</div>
            <div className="text-4xl font-bold text-white">
              {dailyStats.warning}
            </div>
            <div className="text-sm text-gray-400 mt-2">자세 교정 필요</div>
          </div>

          <div className="bg-linear-to-br from-red-500/20 to-red-600/20 rounded-2xl p-6 border border-red-500/50">
            <div className="text-red-400 text-sm font-medium mb-2">경고</div>
            <div className="text-4xl font-bold text-white">
              {dailyStats.danger}
            </div>
            <div className="text-sm text-gray-400 mt-2">즉시 조치 필요</div>
          </div>
        </div>
      </main>
    </div>
  );
}
