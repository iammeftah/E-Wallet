import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ClientSignUpData, Client, RegistrationResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private API_URL = 'http://localhost:8093/api/agency';

  constructor(private http: HttpClient) {}



  submitRegistrationRequest(formData: FormData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.API_URL}/registration-requests`, formData).pipe(
      catchError(this.handleError)
    );
  }

  getRegistrationStatus(clientId: string): Observable<RegistrationResponse> {
    return this.http.get<RegistrationResponse>(`${this.API_URL}/registration-requests/${clientId}/status`).pipe(
      catchError(this.handleError)
    );
  }

  getClientRegistrationRequests(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/registration-requests/list`).pipe(
      map(clients => clients.map(client => new Client(client))),
      catchError(this.handleError)
    );
  }

  approveClientRegistration(clientId: string): Observable<Client> {
    return this.http.post<Client>(`${this.API_URL}/registration-requests/${clientId}/approve`, {}).pipe(
      map(client => new Client(client)),
      catchError(this.handleError)
    );
  }

  rejectClientRegistration(clientId: string): Observable<Client> {
    return this.http.post<Client>(`${this.API_URL}/registration-requests/${clientId}/reject`, {}).pipe(
      map(client => new Client(client)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || 'Server error occurred';
    }
    return throwError(() => new Error(errorMessage));
  }
}
