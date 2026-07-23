import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { EstimateItem } from './EstimateForm';

interface EstimateTableProps {
  items: EstimateItem[];
  onRemoveItem: (id: string) => void;
}

export function EstimateTable({ items, onRemoveItem }: EstimateTableProps) {
  const categorizeItems = () => {
    const materials = items.filter((item) => item.category === 'materials');
    const labor = items.filter((item) => item.category === 'labor');
    const equipment = items.filter((item) => item.category === 'equipment');
    return { materials, labor, equipment };
  };

  const { materials, labor, equipment } = categorizeItems();

  const calculateCategoryTotal = (categoryItems: EstimateItem[]) => {
    return categoryItems.reduce((sum, item) => sum + item.total, 0);
  };

  const renderCategory = (title: string, categoryItems: EstimateItem[]) => {
    if (categoryItems.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-lg">{title}</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2">
                <th className="text-left py-2 px-2">Item</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-right py-2 px-2">Qty</th>
                <th className="text-right py-2 px-2">Unit</th>
                <th className="text-right py-2 px-2">Unit Price (KES)</th>
                <th className="text-right py-2 px-2">Total (KES)</th>
                <th className="text-center py-2 px-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {categoryItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-2">{item.name}</td>
                  <td className="py-3 px-2 text-sm text-muted-foreground">
                    {item.description || '-'}
                  </td>
                  <td className="py-3 px-2 text-right">{item.quantity}</td>
                  <td className="py-3 px-2 text-right">{item.unit}</td>
                  <td className="py-3 px-2 text-right">
                    {item.unitPrice.toLocaleString('en-KE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-2 text-right font-medium">
                    {item.total.toLocaleString('en-KE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </td>
                </tr>
              ))}
              <tr className="font-semibold bg-muted/30">
                <td colSpan={5} className="py-2 px-2 text-right">
                  {title} Subtotal:
                </td>
                <td className="py-2 px-2 text-right">
                  {calculateCategoryTotal(categoryItems).toLocaleString('en-KE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  if (items.length === 0) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Estimate Items</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            No items added yet. Add items using the form above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle>Estimate Items</CardTitle>
      </CardHeader>
      <CardContent>
        {renderCategory('Materials', materials)}
        {renderCategory('Labor', labor)}
        {renderCategory('Equipment', equipment)}
      </CardContent>
    </Card>
  );
}