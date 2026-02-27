import React, { useState, useMemo } from 'react';
import { Info, Cloud, X as XIcon } from 'lucide-react';

interface Co2Data {
    day: string;
    foodWaste: number;
    water: number;
    energy: number;
}

interface Co2EmissionsTemplateChartProps {
    data: Co2Data[];
    benchmark: number;
}

const Co2EmissionsTemplateChart: React.FC<Co2EmissionsTemplateChartProps> = ({ data, benchmark }) => {
    const [selectedDay, setSelectedDay] = useState<Co2Data | null>(null);

    // Axis Logic: 1,200 Kg to 2,200 Kg
    const minVal = 1200;
    const maxVal = 2200;
    const range = maxVal - minVal;

    const getY = (val: number) => 100 - ((val - minVal) / range) * 100;
    const getX = (index: number, total: number) => 10 + (index / (total - 1)) * 80;

    // Logic: Red if Total > Benchmark? Or just informational?
    // Usually emissions > benchmark = bad.
    const hasAlert = data.some(d => (d.foodWaste + d.water + d.energy) > benchmark);

    // Calculate Cumulative Weekly CO2
    const weeklyTotal = useMemo(() => {
        return data.reduce((acc, curr) => acc + curr.foodWaste + curr.water + curr.energy, 0).toLocaleString();
    }, [data]);

    return (
        <div className="bg-[#0f2420] border border-brand-gold/60 p-6 sm:p-8 rounded-[35px] shadow-2xl space-y-4 relative group w-full h-full flex flex-col" style={{ overflow: 'hidden', position: 'relative' }}>
            {/* Header Section */}
            <div className="flex justify-between items-start z-20 relative">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-500/10 flex items-center justify-center border border-gray-500/20 shadow-[0_0_15px_rgba(107,114,128,0.1)]">
                        <Cloud size={18} className="text-gray-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-geometric font-black text-white uppercase tracking-tight">CO2 EMISSIONS</h3>
                        <p className="text-[9px] font-black text-brand-gold uppercase tracking-[0.2em] mt-0.5">Daily Carbon Footprint</p>
                        <div className="flex items-center gap-3 mt-1.5">
                            <div className="flex items-center gap-1.5 bg-brand-gold/10 px-2 py-0.5 rounded-md border border-brand-gold/20">
                                <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Benchmark: <span className="text-white">{benchmark.toLocaleString()} Kg</span></span>
                            </div>
                            {/* Weekly Total Legend */}
                            <div className="flex items-center gap-1.5 bg-brand-gold/10 px-2 py-0.5 rounded-md border border-brand-gold/20">
                                <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Weekly CO2e: <span className="text-white">{weeklyTotal} Kg</span></span>
                            </div>

                            {selectedDay && (
                                <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest animate-in fade-in slide-in-from-left-2">
                                    | {selectedDay.day}: <span className={(selectedDay.foodWaste + selectedDay.water + selectedDay.energy) <= benchmark ? "text-brand-eco" : "text-brand-alert"}>{(selectedDay.foodWaste + selectedDay.water + selectedDay.energy).toLocaleString()} Kg</span>
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
                {/* Y-Axis Labels - 1200 to 2200 */}
                <div className="absolute left-[-15px] lg:left-0 top-0 bottom-6 flex flex-col justify-between py-1 z-10 pointer-events-none">
                    {[2200, 2000, 1800, 1600, 1400, 1200].map((val) => (
                        <div key={val} className="relative flex items-center justify-end pr-4 h-0">
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{val.toLocaleString()}</span>
                            <div className="absolute right-0 w-2 h-[1px] bg-white/10"></div>
                        </div>
                    ))}
                </div>

                {/* Grid Lines */}
                <div className="absolute left-[30px] lg:left-[40px] right-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                    {[2200, 2000, 1800, 1600, 1400, 1200].map((val) => (
                        <div key={val} className="w-full border-t border-white/5 h-0"></div>
                    ))}
                </div>

                {/* Benchmark Line */}
                <div className="absolute left-[30px] lg:left-[40px] right-0 top-0 bottom-6 z-10 pointer-events-none">
                    <div
                        className="absolute w-full border-t-2 border-brand-gold border-dotted opacity-80"
                        style={{ top: `${getY(benchmark)}%`, transform: 'translateY(-50%)' }}
                    ></div>
                </div>

                {/* Chart SVG (Stacked Bars) */}
                <div className="absolute left-[30px] lg:left-[40px] right-0 top-0 bottom-6 overflow-visible z-20">
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {data.map((t, i) => {
                            const x = getX(i, data.length);

                            // Stack Calculation
                            // Base: Energy (Bottom) -> Food Waste -> Water (Top)
                            // Note: Need to scale properly. height = value / range * 100? No.
                            // The Y axis is cropped (minVal 1200). 
                            // BUT stacked bars usually need to start from 0 if showing absolute volume, 
                            // OR we stack them such that the TOTAL sits at the correct Y level.
                            // Given the high MinVal (1200), we cannot easily draw the full bars from 0.
                            // However, the TOTAL is ~1400-2000. 
                            // So the bars will be visible in the 1200-2200 window.
                            // We need to draw the segments relative to the Y-axis scale.

                            const total = t.energy + t.foodWaste + t.water;
                            // Clamp total to view? Visual artifacts if < minVal (not expected with provided data)

                            // Calculate Top Y positions for each segment
                            // Stack Order (Bottom up): Energy, Food, Water
                            const energyHeightVal = t.energy;
                            const foodHeightVal = t.foodWaste;
                            const waterHeightVal = t.water;

                            // To render stacked columns with a non-zero Y-axis origin is tricky visually because the "bottom" of the chart corresponds to 1200, not 0.
                            // If Energy is 1400, and Min is 1200, Energy bar should start at bottom and go up to 1400?
                            // Yes, that implies the "Base" of the stack is effectively cut off?
                            // OR does the user imply the stack builds up from the X-axis (which represents 1200)?
                            // Usually "Stacked Column" with a clipped axis implies we are looking at the TIPS or the Delta.
                            // But here Energy is ~1400. 1400 is visible on 1200-2200 scale.
                            // So Energy bar goes from 0 to 1400 relative to scale?
                            // 0 is way below 1200.
                            // So the Energy bar would theoretically extend below the chart.
                            // We should draw it clipped.

                            // Coordinates:
                            // Y_Energy_Top = getY(t.energy) -- Wait, t.energy is 1400. 
                            // Y_Food_Top = getY(t.energy + t.foodWaste)
                            // Y_Water_Top = getY(t.energy + t.foodWaste + t.water)

                            // Let's render from Top Down to make Z-index/Draw order easier?
                            // Actually SVG draw order: first drawn is back.
                            // If we draw the full height rect (Total), then overwrite with (Energy+Food), then (Energy)...?
                            // No, Stacked is usually segments.

                            // Let's calculate exact Y coordinates on the 0-100 canvas.
                            // Canvas Bottom = 100% (Val = 1200).

                            const val1 = t.energy;
                            const val2 = t.energy + t.foodWaste;
                            const val3 = t.energy + t.foodWaste + t.water;

                            const y1 = getY(val1); // Top of Energy
                            const y2 = getY(val2); // Top of Energy + Food
                            const y3 = getY(val3); // Top of Total

                            // Bottom is always 100% (Value 1200). 
                            // Wait, if Value is 1400, then Y is ~80%.
                            // So Rect 1 (Energy) is from 100% to y1.
                            // Rect 2 (Food) is from y1 to y2.
                            // Rect 3 (Water) is from y2 to y3.

                            // NOTE: If val < minVal (1200), we clamp.
                            // Provided data: Energy min ~1092 (Mon). 1092 < 1200?
                            // Ah! Mon Energy is 1092. Mon Total = 1474 (visible).
                            // If Energy is 1092, it is BELOW the bottom of the chart (1200).
                            // So Energy segment shouldn't be fully visible?
                            // This might look weird if Energy is the base.
                            // The chart starts at 1200.
                            // Mon Total is 1474. So we see 1474 at the top.
                            // The "Composition" might be partially hidden.
                            // The user wants a Stacked Column.
                            // Maybe I should assume the visible portion is stacked?
                            // OR maybe the stack sits on top of the "Base" (1200)? No, values are absolute.
                            // I will calculate the bars normally but allow them to be clipped by the SVG container (overflow: hidden... wait I have overflow-visible on SVG).
                            // I should clamp the rects.

                            // Rect 1: Key = Energy. Range: [0, t.energy]. Visible Range: [1200, 2200].
                            // Intersection: [Max(1200, 0), Min(2200, t.energy)].
                            // If t.energy (1092) < 1200, then Intersection is Empty?
                            // No, if Energy is 1092, and chart starts at 1200, we don't see the Energy bar top.
                            // We see the Food Waste bar starting at 1092? No, we see Food starts at 1092...
                            // Actually, visually: 
                            // If Energy=1092, Food=375 -> Cum=1467.
                            // We see the column starting at 1200, going up to 1467.
                            // The color of the bottom part (1200 to 1467) depends on what lies there.
                            // Energy is 0..1092. Food is 1092..1467.
                            // So the visible part (1200+) is purely Food Waste (Green)?
                            // Yes. The Energy (Orange) is buried below 1200.
                            // This seems correct for a "Zoomed In" Stacked Chart.

                            const renderRect = (startVal: number, endVal: number, color: string) => {
                                // Visible range: minVal to maxVal.
                                // Segment range: startVal to endVal.
                                // Clip:
                                const effectiveStart = Math.max(startVal, minVal);
                                const effectiveEnd = Math.min(endVal, maxVal);

                                if (effectiveEnd <= effectiveStart) return null; // Not visible

                                const yTop = getY(effectiveEnd);
                                const yBottom = getY(effectiveStart);
                                const h = yBottom - yTop;

                                return (
                                    <rect
                                        x={x - 5.5}
                                        y={yTop}
                                        width="11"
                                        height={h}
                                        fill={color}
                                        className="transition-all duration-300 opacity-80 hover:opacity-100"
                                    />
                                );
                            };

                            return (
                                <g key={i} className="cursor-pointer group/point" onClick={(e) => { e.stopPropagation(); setSelectedDay(t); }}>
                                    {/* Stack 1: Energy (Orange) */}
                                    {renderRect(0, t.energy, '#F97316')} {/* Orange-500 */}

                                    {/* Stack 2: Food Waste (Green) */}
                                    {renderRect(t.energy, t.energy + t.foodWaste, '#77B139')}

                                    {/* Stack 3: Water (Blue) */}
                                    {renderRect(t.energy + t.foodWaste, t.energy + t.foodWaste + t.water, '#60A5FA')}

                                    {/* Full column hit area */}
                                    <rect x={x - 12} y="0" width="24" height="100" fill="transparent" />
                                </g>
                            );
                        })}
                    </svg>

                    {/* Pop-up Info */}
                    {selectedDay && (() => {
                        const index = data.findIndex(d => d.day === selectedDay.day);
                        const xPct = getX(index, data.length);
                        const total = selectedDay.energy + selectedDay.foodWaste + selectedDay.water;
                        const clampedTotal = Math.max(minVal, Math.min(maxVal, total));
                        const yPct = getY(clampedTotal);

                        const isTop = yPct < 25;
                        const topPosition = isTop ? `${yPct + 10}%` : `${yPct - 15}%`;
                        const verticalTranslate = isTop ? '0%' : '-100%';
                        const horizontalTranslate = `-${xPct}%`;

                        return (
                            <div
                                className="absolute bg-[#152E2A] border border-brand-gold/60 rounded-lg px-3 py-2 shadow-2xl z-[50] animate-in fade-in zoom-in duration-200 min-w-[140px] pointer-events-none"
                                style={{
                                    left: `${xPct}%`,
                                    top: topPosition,
                                    transform: `translate(${horizontalTranslate}, ${verticalTranslate})`,
                                    zIndex: 100
                                }}
                            >
                                <div className="flex justify-between items-center mb-1 border-b border-white/10 pb-1">
                                    <span className="text-[7px] font-black text-brand-gold uppercase tracking-wider">{selectedDay.day} Detail</span>
                                    <button onClick={(e) => { e.stopPropagation(); setSelectedDay(null); }} className="pointer-events-auto">
                                        <XIcon size={8} className="text-gray-500 hover:text-white transition-colors" />
                                    </button>
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-[7px] uppercase font-bold text-gray-400">
                                        <span>Total</span>
                                        <span className="text-white">{total.toLocaleString()} Kg</span>
                                    </div>
                                    <div className="w-full h-[1px] bg-white/10 my-1"></div>
                                    <div className="flex justify-between text-[7px] uppercase font-bold text-[#60A5FA]">
                                        <span>Water</span>
                                        <span>{selectedDay.water}</span>
                                    </div>
                                    <div className="flex justify-between text-[7px] uppercase font-bold text-[#77B139]">
                                        <span>Food</span>
                                        <span>{selectedDay.foodWaste}</span>
                                    </div>
                                    <div className="flex justify-between text-[7px] uppercase font-bold text-[#F97316]">
                                        <span>Energy</span>
                                        <span>{selectedDay.energy.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div
                                    className={`absolute w-2.5 h-2.5 bg-[#152E2A] border-brand-gold/60 rotate-45`}
                                    style={{
                                        left: `${xPct}%`,
                                        bottom: isTop ? 'auto' : '-6px',
                                        top: isTop ? '-6px' : 'auto',
                                        borderRightWidth: isTop ? '0' : '1px',
                                        borderBottomWidth: isTop ? '0' : '1px',
                                        borderLeftWidth: isTop ? '1px' : '0',
                                        borderTopWidth: isTop ? '1px' : '0',
                                        transform: 'translateX(-50%)'
                                    }}
                                ></div>
                            </div>
                        )
                    })()}
                </div>

                <div className="absolute left-[30px] lg:left-[40px] right-0 bottom-0 h-6">
                    {data.map((t, i) => (
                        <div
                            key={t.day}
                            className="absolute bottom-0 -translate-x-1/2 text-[7px] font-black text-gray-500 uppercase tracking-widest text-center"
                            style={{ left: `${getX(i, data.length)}%` }}
                        >
                            {t.day}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Co2EmissionsTemplateChart;
