import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  SectorType,
  LABOR_SECTION_CODE,
  EQUIPMENT_SECTION_CODE,
  BOQ_SECTIONS,
  LABOR_SECTION_TITLE,
  EQUIPMENT_SECTION_TITLE,
} from '../data/kenyanRates';

export type ItemCategory = 'materials' | 'labor' | 'equipment';

export interface EstimateItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  baseRate: number;
  adjustedRate: number;
  total: number;
  category: ItemCategory;
  sector: SectorType;
  boqSectionCode: string;
  boqSectionTitle: string;
  isCustom: boolean;
  rateAdjusted: boolean;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  sector: SectorType;
  projectType: string;
  notes: string;
  items: EstimateItem[];
  contingencyPercent: number;
  profitMarginPercent: number;
  vatPercent: number;
  projectArea?: number;
  referenceNo: string;
  preparedBy: string;
  projectDate: string;
  createdAt: string;
  updatedAt: string;
}

const createNewProject = (): Project => ({
  id: Date.now().toString(),
  name: '',
  client: '',
  location: 'Nairobi, Kenya',
  sector: 'building',
  projectType: 'Residential',
  notes: '',
  items: [],
  contingencyPercent: 10,
  profitMarginPercent: 15,
  vatPercent: 16,
  referenceNo: '',
  preparedBy: '',
  projectDate: new Date().toISOString().split('T')[0],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

interface AppState {
  currentProject: Project;
  savedProjects: Project[];
}

type Action =
  | { type: 'ADD_ITEM'; payload: Omit<EstimateItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_ITEM'; payload: { id: string; updates: Partial<EstimateItem> } }
  | { type: 'UPDATE_PROJECT'; payload: Partial<Omit<Project, 'id' | 'items' | 'createdAt'>> }
  | { type: 'LOAD_PROJECT'; payload: Project }
  | { type: 'NEW_PROJECT' }
  | { type: 'SAVE_PROJECT' }
  | { type: 'DELETE_SAVED_PROJECT'; payload: string }
  | { type: 'SET_SAVED_PROJECTS'; payload: Project[] }
  | { type: 'CLEAR_ITEMS' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const newItem: EstimateItem = {
        ...action.payload,
        id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      };
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          items: [...state.currentProject.items, newItem],
          updatedAt: new Date().toISOString(),
        },
      };
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          items: state.currentProject.items.filter(i => i.id !== action.payload),
          updatedAt: new Date().toISOString(),
        },
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          items: state.currentProject.items.map(i =>
            i.id === action.payload.id ? { ...i, ...action.payload.updates } : i
          ),
          updatedAt: new Date().toISOString(),
        },
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          ...action.payload,
          updatedAt: new Date().toISOString(),
        },
      };
    case 'LOAD_PROJECT':
      return { ...state, currentProject: action.payload };
    case 'NEW_PROJECT':
      return { ...state, currentProject: createNewProject() };
    case 'SAVE_PROJECT': {
      const existing = state.savedProjects.findIndex(p => p.id === state.currentProject.id);
      const updatedSaved = existing >= 0
        ? state.savedProjects.map((p, i) => i === existing ? state.currentProject : p)
        : [...state.savedProjects, state.currentProject];
      return { ...state, savedProjects: updatedSaved };
    }
    case 'DELETE_SAVED_PROJECT':
      return {
        ...state,
        savedProjects: state.savedProjects.filter(p => p.id !== action.payload),
      };
    case 'SET_SAVED_PROJECTS':
      return { ...state, savedProjects: action.payload };
    case 'CLEAR_ITEMS':
      return {
        ...state,
        currentProject: { ...state.currentProject, items: [], updatedAt: new Date().toISOString() },
      };
    default:
      return state;
  }
}

interface AppContextType {
  currentProject: Project;
  savedProjects: Project[];
  addItem: (item: Omit<EstimateItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<EstimateItem>) => void;
  updateProject: (updates: Partial<Omit<Project, 'id' | 'items' | 'createdAt'>>) => void;
  saveProject: () => void;
  loadProject: (id: string) => void;
  deleteProject: (id: string) => void;
  newProject: () => void;
  clearItems: () => void;
  getProjectTotals: () => {
    subtotal: number;
    contingency: number;
    profitMargin: number;
    baseContractSum: number;
    vat: number;
    grandTotal: number;
  };
  getBoQSections: () => Array<{
    code: string;
    title: string;
    items: EstimateItem[];
    sectionTotal: number;
  }>;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEY = 'kenconstruct_saved_projects';

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    currentProject: createNewProject(),
    savedProjects: [],
  });

  // Load saved projects from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Project[];
        const patched = parsed.map(p => ({
          vatPercent: 16, referenceNo: '', preparedBy: '',
          projectDate: p.createdAt?.split('T')[0] ?? new Date().toISOString().split('T')[0],
          ...p,
        }));
        dispatch({ type: 'SET_SAVED_PROJECTS', payload: patched });
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist saved projects to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.savedProjects));
    } catch {
      // ignore
    }
  }, [state.savedProjects]);

  const getProjectTotals = () => {
    const p = state.currentProject;
    const subtotal = p.items.reduce((sum, i) => sum + i.total, 0);
    const contingency = subtotal * (p.contingencyPercent / 100);
    const profitMargin = subtotal * (p.profitMarginPercent / 100);
    const baseContractSum = subtotal + contingency + profitMargin;
    const vatRate = (p.vatPercent ?? 16) / 100;
    const vat = baseContractSum * vatRate;
    const grandTotal = baseContractSum + vat;
    return { subtotal, contingency, profitMargin, baseContractSum, vat, grandTotal };
  };

  const getBoQSections = () => {
    const sector = state.currentProject.sector;
    const materialSections = BOQ_SECTIONS[sector];
    const items = state.currentProject.items;

    const sections: Array<{ code: string; title: string; items: EstimateItem[]; sectionTotal: number }> = [];

    // Material sections in order
    materialSections.forEach(sec => {
      const sectionItems = items.filter(
        i => i.category === 'materials' && i.boqSectionCode === sec.code
      );
      if (sectionItems.length > 0) {
        sections.push({
          code: sec.code,
          title: `${sec.code}. ${sec.title}`,
          items: sectionItems,
          sectionTotal: sectionItems.reduce((s, i) => s + i.total, 0),
        });
      }
    });

    // Labor section
    const laborItems = items.filter(i => i.category === 'labor');
    if (laborItems.length > 0) {
      sections.push({
        code: LABOR_SECTION_CODE,
        title: LABOR_SECTION_TITLE[sector],
        items: laborItems,
        sectionTotal: laborItems.reduce((s, i) => s + i.total, 0),
      });
    }

    // Equipment section
    const equipItems = items.filter(i => i.category === 'equipment');
    if (equipItems.length > 0) {
      sections.push({
        code: EQUIPMENT_SECTION_CODE,
        title: EQUIPMENT_SECTION_TITLE[sector],
        items: equipItems,
        sectionTotal: equipItems.reduce((s, i) => s + i.total, 0),
      });
    }

    return sections;
  };

  const ctx: AppContextType = {
    currentProject: state.currentProject,
    savedProjects: state.savedProjects,
    addItem: payload => dispatch({ type: 'ADD_ITEM', payload }),
    removeItem: id => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    updateItem: (id, updates) => dispatch({ type: 'UPDATE_ITEM', payload: { id, updates } }),
    updateProject: updates => dispatch({ type: 'UPDATE_PROJECT', payload: updates }),
    saveProject: () => dispatch({ type: 'SAVE_PROJECT' }),
    loadProject: id => {
      const proj = state.savedProjects.find(p => p.id === id);
      if (proj) dispatch({ type: 'LOAD_PROJECT', payload: proj });
    },
    deleteProject: id => dispatch({ type: 'DELETE_SAVED_PROJECT', payload: id }),
    newProject: () => dispatch({ type: 'NEW_PROJECT' }),
    clearItems: () => dispatch({ type: 'CLEAR_ITEMS' }),
    getProjectTotals,
    getBoQSections,
  };

  return <AppContext.Provider value={ctx}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export const formatKES = (n: number) =>
  `KES ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const SECTOR_LABELS: Record<SectorType, string> = {
  building: 'Building Structures',
  roads: 'Roads & Transportation',
  wash: 'WASH',
};

export const SECTOR_COLORS: Record<SectorType, string> = {
  building: 'teal',
  roads: 'amber',
  wash: 'blue',
};
