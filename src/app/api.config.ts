import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000/api'; // Sesuaikan dengan URL backend Laravel

  constructor(private http: HttpClient) { }

  // Contoh fungsi untuk mengambil data dari backend
  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`);
  }
}
