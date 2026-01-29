import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus } from 'lucide-react';
import { Business } from './BusinessSelector';

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  businessId: string;
}

interface TransactionFormProps {
  businesses: Business[];
  defaultBusinessId?: string;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  initialData?: Transaction;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  isEdit?: boolean;
}

export function TransactionForm({ businesses, defaultBusinessId, onAddTransaction, initialData, open, setOpen, isEdit }: TransactionFormProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = typeof open === 'boolean' && setOpen;
  const dialogOpen = controlled ? open : internalOpen;
  const setDialogOpen = controlled ? setOpen! : setInternalOpen;

  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    description: initialData?.description || '',
    category: initialData?.category || '',
    type: (initialData?.type as 'income' | 'expense') || 'expense',
    amount: initialData?.amount?.toString() || '',
    businessId: initialData?.businessId || defaultBusinessId || (businesses.length > 0 ? businesses[0].id : '')
  });

  useEffect(() => {
    if (isEdit && dialogOpen && initialData) {
      setFormData({
        date: initialData.date,
        description: initialData.description,
        category: initialData.category,
        type: initialData.type,
        amount: initialData.amount.toString(),
        businessId: initialData.businessId
      });
      return;
    }

    if (!isEdit && dialogOpen) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        type: 'expense',
        amount: '',
        businessId: defaultBusinessId || (businesses.length > 0 ? businesses[0].id : '')
      });
    }
  }, [dialogOpen, initialData, isEdit, defaultBusinessId, businesses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.category || !formData.amount || !formData.businessId) {
      return;
    }
    onAddTransaction({
      date: formData.date,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      amount: parseFloat(formData.amount),
      businessId: formData.businessId
    });
    if (!controlled) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        type: 'expense',
        amount: '',
        businessId: defaultBusinessId || (businesses.length > 0 ? businesses[0].id : '')
      });
      setInternalOpen(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isEdit && (
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            New Transaction
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business">Business</Label>
            <Select
              value={formData.businessId}
              onValueChange={(value) => setFormData({ ...formData, businessId: value })}
            >
              <SelectTrigger id="business">
                <SelectValue placeholder="Select business" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((business) => (
                  <SelectItem key={business.id} value={business.id}>
                    {business.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'income' | 'expense') => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Enter or select category"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">{isEdit ? 'Update Transaction' : 'Add Transaction'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}