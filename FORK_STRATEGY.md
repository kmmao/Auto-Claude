# Fork管理策略

本文档说明如何在保持与上游同步的同时，管理你自己的自定义功能。

## 🎯 分层原则

### ✅ 第1层：核心中文化（已完成，永久保留）
这些修改应该**始终保留**，因为它们是你fork的核心价值：

- `apps/frontend/src/shared/i18n/locales/zh-CN/*.json` (25个文件)
- `apps/backend/prompts/*.md` 中的Language Rule (19个文件)
- `CLAUDE.md` 中的全局语言规则
- `apps/backend/.env.example` 中的USE_CLAUDE_MD配置

**冲突概率**: <5%
**维护策略**: 永久保留，每周同步

---

### ✅ 第2层：可选增强功能（选择性保留）
这些是你自己添加的功能，可能与上游冲突：

**建议管理方式**:

#### 方式A: 使用Git分支（推荐）
```bash
# 创建一个"增强"分支，在develop基础上添加你的功能
git checkout -b develop-enhanced develop

# 在这个分支上添加你的自定义功能
# ... 开发 ...
git commit -m "feat: 我的自定义功能"

# 日常使用develop-enhanced分支
# 但每周先同步develop
./sync-upstream.sh  # 同步develop分支

# 然后rebase你的增强分支
git checkout develop-enhanced
git rebase develop
```

这样：
- `develop`分支保持"干净"，只有中文化
- `develop-enhanced`分支包含你的所有自定义功能
- 每周同步时，先同步develop，再rebase你的增强分支

#### 方式B: 使用功能开关（适合小功能）
```bash
# 在代码中使用环境变量控制你的自定义功能
# apps/backend/.env
ENABLE_MY_CUSTOM_FEATURE=true

# 代码中
if os.environ.get("ENABLE_MY_CUSTOM_FEATURE") == "true":
    # 你的自定义逻辑
    pass
```

这样你的修改很小，不会与上游冲突。

---

### 🚫 第3层：实验性功能（临时分支）
完全实验性的功能，可能随时废弃：

```bash
# 创建临时分支
git checkout -b experiment/new-idea develop

# 实验完成后，如果成功，合并到develop-enhanced
# 如果失败，直接删除分支
git branch -D experiment/new-idea
```

---

## 📋 推荐的分支策略

```
upstream/develop (上游)
    ↓ (每周同步)
develop (你的主分支：只包含中文化)
    ↓ (rebase)
develop-enhanced (你的日常分支：中文化 + 自定义功能)
    ↓ (可选)
experiment/* (实验分支)
```

**日常工作流程**:
1. 平时在`develop-enhanced`分支开发
2. 每周日运行`./sync-upstream.sh`同步`develop`分支
3. 然后rebase `develop-enhanced`到最新的`develop`
4. 如果有冲突，解决后继续

---

## 🛠️ 实用命令

### 查看你的自定义提交
```bash
# 查看相比上游，你额外添加的提交
git log upstream/develop..develop --oneline
```

### 查看你的自定义文件
```bash
# 查看相比上游，你修改的文件
git diff upstream/develop --name-only
```

### 检查某个文件是否会冲突
```bash
# 检查特定文件的差异
git diff upstream/develop -- apps/backend/core/client.py
```

### 创建增强分支（如果还没有）
```bash
# 基于当前develop创建增强分支
git checkout develop
git checkout -b develop-enhanced

# 推送到远程（可选）
git push origin develop-enhanced
```

### 每周同步流程（使用增强分支）
```bash
# 1. 同步develop分支
./sync-upstream.sh

# 2. 切换到增强分支
git checkout develop-enhanced

# 3. Rebase到最新的develop
git rebase develop

# 4. 如果有冲突，解决冲突
git add <冲突文件>
git rebase --continue

# 5. 强制推送增强分支（如果推送到远程）
git push origin develop-enhanced --force-with-lease
```

---

## ⚠️ 重要警告

### ❌ 不要直接修改这些文件（高冲突风险）
如果你修改了以下文件，未来同步上游时很可能冲突：

- `apps/backend/core/client.py` - 核心客户端代码
- `apps/backend/agents/*.py` - Agent实现
- `apps/frontend/src/components/` - 核心UI组件
- `package.json`, `requirements.txt` - 依赖配置

**如果必须修改**:
1. 先考虑能否通过配置、插件、环境变量实现
2. 如果必须修改，在`develop-enhanced`分支上修改
3. 每周同步时仔细检查冲突

### ✅ 安全的自定义位置
这些地方添加自定义功能相对安全：

- `apps/backend/.env` - 环境变量配置
- `CLAUDE.md` - 项目级指令（已修改，但很少冲突）
- `apps/frontend/src/shared/i18n/` - 翻译文件（独立模块）
- 新增插件/扩展目录（如果项目支持）

---

## 🎓 最佳实践

### 1. 最小化修改原则
**优先级顺序**:
1. 能用配置解决 → 修改.env
2. 能用CLAUDE.md解决 → 添加指令
3. 能用插件解决 → 开发插件
4. 必须改代码 → 在develop-enhanced分支修改

### 2. 定期审查自定义功能
每个月检查一次：
```bash
# 查看你的自定义提交
git log upstream/develop..develop-enhanced --oneline

# 问自己：
# - 这个功能我还在用吗？
# - 上游是否已经实现了类似功能？
# - 能否简化或移除？
```

### 3. 文档化你的修改
在这个文件末尾维护一个"当前自定义功能清单"：

---

## 📝 当前自定义功能清单

### 核心中文化（develop分支）
- [ ] 前端UI中文翻译 (25个文件)
- [ ] AI Prompt Language Rule (19个文件)
- [ ] CLAUDE.md全局语言规则
- [ ] .env.example USE_CLAUDE_MD配置

### 自定义增强功能（develop-enhanced分支）
> 在这里记录你添加的自定义功能

示例：
- [ ] 自定义功能1: XXX （文件：apps/backend/xxx.py, 提交: abc1234）
- [ ] 自定义功能2: YYY （文件：apps/frontend/yyy.tsx, 提交: def5678）

### 实验性功能（临时分支）
> 记录你的实验分支

示例：
- [ ] experiment/new-ai-model - 测试新的AI模型集成 (分支创建日期: 2026-01-10)

---

## 🆘 遇到问题时

### 问题1: sync-upstream.sh遇到冲突
```bash
# 查看冲突文件
git status

# 对于中文化文件（保留你的版本）
git checkout --ours apps/frontend/src/shared/i18n/locales/zh-CN/*.json
git checkout --ours apps/backend/prompts/*.md

# 对于其他文件，手动解决冲突
# 编辑冲突文件，然后：
git add <已解决的文件>
git rebase --continue
```

### 问题2: 想要放弃某个自定义功能
```bash
# 使用git revert回退特定提交
git revert <commit-hash>

# 或者使用interactive rebase删除提交
git rebase -i upstream/develop
# 在编辑器中删除不需要的提交行
```

### 问题3: 想要重新开始
```bash
# 如果develop-enhanced分支太乱了，重新创建
git checkout develop
git branch -D develop-enhanced
git checkout -b develop-enhanced

# 重新添加你需要的功能
```

---

## 📚 相关资源

- 每周同步脚本: `./sync-upstream.sh`
- Fork重建脚本: `./rebuild-clean-fork.sh` (仅在需要重置时使用)
- Git工作流文档: https://git-scm.com/book/zh/v2
