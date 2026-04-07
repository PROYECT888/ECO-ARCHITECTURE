import React from 'react';
import { Cpu, Droplets, Zap, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { useResourceChartData } from '../hooks/useResourceChartData';
import ResourceTemplateChart from './ResourceTemplateChart';
import { Outlet } from '../types';

interface ResourceIntelligenceProps {
  allOutlets: Outlet[];
}

const ResourceIntelligence: React.FC<ResourceIntelligenceProps> = ({ allOutlets }) => {
  const { 
    waterData, 
    energyData, 
    waterTarget, 
    energyTarget, 
    waterDailyBenchmark, 
    energyDailyBenchmark,
    waterWeeklyTotal,
    energyWeeklyTotal,
    isLoading 
  } = useResourceChartData();

  const showAlertWater = waterWeeklyTotal > waterTarget;
  const showAlertEnergy = energyWeeklyTotal > energyTarget;

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
            Resource Portfolio Intelligence
          </h2>
          <div className="flex items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand-gold">
              Cumulative Utility Load & Baseline Analysis
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Total Water Card */}
        <div className="bg-[#0B221E] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between h-[230px] relative overflow-hidden group hover:border-[#3b82f6]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#3b82f6]/10 transition-colors"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <Droplets size={16} className="text-[#3b82f6]" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3b82f6]">Total Water Usage</h4>
              </div>
              {showAlertWater && (
                <div className="bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30 px-3 py-1 rounded-lg flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Attention</span>
                </div>
              )}
            </div>
            <p className="text-5xl font-black text-white tracking-tighter tabular-nums">
              {waterWeeklyTotal.toLocaleString()} <span className="text-xs font-medium text-white/30 uppercase ml-1">Litres</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!showAlertWater ? (
              <>
                <CheckCircle2 size={14} className="text-[#77B139]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Standard Consumption Pattern.</span>
              </>
            ) : (
              <>
                <Info size={14} className="text-[#FF4D4D]" />
                <span className="text-[10px] font-bold text-[#FF4D4D] uppercase tracking-widest font-black">Benchmark Overload Detected.</span>
              </>
            )}
          </div>
        </div>

        {/* Total Energy Card */}
        <div className="bg-[#0B221E] border border-white/10 rounded-[32px] p-8 flex flex-col justify-between h-[230px] relative overflow-hidden group hover:border-brand-gold/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-gold/10 transition-colors"></div>
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <Zap size={16} className="text-brand-gold" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-gold">Total Energy Load</h4>
              </div>
              {showAlertEnergy && (
                <div className="bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30 px-3 py-1 rounded-lg flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Attention</span>
                </div>
              )}
            </div>
            <p className="text-5xl font-black text-white tracking-tighter tabular-nums">
              {energyWeeklyTotal.toLocaleString()} <span className="text-xs font-medium text-white/30 uppercase ml-1">kWh</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!showAlertEnergy ? (
              <>
                <CheckCircle2 size={14} className="text-[#77B139]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Load Within Tolerance Range.</span>
              </>
            ) : (
              <>
                <Info size={14} className="text-[#FF4D4D]" />
                <span className="text-[10px] font-bold text-[#FF4D4D] uppercase tracking-widest font-black">Critical Energy Spike Logged.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[500px]">
        <ResourceTemplateChart 
          data={waterData} 
          benchmark={waterDailyBenchmark} 
          title="WATER USAGE" 
          subtitle="Cumulative Flow Analysis" 
          unit="L" 
          maxVal={5000} 
          icon={<Droplets size={18} className="text-[#3b82f6]" />} 
          allOutlets={allOutlets}
        />
        <ResourceTemplateChart 
          data={energyData} 
          benchmark={energyDailyBenchmark} 
          title="ENERGY LOAD" 
          subtitle="Real-time Power Distribution" 
          unit="kWh" 
          maxVal={250} 
          icon={<Zap size={18} className="text-brand-gold" />} 
          allOutlets={allOutlets}
        />
      </div>
    </div>
  );
};

export default ResourceIntelligence;
