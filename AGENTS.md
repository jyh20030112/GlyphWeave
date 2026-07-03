# Agent Instructions

## 1. Conventional Commits

本仓库使用 **约定式提交（Conventional Commits）** 格式：

```
<type>(<scope>): <subject>

<body>
<footer>
```

### Type

| Type | 使用场景 |
|------|---------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（既非 feat 也非 fix） |
| `perf` | 性能优化 |
| `style` | 代码风格调整（格式化、缩进等） |
| `chore` | 杂项（gitignore、依赖等） |
| `docs` | 文档 |
| `test` | 测试 |
| `ci` | CI/CD 配置变更 |

### Scope

| Scope | 覆盖范围 |
|-------|---------|
| `canvas` | Konva 画布相关（MapCanvas, TileCell, useCanvas） |
| `homepage` | 首页（HomePage, world 创建表单） |
| `store` | Zustand 状态管理（map-store, ui-store） |
| `toolbar` | 工具栏 |
| `panels` | 侧边面板（TilePalette, PresetsPanel, LayersPanel, ExportPanel） |
| `theme` | 主题系统（themes.ts, 配色切换） |
| `constants` | 常量定义（tiles, presets, demo-map） |
| `types` | 类型定义 |
| `components` | UI 组件（button, card, input 等 shadcn 组件） |
| `config` | 构建/项目配置（vite, tailwind, tsconfig 等） |
| `deps` | 依赖变更 |
| *(省略 scope 也接受)* | |

### Subject

- 英文，小写开头
- 不超过 50 个字符
- 结尾不加句号
- 祈使句语气（`fix` 而不是 `fixed` 或 `fixes`）

### Body

- 解释 **为什么** 这样改，而不是 **改了什么**（代码本身已说明后者）
- 每行不超过 72 字符
- 可选，但对非 trivial 的修改建议附加

### Footer（可选）

- `BREAKING CHANGE:` — 不兼容变更
- `Closes #123` — 关联 issue

### 示例

```
fix(canvas): correct tile coordinate mapping after pan/zoom

pointerToTile was dividing DOM-space pointer coordinates directly by
tileSize, without converting to Stage-space via stage.position() and
stage.scale(). After any pan or zoom, this caused the painted tile to
mismatch the mouse cursor position.
```

```
feat(panels): add layer visibility toggle
```

```
refactor(store): extract tile history into undo middleware
```

---

## 2. Branch Naming

### 命名格式

```
<type>/<short-description>
```

- 类型同 commit type：`feat/`、`fix/`、`refactor/`、`perf/`、`docs/`、`chore/`
- 描述用 kebab-case，简短
- examples:
  - `feat/layer-visibility-toggle`
  - `fix/pointer-tile-coord-mapping`
  - `refactor/extract-undo-middleware`
  - `docs/add-agents-md`

### 工作流

- 功能开发在 feature branch 上完成
- 完成自测后，rebase 到 `main` 再开 PR
- 合并方式：**Squash and merge**（PR 标题保持 commit 格式）
- 合并后删除源分支

---

## 3. Testing

### 测试框架

- **Vitest** — 单元测试 / 集成测试
- 测试文件位置：与被测文件同目录，命名 `*.test.ts` 或 `*.test.tsx`

### 测试覆盖要求

| 层级 | 要求 |
|------|------|
| **Stores** (Zustand) | 每个 action 至少一个测试，验证状态变更正确 |
| **Hooks** | 复杂逻辑 hook 需要测试（renderHook + act） |
| **Constants** | 映射/转换类的纯函数需要测试 |
| **Components** | 交互关键的组件（Toolbar、TilePalette）建议有渲染测试 |
| **Canvas** | 坐标计算、可见范围计算等纯函数需要测试 |

### 测试原则

- 优先测 **纯函数**和**状态逻辑**，而不是 DOM 渲染
- Zustand store 测试直接调用 `getState()` / `setState()` / actions，不需要 React 环境（immer 的 mutable 写法在测试中也一样）
- canvas 坐标计算等数学逻辑单独提取为纯函数测试
- mock 外部依赖（Konva stage 等）只在必要时做
- 红-绿-重构（TDD 时）

---

## 4. Code Style

### TypeScript

- 优先用 `type` 而非 `interface`（项目约定）
- **严格模式**启用（`tsconfig.app.json` 中 `"strict": true`）
- 避免 `any`；用 `unknown` + 类型守卫代替
- 函数返回值显式标注
- 尽量用 `const` 声明

### Imports

```
// 1. 第三方库
import { useState } from 'react'
import Konva from 'konva'

// 2. 项目内部（@/ alias）
import { useMapStore } from '@/stores/map-store'
import { TileCell } from './TileCell'
```

### 命名

| 类别 | 规则 | 示例 |
|------|------|------|
| 文件名 | camelCase | `useCanvas.ts`, `map-store.ts` |
| React 组件 | PascalCase | `MapCanvas.tsx`, `HomePage.tsx` |
| 函数/变量 | camelCase | `pointerToTile`, `isPanning` |
| 常量 | camelCase 或 UPPER_SNAKE | `TILE_TYPES`, `themeId` |
| Stores | camelCase | `useMapStore`, `useUiStore` |

### Tailwind

- 使用 Tailwind v4 语法（`@import "tailwindcss"`）
- 优先实用类，少写自定义 CSS
- 颜色使用 Tailwind 调色板（`zinc-*` 系列），除非主题需要自定义

---

## 5. Development Workflow

### 常规流程

1. 从 `main` 创建 feature/fix branch：`git checkout -b fix/xxx`
2. 开发 + 自测
3. 确保 lint 通过：`pnpm lint`（oxlint）
4. 确保类型检查通过：`pnpm typecheck`（tsc --noEmit）
5. rebase 到最新的 `main`
6. 创建 PR，标题用 commit 格式
7. Squash and merge → 删除分支

### 可用命令

| 命令 | 用途 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 生产构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm lint` | 代码检查 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm test` | 运行测试 |

---

## 6. Project Architecture Notes

```
src/
├── types/index.ts            # 核心类型（TileType, TileColors, WorldConfig 等）
├── constants/                # 纯数据：tiles, presets, themes, demo-map
├── stores/                   # Zustand 状态管理
│   ├── map-store.ts          # 地图数据、历史栈、工具状态
│   └── ui-store.ts           # UI 可见性、面板状态
├── hooks/                    # 交互逻辑
│   ├── useCanvas.ts          # 鼠标/键盘事件 → Konva Stage
│   └── useKeyboard.ts        # 全局快捷键
└── components/               # React UI
    ├── canvas/               # Konva 渲染层
    ├── toolbar/              # 工具栏
    ├── panels/               # 侧边面板
    ├── pages/                # 页面级组件（HomePage, EditorPage）
    └── ui/                   # shadcn/ui 基础组件
```

### 数据流

```
User Input → useCanvas (event) → map-store (state) → MapCanvas (render)
                                  ↕
                           undo/redo history
```

- 所有地图状态在 `map-store` 中，单向流动
- Canvas 只读 `map-store`，不维护本地状态
- `ui-store` 持 UI 相关状态（grid toggle, panel 展开）

### Konva 注意事项

- Stage 坐标空间与 DOM 坐标空间不同：`getPointerPosition()` 返回 DOM 坐标
- 需要手动通过 `stage.position()` 和 `stage.scaleX()` 转换到 Stage 空间
- 所有 tile 位置 = `gridX * tileSize`, `gridY * tileSize`（Stage 空间）
- 视口裁剪（viewport culling）在 `MapCanvas.getVisibleRange` 中实现
