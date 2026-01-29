import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Wallet,
} from "lucide-react";

interface BalanceCardProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

export function BalanceCard({
  totalIncome,
  totalExpenses,
  balance,
}: BalanceCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-green-700 dark:text-green-400">
            Total Income
          </CardTitle>
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <ArrowUpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-700 dark:text-green-400">
            {formatCurrency(totalIncome)}
          </div>
          <p className="text-xs text-green-600 dark:text-green-500 mt-2">
            Earnings this period
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-red-700 dark:text-red-400">
            Total Expenses
          </CardTitle>
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
            <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-700 dark:text-red-400">
            {formatCurrency(totalExpenses)}
          </div>
          <p className="text-xs text-red-600 dark:text-red-500 mt-2">
            Spending this period
          </p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-400">
            Net Balance
          </CardTitle>
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-3xl font-bold ${balance >= 0 ? "text-blue-700 dark:text-blue-400" : "text-red-700 dark:text-red-400"}`}
          >
            {formatCurrency(balance)}
          </div>
          <p
            className={`text-xs mt-2 ${balance >= 0 ? "text-blue-600 dark:text-blue-500" : "text-red-600 dark:text-red-500"}`}
          >
            {balance >= 0
              ? "Positive cash flow"
              : "Negative cash flow"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}