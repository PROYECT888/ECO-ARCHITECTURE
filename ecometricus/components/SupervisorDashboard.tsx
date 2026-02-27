import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, Outlet } from '../types';
import Logo from './Logo';
import MetricTrendChart from './MetricTrendChart';
import SentimentChart from './SentimentChart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Users,
  Leaf,
  Zap,
  Droplets,
  Cpu,
  MessageSquare,
  DollarSign,
  Clock,
  AlertTriangle,
  FileText,
  MessageCircle,
  LogOut,
  ChevronRight,
  Calendar,
  Cloud,
  ChevronDown,
  Info,
  History,
  TrendingDown,
  ShieldCheck,
  Award,
  Search,
  CheckCircle2,
  Settings,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  Mail,
  Printer,
  ShieldAlert,
  Target,
  X,
  Utensils,
  Heart,
  Star
} from 'lucide-react';

interface SupervisorDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [activeCommentCard, setActiveCommentCard] = useState<string | null>(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [selectedDaySales, setSelectedDaySales] = useState<any | null>(null);
  const [selectedFoodCostDay, setSelectedFoodCostDay] = useState<any | null>(null);
  const [selectedLaborCostDay, setSelectedLaborCostDay] = useState<any | null>(null);
  const [isMilaOpen, setIsMilaOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [selectedFoodWasteBar, setSelectedFoodWasteBar] = useState<any | null>(null);
  const [showWasteAlert, setShowWasteAlert] = useState(false);
  const [selectedWaterBar, setSelectedWaterBar] = useState<any | null>(null);
  const [showWaterAlert, setShowWaterAlert] = useState(false);

  // Dynamic Data Linkage - Same session persistence
  const [sessionOutlets, setSessionOutlets] = useState<Outlet[]>([]);
  const [sessionWasteEntries, setSessionWasteEntries] = useState<any[]>([]);
  const [sessionResourceEntries, setSessionResourceEntries] = useState<any[]>([]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync session data
  const loadSessionData = () => {
    const savedOutlets = localStorage.getItem('ecometricus_outlets');
    const savedWaste = localStorage.getItem('ecometricus_waste_entries');
    const savedResources = localStorage.getItem('ecometricus_resource_entries');
    if (savedOutlets) setSessionOutlets(JSON.parse(savedOutlets));
    if (savedWaste) setSessionWasteEntries(JSON.parse(savedWaste));
    if (savedResources) setSessionResourceEntries(JSON.parse(savedResources));
  };

  useEffect(() => {
    loadSessionData();
    window.addEventListener('focus', loadSessionData);
    return () => window.removeEventListener('focus', loadSessionData);
  }, []);

  // Operational Benchmarks
  const benchmarks = {
    waste: 100,
    foodCost: 28.0,
    laborCost: 15.0,
    avgSales: 50000
  };

  // Weekly Trend Data
  const weeklyTrends = [
    { day: 'Sun', foodCost: 27.5, laborCost: 16.5 },
    { day: 'Mon', foodCost: 29.2, laborCost: 18.2 },
    { day: 'Tue', foodCost: 28.1, laborCost: 17.0 },
    { day: 'Wed', foodCost: 28.5, laborCost: 15.5 },
    { day: 'Thu', foodCost: 27.8, laborCost: 14.8 },
    { day: 'Fri', foodCost: 30.5, laborCost: 16.0 },
    { day: 'Sat', foodCost: 29.8, laborCost: 15.2 },
  ];

  const salesHistory = [
    { day: 'Sun', food: 18789, bev: 27456 },
    { day: 'Mon', food: 15420, bev: 22890 },
    { day: 'Tue', food: 16550, bev: 25120 },
    { day: 'Wed', food: 18200, bev: 29800 },
    { day: 'Thu', food: 20350, bev: 34600 },
    { day: 'Fri', food: 24100, bev: 44200 },
    { day: 'Sat', food: 25800, bev: 49950 },
  ];

  const sentimentHistory = [
    { day: 'Sun', value: 4.6 },
    { day: 'Mon', value: 4.5 },
    { day: 'Tue', value: 4.2 },
    { day: 'Wed', value: 2.9, trigger: 'Critical Threshold - Staffing Shortage', worstComments: ["Waited 45 mins for main course.", "Staff seemed overwhelmed and ignored our table."] },
    { day: 'Thu', value: 3.8, trigger: 'Below Target - Kitchen Lag', worstComments: ["Food was cold when it arrived.", "Lack of attention to detail today."] },
    { day: 'Fri', value: 4.1 },
    { day: 'Sat', value: 3.2, trigger: 'Critical Threshold - Overbooking Error', worstComments: ["Table wasn't ready despite reservation.", "Extremely loud atmosphere, couldn't talk."] }
  ];

  // Recalculate operational data based on session linkage
  const sessionData = useMemo(() => {
    const totalWasteKg = sessionWasteEntries.reduce((sum, e) => sum + e.amount, 0);
    const totalWaterUsage = sessionResourceEntries.filter(e => e.type === 'water').reduce((sum, e) => sum + e.amount, 0);
    const totalEnergyUsage = sessionResourceEntries.filter(e => e.type === 'energy').reduce((sum, e) => sum + e.amount, 0);

    // Dynamic Predictive Insights
    const hourlyWaste: Record<string, number> = {};
    sessionWasteEntries.forEach(e => {
      const hour = e.timestamp?.split(',')[1]?.trim()?.split(':')[0] || 'Unknown';
      hourlyWaste[hour] = (hourlyWaste[hour] || 0) + e.amount;
    });
    const peakHour = Object.entries(hourlyWaste).sort((a, b) => b[1] - a[1])[0]?.[0] || '12';
    const drift = totalWasteKg > benchmarks.waste ? ((totalWasteKg - benchmarks.waste) / benchmarks.waste) * 100 : 0;

    // Gamification - Shift Champions (Staff who logged the most waste precisely)
    const staffContributions: Record<string, { weight: number, count: number }> = {};
    sessionWasteEntries.forEach(e => {
      if (e.staffName) {
        if (!staffContributions[e.staffName]) staffContributions[e.staffName] = { weight: 0, count: 0 };
        staffContributions[e.staffName].weight += e.amount;
        staffContributions[e.staffName].count += 1;
      }
    });
    const champions = Object.entries(staffContributions)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Impact coefficients matching StaffPortal logic
    const costPerItemUnit = 7.50;
    const costPerDisposalUnit = 1.25;
    const carbonCoeff = 2.85;
    const waterCoeff = 3.40;

    const financialLossItems = totalWasteKg * costPerItemUnit;
    const financialLossDisposal = totalWasteKg * costPerDisposalUnit;
    const totalFinancialLoss = financialLossItems + financialLossDisposal;

    return {
      waste: {
        kg: totalWasteKg || 142.5,
        cost: financialLossItems || 1068.75,
        disposalCost: financialLossDisposal || 178.10
      },
      water: totalWaterUsage || 12450,
      energy: totalEnergyUsage || 480,
      predictive: {
        peakHour,
        drift,
        champions
      },
      impacts: {
        carbonImpact: (totalWasteKg || 142.5) * carbonCoeff,
        waterFootprint: (totalWasteKg || 142.5) * waterCoeff,
        totalFinancialLoss: totalFinancialLoss || 1246.85,
        isDeviating: (totalWasteKg || 142.5) > benchmarks.waste
      }
    };
  }, [sessionWasteEntries, sessionResourceEntries, benchmarks.waste]);

  const operationalData = {
    sales: 373225.00,
    profitMargin: 24.5,
    avgCheck: 185.00,
    foodCost: 28.2,
    laborCost: 15.5,
    customerReview: 4.8,
    ...sessionData
  };

  const impacts = sessionData.impacts;

  // Derived information linked to Admin Data
  const currentOutletName = useMemo(() => {
    const found = sessionOutlets.find(o => o.code === user.outletCode);
    return found ? found.name : (user.outletCode === 'ROY02' ? 'Royal' : 'Fisher’s');
  }, [sessionOutlets, user.outletCode]);

  // Refined Tooltip for edge cases
  const Tooltip = ({ id, text, align = 'center' }: { id: string, text: string, align?: 'center' | 'right' }) => (
    <div className="relative inline-block ml-2 align-middle">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setShowTooltip(showTooltip === id ? null : id);
        }}
        className={`transition-colors focus:outline-none ${showTooltip === id ? 'text-brand-gold' : 'text-gray-500 hover:text-brand-gold'}`}
      >
        <Info size={16} />
      </button>
      {showTooltip === id && (
        <div className={`absolute bottom-full mb-4 w-64 p-4 bg-[#152E2A] border-2 border-brand-gold rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[200] animate-in fade-in zoom-in-95 duration-200 ${align === 'right' ? 'right-0 translate-x-4' : 'left-1/2 -translate-x-1/2'}`}>
          <p className="text-[10px] text-gray-200 font-black uppercase leading-relaxed tracking-[0.1em]">
            {text}
          </p>
          <div className={`absolute bottom-[-9px] w-4 h-4 bg-[#152E2A] border-r-2 border-b-2 border-brand-gold rotate-45 ${align === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'}`}></div>
        </div>
      )}
    </div>
  );

  const KpiCard = ({ id, label, value, unit, icon: Icon, color, trend, tooltipText }: any) => (
    <div className={`bg-[#0f2420] border-2 border-brand-gold/40 p-6 rounded-[30px] shadow-2xl space-y-4 group hover:border-brand-gold/70 transition-all relative ${activeCommentCard === id ? 'ring-2 ring-brand-gold/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className={`p-3 bg-brand-dark/60 rounded-xl border-2 border-white/10 group-hover:border-brand-gold/30 transition-all`}>
          <Icon className={color || 'text-brand-gold'} size={20} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveCommentCard(activeCommentCard === id ? null : id)}
            className={`transition-colors ${comments[id] ? 'text-brand-gold' : 'text-gray-600 hover:text-brand-gold'}`}
          >
            <MessageCircle size={16} />
          </button>
          <Tooltip id={id} text={tooltipText || `${label} metrics tracking for the current operational shift.`} />
        </div>
      </div>
      <div>
        <h4 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em]">{label}</h4>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-2xl font-black text-white">{value}</span>
          <span className="text-[10px] font-bold text-gray-500 uppercase">{unit}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 mt-2 text-[9px] font-black uppercase tracking-widest ${trend > 0 ? 'text-brand-eco' : 'text-brand-alert'}`}>
            {trend > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {Math.abs(trend)}% vs Last Period
          </div>
        )}
      </div>
      {activeCommentCard === id && (
        <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
          <textarea
            className="w-full bg-brand-dark/80 border border-white/10 rounded-xl p-3 text-[10px] text-white outline-none focus:border-brand-gold resize-none h-20"
            placeholder="Add operational feedback for staff..."
            value={comments[id] || ""}
            onChange={(e) => setComments({ ...comments, [id]: e.target.value })}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={() => setActiveCommentCard(null)}
              className="px-3 py-1 bg-brand-gold text-brand-dark rounded-full text-[8px] font-black uppercase tracking-widest"
            >
              Commit Comment
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const handleDigitalReport = () => {
    alert("Compiling Digital PDF Report...\nIncluding Supervisor Comments & ESG Deviations.");
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col font-body selection:bg-brand-gold/20 selection:text-brand-gold antialiased overflow-x-hidden" onClick={() => { setShowTooltip(null); setSelectedFoodCostDay(null); setSelectedLaborCostDay(null); setSelectedFoodWasteBar(null); setShowWasteAlert(false); setSelectedWaterBar(null); setShowWaterAlert(false); }}>

      {/* Header Profile - Linked with Admin Outlet Data */}
      <header className="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur-xl border-b-2 border-brand-gold/50 h-20 sm:h-24 shrink-0 shadow-lg px-4 sm:px-8">
        <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="md" />
            <div className="hidden xs:block">
              <h1 className="text-base font-geometric font-bold text-white uppercase tracking-tight">Ecometricus Portal</h1>
              <p className="text-[8px] font-black text-brand-gold uppercase tracking-[0.4em]">Supervisor Command — {user.outletCode}</p>
            </div>
          </div>

          <div className="flex flex-col items-end text-right">
            <span className="text-sm font-geometric font-bold text-white uppercase tracking-tight">
              {user.fullName} | <span className="text-brand-gold">{user.position}</span>
            </span>
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] mt-0.5">
              Outlet: <span className="text-white">{currentOutletName}</span>
            </span>
            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                <Clock size={12} className="text-brand-gold/60" />
                <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-gold to-transparent shadow-[0_0_15px_#C8A413]"></div>
      </header>

      <main className="flex-grow p-4 sm:p-10 lg:p-14 xl:p-20 space-y-12 sm:space-y-16 lg:space-y-20">

        {/* Weekly Performance Cycle Container - Improved Layout Visibility */}
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-6">
          <div className="flex-grow flex flex-col md:flex-row justify-between items-center bg-[#0f2420] border-2 border-white/5 p-6 sm:p-10 lg:p-12 rounded-[30px] sm:rounded-[40px] gap-8 transition-all duration-500 hover:border-white/10 relative overflow-hidden group shadow-2xl min-h-[180px]">
            <div className="flex flex-col items-center sm:items-start gap-4 z-10 w-full md:w-auto text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-4xl font-geometric font-black text-white uppercase tracking-tight leading-tight">Weekly Performance Cycle</h2>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Calendar className="text-brand-gold shrink-0" size={16} />
                <p className="text-[8px] sm:text-[10px] lg:text-xs font-black text-brand-gold uppercase tracking-[0.2em] opacity-80">Cut Period: Sun 12:00 AM — Sat 11:59 PM</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto z-10 items-stretch shrink-0">
              <button
                onClick={handleDigitalReport}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-gold text-brand-dark rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(200,164,19,0.3)]"
              >
                <Printer size={18} strokeWidth={2.5} /> Digital Print Report
              </button>
              <button
                onClick={() => setShowAuditModal(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-brand-dark border-2 border-brand-gold text-brand-gold rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-[0.1em] hover:bg-brand-gold hover:text-brand-dark hover:scale-105 active:scale-95 transition-all shadow-[0_10px_20px_rgba(0,0,0,0.4)]"
              >
                <ClipboardList size={18} strokeWidth={2.5} /> Audit Daily Entries
              </button>
            </div>
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          </div>

          {sessionWasteEntries.length < 5 && (
            <div className="lg:w-1/4 bg-brand-alert/10 border-2 border-brand-alert/30 p-6 rounded-[30px] sm:rounded-[40px] flex items-center gap-4 animate-pulse shadow-[0_0_30px_rgba(255,49,49,0.1)] cursor-pointer" onClick={() => setIsMilaOpen(true)}>
              <AlertTriangle className="text-brand-alert shrink-0" size={24} />
              <div>
                <h4 className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1 text-brand-alert">Low Data Density</h4>
                <p className="text-[7px] font-bold text-white uppercase tracking-widest opacity-80">Shift logs may be incomplete ({sessionWasteEntries.length} entries).</p>
              </div>
            </div>
          )}
        </div>

        {/* KPIs REPORT Section Title */}
        <div className="max-w-[1700px] mx-auto mb-8 px-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-geometric font-black text-white tracking-tight leading-none">KPIs REPORT</h2>
        </div>

        {/* Weekly Trends: Food and Labor */}
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Food Cost % Trend Chart */}
          <MetricTrendChart
            title="Food Cost %"
            icon={Utensils}
            data={weeklyTrends.map(t => ({ day: t.day, value: t.foodCost }))}
            benchmark={28}
            yDomain={[24, 38]}
            lineColor="#39ff14"
            iconColor="#39ff14"
          />

          {/* Labor Cost % Trend Chart */}
          <MetricTrendChart
            title="Labor Cost %"
            icon={Users}
            data={[
              { day: 'Sun', value: 22 },
              { day: 'Mon', value: 24 },
              { day: 'Tue', value: 28 },
              { day: 'Wed', value: 32 },
              { day: 'Thu', value: 28 },
              { day: 'Fri', value: 35 },
              { day: 'Sat', value: 36 }
            ]}
            benchmark={30}
            yDomain={[20, 40]}
            lineColor="#ff9100"
            iconColor="#39ff14"
          />
        </div>

        {/* Weekly Trends: Profit Margin and Total Sales */}
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Profit Margin % Trend Chart */}
          <MetricTrendChart
            title="Profit Margin %"
            icon={TrendingUp}
            data={[
              { day: 'Sun', value: 12 },
              { day: 'Mon', value: 14 },
              { day: 'Tue', value: 10 },
              { day: 'Wed', value: 6 },
              { day: 'Thu', value: 9 },
              { day: 'Fri', value: 13 },
              { day: 'Sat', value: 15 }
            ]}
            benchmark={8}
            yDomain={[2, 18]}
            lineColor="#39ff14"
            iconColor="#39ff14"
          />

          {/* Total Outlet Sales Card - FINALIZED UI */}
          <div className="relative w-full bg-[#051a14] border-2 border-[#d4af37]/30 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-500 group">

            {/* Header Section - STRICTLY FLUSH-LEFT ALIGNMENT */}
            <div className="relative z-10 w-full mb-6">
              <div className="flex justify-between items-start mb-4">
                {/* Small Icon Pod - Stacked at the left margin */}
                <div className="p-2.5 bg-brand-dark/60 rounded-xl border-2 border-white/10 shrink-0 flex items-center justify-center">
                  <BarChart3 className="text-[#39ff14]" size={18} strokeWidth={2.5} />
                </div>

                {/* Flashing Attention Alert - Top Right */}
                <div className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer hover:bg-red-500/20 transition-all">
                  <AlertTriangle size={20} className="text-red-500" strokeWidth={3} />
                  <span className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">ATTENTION</span>
                  <Info size={14} className="text-red-500/80 ml-1" />
                </div>
              </div>

              {/* Text lines stacked perfectly flush-left */}
              <div className="flex flex-col space-y-1">
                <h4 className="text-[#d4af37] text-2xl sm:text-3xl font-black uppercase tracking-widest drop-shadow-sm leading-none">Total Outlet Sales</h4>
                <p className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] opacity-80 leading-none py-1">Performance Variance vs regional benchmark</p>
                <p className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] leading-none">
                  Benchmark: <span className="text-white">$85,000</span>
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-[280px] w-full relative mt-8 px-2">
              {/* Badges in the top-right of chart area */}
              <div className="absolute top-0 right-0 flex flex-col gap-2 z-10">
                <div className="flex flex-col p-2 bg-brand-dark/40 rounded-xl border border-white/5 text-right min-w-[100px]">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">WEEKLY TOTAL</span>
                  <span className="text-xs font-black text-white uppercase tracking-tight">${operationalData.sales.toLocaleString()}</span>
                </div>
                <div className="flex flex-col p-2 bg-brand-dark/40 rounded-xl border border-white/5 text-right min-w-[100px]">
                  <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">AVG DAILY</span>
                  <span className="text-xs font-black text-brand-gold uppercase tracking-tight">${(operationalData.sales / 7).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              </div>

              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-1 z-10">
                {[120, 90, 60, 30, 0].map((val) => (
                  <div key={val} className="relative flex items-center justify-end pr-3 h-0">
                    <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{val}K</span>
                    <div className="absolute right-0 w-2 h-[1px] bg-white/10"></div>
                  </div>
                ))}
              </div>

              {/* Grid Lines */}
              <div className="absolute left-[30px] right-0 top-0 bottom-0 flex flex-col justify-between">
                {[120, 90, 60, 30, 0].map((val) => (
                  <div key={val} className="w-full border-t border-white/5 h-0"></div>
                ))}
              </div>

              {/* Gold Dotted Benchmark Line at 85k */}
              <div className="absolute left-[30px] right-0" style={{ bottom: `${(85 / 120) * 100}%` }}>
                <div className="w-full border-t-2 border-[#d4af37] border-dashed" style={{ borderStyle: 'dashed' }}></div>
              </div>

              {/* Stacked Bars Selection */}
              <div className="absolute left-[30px] right-0 top-0 bottom-0 flex items-end justify-between px-2 sm:px-6">
                {salesHistory.map((day) => {
                  const total = day.food + day.bev;
                  // Scale to 120,000
                  const totalHeight = (total / 120000) * 100;
                  const bevPercent = (day.bev / total) * 100;
                  const foodPercent = (day.food / total) * 100;
                  const isSelected = selectedDaySales?.day === day.day;

                  return (
                    <div key={day.day} className="flex flex-col items-center gap-2 w-8 sm:w-10 group/bar relative">
                      {/* Interaction: Pop-up on click */}
                      <div className="w-full flex flex-col justify-end h-60 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedDaySales(isSelected ? null : day); }}>
                        <div
                          className={`w-full flex flex-col rounded-t-md overflow-hidden transition-all duration-300 border ${isSelected ? 'ring-4 ring-brand-gold border-transparent scale-105' : 'border-white/5 hover:scale-105'}`}
                          style={{ height: `${totalHeight}%` }}
                        >
                          {/* Orange (Beverage) on Top */}
                          <div className="bg-[#FF9108] w-full" style={{ height: `${bevPercent}%` }}></div>
                          {/* Green (Food) at Bottom */}
                          <div className="bg-[#77B139] w-full" style={{ height: `${foodPercent}%` }}></div>
                        </div>
                      </div>
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{day.day}</span>

                      {/* Click-in Pop-up Window - STRICT POSITION FIX */}
                      {isSelected && (
                        <div className={`absolute bottom-[80px] w-36 bg-[#051a14] border-2 border-brand-gold p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${day.day === 'Fri' || day.day === 'Sat' ? 'right-0 translate-x-0' : (day.day === 'Sun' || day.day === 'Mon' ? 'left-0 translate-x-0' : 'left-1/2 -translate-x-1/2')}`}>
                          <div className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-3 border-b border-white/10 pb-2 flex justify-between gap-4">
                            <span>{day.day} SALES</span>
                            <span className="text-white">${total.toLocaleString()}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-black text-[#77B139] uppercase tracking-wider">Food Revenue:</span>
                              <span className="text-[11px] font-black text-white">${day.food.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-black text-[#FF9108] uppercase tracking-wider">Bev Revenue:</span>
                              <span className="text-[11px] font-black text-white">${day.bev.toLocaleString()}</span>
                            </div>
                          </div>
                          {/* Anchor Pointer */}
                          <div className={`absolute bottom-[-10px] w-4 h-4 bg-[#051a14] border-r-2 border-b-2 border-brand-gold rotate-45 ${day.day === 'Fri' || day.day === 'Sat' ? 'right-4' : (day.day === 'Sun' || day.day === 'Mon' ? 'left-4' : 'left-1/2 -translate-x-1/2')}`}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Trends: Customer Sentiment - NEW ROW */}
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SentimentChart
            data={sentimentHistory}
            title="Customer Sentiment"
            subtitle="Daily performance analysis & triggers"
            icon={Heart}
          />
          {/* Section Expansion Slot for symmetry */}
          <div className="hidden lg:flex bg-[#051a14]/40 rounded-[30px] border-2 border-dashed border-white/5 items-center justify-center p-8 group/slot hover:border-brand-gold/20 transition-all duration-500">
            <div className="text-center opacity-20 group-hover/slot:opacity-40 transition-opacity">
              <Star className="text-brand-gold mx-auto mb-3" size={32} />
              <p className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Section Expansion Slot</p>
            </div>
          </div>
        </div>



        {/* SUSTAINABILITY REPORT Section */}
        <div className="max-w-[1700px] mx-auto mb-8 px-2">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-geometric font-black text-white tracking-tight leading-none">SUSTAINABILITY REPORT</h2>
        </div>

        {/* Food Waste and Water Usage Charts - Side by Side */}
        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="relative w-full bg-[#051a14] border-2 border-[#d4af37]/30 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-500 group">

            {/* Header Section */}
            <div className="relative z-10 w-full mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-brand-dark/60 rounded-xl border-2 border-white/10 shrink-0 flex items-center justify-center">
                  <Leaf className="text-[#77B139]" size={20} strokeWidth={2.5} />
                </div>

                {/* Attention Icon */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWasteAlert(!showWasteAlert);
                    }}
                    className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <AlertTriangle size={20} className="text-red-500" strokeWidth={3} />
                    <span className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">ATTENTION</span>
                    <Info size={14} className="text-red-500/80 ml-1" />
                  </button>

                  {/* Alert Tooltip */}
                  {showWasteAlert && (
                    <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-[#051a14]/95 backdrop-blur-xl border-2 border-red-500/50 rounded-[20px] shadow-[0_10px_40px_rgba(239,68,68,0.5)] z-[200] animate-in fade-in zoom-in-95 duration-200">
                      <p className="text-[11px] text-white font-bold leading-relaxed">
                        Multiple days have exceeded the 100kg threshold.
                      </p>
                      <div className="absolute top-[-9px] right-6 w-4 h-4 bg-[#051a14]/95 border-l-2 border-t-2 border-red-500/50 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <h4 className="text-[#d4af37] text-2xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-sm leading-none">
                  FOOD WASTE
                </h4>
                <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] opacity-80 leading-none py-2">
                  Daily Waste Measurement
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-[300px] w-full relative mt-8 px-2">
              {/* Y-Axis Labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-1 z-10">
                {[160, 120, 80, 40, 0].map((val) => (
                  <div key={val} className="relative flex items-center justify-end pr-3 h-0">
                    <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">{val}kg</span>
                    <div className="absolute right-0 w-2 h-[1px] bg-white/10"></div>
                  </div>
                ))}
              </div>

              {/* Grid Lines */}
              <div className="absolute left-[30px] right-0 top-0 bottom-0 flex flex-col justify-between">
                {[160, 120, 80, 40, 0].map((val) => (
                  <div key={val} className="w-full border-t border-white/5 h-0"></div>
                ))}
              </div>

              {/* Gold Dotted Benchmark Line at 100kg */}
              <div className="absolute left-[30px] right-0" style={{ bottom: `${(100 / 160) * 100}%` }}>
                <div className="w-full border-t-2 border-[#d4af37] border-dashed" style={{ borderStyle: 'dashed' }}></div>
              </div>

              {/* Individual Bars */}
              <div className="absolute left-[30px] right-0 top-0 bottom-0 flex items-end justify-between px-2 sm:px-6">
                {[
                  { day: 'Sun', value: 95 },
                  { day: 'Mon', value: 120 },
                  { day: 'Tue', value: 90 },
                  { day: 'Wed', value: 105 },
                  { day: 'Thu', value: 80 },
                  { day: 'Fri', value: 130, reason: 'Breakfast Buffet Over-prep' },
                  { day: 'Sat', value: 150, reason: 'Wedding Banquet - 250 Pax' }
                ].map((entry) => {
                  const barHeight = (entry.value / 160) * 100;
                  const isSelected = selectedFoodWasteBar?.day === entry.day;
                  const barColor = entry.value > 100 ? '#ef4444' : '#39ff14';

                  return (
                    <div key={entry.day} className="flex flex-col items-center gap-2 w-8 sm:w-10 group/bar relative">
                      {/* Bar */}
                      <div className="w-full flex flex-col justify-end h-60 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedFoodWasteBar(isSelected ? null : entry); }}>
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 border ${isSelected ? 'ring-4 ring-brand-gold border-transparent scale-105' : 'border-white/5 hover:scale-105'}`}
                          style={{ height: `${barHeight}%`, backgroundColor: barColor }}
                        ></div>
                      </div>
                      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{entry.day}</span>

                      {/* Pop-up Window */}
                      {isSelected && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className={`absolute bottom-[80px] w-48 bg-[#051a14] border-2 border-brand-gold p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${entry.day === 'Fri' || entry.day === 'Sat' ? 'right-0 translate-x-0' : (entry.day === 'Sun' || entry.day === 'Mon' ? 'left-0 translate-x-0' : 'left-1/2 -translate-x-1/2')}`}>
                          <div className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
                            {entry.day} WASTE
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-[8px] font-black text-white/60 uppercase tracking-wider">Amount:</span>
                              <span className="text-[13px] font-black text-white">{entry.value}kg</span>
                            </div>
                            {entry.reason && (
                              <div className="mt-3 p-2 bg-red-500/10 rounded-lg border border-red-500/30">
                                <span className="text-[7px] font-black text-red-500 uppercase tracking-widest block mb-1">REASON</span>
                                <span className="text-[9px] font-bold text-white">{entry.reason}</span>
                              </div>
                            )}
                          </div>
                          <div className={`absolute bottom-[-10px] w-4 h-4 bg-[#051a14] border-r-2 border-b-2 border-brand-gold rotate-45 ${entry.day === 'Fri' || entry.day === 'Sat' ? 'right-4' : (entry.day === 'Sun' || entry.day === 'Mon' ? 'left-4' : 'left-1/2 -translate-x-1/2')}`}></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Water Usage Bar Chart Card */}
          <div className="relative w-full bg-[#051a14] border-2 border-[#d4af37]/30 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-500 group">

            {/* Header Section */}
            <div className="relative z-10 w-full mb-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-brand-dark/60 rounded-xl border-2 border-white/10 shrink-0 flex items-center justify-center">
                  <Droplets className="text-blue-400" size={20} strokeWidth={2.5} />
                </div>

                {/* Attention Icon */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowWaterAlert(!showWaterAlert);
                    }}
                    className="flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/50 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] hover:bg-red-500/20 transition-all cursor-pointer"
                  >
                    <AlertTriangle size={20} className="text-red-500" strokeWidth={3} />
                    <span className="text-red-500 font-black text-xs uppercase tracking-[0.2em]">ATTENTION</span>
                    <Info size={14} className="text-red-500/80 ml-1" />
                  </button>

                  {/* Alert Tooltip */}
                  {showWaterAlert && (
                    <div className="absolute top-full right-0 mt-2 w-64 p-4 bg-[#051a14]/95 backdrop-blur-xl border-2 border-red-500/50 rounded-[20px] shadow-[0_10px_40px_rgba(239,68,68,0.5)] z-[200] animate-in fade-in zoom-in-95 duration-200">
                      <p className="text-[11px] text-white font-bold leading-relaxed">
                        Multiple days have exceeded the 27,000L threshold.
                      </p>
                      <div className="absolute top-[-9px] right-6 w-4 h-4 bg-[#051a14]/95 border-l-2 border-t-2 border-red-500/50 rotate-45"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col space-y-1">
                <h4 className="text-[#d4af37] text-2xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-sm leading-none">
                  WATER USAGE
                </h4>
                <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] opacity-80 leading-none py-2">
                  Benchmark (Regional): 27,000 Liters
                </p>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-[300px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { day: 'Sun', value: 26000 },
                    { day: 'Mon', value: 25000 },
                    { day: 'Tue', value: 28500 },
                    { day: 'Wed', value: 30200 },
                    { day: 'Thu', value: 24800 },
                    { day: 'Fri', value: 32000 },
                    { day: 'Sat', value: 29500 }
                  ]}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 900 }}
                    dy={10}
                  />
                  <YAxis
                    domain={[22000, 34000]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 900 }}
                    dx={-10}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  />

                  {/* Gold Dotted Threshold Line at 27000L */}
                  <ReferenceLine
                    y={27000}
                    stroke="#d4af37"
                    strokeDasharray="6 6"
                    strokeWidth={2.5}
                    label={{
                      value: 'THRESHOLD 27k',
                      position: 'insideRight',
                      dx: -10,
                      dy: -10,
                      fill: '#d4af37',
                      fontSize: 11,
                      fontWeight: 900
                    }}
                  />

                  {/* Individual Bars with Click Handlers */}
                  {[
                    { day: 'Sun', value: 26000 },
                    { day: 'Mon', value: 25000 },
                    { day: 'Tue', value: 28500 },
                    { day: 'Wed', value: 30200 },
                    { day: 'Thu', value: 24800 },
                    { day: 'Fri', value: 32000 },
                    { day: 'Sat', value: 29500 }
                  ].map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      dataKey="value"
                      data={[entry]}
                      fill={entry.value >= 27000 ? '#ef4444' : '#3b82f6'}
                      radius={[8, 8, 0, 0]}
                      cursor="pointer"
                      onClick={() => {
                        setSelectedWaterBar(selectedWaterBar?.day === entry.day ? null : entry);
                      }}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>

              {/* Custom Pop-up Window - Daily Measure */}
              {selectedWaterBar && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`absolute top-0 w-64 bg-[#051a14]/95 backdrop-blur-3xl border-2 border-[#d4af37]/40 p-5 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-50 animate-in fade-in zoom-in-95 duration-300 ${selectedWaterBar.day === 'Sat' || selectedWaterBar.day === 'Fri'
                    ? 'left-4'
                    : (selectedWaterBar.day === 'Sun' || selectedWaterBar.day === 'Mon' ? 'left-4' : 'left-1/2 -translate-x-1/2')
                    }`}>

                  {/* Header */}
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-[#d4af37] uppercase tracking-[0.25em]">
                        {selectedWaterBar.day} USAGE
                      </span>
                      <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">
                        Daily Water Usage
                      </span>
                    </div>
                    <div className={`px-3 py-1 rounded-xl text-sm font-black ring-2 ring-inset ${selectedWaterBar.value >= 27000
                      ? 'bg-red-500/20 text-red-500 ring-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-[#3b82f6]/20 text-[#3b82f6] ring-[#3b82f6]/40'
                      }`}>
                      {(selectedWaterBar.value / 1000).toFixed(1)}kL
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                      <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">AMOUNT</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-white">{(selectedWaterBar.value / 1000).toFixed(1)}</span>
                        <span className="text-[11px] font-bold text-white/30">kL</span>
                      </div>
                    </div>
                  </div>

                  {/* Pointer */}
                  <div className={`absolute bottom-[-11px] w-5 h-5 bg-[#051a14]/95 backdrop-blur-3xl border-r-2 border-b-2 border-[#d4af37]/40 rotate-45 ${selectedWaterBar.day === 'Sat' || selectedWaterBar.day === 'Fri'
                    ? 'left-12'
                    : (selectedWaterBar.day === 'Sun' || selectedWaterBar.day === 'Mon' ? 'left-12' : 'left-1/2 -translate-x-1/2')
                    }`}></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MILA Actionable Intelligence - Linked with Chef Session Data */}
        <div className="max-w-[1600px] mx-auto">
          <div className="bg-[#0f2420] border-2 border-brand-gold/60 rounded-[40px] p-8 sm:p-14 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <MessageSquare size={160} className="text-brand-gold" />
            </div>
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-brand-gold rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(200,164,19,0.4)] border-2 border-white/20 shrink-0">
                <Cpu className="text-brand-dark" size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-geometric font-black text-white uppercase tracking-tight leading-none">MILA ACTIONABLE INTELLIGENCE: Sustainability Performance Proportional Scaling</h3>
                <p className="text-[10px] font-black text-brand-gold uppercase tracking-[0.4em] mt-2">Operational ESG Strategy Hub</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
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

      </main>

      {/* Floating Mila Support Button */}
      <div className="fixed bottom-6 right-6 sm:bottom-12 sm:right-12 z-50">
        <button
          onClick={() => setIsMilaOpen(true)}
          className="bg-brand-eco text-brand-dark px-5 py-3 sm:px-8 sm:py-5 rounded-xl sm:rounded-2xl shadow-2xl flex items-center gap-3 font-black uppercase text-[10px] sm:text-[11px] tracking-widest hover:scale-110 active:scale-95 transition-all group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          <MessageSquare size={20} className="group-hover:rotate-12 transition-transform" />
          <span className="hidden xs:inline">Mila Intelligence</span>
        </button>
      </div>

      {/* Mila Strategic Sidebar Panel */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-[#051a14]/95 backdrop-blur-2xl border-l-2 border-brand-gold z-[100] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[-20px_0_80px_rgba(0,0,0,0.8)] ${isMilaOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-8 sm:p-12">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-gold rounded-xl flex items-center justify-center shadow-xl border-2 border-white/20">
                <Cpu className="text-brand-dark" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-geometric font-black text-white uppercase tracking-tight">Mila AI</h3>
                <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.4em]">Supervisor Command Hub</span>
              </div>
            </div>
            <button onClick={() => setIsMilaOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow space-y-10 overflow-y-auto pr-4 scrollbar-hide">
            <div className="space-y-4">
              <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={14} /> Operational Insight
              </span>
              <p className="text-sm font-medium text-white/90 leading-relaxed italic">
                {sessionData.predictive.drift > 10
                  ? `"Supervisor, we are seeing a ${sessionData.predictive.drift.toFixed(1)}% drift above waste benchmarks, peaking at ${sessionData.predictive.peakHour}:00. Recommendation: Immediate audit of Station Alpha's prep logs."`
                  : `"Operational stability is high. Data suggests peak activity at ${sessionData.predictive.peakHour}:00 with optimal resource utilization. Champions for this shift: ${sessionData.predictive.champions.map(c => c.name).join(', ') || 'Awaiting logs'}."`}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Shift Compliance</span>
                <div className="text-2xl font-black text-brand-eco">88.5%</div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Rec. Accuracy</span>
                <div className="text-2xl font-black text-brand-gold">99.1%</div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Shift Champions</h4>
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#051a14] bg-brand-gold flex items-center justify-center text-[10px] font-black text-brand-dark">
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {sessionData.predictive.champions.length > 0 ? sessionData.predictive.champions.map((champ, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-brand-eco/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-brand-eco animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-tight">{champ.name}</span>
                    </div>
                    <span className="text-[10px] font-black text-brand-eco uppercase">{champ.count} Precision Logs</span>
                  </div>
                )) : (
                  <div className="p-10 border-2 border-dashed border-white/10 rounded-3xl text-center">
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Awaiting shift activity...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Priority Actions</h4>
              <div className="space-y-4">
                {[
                  { icon: Leaf, text: "Verify 'Prep Waste' justifications for Chef de Partie.", color: "text-brand-eco" },
                  { icon: ShieldAlert, text: "Resolve critical deviation on station FISH01.", color: "text-brand-alert" },
                  { icon: BarChart3, text: "Compile shift report for Admin review.", color: "text-brand-gold" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-brand-dark border-2 border-white/5 rounded-2xl group hover:border-brand-gold/30 transition-all cursor-pointer">
                    <item.icon className={item.color} size={18} />
                    <span className="text-xs font-bold text-white/80 group-hover:text-white transition-colors">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-10 flex gap-4 mt-auto">
            <button
              onClick={() => {
                setIsSyncing(true);
                setTimeout(() => {
                  setIsSyncing(false);
                  setSyncSuccess(true);
                  handleDigitalReport();
                  setTimeout(() => setSyncSuccess(false), 3000);
                }, 2000);
              }}
              disabled={isSyncing}
              className={`flex-grow py-4 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl relative overflow-hidden ${isSyncing ? 'bg-gray-800 text-gray-400' : syncSuccess ? 'bg-brand-eco text-white' : 'bg-brand-gold text-brand-dark hover:brightness-110 active:scale-95'}`}
            >
              <div className="flex items-center justify-center gap-2">
                {isSyncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
                    <span>Transmitting Data...</span>
                  </>
                ) : syncSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Sync Complete</span>
                  </>
                ) : (
                  "Sync with Admin HQ"
                )}
              </div>
            </button>
            <button onClick={() => setIsMilaOpen(false)} className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Audit Modal */}
      {showAuditModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="max-w-4xl w-full bg-[#0f2420] border-2 border-brand-gold p-8 rounded-[40px] shadow-2xl relative">
            <button onClick={() => setShowAuditModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
              <X size={24} />
            </button>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-geometric font-black text-white uppercase tracking-tight">Daily Data Audit Registry</h3>
            </div>
            <div className="max-h-[500px] overflow-y-auto custom-scrollbar pr-4">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-brand-gold/20">
                    <th className="py-4 text-[10px] font-black text-brand-gold uppercase tracking-widest">Entry Date/Time</th>
                    <th className="py-4 text-[10px] font-black text-brand-gold uppercase tracking-widest">Staff Identifier</th>
                    <th className="py-4 text-[10px] font-black text-brand-gold uppercase tracking-widest">Category / Item</th>
                    <th className="py-4 text-[10px] font-black text-brand-gold uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {sessionWasteEntries.length > 0 ? sessionWasteEntries.map((entry, i) => (
                    <tr key={i} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-4 text-[11px] font-bold text-gray-400">{entry.timestamp}</td>
                      <td className="py-4 text-[11px] font-black text-white uppercase tracking-tight">{entry.staffName || 'Staff ID Anonymous'}</td>
                      <td className="py-4 text-[11px] font-bold text-gray-400">{entry.product}</td>
                      <td className="py-4 text-[10px] font-black uppercase text-right">
                        <span className="text-brand-eco">Verified</span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-gray-500 font-black uppercase tracking-[0.4em] text-[12px] italic">
                        No active session data found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Footer */}
      <footer className="bg-brand-dark/95 border-t-2 border-brand-gold/50 py-10 px-12 shrink-0">
        <div className="max-w-[1920px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
            <div className="text-center sm:text-left min-w-[140px]">
              <span className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 sm:mb-2">CURRENT SHIFT ACCUMULATION</span>
              <span className={`text-sm lg:text-base font-geometric font-bold uppercase tracking-tight ${operationalData.waste.kg > benchmarks.waste ? 'text-brand-alert' : 'text-brand-eco'}`}>
                {operationalData.waste.kg.toFixed(0)} / {benchmarks.waste} Kg
              </span>
            </div>
            <div className="h-10 sm:h-12 w-[1.5px] bg-white/10 hidden sm:block" />
            <div className="text-center sm:text-left min-w-[140px]">
              <span className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 sm:mb-2">METRIC SYNC STATUS</span>
              <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-brand-eco animate-pulse shadow-[0_0_10px_#77B139]" />
                <span className="text-[10px] sm:text-[11px] font-bold text-brand-eco uppercase tracking-widest">CORE ENGINE LIVE</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] font-black text-gray-500 uppercase tracking-[0.3em] hover:text-brand-alert transition-all group px-8 sm:px-12 py-3 sm:py-4 rounded-full border-2 border-white/10 hover:border-brand-alert/40 shadow-xl"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            TERMINATE SESSION
          </button>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(200, 164, 19, 0.2); border-radius: 10px; }
        
        .animate-in { animation: animate-in 0.5s ease-out forwards; }
        @keyframes animate-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
};

export default SupervisorDashboard;