import { Calculator, FileText, Printer } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { EstimateItem } from './EstimateForm';

interface EstimateSummaryProps {
  items: EstimateItem[];
  projectName: string;
  clientName: string;
  projectNotes: string;
  onProjectNameChange: (name: string) => void;
  onClientNameChange: (name: string) => void;
  onProjectNotesChange: (notes: string) => void;
  onPrint: () => void;
}

export function EstimateSummary({
  items,
  projectName,
  clientName,
  projectNotes,
  onProjectNameChange,
  onClientNameChange,
  onProjectNotesChange,
  onPrint,
}: EstimateSummaryProps) {
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateByCategory = () => {
    const materials = items
      .filter((item) => item.category === 'materials')
      .reduce((sum, item) => sum + item.total, 0);
    const labor = items
      .filter((item) => item.category === 'labor')
      .reduce((sum, item) => sum + item.total, 0);
    const equipment = items
      .filter((item) => item.category === 'equipment')
      .reduce((sum, item) => sum + item.total, 0);
    return { materials, labor, equipment };
  };

  const { materials, labor, equipment } = calculateByCategory();
  const total = calculateTotal();
  const vat = total * 0.16; // 16% VAT in Kenya
  const grandTotal = total + vat;

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-t-4 border-t-accent">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-primary/5">
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => onProjectNameChange(e.target.value)}
              placeholder="e.g., 3-Bedroom Residential House"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name</Label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-notes">Project Notes</Label>
            <Textarea
              id="project-notes"
              value={projectNotes}
              onChange={(e) => onProjectNotesChange(e.target.value)}
              placeholder="Add any additional notes or specifications..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span>Materials:</span>
            <span className="font-medium">
              KES {materials.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Labor:</span>
            <span className="font-medium">
              KES {labor.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b">
            <span>Equipment:</span>
            <span className="font-medium">
              KES {equipment.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-2 border-b-2 border-foreground/20">
            <span className="font-semibold">Subtotal:</span>
            <span className="font-semibold">
              KES {total.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span>VAT (16%):</span>
            <span className="font-medium">
              KES {vat.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div className="flex justify-between py-3 border-t-2 border-foreground bg-muted px-4 -mx-4 rounded">
            <span className="font-bold text-lg">Grand Total:</span>
            <span className="font-bold text-lg text-primary">
              KES {grandTotal.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          {items.length > 0 && (
            <Button onClick={onPrint} className="w-full mt-4" size="lg">
              <Printer className="mr-2 h-4 w-4" />
              Print Estimate
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}