import { AppProvider } from './context/AppContext';
import FileUpload from './components/FileUpload';
import Summary from './components/Summary';
import FilterSidebar from './components/Filters/FilterSidebar';
import MonthlyStatsPanel from './components/MonthlyStats/MonthlyStatsPanel';
import ChartsPanel from './components/Charts/ChartsPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import ThemeSwitcher from './components/ThemeSwitcher';
import { useApp } from './context/AppContext';
import { t } from './utils/translations';
import './App.css';

function AppContent() {
  const { data, error, currentLanguage } = useApp();

  return (
    <div className={`page-wrapper ${!data ? 'no-data-page' : ''}`}>
      <FilterSidebar />
      
      <div className={`container ${!data ? 'no-data-container' : ''}`}>
        <div className={`header-section ${!data ? 'no-data-header' : ''}`}>
          {data ? (
            <>
              <div className="header-left">
                <div className="title-upload-container">
                  <FileUpload />
                  <h1>{t('appTitle', currentLanguage)}</h1>
                </div>
              </div>
              <div className="header-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <LanguageSwitcher />
                <ThemeSwitcher />
              </div>
            </>
          ) : (
            <div className="header-right" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </div>
          )}
        </div>
        {!data && (
          <div className="no-data-content">
            <h1>{t('appTitle', currentLanguage)}</h1>
            <FileUpload />
          </div>
        )}
        
        {error && (
          <div id="error" className="error">
            {t(error, currentLanguage)}
          </div>
        )}
        
        {data && (
          <div id="results">
            <Summary />
            <MonthlyStatsPanel />
            <ChartsPanel />
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

