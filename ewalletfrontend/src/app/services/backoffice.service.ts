import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Agent } from '../models/auth.model';

interface RegistrationResponse {
  id: string;
  agentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  idType: string;
  idNumber: string;
  birthdate: string;
  address: string;
  immatriculation: string;
  patentNumber: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackofficeService {
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
      map(requests => requests.map(request => new Agent({
        id: request.id,
        firstName: request.firstName,
        lastName: request.lastName,
        email: request.email,
        phone: request.phone,
        idType: request.idType as 'CIN' | 'Passport' | 'Residence permit',
        idNumber: request.idNumber,
        birthdate: request.birthdate,
        address: request.address,
        immatriculation: request.immatriculation,
        patentNumber: request.patentNumber,
        status: request.status,
        created_at: request.createdAt
      }))),
      tap(agents => {
        console.log('Transformed Agents:', agents);
      })
    );
  }

  acceptRequest(id: string): Observable<Agent> {
    return this.http.put<RegistrationResponse>(
      `${this.BACKOFFICE_API}/${id}/status`,
      { status: "ACCEPTED" },
      {
        headers: this.authService.getAuthHeader()  // Make sure this includes the Authorization header
      }
    ).pipe(
      map(response => new Agent(response))
    );
  }

  declineRequest(id: string): Observable<Agent> {
    return this.http.put<RegistrationResponse>(
      `${this.BACKOFFICE_API}/${id}/status`,
      "DECLINED",
      { headers: this.authService.getAuthHeader() }
    ).pipe(
      map(response => new Agent({
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone,
        idType: response.idType as 'CIN' | 'Passport' | 'Residence permit',
        idNumber: response.idNumber,
        birthdate: response.birthdate,
        address: response.address,
        immatriculation: response.immatriculation,
        patentNumber: response.patentNumber,
        status: response.status,
        created_at: response.createdAt
      }))
    );
  }
}
