import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  HardHat,
  LayoutDashboard,
  Hammer,
  FileText,
  BarChart2,
  FolderOpen,
  Menu,
  X,
  Plus,
  Save,
  ChevronRight,
  Building2,
  Truck,
  Droplets,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useApp, SECTOR_LABELS } from '../context/AppContext';
import { toast } from 'sonner';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/estimator', label: 'Estimator', icon: Hammer },
  { to: '/boq', label: 'Bill of Quantities', icon: FileText },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/projects', label: 'Projects', icon: FolderOpen },
];

const sectorIcons = {
  building: Building2,
  roads: Truck,
  wash: Droplets,
};

const sectorBadgeClass = {
  building: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  roads: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  wash: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentProject, saveProject, newProject } = useApp();
  const navigate = useNavigate();

  const SectorIcon = sectorIcons[currentProject.sector];

  const handleSave = () => {
    if (!currentProject.name) {
      toast.error('Please enter a project name before saving');
      navigate('/estimator');
      return;
    }
    saveProject();
    toast.success('Project saved successfully!');
  };

  const handleNew = () => {
    if (window.confirm('Start a new project? Unsaved changes will be lost.')) {
      newProject();
      navigate('/estimator');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg">
            <HardHat className="h-16 w-16 text-white" />
          </div>
          <div>
            <h1 className="text-lg text-white font-semibold tracking-tight leading-tight">Construction Estimator</h1>
            <p className="text-teal-300/80 mt-0.5" style={{ fontSize: '11px' }}>Professional cost Estimation system for Kenya</p>
          </div>
        </div>
      </div>

      {/* Current Project */}
      <div className="px-4 py-4 border-b border-white/10">
        <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">Active Project</p>
        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <p className="text-white text-sm font-medium truncate">
            {currentProject.name || 'Untitled Project'}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <SectorIcon className="h-3 w-3 text-teal-300" />
            <span className={`text-xs px-2 py-0.5 rounded-full border ${sectorBadgeClass[currentProject.sector]}`}>
              {SECTOR_LABELS[currentProject.sector]}
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            {currentProject.items.length} item{currentProject.items.length !== 1 ? 's' : ''} added
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                isActive
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span>{label}</span>
                {isActive && <ChevronRight className="h-3 w-3 ml-auto text-teal-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Actions */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <Button
          onClick={handleSave}
          className="w-full bg-teal-600 hover:bg-teal-500 text-white border-0 h-9"
          size="sm"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Project
        </Button>
        <Button
          onClick={handleNew}
          variant="outline"
          className="w-full border-white/20 text-slate-300 hover:bg-white/10 hover:text-white h-9"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-slate-500" style={{ fontSize: '11px' }}>
          🇰🇪 Kenyan Construction Market Rates
        </p>
        <p className="text-slate-600" style={{ fontSize: '10px' }}>
          © 2026 Construction Estimator System | Developed by Brian Rono. All rights reserved.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col shrink-0 bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 border-r border-white/10">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 border-r border-white/10 z-10">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shrink-0 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-semibold text-slate-800 truncate">
                {currentProject.name || 'New Project'}
              </h2>
              {currentProject.client && (
                <span className="text-slate-400 text-sm hidden sm:inline">— {currentProject.client}</span>
              )}
              <Badge
                className={`text-xs hidden sm:inline-flex ${
                  currentProject.sector === 'building'
                    ? 'bg-teal-100 text-teal-700 border-teal-200'
                    : currentProject.sector === 'roads'
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200'
                }`}
              >
                {SECTOR_LABELS[currentProject.sector]}
              </Badge>
            </div>
            {currentProject.location && (
              <p className="text-xs text-slate-400">{currentProject.location}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 hidden md:inline">
              {currentProject.items.length} items
            </span>
            <Button size="sm" onClick={handleSave} className="bg-teal-600 hover:bg-teal-700 text-white h-8">
              <Save className="h-3 w-3 mr-1.5" />
              Save
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}