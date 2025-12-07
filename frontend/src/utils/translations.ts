import { Language, Translations } from '../types';

export const translations: Record<Language, Translations> = {
  "en": {
    "appTitle": "💰 Where is my money?",
    "chooseFile": "Choose CSV File",
    "analyzing": "Analyzing...",
    "summary": "Summary",
    "totalIncome": "Total Income:",
    "totalExpenses": "Total Expenses:",
    "netBalance": "Net Balance:",
    "transactions": "Transactions:",
    "filters": "Filters",
    "dateRange": "Date Range",
    "from": "From:",
    "to": "To:",
    "transactionType": "Transaction Type",
    "expenses": "Expenses",
    "income": "Income",
    "expenseCategories": "Expense Categories",
    "incomeCategories": "Income Categories",
    "selectAll": "Select All",
    "deselectAll": "Deselect All",
    "amountRange": "Amount Range",
    "min": "Min (€):",
    "max": "Max (€):",
    "noMinimum": "No minimum",
    "noMaximum": "No maximum",
    "resetFilters": "Reset Filters",
    "monthlyStatistics": "Monthly Statistics",
    "chartsGraphs": "Charts & Graphs",
    "expensesByCategory": "Expenses by Category",
    "monthlyTrends": "Monthly Trends",
    "topExpenseMerchants": "Top Expense Merchants",
    "savingsRateOverTime": "Savings Rate Over Time",
    "cumulativeCashFlow": "Cumulative Cash Flow",
    "expensesByCategoryOverTime": "Expenses by Category Over Time",
    "monthOverMonthComparison": "Month-over-Month Category Comparison",
    "averageSpendingPerCategory": "Average Spending per Category",
    "categoryGrowthRate": "Category Growth Rate",
    "spendingEfficiency": "Spending Efficiency Analysis",
    "monthNames": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    "amountSpent": "Amount Spent",
    "savingsRate": "Savings Rate (%)",
    "amountSaved": "Amount saved",
    "cumulativeCashFlowLabel": "Cumulative Cash Flow",
    "noIncomeData": "No income data",
    "cumulative": "Cumulative",
    "monthlyChange": "Monthly change",
    "noTransactions": "No transactions found",
    "error": "Error",
    "pleaseSelectFile": "Please select a CSV file",
    "errorParsingCSV": "Error parsing CSV file",
    "errorAnalyzingData": "Error analyzing data",
    "errorReadingFile": "Error reading file",
    "categories": {
      "Salary": "Salary",
      "Other Income": "Other Income",
      "Opening Balance": "Opening Balance",
      "Groceries": "Groceries",
      "Gas/Fuel": "Gas/Fuel",
      "Subscriptions": "Subscriptions",
      "Restaurants": "Restaurants",
      "Shopping": "Shopping",
      "Transport": "Transport",
      "Healthcare": "Healthcare",
      "Insurance": "Insurance",
      "Utilities": "Utilities",
      "Transfers": "Transfers",
      "Entertainment": "Entertainment",
      "Other": "Other",
      "Manual Additions": "Manual Additions"
    },
    "manualAdditions": "Manual Additions",
    "addManualEntry": "Add Manual Entry",
    "date": "Date:",
    "description": "Description:",
    "amount": "Amount (€):",
    "type": "Type:",
    "add": "Add",
    "edit": "Edit",
    "delete": "Delete",
    "save": "Save",
    "cancel": "Cancel",
    "noManualEntries": "No manual entries",
    "manualEntries": "Manual Entries",
    "ignore": "Ignore",
    "unignore": "Unignore",
    "ignored": "Ignored",
    "ignoredTransactions": "Ignored Transactions",
    "noIgnoredTransactions": "No ignored transactions",
    "reenable": "Re-enable",
    "themes": {
      "dark": "Dark",
      "light": "Light",
      "blue": "Blue",
      "green": "Green",
      "purple": "Purple",
      "orange": "Orange"
    },
    "selectTheme": "Select theme"
  },
  "lt": {
    "appTitle": "💰 Kur mano pinigai?",
    "chooseFile": "Pasirinkite CSV failą",
    "analyzing": "Analizuojama...",
    "summary": "Santrauka",
    "totalIncome": "Bendros pajamos:",
    "totalExpenses": "Bendros išlaidos:",
    "netBalance": "Grynasis balansas:",
    "transactions": "Operacijos:",
    "filters": "Filtrai",
    "dateRange": "Data",
    "from": "Nuo:",
    "to": "Iki:",
    "transactionType": "Operacijos tipas",
    "expenses": "Išlaidos",
    "income": "Pajamos",
    "expenseCategories": "Išlaidų kategorijos",
    "incomeCategories": "Pajamų kategorijos",
    "selectAll": "Pasirinkti viską",
    "deselectAll": "Atžymėti viską",
    "amountRange": "Sumos diapazonas",
    "min": "Min (€):",
    "max": "Max (€):",
    "noMinimum": "Nėra minimumo",
    "noMaximum": "Nėra maksimumo",
    "resetFilters": "Atstatyti filtrus",
    "monthlyStatistics": "Mėnesio statistika",
    "chartsGraphs": "Grafikai ir diagramos",
    "expensesByCategory": "Išlaidos pagal kategoriją",
    "monthlyTrends": "Mėnesio tendencijos",
    "topExpenseMerchants": "Top išlaidų pardavėjai",
    "savingsRateOverTime": "Taupymo norma laikui bėgant",
    "cumulativeCashFlow": "Kaupiamasis pinigų srautas",
    "expensesByCategoryOverTime": "Išlaidos pagal kategoriją laikui bėgant",
    "monthOverMonthComparison": "Mėnesio palyginimas pagal kategorijas",
    "averageSpendingPerCategory": "Vidutinės išlaidos pagal kategoriją",
    "categoryGrowthRate": "Kategorijų augimo tempas",
    "spendingEfficiency": "Išlaidų efektyvumo analizė",
    "monthNames": ["Sausis", "Vasaris", "Kovas", "Balandis", "Gegužė", "Birželis", "Liepa", "Rugpjūtis", "Rugsėjis", "Spalis", "Lapkritis", "Gruodis"],
    "amountSpent": "Išleista suma",
    "savingsRate": "Taupymo norma (%)",
    "amountSaved": "Ištaupyta suma",
    "cumulativeCashFlowLabel": "Kaupiamasis pinigų srautas",
    "noIncomeData": "Nėra pajamų duomenų",
    "cumulative": "Kaupiamasis",
    "monthlyChange": "Mėnesio pokytis",
    "noTransactions": "Operacijų nerasta",
    "error": "Klaida",
    "pleaseSelectFile": "Prašome pasirinkti CSV failą",
    "errorParsingCSV": "Klaida analizuojant CSV failą",
    "errorAnalyzingData": "Klaida analizuojant duomenis",
    "errorReadingFile": "Klaida skaitant failą",
    "categories": {
      "Salary": "Atlyginimas",
      "Other Income": "Kitos pajamos",
      "Opening Balance": "Likutis pradžiai",
      "Groceries": "Maistas",
      "Gas/Fuel": "Kuras",
      "Subscriptions": "Prenumeratos",
      "Restaurants": "Restoranai",
      "Shopping": "Pirkimai",
      "Transport": "Transportas",
      "Healthcare": "Sveikata",
      "Insurance": "Draudimas",
      "Utilities": "Komunalinės paslaugos",
      "Transfers": "Pervedimai",
      "Entertainment": "Pramogos",
      "Other": "Kita",
      "Manual Additions": "Rankiniai įrašai"
    },
    "manualAdditions": "Rankiniai įrašai",
    "addManualEntry": "Pridėti rankinį įrašą",
    "date": "Data:",
    "description": "Aprašymas:",
    "amount": "Suma (€):",
    "type": "Tipas:",
    "add": "Pridėti",
    "edit": "Redaguoti",
    "delete": "Ištrinti",
    "save": "Išsaugoti",
    "cancel": "Atšaukti",
    "noManualEntries": "Nėra rankinių įrašų",
    "manualEntries": "Rankiniai įrašai",
    "ignore": "Ignoruoti",
    "unignore": "Neignoruoti",
    "ignored": "Ignoruota",
    "ignoredTransactions": "Ignoruotos operacijos",
    "noIgnoredTransactions": "Nėra ignoruotų operacijų",
    "reenable": "Įjungti vėl",
    "themes": {
      "dark": "Tamsus",
      "light": "Šviesus",
      "blue": "Mėlynas",
      "green": "Žalias",
      "purple": "Violetinis",
      "orange": "Oranžinis"
    },
    "selectTheme": "Pasirinkite temą"
  }
};

export function t(key: string, lang: Language = 'en'): string {
  const translation = translations[lang][key];
  if (typeof translation === 'string') {
    return translation;
  }
  // Fallback to English if not found
  const enTranslation = translations['en'][key];
  if (typeof enTranslation === 'string') {
    return enTranslation;
  }
  return key;
}

export function translateCategory(category: string, lang: Language = 'en'): string {
  const categories = translations[lang].categories;
  if (categories && typeof categories === 'object' && category in categories) {
    const cat = categories as Record<string, string>;
    return cat[category] || category;
  }
  return category;
}

// Define the order for expense and income categories
export const EXPENSE_CATEGORY_ORDER = [
  'Groceries',
  'Gas/Fuel',
  'Subscriptions',
  'Restaurants',
  'Shopping',
  'Transport',
  'Healthcare',
  'Insurance',
  'Utilities',
  'Transfers',
  'Entertainment',
  'Other'
];

export const INCOME_CATEGORY_ORDER = [
  'Salary',
  'Other Income'
];

// Sort categories according to the defined order
export function sortCategoriesByOrder<T extends string | [string, any]>(
  categories: T[],
  order: string[],
  getCategoryName: (item: T) => string = (item) => (typeof item === 'string' ? item : item[0])
): T[] {
  const orderMap = new Map(order.map((cat, index) => [cat, index]));
  
  return [...categories].sort((a, b) => {
    const nameA = getCategoryName(a);
    const nameB = getCategoryName(b);
    const indexA = orderMap.get(nameA) ?? Infinity;
    const indexB = orderMap.get(nameB) ?? Infinity;
    
    // Categories in the order list come first, then alphabetically
    if (indexA !== indexB) {
      return indexA - indexB;
    }
    return nameA.localeCompare(nameB);
  });
}

