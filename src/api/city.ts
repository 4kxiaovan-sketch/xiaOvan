import { supabase } from '@/lib/supabase';
import type { CityMapItem } from '@/types/game';
import type { CityRow, CityStateRow } from '@/types/supabase';

export async function listCities(): Promise<CityRow[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as CityRow[];
}

export async function listCityStates(seasonId: string): Promise<CityStateRow[]> {
  const { data, error } = await supabase
    .from('city_states')
    .select('*')
    .eq('season_id', seasonId);

  if (error) throw error;
  return (data ?? []) as CityStateRow[];
}

export async function getMapData(seasonId: string): Promise<CityMapItem[]> {
  const [cities, cityStates] = await Promise.all([listCities(), listCityStates(seasonId)]);

  const stateMap = new Map(cityStates.map((item) => [item.city_id, item]));

  return cities.map((city) => {
    const state = stateMap.get(city.id);

    return {
      ...city,
      season_id: seasonId,
      owner_faction_id: state?.owner_faction_id ?? null,
      troops: state?.troops ?? 0,
      defense: state?.defense ?? 0,
      prosperity: state?.prosperity ?? 0,
      updated_at: state?.updated_at ?? city.created_at
    };
  });
}
