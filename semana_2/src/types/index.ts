export type DriverStatus = 'Disponible' | 'En viaje' | 'Descanso';

export type Driver = {
  id: string;
  name: string;
  phone: string;
  status: DriverStatus;
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
  createdAt?: string;
};

export type UserRole = 'admin' | 'operador';

export type AppUser = {
  id: number | string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  image?: string;
};

export type LoginInput = { username: string; password: string };
export type RegisterInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type TokenPair = { accessToken: string; refreshToken: string };
