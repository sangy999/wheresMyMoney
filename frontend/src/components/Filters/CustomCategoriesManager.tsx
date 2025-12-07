import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';
import { CustomCategory } from '../../types';

export default function CustomCategoriesManager() {
  const {
    customCategories,
    addCustomCategory,
    updateCustomCategory,
    deleteCustomCategory,
    currentLanguage,
  } = useApp();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [type, setType] = useState<'D' | 'K'>('D');

  useEffect(() => {
    if (editingId) {
      const category = customCategories.find(c => c.id === editingId);
      if (category) {
        setName(category.name);
        setKeywords(category.keywords.join(', '));
        setType(category.type);
      }
    } else {
      setName('');
      setKeywords('');
      setType('D');
    }
  }, [editingId, customCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const keywordArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (!name || keywordArray.length === 0) {
      alert('Please enter a category name and at least one keyword');
      return;
    }

    if (editingId) {
      updateCustomCategory(editingId, {
        name,
        keywords: keywordArray,
        type,
      });
      setEditingId(null);
    } else {
      addCustomCategory({
        name,
        keywords: keywordArray,
        type,
      });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setKeywords('');
    setType('D');
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this custom category? Transactions will be re-categorized.')) {
      deleteCustomCategory(id);
    }
  };

  const expenseCategories = customCategories.filter(c => c.type === 'D');
  const incomeCategories = customCategories.filter(c => c.type === 'K');

  return (
    <div className="custom-categories-manager">
      <div className="custom-categories-form">
        <h4>{editingId ? t('editCustomCategory', currentLanguage) : t('addCustomCategory', currentLanguage)}</h4>
        <form onSubmit={handleSubmit} className="manual-entry-form">
          <div className="form-row">
            <label htmlFor="categoryName">{t('categoryName', currentLanguage)}</label>
            <input
              type="text"
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Coffee Shops"
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="categoryKeywords">{t('keywords', currentLanguage)}</label>
            <input
              type="text"
              id="categoryKeywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., STARBUCKS, COFFEE, CAFE (comma-separated)"
              required
            />
            <small>{t('keywordsHint', currentLanguage)}</small>
          </div>
          <div className="form-row">
            <label htmlFor="categoryType">{t('type', currentLanguage)}</label>
            <select
              id="categoryType"
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
              {editingId ? t('save', currentLanguage) : t('add', currentLanguage)}
            </button>
            {editingId && (
              <button type="button" className="filter-btn-small" onClick={handleCancel}>
                {t('cancel', currentLanguage)}
              </button>
            )}
          </div>
        </form>
      </div>

      {customCategories.length > 0 && (
        <div className="custom-categories-list">
          {expenseCategories.length > 0 && (
            <div className="custom-category-group">
              <h4>{t('expenseCategories', currentLanguage)}</h4>
              <div className="custom-categories-container">
                {expenseCategories.map((category) => (
                  <div key={category.id} className="custom-category-item">
                    <div className="custom-category-header">
                      <span className="custom-category-name">{category.name}</span>
                    </div>
                    <div className="custom-category-keywords">
                      <strong>{t('keywords', currentLanguage)}:</strong> {category.keywords.join(', ')}
                    </div>
                    <div className="custom-category-actions">
                      <button
                        onClick={() => setEditingId(category.id)}
                        className="manual-entry-btn edit-btn"
                      >
                        {t('edit', currentLanguage)}
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="manual-entry-btn delete-btn"
                      >
                        {t('delete', currentLanguage)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {incomeCategories.length > 0 && (
            <div className="custom-category-group">
              <h4>{t('incomeCategories', currentLanguage)}</h4>
              <div className="custom-categories-container">
                {incomeCategories.map((category) => (
                  <div key={category.id} className="custom-category-item">
                    <div className="custom-category-header">
                      <span className="custom-category-name">{category.name}</span>
                    </div>
                    <div className="custom-category-keywords">
                      <strong>{t('keywords', currentLanguage)}:</strong> {category.keywords.join(', ')}
                    </div>
                    <div className="custom-category-actions">
                      <button
                        onClick={() => setEditingId(category.id)}
                        className="manual-entry-btn edit-btn"
                      >
                        {t('edit', currentLanguage)}
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="manual-entry-btn delete-btn"
                      >
                        {t('delete', currentLanguage)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {customCategories.length === 0 && (
        <div className="no-custom-categories">
          {t('noCustomCategories', currentLanguage)}
        </div>
      )}
    </div>
  );
}

