export type SectorType = 'building' | 'roads' | 'wash';
export type ItemCategory = 'materials' | 'labor' | 'equipment';

export interface BoQSectionDef {
  code: string;
  title: string;
  description: string;
}

export const BOQ_SECTIONS: Record<SectorType, BoQSectionDef[]> = {
  building: [
    { code: 'A', title: 'Preliminaries', description: 'Site establishment and temporary works' },
    { code: 'B', title: 'Earthworks & Site Clearance', description: 'Excavation, backfill and site preparation' },
    { code: 'C', title: 'Concrete Works', description: 'Foundation, slab, columns and beams' },
    { code: 'D', title: 'Masonry', description: 'Brickwork, blockwork and mortar' },
    { code: 'E', title: 'Roofing & Carpentry', description: 'Roof structure, cladding and timber works' },
    { code: 'F', title: 'Finishes', description: 'Plastering, tiling, painting and screed' },
    { code: 'G', title: 'Plumbing & Drainage', description: 'Water supply, drainage and sanitary fittings' },
    { code: 'H', title: 'Electrical Works', description: 'Wiring, fittings and distribution board' },
    { code: 'I', title: 'Doors & Windows', description: 'Door and window frames, hardware' },
  ],
  roads: [
    { code: 'A', title: 'Preliminaries', description: 'Mobilization, traffic management and site setup' },
    { code: 'B', title: 'Earthworks & Clearing', description: 'Clearing, grubbing, cut and fill operations' },
    { code: 'C', title: 'Subgrade Works', description: 'Subgrade preparation and stabilization' },
    { code: 'D', title: 'Subbase Course', description: 'Natural gravel or crushed stone subbase' },
    { code: 'E', title: 'Base Course', description: 'Crushed stone or macadam base course' },
    { code: 'F', title: 'Bituminous Works', description: 'Prime coat, tack coat and asphalt surfacing' },
    { code: 'G', title: 'Drainage Structures', description: 'Culverts, channels and headwalls' },
    { code: 'H', title: 'Road Furniture & Markings', description: 'Signs, guardrails, road markings and posts' },
  ],
  wash: [
    { code: 'A', title: 'Preliminaries', description: 'Site setup, survey and mobilization' },
    { code: 'B', title: 'Earthworks', description: 'Trenching, backfill and earthworks' },
    { code: 'C', title: 'Water Supply Works', description: 'Pipes, fittings, valves and storage tanks' },
    { code: 'D', title: 'Sanitation Works', description: 'Latrines, septic tanks and manholes' },
    { code: 'E', title: 'Drainage', description: 'Storm drainage and drainage channels' },
    { code: 'F', title: 'Mechanical & Electrical', description: 'Pumps, generators and control systems' },
  ],
};

export const LABOR_SECTION_CODE = 'LAB';
export const EQUIPMENT_SECTION_CODE = 'EQP';

export const LABOR_SECTION_TITLE: Record<SectorType, string> = {
  building: 'J. Labour',
  roads: 'I. Labour',
  wash: 'G. Labour',
};
export interface LaborSubSection{
  code: string;
  title: string;
}
export const LaborSubSections:LaborSubSection[]= [
  { code: 'Erath', title: 'Earthworks' },
  { code: 'Concrete', title: 'Concrete Works' },
  { code: 'Masonry', title: 'Masonry' },
  { code: 'Roof', title: 'Roofing & Carpentry' },
  { code: 'Finish', title: 'Finishes' },
  { code: 'Plumbing', title: 'Plumbing & Drainage' },
  { code: 'Electrical', title: 'Electrical Works' },
  { code: 'Road', title: 'Road works' },
  {code:  'Pipe', title: 'Pipeline Installation'},
  {code: 'Supervision', title: 'Management & Supervision'},
];

export const EQUIPMENT_SECTION_TITLE: Record<SectorType, string> = {
  building: 'K. Equipment & Plant Hire',
  roads: 'J. Equipment & Plant Hire',
  wash: 'H. Equipment & Plant Hire',
};
export interface EquipmentSubSection{
  code: string;
  title: string;
}
export const EquipmentSubSections:EquipmentSubSection[]= [
  { code: 'Earth', title: 'Earthmoving Equipments' },
  { code: 'Survey', title: 'Survey Equipment' },
  { code: 'Road', title: 'Road Construction Equipment' },
  { code: 'Lifting', title: 'Lifting & Handling Equipment' },
  { code: 'Compaction', title: 'Compaction Equipment' },
  { code: 'Concrete', title: 'Concrete Equipment' },
  { code: 'Electrical', title: 'Electrical Equipment' },
  { code: 'General', title: 'General Equipment' },
  {code:  'Pipe', title: 'Pipeline Installation Equipment'},

];

export interface RateItem {
  id: string;
  name: string;
  description: string;
  unit: string;
  rate: number;
  category: ItemCategory;
  sectors: SectorType[];
  defaultSection: string;
  quantityHint?: string;
  minQty?: number;
  maxQty?: number;
  subSection?: string; // Optional sub-section code for labor/equipment items
}

export const RATE_DATABASE: RateItem[] = [
  // ===== BUILDING - SECTION A: PRELIMINARIES =====
  { id: 'ba-001', name: 'Site Hoarding (timber panels)', description: 'Temporary timber site hoarding per metre run', unit: 'm', rate: 2500, category: 'materials', sectors: ['building'], defaultSection: 'A', quantityHint: 'Perimeter of site in metres' },
  { id: 'ba-002', name: 'Temporary Site Toilet', description: 'Portable toilet unit for site workers', unit: 'no', rate: 15000, category: 'materials', sectors: ['building', 'roads', 'wash'], defaultSection: 'A', quantityHint: '1 per 15-20 workers' },
  { id: 'ba-003', name: 'Project Signboard', description: 'Project signboard with contractor details, 2.4×1.2m', unit: 'no', rate: 8000, category: 'materials', sectors: ['building', 'roads', 'wash'], defaultSection: 'A', quantityHint: 'Usually 1-2 per site entrance' },
  { id: 'ba-004', name: 'Temporary Water Connection', description: 'Temporary water supply connection for construction use', unit: 'lump sum', rate: 35000, category: 'materials', sectors: ['building'], defaultSection: 'A' },
  { id: 'ba-005', name: 'Insurance & Bond Premiums', description: 'Contractor All Risks insurance and performance bond', unit: 'lump sum', rate: 75000, category: 'materials', sectors: ['building', 'roads', 'wash'], defaultSection: 'A' },

  // ===== BUILDING - SECTION B: EARTHWORKS =====
  { id: 'bb-001', name: 'Hardcore (crushed stone fill)', description: 'Crushed stone hardcore for floor slab filling', unit: 'm³', rate: 3200, category: 'materials', sectors: ['building'], defaultSection: 'B', quantityHint: 'Floor area × 150mm depth' },
  { id: 'bb-002', name: 'Murram (for filling)', description: 'Laterite murram for earthworks and filling', unit: 'm³', rate: 1800, category: 'materials', sectors: ['building', 'roads', 'wash'], defaultSection: 'B' },
  { id: 'bb-003', name: 'River Sand (bedding)', description: 'Clean river sand for pipe bedding and general fill', unit: 'm³', rate: 2800, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'B' },
  { id: 'bb-004', name: 'Anti-termite Treatment', description: 'Chemical anti-termite soil treatment beneath slabs', unit: 'm²', rate: 250, category: 'materials', sectors: ['building'], defaultSection: 'B', quantityHint: 'Total floor area in m²' },

  // ===== BUILDING - SECTION C: CONCRETE WORKS =====
  { id: 'bc-001', name: 'OPC Cement (50kg bag)', description: 'Ordinary Portland Cement 42.5N grade', unit: 'bags', rate: 750, category: 'materials', sectors: ['building', 'roads', 'wash'], defaultSection: 'C', quantityHint: 'For 1m³ of 1:2:4 concrete mix ≈ 7 bags', minQty: 1, maxQty: 50000 },
  { id: 'bc-002', name: 'Ballast (20mm crushed stone)', description: '20mm crushed granite/quartzite ballast for concrete', unit: 'm³', rate: 3500, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'C', quantityHint: 'For 1m³ of 1:2:4 concrete ≈ 0.85m³ ballast' },
  { id: 'bc-003', name: 'River Sand (for concrete/mortar)', description: 'Clean river sand, free of clay, for concrete and mortar', unit: 'm³', rate: 2800, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'C', quantityHint: 'For 1m³ of 1:2:4 concrete ≈ 0.45m³ sand' },
  { id: 'bc-004', name: 'Quarry Dust (fine aggregate)', description: 'Quarry dust as partial fine aggregate replacement', unit: 'm³', rate: 2200, category: 'materials', sectors: ['building'], defaultSection: 'C' },
  { id: 'bc-005', name: 'BRC Mesh A142 (slab)', description: 'A142 welded steel fabric mesh for slab reinforcement', unit: 'm²', rate: 4500, category: 'materials', sectors: ['building'], defaultSection: 'C', quantityHint: 'Slab area; allow 10% overlap wastage' },
  { id: 'bc-006', name: 'Steel Bar Y8 (deformed, per kg)', description: 'High-yield deformed steel reinforcement bar, 8mm ⌀', unit: 'kg', rate: 105, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'C' },
  { id: 'bc-007', name: 'Steel Bar Y10 (deformed, per kg)', description: 'High-yield deformed steel reinforcement bar, 10mm ⌀', unit: 'kg', rate: 110, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'C' },
  { id: 'bc-008', name: 'Steel Bar Y12 (deformed, per kg)', description: 'High-yield deformed steel reinforcement bar, 12mm ⌀', unit: 'kg', rate: 120, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'C' },
  { id: 'bc-009', name: 'Steel Bar Y16 (deformed, per kg)', description: 'High-yield deformed steel reinforcement bar, 16mm ⌀', unit: 'kg', rate: 125, category: 'materials', sectors: ['building'], defaultSection: 'C' },
  { id: 'bc-010', name: 'Steel Bar Y20 (deformed, per kg)', description: 'High-yield deformed steel reinforcement bar, 20mm ⌀', unit: 'kg', rate: 130, category: 'materials', sectors: ['building'], defaultSection: 'C' },
  { id: 'bc-011', name: 'Binding Wire (annealed)', description: 'Annealed steel binding wire for tying reinforcement', unit: 'kg', rate: 180, category: 'materials', sectors: ['building'], defaultSection: 'C', quantityHint: 'Allow 2-3 kg per tonne of steel bars' },
  { id: 'bc-012', name: 'Formwork Boards (1"×6" sawn)', description: 'Sawn cypress timber boards for concrete formwork', unit: 'ft', rate: 65, category: 'materials', sectors: ['building'], defaultSection: 'C' },
  { id: 'bc-013', name: 'Plywood for Formwork (18mm marine)', description: '18mm marine-grade plywood for shuttering', unit: 'sheets', rate: 2500, category: 'materials', sectors: ['building'], defaultSection: 'C', quantityHint: '1 sheet = 2.88m² (1.22m × 2.44m)' },
  { id: 'bc-014', name: 'Wire Nails (assorted)', description: 'Galvanized wire nails for formwork and carpentry', unit: 'kg', rate: 200, category: 'materials', sectors: ['building'], defaultSection: 'C' },
  { id: 'bc-015', name: 'Concrete Spacers (plastic)', description: 'Plastic spacers for maintaining reinforcement cover', unit: 'bags', rate: 850, category: 'materials', sectors: ['building'], defaultSection: 'C' },
  { id: 'bc-016', name: 'Waterproofing Admixture', description: 'Cementitious waterproofing admixture for water-retaining structures', unit: 'litres', rate: 1200, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'C' },

  // ===== BUILDING - SECTION D: MASONRY =====
  { id: 'bd-001', name: 'Common Bricks (9 inch)', description: 'Standard fired clay bricks, 9 inch size', unit: 'pcs', rate: 15, category: 'materials', sectors: ['building'], defaultSection: 'D', quantityHint: 'Allow ~55 bricks per m² of 9" wall', minQty: 100 },
  { id: 'bd-002', name: 'Hollow Concrete Blocks (6 inch)', description: '6 inch hollow concrete masonry blocks', unit: 'pcs', rate: 35, category: 'materials', sectors: ['building'], defaultSection: 'D', quantityHint: '~13 blocks per m² of 6" wall' },
  { id: 'bd-003', name: 'Hollow Concrete Blocks (9 inch)', description: '9 inch hollow concrete masonry blocks', unit: 'pcs', rate: 45, category: 'materials', sectors: ['building'], defaultSection: 'D', quantityHint: '~13 blocks per m² of 9" wall' },
  { id: 'bd-004', name: 'Solid Concrete Blocks', description: 'Solid concrete blocks for perimeter walls', unit: 'pcs', rate: 55, category: 'materials', sectors: ['building'], defaultSection: 'D' },
  { id: 'bd-005', name: 'DPC Polythene Sheet (500 gauge)', description: '500 gauge polythene Damp Proof Course membrane', unit: 'm', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'D', quantityHint: 'Total length of all walls at DPC level' },
  { id: 'bd-006', name: 'Plaster Sand (for mortar)', description: 'Fine sand for mortar mix used in masonry', unit: 'm³', rate: 2800, category: 'materials', sectors: ['building'], defaultSection: 'D' },

  // ===== BUILDING - SECTION E: ROOFING & CARPENTRY =====
  { id: 'be-001', name: 'Roofing Sheets – Gauge 30 (0.3mm)', description: 'Corrugated galvanized iron roofing sheets, Gauge 30, 3m length', unit: 'sheets', rate: 850, category: 'materials', sectors: ['building'], defaultSection: 'E', quantityHint: '1 sheet covers ≈2.4m²; add 15% for overlaps' },
  { id: 'be-002', name: 'Roofing Sheets – Gauge 28 (0.4mm)', description: 'Corrugated galvanized iron roofing sheets, Gauge 28, 3m length', unit: 'sheets', rate: 1100, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-003', name: 'Roofing Sheets – Gauge 26 (0.5mm)', description: 'Corrugated galvanized iron roofing sheets, Gauge 26, 3m length', unit: 'sheets', rate: 1350, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-004', name: 'Ridge Cap (galvanized steel)', description: 'Ridge capping for roof apex finish', unit: 'm', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-005', name: 'Timber 2"×4" (sawn cypress)', description: 'Sawn cypress timber 2 inch × 4 inch', unit: 'ft', rate: 85, category: 'materials', sectors: ['building'], defaultSection: 'E', quantityHint: '1 ft = 30.5 cm' },
  { id: 'be-006', name: 'Timber 3"×2" (sawn cypress)', description: 'Sawn cypress timber 3 inch × 2 inch', unit: 'ft', rate: 65, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-007', name: 'Timber 4"×4" (posts/columns)', description: 'Sawn cypress timber 4 inch × 4 inch for posts', unit: 'ft', rate: 120, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-008', name: 'Hardwood Timber (structural)', description: 'Hardwood timber for structural members', unit: 'ft', rate: 150, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-009', name: 'PVC Gutters (half round)', description: 'Half-round PVC rain gutters', unit: 'm', rate: 450, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-010', name: 'PVC Downpipes (75mm)', description: '75mm PVC downpipe for rainwater drainage', unit: 'm', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'E' },
  { id: 'be-011', name: 'Roofing Nails / Hook Bolts', description: 'Galvanized roofing nails and hook bolts', unit: 'kg', rate: 200, category: 'materials', sectors: ['building'], defaultSection: 'E', quantityHint: '~2-3 kg per 10 sheets' },
  { id: 'be-012', name: 'Gypsum Ceiling Board', description: 'Gypsum plasterboard for ceiling lining, 12mm', unit: 'm²', rate: 950, category: 'materials', sectors: ['building'], defaultSection: 'E', quantityHint: 'Total ceiling area in m²' },
  { id: 'be-013', name: 'Fascia Board (timber)', description: 'Timber fascia board at roof eaves', unit: 'm', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'E' },

  // ===== BUILDING - SECTION F: FINISHES =====
  { id: 'bf-001', name: 'Ceramic Floor Tiles (standard)', description: 'Standard ceramic floor tiles, 300×300mm or 400×400mm', unit: 'm²', rate: 1200, category: 'materials', sectors: ['building'], defaultSection: 'F', quantityHint: 'Total floor area; allow 10% wastage' },
  { id: 'bf-002', name: 'Porcelain Floor Tiles (premium)', description: 'Premium porcelain vitrified floor tiles, 600×600mm', unit: 'm²', rate: 2500, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-003', name: 'Ceramic Wall Tiles (bathroom)', description: 'Ceramic wall tiles for wet areas, 200×300mm', unit: 'm²', rate: 1500, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-004', name: 'Interior Emulsion Paint', description: 'Alkali-resistant interior emulsion paint for walls', unit: 'litres', rate: 850, category: 'materials', sectors: ['building'], defaultSection: 'F', quantityHint: '1 litre covers ~10m² (2 coats = 1L per 5m²)' },
  { id: 'bf-005', name: 'Exterior Weathershield Paint', description: 'Weather-resistant exterior masonry paint', unit: 'litres', rate: 950, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-006', name: 'Primer / Undercoat', description: 'Alkali-resistant wall primer before topcoat', unit: 'litres', rate: 650, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-007', name: 'Textured / Sandtex Paint', description: 'Textured masonry paint for decorative exterior finish', unit: 'litres', rate: 1100, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-008', name: 'Tile Adhesive (cement-based, 20kg)', description: 'Cement-based adhesive for floor and wall tiles', unit: 'bags', rate: 850, category: 'materials', sectors: ['building'], defaultSection: 'F', quantityHint: '1 bag covers ~4m² of tiling' },
  { id: 'bf-009', name: 'Tile Grout', description: 'Grout for filling tile joints', unit: 'kg', rate: 250, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-010', name: 'PVC Skirting Board', description: 'PVC skirting board at floor-wall junction', unit: 'm', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'F' },
  { id: 'bf-011', name: 'Marble Threshold/Doorstop', description: 'Polished marble door threshold strip', unit: 'm', rate: 1800, category: 'materials', sectors: ['building'], defaultSection: 'F' },

  // ===== BUILDING - SECTION G: PLUMBING =====
  { id: 'bg-001', name: 'uPVC Soil Pipe 110mm', description: 'uPVC soil/waste pipe, 110mm diameter', unit: 'm', rate: 650, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-002', name: 'uPVC Soil Pipe 160mm', description: 'uPVC soil pipe, 160mm diameter', unit: 'm', rate: 950, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-003', name: 'GI Water Pipe 1" (25mm)', description: 'Galvanized iron water supply pipe, 25mm', unit: 'm', rate: 450, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'G' },
  { id: 'bg-004', name: 'GI Water Pipe 2" (50mm)', description: 'Galvanized iron water supply pipe, 50mm', unit: 'm', rate: 850, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'G' },
  { id: 'bg-005', name: 'Plumbing Fittings (assorted lot)', description: 'Elbows, tees, unions, nipples, reducers', unit: 'lot', rate: 3500, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-006', name: 'Pedestal Washbasin (ceramic)', description: 'Ceramic pedestal washbasin with pillar taps', unit: 'no', rate: 4500, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-007', name: 'Kitchen Sink (stainless steel)', description: 'Stainless steel double-bowl kitchen sink', unit: 'no', rate: 6500, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-008', name: 'WC Pan & Close-Coupled Cistern', description: 'Ceramic close-coupled WC toilet suite', unit: 'no', rate: 12500, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-009', name: 'Water Tank (500 Litre HDPE)', description: 'HDPE plastic water storage tank, 500 litres', unit: 'no', rate: 8500, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-010', name: 'Water Tank (1,000 Litre HDPE)', description: 'HDPE plastic water storage tank, 1,000 litres', unit: 'no', rate: 18000, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-011', name: 'Water Tank (2,000 Litre HDPE)', description: 'HDPE plastic water storage tank, 2,000 litres', unit: 'no', rate: 35000, category: 'materials', sectors: ['building'], defaultSection: 'G' },
  { id: 'bg-012', name: 'Ball Valve ½" (brass)', description: 'Brass ball valve 15mm (½ inch)', unit: 'no', rate: 800, category: 'materials', sectors: ['building', 'wash'], defaultSection: 'G' },
  { id: 'bg-013', name: 'Water Taps (standard bib tap)', description: 'Standard bib taps for sink and basin', unit: 'no', rate: 1200, category: 'materials', sectors: ['building'], defaultSection: 'G' },

  // ===== BUILDING - SECTION H: ELECTRICAL =====
  { id: 'bh-001', name: 'Cable 2.5mm² Twin & Earth', description: 'PVC insulated 2.5mm² twin & earth cable for power circuits', unit: 'm', rate: 150, category: 'materials', sectors: ['building'], defaultSection: 'H', quantityHint: 'Total cable run for all ring main circuits' },
  { id: 'bh-002', name: 'Cable 4mm² Twin & Earth', description: 'PVC insulated 4mm² twin & earth cable', unit: 'm', rate: 220, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-003', name: 'Cable 6mm² Single Core', description: '6mm² single core PVC insulated cable', unit: 'm', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-004', name: 'Single 13A Socket Outlet', description: '13A single switched socket outlet', unit: 'no', rate: 350, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-005', name: 'Double 13A Socket Outlet', description: '13A double switched socket outlet', unit: 'no', rate: 550, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-006', name: 'Single Light Switch', description: 'Single pole one-way light switch', unit: 'no', rate: 280, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-007', name: 'MCB 20A Breaker', description: 'Miniature circuit breaker 20 ampere', unit: 'no', rate: 850, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-008', name: 'Consumer Unit (8-way)', description: '8-way consumer unit / distribution board', unit: 'no', rate: 6500, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-009', name: 'PVC Conduit 20mm', description: '20mm PVC electrical conduit pipe', unit: 'm', rate: 65, category: 'materials', sectors: ['building'], defaultSection: 'H' },
  { id: 'bh-010', name: 'LED Light Fitting (interior)', description: 'LED batten or panel light fitting', unit: 'no', rate: 1200, category: 'materials', sectors: ['building'], defaultSection: 'H' },

  // ===== BUILDING - SECTION I: DOORS & WINDOWS =====
  { id: 'bi-001', name: 'Flush Door – Solid Core (900×2100)', description: 'Solid core flush door, 900×2100mm', unit: 'no', rate: 6500, category: 'materials', sectors: ['building'], defaultSection: 'I', quantityHint: 'Count all internal and external door openings' },
  { id: 'bi-002', name: 'Panelled Hardwood Door', description: 'Hardwood panelled door for main entrances', unit: 'no', rate: 12000, category: 'materials', sectors: ['building'], defaultSection: 'I' },
  { id: 'bi-003', name: 'Steel Security Door', description: 'Steel security door with multipoint lock system', unit: 'no', rate: 18000, category: 'materials', sectors: ['building'], defaultSection: 'I' },
  { id: 'bi-004', name: 'Steel Casement Window (standard)', description: 'Steel casement window with glass', unit: 'no', rate: 8500, category: 'materials', sectors: ['building'], defaultSection: 'I', quantityHint: 'Count all window openings' },
  { id: 'bi-005', name: 'Aluminium Sliding Window', description: 'Aluminium frame sliding window with 5mm glass', unit: 'no', rate: 15000, category: 'materials', sectors: ['building'], defaultSection: 'I' },
  { id: 'bi-006', name: 'Door Frame (hardwood)', description: 'Hardwood door frame with architrave lining', unit: 'no', rate: 3500, category: 'materials', sectors: ['building'], defaultSection: 'I' },
  { id: 'bi-007', name: 'Door Hinges (heavy duty, pair)', description: 'Heavy-duty steel door hinges per pair', unit: 'pair', rate: 450, category: 'materials', sectors: ['building'], defaultSection: 'I' },
  { id: 'bi-008', name: 'Mortice Deadlock with Handles', description: 'Mortice deadlock with pair of lever handles', unit: 'no', rate: 1800, category: 'materials', sectors: ['building'], defaultSection: 'I' },

  // ===== ROADS - SECTION A: PRELIMINARIES =====
  { id: 'ra-001', name: 'Traffic Management Equipment', description: 'Traffic cones, barriers, signs and road closures', unit: 'lot', rate: 150000, category: 'materials', sectors: ['roads'], defaultSection: 'A' },
  { id: 'ra-002', name: 'Route Survey & Setting Out', description: 'Survey, pegging, and setting out road alignment', unit: 'km', rate: 85000, category: 'materials', sectors: ['roads'], defaultSection: 'A', quantityHint: 'Road length in kilometres' },
  { id: 'ra-003', name: 'Environmental Mitigation (roads)', description: 'Environmental mitigation and restoration fund', unit: 'lump sum', rate: 250000, category: 'materials', sectors: ['roads'], defaultSection: 'A' },

  // ===== ROADS - SECTION B: EARTHWORKS =====
  { id: 'rb-001', name: 'Select Fill (embankment)', description: 'Select fill material for road embankment', unit: 'm³', rate: 2200, category: 'materials', sectors: ['roads'], defaultSection: 'B', quantityHint: 'Volume of fill = road length × width × height' },
  { id: 'rb-002', name: 'Murram Fill (earthworks)', description: 'Laterite murram for general earthworks fill', unit: 'm³', rate: 1800, category: 'materials', sectors: ['roads'], defaultSection: 'B' },
  { id: 'rb-003', name: 'Topsoil Strip & Stockpile', description: 'Topsoil stripping and stockpiling for reinstatement', unit: 'm³', rate: 850, category: 'materials', sectors: ['roads'], defaultSection: 'B', quantityHint: 'Road width × length × 200mm strip depth' },

  // ===== ROADS - SECTION C: SUBGRADE =====
  { id: 'rc-001', name: 'Lime (for stabilization, t)', description: 'Hydrated lime for subgrade stabilization, per tonne', unit: 't', rate: 18000, category: 'materials', sectors: ['roads'], defaultSection: 'C', quantityHint: '3-5% lime by dry weight of treated soil' },
  { id: 'rc-002', name: 'OPC Cement (stabilization)', description: 'Portland cement for stabilizing weak subgrade soils', unit: 'bags', rate: 750, category: 'materials', sectors: ['roads'], defaultSection: 'C' },
  { id: 'rc-003', name: 'Geotextile Fabric (subgrade)', description: 'Woven geotextile for subgrade separation/stabilization', unit: 'm²', rate: 350, category: 'materials', sectors: ['roads'], defaultSection: 'C' },

  // ===== ROADS - SECTION D: SUBBASE =====
  { id: 'rd-001', name: 'Crushed Stone Subbase (CBR≥25)', description: 'Crusher run crushed stone for subbase, CBR ≥ 25', unit: 'm³', rate: 4500, category: 'materials', sectors: ['roads'], defaultSection: 'D', quantityHint: 'L × W × 0.20m (typical 200mm subbase)' },
  { id: 'rd-002', name: 'Natural Gravel Subbase (CBR≥25)', description: 'Natural gravel for subbase course, CBR ≥ 25', unit: 'm³', rate: 2800, category: 'materials', sectors: ['roads'], defaultSection: 'D' },

  // ===== ROADS - SECTION E: BASE COURSE =====
  { id: 're-001', name: 'Crushed Stone Base (CBR≥80)', description: 'Crushed stone base course material, CBR ≥ 80', unit: 'm³', rate: 5200, category: 'materials', sectors: ['roads'], defaultSection: 'E', quantityHint: 'L × W × 0.15m (typical 150mm base)' },
  { id: 're-002', name: 'Macadam Stone (base course)', description: 'Water-bound macadam for base course', unit: 'm³', rate: 4800, category: 'materials', sectors: ['roads'], defaultSection: 'E' },
  { id: 're-003', name: 'Cement Treated Base (CTB)', description: 'Cement-stabilized crushed stone base course', unit: 'm³', rate: 6500, category: 'materials', sectors: ['roads'], defaultSection: 'E' },

  // ===== ROADS - SECTION F: BITUMINOUS WORKS =====
  { id: 'rf-001', name: 'Asphalt Concrete AC14 (wearing)', description: 'Asphaltic concrete wearing course, 14mm max aggregate, per tonne', unit: 't', rate: 12500, category: 'materials', sectors: ['roads'], defaultSection: 'F', quantityHint: '50mm thick AC ≈ 115 kg/m² ≈ 2.3t/m³' },
  { id: 'rf-002', name: 'Bitumen 60/70 (drums, per tonne)', description: 'Penetration grade bitumen 60/70 in 200L drums', unit: 't', rate: 95000, category: 'materials', sectors: ['roads'], defaultSection: 'F' },
  { id: 'rf-003', name: 'Prime Coat MC-30 (per litre)', description: 'Medium-curing cutback bitumen for prime coat on base', unit: 'litre', rate: 85, category: 'materials', sectors: ['roads'], defaultSection: 'F', quantityHint: 'Application rate: 0.8–1.2 L/m²' },
  { id: 'rf-004', name: 'Tack Coat SS-1 Emulsion (litre)', description: 'Slow-setting bitumen emulsion for tack coat', unit: 'litre', rate: 75, category: 'materials', sectors: ['roads'], defaultSection: 'F', quantityHint: 'Application rate: 0.3–0.5 L/m²' },
  { id: 'rf-005', name: 'Surface Dressing Chippings (m²)', description: 'Pre-coated chippings for surface dressing', unit: 'm²', rate: 850, category: 'materials', sectors: ['roads'], defaultSection: 'F' },

  // ===== ROADS - SECTION G: DRAINAGE =====
  { id: 'rg-001', name: 'RC Culvert Pipe 600mm (m)', description: 'Reinforced concrete culvert pipe, 600mm internal diameter', unit: 'm', rate: 15000, category: 'materials', sectors: ['roads'], defaultSection: 'G', quantityHint: 'Total length of culverts across road width + headwalls' },
  { id: 'rg-002', name: 'RC Culvert Pipe 900mm (m)', description: 'Reinforced concrete culvert pipe, 900mm internal diameter', unit: 'm', rate: 25000, category: 'materials', sectors: ['roads'], defaultSection: 'G' },
  { id: 'rg-003', name: 'RC Culvert Pipe 1200mm (m)', description: 'Reinforced concrete culvert pipe, 1200mm internal diameter', unit: 'm', rate: 42000, category: 'materials', sectors: ['roads'], defaultSection: 'G' },
  { id: 'rg-004', name: 'Precast Concrete Kerb (m)', description: 'Precast concrete road kerb, 150×300mm', unit: 'm', rate: 850, category: 'materials', sectors: ['roads'], defaultSection: 'G' },
  { id: 'rg-005', name: 'Precast U-Drain Channel (m)', description: 'Precast concrete U-shaped drainage channel, 300×300mm', unit: 'm', rate: 2500, category: 'materials', sectors: ['roads'], defaultSection: 'G' },
  { id: 'rg-006', name: 'Headwall (concrete culvert)', description: 'Concrete culvert headwall and wing walls', unit: 'no', rate: 85000, category: 'materials', sectors: ['roads'], defaultSection: 'G' },

  // ===== ROADS - SECTION H: ROAD FURNITURE =====
  { id: 'rh-001', name: 'Road Signs (retroreflective)', description: 'Standard retroreflective road warning/regulatory signs', unit: 'no', rate: 12000, category: 'materials', sectors: ['roads'], defaultSection: 'H' },
  { id: 'rh-002', name: 'Road Marking Paint (thermoplastic)', description: 'Thermoplastic road marking paint per litre', unit: 'litre', rate: 850, category: 'materials', sectors: ['roads'], defaultSection: 'H', quantityHint: '0.5–1L per linear metre for 150mm wide line' },
  { id: 'rh-003', name: 'W-Beam Steel Guardrail (m)', description: 'W-beam galvanized steel guardrail with posts', unit: 'm', rate: 4500, category: 'materials', sectors: ['roads'], defaultSection: 'H' },
  { id: 'rh-004', name: 'Kilometre Marker Post', description: 'Precast concrete kilometre marker post', unit: 'no', rate: 3500, category: 'materials', sectors: ['roads'], defaultSection: 'H' },
  { id: 'rh-005', name: 'Road Stud / Cats Eye', description: 'Retroreflective road stud for centre line', unit: 'no', rate: 350, category: 'materials', sectors: ['roads'], defaultSection: 'H' },

  // ===== WASH - SECTION A: PRELIMINARIES =====
  { id: 'wa-001', name: 'Pipeline Route Survey (km)', description: 'Survey, pegging and setting out pipeline route', unit: 'km', rate: 85000, category: 'materials', sectors: ['wash'], defaultSection: 'A', quantityHint: 'Total pipeline length in km' },
  { id: 'wa-002', name: 'EIA Report (WASH)', description: 'Basic Environmental Impact Assessment report', unit: 'lump sum', rate: 250000, category: 'materials', sectors: ['wash'], defaultSection: 'A' },
  { id: 'wa-003', name: 'WRMA Water Abstraction Permit', description: 'Water Resources Management Authority permit fee', unit: 'lump sum', rate: 50000, category: 'materials', sectors: ['wash'], defaultSection: 'A' },

  // ===== WASH - SECTION B: EARTHWORKS =====
  { id: 'wb-001', name: 'Sand Bedding for Pipes (m³)', description: 'Coarse sand for pipe bedding in trench', unit: 'm³', rate: 2800, category: 'materials', sectors: ['wash'], defaultSection: 'B', quantityHint: '~0.1m³ sand per metre of pipeline' },
  { id: 'wb-002', name: 'Concrete Thrust Blocks', description: 'Concrete thrust blocks at bends, tees and fittings', unit: 'no', rate: 8500, category: 'materials', sectors: ['wash'], defaultSection: 'B', quantityHint: '1 per pipe bend, tee junction or reducer' },
  { id: 'wb-003', name: 'Trench Backfill Material (m³)', description: 'Imported fill material for pipeline trench backfill', unit: 'm³', rate: 1800, category: 'materials', sectors: ['wash'], defaultSection: 'B' },

  // ===== WASH - SECTION C: WATER SUPPLY =====
  { id: 'wc-001', name: 'uPVC Pressure Pipe DN110 (m)', description: 'uPVC pressure pipe Class C, 110mm diameter', unit: 'm', rate: 650, category: 'materials', sectors: ['wash'], defaultSection: 'C', quantityHint: 'Total pipeline length in metres' },
  { id: 'wc-002', name: 'uPVC Pressure Pipe DN160 (m)', description: 'uPVC pressure pipe Class C, 160mm diameter', unit: 'm', rate: 950, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-003', name: 'uPVC Pressure Pipe DN200 (m)', description: 'uPVC pressure pipe Class C, 200mm diameter', unit: 'm', rate: 1400, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-004', name: 'uPVC Pressure Pipe DN315 (m)', description: 'uPVC pressure pipe Class C, 315mm diameter', unit: 'm', rate: 2800, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-005', name: 'HDPE Pipe DN25 (service pipe)', description: 'HDPE PE100 pipe, 25mm, for household service connections', unit: 'm', rate: 280, category: 'materials', sectors: ['wash'], defaultSection: 'C', quantityHint: 'For household connections (~10m per connection)' },
  { id: 'wc-006', name: 'HDPE Pipe DN50 (m)', description: 'HDPE PE100 pressure pipe, 50mm diameter', unit: 'm', rate: 650, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-007', name: 'HDPE Pipe DN110 (m)', description: 'HDPE PE100 pressure pipe, 110mm diameter', unit: 'm', rate: 1350, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-008', name: 'Gate Valve DN50 (resilient seat)', description: 'Resilient seated gate valve, 50mm, PN16', unit: 'no', rate: 4500, category: 'materials', sectors: ['wash'], defaultSection: 'C', quantityHint: '1 per branch, junction or zone boundary' },
  { id: 'wc-009', name: 'Gate Valve DN100 (resilient seat)', description: 'Resilient seated gate valve, 100mm, PN16', unit: 'no', rate: 12000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-010', name: 'Gate Valve DN150 (resilient seat)', description: 'Resilient seated gate valve, 150mm, PN16', unit: 'no', rate: 22000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-011', name: 'Air Release Valve (automatic)', description: 'Automatic air release and vacuum break valve', unit: 'no', rate: 8500, category: 'materials', sectors: ['wash'], defaultSection: 'C', quantityHint: 'Install at all high points of pipeline route' },
  { id: 'wc-012', name: 'Water Meter DN25 (domestic)', description: 'Domestic water meter, 25mm, Class B, with isolating valves', unit: 'no', rate: 4500, category: 'materials', sectors: ['wash'], defaultSection: 'C', quantityHint: '1 per household connection' },
  { id: 'wc-013', name: 'Water Meter DN50 (bulk)', description: 'Bulk water meter, 50mm, for zone/bulk measurement', unit: 'no', rate: 8500, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-014', name: 'Fire Hydrant (pillar type, DN100)', description: 'Above-ground pillar fire hydrant, DN100 outlet', unit: 'no', rate: 25000, category: 'materials', sectors: ['wash'], defaultSection: 'C', quantityHint: 'Allow 1 per 150m in urban areas' },
  { id: 'wc-015', name: 'RC Ground Water Tank (10,000L)', description: 'Reinforced concrete ground-level reservoir, 10m³', unit: 'no', rate: 350000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-016', name: 'GS Elevated Tank (5,000L)', description: 'Galvanized corrugated steel elevated tank on stand', unit: 'no', rate: 85000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-017', name: 'HDPE Plastic Tank (2,000L)', description: 'HDPE water storage tank, 2,000 litres, with fittings', unit: 'no', rate: 45000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-018', name: 'uPVC Pipe Fittings (lot)', description: 'Assorted uPVC elbows, tees, reducers and couplings', unit: 'lot', rate: 5000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },
  { id: 'wc-019', name: 'Pressure Reducing Valve DN50', description: 'Pilot-operated pressure reducing valve, 50mm', unit: 'no', rate: 15000, category: 'materials', sectors: ['wash'], defaultSection: 'C' },

  // ===== WASH - SECTION D: SANITATION =====
  { id: 'wd-001', name: 'VIP Latrine Slab (precast)', description: 'Precast concrete squatting slab for VIP latrine', unit: 'no', rate: 8500, category: 'materials', sectors: ['wash'], defaultSection: 'D', quantityHint: '1 per latrine pit' },
  { id: 'wd-002', name: 'Ceramic Squat Pan', description: 'Ceramic squat toilet pan for pour-flush latrine', unit: 'no', rate: 3500, category: 'materials', sectors: ['wash'], defaultSection: 'D' },
  { id: 'wd-003', name: 'RC Septic Tank (2m³, cast in-situ)', description: 'Reinforced concrete in-situ septic tank, 2m³', unit: 'no', rate: 85000, category: 'materials', sectors: ['wash'], defaultSection: 'D', quantityHint: '1 per household of 5-6 persons' },
  { id: 'wd-004', name: 'Prefab Plastic Septic Tank (2000L)', description: 'Pre-manufactured HDPE septic tank, 2,000 litres', unit: 'no', rate: 45000, category: 'materials', sectors: ['wash'], defaultSection: 'D' },
  { id: 'wd-005', name: 'Precast Manhole (1200mm dia)', description: 'Precast concrete manhole, 1200mm internal diameter', unit: 'no', rate: 35000, category: 'materials', sectors: ['wash'], defaultSection: 'D', quantityHint: '1 per change of direction or every 50m' },
  { id: 'wd-006', name: 'Manhole Cover & Frame (DI, 600mm)', description: 'Ductile iron manhole cover and frame, 600mm clear opening', unit: 'no', rate: 8500, category: 'materials', sectors: ['wash'], defaultSection: 'D' },
  { id: 'wd-007', name: 'Soakpit / French Drain Fill', description: 'Clean graded stone for soakpit/French drain fill', unit: 'm³', rate: 2500, category: 'materials', sectors: ['wash'], defaultSection: 'D' },

  // ===== WASH - SECTION E: DRAINAGE =====
  { id: 'we-001', name: 'uPVC Drain Pipe DN110 (m)', description: 'uPVC sewer and drainage pipe, 110mm diameter', unit: 'm', rate: 650, category: 'materials', sectors: ['wash'], defaultSection: 'E' },
  { id: 'we-002', name: 'uPVC Drain Pipe DN160 (m)', description: 'uPVC sewer and drainage pipe, 160mm diameter', unit: 'm', rate: 950, category: 'materials', sectors: ['wash'], defaultSection: 'E' },
  { id: 'we-003', name: 'Concrete Drainage Channel (m)', description: 'Cast in-situ concrete U-drain channel, 300×300mm', unit: 'm', rate: 2500, category: 'materials', sectors: ['wash'], defaultSection: 'E' },
  { id: 'we-004', name: 'Catch Basin / Gully Trap', description: 'Precast concrete gully trap with cover', unit: 'no', rate: 12000, category: 'materials', sectors: ['wash'], defaultSection: 'E' },

  // ===== WASH - SECTION F: MECHANICAL & ELECTRICAL =====
  { id: 'wf-001', name: 'Submersible Borehole Pump 0.5HP', description: 'Stainless steel submersible pump, 0.5HP, for up to 30m depth', unit: 'no', rate: 45000, category: 'materials', sectors: ['wash'], defaultSection: 'F', quantityHint: 'Size based on flow rate and total head required' },
  { id: 'wf-002', name: 'Submersible Borehole Pump 1HP', description: 'Stainless steel submersible pump, 1HP, up to 60m depth', unit: 'no', rate: 85000, category: 'materials', sectors: ['wash'], defaultSection: 'F' },
  { id: 'wf-003', name: 'Surface Centrifugal Pump 3HP', description: 'Surface-mounted centrifugal pump, 3HP', unit: 'no', rate: 125000, category: 'materials', sectors: ['wash'], defaultSection: 'F' },
  { id: 'wf-004', name: 'Solar Panels (100W monocrystalline)', description: '100W monocrystalline solar panel for water pumping', unit: 'no', rate: 18000, category: 'materials', sectors: ['wash'], defaultSection: 'F', quantityHint: '4-8 panels typical for 0.5HP pump' },
  { id: 'wf-005', name: 'Diesel Generator 5KVA (pump house)', description: '5KVA diesel generator for pump station backup', unit: 'no', rate: 95000, category: 'materials', sectors: ['wash'], defaultSection: 'F' },
  { id: 'wf-006', name: 'Automatic Control Panel', description: 'Pump automatic control panel with level sensors', unit: 'no', rate: 85000, category: 'materials', sectors: ['wash'], defaultSection: 'F' },
  { id: 'wf-007', name: 'Float Switch (level control)', description: 'Float switch for automatic pump level control', unit: 'no', rate: 3500, category: 'materials', sectors: ['wash'], defaultSection: 'F' },
  { id: 'wf-008', name: 'Pressure Gauge (Bourdon, 0-16bar)', description: 'Bourdon tube pressure gauge, 0–16 bar range', unit: 'no', rate: 2500, category: 'materials', sectors: ['wash'], defaultSection: 'F' },

  // ===== LABOR – ALL SECTORS =====
  { id: 'lab-001', name: 'Mason (Skilled)', description: 'Experienced mason for brickwork, blockwork and concrete', unit: 'days', rate: 1500, category: 'labor', sectors: ['building', 'wash'], defaultSection: LABOR_SECTION_CODE, quantityHint: 'Allow ~0.5 mason-days per m² of masonry wall' },
  { id: 'lab-002', name: 'Mason (Semi-Skilled)', description: 'Semi-skilled mason / mason assistant', unit: 'days', rate: 1100, category: 'labor', sectors: ['building', 'wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-003', name: 'General Labourer', description: 'General construction labourer for digging, mixing, carrying', unit: 'days', rate: 600, category: 'labor', sectors: ['building', 'roads', 'wash'], defaultSection: LABOR_SECTION_CODE, quantityHint: 'Allow 2-3 labourers per skilled tradesperson' },
  { id: 'lab-004', name: 'Carpenter (formwork/roofing)', description: 'Skilled carpenter for formwork and roofing works', unit: 'days', rate: 1800, category: 'labor', sectors: ['building'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-005', name: 'Plumber (Licensed)', description: 'Licensed plumber for water supply and drainage', unit: 'days', rate: 2000, category: 'labor', sectors: ['building', 'wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-006', name: 'Electrician (Registered)', description: 'Registered electrician for wiring and DB installation', unit: 'days', rate: 2200, category: 'labor', sectors: ['building'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-007', name: 'Steel Fixer / Bar Bender', description: 'Specialist steel fixer for reinforcement bars', unit: 'days', rate: 1600, category: 'labor', sectors: ['building', 'wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-008', name: 'Roofer (sheet installer)', description: 'Specialist roofer for corrugated iron sheet installation', unit: 'days', rate: 1400, category: 'labor', sectors: ['building'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-009', name: 'Painter (skilled)', description: 'Skilled painter for interior and exterior painting', unit: 'days', rate: 1200, category: 'labor', sectors: ['building'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-010', name: 'Tiler (floor & wall)', description: 'Skilled tiler for floor and wall ceramic tiling', unit: 'days', rate: 1800, category: 'labor', sectors: ['building'], defaultSection: LABOR_SECTION_CODE, quantityHint: '~8-10 m² of tiles per day' },
  { id: 'lab-011', name: 'Plasterer', description: 'Skilled plasterer for rendering walls and ceilings', unit: 'days', rate: 1500, category: 'labor', sectors: ['building'], defaultSection: LABOR_SECTION_CODE, quantityHint: '~15-20 m² of plaster per day' },
  { id: 'lab-012', name: 'Foreman / Site Supervisor', description: 'Experienced construction foreman and site supervisor', unit: 'days', rate: 2500, category: 'labor', sectors: ['building', 'roads', 'wash'], defaultSection: LABOR_SECTION_CODE, quantityHint: 'Usually 1 foreman for full project duration' },
  { id: 'lab-013', name: 'Site Engineer (Graduate)', description: 'Graduate civil/structural engineer for technical supervision', unit: 'days', rate: 5000, category: 'labor', sectors: ['building', 'roads', 'wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-014', name: 'Quantity Surveyor (QS)', description: 'Qualified QS for measurement and cost control', unit: 'days', rate: 6000, category: 'labor', sectors: ['building', 'roads', 'wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-015', name: 'Plant Operator (heavy)', description: 'Qualified operator for excavator, grader, roller', unit: 'days', rate: 2800, category: 'labor', sectors: ['roads', 'wash'], defaultSection: LABOR_SECTION_CODE, quantityHint: '1 operator required per piece of plant' },
  { id: 'lab-016', name: 'Land Surveyor (Registered)', description: 'Registered land surveyor for alignment and levels', unit: 'days', rate: 4500, category: 'labor', sectors: ['roads', 'wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-017', name: 'Pipe Layer (WASH specialist)', description: 'Specialist pipe layer for water mains installation', unit: 'days', rate: 1800, category: 'labor', sectors: ['wash'], defaultSection: LABOR_SECTION_CODE, quantityHint: '1 team of 3 lays ~50m of pipe per day' },
  { id: 'lab-018', name: 'Certified Pipe Welder', description: 'Certified welder for steel pipe joints', unit: 'days', rate: 2200, category: 'labor', sectors: ['wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-019', name: 'Sanitation Technician', description: 'Sanitation works technician for WASH projects', unit: 'days', rate: 2000, category: 'labor', sectors: ['wash'], defaultSection: LABOR_SECTION_CODE },
  { id: 'lab-020', name: 'Driver / Logistics', description: 'Driver for site logistics and material deliveries', unit: 'days', rate: 1200, category: 'labor', sectors: ['building', 'roads', 'wash'], defaultSection: LABOR_SECTION_CODE },

  // ===== EQUIPMENT & PLANT HIRE =====
  { id: 'eqp-001', name: 'Concrete Mixer (0.5m³ diesel)', description: 'Diesel concrete mixer, 0.5m³ drum capacity', unit: 'days', rate: 1500, category: 'equipment', sectors: ['building', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE, quantityHint: 'Required throughout concrete works period' },
  { id: 'eqp-002', name: 'Concrete Mixer (1m³ diesel)', description: 'Diesel concrete mixer, 1m³ drum capacity', unit: 'days', rate: 2500, category: 'equipment', sectors: ['building'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-003', name: 'Concrete Poker Vibrator', description: 'Electric needle concrete poker vibrator', unit: 'days', rate: 600, category: 'equipment', sectors: ['building', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-004', name: 'Diesel Water Pump (de-watering)', description: 'Diesel water pump for excavation dewatering', unit: 'days', rate: 1000, category: 'equipment', sectors: ['building', 'roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-005', name: 'Generator 5KVA (site power)', description: 'Diesel generator for site power supply', unit: 'days', rate: 2500, category: 'equipment', sectors: ['building', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-006', name: 'Steel Tube Scaffolding (set)', description: 'Steel tube and coupler scaffolding per set per day', unit: 'days', rate: 800, category: 'equipment', sectors: ['building'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-007', name: 'Wheelbarrow', description: 'Heavy duty construction wheelbarrow', unit: 'days', rate: 150, category: 'equipment', sectors: ['building', 'roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-008', name: 'Excavator – 0.8m³ Bucket', description: 'Hydraulic excavator for trenching and earthworks', unit: 'days', rate: 35000, category: 'equipment', sectors: ['building', 'roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE, quantityHint: 'Can excavate ~150-200m³/day in soft soil' },
  { id: 'eqp-009', name: 'Motor Grader', description: 'Motor grader for road shaping, grading and levelling', unit: 'days', rate: 45000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-010', name: 'Bulldozer (D6 size)', description: 'Caterpillar D6 bulldozer for clearing and pushing', unit: 'days', rate: 52000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-011', name: 'Vibratory Roller (10 tonne)', description: '10 tonne smooth drum vibratory roller for compaction', unit: 'days', rate: 28000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE, quantityHint: 'Required for all pavement layer compaction' },
  { id: 'eqp-012', name: 'Plate Compactor (vibratory)', description: 'Vibratory plate compactor for trenches and confined areas', unit: 'days', rate: 3500, category: 'equipment', sectors: ['building', 'roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-013', name: 'Dump Truck (10 tonne)', description: '10 tonne dump truck for materials haulage', unit: 'days', rate: 18000, category: 'equipment', sectors: ['roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE, quantityHint: 'Can carry 6-8m³ per trip' },
  { id: 'eqp-014', name: 'Water Bowser (10,000 litre)', description: '10,000L water bowser for compaction moistening', unit: 'days', rate: 12000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-015', name: 'Asphalt Paver', description: 'Self-propelled asphalt paving machine', unit: 'days', rate: 95000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-016', name: 'Pneumatic Tyre Roller', description: 'Pneumatic tyre roller for bituminous layer compaction', unit: 'days', rate: 45000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-017', name: 'Bitumen Pressure Distributor', description: 'Bitumen pressure distributor for prime and tack coat', unit: 'days', rate: 35000, category: 'equipment', sectors: ['roads'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-018', name: 'HDPE Pipe Butt Fusion Machine', description: 'Butt fusion welding machine for HDPE pipes', unit: 'days', rate: 5000, category: 'equipment', sectors: ['wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-019', name: 'Pipeline Pressure Testing Kit', description: 'Hydraulic pressure test equipment for pipeline testing', unit: 'days', rate: 2500, category: 'equipment', sectors: ['wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-020', name: 'Total Station (surveying)', description: 'Electronic total station for precise setting out', unit: 'days', rate: 8500, category: 'equipment', sectors: ['roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
  { id: 'eqp-021', name: 'GPS Survey Equipment', description: 'DGPS receiver for survey and mapping', unit: 'days', rate: 6500, category: 'equipment', sectors: ['roads', 'wash'], defaultSection: EQUIPMENT_SECTION_CODE },
];

export const getItemsBySector = (sector: SectorType): RateItem[] =>
  RATE_DATABASE.filter(item => item.sectors.includes(sector));

export const getItemsByCategory = (sector: SectorType, category: ItemCategory): RateItem[] =>
  RATE_DATABASE.filter(item => item.sectors.includes(sector) && item.category === category);

export const getMaterialsBySection = (sector: SectorType, sectionCode: string): RateItem[] =>
  RATE_DATABASE.filter(item =>
    item.sectors.includes(sector) &&
    item.category === 'materials' &&
    item.defaultSection === sectionCode
  );

export const getSectionTitle = (sector: SectorType, code: string): string => {
  const section = BOQ_SECTIONS[sector]?.find(s => s.code === code);
  return section ? `${code}. ${section.title}` : code;
};
export const getLaborBySection = (
  sector: SectorType, 
  sectionCode: string
): RateItem[] =>
  RATE_DATABASE.filter(item =>
    item.sectors.includes(sector) &&
    item.category === 'labor' &&
    item.defaultSection === sectionCode
  );

export const getEquipmentBySection = (
  sector: SectorType, 
  sectionCode: string
): RateItem[] =>
  RATE_DATABASE.filter(item =>
    item.sectors.includes(sector) &&
    item.category === 'equipment' &&
    item.defaultSection === sectionCode
  ); 
