import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Agent } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class BackofficeService {
  private BACKOFFICE_API = 'http://localhost:8092/api/registration-requests';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getRegistrationRequests(): Observable<Agent[]> {
    return this.http.get<Agent[]>(this.BACKOFFICE_API, {
      headers: this.authService.getAuthHeader()
    }).pipe(
      map(agents => agents.map(agent => new Agent(agent)))
    );
  }

  getPendingRequests(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.BACKOFFICE_API}/pending`, {
      headers: this.authService.getAuthHeader()
    }).pipe(
      map(agents => agents.map(agent => new Agent(agent)))
    );
  }

  acceptRequest(id: string): Observable<Agent> {
    return this.http.put<Agent>(
      `${this.BACKOFFICE_API}/${id}/accept`,
      {},
      { headers: this.authService.getAuthHeader() }
    ).pipe(map(agent => new Agent(agent)));
  }

  declineRequest(id: string): Observable<Agent> {
    return this.http.put<Agent>(
      `${this.BACKOFFICE_API}/${id}/decline`,
      {},
      { headers: this.authService.getAuthHeader() }
    ).pipe(map(agent => new Agent(agent)));
  }
}
