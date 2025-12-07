import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AnalyzedData, ManualEntry, FilterState, Language, Theme, Transaction } from '../types';
import { analyzeData } from '../utils/analyzer';
import { parseCSVRow, generateTransactionId } from '../utils/csvParser';
import Papa from 'papaparse';

interface AppContextType {
  // State
  data: AnalyzedData | null;
  originalData: AnalyzedData | null;
  allTransactions: Transaction[] | null;
  manualEntries: ManualEntry[];
  ignoredTransactions: Set<string>;
  currentLanguage: Language;
  currentTheme: Theme;
  filterState: FilterState;
  isLoading: boolean;
  error: string | null;
  editingManualEntryId: string | null;
  fileName: string | null;
  
  // Actions
  loadCSV: (file: File) => Promise<void>;
  addManualEntry: (entry: Omit<ManualEntry, 'id'>) => void;
  updateManualEntry: (id: string, entry: Omit<ManualEntry, 'id'>) => void;
  deleteManualEntry: (id: string) => void;
  toggleIgnoreTransaction: (transaction: Transaction) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  updateFilterState: (updates: Partial<FilterState>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
  setEditingManualEntryId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const STORAGE_KEYS = {
  LANGUAGE: 'language',
  THEME: 'theme',
  MANUAL_ENTRIES: 'manualEntries',
  IGNORED_TRANSACTIONS: 'ignoredTransactions',
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AnalyzedData | null>(null);
  const [originalData, setOriginalData] = useState<AnalyzedData | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[] | null>(null);
  const [manualEntries, setManualEntries] = useState<ManualEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MANUAL_ENTRIES);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [ignoredTransactions, setIgnoredTransactions] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.IGNORED_TRANSACTIONS);
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch {
        return new Set();
      }
    }
    return new Set();
  });
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) || 'en') as Language;
  });
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    const validThemes: Theme[] = ['light', 'dark', 'blue', 'green', 'purple', 'orange'];
    if (savedTheme && validThemes.includes(savedTheme as Theme)) {
      return savedTheme as Theme;
    }
    // Default to dark theme if no preference saved
    return 'dark';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingManualEntryId, setEditingManualEntryId] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const [filterState, setFilterState] = useState<FilterState>({
    dateFrom: '',
    dateTo: '',
    filterExpenses: true,
    filterIncome: true,
    amountMin: null,
    amountMax: null,
    selectedExpenseCategories: [],
    selectedIncomeCategories: [],
  });

  // Save manual entries to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANUAL_ENTRIES, JSON.stringify(manualEntries));
  }, [manualEntries]);

  // Save ignored transactions to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.IGNORED_TRANSACTIONS, JSON.stringify(Array.from(ignoredTransactions)));
  }, [ignoredTransactions]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, currentLanguage);
  }, [currentLanguage]);

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, currentTheme);
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const loadCSV = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setFileName(file.name);
    
    try {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          try {
            const transactions: Transaction[] = [];
            for (const row of results.data as Record<string, string>[]) {
              const transaction = parseCSVRow(row);
              if (transaction) {
                transactions.push(transaction);
              }
            }
            
            setAllTransactions(transactions);
            const analyzed = analyzeData(transactions, manualEntries, ignoredTransactions);
            setOriginalData(analyzed);
            setData(analyzed);
            
            // Initialize filter state with all categories selected
            setFilterState(prev => ({
              ...prev,
              selectedExpenseCategories: Object.keys(analyzed.expenses_by_category),
              selectedIncomeCategories: Object.keys(analyzed.income_by_category),
            }));
          } catch (err) {
            console.error('Analysis error:', err);
            setError('errorAnalyzingData');
          } finally {
            setIsLoading(false);
          }
        },
        error: (err) => {
          console.error('Parse error:', err);
          setError('errorParsingCSV');
          setIsLoading(false);
        }
      });
    } catch (err) {
      console.error('Error:', err);
      setError('errorReadingFile');
      setIsLoading(false);
    }
  }, [manualEntries, ignoredTransactions]);

  const applyFilters = useCallback(() => {
    if (!allTransactions || !originalData) return;
    
    // Filter transactions based on filter state
    const filtered = allTransactions.filter(t => {
      // Date filter
      if (filterState.dateFrom) {
        const filterDate = new Date(filterState.dateFrom);
        if (t.date < filterDate) return false;
      }
      if (filterState.dateTo) {
        const filterDate = new Date(filterState.dateTo);
        filterDate.setHours(23, 59, 59, 999);
        if (t.date > filterDate) return false;
      }
      
      // Type filter
      if (!filterState.filterExpenses && t.type === 'D') return false;
      if (!filterState.filterIncome && t.type === 'K') return false;
      
      // Amount filter
      if (filterState.amountMin !== null && Math.abs(t.amount) < filterState.amountMin) return false;
      if (filterState.amountMax !== null && Math.abs(t.amount) > filterState.amountMax) return false;
      
      // Category filter
      if (t.type === 'D' && filterState.selectedExpenseCategories.length > 0) {
        if (!filterState.selectedExpenseCategories.includes(t.category)) return false;
      }
      if (t.type === 'K' && filterState.selectedIncomeCategories.length > 0) {
        if (!filterState.selectedIncomeCategories.includes(t.category)) return false;
      }
      
      return true;
    });
    
    // Filter manual entries
    const filteredManualEntries = manualEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      
      if (filterState.dateFrom) {
        const filterDate = new Date(filterState.dateFrom);
        if (entryDate < filterDate) return false;
      }
      if (filterState.dateTo) {
        const filterDate = new Date(filterState.dateTo);
        filterDate.setHours(23, 59, 59, 999);
        if (entryDate > filterDate) return false;
      }
      
      if (!filterState.filterExpenses && entry.type === 'D') return false;
      if (!filterState.filterIncome && entry.type === 'K') return false;
      
      if (filterState.amountMin !== null && Math.abs(entry.amount) < filterState.amountMin) return false;
      if (filterState.amountMax !== null && Math.abs(entry.amount) > filterState.amountMax) return false;
      
      if (entry.type === 'D' && filterState.selectedExpenseCategories.length > 0) {
        if (!filterState.selectedExpenseCategories.includes('Manual Additions')) return false;
      }
      if (entry.type === 'K' && filterState.selectedIncomeCategories.length > 0) {
        if (!filterState.selectedIncomeCategories.includes('Manual Additions')) return false;
      }
      
      return true;
    });
    
    // Re-analyze with filtered data
    const filteredData = analyzeData(filtered, filteredManualEntries, ignoredTransactions);
    setData(filteredData);
  }, [allTransactions, originalData, manualEntries, ignoredTransactions, filterState]);

  // Update originalData when manual entries or ignored transactions change
  useEffect(() => {
    if (allTransactions) {
      const analyzed = analyzeData(allTransactions, manualEntries, ignoredTransactions);
      setOriginalData(analyzed);
    }
  }, [allTransactions, manualEntries, ignoredTransactions]);

  // Re-apply filters when dependencies change
  useEffect(() => {
    if (allTransactions && originalData) {
      applyFilters();
    }
  }, [filterState, manualEntries, ignoredTransactions, allTransactions, originalData, applyFilters]);

  const addManualEntry = useCallback((entry: Omit<ManualEntry, 'id'>) => {
    const newEntry: ManualEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setManualEntries(prev => [...prev, newEntry]);
  }, []);

  const updateManualEntry = useCallback((id: string, entry: Omit<ManualEntry, 'id'>) => {
    setManualEntries(prev => prev.map(e => e.id === id ? { ...entry, id } : e));
    setEditingManualEntryId(null);
  }, []);

  const setEditingManualEntryIdHandler = useCallback((id: string | null) => {
    setEditingManualEntryId(id);
  }, []);

  const deleteManualEntry = useCallback((id: string) => {
    setManualEntries(prev => prev.filter(e => e.id !== id));
  }, []);

  const toggleIgnoreTransaction = useCallback((transaction: Transaction) => {
    const id = generateTransactionId(transaction);
    setIgnoredTransactions(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const updateFilterState = useCallback((updates: Partial<FilterState>) => {
    setFilterState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetFilters = useCallback(() => {
    if (!originalData) return;
    
    // Calculate date range from all data
    const allDates: Date[] = [];
    if (allTransactions) {
      allDates.push(...allTransactions.map(t => t.date));
    }
    manualEntries.forEach(entry => {
      allDates.push(new Date(entry.date));
    });
    
    if (allDates.length > 0) {
      allDates.sort((a, b) => a.getTime() - b.getTime());
      const minDate = allDates[0];
      const maxDate = allDates[allDates.length - 1];
      
      setFilterState({
        dateFrom: minDate.toISOString().split('T')[0],
        dateTo: maxDate.toISOString().split('T')[0],
        filterExpenses: true,
        filterIncome: true,
        amountMin: null,
        amountMax: null,
        selectedExpenseCategories: Object.keys(originalData.expenses_by_category),
        selectedIncomeCategories: Object.keys(originalData.income_by_category),
      });
    } else {
      setFilterState({
        dateFrom: '',
        dateTo: '',
        filterExpenses: true,
        filterIncome: true,
        amountMin: null,
        amountMax: null,
        selectedExpenseCategories: Object.keys(originalData.expenses_by_category),
        selectedIncomeCategories: Object.keys(originalData.income_by_category),
      });
    }
  }, [originalData, allTransactions, manualEntries]);

  return (
    <AppContext.Provider
      value={{
        data,
        originalData,
        allTransactions,
        manualEntries,
        ignoredTransactions,
        currentLanguage,
        currentTheme,
        filterState,
        isLoading,
        error,
        editingManualEntryId,
        fileName,
        loadCSV,
        addManualEntry,
        updateManualEntry,
        deleteManualEntry,
        toggleIgnoreTransaction,
        setLanguage: setCurrentLanguage,
        setTheme: setCurrentTheme,
        updateFilterState,
        resetFilters,
        applyFilters,
        setEditingManualEntryId: setEditingManualEntryIdHandler,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

