import { Component, OnInit } from '@angular/core';
import { DataRecordService } from '../services/data-record.service';
import { DataDownloadService } from '../services/data-download.service';
import { RecordedData } from '../home/models/recorded-data.model';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dataRecordService: DataRecordService,
    private dataDownloadService: DataDownloadService,
    private authService: AuthService,
    private router: Router
  ) { }


  ngOnInit(): void {
    // Logika yang akan dieksekusi saat komponen diinisialisasi
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
