import { Component, OnInit } from '@angular/core';
import { AirQualityService } from '../services/air-quality.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  map: any;

  listMostPolluted: any = [];

  chartTest: any;

  constructor(private airQualityService: AirQualityService) { }

  ngOnInit(): void {
    this.getMostPolluted();
    
    this.chartTest = {
      labels: ['Index Bagus', 'Index Kurang Bagus'],
      datasets: [{
        data: [10,7],
        backgroundColor: ['rgba(54, 27, 240, 1)', 'rgba(240, 27, 180, 1)'],
      }],
      options: {
        maintainAspectRatio: true,
        legend: {
          position: "top",
        }
      }
    };
  }

  getMostPolluted() {
    this.airQualityService.getMostPolluted().subscribe((res: any) => {
      this.listMostPolluted = res.data;
    })
  }
}
