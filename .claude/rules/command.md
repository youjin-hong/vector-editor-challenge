# Command Pattern Rules

## Command 인터페이스

모든 사용자 액션은 Command 객체로 래핑한다.

```typescript
// entities/shape/model/types.ts 또는 shared/types에 정의
interface Command {
  execute(): void;
  undo(): void;
  readonly description: string;
}
```

## Command 구현 규칙

- 각 Command 클래스는 `features/` 레이어의 해당 슬라이스에 위치
- Command는 생성 시점에 실행에 필요한 모든 정보를 받는다 (클로저 의존 금지)
- `execute()`와 `undo()`는 완전히 대칭이어야 한다
- Command 내부에서 직접 상태를 변경하지 않고, 스토어 액션을 호출한다

```typescript
// ✅ Good
export class CreatePointCommand implements Command {
  readonly description = 'Create Point';

  constructor(
    private readonly shape: PointShape,
    private readonly addShape: (shape: Shape) => void,
    private readonly removeShape: (id: string) => void,
  ) {}

  execute(): void {
    this.addShape(this.shape);
  }

  undo(): void {
    this.removeShape(this.shape.id);
  }
}
```

## HistoryManager 규칙

위치: `features/history/model/historyManager.ts`

```
execute(command):
  1. command.execute() 호출
  2. undoStack에 push
  3. redoStack 비우기 (필수)

undo():
  1. undoStack에서 pop
  2. command.undo() 호출
  3. redoStack에 push

redo():
  1. redoStack에서 pop
  2. command.execute() 호출
  3. undoStack에 push
```

- undoStack이 비어있으면 undo() 무시
- redoStack이 비어있으면 redo() 무시
- Undo 후 새로운 command를 execute하면 redoStack 반드시 클리어

## 히스토리 대상 액션

| 액션 | Command | execute | undo |
|------|---------|---------|------|
| 점 생성 | CreatePointCommand | addShape | removeShape |
| 다각형 생성 | CreatePolygonCommand | addShape | removeShape |
| 객체 이동 | MoveShapeCommand | 새 위치 적용 | 이전 위치 복원 |
| 객체 삭제 | DeleteShapeCommand | removeShape | addShape (복원) |

## MoveShapeCommand 특이사항

- 드래그 시작 시점의 위치와 드래그 종료 시점의 위치를 모두 저장
- 드래그 중간 과정은 히스토리에 기록하지 않음
- mouseup(또는 pointerup) 시점에 하나의 Command 생성

```typescript
export class MoveShapeCommand implements Command {
  readonly description = 'Move Shape';

  constructor(
    private readonly shapeId: string,
    private readonly fromPosition: Coordinate | Coordinate[],
    private readonly toPosition: Coordinate | Coordinate[],
    private readonly updateShapePosition: (id: string, position: Coordinate | Coordinate[]) => void,
  ) {}

  execute(): void {
    this.updateShapePosition(this.shapeId, this.toPosition);
  }

  undo(): void {
    this.updateShapePosition(this.shapeId, this.fromPosition);
  }
}
```

## Polygon 생성 시 히스토리

- 꼭짓점을 하나씩 찍는 과정은 히스토리에 기록하지 않음
- Complete 버튼 클릭 시점에 CreatePolygonCommand 하나만 생성
- Undo하면 다각형 전체가 사라짐 (꼭짓점 하나씩 되돌리지 않음)
