# 🚀 Auto Claude 汉化快速开始指南

## ✅ 已完成的工作

我已经为您完成了以下基础设施搭建：

### 1. 安装依赖 ✓
```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### 2. 创建 i18n 配置 ✓
- ✅ `src/i18n/index.ts` - 核心配置文件
- ✅ `src/i18n/locales/en/` - 英文翻译目录
- ✅ `src/i18n/locales/zh-CN/` - 中文翻译目录

### 3. 生成翻译文件骨架 ✓
已创建 14 个命名空间的翻译文件：
- ✅ common.json (通用词汇 - 70+ 条目)
- ✅ sidebar.json (侧边栏 - 完整翻译)
- ⚠️ settings.json (需扩展)
- ⚠️ tasks.json (需扩展)
- ⚠️ terminal.json (需扩展)
- ⚠️ roadmap.json (需扩展)
- ⚠️ insights.json (需扩展)
- ⚠️ ideation.json (需扩展)
- ⚠️ context.json (需扩展)
- ⚠️ changelog.json (需扩展)
- ⚠️ github.json (需扩展)
- ⚠️ worktrees.json (需扩展)
- ⚠️ onboarding.json (需扩展)
- ⚠️ errors.json (需扩展)

### 4. 集成到主应用 ✓
- ✅ 在 `App.tsx` 中初始化 i18n

### 5. 创建工具 ✓
- ✅ `LanguageSelector.tsx` - 语言切换组件
- ✅ `scripts/extract-i18n-texts.cjs` - 文本提取工具
- ✅ `scripts/generate-i18n-files.cjs` - 翻译文件生成工具

## 📋 下一步：开始汉化组件

### 方法 1：使用自动化工具（推荐）

#### 步骤 1：提取组件中的文本
```bash
cd apps/frontend
node scripts/extract-i18n-texts.cjs src/renderer/components/Sidebar.tsx
```

这将输出：
- 所有需要翻译的文本
- 建议的翻译键名
- 需要添加到翻译文件的 JSON

#### 步骤 2：将提取的文本添加到翻译文件
将工具输出的 JSON 复制到对应的翻译文件中。

#### 步骤 3：修改组件使用 i18n
```typescript
// 在组件顶部添加
import { useTranslation } from 'react-i18next';

// 在组件内部
export function Sidebar() {
  const { t } = useTranslation(['sidebar', 'common']);
  
  // 替换硬编码文本
  return (
    <div>
      <h1>{t('sidebar:title')}</h1>
      <button>{t('common:settings')}</button>
    </div>
  );
}
```

### 方法 2：手动汉化

#### 示例：汉化 Sidebar 组件

**1. 修改 `Sidebar.tsx`**
```typescript
import { useTranslation } from 'react-i18next';

export function Sidebar({ ... }: SidebarProps) {
  const { t } = useTranslation(['sidebar', 'common']);
  
  // 替换所有硬编码文本
  // 之前：<span>Auto Claude</span>
  // 之后：<span>{t('sidebar:title')}</span>
  
  // 之前：<span>Kanban Board</span>
  // 之后：<span>{t('sidebar:views.kanban')}</span>
}
```

**2. 更新翻译文件**

`src/i18n/locales/zh-CN/sidebar.json`:
```json
{
  "title": "Auto Claude",
  "views": {
    "kanban": "看板",
    "terminals": "代理终端",
    ...
  }
}
```

## 🎯 优先级清单

### 第一批（立即开始）
1. [ ] Sidebar.tsx
2. [ ] WelcomeScreen.tsx
3. [ ] TaskCreationWizard.tsx
4. [ ] AppSettings.tsx

### 第二批（核心功能）
5. [ ] KanbanBoard.tsx
6. [ ] TerminalGrid.tsx
7. [ ] Roadmap.tsx
8. [ ] Insights.tsx

### 第三批（辅助功能）
9. [ ] Changelog.tsx
10. [ ] Context.tsx
11. [ ] Ideation.tsx
12. [ ] GitHubIssues.tsx

## 🔧 添加语言选择器

在设置页面中添加语言选择器：

```typescript
// 在 AppSettings.tsx 或 GeneralSettings.tsx 中
import { LanguageSelector } from './LanguageSelector';

// 在设置表单中添加
<LanguageSelector />
```

## 📊 测试汉化效果

### 1. 启动开发服务器
```bash
npm run dev
```

### 2. 切换语言
- 打开应用设置
- 找到语言选择器
- 选择"简体中文"

### 3. 验证翻译
检查所有已汉化的组件是否正确显示中文。

## 🐛 常见问题

### Q: 翻译不生效？
**A:** 确保：
1. 已在 `App.tsx` 中导入 `../i18n`
2. 组件中正确使用了 `useTranslation` hook
3. 翻译键名与 JSON 文件中的键名完全匹配

### Q: 如何处理动态文本？
**A:** 使用插值：
```typescript
// 翻译文件
{
  "welcome": "Welcome, {{name}}!"
}

// 组件中
t('common:welcome', { name: userName })
```

### Q: 如何处理复数形式？
**A:** 使用 i18next 的复数功能：
```json
{
  "itemCount": "{{count}} item",
  "itemCount_plural": "{{count}} items"
}
```

```typescript
t('common:itemCount', { count: 5 })
```

## 📚 相关文档

- [完整实施指南](./I18N_IMPLEMENTATION_GUIDE.md)
- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)

## 💡 提示

1. **保持一致性**：使用相同的命名约定（camelCase）
2. **避免重复**：将通用文本放在 `common.json` 中
3. **上下文清晰**：使用命名空间组织翻译
4. **测试驱动**：每汉化一个组件就测试一次

---

**准备好了吗？** 运行以下命令开始汉化第一个组件：

```bash
cd apps/frontend
node scripts/extract-i18n-texts.cjs src/renderer/components/Sidebar.tsx
```

祝您汉化顺利！🎉
