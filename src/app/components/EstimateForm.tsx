import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export interface EstimateItem {
  id: string;
  category: 'materials' | 'labor' | 'equipment';
  name: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface EstimateFormProps {
  onAddItem: (item: Omit<EstimateItem, 'id' | 'total'>) => void;
}

// Common construction materials in Kenya with typical units and sample prices (KES)
const MATERIAL_OPTIONS = [
  { name: 'Cement (50kg bag)', unit: 'bags', price: 750 },
  { name: 'Ballast', unit: 'tonnes', price: 3500 },
  { name: 'Sand', unit: 'tonnes', price: 2800 },
  { name: 'Gravel (Hardcore)', unit: 'tonnes', price: 3200 },
  { name: 'Steel Bars (Y12)', unit: 'kg', price: 120 },
  { name: 'Steel Bars (Y16)', unit: 'kg', price: 125 },
  { name: 'Bricks (9")', unit: 'pcs', price: 15 },
  { name: 'Blocks (9")', unit: 'pcs', price: 45 },
  { name: 'Roofing Sheets (Mabati)', unit: 'sheets', price: 850 },
  { name: 'Timber 2x4', unit: 'ft', price: 85 },
  { name: 'Timber 3x2', unit: 'ft', price: 65 },
  { name: 'Plywood 18mm', unit: 'sheets', price: 2500 },
  { name: 'Tiles (Floor)', unit: 'm²', price: 1200 },
  { name: 'Paint (Interior)', unit: 'litres', price: 850 },
  { name: 'Paint (Exterior)', unit: 'litres', price: 950 },
  { name: 'PVC Pipes 4"', unit: 'metres', price: 450 },
  { name: 'Windows (Standard)', unit: 'pcs', price: 8500 },
  { name: 'Doors (Flush)', unit: 'pcs', price: 6500 },
];

const LABOR_OPTIONS = [
  { name: 'Mason (Skilled)', unit: 'days', price: 1500 },
  { name: 'Mason (Unskilled)', unit: 'days', price: 800 },
  { name: 'Carpenter', unit: 'days', price: 1800 },
  { name: 'Plumber', unit: 'days', price: 2000 },
  { name: 'Electrician', unit: 'days', price: 2200 },
  { name: 'Painter', unit: 'days', price: 1200 },
  { name: 'General Laborer', unit: 'days', price: 600 },
  { name: 'Foreman', unit: 'days', price: 2500 },
  { name: 'Steel Fixer', unit: 'days', price: 1600 },
  { name: 'Roofer', unit: 'days', price: 1400 },
];

const EQUIPMENT_OPTIONS = [
  { name: 'Concrete Mixer', unit: 'days', price: 1500 },
  { name: 'Scaffolding', unit: 'days', price: 800 },
  { name: 'Vibrator', unit: 'days', price: 600 },
  { name: 'Water Pump', unit: 'days', price: 1000 },
  { name: 'Generator', unit: 'days', price: 2500 },
  { name: 'Wheelbarrow', unit: 'days', price: 150 },
  { name: 'Ladder', unit: 'days', price: 200 },
];

export function EstimateForm({ onAddItem }: EstimateFormProps) {
  const [category, setCategory] = useState<'materials' | 'labor' | 'equipment'>('materials');
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');

  const getCurrentOptions = () => {
    switch (category) {
      case 'materials':
        return MATERIAL_OPTIONS;
      case 'labor':
        return LABOR_OPTIONS;
      case 'equipment':
        return EQUIPMENT_OPTIONS;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const options = getCurrentOptions();
    const item = options.find(opt => opt.name === selectedItem);
    
    if (!item || !quantity) return;

    onAddItem({
      category,
      name: item.name,
      description,
      quantity: parseFloat(quantity),
      unit: item.unit,
      unitPrice: item.price,
    });

    // Reset form
    setQuantity('');
    setDescription('');
  };

  const currentItem = getCurrentOptions().find(opt => opt.name === selectedItem);

  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add Item to Estimate
        </CardTitle>
        <CardDescription>Select category and item, then specify quantity</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={category}
                onValueChange={(value: 'materials' | 'labor' | 'equipment') => {
                  setCategory(value);
                  setSelectedItem('');
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="labor">Labor</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="item">Item</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger id="item">
                  <SelectValue placeholder="Select item..." />
                </SelectTrigger>
                <SelectContent>
                  {getCurrentOptions().map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {currentItem && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder={`Enter ${currentItem.unit}`}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit-price">Unit Price (KES)</Label>
                  <Input
                    id="unit-price"
                    type="text"
                    value={currentItem.price.toLocaleString()}
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add notes or specifications..."
                />
              </div>

              {quantity && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Subtotal:</span> KES{' '}
                    {(parseFloat(quantity) * currentItem.price).toLocaleString('en-KE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  );
}