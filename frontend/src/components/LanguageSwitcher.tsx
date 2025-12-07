import { useApp } from '../context/AppContext';

export default function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useApp();

  return (
    <div className="language-switcher">
      <button
        onClick={() => setLanguage('en')}
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('lt')}
        className={`lang-btn ${currentLanguage === 'lt' ? 'active' : ''}`}
      >
        LT
      </button>
    </div>
  );
}

