// auth.model.ts
export interface AuthResponse {
  token: string;
  user: Partial<User>;
}

export class User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'agent' | 'admin';
  token?: string;

  constructor(data: Partial<User>) {
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || 'client';
    this.id = data.id;
    this.token = data.token;
  }
}

export class Client extends User {
  clientType: 'HSSAB1' | 'HSSAB2' | 'HSSAB3';
  idType?: 'CIN' | 'Passport' | 'Residence permit';
  idNumber?: string;
  balance: number;

  constructor(data: Partial<Client>) {
    super(data);
    this.role = 'client';
    this.clientType = data.clientType || 'HSSAB1';
    this.idType = data.idType;
    this.idNumber = data.idNumber;
    this.balance = data.balance || 0;
  }
}

export class Agent extends User {
  idType: 'CIN' | 'Passport' | 'Residence permit';
  idNumber: string;
  birthdate: string;
  address: string;
  immatriculation: string;
  patentNumber: string;

  constructor(data: Partial<Agent>) {
    super(data);
    this.role = 'agent';
    this.idType = data.idType || 'CIN';
    this.idNumber = data.idNumber || '';
    this.birthdate = data.birthdate || '';
    this.address = data.address || '';
    this.immatriculation = data.immatriculation || '';
    this.patentNumber = data.patentNumber || '';
  }
}

export class Admin extends User {
  adminLevel: string;
  department: string;

  constructor(data: Partial<Admin>) {
    super(data);
    this.role = 'admin';
    this.adminLevel = data.adminLevel || '';
    this.department = data.department || '';
  }
}

export interface SignInData {
  phoneNumber: string;
  password: string;
}

export interface AgentSignUpData {
  firstName: string;
  lastName: string;
  idType: 'CIN' | 'Passport' | 'Residence permit';
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
  idType?: 'CIN' | 'Passport' | 'Residence permit';
  idNumber?: string;
  idDocument?: File | null;
  incomeProof?: File | null;
}
