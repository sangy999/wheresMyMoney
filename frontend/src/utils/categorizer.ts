export function categorizeTransaction(beneficiary: string, details: string): string {
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
  const categories: Record<string, string[]> = {
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

