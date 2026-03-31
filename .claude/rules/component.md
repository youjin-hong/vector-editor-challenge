# Component Rules

## FSD 슬라이스 구조

새 컴포넌트 생성 시 반드시 해당 레이어의 슬라이스 구조를 따른다:

```
feature-name/
├── ui/           # 리액트 컴포넌트
├── model/        # 비즈니스 로직, 타입, 스토어
├── lib/          # 유틸, 훅
├── api/          # (해당 프로젝트에서는 미사용)
└── index.ts      # Public API (외부에 노출할 것만 export)
```

## 컴포넌트 작성 규칙

- 함수 컴포넌트 + 화살표 함수로 작성
- Props 인터페이스는 컴포넌트 파일 상단에 정의하고 `interface [ComponentName]Props` 네이밍
- 파일명은 PascalCase, 한 파일에 한 컴포넌트
- default export 사용하지 않음 → named export만 사용

```typescript
// ✅ Good
interface ToolButtonProps {
  icon: LucideIcon;
  label: string;
  shortcut?: string;
  isActive: boolean;
  onClick: () => void;
}

export const ToolButton = ({ icon: Icon, label, shortcut, isActive, onClick }: ToolButtonProps): JSX.Element => {
  return ( ... );
};

// ❌ Bad
export default function ToolButton(props: any) { ... }
```

## index.ts Public API

각 슬라이스의 `index.ts`는 외부에 노출할 것만 re-export한다. 내부 구현은 노출하지 않는다.

```typescript
// widgets/toolbar/index.ts
export { Toolbar } from './ui/Toolbar';
// ToolButton, CompleteButton은 Toolbar 내부에서만 사용 → export하지 않음
```

## Import 규칙

- 같은 슬라이스 내부: 상대 경로 (`./ui/Button`)
- 다른 슬라이스: 절대 경로 + index.ts 통해 (`@/entities/shape`)
- 상위 레이어 import 절대 금지

```typescript
// ✅ widgets/canvas에서 entities/shape 사용
import { type Shape } from '@/entities/shape';

// ❌ entities/shape에서 widgets/canvas 사용 (상위 레이어)
import { Canvas } from '@/widgets/canvas'; // FORBIDDEN
```

## SVG 컴포넌트 규칙

- 캔버스 내 도형은 모두 SVG 요소로 렌더링
- Point → `<circle>`, Polygon → `<polygon>`
- 각 도형 컴포넌트는 `data-shape-id` 속성 필수 (히트 테스트용)

```typescript
export const PointRenderer = ({ shape }: { shape: PointShape }): JSX.Element => {
  return (
    <circle
      cx={shape.position.x}
      cy={shape.position.y}
      r={6}
      data-shape-id={shape.id}
    />
  );
};
```
