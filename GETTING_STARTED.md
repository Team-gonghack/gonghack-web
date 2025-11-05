# 🚀 시작 가이드

## 1️⃣ 개발 환경 실행

### 방법 1: 테스트 WebSocket 서버와 함께 실행 (권장)

터미널을 2개 열어서 다음 명령어를 각각 실행합니다:

**터미널 1 - WebSocket 테스트 서버**

```bash
npm run ws:test
```

**터미널 2 - Next.js 개발 서버**

```bash
npm run dev
```

브라우저에서 http://localhost:3000 을 열면 실시간으로 랜덤 자세 데이터가 표시됩니다!

### 방법 2: 실제 백엔드 서버 연결

1. `.env.local` 파일을 수정하여 실제 WebSocket 서버 URL로 변경:

```env
NEXT_PUBLIC_WS_URL=ws://your-backend-server:port
```

2. Next.js 개발 서버 실행:

```bash
npm run dev
```

## 2️⃣ 프로젝트 구조 이해

```
gonghack-web/
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # 메인 페이지 (Dashboard 렌더링)
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 전역 스타일
│   │
│   ├── components/            # React 컴포넌트
│   │   ├── Avatar.tsx         # 3D 인체 아바타 모델
│   │   ├── AvatarScene.tsx    # Three.js 씬 설정
│   │   ├── Dashboard.tsx      # 메인 대시보드 컨테이너
│   │   ├── DailyStatsChart.tsx    # 도넛 차트 (일일 통계)
│   │   └── TimelineChart.tsx      # 라인 차트 (시간대별)
│   │
│   ├── hooks/                 # Custom React Hooks
│   │   └── useWebSocket.ts    # WebSocket 연결 관리
│   │
│   ├── types/                 # TypeScript 타입 정의
│   │   └── index.ts           # 공통 타입들
│   │
│   └── utils/                 # 유틸리티 함수
│       └── postureMapping.ts  # 자세 패턴 → 3D 각도 매핑
│
├── test-server.js             # WebSocket 테스트 서버
├── .env.local                 # 환경 변수 (gitignore됨)
└── package.json               # 의존성 및 스크립트
```

## 3️⃣ 핵심 기능 상세

### 🎭 3D 아바타 (`Avatar.tsx`)

- Three.js 메쉬로 인체 구성 (머리, 목, 몸통, 팔, 다리)
- React Spring을 사용한 부드러운 애니메이션
- 자세 패턴에 따라 자동으로 본(Bone) 각도 조정
- 호흡 효과로 자연스러운 움직임 구현

### 🌐 WebSocket 연결 (`useWebSocket.ts`)

- 자동 재연결 로직 (5초 후)
- 연결 상태 관리 (connected/disconnected)
- 에러 핸들링
- 실시간 데이터 파싱

### 📊 차트 시각화

- **DailyStatsChart**: 안전/주의/경고 비율을 도넛 차트로 표시
- **TimelineChart**: 시간에 따른 위험도 점수 추이

### 🎨 Glow 효과

- 위험도에 따라 전체 대시보드에 동적 그림자 효과 적용
- CSS box-shadow를 통한 부드러운 전환

## 4️⃣ 커스터마이징 예제

### 자세 패턴 추가하기

1. `src/types/index.ts`에 새로운 패턴 추가:

```typescript
export type PosturePattern =
  | "Class 1"
  | "Class 2"
  | "Class 3"
  | "Class 4"
  | "Class 5"
  | "Class 6";
```

2. `src/utils/postureMapping.ts`에 각도 매핑 추가:

```typescript
'Class 6': {
  neck: 1.2,
  spine: 1.0,
  leftShoulder: -1.3,
  rightShoulder: 1.3,
  leftElbow: -2.7,
  rightElbow: 2.7,
}
```

### 새로운 위험도 레벨 추가

1. `src/types/index.ts`:

```typescript
export type RiskLevel = "safe" | "warning" | "danger" | "critical";
```

2. `src/utils/postureMapping.ts`에 색상 추가:

```typescript
critical: {
  primary: '#dc2626',
  glow: 'rgba(220, 38, 38, 0.5)',
  shadow: '0 0 40px rgba(220, 38, 38, 0.8)',
}
```

### 3D 아바타 외형 변경

`Avatar.tsx`에서 geometry 크기 조정:

```typescript
<sphereGeometry args={[0.3, 32, 32]} /> // 머리 크기 증가
<boxGeometry args={[0.6, 1.2, 0.4]} />  // 몸통 크기 증가
```

## 5️⃣ 배포하기

### Vercel (권장)

```bash
npm run build
vercel deploy
```

환경 변수 설정:

- Vercel 대시보드에서 `NEXT_PUBLIC_WS_URL` 추가

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 6️⃣ 문제 해결

### WebSocket 연결 실패

- `.env.local` 파일이 올바르게 설정되었는지 확인
- 백엔드 서버가 실행 중인지 확인
- CORS 설정 확인

### 3D 렌더링이 안 됨

- 브라우저가 WebGL을 지원하는지 확인
- GPU 드라이버 업데이트

### 차트가 표시 안 됨

- 데이터가 수신되고 있는지 개발자 도구 콘솔에서 확인
- Chart.js 버전 호환성 확인

## 7️⃣ 성능 최적화 팁

1. **Production 빌드 사용**

   ```bash
   npm run build && npm start
   ```

2. **3D 모델 최적화**

   - geometry의 segment 수 줄이기
   - 불필요한 조명 제거

3. **WebSocket 데이터 throttling**

   - 백엔드에서 전송 빈도 조절 (권장: 1~2초 간격)

4. **차트 데이터 제한**
   - TimelineChart는 최근 20개만 유지하도록 설정됨

## 📚 추가 학습 자료

- [React Three Fiber 공식 문서](https://docs.pmnd.rs/react-three-fiber)
- [Three.js 기초](https://threejs.org/docs/)
- [Chart.js 문서](https://www.chartjs.org/docs/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

## 🎉 완료!

이제 실시간 자세 모니터링 대시보드가 완성되었습니다!
질문이 있으시면 이슈를 생성해주세요.
