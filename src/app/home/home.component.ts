import { Component, OnInit } from '@angular/core';
import { AirQualityService } from '../services/air-quality.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  map: any;

  listMostPolluted: any = [];
  filteredData: any = [];

  chartTest: any;
  filterAir: any;

  constructor(
    private airQualityService: AirQualityService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getMostPolluted();
    this.filterAir = 'Healthy'
    this.filterData()
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
      this.filteredData = res.data;

    })
  }

  filterData() {
    if (this.filterAir === 'Healthy') {
      this.filteredData = this.listMostPolluted.filter((dt) => dt.index_1 <= 75);
    } else if (this.filterAir === 'Moderate') {
      this.filteredData = this.listMostPolluted.filter((dt) => dt.index_1 > 75 && dt.index_1 <= 150);
    } else if (this.filterAir === 'Unhealthy') {
      this.filteredData = this.listMostPolluted.filter((dt) => dt.index_1 > 150);
    } else {
      this.filteredData = this.listMostPolluted;
    }
  }
  openModal(modal, size) {
    this.modalService.open(modal, { size: size, centered: true });
  }
  closeModal() {
    this.modalService.dismissAll();
  }
}
