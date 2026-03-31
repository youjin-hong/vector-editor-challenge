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
