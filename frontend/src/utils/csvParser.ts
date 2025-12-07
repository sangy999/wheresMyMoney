import { Transaction, CustomCategory } from '../types';
import { categorizeTransaction } from './categorizer';

export function getColumnValue(row: Record<string, string>, columnMappings: string[]): string {
  for (const columnName of columnMappings) {
    if (row[columnName] !== undefined && row[columnName] !== null && row[columnName] !== '') {
      return row[columnName];
    }
  }
  return '';
}

export function parseDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  }
  return new Date(dateStr);
}

export function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseCSVRow(row: Record<string, string>, customCategories: CustomCategory[] = []): Transaction | null {
  const type = getColumnValue(row, ['D/K', 'D/K']);
  const details = getColumnValue(row, ['Details', 'Paaiškinimai']).trim().toUpperCase();
  
  // Skip turnover and closing balance lines
  if (details.includes('TURNOVER') || details.includes('APYVARTA') || 
      details.includes('CLOSING BALANCE') || details.includes('LIKUTIS PABAIGAI')) {
    return null;
  }
  
  if (type !== 'D' && type !== 'K') {
    return null;
  }
  
  const dateStr = getColumnValue(row, ['Date', 'Data']);
  const amount = parseFloat(getColumnValue(row, ['Amount', 'Suma']) || '0');
  const beneficiary = getColumnValue(row, ['Beneficiary', 'Gavėjas']).trim();
  const detailsOriginal = getColumnValue(row, ['Details', 'Paaiškinimai']).trim();
  const date = parseDate(dateStr);
  
  // Check if this is an opening balance line
  const isOpeningBalance = details.includes('OPENING BALANCE') || 
                          details.includes('LIKUTIS PRADŽIAI');
  
  if (isNaN(amount) || isNaN(date.getTime())) {
    return null;
  }
  
  return {
    date,
    dateStr,
    amount,
    beneficiary,
    details: detailsOriginal,
    type: isOpeningBalance ? 'K' : type as 'D' | 'K',
    category: isOpeningBalance ? 'Opening Balance' : categorizeTransaction(beneficiary, detailsOriginal, customCategories, isOpeningBalance ? 'K' : type as 'D' | 'K'),
    isManual: false
  };
}

// Helper function to re-categorize existing transactions
export function recategorizeTransactions(transactions: Transaction[], customCategories: CustomCategory[]): Transaction[] {
  return transactions.map(t => {
    // Don't re-categorize manual entries or opening balance
    if (t.isManual || t.category === 'Opening Balance' || t.category === 'Manual Additions') {
      return t;
    }
    return {
      ...t,
      category: categorizeTransaction(t.beneficiary, t.details, customCategories, t.type)
    };
  });
}

export function generateTransactionId(transaction: Transaction): string {
  // For manual entries, use the manual entry ID to ensure uniqueness
  if (transaction.isManual && transaction.manualEntryId) {
    return `manual_${transaction.manualEntryId}`;
  }
  
  // For CSV transactions, create a unique identifier based on transaction properties
  const key = `${transaction.dateStr}|${transaction.beneficiary}|${transaction.details}|${transaction.amount}|${transaction.type}`;
  
  // Use a simple hash function to create a unique ID that handles Unicode characters
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    const char = key.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Return a positive hash value as string
  return Math.abs(hash).toString(36);
}

