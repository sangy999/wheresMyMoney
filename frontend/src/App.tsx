import { AppProvider } from './context/AppContext';
import FileUpload from './components/FileUpload';
import Summary from './components/Summary';
import FilterSidebar from './components/Filters/FilterSidebar';
import MonthlyStatsPanel from './components/MonthlyStats/MonthlyStatsPanel';
import ChartsPanel from './components/Charts/ChartsPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useApp } from './context/AppContext';
import { t } from './utils/translations';
import './App.css';

function AppContent() {
  const { data, error, currentLanguage } = useApp();

  return (
    <div className="page-wrapper">
      <FilterSidebar />
      
      <div className="container">
        <div className="header-section">
          <LanguageSwitcher />
        </div>
        <h1>{t('appTitle', currentLanguage)}</h1>
        
        <FileUpload />
        
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

