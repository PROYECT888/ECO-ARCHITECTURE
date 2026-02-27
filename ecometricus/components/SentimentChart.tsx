"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Cell,
    Dot
} from 'recharts';
import { LucideIcon, AlertTriangle, Info, Star } from 'lucide-react';

interface SentimentData {
    day: string;
    value: number;
    trigger?: string;
    worstComments?: string[];
}

interface SentimentChartProps {
    data: SentimentData[];
    title?: string;
    subtitle?: string;
    icon?: LucideIcon;
}

const SentimentChart: React.FC<SentimentChartProps> = ({
    data,
    title = "Customer Sentiment",
    subtitle = "Daily average satisfaction score",
    icon: Icon = Star
}) => {
    const [selectedPoint, setSelectedPoint] = useState<SentimentData | null>(null);
    const chartRef = useRef<HTMLDivElement>(null);

    // Close tooltip when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
                setSelectedPoint(null);
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

    // Determine alert status (rating < 4.0) based on sorted data
    const isAlertActive = sortedData.length > 0 && sortedData[sortedData.length - 1].value < 4.0;

    // Custom Dot component to show Red Dots and Yellow Triangles
    const RenderCustomDot = (props: any) => {
        const { cx, cy, payload, index } = props;
        const value = payload.value;
        const isAlert = value < 4.0;
        const isCritical = value < 3.5;

        return (
            <g key={`dot-${index}`}>
                {/* The main data point dot */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={isCritical ? "#ef4444" : (value >= 4.8 ? "#39ff14" : "#d4af37")}
                    stroke="white"
                    strokeWidth={1.5}
                    style={{ cursor: 'pointer' }}
                />

                {/* Alert - Yellow Triangle (< 4.0) */}
                {isAlert && (
                    <path
                        d={`M ${cx} ${cy - 14} L ${cx - 7} ${cy - 3} L ${cx + 7} ${cy - 3} Z`}
                        fill="#d4af37"
                        stroke="white"
                        strokeWidth={0.8}
                        className="animate-pulse"
                    />
                )}

                {/* Critical - Red Dot (< 3.5) with enhanced glow */}
                {isCritical && (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill="#ef4444"
                        fillOpacity={0.3}
                        className="animate-ping"
                    />
                )}
            </g>
        );
    };

    return (
        <div ref={chartRef} className="relative w-full bg-[#051a14] border-2 border-[#d4af37]/30 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-500 group">

            {/* Header Section */}
            <div className="relative z-10 w-full mb-6">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-brand-dark/60 rounded-xl border-2 border-white/10 shrink-0 flex items-center justify-center">
                        <Icon className="text-[#39ff14]" size={20} strokeWidth={2.5} />
                    </div>

                    {/* Attention Alert */}
                    {isAlertActive && (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-red-500/10 border border-red-500/50 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer hover:bg-red-500/20 transition-all">
                            <AlertTriangle size={22} className="text-red-500" strokeWidth={3} />
                            <span className="text-red-500 font-black text-sm uppercase tracking-[0.2em]">ATTENTION</span>
                            <Info size={16} className="text-red-500/80 ml-1" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-1">
                    <h4 className="text-[#d4af37] text-2xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-sm leading-none">{title}</h4>
                    <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] opacity-80 leading-none py-2">{subtitle}</p>
                    <div className="flex items-center gap-8 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#39ff14] shadow-[0_0_8px_#39ff14]" />
                            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest">Target: 4.8+</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-[#ef4444] shadow-[0_0_8px_#ef4444]" />
                            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest">Critical: &lt; 3.5</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={sortedData}
                        margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
                        onClick={(props) => {
                            if (props && props.activePayload) {
                                const clickedPoint = props.activePayload[0].payload;
                                // Toggle: click same point to close, click different point to switch
                                setSelectedPoint(selectedPoint?.day === clickedPoint.day ? null : clickedPoint);
                            }
                        }}
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
                            domain={[1, 5]}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 900 }}
                            dx={-10}
                            ticks={[1, 2, 3, 4, 5]}
                        />

                        {/* Zones Grid Highlights */}
                        <ReferenceLine y={4.5} stroke="#39ff14" strokeOpacity={0.1} strokeWidth={35} className="pointer-events-none" />
                        <ReferenceLine y={3} stroke="#ef4444" strokeOpacity={0.05} strokeWidth={65} className="pointer-events-none" />

                        {/* Threshold Line */}
                        <ReferenceLine
                            y={4}
                            stroke="#ef4444"
                            strokeDasharray="6 6"
                            label={{ value: 'TARGET 4.0', position: 'insideRight', dx: -25, dy: -25, fill: '#ef4444', fontSize: 12, fontWeight: 900 }}
                        />

                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#39ff14"
                            strokeWidth={4}
                            dot={<RenderCustomDot />}
                            activeDot={{ r: 8, fill: '#fff', stroke: '#39ff14', strokeWidth: 3 }}
                            animationDuration={2500}
                        />
                    </LineChart>
                </ResponsiveContainer>

                {/* Custom Pop-up Window - DYNAMIC ANCHORING */}
                {selectedPoint && (
                    <div className={`absolute top-0 w-80 bg-[#051a14]/95 backdrop-blur-3xl border-2 border-[#d4af37]/40 p-6 rounded-[24px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-300 ${selectedPoint.day === 'Sat' || selectedPoint.day === 'Fri'
                        ? 'left-4'
                        : (selectedPoint.day === 'Sun' || selectedPoint.day === 'Mon' ? 'left-4' : 'left-1/2 -translate-x-1/2')
                        }`}>

                        {/* Header with Glass Effect */}
                        <div className="flex justify-between items-center mb-5 pb-4 border-b border-white/10">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black text-[#d4af37] uppercase tracking-[0.25em]">{selectedPoint.day} ANALYSIS</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Operational Satisfaction</span>
                            </div>
                            <div className={`px-4 py-1.5 rounded-xl text-sm font-black ring-2 ring-inset ${selectedPoint.value < 3.5
                                ? 'bg-red-500/20 text-red-500 ring-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                                : (selectedPoint.value < 4.0 ? 'bg-orange-500/20 text-orange-500 ring-orange-500/40' : 'bg-[#39ff14]/20 text-[#39ff14] ring-[#39ff14]/40')
                                }`}>
                                {selectedPoint.value.toFixed(1)}
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div className="flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">SCORE</span>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-2xl font-black text-white">{selectedPoint.value}</span>
                                        <span className="text-[11px] font-bold text-white/30">/5.0</span>
                                    </div>
                                </div>
                                <div className="flex flex-col p-3 bg-white/5 rounded-2xl border border-white/5 shadow-inner">
                                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1.5">STATUS</span>
                                    <span className={`text-[12px] font-black uppercase tracking-widest ${selectedPoint.value < 3.5 ? 'text-red-500' : (selectedPoint.value < 4.0 ? 'text-orange-500' : 'text-[#39ff14]')
                                        }`}>
                                        {selectedPoint.value < 3.5 ? 'CRITICAL' : (selectedPoint.value < 4.0 ? 'ALERT' : 'OPTIMAL')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">INSIGHT TRIGGER</span>
                                <span className="text-[12px] font-bold text-[#d4af37] leading-relaxed italic">
                                    "{selectedPoint.trigger || "Performance remains stable within high-satisfaction guardrails."}"
                                </span>
                            </div>

                            {/* Reviewer ID - Plain Text Only */}
                            <div className="pt-5 border-t border-white/10">
                                <div className="flex flex-col p-4 bg-[#d4af37]/10 rounded-2xl border border-[#d4af37]/30">
                                    <span className="text-[9px] font-black text-[#d4af37] uppercase tracking-[0.2em] mb-1.5">Reviewer ID</span>
                                    <span className="text-[12px] font-mono font-bold text-white uppercase tracking-tight">
                                        ECO-{selectedPoint.day.toUpperCase()}-{(selectedPoint.value * 100).toFixed(0)}-LXB
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Pointer - Enhanced Glass Effect */}
                        <div className={`absolute bottom-[-11px] w-5 h-5 bg-[#051a14]/95 backdrop-blur-3xl border-r-2 border-b-2 border-[#d4af37]/40 rotate-45 ${selectedPoint.day === 'Sat' || selectedPoint.day === 'Fri'
                            ? 'left-12'
                            : (selectedPoint.day === 'Sun' || selectedPoint.day === 'Mon' ? 'left-12' : 'left-1/2 -translate-x-1/2')
                            }`}></div>
                    </div>
                )}
            </div>

            {/* Mini Legend */}
            <div className="mt-6 pt-5 border-t border-white/10 flex gap-12">
                <div className="flex items-center gap-4">
                    <div className="w-4 h-4 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444]" />
                    <span className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">Red Dot: Critical (&lt;3.5)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[12px] border-b-[#d4af37] drop-shadow-[0_0_8px_#d4af37]" />
                    <span className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">Triangle: Alert (&lt;4.0)</span>
                </div>
            </div>
        </div>
    );
};

export default SentimentChart;
