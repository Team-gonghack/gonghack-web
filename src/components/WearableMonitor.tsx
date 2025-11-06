"use client";

import { Line } from "react-chartjs-2";
import { WearableData, ActivityState } from "@/types";
import { useState, useEffect } from "react";

interface WearableMonitorProps {
  data: WearableData | null;
  isConnected: boolean;
}

export function WearableMonitor({ data, isConnected }: WearableMonitorProps) {
  const [heartRateHistory, setHeartRateHistory] = useState<number[]>([]);
  const [timeLabels, setTimeLabels] = useState<string[]>([]);

  // 심박수 히스토리 업데이트
  useEffect(() => {
    if (data) {
      const time = new Date(data.timestamp).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setHeartRateHistory((prev) => {
        const newHistory = [...prev, data.heartRate];
        return newHistory.slice(-20); // 최근 20개만 유지
      });

      setTimeLabels((prev) => {
        const newLabels = [...prev, time];
        return newLabels.slice(-20);
      });
    }
  }, [data]);

  // 활동 상태별 정보
  const getActivityInfo = (state: ActivityState) => {
    switch (state) {
      case "walking":
        return {
          icon: "🚶",
          label: "걷기",
          color: "text-blue-400",
          bgColor: "bg-blue-500/20",
          borderColor: "border-blue-500",
        };
      case "running":
        return {
          icon: "🏃",
          label: "달리기",
          color: "text-red-400",
          bgColor: "bg-red-500/20",
          borderColor: "border-red-500",
        };
      case "stopped":
        return {
          icon: "🧍",
          label: "멈춤",
          color: "text-gray-400",
          bgColor: "bg-gray-500/20",
          borderColor: "border-gray-500",
        };
    }
  };

  const activityInfo = data
    ? getActivityInfo(data.activityState)
    : getActivityInfo("stopped");

  // 심박수 차트 데이터
  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: "심박수 (BPM)",
        data: heartRateHistory,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 200,
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: (value: string | number) =>
            typeof value === "number" ? value + " BPM" : value,
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "rgb(156, 163, 175)",
          maxTicksLimit: 10,
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)",
        },
      },
    },
  };

  // 심박수 상태 판단
  const getHeartRateStatus = (hr: number) => {
    if (hr < 60) return { status: "낮음", color: "text-blue-400" };
    if (hr < 100) return { status: "정상", color: "text-green-400" };
    if (hr < 150) return { status: "높음", color: "text-yellow-400" };
    return { status: "매우 높음", color: "text-red-400" };
  };

  const heartRateStatus = data
    ? getHeartRateStatus(data.heartRate)
    : { status: "-", color: "text-gray-400" };

  return (
    <div className="space-y-6">
      {/* 연결 상태 */}
      <div
        className={`p-4 rounded-lg border ${
          isConnected
            ? "bg-green-500/10 border-green-500"
            : "bg-gray-800/50 border-gray-700"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-gray-500"
            }`}
          />
          <div>
            <div className="font-semibold text-white">
              {isConnected ? "웨어러블 디바이스 연결됨" : "디바이스 연결 필요"}
            </div>
            <div className="text-sm text-gray-400">
              {isConnected
                ? "실시간 데이터 수신 중"
                : "블루투스로 디바이스를 연결하세요"}
            </div>
          </div>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 심박수 */}
        <div className="bg-linear-to-br from-red-600/20 to-red-800/20 rounded-xl p-6 border border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">❤️</span>
            <span className={`text-sm font-medium ${heartRateStatus.color}`}>
              {heartRateStatus.status}
            </span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">
            {data?.heartRate || "-"}
            <span className="text-xl text-gray-400 ml-2">BPM</span>
          </div>
          <div className="text-sm text-gray-400">실시간 심박수</div>
        </div>

        {/* 활동 상태 */}
        <div
          className={`bg-linear-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border ${activityInfo.borderColor}`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">{activityInfo.icon}</span>
            <span className={`text-sm font-medium ${activityInfo.color}`}>
              활동 중
            </span>
          </div>
          <div className={`text-5xl font-bold text-white mb-2`}>
            {activityInfo.label}
          </div>
          <div className="text-sm text-gray-400">현재 활동 상태</div>
        </div>

        {/* 정확도 */}
        <div className="bg-linear-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl">📊</span>
            <span
              className={`text-sm font-medium ${
                (data?.accuracy || 0) >= 80
                  ? "text-green-400"
                  : (data?.accuracy || 0) >= 60
                  ? "text-yellow-400"
                  : "text-red-400"
              }`}
            >
              {(data?.accuracy || 0) >= 80
                ? "우수"
                : (data?.accuracy || 0) >= 60
                ? "양호"
                : "불량"}
            </span>
          </div>
          <div className="text-5xl font-bold text-white mb-2">
            {data?.accuracy || "-"}
            <span className="text-xl text-gray-400 ml-2">%</span>
          </div>
          <div className="text-sm text-gray-400">자세 정확도</div>
        </div>
      </div>

      {/* 심박수 차트 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          실시간 심박수 추이
        </h3>
        <div className="h-72">
          {heartRateHistory.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              데이터를 수집 중입니다...
            </div>
          )}
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4">상세 정보</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">평균 심박수</span>
            <span className="text-white font-semibold">
              {heartRateHistory.length > 0
                ? Math.round(
                    heartRateHistory.reduce((a, b) => a + b, 0) /
                      heartRateHistory.length
                  )
                : "-"}{" "}
              BPM
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">최대 심박수</span>
            <span className="text-white font-semibold">
              {heartRateHistory.length > 0
                ? Math.max(...heartRateHistory)
                : "-"}{" "}
              BPM
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">최소 심박수</span>
            <span className="text-white font-semibold">
              {heartRateHistory.length > 0
                ? Math.min(...heartRateHistory)
                : "-"}{" "}
              BPM
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
            <span className="text-gray-400">마지막 업데이트</span>
            <span className="text-white font-semibold">
              {data
                ? new Date(data.timestamp).toLocaleTimeString("ko-KR")
                : "-"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
