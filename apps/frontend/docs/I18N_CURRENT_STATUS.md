# Auto Claude 国际化(i18n)当前状态

## 📋 概览

Auto Claude 应用的国际化基础设施已经搭建完成,支持英语(en)和简体中文(zh-CN)两种语言。用户可以通过设置界面中的语言选择器切换界面语言。

## ✅ 已完成的工作

### 1. 基础设施搭建

- ✅ **i18n 库安装**
  - `i18next`: 核心国际化框架
  - `react-i18next`: React 集成
  - `i18next-browser-languagedetector`: 自动语言检测和持久化

- ✅ **配置文件创建**
  - `src/i18n/index.ts`: 主配置文件
  - 配置了语言检测顺序:`localStorage` → `navigator`
  - 设置了自动缓存到 `localStorage`

- ✅ **应用集成**
  - 在 `src/renderer/App.tsx` 中导入 i18n 配置
  - 全局启用国际化功能

### 2. 翻译资源管理

- ✅ **命名空间结构**
  创建了 14 个核心命名空间:
  - `common`: 通用 UI 元素
  - `sidebar`: 侧边栏导航
  - `settings`: 设置界面
  - `tasks`: 任务管理
  - `terminal`: 终端相关
  - `roadmap`: 路线图
  - `insights`: 洞察分析
  - `ideation`: 创意管理
  - `context`: 上下文管理
  - `changelog`: 更新日志
  - `github`: GitHub 集成
  - `worktrees`: 工作树管理
  - `onboarding`: 引导流程
  - `errors`: 错误消息

- ✅ **翻译文件创建**
  - 所有命名空间的英文和中文 JSON 文件已创建
  - 位置: `src/i18n/locales/{locale}/{namespace}.json`

- ✅ **初始翻译内容**
  - `common.json`: 完整翻译(88 个键)
  - `sidebar.json`: 完整翻译(562 个键)
  - 其他命名空间: 基础结构已创建,待填充

### 3. 语言切换功能

- ✅ **LanguageSelector 组件**
  - 位置: `src/renderer/components/LanguageSelector.tsx`
  - 使用原生 `<select>` 元素
  - 支持英语和简体中文切换
  - 自动持久化语言偏好到 localStorage

- ✅ **UI 集成**
  - 集成到 `GeneralSettings` 组件
  - 位于设置模态框的 "Paths" 标签页顶部
  - 显示双语标签: "Language / 语言"

### 4. 自动化工具

- ✅ **脚本工具**
  - `scripts/generate-i18n-files.cjs`: 批量生成翻译文件骨架
  - `scripts/extract-i18n-texts.cjs`: 从组件中提取硬编码字符串
  - `scripts/i18n-progress.cjs`: 跟踪本地化进度

- ✅ **文档**
  - `docs/I18N_IMPLEMENTATION_GUIDE.md`: 详细实施指南
  - `docs/I18N_QUICK_START.md`: 快速入门指南
  - `docs/I18N_SUMMARY.md`: 工作总结
  - `docs/README.md`: 资源索引

## 🔄 当前状态

### 翻译进度

| 类别 | 状态 | 说明 |
|------|------|------|
| **基础设施** | ✅ 100% | 完全配置完成 |
| **翻译文件结构** | ✅ 100% | 所有命名空间文件已创建 |
| **核心翻译内容** | 🟡 ~15% | `common` 和 `sidebar` 已完成 |
| **组件集成** | 🔴 ~2% | 仅少数组件使用了 `useTranslation` |
| **后端提示词** | 🔴 0% | 尚未开始 |

### 已知问题

1. **✅ 已解决: LanguageSelector API 调用错误**
   - **问题**: 调用未实现的 `window.electronAPI.updateSettings` 导致运行时错误
   - **解决方案**: 移除 API 调用,依赖 i18next 的自动持久化机制
   - **状态**: 已修复 ✅

2. **🟡 待处理: 组件翻译覆盖率低**
   - **问题**: 约 52 个前端组件尚未集成 i18n
   - **影响**: 大部分 UI 仍显示英文硬编码文本
   - **优先级**: 高

3. **🟡 待处理: 后端提示词本地化**
   - **问题**: `apps/backend/prompts/*.md` 文件未翻译
   - **影响**: 后端生成的提示词仍为英文
   - **优先级**: 中

## 📝 下一步工作

### 阶段 1: 前端组件翻译 (高优先级)

**目标**: 将所有前端组件集成 i18n

**步骤**:
1. 使用 `extract-i18n-texts.cjs` 工具提取组件中的硬编码字符串
2. 将提取的文本添加到相应的翻译文件中
3. 在组件中使用 `useTranslation` hook 替换硬编码文本
4. 测试语言切换功能

**优先组件列表**:
- [ ] `App.tsx` - 主应用组件
- [ ] `Sidebar.tsx` - 侧边栏(部分完成)
- [ ] `GeneralSettings.tsx` - 通用设置
- [ ] `KanbanView.tsx` - 看板视图
- [ ] `TerminalView.tsx` - 终端视图
- [ ] `RoadmapView.tsx` - 路线图视图
- [ ] 其他 ~47 个组件

**示例代码**:
```typescript
// 1. 导入 hook
import { useTranslation } from 'react-i18next';

// 2. 在组件中使用
export function MyComponent() {
  const { t } = useTranslation('namespace');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
    </div>
  );
}
```

### 阶段 2: 完善翻译内容 (中优先级)

**目标**: 填充所有命名空间的翻译内容

**步骤**:
1. 审查并完善 `settings.json` 翻译
2. 审查并完善 `tasks.json` 翻译
3. 审查并完善 `terminal.json` 翻译
4. 完成其余 11 个命名空间的翻译

**质量标准**:
- 翻译准确,符合上下文
- 保持术语一致性
- 遵循中文本地化习惯
- 避免机器翻译的生硬感

### 阶段 3: 后端提示词本地化 (中优先级)

**目标**: 实现后端提示词的多语言支持

**步骤**:
1. 创建 `apps/backend/prompts/zh-CN/` 目录
2. 翻译所有 `.md` 提示词文件
3. 修改 `apps/backend/prompts_pkg/prompts.py`:
   - 添加语言检测逻辑(读取环境变量 `AUTO_CLAUDE_LANG`)
   - 根据语言动态加载对应的提示词文件
4. 测试中英文提示词切换

**示例实现**:
```python
import os

def get_prompt_path(prompt_name: str) -> str:
    lang = os.getenv('AUTO_CLAUDE_LANG', 'en')
    if lang == 'zh-CN':
        return f'prompts/zh-CN/{prompt_name}.md'
    return f'prompts/{prompt_name}.md'
```

### 阶段 4: 语言设置持久化 (低优先级)

**目标**: 实现跨 Electron 进程的语言设置同步

**步骤**:
1. 在主进程中定义 `updateSettings` IPC 处理器
2. 在渲染进程中正确类型化 `window.electronAPI.updateSettings`
3. 在 `LanguageSelector` 中重新启用 API 调用
4. 确保语言设置在应用重启后保持一致

**注意**: 当前通过 localStorage 已实现基本持久化,此步骤为增强功能

### 阶段 5: 测试与优化 (持续进行)

**测试清单**:
- [ ] 语言切换即时生效
- [ ] 刷新页面后语言保持
- [ ] 所有 UI 元素正确翻译
- [ ] 无遗漏的硬编码文本
- [ ] 中文排版美观
- [ ] 性能无明显影响

**优化方向**:
- 延迟加载翻译文件
- 减小翻译文件体积
- 优化语言检测逻辑

## 🛠️ 使用工具

### 提取组件中的文本

```bash
cd apps/frontend
node scripts/extract-i18n-texts.cjs src/renderer/components/YourComponent.tsx
```

### 检查本地化进度

```bash
cd apps/frontend
node scripts/i18n-progress.cjs
```

### 生成翻译文件骨架

```bash
cd apps/frontend
node scripts/generate-i18n-files.cjs
```

## 📚 参考资源

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [项目实施指南](./I18N_IMPLEMENTATION_GUIDE.md)
- [快速入门指南](./I18N_QUICK_START.md)

## 🎯 成功标准

项目完全本地化的标准:

1. ✅ **基础设施**: i18n 配置完整且稳定
2. 🟡 **前端覆盖**: 100% 组件使用 i18n (当前 ~2%)
3. 🟡 **翻译质量**: 所有翻译准确、自然、一致
4. 🔴 **后端支持**: 提示词支持多语言 (当前 0%)
5. ✅ **用户体验**: 语言切换流畅,无闪烁或错误
6. ✅ **持久化**: 语言偏好正确保存和恢复

## 📞 需要帮助?

如果在本地化过程中遇到问题:

1. 查看 `docs/I18N_IMPLEMENTATION_GUIDE.md` 获取详细指导
2. 使用 `extract-i18n-texts.cjs` 工具辅助提取文本
3. 参考已完成的 `common.json` 和 `sidebar.json` 作为示例
4. 保持翻译键的命名清晰和一致

---

**最后更新**: 2025-12-23  
**当前版本**: v2.7.2  
**维护者**: Auto Claude Team
