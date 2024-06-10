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
      labels: ['Healthy', 'Moderate', 'Unhealthy'],
      datasets: [{
        data: [5, 4, 1],
        backgroundColor: ['rgba(156, 216, 78, 1)', 'rgba(250, 207, 57, 1)', 'rgba(246, 94, 95, 1)'],
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
