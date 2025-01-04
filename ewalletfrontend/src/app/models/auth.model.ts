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
  role: 'CLIENT' | 'AGENT' | 'ADMIN';
  token?: string;

  constructor(data: Partial<User>) {
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.role = data.role || 'CLIENT';
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
    this.role = 'CLIENT';
    this.clientType = data.clientType || 'HSSAB1';
    this.idType = data.idType;
    this.idNumber = data.idNumber;
    this.balance = data.balance || 0;
  }
}

export interface AgentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType: 'CIN' | 'Passport' | 'Residence permit';
  idNumber: string;
  birthdate: string;
  address: string;
  immatriculation: string;
  patentNumber: string;
}

export interface RegistrationRequest {
  id: string;
  agent_data: string | AgentData; // Changed from agentData to match backend
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
  created_at: string;
}

export class Agent extends User {
  idType: 'CIN' | 'Passport' | 'Residence permit';
  idNumber: string;
  birthdate: string;
  address: string;
  immatriculation: string;
  patentNumber: string;
  status?: string;
  created_at?: string;
  agent_data?: any; // Added to match backend response

  constructor(data: Partial<Agent> | any) {
    console.log('Creating Agent from data:', data); // Debug log

    // Ensure we have an object to work with
    const parsedData = { ...data };

    // Handle string IDs that might be numbers
    if (typeof parsedData.id === 'number') {
      parsedData.id = parsedData.id.toString();
    }

    // Call super with the processed data
    super(parsedData);

    // Set Agent-specific properties
    this.role = 'AGENT';
    this.idType = parsedData.idType || 'CIN';
    this.idNumber = parsedData.idNumber || '';
    this.birthdate = parsedData.birthdate || '';
    this.address = parsedData.address || '';
    this.immatriculation = parsedData.immatriculation || '';
    this.patentNumber = parsedData.patentNumber || '';
    this.status = parsedData.status || 'PENDING';
    this.created_at = parsedData.created_at || new Date().toISOString();

    console.log('Created Agent instance:', this); // Debug log
  }

  static fromRegistrationRequest(request: RegistrationRequest): Agent {
    const agentData = typeof request.agent_data === 'string'
      ? JSON.parse(request.agent_data)
      : request.agent_data;

    return new Agent({
      id: request.id,
      ...agentData,
      status: request.status,
      created_at: request.created_at
    });
  }
}

export class Admin extends User {
  adminLevel: string;
  department: string;

  constructor(data: Partial<Admin>) {
    super(data);
    this.role = 'ADMIN';
    this.adminLevel = data.adminLevel || '';
    this.department = data.department || '';
  }
}

export interface SignInData {
  phone: string;
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
