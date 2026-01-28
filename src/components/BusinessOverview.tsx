import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Business } from './BusinessSelector';
import { TrendingUp, TrendingDown, Wallet, Activity } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  businessId: string;
}

interface BusinessOverviewProps {
  transactions: Transaction[];
  businesses: Business[];
}

const colorClasses: Record<string, { bg: string; border: string; text: string; gradient: string; dot: string }> = {
  blue: { 
    bg: 'bg-blue-100', 
    border: 'border-blue-200', 
    text: 'text-blue-700',
    gradient: 'from-blue-50 to-blue-100',
    dot: 'bg-blue-600'
  },
  green: { 
    bg: 'bg-green-100', 
    border: 'border-green-200', 
    text: 'text-green-700',
    gradient: 'from-green-50 to-green-100',
    dot: 'bg-green-600'
  },
  purple: { 
    bg: 'bg-purple-100', 
    border: 'border-purple-200', 
    text: 'text-purple-700',
    gradient: 'from-purple-50 to-purple-100',
    dot: 'bg-purple-600'
  },
  orange: { 
    bg: 'bg-orange-100', 
    border: 'border-orange-200', 
    text: 'text-orange-700',
    gradient: 'from-orange-50 to-orange-100',
    dot: 'bg-orange-600'
  },
  red: { 
    bg: 'bg-red-100', 
    border: 'border-red-200', 
    text: 'text-red-700',
    gradient: 'from-red-50 to-red-100',
    dot: 'bg-red-600'
  },
  pink: { 
    bg: 'bg-pink-100', 
    border: 'border-pink-200', 
    text: 'text-pink-700',
    gradient: 'from-pink-50 to-pink-100',
    dot: 'bg-pink-600'
  },
  indigo: { 
    bg: 'bg-indigo-100', 
    border: 'border-indigo-200', 
    text: 'text-indigo-700',
    gradient: 'from-indigo-50 to-indigo-100',
    dot: 'bg-indigo-600'
  },
  teal: { 
    bg: 'bg-teal-100', 
    border: 'border-teal-200', 
    text: 'text-teal-700',
    gradient: 'from-teal-50 to-teal-100',
    dot: 'bg-teal-600'
  }
};

export function BusinessOverview({ transactions, businesses }: BusinessOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const businessStats = businesses.map(business => {
    const businessTransactions = transactions.filter(t => t.businessId === business.id);
    const income = businessTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = businessTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;

    return {
      business,
      income,
      expenses,
      balance,
      transactionCount: businessTransactions.length
    };
  });

  return (
    <Card className="border-0 shadow-lg dark:bg-gray-800">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Business Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {businesses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <p className="text-lg">Add your first business to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {businessStats.map(({ business, income, expenses, balance, transactionCount }) => {
              const colors = colorClasses[business.color];
              return (
                <div 
                  key={business.id} 
                  className={`p-5 rounded-xl border-2 ${colors.border} bg-gradient-to-br ${colors.gradient} hover:shadow-lg transition-all duration-300 hover:scale-[1.02]`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${colors.dot} ring-4 ring-white shadow-sm`} />
                      <span className={`font-semibold text-lg ${colors.text}`}>{business.name}</span>
                    </div>
                    <div className={`px-3 py-1 ${colors.bg} rounded-full`}>
                      <span className={`text-xs font-semibold ${colors.text}`}>
                        {transactionCount} txn{transactionCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border border-white/50 dark:border-gray-600/50">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                        <div className="text-xs text-gray-600 dark:text-gray-300">Income</div>
                      </div>
                      <div className="text-base font-bold text-green-600 dark:text-green-400">{formatCurrency(income)}</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border border-white/50 dark:border-gray-600/50">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                        <div className="text-xs text-gray-600 dark:text-gray-300">Expenses</div>
                      </div>
                      <div className="text-base font-bold text-red-600 dark:text-red-400">{formatCurrency(expenses)}</div>
                    </div>
                    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-3 border border-white/50 dark:border-gray-600/50">
                      <div className="flex items-center gap-1 mb-1">
                        <Wallet className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <div className="text-xs text-gray-600 dark:text-gray-300">Net</div>
                      </div>
                      <div className={`text-base font-bold ${balance >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        {formatCurrency(balance)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
