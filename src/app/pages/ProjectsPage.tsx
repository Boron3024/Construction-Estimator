import { useNavigate } from 'react-router';
import {
  FolderOpen,
  Trash2,
  ExternalLink,
  Building2,
  Truck,
  Droplets,
  Calendar,
  Package,
  TrendingUp,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useApp, formatKES, SECTOR_LABELS } from '../context/AppContext';
import { toast } from 'sonner';

const sectorConfig = {
  building: { icon: Building2, class: 'bg-teal-50 border-teal-200 text-teal-700', badge: 'bg-teal-100 text-teal-700 border-teal-200' },
  roads: { icon: Truck, class: 'bg-amber-50 border-amber-200 text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  wash: { icon: Droplets, class: 'bg-blue-50 border-blue-200 text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
};

export function ProjectsPage() {
  const { savedProjects, loadProject, deleteProject, newProject } = useApp();
  const navigate = useNavigate();

  const handleLoad = (id: string) => {
    loadProject(id);
    navigate('/estimator');
    toast.success('Project loaded');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name || 'Untitled Project'}"? This cannot be undone.`)) {
      deleteProject(id);
      toast.success('Project deleted');
    }
  };

  const handleNew = () => {
    newProject();
    navigate('/estimator');
  };

  if (savedProjects.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-24 text-muted-foreground">
          <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Saved Projects</h3>
          <p className="text-sm mb-6">
            Save your estimates using the "Save Project" button in the sidebar or header.
          </p>
          <Button onClick={handleNew} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Start New Project
          </Button>
        </div>
      </div>
    );
  }

  const totalSavedValue = savedProjects.reduce((sum, p) => {
    const subtotal = p.items.reduce((s, i) => s + i.total, 0);
    const contingency = subtotal * (p.contingencyPercent / 100);
    const profit = subtotal * (p.profitMarginPercent / 100);
    const base = subtotal + contingency + profit;
    return sum + base * 1.16;
  }, 0);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-teal-600" />
            Saved Projects
          </h2>
          <p className="text-sm text-slate-500">
            {savedProjects.length} project{savedProjects.length !== 1 ? 's' : ''} saved locally
          </p>
        </div>
        <Button onClick={handleNew} size="sm" className="bg-teal-600 hover:bg-teal-700 h-9">
          <Plus className="h-4 w-4 mr-1.5" />
          New Project
        </Button>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Projects</p>
            <p className="text-2xl font-bold text-teal-700">{savedProjects.length}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Total Portfolio Value</p>
            <p className="text-base font-bold text-slate-800">{formatKES(totalSavedValue)}</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground">Avg Project Value</p>
            <p className="text-base font-bold text-slate-800">
              {savedProjects.length > 0 ? formatKES(totalSavedValue / savedProjects.length) : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Supabase Note */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-amber-800">Projects stored locally</p>
          <p className="text-amber-700 text-xs mt-0.5">
            Projects are saved in your browser's local storage. Connect Supabase to store projects in the cloud,
            enable team collaboration, and access historical project analytics across devices.
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...savedProjects].reverse().map(project => {
          const cfg = sectorConfig[project.sector];
          const SIcon = cfg.icon;
          const subtotal = project.items.reduce((s, i) => s + i.total, 0);
          const contingency = subtotal * (project.contingencyPercent / 100);
          const profit = subtotal * (project.profitMarginPercent / 100);
          const grandTotal = (subtotal + contingency + profit) * 1.16;
          const createdDate = new Date(project.createdAt).toLocaleDateString('en-KE', {
            day: 'numeric', month: 'short', year: 'numeric',
          });
          const matCount = project.items.filter(i => i.category === 'materials').length;
          const labCount = project.items.filter(i => i.category === 'labor').length;
          const eqpCount = project.items.filter(i => i.category === 'equipment').length;

          return (
            <Card key={project.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className={`pb-3 rounded-t-lg border-b ${cfg.class} border`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center">
                      <SIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold leading-tight line-clamp-1">
                        {project.name || 'Untitled Project'}
                      </CardTitle>
                      {project.client && (
                        <p className="text-xs opacity-70 mt-0.5">{project.client}</p>
                      )}
                    </div>
                  </div>
                  <Badge className={`text-xs shrink-0 ${cfg.badge}`}>
                    {SECTOR_LABELS[project.sector]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {/* Location & Date */}
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{project.location || 'No location'}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{createdDate}</span>
                  </div>
                </div>

                {/* Item counts */}
                <div className="flex gap-3 text-xs">
                  <div className="flex items-center gap-1 text-teal-600">
                    <Package className="h-3 w-3" />
                    <span>{matCount} mat.</span>
                  </div>
                  <div className="flex items-center gap-1 text-blue-600">
                    <span>👷 {labCount} lab.</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-600">
                    <span>🔧 {eqpCount} eqp.</span>
                  </div>
                </div>

                {/* Grand Total */}
                <div className="bg-slate-50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500">Grand Total (incl. VAT)</p>
                    <p className="font-bold text-teal-700">{formatKES(grandTotal)}</p>
                  </div>
                  <TrendingUp className="h-5 w-5 text-teal-400" />
                </div>

                {/* Margins info */}
                <div className="flex gap-2 text-xs text-slate-400">
                  <span>Cont. {project.contingencyPercent}%</span>
                  <span>·</span>
                  <span>Profit {project.profitMarginPercent}%</span>
                  <span>·</span>
                  <span>VAT 16%</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    className="flex-1 h-8 bg-teal-600 hover:bg-teal-700 text-xs"
                    onClick={() => handleLoad(project.id)}
                  >
                    <ExternalLink className="h-3 w-3 mr-1.5" />
                    Open Project
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 px-2.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                    onClick={() => handleDelete(project.id, project.name)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
