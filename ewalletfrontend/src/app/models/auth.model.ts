export interface SignInData {
  phoneNumber: string;
  password: string;
}

export interface AgentSignUpData {
  firstName: string;
  lastName: string;
  idType: 'CIN' | 'Passport' | 'Carte sejour';
  idNumber: string;
  birthdate: string;
  address: string;
  email: string;
  confirmEmail: string;
  phone: string;
  immatriculation: string;
  patentNumber: string;
  idDocument: File | null;
}

export interface ClientSignUpData {
  clientType: 'HSSAB1' | 'HSSAB2' | 'HSSAB3';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  idType?: 'CIN' | 'Passport' | 'Carte sejour';
  idNumber?: string;
  idDocument?: File | null;
  incomeProof?: File | null;
}

