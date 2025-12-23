# Auto Claude 国际化（i18n）

本目录包含 Auto Claude 项目的国际化实施相关文档和工具。

## 📚 文档

- **[🎉 汉化完成报告](./I18N_COMPLETION_REPORT.md)** - 🏆 全面汉化项目最终成果和总结
- **[全面汉化计划](./I18N_FULL_LOCALIZATION_PLAN.md)** - 🎯 完整的汉化策略、进度和行动计划
- **[汉化待办清单](./I18N_TODO.md)** - ✅ 详细的待汉化组件清单和翻译建议
- **[检查清单](./I18N_CHECKLIST.md)** - ✅ 详细的任务清单和进度跟踪
- **[最终报告](./I18N_FINAL_REPORT.md)** - 📄 完整的 i18n 实施总结报告
- **[当前状态](./I18N_CURRENT_STATUS.md)** - 📊 i18n 实施当前状态、进度和下一步计划
- **[快速开始指南](./I18N_QUICK_START.md)** - 5分钟快速上手，开始汉化第一个组件
- **[完整实施指南](./I18N_IMPLEMENTATION_GUIDE.md)** - 详细的汉化步骤和最佳实践
- **[工作总结](./I18N_SUMMARY.md)** - 当前进度和已完成工作概览

## 🚀 快速开始

### 1. 查看当前进度
```bash
cd apps/frontend
node scripts/i18n-progress.cjs
```

### 2. 开始汉化组件
```bash
# 提取组件中的文本
node scripts/extract-i18n-texts.cjs src/renderer/components/Sidebar.tsx

# 按照输出的建议修改组件和翻译文件

# 测试
npm run dev
```

### 3. 添加语言选择器
在设置页面中导入并使用 `LanguageSelector` 组件。

## 🛠️ 可用工具

| 工具 | 用途 | 命令 |
|------|------|------|
| 进度追踪 | 查看汉化进度 | `node scripts/i18n-progress.cjs` |
| 文本提取 | 提取组件中的文本 | `node scripts/extract-i18n-texts.cjs <file>` |
| 文件生成 | 生成翻译文件骨架 | `node scripts/generate-i18n-files.cjs` |

## 📊 当前状态

- ✅ **基础设施**：100% 完成
- ✅ **翻译文件**：100% 完成（151 个翻译键）
- ⏳ **组件汉化**：2% 完成（1/53 组件）

## 🎯 下一步

1. 阅读[快速开始指南](./I18N_QUICK_START.md)
2. 使用工具汉化第一个组件
3. 逐步完成剩余组件的汉化

## 💡 需要帮助？

查看[完整实施指南](./I18N_IMPLEMENTATION_GUIDE.md)或参考 [i18next 官方文档](https://www.i18next.com/)。
