import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Package,
  Users,
  Wrench,
  AlertCircle,
  Info,
  Pencil,
  Check,
  X,
  Building2,
  Truck,
  Droplets,
  Calculator,
  Settings2,
  PlusCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { useApp, formatKES, SECTOR_LABELS, ItemCategory, EstimateItem } from '../context/AppContext';
import { SectorType, BOQ_SECTIONS, RATE_DATABASE, RateItem } from '../data/kenyanRates';
import { toast } from 'sonner';

const CATEGORY_TABS: { key: ItemCategory; label: string; icon: typeof Package }[] = [
  { key: 'materials', label: 'Materials', icon: Package },
  { key: 'labor', label: 'Labour', icon: Users },
  { key: 'equipment', label: 'Equipment', icon: Wrench },
];

const SECTOR_TABS = [
  { key: 'building' as SectorType, label: 'Building', icon: Building2 },
  { key: 'roads' as SectorType, label: 'Roads', icon: Truck },
  { key: 'wash' as SectorType, label: 'WASH', icon: Droplets },
];

const PROJECT_TYPES: Record<SectorType, string[]> = {
  building: ['Residential (Single Unit)', 'Residential (Multi-Unit)', 'Commercial', 'Industrial', 'Institutional', 'Mixed-Use'],
  roads: ['Urban Road', 'Rural Road', 'Highway', 'Access Road', 'Parking Area', 'Footpath'],
  wash: ['Water Reticulation', 'Borehole & Pumping', 'Sanitation Block', 'Sewerage System', 'Storm Drainage', 'Community Standpipes'],
};

interface EditingItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  adjustedRate: number;
  boqSectionCode: string;
  boqSectionTitle: string;
}

const NEW_SECTION_SENTINEL = '__new__';

export function EstimatorPage() {
  const { currentProject, addItem, removeItem, updateItem, updateProject, clearItems, getProjectTotals } = useApp();

  // Form state
  const [category, setCategory] = useState<ItemCategory>('materials');
  const [selectedSection, setSelectedSection] = useState('');
  const [useCustomSection, setUseCustomSection] = useState(false);
  const [customSectionCode, setCustomSectionCode] = useState('');
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [adjustedRate, setAdjustedRate] = useState('');
  const [description, setDescription] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customUnit, setCustomUnit] = useState('');
  const [customRate, setCustomRate] = useState('');
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);

  const sector = currentProject.sector;

  const filteredItems = useMemo<RateItem[]>(() => {
    if (category === 'materials') {
      return RATE_DATABASE.filter(
        item => item.category === 'materials' && item.sectors.includes(sector) &&
          (selectedSection === 'all' || !selectedSection || item.defaultSection === selectedSection)
      );
    }
    return RATE_DATABASE.filter(
      item => item.category === category && item.sectors.includes(sector)
    );
  }, [category, sector, selectedSection]);

  const selectedRateItem = useMemo(
    () => RATE_DATABASE.find(i => i.id === selectedItemId) || null,
    [selectedItemId]
  );

  const handleItemSelect = (id: string) => {
    setSelectedItemId(id);
    const item = RATE_DATABASE.find(i => i.id === id);
    if (item) setAdjustedRate(item.rate.toString());
  };

  const handleSectorChange = (s: SectorType) => {
    updateProject({ sector: s, projectType: PROJECT_TYPES[s][0] });
    setSelectedSection('');
    setUseCustomSection(false);
    setCustomSectionCode('');
    setCustomSectionTitle('');
    setSelectedItemId('');
    setAdjustedRate('');
    clearItems();
    toast.info(`Switched to ${SECTOR_LABELS[s]} sector. Items cleared.`);
  };

  const handleSectionChange = (v: string) => {
    if (v === NEW_SECTION_SENTINEL) {
      setUseCustomSection(true);
      setSelectedSection('');
      setCustomSectionCode('');
      setCustomSectionTitle('');
    } else {
      setUseCustomSection(false);
      setSelectedSection(v);
    }
    setSelectedItemId('');
    setAdjustedRate('');
  };

  const resolvedSectionCode = (): string => {
    if (useCustomSection) return customSectionCode.toUpperCase() || 'X';
    return selectedSection && selectedSection !== 'all' ? selectedSection : 'A';
  };

  const resolvedSectionTitle = (): string => {
    if (useCustomSection) {
      const code = customSectionCode.toUpperCase() || 'X';
      return customSectionTitle ? `${code}. ${customSectionTitle}` : code;
    }
    const sec = BOQ_SECTIONS[sector]?.find(s => s.code === resolvedSectionCode());
    return sec ? `${sec.code}. ${sec.title}` : resolvedSectionCode();
  };

  const isQtyWarning = () => {
    if (!selectedRateItem || !quantity) return false;
    const q = parseFloat(quantity);
    if (selectedRateItem.maxQty && q > selectedRateItem.maxQty) return true;
    if (selectedRateItem.minQty && q < selectedRateItem.minQty) return true;
    return false;
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) { toast.error('Please enter a valid quantity'); return; }

    if (isCustom) {
      if (!customName || !customUnit || !customRate) { toast.error('Please fill all custom item fields'); return; }
      if (useCustomSection && (!customSectionCode || !customSectionTitle)) {
        toast.error('Please enter both section code and title'); return;
      }
      const rate = parseFloat(customRate);
      const sCode = category === 'materials' ? resolvedSectionCode() : category === 'labor' ? 'LAB' : 'EQP';
      const sTitle = category === 'materials' ? resolvedSectionTitle() : category === 'labor' ? 'Labour' : 'Equipment';
      addItem({
        name: customName,
        description,
        quantity: qty,
        unit: customUnit,
        baseRate: rate,
        adjustedRate: rate,
        total: qty * rate,
        category,
        sector,
        boqSectionCode: sCode,
        boqSectionTitle: sTitle,
        isCustom: true,
        rateAdjusted: false,
      });
      setCustomName(''); setCustomUnit(''); setCustomRate('');
    } else {
      if (!selectedRateItem) { toast.error('Please select an item'); return; }
      const rate = parseFloat(adjustedRate) || selectedRateItem.rate;
      const sCode = category === 'materials'
        ? (useCustomSection ? resolvedSectionCode() : selectedRateItem.defaultSection)
        : category === 'labor' ? 'LAB' : 'EQP';
      const sTitle = category === 'materials'
        ? (useCustomSection ? resolvedSectionTitle() : (() => {
            const sec = BOQ_SECTIONS[sector]?.find(s => s.code === selectedRateItem.defaultSection);
            return sec ? `${sec.code}. ${sec.title}` : selectedRateItem.defaultSection;
          })())
        : category === 'labor' ? 'Labour' : 'Equipment';
      addItem({
        name: selectedRateItem.name,
        description: description || selectedRateItem.description,
        quantity: qty,
        unit: selectedRateItem.unit,
        baseRate: selectedRateItem.rate,
        adjustedRate: rate,
        total: qty * rate,
        category,
        sector,
        boqSectionCode: sCode,
        boqSectionTitle: sTitle,
        isCustom: false,
        rateAdjusted: rate !== selectedRateItem.rate,
      });
    }

    setQuantity('');
    setDescription('');
    setSelectedItemId('');
    setAdjustedRate('');
    toast.success('Item added to estimate');
  };

  const handleSaveEdit = (id: string) => {
    if (!editingItem) return;
    const item = currentProject.items.find(i => i.id === id);
    if (!item) return;
    const sTitle = editingItem.boqSectionTitle || editingItem.boqSectionCode;
    updateItem(id, {
      name: editingItem.name,
      description: editingItem.description,
      quantity: editingItem.quantity,
      unit: editingItem.unit,
      adjustedRate: editingItem.adjustedRate,
      total: editingItem.quantity * editingItem.adjustedRate,
      boqSectionCode: editingItem.boqSectionCode,
      boqSectionTitle: sTitle,
      rateAdjusted: editingItem.adjustedRate !== item.baseRate,
    });
    setEditingItem(null);
    toast.success('Item updated');
  };

  const totals = getProjectTotals();

  const groupedItems = useMemo(() => {
    const groups: Record<string, EstimateItem[]> = {};
    currentProject.items.forEach(item => {
      const key = item.boqSectionCode;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [currentProject.items]);

  const sectionTotals = useMemo(() => {
    const totalsMap: Record<string, number> = {};
    Object.entries(groupedItems).forEach(([key, items]) => {
      totalsMap[key] = items.reduce((s, i) => s + i.total, 0);
    });
    return totalsMap;
  }, [groupedItems]);

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* ===== LEFT PANEL ===== */}
        <div className="lg:col-span-2 space-y-4">
          {/* Project Details */}
          <Card className="shadow-sm border-t-2 border-t-teal-500">
            <CardHeader className="pb-3 bg-gradient-to-r from-teal-50 to-cyan-50">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4 text-teal-600" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Sector</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {SECTOR_TABS.map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => handleSectorChange(key)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all ${
                        sector === key
                          ? key === 'building' ? 'bg-teal-50 border-teal-400 text-teal-700'
                            : key === 'roads' ? 'bg-amber-50 border-amber-400 text-amber-700'
                            : 'bg-blue-50 border-blue-400 text-blue-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pname">Project Name</Label>
                <Input id="pname" value={currentProject.name} onChange={e => updateProject({ name: e.target.value })} placeholder="e.g., 3-Bedroom House, Nairobi" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" value={currentProject.client} onChange={e => updateProject({ client: e.target.value })} placeholder="Client name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={currentProject.location} onChange={e => updateProject({ location: e.target.value })} placeholder="e.g., Nairobi" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="refno">Reference No.</Label>
                  <Input id="refno" value={currentProject.referenceNo ?? ''} onChange={e => updateProject({ referenceNo: e.target.value })} placeholder="e.g., BOQ-2025-001" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pdate">Project Date</Label>
                  <Input id="pdate" type="date" value={currentProject.projectDate ?? ''} onChange={e => updateProject({ projectDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="prepby">Prepared By</Label>
                <Input id="prepby" value={currentProject.preparedBy ?? ''} onChange={e => updateProject({ preparedBy: e.target.value })} placeholder="Quantity Surveyor / Engineer name" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ptype">
                  Project Type
                  <span className="ml-1 text-xs text-slate-400 font-normal">(type freely or pick a preset)</span>
                </Label>
                <datalist id="project-type-list">
                  {PROJECT_TYPES[sector].map(t => <option key={t} value={t} />)}
                </datalist>
                <Input
                  id="ptype"
                  list="project-type-list"
                  value={currentProject.projectType}
                  onChange={e => updateProject({ projectType: e.target.value })}
                  placeholder="Type or select project type..."
                />
              </div>
              {(sector === 'building' || sector === 'roads' || sector === 'wash') && (
                <div className="space-y-1.5">
                  <Label>
                    {sector === 'building' ? 'Floor Area (m²)' : sector === 'roads' ? 'Road Length (km)' : 'Pipeline Length (m)'}
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={currentProject.projectArea || ''}
                    onChange={e => updateProject({ projectArea: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <Label>Notes / Specifications</Label>
                <Textarea rows={2} value={currentProject.notes} onChange={e => updateProject({ notes: e.target.value })} placeholder="Add specifications or notes..." />
              </div>

              <div className="border-t pt-3 space-y-3">
                <p className="text-xs font-medium text-slate-600">Contract Additions & Tax</p>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Contingency</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number" min="0" max="20" step="1"
                        value={currentProject.contingencyPercent}
                        onChange={e => updateProject({ contingencyPercent: Math.min(20, Math.max(0, parseFloat(e.target.value) || 0)) })}
                        className="h-6 w-14 text-xs text-right px-1 text-amber-600 font-medium"
                      />
                      <span className="text-xs text-amber-600">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[currentProject.contingencyPercent]}
                    onValueChange={([v]) => updateProject({ contingencyPercent: v })}
                    min={0} max={20} step={1}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">Contractor's Profit & OH</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number" min="0" max="30" step="1"
                        value={currentProject.profitMarginPercent}
                        onChange={e => updateProject({ profitMarginPercent: Math.min(30, Math.max(0, parseFloat(e.target.value) || 0)) })}
                        className="h-6 w-14 text-xs text-right px-1 text-indigo-600 font-medium"
                      />
                      <span className="text-xs text-indigo-600">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[currentProject.profitMarginPercent]}
                    onValueChange={([v]) => updateProject({ profitMarginPercent: v })}
                    min={0} max={30} step={1}
                    className="cursor-pointer"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-xs">VAT Rate</Label>
                    <div className="flex items-center gap-1">
                      <Input
                        type="number" min="0" max="50" step="0.5"
                        value={currentProject.vatPercent ?? 16}
                        onChange={e => updateProject({ vatPercent: Math.min(50, Math.max(0, parseFloat(e.target.value) || 0)) })}
                        className="h-6 w-14 text-xs text-right px-1 text-rose-600 font-medium"
                      />
                      <span className="text-xs text-rose-600">%</span>
                    </div>
                  </div>
                  <Slider
                    value={[currentProject.vatPercent ?? 16]}
                    onValueChange={([v]) => updateProject({ vatPercent: v })}
                    min={0} max={30} step={0.5}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-slate-400">Kenya standard VAT is 16%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Add Item Form */}
          <Card className="shadow-sm border-t-2 border-t-primary">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary/5 to-accent/5">
              <CardTitle className="text-base flex items-center gap-2">
                <Plus className="h-4 w-4 text-primary" />
                Add Item to Estimate
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleAddItem} className="space-y-3">
                {/* Category Tabs */}
                <div>
                  <Label className="text-xs text-slate-500 mb-1 block">Category</Label>
                  <div className="flex rounded-lg border overflow-hidden">
                    {CATEGORY_TABS.map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setCategory(key);
                          setSelectedItemId('');
                          setSelectedSection('');
                          setUseCustomSection(false);
                          setCustomSectionCode('');
                          setCustomSectionTitle('');
                          setAdjustedRate('');
                          setIsCustom(false);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${
                          category === key ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Item Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Custom item</span>
                  <button
                    type="button"
                    onClick={() => setIsCustom(v => !v)}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isCustom ? 'bg-primary' : 'bg-slate-200'}`}
                  >
                    <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isCustom ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* BoQ Section — shown for materials in both modes */}
                {category === 'materials' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <Label>BoQ Section</Label>
                      {useCustomSection && (
                        <button
                          type="button"
                          className="text-xs text-slate-400 hover:text-slate-600 underline"
                          onClick={() => { setUseCustomSection(false); setCustomSectionCode(''); setCustomSectionTitle(''); }}
                        >
                          Use preset
                        </button>
                      )}
                    </div>

                    {!useCustomSection ? (
                      <Select
                        value={selectedSection || 'all'}
                        onValueChange={handleSectionChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All sections" />
                        </SelectTrigger>
                        <SelectContent>
                          {!isCustom && <SelectItem value="all">All Sections</SelectItem>}
                          {BOQ_SECTIONS[sector].map(s => (
                            <SelectItem key={s.code} value={s.code}>{s.code}. {s.title}</SelectItem>
                          ))}
                          <SelectItem value={NEW_SECTION_SENTINEL}>
                            <span className="flex items-center gap-1.5 text-teal-600 font-medium">
                              <PlusCircle className="h-3.5 w-3.5" />
                              Add new section…
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="grid grid-cols-5 gap-2">
                        <div className="col-span-2">
                          <Input
                            value={customSectionCode}
                            onChange={e => setCustomSectionCode(e.target.value.toUpperCase())}
                            placeholder="Code e.g. M"
                            className="uppercase"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            value={customSectionTitle}
                            onChange={e => setCustomSectionTitle(e.target.value)}
                            placeholder="Section title"
                          />
                        </div>
                        {customSectionCode && customSectionTitle && (
                          <div className="col-span-5">
                            <p className="text-xs text-teal-600 bg-teal-50 border border-teal-200 px-2 py-1 rounded">
                              Will create: <strong>{customSectionCode.toUpperCase()}. {customSectionTitle}</strong>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {!isCustom ? (
                  <>
                    {/* Item Select */}
                    <div className="space-y-1.5">
                      <Label>Item</Label>
                      <Select value={selectedItemId} onValueChange={handleItemSelect}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select item..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-64">
                          {filteredItems.length === 0 && (
                            <div className="p-3 text-sm text-muted-foreground text-center">No items for this filter</div>
                          )}
                          {filteredItems.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                              <div>
                                <span className="block text-sm">{item.name}</span>
                                <span className="block text-xs text-muted-foreground">
                                  {formatKES(item.rate)} / {item.unit}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Quantity + Rate — always show if item selected */}
                    {selectedRateItem && (
                      <>
                        <div className="space-y-1.5">
                          <Label>Quantity ({selectedRateItem.unit})</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={quantity}
                            onChange={e => setQuantity(e.target.value)}
                            placeholder={`Enter ${selectedRateItem.unit}`}
                          />
                          {selectedRateItem.quantityHint && (
                            <p className="text-xs text-blue-600 flex items-start gap-1">
                              <Info className="h-3 w-3 shrink-0 mt-0.5" />
                              {selectedRateItem.quantityHint}
                            </p>
                          )}
                          {isQtyWarning() && (
                            <p className="text-xs text-amber-600 flex items-start gap-1">
                              <AlertCircle className="h-3 w-3 shrink-0 mt-0.5" />
                              Quantity seems unusual – please verify
                            </p>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <Label>Rate (KES / {selectedRateItem.unit})</Label>
                            {parseFloat(adjustedRate) !== selectedRateItem.rate && adjustedRate && (
                              <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Adjusted</Badge>
                            )}
                          </div>
                          <Input
                            type="number"
                            step="0.01"
                            value={adjustedRate}
                            onChange={e => setAdjustedRate(e.target.value)}
                          />
                          <p className="text-xs text-slate-400">
                            Standard rate: {formatKES(selectedRateItem.rate)}
                            {parseFloat(adjustedRate) !== selectedRateItem.rate && adjustedRate && (
                              <button
                                type="button"
                                className="ml-2 text-teal-600 hover:underline"
                                onClick={() => setAdjustedRate(selectedRateItem.rate.toString())}
                              >
                                Reset
                              </button>
                            )}
                          </p>
                        </div>

                        {quantity && adjustedRate && (
                          <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-teal-700">Line Subtotal:</span>
                              <span className="font-bold text-teal-700">
                                {formatKES(parseFloat(quantity) * parseFloat(adjustedRate))}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  /* Custom Item Fields */
                  <div className="space-y-2.5">
                    <div className="space-y-1.5">
                      <Label>Item Name</Label>
                      <Input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="Item description" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1.5">
                        <Label>Unit</Label>
                        <Input value={customUnit} onChange={e => setCustomUnit(e.target.value)} placeholder="m³, bags, days..." />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Rate (KES)</Label>
                        <Input type="number" value={customRate} onChange={e => setCustomRate(e.target.value)} placeholder="0" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Quantity</Label>
                      <Input type="number" step="0.01" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" />
                    </div>
                    {quantity && customRate && (
                      <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-teal-700">Subtotal:</span>
                          <span className="font-bold text-teal-700">{formatKES(parseFloat(quantity) * parseFloat(customRate))}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                <div className="space-y-1.5">
                  <Label>Notes / Spec (optional)</Label>
                  <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Additional specification..." />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Estimate
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* ===== RIGHT PANEL: ITEMS TABLE ===== */}
        <div className="lg:col-span-3 space-y-4">
          {currentProject.items.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Subtotal', val: totals.subtotal, color: 'text-slate-700' },
                { label: `Contingency (${currentProject.contingencyPercent}%)`, val: totals.contingency, color: 'text-amber-600' },
                { label: `VAT (${currentProject.vatPercent ?? 16}%)`, val: totals.vat, color: 'text-indigo-600' },
                { label: 'Grand Total', val: totals.grandTotal, color: 'text-teal-700', bold: true },
              ].map(s => (
                <Card key={s.label} className={`shadow-sm ${s.bold ? 'border-teal-300 bg-teal-50' : ''}`}>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className={`text-sm font-bold mt-0.5 ${s.color}`}>{formatKES(s.val)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  Estimate Items
                  {currentProject.items.length > 0 && (
                    <Badge variant="secondary">{currentProject.items.length}</Badge>
                  )}
                </CardTitle>
                {currentProject.items.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { if (window.confirm('Remove all items?')) { clearItems(); toast.info('All items cleared'); } }}
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 h-7 text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {currentProject.items.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No items yet</p>
                  <p className="text-sm">Use the form on the left to add materials, labour and equipment.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {Object.entries(groupedItems).map(([sectionCode, items]) => {
                    const sTitle = items[0]?.boqSectionTitle || sectionCode;
                    return (
                      <div key={sectionCode}>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-md">{sTitle}</h4>
                          <span className="text-sm font-bold text-teal-700">{formatKES(sectionTotals[sectionCode] || 0)}</span>
                        </div>
                        <div className="overflow-x-auto rounded-lg border">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-slate-50 border-b">
                                <th className="text-left py-2 px-3 text-xs text-slate-500 font-medium">Description</th>
                                <th className="text-right py-2 px-3 text-xs text-slate-500 font-medium">Qty</th>
                                <th className="text-right py-2 px-3 text-xs text-slate-500 font-medium">Unit</th>
                                <th className="text-right py-2 px-3 text-xs text-slate-500 font-medium">Rate (KES)</th>
                                <th className="text-right py-2 px-3 text-xs text-slate-500 font-medium">Amount (KES)</th>
                                <th className="py-2 px-2"></th>
                              </tr>
                            </thead>
                            <tbody>
                              {items.map((item, idx) => (
                                <tr key={item.id} className={`border-b last:border-0 group ${idx % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                                  {editingItem?.id === item.id ? (
                                    <>
                                      <td className="py-2 px-3 space-y-1.5" colSpan={1}>
                                        {/* Name */}
                                        <Input
                                          value={editingItem.name}
                                          onChange={e => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                                          className="h-7 text-xs font-medium"
                                          placeholder="Item name"
                                        />
                                        {/* Description */}
                                        <Input
                                          value={editingItem.description}
                                          onChange={e => setEditingItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                                          className="h-6 text-xs text-slate-500"
                                          placeholder="Notes / spec"
                                        />
                                        {/* BoQ Section */}
                                        {item.category === 'materials' && (
                                          <div className="grid grid-cols-5 gap-1">
                                            <Input
                                              value={editingItem.boqSectionCode}
                                              onChange={e => setEditingItem(prev => prev ? { ...prev, boqSectionCode: e.target.value.toUpperCase() } : null)}
                                              className="h-6 text-xs col-span-2 uppercase"
                                              placeholder="Code"
                                            />
                                            <Input
                                              value={editingItem.boqSectionTitle.replace(/^[^.]+\.\s*/, '')}
                                              onChange={e => setEditingItem(prev => prev
                                                ? { ...prev, boqSectionTitle: `${prev.boqSectionCode}. ${e.target.value}` }
                                                : null)}
                                              className="h-6 text-xs col-span-3"
                                              placeholder="Section title"
                                            />
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 align-top">
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={editingItem.quantity}
                                          onChange={e => setEditingItem(prev => prev ? { ...prev, quantity: parseFloat(e.target.value) || 0 } : null)}
                                          className="h-7 w-20 text-right text-xs"
                                        />
                                      </td>
                                      <td className="py-2 px-3 align-top">
                                        <Input
                                          value={editingItem.unit}
                                          onChange={e => setEditingItem(prev => prev ? { ...prev, unit: e.target.value } : null)}
                                          className="h-7 w-16 text-center text-xs"
                                        />
                                      </td>
                                      <td className="py-2 px-3 align-top">
                                        <Input
                                          type="number"
                                          step="0.01"
                                          value={editingItem.adjustedRate}
                                          onChange={e => setEditingItem(prev => prev ? { ...prev, adjustedRate: parseFloat(e.target.value) || 0 } : null)}
                                          className="h-7 w-24 text-right text-xs"
                                        />
                                        {editingItem.adjustedRate !== item.baseRate && item.baseRate > 0 && (
                                          <p className="text-xs text-amber-500 mt-0.5">
                                            Base: {item.baseRate.toLocaleString()}
                                          </p>
                                        )}
                                      </td>
                                      <td className="py-2 px-3 text-right text-xs font-medium align-top">
                                        {formatKES(editingItem.quantity * editingItem.adjustedRate)}
                                      </td>
                                      <td className="py-2 px-2 align-top">
                                        <div className="flex flex-col gap-1">
                                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-teal-600" onClick={() => handleSaveEdit(item.id)}>
                                            <Check className="h-3 w-3" />
                                          </Button>
                                          <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400" onClick={() => setEditingItem(null)}>
                                            <X className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td className="py-2.5 px-3">
                                        <span className="text-xs font-medium text-slate-800">{item.name}</span>
                                        {item.isCustom && <Badge variant="outline" className="ml-1 text-xs scale-90">Custom</Badge>}
                                        {item.rateAdjusted && <Badge variant="outline" className="ml-1 text-xs text-amber-600 border-amber-300 scale-90">Adj.</Badge>}
                                        {item.description && <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{item.description}</p>}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-xs">{item.quantity.toFixed(2)}</td>
                                      <td className="py-2.5 px-3 text-right text-xs text-slate-500">{item.unit}</td>
                                      <td className="py-2.5 px-3 text-right text-xs">
                                        {item.adjustedRate.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                      </td>
                                      <td className="py-2.5 px-3 text-right text-xs font-semibold text-teal-700">
                                        {item.total.toLocaleString('en-KE', { minimumFractionDigits: 2 })}
                                      </td>
                                      <td className="py-2 px-2">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button
                                            size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-primary"
                                            onClick={() => setEditingItem({
                                              id: item.id,
                                              name: item.name,
                                              description: item.description,
                                              quantity: item.quantity,
                                              unit: item.unit,
                                              adjustedRate: item.adjustedRate,
                                              boqSectionCode: item.boqSectionCode,
                                              boqSectionTitle: item.boqSectionTitle,
                                            })}
                                          >
                                            <Pencil className="h-3 w-3" />
                                          </Button>
                                          <Button
                                            size="sm" variant="ghost" className="h-6 w-6 p-0 text-slate-400 hover:text-destructive"
                                            onClick={() => removeItem(item.id)}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </td>
                                    </>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}

                  <div className="border-t-2 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Subtotal</span>
                      <span className="font-medium">{formatKES(totals.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Contingency ({currentProject.contingencyPercent}%)</span>
                      <span className="font-medium text-amber-600">{formatKES(totals.contingency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Contractor's Profit & OH ({currentProject.profitMarginPercent}%)</span>
                      <span className="font-medium text-indigo-600">{formatKES(totals.profitMargin)}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                      <span className="text-slate-600">Base Contract Sum</span>
                      <span className="font-semibold">{formatKES(totals.baseContractSum)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">VAT @ {currentProject.vatPercent ?? 16}%</span>
                      <span className="font-medium">{formatKES(totals.vat)}</span>
                    </div>
                    <div className="flex justify-between py-3 px-4 bg-teal-50 rounded-xl border border-teal-200">
                      <span className="font-bold text-teal-800">GRAND TOTAL (Incl. VAT)</span>
                      <span className="font-bold text-teal-800 text-lg">{formatKES(totals.grandTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
