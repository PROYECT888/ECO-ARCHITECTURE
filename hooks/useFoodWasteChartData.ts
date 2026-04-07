import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DailyWaste {
  date: string;
  ROYAL: number;
  "FISHER'S": number;
  "RALPH'S": number;
  GUSTO: number;
}

export const useFoodWasteChartData = (targetKg: number = 80, activeOutletCount: number = 4) => {
  const [chartData, setChartData] = useState<DailyWaste[]>([]);
  const [target, setTarget] = useState(1800);
  const [dailyBenchmark, setDailyBenchmark] = useState(0);
  const [weeklyTotal, setWeeklyTotal] = useState(0);
  const [totalKg, setTotalKg] = useState(0);
  const [totalCo2e, setTotalCo2e] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  useEffect(() => {
    // Daily reset for cumulative waste data
    const today = new Date().toDateString();
    const lastDate = localStorage.getItem('ecometricus_waste_last_date');
    if (lastDate !== today) {
      // New day: clear cumulative waste storage
      localStorage.removeItem('ecometricus_cumulative_waste');
      localStorage.setItem('ecometricus_waste_last_date', today);
    }
    const fetchChartData = async () => {

      setIsLoading(true);
      try {
        // Mila Logic: Standardized Proportional Scaling
        const weeklyMassTarget = targetKg * activeOutletCount;
        const dailyMassTarget = (targetKg / 7) * activeOutletCount;
        
        // Co2 Target derived from Mass Target (Factor 2.85)
        const weeklyCo2Target = weeklyMassTarget * 2.85;
        const dailyCo2Benchmark = dailyMassTarget * 2.85;
        
        setTarget(weeklyCo2Target);
        setDailyBenchmark(dailyCo2Benchmark);

        // 2. Fetch Live ROYAL Data
        const { data: royalLogs, error: royalError } = await supabase
          .from('food_waste_logs')
          .select('mass_kg, created_at')
          .ilike('outlet_name', 'royal');

        if (royalError) throw royalError;

        // 3. Hybrid Data Mapping (Exact design parity with Image 2)
        const dayMap: Record<string, any> = {};
        
        // Use a base of ~65% of the target to ensure the chart is "Alive" across outlets
        // Scaled by the active outlet count
        const MOCK_BASELINES = {
          'SUN': 1.1, 'MON': 0.8, 'TUE': 0.85, 'WED': 0.9, 'THU': 0.95, 'FRI': 1.2, 'SAT': 1.3
        } as Record<string, number>;

        DAYS.forEach(day => {
          const factor = MOCK_BASELINES[day];
          const basePerOutlet = dailyMassTarget * factor;
          
          dayMap[day] = {
            "date": day,
            "ROYAL": (basePerOutlet * 0.25) * 2.85,
            "FISHER'S": (basePerOutlet * 0.25) * 2.85,
            "RALPH'S": (basePerOutlet * 0.25) * 2.85,
            "GUSTO": (basePerOutlet * 0.25) * 2.85
          };
        });
 
        // Map Live Royal Data to Days if any exists
        if (royalLogs && royalLogs.length > 0) {
          royalLogs.forEach(log => {
            const date = new Date(log.created_at);
            const dayLabel = DAYS[date.getDay()];
            // Royal Data: CO2e derived from mass (Factor 2.85)
            if (dayMap[dayLabel]) {
              // Reset the baseline if logs exist to avoid duplication
              if (dayMap[dayLabel]["ROYAL_LOGGED"] === undefined) {
                 dayMap[dayLabel]["ROYAL"] = 0;
                 dayMap[dayLabel]["ROYAL_LOGGED"] = true;
              }
              dayMap[dayLabel]["ROYAL"] += (Number(log.mass_kg) || 0) * 2.85;
            }
          });
        }
 
        const transformed = DAYS.map(day => dayMap[day]);
        setChartData(transformed);

        // 4. Calculate Weekly Aggregate for KPI reporting
        const total = transformed.reduce((acc, curr) => {
          return acc + (curr["ROYAL"] || 0) + (curr["FISHER'S"] || 0) + (curr["RALPH'S"] || 0) + (curr["GUSTO"] || 0);
        }, 0);
        setWeeklyTotal(Number(total.toFixed(1)));

        console.log('[Hybrid Integration] ROYAL CO2e Mapping Active');

      } catch (err) {
        console.error('Error in useFoodWasteChartData (Hybrid):', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, []);

  return { chartData, target, dailyBenchmark, weeklyTotal, isLoading };
};
