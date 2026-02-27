"use client";
import React, { useState } from 'react';
import { Droplets } from 'lucide-react';

const WaterUsageChart = () => {
    const [selectedBar, setSelectedBar] = useState(null);
    const benchmark = 27000;

    const data = [
        { day: 'Sun', value: 24000, reason: 'Normal Ops' },
        { day: 'Mon', value: 28500, reason: 'Laundry Peak' },
        { day: 'Tue', value: 22000, reason: 'Normal Ops' },
        { day: 'Wed', value: 31000, reason: 'Pipe Leak' },
        { day: 'Thu', value: 25000, reason: 'Normal Ops' },
        { day: 'Fri', value: 33000, reason: 'High Occupancy' },
        { day: 'Sat', value: 29000, reason: 'Event Overflow' }
    ];

    return (
        <div className="bg-[#05110c] p-8 rounded-[40px] border border-[#1a2e26] h-full">
            <div className="mb-6">
                <h2 className="text-[#facc15] text-4xl font-bold uppercase">Water Usage</h2>
                <p className="text-white text-sm font-bold opacity-70">BENCHMARK: 27,000 LITERS</p>
                <p className="text-[#facc15] text-xs font-bold mt-1 uppercase">Threshold 27k</p>
            </div>

            <div className="flex items-end justify-between gap-4 h-64 relative border-l border-b border-white/10 pb-2 pl-2">
                {/* Benchmark Line at 27k */}
                <div className="absolute w-full border-t-2 border-dashed border-[#facc15] z-10" style={{ bottom: '67.5%' }} />

                {data.map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center relative">
                        <div
                            onClick={() => setSelectedBar(selectedBar?.day === item.day ? null : item)}
                            className="w-full rounded-t-xl cursor-pointer transition-all z-20 hover:brightness-125"
                            style={{
                                height: `${(item.value / 40000) * 100}%`,
                                backgroundColor: item.value >= benchmark ? '#ef4444' : '#22c55e'
                            }}
                        />
                        {selectedBar?.day === item.day && (
                            <div className="absolute -top-16 bg-slate-900 p-2 rounded-lg text-white text-[10px] z-50 w-28 border border-slate-700">
                                {item.value.toLocaleString()}L: {item.reason}
                            </div>
                        )}
                        <span className="text-white/40 text-[10px] mt-2 font-bold uppercase">{item.day}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WaterUsageChart;
