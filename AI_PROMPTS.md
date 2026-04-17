# AI Prompts

본 프로젝트 개발 시 사용한 AI 도구 및 프롬프트 목록입니다.

## 사용 도구

- **Claude Code** (Anthropic Claude Opus 4.6) — CLI 기반 AI 코딩 어시스턴트

## 프롬프트 목록

### 프로젝트 초기 설정

1. 프로젝트 구조(FSD 아키텍처), CLAUDE.md 규칙 파일들, 기본 컴포넌트 스캐폴딩 생성

### 핵심 기능 구현

2. Command Pattern 기반 Undo/Redo 히스토리 시스템 구현 (HistoryManager, Command 인터페이스)
3. Zustand 스토어 설계 및 구현 (EditorState, 모드 전환, 도형 CRUD)
4. Canvas 인터랙션 훅 구현 (useCanvasInteraction — 모드별 클릭/드래그 핸들링)
5. 드래그 앤 드롭 훅 구현 (useDragDrop — 델타 기반 이동, 캔버스 클램핑)
6. SVG 기반 도형 렌더러 구현 (PointRenderer, PolygonRenderer)
7. Polygon 생성 플로우 구현 (pendingVertices, 미리보기, Complete/Cancel)
8. 키보드 단축키 훅 구현 (useKeyboardShortcuts)

### 테스트

9. 단위 테스트 작성 (HistoryManager, Command 클래스들, geometry 유틸)
10. 컴포넌트/통합 테스트 작성 (editorStore, Toolbar, Canvas, StatusBar, PointRenderer, PolygonRenderer, useKeyboardShortcuts)
11. Playwright E2E 테스트 작성 (Point/Polygon 생성, Move, Delete, Undo/Redo, 키보드 단축키, 복합 시나리오)

### 스타일링

12. Tailwind CSS 커스텀 테마 설정 (다크 테마 컬러 토큰, 타이포그래피)
13. v0 기반 UI 디자인 구현 (Toolbar, StatusBar, 도형 호버/선택 스타일)

---

## Three.js 3D 확장 리팩토링

2D SVG 에디터를 Three.js 기반 3D Point Cloud 뷰어로 확장한 리팩토링 작업에 사용한 프롬프트입니다.
기존 2D 동작을 건드리지 않고 순수하게 additive한 변경만 수행하는 것이 목표였습니다.

### Step 1: Zustand 스토어에 3D 상태 추가

14. `three-constants.ts` 신규 생성 (POINT_CLOUD_SIZE, GRID_SIZE, CAMERA_POSITION 등)
15. `ViewMode` 타입 추가 (`'2d' | '3d'`) 및 `entities/shape`에서 re-export
16. editorStore에 `viewMode`, `pointCloudVisible`, `pointSize` 상태 + `setViewMode`, `togglePointCloud`, `setPointSize` 액션 추가

### Step 2: Point Cloud 샘플 데이터 생성 유틸

17. `entities/shape/lib/pointCloudGenerator.ts` 생성 — 순수 함수 4종
    - `generateSphereCloud` — 균등 분포 구면 (`acos(2*random-1)` 방식)
    - `generateTerrainCloud` — xz 그리드 + sin/cos 조합 지형
    - `generateBuildingCloud` — 그리드 배치 랜덤 높이 건물
    - `generateColorArray` — height/distance/uniform 모드별 색상 배열

### Step 3: Three.js 캔버스 위젯 구축

18. FSD 구조로 `widgets/three-canvas/` 슬라이스 생성
    - `ThreeCanvas` — @react-three/fiber Canvas, OrbitControls, gridHelper, axesHelper
    - `PointCloudRenderer` — BufferGeometry + PointsMaterial (vertexColors)
    - `Point3DRenderer` — 2D `(x, y)` → 3D `(x, 0, z)` 매핑, drei Sphere
    - `Polygon3DRenderer` — ShapeGeometry 채우기 + drei Line 외곽선
    - `GroundPlane` — 투명 평면, point 모드에서 클릭으로 포인트 생성
    - `useShapeClickHandler` — 삭제 모드에서 Command Pattern 재사용

### Step 4: 2D/3D 뷰 전환 UI 통합

19. Toolbar에 `Box`/`Cloud` 아이콘으로 뷰 전환 + Point Cloud 토글 버튼 추가
20. EditorPage에서 `viewMode`에 따라 `<Canvas />` / `<ThreeCanvas />` 조건부 렌더링
21. StatusBar — 3D 모드일 때 shapes 개수 배지, X/Y/Z 좌표, pointSize 슬라이더 표시
22. `V` 키 단축키로 2D/3D 토글 (기존 테스트 호환 위해 `toggleViewMode`는 optional)

### Step 5: 최종 마무리

23. README.md / AI_PROMPTS.md 문서 업데이트, 빌드·린트·테스트 최종 검증

### 3D 확장에서 지킨 원칙

- **기존 2D 동작 불변** — 기존 테스트(111개) 모두 통과, Command 인터페이스·HistoryManager 변경 없음
- **단일 Zustand 스토어** — viewMode만 추가하여 shapes 데이터를 2D/3D가 공유
- **FSD 레이어 준수** — three-canvas는 widgets 레이어, 순수 유틸은 entities/shape/lib에 배치
- **TypeScript strict** — `any` 금지, `verbatimModuleSyntax` 하에서 `export type` 사용
