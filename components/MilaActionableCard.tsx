import React from 'react';

interface MilaActionableCardProps {
  totals: {
    waste: number;
    water: number;
    energy: number;
    totalFinancialLoss: number;
    carbonImpact: number;
    waterFootprint: number;
  };
  benchmarks: { waste: number; water: number; energy: number };
  user: { outletCode: string };
}

const MilaActionableCard: React.FC<MilaActionableCardProps> = ({ totals, benchmarks, user }) => {
  const { waste, water, energy, totalFinancialLoss, carbonImpact, waterFootprint } = totals;

  const formatNumber = (num: number) => num.toLocaleString(undefined, { maximumFractionDigits: 1 });

  return (
    <section className="mt-12 max-w-6xl mx-auto p-6 sm:p-8 bg-gradient-to-br from-brand-dark/70 via-brand-dark/50 to-brand-dark/70 rounded-3xl border border-brand-gold/30 backdrop-blur-xl shadow-2xl">
      <h3 className="text-2xl sm:text-3xl font-geometric font-black text-white uppercase tracking-tight mb-6 text-center">
        Mila Actionable Intelligence – {user.outletCode}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Waste Card */}
        <div className="p-4 sm:p-6 bg-brand-dark/40 border border-brand-gold/20 rounded-2xl shadow-inner">
          <h4 className="text-sm font-black text-brand-gold uppercase mb-2">Food Waste (kg)</h4>
          <p className="text-3xl sm:text-4xl font-geometric font-bold text-white">{formatNumber(waste)}</p>
          <p className="text-xs text-gray-400 mt-1">Benchmark: {benchmarks.waste} kg</p>
        </div>
        {/* Water Card */}
        <div className="p-4 sm:p-6 bg-brand-dark/40 border border-brand-gold/20 rounded-2xl shadow-inner">
          <h4 className="text-sm font-black text-brand-gold uppercase mb-2">Water Usage (L)</h4>
          <p className="text-3xl sm:text-4xl font-geometric font-bold text-white">{formatNumber(water)}</p>
          <p className="text-xs text-gray-400 mt-1">Benchmark: {benchmarks.water} L</p>
        </div>
        {/* Energy Card */}
        <div className="p-4 sm:p-6 bg-brand-dark/40 border border-brand-gold/20 rounded-2xl shadow-inner">
          <h4 className="text-sm font-black text-brand-gold uppercase mb-2">Energy (kWh)</h4>
          <p className="text-3xl sm:text-4xl font-geometric font-bold text-white">{formatNumber(energy)}</p>
          <p className="text-xs text-gray-400 mt-1">Benchmark: {benchmarks.energy} kWh</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {/* Financial Loss */}
        <div className="p-4 sm:p-6 bg-brand-dark/30 border border-brand-gold/20 rounded-2xl">
          <h5 className="text-xs font-black text-brand-gold uppercase mb-1">Financial Loss</h5>
          <p className="text-2xl sm:text-3xl font-geometric font-bold text-white">${formatNumber(totalFinancialLoss)}</p>
        </div>
        {/* Carbon Impact */}
        <div className="p-4 sm:p-6 bg-brand-dark/30 border border-brand-gold/20 rounded-2xl">
          <h5 className="text-xs font-black text-brand-gold uppercase mb-1">CO₂ Impact (kg)</h5>
          <p className="text-2xl sm:text-3xl font-geometric font-bold text-white">{formatNumber(carbonImpact)}</p>
        </div>
        {/* Water Footprint */}
        <div className="p-4 sm:p-6 bg-brand-dark/30 border border-brand-gold/20 rounded-2xl">
          <h5 className="text-xs font-black text-brand-gold uppercase mb-1">Water Footprint (L)</h5>
          <p className="text-2xl sm:text-3xl font-geometric font-bold text-white">{formatNumber(waterFootprint)}</p>
        </div>
      </div>
    </section>
  );
};

export default MilaActionableCard;
