import { apiClient } from './apiClient';
import type { Driver, Trip } from '../../../semana_2/src/types';
import type { DriverForm, TripForm } from '../../../semana_6/src/validation/schemas';

export async function getDrivers(): Promise<Driver[]> {
  return (await apiClient.get<Driver[]>('/drivers')).data;
}
export async function createDriver(input: DriverForm): Promise<Driver> {
  return (await apiClient.post<Driver>('/drivers', input)).data;
}
export async function updateDriver(id: string, input: DriverForm): Promise<Driver> {
  return (await apiClient.put<Driver>(`/drivers/${id}`, input)).data;
}
export async function deleteDriver(id: string): Promise<void> {
  await apiClient.delete(`/drivers/${id}`);
}
export async function setDriverStatus(id: string, status: Driver['status']): Promise<Driver> {
  return (await apiClient.patch<Driver>(`/drivers/${id}`, { status })).data;
}
export async function getTrips(): Promise<Trip[]> {
  return (await apiClient.get<Trip[]>('/trips')).data;
}
export async function createTrip(input: TripForm): Promise<Trip> {
  return (await apiClient.post<Trip>('/trips', { ...input, fare: Number(input.fare) })).data;
}
export async function deleteTrip(id: string): Promise<void> {
  await apiClient.delete(`/trips/${id}`);
}
