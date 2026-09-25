import { AxiosError, type AxiosAdapter, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { initialDrivers } from '../../../semana_2/src/data/mockData';
import type { Driver, Trip } from '../../../semana_2/src/types';
import { trips as seedTrips } from '../data/mockData';
import { readDriverCache, writeDriverCache } from '../../../semana_7/src/storage/driverCache';

let drivers: Driver[] = [...initialDrivers];
let trips: Trip[] = seedTrips.map((trip) => ({ ...trip, createdAt: new Date().toISOString() }));
const pause = () => new Promise((resolve) => setTimeout(resolve, 250));

type Body = Record<string, unknown>;
function requestBody(config: InternalAxiosRequestConfig): Body {
  if (typeof config.data === 'string') {
    try { return JSON.parse(config.data || '{}') as Body; } catch { return {}; }
  }
  return (config.data ?? {}) as Body;
}
function respond(config: InternalAxiosRequestConfig, data: unknown, status = 200): AxiosResponse {
  const result: AxiosResponse = {
    data, status, statusText: status >= 400 ? 'Error' : 'OK', headers: {}, config,
  };
  if (status >= 400) throw new AxiosError(
    String((data as { message?: string }).message ?? 'Error en la API simulada.'),
    status === 404 ? 'ERR_BAD_REQUEST' : 'ERR_BAD_RESPONSE', config, undefined, result,
  );
  return result;
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await pause();
  const method = (config.method ?? 'get').toLowerCase();
  const path = (config.url ?? '').replace(/^.*\/api\/?/, '').replace(/^\//, '').split('?')[0];
  const body = requestBody(config);

  if (path === 'drivers' && method === 'get') {
    drivers = (await readDriverCache()) ?? drivers;
    return respond(config, drivers);
  }
  if (path === 'drivers' && method === 'post') {
    const driver: Driver = { id: `d${Date.now()}`, name: String(body.name), phone: String(body.phone), status: 'Disponible' };
    drivers = [driver, ...drivers];
    await writeDriverCache(drivers);
    return respond(config, driver, 201);
  }
  const driverMatch = path.match(/^drivers\/([^/]+)$/);
  if (driverMatch && method === 'put') {
    const current = drivers.find((driver) => driver.id === driverMatch[1]);
    if (!current) return respond(config, { message: 'No se encontró el conductor.' }, 404);
    const updated: Driver = { ...current, name: String(body.name ?? current.name), phone: String(body.phone ?? current.phone) };
    drivers = drivers.map((driver) => driver.id === updated.id ? updated : driver);
    await writeDriverCache(drivers);
    return respond(config, updated);
  }
  if (driverMatch && method === 'patch') {
    const current = drivers.find((driver) => driver.id === driverMatch[1]);
    if (!current) return respond(config, { message: 'No se encontró el conductor.' }, 404);
    const updated: Driver = { ...current, status: body.status as Driver['status'] };
    drivers = drivers.map((driver) => driver.id === updated.id ? updated : driver);
    await writeDriverCache(drivers);
    return respond(config, updated);
  }
  if (driverMatch && method === 'delete') {
    const before = drivers.length;
    drivers = drivers.filter((driver) => driver.id !== driverMatch[1]);
    if (before === drivers.length) return respond(config, { message: 'No se encontró el conductor.' }, 404);
    await writeDriverCache(drivers);
    return respond(config, { ok: true });
  }
  if (path === 'trips' && method === 'get') return respond(config, trips);
  if (path === 'trips' && method === 'post') {
    const trip: Trip = {
      id: `t${Date.now()}`, origin: String(body.origin), destination: String(body.destination),
      driver: String(body.driver), fare: Number(body.fare), createdAt: new Date().toISOString(),
    };
    trips = [trip, ...trips];
    return respond(config, trip, 201);
  }
  if (path.startsWith('trips/') && method === 'delete') {
    const id = path.slice('trips/'.length);
    const before = trips.length;
    trips = trips.filter((trip) => trip.id !== id);
    return before === trips.length ? respond(config, { message: 'No se encontró el viaje.' }, 404) : respond(config, { ok: true });
  }
  return respond(config, { message: `No existe el recurso simulado: ${method.toUpperCase()} ${path}` }, 404);
};
