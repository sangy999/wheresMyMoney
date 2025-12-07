import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';

export default function ManualEntriesList() {
  const { manualEntries, deleteManualEntry, setEditingManualEntryId, currentLanguage } = useApp();

  if (manualEntries.length === 0) {
    return (
      <div className="manual-entries-list">
        <div className="manual-entries-header">
          <h4>{t('manualEntries', currentLanguage)}</h4>
        </div>
        <div className="no-manual-entries">{t('noManualEntries', currentLanguage)}</div>
      </div>
    );
  }

  const sorted = [...manualEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="manual-entries-list">
      <div className="manual-entries-header">
        <h4>{t('manualEntries', currentLanguage)}</h4>
      </div>
      <div className="manual-entries-container">
        {sorted.map((entry) => {
          const typeLabel = entry.type === 'D' ? t('expenses', currentLanguage) : t('income', currentLanguage);
          const typeClass = entry.type === 'D' ? 'negative' : 'positive';
          return (
            <div key={entry.id} className="manual-entry-item">
              <div className="manual-entry-header">
                <span className="manual-entry-date">{entry.date}</span>
                <span className={`manual-entry-amount ${typeClass}`}>€{entry.amount.toFixed(2)}</span>
              </div>
              <div className="manual-entry-description">{entry.description}</div>
              <div className="manual-entry-type">{typeLabel}</div>
              <div className="manual-entry-actions">
                <button
                  onClick={() => setEditingManualEntryId(entry.id)}
                  className="manual-entry-btn edit-btn"
                >
                  {t('edit', currentLanguage)}
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this entry?')) {
                      deleteManualEntry(entry.id);
                    }
                  }}
                  className="manual-entry-btn delete-btn"
                >
                  {t('delete', currentLanguage)}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

