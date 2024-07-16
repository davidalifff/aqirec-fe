import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AirQualityService {

  constructor(private http: HttpClient) { }

  getData() {
    return this.http.get(`https://api.aqirec.my.id/api/air/get-all`);
  }

  getMostPolluted() {
    return this.http.get(`https://api.aqirec.my.id/api/air/get-most-polluted`);
  }

  getOverall() {
    return this.http.get(`https://api.aqirec.my.id/api/air/overall`);
  }

  getOverallByGroup(group) {
    return this.http.get(`https://api.aqirec.my.id/api/air/overall/` + group);
  }
}
