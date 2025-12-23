import { Languages } from 'lucide-react';
import { Label } from './ui/label';
import { useTranslation } from 'react-i18next';

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文' },
] as const;

/**
 * Simple language selector component without i18n hooks
 * This version uses direct i18n instance access to avoid hook issues
 */
export function LanguageSelector() {
  const { t } = useTranslation(['common', 'settings']);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const langCode = e.target.value;
        // Direct access to i18n instance
        import('../../i18n').then((module) => {
            module.default.changeLanguage(langCode);
        });
    };

    // Get current language from localStorage (where i18next stores it)
    const currentLanguage = localStorage.getItem('i18nextLng') || 'en';

    return (
        <div className="space-y-2">
            <Label htmlFor="language-select" className="text-sm font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Language / 语言
            </Label>
            <select
                id="language-select"
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.nativeName} ({lang.name})
                    </option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground">
                {currentLanguage === 'zh-CN'
                    ? '更改界面显示语言'
                    : 'Change the interface display language'}
            </p>
        </div>
    );
}
