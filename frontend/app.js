let expenseChart, trendChart, merchantChart, savingsRateChart, cumulativeCashFlowChart;
let originalData = null; // Store original unfiltered data
let allTransactions = null; // Store all transactions for filtering
let currentLanguage = localStorage.getItem('language') || 'en';
let manualEntries = []; // Store manual entries
let editingManualEntryId = null; // Track which manual entry is being edited
let ignoredTransactions = new Set(); // Store ignored transaction IDs

// Inline translations
const translations = {
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
        "reenable": "Re-enable"
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
        "reenable": "Įjungti vėl"
    }
};

// Initialize translations
function loadTranslations() {
    // Ensure current language exists, fallback to 'en' if not
    if (!translations[currentLanguage]) {
        currentLanguage = 'en';
    }
    
    // Apply translations after a short delay to ensure DOM is ready
    setTimeout(() => {
        applyTranslations();
    }, 50);
}

// Translation function
function t(key) {
    if (!translations[currentLanguage]) {
        // Fallback to English if current language not found
        if (translations['en'] && translations['en'][key]) {
            return translations['en'][key];
        }
        return key;
    }
    // Try current language first, then fallback to English, then return key
    return translations[currentLanguage][key] || (translations['en'] && translations['en'][key]) || key;
}

// Translate category name
function translateCategory(category) {
    if (!translations[currentLanguage]) {
        return category;
    }
    const categories = translations[currentLanguage].categories || translations['en']?.categories;
    if (categories && categories[category]) {
        return categories[category];
    }
    return category;
}

// Apply translations to all elements with data-translate attribute
function applyTranslations() {
    if (!translations[currentLanguage]) {
        console.warn('Language not found in translations:', currentLanguage);
        return;
    }
    
    // Translate elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (key) {
            const translation = t(key);
            element.textContent = translation;
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-placeholder]').forEach(element => {
        const key = element.getAttribute('data-placeholder');
        if (key) {
            const translation = t(key);
            element.placeholder = translation;
        }
    });
    
    // Translate select options
    document.querySelectorAll('select option[data-translate]').forEach(option => {
        const key = option.getAttribute('data-translate');
        if (key) {
            const translation = t(key);
            option.textContent = translation;
        }
    });
    
    // Update language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`lang${currentLanguage === 'en' ? 'En' : 'Lt'}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
    
    // Update loading text if it exists
    const loading = document.getElementById('loading');
    if (loading) {
        loading.textContent = t('analyzing');
    }
    
    // Update filter category labels if filters exist
    updateFilterCategoryLabels();
}

// Update filter category labels with translations
function updateFilterCategoryLabels() {
    // Update expense category labels
    document.querySelectorAll('.expense-category-checkbox').forEach(checkbox => {
        const category = checkbox.value;
        const label = checkbox.parentElement;
        if (label) {
            // Preserve checkbox state
            const isChecked = checkbox.checked;
            // Update label text with translated category
            label.innerHTML = `<input type="checkbox" class="expense-category-checkbox" value="${category}" ${isChecked ? 'checked' : ''} onchange="applyFilters()"> ${translateCategory(category)}`;
        }
    });
    
    // Update income category labels
    document.querySelectorAll('.income-category-checkbox').forEach(checkbox => {
        const category = checkbox.value;
        const label = checkbox.parentElement;
        if (label) {
            // Preserve checkbox state
            const isChecked = checkbox.checked;
            // Update label text with translated category
            label.innerHTML = `<input type="checkbox" class="income-category-checkbox" value="${category}" ${isChecked ? 'checked' : ''} onchange="applyFilters()"> ${translateCategory(category)}`;
        }
    });
}

// Change language
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.warn('Language not found:', lang);
        return;
    }
    
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Apply translations immediately to static elements
    applyTranslations();
    
    // Update filter category labels if filters exist
    updateFilterCategoryLabels();
    
    // Re-render charts and stats if data exists (this will use t() function for dynamic content)
    if (originalData) {
        displayResults(originalData);
    }
}

function handleFileSelect() {
    const fileInput = document.getElementById('csvFile');
    const fileLabel = document.getElementById('fileLabel');
    const uploadSection = document.querySelector('.upload-section');
    const container = document.querySelector('.container');
    
    if (fileInput.files && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileLabel.textContent = fileName;
        fileLabel.classList.add('file-selected');
        if (uploadSection) {
            uploadSection.classList.add('compact');
        }
        if (container) {
            container.classList.add('has-compact-upload');
        }
        // Automatically analyze the file when selected
        analyzeFile();
    } else {
        fileLabel.textContent = 'Choose CSV File';
        fileLabel.classList.remove('file-selected');
        if (uploadSection) {
            uploadSection.classList.remove('compact');
        }
        if (container) {
            container.classList.remove('has-compact-upload');
        }
    }
}

// Categorization function (same as backend)
function categorizeTransaction(beneficiary, details) {
    const text = `${beneficiary} ${details}`.toUpperCase();
    
    // Income categories
    if (text.includes('ATLYGINIMAS') || text.includes('DARBO UZMOKESTIS') || 
        text.includes('SALARY') || (text.includes('TRANSFER') && text.includes('UNIPARK'))) {
        if (text.includes('UNIPARK') || text.includes('DATA TROOPS')) {
            return 'Salary';
        }
        return 'Other Income';
    }
    
    // Expense categories
    const categories = {
        'Groceries': ['RIMI', 'MAXIMA', 'NORFA', 'IKI', 'PARDUOTUVE AIBE', 'LIDL', 'KESKO SENUKAI', 'SUOJA'],
        'Gas/Fuel': ['NESTE', 'BALTIC PETROLEUM', 'CIRCLE K'],
        'Subscriptions': ['MICROSOFT', 'SPOTIFY', 'GOOGLE ONE', 'DISCORD', 'GO3', 'TWITCH'],
        'Restaurants': ['WOLT', 'JAMMI', 'THAI HOUSE', 'PIZZA', 'WRAPHOUSE', 'GREET.MENU', 'KAVINE', 'RESTAURANT, VALGYKLA'],
        'Shopping': ['IKEA', 'DECATHLON', 'ALIEXPRESS', 'AMZN', 'CSFLOAT', 'D MARKET'],
        'Transport': ['BOLT', 'UNIPARK', 'STOVA', 'PARK-K', 'EOLTAS', 'Inter Cars'],
        'Healthcare': ['CENTRO POLIKLINIKA', 'VAISTINE', 'CAMELIA', 'GINTARINE', 'SIRDAZOLE'],
        'Insurance': ['DRAUDIMAS', 'SWEDBANK LIFE', 'AON'],
        'Utilities': ['PASLAUGŲ PLANO', 'MOKESTIS'],
        'Transfers': ['PERVEDIMAS', 'TRANSFER', 'PERVEDYMAS'],
        'Entertainment': ['STEAM', 'GAMES', 'FACEIT'],
    };
    
    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(keyword => text.includes(keyword))) {
            return category;
        }
    }
    
    return 'Other';
}

// Parse date helper
function parseDate(dateStr) {
    // Handle YYYY-MM-DD format
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return new Date(dateStr);
}

// Format date to YYYY-MM
function formatMonth(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
}

async function analyzeFile() {
    const fileInput = document.getElementById('csvFile');
    const file = fileInput.files[0];
    
    if (!file) {
        showError('pleaseSelectFile');
        return;
    }
    
    const loading = document.getElementById('loading');
    const errorDiv = document.getElementById('error');
    const results = document.getElementById('results');
    
    loading.style.display = 'block';
    errorDiv.style.display = 'none';
    results.style.display = 'none';
    const sidebar = document.getElementById('filtersSidebar');
    if (sidebar) {
        sidebar.style.display = 'none';
    }
    
    try {
        // Parse CSV using PapaParse
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function(results) {
                try {
                    // Store original transactions for filtering
                    allTransactions = results.data;
                    const data = analyzeData(results.data);
                    originalData = data; // Store original analyzed data
                    populateFilterOptions(data);
                    displayResults(data);
                    renderIgnoredTransactions();
                } catch (error) {
                    console.error('Analysis error:', error);
                    showError('errorAnalyzingData');
                } finally {
                    loading.style.display = 'none';
                }
            },
            error: function(error) {
                console.error('Parse error:', error);
                showError('errorParsingCSV');
                loading.style.display = 'none';
            }
        });
    } catch (error) {
        console.error('Error:', error);
        showError('errorReadingFile');
        loading.style.display = 'none';
    }
}

function analyzeData(rawData, manualEntriesToUse = null) {
    // Process transactions from CSV
    const csvTransactions = rawData
        .filter(row => {
            const type = row['D/K'] || row['D/K'] || '';
            return type === 'D' || type === 'K';
        })
        .map(row => {
            const dateStr = row['Date'] || '';
            const amount = parseFloat(row['Amount'] || '0');
            const beneficiary = (row['Beneficiary'] || '').trim();
            const details = (row['Details'] || '').trim();
            const type = row['D/K'] || '';
            const date = parseDate(dateStr);
            
            return {
                date,
                dateStr,
                amount,
                beneficiary,
                details,
                type,
                category: categorizeTransaction(beneficiary, details),
                isManual: false
            };
        })
        .filter(t => !isNaN(t.amount) && !isNaN(t.date.getTime()));
    
    // Get manual entries as transactions - use provided entries or global ones
    let manualTransactions;
    if (manualEntriesToUse !== null) {
        // Convert provided manual entries to transactions
        manualTransactions = manualEntriesToUse.map(entry => ({
            date: parseDate(entry.date),
            dateStr: entry.date,
            amount: entry.amount,
            beneficiary: '',
            details: entry.description,
            type: entry.type,
            category: 'Manual Additions',
            isManual: true,
            manualEntryId: entry.id // Include manual entry ID for unique identification
        }));
    } else {
        // Use global manual entries
        manualTransactions = getManualEntriesAsTransactions();
    }
    
    // Merge CSV and manual transactions
    const transactions = [...csvTransactions, ...manualTransactions];
    
    // Filter out ignored transactions for calculations only
    const nonIgnoredTransactions = transactions.filter(t => !isTransactionIgnored(t));
    
    // Separate income and expenses (for calculations - totals, category sums)
    const expenses = nonIgnoredTransactions.filter(t => t.type === 'D');
    const income = nonIgnoredTransactions.filter(t => t.type === 'K');
    
    // Keep all transactions (including ignored) for display purposes
    const allExpenses = transactions.filter(t => t.type === 'D');
    const allIncome = transactions.filter(t => t.type === 'K');
    
    // Calculate totals
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    
    // Category breakdown (manual entries are always in "Manual Additions", never "Other")
    const expenseByCategory = {};
    expenses.forEach(t => {
        // Ensure manual entries are never counted in "Other" - they belong to "Manual Additions"
        if (t.isManual && t.category !== 'Manual Additions') {
            // Force manual entries to "Manual Additions" category
            t.category = 'Manual Additions';
        }
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });
    
    const incomeByCategory = {};
    income.forEach(t => {
        // Ensure manual entries are never counted in "Other" - they belong to "Manual Additions"
        if (t.isManual && t.category !== 'Manual Additions') {
            // Force manual entries to "Manual Additions" category
            t.category = 'Manual Additions';
        }
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.amount;
    });
    
    // Monthly trends
    const monthlyExpenses = {};
    const monthlyIncome = {};
    const monthlyStats = {};
    
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
    const merchantTotals = {};
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
        }, {});
    
    return {
        summary: {
            total_expenses: totalExpenses,
            total_income: totalIncome,
            net_balance: netBalance,
            transaction_count: transactions.length,
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

function showError(message) {
    const errorDiv = document.getElementById('error');
    // Try to translate error message, fallback to original if not found
    errorDiv.textContent = t(message) !== message ? t(message) : message;
    errorDiv.style.display = 'block';
}

function displayResults(data, openDropdowns = null, scrollPosition = null) {
    // Update summary
    document.getElementById('totalIncome').textContent = 
        `€${data.summary.total_income.toFixed(2)}`;
    document.getElementById('totalExpenses').textContent = 
        `€${data.summary.total_expenses.toFixed(2)}`;
    document.getElementById('netBalance').textContent = 
        `€${data.summary.net_balance.toFixed(2)}`;
    document.getElementById('transactionCount').textContent = 
        data.summary.transaction_count;
    
    // Update net balance color
    const netBalanceEl = document.getElementById('netBalance');
    if (data.summary.net_balance >= 0) {
        netBalanceEl.className = 'value positive';
    } else {
        netBalanceEl.className = 'value negative';
    }
    
    // Show results and sidebar
    document.getElementById('results').style.display = 'block';
    const sidebar = document.getElementById('filtersSidebar');
    if (sidebar) {
        sidebar.style.display = 'block';
    }
    
    // Create charts
    createExpenseChart(data.expenses_by_category);
    createTrendChart(data.monthly_trends);
    createMerchantChart(data.top_expense_merchants);
    createSavingsRateChart(data.monthly_stats);
    createCumulativeCashFlowChart(data.monthly_stats);
    
    // Display monthly statistics
    displayMonthlyStats(data.monthly_stats, openDropdowns, scrollPosition);
    
    // Re-apply translations after rendering (in case any were overwritten)
    if (translations[currentLanguage]) {
        setTimeout(() => {
            applyTranslations();
        }, 50);
    }
}

function createExpenseChart(categories) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    
    if (expenseChart) expenseChart.destroy();
    
    const labels = Object.keys(categories).map(cat => translateCategory(cat));
    const values = Object.values(categories);
    
    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF',
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: €${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function createTrendChart(trends) {
    const ctx = document.getElementById('trendChart').getContext('2d');
    const months = [...new Set([
        ...Object.keys(trends.expenses),
        ...Object.keys(trends.income)
    ])].sort();
    
    if (trendChart) trendChart.destroy();
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: t('expenses'),
                data: months.map(m => trends.expenses[m] || 0),
                borderColor: '#FF6384',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                tension: 0.4,
                fill: true
            }, {
                label: t('income'),
                data: months.map(m => trends.income[m] || 0),
                borderColor: '#36A2EB',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: €${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function createMerchantChart(merchants) {
    const ctx = document.getElementById('merchantChart').getContext('2d');
    
    if (merchantChart) merchantChart.destroy();
    
    const labels = Object.keys(merchants).slice(0, 10);
    const values = Object.values(merchants).slice(0, 10);
    
    merchantChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: t('amountSpent'),
                data: values,
                backgroundColor: '#36A2EB'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return '€' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toFixed(0);
                        }
                    }
                }
            }
        }
    });
}

function createSavingsRateChart(monthlyStats) {
    const ctx = document.getElementById('savingsRateChart').getContext('2d');
    
    if (savingsRateChart) savingsRateChart.destroy();
    
    // Sort months chronologically
    const months = Object.keys(monthlyStats).sort();
    
    // Calculate savings rate for each month: (Income - Expenses) / Income * 100
    // Also store net balances (amount saved) for tooltip
    const savingsRates = [];
    const netBalances = [];
    
    months.forEach(month => {
        const stats = monthlyStats[month];
        const netBalance = stats.income - stats.expenses;
        netBalances.push(netBalance);
        
        if (stats.income === 0) {
            savingsRates.push(null); // Avoid division by zero
        } else {
            savingsRates.push(((stats.income - stats.expenses) / stats.income) * 100);
        }
    });
    
    savingsRateChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: t('savingsRate'),
                data: savingsRates,
                borderColor: '#4BC0C0',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const value = context.parsed.y;
                            const netBalance = netBalances[index];
                            
                            if (value === null) return t('noIncomeData');
                            
                            const sign = netBalance >= 0 ? '+' : '';
                            return [
                                `${t('savingsRate')}: ${value.toFixed(1)}%`,
                                `${t('amountSaved')}: ${sign}€${netBalance.toFixed(2)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(0) + '%';
                        }
                    },
                    title: {
                        display: true,
                        text: t('savingsRate')
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: t('monthNames')[0] ? 'Month' : 'Month'
                    }
                }
            }
        }
    });
}

function createCumulativeCashFlowChart(monthlyStats) {
    const ctx = document.getElementById('cumulativeCashFlowChart').getContext('2d');
    
    if (cumulativeCashFlowChart) cumulativeCashFlowChart.destroy();
    
    // Sort months chronologically
    const months = Object.keys(monthlyStats).sort();
    
    // Calculate cumulative cash flow (running total of Income - Expenses)
    // Also calculate monthly differences for tooltip
    let cumulativeTotal = 0;
    const cumulativeFlow = [];
    const monthlyDifferences = [];
    
    months.forEach((month, index) => {
        const stats = monthlyStats[month];
        const monthlyNetBalance = stats.income - stats.expenses;
        cumulativeTotal += monthlyNetBalance;
        cumulativeFlow.push(cumulativeTotal);
        
        // Calculate difference from previous month
        if (index === 0) {
            // First month: difference is just the net balance for that month
            monthlyDifferences.push(monthlyNetBalance);
        } else {
            // Difference is the change from previous cumulative value
            const previousCumulative = cumulativeFlow[index - 1];
            const currentCumulative = cumulativeTotal;
            monthlyDifferences.push(currentCumulative - previousCumulative);
        }
    });
    
    cumulativeCashFlowChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: t('cumulativeCashFlowLabel'),
                data: cumulativeFlow,
                borderColor: '#9966FF',
                backgroundColor: 'rgba(153, 102, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const index = context.dataIndex;
                            const cumulativeValue = context.parsed.y;
                            const monthlyDiff = monthlyDifferences[index];
                            
                            const cumulativeSign = cumulativeValue >= 0 ? '+' : '';
                            const diffSign = monthlyDiff >= 0 ? '+' : '';
                            
                            return [
                                `${t('cumulative')}: ${cumulativeSign}€${cumulativeValue.toFixed(2)}`,
                                `${t('monthlyChange')}: ${diffSign}€${monthlyDiff.toFixed(2)}`
                            ];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '€' + value.toFixed(0);
                        }
                    },
                    title: {
                        display: true,
                        text: `${t('cumulativeCashFlowLabel')} (€)`
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: t('monthNames')[0] ? 'Month' : 'Month'
                    }
                }
            }
        }
    });
}

function displayMonthlyStats(monthlyStats, openDropdowns = null, scrollPosition = null) {
    const container = document.getElementById('monthlyStatsContainer');
    if (!container) return;
    
    // Normalize openDropdowns to handle both old format (Set) and new format (object)
    let normalizedDropdowns = null;
    if (openDropdowns) {
        if (openDropdowns instanceof Set) {
            // Old format - convert to new format
            normalizedDropdowns = {
                monthDetails: new Set(),
                categoryTransactions: openDropdowns
            };
        } else {
            // New format - only use if there are actually open dropdowns
            if ((openDropdowns.monthDetails && openDropdowns.monthDetails.size > 0) ||
                (openDropdowns.categoryTransactions && openDropdowns.categoryTransactions.size > 0)) {
                normalizedDropdowns = openDropdowns;
            }
        }
    }
    
    // Sort months chronologically
    const months = Object.keys(monthlyStats).sort();
    
    // Format month name (e.g., "2025-01" -> "January 2025")
    function formatMonthName(monthStr) {
        const [year, month] = monthStr.split('-');
        const monthNames = t('monthNames');
        return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
    
    container.innerHTML = '<div class="monthly-stats-grid"></div>';
    const grid = container.querySelector('.monthly-stats-grid');
    
    months.forEach((month, index) => {
        const stats = monthlyStats[month];
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        monthCard.dataset.month = month;
        
        const netBalanceClass = stats.netBalance >= 0 ? 'positive' : 'negative';
        
        // Sort expense categories by amount (descending)
        const expenseCategories = Object.entries(stats.expenseCategories || {})
            .sort((a, b) => b[1] - a[1]);
        
        // Sort income categories by amount (descending)
        const incomeCategories = Object.entries(stats.incomeCategories || {})
            .sort((a, b) => b[1] - a[1]);
        
        const totalExpenses = stats.expenses;
        const totalIncome = stats.income;
        
        monthCard.innerHTML = `
            <div class="month-header" onclick="toggleMonthDetails('${month}')">
                ${formatMonthName(month)}
                <span class="expand-icon" id="icon-${month}">▼</span>
            </div>
            <div class="month-stats-container">
                <div class="month-stat">
                    <span class="month-label">${t('income')}</span>
                    <span class="month-value positive">€${stats.income.toFixed(2)}</span>
                </div>
                <div class="month-stat">
                    <span class="month-label">${t('expenses')}</span>
                    <span class="month-value negative">€${stats.expenses.toFixed(2)}</span>
                </div>
                <div class="month-stat">
                    <span class="month-label">${t('netBalance')}</span>
                    <span class="month-value ${netBalanceClass}">€${stats.netBalance.toFixed(2)}</span>
                </div>
                <div class="month-stat">
                    <span class="month-label">${t('transactions')}</span>
                    <span class="month-value">${stats.transactionCount}</span>
                </div>
            </div>
            <div class="month-details" id="details-${month}" style="display: none;">
                ${expenseCategories.length > 0 ? `
                    <div class="category-section">
                        <h4 class="category-title">${t('expenseCategories')}</h4>
                        ${expenseCategories.map(([category, amount]) => {
                            const percentage = ((amount / totalExpenses) * 100).toFixed(1);
                            const transactions = stats.expenseTransactions[category] || [];
                            const transactionId = `expense-${month}-${category.replace(/\s+/g, '-')}`;
                            return `
                                <div class="category-item-wrapper">
                                    <div class="category-item" onclick="toggleCategoryTransactions('${transactionId}')">
                                        <span class="category-name">${translateCategory(category)}</span>
                                        <span class="category-amount">€${amount.toFixed(2)}</span>
                                        <span class="category-percentage">${percentage}%</span>
                                        <span class="category-expand-icon" id="icon-${transactionId}">▶</span>
                                    </div>
                                    <div class="category-transactions" id="${transactionId}" style="display: none;">
                                        ${transactions.length > 0 ? `
                                            <div class="transactions-list">
                                                ${transactions.map(trans => {
                                                    const transObj = {
                                                        dateStr: trans.date,
                                                        beneficiary: trans.beneficiary || '',
                                                        details: trans.details || '',
                                                        amount: trans.amount,
                                                        type: 'D',
                                                        isManual: trans.isManual || false,
                                                        manualEntryId: trans.manualEntryId || null
                                                    };
                                                    const isIgnored = isTransactionIgnored(transObj);
                                                    const transId = generateTransactionId(transObj);
                                                    const transData = encodeURIComponent(JSON.stringify(transObj));
                                                    return `
                                                    <div class="transaction-item ${isIgnored ? 'ignored' : ''}" ${isIgnored ? `data-translate-ignored="${t('ignored')}"` : ''}>
                                                        <div class="transaction-header">
                                                            <span class="transaction-date">${trans.date}</span>
                                                            <span class="transaction-amount">€${trans.amount.toFixed(2)}</span>
                                                        </div>
                                                        <div class="transaction-beneficiary">${trans.beneficiary || 'N/A'}</div>
                                                        <div class="transaction-details">${trans.details || ''}</div>
                                                        <div class="transaction-actions">
                                                            <button onclick="event.stopPropagation(); handleIgnoreClick('${transData}')" class="ignore-btn ${isIgnored ? 'unignore' : ''}" data-translate="${isIgnored ? 'unignore' : 'ignore'}">
                                                                ${isIgnored ? t('unignore') : t('ignore')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                `;
                                                }).join('')}
                                            </div>
                                        ` : `<div class="no-transactions">${t('noTransactions')}</div>`}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
                ${incomeCategories.length > 0 ? `
                    <div class="category-section">
                        <h4 class="category-title">${t('incomeCategories')}</h4>
                        ${incomeCategories.map(([category, amount]) => {
                            const percentage = totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : '0.0';
                            const transactions = stats.incomeTransactions[category] || [];
                            const transactionId = `income-${month}-${category.replace(/\s+/g, '-')}`;
                            return `
                                <div class="category-item-wrapper">
                                    <div class="category-item" onclick="toggleCategoryTransactions('${transactionId}')">
                                        <span class="category-name">${translateCategory(category)}</span>
                                        <span class="category-amount positive">€${amount.toFixed(2)}</span>
                                        <span class="category-percentage">${percentage}%</span>
                                        <span class="category-expand-icon" id="icon-${transactionId}">▶</span>
                                    </div>
                                    <div class="category-transactions" id="${transactionId}" style="display: none;">
                                        ${transactions.length > 0 ? `
                                            <div class="transactions-list">
                                                ${transactions.map(trans => {
                                                    const transObj = {
                                                        dateStr: trans.date,
                                                        beneficiary: trans.beneficiary || '',
                                                        details: trans.details || '',
                                                        amount: trans.amount,
                                                        type: 'K',
                                                        isManual: trans.isManual || false,
                                                        manualEntryId: trans.manualEntryId || null
                                                    };
                                                    const isIgnored = isTransactionIgnored(transObj);
                                                    const transId = generateTransactionId(transObj);
                                                    const transData = encodeURIComponent(JSON.stringify(transObj));
                                                    return `
                                                    <div class="transaction-item ${isIgnored ? 'ignored' : ''}" ${isIgnored ? `data-translate-ignored="${t('ignored')}"` : ''}>
                                                        <div class="transaction-header">
                                                            <span class="transaction-date">${trans.date}</span>
                                                            <span class="transaction-amount positive">€${trans.amount.toFixed(2)}</span>
                                                        </div>
                                                        <div class="transaction-beneficiary">${trans.beneficiary || 'N/A'}</div>
                                                        <div class="transaction-details">${trans.details || ''}</div>
                                                        <div class="transaction-actions">
                                                            <button onclick="event.stopPropagation(); handleIgnoreClick('${transData}')" class="ignore-btn ${isIgnored ? 'unignore' : ''}" data-translate="${isIgnored ? 'unignore' : 'ignore'}">
                                                                ${isIgnored ? t('unignore') : t('ignore')}
                                                            </button>
                                                        </div>
                                                    </div>
                                                `;
                                                }).join('')}
                                            </div>
                                        ` : `<div class="no-transactions">${t('noTransactions')}</div>`}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        grid.appendChild(monthCard);
    });
    
    // Restore open dropdowns if provided (only if they were actually open)
    // Only restore if we have both normalizedDropdowns AND scrollPosition (meaning something was open)
    if (normalizedDropdowns && scrollPosition !== null) {
        // Use multiple requestAnimationFrame calls to ensure DOM is fully rendered before restoring
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Restore month details dropdowns
                if (normalizedDropdowns.monthDetails && normalizedDropdowns.monthDetails.size > 0) {
                    normalizedDropdowns.monthDetails.forEach(dropdownId => {
                        const dropdown = document.getElementById(dropdownId);
                        const month = dropdownId.replace('details-', '');
                        const icon = document.getElementById(`icon-${month}`);
                        // Only restore if dropdown exists and is currently closed (was re-rendered as closed)
                        if (dropdown && icon && dropdown.style.display === 'none') {
                            dropdown.style.display = 'block';
                            icon.textContent = '▲';
                        }
                    });
                }
                
                // Restore category transaction dropdowns
                if (normalizedDropdowns.categoryTransactions && normalizedDropdowns.categoryTransactions.size > 0) {
                    normalizedDropdowns.categoryTransactions.forEach(dropdownId => {
                        const dropdown = document.getElementById(dropdownId);
                        const icon = document.getElementById(`icon-${dropdownId}`);
                        // Only restore if dropdown exists and is currently closed (was re-rendered as closed)
                        if (dropdown && icon && dropdown.style.display === 'none') {
                            dropdown.style.display = 'block';
                            icon.textContent = '▼';
                        }
                    });
                }
                
                // Restore scroll position to prevent jumps - use another frame to ensure layout is stable
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: scrollPosition,
                        behavior: 'auto'
                    });
                });
            });
        });
    }
}

function toggleMonthDetails(month) {
    const details = document.getElementById(`details-${month}`);
    const icon = document.getElementById(`icon-${month}`);
    
    if (details.style.display === 'none') {
        details.style.display = 'block';
        icon.textContent = '▲';
        icon.style.transform = 'rotate(0deg)';
    } else {
        details.style.display = 'none';
        icon.textContent = '▼';
        icon.style.transform = 'rotate(0deg)';
    }
}

function toggleCategoryTransactions(transactionId) {
    const transactions = document.getElementById(transactionId);
    const icon = document.getElementById(`icon-${transactionId}`);
    
    if (transactions.style.display === 'none') {
        transactions.style.display = 'block';
        icon.textContent = '▼';
        icon.style.transform = 'rotate(0deg)';
    } else {
        transactions.style.display = 'none';
        icon.textContent = '▶';
        icon.style.transform = 'rotate(0deg)';
    }
}

// Filter functions
function toggleFilters() {
    const content = document.getElementById('filtersContent');
    const icon = document.getElementById('filterToggleIcon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}

function populateFilterOptions(data) {
    // Populate expense categories
    const expenseCategoriesContainer = document.getElementById('expenseCategories');
    expenseCategoriesContainer.innerHTML = '';
    
    const expenseCats = Object.keys(data.expenses_by_category).sort();
    expenseCats.forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" class="expense-category-checkbox" value="${category}" checked onchange="applyFilters()"> ${translateCategory(category)}`;
        expenseCategoriesContainer.appendChild(label);
    });
    
    // Populate income categories
    const incomeCategoriesContainer = document.getElementById('incomeCategories');
    incomeCategoriesContainer.innerHTML = '';
    
    const incomeCats = Object.keys(data.income_by_category).sort();
    incomeCats.forEach(category => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" class="income-category-checkbox" value="${category}" checked onchange="applyFilters()"> ${translateCategory(category)}`;
        incomeCategoriesContainer.appendChild(label);
    });
    
    // Ensure manual entries are rendered
    renderManualEntries();
    
    // Render ignored transactions
    renderIgnoredTransactions();
    
    // Set default date range to cover all data (including manual entries)
    const allDates = [];
    
    if (allTransactions && allTransactions.length > 0) {
        const csvDates = allTransactions
            .map(row => {
                const dateStr = row['Date'] || '';
                return parseDate(dateStr);
            })
            .filter(d => !isNaN(d.getTime()));
        allDates.push(...csvDates);
    }
    
    // Add manual entry dates
    manualEntries.forEach(entry => {
        const date = parseDate(entry.date);
        if (!isNaN(date.getTime())) {
            allDates.push(date);
        }
    });
    
    if (allDates.length > 0) {
        allDates.sort((a, b) => a - b);
        const minDate = allDates[0];
        const maxDate = allDates[allDates.length - 1];
        document.getElementById('dateFrom').value = formatDateForInput(minDate);
        document.getElementById('dateTo').value = formatDateForInput(maxDate);
    }
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function applyFilters(openDropdowns = null, scrollPosition = null) {
    if (!allTransactions || !originalData) return;
    
    // Get filter values
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const filterExpenses = document.getElementById('filterExpenses').checked;
    const filterIncome = document.getElementById('filterIncome').checked;
    const amountMin = parseFloat(document.getElementById('amountMin').value) || null;
    const amountMax = parseFloat(document.getElementById('amountMax').value) || null;
    
    // Get selected categories
    const selectedExpenseCategories = Array.from(document.querySelectorAll('.expense-category-checkbox:checked'))
        .map(cb => cb.value);
    const selectedIncomeCategories = Array.from(document.querySelectorAll('.income-category-checkbox:checked'))
        .map(cb => cb.value);
    
    // Filter CSV transactions
    let filteredTransactions = allTransactions
        .filter(row => {
            const type = row['D/K'] || '';
            if (!filterExpenses && type === 'D') return false;
            if (!filterIncome && type === 'K') return false;
            return type === 'D' || type === 'K';
        })
        .map(row => {
            const dateStr = row['Date'] || '';
            const amount = parseFloat(row['Amount'] || '0');
            const beneficiary = (row['Beneficiary'] || '').trim();
            const details = (row['Details'] || '').trim();
            const type = row['D/K'] || '';
            const date = parseDate(dateStr);
            
            return {
                date,
                dateStr,
                amount,
                beneficiary,
                details,
                type,
                category: categorizeTransaction(beneficiary, details),
                isManual: false
            };
        })
        .filter(t => {
            // Date filter
            if (dateFrom) {
                const filterDate = new Date(dateFrom);
                if (t.date < filterDate) return false;
            }
            if (dateTo) {
                const filterDate = new Date(dateTo);
                filterDate.setHours(23, 59, 59, 999); // Include entire end date
                if (t.date > filterDate) return false;
            }
            
            // Amount filter
            if (amountMin !== null && Math.abs(t.amount) < amountMin) return false;
            if (amountMax !== null && Math.abs(t.amount) > amountMax) return false;
            
            // Category filter
            if (t.type === 'D' && selectedExpenseCategories.length > 0 && !selectedExpenseCategories.includes(t.category)) {
                return false;
            }
            if (t.type === 'K' && selectedIncomeCategories.length > 0 && !selectedIncomeCategories.includes(t.category)) {
                return false;
            }
            
            return !isNaN(t.amount) && !isNaN(t.date.getTime());
        });
    
    // Filter manual entries
    const manualTransactions = getManualEntriesAsTransactions();
    const filteredManualTransactions = manualTransactions.filter(t => {
        // Date filter
        if (dateFrom) {
            const filterDate = new Date(dateFrom);
            if (t.date < filterDate) return false;
        }
        if (dateTo) {
            const filterDate = new Date(dateTo);
            filterDate.setHours(23, 59, 59, 999);
            if (t.date > filterDate) return false;
        }
        
        // Amount filter
        if (amountMin !== null && Math.abs(t.amount) < amountMin) return false;
        if (amountMax !== null && Math.abs(t.amount) > amountMax) return false;
        
        // Type filter
        if (!filterExpenses && t.type === 'D') return false;
        if (!filterIncome && t.type === 'K') return false;
        
        // Category filter
        if (t.type === 'D' && selectedExpenseCategories.length > 0 && !selectedExpenseCategories.includes(t.category)) {
            return false;
        }
        if (t.type === 'K' && selectedIncomeCategories.length > 0 && !selectedIncomeCategories.includes(t.category)) {
            return false;
        }
        
        return true;
    });
    
    // Separate CSV transactions from manual transactions
    const filteredCsvTransactions = filteredTransactions.filter(t => !t.isManual);
    const filteredManualOnly = filteredManualTransactions;
    
    // Convert only CSV transactions back to CSV row format for analyzeData
    const csvDataForAnalysis = filteredCsvTransactions.map(t => {
        return {
            'Date': t.dateStr,
            'Amount': t.amount.toString(),
            'Beneficiary': t.beneficiary,
            'Details': t.details,
            'D/K': t.type
        };
    });
    
    // Filter manual entries to match filter criteria
    // Convert filtered manual transactions back to manual entry format
    const filteredManualEntries = manualEntries.filter(entry => {
        const manualTrans = {
            date: parseDate(entry.date),
            dateStr: entry.date,
            amount: entry.amount,
            beneficiary: '',
            details: entry.description,
            type: entry.type,
            category: 'Manual Additions',
            isManual: true
        };
        // Check if this manual entry passes all filters
        return filteredManualOnly.some(f => 
            f.dateStr === manualTrans.dateStr &&
            f.amount === manualTrans.amount &&
            f.details === manualTrans.details &&
            f.type === manualTrans.type
        );
    });
    
    // Analyze data with filtered manual entries (without modifying global manualEntries array)
    const filteredData = analyzeData(csvDataForAnalysis, filteredManualEntries);
    
    // Update display with filtered data
    displayResults(filteredData, openDropdowns, scrollPosition);
}

function resetFilters() {
    // Reset all filter inputs
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('filterExpenses').checked = true;
    document.getElementById('filterIncome').checked = true;
    document.getElementById('amountMin').value = '';
    document.getElementById('amountMax').value = '';
    
    // Reset category checkboxes
    document.querySelectorAll('.expense-category-checkbox').forEach(cb => cb.checked = true);
    document.querySelectorAll('.income-category-checkbox').forEach(cb => cb.checked = true);
    
    // Restore default date range (including manual entries)
    const allDates = [];
    
    if (allTransactions && allTransactions.length > 0) {
        const csvDates = allTransactions
            .map(row => {
                const dateStr = row['Date'] || '';
                return parseDate(dateStr);
            })
            .filter(d => !isNaN(d.getTime()));
        allDates.push(...csvDates);
    }
    
    // Add manual entry dates
    manualEntries.forEach(entry => {
        const date = parseDate(entry.date);
        if (!isNaN(date.getTime())) {
            allDates.push(date);
        }
    });
    
    if (allDates.length > 0) {
        allDates.sort((a, b) => a - b);
        const minDate = allDates[0];
        const maxDate = allDates[allDates.length - 1];
        document.getElementById('dateFrom').value = formatDateForInput(minDate);
        document.getElementById('dateTo').value = formatDateForInput(maxDate);
    }
    
    // Apply filters (which will show all data)
    applyFilters();
}

function selectAllExpenseCategories() {
    document.querySelectorAll('.expense-category-checkbox').forEach(cb => cb.checked = true);
    applyFilters();
}

function deselectAllExpenseCategories() {
    document.querySelectorAll('.expense-category-checkbox').forEach(cb => cb.checked = false);
    applyFilters();
}

function selectAllIncomeCategories() {
    document.querySelectorAll('.income-category-checkbox').forEach(cb => cb.checked = true);
    applyFilters();
}

function deselectAllIncomeCategories() {
    document.querySelectorAll('.income-category-checkbox').forEach(cb => cb.checked = false);
    applyFilters();
}

function toggleMonthlyStats() {
    const content = document.getElementById('monthlyStatsContent');
    const icon = document.getElementById('monthlyStatsToggleIcon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}

function toggleCharts() {
    const content = document.getElementById('chartsContent');
    const icon = document.getElementById('chartsToggleIcon');
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}

// Generate unique ID for a transaction
function generateTransactionId(transaction) {
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

// Ignored Transactions Functions
function loadIgnoredTransactions() {
    const saved = localStorage.getItem('ignoredTransactions');
    if (saved) {
        try {
            const ignoredArray = JSON.parse(saved);
            ignoredTransactions = new Set(ignoredArray);
        } catch (e) {
            console.error('Error loading ignored transactions:', e);
            ignoredTransactions = new Set();
        }
    }
}

function saveIgnoredTransactions() {
    localStorage.setItem('ignoredTransactions', JSON.stringify(Array.from(ignoredTransactions)));
}

function isTransactionIgnored(transaction) {
    const id = generateTransactionId(transaction);
    return ignoredTransactions.has(id);
}

function handleIgnoreClick(transDataStr) {
    try {
        const transaction = JSON.parse(decodeURIComponent(transDataStr));
        toggleIgnoreTransaction(transaction);
    } catch (e) {
        console.error('Error parsing transaction data:', e);
    }
}

function toggleIgnoreTransaction(transaction) {
    const id = generateTransactionId(transaction);
    if (ignoredTransactions.has(id)) {
        ignoredTransactions.delete(id);
    } else {
        ignoredTransactions.add(id);
    }
    saveIgnoredTransactions();
    
    // Store scroll position to prevent jumps
    const scrollPosition = window.scrollY || window.pageYOffset;
    
    // Store which dropdowns are currently open (both month details and category transactions)
    const openDropdowns = {
        monthDetails: new Set(),
        categoryTransactions: new Set()
    };
    
    // Store open month details (format: details-YYYY-MM)
    // Only check inline style since that's what we control
    document.querySelectorAll('.month-details').forEach(element => {
        // Check if display is explicitly set to 'block' (meaning it was opened)
        if (element.style.display === 'block' && element.id) {
            openDropdowns.monthDetails.add(element.id);
        }
    });
    
    // Store open category transaction dropdowns
    document.querySelectorAll('.category-transactions').forEach(element => {
        // Check if display is explicitly set to 'block' (meaning it was opened)
        if (element.style.display === 'block' && element.id) {
            openDropdowns.categoryTransactions.add(element.id);
        }
    });
    
    // Re-analyze data if CSV is loaded
    if (allTransactions) {
        // Only pass dropdowns and scroll position if we actually have open dropdowns
        const hasOpenDropdowns = openDropdowns.monthDetails.size > 0 || openDropdowns.categoryTransactions.size > 0;
        reAnalyzeData(hasOpenDropdowns ? openDropdowns : null, hasOpenDropdowns ? scrollPosition : null);
    }
    
    // Update ignored transactions list in filters
    renderIgnoredTransactions();
}

// Manual Entries Functions
function loadManualEntries() {
    const saved = localStorage.getItem('manualEntries');
    if (saved) {
        try {
            manualEntries = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading manual entries:', e);
            manualEntries = [];
        }
    }
}

function saveManualEntries() {
    localStorage.setItem('manualEntries', JSON.stringify(manualEntries));
}

function addManualEntry() {
    const date = document.getElementById('manualDate').value;
    const description = document.getElementById('manualDescription').value;
    const amount = parseFloat(document.getElementById('manualAmount').value);
    const type = document.getElementById('manualType').value;
    
    if (!date || !description || isNaN(amount) || amount <= 0) {
        alert('Please fill in all fields with valid values');
        return;
    }
    
    if (editingManualEntryId !== null) {
        // Update existing entry
        const index = manualEntries.findIndex(e => e.id === editingManualEntryId);
        if (index !== -1) {
            manualEntries[index] = {
                id: editingManualEntryId,
                date,
                description,
                amount,
                type
            };
        }
        editingManualEntryId = null;
        document.getElementById('addManualBtn').textContent = t('add');
        document.getElementById('cancelManualBtn').style.display = 'none';
    } else {
        // Add new entry
        const newEntry = {
            id: Date.now().toString(),
            date,
            description,
            amount,
            type
        };
        manualEntries.push(newEntry);
    }
    
    // Clear form
    document.getElementById('manualDate').value = '';
    document.getElementById('manualDescription').value = '';
    document.getElementById('manualAmount').value = '';
    document.getElementById('manualType').value = 'D';
    
    saveManualEntries();
    renderManualEntries();
    
    // Re-analyze data if CSV is loaded
    if (allTransactions) {
        reAnalyzeData();
    } else if (manualEntries.length > 0) {
        // If no CSV is loaded but we have manual entries, we still need to update statistics
        // This handles the case where user adds manual entries before loading CSV
        // But since there's no CSV data, we can't show statistics yet
        // The statistics will update once CSV is loaded (manual entries are included automatically)
    }
}

function editManualEntry(id) {
    const entry = manualEntries.find(e => e.id === id);
    if (!entry) return;
    
    editingManualEntryId = id;
    document.getElementById('manualDate').value = entry.date;
    document.getElementById('manualDescription').value = entry.description;
    document.getElementById('manualAmount').value = entry.amount;
    document.getElementById('manualType').value = entry.type;
    document.getElementById('addManualBtn').textContent = t('save');
    document.getElementById('cancelManualBtn').style.display = 'inline-block';
    
    // Scroll to form
    document.getElementById('manualDate').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function deleteManualEntry(id) {
    if (confirm('Are you sure you want to delete this entry?')) {
        manualEntries = manualEntries.filter(e => e.id !== id);
        saveManualEntries();
        renderManualEntries();
        
        // Re-analyze data if CSV is loaded
        if (allTransactions) {
            reAnalyzeData();
        }
    }
}

function reAnalyzeData(openDropdowns = null, scrollPosition = null) {
    if (!allTransactions) return;
    
    // Store scroll position and open dropdowns if not provided
    const currentScrollPosition = scrollPosition !== null ? scrollPosition : (window.scrollY || window.pageYOffset);
    
    // Store which dropdowns are currently open if not provided
    let currentOpenDropdowns = openDropdowns;
    if (!currentOpenDropdowns) {
        currentOpenDropdowns = {
            monthDetails: new Set(),
            categoryTransactions: new Set()
        };
        
        // Store open month details
        document.querySelectorAll('.month-details').forEach(element => {
            if (element.style.display === 'block' && element.id) {
                currentOpenDropdowns.monthDetails.add(element.id);
            }
        });
        
        // Store open category transaction dropdowns
        document.querySelectorAll('.category-transactions').forEach(element => {
            if (element.style.display === 'block' && element.id) {
                currentOpenDropdowns.categoryTransactions.add(element.id);
            }
        });
    }
    
    // Re-analyze with current manual entries (use all manual entries, not filtered)
    // analyzeData will automatically include manual entries via getManualEntriesAsTransactions()
    const data = analyzeData(allTransactions);
    originalData = data; // Update original data
    populateFilterOptions(data);
    
    // Apply current filters (which will properly handle manual entries)
    // This will update the display with the new statistics including manual entries
    // Only pass dropdowns and scroll position if we actually have open dropdowns
    const hasOpenDropdowns = currentOpenDropdowns.monthDetails.size > 0 || currentOpenDropdowns.categoryTransactions.size > 0;
    
    // Always call applyFilters to update display with current filter settings
    // applyFilters will filter manual entries appropriately without modifying the global array
    applyFilters(hasOpenDropdowns ? currentOpenDropdowns : null, hasOpenDropdowns ? currentScrollPosition : null);
    
    // Update ignored transactions list in filters
    renderIgnoredTransactions();
}

function cancelManualEdit() {
    editingManualEntryId = null;
    document.getElementById('manualDate').value = '';
    document.getElementById('manualDescription').value = '';
    document.getElementById('manualAmount').value = '';
    document.getElementById('manualType').value = 'D';
    document.getElementById('addManualBtn').textContent = t('add');
    document.getElementById('cancelManualBtn').style.display = 'none';
}

function renderManualEntries() {
    const container = document.getElementById('manualEntriesContainer');
    if (!container) return;
    
    if (manualEntries.length === 0) {
        container.innerHTML = `<div class="no-manual-entries">${t('noManualEntries')}</div>`;
        return;
    }
    
    // Sort by date (newest first)
    const sorted = [...manualEntries].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    container.innerHTML = sorted.map(entry => {
        const typeLabel = entry.type === 'D' ? t('expenses') : t('income');
        const typeClass = entry.type === 'D' ? 'negative' : 'positive';
        return `
            <div class="manual-entry-item">
                <div class="manual-entry-header">
                    <span class="manual-entry-date">${entry.date}</span>
                    <span class="manual-entry-amount ${typeClass}">€${entry.amount.toFixed(2)}</span>
                </div>
                <div class="manual-entry-description">${entry.description}</div>
                <div class="manual-entry-type">${typeLabel}</div>
                <div class="manual-entry-actions">
                    <button onclick="editManualEntry('${entry.id}')" class="manual-entry-btn edit-btn" data-translate="edit">Edit</button>
                    <button onclick="deleteManualEntry('${entry.id}')" class="manual-entry-btn delete-btn" data-translate="delete">Delete</button>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-apply translations
    setTimeout(() => {
        applyTranslations();
    }, 50);
}

function getManualEntriesAsTransactions() {
    return manualEntries.map(entry => ({
        date: parseDate(entry.date),
        dateStr: entry.date,
        amount: entry.amount,
        beneficiary: '',
        details: entry.description,
        type: entry.type,
        category: 'Manual Additions',
        isManual: true,
        manualEntryId: entry.id // Include manual entry ID for unique identification
    }));
}

// Render ignored transactions list in filters
function renderIgnoredTransactions() {
    const container = document.getElementById('ignoredTransactionsContainer');
    if (!container) return;
    
    if (ignoredTransactions.size === 0) {
        container.innerHTML = `<div class="no-ignored-transactions">${t('noIgnoredTransactions')}</div>`;
        return;
    }
    
    // Get all transactions (CSV + manual) to find ignored ones
    const allTrans = [];
    
    // Add CSV transactions
    if (allTransactions) {
        allTransactions.forEach(row => {
            const type = row['D/K'] || '';
            if (type === 'D' || type === 'K') {
                const dateStr = row['Date'] || '';
                const amount = parseFloat(row['Amount'] || '0');
                const beneficiary = (row['Beneficiary'] || '').trim();
                const details = (row['Details'] || '').trim();
                const date = parseDate(dateStr);
                
                if (!isNaN(amount) && !isNaN(date.getTime())) {
                    allTrans.push({
                        date,
                        dateStr,
                        amount,
                        beneficiary,
                        details,
                        type,
                        category: categorizeTransaction(beneficiary, details),
                        isManual: false
                    });
                }
            }
        });
    }
    
    // Add manual entries
    allTrans.push(...getManualEntriesAsTransactions());
    
    // Filter to only ignored transactions
    const ignoredTrans = allTrans.filter(t => isTransactionIgnored(t));
    
    // Sort by date (newest first)
    ignoredTrans.sort((a, b) => b.date - a.date);
    
    container.innerHTML = ignoredTrans.map(trans => {
        const transObj = {
            dateStr: trans.dateStr,
            beneficiary: trans.beneficiary || '',
            details: trans.details || '',
            amount: trans.amount,
            type: trans.type,
            isManual: trans.isManual || false,
            manualEntryId: trans.manualEntryId || null
        };
        const transData = encodeURIComponent(JSON.stringify(transObj));
        const typeLabel = trans.type === 'D' ? t('expenses') : t('income');
        const typeClass = trans.type === 'D' ? 'negative' : 'positive';
        
        return `
            <div class="ignored-transaction-item">
                <div class="ignored-transaction-header">
                    <span class="ignored-transaction-date">${trans.dateStr}</span>
                    <span class="ignored-transaction-amount ${typeClass}">€${trans.amount.toFixed(2)}</span>
                </div>
                <div class="ignored-transaction-beneficiary">${trans.beneficiary || 'N/A'}</div>
                <div class="ignored-transaction-details">${trans.details || ''}</div>
                <div class="ignored-transaction-type">${typeLabel}</div>
                <div class="ignored-transaction-actions">
                    <button onclick="handleIgnoreClick('${transData}')" class="filter-btn-small reenable-btn" data-translate="reenable">
                        ${t('reenable')}
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Re-apply translations
    setTimeout(() => {
        applyTranslations();
    }, 50);
}

