import { Trip, Vehicle } from '../../../semana_2/src/types';

export const vehicles: Vehicle[] = [
  { id: '1', plate: 'ABC 123', model: 'Sedán', status: 'Disponible' },
  { id: '2', plate: 'DEF 456', model: 'Hatchback', status: 'En servicio' },
];

export const trips: Trip[] = [
  { id: '1', origin: 'Terminal', destination: 'Centro', driver: 'Carlos Mendoza', fare: 12000 },
  { id: '2', origin: 'Aeropuerto', destination: 'Norte', driver: 'Ana Rodríguez', fare: 25000 },
];
