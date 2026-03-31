# Coding Conventions

## TypeScript

- strict mode 필수 (`"strict": true` in tsconfig)
- `any` 타입 사용 금지 → `unknown` 사용 후 타입 가드
- 모든 함수에 명시적 반환 타입 선언
- 매직 넘버 금지 → `shared/config/constants.ts`에 상수 정의
- enum 대신 `as const` 객체 또는 union type 사용

```typescript
// ✅ Good
const EDITOR_MODES = ['point', 'polygon', 'move', 'delete'] as const;
type EditorMode = (typeof EDITOR_MODES)[number];

// ❌ Bad
enum EditorMode { Point, Polygon, Move, Delete }
```

## 네이밍

```
파일명:
  - 컴포넌트:    PascalCase.tsx    (Canvas.tsx, ToolButton.tsx)
  - 훅:          camelCase.ts      (useCanvasInteraction.ts)
  - 유틸/모델:   camelCase.ts      (geometry.ts, types.ts)
  - Command:     PascalCase.ts     (CreatePointCommand.ts)
  - 테스트:      *.test.ts         (geometry.test.ts)
  - 상수:        camelCase.ts      (constants.ts)

변수/함수:
  - 변수:        camelCase
  - 상수:        UPPER_SNAKE_CASE  (HIT_RADIUS, GRID_SPACING)
  - 함수:        camelCase         (calculateCenter, isPointInPolygon)
  - 컴포넌트:    PascalCase        (PointRenderer, Toolbar)
  - 타입:        PascalCase        (Shape, Coordinate, EditorState)
  - 훅:          use + PascalCase  (useCanvasInteraction, useDragDrop)
```

## Import 순서

```typescript
// 1. React / 외부 라이브러리
import { useState, useCallback } from 'react';
import { Circle, Trash2 } from 'lucide-react';

// 2. FSD 하위 레이어 (shared → entities → features)
import { type Shape, type Coordinate } from '@/entities/shape';
import { POINT_RADIUS, HIT_RADIUS } from '@/shared/config/constants';

// 3. 같은 슬라이스 내부
import { PointRenderer } from './PointRenderer';
```

## 함수 작성

- 순수 함수를 우선한다 (side effect 최소화)
- geometry 관련 유틸은 반드시 순수 함수로 작성
- 복잡한 로직은 커스텀 훅으로 분리

```typescript
// ✅ Good — 순수 함수
export const isPointInCircle = (
  point: Coordinate,
  center: Coordinate,
  radius: number,
): boolean => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return dx * dx + dy * dy <= radius * radius;
};

// ❌ Bad — 외부 상태 의존
export const isPointInCircle = (point: Coordinate) => {
  return distance(point, globalCenter) <= globalRadius;
};
```

## 에러 처리

- 사용자 입력 관련 에러는 feedbackMessage로 표시 (throw하지 않음)
- 시스템 에러는 console.error + ErrorBoundary에서 처리
- try-catch는 외부 API 호출 등 예측 불가능한 에러에만 사용

## 주석

- 코드로 의도가 드러나면 주석 불필요
- 복잡한 알고리즘 (Ray Casting 등)에는 주석으로 원리 설명
- TODO 주석은 허용하되 구현 완료 후 제거

## Git Commit

- conventional commits 형식: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`
- 한 커밋에 한 가지 변경
- repo 이름에 "Bear Robotics", "Assessment", "Assignment", "Interview", "Test" 포함 금지
