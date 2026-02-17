
import React, { useState, useMemo, useEffect, useRef } from 'react';
import MilaWidget from './MilaWidget';
import { supabase } from '../lib/supabase';
import {
  Building2,
  Users,
  Settings2,
  Database,
  ShieldCheck,
  Globe,
  UserPlus,
  BarChart3,
  Target,
  Activity,
  ChevronRight,
  RefreshCcw,
  Terminal,
  Save,
  Leaf,
  Edit2,
  X,
  Check,
  Cpu,
  Trophy,
  LayoutDashboard,
  Zap,
  Droplets,
  TrendingUp,
  TriangleAlert,
  Trash2,
  MapPin,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ToggleLeft,
  ToggleRight,
  Lightbulb,
  AlertCircle,
  Award,
  Search,
  CheckCircle2,
  Cloud,
  MessageSquare,
  Plus,
  FileText,
  Calendar,
  FileDigit,
  ChevronDown,
  Unlock,
  Key,
  CheckSquare,
  Square,
  Eye,
  EyeOff,
  UserCheck,
  ChevronUp,
  Scale,
  Lock,
  Calculator,
  Info,
  Link2,
  LogOut,
  DollarSign,
  AlertTriangle
} from 'lucide-react';
import FoodWasteChart from './FoodWasteChart';
import WaterUsageChart from './WaterUsageChart';
import FoodCostTemplateChart from './FoodCostTemplateChart';
import LaborCostTemplateChart from './LaborCostTemplateChart';
import ProfitMarginTemplateChart from './ProfitMarginTemplateChart';
import SalesTemplateChart from './SalesTemplateChart';
import SentimentTemplateChart from './SentimentTemplateChart';
import AvgCheckTemplateChart from './AvgCheckTemplateChart';
import { UserProfile, StaffPosition, Outlet } from '../types';
import Logo from './Logo';

interface DashboardPageProps {
  user: UserProfile;
  onLogout: () => void;
}

// Define brand color constants for visualizations
const brandEco = '#77B139';
const brandEnergy = '#FF914D';
const brandGold = '#C8A413';
const brandDark = '#152E2A';
const brandAlert = '#FF3131';

enum PortalView {
  DASHBOARD = 'dashboard',
  IDENTITY = 'identity',
  TEAM = 'team',
  PARAMETERS = 'parameters',
  SYSTEM = 'system'
}

enum DashboardTab {
  SUMMARIZED = 'summarized',
  FOOD_WASTE = 'food_waste',
  ENERGY_WATER = 'energy_water',
  MILA_AI = 'mila_ai',
  GAMIFICATION = 'gamification'
}

const REGION_DATA: Record<string, string[]> = {
  'Asia': ['Vietnam', 'Kuala Lumpur', 'Singapore', 'Indonesia', 'Bangkok', 'Tokyo', 'Hong Kong'],
  'USA': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'San Francisco'],
  'Mexico': ['Mexico City', 'Cancun', 'Guadalajara', 'Monterrey'],
  'Middle East': ['Dubai', 'Abu Dhabi', 'Riyadh', 'Doha', 'Muscat'],
  'Europe': ['London', 'Paris', 'Berlin', 'Rome', 'Madrid']
};

const TIMEZONES: Record<string, string> = {
  'Vietnam': 'ICT (UTC+7)',
  'Kuala Lumpur': 'MYT (UTC+8)',
  'Singapore': 'SGT (UTC+8)',
  'Indonesia': 'WIB (UTC+7)',
  'Bangkok': 'ICT (UTC+7)',
  'Tokyo': 'JST (UTC+9)',
  'Hong Kong': 'HKT (UTC+8)',
  'New York': 'EDT (UTC-4)',
  'Los Angeles': 'PDT (UTC-7)',
  'Chicago': 'CDT (UTC-5)',
  'Miami': 'EDT (UTC-4)',
  'San Francisco': 'PDT (UTC-7)',
  'Mexico City': 'CST (UTC-6)',
  'Cancun': 'EST (UTC-5)',
  'Guadalajara': 'CST (UTC-6)',
  'Monterrey': 'CST (UTC-6)',
  'Dubai': 'GST (UTC+4)',
  'Abu Dhabi': 'GST (UTC+4)',
  'Riyadh': 'AST (UTC+3)',
  'Doha': 'AST (UTC+3)',
  'Muscat': 'GST (UTC+4)',
  'London': 'BST (UTC+1)',
  'Paris': 'CEST (UTC+2)',
  'Berlin': 'CEST (UTC+2)',
  'Rome': 'CEST (UTC+2)',
  'Madrid': 'CEST (UTC+2)'
};

const BENCHMARK_PROFILES: Record<string, { waste: number; water: number; energy: number; foodCost: number; laborCost: number }> = {
  'ASEAN Luxury Hotels': { waste: 80, water: 25000, energy: 1000, foodCost: 30, laborCost: 18 },
  'European Michelin Standard': { waste: 60, water: 20000, energy: 800, foodCost: 32, laborCost: 25 },
  'North American Premium': { waste: 100, water: 30000, energy: 1200, foodCost: 28, laborCost: 20 },
  'Middle East Luxury Collection': { waste: 90, water: 40000, energy: 1500, foodCost: 25, laborCost: 15 },
};

const AVAILABLE_PERMISSIONS = [
  'Daily Dashboard Review',
  'Review Alerts and Suggestion',
  'Print report',
  'Entry input data',
  'Review Basic users input data',
  'Access photo library',
  'Add comments',
  'Snapshot images',
  'Input data reminders',
  'Alert missing data',
  'Receive notifications',
  'Sustainability Insights',
  'Full Dashboard Review',
  'Admin Control',
  'AI Mila full Interaction',
  'AI Mila Limited Interaction'
];

const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  'Admin': AVAILABLE_PERMISSIONS,
  'Supervisor': [
    'Daily Dashboard Review',
    'Review Alerts and Suggestion',
    'Print report',
    'Entry input data',
    'Review Basic users input data',
    'Add comments',
    'Receive notifications',
    'AI Mila full Interaction'
  ],
  'Basic': [
    'Entry input data',
    'Access photo library',
    'Add comments',
    'Snapshot images',
    'Input data reminders',
    'Alert missing data',
    'Receive notifications',
    'AI Mila Limited Interaction'
  ],
  'View': [
    'Full Dashboard Review',
    'Print report',
    'Sustainability Insights',
    'AI Mila Limited Interaction'
  ]
};

const POSITION_TO_ROLE: Record<string, string> = {
  'Admin': 'Admin',
  'Exec Chef': 'Supervisor',
  'Outlet Manager': 'Supervisor',
  'Chef Prep': 'Basic',
  'GM': 'View'
};

// Mock Data for KPI Charts (Duplicated from SupervisorDashboard)
const weeklyTrends = [
  { day: 'Sun', foodCost: 27.5, laborCost: 26, profitMargin: 14.8, sentiment: 4.8 },
  { day: 'Mon', foodCost: 29.2, laborCost: 30, profitMargin: 19.5, sentiment: 4.2 },
  { day: 'Tue', foodCost: 28.1, laborCost: 28, profitMargin: 19.2, sentiment: 4.6 },
  { day: 'Wed', foodCost: 28.5, laborCost: 36, profitMargin: 24.2, sentiment: 4.9 },
  { day: 'Thu', foodCost: 27.8, laborCost: 28, profitMargin: 16.9, sentiment: 4.4 },
  { day: 'Fri', foodCost: 30.5, laborCost: 37, profitMargin: 24.0, sentiment: 4.7 },
  { day: 'Sat', foodCost: 29.8, laborCost: 33, profitMargin: 21.0, sentiment: 4.8 },
];

// Specific Data for Sales Stacked Bar Chart (Duplicated from SupervisorDashboard)
const salesChartData = [
  { day: 'Sun', total: 16000, food: 6400, bev: 9600 },
  { day: 'Mon', total: 13000, food: 5200, bev: 7800 },
  { day: 'Tue', total: 14500, food: 5800, bev: 8700 },
  { day: 'Wed', total: 26000, food: 10400, bev: 15600 },
  { day: 'Thu', total: 17000, food: 6800, bev: 10200 },
  { day: 'Fri', total: 25000, food: 10000, bev: 15000 },
  { day: 'Sat', total: 31000, food: 12400, bev: 18600 },
];

const Sparkline: React.FC<{ color: string, data: number[] }> = ({ color, data }) => (
  <div className="w-full h-12 sm:h-16 mt-4 sm:mt-6">
    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / Math.max(...data, 100) * 80)}`).join(' ')}
      />
      {data.map((val, i) => (
        <circle key={i} cx={`${(i / (data.length - 1)) * 100}`} cy={`${100 - (val / Math.max(...data, 100) * 80)}`} r="3" fill={color} />
      ))}
    </svg>
  </div>
);

// Default Outlets Fallback
// Default Outlets Fallback
const DEFAULT_OUTLETS: Outlet[] = [
  { name: 'Royal', code: 'ROY02', color_hex: '#FF7000' },     // Brighter Orange
  { name: 'Fisher’s', code: 'FISH01', color_hex: '#B8860B' }, // Darker Mustard Yellow
  { name: 'Ralph’s', code: 'RAL03', color_hex: '#32CD32' },   // Green (Lime)
  { name: 'Gusto', code: 'GUS04', color_hex: '#808080' }      // Grey
];

// Mock Data for Admin Multi-Outlet View (Fallback)
const ADMIN_MOCK_DATA = [
  // Royal (Gold) - High Cost (Adjusted to 27.5% - 31.5%)
  { day: 'Sun', foodCost: 28.5, outlet_code: 'ROY02' }, { day: 'Mon', foodCost: 29.2, outlet_code: 'ROY02' },
  { day: 'Tue', foodCost: 31.0, outlet_code: 'ROY02' }, { day: 'Wed', foodCost: 27.8, outlet_code: 'ROY02' },
  { day: 'Thu', foodCost: 30.5, outlet_code: 'ROY02' }, { day: 'Fri', foodCost: 29.5, outlet_code: 'ROY02' },
  { day: 'Sat', foodCost: 31.2, outlet_code: 'ROY02' },

  // Fisher's (Blue) - Stable
  { day: 'Sun', foodCost: 28.5, outlet_code: 'FISH01' }, { day: 'Mon', foodCost: 29.2, outlet_code: 'FISH01' },
  { day: 'Tue', foodCost: 27.8, outlet_code: 'FISH01' }, { day: 'Wed', foodCost: 30.1, outlet_code: 'FISH01' },
  { day: 'Thu', foodCost: 29.5, outlet_code: 'FISH01' }, { day: 'Fri', foodCost: 28.9, outlet_code: 'FISH01' },
  { day: 'Sat', foodCost: 31.2, outlet_code: 'FISH01' },

  // Ralph's (Lime) - Efficient
  { day: 'Sun', foodCost: 25.5, outlet_code: 'RAL03' }, { day: 'Mon', foodCost: 26.2, outlet_code: 'RAL03' },
  { day: 'Tue', foodCost: 25.8, outlet_code: 'RAL03' }, { day: 'Wed', foodCost: 27.1, outlet_code: 'RAL03' },
  { day: 'Thu', foodCost: 26.5, outlet_code: 'RAL03' }, { day: 'Fri', foodCost: 25.9, outlet_code: 'RAL03' },
  { day: 'Sat', foodCost: 26.8, outlet_code: 'RAL03' },

  // Gusto (Orange) - Critical (Adjusted to 28.2% - 33%)
  { day: 'Sun', foodCost: 30.5, outlet_code: 'GUS04' }, { day: 'Mon', foodCost: 32.8, outlet_code: 'GUS04' },
  { day: 'Tue', foodCost: 29.5, outlet_code: 'GUS04' }, { day: 'Wed', foodCost: 31.2, outlet_code: 'GUS04' },
  { day: 'Thu', foodCost: 28.9, outlet_code: 'GUS04' }, { day: 'Fri', foodCost: 32.1, outlet_code: 'GUS04' },
  { day: 'Sat', foodCost: 30.0, outlet_code: 'GUS04' },
];

// Mock Data for Admin Labor Cost View (Fallback)
const ADMIN_LABOR_MOCK_DATA = [
  // Royal (Orange) - Spikes (Banquets/Midweek Event)
  { day: 'Sun', laborCost: 26.5, outlet_code: 'ROY02' }, { day: 'Mon', laborCost: 27.2, outlet_code: 'ROY02' },
  { day: 'Tue', laborCost: 26.8, outlet_code: 'ROY02' }, { day: 'Wed', laborCost: 35.0, outlet_code: 'ROY02' }, // Midweek Spike
  { day: 'Thu', laborCost: 27.5, outlet_code: 'ROY02' }, { day: 'Fri', laborCost: 37.5, outlet_code: 'ROY02' }, // Friday Banquet
  { day: 'Sat', laborCost: 38.0, outlet_code: 'ROY02' }, // Saturday Banquet

  // Fisher's (Brown) - Stable
  { day: 'Sun', laborCost: 22.5, outlet_code: 'FISH01' }, { day: 'Mon', laborCost: 23.2, outlet_code: 'FISH01' },
  { day: 'Tue', laborCost: 24.8, outlet_code: 'FISH01' }, { day: 'Wed', laborCost: 23.1, outlet_code: 'FISH01' },
  { day: 'Thu', laborCost: 22.5, outlet_code: 'FISH01' }, { day: 'Fri', laborCost: 25.9, outlet_code: 'FISH01' },
  { day: 'Sat', laborCost: 26.2, outlet_code: 'FISH01' },

  // Ralph's (Green) - Efficient
  { day: 'Sun', laborCost: 20.5, outlet_code: 'RAL03' }, { day: 'Mon', laborCost: 21.2, outlet_code: 'RAL03' },
  { day: 'Tue', laborCost: 20.8, outlet_code: 'RAL03' }, { day: 'Wed', laborCost: 21.5, outlet_code: 'RAL03' },
  { day: 'Thu', laborCost: 20.5, outlet_code: 'RAL03' }, { day: 'Fri', laborCost: 22.9, outlet_code: 'RAL03' },
  { day: 'Sat', laborCost: 23.8, outlet_code: 'RAL03' },

  // Gusto (Grey) - High Avg
  { day: 'Sun', laborCost: 28.5, outlet_code: 'GUS04' }, { day: 'Mon', laborCost: 29.2, outlet_code: 'GUS04' },
  { day: 'Tue', laborCost: 28.8, outlet_code: 'GUS04' }, { day: 'Wed', laborCost: 29.1, outlet_code: 'GUS04' },
  { day: 'Thu', laborCost: 28.5, outlet_code: 'GUS04' }, { day: 'Fri', laborCost: 30.9, outlet_code: 'GUS04' },
  { day: 'Sat', laborCost: 31.8, outlet_code: 'GUS04' },
];

// Mock Data for Admin Labor Cost View (Fallback)


const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<PortalView>(PortalView.DASHBOARD);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>(DashboardTab.SUMMARIZED);
  // (Assuming other state init is here...)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [isPermDropdownOpen, setIsPermDropdownOpen] = useState(false);
  const permRef = useRef<HTMLDivElement>(null);
  const [showApiInfo, setShowApiInfo] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Lock states for Edit mode
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingAudit, setIsEditingAudit] = useState(false);
  const [isEditingBenchmarks, setIsEditingBenchmarks] = useState(false);
  const [isEditingApis, setIsEditingApis] = useState(false);

  // Enrollment Form State
  const [enrollId, setEnrollId] = useState<string | null>(null);
  const [enrollName, setEnrollName] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPosition, setEnrollPosition] = useState('');
  const [enrollOutlet, setEnrollOutlet] = useState('');
  const [enrollRole, setEnrollRole] = useState('');
  const [enrollPermissions, setEnrollPermissions] = useState<string[]>([]);
  const [genPassword, setGenPassword] = useState('');
  const [genLink, setGenLink] = useState('');

  // Shared Administrative Core State
  const [outlets, setOutlets] = useState<Outlet[]>(DEFAULT_OUTLETS); // Default to hardcoded if DB empty

  const [sequenceCounter, setSequenceCounter] = useState(2);

  const [company, setCompany] = useState({
    name: 'Grand Hyatt Regency',
    region: 'Asia',
    country: 'Thailand',
    city: 'Bangkok',
    adminPhone: '+66 8 987 6543',
    currentOutletName: '',
    currentOutletCode: 'XXXX00',
    smsNotifications: true
  });

  // Specific Data States for Charts
  const [foodCostLogs, setFoodCostLogs] = useState<any[]>([]);
  const [laborCostLogs, setLaborCostLogs] = useState<any[]>([]);


  useEffect(() => {
    const fetchOperationalData = async () => {
      // 1. Fetch Outlets (Platform Valid Sources)
      const { data: outletData, error: outletError } = await supabase
        .from('outlets')
        .select('*');

      let currentOutlets: Outlet[] = [];

      if (outletData) {
        // Deduplicate outlets by code to prevent legend issues
        const uniqueOutlets = Array.from(new Map(outletData.map((o: any) => [o.code, o])).values()) as Outlet[];
        setOutlets(uniqueOutlets);
        localStorage.setItem('ecometricus_outlets_v2', JSON.stringify(uniqueOutlets));
        currentOutlets = uniqueOutlets;
      } else {
        console.error("Error fetching outlets:", outletError);
        // Fallback to local storage if API fails (or init default if empty)
        // V2 Key to force fresh start if V1 was corrupted
        const saved = localStorage.getItem('ecometricus_outlets_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          // Deduplicate saved data as well to prevent persistent corruption
          const uniqueSaved = Array.from(new Map(parsed.map((o: any) => [o.code, o])).values()) as Outlet[];
          setOutlets(uniqueSaved);
          currentOutlets = uniqueSaved;
        } else {
          currentOutlets = DEFAULT_OUTLETS;
          setOutlets(DEFAULT_OUTLETS);
        }
      }

      // Create a map of Outlet ID (UUID) -> Outlet Code (e.g. ROY02)
      const outletMap = new Map<string, string>();
      // Also map from ID to Name if needed, or Code to ID
      if (outletData) {
        outletData.forEach((o: any) => {
          outletMap.set(o.id, o.code);
        });
      }

      // Helper to validate if a code exists in our current known outlets
      const isValidOutlet = (code: string) => currentOutlets.some(o => o.code === code);

      // 2. Fetch Food Cost Logs based on Role
      let query = supabase.from('food_cost_logs').select('*');

      // Supervisor Restriction: Only see own outlet
      // Admin sees ALL (no filter applied)
      if (user.role !== 'admin' && user.outletCode) {
        const userOutlet = currentOutlets.find((o: any) => o.code === user.outletCode);
        if (userOutlet && (userOutlet as any).id) {
          query = query.eq('outlet_id', (userOutlet as any).id);
        }
      }

      const { data: logs, error: logError } = await query;

      if (logs) {
        // Map the raw data to the shape the chart expects
        // CRITICAL FIX: Map outlet_id (UUID) to outlet_code (e.g. ROY02) using the map
        const mappedLogs = logs.map(log => {
          const mappedCode = outletMap.get(log.outlet_id) || log.outlet_id;
          return {
            day: new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
            foodCost: parseFloat(log.value),
            outlet_code: mappedCode,
            created_at: log.created_at
          };
        })
          // Filter out logs that don't match a known valid outlet code (prevents broken lines)
          .filter(log => isValidOutlet(log.outlet_code))
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        // If filtering leaves us with valid data, use it. Otherwise set empty to trigger mock fallback.
        setFoodCostLogs(mappedLogs);
      } else {
        setFoodCostLogs([]);
      }

      // 3. Fetch Labor Cost Logs based on Role
      let laborQuery = supabase.from('labor_cost_logs').select('*');

      // Supervisor Restriction: Only see own outlet
      if (user.role !== 'admin' && user.outletCode) {
        const userOutlet = currentOutlets.find((o: any) => o.code === user.outletCode);
        if (userOutlet && (userOutlet as any).id) {
          laborQuery = laborQuery.eq('outlet_id', (userOutlet as any).id);
        }
      }

      const { data: laborLogs, error: laborError } = await laborQuery;

      if (laborLogs) {
        const mappedLaborLogs = laborLogs.map(log => {
          const mappedCode = outletMap.get(log.outlet_id) || log.outlet_id;
          return {
            day: new Date(log.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
            laborCost: parseFloat(log.value),
            outlet_code: mappedCode,
            created_at: log.created_at
          };
        })
          .filter(log => isValidOutlet(log.outlet_code))
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        setLaborCostLogs(mappedLaborLogs);
      } else {
        setLaborCostLogs([]);
      }
    };



    fetchOperationalData();
  }, [user.role, user.outletCode]);

  const [auditReport, setAuditReport] = useState({
    cycle: 'Monthly',
    fromDate: '',
    toDate: '',
    outletSelection: 'All outlets',
    comments: ''
  });

  const [users, setUsers] = useState<(UserProfile & { password?: string })[]>([
    { id: '1', fullName: 'Alexander Pierce', email: 'a.pierce@hotel.com', role: 'admin' as any, position: 'Admin' as any, outletCode: 'ROY02', password: 'ADMIN_BACKUP_123' },
    { id: '2', fullName: 'Sarah Chen', email: 's.chen@hotel.com', role: 'supervisor' as any, position: 'Exec Chef' as any, outletCode: 'FISH01', password: 'CHEF_BACKUP_456' },
    { id: '3', fullName: 'Marcus Vain', email: 'm.vain@hotel.com', role: 'gm' as any, position: 'GM' as any, outletCode: 'ROY02', password: 'GM_MASTER_789' }
  ]);

  const [params, setParams] = useState({
    wasteUnit: 'kg',
    wasteTarget: 100,
    waterTarget: 30000,
    energyTarget: 1200,
    foodCostTarget: 28.5,
    laborCostTarget: 15,
    benchmarkRegion: 'ASEAN Luxury Hotels',
    selectedManualOutlet: '',
    alertsActive: true,
    milaLogic: true,
    posApiKey: '',
    crmApiKey: '',
    pmsApiKey: ''
  });

  const [manualOutletSettings, setManualOutletSettings] = useState<Record<string, any>>({});

  // Persist outlets to localStorage for session continuity (V2 Key)
  useEffect(() => {
    localStorage.setItem('ecometricus_outlets_v2', JSON.stringify(outlets));
  }, [outlets]);

  // Handle auto-mapping roles/permissions when position changes
  useEffect(() => {
    if (enrollPosition && !enrollId) {
      const roleKey = POSITION_TO_ROLE[enrollPosition] || 'View';
      setEnrollRole(roleKey);
      setEnrollPermissions(ROLE_DEFAULT_PERMISSIONS[roleKey] || []);
    }
  }, [enrollPosition, enrollId]);

  // Handle click outside for permissions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (permRef.current && !permRef.current.contains(event.target as Node)) {
        setIsPermDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logic for automatic sequential outlet code adjustment
  useEffect(() => {
    const cleanName = company.currentOutletName.trim().toLowerCase();
    if (cleanName.length >= 2) {
      const existing = outlets.find(o => o.name.toLowerCase() === cleanName);
      if (existing) {
        setCompany(prev => ({ ...prev, currentOutletCode: existing.code }));
      } else {
        const base = company.currentOutletName.substring(0, 4).replace(/[^a-zA-Z]/g, '').padEnd(3, 'X').toUpperCase();
        const code = `${base}${String(sequenceCounter + 1).padStart(2, '0')}`;
        setCompany(prev => ({ ...prev, currentOutletCode: code }));
      }
    }
  }, [company.currentOutletName, outlets, sequenceCounter]);

  // Load per-outlet settings when manual outlet selection changes
  useEffect(() => {
    if (params.benchmarkRegion === 'Manual' && params.selectedManualOutlet) {
      const saved = manualOutletSettings[params.selectedManualOutlet];
      if (saved) {
        setParams(prev => ({ ...prev, ...saved }));
      }
    }
  }, [params.selectedManualOutlet, params.benchmarkRegion]);



  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleEnroll = () => {
    if (!enrollName || !enrollEmail || !enrollPosition || !enrollOutlet) {
      alert("Please complete all enrollment fields.");
      return;
    }

    const password = enrollId
      ? (users.find(u => u.id === enrollId)?.password || Math.random().toString(36).slice(-8).toUpperCase())
      : Math.random().toString(36).slice(-8).toUpperCase();

    const link = `https://ecometricus.app/access/${enrollOutlet}?token=${password.toLowerCase()}`;

    if (enrollId) {
      setUsers(prev => prev.map(u => u.id === enrollId ? {
        ...u,
        fullName: enrollName,
        email: enrollEmail,
        position: enrollPosition as any,
        outletCode: enrollOutlet,
        role: enrollRole.toLowerCase() as any,
        permissions: enrollPermissions,
        password: password
      } : u));
    } else {
      const newUser: UserProfile & { password?: string } = {
        id: Date.now().toString(),
        fullName: enrollName,
        email: enrollEmail,
        role: enrollRole.toLowerCase() as any,
        position: enrollPosition as any,
        outletCode: enrollOutlet,
        permissions: enrollPermissions,
        password: password
      };
      setUsers(prev => [...prev, newUser]);
    }

    setGenPassword(password);
    setGenLink(link);

    setEnrollId(null);
    setEnrollName('');
    setEnrollEmail('');
    setEnrollPosition('');
    setEnrollOutlet('');
    setEnrollRole('');
    setEnrollPermissions([]);

    alert(`Personnel record for ${enrollName || 'staff'} has been processed. Access credentials generated below.`);
  };

  const handleEdit = (user: UserProfile & { password?: string }) => {
    setEnrollId(user.id);
    setEnrollName(user.fullName);
    setEnrollEmail(user.email);
    setEnrollPosition(user.position);
    setEnrollOutlet(user.outletCode);
    const roleKey = Object.keys(ROLE_DEFAULT_PERMISSIONS).find(k => k.toLowerCase() === user.role.toLowerCase()) || 'View';
    setEnrollRole(roleKey);
    setEnrollPermissions(user.permissions || ROLE_DEFAULT_PERMISSIONS[roleKey]);
    setGenPassword(user.password || '');
    setGenLink(`https://ecometricus.app/access/${user.outletCode}?token=${(user.password || '').toLowerCase()}`);

    const form = document.getElementById('enrollment-form');
    form?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddOutlet = () => {
    if (!company.currentOutletName) return;
    const cleanName = company.currentOutletName.trim();
    const existing = outlets.find(o => o.name.toLowerCase() === cleanName.toLowerCase());

    if (!existing) {
      const newOutlet: Outlet = { name: cleanName, code: company.currentOutletCode };
      setOutlets(prev => [...prev, newOutlet]);
      setSequenceCounter(prev => prev + 1);
      setCompany(prev => ({ ...prev, currentOutletName: '', currentOutletCode: 'XXXX00' }));
    } else {
      alert("Outlet already registered in core session.");
    }
  };

  const handleRemoveOutlet = (code: string) => {
    if (confirm(`Remove outlet ${code} from registry?`)) {
      setOutlets(prev => prev.filter(o => o.code !== code));
    }
  };

  const togglePermission = (perm: string) => {
    setEnrollPermissions(prev =>
      prev.includes(perm) ? prev.filter(p => p !== perm) : [...prev, perm]
    );
  };

  const currentTimezone = useMemo(() => {
    return TIMEZONES[company.city] || 'UTC';
  }, [company.city]);

  const handleSaveAll = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setIsEditingIdentity(false);
      setIsEditingAudit(false);
      setIsEditingBenchmarks(false);
      setIsEditingApis(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleSaveBenchmarks = () => {
    if (params.benchmarkRegion === 'Manual' && params.selectedManualOutlet) {
      setManualOutletSettings(prev => ({
        ...prev,
        [params.selectedManualOutlet]: {
          wasteTarget: params.wasteTarget,
          waterTarget: params.waterTarget,
          energyTarget: params.energyTarget,
          foodCostTarget: params.foodCostTarget,
          laborCostTarget: params.laborCostTarget,
          wasteUnit: params.wasteUnit
        }
      }));
    }
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setIsEditingBenchmarks(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleSaveApis = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('success');
      setIsEditingApis(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleGetReport = () => {
    alert(`Generating ${auditReport.cycle} Audit Report for ${auditReport.outletSelection}...\n(Digital ESG Workflow Active)`);
  };

  const rawJson = useMemo(() => JSON.stringify({
    system: "Ecometricus Administrative Core v3.0.0",
    status: "ACTIVE",
    identity: company,
    outlet_registry: outlets,
    audit_config: auditReport,
    parameters: params,
    manual_overrides: manualOutletSettings,
    personnel_count: users.length,
    sync_window: "12:00 AM Local",
    timezone: currentTimezone,
    user_registry: users.map(u => ({
      name: u.fullName,
      role: u.role,
      permissions: u.permissions || []
    }))
  }, null, 2), [company, outlets, auditReport, params, users, currentTimezone, manualOutletSettings]);

  const SidebarItem: React.FC<{ view: PortalView; icon: React.ElementType; label: string }> = ({ view, icon: Icon, label }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group whitespace-nowrap ${activeView === view ? 'bg-brand-gold text-brand-dark shadow-lg scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={16} className={activeView === view ? 'text-brand-dark' : 'text-brand-gold'} />
      <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
    </button>
  );

  // Benchmarking Engine Values derived from selected profile
  const isManualBenchmark = params.benchmarkRegion === 'Manual';
  const effectiveParams = useMemo(() => {
    if (!isManualBenchmark && BENCHMARK_PROFILES[params.benchmarkRegion]) {
      const profile = BENCHMARK_PROFILES[params.benchmarkRegion];
      return {
        ...params,
        wasteTarget: profile.waste,
        waterTarget: profile.water,
        energyTarget: profile.energy,
        foodCostTarget: profile.foodCost,
        laborCostTarget: profile.laborCost,
      };
    }
    return params;
  }, [params, isManualBenchmark]);

  const isMetricCardEditable = (isManualBenchmark && isEditingBenchmarks);

  // DUPLICATION: Session Data Logic for Mila Actionable Intelligence
  const [sessionWasteEntries, setSessionWasteEntries] = useState<any[]>([]);
  const [sessionResourceEntries, setSessionResourceEntries] = useState<any[]>([]);

  useEffect(() => {
    const savedWaste = localStorage.getItem('ecometricus_waste_entries');
    const savedResources = localStorage.getItem('ecometricus_resource_entries');
    if (savedWaste) setSessionWasteEntries(JSON.parse(savedWaste));
    if (savedResources) setSessionResourceEntries(JSON.parse(savedResources));
  }, []);

  const sessionData = useMemo(() => {
    // "Cumulative Data Reporting module (aggregating kitchen prep inputs from all outlets)"
    // Since we share one localStorage for this demo, we treat the session entries as the global cumulative.
    const totalWasteKg = sessionWasteEntries.reduce((sum, e) => sum + e.amount, 0);
    const totalWaterUsage = sessionResourceEntries.filter(e => e.type === 'water').reduce((sum, e) => sum + e.amount, 0);
    const totalEnergyUsage = sessionResourceEntries.filter(e => e.type === 'energy').reduce((sum, e) => sum + e.amount, 0);

    const costPerItemUnit = 7.50;
    const costPerDisposalUnit = 1.25;
    const carbonCoeff = 2.85;
    const waterCoeff = 3.40;

    const financialLossItems = totalWasteKg * costPerItemUnit;
    const financialLossDisposal = totalWasteKg * costPerDisposalUnit;
    const totalFinancialLoss = financialLossItems + financialLossDisposal;

    // Use Admin Parameters for Benchmarks
    const wasteBenchmark = effectiveParams.wasteTarget;

    return {
      waste: {
        kg: totalWasteKg || 142.5,
        cost: financialLossItems || 1068.75,
        disposalCost: financialLossDisposal || 178.10
      },
      water: totalWaterUsage || 12450,
      energy: totalEnergyUsage || 480,
      impacts: {
        carbonImpact: (totalWasteKg || 142.5) * carbonCoeff,
        waterFootprint: (totalWasteKg || 142.5) * waterCoeff,
        totalFinancialLoss: totalFinancialLoss || 1246.85,
        isDeviating: (totalWasteKg || 142.5) > wasteBenchmark
      }
    };
  }, [sessionWasteEntries, sessionResourceEntries, effectiveParams.wasteTarget]);

  const impacts = sessionData.impacts;

  // Aggregate Context for Admin Intelligence
  const adminContext = {
    user: { name: 'Admin', role: 'administrator' },
    page: 'Admin Overview',
    benchmarks: {
      waste: 100,
      foodCost: 28.0,
      laborCost: 30.0,
      profitMargin: 15.0
    },
    // Real-time aggregate data
    metrics: {
      totalOutlets: outlets.length,
      activeOutlets: new Set([...sessionWasteEntries.map(e => e.outletId), ...sessionResourceEntries.map(e => e.outletId)]).size,
      financials: impacts, // Inherit the calculated impacts
      wasteVolume: sessionData.waste.kg,
      efficiencyScore: Math.round((impacts.carbonImpact / (sessionData.waste.kg || 1)) * 100) // Rough metric
    },
    // Pass raw session data for deep reasoning if needed
    recentLogs: sessionWasteEntries.slice(-10), // Last 10 entries for context
    marketingModality: "Admin-Level Strategic Oversight",
    activeAlerts: {
      kpi: impacts.totalFinancialLoss > 500, // Mock threshold for Admin
      sustainability: impacts.isDeviating
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      {/* Header Profile - Linked with Admin Outlet Data */}
      <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-xl border-b-2 border-brand-gold/50 h-24 sm:h-32 shrink-0 shadow-lg px-4 sm:px-8">
        <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" withLabel />
            <div className="hidden xs:block">
              <h1 className="text-base font-geometric font-bold text-white uppercase tracking-tight">Ecometricus Portal</h1>
              <p className="text-[8px] font-black text-brand-gold uppercase tracking-[0.4em]">Admin Command — {company.currentOutletCode || 'GLOBAL'}</p>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-geometric font-bold text-white uppercase tracking-tight">
              {user.fullName} | <span className="text-brand-gold">{user.position}</span>
            </span>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mt-0.5">
              Outlet: <span className="text-white">{company.currentOutletName || 'All Outlets'}</span>
            </span>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <Clock size={12} className="text-brand-gold/60" />
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-3 py-1 bg-brand-dark rounded-full border border-brand-alert/30 text-brand-alert hover:bg-brand-alert hover:text-white text-[8px] font-black uppercase tracking-widest transition-all shadow-lg ml-2"
              >
                <LogOut size={10} /> Exit
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent shadow-[0_0_15px_#C8A413]"></div>
      </header>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8 flex-grow overflow-hidden">
        {/* Horizontal Navigation Menu - Stacked Layout */}
        <div className="w-full bg-brand-dark border border-brand-gold/20 rounded-[24px] px-8 py-6 flex flex-col gap-6 shadow-xl backdrop-blur-sm shrink-0">

          {/* Top Row: Title & Action Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-geometric font-black text-white uppercase leading-none tracking-tight">
                ADMINISTRATIVE <span className="text-brand-gold">CORE HUB</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mt-2 ml-1">Access Level: Global</p>
            </div>

            {activeView !== PortalView.DASHBOARD && activeView !== PortalView.SYSTEM && (
              <button
                onClick={handleSaveAll}
                disabled={saveStatus !== 'idle'}
                className={`w-full sm:w-auto bg-brand-eco text-brand-dark px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl ${saveStatus === 'saving' ? 'opacity-70 cursor-wait' : ''}`}
              >
                {saveStatus === 'saving' ? <RefreshCcw size={16} className="animate-spin" /> : <Save size={16} />}
                {activeView === PortalView.TEAM ? "Role Saved" : "Update HUB"}
              </button>
            )}
          </div>

          {/* Bottom Row: Navigation Tabs */}
          <div className="w-full h-[1px] bg-brand-gold/10"></div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide w-full pb-1">
            <SidebarItem view={PortalView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem view={PortalView.IDENTITY} icon={Building2} label="Identity" />
            <SidebarItem view={PortalView.TEAM} icon={Users} label="Personnel" />
            <SidebarItem view={PortalView.PARAMETERS} icon={Settings2} label="Parameters" />
            <SidebarItem view={PortalView.SYSTEM} icon={Database} label="System" />
          </div>
        </div>

        <>
          <main className="flex-grow flex flex-col min-w-0 min-h-0 overflow-hidden">
            <div className="bg-brand-dark border border-brand-gold/20 rounded-[30px] sm:rounded-[40px] p-5 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-sm flex-grow flex flex-col overflow-hidden">
              {/* Main View Header */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 sm:mb-12 shrink-0">
                <div className="max-w-full">
                  <h3 className="text-2xl sm:text-3xl font-geometric font-bold text-white uppercase tracking-tight truncate">
                    {activeView === PortalView.DASHBOARD && "Operational Insights"}
                    {activeView === PortalView.IDENTITY && "Company Identity"}
                    {activeView === PortalView.TEAM && "Staff Registry"}
                    {activeView === PortalView.PARAMETERS && "The Benchmarking Engine"}
                    {activeView === PortalView.SYSTEM && "Diagnostics"}
                  </h3>
                  <p className="text-gray-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1">
                    {activeView === PortalView.DASHBOARD && "Real-time F&B Sustainability Tracking"}
                    {activeView === PortalView.IDENTITY && "Manage Profile & Audit Protocols"}
                    {activeView === PortalView.TEAM && "Role & Permission Registry"}
                    {activeView === PortalView.PARAMETERS && "System Logic: Metric Units & KPI Thresholds"}
                    {activeView === PortalView.SYSTEM && "Raw System Response Stream"}
                  </p>
                </div>
              </div>

              <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
                {activeView === PortalView.DASHBOARD && (
                  <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col flex-grow overflow-y-auto scrollbar-hide pr-2">
                    <div className="flex overflow-x-auto gap-2 p-1.5 bg-brand-dark border border-white/5 rounded-2xl w-full sm:w-fit shrink-0 scrollbar-hide">
                      {[
                        { id: DashboardTab.SUMMARIZED, label: 'Overview', icon: TrendingUp },
                        { id: DashboardTab.FOOD_WASTE, label: 'Food Waste', icon: Leaf },
                        { id: DashboardTab.ENERGY_WATER, label: 'Resource flows', icon: Zap },
                        { id: DashboardTab.MILA_AI, label: 'Mila AI', icon: Cpu },
                        { id: DashboardTab.GAMIFICATION, label: 'Gamification', icon: Award },
                      ].map((tab) => (
                        <button key={tab.id} onClick={() => setDashboardTab(tab.id)} className={`whitespace-nowrap flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest transition-all ${dashboardTab === tab.id ? 'bg-brand-gold text-brand-dark' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                          <tab.icon size={14} /> {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* ADMIN CONTEXT FOR MILA WIDGET */}
                    {/* ADMIN CONTEXT DEFINED ABOVE */}

                    <div className="flex-grow">
                      {dashboardTab === DashboardTab.SUMMARIZED && (
                        <>
                          {/* MILA ACTIONABLE INTELLIGENCE - ADMIN CUMULATIVE VIEW */}
                          {/* "Mount this duplicate at the absolute top of the Overview tab content... directly above the Earth Keeper Engagement % chart" */}
                          <div className="w-full max-w-full mb-8">
                            <div className="bg-[#0f2420] border-2 border-brand-gold/60 rounded-[40px] p-8 sm:p-14 relative overflow-hidden group shadow-2xl">
                              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <MessageSquare size={160} className="text-brand-gold" />
                              </div>
                              <div className="flex items-center gap-6 mb-12">
                                <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(200,164,19,0.4)] border-2 border-white/20 shrink-0">
                                  <Cpu className="text-brand-dark" size={32} />
                                </div>
                                <div>
                                  <h3 className="text-2xl font-geometric font-black text-white uppercase tracking-tight leading-none">MILA ACTIONABLE INTELLIGENCE: Cumulative Data Reporting</h3>
                                  <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mt-2">Global Operational ESG Strategy Hub</p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 text-left">
                                {/* Carbon Impact from Waste */}
                                <div className="space-y-4 p-8 bg-brand-dark/40 rounded-[32px] border-2 border-white/10 shadow-inner group/card hover:border-brand-gold/40 transition-all">
                                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-3">
                                    <Cloud size={16} /> Carbon Lifecycle
                                  </span>
                                  <div className="text-3xl font-black text-white transition-all group-hover/card:text-brand-gold">
                                    {impacts.carbonImpact.toFixed(1)} <span className="text-[11px] font-light text-gray-500 uppercase">KG CO2E</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <AlertTriangle className="text-brand-alert" size={14} />
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Operational Deviation Impact.</p>
                                  </div>
                                </div>

                                {/* Water Impact from Waste */}
                                <div className="space-y-4 p-8 bg-brand-dark/40 rounded-[32px] border-2 border-white/10 shadow-inner group/card hover:border-blue-500/40 transition-all">
                                  <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest flex items-center gap-3">
                                    <Droplets size={16} /> Water Resource
                                  </span>
                                  <div className="text-3xl font-black text-white transition-all group-hover/card:text-blue-400">
                                    {impacts.waterFootprint.toFixed(1)} <span className="text-[11px] font-light text-gray-500 uppercase">Liters Loss</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <ShieldCheck className="text-brand-eco" size={14} />
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Averted Loss Footprint.</p>
                                  </div>
                                </div>

                                {/* Financial Impact from Waste */}
                                <div className={`space-y-4 p-8 rounded-[32px] border-4 shadow-[0_15px_40px_rgba(0,0,0,0.5)] transition-all flex flex-col justify-between ${impacts.isDeviating ? 'bg-brand-alert/10 border-brand-alert' : 'bg-brand-eco/10 border-brand-eco'}`}>
                                  <div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-3 ${impacts.isDeviating ? 'text-brand-alert' : 'text-brand-eco'}`}>
                                      <DollarSign size={16} /> Financial Impact
                                    </span>
                                    <div className={`text-4xl font-black mt-2 ${impacts.isDeviating ? 'text-brand-alert' : 'text-brand-eco'}`}>
                                      ${impacts.totalFinancialLoss.toFixed(2)}
                                    </div>
                                  </div>
                                  {impacts.isDeviating && (
                                    <div className="bg-brand-alert text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest animate-pulse flex items-center gap-2">
                                      <AlertTriangle size={12} /> Escalation triggered supervisor report
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>



                          {/* EARTH KEEPER ENGAGEMENT RADIAL CHART - ADMIN VIEW */}
                          {/* "Position the Earth Keeper Engagement % Chart directly BELOW the Mila Actionable Intelligence container... only element in this section" */}
                          {(() => {
                            // "Calculate Outlet Engagement % (Unique Outlets in Session Data)"
                            // Logic: Total Active Outlets / Total Registered Outlets
                            // Active = has submitted ANY waste or resource entry in this session
                            const activeOutletIds = new Set([
                              ...sessionWasteEntries.map(e => e.outletId),
                              ...sessionResourceEntries.map(e => e.outletId)
                            ]);

                            const totalOutlets = outlets.length || 1;
                            const activeCount = activeOutletIds.size;
                            const engagementPct = Math.round((activeCount / totalOutlets) * 100) || 0; // Default to 0 if no data

                            // "Color Thresholds: Green (> 85%), Yellow (65% - 84%), Red (<65%)"
                            // "Status Badge Logic"
                            let chartColor = '#ef4444'; // Red
                            let statusLabel = 'ATTENTION';
                            let statusBg = 'bg-red-500';
                            let statusText = 'text-white';

                            if (engagementPct >= 85) {
                              chartColor = '#22c55e'; // Green (brandEco is usually consistent, but user asked for standard Green/Red/Yellow logic here)
                              statusLabel = 'ON TRACK';
                              statusBg = 'bg-green-500';
                              statusText = 'text-white';
                            } else if (engagementPct >= 65) {
                              chartColor = '#eab308'; // Yellow
                              statusLabel = 'CAUTION';
                              statusBg = 'bg-yellow-500';
                              statusText = 'text-black';
                            }

                            // SVG Circle Geometry
                            const radius = 56;
                            const circumference = 2 * Math.PI * radius; // ~351.858
                            const strokeDashoffset = circumference - (engagementPct / 100) * circumference;

                            return (
                              <div className="w-full max-w-full mb-8">
                                {/* "User a dark-green background with Rounded Corners (20px) and a Thin Gold Border (1px)" */}
                                <div className="bg-[#0f2420] border border-brand-gold/60 rounded-[20px] p-6 relative overflow-hidden shadow-xl">

                                  {/* HEADER SECTION */}
                                  <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                      {/* "Circular placeholder (24px) with a green outline, and bright green color icon" */}
                                      <div className="w-8 h-8 rounded-full border border-brand-eco flex items-center justify-center shrink-0">
                                        <ShieldCheck size={16} className="text-brand-eco" />
                                      </div>

                                      {/* "Main Title: 'EARTH KEEPER'... Subtitle: 'CUMULATIVE ENGAGEMENT'" */}
                                      <div className="flex flex-col">
                                        <h3 className="text-[18px] font-bold text-white leading-none">EARTH KEEPER</h3>
                                        <span className="text-[12px] font-black uppercase text-brand-gold tracking-wide mt-1">CUMULATIVE ENGAGEMENT</span>
                                      </div>
                                    </div>

                                    {/* "Pill-shaped Status Badge... Solid Coral/Red background... White Bold Uppercase text" */}
                                    <div className={`px-4 py-1.5 rounded-full ${statusBg} ${statusText} text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2`}>
                                      {statusLabel === 'ATTENTION' && <AlertTriangle size={12} fill="currentColor" />}
                                      {statusLabel}
                                    </div>
                                  </div>

                                  {/* MAIN CONTENT AREA (Two-Column Layout) */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    {/* Left Column: Text */}
                                    <div className="flex flex-col justify-center pl-4">
                                      {/* "The large participation text... properly aligned and use the same muted grey/white" */}
                                      <div className="text-5xl font-black text-white leading-none tracking-tight">
                                        {engagementPct}% <span className="text-xl text-gray-400 font-bold uppercase tracking-wider block mt-2">PARTICIPATION</span>
                                      </div>
                                      <p className="text-sm text-gray-400 mt-4 font-medium leading-relaxed max-w-sm">
                                        Cumulative tracking of sustainability reporting across all active outlets.
                                      </p>
                                    </div>

                                    {/* Right Column: Graphic */}
                                    <div className="flex justify-center md:justify-end pr-4">
                                      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl" viewBox="0 0 128 128">
                                          {/* Background Track - "Stroke Weight: Increase thickness... solid and substantial" */}
                                          <circle cx="64" cy="64" r="52" stroke="#1a3b34" strokeWidth="12" fill="transparent" />
                                          {/* Progress Bar */}
                                          <circle
                                            cx="64"
                                            cy="64"
                                            r="52"
                                            stroke={chartColor}
                                            strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={2 * Math.PI * 52}
                                            strokeDashoffset={(2 * Math.PI * 52) - (engagementPct / 100) * (2 * Math.PI * 52)}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000 ease-out"
                                          />
                                        </svg>
                                        {/* "Center Data: Add missing info... Percentage Value... 'Avg Rate' label" */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                                          <span className="text-4xl sm:text-5xl font-black text-white tracking-tighter" style={{ textShadow: '0 0 20px ' + chartColor + '40' }}>
                                            {engagementPct}%
                                          </span>
                                          <span className="text-[10px] font-black uppercase text-brand-gold tracking-[0.2em] mt-1">AVG RATE</span>

                                          {/* "Sub-Icon: Place a small, white 'Shield' or 'Check' icon at the very bottom center" */}
                                          <div className="mt-3 opacity-80">
                                            {engagementPct >= 85 ? <CheckCircle2 size={16} className="text-white" /> : <ShieldCheck size={16} className="text-white" />}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              </div>
                            );
                          })()}




                          {/* KPIs REPORT Header - Section Title */}
                          <div className="w-full max-w-full mt-12 mb-8">
                            <h2 className="text-2xl sm:text-3xl font-geometric font-black text-white uppercase tracking-tight">KPIs REPORT</h2>
                          </div>

                          {/* Core Metrics Grid - KPI Overview - Aspect Ratios Applied */}
                          <div className="w-full max-w-full grid grid-cols-1 gap-8 mb-12">
                            <div className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[300px]">
                              <FoodCostTemplateChart
                                data={
                                  user.role === 'admin'
                                    ? (foodCostLogs.length > 0 ? foodCostLogs : ADMIN_MOCK_DATA)
                                    : weeklyTrends
                                }
                                benchmark={effectiveParams.foodCostTarget}
                                multiSeries={user.role === 'admin'}
                                outlets={
                                  // Ensure we use the matching outlets definition for the data source
                                  (user.role === 'admin' && foodCostLogs.length === 0)
                                    ? DEFAULT_OUTLETS
                                    : (outlets.length > 0 ? outlets : DEFAULT_OUTLETS)
                                }
                              />
                            </div>
                            <div className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[300px]">
                              <LaborCostTemplateChart
                                data={
                                  laborCostLogs.length > 0
                                    ? laborCostLogs
                                    : (user.role === 'admin' ? ADMIN_LABOR_MOCK_DATA : weeklyTrends)
                                }
                                multiSeries={user.role === 'admin'}
                                outlets={
                                  (user.role === 'admin' && laborCostLogs.length === 0)
                                    ? DEFAULT_OUTLETS
                                    : (outlets.length > 0 ? outlets : DEFAULT_OUTLETS)
                                }
                                benchmark={28}
                              />
                            </div>
                          </div>

                          {/* Profit Margin and Sales Charts - Aspect Ratios Applied */}
                          <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[300px]">
                              <ProfitMarginTemplateChart data={weeklyTrends} benchmark={18.0} />
                            </div>
                            <div className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[300px]">
                              <SalesTemplateChart data={salesChartData} benchmark={16500} />
                            </div>
                          </div>

                          {/* Customer Sentiment and Avg Check Charts - Aspect Ratios Applied */}
                          <div className="w-full max-w-full grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                            <div className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[300px]">
                              <SentimentTemplateChart data={weeklyTrends} benchmark={4.5} />
                            </div>
                            <div className="w-full aspect-[4/3] lg:aspect-[16/9] min-h-[300px]">
                              <AvgCheckTemplateChart
                                data={[
                                  { day: 'Sun', restaurant: 45, bar: 32, banquets: 60, rollingAverage: 45.6 },
                                  { day: 'Mon', restaurant: 42, bar: 35, banquets: 0, rollingAverage: 44.2 },
                                  { day: 'Tue', restaurant: 48, bar: 30, banquets: 55, rollingAverage: 46.5 },
                                  { day: 'Wed', restaurant: 50, bar: 38, banquets: 0, rollingAverage: 48.0 },
                                  { day: 'Thu', restaurant: 52, bar: 40, banquets: 65, rollingAverage: 49.5 },
                                  { day: 'Fri', restaurant: 55, bar: 45, banquets: 70, rollingAverage: 51.0 },
                                  { day: 'Sat', restaurant: 60, bar: 50, banquets: 80, rollingAverage: 53.5 }
                                ]}
                                benchmark={47}
                              />
                            </div>
                          </div>


                        </>
                      )}

                      {dashboardTab === DashboardTab.FOOD_WASTE && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <FoodWasteChart />
                        </div>
                      )}

                      {dashboardTab === DashboardTab.ENERGY_WATER && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <WaterUsageChart />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeView === PortalView.IDENTITY && (
                  <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-1 scrollbar-hide pb-20">
                    <div className="bg-brand-dark/40 border border-brand-gold/20 p-6 sm:p-10 rounded-[24px] sm:rounded-[40px] space-y-6 sm:space-y-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-brand-gold/10 border border-brand-gold/20 rounded-lg">
                          <Building2 size={24} className="text-brand-gold" />
                        </div>
                        <h4 className="text-2xl sm:text-3xl font-geometric font-bold text-white uppercase tracking-tight">Company Identity</h4>
                      </div>


                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 relative">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Region</label>
                          <select
                            value={company.region}
                            onChange={(e) => {
                              const newRegion = e.target.value;
                              setCompany({ ...company, region: newRegion, city: REGION_DATA[newRegion][0] });
                            }}
                            disabled={!isEditingIdentity}
                            className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 text-sm text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer ${!isEditingIdentity ? 'opacity-50' : ''}`}
                          >
                            {Object.keys(REGION_DATA).map(r => <option key={r} value={r} className="bg-brand-dark text-white">{r}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 bottom-4 text-brand-gold pointer-events-none" size={16} />
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">City / Country</label>
                          <select
                            value={company.city}
                            onChange={e => setCompany({ ...company, city: e.target.value })}
                            disabled={!isEditingIdentity}
                            className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 text-sm text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer ${!isEditingIdentity ? 'opacity-50' : ''}`}
                          >
                            {REGION_DATA[company.region]?.map(c => <option key={c} value={c} className="bg-brand-dark text-white">{c}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 bottom-4 text-brand-gold pointer-events-none" size={16} />
                        </div>
                      </div>

                      <div className="space-y-6 relative p-6 sm:p-8 bg-brand-dark/40 border border-brand-gold/20 rounded-[24px] sm:rounded-[40px] shadow-lg pb-24 sm:pb-28">
                        <div className="space-y-2">

                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Hotel/Company Name</label>
                          <input
                            type="text"
                            value={company.name}
                            onChange={e => setCompany({ ...company, name: e.target.value })}
                            className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 text-sm text-white outline-none focus:border-brand-gold transition-all ${!isEditingIdentity ? 'opacity-50 cursor-not-allowed' : ''}`}
                            readOnly={!isEditingIdentity}
                          />

                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Add Outlet Name</label>
                            <input
                              type="text"
                              value={company.currentOutletName}
                              onChange={e => setCompany({ ...company, currentOutletName: e.target.value })}
                              className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 text-sm text-white outline-none focus:border-brand-gold transition-all placeholder:text-gray-700 ${!isEditingIdentity ? 'opacity-50 cursor-not-allowed' : ''}`}
                              placeholder="e.g. Skyline Lounge"
                              readOnly={!isEditingIdentity}
                            />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Generated Code</label>
                            <div className="flex items-center gap-2">
                              <input type="text" value={company.currentOutletCode} className="flex-grow bg-brand-dark/80 border border-brand-gold/40 rounded-xl sm:rounded-2xl py-3 px-4 sm:py-4 sm:px-6 text-sm text-brand-gold font-bold font-mono outline-none" readOnly />
                              <button
                                onClick={handleAddOutlet}
                                disabled={!isEditingIdentity}
                                className={`bg-brand-eco p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-brand-dark hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center justify-center shrink-0 ${!isEditingIdentity ? 'opacity-50' : ''}`}
                              >
                                <Plus size={20} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2">
                          <button
                            onClick={() => setIsEditingIdentity(!isEditingIdentity)}
                            className={`px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isEditingIdentity ? 'bg-brand-eco text-brand-dark scale-105 shadow-brand-eco/20' : 'bg-brand-gold text-brand-dark hover:scale-110 shadow-brand-gold/20'}`}
                          >
                            {isEditingIdentity ? <Unlock size={14} /> : <Edit2 size={14} />}
                            {isEditingIdentity ? 'Lock Identity' : 'Edit Identity'}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Registry Sessions (Active Outlets)</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          {outlets.map((o) => (
                            <div key={o.code} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl sm:rounded-2xl group hover:border-brand-gold/20 transition-all">
                              <div>
                                <div className="text-[10px] font-bold text-white uppercase tracking-tight">{o.name}</div>
                                <div className="text-[9px] font-mono text-brand-gold font-bold">{o.code}</div>
                              </div>
                              <button onClick={() => handleRemoveOutlet(o.code)} className="text-gray-600 hover:text-brand-alert p-2 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-brand-dark/40 border border-brand-gold/20 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 space-y-6 relative overflow-hidden group shadow-xl pb-24 sm:pb-28">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-brand-eco/10 border border-brand-eco/30 rounded-lg">
                              <FileText size={20} className="text-brand-eco" />
                            </div>
                            <h4 className="text-2xl sm:text-3xl font-geometric font-bold text-white uppercase tracking-tight">Audit Report</h4>
                          </div>
                          <button
                            onClick={handleGetReport}
                            className="w-full sm:w-auto bg-brand-eco text-brand-dark px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl"
                          >
                            Get Report
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 relative">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Report Cycle</label>
                            <select
                              value={auditReport.cycle}
                              onChange={e => setAuditReport({ ...auditReport, cycle: e.target.value })}
                              disabled={!isEditingAudit}
                              className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer text-xs ${!isEditingAudit ? 'opacity-50' : ''}`}
                            >
                              {['Daily', 'Weekly', 'Monthly', 'Quarterly'].map(cycle => <option key={cycle} value={cycle} className="bg-brand-dark">{cycle}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 bottom-3.5 text-brand-gold pointer-events-none" size={14} />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Outlet Selection</label>
                            <select
                              value={auditReport.outletSelection}
                              onChange={e => setAuditReport({ ...auditReport, outletSelection: e.target.value })}
                              disabled={!isEditingAudit}
                              className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 text-white outline-none focus:border-brand-gold transition-all appearance-none cursor-pointer text-xs ${!isEditingAudit ? 'opacity-50' : ''}`}
                            >
                              <option value="All outlets" className="bg-brand-dark">All outlets</option>
                              {outlets.map(o => (
                                <option key={o.code} value={o.code} className="bg-brand-dark">{o.name} ({o.code})</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-4 bottom-3.5 text-brand-gold pointer-events-none" size={14} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">From Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={auditReport.fromDate}
                                onChange={e => setAuditReport({ ...auditReport, fromDate: e.target.value })}
                                disabled={!isEditingAudit}
                                className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 pl-10 text-white outline-none focus:border-brand-gold transition-all text-xs ${!isEditingAudit ? 'opacity-50' : ''}`}
                              />
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none" size={14} />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">To Date</label>
                            <div className="relative">
                              <input
                                type="date"
                                value={auditReport.toDate}
                                onChange={e => setAuditReport({ ...auditReport, toDate: e.target.value })}
                                disabled={!isEditingAudit}
                                className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 pl-10 text-white outline-none focus:border-brand-gold transition-all text-xs ${!isEditingAudit ? 'opacity-50' : ''}`}
                              />
                              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none" size={14} />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Audit Comments</label>
                          <textarea
                            placeholder="Add operational notes or compliance details for the current reporting cycle..."
                            value={auditReport.comments}
                            onChange={e => setAuditReport({ ...auditReport, comments: e.target.value })}
                            disabled={!isEditingAudit}
                            className={`w-full bg-brand-dark/60 border border-white/10 rounded-xl sm:rounded-2xl py-3 px-4 text-white outline-none focus:border-brand-gold transition-all text-xs min-h-[100px] resize-none ${!isEditingAudit ? 'opacity-50' : ''}`}
                          />
                        </div>

                        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2">
                          <button
                            onClick={() => setIsEditingAudit(!isEditingAudit)}
                            className={`px-6 sm:px-10 py-2.5 sm:py-3.5 rounded-full flex items-center gap-3 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isEditingAudit ? 'bg-brand-eco text-brand-dark scale-105 shadow-brand-eco/20' : 'bg-brand-gold text-brand-dark hover:scale-110 shadow-brand-gold/20'}`}
                          >
                            {isEditingAudit ? <Unlock size={14} /> : <Edit2 size={14} />}
                            {isEditingAudit ? 'Lock Parameters' : 'Edit Audit Settings'}
                          </button>
                        </div>
                      </div>
                    </div >

                    <div className="flex flex-col gap-6 sm:gap-8 xl:h-full">
                      <div className="bg-brand-dark/40 border border-brand-gold/20 p-6 sm:p-10 rounded-[24px] sm:rounded-[40px] text-center flex flex-col justify-center items-center h-fit xl:sticky xl:top-0">
                        <Globe size={48} className="text-brand-gold mb-6" />
                        <h4 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">Operational Context</h4>
                        <div className="space-y-2 mb-6 w-full">
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Dynamic Timezone Adjustment</p>
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-[11px] text-gray-400 uppercase tracking-[0.2em] font-medium">{company.city}, {company.region}</span>
                            <div className="px-6 py-2 bg-brand-eco/10 border border-brand-eco/30 rounded-full inline-flex items-center gap-3">
                              <Clock size={16} className="text-brand-eco" />
                              <span className="text-[12px] font-black text-brand-eco uppercase tracking-widest">{currentTimezone}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 mb-8">
                          <Activity size={14} className="text-brand-gold" />
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em]">Next Data Sync: 12:00 AM {currentTimezone.split(' ')[0]}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                )}



                {activeView === PortalView.TEAM && (
                  <div className="space-y-8 animate-in fade-in duration-500 overflow-y-auto pr-1 scrollbar-hide pb-20">
                    <div id="enrollment-form" className="bg-brand-dark/40 border border-brand-gold/20 p-6 sm:p-10 rounded-[24px] sm:rounded-[40px] space-y-6 sm:space-y-8">
                      <div className="flex items-center justify-between">
                        <h4 className="flex items-center gap-3 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-brand-gold">
                          <UserPlus size={18} /> {enrollId ? "Edit Role Position" : "Enroll Personnel"}
                        </h4>
                        {enrollId && (
                          <button
                            onClick={() => {
                              setEnrollId(null);
                              setEnrollName('');
                              setEnrollEmail('');
                              setEnrollPosition('');
                              setEnrollOutlet('');
                              setEnrollRole('');
                              setEnrollPermissions([]);
                              setGenPassword('');
                              setGenLink('');
                            }}
                            className="text-[9px] font-black text-brand-gold uppercase tracking-widest hover:text-white transition-colors"
                          >
                            Cancel Edit
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Full Name</label>
                          <input
                            type="text"
                            value={enrollName}
                            onChange={e => setEnrollName(e.target.value)}
                            placeholder="Hotel Staff Name"
                            className="w-full bg-brand-dark border border-white/10 rounded-xl sm:rounded-2xl py-3.5 px-5 text-sm text-white outline-none focus:border-brand-gold placeholder:text-gray-700 transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Corporate Email</label>
                          <input
                            type="email"
                            value={enrollEmail}
                            onChange={e => setEnrollEmail(e.target.value)}
                            placeholder="staff@hotel.com"
                            className="w-full bg-brand-dark border border-white/10 rounded-xl sm:rounded-2xl py-3.5 px-5 text-sm text-white outline-none focus:border-brand-gold placeholder:text-gray-700 transition-all"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="space-y-2 relative">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Position</label>
                          <select
                            value={enrollPosition}
                            onChange={e => setEnrollPosition(e.target.value)}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl sm:rounded-2xl py-3.5 px-5 text-sm text-brand-gold font-black uppercase outline-none appearance-none cursor-pointer transition-all"
                          >
                            <option value="" disabled>Select Position</option>
                            <option value="Admin">Admin</option>
                            <option value="Exec Chef">Exec Chef</option>
                            <option value="Outlet Manager">Outlet Manager</option>
                            <option value="Chef Prep">Chef Prep</option>
                            <option value="GM">GM</option>
                          </select>
                          <ChevronDown className="absolute right-4 bottom-3.5 text-brand-gold pointer-events-none" size={14} />
                        </div>
                        <div className="space-y-2 relative">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2 block">Assign Primary Outlet Link</label>
                          <select
                            value={enrollOutlet}
                            onChange={e => setEnrollOutlet(e.target.value)}
                            className="w-full bg-brand-dark border border-white/10 rounded-xl sm:rounded-2xl py-3.5 px-5 text-sm text-white font-black uppercase appearance-none cursor-pointer transition-all"
                          >
                            <option value="" disabled>Select Outlet</option>
                            {outlets.map(o => <option key={o.code} value={o.code}>{o.name} ({o.code})</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 bottom-3.5 text-brand-gold pointer-events-none" size={16} />
                        </div>
                      </div>

                      <div className="space-y-4 relative" ref={permRef}>
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Role Permissions (Drop Menu)</label>
                        <button
                          onClick={() => setIsPermDropdownOpen(!isPermDropdownOpen)}
                          className="w-full bg-brand-dark border border-white/10 rounded-xl sm:rounded-2xl py-3.5 px-5 text-sm text-left flex items-center justify-between group hover:border-brand-gold/40 transition-all"
                        >
                          <span className="text-gray-400 font-bold truncate">
                            {enrollPermissions.length === 0
                              ? "Select Permissions"
                              : `${enrollPermissions.length} Permissions Selected`}
                          </span>
                          {isPermDropdownOpen ? <ChevronUp size={18} className="text-brand-gold" /> : <ChevronDown size={18} className="text-brand-gold" />}
                        </button>

                        {isPermDropdownOpen && (
                          <div className="absolute top-full left-0 w-full mt-2 bg-brand-dark/95 backdrop-blur-xl border border-brand-gold/40 rounded-2xl shadow-2xl z-[100] max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
                              {AVAILABLE_PERMISSIONS.map(p => (
                                <button
                                  key={p}
                                  onClick={() => togglePermission(p)}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${enrollPermissions.includes(p) ? 'bg-brand-gold/10 border-brand-gold/40 text-brand-gold' : 'bg-transparent border-white/5 text-gray-600 hover:border-white/10'}`}
                                >
                                  {enrollPermissions.includes(p) ? <CheckSquare size={16} /> : <Square size={16} />}
                                  <span className="text-[9px] font-bold uppercase tracking-tight">{p}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 pt-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Generated Password</label>
                          <div className="relative group">
                            <input
                              type="text"
                              readOnly
                              value={genPassword}
                              placeholder="Generated upon save..."
                              className="w-full bg-brand-dark/40 border border-brand-gold/20 rounded-xl sm:rounded-2xl py-3.5 px-10 text-brand-gold font-mono font-bold text-sm outline-none"
                            />
                            <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold opacity-50" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Generated Link</label>
                          <div className="relative group">
                            <input
                              type="text"
                              readOnly
                              value={genLink}
                              placeholder="Generated upon save..."
                              className="w-full bg-brand-dark/40 border border-brand-gold/20 rounded-xl sm:rounded-2xl py-3.5 px-10 text-brand-gold font-mono font-bold text-[10px] outline-none truncate"
                            />
                            <Link2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold opacity-50" />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleEnroll}
                        className="w-full py-4 bg-brand-eco text-brand-dark rounded-xl sm:rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-[0.98] transition-all"
                      >
                        {enrollId ? "Save Role Changes" : "Enroll & Generate Access"}
                      </button>
                    </div>

                    <div className="space-y-12">
                      <div className="px-6 mb-2">
                        <h5 className="text-[12px] font-black uppercase tracking-[0.4em] text-brand-gold">Active Staff Registry</h5>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 px-6">
                          <UserCheck size={14} className="text-brand-gold" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-brand-gold">Management Group (Admin & GM)</span>
                        </div>
                        <div className="space-y-3">
                          {users.filter(u => u.role.toLowerCase() === 'admin' || u.role.toLowerCase() === 'gm').map((u) => (
                            <div key={u.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-brand-gold/5 rounded-[24px] sm:rounded-[40px] border border-brand-gold/20 group hover:bg-brand-gold/10 transition-all gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-xs font-black shadow-inner border border-brand-gold/40">
                                  {u.fullName.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">{u.fullName}</div>
                                  <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{u.position}</span>
                                    <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                    <span className="text-[9px] text-brand-gold font-black uppercase tracking-widest">{u.role.toUpperCase()}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center justify-end gap-4 w-full sm:w-auto">
                                <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-dark/60 rounded-full border border-brand-gold/20">
                                  <Key size={12} className="text-brand-gold/40" />
                                  <span className="text-[9px] font-mono font-bold text-brand-gold uppercase tracking-tighter">
                                    {visiblePasswords.has(u.id) ? u.password : '••••••••'}
                                  </span>
                                  <button onClick={() => togglePasswordVisibility(u.id)} className="text-brand-gold/60 hover:text-brand-gold ml-2">
                                    {visiblePasswords.has(u.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                  </button>
                                </div>

                                <div className="flex gap-4">
                                  <button onClick={() => handleEdit(u)} className="text-gray-500 hover:text-brand-gold transition-colors p-1.5 bg-white/5 rounded-lg"><Edit2 size={16} /></button>
                                  <button onClick={() => setUsers(prev => prev.filter(usr => usr.id !== u.id))} className="text-gray-500 hover:text-brand-alert transition-colors p-1.5 bg-white/5 rounded-lg"><Trash2 size={16} /></button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {outlets.map(outlet => {
                        const members = users.filter(u => u.outletCode === outlet.code && u.role.toLowerCase() !== 'admin' && u.role.toLowerCase() !== 'gm');
                        if (members.length === 0) return null;

                        return (
                          <div key={outlet.code} className="space-y-4">
                            <div className="flex items-center gap-4 px-6">
                              <MapPin size={14} className="text-brand-gold" />
                              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{outlet.name} Outlet — Registry</span>
                            </div>
                            <div className="space-y-3">
                              {members.map((u) => (
                                <div key={u.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-white/5 rounded-[24px] sm:rounded-[30px] border border-white/5 group hover:border-brand-gold/30 transition-all gap-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-gold/10 flex items-center justify-center text-brand-gold text-xs font-black shadow-inner border border-brand-gold/20">
                                      {u.fullName.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="text-sm sm:text-base font-bold text-white uppercase tracking-tight">{u.fullName}</div>
                                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{u.position}</span>
                                        <span className="w-1 h-1 rounded-full bg-white/10"></span>
                                        <span className="text-[9px] text-brand-eco font-black uppercase tracking-widest">{u.role.toUpperCase()}</span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap items-center justify-end gap-4 w-full sm:w-auto">
                                    <div className="flex items-center gap-2 px-4 py-1.5 bg-brand-dark/60 rounded-full border border-white/5">
                                      <Key size={12} className="text-brand-gold/40" />
                                      <span className="text-[9px] font-mono font-bold text-brand-gold uppercase tracking-tighter">
                                        {visiblePasswords.has(u.id) ? u.password : '••••••••'}
                                      </span>
                                      <button onClick={() => togglePasswordVisibility(u.id)} className="text-brand-gold/40 hover:text-brand-gold ml-2">
                                        {visiblePasswords.has(u.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                                      </button>
                                    </div>

                                    <div className="flex gap-4">
                                      <button onClick={() => handleEdit(u)} className="text-gray-500 hover:text-brand-gold transition-colors p-1.5 bg-white/5 rounded-lg"><Edit2 size={16} /></button>
                                      <button onClick={() => setUsers(prev => prev.filter(usr => usr.id !== u.id))} className="text-gray-500 hover:text-brand-alert transition-colors p-1.5 bg-white/5 rounded-lg"><Trash2 size={16} /></button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeView === PortalView.PARAMETERS && (
                  <div className="space-y-8 sm:space-y-12 animate-in fade-in duration-500 overflow-y-auto pr-1 scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      {/* Sustainability Metrics Section */}
                      <section className="space-y-6 sm:space-y-8">
                        <div className="flex items-center gap-3">
                          <Leaf size={20} className="text-brand-eco" />
                          <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-brand-gold">Sustainability Metrics</h4>
                        </div>
                        <div className="space-y-4">
                          {/* Food Waste Card */}
                          <div className={`p-6 sm:p-8 rounded-[24px] sm:rounded-[30px] space-y-6 border shadow-inner transition-all relative ${isMetricCardEditable ? 'bg-white/5 border-white/5' : 'bg-brand-dark/40 border-brand-gold/20'}`}>
                            {!isMetricCardEditable && <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                              <Lock size={12} className="text-brand-gold" />
                              <span className="text-[8px] font-black uppercase text-brand-gold tracking-widest">Read Only</span>
                            </div>}
                            <div className="flex justify-between items-start mb-2 gap-4">
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Food Waste Target</span>
                                <div className="flex bg-brand-dark/80 rounded-full p-1 border border-white/5 w-fit mt-1">
                                  <button
                                    disabled={!isMetricCardEditable}
                                    onClick={() => setParams({ ...params, wasteUnit: 'kg' })}
                                    className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${effectiveParams.wasteUnit === 'kg' ? 'bg-brand-gold text-brand-dark' : 'text-gray-500'}`}
                                  >KG</button>
                                  <button
                                    disabled={!isMetricCardEditable}
                                    onClick={() => setParams({ ...params, wasteUnit: 'lbs' })}
                                    className={`px-3 py-1 rounded-full text-[9px] font-black transition-all ${effectiveParams.wasteUnit === 'lbs' ? 'bg-brand-gold text-brand-dark' : 'text-gray-500'}`}
                                  >LBS</button>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="relative w-24 sm:w-32">
                                  <input
                                    type="number"
                                    disabled={!isMetricCardEditable}
                                    value={effectiveParams.wasteTarget}
                                    onChange={e => setParams({ ...params, wasteTarget: parseInt(e.target.value) || 0 })}
                                    className={`w-full bg-brand-dark/60 border rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all text-right pr-10 ${isMetricCardEditable ? 'border-white/10 text-brand-gold focus:border-brand-gold' : 'border-brand-gold/40 text-brand-gold cursor-default'}`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase">{effectiveParams.wasteUnit}</span>
                                </div>
                              </div>
                            </div>
                            <input
                              type="range" min="10" max="1000"
                              disabled={!isMetricCardEditable}
                              value={effectiveParams.wasteTarget}
                              onChange={e => setParams({ ...params, wasteTarget: parseInt(e.target.value) })}
                              className={`w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-gold ${isMetricCardEditable ? 'cursor-pointer' : 'opacity-20'}`}
                            />
                          </div>

                          {/* Water Usage Card */}
                          <div className={`p-6 sm:p-8 rounded-[24px] sm:rounded-[30px] space-y-6 border shadow-inner transition-all relative ${isMetricCardEditable ? 'bg-white/5 border-white/5' : 'bg-brand-dark/40 border-brand-gold/20'}`}>
                            {!isMetricCardEditable && <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                              <Lock size={12} className="text-brand-gold" />
                              <span className="text-[8px] font-black uppercase text-brand-gold tracking-widest">Read Only</span>
                            </div>}
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Water Usage (Liters)</span>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="relative w-24 sm:w-32">
                                  <input
                                    type="number"
                                    disabled={!isMetricCardEditable}
                                    value={effectiveParams.waterTarget}
                                    onChange={e => setParams({ ...params, waterTarget: parseInt(e.target.value) || 0 })}
                                    className={`w-full bg-brand-dark/60 border rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all text-right pr-8 ${isMetricCardEditable ? 'border-white/10 text-[#60a5fa] focus:border-brand-gold' : 'border-brand-gold/40 text-[#60a5fa] cursor-default'}`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase">L</span>
                                </div>
                              </div>
                            </div>
                            <input
                              type="range" min="1000" max="100000" step="500"
                              disabled={!isMetricCardEditable}
                              value={effectiveParams.waterTarget}
                              onChange={e => setParams({ ...params, waterTarget: parseInt(e.target.value) })}
                              className={`w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-blue-500 ${isMetricCardEditable ? 'cursor-pointer' : 'opacity-20'}`}
                            />
                          </div>

                          {/* Energy Usage Card */}
                          <div className={`p-6 sm:p-8 rounded-[24px] sm:rounded-[30px] space-y-6 border shadow-inner transition-all relative ${isMetricCardEditable ? 'bg-white/5 border-white/5' : 'bg-brand-dark/40 border-brand-gold/20'}`}>
                            {!isMetricCardEditable && <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                              <Lock size={12} className="text-brand-gold" />
                              <span className="text-[8px] font-black uppercase text-brand-gold tracking-widest">Read Only</span>
                            </div>}
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Energy Limit (kWh)</span>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="relative w-24 sm:w-32">
                                  <input
                                    type="number"
                                    disabled={!isMetricCardEditable}
                                    value={effectiveParams.energyTarget}
                                    onChange={e => setParams({ ...params, energyTarget: parseInt(e.target.value) || 0 })}
                                    className={`w-full bg-brand-dark/60 border rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all text-right pr-12 ${isMetricCardEditable ? 'border-white/10 text-brand-energy focus:border-brand-gold' : 'border-brand-gold/40 text-brand-energy cursor-default'}`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase">kWh</span>
                                </div>
                              </div>
                            </div>
                            <input
                              type="range" min="100" max="10000" step="100"
                              disabled={!isMetricCardEditable}
                              value={effectiveParams.energyTarget}
                              onChange={e => setParams({ ...params, energyTarget: parseInt(e.target.value) })}
                              className={`w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-energy ${isMetricCardEditable ? 'cursor-pointer' : 'opacity-20'}`}
                            />
                          </div>
                        </div>
                      </section>

                      {/* F&B KPIs Section */}
                      <section className="space-y-6 sm:space-y-8">
                        <div className="flex items-center gap-3">
                          <BarChart3 size={20} className="text-brand-gold" />
                          <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-brand-gold">F&B KPIs</h4>
                        </div>
                        <div className="space-y-4">
                          {/* Food Cost Card */}
                          <div className={`p-6 sm:p-8 rounded-[24px] sm:rounded-[30px] space-y-6 border shadow-inner transition-all relative ${isMetricCardEditable ? 'bg-white/5 border-white/5' : 'bg-brand-dark/40 border-brand-gold/20'}`}>
                            {!isMetricCardEditable && <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                              <Lock size={12} className="text-brand-gold" />
                              <span className="text-[8px] font-black uppercase text-brand-gold tracking-widest">Read Only</span>
                            </div>}
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Food Cost Cap (%)</span>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="relative w-24 sm:w-32">
                                  <input
                                    type="number"
                                    disabled={!isMetricCardEditable}
                                    step="0.1"
                                    value={effectiveParams.foodCostTarget}
                                    onChange={e => setParams({ ...params, foodCostTarget: parseFloat(e.target.value) || 0 })}
                                    className={`w-full bg-brand-dark/60 border rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all text-right pr-8 ${isMetricCardEditable ? 'border-white/10 text-brand-eco focus:border-brand-gold' : 'border-brand-gold/40 text-brand-eco cursor-default'}`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase">%</span>
                                </div>
                              </div>
                            </div>
                            <input
                              type="range" min="10" max="60" step="0.5"
                              disabled={!isMetricCardEditable}
                              value={effectiveParams.foodCostTarget}
                              onChange={e => setParams({ ...params, foodCostTarget: parseFloat(e.target.value) })}
                              className={`w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-eco ${isMetricCardEditable ? 'cursor-pointer' : 'opacity-20'}`}
                            />
                          </div>

                          {/* Labor Cost Card */}
                          <div className={`p-6 sm:p-8 rounded-[24px] sm:rounded-[30px] space-y-6 border shadow-inner transition-all relative ${isMetricCardEditable ? 'bg-white/5 border-white/5' : 'bg-brand-dark/40 border-brand-gold/20'}`}>
                            {!isMetricCardEditable && <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 bg-brand-gold/10 border border-brand-gold/20 rounded-full">
                              <Lock size={12} className="text-brand-gold" />
                              <span className="text-[8px] font-black uppercase text-brand-gold tracking-widest">Read Only</span>
                            </div>}
                            <div className="flex justify-between items-start gap-4">
                              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">Labor Cost Cap (%)</span>
                              <div className="flex flex-col items-end gap-2 shrink-0">
                                <div className="relative w-24 sm:w-32">
                                  <input
                                    type="number"
                                    disabled={!isMetricCardEditable}
                                    step="0.1"
                                    value={effectiveParams.laborCostTarget}
                                    onChange={e => setParams({ ...params, laborCostTarget: parseFloat(e.target.value) || 0 })}
                                    className={`w-full bg-brand-dark/60 border rounded-lg py-2 px-3 text-sm font-bold outline-none transition-all text-right pr-8 ${isMetricCardEditable ? 'border-white/10 text-brand-eco focus:border-brand-gold' : 'border-brand-gold/40 text-brand-eco cursor-default'}`}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-bold uppercase">%</span>
                                </div>
                              </div>
                            </div>
                            <input
                              type="range" min="5" max="50" step="0.5"
                              disabled={!isMetricCardEditable}
                              value={effectiveParams.laborCostTarget}
                              onChange={e => setParams({ ...params, laborCostTarget: parseFloat(e.target.value) })}
                              className={`w-full h-1.5 bg-brand-dark rounded-full appearance-none accent-brand-eco ${isMetricCardEditable ? 'cursor-pointer' : 'opacity-20'}`}
                            />
                          </div>

                          {/* Industry Benchmark Selection */}
                          <div className="p-6 sm:p-8 bg-brand-gold/5 border border-brand-gold/20 rounded-[24px] sm:rounded-[40px] space-y-6 group relative shadow-xl">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <Globe size={18} className="text-brand-gold" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Industry Benchmarking Logic</span>
                              </div>
                              {isEditingBenchmarks && (
                                <button
                                  onClick={handleSaveBenchmarks}
                                  className="bg-brand-eco text-brand-dark px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                                >
                                  <Check size={12} /> Save Benchmarks
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-1">Profile Category</label>
                                <div className="relative">
                                  <select
                                    value={params.benchmarkRegion}
                                    onChange={e => setParams({ ...params, benchmarkRegion: e.target.value, selectedManualOutlet: '' })}
                                    className="w-full bg-brand-dark/80 border border-white/10 rounded-xl py-3 px-4 text-xs text-white font-bold outline-none appearance-none cursor-pointer focus:border-brand-gold transition-all"
                                  >
                                    <option value="ASEAN Luxury Hotels">ASEAN Luxury Hotels</option>
                                    <option value="European Michelin Standard">European Michelin Standard</option>
                                    <option value="North American Premium">North American Premium</option>
                                    <option value="Middle East Luxury Collection">Middle East Luxury Collection</option>
                                    <option value="Manual">Manual Entry</option>
                                  </select>
                                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none" size={14} />
                                </div>
                              </div>

                              {isManualBenchmark && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                  <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-1">Outlet Selection (Drop Menu)</label>
                                  <div className="relative">
                                    <select
                                      value={params.selectedManualOutlet}
                                      onChange={e => setParams({ ...params, selectedManualOutlet: e.target.value })}
                                      className="w-full bg-brand-dark/60 border border-brand-gold/40 rounded-xl py-3 px-10 text-[10px] text-brand-gold font-bold outline-none appearance-none cursor-pointer focus:border-brand-gold transition-all"
                                    >
                                      <option value="" disabled>Select Target Outlet</option>
                                      {outlets.map(o => <option key={o.code} value={o.code}>{o.name} ({o.code})</option>)}
                                    </select>
                                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40" />
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-gold pointer-events-none" />
                                  </div>
                                  <p className="text-[8px] text-gray-500 uppercase font-black tracking-tight leading-tight mt-1 ml-1">
                                    Each outlet follows its individual parameters under manual entry mode.
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="flex justify-center pt-2">
                              <button
                                onClick={() => setIsEditingBenchmarks(!isEditingBenchmarks)}
                                className={`px-8 py-2.5 rounded-full flex items-center gap-3 text-[9px] font-black uppercase tracking-widest shadow-xl transition-all ${isEditingBenchmarks ? 'bg-brand-gold text-brand-dark ring-2 ring-brand-gold/30' : 'bg-brand-gold text-brand-dark hover:scale-105'}`}
                              >
                                {isEditingBenchmarks ? <Unlock size={12} /> : <Edit2 size={12} />}
                                {isEditingBenchmarks ? 'Benchmarks Unlocked' : 'Edit Parameters'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>


                      {/* AI Logic Control Section */}
                      <section className="md:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                          <Cpu size={20} className="text-brand-eco" />
                          <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-brand-gold">Mila AI Logic Configuration</h4>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-6 bg-brand-gold/5 border border-brand-gold/10 rounded-[24px] sm:rounded-[30px]">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-brand-gold/10 rounded-xl">
                                <AlertCircle className="text-brand-gold" size={20} />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-tight text-white">Deviation Alerts</span>
                            </div>
                            <button onClick={() => setParams({ ...params, alertsActive: !params.alertsActive })}>
                              {params.alertsActive ? <ToggleRight className="text-brand-eco" size={32} /> : <ToggleLeft className="text-gray-600" size={32} />}
                            </button>
                          </div>
                          <div className="flex items-center justify-between p-6 bg-brand-eco/5 border border-brand-eco/20 rounded-[24px] sm:rounded-[30px]">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-brand-eco/10 rounded-xl">
                                <Lightbulb className="text-brand-eco" size={20} />
                              </div>
                              <span className="text-xs font-bold uppercase tracking-tight text-white">Suggestion Engine</span>
                            </div>
                            <button onClick={() => setParams({ ...params, milaLogic: !params.milaLogic })}>
                              {params.milaLogic ? <ToggleRight className="text-brand-eco" size={32} /> : <ToggleLeft className="text-gray-600" size={32} />}
                            </button>
                          </div>
                        </div>
                      </section>

                      {/* APIs Integration Section */}
                      <section className="md:col-span-2 space-y-6 relative">
                        <div className="flex items-center gap-3">
                          <Database size={20} className="text-brand-gold" />
                          <h4 className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-brand-gold">APIs Integration</h4>
                          <div className="relative group ml-1">
                            <button
                              onMouseEnter={() => setShowApiInfo(true)}
                              onMouseLeave={() => setShowApiInfo(false)}
                              className="text-gray-500 hover:text-brand-gold transition-colors"
                            >
                              <Info size={16} />
                            </button>
                            {showApiInfo && (
                              <div className="absolute bottom-full left-0 mb-3 w-72 p-5 bg-brand-dark border border-brand-gold/40 rounded-2xl shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
                                <p className="text-[10px] text-gray-300 font-medium leading-relaxed uppercase tracking-wider">
                                  Ecometricus utilizes secure, read-only API connections to synchronize your operational data. By integrating with your <span className="text-brand-gold">POS</span>, <span className="text-brand-gold">CRM</span>, and <span className="text-brand-gold">PMS</span>, the engine automatically extracts revenue, covers, and guest preferences to generate real-time ESG and financial performance reports without manual intervention.
                                </p>
                                <div className="absolute bottom-[-6px] left-3 w-3 h-3 bg-brand-dark border-r border-b border-brand-gold/40 rotate-45"></div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-brand-dark/40 border border-brand-gold/20 rounded-[24px] sm:rounded-[40px] p-6 sm:p-10 relative">
                          <div className="flex justify-end mb-6">
                            {isEditingApis && (
                              <button
                                onClick={handleSaveApis}
                                className="bg-brand-eco text-brand-dark px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                              >
                                <Check size={14} /> Save APIs
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
                            {/* POS API Field */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-1">POS API Key</label>
                              <div className="relative group">
                                <input
                                  type="password"
                                  disabled={!isEditingApis}
                                  value={params.posApiKey}
                                  onChange={e => setParams({ ...params, posApiKey: e.target.value })}
                                  placeholder="Connect POS..."
                                  className={`w-full bg-brand-dark/60 border rounded-xl py-3 px-10 text-xs text-white outline-none transition-all placeholder:text-gray-700 ${isEditingApis ? 'border-brand-gold/40 focus:border-brand-gold' : 'border-white/10'}`}
                                />
                                <Link2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40 group-focus-within:text-brand-gold transition-colors" />
                              </div>
                              <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter ml-1">Extracts Sales & Covers</p>
                            </div>

                            {/* CRM API Field */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-1">CRM API Key</label>
                              <div className="relative group">
                                <input
                                  type="password"
                                  disabled={!isEditingApis}
                                  value={params.crmApiKey}
                                  onChange={e => setParams({ ...params, crmApiKey: e.target.value })}
                                  placeholder="Connect CRM..."
                                  className={`w-full bg-brand-dark/60 border rounded-xl py-3 px-10 text-xs text-white outline-none transition-all placeholder:text-gray-700 ${isEditingApis ? 'border-brand-gold/40 focus:border-brand-gold' : 'border-white/10'}`}
                                />
                                <Users size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40 group-focus-within:text-brand-gold transition-colors" />
                              </div>
                              <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter ml-1">Extracts Guest Loyalty Data</p>
                            </div>

                            {/* PMS API Field */}
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-1">PMS API Key</label>
                              <div className="relative group">
                                <input
                                  type="password"
                                  disabled={!isEditingApis}
                                  value={params.pmsApiKey}
                                  onChange={e => setParams({ ...params, pmsApiKey: e.target.value })}
                                  placeholder="Connect PMS..."
                                  className={`w-full bg-brand-dark/60 border rounded-xl py-3 px-10 text-xs text-white outline-none transition-all placeholder:text-gray-700 ${isEditingApis ? 'border-brand-gold/40 focus:border-brand-gold' : 'border-white/10'}`}
                                />
                                <Building2 size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold/40 group-focus-within:text-brand-gold transition-colors" />
                              </div>
                              <p className="text-[7px] text-gray-500 uppercase font-bold tracking-tighter ml-1">Extracts Occupancy & Forecast</p>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <button
                              onClick={() => setIsEditingApis(!isEditingApis)}
                              className={`px-10 py-3 rounded-full flex items-center gap-3 text-[10px] font-black uppercase tracking-widest shadow-xl transition-all ${isEditingApis ? 'bg-brand-gold text-brand-dark ring-2 ring-brand-gold/20' : 'bg-brand-gold text-brand-dark hover:scale-105'}`}
                            >
                              {isEditingApis ? <Unlock size={14} /> : <Edit2 size={14} />}
                              {isEditingApis ? 'API Hub Unlocked' : 'Edit APIs'}
                            </button>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                )
                }

                {activeView === PortalView.SYSTEM && (
                  <div className="animate-in fade-in duration-500 flex flex-col flex-grow min-h-0">
                    <div className="bg-black/40 border border-white/10 rounded-[24px] sm:rounded-[40px] overflow-hidden flex flex-col flex-grow shadow-2xl">
                      <div className="bg-brand-dark/80 px-6 sm:px-8 py-4 border-b border-white/5 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-4 text-[9px] sm:text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                          <Terminal size={14} className="text-brand-gold" /> DIAG_LOG_CORE_V3
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-eco animate-pulse"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse delay-75"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-energy animate-pulse delay-150"></div>
                          </div>
                          <RefreshCcw size={14} className="text-brand-gold animate-spin" />
                        </div>
                      </div>
                      <div className="p-6 sm:p-8 font-mono text-[10px] sm:text-xs text-brand-eco overflow-y-auto flex-grow custom-scrollbar">
                        <pre className="whitespace-pre-wrap opacity-90">{rawJson}</pre>
                      </div>
                    </div>
                  </div>
                )}


              </div>
            </div>
          </main>
          <MilaWidget context={adminContext} />
        </>
      </div >
    </div >
  );
};

export default DashboardPage;
