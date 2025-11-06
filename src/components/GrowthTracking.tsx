"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { GrowthInsight } from "@/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface GrowthTrackingProps {
  weeklyScores: number[];
  monthlyScores: number[];
  insights: GrowthInsight[];
}

export function GrowthTracking({
  weeklyScores,
  monthlyScores,
  insights,
}: GrowthTrackingProps) {
  // 주간 데이터
  const weeklyData = {
    labels: ["월", "화", "수", "목", "금", "토", "일"],
    datasets: [
      {
        label: "자세 점수",
        data: weeklyScores,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  };

  // 월간 데이터
  const monthlyData = {
    labels: ["1주", "2주", "3주", "4주"],
    datasets: [
      {
        label: "주간 평균",
        data: monthlyScores,
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointHoverRadius: 8,
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
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: "rgb(156, 163, 175)",
          callback: (value: string | number) =>
            typeof value === "number" ? value + "점" : value,
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)",
        },
      },
      x: {
        ticks: {
          color: "rgb(156, 163, 175)",
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)",
        },
      },
    },
  };

  // 개선도 계산
  const weekImprovement =
    weeklyScores.length >= 2
      ? weeklyScores[weeklyScores.length - 1] - weeklyScores[0]
      : 0;

  const monthImprovement =
    monthlyScores.length >= 2
      ? monthlyScores[monthlyScores.length - 1] - monthlyScores[0]
      : 0;

  return (
    <div className="space-y-6">
      {/* 주간 점수 차트 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">주간 자세 점수</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold ${
                weekImprovement >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {weekImprovement >= 0 ? "+" : ""}
              {weekImprovement.toFixed(1)}점
            </span>
            <span className="text-sm text-gray-400">이번 주</span>
          </div>
        </div>
        <div className="h-72">
          <Line data={weeklyData} options={chartOptions} />
        </div>
      </div>

      {/* 월간 점수 차트 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">월간 평균 점수</h3>
          <div className="flex items-center gap-2">
            <span
              className={`text-lg font-bold ${
                monthImprovement >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              {monthImprovement >= 0 ? "+" : ""}
              {monthImprovement.toFixed(1)}점
            </span>
            <span className="text-sm text-gray-400">이번 달</span>
          </div>
        </div>
        <div className="h-72">
          <Line data={monthlyData} options={chartOptions} />
        </div>
      </div>

      {/* 성장 인사이트 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          AI 성장 인사이트
        </h3>
        <div className="space-y-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === "improvement"
                  ? "bg-green-500/10 border-green-500"
                  : insight.type === "achievement"
                  ? "bg-blue-500/10 border-blue-500"
                  : "bg-yellow-500/10 border-yellow-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">
                    {insight.title}
                  </h4>
                  <p className="text-sm text-gray-400">{insight.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-4 border border-blue-500/30">
          <div className="text-blue-400 text-sm font-medium mb-2">
            평균 개선도
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {weekImprovement >= 0 ? "+" : ""}
            {weekImprovement.toFixed(1)}점
          </div>
          <div className="text-sm text-gray-400">주간 평균 대비</div>
        </div>

        <div className="bg-linear-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-4 border border-purple-500/30">
          <div className="text-purple-400 text-sm font-medium mb-2">
            최고 점수
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {Math.max(...weeklyScores, 0).toFixed(0)}점
          </div>
          <div className="text-sm text-gray-400">이번 주 최고 기록</div>
        </div>

        <div className="bg-linear-to-br from-green-600/20 to-green-800/20 rounded-xl p-4 border border-green-500/30">
          <div className="text-green-400 text-sm font-medium mb-2">
            목표 달성률
          </div>
          <div className="text-3xl font-bold text-white mb-1">
            {weeklyScores.filter((s) => s >= 80).length}
            <span className="text-lg">/{weeklyScores.length}</span>
          </div>
          <div className="text-sm text-gray-400">80점 이상 달성일</div>
        </div>
      </div>

      {/* Before/After 비교 */}
      <div className="bg-linear-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl p-6 border border-indigo-500/30">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📈</span>
          Before / After
        </h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">시작 시점</div>
            <div className="text-5xl font-bold text-gray-500 mb-2">
              {weeklyScores[0]?.toFixed(0) || 0}점
            </div>
            <div className="text-sm text-gray-400">평균 자세 점수</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">현재</div>
            <div className="text-5xl font-bold text-white mb-2">
              {weeklyScores[weeklyScores.length - 1]?.toFixed(0) || 0}점
            </div>
            <div className="text-sm text-gray-400">평균 자세 점수</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-green-400 font-semibold">
            {weekImprovement >= 0
              ? `${weekImprovement.toFixed(1)}점 개선!`
              : "계속 노력하세요!"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            꾸준한 노력으로 자세가 개선되고 있습니다
          </p>
        </div>
      </div>
    </div>
  );
}
