# Store Rules (Zustand)

## 스토어 위치

- 메인 스토어: `features/history/model/` 또는 별도의 `entities/shape/model/`
- 이 프로젝트는 단일 Zustand 스토어를 사용한다 (slice 패턴 미사용)
- HistoryManager는 스토어 내부에 통합하거나 별도 인스턴스로 관리

## 스토어 구조

```typescript
interface EditorState {
  // 상태
  shapes: Shape[];
  mode: EditorMode;
  selectedShapeId: string | null;
  pendingVertices: Coordinate[];  // Polygon 생성 중 임시 꼭짓점
  feedbackMessage: string | null;

  // 히스토리
  undoStack: Command[];
  redoStack: Command[];
  canUndo: boolean;
  canRedo: boolean;

  // 액션 — 모드
  setMode: (mode: EditorMode) => void;

  // 액션 — 도형 CRUD
  addShape: (shape: Shape) => void;
  removeShape: (id: string) => void;
  updateShapePosition: (id: string, position: Coordinate | Coordinate[]) => void;

  // 액션 — 폴리곤 생성 플로우
  addPendingVertex: (vertex: Coordinate) => void;
  clearPendingVertices: () => void;
  completePolygon: () => void;

  // 액션 — 히스토리
  executeCommand: (command: Command) => void;
  undo: () => void;
  redo: () => void;

  // 액션 — 피드백
  setFeedbackMessage: (message: string | null) => void;
}
```

## 상태 변경 규칙

- 컴포넌트에서 `shapes` 배열을 직접 수정하지 않는다
- 반드시 스토어 액션(`addShape`, `removeShape` 등)을 통해서만 변경
- Command 객체가 스토어 액션을 호출하는 구조

```typescript
// ✅ Good — 컴포넌트에서 Command 생성 → executeCommand 호출
const handleCanvasClick = (coord: Coordinate) => {
  const point: PointShape = { id: generateId(), type: 'point', position: coord };
  const command = new CreatePointCommand(point, addShape, removeShape);
  executeCommand(command);
};

// ❌ Bad — 컴포넌트에서 직접 상태 변경
const handleCanvasClick = (coord: Coordinate) => {
  shapes.push({ ... }); // FORBIDDEN
};
```

## 모드 전환 시 사이드 이펙트

`setMode()` 호출 시 반드시:
1. `selectedShapeId`를 `null`로 초기화
2. `pendingVertices`를 비우기 (미완성 폴리곤 폐기)
3. `feedbackMessage`를 해당 모드의 기본 메시지로 변경

## 셀렉터 사용

컴포넌트에서 스토어 접근 시 필요한 상태만 구독한다:

```typescript
// ✅ Good — 필요한 것만 선택
const mode = useEditorStore((state) => state.mode);
const shapes = useEditorStore((state) => state.shapes);

// ❌ Bad — 전체 스토어 구독 (불필요한 리렌더)
const store = useEditorStore();
```

## 파생 상태

- `canUndo`와 `canRedo`는 `undoStack.length > 0`, `redoStack.length > 0`으로 계산
- 별도 상태로 관리해도 되고, 셀렉터로 파생해도 됨
- 어느 방식이든 Undo/Redo 버튼 비활성화에 사용
