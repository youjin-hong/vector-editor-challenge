# Vector Editor — Three.js 리팩토링 프로젝트

## 프로젝트 개요

기존 SVG 기반 2D 벡터 에디터를 Three.js 기반 3D Point Cloud 에디터로 확장하는 리팩토링 프로젝트.
네이버랩스 Data Platform 프론트엔드 인턴 면접 발표용.

## 기술 스택

- React 19 + TypeScript (strict mode)
- Vite 6
- Zustand 5 (상태 관리)
- Three.js + @react-three/fiber + @react-three/drei (3D 렌더링)
- Tailwind CSS 4
- Vitest 3 + React Testing Library (테스트)
- Lucide React (아이콘)

## 아키텍처: Feature-Sliced Design (FSD)

```
src/
├── app/          # 앱 진입점, 글로벌 스타일, Zustand 스토어
├── pages/        # 페이지 컴포넌트
├── widgets/      # 독립 UI 블록 (Toolbar, Canvas, ThreeCanvas, StatusBar)
├── features/     # 사용자 액션 (create-shape, move-shape, delete-shape, history)
├── entities/     # 비즈니스 엔티티 (shape 타입, geometry 유틸)
└── shared/       # 공용 유틸, 상수, 타입
```

**Import 규칙 (절대 위반 금지)**:
`shared → entities → features → widgets → pages → app`
상위 레이어에서 하위 레이어만 import 가능. 역방향 import 금지.

## 핵심 설계 패턴

### Command Pattern

모든 사용자 액션을 Command 객체로 래핑하여 execute/undo 대칭성을 보장.

- `CreatePointCommand`, `CreatePolygonCommand`, `MoveShapeCommand`, `DeleteShapeCommand`
- 새로운 Command를 만들 때 반드시 `Command` 인터페이스(`shared/types`)를 구현할 것.

### HistoryManager

undo/redo 스택을 관리하는 클래스. Undo 후 새 액션 수행 시 redo 스택 클리어.

### Zustand Store

단일 스토어(`app/providers/editorStore.ts`)에서 shapes, mode, pendingVertices 등 관리.
3D 관련 상태(viewMode, pointCloudData 등)도 이 스토어에 추가.

## 코딩 컨벤션

- TypeScript strict mode — `any` 사용 금지
- 함수형 컴포넌트 + React hooks
- 명시적 반환 타입 (`JSX.Element`, `void` 등)
- 파일당 하나의 export (index.ts에서 re-export)
- FSD 레이어별 index.ts를 통한 public API만 사용
- 기존 코드의 네이밍/포맷 스타일을 그대로 따를 것

## 리팩토링 범위

### 변경 대상

1. `entities/shape/model/types.ts` — Coordinate에 z축 추가 (완료: optional z)
2. `app/providers/editorStore.ts` — viewMode, pointCloudData 상태 추가
3. `widgets/canvas/` — 기존 SVG Canvas는 유지하되 ThreeCanvas 위젯 신규 생성
4. `widgets/toolbar/` — 2D/3D 뷰 전환 버튼 추가
5. `widgets/status-bar/` — 3D 좌표 표시, 포인트 수 표시
6. `pages/editor/` — viewMode에 따라 Canvas/ThreeCanvas 전환

### 절대 변경하지 말 것

- `shared/types/Command` 인터페이스
- `features/history/model/historyManager.ts`
- 기존 Command 클래스들의 인터페이스
- 기존 테스트 파일들 (깨지지 않게 유지)

## Three.js 3D 캔버스 요구사항

### 기본 씬 구성

- PerspectiveCamera + OrbitControls (회전/줌/팬)
- GridHelper (바닥 그리드)
- AxesHelper (XYZ 축 표시)
- 다크 테마 배경 (#0A0A0B과 어울리게)

### Point Cloud 시각화

- 샘플 point cloud 데이터를 절차적으로 생성 (구/반구/지형 등)
- THREE.Points + BufferGeometry + PointsMaterial로 렌더링
- 포인트 크기/색상 조절 가능
- 대용량 데이터 대비 BufferGeometry 사용 (성능 최적화)

### 3D 인터랙션

- Raycaster 기반 포인트 선택 (클릭으로 select/delete)
- 3D 공간에 포인트 생성 (바닥 평면 클릭)
- Undo/Redo는 기존 Command Pattern 그대로 사용
- 삭제 모드에서 point cloud의 개별 포인트 삭제

### 뷰 전환

- Toolbar에 2D/3D 토글 버튼 추가
- 2D 모드: 기존 SVG Canvas (변경 없음)
- 3D 모드: Three.js Canvas (신규)
- 모드 전환 시 shapes 데이터 공유 (같은 Zustand 스토어)

## 파일 생성 위치 가이드

| 파일                         | 위치                                                  |
| ---------------------------- | ----------------------------------------------------- |
| ThreeCanvas 컴포넌트         | `src/widgets/three-canvas/ui/ThreeCanvas.tsx`         |
| ThreeCanvas index            | `src/widgets/three-canvas/index.ts`                   |
| Point3DRenderer              | `src/widgets/three-canvas/ui/Point3DRenderer.tsx`     |
| PointCloud 컴포넌트          | `src/widgets/three-canvas/ui/PointCloudRenderer.tsx`  |
| 3D 인터랙션 훅               | `src/widgets/three-canvas/lib/useThreeInteraction.ts` |
| Point Cloud 데이터 생성 유틸 | `src/entities/shape/lib/pointCloudGenerator.ts`       |
| 3D 상수                      | `src/shared/config/three-constants.ts`                |

## 커밋 메시지 컨벤션

```
feat: 기능 추가
refactor: 리팩토링
fix: 버그 수정
style: 스타일 변경
docs: 문서 수정
test: 테스트
chore: 빌드/설정
```
