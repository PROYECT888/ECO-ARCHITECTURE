import React, { useState, useEffect, useMemo } from 'react';
import { UserProfile, Outlet } from '../types';
import Logo from './Logo';
import {
  BarChart3,
  TrendingUp,
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
  ClipboardList,
  Printer,
  ShieldAlert,
  X as XIcon,
  Target
} from 'lucide-react';
import FoodCostTemplateChart from './FoodCostTemplateChart';
import LaborCostTemplateChart from './LaborCostTemplateChart';
import ProfitMarginTemplateChart from './ProfitMarginTemplateChart';
import SalesTemplateChart from './SalesTemplateChart';
import SentimentTemplateChart from './SentimentTemplateChart';

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

  // Dynamic Data Linkage - Same session persistence
  const [sessionOutlets, setSessionOutlets] = useState<Outlet[]>([]);
  const [sessionWasteEntries, setSessionWasteEntries] = useState<any[]>([]);
  const [sessionResourceEntries, setSessionResourceEntries] = useState<any[]>([]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync session data on mount
  useEffect(() => {
    const savedOutlets = localStorage.getItem('ecometricus_outlets');
    const savedWaste = localStorage.getItem('ecometricus_waste_entries');
    const savedResources = localStorage.getItem('ecometricus_resource_entries');
    if (savedOutlets) setSessionOutlets(JSON.parse(savedOutlets));
    if (savedWaste) setSessionWasteEntries(JSON.parse(savedWaste));
    if (savedResources) setSessionResourceEntries(JSON.parse(savedResources));
  }, []);

  // Operational Benchmarks
  const benchmarks = {
    waste: 100,
    foodCost: 29.0,
    laborCost: 28.0,
    profitMargin: 18.0,
    avgSales: 50000
  };

  // Mock Data for Charts
  const weeklyTrends = [
    { day: 'Sun', foodCost: 27.5, laborCost: 26, profitMargin: 14.8, sentiment: 4.8 },
    { day: 'Mon', foodCost: 29.2, laborCost: 30, profitMargin: 19.5, sentiment: 4.2 },
    { day: 'Tue', foodCost: 28.1, laborCost: 28, profitMargin: 19.2, sentiment: 4.6 },
    { day: 'Wed', foodCost: 28.5, laborCost: 36, profitMargin: 24.2, sentiment: 4.9 },
    { day: 'Thu', foodCost: 27.8, laborCost: 28, profitMargin: 16.9, sentiment: 4.4 },
    { day: 'Fri', foodCost: 30.5, laborCost: 37, profitMargin: 24.0, sentiment: 4.7 },
    { day: 'Sat', foodCost: 29.8, laborCost: 33, profitMargin: 21.0, sentiment: 4.8 },
  ];



  // Specific Data for Sales Stacked Bar Chart
  const salesChartData = [
    // Using ~40% Food / ~60% Bev split to match "Beverage driven" context, but summing EXACTLY to user totals
    { day: 'Sun', total: 16000, food: 6400, bev: 9600 },
    { day: 'Mon', total: 13000, food: 5200, bev: 7800 },
    { day: 'Tue', total: 14500, food: 5800, bev: 8700 },
    { day: 'Wed', total: 26000, food: 10400, bev: 15600 },
    { day: 'Thu', total: 17000, food: 6800, bev: 10200 },
    { day: 'Fri', total: 25000, food: 10000, bev: 15000 },
    { day: 'Sat', total: 31000, food: 12400, bev: 18600 },
  ];

  // Recalculate operational data based on session linkage
  const sessionData = useMemo(() => {
    const totalWasteKg = sessionWasteEntries.reduce((sum, e) => sum + e.amount, 0);
    const totalWaterUsage = sessionResourceEntries.filter(e => e.type === 'water').reduce((sum, e) => sum + e.amount, 0);
    const totalEnergyUsage = sessionResourceEntries.filter(e => e.type === 'energy').reduce((sum, e) => sum + e.amount, 0);

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
        kg: totalWasteKg || 142.5, // fallback to mock if session is empty for UI stability
        cost: financialLossItems || 1068.75,
        disposalCost: financialLossDisposal || 178.10
      },
      water: totalWaterUsage || 12450,
      energy: totalEnergyUsage || 480,
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
  const Tooltip = ({ id, text, align = 'center', direction = 'up' }: { id: string, text: string, align?: 'center' | 'left' | 'right', direction?: 'up' | 'down' }) => (
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
        <div className={`absolute w-64 p-4 bg-[#152E2A] border-2 border-brand-gold rounded-[20px] shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-[200] animate-in fade-in zoom-in-95 duration-200 
          ${direction === 'up' ? 'bottom-full mb-4' : 'top-full mt-4'} 
          ${align === 'right' ? 'right-0 translate-x-4' : 'left-1/2 -translate-x-1/2'}`}
        >
          <p className="text-[10px] text-gray-200 font-black uppercase leading-relaxed tracking-[0.1em]">
            {text}
          </p>
          <div className={`absolute w-4 h-4 bg-[#152E2A] border-brand-gold rotate-45 
            ${direction === 'up' ? 'bottom-[-9px] border-r-2 border-b-2' : 'top-[-9px] border-l-2 border-t-2'} 
            ${align === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'}`}></div>
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
    <div className="min-h-screen bg-brand-dark flex flex-col font-body selection:bg-brand-gold/20 selection:text-brand-gold antialiased overflow-x-hidden" onClick={() => { setShowTooltip(null); setSelectedFoodCostDay(null); setSelectedLaborCostDay(null); }}>

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

          <div className="lg:w-1/4 bg-brand-alert/10 border-2 border-brand-alert/30 p-6 rounded-[30px] sm:rounded-[40px] flex items-center gap-4 animate-pulse shadow-[0_0_30px_rgba(255,49,49,0.1)]">
            <AlertTriangle className="text-brand-alert shrink-0" size={24} />
            <div>
              <h4 className="text-[9px] font-black text-white uppercase tracking-widest leading-none mb-1 text-brand-alert">Missing Data Alert</h4>
              <p className="text-[7px] font-bold text-white uppercase tracking-widest opacity-80">Breakfast shift log incomplete.</p>
            </div>
          </div>
        </div>

        {/* KPIs REPORT Header - Section Title */}
        <div className="max-w-[1600px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-geometric font-black text-white uppercase tracking-tight">KPIs REPORT</h2>
        </div>

        {/* Weekly Trends: Food Cost % and Labor Cost % */}
        {/* Core Metrics Grid - KPI Overview */}
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="h-[280px] sm:h-[320px] w-full">
            <FoodCostTemplateChart data={weeklyTrends} benchmark={benchmarks.foodCost} />
          </div>
          <div className="h-[280px] sm:h-[320px] w-full">
            <LaborCostTemplateChart data={weeklyTrends} benchmark={benchmarks.laborCost} />
          </div>
          <div className="h-[280px] sm:h-[320px] w-full">
            <ProfitMarginTemplateChart data={weeklyTrends} benchmark={benchmarks.profitMargin} />
          </div>
          <div className="h-[280px] sm:h-[320px] w-full">
            <SalesTemplateChart data={salesChartData} benchmark={16500} />
          </div>
          <div className="h-[280px] sm:h-[320px] w-full">
            <SentimentTemplateChart data={weeklyTrends} benchmark={4.5} />
          </div>
        </div>

        {/* Metric Analytic Cumulative Cards - Linked with Session Waste, Water, Energy */}
        < div className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8" >

          <KpiCard id="waste_total" label="Cumulative Food Waste" value={`${operationalData.waste.kg.toFixed(1)}`} unit="Kg" icon={Leaf} color="text-brand-eco" trend={5.4} tooltipText="Total weight of recorded food waste from prep and plate scraps logged in the chef portal." />
          <KpiCard id="water_usage" label="Total Water Usage" value={`${operationalData.water}`} unit="L" icon={Droplets} color="text-blue-400" trend={-1.2} tooltipText="Cumulative water consumption tracked through daily meter readings in the staff portal." />
          <KpiCard id="energy_usage" label="Total Energy usage" value={`${operationalData.energy}`} unit="kWh" icon={Zap} color="text-brand-energy" trend={3.1} tooltipText="Total energy load consumption for the outlet's operation logged in the staff portal." />
        </div >



        {/* MILA Actionable Intelligence - Linked with Chef Session Data */}
        < div className="max-w-[1600px] mx-auto" >
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
        </div >

        {/* Termination & Exit Section */}
        < div className="max-w-[1600px] mx-auto pt-10 sm:pt-16 pb-12 sm:pb-20" >
          <div className="bg-brand-alert/5 border-2 border-brand-alert/20 p-8 sm:p-12 rounded-[40px] flex flex-col items-center text-center space-y-8 shadow-2xl group hover:border-brand-alert/40 transition-all">
            <div className="w-20 h-20 bg-brand-alert/10 rounded-[30px] flex items-center justify-center text-brand-alert shadow-inner border-2 border-brand-alert/20 group-hover:scale-110 transition-transform duration-500">
              <ShieldAlert size={40} />
            </div>
            <button
              onClick={onLogout}
              className="w-full sm:w-auto px-12 py-5 bg-brand-alert text-white rounded-full text-[12px] font-black uppercase tracking-[0.3em] hover:brightness-110 hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(255,49,49,0.3)] flex items-center justify-center gap-4 group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              TERMINATE SESSION & EXIT
            </button>
          </div>
        </div >
      </main >

      {/* Audit Modal */}
      {
        showAuditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/95 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="max-w-4xl w-full bg-[#0f2420] border-2 border-brand-gold p-8 rounded-[40px] shadow-2xl relative">
              <button onClick={() => setShowAuditModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors">
                <LogOut size={24} />
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
        )
      }

      {/* Persistent Footer */}
      <footer className="bg-brand-dark/95 border-t-2 border-brand-gold/50 py-10 px-12 shrink-0">
        <div className="max-w-[1920px] mx-auto flex flex-col xl:flex-row items-center justify-between gap-10 lg:gap-14">
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-16">
            <div className="text-center sm:text-left min-w-[140px]">
              <span className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1 sm:mb-2">CURRENT SHIFT ACCUMULATION</span>
              <span className={`text-sm lg:text-base font-geometric font-bold uppercase tracking-tight ${operationalData.waste.kg > benchmarks.waste ? 'text-brand-alert' : 'text-brand-eco'}`}>
                {operationalData.waste.kg.toFixed(1)} / {benchmarks.waste} Kg
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
    </div >
  );
};

export default SupervisorDashboard;