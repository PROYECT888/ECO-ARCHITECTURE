"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { LucideIcon, AlertTriangle, Info, Leaf } from 'lucide-react';

interface FoodWasteData {
    day: string;
    value: number;
}

interface SustainabilityReportProps {
    data: FoodWasteData[];
    benchmark?: number;
    icon?: LucideIcon;
    title?: string;
    chartTitle?: string;
    unit?: string;
    benchmarkLabel?: string;
    criticalThreshold?: number;
}

const SustainabilityReport: React.FC<SustainabilityReportProps> = ({
    data,
    benchmark = 100,
    icon: Icon = Leaf,
    title = "Sustainability Report",
    chartTitle = "Food Waste Analysis",
    unit = "kg",
    benchmarkLabel = "100 kg",
    criticalThreshold = 100 // Amount ABOVE benchmark to trigger critical red
}) => {
    const [selectedBar, setSelectedBar] = useState<FoodWasteData | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    // Close popup when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
                setSelectedBar(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Ensure Sunday-Saturday week alignment
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
    }, [data]);

    // Check if any day exceeds benchmark by > criticalThreshold
    const hasAlert = sortedData.some(d => d.value > benchmark + criticalThreshold);

    // Dynamic Scale Calculation (mimicking fixed 160/100 ratio from blueprint but dynamic)
    const maxValue = Math.max(...sortedData.map(d => d.value), benchmark * 1.3);
    const yAxisMax = Math.ceil(maxValue / 20) * 20;

    return (
        <div ref={chartRef} className="relative w-full bg-[#051a14] border-2 border-[#d4af37]/30 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-500 group">

            {/* Header Section */}
            <div className="relative z-10 w-full mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-brand-dark/60 rounded-xl border-2 border-white/10 shrink-0 flex items-center justify-center">
                        <Icon className="text-[#3b82f6]" size={20} strokeWidth={2.5} />
                    </div>

                    {/* Attention Alert - Top Right */}
                    {hasAlert && (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-red-500/10 border border-red-500/50 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer hover:bg-red-500/20 transition-all">
                            <AlertTriangle size={22} className="text-red-500" strokeWidth={3} />
                            <span className="text-red-500 font-black text-sm uppercase tracking-[0.2em]">ATTENTION</span>
                            <Info size={16} className="text-red-500/80 ml-1" />
                        </div>
                    )}
                </div>

                {/* Title Section */}
                <div className="flex flex-col space-y-1">
                    <h4 className="text-[#d4af37] text-2xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-sm leading-none">
                        {title}
                    </h4>
                    <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] opacity-80 leading-none py-2">
                        {chartTitle}
                    </p>
                    {/* Requested Benchmark Subtitle */}
                    <p className="text-[#d4af37] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] leading-none">
                        Benchmark: <span className="text-white">{benchmarkLabel}</span>
                    </p>
                </div>
            </div>

            {/* Chart Area - Strict Alignment with Supervisor Blueprint */}
            <div className="h-[300px] w-full relative mt-8 px-2">

                {/* Y-Axis Labels (Dynamic) */}
                <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between py-1 z-10">
                    {[yAxisMax, yAxisMax * 0.75, yAxisMax * 0.5, yAxisMax * 0.25, 0].map((val) => (
                        <div key={val} className="relative flex items-center justify-end pr-3 h-0">
                            <span className="text-[7px] font-black text-gray-500 uppercase tracking-widest">
                                {val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val.toFixed(0)}{unit}
                            </span>
                            <div className="absolute right-0 w-2 h-[1px] bg-white/10"></div>
                        </div>
                    ))}
                </div>

                {/* Grid Lines */}
                <div className="absolute left-[30px] right-0 top-0 bottom-0 flex flex-col justify-between">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-full border-t border-white/5 h-0"></div>
                    ))}
                </div>

                {/* Gold Dotted Benchmark Line */}
                <div className="absolute left-[30px] right-0" style={{ bottom: `${(benchmark / yAxisMax) * 100}%` }}>
                    <div className="w-full border-t-2 border-[#d4af37] border-dashed" style={{ borderStyle: 'dashed' }}></div>
                </div>

                {/* Individual Bars - Blueprint Div Structure */}
                <div className="absolute left-[30px] right-0 top-0 bottom-0 flex items-end justify-between px-2 sm:px-6">
                    {sortedData.map((entry) => {
                        const barHeight = Math.min((entry.value / yAxisMax) * 100, 100);
                        const isSelected = selectedBar?.day === entry.day;
                        // Color Logic: Safe (Blue) vs Over (Red)
                        const barColor = entry.value > benchmark ? '#ef4444' : '#3b82f6';

                        return (
                            <div key={entry.day} className="flex flex-col items-center gap-2 w-8 sm:w-10 group/bar relative">
                                {/* Bar */}
                                <div
                                    className="w-full flex flex-col justify-end h-60 cursor-pointer"
                                    onClick={(e) => { e.stopPropagation(); setSelectedBar(isSelected ? null : entry); }}
                                >
                                    <div
                                        className={`w-full rounded-t-md transition-all duration-300 border ${isSelected ? 'ring-4 ring-brand-gold border-transparent scale-105' : 'border-white/5 hover:scale-105'}`}
                                        style={{ height: `${barHeight}%`, backgroundColor: barColor }}
                                    ></div>
                                </div>
                                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{entry.day}</span>

                                {/* Pop-up Window - Matched Blueprint Styling */}
                                {isSelected && (
                                    <div
                                        onClick={(e) => e.stopPropagation()}
                                        className={`absolute bottom-[80px] w-48 bg-[#051a14] border-2 border-brand-gold p-4 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 ${entry.day === 'Fri' || entry.day === 'Sat' ? 'right-0 translate-x-0' : (entry.day === 'Sun' || entry.day === 'Mon' ? 'left-0 translate-x-0' : 'left-1/2 -translate-x-1/2')}`}
                                    >
                                        <div className="text-[9px] font-black text-brand-gold uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
                                            {entry.day} REPORT
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[8px] font-black text-white/60 uppercase tracking-wider">Amount:</span>
                                                <span className="text-[13px] font-black text-white">{entry.value.toLocaleString()}{unit}</span>
                                            </div>
                                            <div className={`mt-3 p-2 rounded-lg border ${entry.value > benchmark ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                                                <span className={`text-[7px] font-black uppercase tracking-widest block mb-1 ${entry.value > benchmark ? 'text-red-500' : 'text-blue-500'}`}>STATUS</span>
                                                <span className="text-[9px] font-bold text-white">{entry.value > benchmark ? 'Over Benchmark' : 'Optimal Zone'}</span>
                                            </div>
                                        </div>
                                        {/* Anchor Pointer */}
                                        <div className={`absolute bottom-[-10px] w-4 h-4 bg-[#051a14] border-r-2 border-b-2 border-brand-gold rotate-45 ${entry.day === 'Fri' || entry.day === 'Sat' ? 'right-4' : (entry.day === 'Sun' || entry.day === 'Mon' ? 'left-4' : 'left-1/2 -translate-x-1/2')}`}></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SustainabilityReport;
