import { useState, useRef } from 'react';
import { Building2, Truck, Droplets, FileText, Download, Printer, Eye, FileSpreadsheet } from 'lucide-react';
import ExcelJS from 'exceljs';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { useApp, formatKES, SECTOR_LABELS } from '../context/AppContext';
import { toast } from 'sonner';

const sectorIcons = { building: Building2, roads: Truck, wash: Droplets };

export function BoQPage() {
  const { currentProject, getProjectTotals, getBoQSections } = useApp();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const totals = getProjectTotals();
  const sections = getBoQSections();
  const SectorIcon = sectorIcons[currentProject.sector];
  const vatPct = currentProject.vatPercent ?? 16;

  const displayDate = currentProject.projectDate
    ? new Date(currentProject.projectDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

  // ───── TXT export ─────
  const generateTXT = (): string => {
    const sep = '═'.repeat(80);
    const thin = '─'.repeat(80);
    let txt = `${sep}\n`;
    txt += `                            BILL OF QUANTITIES (BoQ)\n`;
    txt += `${sep}\n\n`;
    txt += `Project   : ${currentProject.name || 'N/A'}\n`;
    txt += `Client    : ${currentProject.client || 'N/A'}\n`;
    txt += `Location  : ${currentProject.location || 'N/A'}\n`;
    txt += `Sector    : ${SECTOR_LABELS[currentProject.sector]}\n`;
    txt += `Proj. Type: ${currentProject.projectType || 'N/A'}\n`;
    if (currentProject.referenceNo) txt += `Ref. No.  : ${currentProject.referenceNo}\n`;
    if (currentProject.preparedBy)  txt += `Prepared By: ${currentProject.preparedBy}\n`;
    txt += `Date      : ${displayDate}\n`;
    if (currentProject.notes) txt += `Notes     : ${currentProject.notes}\n`;
    txt += `\n${thin}\n\n`;

    sections.forEach(section => {
      txt += `${section.title.toUpperCase()}\n${thin}\n`;
      txt += `${'Item No.'.padEnd(10)}| ${'Description'.padEnd(32)} | ${'Qty'.padStart(8)} | ${'Unit'.padEnd(8)} | ${'Rate (KES)'.padStart(12)} | ${'Amount (KES)'.padStart(14)}\n`;
      txt += `${'─'.repeat(10)}-+-${'─'.repeat(32)}-+-${'─'.repeat(8)}-+-${'─'.repeat(8)}-+-${'─'.repeat(12)}-+-${'─'.repeat(14)}\n`;

      section.items.forEach((item, idx) => {
        const itemNo  = `${section.code}.${idx + 1}`.padEnd(10);
        const desc    = item.name.substring(0, 32).padEnd(32);
        const qty     = item.quantity.toFixed(2).padStart(8);
        const unit    = item.unit.substring(0, 8).padEnd(8);
        const rate    = item.adjustedRate.toFixed(2).padStart(12);
        const amt     = item.total.toFixed(2).padStart(14);
        txt += `${itemNo}| ${desc} | ${qty} | ${unit} | ${rate} | ${amt}\n`;
      });

      txt += `${'─'.repeat(10)}-+-${'─'.repeat(32)}-+-${'─'.repeat(8)}-+-${'─'.repeat(8)}-+-${'─'.repeat(12)}-+-${'─'.repeat(14)}\n`;
      txt += `${''.padEnd(10)}| ${'SECTION TOTAL'.padEnd(32)} |          |          |              | ${section.sectionTotal.toFixed(2).padStart(14)}\n\n`;
    });

    txt += `${sep}\nSUMMARY OF COSTS\n${thin}\n`;
    txt += `${'Subtotal:'.padEnd(55)} KES ${totals.subtotal.toFixed(2).padStart(18)}\n`;
    txt += `${'Contingency (' + currentProject.contingencyPercent + '%):'.padEnd(55)} KES ${totals.contingency.toFixed(2).padStart(18)}\n`;
    txt += `${'Contractor Profit & OH (' + currentProject.profitMarginPercent + '%):'.padEnd(55)} KES ${totals.profitMargin.toFixed(2).padStart(18)}\n`;
    txt += `${thin}\n`;
    txt += `${'Base Contract Sum:'.padEnd(55)} KES ${totals.baseContractSum.toFixed(2).padStart(18)}\n`;
    txt += `${'Value Added Tax (VAT) @ ' + vatPct + '%:'.padEnd(55)} KES ${totals.vat.toFixed(2).padStart(18)}\n`;
    txt += `${sep}\n`;
    txt += `${'GRAND TOTAL (Incl. VAT):'.padEnd(55)} KES ${totals.grandTotal.toFixed(2).padStart(18)}\n`;
    txt += `${sep}\n\n`;
    txt += `Signed: _______________________  Date: _____________________\n`;
    txt += `Name:   _______________________  Position: _________________\n`;
    return txt;
  };

  // ───── Excel export ─────
  const downloadExcel = async () => {
  const workbook = new ExcelJS.Workbook();

  workbook.creator = "Construction Estimator System";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Bill of Quantities");

  worksheet.pageSetup = {
    paperSize: 9,
    orientation: "landscape",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    margins: {
      left: 0.4,
      right: 0.4,
      top: 0.5,
      bottom: 0.5,
      header: 0.2,
      footer: 0.2,
    },
  };

  worksheet.columns = [
    { width: 12 },
    { width: 45 },
    { width: 12 },
    { width: 10 },
    { width: 18 },
    { width: 18 },
    { width: 20 },
  ];
const titleRow = worksheet.addRow([
  "BILL OF QUANTITIES"
]);
worksheet.mergeCells(
  `A${titleRow.number}:G${titleRow.number}`
);
titleRow.height = 28;

titleRow.font = {
  bold: true,
  size: 18,
  color: { argb: "FFFFFFFF" }
};

titleRow.alignment = {
  horizontal: "center",
  vertical: "middle"
};

titleRow.eachCell((cell) => {
  cell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0F766E" }
  };
});
worksheet.addRow([]);
worksheet.addRow(["Project", currentProject.name || "N/A"]);
worksheet.addRow(["Client", currentProject.client || "N/A"]);
worksheet.addRow(["Location", currentProject.location || "N/A"]);
worksheet.addRow(["Project Type", currentProject.projectType || "N/A"]);
worksheet.addRow(["Sector", SECTOR_LABELS[currentProject.sector]]);
worksheet.addRow(["Prepared By", currentProject.preparedBy || "N/A"]);
worksheet.addRow(["Reference No.", currentProject.referenceNo || "N/A"]);
worksheet.addRow(["Date", displayDate]);

worksheet.addRow([]);
const header = worksheet.addRow([
  "Item No.",
  "Description",
  "Quantity",
  "Unit",
  "Rate (KES)",
  "Amount (KES)",
  "Remarks"
]);

header.font = {
  bold: true,
  color: { argb: "FFFFFFFF" }
};

header.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "1E293B" }
};

header.alignment = {
  horizontal: "center",
  vertical: "middle"
};
sections.forEach(section => {

  // Section title
  const sectionRow = worksheet.addRow([
    section.code,
    section.title.toUpperCase()
  ]);

  sectionRow.font = {
    bold: true,
    color: { argb: "FFFFFFFF" }
  };

  sectionRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0F766E" }
  };

  // Merge the title across the row
  worksheet.mergeCells(`B${sectionRow.number}:G${sectionRow.number}`);

  // Items
  section.items.forEach((item, index) => {

    worksheet.addRow([
      `${section.code}.${index + 1}`,
      item.name,
      item.quantity,
      item.unit,
      item.adjustedRate,
      item.total,
      item.rateAdjusted ? "Adjusted" : ""
    ]);

  });

  // Section Total
  const totalRow = worksheet.addRow([
    "",
    "SECTION TOTAL",
    "",
    "",
    "",
    section.sectionTotal,
    ""
  ]);

  totalRow.font = {
    bold: true
  };

});
worksheet.addRow([]);

const summaryTitle = worksheet.addRow(["SUMMARY OF COSTS"]);
summaryTitle.font = {
  bold: true,
  color: { argb: "FFFFFFFF" }
};

summaryTitle.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "1E293B" }
};

worksheet.addRow(["Subtotal", "", "", "", "", totals.subtotal]);
worksheet.addRow([
  `Contingency (${currentProject.contingencyPercent}%)`,
  "",
  "",
  "",
  "",
  totals.contingency
]);

worksheet.addRow([
  `Contractor Profit (${currentProject.profitMarginPercent}%)`,
  "",
  "",
  "",
  "",
  totals.profitMargin
]);

worksheet.addRow([
  "Base Contract Sum",
  "",
  "",
  "",
  "",
  totals.baseContractSum
]);

worksheet.addRow([
  `VAT (${vatPct}%)`,
  "",
  "",
  "",
  "",
  totals.vat
]);

const grandTotal = worksheet.addRow([
  "GRAND TOTAL",
  "",
  "",
  "",
  "",
  totals.grandTotal
]);

grandTotal.font = {
  bold: true,
  color: { argb: "FFFFFFFF" }
};

grandTotal.fill = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "0F766E" }
};
// Format all money columns
worksheet.eachRow((row, rowNumber) => {
  if (rowNumber > 10) {
    row.getCell(5).numFmt = '#,##0.00';
    row.getCell(6).numFmt = '#,##0.00';
  }
});

// Add borders
worksheet.eachRow((row) => {
  row.eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
});

// Freeze header row
worksheet.views = [
  {
    state: "frozen",
    ySplit: 11,
  },
];

// Create Excel file
const buffer = await workbook.xlsx.writeBuffer();

const blob = new Blob(
  [buffer],
  {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  }
);

const filename =
  `BOQ_${(currentProject.name || "Project").replace(/\s+/g, "_")}_${new Date()
    .toISOString()
    .split("T")[0]}.xlsx`;

const url = window.URL.createObjectURL(blob);

const a = document.createElement("a");
a.href = url;
a.download = filename;
a.click();

window.URL.revokeObjectURL(url);

toast.success("Professional Excel BoQ exported successfully!");
};
  // ───── TXT download helper ─────
  const downloadTXT = () => {
    const blob = new Blob([generateTXT()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BOQ_${(currentProject.name || 'Project').replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('BoQ exported as TXT');
  };

  // ───── Print / PDF ─────
  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const w = window.open('', '_blank', 'width=900,height=700');
    if (!w) return;
    w.document.write(`
      <html><head><title>Bill of Quantities - ${currentProject.name || 'Project'}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; margin: 20mm; color: #111; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 4px; }
        .subtitle { text-align: center; color: #555; margin-bottom: 20px; }
        .meta { margin-bottom: 20px; }
        .meta td { padding: 2px 8px 2px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background: #f1f5f9; padding: 6px 8px; text-align: left; border: 1px solid #cbd5e1; font-size: 10px; }
        td { padding: 5px 8px; border: 1px solid #e2e8f0; vertical-align: top; }
        .section-title { background: #0f766e; color: white; font-weight: bold; padding: 6px 8px; }
        .section-total { background: #f0fdf4; font-weight: bold; }
        .total-row { background: #f8fafc; }
        .grand-total { background: #0f766e; color: white; font-weight: bold; }
        .right { text-align: right; }
        .sig { margin-top: 40px; display: flex; gap: 60px; }
        .sig-block { border-top: 1px solid #333; padding-top: 4px; flex: 1; }
        @media print { body { margin: 10mm; } }
      </style>
      </head><body>${content.innerHTML}</body></html>
    `);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); w.close(); }, 500);
  };

  if (currentProject.items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-24 text-muted-foreground">
          <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Items in Estimate</h3>
          <p className="text-sm">Go to the Estimator page to add materials, labour and equipment first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-teal-600" />
            Bill of Quantities
          </h2>
          <p className="text-sm text-slate-500">Professional BoQ document — export to Excel, TXT or PDF</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Eye className="h-4 w-4 mr-1.5" /> Preview
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>BoQ Preview</DialogTitle>
              </DialogHeader>
              <BoQDocument
                currentProject={currentProject}
                sections={sections}
                totals={totals}
                displayDate={displayDate}
                SectorIcon={SectorIcon}
                vatPct={vatPct}
              />
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" className="h-9" onClick={downloadTXT}>
            <Download className="h-4 w-4 mr-1.5" /> TXT
          </Button>

          <Button
            variant="outline" size="sm"
            className="h-9 text-emerald-700 border-emerald-300 hover:bg-emerald-50"
            onClick={downloadExcel}
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>

          <Button size="sm" className="h-9 bg-teal-600 hover:bg-teal-700" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1.5" /> Print / PDF
          </Button>
        </div>
      </div>

      {/* Inline BoQ Document */}
      <div ref={printRef}>
        <BoQDocument
          currentProject={currentProject}
          sections={sections}
          totals={totals}
          displayDate={displayDate}
          SectorIcon={SectorIcon}
          vatPct={vatPct}
        />
      </div>
    </div>
  );
}

interface BoQDocumentProps {
  currentProject: ReturnType<typeof useApp>['currentProject'];
  sections: Array<{ code: string; title: string; items: ReturnType<typeof useApp>['currentProject']['items']; sectionTotal: number }>;
  totals: { subtotal: number; contingency: number; profitMargin: number; baseContractSum: number; vat: number; grandTotal: number };
  displayDate: string;
  SectorIcon: React.FC<{ className?: string }>;
  vatPct: number;
}

function BoQDocument({ currentProject, sections, totals, displayDate, SectorIcon, vatPct }: BoQDocumentProps) {
  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-900 text-white px-8 py-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-teal-400/30 flex items-center justify-center">
                <SectorIcon className="h-5 w-5 text-teal-300" />
              </div>
              <span className="text-teal-300 text-sm">KenConstruct Pro — Professional BoQ</span>
            </div>
            <h1 className="text-2xl font-bold">BILL OF QUANTITIES</h1>
            <p className="text-slate-300 text-sm mt-1">{SECTOR_LABELS[currentProject.sector]}</p>
          </div>
          <div className="text-right text-sm text-slate-300 space-y-0.5">
            <p>Ref: {currentProject.referenceNo || `BOQ-${currentProject.id?.slice(-6)?.toUpperCase()}`}</p>
            <p>Date: {displayDate}</p>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="px-8 py-5 border-b bg-slate-50">
        <div className="grid sm:grid-cols-3 gap-x-8 gap-y-2 text-sm">
          {[
            ['Project', currentProject.name || 'N/A'],
            ['Client', currentProject.client || 'N/A'],
            ['Location', currentProject.location || 'N/A'],
            ['Project Type', currentProject.projectType || 'N/A'],
            ['Sector', SECTOR_LABELS[currentProject.sector]],
            ['Prepared By', currentProject.preparedBy || 'N/A'],
          ].map(([label, value]) => (
            <div key={label}>
              <span className="text-slate-500 text-xs">{label}</span>
              <p className="font-medium text-slate-800">{value}</p>
            </div>
          ))}
        </div>
        {currentProject.notes && (
          <div className="mt-3 pt-3 border-t">
            <span className="text-xs text-slate-500">Notes / Specifications:</span>
            <p className="text-sm text-slate-700 mt-0.5">{currentProject.notes}</p>
          </div>
        )}
      </div>

      {/* Sections */}
      <div className="px-6 py-5 space-y-6">
        {sections.map(section => (
          <div key={section.code}>
            <div className="flex items-center justify-between bg-slate-800 text-white px-4 py-2.5 rounded-t-lg">
              <span className="font-semibold text-sm">{section.title.toUpperCase()}</span>
              <span className="text-teal-300 text-sm font-bold">{formatKES(section.sectionTotal)}</span>
            </div>

            <div className="overflow-x-auto border border-t-0 rounded-b-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b">
                    <th className="text-left py-2 px-3 text-slate-600 w-14">Item</th>
                    <th className="text-left py-2 px-3 text-slate-600">Description</th>
                    <th className="text-right py-2 px-3 text-slate-600 w-16">Qty</th>
                    <th className="text-right py-2 px-3 text-slate-600 w-14">Unit</th>
                    <th className="text-right py-2 px-3 text-slate-600 w-24">Rate (KES)</th>
                    <th className="text-right py-2 px-3 text-slate-600 w-28">Amount (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, idx) => (
                    <tr key={item.id} className={`border-b last:border-b-2 last:border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                      <td className="py-2 px-3 text-slate-500">{section.code}.{idx + 1}</td>
                      <td className="py-2 px-3">
                        <p className="font-medium text-slate-800">{item.name}</p>
                        {item.description && item.description !== item.name && (
                          <p className="text-slate-400 mt-0.5">{item.description}</p>
                        )}
                        {item.rateAdjusted && (
                          <span className="text-amber-600 text-xs">(Rate adjusted from standard)</span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-right">{item.quantity.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right text-slate-500">{item.unit}</td>
                      <td className="py-2 px-3 text-right">{item.adjustedRate.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                      <td className="py-2 px-3 text-right font-medium">{item.total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                  <tr className="bg-teal-50 border-t border-teal-200">
                    <td colSpan={5} className="py-2.5 px-3 text-right font-bold text-sm text-teal-800">
                      SECTION {section.code} TOTAL
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-teal-800">
                      {section.sectionTotal.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Summary */}
        <div className="border-2 border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-800 text-white px-5 py-3">
            <h3 className="font-bold text-sm">SUMMARY OF COSTS</h3>
          </div>
          <div className="divide-y">
            <SummaryRow label="SUBTOTAL (Sum of All Sections)" value={totals.subtotal} />
            {sections.map(s => (
              <SummaryRow key={s.code} label={`  ${s.title}`} value={s.sectionTotal} muted />
            ))}
            <SummaryRow label={`Contingency Allowance (${currentProject.contingencyPercent}%)`} value={totals.contingency} highlight="amber" />
            <SummaryRow label={`Contractor's Profit & Overhead (${currentProject.profitMarginPercent}%)`} value={totals.profitMargin} highlight="indigo" />
            <SummaryRow label="BASE CONTRACT SUM" value={totals.baseContractSum} bold />
            <SummaryRow label={`Value Added Tax (VAT) @ ${vatPct}%`} value={totals.vat} highlight="rose" />
          </div>
          <div className="bg-teal-700 text-white flex justify-between px-5 py-4">
            <span className="font-bold text-lg">GRAND TOTAL (Inclusive of VAT)</span>
            <span className="font-bold text-xl">{formatKES(totals.grandTotal)}</span>
          </div>
        </div>

        {/* Signature Block */}
        <div className="border rounded-xl p-5 mt-6">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 pb-2 border-b">CERTIFICATION & SIGNATURES</h4>
          <div className="grid sm:grid-cols-2 gap-8">
            {[
              { role: 'Quantity Surveyor / Preparer', label: 'Reg. No. / Stamp:' },
              { role: 'Client / Employer Approval', label: 'Company Stamp:' },
            ].map(block => (
              <div key={block.role} className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">{block.role}</p>
                <div className="border-b border-dashed border-slate-300 pb-1 mb-1">
                  <p className="text-xs text-slate-400">Name: _______________________________</p>
                </div>
                <div className="border-b border-dashed border-slate-300 pb-1 mb-1">
                  <p className="text-xs text-slate-400">Signature: __________________________</p>
                </div>
                <div className="border-b border-dashed border-slate-300 pb-1 mb-1">
                  <p className="text-xs text-slate-400">Date: ________________  {block.label} ________</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 pt-3 border-t">
            This Bill of Quantities is prepared in accordance with standard Kenyan engineering practice.
            All rates are inclusive of material, labour, plant and all incidentals unless otherwise stated.
            Prices are in Kenya Shillings (KES) and are exclusive of VAT unless stated.
            VAT applied at {vatPct}% in accordance with the Kenya Revenue Authority current rate.
          </p>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({
  label, value, muted, highlight, bold
}: {
  label: string;
  value: number;
  muted?: boolean;
  highlight?: 'amber' | 'indigo' | 'rose';
  bold?: boolean;
}) {
  return (
    <div className={`flex justify-between px-5 py-2.5 ${bold ? 'bg-slate-100' : ''}`}>
      <span className={`text-sm ${muted ? 'text-slate-400' : bold ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{label}</span>
      <span className={`text-sm font-medium ${
        highlight === 'amber' ? 'text-amber-700' :
        highlight === 'indigo' ? 'text-indigo-700' :
        highlight === 'rose' ? 'text-rose-700' :
        bold ? 'font-bold text-slate-800' : 'text-slate-800'
      }`}>
        {formatKES(value)}
      </span>
    </div>
  );
}
