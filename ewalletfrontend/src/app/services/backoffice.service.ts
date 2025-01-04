import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import {Agent, AgentData} from '../models/auth.model';

interface RegistrationResponse {
  id: string;
  agent_data: string | AgentData;
  status: string;
  created_at?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackofficeService  {
  private BACKOFFICE_API = 'http://localhost:8092/api/registration-requests';



  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPendingRequests(): Observable<Agent[]> {
    return this.http.get<RegistrationResponse[]>(`${this.BACKOFFICE_API}/pending`, {
      headers: this.authService.getAuthHeader()
    }).pipe(
      tap(response => {
        console.log('Raw API Response:', response);
      }),
      map(response => {
        // Handle the case where response is directly an array
        const requests = Array.isArray(response) ? response : [response];

        return requests.map(request => {
          let parsedAgentData: AgentData;

          // Parse the stringified agentData if it's a string
          if (request.agent_data) {
            try {
              parsedAgentData = typeof request.agent_data === 'string'
                ? JSON.parse(request.agent_data)
                : request.agent_data;
            } catch (error) {
              console.error('Error parsing agent_data:', error);
              // Provide default empty values that match AgentData interface
              parsedAgentData = {
                id: '',
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                idType: 'CIN',
                idNumber: '',
                birthdate: '',
                address: '',
                immatriculation: '',
                patentNumber: ''
              };
            }
          } else {
            // Provide default empty values if no agent_data
            parsedAgentData = {
              id: '',
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              idType: 'CIN',
              idNumber: '',
              birthdate: '',
              address: '',
              immatriculation: '',
              patentNumber: ''
            };
          }

          // Map the database fields to the Agent model fields
          return new Agent({
            id: request.id || parsedAgentData.id,
            firstName: parsedAgentData.firstName,
            lastName: parsedAgentData.lastName,
            email: parsedAgentData.email,
            phone: parsedAgentData.phone,
            idType: parsedAgentData.idType,
            idNumber: parsedAgentData.idNumber,
            birthdate: parsedAgentData.birthdate,
            address: parsedAgentData.address,
            immatriculation: parsedAgentData.immatriculation,
            patentNumber: parsedAgentData.patentNumber,
            status: request.status,
            created_at: request.created_at || request.createdAt
          });
        });
      }),
      tap(agents => {
        console.log('Transformed Agents:', agents);
      }),
      catchError(error => {
        console.error('Error in getPendingRequests:', error);
        throw error;
      })
    );
  }
  acceptRequest(id: string): Observable<Agent> {
    return this.http.put<any>(
      `${this.BACKOFFICE_API}/${id}/accept`,
      {},
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => {
        const parsedAgentData = typeof response.agentData === 'string'
          ? JSON.parse(response.agentData)
          : response.agentData;

        return new Agent({
          id: response.id,
          ...parsedAgentData,
          status: response.status,
          created_at: response.createdAt
        });
      })
    );
  }

  declineRequest(id: string): Observable<Agent> {
    return this.http.put<any>(
      `${this.BACKOFFICE_API}/${id}/decline`,
      {},
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => {
        const parsedAgentData = typeof response.agentData === 'string'
          ? JSON.parse(response.agentData)
          : response.agentData;

        return new Agent({
          id: response.id,
          ...parsedAgentData,
          status: response.status,
          created_at: response.createdAt
        });
      })
    );
  }
}
