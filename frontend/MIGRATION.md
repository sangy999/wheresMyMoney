# Migration to React + TypeScript + Vite

This project has been migrated from vanilla JavaScript to React + TypeScript + Vite.

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Charts/
│   │   │   └── ChartsPanel.tsx
│   │   ├── Filters/
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── ManualEntryForm.tsx
│   │   │   ├── ManualEntriesList.tsx
│   │   │   └── IgnoredTransactionsList.tsx
│   │   ├── MonthlyStats/
│   │   │   ├── MonthlyStatsPanel.tsx
│   │   │   └── MonthlyStatsContent.tsx
│   │   ├── FileUpload.tsx
│   │   ├── LanguageSwitcher.tsx
│   │   └── Summary.tsx
│   ├── context/
│   │   └── AppContext.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── analyzer.ts
│   │   ├── categorizer.ts
│   │   ├── csvParser.ts
│   │   └── translations.ts
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Key Changes

### State Management
- Replaced global variables with React Context API
- State is now managed in `AppContext.tsx`
- Components only re-render when their specific state changes

### Component Structure
- Split monolithic `app.js` into focused React components
- Each component handles its own UI and state updates
- Better separation of concerns

### Type Safety
- Added TypeScript types for all data structures
- Type checking catches errors at compile time
- Better IDE support and autocomplete

### Build System
- Vite for fast development and optimized builds
- Hot Module Replacement (HMR) for instant updates
- TypeScript compilation handled automatically

## Benefits

1. **Selective Re-rendering**: Only components using changed state update
2. **Type Safety**: Catch errors before runtime
3. **Better Organization**: Code split into logical modules
4. **Easier Maintenance**: Components are self-contained
5. **Modern Tooling**: Vite provides fast development experience

## Migration Notes

- All functionality from the original app has been preserved
- LocalStorage integration maintained
- Chart.js integration updated for React
- Translations system preserved
- Filter system fully functional

