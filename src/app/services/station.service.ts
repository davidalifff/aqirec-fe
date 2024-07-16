import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getData(arrParameter) {
    return this.http.get(`https://api.aqirec.my.id/api/station/get-all`, {params: arrParameter});
  }

  getById(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/aqi/` + id);
  }

  exportCsv(id): Observable<Blob> {
    return this.http.get(`https://api.aqirec.my.id/api/air/export-data-aqi/` + id, { responseType: 'blob' });
  }

  getForecast(id) {
    return this.http.get(`http://127.0.0.1:8000/api/station/get/` + id);
  }

  getDataFromUrl(url:string) {
    return this.http.get(url);
  }

  getForecast(id) {
    return this.http.get(`http://127.0.0.1:8000/api/station/get/` + id);
  }

  getDataFromUrl(url:string) {
    return this.http.get(url);
  }
}
