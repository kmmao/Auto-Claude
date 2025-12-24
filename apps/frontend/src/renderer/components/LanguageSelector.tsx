import { Languages } from 'lucide-react';
import { Label } from './ui/label';
import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES, type SupportedLanguage } from '../../shared/constants/i18n';

/**
 * Language selector component using shared i18n configuration
 */
export function LanguageSelector() {
    const { t, i18n } = useTranslation(['common', 'settings']);

    const currentLanguage = i18n.language || 'en';

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const langCode = e.target.value as SupportedLanguage;
        i18n.changeLanguage(langCode);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="language-select" className="text-sm font-medium flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t('settings:paths.language.title', { defaultValue: 'Language / 语言' })}
            </Label>
            <select
                id="language-select"
                value={currentLanguage}
                onChange={handleLanguageChange}
                className="flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {AVAILABLE_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                        {lang.nativeLabel} ({lang.label})
                    </option>
                ))}
            </select>
            <p className="text-xs text-muted-foreground">
                {t('settings:paths.language.description', { defaultValue: 'Change the interface display language' })}
            </p>
        </div>
    );
}

