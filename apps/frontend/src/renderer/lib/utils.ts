import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate progress percentage from subtasks
 * @param subtasks Array of subtasks with status
 * @returns Progress percentage (0-100)
 */
export function calculateProgress(subtasks: { status: string }[]): number {
  if (subtasks.length === 0) return 0;
  const completed = subtasks.filter((s) => s.status === 'completed').length;
  return Math.round((completed / subtasks.length) * 100);
}

/**
 * Format a date as a relative time string using browser's locale
 * @param date Date to format
 * @param locale Optional locale code (defaults to navigator.language or 'zh-CN')
 * @returns Relative time string (e.g., "2小时前" in Chinese or "2 hours ago" in English)
 */
export function formatRelativeTime(date: Date, locale?: string): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Use browser's locale or default to zh-CN
  const effectiveLocale = locale || (typeof navigator !== 'undefined' ? navigator.language : 'zh-CN');

  try {
    const rtf = new Intl.RelativeTimeFormat(effectiveLocale, { numeric: 'auto' });

    if (diffSecs < 60) return rtf.format(-diffSecs, 'second');
    if (diffMins < 60) return rtf.format(-diffMins, 'minute');
    if (diffHours < 24) return rtf.format(-diffHours, 'hour');
    if (diffDays < 7) return rtf.format(-diffDays, 'day');

    // For older dates, use localized date format
    return new Date(date).toLocaleDateString(effectiveLocale);
  } catch {
    // Fallback for browsers without Intl.RelativeTimeFormat support
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(date).toLocaleDateString();
  }
}

/**
 * Sanitize and extract plain text from markdown content.
 * Strips markdown formatting and collapses whitespace for clean display in UI.
 * @param text The text that might contain markdown
 * @param maxLength Maximum length before truncation (default: 200)
 * @returns Plain text suitable for display
 */
export function sanitizeMarkdownForDisplay(text: string, maxLength: number = 200): string {
  if (!text) return '';

  let sanitized = text
    // Remove markdown headers (# ## ### etc)
    .replace(/^#{1,6}\s+/gm, '')
    // Remove bold/italic markers
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    // Remove inline code
    .replace(/`([^`]+)`/g, '$1')
    // Remove code blocks
    .replace(/```[\s\S]*?```/g, '')
    // Remove links but keep text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove images
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    // Remove horizontal rules
    .replace(/^[-*_]{3,}$/gm, '')
    // Remove blockquotes
    .replace(/^>\s*/gm, '')
    // Remove list markers
    .replace(/^[\s]*[-*+]\s+/gm, '')
    .replace(/^[\s]*\d+\.\s+/gm, '')
    // Remove checkbox markers
    .replace(/\[[ x]\]\s*/gi, '')
    // Collapse multiple newlines to single space
    .replace(/\n+/g, ' ')
    // Collapse multiple spaces to single space
    .replace(/\s+/g, ' ')
    .trim();

  // Truncate if needed (0 means no truncation)
  if (maxLength > 0 && sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength).trim() + '...';
  }

  return sanitized;
}
