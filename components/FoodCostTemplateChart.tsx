import React, { useState } from 'react';
import { Info, Leaf, Target, TrendingUp, AlertTriangle, ChevronRight, DollarSign, Utensils, X as XIcon } from 'lucide-react';

interface FoodCostData {
    day: string;
    foodCost: number;
}

interface FoodCostTemplateChartProps {
    data: FoodCostData[];
    benchmark: number;
}

const FoodCostTemplateChart: React.FC<FoodCostTemplateChartProps> = ({ data, benchmark }) => {
    const [selectedDay, setSelectedDay] = useState<FoodCostData | null>(null);

    // Axis Logic: 25% to 35%
    const minVal = 25;
    const maxVal = 35;
    const range = maxVal - minVal;

    const getY = (val: number) => 100 - ((val - minVal) / range) * 100;

    // Logic for X-axis (distributed)
    const getX = (index: number, total: number) => 10 + (index / (total - 1)) * 80;

    const hasAlert = data.some(d => d.foodCost > benchmark);

    return (
        <div className="bg-[#0f2420] border border-brand-gold/60 p-6 sm:p-8 rounded-[35px] shadow-2xl space-y-4 relative group w-full h-full flex flex-col" style={{ overflow: 'hidden', position: 'relative' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start z-20 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-eco/10 flex items-center justify-center border border-brand-eco/20 shadow-[0_0_15px_rgba(119,177,57,0.1)]">
                        <Utensils size={18} className="text-brand-eco" />
                    </div>
                    <div>
                        <h3 className="text-lg font-geometric font-black text-white uppercase tracking-tight">FOOD COST</h3>
                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em] mt-0.5">Performance Variance vs regional benchmark</p>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1.5 bg-brand-gold/10 px-2 py-0.5 rounded-md border border-brand-gold/20">
                                <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Benchmark: <span className="text-white">{benchmark}%</span></span>
                            </div>
                            {selectedDay && (
                                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                                    | {selectedDay.day}: <span className="text-white">{selectedDay.foodCost}%</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {hasAlert && (
                    <div className="animate-in fade-in zoom-in duration-300">
                        <div className="bg-brand-alert/10 border border-brand-alert/30 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[0_0_10px_rgba(255,49,49,0.1)] cursor-pointer group/alert">
                            <Info size={12} className="text-brand-alert" />
                            <span className="text-[9px] font-black text-brand-alert uppercase tracking-widest group-hover/alert:underline">Attention</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Chart Container */}
            <div className="flex-1 w-full relative min-h-0">
                {/* Y-Axis Labels */}
                <div className="absolute left-[-15px] lg:left-0 top-0 bottom-6 flex flex-col justify-between py-1 z-10 pointer-events-none">
                    {[35, 32.5, 30, 27.5, 25].map((val) => (
                        <div key={val} className="relative flex items-center justify-end pr-4 h-0">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{val}%</span>
                            <div className="absolute right-0 w-2 h-[1px] bg-white/10"></div>
                        </div>
                    ))}
                </div>

                {/* Grid Lines */}
                <div className="absolute left-[30px] lg:left-[40px] right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[35, 32.5, 30, 27.5, 25].map((val) => (
                        <div key={val} className="w-full border-t border-white/5 h-0"></div>
                    ))}
                </div>

                {/* Benchmark Line */}
                <div
                    className="absolute left-[30px] lg:left-[40px] right-0 h-0 border-t border-brand-gold border-dashed z-10 pointer-events-none opacity-60"
                    style={{ top: `${getY(benchmark)}% ` }}
                >
                </div>

                {/* Chart SVG */}
                <div className="absolute left-[30px] lg:left-[40px] right-0 top-0 bottom-6 overflow-visible z-20">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <polyline
                            fill="none"
                            stroke="#77B139"
                            strokeWidth="1"
                            strokeLinejoin="round"
                            strokeLinecap="round"
                            points={data.map((t, i) => `${getX(i, data.length)},${getY(t.foodCost)} `).join(' ')}
                            className="drop-shadow-[0_0_4px_rgba(119,177,57,0.3)]"
                        />
                        {data.map((t, i) => {
                            const x = getX(i, data.length);
                            const y = getY(t.foodCost);
                            const isSelected = selectedDay?.day === t.day;
                            const isHigh = t.foodCost > benchmark;
                            const isRightSide = i >= data.length - 2;
                            const isLeftSide = i <= 1;

                            return (
                                <g key={i} className="cursor-pointer group/point" onClick={(e) => { e.stopPropagation(); setSelectedDay(t); }}>
                                    {/* Invisible hit area */}
                                    <circle cx={`${x} `} cy={`${y} `} r="12" fill="transparent" />
                                    {/* Outer Glow for selection */}
                                    <circle
                                        cx={`${x} `} cy={`${y} `}
                                        r={isSelected ? "4" : "0"}
                                        fill="#77B139"
                                        className="opacity-20 transition-all duration-300"
                                    />
                                    {/* Main Dot */}
                                    <circle
                                        cx={`${x} `} cy={`${y} `}
                                        r={isSelected ? "2.5" : "1.5"}
                                        fill="#152E2A"
                                        stroke="#77B139"
                                        strokeWidth="1"
                                        className="transition-all duration-300"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Pop-up Info */}
                    {selectedDay && (() => {
                        const index = data.findIndex(d => d.day === selectedDay.day);

                        // Smart Positioning System:
                        // 1. Calculate X, Y percentages relative to container
                        const xPct = getX(index, data.length); // 10% to 90%
                        const yPct = getY(selectedDay.foodCost);

                        // 2. Vertical Logic (Flip if near top)
                        const isTop = yPct < 25;
                        const topPosition = isTop ? `${yPct + 10}%` : `${yPct - 15}%`;
                        const verticalTranslate = isTop ? '0%' : '-100%';

                        // 3. Horizontal Logic (Proportional Shift)
                        // This guarantees containment: 
                        // At x=10%, we shift -10% (Left aligned-ish)
                        // At x=90%, we shift -90% (Right aligned-ish)
                        const horizontalTranslate = `-${xPct}%`;

                        return (
                            <div
                                className="absolute bg-[#152E2A] border border-brand-gold/60 rounded-lg px-3 py-2 shadow-2xl z-[50] animate-in fade-in zoom-in duration-200 min-w-[120px] pointer-events-none"
                                style={{
                                    left: `${xPct}%`,
                                    top: topPosition,
                                    transform: `translate(${horizontalTranslate}, ${verticalTranslate})`,
                                    maxWidth: '140px'
                                }}
                            >
                                <div className="flex justify-between items-center mb-1 border-b border-white/10 pb-1">
                                    <span className="text-[7px] font-black text-brand-gold uppercase tracking-wider">{selectedDay.day} Status</span>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedDay(null); }} className="pointer-events-auto">
                                        <XIcon size={8} className="text-gray-500 hover:text-white transition-colors" />
                                    </button>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm font-geometric font-black text-white">{selectedDay.foodCost}%</div>
                                    {selectedDay.foodCost > benchmark && (
                                        <div className="text-[6px] font-black uppercase mt-1 text-brand-alert flex flex-col gap-0.5">
                                            <span>High Cost</span>
                                            <span className="opacity-80">Check {selectedDay.day} log</span>
                                        </div>
                                    )}
                                    {selectedDay.foodCost <= benchmark && (
                                        <div className="text-[6px] font-black uppercase mt-1 text-brand-eco">Within Target</div>
                                    )}
                                </div>
                                {/* Arrow Logic: proportional to X position matches the transform */}
                                <div
                                    className={`absolute w-2.5 h-2.5 bg-[#152E2A] border-brand-gold/60 rotate-45`}
                                    style={{
                                        left: `${xPct}%`, // Match the anchor point relative to toolip width due to the translation!
                                        bottom: isTop ? 'auto' : '-6px',
                                        top: isTop ? '-6px' : 'auto',
                                        borderRightWidth: isTop ? '0' : '1px',
                                        borderBottomWidth: isTop ? '0' : '1px',
                                        borderLeftWidth: isTop ? '1px' : '0',
                                        borderTopWidth: isTop ? '1px' : '0',
                                        transform: 'translateX(-50%)' // Center arrow on its own anchor
                                    }}
                                ></div>
                            </div>
                        );
                    })()}
                </div>

                {/* X-Axis Labels */}
                <div className="absolute left-[30px] lg:left-[40px] right-0 bottom-0 h-6">
                    {data.map((t, i) => (
                        <div
                            key={t.day}
                            className="absolute bottom-0 -translate-x-1/2 text-[7px] font-black text-gray-500 uppercase tracking-widest text-center"
                            style={{ left: `${getX(i, data.length)}% ` }}
                        >
                            {t.day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodCostTemplateChart;
