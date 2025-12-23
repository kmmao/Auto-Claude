# Auto Claude i18n 实施检查清单

本文档记录了 Auto Claude 国际化(i18n)项目的所有完成项和待办事项。

## ✅ 已完成项

### 阶段 1: 基础设施搭建

- [x] 安装 i18n 依赖包
  - [x] `i18next` (v23.11.5)
  - [x] `react-i18next` (v23.11.5)
  - [x] `i18next-browser-languagedetector` (v8.0.0)

- [x] 创建 i18n 配置文件
  - [x] `src/i18n/index.ts`
  - [x] 配置语言检测器
  - [x] 配置 localStorage 持久化
  - [x] 设置回退语言

- [x] 集成到主应用
  - [x] 在 `App.tsx` 中导入 i18n
  - [x] 验证全局可用性

### 阶段 2: 翻译资源管理

- [x] 创建命名空间结构
  - [x] `common` - 通用 UI 元素
  - [x] `sidebar` - 侧边栏导航
  - [x] `settings` - 设置界面
  - [x] `tasks` - 任务管理
  - [x] `terminal` - 终端相关
  - [x] `roadmap` - 路线图
  - [x] `insights` - 洞察分析
  - [x] `ideation` - 创意管理
  - [x] `context` - 上下文管理
  - [x] `changelog` - 更新日志
  - [x] `github` - GitHub 集成
  - [x] `worktrees` - 工作树管理
  - [x] `onboarding` - 引导流程
  - [x] `errors` - 错误消息

- [x] 创建翻译文件
  - [x] 英文 (en) - 14 个文件
  - [x] 简体中文 (zh-CN) - 14 个文件

- [x] 填充翻译内容
  - [x] `common.json` - 98.7% (76/77)
  - [x] `sidebar.json` - 73.8% (31/42)
  - [x] `settings.json` - 100% (5/5)
  - [x] `tasks.json` - 100% (12/12)
  - [x] `terminal.json` - 100% (4/4)
  - [x] `roadmap.json` - 100% (1/1)
  - [x] `insights.json` - 100% (1/1)
  - [x] `ideation.json` - 100% (1/1)
  - [x] `context.json` - 100% (1/1)
  - [x] `changelog.json` - 100% (1/1)
  - [x] `github.json` - 100% (1/1)
  - [x] `worktrees.json` - 100% (1/1)
  - [x] `onboarding.json` - 100% (1/1)
  - [x] `errors.json` - 100% (3/3)

### 阶段 3: 语言切换功能

- [x] 创建 LanguageSelector 组件
  - [x] 使用原生 `<select>` 元素
  - [x] 支持英语和简体中文
  - [x] 显示双语标签
  - [x] 实现语言切换逻辑
  - [x] 移除有问题的 API 调用

- [x] 集成到 UI
  - [x] 添加到 `GeneralSettings` 组件
  - [x] 放置在 "Paths" 标签页顶部
  - [x] 测试功能正常

- [x] 实现持久化
  - [x] 配置 localStorage 缓存
  - [x] 测试刷新后保持
  - [x] 验证跨会话保持

### 阶段 4: 自动化工具

- [x] 创建文本提取工具
  - [x] `scripts/extract-i18n-texts.cjs`
  - [x] 支持 React 组件解析
  - [x] 生成翻译键建议
  - [x] 输出 JSON 格式

- [x] 创建文件生成工具
  - [x] `scripts/generate-i18n-files.cjs`
  - [x] 批量生成翻译文件
  - [x] 支持所有命名空间

- [x] 创建进度追踪工具
  - [x] `scripts/i18n-progress.cjs`
  - [x] 统计翻译键数量
  - [x] 统计组件集成数量
  - [x] 生成进度报告

- [x] 创建验证工具
  - [x] `scripts/verify-i18n.cjs`
  - [x] 检查文件存在性
  - [x] 验证 JSON 格式
  - [x] 检查翻译键匹配
  - [x] 验证配置完整性

### 阶段 5: 文档编写

- [x] 创建实施指南
  - [x] `docs/I18N_IMPLEMENTATION_GUIDE.md`
  - [x] 详细步骤说明
  - [x] 最佳实践
  - [x] 常见问题解答

- [x] 创建快速开始指南
  - [x] `docs/I18N_QUICK_START.md`
  - [x] 5分钟上手教程
  - [x] 工具使用说明
  - [x] 示例代码

- [x] 创建工作总结
  - [x] `docs/I18N_SUMMARY.md`
  - [x] 已完成工作
  - [x] 当前进度
  - [x] 下一步计划

- [x] 创建当前状态文档
  - [x] `docs/I18N_CURRENT_STATUS.md`
  - [x] 详细进度报告
  - [x] 已知问题
  - [x] 下一步工作

- [x] 创建最终报告
  - [x] `docs/I18N_FINAL_REPORT.md`
  - [x] 完整总结
  - [x] 技术实现细节
  - [x] 最佳实践

- [x] 创建文档索引
  - [x] `docs/README.md`
  - [x] 所有文档链接
  - [x] 快速导航

- [x] 更新主 README
  - [x] 添加 i18n 部分
  - [x] 说明支持的语言
  - [x] 使用说明

### 阶段 6: 问题修复

- [x] 修复 LanguageSelector 白屏问题
  - [x] 识别问题原因
  - [x] 移除未实现的 API 调用
  - [x] 简化组件实现
  - [x] 测试验证

- [x] 验证 i18n 配置
  - [x] 运行验证脚本
  - [x] 确认所有文件存在
  - [x] 确认 JSON 格式正确
  - [x] 确认翻译键匹配

## 🔄 进行中

### 组件翻译

- [ ] `App.tsx` - 主应用组件
- [ ] `Sidebar.tsx` - 侧边栏 (部分完成)
- [ ] `KanbanView.tsx` - 看板视图
- [ ] `TerminalView.tsx` - 终端视图
- [ ] `RoadmapView.tsx` - 路线图视图
- [ ] 其他 ~47 个组件

### 翻译内容完善

- [ ] `common.json` - 补充 1 个缺失的翻译
- [ ] `sidebar.json` - 补充 11 个缺失的翻译

## 📋 待办事项

### 优先级 1: 前端组件翻译 (高)

**目标**: 将所有前端组件集成 i18n

**任务列表**:
1. [ ] 使用 `extract-i18n-texts.cjs` 提取组件文本
2. [ ] 将提取的文本添加到翻译文件
3. [ ] 在组件中使用 `useTranslation` hook
4. [ ] 测试语言切换功能
5. [ ] 验证翻译质量

**预估时间**: 2-3 天

**组件清单** (按优先级排序):
1. [ ] `App.tsx` - 主应用
2. [ ] `Sidebar.tsx` - 侧边栏
3. [ ] `GeneralSettings.tsx` - 通用设置
4. [ ] `KanbanView.tsx` - 看板视图
5. [ ] `TaskCard.tsx` - 任务卡片
6. [ ] `TerminalView.tsx` - 终端视图
7. [ ] `RoadmapView.tsx` - 路线图
8. [ ] `InsightsView.tsx` - 洞察
9. [ ] `IdeationView.tsx` - 创意
10. [ ] `ChangelogView.tsx` - 更新日志
11. [ ] 其他组件...

### 优先级 2: 完善翻译内容 (中)

**目标**: 完成剩余 7.9% 的翻译

**任务列表**:
1. [ ] 审查 `common.json` 翻译质量
2. [ ] 补充 `common.json` 缺失的 1 个翻译
3. [ ] 审查 `sidebar.json` 翻译质量
4. [ ] 补充 `sidebar.json` 缺失的 11 个翻译
5. [ ] 统一术语和风格
6. [ ] 运行验证脚本确认

**预估时间**: 1 天

### 优先级 3: 后端提示词本地化 (中)

**目标**: 实现后端提示词的多语言支持

**任务列表**:
1. [ ] 创建 `apps/backend/prompts/zh-CN/` 目录
2. [ ] 翻译所有 `.md` 提示词文件
   - [ ] `agent_prompt.md`
   - [ ] `spec_prompt.md`
   - [ ] `qa_prompt.md`
   - [ ] 其他提示词文件...
3. [ ] 修改 `apps/backend/prompts_pkg/prompts.py`
   - [ ] 添加语言检测逻辑
   - [ ] 根据语言动态加载提示词
   - [ ] 添加环境变量 `AUTO_CLAUDE_LANG`
4. [ ] 测试中英文提示词切换
5. [ ] 更新文档

**预估时间**: 2-3 天

### 优先级 4: 语言设置 API (低)

**目标**: 实现跨 Electron 进程的语言设置同步

**任务列表**:
1. [ ] 在主进程中定义 `updateSettings` IPC 处理器
2. [ ] 在渲染进程中正确类型化 `window.electronAPI.updateSettings`
3. [ ] 在 `LanguageSelector` 中重新启用 API 调用
4. [ ] 测试设置同步
5. [ ] 验证跨进程一致性

**注意**: 当前通过 localStorage 已实现基本持久化

**预估时间**: 1 天

### 优先级 5: 测试与优化 (持续)

**任务列表**:
1. [ ] 功能测试
   - [ ] 语言切换即时生效
   - [ ] 刷新页面后语言保持
   - [ ] 所有 UI 元素正确翻译
2. [ ] 质量检查
   - [ ] 无遗漏的硬编码文本
   - [ ] 中文排版美观
   - [ ] 术语使用一致
3. [ ] 性能优化
   - [ ] 延迟加载翻译文件
   - [ ] 减小翻译文件体积
   - [ ] 优化语言检测逻辑
4. [ ] 文档更新
   - [ ] 更新进度报告
   - [ ] 补充使用示例
   - [ ] 添加常见问题

## 📊 进度统计

### 总体进度

| 类别 | 进度 | 状态 |
|------|------|------|
| 基础设施 | 100% | ✅ 完成 |
| 翻译文件结构 | 100% | ✅ 完成 |
| 翻译内容 | 92.1% | 🟡 进行中 |
| 组件集成 | ~2% | 🔴 待开始 |
| 后端提示词 | 0% | 🔴 待开始 |
| 文档 | 100% | ✅ 完成 |
| 工具 | 100% | ✅ 完成 |

### 翻译内容详情

| 命名空间 | 进度 | 状态 |
|---------|------|------|
| common | 98.7% (76/77) | 🟡 |
| sidebar | 73.8% (31/42) | 🟡 |
| settings | 100% (5/5) | ✅ |
| tasks | 100% (12/12) | ✅ |
| terminal | 100% (4/4) | ✅ |
| roadmap | 100% (1/1) | ✅ |
| insights | 100% (1/1) | ✅ |
| ideation | 100% (1/1) | ✅ |
| context | 100% (1/1) | ✅ |
| changelog | 100% (1/1) | ✅ |
| github | 100% (1/1) | ✅ |
| worktrees | 100% (1/1) | ✅ |
| onboarding | 100% (1/1) | ✅ |
| errors | 100% (3/3) | ✅ |

**总计**: 139/151 (92.1%)

## 🎯 里程碑

- [x] **里程碑 1**: 基础设施搭建完成 (2025-12-23)
- [x] **里程碑 2**: 翻译文件创建完成 (2025-12-23)
- [x] **里程碑 3**: 语言切换功能实现 (2025-12-23)
- [x] **里程碑 4**: 自动化工具开发完成 (2025-12-23)
- [x] **里程碑 5**: 文档编写完成 (2025-12-23)
- [ ] **里程碑 6**: 前端组件翻译完成 (目标: TBD)
- [ ] **里程碑 7**: 后端提示词本地化完成 (目标: TBD)
- [ ] **里程碑 8**: 项目完全本地化 (目标: TBD)

## 📝 备注

### 已知限制

1. **组件集成进度低**: 仅约 2% 的组件使用了 i18n,需要系统性地翻译所有组件
2. **后端未本地化**: 后端提示词仍为英文,需要创建中文版本
3. **语言设置 API**: 当前依赖 localStorage,未实现跨进程同步

### 下一步行动

1. **立即行动**: 开始翻译高优先级组件 (App.tsx, Sidebar.tsx)
2. **本周目标**: 完成至少 10 个核心组件的翻译
3. **本月目标**: 完成所有前端组件的翻译

### 资源链接

- [i18next 官方文档](https://www.i18next.com/)
- [react-i18next 文档](https://react.i18next.com/)
- [项目文档索引](./docs/README.md)

---

**最后更新**: 2025-12-23  
**当前版本**: v2.7.2  
**维护者**: Auto Claude Team
