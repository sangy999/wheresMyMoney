import { Transaction, ManualEntry, AnalyzedData, MonthlyStats, TransactionDisplay } from '../types';
import { parseDate, formatMonth, generateTransactionId } from './csvParser';

export function getManualEntriesAsTransactions(manualEntries: ManualEntry[]): Transaction[] {
  return manualEntries.map(entry => ({
    date: parseDate(entry.date),
    dateStr: entry.date,
    amount: entry.amount,
    beneficiary: '',
    details: entry.description,
    type: entry.type,
    category: 'Manual Additions',
    isManual: true,
    manualEntryId: entry.id
  }));
}

export function analyzeData(
  csvTransactions: Transaction[],
  manualEntries: ManualEntry[],
  ignoredTransactionIds: Set<string>
): AnalyzedData {
  // Get manual entries as transactions
  const manualTransactions = getManualEntriesAsTransactions(manualEntries);
  
  // Merge CSV and manual transactions
  const allTransactions = [...csvTransactions, ...manualTransactions];
  
  // Filter out ignored transactions for calculations only
  const nonIgnoredTransactions = allTransactions.filter(t => {
    const id = generateTransactionId(t);
    return !ignoredTransactionIds.has(id);
  });
  
  // Separate income and expenses (for calculations - totals, category sums)
  const expenses = nonIgnoredTransactions.filter(t => t.type === 'D');
  const income = nonIgnoredTransactions.filter(t => t.type === 'K');
  
  // Keep all transactions (including ignored) for display purposes
  const allExpenses = allTransactions.filter(t => t.type === 'D');
  const allIncome = allTransactions.filter(t => t.type === 'K');
  
  // Calculate totals
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpenses;
  
  // Category breakdown (manual entries are always in "Manual Additions", never "Other")
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach(t => {
    // Ensure manual entries are never counted in "Other" - they belong to "Manual Additions"
    if (t.isManual && t.category !== 'Manual Additions') {
      t.category = 'Manual Additions';
    }
    expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
  });
  
  const incomeByCategory: Record<string, number> = {};
  income.forEach(t => {
    // Ensure manual entries are never counted in "Other" - they belong to "Manual Additions"
    if (t.isManual && t.category !== 'Manual Additions') {
      t.category = 'Manual Additions';
    }
    incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
  });
  
  // Monthly trends
  const monthlyExpenses: Record<string, number> = {};
  const monthlyIncome: Record<string, number> = {};
  const monthlyStats: Record<string, MonthlyStats> = {};
  
  // Process expenses for calculations (only non-ignored)
  expenses.forEach(t => {
    const month = formatMonth(t.date);
    monthlyExpenses[month] = (monthlyExpenses[month] || 0) + t.amount;
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        income: 0,
        expenses: 0,
        transactionCount: 0,
        expenseCount: 0,
        incomeCount: 0,
        expenseCategories: {},
        incomeCategories: {},
        expenseTransactions: {},
        incomeTransactions: {}
      };
    }
    monthlyStats[month].expenses += t.amount;
    monthlyStats[month].expenseCount++;
    monthlyStats[month].transactionCount++;
    
    // Track expenses by category (for calculations)
    if (!monthlyStats[month].expenseCategories[t.category]) {
      monthlyStats[month].expenseCategories[t.category] = 0;
    }
    monthlyStats[month].expenseCategories[t.category] += t.amount;
  });
  
  // Process all expenses (including ignored) for display
  allExpenses.forEach(t => {
    const month = formatMonth(t.date);
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        income: 0,
        expenses: 0,
        transactionCount: 0,
        expenseCount: 0,
        incomeCount: 0,
        expenseCategories: {},
        incomeCategories: {},
        expenseTransactions: {},
        incomeTransactions: {}
      };
    }
    
    // Track expenses by category (for display - includes all transactions)
    if (!monthlyStats[month].expenseTransactions[t.category]) {
      monthlyStats[month].expenseTransactions[t.category] = [];
    }
    monthlyStats[month].expenseTransactions[t.category].push({
      date: t.dateStr,
      beneficiary: t.beneficiary,
      details: t.details,
      amount: t.amount,
      isManual: t.isManual || false,
      manualEntryId: t.manualEntryId || null
    });
  });
  
  // Process income for calculations (only non-ignored)
  income.forEach(t => {
    const month = formatMonth(t.date);
    monthlyIncome[month] = (monthlyIncome[month] || 0) + t.amount;
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        income: 0,
        expenses: 0,
        transactionCount: 0,
        expenseCount: 0,
        incomeCount: 0,
        expenseCategories: {},
        incomeCategories: {},
        expenseTransactions: {},
        incomeTransactions: {}
      };
    }
    monthlyStats[month].income += t.amount;
    monthlyStats[month].incomeCount++;
    monthlyStats[month].transactionCount++;
    
    // Track income by category (for calculations)
    if (!monthlyStats[month].incomeCategories[t.category]) {
      monthlyStats[month].incomeCategories[t.category] = 0;
    }
    monthlyStats[month].incomeCategories[t.category] += t.amount;
  });
  
  // Process all income (including ignored) for display
  allIncome.forEach(t => {
    const month = formatMonth(t.date);
    
    if (!monthlyStats[month]) {
      monthlyStats[month] = {
        income: 0,
        expenses: 0,
        transactionCount: 0,
        expenseCount: 0,
        incomeCount: 0,
        expenseCategories: {},
        incomeCategories: {},
        expenseTransactions: {},
        incomeTransactions: {}
      };
    }
    
    // Track income by category (for display - includes all transactions)
    if (!monthlyStats[month].incomeTransactions[t.category]) {
      monthlyStats[month].incomeTransactions[t.category] = [];
    }
    monthlyStats[month].incomeTransactions[t.category].push({
      date: t.dateStr,
      beneficiary: t.beneficiary,
      details: t.details,
      amount: t.amount,
      isManual: t.isManual || false,
      manualEntryId: t.manualEntryId || null
    });
  });
  
  // Calculate net balance for each month
  Object.keys(monthlyStats).forEach(month => {
    monthlyStats[month].netBalance = monthlyStats[month].income - monthlyStats[month].expenses;
  });
  
  // Top merchants
  const merchantTotals: Record<string, number> = {};
  expenses.forEach(t => {
    const merchant = t.beneficiary || 'Unknown';
    merchantTotals[merchant] = (merchantTotals[merchant] || 0) + t.amount;
  });
  
  const topMerchants = Object.entries(merchantTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce((obj, [merchant, amount]) => {
      obj[merchant] = amount;
      return obj;
    }, {} as Record<string, number>);
  
  return {
    summary: {
      total_expenses: totalExpenses,
      total_income: totalIncome,
      net_balance: netBalance,
      transaction_count: allTransactions.length,
      expense_count: expenses.length,
      income_count: income.length
    },
    expenses_by_category: expenseByCategory,
    income_by_category: incomeByCategory,
    monthly_trends: {
      expenses: monthlyExpenses,
      income: monthlyIncome
    },
    monthly_stats: monthlyStats,
    top_expense_merchants: topMerchants
  };
}

