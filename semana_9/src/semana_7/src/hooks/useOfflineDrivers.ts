import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getDrivers } from '../../../semana_5/src/services/api';
import { readDriverCache, writeDriverCache } from '../storage/driverCache';
import { useCooperativeStore } from '../../../semana_4/src/store/useCooperativeStore';

export function useOfflineDrivers() {
  const [offline, setOffline] = useState(false);
  const drivers = useCooperativeStore((state) => state.drivers);
  const replaceDrivers = useCooperativeStore((state) => state.replaceDrivers);
  const query = useQuery({
    queryKey: ['drivers'],
    queryFn: async () => {
      try {
        const fresh = await getDrivers();
        setOffline(false);
        await writeDriverCache(fresh);
        await replaceDrivers(fresh);
        return fresh;
      } catch {
        setOffline(true);
        const cached = (await readDriverCache()) ?? drivers;
        await replaceDrivers(cached);
        return cached;
      }
    },
  });
  return { ...query, offline };
}
