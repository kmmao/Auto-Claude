#!/usr/bin/env node

/**
 * 终极修复脚本 - 修复所有被破坏的 import 语句
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COMPONENTS_DIR = path.join(__dirname, '../src/renderer/components');

let fixedCount = 0;

function fixFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf-8');
        const original = content;

        // 修复所有已知的错误模式

        // 1. lucide-rea... 模式
        content = content.replace(/from\s+['"]lucide-rea[^'"]*['"]/g, "from 'lucide-react'");

        // 2. react-i18next'react-i18next 重复
        content = content.replace(/['"]react-i18next['"]react-i18next['"]/g, "'react-i18next'");

        // 3. ct'; 残留
        content = content.replace(/\nct['"];?\s*\n/g, '\n');

        // 4. 移除所有错误的 useTranslation import
        content = content.replace(/import\s*{\s*useTranslation\s*}\s*from\s*['"]['"];?\s*\n/g, '');

        // 5. 移除重复的 useTranslation import
        const matches = content.match(/import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];?\s*\n/g);
        if (matches && matches.length > 1) {
            content = content.replace(/import\s*{\s*useTranslation\s*}\s*from\s*['"]react-i18next['"];?\s*\n/g, '');
        }

        // 6. 确保有正确的 useTranslation import (如果需要)
        if (content.includes('useTranslation(') || content.includes('const { t }')) {
            if (!content.includes("from 'react-i18next'")) {
                // 在第一个 import 后添加
                const firstImport = content.match(/^import\s+[^;]+;\n/m);
                if (firstImport) {
                    content = content.replace(firstImport[0], firstImport[0] + "import { useTranslation } from 'react-i18next';\n");
                }
            }
        }

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

console.log('🔧 终极修复开始...\n');
scanDirectory(COMPONENTS_DIR);
console.log(`\n✅ 完成! 修复了 ${fixedCount} 个文件\n`);
