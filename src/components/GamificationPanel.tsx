"use client";

import { UserProgress, Mission, LevelInfo } from "@/types";

interface GamificationPanelProps {
  progress: UserProgress;
  missions: Mission[];
}

const LEVEL_INFO: LevelInfo[] = [
  {
    level: 1,
    title: "자세 인식 초보",
    description: "자세 교정의 첫 걸음을 시작했습니다",
    minDays: 1,
    maxDays: 7,
  },
  {
    level: 2,
    title: "자세 수호자",
    description: "꾸준한 노력으로 자세가 개선되고 있습니다",
    minDays: 8,
    maxDays: 21,
  },
  {
    level: 3,
    title: "척추 마스터",
    description: "완벽한 자세 유지의 달인이 되었습니다",
    minDays: 22,
  },
];

export function GamificationPanel({
  progress,
  missions,
}: GamificationPanelProps) {
  // 걸음수 목표 (일일 10,000보)
  const dailyStepGoal = 10000;
  const stepProgress = (progress.todaySteps / dailyStepGoal) * 100;

  return (
    <div className="space-y-6">
      {/* 걸음수 카드 */}
      <div className="bg-linear-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm opacity-80 mb-1">오늘의 걸음수</div>
            <h2 className="text-4xl font-bold">
              {progress.todaySteps.toLocaleString()}
            </h2>
            <p className="text-lg mt-1">걸음</p>
          </div>
          <div className="text-right">
            <div className="text-3xl mb-1"></div>
            <div className="text-sm opacity-80">
              목표: {dailyStepGoal.toLocaleString()}보
            </div>
          </div>
        </div>

        {/* 걸음수 진행 바 */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>진행률</span>
            <span>{Math.min(Math.round(stepProgress), 100)}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-500"
              style={{ width: `${Math.min(stepProgress, 100)}%` }}
            />
          </div>
          <div className="text-sm mt-2 text-center opacity-90">
            {progress.todaySteps >= dailyStepGoal
              ? "🎉 목표 달성!"
              : `목표까지 ${(
                  dailyStepGoal - progress.todaySteps
                ).toLocaleString()}보 남음`}
          </div>
        </div>

        {/* 통계 요약 */}
        <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-1">📊</div>
            <div className="text-sm opacity-80">총 걸음수</div>
            <div className="text-lg font-bold">
              {(progress.totalSteps / 1000).toFixed(1)}K
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-sm opacity-80">연속 출석</div>
            <div className="text-lg font-bold">{progress.currentStreak}일</div>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <div className="text-sm opacity-80">바른 자세</div>
            <div className="text-lg font-bold">
              {Math.floor(progress.totalGoodPostureTime / 60)}h
            </div>
          </div>
        </div>
      </div>

      {/* 활성 미션 */}
      <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            활성 미션
          </h3>
          <span className="text-sm text-gray-400">
            {missions.filter((m) => m.completed).length}/{missions.length} 완료
          </span>
        </div>

        <div className="space-y-3">
          {missions.map((mission) => (
            <div
              key={mission.id}
              className={`p-4 rounded-lg border transition-all ${
                mission.completed
                  ? "bg-green-500/10 border-green-500/50"
                  : "bg-gray-800/50 border-gray-700 hover:border-gray-600"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">
                      {mission.title}
                    </h4>
                    {mission.completed && (
                      <span className="text-green-400">✓</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    {mission.description}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <div className="text-yellow-400 font-bold">
                    +{mission.reward}
                  </div>
                  <div className="text-xs text-gray-500">포인트</div>
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="mt-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">
                    진행률 {mission.progress}/{mission.total}
                  </span>
                  <span className="text-gray-300">
                    {Math.round((mission.progress / mission.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`rounded-full h-2 transition-all duration-500 ${
                      mission.completed
                        ? "bg-green-500"
                        : "bg-linear-to-r from-blue-500 to-purple-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (mission.progress / mission.total) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 주간 목표 */}
      <div className="bg-linear-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-blue-500/30">
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          이번 주 목표
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">주간 평균 자세 점수</span>
            <span className="text-2xl font-bold text-white">
              {progress.weeklyScore}점
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-linear-to-r from-green-500 to-blue-500 rounded-full h-3 transition-all duration-500"
              style={{ width: `${Math.min(progress.weeklyScore, 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 text-center">
            {progress.weeklyScore >= 90
              ? "🎉 목표 달성! 척추 마스터에 가까워졌습니다!"
              : `목표(90점)까지 ${90 - progress.weeklyScore}점 남았습니다`}
          </p>
        </div>
      </div>
    </div>
  );
}
