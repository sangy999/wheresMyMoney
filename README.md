# Budget Analyzer 💰

A web application to analyze bank statement CSV files, categorize transactions, and visualize spending patterns.

## Features

- 📊 **Transaction Analysis**: Automatically categorizes income and expenses
- 📈 **Visualizations**: Interactive charts showing spending by category, monthly trends, and top merchants
- 💡 **Smart Categorization**: Uses keyword matching to categorize transactions (Groceries, Gas, Subscriptions, etc.)
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🌐 **No Installation Required**: Works entirely in your browser!

## Quick Start

1. **Simply open `frontend/index.html` in your web browser**
   - Double-click the file, or
   - Right-click → Open with → Your browser
   
2. **Upload your CSV file and click "Analyze"**

That's it! No installation, no server setup needed. Everything runs in your browser.

## CSV Format

The application expects a CSV file with the following columns:
- `Date`: Transaction date (YYYY-MM-DD format)
- `Beneficiary`: Merchant/beneficiary name
- `Details`: Transaction description
- `Amount`: Transaction amount
- `D/K`: Transaction type (D = Debit/Expense, K = Credit/Income)

## Categories

The application automatically categorizes transactions into:

**Income:**
- Salary
- Other Income

**Expenses:**
- Groceries
- Gas/Fuel
- Subscriptions
- Restaurants
- Shopping
- Transport
- Healthcare
- Insurance
- Utilities
- Transfers
- Entertainment
- Other

## Project Structure

```
budgetThing/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── app.js              # Analysis logic (runs in browser)
│   └── styles.css          # Styling
└── README.md
```

## Troubleshooting

- **File upload fails**: Check that your CSV file matches the expected format
- **Charts not showing**: Open browser console (F12) to check for JavaScript errors
- **CSV parsing errors**: Make sure your CSV has the required columns: Date, Beneficiary, Details, Amount, D/K

## Future Enhancements

- Machine learning-based categorization
- Local storage to save analysis history
- Budget goals and alerts
- Export reports (PDF/Excel)
- Multiple account support
- Custom category rules

