import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts';
import { AlertTriangle, Info, LucideIcon } from 'lucide-react';

interface MetricTrendChartProps {
    data: { day: string; value: number }[];
    benchmark: number;
    title: string;
    icon: LucideIcon;
    yDomain?: [number, number];
    lineColor?: string;
    iconColor?: string;
}

const MetricTrendChart: React.FC<MetricTrendChartProps> = ({
    data,
    benchmark,
    title,
    icon: Icon,
    yDomain = [24, 38],
    lineColor = "#39ff14", // Default Neon Green
    iconColor = "#39ff14"  // Default Neon Green
}) => {
    // State to track if a specific point has been clicked to show/hide tooltip
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Ensure Sunday-Saturday week alignment
    const dayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
    }, [data]);

    const latestValue = sortedData[sortedData.length - 1]?.value || 0;
    const isOverBenchmark = latestValue > benchmark;

    // Handle Click Outside to close tooltip
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (chartContainerRef.current && !chartContainerRef.current.contains(event.target as Node)) {
                setActiveIndex(null);
                setShowInfo(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#051a14]/95 backdrop-blur-2xl border-2 border-[#d4af37]/40 p-5 rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50">
                    <p className="text-[#d4af37] font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] mb-2">{label} PERFORMANCE</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-white font-black text-3xl sm:text-4xl">{payload[0].value.toFixed(1)}</span>
                        <span className="text-[#d4af37] font-black text-lg">%</span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div ref={chartContainerRef} className="relative w-full bg-[#051a14] border-2 border-[#d4af37]/30 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 shadow-2xl overflow-hidden transition-all duration-500 group">

            {/* Header Section - STRICTLY FLUSH-LEFT ALIGNMENT */}
            <div className="relative z-10 w-full mb-6">
                <div className="flex justify-between items-start mb-4">
                    {/* Small Icon Pod - Stacked at the left margin */}
                    <div className="p-2.5 bg-brand-dark/60 rounded-xl border-2 border-white/10 shrink-0 flex items-center justify-center">
                        <Icon style={{ color: iconColor }} size={20} strokeWidth={2.5} />
                    </div>

                    {/* Flashing Attention Alert - Top Right */}
                    {isOverBenchmark && (
                        <div className="flex items-center gap-3 px-5 py-2.5 bg-red-500/10 border border-red-500/50 rounded-full animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)] cursor-pointer hover:bg-red-500/20 transition-all font-black uppercase tracking-widest text-[10px]"
                            onClick={() => setShowInfo(!showInfo)}>
                            <AlertTriangle size={22} className="text-red-500" strokeWidth={3} />
                            <span className="text-red-500">ATTENTION</span>
                            <Info size={16} className="text-red-500/80 ml-1" />
                        </div>
                    )}
                </div>

                {/* Text lines stacked perfectly flush-left */}
                <div className="flex flex-col space-y-1">
                    <h4 className="text-[#d4af37] text-2xl sm:text-4xl font-black uppercase tracking-widest drop-shadow-sm leading-none">{title}</h4>
                    <p className="text-white text-xs sm:text-sm font-bold uppercase tracking-[0.25em] opacity-80 leading-none py-2">Analytical Performance Strategy</p>
                    {/* Benchmark Text */}
                    <p className="text-[#d4af37] text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] leading-none">
                        Baseline Benchmark: <span className="text-white">{benchmark}%</span>
                    </p>
                </div>
            </div>

            {/* Info Pop-up */}
            {showInfo && (
                <div className="absolute top-28 right-8 z-50 max-w-[280px] bg-[#051a14]/95 backdrop-blur-xl border-2 border-red-500/50 p-5 rounded-[24px] shadow-2xl animate-in fade-in zoom-in duration-200">
                    <p className="text-white text-[11px] font-bold uppercase tracking-widest leading-relaxed">
                        Attention triggers when operational cost exceeds the primary strategic baseline.
                    </p>
                </div>
            )}

            {/* Chart Area */}
            <div className="h-[280px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={sortedData}
                        margin={{ top: 20, right: 35, left: 10, bottom: 20 }}
                        onClick={(e) => {
                            if (e && e.activeTooltipIndex !== undefined) {
                                setActiveIndex(e.activeTooltipIndex === activeIndex ? null : e.activeTooltipIndex);
                            }
                        }}
                    >
                        <defs>
                            {/* Neon Glow Filter - Unique for each chart title to avoid conflicts */}
                            <filter id={`neonGlow-${title.replace(/[^a-zA-Z]/g, '')}`} height="300%" width="300%" x="-75%" y="-75%">
                                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Clear Faded White Grid Lines */}
                        <CartesianGrid horizontal={true} vertical={false} stroke="#ffffff10" strokeDasharray="0" />

                        <XAxis
                            dataKey="day"
                            stroke="#ffffff80"
                            fontSize={13}
                            tickLine={false}
                            axisLine={false}
                            dy={15}
                            fontWeight={900}
                        />

                        {/* Y-Axis on LEFT, White */}
                        <YAxis
                            hide={false}
                            domain={yDomain}
                            orientation="left"
                            stroke="#ffffff"
                            fontSize={13}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                            fontWeight={800}
                            dx={-10}
                        />

                        {/* Programmatic Tooltip Control */}
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#d4af37', strokeDasharray: '4 4', strokeWidth: 2 }}
                        />

                        {/* Golden Dotted Benchmark Line - Dynamic Linking to 'benchmark' prop */}
                        <ReferenceLine y={benchmark} stroke="#d4af37" strokeDasharray="5 5" strokeWidth={2.5} opacity={1} />

                        {/* Data Line */}
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke={lineColor}
                            strokeWidth={4}
                            dot={{ r: 6, fill: '#051a14', stroke: lineColor, strokeWidth: 3, cursor: 'pointer' }}
                            activeDot={{ r: 10, fill: lineColor, stroke: '#fff', strokeWidth: 3.5 }}
                            filter={`url(#neonGlow-${title.replace(/[^a-zA-Z]/g, '')})`}
                            isAnimationActive={true}
                            animationDuration={2000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MetricTrendChart;
