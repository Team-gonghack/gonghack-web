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
  ChartOptions,
} from "chart.js";
import { TimelineData } from "@/types";

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

interface TimelineChartProps {
  data: TimelineData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  const chartData = {
    labels: data.map((item) => item.time),
    datasets: [
      {
        label: "위험도 점수",
        data: data.map((item) => item.riskScore),
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0, // 직선으로 변경 (애니메이션 같은 곡선 제거)
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: "rgb(99, 102, 241)",
        pointBorderColor: "#fff",
        pointBorderWidth: 1.5,
        borderWidth: 2,
        stepped: false, // 계단식이 아닌 직선 연결
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // 애니메이션 완전 제거
    transitions: {
      active: {
        animation: {
          duration: 0,
        },
      },
    },
    scales: {
      x: {
        type: "category",
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
          drawOnChartArea: true,
        },
        ticks: {
          color: "#9ca3af",
          maxRotation: 45,
          minRotation: 0,
          font: {
            size: 11,
          },
        },
        title: {
          display: true,
          text: "시간",
          color: "#d1d5db",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#9ca3af",
          stepSize: 20,
          callback: function (value) {
            return value + "점";
          },
        },
        title: {
          display: true,
          text: "위험도",
          color: "#d1d5db",
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: "bold",
        },
        bodyFont: {
          size: 12,
        },
        callbacks: {
          label: function (context) {
            const score = context.parsed.y;
            if (score === null || score === undefined) return "";
            let level = "안전";
            if (score >= 70) level = "경고";
            else if (score >= 40) level = "주의";
            return `위험도: ${score}점 (${level})`;
          },
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="h-full w-full">
      <Line data={chartData} options={options} />
    </div>
  );
}
