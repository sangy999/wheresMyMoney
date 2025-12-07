import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';

export default function FileUpload() {
  const { loadCSV, isLoading, currentLanguage } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      await loadCSV(file);
    }
  };

  return (
    <div className={`upload-section ${fileName ? 'compact' : ''}`}>
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
    </div>
  );
}

