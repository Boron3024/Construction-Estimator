import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Package, Users, Wrench, BarChart2, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { useApp, formatKES, SECTOR_LABELS } from '../context/AppContext';

const COLORS = {
  materials: '#0f766e',
  labor: '#3b82f6',
  equipment: '#f59e0b',
  contingency: '#8b5cf6',
  vat: '#ef4444',
};

const PIE_COLORS = ['#0f766e', '#14b8a6', '#0ea5e9', '#6366f1', '#f59e0b', '#ef4444', '#84cc16', '#ec4899', '#f97316'];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { name: string } }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label || payload[0]?.payload?.name}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-slate-600">
          {p.name}: <span className="font-bold">{formatKES(p.value)}</span>
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold">{p?.payload?.name}</p>
      <p className="text-slate-600">{formatKES(p?.value ?? 0)}</p>
    </div>
  );
};

export function AnalyticsPage() {
  const { currentProject, getProjectTotals, getBoQSections } = useApp();
  const totals = getProjectTotals();
  const sections = getBoQSections();

  const categoryBreakdown = useMemo(() => {
    const mat = currentProject.items.filter(i => i.category === 'materials').reduce((s, i) => s + i.total, 0);
    const lab = currentProject.items.filter(i => i.category === 'labor').reduce((s, i) => s + i.total, 0);
    const eqp = currentProject.items.filter(i => i.category === 'equipment').reduce((s, i) => s + i.total, 0);
    return [
      { name: 'Materials', value: mat, color: COLORS.materials, icon: Package },
      { name: 'Labour', value: lab, color: COLORS.labor, icon: Users },
      { name: 'Equipment', value: eqp, color: COLORS.equipment, icon: Wrench },
    ].filter(d => d.value > 0);
  }, [currentProject.items]);

  const sectionBreakdown = useMemo(() =>
    sections.map(s => ({
      name: s.title.replace(/^[A-Z]+\.\s/, '').substring(0, 20),
      fullName: s.title,
      value: s.sectionTotal,
    })).filter(s => s.value > 0),
    [sections]
  );

  const costCompositionData = useMemo(() => {
    if (totals.grandTotal === 0) return [];
    return [
      { name: 'Base Works', value: totals.subtotal },
      { name: `Contingency (${currentProject.contingencyPercent}%)`, value: totals.contingency },
      { name: `Profit & OH (${currentProject.profitMarginPercent}%)`, value: totals.profitMargin },
      { name: 'VAT (16%)', value: totals.vat },
    ].filter(d => d.value > 0);
  }, [totals, currentProject]);

  const topItems = useMemo(() =>
    [...currentProject.items]
      .sort((a, b) => b.total - a.total)
      .slice(0, 8)
      .map(item => ({ name: item.name.substring(0, 22), value: item.total })),
    [currentProject.items]
  );

  const matTotal = categoryBreakdown.find(d => d.name === 'Materials')?.value || 0;
  const labTotal = categoryBreakdown.find(d => d.name === 'Labour')?.value || 0;
  const eqpTotal = categoryBreakdown.find(d => d.name === 'Equipment')?.value || 0;

  const labMaterialRatio = matTotal > 0 ? ((labTotal / matTotal) * 100).toFixed(0) : 0;

  const costPerUnit = useMemo(() => {
    if (!currentProject.projectArea || currentProject.projectArea === 0) return null;
    const unit = currentProject.sector === 'building' ? 'm²' : currentProject.sector === 'roads' ? 'km' : 'm';
    return { value: totals.grandTotal / currentProject.projectArea, unit };
  }, [totals.grandTotal, currentProject]);

  if (currentProject.items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-24 text-muted-foreground">
          <BarChart2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data to Analyse</h3>
          <p className="text-sm">Add items in the Estimator first to see analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-teal-600" />
          Cost Analytics
        </h2>
        <p className="text-sm text-slate-500">
          {currentProject.name || 'Current Project'} — {SECTOR_LABELS[currentProject.sector]}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Grand Total (incl. VAT)', value: formatKES(totals.grandTotal), sub: '', icon: TrendingUp, color: 'text-teal-700', bg: 'bg-teal-50 border-teal-200' },
          { label: 'Materials', value: formatKES(matTotal), sub: `${totals.subtotal > 0 ? ((matTotal / totals.subtotal) * 100).toFixed(0) : 0}% of works`, icon: Package, color: 'text-teal-600', bg: '' },
          { label: 'Labour', value: formatKES(labTotal), sub: `Labour:Material = ${labMaterialRatio}%`, icon: Users, color: 'text-blue-600', bg: '' },
          {
            label: costPerUnit ? `Cost per ${costPerUnit.unit}` : 'Equipment',
            value: costPerUnit ? formatKES(costPerUnit.value) : formatKES(eqpTotal),
            sub: costPerUnit ? `Based on ${currentProject.projectArea} ${costPerUnit.unit}` : '',
            icon: Layers, color: 'text-amber-600', bg: '',
          },
        ].map(kpi => (
          <Card key={kpi.label} className={`shadow-sm ${kpi.bg || 'border-slate-200'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
              <p className={`font-bold text-base mt-0.5 ${kpi.color}`}>{kpi.value}</p>
              {kpi.sub && <p className="text-xs text-slate-400 mt-0.5">{kpi.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Category Pie Chart */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cost by Category</CardTitle>
            <CardDescription className="text-xs">Materials vs Labour vs Equipment split</CardDescription>
          </CardHeader>
          <CardContent>
            {categoryBreakdown.length > 0 ? (
              <div className="space-y-3">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%" cy="50%"
                      outerRadius={85} innerRadius={40}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {categoryBreakdown.map(d => (
                    <div key={d.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-xs text-slate-600">{d.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold">{formatKES(d.value)}</span>
                        <span className="text-xs text-slate-400 ml-2">
                          {totals.subtotal > 0 ? ((d.value / totals.subtotal) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data</p>
            )}
          </CardContent>
        </Card>

        {/* Cost Composition */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cost Composition</CardTitle>
            <CardDescription className="text-xs">Contract price breakdown including additions</CardDescription>
          </CardHeader>
          <CardContent>
            {costCompositionData.length > 0 ? (
              <div className="space-y-3">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={costCompositionData}
                      cx="50%" cy="50%"
                      outerRadius={85} innerRadius={40}
                      dataKey="value"
                    >
                      {costCompositionData.map((_, index) => (
                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {costCompositionData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-slate-500 truncate">{d.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No data</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Section Cost Breakdown */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Cost by BoQ Section</CardTitle>
            <CardDescription className="text-xs">Expenditure per construction section</CardDescription>
          </CardHeader>
          <CardContent>
            {sectionBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={sectionBreakdown} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Amount (KES)" fill="#0f766e" radius={[0, 4, 4, 0]}>
                    {sectionBreakdown.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No section data</p>
            )}
          </CardContent>
        </Card>

        {/* Top Items */}
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Top Cost Items</CardTitle>
            <CardDescription className="text-xs">Highest value line items in estimate</CardDescription>
          </CardHeader>
          <CardContent>
            {topItems.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topItems} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => `${(v / 1000).toFixed(0)}K`} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Amount (KES)" fill="#14b8a6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No items</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Summary Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Section-wise Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b">
                  <th className="text-left py-2.5 px-4 text-xs text-slate-500 font-medium">Section</th>
                  <th className="text-right py-2.5 px-4 text-xs text-slate-500 font-medium">Items</th>
                  <th className="text-right py-2.5 px-4 text-xs text-slate-500 font-medium">Amount (KES)</th>
                  <th className="text-right py-2.5 px-4 text-xs text-slate-500 font-medium">% of Works</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((s, idx) => (
                  <tr key={s.code} className={`border-b last:border-0 ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="py-2.5 px-4 font-medium">{s.title}</td>
                    <td className="py-2.5 px-4 text-right text-slate-500">{s.items.length}</td>
                    <td className="py-2.5 px-4 text-right font-semibold">{formatKES(s.sectionTotal)}</td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-teal-500 rounded-full"
                            style={{ width: `${totals.subtotal > 0 ? (s.sectionTotal / totals.subtotal) * 100 : 0}%` }}
                          />
                        </div>
                        <span className="text-slate-600 w-10 text-right">
                          {totals.subtotal > 0 ? ((s.sectionTotal / totals.subtotal) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-teal-50 border-t-2 border-teal-200">
                  <td className="py-2.5 px-4 font-bold text-teal-800">TOTAL</td>
                  <td className="py-2.5 px-4 text-right font-medium text-teal-800">{currentProject.items.length}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-teal-800">{formatKES(totals.subtotal)}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-teal-800">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
