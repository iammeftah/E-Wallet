// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import { Agent, AgentSignUpData, Client, ClientSignUpData, SignInData, User, AuthResponse, Admin } from '../models/auth.model';

export interface AgentSignUpDataWithIndexSignature extends AgentSignUpData {
  [key: string]: string | File | null | undefined;
}


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API = 'http://localhost:8091/api/auth';
  private AGENT_API = 'http://localhost:8091/api/agents';
  private CLIENT_API = 'http://localhost:8091/api/clients';

  private BACKOFFICE_API = 'http://localhost:8092/api/registration-requests';

  public currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signIn(credentials: SignInData): Observable<User> {
    return this.http.post<AuthResponse>(`${this.AUTH_API}/login`, credentials)
      .pipe(
        map(response => {
          let user: User;
          const userData = { ...response.user, token: response.token };

          switch (userData.role) {
            case 'AGENT':
              user = new Agent(userData);
              break;
            case 'CLIENT':
              user = new Client(userData);
              break;
            case 'ADMIN':
              user = new Admin(userData);
              break;
            default:
              user = new User(userData);
          }

          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        })
      );
  }

  signUpAgent(data: AgentSignUpData): Observable<Agent> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    return this.http.post<Agent>(this.AGENT_API, formData)
      .pipe(map(response => new Agent(response)));
  }

  signUpClient(data: ClientSignUpData): Observable<Client> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value?.toString() || '');
      }
    });

    return this.http.post<Client>(this.CLIENT_API, formData)
      .pipe(map(response => new Client(response)));
  }

  signOut(): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, just clear everything and return
      localStorage.clear();
      this.currentUserSubject.next(null);
      return of(void 0);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<void>(`${this.AUTH_API}/logout`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Server logout failed:', error);
        return of(void 0); // Continue with local logout even if server fails
      })
    );
  }

  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }



  registerAgent(data: AgentSignUpData): Observable<any> {
    const formData = new FormData();
    const typedData = data as AgentSignUpDataWithIndexSignature;

    // Add all text fields
    Object.keys(data).forEach(key => {
      if (key !== 'idDocument' && key !== 'confirmEmail') {
        formData.append(key, typedData[key]?.toString() || '');
      }
    });

    // Add documents
    if (data.idDocument) {
      formData.append('idDocument', data.idDocument);
    }

    // Send registration request to backoffice instead of auth service
    return this.http.post(`${this.BACKOFFICE_API}`, formData).pipe(
      map(response => {
        // Return the registration request ID or relevant data
        return response;
      }),
      catchError(error => {
        console.error('Registration request failed:', error);
        return throwError(() => new Error('Registration request failed. Please try again later.'));
      })
    );
  }

  // Add method to check registration status
  checkRegistrationStatus(requestId: string): Observable<any> {
    return this.http.get(`${this.BACKOFFICE_API}/${requestId}`).pipe(
      map(response => response),
      catchError(error => {
        console.error('Failed to check registration status:', error);
        return throwError(() => new Error('Failed to check registration status. Please try again later.'));
      })
    );
  }
}
