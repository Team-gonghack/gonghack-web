"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { DailyStats } from "@/types";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DailyStatsChartProps {
  stats: DailyStats;
}

export function DailyStatsChart({ stats }: DailyStatsChartProps) {
  const data = {
    labels: ["안전", "주의", "경고"],
    datasets: [
      {
        data: [stats.safe, stats.warning, stats.danger],
        backgroundColor: [
          "rgba(34, 197, 94, 0.8)",
          "rgba(234, 179, 8, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#fff",
          font: {
            size: 14,
          },
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value}회 (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="h-full w-full">
      <Doughnut data={data} options={options} />
    </div>
  );
}
