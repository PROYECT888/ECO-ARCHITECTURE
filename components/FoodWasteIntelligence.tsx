
import React from 'react';
import { AlertCircle, AlertTriangle, DollarSign, Scale, Cpu, Cloud, CheckCircle2, TrendingDown } from 'lucide-react';
import { useFoodWasteData } from '../hooks/useFoodWasteData';
import { Outlet } from '../types';

interface FoodWasteIntelligenceProps {
  outletId: string | null;
  unitType: 'kg' | 'Lbs';
  allOutlets: Outlet[];
  benchmarks: {
    food_waste_target_kg: number;
    financial_cap: number;
  };
}

const FoodWasteIntelligence: React.FC<FoodWasteIntelligenceProps> = ({
  outletId,
  unitType,
  allOutlets,
  benchmarks
}) => {
  const { totalMass, carbonImpact, financialLoss, outletDetails, isLoading } = useFoodWasteData(
    outletId,
    unitType,
    allOutlets
  );

  // Benchmarks & Targets (Aligned with user request)
  const massTarget = 80;
  const carbonTarget = 144;
  const financialCap = 650;

  // Attention Logic
  const showAlertMass = totalMass > (unitType === 'Lbs' ? massTarget * 2.20462 : massTarget);
  const showAlertCarbon = carbonImpact > carbonTarget;
  const showAlertFinance = financialLoss > financialCap;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Mila Actionable Intelligence Header */}
      <div className="flex items-center gap-6 mb-10">
        <div className="p-4 bg-brand-gold rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.4)]">
          <Cpu className="text-[#0B221E]" size={32} />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-tight">
            Mila Actionable Intelligence
          </h2>
          <div className="flex items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
              Sustainability Performance Proportional Scaling
            </p>
          </div>
        </div>
      </div>

      {/* 3-Column KPI Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Carbon Lifecycle */}
        <div className="bg-[#0B221E] border border-white/10 rounded-[32px] p-8 relative overflow-hidden transition-all duration-500 hover:border-brand-gold/20 flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Cloud size={16} className="text-brand-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Carbon Lifecycle</h4>
            </div>

            <div className="mb-4">
              <p className="text-4xl font-black text-white tracking-tighter leading-none">
                {parseFloat(carbonImpact.toFixed(1)).toLocaleString()} <span className="text-xs font-medium text-white/30 uppercase ml-1">KG CO2E</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showAlertCarbon ? (
              <>
                <AlertTriangle size={14} className="text-[#FF4D4D]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Operational Deviation Impact.</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-[#77B139]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Averted Loss Footprint.</span>
              </>
            )}
          </div>
        </div>

        {/* Card 2: Resource Footprint */}
        <div className="bg-[#0B221E] border border-white/10 rounded-[32px] p-8 relative overflow-hidden transition-all duration-500 hover:border-brand-gold/20 flex flex-col justify-between h-[230px]">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Scale size={16} className="text-brand-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Water Resource</h4>
            </div>

            <div className="mb-4">
              <p className="text-4xl font-black text-white tracking-tighter leading-none">
                {totalMass.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span className="text-xs font-medium text-white/30 uppercase ml-1">M³ LOSS</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {showAlertMass ? (
              <>
                <AlertTriangle size={14} className="text-[#FF4D4D]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Operational Deviation Impact.</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} className="text-[#77B139]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Averted Loss Footprint.</span>
              </>
            )}
          </div>
        </div>

        {/* Card 3: Financial Impact */}
        <div className={`bg-[#0B221E] border ${showAlertFinance ? 'border-[#FF0000] border-2 shadow-[0_0_40px_rgba(255,0,0,0.3)]' : 'border-white/10'} rounded-[32px] p-8 relative overflow-hidden transition-all duration-500 flex flex-col justify-between h-[230px]`}>
          <div>
            <div className={`flex items-center gap-3 mb-6 ${showAlertFinance ? 'text-[#FF4D4D]' : 'text-brand-gold'}`}>
              <DollarSign size={16} />
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] leading-none">Financial Impact</h4>
            </div>

            <div className="mb-2">
              <p className={`text-5xl font-black ${showAlertFinance ? 'text-[#FF4D4D]' : 'text-white'} tracking-tighter leading-none`}>
                ${parseFloat(financialLoss.toFixed(2)).toLocaleString()}
              </p>
            </div>
            
            {showAlertFinance && (
              <div className="space-y-1 py-3 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/40">
                  <span>Item Loss:</span>
                  <span className="text-white ml-2">$ {(financialLoss * 0.85714).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest text-white/40">
                  <span>Logistics:</span>
                  <span className="text-white ml-2">$ {(financialLoss * 0.14286).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            )}
          </div>
          
          {showAlertFinance ? (
            <div className="bg-[#B33B3B] rounded-xl py-3 px-4 flex items-center gap-3">
              <AlertTriangle size={14} className="text-white fill-white/20" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white leading-tight">
                Escalation Triggered Supervisor Report
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[#77B139]" />
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none">Averted Loss Footprint.</span>
            </div>
          )}
        </div>

      </div>

      {/* Image 8 Bottom Status Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-white/5">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Cumulative Waste</p>
          <p className="text-xl font-black text-[#FF4D4D] tracking-widest uppercase">
            170.0 <span className="text-[10px] text-white/40">/ 100 KG</span>
          </p>
        </div>
        
        <div className="space-y-1 border-x border-white/5 px-12">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">My Score</p>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-brand-gold tracking-widest uppercase">1350</span>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Points</span>
            <span className="ml-2 text-[9px] font-black text-brand-gold/80 border border-brand-gold/30 px-2 py-0.5 rounded flex items-center gap-1.5 uppercase tracking-widest">
              5 Day Streak 🔥
            </span>
          </div>
        </div>

        <div className="space-y-1 flex flex-col items-end">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Data Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#77B139] shadow-[0_0_8px_rgba(119,177,57,0.8)] animate-pulse"></div>
            <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em]">Live Sync Active</span>
          </div>
        </div>
      </div>

      {/* Outlet Performance Breakdown Table */}
      <div className="bg-[#0B221E] border border-brand-gold/10 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-10 border-b border-brand-gold/10 bg-black/10 flex items-center gap-6">
          <div className="p-3 border border-[#77B139]/50 rounded-full bg-[#77B139]/5">
            <TrendingDown size={20} className="text-[#77B139]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-black text-white tracking-tight uppercase leading-tight">
              Outlet Performance
            </h4>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
              Breakdown Analytics Hub
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-brand-gold/5 bg-black/5">
                <th className="py-4 px-8 text-[9px] font-black uppercase tracking-widest text-brand-gold/60">Outlet Name</th>
                <th className="py-4 px-8 text-[9px] font-black uppercase tracking-widest text-brand-gold/60">Current Mass ({unitType})</th>
                <th className="py-4 px-8 text-[9px] font-black uppercase tracking-widest text-brand-gold/60">Current Cost (USD)</th>
              </tr>
            </thead>
            <tbody>
              {outletDetails.map((outlet, id) => (
                <tr key={id} className="border-b border-brand-gold/5 hover:bg-white/5 transition-colors group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-white uppercase tracking-wider group-hover:text-brand-gold transition-colors">{outlet.name}</span>
                      {outlet.name.toLowerCase().includes('royal') && outlet.mass > (unitType === 'Lbs' ? 40 * 2.20462 : 40) && (
                        <div className="flex items-center gap-1.5 bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/30 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest">
                          <AlertCircle size={8} /> Attention
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <span className="text-sm font-geometric text-white/80">{outlet.mass.toLocaleString(undefined, { maximumFractionDigits: 1 })}</span>
                  </td>
                  <td className="py-5 px-8 text-brand-gold font-bold">
                    $ {outlet.cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FoodWasteIntelligence;
