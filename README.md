# Budget Analyzer 💰

A modern web application built with React and TypeScript to analyze bank statement CSV files, categorize transactions, and visualize spending patterns. Features multilingual support (English/Lithuanian) and advanced filtering capabilities.

## ✨ Features

- 📊 **Transaction Analysis**: Automatically categorizes income and expenses using smart keyword matching
- 📈 **Rich Visualizations**: Interactive charts showing spending by category, monthly trends, top merchants, savings rate, and more
- 🔍 **Advanced Filtering**: Filter by date range, amount range, transaction type, and categories
- ➕ **Manual Entries**: Add custom transactions that aren't in your CSV file
- 🚫 **Ignore Transactions**: Hide specific transactions from analysis
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌐 **Multilingual**: Supports English and Lithuanian languages
- 💾 **Local Storage**: Automatically saves your manual entries and ignored transactions
- ⚡ **Modern Stack**: Built with React, TypeScript, and Vite for fast development and optimized builds

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd budgetThing
   ```

2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   - The app will be available at `http://localhost:5173` (or the port shown in terminal)
   - Upload your CSV file and click "Analyze"

### Building for Production

```bash
npm run build
```

The production build will be in the `frontend/dist/` directory.

## 📋 CSV Format

The application expects a CSV file with the following columns:

- `Date`: Transaction date (YYYY-MM-DD format)
- `Beneficiary`: Merchant/beneficiary name
- `Details`: Transaction description
- `Amount`: Transaction amount (positive number)
- `D/K`: Transaction type (D = Debit/Expense, K = Credit/Income)

### Example CSV:

```csv
Date,Beneficiary,Details,Amount,D/K
2024-01-15,GROCERY STORE,Weekly shopping,45.50,D
2024-01-20,EMPLOYER,Salary,2500.00,K
2024-01-22,GAS STATION,Fuel,60.00,D
```

## 📊 Categories

The application automatically categorizes transactions into:

### Income Categories:
- **Salary**: Regular employment income
- **Other Income**: Other sources of income

### Expense Categories:
- **Groceries**: Food and household items
- **Gas/Fuel**: Transportation fuel
- **Subscriptions**: Recurring subscriptions (Netflix, Spotify, etc.)
- **Restaurants**: Dining out
- **Shopping**: General purchases
- **Transport**: Public transport, taxis, etc.
- **Healthcare**: Medical expenses
- **Insurance**: Insurance payments
- **Utilities**: Electricity, water, internet, etc.
- **Transfers**: Money transfers between accounts
- **Entertainment**: Movies, games, events
- **Other**: Uncategorized expenses

## 🎯 Key Features Explained

### Advanced Filtering

- **Date Range**: Filter transactions by specific date periods
- **Amount Range**: Set minimum and maximum transaction amounts
- **Transaction Type**: Show only expenses, only income, or both
- **Category Selection**: Include/exclude specific categories
- **Reset Filters**: Quickly clear all filters

### Manual Entries

Add transactions manually that aren't in your CSV:
- Useful for cash transactions
- Track expenses not captured in bank statements
- All manual entries are saved to local storage

### Ignored Transactions

Hide specific transactions from analysis:
- Useful for one-time transfers or refunds
- Transactions can be toggled on/off
- Ignored transactions are saved to local storage

### Visualizations

The app provides multiple chart types:
- **Expenses by Category**: Pie chart showing spending distribution
- **Monthly Trends**: Line chart of income and expenses over time
- **Top Expense Merchants**: Bar chart of highest spending locations
- **Savings Rate Over Time**: Track your savings percentage
- **Cumulative Cash Flow**: Running balance visualization
- **Category Growth Rate**: See which categories are growing fastest
- **Spending Efficiency Analysis**: Advanced analytics on spending patterns

### Monthly Statistics

View detailed statistics for each month:
- Total income and expenses
- Net balance
- Savings rate
- Category breakdowns
- Month-over-month comparisons

## 🏗️ Project Structure

```
budgetThing/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Charts/
│   │   │   │   └── ChartsPanel.tsx
│   │   │   ├── Filters/
│   │   │   │   ├── FilterSidebar.tsx
│   │   │   │   ├── ManualEntryForm.tsx
│   │   │   │   ├── ManualEntriesList.tsx
│   │   │   │   └── IgnoredTransactionsList.tsx
│   │   │   ├── MonthlyStats/
│   │   │   │   ├── MonthlyStatsPanel.tsx
│   │   │   │   └── MonthlyStatsContent.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   └── Summary.tsx
│   │   ├── context/
│   │   │   └── AppContext.tsx          # React Context for state management
│   │   ├── types/
│   │   │   └── index.ts                # TypeScript type definitions
│   │   ├── utils/
│   │   │   ├── analyzer.ts             # Data analysis logic
│   │   │   ├── categorizer.ts          # Transaction categorization
│   │   │   ├── csvParser.ts            # CSV parsing utilities
│   │   │   └── translations.ts         # Multilingual translations
│   │   ├── App.tsx                     # Main app component
│   │   ├── App.css                     # App styles
│   │   ├── main.tsx                    # React entry point
│   │   └── index.css                   # Global styles
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── MIGRATION.md                    # Migration notes from vanilla JS
├── .gitignore
└── README.md
```

## 🛠️ Technology Stack

- **React 18**: UI library
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Chart.js**: Charting library for visualizations
- **PapaParse**: CSV parsing library
- **React Context API**: State management

## 🔧 Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

### Code Structure

- **Components**: Reusable UI components organized by feature
- **Context**: Global state management using React Context
- **Utils**: Pure functions for data processing and analysis
- **Types**: TypeScript type definitions for type safety

## 🐛 Troubleshooting

- **File upload fails**: Check that your CSV file matches the expected format (Date, Beneficiary, Details, Amount, D/K columns)
- **Charts not showing**: Open browser console (F12) to check for JavaScript errors
- **CSV parsing errors**: Ensure your CSV has the required columns and proper date format (YYYY-MM-DD)
- **Build errors**: Run `npm install` to ensure all dependencies are installed
- **Port already in use**: Vite will automatically try the next available port

## 🔮 Future Enhancements

- Machine learning-based categorization
- Budget goals and alerts
- Export reports (PDF/Excel)
- Multiple account support
- Custom category rules
- Recurring transaction detection
- Budget vs actual comparisons
- Data import from other formats (OFX, QIF)

## 📝 License

This project is open source and available for personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: All data processing happens entirely in your browser. No data is sent to any server, ensuring complete privacy and security of your financial information.
