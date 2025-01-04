import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    console.log('Raw token from localStorage:', token);

    if (token) {
      const formattedToken = token.trim();
      console.log('Formatted token:', formattedToken);

      const finalHeader = `Bearer ${formattedToken}`;
      console.log('Final Authorization header:', finalHeader);

      request = request.clone({
        setHeaders: {
          Authorization: finalHeader
        }
      });

      // Log the final request headers
      console.log('Request headers:', request.headers.keys());
      console.log('Authorization header value:', request.headers.get('Authorization'));
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('HTTP Error:', error);
        if (error.status === 401) {
          console.log('401 Unauthorized error - clearing tokens');
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          this.router.navigate(['/sign-in']);
        }
        return throwError(() => error);
      })
    );
  }
}
