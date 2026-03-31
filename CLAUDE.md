# CLAUDE.md — VectoR Interactive Vector Editor

## Project Purpose

브라우저 기반 인터랙티브 벡터 에디터. 캔버스 위에서 점(Point)과 다각형(Polygon)을 생성·이동·삭제하고, 모든 액션에 대해 Undo/Redo를 수행할 수 있다.

프론트엔드 채용 과제이며, 핵심 평가 포인트:

- 복잡한 인터랙션 상태 관리 설계 능력
- Command Pattern 기반 Undo/Redo 히스토리 시스템
- 자동화 테스트 작성
- 코드 품질과 아키텍처

## Tech Stack

- React 18 + TypeScript (strict mode)
- Vite (빌드)
- Zustand (상태 관리)
- Vitest + React Testing Library (테스트)
- Tailwind CSS (스타일링)
- Lucide React (아이콘)
- SVG 기반 렌더링 (Canvas API 사용하지 않음)

## Architecture — Feature-Sliced Design (FSD)

```
src/
├── app/                        # Layer: App
│   ├── App.tsx
│   ├── main.tsx
│   ├── providers/
│   └── styles/
│       └── globals.css
│
├── pages/                      # Layer: Pages
│   └── editor/
│       └── EditorPage.tsx
│
├── widgets/                    # Layer: Widgets (독립 UI 블록)
│   ├── toolbar/
│   │   ├── ui/
│   │   │   ├── Toolbar.tsx
│   │   │   ├── ToolButton.tsx
│   │   │   └── CompleteButton.tsx
│   │   └── index.ts
│   │
│   ├── canvas/
│   │   ├── ui/
│   │   │   ├── Canvas.tsx
│   │   │   ├── PointRenderer.tsx
│   │   │   ├── PolygonRenderer.tsx
│   │   │   └── GridPattern.tsx
│   │   ├── lib/
│   │   │   └── useCanvasInteraction.ts
│   │   └── index.ts
│   │
│   └── status-bar/
│       ├── ui/
│       │   └── StatusBar.tsx
│       └── index.ts
│
├── features/                   # Layer: Features (사용자 액션)
│   ├── create-shape/
│   │   ├── model/
│   │   │   ├── CreatePointCommand.ts
│   │   │   └── CreatePolygonCommand.ts
│   │   └── index.ts
│   │
│   ├── move-shape/
│   │   ├── model/
│   │   │   └── MoveShapeCommand.ts
│   │   ├── lib/
│   │   │   └── useDragDrop.ts
│   │   └── index.ts
│   │
│   ├── delete-shape/
│   │   ├── model/
│   │   │   └── DeleteShapeCommand.ts
│   │   └── index.ts
│   │
│   └── history/
│       ├── model/
│       │   └── historyManager.ts
│       ├── lib/
│       │   └── useKeyboardShortcuts.ts
│       └── index.ts
│
├── entities/                   # Layer: Entities (비즈니스 엔티티)
│   └── shape/
│       ├── model/
│       │   └── types.ts
│       ├── lib/
│       │   └── geometry.ts
│       └── index.ts
│
└── shared/                     # Layer: Shared (공용)
    ├── ui/
    │   ├── IconButton.tsx
    │   └── Badge.tsx
    ├── lib/
    │   ├── generateId.ts
    │   └── clamp.ts
    ├── config/
    │   └── constants.ts
    └── types/
        └── index.ts
```

## FSD Import Rules

```
shared → entities → features → widgets → pages → app
```

하위 레이어는 상위 레이어를 import할 수 없다.
각 slice는 반드시 `index.ts`를 통해 public API만 노출한다.

## Functional Requirements

### 모드

- Point Mode: 캔버스 클릭 → 점 생성
- Polygon Mode: 꼭짓점 클릭 → Complete → 다각형 생성 (최소 3점)
- Move Mode: 드래그로 객체 이동
- Delete Mode: 클릭으로 객체 삭제

### Undo/Redo

- Command Pattern 기반 히스토리 스택
- 생성, 이동, 삭제 모든 액션 대상
- Ctrl+Z / Ctrl+Shift+Z

### 키보드 단축키

| Key            | Action           |
| -------------- | ---------------- |
| `1`            | Point Mode       |
| `2`            | Polygon Mode     |
| `3`            | Move Mode        |
| `4`            | Delete Mode      |
| `Enter`        | Polygon Complete |
| `Escape`       | 현재 작업 취소   |
| `Ctrl+Z`       | Undo             |
| `Ctrl+Shift+Z` | Redo             |

## Edge Cases

- Polygon 생성 중 모드 전환 → 미완성 꼭짓점 폐기
- Undo 후 새 액션 수행 → redoStack 클리어
- 이동 중 캔버스 밖 드래그 → 경계 클램핑
- Polygon Complete 시 꼭짓점 2개 이하 → 생성 거부 + 경고
- 빈 히스토리에서 Undo/Redo → 무시, 버튼 비활성화

## Rule Files

세부 규칙은 `.claude/rules/` 참조:

- `component.md` — 컴포넌트 생성 규칙
- `command.md` — Command Pattern 구현 규칙
- `store.md` — Zustand 상태 관리 규칙
- `testing.md` — 테스트 작성 규칙
- `styling.md` — 디자인 시스템 및 스타일
- `convention.md` — 코딩 컨벤션
