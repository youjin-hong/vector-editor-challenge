# AI Prompts

본 프로젝트 개발 과정에서 AI 도구를 부분적으로 활용하였습니다.

## 사용 도구

- **Claude** (Anthropic) — 설계 방향 논의 및 코드 리뷰
- **Claude Code** (Anthropic) — 보일러플레이트 생성 및 리팩토링 보조
- **v0** (Vercel) — 유사 서비스 레퍼런스 기반 UI 디자인 프로토타이핑

## 주요 활용 내역

### 설계 단계

1. FSD 아키텍처의 레이어 분리 방식과 레이어 간 import 규칙 검토
2. Undo/Redo 구현 방식 비교 — 액션을 객체로 감싸는 Command Pattern과 상태 변경을 기록하는 Event Sourcing 중 선택
3. Zustand 상태 관리를 하나의 스토어로 할지, 기능별로 나눌지(slice 패턴) 장단점 논의

### 구현 단계

4. 클릭한 좌표가 다각형 내부인지 판별하는 Ray Casting 알고리즘 구현 검증
5. 도형을 드래그할 때 캔버스 밖으로 나가지 않도록 좌표를 제한하는 로직 리뷰
6. Polygon 생성 시 예외 상황 처리 방향 논의 (꼭짓점 2개 이하로 완성 시도, 생성 도중 모드 전환 등)

### 테스트

7. E2E 테스트 시나리오 설계 및 Playwright에서 DOM 요소를 찾는 방식(data 속성 등) 논의
8. 어떤 모듈부터 테스트를 작성할지 우선순위 검토

### 스타일링

<<<<<<< HEAD
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
=======
9. 기존 벡터 편집기(Figma, tldraw, Excalidraw 등)를 레퍼런스로 v0에서 UI 초안 생성
10. 다크 테마 색상 조합 피드백
>>>>>>> a7fa4881b7f5a72e336bbc860b972c2ebd5be565
