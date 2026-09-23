import { trips } from '../data/mockData';
import { Trip } from '../types';

export async function getTrips(): Promise<Trip[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return trips;
}
