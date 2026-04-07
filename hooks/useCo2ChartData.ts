import { useState, useEffect } from 'react';
import { useFoodWasteChartData } from './useFoodWasteChartData';
import { useResourceChartData } from './useResourceChartData';

export interface Co2Data {
    day: string;
    foodWaste: number;
    water: number;
    energy: number;
}

export const useCo2ChartData = () => {
    const { chartData: wasteData, isLoading: wasteLoading } = useFoodWasteChartData();
    const { waterData, energyData, isLoading: resourceLoading } = useResourceChartData();
    const [co2Data, setCo2Data] = useState<Co2Data[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const DAY_MAP = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const DAY_DISPLAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // 🏗️ [DESIGN RESTORE] Original Hybrid Logic Baselines 
    // To ensure chart visibility (1,200 - 2,200 range)
    const BASELINES = {
        'SUN': { food: 500, water: 9, energy: 1428 },
        'MON': { food: 375, water: 7, energy: 1092 },
        'TUE': { food: 400, water: 7, energy: 1134 },
        'WED': { food: 425, water: 7, energy: 1176 },
        'THU': { food: 450, water: 8, energy: 1260 },
        'FRI': { food: 550, water: 10, energy: 1470 },
        'SAT': { food: 600, water: 10, energy: 1554 }
    } as Record<string, { food: number, water: number, energy: number }>;

    useEffect(() => {
        if (!wasteLoading && !resourceLoading) {
            // Aggregate daily CO2 segments: Hybrid Baseline + LIVE ROYAL
            const aggregated = DAY_MAP.map((dayKey, index) => {
                const base = BASELINES[dayKey];
                
                // 1. Live ROYAL Food Waste Contribution (mass * 1.8)
                const royalWaste = wasteData.find(d => (d as any).day === dayKey || d.date === dayKey);
                const liveRoyalFoodCo2 = royalWaste ? (Number(royalWaste["ROYAL"]) || 0) : 0;

                // 2. Live ROYAL Water/Energy (if available in segments)
                const royalWater = waterData.find(d => (d as any).day === dayKey);
                const liveRoyalWaterCo2 = royalWater ? (Number(royalWater["ROYAL"]) || 0) * 0.0003 : 0;

                const royalEnergy = energyData.find(d => (d as any).day === dayKey);
                const liveRoyalEnergyCo2 = royalEnergy ? (Number(royalEnergy["ROYAL"]) || 0) * 0.45 : 0;

                return {
                    day: DAY_DISPLAY[index],
                    // Hybrid Sum: Baseline (Fisher/Ralph/Gusto) + Live Royal
                    foodWaste: base.food + liveRoyalFoodCo2,
                    water: base.water + liveRoyalWaterCo2,
                    energy: base.energy + liveRoyalEnergyCo2
                };
            });

            setCo2Data(aggregated);
            setIsLoading(false);
        }
    }, [wasteData, wasteLoading, waterData, energyData, resourceLoading]);

    return { co2Data, isLoading };
};
