import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { t, translateCategory, sortCategoriesByOrder, EXPENSE_CATEGORY_ORDER, INCOME_CATEGORY_ORDER } from '../../utils/translations';
import ManualEntryForm from './ManualEntryForm';
import ManualEntriesList from './ManualEntriesList';
import IgnoredTransactionsList from './IgnoredTransactionsList';

export default function FilterSidebar() {
  const {
    data,
    originalData,
    filterState,
    updateFilterState,
    resetFilters,
    currentLanguage,
  } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setIsVisible(true);
    }
  }, [data]);

  if (!isVisible) return null;

  const expenseCategories = originalData 
    ? sortCategoriesByOrder(Object.keys(originalData.expenses_by_category), EXPENSE_CATEGORY_ORDER)
    : [];
  const incomeCategories = originalData 
    ? sortCategoriesByOrder(Object.keys(originalData.income_by_category), INCOME_CATEGORY_ORDER)
    : [];

  const handleCategoryToggle = (category: string, type: 'expense' | 'income') => {
    const key = type === 'expense' ? 'selectedExpenseCategories' : 'selectedIncomeCategories';
    const current = filterState[key];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    updateFilterState({ [key]: updated });
  };

  const selectAllCategories = (type: 'expense' | 'income') => {
    const categories = type === 'expense' ? expenseCategories : incomeCategories;
    const key = type === 'expense' ? 'selectedExpenseCategories' : 'selectedIncomeCategories';
    updateFilterState({ [key]: categories });
  };

  const deselectAllCategories = (type: 'expense' | 'income') => {
    const key = type === 'expense' ? 'selectedExpenseCategories' : 'selectedIncomeCategories';
    updateFilterState({ [key]: [] });
  };

  return (
    <aside className="sidebar">
      <div className="filters-panel">
        <div className="filters-header">
          <h2>🔍 {t('filters', currentLanguage)}</h2>
        </div>
        <div className="filters-content">
          <div className="filter-group">
            <h3>{t('dateRange', currentLanguage)}</h3>
            <div className="date-inputs">
              <div className="date-input">
                <label htmlFor="dateFrom">{t('from', currentLanguage)}</label>
                <input
                  type="date"
                  id="dateFrom"
                  value={filterState.dateFrom}
                  onChange={(e) => updateFilterState({ dateFrom: e.target.value })}
                />
              </div>
              <div className="date-input">
                <label htmlFor="dateTo">{t('to', currentLanguage)}</label>
                <input
                  type="date"
                  id="dateTo"
                  value={filterState.dateTo}
                  onChange={(e) => updateFilterState({ dateTo: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h3>{t('transactionType', currentLanguage)}</h3>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={filterState.filterExpenses}
                  onChange={(e) => updateFilterState({ filterExpenses: e.target.checked })}
                />
                <span>{t('expenses', currentLanguage)}</span>
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filterState.filterIncome}
                  onChange={(e) => updateFilterState({ filterIncome: e.target.checked })}
                />
                <span>{t('income', currentLanguage)}</span>
              </label>
            </div>
          </div>

          <div className="filter-group">
            <h3>{t('expenseCategories', currentLanguage)}</h3>
            <div className="checkbox-group">
              {expenseCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={filterState.selectedExpenseCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category, 'expense')}
                  />
                  <span>{translateCategory(category, currentLanguage)}</span>
                </label>
              ))}
            </div>
            <div className="filter-actions">
              <button
                className="filter-btn-small"
                onClick={() => selectAllCategories('expense')}
              >
                {t('selectAll', currentLanguage)}
              </button>
              <button
                className="filter-btn-small"
                onClick={() => deselectAllCategories('expense')}
              >
                {t('deselectAll', currentLanguage)}
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>{t('incomeCategories', currentLanguage)}</h3>
            <div className="checkbox-group">
              {incomeCategories.map((category) => (
                <label key={category}>
                  <input
                    type="checkbox"
                    checked={filterState.selectedIncomeCategories.includes(category)}
                    onChange={() => handleCategoryToggle(category, 'income')}
                  />
                  <span>{translateCategory(category, currentLanguage)}</span>
                </label>
              ))}
            </div>
            <div className="filter-actions">
              <button
                className="filter-btn-small"
                onClick={() => selectAllCategories('income')}
              >
                {t('selectAll', currentLanguage)}
              </button>
              <button
                className="filter-btn-small"
                onClick={() => deselectAllCategories('income')}
              >
                {t('deselectAll', currentLanguage)}
              </button>
            </div>
          </div>

          <div className="filter-group">
            <h3>{t('amountRange', currentLanguage)}</h3>
            <div className="amount-inputs">
              <div className="amount-input">
                <label htmlFor="amountMin">{t('min', currentLanguage)}</label>
                <input
                  type="number"
                  id="amountMin"
                  step="0.01"
                  value={filterState.amountMin || ''}
                  onChange={(e) =>
                    updateFilterState({
                      amountMin: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder={t('noMinimum', currentLanguage)}
                />
              </div>
              <div className="amount-input">
                <label htmlFor="amountMax">{t('max', currentLanguage)}</label>
                <input
                  type="number"
                  id="amountMax"
                  step="0.01"
                  value={filterState.amountMax || ''}
                  onChange={(e) =>
                    updateFilterState({
                      amountMax: e.target.value ? parseFloat(e.target.value) : null,
                    })
                  }
                  placeholder={t('noMaximum', currentLanguage)}
                />
              </div>
            </div>
          </div>

          <div className="filter-group">
            <h3>{t('manualAdditions', currentLanguage)}</h3>
            <ManualEntryForm />
            <ManualEntriesList />
          </div>

          <div className="filter-group">
            <h3>{t('ignoredTransactions', currentLanguage)}</h3>
            <IgnoredTransactionsList />
          </div>

          <div className="filter-actions">
            <button className="filter-btn" onClick={resetFilters}>
              {t('resetFilters', currentLanguage)}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

