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
    return this.http.get(`https://api.aqirec.my.id/api/station/get/` + id);
  }

  getDataFromUrl(url:string) {
    return this.http.get(url);
  }

  getDetailDaily(id,date) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detail/daily/${id}/${date}`);
  }

  getDetailWeekly(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detail/weekly/` + id);
  }

  getDetailMonthly(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detail/monthly/` + id);
  }

  getDetailYear(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detail/yearly/` + id);
  }

  getPm25Daily(id,date) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detailpm25/daily/${id}/${date}`);
  }

  getPm25Weekly(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detailpm25/weekly/` + id);
  }

  getPm25Monthly(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detailpm25/monthly/` + id);
  }

  getPm25Year(id) {
    return this.http.get(`https://api.aqirec.my.id/api/air/detailpm25/yearly/` + id);
  }
}
