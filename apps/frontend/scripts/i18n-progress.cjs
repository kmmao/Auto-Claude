#!/usr/bin/env node

/**
 * Auto Claude i18n 进度追踪工具
 * 
 * 用法：node scripts/i18n-progress.cjs
 * 
 * 功能：
 * 1. 统计翻译文件的完成度
 * 2. 检查缺失的翻译键
 * 3. 生成进度报告
 */

const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '../src/i18n/locales');
const NAMESPACES = [
    'common',
    'sidebar',
    'settings',
    'tasks',
    'terminal',
    'roadmap',
    'insights',
    'ideation',
    'context',
    'changelog',
    'github',
    'worktrees',
    'onboarding',
    'errors',
];

function countKeys(obj, prefix = '') {
    let count = 0;
    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            count += countKeys(obj[key], `${prefix}${key}.`);
        } else {
            count++;
        }
    }
    return count;
}

function loadTranslationFile(locale, namespace) {
    const filePath = path.join(LOCALES_DIR, locale, `${namespace}.json`);
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

function generateProgressReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 Auto Claude i18n 汉化进度报告');
    console.log('='.repeat(70) + '\n');

    let totalEnKeys = 0;
    let totalZhKeys = 0;
    const namespaceStats = [];

    NAMESPACES.forEach((namespace) => {
        const enData = loadTranslationFile('en', namespace);
        const zhData = loadTranslationFile('zh-CN', namespace);

        if (!enData) {
            console.warn(`⚠️  Warning: en/${namespace}.json not found`);
            return;
        }

        const enKeys = countKeys(enData);
        const zhKeys = zhData ? countKeys(zhData) : 0;
        const progress = enKeys > 0 ? Math.round((zhKeys / enKeys) * 100) : 0;

        totalEnKeys += enKeys;
        totalZhKeys += zhKeys;

        namespaceStats.push({
            namespace,
            enKeys,
            zhKeys,
            progress,
        });
    });

    // 按进度排序
    namespaceStats.sort((a, b) => b.progress - a.progress);

    console.log('命名空间翻译进度：\n');
    namespaceStats.forEach(({ namespace, enKeys, zhKeys, progress }) => {
        const bar = '█'.repeat(Math.floor(progress / 5)) + '░'.repeat(20 - Math.floor(progress / 5));
        const status = progress === 100 ? '✅' : progress > 50 ? '🟡' : '🔴';

        console.log(`${status} ${namespace.padEnd(15)} [${bar}] ${progress}% (${zhKeys}/${enKeys})`);
    });

    const overallProgress = totalEnKeys > 0 ? Math.round((totalZhKeys / totalEnKeys) * 100) : 0;

    console.log('\n' + '-'.repeat(70));
    console.log(`\n总体进度: ${overallProgress}% (${totalZhKeys}/${totalEnKeys} 翻译键)`);
    console.log('='.repeat(70) + '\n');

    // 统计组件汉化进度（简化版，基于文件是否使用 useTranslation）
    console.log('📝 组件汉化进度估算：\n');

    const componentsDir = path.join(__dirname, '../src/renderer/components');
    let totalComponents = 0;
    let i18nComponents = 0;

    try {
        const files = fs.readdirSync(componentsDir);
        files.forEach((file) => {
            if (file.endsWith('.tsx')) {
                totalComponents++;
                const filePath = path.join(componentsDir, file);
                const content = fs.readFileSync(filePath, 'utf-8');
                if (content.includes('useTranslation')) {
                    i18nComponents++;
                }
            }
        });

        const componentProgress = totalComponents > 0
            ? Math.round((i18nComponents / totalComponents) * 100)
            : 0;

        console.log(`已汉化组件: ${i18nComponents}/${totalComponents} (${componentProgress}%)`);
    } catch (error) {
        console.log('⚠️  无法统计组件进度');
    }

    console.log('\n' + '='.repeat(70));
    console.log('\n💡 下一步建议：\n');

    // 找出进度最低的命名空间
    const lowestProgress = namespaceStats.filter(s => s.progress < 100).slice(0, 3);
    if (lowestProgress.length > 0) {
        console.log('优先完善以下翻译文件：');
        lowestProgress.forEach(({ namespace, progress }) => {
            console.log(`  - ${namespace}.json (${progress}%)`);
        });
    } else {
        console.log('🎉 所有翻译文件都已完成！');
    }

    console.log('\n运行以下命令开始汉化组件：');
    console.log('  node scripts/extract-i18n-texts.cjs src/renderer/components/YourComponent.tsx\n');
}

// 运行报告
generateProgressReport();
