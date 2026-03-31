# Testing Rules

## 테스트 도구

- Vitest (단위/통합 테스트)
- React Testing Library (컴포넌트 테스트)
- 테스트 실행: `npm test`

## 테스트 파일 위치

FSD 구조에서 테스트 파일은 해당 슬라이스 내부의 `__tests__/` 디렉토리에 배치한다:

```
features/
└── history/
    ├── model/
    │   └── historyManager.ts
    ├── __tests__/
    │   └── historyManager.test.ts
    └── index.ts

entities/
└── shape/
    ├── lib/
    │   └── geometry.ts
    ├── __tests__/
    │   └── geometry.test.ts
    └── index.ts
```

## 필수 테스트 대상

### 1. HistoryManager (최우선)

```typescript
describe('HistoryManager', () => {
  // execute → undoStack에 추가
  // undo → 마지막 command의 undo() 호출 + redoStack 이동
  // redo → 마지막 redo command의 execute() 호출 + undoStack 이동
  // undo 후 새 execute → redoStack 클리어
  // 빈 스택에서 undo/redo → 아무 일도 없음
  // canUndo / canRedo 상태 정확성
});
```

### 2. Command 클래스들

```typescript
describe('CreatePointCommand', () => {
  // execute → shape가 추가됨
  // undo → shape가 제거됨
  // execute → undo → execute → 다시 추가됨
});

describe('MoveShapeCommand', () => {
  // execute → 새 위치로 이동
  // undo → 이전 위치로 복원
});

describe('DeleteShapeCommand', () => {
  // execute → shape 제거
  // undo → shape 복원 (원본 데이터 보존 확인)
});
```

### 3. geometry 유틸

```typescript
describe('geometry', () => {
  // isPointInCircle: 히트 반경 내 → true, 밖 → false
  // isPointInPolygon: Ray Casting 정확성 (내부/외부/경계)
  // calculatePolygonCenter: 중심점 계산
  // clampToCanvas: 경계 클램핑
});
```

### 4. Zustand 스토어 (통합)

```typescript
describe('editorStore', () => {
  // addShape → shapes 배열에 추가
  // removeShape → shapes에서 제거
  // setMode → mode 변경 + pendingVertices 초기화
  // completePolygon → 3점 이상이면 Polygon 생성, 미만이면 거부
});
```

## 테스트 작성 규칙

- `describe` > `it` 구조, 테스트명은 영어로 작성
- 한 테스트에 하나의 assertion 원칙 (가능한 한)
- 테스트 간 상태 격리: `beforeEach`에서 초기화
- 모킹은 최소화 — 순수 함수 위주로 테스트

```typescript
// ✅ Good
describe('HistoryManager', () => {
  let manager: HistoryManager;

  beforeEach(() => {
    manager = new HistoryManager();
  });

  it('should add command to undo stack after execute', () => {
    const command = createMockCommand();
    manager.execute(command);
    expect(manager.canUndo).toBe(true);
  });

  it('should clear redo stack when new command is executed after undo', () => {
    const cmd1 = createMockCommand();
    const cmd2 = createMockCommand();
    manager.execute(cmd1);
    manager.undo();
    manager.execute(cmd2);
    expect(manager.canRedo).toBe(false);
  });
});

// ❌ Bad — 여러 동작을 하나에 다 넣음
it('should work', () => {
  manager.execute(cmd);
  expect(manager.canUndo).toBe(true);
  manager.undo();
  expect(manager.canUndo).toBe(false);
  manager.redo();
  expect(manager.canRedo).toBe(false);
});
```

## Mock Command 헬퍼

테스트에서 반복 사용할 mock을 만들어둔다:

```typescript
const createMockCommand = (): Command => {
  const executed = { value: false };
  return {
    description: 'mock',
    execute: () => { executed.value = true; },
    undo: () => { executed.value = false; },
  };
};
```

## 컴포넌트 테스트 (선택)

컴포넌트 테스트는 핵심 인터랙션만 검증:
- 모드 전환 시 툴바 active 상태 변경
- 캔버스 클릭 시 도형 생성 여부
- Undo/Redo 버튼 비활성화 상태

순수 로직 테스트가 우선이고, 컴포넌트 테스트는 시간이 허락할 때 추가한다.
