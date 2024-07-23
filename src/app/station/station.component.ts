import { Component, OnDestroy, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import * as L from 'leaflet';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit, OnDestroy {
  modelParam: { nama: string };

  map: any;
  mapVisible: boolean = false;

  index: any;
  color: string;

  selectedFilter: any;
  selectedDataType: any;

  stationForm: any;
  chartTest: any;
  forecast: any;

  listData: any = [];
  listDetail: any = [];
  selectedStation: any;
  idMap: any;
  isEmpty: boolean = false;

  showDetail: boolean = false;

  listForecast: any = [];
  pm25Data: any[] = [
    this.isEmpty = true,
  ];

  chartDetail: any;

  constructor(
    private route: ActivatedRoute,
    private stationService: StationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.chartTest = {
      labels: [],
      datasets: [{
        data: [],
        label: "",
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      }],
      options: {
        elements: {
          line: {
            tension: 0.5,
          },
        },
        scales: {
          y: {
            position: 'left',
          },
          y1: {
            position: 'right',
            grid: {
              color: 'rgba(255,0,0,0.3)',
            },
            ticks: {
              color: 'red',
            },
          },
        },
        plugins: {
          legend: { display: true },
        }
      }
    };

    this.emptyParam();
    this.getData();
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.idMap = id;
      if (this.idMap !== undefined) {
        setTimeout(() => {
          this.view(this.selectedStation);
        }, 200);
      }
      this.selectedDataType = 'AQI';
      this.selectedFilter = 'Days';
    });
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  emptyParam() {
    this.modelParam = { nama: "" };
  }

  initMap(data: any, detail: any) {
    this.map = L.map('map', {
      center: [data.lat, data.long],
      zoom: 9,
      zoomControl: false,
      scrollWheelZoom: false,
      gestureHandling: false,
      dragging: false,
      layers: [
        L.tileLayer('https://osm.airvisual.net/{z}/{x}/{y}.png', {
          maxZoom: 19,
          minZoom: 5,
        })
      ]
    });

    this.index = detail[0].index;
    this.color = this.index <= 50 ? 'green' : this.index <= 100 ? 'yellow' : this.index <= 150 ? 'orange' : this.index <= 200 ? 'red' : this.index <= 250 ? 'purple' : 'maroon';

    const customIcon = L.divIcon({
      iconSize: [0, 0],
      html: `<div class="map-pin map-pin-${this.color}" style="cursor: auto">${this.index}</div>`
    });

    const marker = L.marker(new L.LatLng(data.lat, data.long), { icon: customIcon });

    if (this.index !== '-') {
      marker.addTo(this.map);
    }
  }

  getData() {
    const params = { nama: this.modelParam.nama };

    this.stationService.getData(params).subscribe((res: any) => {
      this.listData = res.data;
      this.selectedStation = this.listData.find((data) => data.id === this.idMap);
    });
  }



  view(data: any) {
    this.filterData(data?.id, this.selectedDataType, this.selectedFilter);
    this.stationForm = data;
    data = this.idMap == null ? data : this.selectedStation;
    this.stationService.getById(data.id).subscribe((res: any) => {
      this.listDetail = res.data;
      this.showDetail = true;

      forkJoin({
        detail: this.stationService.getById(data.id),
        forecast: this.stationService.getForecast(data.id).pipe(
          catchError(error => {
            console.error('Error fetching forecast:', error);
            return of(null);
          })
        )
      }).subscribe((result: any) => {
        this.listDetail = result.detail.data;
        this.listForecast = result.forecast ? result.forecast.data : null;

        this.forecast = null;
        this.pm25Data = null;

        if (this.listForecast) {
          const url = this.listForecast.url_1 || this.listForecast.url_2;
          if (url) {
            this.stationService.getDataFromUrl(url).subscribe((forecastData: any) => {
              if (forecastData && forecastData.data && forecastData.data.forecast && forecastData.data.forecast.daily) {
                this.forecast = forecastData.data.forecast.daily;
                this.pm25Data = this.forecast.pm25 || null;
                this.isEmpty = false;
              } else {
                console.error('Invalid forecast data format:', forecastData);
              }

              this.mapVisible = true;
              setTimeout(() => {
                this.initMap(data, this.listDetail.reverse());
              }, 0);
            });
          }
        } else {
          this.mapVisible = true;
          setTimeout(() => {
            this.initMap(data, this.listDetail.reverse());
          }, 0);
        }
      });
    });
  }

  back() {
    this.showDetail = !this.showDetail;
  }

  downloadCsv(data): void {
    // if (localStorage.getItem('activeuser') == null) {
    //   Swal.fire({
    //     title: "Anda belum Login",
    //     text: "Silahkan Login terlebih dahulu",
    //     icon: "info",
    //     showConfirmButton: false,
    //     showCloseButton: true,
    //     showCancelButton: false,
    //     focusConfirm: false,
    //     footer: '<a href="/login">Login</a>'
    //   });
    // } else {
    // }

    this.stationService.exportCsv(data.id).subscribe(blob => {
      saveAs(blob, `${data.nama}.csv`);
    }, error => {
      console.error('Download error:', error);
    });
  }

  isToday(dateString: string): boolean {
    const today = moment().format('YYYY-MM-DD');
    return moment(dateString).format('YYYY-MM-DD') === today;
  }

  onFilterChange = (id, filter) => {
    this.selectedFilter = filter

    this.filterData(id, this.selectedDataType, this.selectedFilter);
  }

  onDataTypeChange = (id, dataType) => {
    this.selectedDataType = dataType;
    this.filterData(id, this.selectedDataType, this.selectedFilter);
  }

  filterData(id, type, filter) {
    filter = this.selectedFilter
    type = this.selectedDataType
    const now = new Date();
    var date = now.toISOString().split('T')[0];

    const handleResponse = (res: any) => {
      console.log("API Response:", res);
        this.chartDetail = res.data;
        this.updateChart();
        this.isEmpty = this.chartDetail === null;
    };

    const handleError = () => {
      this.isEmpty = true;
    };

    if (type === 'AQI') {
        if (filter === 'Days') {
            this.stationService.getDetailDaily(id, date).subscribe(handleResponse, handleError);
        } else if (filter === 'Week') {
            this.stationService.getDetailWeekly(id).subscribe(handleResponse, handleError);
        } else if (filter === 'Month') {
            this.stationService.getDetailMonthly(id).subscribe(handleResponse, handleError);
        } else if (filter === 'Year') {
            this.stationService.getDetailYear(id).subscribe(handleResponse, handleError);
        }
    } else if (type === 'PM2.5') {
        if (filter === 'Days') {
            this.stationService.getPm25Daily(id, date).subscribe(handleResponse, handleError);
        } else if (filter === 'Week') {
            this.stationService.getPm25Weekly(id).subscribe(handleResponse, handleError);
        } else if (filter === 'Month') {
            this.stationService.getPm25Monthly(id).subscribe(handleResponse, handleError);
        } else if (filter === 'Year') {
            this.stationService.getPm25Year(id).subscribe(handleResponse, handleError);
        }
    }
  }

  updateChart(): void {
    console.log(this.chartDetail);

    if(this.chartDetail !== null){
      if (this.selectedDataType == "AQI") {
        this.chartTest.datasets[0].label = "AQI";

        var listAqi = [];
        var listLabel = [];
        
        this.chartDetail.aqi.forEach(element => {
          listAqi.push(element.aqi);
          listLabel.push(moment(element.ts).format('DD MMM YYYY HH:mm'));
        });

        this.chartTest.datasets[0].data = listAqi;
        this.chartTest.labels = listLabel;
      } else {
        this.chartTest.datasets[0].label = "PM2.5";

        var listAqi = [];
        var listLabel = [];
        
        this.chartDetail.pm25.forEach(element => {
          listAqi.push(element.pm25);
          listLabel.push(moment(element.ts).format('DD MMM YYYY HH:mm'));
        });

        this.chartTest.datasets[0].data = listAqi;
        this.chartTest.labels = listLabel;
      }
    }
    else{
      this.chartTest.datasets[0].data = [Math.max(0),Math.max(0),Math.max(0)];
    }
  }
}
