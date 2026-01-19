#!/bin/bash
# ============================================
# Auto-Claude 上游同步脚本
# ============================================
# 用途：每周执行一次，保持与上游同步
# 用法：./sync-upstream.sh
# ============================================

set -e

echo "🔄 开始同步上游..."

# 1. 获取上游最新代码
echo "📡 Fetching upstream..."
git fetch upstream

# 2. 备份当前状态（以防出错）
BACKUP_BRANCH="backup-before-sync-$(date +%Y%m%d-%H%M%S)"
git branch "$BACKUP_BRANCH"
echo "✅ 已创建备份分支: $BACKUP_BRANCH"

# 3. Rebase到上游
echo "🔄 Rebasing to upstream/develop..."
if git rebase upstream/develop; then
    echo "✅ 同步成功！无冲突"

    # 4. 运行快速测试（可选）
    echo "🧪 运行快速验证..."
    if [ -f "apps/backend/.env.example" ]; then
        echo "✅ Backend配置文件正常"
    fi

    if [ -d "apps/frontend/src/shared/i18n/locales/zh-CN" ]; then
        echo "✅ 中文翻译文件正常"
    fi

    # 5. 推送到远程
    echo "📤 推送到远程仓库..."
    git push origin develop --force-with-lease
    echo "✅ 已推送到 origin/develop"

    # 6. 清理旧备份（可选，保留最近5个）
    echo "🧹 清理旧备份分支..."
    git branch | grep "backup-before-sync-" | sort -r | tail -n +6 | xargs -r git branch -D

    echo ""
    echo "================================================"
    echo "🎉 同步完成！"
    echo "================================================"
    echo "状态："
    echo "  - 本地分支: $(git branch --show-current)"
    echo "  - 上游提交: $(git log upstream/develop --oneline -1)"
    echo "  - 本地提交: $(git log HEAD --oneline -1)"
    echo "  - 差异文件: $(git diff upstream/develop --name-only | wc -l) 个"
    echo ""
    echo "备份分支: $BACKUP_BRANCH"
    echo "如需恢复: git reset --hard $BACKUP_BRANCH"
    echo "================================================"

else
    echo "⚠️  检测到冲突！请手动解决"
    echo ""
    echo "常见冲突文件："
    echo "  1. apps/frontend/src/shared/i18n/locales/zh-CN/*.json"
    echo "     解决方法: 保留你的翻译（git checkout --ours <file>）"
    echo ""
    echo "  2. apps/backend/prompts/*.md"
    echo "     解决方法: 保留Language Rule段落，接受上游其他修改"
    echo ""
    echo "  3. CLAUDE.md"
    echo "     解决方法: 保留你的全局语言规则段落"
    echo ""
    echo "解决冲突后执行："
    echo "  git add ."
    echo "  git rebase --continue"
    echo "  git push origin develop --force-with-lease"
    echo ""
    echo "如果想放弃此次同步："
    echo "  git rebase --abort"
    echo "  git reset --hard $BACKUP_BRANCH"
    exit 1
fi
