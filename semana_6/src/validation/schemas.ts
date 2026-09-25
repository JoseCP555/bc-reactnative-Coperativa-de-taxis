import { z } from 'zod';

export const driverSchema = z.object({
  name: z.string().trim().min(2, 'Escribe el nombre completo.'),
  phone: z.string().trim().regex(/^[0-9+() -]{7,18}$/, 'Escribe un teléfono válido.'),
});

export const tripSchema = z.object({
  origin: z.string().trim().min(2, 'Indica el origen.'),
  destination: z.string().trim().min(2, 'Indica el destino.'),
  driver: z.string().trim().min(2, 'Indica el conductor.'),
  fare: z.string().trim().regex(/^\d+(\.\d{1,2})?$/, 'Escribe una tarifa válida.'),
});

export const loginSchema = z.object({
  username: z.string().trim().min(3, 'Escribe tu usuario.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre.'),
  username: z.string().trim().min(3, 'El usuario debe tener al menos 3 caracteres.'),
  email: z.email('Escribe un correo válido.'),
  password: z.string().min(8, 'Usa al menos 8 caracteres.'),
  confirmPassword: z.string().min(1, 'Confirma la contraseña.'),
}).refine((values) => values.password === values.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Las contraseñas no coinciden.',
});

export type DriverForm = z.infer<typeof driverSchema>;
export type TripForm = z.infer<typeof tripSchema>;
export type LoginForm = z.infer<typeof loginSchema>;
export type RegisterForm = z.infer<typeof registerSchema>;
