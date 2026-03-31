# Styling Rules

## 디자인 원칙

v0에서 생성된 기존 디자인을 유지한다. 새 컴포넌트 추가 시 동일 토큰을 사용한다.

## Color Tokens

Tailwind config에 커스텀 컬러로 등록하여 사용:

```
background:     #0A0A0B    (bg-editor-bg)
surface:        #141415    (bg-editor-surface)
surface-hover:  #1C1C1E    (bg-editor-surface-hover)
border:         #2A2A2D    (border-editor-border)
text-primary:   #FAFAFA    (text-editor-primary)
text-secondary: #A1A1AA    (text-editor-secondary)
text-muted:     #71717A    (text-editor-muted)
accent:         #F97316    (bg-editor-accent, text-editor-accent)
accent-hover:   #FB923C    (bg-editor-accent-hover)
success:        #22C55E    (text-editor-success)
error:          #EF4444    (text-editor-error)
```

## Typography

- UI 텍스트: `font-sans` (Inter)
- 좌표, 단축키 표시: `font-mono` (JetBrains Mono)
- Tailwind config에서 fontFamily 확장

## Component Specs

```
Toolbar:         w-14 (56px), 아이콘 w-5 h-5 (20px)
Status Bar:      h-9 (36px), 하단 fixed
Canvas:          flex-1, 나머지 영역 전체
Active Button:   bg-editor-accent, shadow-[0_0_8px_rgba(249,115,22,0.3)]
Disabled Button: opacity-30, pointer-events-none
Border Radius:   rounded-xl (12px 카드), rounded-lg (8px 버튼), rounded (4px 뱃지)
```

## 도형 스타일

```
Point (circle):
  - fill: #F97316 (accent)
  - r: 6
  - hover: r 8로 확대 + stroke 추가
  - selected: stroke #FB923C, strokeWidth 2

Polygon:
  - fill: rgba(249, 115, 22, 0.15)
  - stroke: #F97316
  - strokeWidth: 2
  - hover: fill opacity 0.25
  - selected: stroke #FB923C, strokeWidth 3

Pending Polygon (생성 중 미리보기):
  - stroke: #F97316
  - strokeDasharray: "4 4"
  - fill: none
  - 꼭짓점마다 작은 circle (r: 4) 표시

Grid Dot:
  - fill: #2A2A2D
  - r: 1
  - spacing: 24px 간격
```

## 커서 스타일

```
Point Mode:   crosshair
Polygon Mode: crosshair
Move Mode:    default → 객체 호버 시 grab → 드래그 중 grabbing
Delete Mode:  default → 객체 호버 시 pointer (또는 커스텀 삭제 커서)
```

## 반응형

- 이 프로젝트는 데스크톱 전용으로 설계
- 최소 너비: 1024px
- 모바일 대응은 범위 밖

## Tailwind 사용 규칙

- 인라인 스타일 사용하지 않음 (SVG 요소 제외)
- SVG 요소의 fill, stroke 등은 인라인 속성 허용
- 커스텀 CSS 작성 최소화, Tailwind 유틸리티 우선
- 복잡한 조건부 스타일은 `clsx` 또는 `cn` 유틸 사용
