export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'DOCTOR' | 'STAFF';
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  notes?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  doctor?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  symptoms?: string;
  treatment: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  patientId: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
