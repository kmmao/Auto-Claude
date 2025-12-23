#!/usr/bin/env node

/**
 * 修复翻译脚本造成的对象字面量语法错误
 * 
 * 问题: 翻译脚本错误地将 "text" 替换为 {t("key")},
 * 但在对象字面量中应该是 t("key") 而不是 {t("key")}
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '../src/renderer/components');

let fixedCount = 0;

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;

        // 修复对象字面量中错误的 {t(...)} 模式
        // 匹配: key: {t("...")} 或 key: {t('...')}
        content = content.replace(
            /:\s*\{t\((['"][^'"]+['"])\)\}/g,
            ': t($1)'
        );

        // 修复 title={t(...)} 这种正确的模式被错误处理的情况
        // (这个应该保持原样,不需要修复)

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf-8');
            console.log(`✅ ${path.relative(COMPONENTS_DIR, filePath)}`);
            fixedCount++;
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
            fixFile(fullPath);
        }
    });
}

console.log('🔧 修复对象字面量中的翻译语法错误...\n');
console.log('='.repeat(60));

scanDirectory(COMPONENTS_DIR);

console.log('='.repeat(60));
console.log(`\n✅ 完成! 修复了 ${fixedCount} 个文件\n`);
