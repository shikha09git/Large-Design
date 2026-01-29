import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

import { BusinessSelector } from './components/BusinessSelector';
import { BusinessOverview } from './components/BusinessOverview';
import { ThemeToggle } from './components/ThemeToggle';
import { Sparkles } from 'lucide-react';

import type { Business } from './components/BusinessSelector';
interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  businessId: string;
}

import { BalanceCard } from './components/BalanceCard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';

function App() {
  // ================= AUTH STATE =================
  const [user, setUser] = useState<any>(null);
  const [authId, setAuthId] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) setAuthError('Google login error: ' + error.message);
    } catch {
      setAuthError('Unexpected error during Google login');
    }
  };

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) setUser(data.session.user);
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => { listener?.subscription?.unsubscribe?.(); };
    };
    getSession();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    if (isSignUp) {
      if (authPassword !== authConfirmPassword) {
        setAuthError('Passwords do not match.');
        setAuthLoading(false);
        return;
      }
      const { error } = await supabase.auth.signUp({
        email: authId,
        password: authPassword,
      });
      setAuthLoading(false);
      if (error) setAuthError('Sign up error: ' + error.message);
      else setAuthError('Sign up successful! Please check your email to confirm.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: authId,
        password: authPassword,
      });
      setAuthLoading(false);
      if (error) setAuthError('Login error: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // ================= TRANSACTIONS =================
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  const handleEditTransaction = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
    setEditDialogOpen(true);
  };

  const handleUpdateTransaction = async (updated: Omit<Transaction, 'id'>) => {
    if (!transactionToEdit) return;

    const supabaseTransaction = {
      date: updated.date,
      description: updated.description,
      category: updated.category,
      type: updated.type,
      amount: Number(updated.amount),
      business_id: updated.businessId,
    };

    const { error } = await supabase
      .from('transactions')
      .update(supabaseTransaction)
      .eq('id', transactionToEdit.id);

    if (error) {
      console.error('Error updating transaction:', error);
      return;
    }

    const updatedTransaction: Transaction = {
      ...transactionToEdit,
      ...updated,
      amount: Number(updated.amount),
    };

    setTransactions((prev) =>
      prev.map((t) => (t.id === transactionToEdit.id ? updatedTransaction : t))
    );

    setTransactionToEdit(updatedTransaction);
    setEditDialogOpen(false);
    setTransactionToEdit(null);
  };

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchBusinesses = async () => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id);
      if (!error) setBusinesses(data || []);
    };

    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id);
      if (!error) {
        const mapped = (data || []).map((t) => ({
          ...t,
          businessId: t.business_id,
        }));
        setTransactions(mapped);
      }
    };

    fetchBusinesses();
    fetchTransactions();
  }, [user]);

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | 'all'>('all');

  const handleAddBusiness = async (newBusiness: Omit<Business, 'id'>) => {
    const { data, error } = await supabase
      .from('businesses')
      .insert([{ name: newBusiness.name, color: newBusiness.color, user_id: user.id }])
      .select();
    if (!error && data?.length) setBusinesses([...businesses, data[0]]);
  };

  const handleEditBusiness = async (id: string, updatedBusiness: Omit<Business, 'id'>) => {
    const { data, error } = await supabase
      .from('businesses')
      .update(updatedBusiness)
      .eq('id', id)
      .select();
    if (!error && data?.length) {
      setBusinesses(businesses.map((b) => (b.id === id ? data[0] : b)));
    }
  };

  const handleDeleteBusiness = async (id: string) => {
    const { error } = await supabase.from('businesses').delete().eq('id', id);
    if (error) return;
    setBusinesses(businesses.filter((b) => b.id !== id));
    setTransactions(transactions.filter((t) => t.businessId !== id));
    if (selectedBusinessId === id) setSelectedBusinessId('all');
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    const supabaseTransaction = {
      date: newTransaction.date,
      description: newTransaction.description,
      category: newTransaction.category,
      type: newTransaction.type,
      amount: Number(newTransaction.amount),
      business_id: newTransaction.businessId,
      user_id: user.id,
    };

    const { error } = await supabase.from('transactions').insert([supabaseTransaction]);
    if (error) return;

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    const mapped = (data || []).map((t) => ({
      ...t,
      businessId: t.business_id,
    }));
    setTransactions(mapped);
  };

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) return;

    const { data } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id);

    const mapped = (data || []).map((t) => ({
      ...t,
      businessId: t.business_id,
    }));
    setTransactions(mapped);
  };

  const filteredTransactions =
    selectedBusinessId === 'all'
      ? transactions
      : transactions.filter((t) => t.businessId === selectedBusinessId);

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // =====================================================================
  // ============================ LOGIN UI ===============================
  // =====================================================================
  if (!user) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05080f] via-[#0b1220] to-[#0f1730] p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header — EXACT dashboard style */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111b3a]/80 via-[#0b1220]/80 to-[#0f1730]/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center text-blue-400 text-lg">
              ✨
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-400">Multi Book</h1>
              <p className="text-slate-400 text-xs">
                Track expenses across all your businesses
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Auth Panel — looks like dashboard card */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-[#111b3a]/70 via-[#0b1220]/70 to-[#0f1730]/70 backdrop-blur-xl shadow-[0_30px_90px_rgba(0,0,0,0.7)] p-8 max-w-xl mx-auto">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-white mb-1">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isSignUp
                ? 'Start tracking your businesses in minutes.'
                : 'Sign in to continue to Multi Book.'}
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={authLoading}
            className="w-full mb-5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold py-3 transition-all duration-200 shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
          >
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400">Email</label>
              <input
                type="email"
                value={authId}
                onChange={(e) => setAuthId(e.target.value)}
                placeholder="you@example.com"
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-500 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400">Password</label>
              <input
                type="password"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-500 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>

            {isSignUp && (
              <div>
                <label className="text-xs text-slate-400">Confirm Password</label>
                <input
                  type="password"
                  value={authConfirmPassword}
                  onChange={(e) => setAuthConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-slate-500 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 transition-all duration-200 shadow-[0_10px_28px_rgba(59,130,246,0.45)] hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]"
            >
              {authLoading
                ? 'Please wait...'
                : isSignUp
                ? 'Create account'
                : 'Sign in'}
            </button>
          </form>

          <div className="mt-5 text-sm text-center text-slate-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsSignUp((p) => !p)}
              className="text-blue-400 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </div>

          {authError && (
            <div className="mt-4 text-red-400 text-sm text-center">
              {authError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


  // =====================================================================
  // ============================ MAIN APP ================================
  // =====================================================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col w-full">
            <div className="flex items-center w-full border-b border-gray-300 dark:border-gray-700 pb-3 mb-4 gap-6">
              <Sparkles className="w-8 h-8 text-blue-500 mr-2" />
              <div className="flex flex-col justify-center mr-6">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Multi Book
                </h1>
                <span className="text-gray-600 dark:text-gray-400 text-base">
                  Track expenses across all your businesses
                </span>
              </div>
              <div className="flex-1" />
              <div className="flex flex-row gap-3 items-center">
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
                  defaultBusinessId={
                    selectedBusinessId !== 'all' ? selectedBusinessId : undefined
                  }
                  onAddTransaction={handleAddTransaction}
                />
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="border-input data-[placeholder]:text-muted-foreground [&_svg]:not([class*='text-']) w-[200px] h-[36px] px-[12px] py-[8px] rounded-md border bg-[oklab:0.269_0_0/.3] text-white font-semibold flex items-center justify-center transition-colors"
                  role="combobox"
                  tabIndex={0}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <BalanceCard
          totalIncome={totalIncome}
          totalExpenses={totalExpenses}
          balance={balance}
        />

        {selectedBusinessId === 'all' && (
          <BusinessOverview transactions={transactions} businesses={businesses} />
        )}

        <TransactionList
          transactions={filteredTransactions}
          businesses={businesses}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleEditTransaction}
        />

        {transactionToEdit && (
          <TransactionForm
            businesses={businesses}
            defaultBusinessId={transactionToEdit.businessId}
            onAddTransaction={handleUpdateTransaction}
            key={transactionToEdit.id}
            initialData={transactionToEdit}
            open={editDialogOpen}
            setOpen={(open: boolean) => {
              setEditDialogOpen(open);
              if (!open) setTransactionToEdit(null);
            }}
            isEdit
          />
        )}
      </div>
    </div>
  );
}

export default App;
