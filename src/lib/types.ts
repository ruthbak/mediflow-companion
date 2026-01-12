export type UserRole = 'doctor' | 'nurse' | 'pharmacist';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  staffId: string;
  hospital: string;
}

export interface Patient {
  id: string;
  name: string;
  room: string;
  bedNumber: string;
  allergies: string[];
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
}

export interface Medication {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  commonDosages: string[];
  routes: string[];
  category: string;
}

export interface MedicationOrder {
  id: string;
  patientId: string;
  patient: Patient;
  medication: Medication;
  dosage: string;
  frequency: string;
  route: string;
  orderedBy: string;
  orderedAt: Date;
  status: 'pending' | 'verified' | 'dispensed' | 'administered' | 'cancelled';
  dueTime?: Date;
  notes?: string;
}

export interface Notification {
  id: string;
  type: 'alert' | 'info' | 'warning';
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
}
