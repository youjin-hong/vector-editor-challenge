# VectoR — Interactive Vector Editor

브라우저 기반 인터랙티브 벡터 에디터. 캔버스 위에서 점(Point)과 다각형(Polygon)을 생성·이동·삭제하고, 모든 액션에 대해 Undo/Redo를 수행할 수 있습니다.

## 개발 환경

- **Node.js**: v24.11.1
- **패키지 관리자**: pnpm
- **잠금 파일**: pnpm-lock.yaml

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite
- Zustand (상태 관리)
- Vitest + React Testing Library (테스트)
- Tailwind CSS
- Lucide React (아이콘)
- SVG 기반 렌더링

## Getting Started

```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm dev

# 프로덕션 빌드
pnpm build

# 단위/통합 테스트 실행
pnpm test

# 테스트 watch 모드
pnpm test:watch

# E2E 테스트 실행 (Playwright)
pnpm test:e2e
```

## Architecture

Feature-Sliced Design (FSD) 아키텍처를 적용했습니다.

```
src/
├── app/          # 앱 진입점, 글로벌 스타일, Zustand 스토어
├── pages/        # 페이지 컴포넌트
├── widgets/      # 독립 UI 블록 (Toolbar, Canvas, StatusBar)
├── features/     # 사용자 액션 (create-shape, move-shape, delete-shape, history)
├── entities/     # 비즈니스 엔티티 (shape 타입, geometry 유틸)
└── shared/       # 공용 유틸, 상수, 타입
```

**Import 규칙**: `shared → entities → features → widgets → pages → app`

## Features

### 모드

| 모드 | 설명 | 단축키 |
|------|------|--------|
| Point | 캔버스 클릭으로 점 생성 | `1` |
| Polygon | 꼭짓점 클릭 후 Complete로 다각형 생성 (최소 3점) | `2` |
| Move | 드래그로 도형 이동 | `3` |
| Delete | 클릭으로 도형 삭제 | `4` |

### Undo/Redo

Command Pattern 기반 히스토리 시스템으로, 생성·이동·삭제 모든 액션에 대해 Undo/Redo를 지원합니다.

- `Ctrl+Z` — Undo
- `Ctrl+Shift+Z` — Redo

### 키보드 단축키

| Key | Action |
|-----|--------|
| `1` | Point Mode |
| `2` | Polygon Mode |
| `3` | Move Mode |
| `4` | Delete Mode |
| `Enter` | Polygon Complete |
| `Escape` | 현재 작업 취소 |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |

## Design Decisions

### Command Pattern

모든 사용자 액션을 Command 객체로 래핑하여 execute/undo 대칭성을 보장합니다.

- `CreatePointCommand` — 점 생성/삭제
- `CreatePolygonCommand` — 다각형 생성/삭제
- `MoveShapeCommand` — 위치 변경/복원
- `DeleteShapeCommand` — 삭제/복원

### HistoryManager

undo/redo 스택을 관리하는 클래스입니다. Undo 후 새 액션 수행 시 redo 스택을 클리어합니다.

### Zustand Store

단일 스토어에서 shapes, mode, pendingVertices 등 모든 에디터 상태를 관리합니다. 컴포넌트에서 필요한 상태만 선택적으로 구독합니다.

## Tests

```bash
# 단위/통합 테스트 (Vitest)
pnpm test

# E2E 테스트 (Playwright)
pnpm test:e2e
```

### 단위/통합 테스트 (Vitest + React Testing Library)
- **geometry 유틸**: 히트 테스트, Ray Casting, 중심점 계산 등
- **HistoryManager**: undo/redo 스택 관리, 엣지 케이스
- **Command 클래스들**: execute/undo 대칭성 검증
- **Zustand 스토어**: 상태 변경, 모드 전환, 폴리곤 완성 로직
- **컴포넌트**: Toolbar, StatusBar, Canvas, PointRenderer, PolygonRenderer
- **키보드 단축키**: 모드 전환, Undo/Redo, Polygon Complete/Cancel

### E2E 테스트 (Playwright)
- Point/Polygon 생성 플로우
- 드래그 이동, 삭제
- Undo/Redo 전체 흐름
- 키보드 단축키
- 복합 시나리오 (생성 → 이동 → 삭제 → Undo 체인)
