import { Driver, Trip, Vehicle } from '../types';

export const initialDrivers: Driver[] = [
  { id: '1', name: 'Carlos Mendoza', phone: '300 000 0001', status: 'Disponible' },
  { id: '2', name: 'Ana Rodríguez', phone: '300 000 0002', status: 'En viaje' },
  { id: '3', name: 'Luis Torres', phone: '300 000 0003', status: 'Descanso' },
];

export const vehicles: Vehicle[] = [
  { id: '1', plate: 'ABC 123', model: 'Sedán', status: 'Disponible' },
  { id: '2', plate: 'DEF 456', model: 'Hatchback', status: 'En servicio' },
];

export const trips: Trip[] = [
  { id: '1', origin: 'Terminal', destination: 'Centro', driver: 'Carlos Mendoza', fare: 12000 },
  { id: '2', origin: 'Aeropuerto', destination: 'Norte', driver: 'Ana Rodríguez', fare: 25000 },
];
