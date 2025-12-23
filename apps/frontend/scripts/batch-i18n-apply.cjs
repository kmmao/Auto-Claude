#!/usr/bin/env node

/**
 * 批量汉化应用脚本
 * 
 * 此脚本会自动:
 * 1. 为组件添加 useTranslation hook
 * 2. 替换常见的硬编码文本为翻译调用
 * 3. 生成需要的翻译键
 */

const fs = require('fs');
const path = require('path');

// 常见文本的翻译映射
const TRANSLATIONS = {
    // 按钮
    'Save': 't("common:buttons.save")',
    'Cancel': 't("common:buttons.cancel")',
    'Delete': 't("common:buttons.delete")',
    'Edit': 't("common:buttons.edit")',
    'Add': 't("common:buttons.add")',
    'Remove': 't("common:buttons.remove")',
    'Close': 't("common:buttons.close")',
    'Back': 't("common:buttons.back")',
    'Next': 't("common:buttons.next")',
    'Previous': 't("common:buttons.previous")',
    'Finish': 't("common:buttons.finish")',
    'Skip': 't("common:buttons.skip")',
    'Confirm': 't("common:buttons.confirm")',
    'OK': 't("common:buttons.ok")',
    'Yes': 't("common:buttons.yes")',
    'No': 't("common:buttons.no")',
    'Retry': 't("common:buttons.retry")',
    'Refresh': 't("common:buttons.refresh")',
    'Search': 't("common:buttons.search")',
    'Filter': 't("common:buttons.filter")',
    'Sort': 't("common:buttons.sort")',
    'Upload': 't("common:buttons.upload")',
    'Download': 't("common:buttons.download")',
    'Export': 't("common:buttons.export")',
    'Import': 't("common:buttons.import")',
    'View': 't("common:buttons.view")',
    'Hide': 't("common:buttons.hide")',
    'Show': 't("common:buttons.show")',

    // 状态
    'Loading...': 't("common:status.loading")',
    'Error': 't("common:status.error")',
    'Success': 't("common:status.success")',
    'Warning': 't("common:status.warning")',
    'Failed': 't("common:status.failed")',
    'Completed': 't("common:status.completed")',
    'Pending': 't("common:status.pending")',
    'Processing': 't("common:status.processing")',

    // 通用
    'Settings': 't("common:common.settings")',
    'Help': 't("common:common.help")',
    'About': 't("common:common.about")',
    'Version': 't("common:common.version")',
};

function addTranslationHook(content, componentName) {
    // 检查是否已经有 useTranslation
    if (content.includes('useTranslation')) {
        return content;
    }

    // 查找 import 语句的位置
    const importMatch = content.match(/^(import.*from.*;\n)+/m);
    if (!importMatch) {
        return content;
    }

    const lastImportIndex = importMatch[0].length;
    const beforeImports = content.substring(0, lastImportIndex);
    const afterImports = content.substring(lastImportIndex);

    // 添加 useTranslation import
    const newImport = "import { useTranslation } from 'react-i18next';\n";

    return beforeImports + newImport + afterImports;
}

function addTranslationToComponent(content) {
    // 查找函数组件定义
    const functionMatch = content.match(/export\s+function\s+(\w+)\s*\([^)]*\)\s*{/);
    if (!functionMatch) {
        return content;
    }

    const functionStart = functionMatch.index + functionMatch[0].length;
    const beforeFunction = content.substring(0, functionStart);
    const afterFunction = content.substring(functionStart);

    // 添加 useTranslation hook
    const hookLine = "\n  const { t } = useTranslation(['common']);\n";

    return beforeFunction + hookLine + afterFunction;
}

function replaceCommonTexts(content) {
    let modified = content;

    // 替换按钮文本
    Object.entries(TRANSLATIONS).forEach(([text, translation]) => {
        // 替换 >Text< 模式
        const pattern1 = new RegExp(`>\\s*${text}\\s*<`, 'g');
        modified = modified.replace(pattern1, `>{${translation}}<`);

        // 替换 "Text" 模式 (在 JSX 属性中)
        const pattern2 = new RegExp(`"${text}"`, 'g');
        modified = modified.replace(pattern2, `{${translation}}`);
    });

    return modified;
}

function processFile(filePath) {
    console.log(`处理: ${path.relative(process.cwd(), filePath)}`);

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // 1. 添加 import
    content = addTranslationHook(content);

    // 2. 添加 hook 到组件
    if (!original.includes('useTranslation')) {
        content = addTranslationToComponent(content);
    }

    // 3. 替换常见文本
    content = replaceCommonTexts(content);

    // 只在有变化时写入
    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`  ✅ 已更新`);
        return true;
    } else {
        console.log(`  ⏭️  无需更新`);
        return false;
    }
}

function processDirectory(dir, pattern = /\.tsx$/) {
    let count = 0;

    function scan(directory) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const fullPath = path.join(directory, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                // 跳过某些目录
                if (!file.startsWith('.') && file !== 'node_modules' && file !== 'ui') {
                    scan(fullPath);
                }
            } else if (pattern.test(file) && !file.endsWith('.test.tsx')) {
                if (processFile(fullPath)) {
                    count++;
                }
            }
        });
    }

    scan(dir);
    return count;
}

// 主程序
const componentsDir = path.join(__dirname, '../src/renderer/components');
console.log('🚀 开始批量汉化...\n');
console.log('='.repeat(60));

const updated = processDirectory(componentsDir);

console.log('='.repeat(60));
console.log(`\n✅ 完成! 共更新了 ${updated} 个文件\n`);
console.log('💡 提示: 请检查更新的文件,确保翻译正确');
console.log('💡 运行 npm run dev 查看效果\n');
