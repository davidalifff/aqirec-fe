import { Component, OnInit } from '@angular/core';
import { DataRecordService } from '../services/data-record.service';
import { DataDownloadService } from '../services/data-download.service';
import { RecordedData } from '../home/models/recorded-data.model';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-gesture-handling';

// Custom options for MapOptions
declare module 'leaflet' {
  interface MapOptions {
    gestureHandling?: boolean;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  map: any;

  constructor(
    private dataRecordService: DataRecordService,
    private dataDownloadService: DataDownloadService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-1.8893, 117.9213], // Centered on Indonesia
      zoom: 5, // Adjust zoom level as needed
      zoomControl: false, // Disable zoom control
      scrollWheelZoom: false, // Disable zooming via mouse scroll
      gestureHandling: true, // Enable gesture handling
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        })
      ]
    });

    // Add zoom control
    L.control.zoom({
      position: 'bottomright', // Adjust the position of the zoom control
    }).addTo(this.map);
  }

  recordData(): void {
    const data = { /* Data yang akan direkam */ };
    this.dataRecordService.recordData(data).subscribe(() => {
      // Tambahkan logika setelah data direkam
    });
  }

  downloadData(): void {
    this.dataDownloadService.downloadData().subscribe((data) => {
      // Lakukan sesuatu dengan data yang didownload, misalnya menyimpannya dalam file CSV
      const blob = new Blob([data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = 'data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  logout(): void{
    this.authService.logout().subscribe(
      (res: any) => {
        // Redirect to home page or other page after successful login
        localStorage.clear();
        localStorage.setItem('activeuser', res.token);
        this.router.navigate(['/login']);

        return new Promise((resolve, reject) => {
          localStorage.removeItem('activeuser');
          resolve(true);
        })
      },
      (error) => {
        // Handle login error, e.g., display error message
        console.error('Login failed:', error);
      }
    );
  }
}
