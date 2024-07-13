import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataDownloadService {
  private baseUrl = 'https://api.aqirec.my.id/api/data'; // Sesuaikan dengan URL backend Laravel

  constructor(private http: HttpClient) { }

  downloadData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/download`, { responseType: 'blob' });
  }
}
