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
  listOverallByGroup: any = [];
  filteredData: any = [];

  chartTest: any;
  filterAir: any;
  chartData: any;

  isLoading: boolean = false;
  isFilterLoading = false;

  constructor(
    private airQualityService: AirQualityService,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.getMostPolluted();
    this.getOverall();
    this.filterAir = 'Healthy';
    this.filterData();
    this.initializeChart();
  }

  initializeChart(): void {
    this.chartTest = {
      labels: ['Healthy', 'Moderate', 'Unhealthy'],
      datasets: [{
        data: [0, 0, 0],
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
    this.isLoading = true;
    this.airQualityService.getMostPolluted().subscribe((res: any) => {
      this.listMostPolluted = res.data;
      this.filteredData = res.data;
      this.isLoading = false;
    }, (error) => {
      console.error(error);
      this.isLoading = false;
    });
  }

  getOverall() {
    this.isLoading = true;
    this.airQualityService.getOverall().subscribe((res: any) => {
      this.chartData = res.data;
      this.updateChart();
      this.isLoading = false;
    }, (error) => {
      console.error(error);
      this.isLoading = false;
    });
  }

  getOverallByGroup(group) {
    this.isFilterLoading = true;
    this.airQualityService.getOverallByGroup(group).subscribe((res: any) => {
      this.listOverallByGroup = res.data;
      this.filteredData = res.data;
      this.isFilterLoading = false;
    }, () => {
      this.isFilterLoading = false;
    });
  }

  updateChart(): void {
    this.chartTest.datasets[0].data = [this.chartData.healty, this.chartData.moderate, this.chartData.unhealthy];
  }

  filterData() {
    this.isFilterLoading = true;
    if (this.filterAir === 'Healthy') {
      this.airQualityService.getOverallByGroup('healty').subscribe((res: any) => {
        this.filteredData = res.data;
        this.isFilterLoading = false;
      }, () => {
        this.isFilterLoading = false;
      });
    } else if (this.filterAir === 'Moderate') {
      this.airQualityService.getOverallByGroup('moderate').subscribe((res: any) => {
        this.filteredData = res.data;
        this.isFilterLoading = false;
      }, () => {
        this.isFilterLoading = false;
      });
    } else if (this.filterAir === 'Unhealthy') {
      this.airQualityService.getOverallByGroup('unhealthy').subscribe((res: any) => {
        this.filteredData = res.data;
        this.isFilterLoading = false;
      }, () => {
        this.isFilterLoading = false;
      });
    } else {
      this.filteredData = this.listOverallByGroup;
      this.isFilterLoading = false;
    }
  }

  openModal(modal, size) {
    this.modalService.open(modal, { size: size, centered: true });
  }

  closeModal() {
    this.modalService.dismissAll();
  }
}
