#!/bin/bash
# ============================================
# Auto-Claude 干净Fork重建脚本
# ============================================
# 功能：从上游重建干净分支，只保留必要的中文化修改
# 作者：AI助手生成
# 日期：2026-01-10
# ============================================

set -e  # 遇到错误立即退出

echo "================================================"
echo "🚀 Auto-Claude 干净Fork重建流程"
echo "================================================"
echo ""

# 检查是否在正确的目录
if [ ! -f "CLAUDE.md" ]; then
    echo "❌ 错误：请在项目根目录执行此脚本"
    exit 1
fi

# ============================================
# 第一步：备份当前工作
# ============================================
echo "📦 第一步：备份当前工作..."
echo ""

BACKUP_DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="/tmp/auto-claude-backup-${BACKUP_DATE}"

# 创建备份目录
mkdir -p "${BACKUP_DIR}"

# 备份当前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "当前分支: ${CURRENT_BRANCH}"
git branch "backup-${CURRENT_BRANCH}-${BACKUP_DATE}"
echo "✅ 已创建备份分支: backup-${CURRENT_BRANCH}-${BACKUP_DATE}"

# 备份i18n文件
if [ -d "apps/frontend/src/shared/i18n/locales/zh-CN" ]; then
    cp -r apps/frontend/src/shared/i18n/locales/zh-CN "${BACKUP_DIR}/"
    echo "✅ 已备份中文翻译文件到: ${BACKUP_DIR}/zh-CN/"
else
    echo "⚠️  未找到中文翻译文件"
fi

# 备份CLAUDE.md
cp CLAUDE.md "${BACKUP_DIR}/CLAUDE.md.backup"
echo "✅ 已备份CLAUDE.md到: ${BACKUP_DIR}/CLAUDE.md.backup"

echo ""
echo "备份完成！备份位置: ${BACKUP_DIR}"
echo ""

# ============================================
# 第二步：获取上游最新代码
# ============================================
echo "🔄 第二步：获取上游最新代码..."
echo ""

git fetch upstream
echo "✅ 已获取上游最新代码"
echo ""

# ============================================
# 第三步：创建干净分支
# ============================================
echo "🌟 第三步：创建干净分支..."
echo ""

# 检查是否存在develop-clean分支
if git show-ref --verify --quiet refs/heads/develop-clean; then
    echo "⚠️  develop-clean分支已存在，正在删除..."
    git branch -D develop-clean
fi

# 基于上游develop创建新分支
git checkout -b develop-clean upstream/develop
echo "✅ 已创建干净分支: develop-clean (基于upstream/develop)"

# 验证与上游一致
DIFF_COUNT=$(git diff upstream/develop | wc -l)
if [ "$DIFF_COUNT" -eq 0 ]; then
    echo "✅ 确认：新分支与上游完全一致"
else
    echo "⚠️  警告：新分支与上游有差异！"
fi
echo ""

# ============================================
# 第四步：恢复i18n翻译
# ============================================
echo "🌐 第四步：恢复中文翻译..."
echo ""

if [ -d "${BACKUP_DIR}/zh-CN" ]; then
    # 确保目录存在
    mkdir -p apps/frontend/src/shared/i18n/locales/

    # 复制翻译文件
    cp -r "${BACKUP_DIR}/zh-CN" apps/frontend/src/shared/i18n/locales/

    # 提交
    git add apps/frontend/src/shared/i18n/locales/zh-CN
    git commit -m "feat(i18n): add Chinese (zh-CN) translations for UI

- Add complete Chinese translations for all frontend modules
- 25 translation JSON files covering:
  - Common UI elements (common.json)
  - Navigation (navigation.json)
  - Settings (settings.json)
  - Task management (tasks.json)
  - Dialogs and modals (dialogs.json)
  - And more...
- Supports language switching in Settings > Paths > Language"

    echo "✅ 已恢复并提交中文翻译文件"
else
    echo "⚠️  跳过：未找到备份的翻译文件"
fi
echo ""

# ============================================
# 第五步：添加Prompt Language Rules
# ============================================
echo "📝 第五步：添加Prompt Language Rules..."
echo ""

LANGUAGE_RULE='
**Language Rule**: Write ALL content (descriptions, reports, messages, analysis results, etc.) in the SAME LANGUAGE as the task description in `spec.md` or user input. If the spec/input is in Chinese, write in Chinese. If in English, write in English. DO NOT translate the content to a different language.
'

# 需要添加Language Rule的文件列表
PROMPT_FILES=(
    "apps/backend/prompts/qa_reviewer.md"
    "apps/backend/prompts/qa_fixer.md"
    "apps/backend/prompts/coder_recovery.md"
    "apps/backend/prompts/spec_gatherer.md"
    "apps/backend/prompts/spec_writer.md"
    "apps/backend/prompts/spec_critic.md"
    "apps/backend/prompts/spec_researcher.md"
    "apps/backend/prompts/spec_quick.md"
    "apps/backend/prompts/complexity_assessor.md"
    "apps/backend/prompts/followup_planner.md"
    "apps/backend/prompts/insight_extractor.md"
    "apps/backend/prompts/validation_fixer.md"
    "apps/backend/prompts/competitor_analysis.md"
    "apps/backend/prompts/ideation_code_improvements.md"
    "apps/backend/prompts/ideation_code_quality.md"
    "apps/backend/prompts/ideation_documentation.md"
    "apps/backend/prompts/ideation_performance.md"
    "apps/backend/prompts/ideation_security.md"
    "apps/backend/prompts/ideation_ui_ux.md"
)

MODIFIED_COUNT=0

for file in "${PROMPT_FILES[@]}"; do
    if [ -f "$file" ]; then
        # 检查是否已有Language Rule
        if grep -q "Language Rule" "$file"; then
            echo "  ⏭️  跳过 $(basename $file) - 已有Language Rule"
        else
            # 在第7行后插入Language Rule（通常是在第一个##标题之后）
            # 查找第一个空行或第8行
            sed -i.bak "7a\\
$LANGUAGE_RULE
" "$file"
            rm "${file}.bak"
            echo "  ✅ 添加Language Rule到 $(basename $file)"
            MODIFIED_COUNT=$((MODIFIED_COUNT + 1))
        fi
    else
        echo "  ⚠️  文件不存在: $file"
    fi
done

if [ $MODIFIED_COUNT -gt 0 ]; then
    git add apps/backend/prompts/*.md
    git commit -m "feat(prompts): add Language Rule to all agent prompts

- Add automatic language detection rule to $MODIFIED_COUNT prompt files
- Agents will now output in the same language as spec.md or user input
- Chinese input → Chinese output
- English input → English output
- Ensures consistent multilingual experience across all agents"
    echo "✅ 已提交Prompt Language Rules修改"
else
    echo "ℹ️  所有prompt文件已包含Language Rule，无需修改"
fi
echo ""

# ============================================
# 第六步：更新CLAUDE.md全局规则
# ============================================
echo "📋 第六步：更新CLAUDE.md全局规则..."
echo ""

# 创建全局语言规则内容
GLOBAL_LANG_RULE='
## 🌐 全局AI交互语言规则 (Global AI Interaction Language Rules)

**CRITICAL - ALL AGENTS MUST FOLLOW THESE RULES:**

### 自动语言检测 (Automatic Language Detection)

当agent开始工作时，必须首先检测用户的首选语言：

1. **读取spec.md的第一段或标题** - 如果包含中文字符 → 使用中文输出
2. **读取requirements.json** - 检查task_description字段的语言
3. **读取用户输入** - 直接对话的情况下，匹配用户使用的语言

**规则**:
- 检测到**任何中文字符** → **所有输出使用中文**
- **纯英文内容** → **所有输出使用英文**

### 输出语言范围 (Output Language Scope)

以下内容必须使用检测到的语言：

✅ **必须本地化的内容：**
- Implementation plans (实现计划)
- Git commit messages (提交消息)
- Progress reports (进度报告)
- Error messages and warnings (错误消息和警告)
- Investigation reports (调查报告)
- QA reports and fix requests (QA报告和修复请求)
- Code comments and docstrings (代码注释和文档字符串)
- User-facing documentation (面向用户的文档)

❌ **保持英文的内容：**
- Variable names (变量名)
- Function names (函数名)
- Class names (类名)
- File names (文件名，除非项目约定使用中文)
- API endpoint paths (API路径)
- Database column names (数据库列名)

### 示例 (Examples)

**示例1：中文任务**
```
spec.md: "添加用户认证功能"

Agent输出：
- 计划: "第一步：创建登录API端点"
- 提交: "feat: 实现JWT令牌验证逻辑"
- 报告: "已完成用户登录功能，包含密码加密和会话管理"
```

**示例2：英文任务**
```
spec.md: "Add user authentication feature"

Agent输出：
- Plan: "Step 1: Create login API endpoint"
- Commit: "feat: implement JWT token validation logic"
- Report: "Completed user login feature with password encryption and session management"
```

### 代码注释示例 (Code Comment Examples)

**中文任务的代码：**
```python
def validate_user_token(token: str) -> bool:
    """
    验证用户JWT令牌的有效性

    参数:
        token: 用户提供的JWT令牌字符串

    返回:
        布尔值，表示令牌是否有效
    """
    # 检查令牌是否过期
    if is_token_expired(token):
        return False

    # 验证签名
    return verify_signature(token)
```

**英文任务的代码：**
```python
def validate_user_token(token: str) -> bool:
    """
    Validate user JWT token validity

    Args:
        token: JWT token string provided by user

    Returns:
        Boolean indicating whether token is valid
    """
    # Check if token is expired
    if is_token_expired(token):
        return False

    # Verify signature
    return verify_signature(token)
```

---
'

# 在CLAUDE.md的Project Overview之后插入（第5行之后）
if grep -q "全局AI交互语言规则" CLAUDE.md; then
    echo "ℹ️  CLAUDE.md已包含全局语言规则，跳过"
else
    # 在第5行后插入
    sed -i.bak "5a\\
$GLOBAL_LANG_RULE
" CLAUDE.md
    rm CLAUDE.md.bak

    git add CLAUDE.md
    git commit -m "feat(claude-md): add global AI language detection rules

- Add comprehensive language detection mechanism for all agents
- Auto-detect language from spec.md, requirements.json, or user input
- Chinese input → Chinese output (plans, commits, reports, comments)
- English input → English output
- Keep code identifiers in English for international collaboration
- Include detailed examples for both languages"

    echo "✅ 已更新CLAUDE.md并添加全局语言规则"
fi
echo ""

# ============================================
# 第七步：更新.env.example配置
# ============================================
echo "⚙️  第七步：更新.env.example配置..."
echo ""

if grep -q "USE_CLAUDE_MD" apps/backend/.env.example; then
    echo "ℹ️  .env.example已包含USE_CLAUDE_MD配置，跳过"
else
    echo "" >> apps/backend/.env.example
    echo "# ============================================" >> apps/backend/.env.example
    echo "# CLAUDE.md Global Instructions" >> apps/backend/.env.example
    echo "# ============================================" >> apps/backend/.env.example
    echo "# Enable project-specific CLAUDE.md instructions for all agents" >> apps/backend/.env.example
    echo "# This includes global language detection rules and project conventions" >> apps/backend/.env.example
    echo "USE_CLAUDE_MD=true" >> apps/backend/.env.example

    git add apps/backend/.env.example
    git commit -m "feat(config): enable CLAUDE.md global instructions by default

- Set USE_CLAUDE_MD=true in .env.example
- Enables global language detection for all agents
- Users can disable by setting USE_CLAUDE_MD=false in their .env"

    echo "✅ 已更新.env.example配置"
fi
echo ""

# ============================================
# 第八步：验证结果
# ============================================
echo "🔍 第八步：验证结果..."
echo ""

echo "文件变更统计："
git diff upstream/develop --stat | tail -5

echo ""
echo "提交历史："
git log --oneline upstream/develop..HEAD

echo ""
echo "与上游的差异文件数："
CHANGED_FILES=$(git diff upstream/develop --name-only | wc -l)
echo "  总计: ${CHANGED_FILES} 个文件"

echo ""
echo "预期差异文件："
echo "  - i18n翻译: ~25个文件"
echo "  - prompt文件: ~19个文件"
echo "  - CLAUDE.md: 1个文件"
echo "  - .env.example: 1个文件"
echo "  预期总计: ~46个文件"

echo ""

# ============================================
# 第九步：替换旧分支（可选）
# ============================================
echo "================================================"
echo "🎉 干净Fork重建完成！"
echo "================================================"
echo ""
echo "当前状态："
echo "  - 新分支: develop-clean"
echo "  - 备份分支: backup-${CURRENT_BRANCH}-${BACKUP_DATE}"
echo "  - 备份文件: ${BACKUP_DIR}"
echo ""
echo "下一步操作："
echo ""
echo "1️⃣  检查新分支的提交历史："
echo "    git log --oneline HEAD~5..HEAD"
echo ""
echo "2️⃣  如果满意，替换旧的develop分支："
echo "    git checkout develop-clean"
echo "    git branch -D develop"
echo "    git branch -m develop-clean develop"
echo ""
echo "3️⃣  强制推送到远程（小心！）："
echo "    git push origin develop --force-with-lease"
echo ""
echo "4️⃣  设置upstream跟踪："
echo "    git branch --set-upstream-to=upstream/develop develop"
echo ""
echo "5️⃣  未来每周同步上游："
echo "    git fetch upstream"
echo "    git rebase upstream/develop"
echo "    git push origin develop --force-with-lease"
echo ""
echo "================================================"
