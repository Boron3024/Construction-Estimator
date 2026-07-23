import { useNavigate } from 'react-router';
import {
  Hammer,
  FileText,
  BarChart2,
  FolderOpen,
  TrendingUp,
  Package,
  Users,
  Wrench,
  ArrowRight,
  Building2,
  Truck,
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp, formatKES, SECTOR_LABELS } from '../context/AppContext';

const sectorConfig = {
  building: { icon: Building2, color: 'teal', bgClass: 'bg-teal-50 border-teal-200', iconClass: 'text-teal-600', label: 'Building Structures' },
  roads: { icon: Truck, color: 'amber', bgClass: 'bg-amber-50 border-amber-200', iconClass: 'text-amber-600', label: 'Roads & Transportation' },
  wash: { icon: Droplets, color: 'blue', bgClass: 'bg-blue-50 border-blue-200', iconClass: 'text-blue-600', label: 'WASH' },
};

export function Dashboard() {
  const navigate = useNavigate();
  const { currentProject, savedProjects, getProjectTotals, loadProject } = useApp();
  const totals = getProjectTotals();
  const cfg = sectorConfig[currentProject.sector];
  const SectorIcon = cfg.icon;

  const matCount = currentProject.items.filter(i => i.category === 'materials').length;
  const labCount = currentProject.items.filter(i => i.category === 'labor').length;
  const eqpCount = currentProject.items.filter(i => i.category === 'equipment').length;

  const getHealthStatus = () => {
    if (currentProject.items.length === 0) return null;
    if (totals.grandTotal > 50000000) return { status: 'warning', msg: 'Very large project – verify quantities' };
    if (labCount === 0) return { status: 'warning', msg: 'No labour costs added yet' };
    if (matCount === 0) return { status: 'warning', msg: 'No material costs added yet' };
    return { status: 'ok', msg: 'Estimate looks complete' };
  };

  const health = getHealthStatus();

  const quickActions = [
    { label: 'Add Items', desc: 'Add materials, labour & equipment', icon: Hammer, path: '/estimator', color: 'bg-teal-600 hover:bg-teal-700' },
    { label: 'View BoQ', desc: 'Professional Bill of Quantities', icon: FileText, path: '/boq', color: 'bg-slate-700 hover:bg-slate-800' },
    { label: 'Analytics', desc: 'Cost breakdown charts', icon: BarChart2, path: '/analytics', color: 'bg-indigo-600 hover:bg-indigo-700' },
    { label: 'Projects', desc: 'All saved estimates', icon: FolderOpen, path: '/projects', color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 text-white p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-teal-400 blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-cyan-400 blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="text-teal-300 text-sm mb-1">Welcome · Construction Estimator </p>
              <h2 className="text-2xl font-semibold text-white">
                {currentProject.name || 'Start a New Estimate'}
              </h2>
              {currentProject.client && (
                <p className="text-slate-300 text-sm mt-1">Client: {currentProject.client}</p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${
                  currentProject.sector === 'building' ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                    : currentProject.sector === 'roads' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                }`}>
                  <SectorIcon className="h-3.5 w-3.5" />
                  {SECTOR_LABELS[currentProject.sector]}
                </span>
                {currentProject.location && (
                  <span className="text-slate-400 text-xs">{currentProject.location}</span>
                )}
              </div>
            </div>
            {currentProject.items.length > 0 && (
              <div className="bg-white/10 rounded-xl p-4 border border-white/20 min-w-[200px]">
                <p className="text-slate-300 text-xs mb-1">Grand Total (incl. VAT)</p>
                <p className="text-2xl font-bold text-white">{formatKES(totals.grandTotal)}</p>
                <p className="text-teal-300 text-xs mt-1">{currentProject.items.length} line items</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Health Check */}
      {health && (
        <div className={`flex items-center gap-3 p-4 rounded-xl border ${
          health.status === 'ok'
            ? 'bg-teal-50 border-teal-200 text-teal-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          {health.status === 'ok'
            ? <CheckCircle className="h-5 w-5 text-teal-600 shrink-0" />
            : <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />}
          <p className="text-sm font-medium">{health.msg}</p>
        </div>
      )}

      {/* KPI Cards */}
      {currentProject.items.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Subtotal (ex-tax)', value: formatKES(totals.subtotal), icon: TrendingUp, color: 'text-slate-600' },
            { label: 'Contingency', value: formatKES(totals.contingency), sub: `${currentProject.contingencyPercent}%`, icon: Clock, color: 'text-amber-600' },
            { label: 'VAT (16%)', value: formatKES(totals.vat), icon: Package, color: 'text-indigo-600' },
            { label: 'Grand Total', value: formatKES(totals.grandTotal), icon: TrendingUp, color: 'text-teal-600', highlight: true },
          ].map(kpi => (
            <Card key={kpi.label} className={`shadow-sm ${kpi.highlight ? 'border-teal-300 bg-teal-50' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    {kpi.sub && <p className="text-xs text-muted-foreground">{kpi.sub}</p>}
                    <p className={`text-base font-bold mt-1 ${kpi.highlight ? 'text-teal-700' : ''}`}>{kpi.value}</p>
                  </div>
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Item Breakdown */}
      {currentProject.items.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Materials', count: matCount, icon: Package, color: 'text-teal-600', bg: 'bg-teal-50' },
            { label: 'Labour', count: labCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Equipment', count: eqpCount, icon: Wrench, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(item => (
            <Card key={item.label} className="shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`w-10 h-10 ${item.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label} items</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="font-semibold text-slate-700 mb-3">Quick Actions</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`${action.color} text-white rounded-xl p-4 text-left transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`}
            >
              <action.icon className="h-6 w-6 mb-3 opacity-90" />
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Sector Modules */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Sector Modules Available</CardTitle>
          <CardDescription>Switch sectors in your project details on the Estimator page</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {Object.entries(sectorConfig).map(([key, cfg]) => {
              const SIcon = cfg.icon;
              const isActive = currentProject.sector === key;
              return (
                <div key={key} className={`p-4 rounded-xl border-2 transition-all ${
                  isActive ? `${cfg.bgClass} shadow-sm` : 'border-slate-200 bg-white'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <SIcon className={`h-5 w-5 ${isActive ? cfg.iconClass : 'text-slate-400'}`} />
                    <span className={`text-sm font-medium ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{cfg.label}</span>
                    {isActive && <Badge className="ml-auto text-xs bg-teal-100 text-teal-700">Active</Badge>}
                  </div>
                  <p className="text-xs text-slate-400">
                    {key === 'building' && 'Residential, commercial buildings, finishes'}
                    {key === 'roads' && 'Roads, pavements, drainage, furniture'}
                    {key === 'wash' && 'Water supply, sanitation, drainage systems'}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Saved Projects */}
      {savedProjects.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Recent Projects</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/projects')} className="text-teal-600">
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedProjects.slice(0, 3).map(proj => {
                const projTotals = proj.items.reduce((s, i) => s + i.total, 0);
                const pCfg = sectorConfig[proj.sector];
                const PIco = pCfg.icon;
                return (
                  <div
                    key={proj.id}
                    onClick={() => { loadProject(proj.id); navigate('/estimator'); }}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${pCfg.bgClass} flex items-center justify-center shrink-0`}>
                      <PIco className={`h-4 w-4 ${pCfg.iconClass}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{proj.name || 'Untitled'}</p>
                      <p className="text-xs text-slate-400 truncate">{proj.client || 'No client'} · {proj.location}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-teal-700">{formatKES(projTotals)}</p>
                      <p className="text-xs text-slate-400">{proj.items.length} items</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
