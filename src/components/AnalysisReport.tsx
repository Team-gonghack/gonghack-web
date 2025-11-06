"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SessionData {
  period: string;
  corrections: number;
  duration: number; // 분 단위
}

export function AnalysisReport() {
  // 시뮬레이션 데이터: 가장 최근 연결 세션의 시간대별 자세 교정 필요 횟수
  const sessionData: SessionData[] = useMemo(
    () => [
      { period: "0-10분", corrections: 3, duration: 10 },
      { period: "10-20분", corrections: 5, duration: 10 },
      { period: "20-30분", corrections: 7, duration: 10 },
      { period: "30-40분", corrections: 9, duration: 10 },
      { period: "40-50분", corrections: 11, duration: 10 },
      { period: "50-60분", corrections: 8, duration: 10 },
    ],
    []
  );

  const totalCorrections = sessionData.reduce(
    (sum, d) => sum + d.corrections,
    0
  );
  const totalDuration = sessionData.reduce((sum, d) => sum + d.duration, 0);
  const avgCorrectionsPerPeriod = (
    totalCorrections / sessionData.length
  ).toFixed(1);
  const correctionsPerHour = ((totalCorrections / totalDuration) * 60).toFixed(
    1
  );
  const peakPeriod = sessionData.reduce((max, d) =>
    d.corrections > max.corrections ? d : max
  );

  const chartData = {
    labels: sessionData.map((d) => d.period),
    datasets: [
      {
        label: "자세 교정 필요 횟수",
        data: sessionData.map((d) => d.corrections),
        backgroundColor: sessionData.map((d) =>
          d.corrections >= 20
            ? "rgba(239, 68, 68, 0.8)"
            : d.corrections >= 12
            ? "rgba(234, 179, 8, 0.8)"
            : "rgba(34, 197, 94, 0.8)"
        ),
        borderColor: sessionData.map((d) =>
          d.corrections >= 20
            ? "rgb(239, 68, 68)"
            : d.corrections >= 12
            ? "rgb(234, 179, 8)"
            : "rgb(34, 197, 94)"
        ),
        borderWidth: 2,
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
      title: {
        display: true,
        text: "최근 연결 세션 (60분) - 시간대별 자세 교정 필요 횟수",
        color: "rgb(243, 244, 246)",
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "rgb(156, 163, 175)",
          stepSize: 5,
        },
        grid: {
          color: "rgba(75, 85, 99, 0.3)",
        },
        title: {
          display: true,
          text: "교정 횟수",
          color: "rgb(156, 163, 175)",
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

  // AI 예측 분석
  const predictions = [
    {
      time: "40-50분 구간",
      risk: "danger",
      message: "가장 높은 교정 필요",
      confidence: 92,
      description: `최근 세션에서 ${peakPeriod.period} 구간에 ${peakPeriod.corrections}회로 가장 많은 교정이 필요했습니다. 장시간 사용 시 피로도가 누적되는 패턴입니다.`,
    },
    {
      time: "30분 이후",
      risk: "warning",
      message: "교정 빈도 증가 추세",
      confidence: 88,
      description:
        "30분 이후부터 교정 필요 횟수가 급증합니다. 30분마다 스트레칭을 권장합니다.",
    },
    {
      time: "세션 초반 (0-20분)",
      risk: "safe",
      message: "양호한 자세 유지",
      confidence: 85,
      description:
        "세션 시작 후 20분까지는 비교적 좋은 자세를 유지하고 있습니다.",
    },
  ];

  // 주요 인사이트
  const insights = [
    {
      icon: "⚠️",
      title: "세션 총 교정 횟수",
      value: `${totalCorrections}회`,
      description: "최근 연결 세션에서 자세 교정이 필요했던 총 횟수입니다.",
      color: "text-red-400",
    },
    {
      icon: "⏱️",
      title: "세션 지속 시간",
      value: `${totalDuration}분`,
      description: "가장 최근에 디바이스가 연결되어 있던 시간입니다.",
      color: "text-blue-400",
    },
    {
      icon: "📊",
      title: "10분당 평균 교정",
      value: `${avgCorrectionsPerPeriod}회`,
      description: "10분마다 평균적으로 자세 교정이 필요한 횟수입니다.",
      color: "text-yellow-400",
    },
    {
      icon: "🎯",
      title: "시간당 교정 빈도",
      value: `${correctionsPerHour}회/시간`,
      description: "이 세션의 시간당 평균 교정 필요 횟수입니다.",
      color: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 차트 섹션 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="h-96">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 주요 인사이트 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 hover:border-gray-700 transition-all"
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{insight.icon}</span>
              <div className="flex-1">
                <div className="text-sm text-gray-400 mb-1">
                  {insight.title}
                </div>
                <div className={`text-2xl font-bold ${insight.color} mb-2`}>
                  {insight.value}
                </div>
                <div className="text-xs text-gray-500">
                  {insight.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI 예측 가이드 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <svg
            className="w-6 h-6 text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-white">
            AI 예측 및 권장 사항
          </h2>
        </div>

        <div className="space-y-4">
          {predictions.map((prediction, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                prediction.risk === "safe"
                  ? "bg-green-500/10 border-green-500"
                  : prediction.risk === "warning"
                  ? "bg-yellow-500/10 border-yellow-500"
                  : "bg-red-500/10 border-red-500"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">
                    {prediction.time}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      prediction.risk === "safe"
                        ? "bg-green-500/20 text-green-300"
                        : prediction.risk === "warning"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {prediction.message}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">신뢰도</div>
                  <div className="text-lg font-bold text-white">
                    {prediction.confidence}%
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-400">{prediction.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-400 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <div className="text-sm font-semibold text-blue-300 mb-1">
                AI 권장 사항
              </div>
              <div className="text-sm text-gray-300">
                최근 세션 분석 결과, 30분 이후 교정 빈도가 크게 증가했습니다.
                30분마다 3-5분의 스트레칭 휴식을 취하면 교정 횟수를 평균 35%
                줄일 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
