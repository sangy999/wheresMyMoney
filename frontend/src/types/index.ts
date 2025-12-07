export interface Transaction {
  date: Date;
  dateStr: string;
  amount: number;
  beneficiary: string;
  details: string;
  type: 'D' | 'K';
  category: string;
  isManual: boolean;
  manualEntryId?: string;
}

export interface ManualEntry {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'D' | 'K';
}

export interface MonthlyStats {
  income: number;
  expenses: number;
  netBalance: number;
  transactionCount: number;
  expenseCount: number;
  incomeCount: number;
  expenseCategories: Record<string, number>;
  incomeCategories: Record<string, number>;
  expenseTransactions: Record<string, TransactionDisplay[]>;
  incomeTransactions: Record<string, TransactionDisplay[]>;
}

export interface TransactionDisplay {
  date: string;
  beneficiary: string;
  details: string;
  amount: number;
  isManual: boolean;
  manualEntryId: string | null;
}

export interface AnalyzedData {
  summary: {
    total_expenses: number;
    total_income: number;
    net_balance: number;
    transaction_count: number;
    expense_count: number;
    income_count: number;
  };
  expenses_by_category: Record<string, number>;
  income_by_category: Record<string, number>;
  monthly_trends: {
    expenses: Record<string, number>;
    income: Record<string, number>;
  };
  monthly_stats: Record<string, MonthlyStats>;
  top_expense_merchants: Record<string, number>;
}

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  filterExpenses: boolean;
  filterIncome: boolean;
  amountMin: number | null;
  amountMax: number | null;
  selectedExpenseCategories: string[];
  selectedIncomeCategories: string[];
}

export type Language = 'en' | 'lt';
export type Theme = 'light' | 'dark' | 'blue' | 'green' | 'purple' | 'orange';

export interface Translations {
  [key: string]: string | string[] | Record<string, string>;
}

