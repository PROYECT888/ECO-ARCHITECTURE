
import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Link as LinkIcon,
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
  LogOut
} from 'lucide-react';
import FoodWasteChart from './FoodWasteChart';
import WaterUsageChart from './WaterUsageChart';
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

const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<PortalView>(PortalView.DASHBOARD);
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>(DashboardTab.SUMMARIZED);
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

  // Shared Administrative Core State - Load from LocalStorage if exists
  const [outlets, setOutlets] = useState<Outlet[]>(() => {
    const saved = localStorage.getItem('ecometricus_outlets');
    return saved ? JSON.parse(saved) : [
      { name: 'Royal', code: 'ROY02' },
      { name: 'Fisher’s', code: 'FISH01' }
    ];
  });
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

  // Persist outlets to localStorage for session continuity
  useEffect(() => {
    localStorage.setItem('ecometricus_outlets', JSON.stringify(outlets));
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
      className={`w-full flex items-center gap-4 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 group ${activeView === view ? 'bg-brand-gold text-brand-dark shadow-xl scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
    >
      <Icon size={18} className={activeView === view ? 'text-brand-dark' : 'text-brand-gold'} />
      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em]">{label}</span>
      {activeView === view && <ChevronRight size={14} className="ml-auto hidden sm:block" />}
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

  return (
    <div className="flex flex-col min-h-screen bg-brand-dark">
      {/* Identity Bar - Positioned under main menu */}
      <div className="w-full bg-brand-dark/80 backdrop-blur-md border-b border-brand-gold/20 py-4 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <Logo size="md" withLabel />
          <div className="p-2 bg-brand-gold/10 rounded-lg border border-brand-gold/20">
            <UserCheck size={18} className="text-brand-gold" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <span className="text-sm font-geometric font-bold text-white uppercase tracking-tight">
              {user.fullName}
              {user.role === 'admin' && (
                <span className="ml-2 px-2 py-0.5 bg-brand-gold text-brand-dark rounded text-[8px] font-black uppercase">ADMIN</span>
              )}
            </span>
            <span className="hidden sm:block text-gray-700">|</span>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-widest">{user.position}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <Clock size={12} className="text-brand-gold/60" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              <span className="mx-2 opacity-30">—</span>
              {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-1.5 bg-brand-dark rounded-full border border-brand-alert/30 text-brand-alert hover:bg-brand-alert hover:text-white text-[9px] font-black uppercase tracking-widest transition-all shadow-lg"
          >
            <LogOut size={12} /> Exit Hub
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 py-6 sm:py-12 flex flex-col lg:flex-row gap-6 sm:gap-12 flex-grow">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 xl:w-72 flex flex-row lg:flex-col gap-2 shrink-0 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide lg:sticky lg:top-12 h-fit">
          <div className="hidden lg:block mb-10 px-6">
            <h2 className="text-xl font-geometric font-black text-white uppercase leading-tight tracking-tight">
              ADMINISTRATIVE<br />
              <span className="text-brand-gold">CORE HUB</span>
            </h2>
            <p className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.5em] mt-3">Access Level: Global</p>
          </div>

          <div className="flex row lg:flex-col gap-2 min-w-max lg:min-w-0 w-full">
            <SidebarItem view={PortalView.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />

            <div className="h-[1px] bg-brand-gold/10 my-4 mx-6 hidden lg:block"></div>
            <div className="px-6 mb-2 hidden lg:block">
              <h3 className="text-[8px] font-black text-brand-gold uppercase tracking-[0.4em] mb-1">Administrative Core</h3>
            </div>

            <SidebarItem view={PortalView.IDENTITY} icon={Building2} label="Company Identity" />
            <SidebarItem view={PortalView.TEAM} icon={Users} label="Personnel" />
            <SidebarItem view={PortalView.PARAMETERS} icon={Settings2} label="Parameters" />

            <div className="lg:mt-auto lg:pt-8 lg:border-t lg:border-white/5">
              <SidebarItem view={PortalView.SYSTEM} icon={Database} label="System" />
            </div>
          </div>
        </aside>

        <main className="flex-grow flex flex-col min-w-0">
          <div className="bg-brand-dark border border-brand-gold/20 rounded-[30px] sm:rounded-[40px] p-5 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-sm flex-grow flex flex-col">
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
              {activeView !== PortalView.DASHBOARD && activeView !== PortalView.SYSTEM && (
                <button
                  onClick={handleSaveAll}
                  disabled={saveStatus !== 'idle'}
                  className={`w-full md:w-auto bg-brand-eco text-brand-dark px-6 sm:px-8 py-3 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-xl ${saveStatus === 'saving' ? 'opacity-70 cursor-wait' : ''}`}
                >
                  {saveStatus === 'saving' ? <RefreshCcw size={14} className="animate-spin" /> : <Save size={14} />}
                  {activeView === PortalView.TEAM ? "Role Saved" : "Update HUB"}
                </button>
              )}
            </div>

            <div className="flex-grow flex flex-col">
              {activeView === PortalView.DASHBOARD && (
                <div className="space-y-8 sm:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col flex-grow">
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

                  <div className="flex-grow overflow-y-auto pr-1 scrollbar-hide">
                    {dashboardTab === DashboardTab.SUMMARIZED && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
                        <div className="bg-brand-dark/40 border border-white/5 p-6 sm:p-8 rounded-[24px] sm:rounded-[40px] flex flex-col items-center w-full aspect-[4/5] sm:aspect-square justify-center">
                          <div className="flex justify-between items-center w-full mb-8">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <ShieldCheck size={18} className="text-brand-gold" />
                              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-gold">EARTH KEEPER</span>
                            </div>
                          </div>
                          <div className="relative w-32 h-32 sm:w-48 sm:h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                              <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset={351 - (351 * 0.85)} strokeLinecap="round" className="text-brand-eco transition-all duration-1000" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-3xl sm:text-5xl font-black text-white leading-none">85%</span>
                              <span className="text-[8px] sm:text-[9px] font-black uppercase text-brand-gold mt-2 sm:mt-3 tracking-widest">ENROLLMENT</span>
                            </div>
                          </div>
                        </div>
                        {[
                          { label: 'Waste', val: effectiveParams.wasteTarget.toString(), unit: effectiveParams.wasteUnit, color: brandEco },
                          { label: 'Energy', val: effectiveParams.energyTarget.toString(), unit: 'kWh', color: brandEnergy },
                          { label: 'Water', val: effectiveParams.waterTarget.toString(), unit: 'L', color: '#60a5fa' }
                        ].map((m, i) => (
                          <div key={i} className="bg-brand-dark/40 border border-white/5 p-6 sm:p-8 rounded-[24px] sm:rounded-[40px] w-full aspect-[4/5] sm:aspect-square flex flex-col justify-center">
                            <h5 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-brand-gold mb-2">{m.label}</h5>
                            <div className="text-2xl sm:text-3xl font-black text-white">{m.val} <span className="text-xs sm:text-sm font-light text-gray-500">{m.unit}</span></div>
                            <Sparkline color={m.color} data={[40, 35, 50, 65, 45, 55, 52]} />
                          </div>
                        ))}
                      </div>
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
                <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-500 overflow-y-auto pr-1 scrollbar-hide">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-10">
                    <div className="xl:col-span-2 space-y-6 sm:space-y-8 flex flex-col">
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
                          <div className="space-y-2 relative">
                            <label className="text-[9px] font-black uppercase tracking-widest text-brand-gold ml-2">Region</label>
                            <select
                              value={company.region}
                              onChange={e => {
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
                    </div>

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
                        <div className="p-6 bg-brand-dark/80 border border-brand-gold/10 rounded-2xl sm:rounded-3xl w-full">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Digital Efficiency</span>
                            <span className="text-[10px] font-black text-brand-eco">100% PAPERLESS</span>
                          </div>
                          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-eco shadow-[0_0_10px_rgba(119,177,57,0.4)]" style={{ width: '100%' }}></div>
                          </div>
                        </div>
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
                          <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gold opacity-50" />
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
              )}

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
      </div>

      {/* Floating Mila Support Button */}
      <div className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 z-50">
        <button className="bg-brand-eco text-brand-dark px-5 py-3 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-3 font-black uppercase text-[10px] sm:text-[11px] tracking-widest hover:scale-110 active:scale-95 transition-all group overflow-hidden relative">
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          <MessageSquare size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden xs:inline">Mila Intelligence</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 164, 19, 0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(200, 164, 19, 0.4); }

        @media (max-aspect-ratio: 4/3) {
           main { padding: 1.5rem; }
        }

        @media (max-width: 640px) {
          input[type="date"]::-webkit-calendar-picker-indicator {
            background: transparent;
            bottom: 0;
            color: transparent;
            cursor: pointer;
            height: auto;
            left: 0;
            position: absolute;
            right: 0;
            top: 0;
            width: auto;
          }
        }
      `}} />
    </div>
  );
};

export default DashboardPage;
