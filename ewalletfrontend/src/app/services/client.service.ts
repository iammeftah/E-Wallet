import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Client } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private CLIENT_API = 'http://localhost:8080/api/clients';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getClientDetails(id: string): Observable<Client> {
    return this.http.get<Client>(
      `${this.CLIENT_API}/${id}`,
      { headers: this.authService.getAuthHeader() }
    ).pipe(map(client => new Client(client)));
  }

  updateClient(id: string, data: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(
      `${this.CLIENT_API}/${id}`,
      data,
      { headers: this.authService.getAuthHeader() }
    ).pipe(map(client => new Client(client)));
  }

  getBalance(id: string): Observable<number> {
    return this.http.get<{balance: number}>(
      `${this.CLIENT_API}/${id}/balance`,
      { headers: this.authService.getAuthHeader() }
    ).pipe(map(response => response.balance));
  }
}
