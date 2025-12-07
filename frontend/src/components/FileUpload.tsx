import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';

export default function FileUpload() {
  const { loadCSV, isLoading, currentLanguage, fileName } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await loadCSV(file);
    }
  };

  return (
    <>
      <div className="file-input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          id="csvFile"
          accept=".csv"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <label
          htmlFor="csvFile"
          className={`file-label ${fileName ? 'file-selected' : ''}`}
        >
          {fileName || t('chooseFile', currentLanguage)}
        </label>
      </div>
      {isLoading && (
        <div id="loading" className="loading">
          {t('analyzing', currentLanguage)}
        </div>
      )}
    </>
  );
}

