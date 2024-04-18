import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataRecordService {
  private baseUrl = 'http://localhost:8000/api'; // Sesuaikan dengan URL backend Laravel

  constructor(private http: HttpClient) { }

  recordData(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/record-data`, data);
  }
}
