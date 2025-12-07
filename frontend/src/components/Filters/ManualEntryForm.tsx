import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';

export default function ManualEntryForm() {
  const {
    addManualEntry,
    updateManualEntry,
    editingManualEntryId,
    manualEntries,
    setEditingManualEntryId,
    currentLanguage,
  } = useApp();
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'D' | 'K'>('D');

  React.useEffect(() => {
    if (editingManualEntryId) {
      const entry = manualEntries.find(e => e.id === editingManualEntryId);
      if (entry) {
        setDate(entry.date);
        setDescription(entry.description);
        setAmount(entry.amount.toString());
        setType(entry.type);
      }
    } else {
      setDate('');
      setDescription('');
      setAmount('');
      setType('D');
    }
  }, [editingManualEntryId, manualEntries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!date || !description || isNaN(amountNum) || amountNum <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }

    if (editingManualEntryId) {
      updateManualEntry(editingManualEntryId, { date, description, amount: amountNum, type });
    } else {
      addManualEntry({ date, description, amount: amountNum, type });
    }
  };

  const handleCancel = () => {
    setEditingManualEntryId(null);
    setDate('');
    setDescription('');
    setAmount('');
    setType('D');
  };

  return (
    <form className="manual-entry-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="manualDate">{t('date', currentLanguage)}</label>
        <input
          type="date"
          id="manualDate"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="manualDescription">{t('description', currentLanguage)}</label>
        <input
          type="text"
          id="manualDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="manualAmount">{t('amount', currentLanguage)}</label>
        <input
          type="number"
          id="manualAmount"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>
      <div className="form-row">
        <label htmlFor="manualType">{t('type', currentLanguage)}</label>
        <select
          id="manualType"
          value={type}
          onChange={(e) => setType(e.target.value as 'D' | 'K')}
          required
        >
          <option value="D">{t('expenses', currentLanguage)}</option>
          <option value="K">{t('income', currentLanguage)}</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="filter-btn-small">
          {editingManualEntryId ? t('save', currentLanguage) : t('add', currentLanguage)}
        </button>
        {editingManualEntryId && (
          <button type="button" className="filter-btn-small" onClick={handleCancel}>
            {t('cancel', currentLanguage)}
          </button>
        )}
      </div>
    </form>
  );
}

