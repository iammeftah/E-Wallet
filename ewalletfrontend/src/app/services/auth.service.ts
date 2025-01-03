// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Agent, AgentSignUpData, Client, ClientSignUpData, SignInData, User, AuthResponse, Admin } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private AUTH_API = 'http://localhost:8091/api/auth';
  private AGENT_API = 'http://localhost:8091/api/agents';
  private CLIENT_API = 'http://localhost:8091/api/clients';

  private currentUserSubject: BehaviorSubject<User | null>;
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
            case 'agent':
              user = new Agent(userData);
              break;
            case 'client':
              user = new Client(userData);
              break;
            case 'admin':
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
    return this.http.post<void>(`${this.AUTH_API}/logout`, {})
      .pipe(tap(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
      }));
  }

  getAuthHeader(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}
