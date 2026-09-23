export type Driver = {
  id: string;
  name: string;
  phone: string;
  status: 'Disponible' | 'En viaje' | 'Descanso';
};

export type Vehicle = {
  id: string;
  plate: string;
  model: string;
  status: 'Disponible' | 'En servicio';
};

export type Trip = {
  id: string;
  origin: string;
  destination: string;
  driver: string;
  fare: number;
};
