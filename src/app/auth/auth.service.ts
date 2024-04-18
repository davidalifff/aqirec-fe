import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
// auth.service.ts
export class AuthService {
  private baseUrl = 'http://localhost:8000/api/auth'; // Sesuaikan dengan URL backend Laravel
  private currentUser: any;
  private isAdmin: boolean;

  constructor(private http: HttpClient) { }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((user) => {
        this.currentUser = user;
        this.isAdmin = user.role === 'admin'; // Set isAdmin berdasarkan role pengguna
      })
    );
  }

  register(userData: { name: string, email: string, password: string, role: string }): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/auth/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`http://127.0.0.1:8000/api/auth/logout`, {});
  }

  isLoggedIn(): boolean {
    // Implementasi logika untuk memeriksa apakah pengguna sudah login
    // Misalnya, dengan memeriksa apakah ada token yang tersimpan di localStorage
    return localStorage.getItem('activeuser') !== null;
  }

  getIsAdmin(): boolean {
    return this.isAdmin;
  }

}

