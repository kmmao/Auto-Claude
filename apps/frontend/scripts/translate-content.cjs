#!/usr/bin/env node

/**
 * 智能内容翻译脚本
 * 自动翻译组件中的常见文本模式
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/renderer/components');

// 翻译映射表 - 常见的设置和UI文本
const TRANSLATIONS = {
    // 设置相关
    'Appearance': 'settings:appearance.title',
    'Customize how Auto Claude looks': 'settings:appearance.description',
    'Appearance Mode': 'settings:appearance.mode.title',
    'Choose light, dark, or system preference': 'settings:appearance.mode.description',
    'System': 'settings:appearance.mode.system',
    'Light': 'settings:appearance.mode.light',
    'Dark': 'settings:appearance.mode.dark',
    'Color Theme': 'settings:appearance.colorTheme.title',
    'Select a color palette for the interface': 'settings:appearance.colorTheme.description',

    'Display': 'settings:display.title',
    'UI scale and zoom': 'settings:display.description',

    'Agent Settings': 'settings:agent.title',
    'Default model and framework': 'settings:agent.description',

    'Paths': 'settings:paths.title',
    'Python and framework paths': 'settings:paths.description',

    'Integrations': 'settings:integrations.title',
    'API keys & Claude accounts': 'settings:integrations.description',

    'Updates': 'settings:updates.title',
    'Auto Claude updates': 'settings:updates.description',

    'Notifications': 'settings:notifications.title',
    'Alert preferences': 'settings:notifications.description',

    // 主题名称
    'Default': 'settings:appearance.colorTheme.default',
    'Dusk': 'settings:appearance.colorTheme.dusk',
    'Lime': 'settings:appearance.colorTheme.lime',
    'Ocean': 'settings:appearance.colorTheme.ocean',
    'Retro': 'settings:appearance.colorTheme.retro',
    'Neo': 'settings:appearance.colorTheme.neo',
    'Forest': 'settings:appearance.colorTheme.forest',

    // 常见UI文本
    'Configure application and project settings': 't("common:settings.description")',
    'Theme and visual preferences': 't("common:settings.themeDesc")',
    'New conversation': 't("common:buttons.newChat")',
    'No conversations yet': 't("common:messages.noConversations")',
    'Chat History': 't("common:sidebar.chatHistory")',
    'Delete conversation?': 't("common:dialogs.deleteConversation")',
    'This will permanently delete this conversation and all its messages.': 't("common:dialogs.deleteConversationDesc")',
    'This action cannot be undone.': 't("common:dialogs.cannotUndo")',
    'Rename': 't("common:buttons.rename")',

    // 项目设置
    'General': 'settings:project.general.title',
    'Auto-Build and agent config': 'settings:project.general.description',
    'Claude Auth': 'settings:project.claudeAuth.title',
    'Environment': 'settings:project.environment.title',
    'Memory Backend': 'settings:project.memory.title',
    'Security': 'settings:project.security.title',
};

let translatedCount = 0;
let fileCount = 0;

function translateFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;
        let changed = false;

        // 检查是否已经有 useTranslation
        const hasUseTranslation = content.includes('useTranslation');
        const hasSettingsNamespace = content.includes("'settings'") || content.includes('"settings"');

        // 如果使用了 useTranslation 但没有 settings 命名空间,添加它
        if (hasUseTranslation && !hasSettingsNamespace) {
            content = content.replace(
                /useTranslation\(\[(['"])common\1\]\)/g,
                "useTranslation(['common', 'settings'])"
            );
            if (content !== original) {
                changed = true;
            }
        }

        // 替换字符串字面量
        for (const [english, translationKey] of Object.entries(TRANSLATIONS)) {
            // 匹配各种引号形式
            const patterns = [
                new RegExp(`"${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
                new RegExp(`'${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`, 'g'),
                new RegExp(`\`${english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\``, 'g'),
            ];

            for (const pattern of patterns) {
                if (pattern.test(content)) {
                    // 如果翻译键已经是 t() 调用,直接使用
                    if (translationKey.startsWith('t(')) {
                        content = content.replace(pattern, translationKey);
                    } else {
                        // 否则包装在 t() 中
                        content = content.replace(pattern, `{t("${translationKey}")}`);
                    }
                    changed = true;
                    translatedCount++;
                }
            }
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ ${path.relative(COMPONENTS_DIR, filePath)}`);
            fileCount++;
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ ${path.relative(COMPONENTS_DIR, filePath)}: ${error.message}`);
        return false;
    }
}

function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!file.startsWith('.') && file !== 'node_modules' && file !== '__tests__') {
                scanDirectory(fullPath);
            }
        } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
            translateFile(fullPath);
        }
    });
}

console.log('🌐 开始智能内容翻译...\n');
console.log('='.repeat(60));

scanDirectory(COMPONENTS_DIR);

console.log('='.repeat(60));
console.log(`\n✅ 完成!`);
console.log(`   翻译了 ${fileCount} 个文件`);
console.log(`   替换了 ${translatedCount} 个文本\n`);
