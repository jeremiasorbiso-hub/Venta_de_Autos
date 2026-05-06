import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export const users: any[] = [
  {
    id: 'admin-001',
    email: 'admin@autogestion.com',
    passwordHash: hashPassword('Admin123!'),
    nombre: 'Administrador',
    rol: 'admin',
    createdAt: new Date().toISOString()
  },
  {
    id: 'user-jorbiso',
    email: 'jorbiso@autogestion.com',
    passwordHash: hashPassword('j3417189701'),
    nombre: 'jorbiso',
    rol: 'usuario',
    createdAt: new Date().toISOString()
  }
]

export const autos: any[] = [
  {
    id: '1',
    userId: 'demo-user',
    marca: 'Toyota',
    modelo: 'Corolla',
    version: 'XEI CVT',
    anio: 2023,
    kilometraje: 18000,
    combustible: 'nafta',
    transmision: 'cvt',
    color: 'Plata',
    precio_usd: 19000,
    estado: 'disponible',
    aprobacion: 'aprobado',
    descripcion: 'Seminuevo, primer dueño',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: 'demo-user',
    marca: 'Volkswagen',
    modelo: 'Tiguan',
    version: 'Allspace 2.0 TSI',
    anio: 2022,
    kilometraje: 42000,
    combustible: 'nafta',
    transmision: 'automatica',
    color: 'Blanco',
    precio_usd: 28500,
    estado: 'disponible',
    aprobacion: 'aprobado',
    descripcion: 'Único dueño, service al día',
    createdAt: new Date().toISOString()
  }
]

export function findUserByEmail(email: string) {
  return users.find(u => u.email === email)
}

export function getUserById(id: string) {
  return users.find(u => u.id === id)
}
