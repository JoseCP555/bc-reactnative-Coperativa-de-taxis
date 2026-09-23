import { trips } from '../data/mockData';
import { Trip } from '../../../semana_2/src/types';

export async function getTrips(): Promise<Trip[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return trips;
}
