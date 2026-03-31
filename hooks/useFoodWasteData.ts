
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Outlet } from '../types';

interface FoodWasteData {
  totalMass: number;
  carbonImpact: number;
  financialLoss: number;
  outletDetails: {
    name: string;
    mass: number;
    cost: number;
  }[];
  isLoading: boolean;
}

const MOCK_DATA = {
  total_mass: 578.0,
  carbon_impact: 484.5,
  financial_loss: 1487.50
};

const LBS_CONVERSION = 2.20462;

export const useFoodWasteData = (
  outletId: string | null, // UUID from public.outlets
  unitType: 'kg' | 'Lbs',
  allOutlets: Outlet[]
) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        let query = supabase
          .from('food_waste_logs')
          .select('*')
          .gte('created_at', sevenDaysAgo.toISOString());
        
        if (outletId) {
          query = query.eq('outlet_id', outletId);
        }

        const { data: result, error } = await query;

        if (error) throw error;
        setData(result || []);
      } catch (err) {
        console.error('Error fetching food waste logs:', err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [outletId]);

  const foodWasteStats = useMemo((): FoodWasteData => {
    // If no data in table, use mock static values
    const hasData = Array.isArray(data) && data.length > 0;
    
    let totalMass = hasData ? data.reduce((acc, curr) => acc + (Number(curr.mass_kg) || 0), 0) : MOCK_DATA.total_mass;
    
    // Aggregation Logic: Carbon = Mass * 1.8, Financial = Mass * 6.53 (consistent with benchmarks)
    let carbonImpact = totalMass * 1.8;
    let financialLoss = hasData ? data.reduce((acc, curr) => acc + ((Number(curr.mass_kg) || 0) * (Number(curr.cost_per_kg) || 6.53)), 0) : MOCK_DATA.financial_loss;

    // Unit Conversion
    if (unitType === 'Lbs') {
      totalMass *= LBS_CONVERSION;
    }

    // Map outlet specific data for the debug table
    const outletDetails = (allOutlets || []).map(outlet => {
      const outletData = data.filter(d => d.outlet_id === (outlet as any).id);
      let mass = outletData.reduce((acc, curr) => acc + (Number(curr.mass_kg) || 0), 0);
      let cost = outletData.reduce((acc, curr) => acc + (Number(curr.cost_usd) || 0), 0);

      // If mock mode (no data for anyone), distribute mock data roughly for preview
      if (!hasData) {
        const cleanName = outlet.name.replace(/['’]/g, '').toLowerCase();
        const mockMassMap: Record<string, number> = { 'royal': 578.0, "fishers": 0, "ralphs": 0, 'gusto': 0 };
        const mockCostMap: Record<string, number> = { 
          'royal': 1487.50, 
          "fishers": 0, 
          "ralphs": 0, 
          'gusto': 0 
        };
        mass = mockMassMap[cleanName] || 0;
        cost = mockCostMap[cleanName] || 0;
      }

      if (unitType === 'Lbs') {
        mass *= LBS_CONVERSION;
      }

      return {
        name: outlet.name,
        mass,
        cost
      };
    });

    console.log('[useFoodWasteData] Calculated Stats:', { totalMass, carbonImpact, financialLoss, hasData });

    return {
      totalMass: totalMass || 0,
      carbonImpact: carbonImpact || 0,
      financialLoss: financialLoss || 0,
      outletDetails,
      isLoading
    };
  }, [data, unitType, allOutlets, isLoading]);

  return foodWasteStats;
};
