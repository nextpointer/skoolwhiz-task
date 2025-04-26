export interface Patient {
  id?: string;
  name: string;
  uid: string;
  phone: string;
  address?: string;
  height?: number;
  weight?: number;
  picture?: string;
  bloodGroup: string;
  emergencyContact: string;
  allergies?: string;
  notes?: string;
}