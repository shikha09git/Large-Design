import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Building2, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export interface Business {
  id: string;
  name: string;
  color: string;
}

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusinessId: string | 'all';
  onSelectBusiness: (businessId: string | 'all') => void;
  onAddBusiness: (business: Omit<Business, 'id'>) => void;
  onEditBusiness: (id: string, business: Omit<Business, 'id'>) => void;
  onDeleteBusiness: (id: string) => void;
}

const colorOptions = [
  { value: 'blue', label: 'Blue', class: 'bg-blue-600' },
  { value: 'green', label: 'Green', class: 'bg-green-600' },
  { value: 'purple', label: 'Purple', class: 'bg-purple-600' },
  { value: 'orange', label: 'Orange', class: 'bg-orange-600' },
  { value: 'red', label: 'Red', class: 'bg-red-600' },
  { value: 'pink', label: 'Pink', class: 'bg-pink-600' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-600' },
  { value: 'teal', label: 'Teal', class: 'bg-teal-600' },
];

export function BusinessSelector({
  businesses,
  selectedBusinessId,
  onSelectBusiness,
  onAddBusiness,
  onEditBusiness,
  onDeleteBusiness
}: BusinessSelectorProps) {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [manageDialogOpen, setManageDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [formData, setFormData] = useState({ name: '', color: 'blue' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingBusiness) {
      onEditBusiness(editingBusiness.id, formData);
      setEditingBusiness(null);
    } else {
      onAddBusiness(formData);
      setAddDialogOpen(false);
    }
    
    setFormData({ name: '', color: 'blue' });
  };

  const handleEdit = (business: Business) => {
    setEditingBusiness(business);
    setFormData({ name: business.name, color: business.color });
  };

  const handleCancelEdit = () => {
    setEditingBusiness(null);
    setFormData({ name: '', color: 'blue' });
  };

  const selectedBusiness = businesses.find(b => b.id === selectedBusinessId);
  const colorClass = selectedBusiness ? colorOptions.find(c => c.value === selectedBusiness.color)?.class : 'bg-gray-600';

  return (
    <div className="flex gap-2">
      <Select value={selectedBusinessId} onValueChange={onSelectBusiness}>
        <SelectTrigger className="w-[200px]">
          <div className="flex items-center gap-2">
            {selectedBusinessId !== 'all' && selectedBusiness && (
              <div className={`w-3 h-3 rounded-full ${colorClass}`} />
            )}
            <SelectValue placeholder="Select business" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              All Businesses
            </div>
          </SelectItem>
          {businesses.map((business) => {
            const color = colorOptions.find(c => c.value === business.color)?.class;
            return (
              <SelectItem key={business.id} value={business.id}>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${color}`} />
                  {business.name}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Business</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Business Name</Label>
              <Input
                id="business-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter business name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-color">Color</Label>
              <Select
                value={formData.color}
                onValueChange={(value) => setFormData({ ...formData, color: value })}
              >
                <SelectTrigger id="business-color">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full ${colorOptions.find(c => c.value === formData.color)?.class}`} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded-full ${color.class}`} />
                        {color.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Business</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={manageDialogOpen} onOpenChange={setManageDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Building2 className="w-4 h-4" />
            Manage
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Manage Businesses</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {businesses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No businesses yet. Add your first business!
              </div>
            ) : (
              businesses.map((business) => {
                const color = colorOptions.find(c => c.value === business.color)?.class;
                const isEditing = editingBusiness?.id === business.id;

                return (
                  <Card key={business.id}>
                    <CardContent className="pt-4">
                      {isEditing ? (
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`edit-name-${business.id}`}>Business Name</Label>
                            <Input
                              id={`edit-name-${business.id}`}
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`edit-color-${business.id}`}>Color</Label>
                            <Select
                              value={formData.color}
                              onValueChange={(value) => setFormData({ ...formData, color: value })}
                            >
                              <SelectTrigger id={`edit-color-${business.id}`}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full ${colorOptions.find(c => c.value === formData.color)?.class}`} />
                                  <SelectValue />
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {colorOptions.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full ${color.class}`} />
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <Button type="submit" size="sm">Save</Button>
                            <Button type="button" variant="outline" size="sm" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${color}`} />
                            <span className="font-medium">{business.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(business)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDeleteBusiness(business.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
