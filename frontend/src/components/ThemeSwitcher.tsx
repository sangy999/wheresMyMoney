import { useApp } from '../context/AppContext';
import { Theme } from '../types';
import { t, translations } from '../utils/translations';

const themes: { value: Theme; icon: string; translationKey: string }[] = [
  { value: 'dark', icon: '🌙', translationKey: 'dark' },
  { value: 'light', icon: '☀️', translationKey: 'light' },
  { value: 'blue', icon: '💙', translationKey: 'blue' },
  { value: 'green', icon: '💚', translationKey: 'green' },
  { value: 'purple', icon: '💜', translationKey: 'purple' },
  { value: 'orange', icon: '🧡', translationKey: 'orange' },
];

export default function ThemeSwitcher() {
  const { currentTheme, setTheme, currentLanguage } = useApp();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as Theme);
  };

  const getThemeLabel = (translationKey: string): string => {
    const themesObj = translations[currentLanguage].themes;
    if (themesObj && typeof themesObj === 'object' && translationKey in themesObj) {
      const themes = themesObj as Record<string, string>;
      return themes[translationKey] || translationKey;
    }
    return translationKey;
  };

  return (
    <div className="theme-switcher">
      <select
        value={currentTheme}
        onChange={handleThemeChange}
        className="theme-select"
        aria-label={t('selectTheme', currentLanguage)}
        title={t('selectTheme', currentLanguage)}
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.icon} {getThemeLabel(theme.translationKey)}
          </option>
        ))}
      </select>
    </div>
  );
}

