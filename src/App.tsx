import { useState } from 'react';
import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { BusinessSelector, Business } from './components/BusinessSelector';
import { BusinessOverview } from './components/BusinessOverview';
import { ThemeToggle } from './components/ThemeToggle';
import { Sparkles } from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  businessId: string;
}

const initialBusinesses: Business[] = [
  { id: '1', name: 'Tech Consulting LLC', color: 'blue' },
  { id: '2', name: 'E-Commerce Store', color: 'green' },
  { id: '3', name: 'Real Estate Ventures', color: 'purple' }
];

const initialTransactions: Transaction[] = [
  {
    id: '1',
    date: '2026-01-25',
    description: 'Client Project Payment',
    category: 'Freelance',
    type: 'income',
    amount: 5000,
    businessId: '1'
  },
  {
    id: '2',
    date: '2026-01-24',
    description: 'Office Supplies',
    category: 'Shopping',
    type: 'expense',
    amount: 150.50,
    businessId: '1'
  },
  {
    id: '3',
    date: '2026-01-23',
    description: 'Product Sales',
    category: 'Other Income',
    type: 'income',
    amount: 1200,
    businessId: '2'
  },
  {
    id: '4',
    date: '2026-01-22',
    description: 'Inventory Purchase',
    category: 'Shopping',
    type: 'expense',
    amount: 800,
    businessId: '2'
  },
  {
    id: '5',
    date: '2026-01-20',
    description: 'Property Rental Income',
    category: 'Investment',
    type: 'income',
    amount: 2500,
    businessId: '3'
  },
  {
    id: '6',
    date: '2026-01-18',
    description: 'Property Maintenance',
    category: 'Other',
    type: 'expense',
    amount: 450,
    businessId: '3'
  },
  {
    id: '7',
    date: '2026-01-17',
    description: 'Internet & Utilities',
    category: 'Utilities',
    type: 'expense',
    amount: 125,
    businessId: '1'
  }
];

export default function App() {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | 'all'>('all');

  const handleAddBusiness = (newBusiness: Omit<Business, 'id'>) => {
    const business: Business = {
      ...newBusiness,
      id: Date.now().toString()
    };
    setBusinesses([...businesses, business]);
  };

  const handleEditBusiness = (id: string, updatedBusiness: Omit<Business, 'id'>) => {
    setBusinesses(businesses.map(b => b.id === id ? { ...b, ...updatedBusiness } : b));
  };

  const handleDeleteBusiness = (id: string) => {
    setBusinesses(businesses.filter(b => b.id !== id));
    setTransactions(transactions.filter(t => t.businessId !== id));
    if (selectedBusinessId === id) {
      setSelectedBusinessId('all');
    }
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Date.now().toString()
    };
    setTransactions([...transactions, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const filteredTransactions = selectedBusinessId === 'all'
    ? transactions
    : transactions.filter(t => t.businessId === selectedBusinessId);

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Multi Book
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Track expenses across all your businesses</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center">
            <ThemeToggle />
            <BusinessSelector
              businesses={businesses}
              selectedBusinessId={selectedBusinessId}
              onSelectBusiness={setSelectedBusinessId}
              onAddBusiness={handleAddBusiness}
              onEditBusiness={handleEditBusiness}
              onDeleteBusiness={handleDeleteBusiness}
            />
            <TransactionForm
              businesses={businesses}
              defaultBusinessId={selectedBusinessId !== 'all' ? selectedBusinessId : undefined}
              onAddTransaction={handleAddTransaction}
            />
          </div>
        </div>

        {/* Balance Cards */}
        <BalanceCard
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        {/* Business Overview */}
        {selectedBusinessId === 'all' && (
          <BusinessOverview transactions={transactions} businesses={businesses} />
        )}

        {/* Transaction List */}
        <TransactionList
          transactions={filteredTransactions}
          businesses={businesses}
          onDeleteTransaction={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}
