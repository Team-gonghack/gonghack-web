# 자세 모니터링 대시보드

실시간 환자 자세 모니터링을 위한 3D 디지털 트윈 대시보드입니다.

## 🎯 주요 기능

### 1. 3D 아바타 시각화 (Three.js)

- **React Three Fiber**를 사용한 실시간 3D 렌더링
- 자세 패턴(Class 1~5)에 따른 본(Bone) 각도 자동 조정
- 부드러운 애니메이션 전환 (React Spring)
- 인터랙티브한 카메라 컨트롤

### 2. 실시간 WebSocket 통신

- 백엔드 AI 서버와 실시간 데이터 동기화
- 자동 재연결 기능
- 패턴 및 위험도 실시간 업데이트

### 3. 직관적 UI/UX

- **위험도별 Glow 효과**
  - 🟢 녹색 (안전): 정상 자세
  - 🟡 노란색 (주의): 자세 교정 필요
  - 🔴 빨간색 (경고): 즉시 조치 필요
- 다크 테마 기반 현대적 디자인
- 반응형 레이아웃 (모바일/태블릿/데스크톱)

### 4. 데이터 시각화 (Chart.js)

- **일일 자세 통계** (도넛 차트)
  - 안전/주의/경고 분포 비율
  - 실시간 통계 누적
- **시간대별 위험도** (라인 차트)
  - 위험도 점수 추이 그래프
  - 최근 20개 데이터 포인트 표시

## 🛠 기술 스택

- **Frontend Framework**: Next.js 16 (App Router)
- **3D Rendering**: Three.js + React Three Fiber + @react-three/drei
- **Animation**: React Spring
- **Charts**: Chart.js + react-chartjs-2
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript
- **Real-time**: WebSocket

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 WebSocket 서버 URL을 설정합니다:

```env
NEXT_PUBLIC_WS_URL=ws://your-backend-server:8080
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

### 4. 프로덕션 빌드

```bash
npm run build
npm start
```

## 📡 WebSocket 데이터 형식

백엔드에서 다음 형식으로 데이터를 전송해야 합니다:

```json
{
  "pattern": "Class 2",
  "riskLevel": "warning",
  "timestamp": 1699123456789,
  "angles": {
    "neck": 0.3,
    "spine": 0.2,
    "leftShoulder": -0.5,
    "rightShoulder": 0.5,
    "leftElbow": -1.8,
    "rightElbow": 1.8
  }
}
```

### 데이터 필드 설명

- `pattern`: 자세 패턴 ("Class 1" ~ "Class 5")
- `riskLevel`: 위험도 레벨 ("safe" | "warning" | "danger")
- `timestamp`: 타임스탬프 (밀리초)
- `angles`: (선택사항) 각 관절의 각도 (라디안)

## 🎨 커스터마이징

### 자세 패턴 각도 수정

`src/utils/postureMapping.ts` 파일에서 각 패턴별 본 각도를 조정할 수 있습니다:

```typescript
export function getPostureAngles(pattern: PosturePattern) {
  const angleMap: Record<PosturePattern, {...}> = {
    'Class 1': {
      neck: 0,
      spine: 0,
      // ... 각도 조정
    },
    // ...
  };
}
```

### 위험도 색상 변경

`src/utils/postureMapping.ts`에서 위험도별 색상을 변경할 수 있습니다:

```typescript
export function getRiskColor(riskLevel: RiskLevel) {
  const colorMap: Record<RiskLevel, {...}> = {
    safe: {
      primary: '#22c55e',  // 원하는 색상으로 변경
      // ...
    },
    // ...
  };
}
```

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 메인 페이지
│   ├── layout.tsx        # 레이아웃
│   └── globals.css       # 전역 스타일
├── components/
│   ├── Avatar.tsx        # 3D 아바타 모델
│   ├── AvatarScene.tsx   # 3D 씬 설정
│   ├── Dashboard.tsx     # 메인 대시보드
│   ├── DailyStatsChart.tsx   # 일일 통계 차트
│   └── TimelineChart.tsx     # 타임라인 차트
├── hooks/
│   └── useWebSocket.ts   # WebSocket 훅
├── types/
│   └── index.ts          # TypeScript 타입 정의
└── utils/
    └── postureMapping.ts # 자세 매핑 유틸리티
```

## 🔧 개발 팁

### WebSocket 테스트

로컬에서 테스트하려면 간단한 WebSocket 서버를 만들 수 있습니다:

```javascript
// test-server.js
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("Client connected");

  // 2초마다 랜덤 데이터 전송
  const interval = setInterval(() => {
    const patterns = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5"];
    const risks = ["safe", "warning", "danger"];

    const data = {
      pattern: patterns[Math.floor(Math.random() * patterns.length)],
      riskLevel: risks[Math.floor(Math.random() * risks.length)],
      timestamp: Date.now(),
    };

    ws.send(JSON.stringify(data));
  }, 2000);

  ws.on("close", () => {
    clearInterval(interval);
    console.log("Client disconnected");
  });
});

console.log("WebSocket server running on ws://localhost:8080");
```

실행:

```bash
node test-server.js
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
