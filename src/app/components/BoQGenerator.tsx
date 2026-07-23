import { FileText, Download, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { EstimateItem } from './EstimateForm';

interface BoQGeneratorProps {
  items: EstimateItem[];
  projectName: string;
  clientName: string;
  projectNotes: string;
}

interface BoQSection {
  title: string;
  code: string;
  items: EstimateItem[];
}

export function BoQGenerator({ items, projectName, clientName, projectNotes }: BoQGeneratorProps) {
  const generateBoQSections = (): BoQSection[] => {
    const sections: BoQSection[] = [];

    // Group materials by type
    const materials = items.filter((item) => item.category === 'materials');
    if (materials.length > 0) {
      const cementItems = materials.filter((item) => item.name.toLowerCase().includes('cement'));
      const aggregateItems = materials.filter((item) =>
        ['ballast', 'sand', 'gravel'].some((keyword) => item.name.toLowerCase().includes(keyword))
      );
      const steelItems = materials.filter((item) => item.name.toLowerCase().includes('steel'));
      const masonryItems = materials.filter((item) =>
        ['brick', 'block'].some((keyword) => item.name.toLowerCase().includes(keyword))
      );
      const roofingItems = materials.filter((item) =>
        ['roof', 'mabati', 'timber'].some((keyword) => item.name.toLowerCase().includes(keyword))
      );
      const finishingItems = materials.filter((item) =>
        ['tile', 'paint', 'plywood'].some((keyword) => item.name.toLowerCase().includes(keyword))
      );
      const plumbingItems = materials.filter((item) =>
        ['pipe', 'pvc'].some((keyword) => item.name.toLowerCase().includes(keyword))
      );
      const doorsWindowsItems = materials.filter((item) =>
        ['door', 'window'].some((keyword) => item.name.toLowerCase().includes(keyword))
      );

      if (cementItems.length > 0)
        sections.push({ title: 'Cement & Binding Materials', code: 'A.1', items: cementItems });
      if (aggregateItems.length > 0)
        sections.push({ title: 'Aggregates', code: 'A.2', items: aggregateItems });
      if (steelItems.length > 0)
        sections.push({ title: 'Reinforcement Steel', code: 'B.1', items: steelItems });
      if (masonryItems.length > 0)
        sections.push({ title: 'Masonry Works', code: 'C.1', items: masonryItems });
      if (roofingItems.length > 0)
        sections.push({ title: 'Roofing & Carpentry', code: 'D.1', items: roofingItems });
      if (finishingItems.length > 0)
        sections.push({ title: 'Finishes', code: 'E.1', items: finishingItems });
      if (plumbingItems.length > 0)
        sections.push({ title: 'Plumbing Materials', code: 'F.1', items: plumbingItems });
      if (doorsWindowsItems.length > 0)
        sections.push({ title: 'Doors & Windows', code: 'G.1', items: doorsWindowsItems });

      // Catch any remaining materials
      const categorizedMaterials = [
        ...cementItems,
        ...aggregateItems,
        ...steelItems,
        ...masonryItems,
        ...roofingItems,
        ...finishingItems,
        ...plumbingItems,
        ...doorsWindowsItems,
      ];
      const otherMaterials = materials.filter((item) => !categorizedMaterials.includes(item));
      if (otherMaterials.length > 0)
        sections.push({ title: 'Other Materials', code: 'A.9', items: otherMaterials });
    }

    // Add labor section
    const labor = items.filter((item) => item.category === 'labor');
    if (labor.length > 0) {
      sections.push({ title: 'Labor', code: 'H.1', items: labor });
    }

    // Add equipment section
    const equipment = items.filter((item) => item.category === 'equipment');
    if (equipment.length > 0) {
      sections.push({ title: 'Equipment & Plant Hire', code: 'I.1', items: equipment });
    }

    return sections;
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const boqSections = generateBoQSections();
  const subtotal = calculateTotal();
  const vat = subtotal * 0.16;
  const grandTotal = subtotal + vat;

  const handleDownloadBoQ = () => {
    const boqContent = generateBoQContent();
    const blob = new Blob([boqContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOQ_${projectName || 'Project'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateBoQContent = () => {
    let content = '═══════════════════════════════════════════════════════════════════════\n';
    content += '                         BILL OF QUANTITIES (BoQ)\n';
    content += '═══════════════════════════════════════════════════════════════════════\n\n';
    content += `Project: ${projectName || 'N/A'}\n`;
    content += `Client: ${clientName || 'N/A'}\n`;
    content += `Date: ${new Date().toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })}\n`;
    if (projectNotes) {
      content += `\nProject Notes:\n${projectNotes}\n`;
    }
    content += '\n───────────────────────────────────────────────────────────────────────\n\n';

    boqSections.forEach((section, index) => {
      content += `${section.code}. ${section.title.toUpperCase()}\n`;
      content += '───────────────────────────────────────────────────────────────────────\n';
      content += 'Item No. | Description                    | Qty    | Unit   | Rate (KES) | Amount (KES)\n';
      content += '---------|--------------------------------|--------|--------|------------|-------------\n';

      section.items.forEach((item, idx) => {
        const itemNo = `${section.code}.${idx + 1}`;
        const description = item.name.padEnd(30).substring(0, 30);
        const qty = item.quantity.toFixed(2).padStart(6);
        const unit = item.unit.padEnd(6).substring(0, 6);
        const rate = item.unitPrice.toFixed(2).padStart(10);
        const amount = item.total.toFixed(2).padStart(11);
        content += `${itemNo.padEnd(9)}| ${description} | ${qty} | ${unit} | ${rate} | ${amount}\n`;
      });

      const sectionTotal = section.items.reduce((sum, item) => sum + item.total, 0);
      content += '---------|--------------------------------|--------|--------|------------|-------------\n';
      content += `         | SECTION TOTAL                  |        |        |            | ${sectionTotal
        .toFixed(2)
        .padStart(11)}\n`;
      content += '\n';
    });

    content += '═══════════════════════════════════════════════════════════════════════\n';
    content += `SUBTOTAL:                                                    KES ${subtotal.toFixed(2)}\n`;
    content += `VAT (16%):                                                   KES ${vat.toFixed(2)}\n`;
    content += '────────────────────────────────────────────────���──────────────────────\n';
    content += `GRAND TOTAL:                                                 KES ${grandTotal.toFixed(2)}\n`;
    content += '═══════════════════════════════════════════════════════════════════════\n';

    return content;
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="border-2 border-accent/30 bg-gradient-to-br from-white to-accent/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-accent" />
          Bill of Quantities (BoQ)
        </CardTitle>
        <CardDescription>
          Generate a professional BoQ document with standardized sections
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full" size="lg">
              <Eye className="mr-2 h-4 w-4" />
              Preview BoQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Bill of Quantities Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 font-mono text-xs">
              <div className="text-center border-b-2 pb-4">
                <h2 className="text-lg font-bold">BILL OF QUANTITIES (BoQ)</h2>
                <p className="mt-2">
                  <strong>Project:</strong> {projectName || 'N/A'}
                </p>
                <p>
                  <strong>Client:</strong> {clientName || 'N/A'}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date().toLocaleDateString('en-KE', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {boqSections.map((section) => (
                <div key={section.code} className="space-y-2">
                  <h3 className="font-bold text-sm bg-muted p-2 rounded">
                    {section.code}. {section.title.toUpperCase()}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="border p-2 text-left">Item No.</th>
                          <th className="border p-2 text-left">Description</th>
                          <th className="border p-2 text-right">Qty</th>
                          <th className="border p-2 text-right">Unit</th>
                          <th className="border p-2 text-right">Rate (KES)</th>
                          <th className="border p-2 text-right">Amount (KES)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {section.items.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-muted/30">
                            <td className="border p-2">
                              {section.code}.{idx + 1}
                            </td>
                            <td className="border p-2">{item.name}</td>
                            <td className="border p-2 text-right">{item.quantity.toFixed(2)}</td>
                            <td className="border p-2 text-right">{item.unit}</td>
                            <td className="border p-2 text-right">
                              {item.unitPrice.toLocaleString('en-KE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                            <td className="border p-2 text-right font-medium">
                              {item.total.toLocaleString('en-KE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-muted font-bold">
                          <td colSpan={5} className="border p-2 text-right">
                            Section Total:
                          </td>
                          <td className="border p-2 text-right">
                            {section.items
                              .reduce((sum, item) => sum + item.total, 0)
                              .toLocaleString('en-KE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              <div className="border-t-2 pt-4 space-y-2 text-right">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">SUBTOTAL:</span>
                  <span>
                    KES{' '}
                    {subtotal.toLocaleString('en-KE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>VAT (16%):</span>
                  <span>
                    KES{' '}
                    {vat.toLocaleString('en-KE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t-2 pt-2">
                  <span>GRAND TOTAL:</span>
                  <span className="text-primary">
                    KES{' '}
                    {grandTotal.toLocaleString('en-KE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleDownloadBoQ} className="w-full" size="lg">
          <Download className="mr-2 h-4 w-4" />
          Download BoQ Document
        </Button>
      </CardContent>
    </Card>
  );
}
