# Auto Claude 全量汉化实施指南

## 📋 项目概览

本文档记录了 Auto Claude 项目的完整国际化（i18n）实施方案。

### 已完成工作

✅ **基础设施搭建**
- 安装了 i18next、react-i18next、i18next-browser-languagedetector
- 创建了 i18n 配置文件结构 (`src/i18n/`)
- 生成了所有必需的翻译资源文件骨架

✅ **翻译文件创建**
- 英文翻译文件：14个命名空间
- 中文翻译文件：14个命名空间
- 通用翻译（common.json）：70+ 常用词汇
- 侧边栏翻译（sidebar.json）：完整的导航和对话框文本

### 文件结构

```
apps/frontend/src/
├── i18n/
│   ├── index.ts                    # i18n 核心配置
│   └── locales/
│       ├── en/                     # 英文翻译
│       │   ├── common.json         ✅ 已完成
│       │   ├── sidebar.json        ✅ 已完成
│       │   ├── settings.json       ⚠️ 需扩展
│       │   ├── tasks.json          ⚠️ 需扩展
│       │   ├── terminal.json       ⚠️ 需扩展
│       │   ├── roadmap.json        ⚠️ 需扩展
│       │   ├── insights.json       ⚠️ 需扩展
│       │   ├── ideation.json       ⚠️ 需扩展
│       │   ├── context.json        ⚠️ 需扩展
│       │   ├── changelog.json      ⚠️ 需扩展
│       │   ├── github.json         ⚠️ 需扩展
│       │   ├── worktrees.json      ⚠️ 需扩展
│       │   ├── onboarding.json     ⚠️ 需扩展
│       │   └── errors.json         ⚠️ 需扩展
│       └── zh-CN/                  # 中文翻译（结构同上）
```

## 🚀 下一步工作

### 阶段 1：前端组件汉化（预计 3-5 天）

#### 1.1 修改主应用入口
**文件：** `src/renderer/App.tsx`

**需要做的事：**
```typescript
// 在文件顶部添加
import '../i18n';
import { useTranslation } from 'react-i18next';

// 在组件内部使用
const { t } = useTranslation();

// 替换硬编码文本
// 之前：<h1>Settings</h1>
// 之后：<h1>{t('common:settings')}</h1>
```

#### 1.2 修改核心组件

**优先级 P0（必须立即完成）：**
1. `Sidebar.tsx` - 侧边栏导航
2. `AppSettings.tsx` - 应用设置
3. `TaskCreationWizard.tsx` - 任务创建向导
4. `WelcomeScreen.tsx` - 欢迎屏幕

**优先级 P1（核心功能）：**
5. `KanbanBoard.tsx` - 看板视图
6. `Terminal.tsx` / `TerminalGrid.tsx` - 终端界面
7. `Roadmap.tsx` - 路线图
8. `Insights.tsx` - 洞察
9. `TaskDetailModal.tsx` - 任务详情

**优先级 P2（辅助功能）：**
10. `Changelog.tsx`
11. `Context.tsx`
12. `Ideation.tsx`
13. `GitHubIssues.tsx`
14. `Worktrees.tsx`

#### 1.3 扩展翻译文件

每个组件汉化时，需要同步更新对应的翻译文件。例如：

**settings.json 需要扩展为：**
```json
{
  "title": "设置",
  "tabs": {
    "general": "常规",
    "integrations": "集成",
    "projects": "项目",
    "advanced": "高级"
  },
  "general": {
    "theme": "主题",
    "language": "语言",
    "autoUpdate": "自动更新"
  },
  "integrations": {
    "claude": "Claude 账户",
    "github": "GitHub",
    "openai": "OpenAI"
  }
  // ... 更多字段
}
```

### 阶段 2：后端提示词汉化（预计 2-3 天）

#### 2.1 创建中文提示词目录
```bash
mkdir -p apps/backend/prompts/zh-CN
```

#### 2.2 翻译核心提示词文件
需要翻译的文件（按优先级）：
1. `coder.md` → `zh-CN/coder.md`
2. `planner.md` → `zh-CN/planner.md`
3. `qa_reviewer.md` → `zh-CN/qa_reviewer.md`
4. `spec_writer.md` → `zh-CN/spec_writer.md`
5. 所有 `ideation_*.md` 文件

#### 2.3 修改提示词加载逻辑
**文件：** `apps/backend/prompts_pkg/prompts.py`

需要添加语言检测逻辑：
```python
import os

def get_prompt_language():
    """从环境变量或配置获取语言设置"""
    return os.environ.get('AUTO_CLAUDE_LANG', 'en')

def get_planner_prompt(spec_dir: Path) -> str:
    lang = get_prompt_language()
    prompt_file = PROMPTS_DIR / lang / "planner.md" if lang != 'en' else PROMPTS_DIR / "planner.md"
    
    if not prompt_file.exists():
        # 回退到英文
        prompt_file = PROMPTS_DIR / "planner.md"
    
    # ... 其余逻辑
```

### 阶段 3：语言切换功能（预计 1 天）

#### 3.1 添加语言选择器组件
**文件：** `src/renderer/components/LanguageSelector.tsx`

```typescript
import { useTranslation } from 'react-i18next';
import { Select } from './ui/select';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  
  const handleChange = (lang: string) => {
    i18n.changeLanguage(lang);
    // 同时更新后端语言设置
    window.electronAPI.setLanguage(lang);
  };

  return (
    <Select value={i18n.language} onValueChange={handleChange}>
      <option value="en">English</option>
      <option value="zh-CN">简体中文</option>
    </Select>
  );
}
```

#### 3.2 集成到设置页面
在 `AppSettings.tsx` 的"常规"标签页添加语言选择器。

## 🛠️ 自动化工具

### 工具 1：文本提取工具
创建一个脚本来自动提取组件中的硬编码文本：

```bash
node scripts/extract-i18n-texts.cjs ComponentName.tsx
```

### 工具 2：翻译验证工具
验证所有翻译键是否都有对应的值：

```bash
node scripts/validate-i18n.cjs
```

### 工具 3：批量翻译工具
使用 AI 批量翻译提取的文本（需要人工审核）。

## 📊 进度追踪

### 前端组件汉化进度
- [ ] 0/90 组件已汉化

### 后端提示词汉化进度
- [ ] 0/20 提示词文件已翻译

### 翻译文件完善度
- [x] common.json - 100%
- [x] sidebar.json - 100%
- [ ] settings.json - 10%
- [ ] tasks.json - 10%
- [ ] terminal.json - 10%
- [ ] roadmap.json - 5%
- [ ] insights.json - 5%
- [ ] ideation.json - 5%
- [ ] context.json - 5%
- [ ] changelog.json - 5%
- [ ] github.json - 5%
- [ ] worktrees.json - 5%
- [ ] onboarding.json - 5%
- [ ] errors.json - 30%

## 🎯 快速开始

### 立即开始汉化第一个组件

1. **修改 Sidebar.tsx**
```typescript
// 添加导入
import { useTranslation } from 'react-i18next';

// 在组件内
const { t } = useTranslation(['sidebar', 'common']);

// 替换文本
// 之前：<span>Auto Claude</span>
// 之后：<span>{t('sidebar:title')}</span>
```

2. **在主应用中初始化 i18n**
```typescript
// src/renderer/App.tsx 顶部
import './i18n';
```

3. **测试**
```bash
npm run dev
```

## 📝 注意事项

1. **保持键名一致性**：使用 camelCase 命名翻译键
2. **避免硬编码**：所有用户可见文本都应通过 t() 函数
3. **上下文命名空间**：使用命名空间组织翻译（如 `sidebar:`, `tasks:`）
4. **占位符格式**：使用 `{{variable}}` 格式插入动态内容
5. **复数形式**：使用 i18next 的复数功能处理单复数

## 🔗 相关资源

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [翻译最佳实践](https://www.i18next.com/principles/fallback)

---

**最后更新：** 2025-12-24
**维护者：** Auto Claude 团队
