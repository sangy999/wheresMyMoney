import React from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { Transaction } from '../../types';
import { generateTransactionId, parseDate } from '../../utils/csvParser';

export default function IgnoredTransactionsList() {
  const { allTransactions, manualEntries, ignoredTransactions, toggleIgnoreTransaction, currentLanguage } = useApp();

  // Get all transactions
  const allTrans: Transaction[] = [];
  
  if (allTransactions) {
    allTrans.push(...allTransactions);
  }
  
  manualEntries.forEach(entry => {
    allTrans.push({
      date: parseDate(entry.date),
      dateStr: entry.date,
      amount: entry.amount,
      beneficiary: '',
      details: entry.description,
      type: entry.type,
      category: 'Manual Additions',
      isManual: true,
      manualEntryId: entry.id
    });
  });

  // Filter to only ignored transactions
  const ignoredTrans = allTrans.filter(t => {
    const id = generateTransactionId(t);
    return ignoredTransactions.has(id);
  });

  if (ignoredTrans.length === 0) {
    return (
      <div className="ignored-transactions-container">
        <div className="no-ignored-transactions">{t('noIgnoredTransactions', currentLanguage)}</div>
      </div>
    );
  }

  // Sort by date (newest first)
  ignoredTrans.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="ignored-transactions-container">
      {ignoredTrans.map((trans, index) => {
        const typeLabel = trans.type === 'D' ? t('expenses', currentLanguage) : t('income', currentLanguage);
        const typeClass = trans.type === 'D' ? 'negative' : 'positive';
        return (
          <div key={index} className="ignored-transaction-item">
            <div className="ignored-transaction-header">
              <span className="ignored-transaction-date">{trans.dateStr}</span>
              <span className={`ignored-transaction-amount ${typeClass}`}>€{trans.amount.toFixed(2)}</span>
            </div>
            <div className="ignored-transaction-beneficiary">{trans.beneficiary || 'N/A'}</div>
            <div className="ignored-transaction-details">{trans.details || ''}</div>
            <div className="ignored-transaction-type">{typeLabel}</div>
            <div className="ignored-transaction-actions">
              <button
                onClick={() => toggleIgnoreTransaction(trans)}
                className="filter-btn-small reenable-btn"
              >
                {t('reenable', currentLanguage)}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

