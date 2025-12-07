import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';

export default function Summary() {
  const { data, currentLanguage } = useApp();

  if (!data) return null;

  const netBalanceClass = data.summary.net_balance >= 0 ? 'positive' : 'negative';

  return (
    <div className="summary">
      <h2>{t('summary', currentLanguage)}</h2>
      <div className="stats">
        <div className="stat">
          <span className="label">{t('totalIncome', currentLanguage)}</span>
          <span className="value positive">€{data.summary.total_income.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="label">{t('totalExpenses', currentLanguage)}</span>
          <span className="value negative">€{data.summary.total_expenses.toFixed(2)}</span>
        </div>
        <div className="stat">
          <span className="label">{t('netBalance', currentLanguage)}</span>
          <span className={`value ${netBalanceClass}`}>
            €{data.summary.net_balance.toFixed(2)}
          </span>
        </div>
        <div className="stat">
          <span className="label">{t('transactions', currentLanguage)}</span>
          <span className="value">{data.summary.transaction_count}</span>
        </div>
      </div>
    </div>
  );
}

