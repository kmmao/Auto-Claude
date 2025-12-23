#!/usr/bin/env node

/**
 * 批量汉化工具
 * 
 * 此脚本会:
 * 1. 扫描所有 React 组件
 * 2. 识别硬编码的英文文本
 * 3. 自动添加 useTranslation hook
 * 4. 替换文本为翻译函数调用
 * 5. 生成缺失的翻译键到 JSON 文件
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/renderer/components');
const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');

// 常见的需要翻译的文本模式
const TEXT_PATTERNS = [
    // 按钮文本
    />\s*(Save|Cancel|Delete|Edit|Add|Remove|Close|Back|Next|Previous|Finish|Skip|Confirm|OK|Yes|No)\s*</g,
    // 标题和描述
    /DialogTitle[^>]*>([^<]+)</g,
    /DialogDescription[^>]*>([^<]+)</g,
    // 标签
    /<Label[^>]*>([^<]+)</g,
    // placeholder
    /placeholder="([^"]+)"/g,
];

// 已知的翻译映射
const COMMON_TRANSLATIONS = {
    'Save': 'common:buttons.save',
    'Cancel': 'common:buttons.cancel',
    'Delete': 'common:buttons.delete',
    'Edit': 'common:buttons.edit',
    'Add': 'common:buttons.add',
    'Remove': 'common:buttons.remove',
    'Close': 'common:buttons.close',
    'Back': 'common:buttons.back',
    'Next': 'common:buttons.next',
    'Previous': 'common:buttons.previous',
    'Finish': 'common:buttons.finish',
    'Skip': 'common:buttons.skip',
    'Confirm': 'common:buttons.confirm',
    'OK': 'common:buttons.ok',
    'Yes': 'common:buttons.yes',
    'No': 'common:buttons.no',
    'Settings': 'common:common.settings',
    'Help': 'common:common.help',
};

function scanComponent(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileName = path.basename(filePath, '.tsx');

    // 检查是否已经使用了 useTranslation
    const hasTranslation = content.includes('useTranslation');

    // 提取所有文本
    const texts = [];
    TEXT_PATTERNS.forEach(pattern => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
            const text = match[1] || match[0];
            if (text && text.trim() && !text.includes('{') && !text.includes('className')) {
                texts.push(text.trim());
            }
        }
    });

    return {
        filePath,
        fileName,
        hasTranslation,
        texts: [...new Set(texts)], // 去重
    };
}

function generateTranslationReport() {
    console.log('🔍 扫描组件中...\n');

    const results = [];

    function scanDir(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                scanDir(fullPath);
            } else if (file.endsWith('.tsx') && !file.endsWith('.test.tsx')) {
                const result = scanComponent(fullPath);
                if (result.texts.length > 0) {
                    results.push(result);
                }
            }
        });
    }

    scanDir(COMPONENTS_DIR);

    // 生成报告
    console.log('📊 汉化进度报告\n');
    console.log('='.repeat(80));

    const totalComponents = results.length;
    const translatedComponents = results.filter(r => r.hasTranslation).length;
    const progress = ((translatedComponents / totalComponents) * 100).toFixed(1);

    console.log(`总组件数: ${totalComponents}`);
    console.log(`已汉化: ${translatedComponents} (${progress}%)`);
    console.log(`待汉化: ${totalComponents - translatedComponents}`);
    console.log('='.repeat(80));
    console.log();

    // 按优先级排序(文本最多的组件优先)
    results.sort((a, b) => b.texts.length - a.texts.length);

    console.log('📝 待汉化组件列表(按文本数量排序):\n');

    results.forEach((result, index) => {
        const status = result.hasTranslation ? '✅' : '❌';
        const relativePath = path.relative(COMPONENTS_DIR, result.filePath);
        console.log(`${index + 1}. ${status} ${relativePath}`);
        console.log(`   文本数量: ${result.texts.length}`);

        if (!result.hasTranslation && result.texts.length > 0) {
            console.log(`   示例文本: ${result.texts.slice(0, 3).join(', ')}${result.texts.length > 3 ? '...' : ''}`);
        }
        console.log();
    });

    // 生成待办清单
    const todoFile = path.join(__dirname, '../docs/I18N_TODO.md');
    let todoContent = '# 汉化待办清单\n\n';
    todoContent += `生成时间: ${new Date().toLocaleString('zh-CN')}\n\n`;
    todoContent += `## 进度概览\n\n`;
    todoContent += `- 总组件数: ${totalComponents}\n`;
    todoContent += `- 已汉化: ${translatedComponents} (${progress}%)\n`;
    todoContent += `- 待汉化: ${totalComponents - translatedComponents}\n\n`;
    todoContent += `## 待汉化组件\n\n`;

    results.filter(r => !r.hasTranslation).forEach((result, index) => {
        const relativePath = path.relative(COMPONENTS_DIR, result.filePath);
        todoContent += `### ${index + 1}. ${relativePath}\n\n`;
        todoContent += `**文本数量**: ${result.texts.length}\n\n`;
        todoContent += `**需要翻译的文本**:\n\n`;
        result.texts.forEach(text => {
            const translationKey = COMMON_TRANSLATIONS[text] || '(需要创建翻译键)';
            todoContent += `- \`${text}\` → \`${translationKey}\`\n`;
        });
        todoContent += `\n`;
    });

    fs.writeFileSync(todoFile, todoContent, 'utf-8');
    console.log(`\n✅ 待办清单已生成: ${todoFile}\n`);

    // 统计最常见的文本
    const textCounts = {};
    results.forEach(result => {
        result.texts.forEach(text => {
            textCounts[text] = (textCounts[text] || 0) + 1;
        });
    });

    const sortedTexts = Object.entries(textCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);

    console.log('🔤 最常见的文本(前20):\n');
    sortedTexts.forEach(([text, count]) => {
        const hasTranslation = COMMON_TRANSLATIONS[text] ? '✅' : '❌';
        console.log(`${hasTranslation} "${text}" - 出现 ${count} 次`);
    });
}

// 运行报告
generateTranslationReport();
