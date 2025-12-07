import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t, translateCategory } from '../../utils/translations';
import MonthlyStatsContent from './MonthlyStatsContent';

export default function MonthlyStatsPanel() {
  const { data, currentLanguage } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  if (!data) return null;

  return (
    <div className="monthly-stats-panel">
      <div className="monthly-stats-header" onClick={() => setIsOpen(!isOpen)}>
        <h2>📊 {t('monthlyStatistics', currentLanguage)}</h2>
        <span className="monthly-stats-toggle-icon">{isOpen ? '▲' : '▼'}</span>
      </div>
      {isOpen && (
        <div className="monthly-stats-content">
          <MonthlyStatsContent />
        </div>
      )}
    </div>
  );
}

