import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t, translateCategory, translations } from '../../utils/translations';
import { Transaction } from '../../types';
import { generateTransactionId } from '../../utils/csvParser';

export default function MonthlyStatsContent() {
  const { data, ignoredTransactions, toggleIgnoreTransaction, currentLanguage } = useApp();

  if (!data) return null;

  const months = Object.keys(data.monthly_stats).sort();

  const formatMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = translations[currentLanguage].monthNames as string[];
    if (monthNames && Array.isArray(monthNames)) {
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    // Fallback to English if current language doesn't have monthNames
    const enMonthNames = translations['en'].monthNames as string[];
    return `${enMonthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="monthly-stats-section">
      <div className="monthly-stats-grid">
        {months.map((month) => {
          const stats = data.monthly_stats[month];
          return <MonthCard key={month} month={month} stats={stats} formatMonthName={formatMonthName} />;
        })}
      </div>
    </div>
  );
}

function MonthCard({ month, stats, formatMonthName }: { month: string; stats: any; formatMonthName: (m: string) => string }) {
  const [isOpen, setIsOpen] = useState(false);
  const { ignoredTransactions, toggleIgnoreTransaction, currentLanguage } = useApp();
  const netBalanceClass = stats.netBalance >= 0 ? 'positive' : 'negative';

  const expenseCategories = Object.entries(stats.expenseCategories || {})
    .sort((a, b) => (b[1] as number) - (a[1] as number));
  const incomeCategories = Object.entries(stats.incomeCategories || {})
    .sort((a, b) => (b[1] as number) - (a[1] as number));

  return (
    <div className="month-card">
      <div className="month-header" onClick={() => setIsOpen(!isOpen)}>
        {formatMonthName(month)}
        <span className="expand-icon">{isOpen ? '▲' : '▼'}</span>
      </div>
      <div className="month-stats-container">
        <div className="month-stat">
          <span className="month-label">{t('income', currentLanguage)}</span>
          <span className="month-value positive">€{stats.income.toFixed(2)}</span>
        </div>
        <div className="month-stat">
          <span className="month-label">{t('expenses', currentLanguage)}</span>
          <span className="month-value negative">€{stats.expenses.toFixed(2)}</span>
        </div>
        <div className="month-stat">
          <span className="month-label">{t('netBalance', currentLanguage)}</span>
          <span className={`month-value ${netBalanceClass}`}>€{stats.netBalance.toFixed(2)}</span>
        </div>
        <div className="month-stat">
          <span className="month-label">{t('transactions', currentLanguage)}</span>
          <span className="month-value">{stats.transactionCount}</span>
        </div>
      </div>
      {isOpen && (
        <div className="month-details">
          {expenseCategories.length > 0 && (
            <div className="category-section">
              <h4 className="category-title">{t('expenseCategories', currentLanguage)}</h4>
              {expenseCategories.map(([category, amount]) => (
                <CategoryItem
                  key={category}
                  category={category}
                  amount={amount as number}
                  total={stats.expenses}
                  transactions={stats.expenseTransactions[category] || []}
                  type="expense"
                />
              ))}
            </div>
          )}
          {incomeCategories.length > 0 && (
            <div className="category-section">
              <h4 className="category-title">{t('incomeCategories', currentLanguage)}</h4>
              {incomeCategories.map(([category, amount]) => (
                <CategoryItem
                  key={category}
                  category={category}
                  amount={amount as number}
                  total={stats.income}
                  transactions={stats.incomeTransactions[category] || []}
                  type="income"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategoryItem({ category, amount, total, transactions, type }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const { ignoredTransactions, toggleIgnoreTransaction, allTransactions, manualEntries, currentLanguage } = useApp();
  const percentage = total > 0 ? ((amount / total) * 100).toFixed(1) : '0.0';

  return (
    <div className="category-item-wrapper">
      <div className="category-item" onClick={() => setIsOpen(!isOpen)}>
        <span className="category-name">{translateCategory(category, currentLanguage)}</span>
        <span className={`category-amount ${type === 'income' ? 'positive' : ''}`}>
          €{amount.toFixed(2)}
        </span>
        <span className="category-percentage">{percentage}%</span>
        <span className="category-expand-icon">{isOpen ? '▼' : '▶'}</span>
      </div>
      {isOpen && (
        <div className="category-transactions">
          {transactions.length > 0 ? (
            <div className="transactions-list">
              {transactions.map((trans: any, idx: number) => {
                const transObj: Transaction = {
                  date: new Date(trans.date),
                  dateStr: trans.date,
                  amount: trans.amount,
                  beneficiary: trans.beneficiary || '',
                  details: trans.details || '',
                  type: type === 'expense' ? 'D' : 'K',
                  category,
                  isManual: trans.isManual || false,
                  manualEntryId: trans.manualEntryId || null
                };
                const id = generateTransactionId(transObj);
                const isIgnored = ignoredTransactions.has(id);
                return (
                  <TransactionItem
                    key={idx}
                    transaction={trans}
                    type={type}
                    isIgnored={isIgnored}
                    onToggleIgnore={() => toggleIgnoreTransaction(transObj)}
                  />
                );
              })}
            </div>
          ) : (
            <div className="no-transactions">{t('noTransactions', currentLanguage)}</div>
          )}
        </div>
      )}
    </div>
  );
}

function TransactionItem({ transaction, type, isIgnored, onToggleIgnore }: any) {
  const { currentLanguage } = useApp();
  return (
    <div className={`transaction-item ${isIgnored ? 'ignored' : ''}`}>
      <div className="transaction-header">
        <span className="transaction-date">{transaction.date}</span>
        <span className={`transaction-amount ${type === 'income' ? 'positive' : ''}`}>
          €{transaction.amount.toFixed(2)}
        </span>
      </div>
      <div className="transaction-beneficiary">{transaction.beneficiary || 'N/A'}</div>
      <div className="transaction-details">{transaction.details || ''}</div>
      <div className="transaction-actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleIgnore();
          }}
          className={`ignore-btn ${isIgnored ? 'unignore' : ''}`}
        >
          {isIgnored ? t('unignore', currentLanguage) : t('ignore', currentLanguage)}
        </button>
      </div>
    </div>
  );
}

