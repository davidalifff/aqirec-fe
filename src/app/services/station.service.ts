import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(private http: HttpClient) { }

  getData(arrParameter) {
    return this.http.get(`http://127.0.0.1:8000/api/station/get-all`, {params: arrParameter});
  }

  getById(id) {
    return this.http.get(`http://127.0.0.1:8000/api/air/aqi/` + id);
  }
}
