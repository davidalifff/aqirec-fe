import { Component, OnDestroy, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import * as L from 'leaflet';
import { saveAs } from 'file-saver';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as moment from 'moment';

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

  stationForm: any;
  chartTest: any;
  forecast: any;

  listData: any = [];
  listDetail: any = [];
  listForecast: any = [];
  pm25Data:any [];

  showDetail: boolean = false;

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
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
    this.emptyParam();
    this.getData();
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

    if (this.index != '-') {
      marker.addTo(this.map);
    }
  }

  getData() {
    const params = { nama: this.modelParam.nama };

    this.stationService.getData(params).subscribe((res: any) => {
      this.listData = res.data;
    });
  }

  view(data: any) {
    this.stationForm = data;
    this.showDetail = true; // Default to showing details

    forkJoin({
      detail: this.stationService.getById(data.id),
      forecast: this.stationService.getForecast(data.id).pipe(
        catchError(error => {
          console.error('Error fetching forecast:', error);
          return of(null); // Return empty observable or default value
        })
      )
    }).subscribe((result: any) => {
      this.listDetail = result.detail.data;
      this.listForecast = result.forecast ? result.forecast.data : null;

      // Initialize forecast and pm25Data to null if there's no forecast data
      this.forecast = null;
      this.pm25Data = null;

      if (this.listForecast) {
        const url = this.listForecast.url_1 || this.listForecast.url_2;
        if (url) {
          this.stationService.getDataFromUrl(url).subscribe((forecastData: any) => {
            if (forecastData && forecastData.data && forecastData.data.forecast && forecastData.data.forecast.daily) {
              this.forecast = forecastData.data.forecast.daily;
              this.pm25Data = this.forecast.pm25 || null;

            } else {
              console.error('Invalid forecast data format:', forecastData);
              // Handle invalid or unexpected data format
            }

            this.mapVisible = true;
            setTimeout(() => {
              this.initMap(data, this.listDetail.reverse());
            }, 0);
          });
        }
      }

      // Always initialize map with listDetail, even without forecast
      setTimeout(() => {
        this.initMap(data, this.listDetail.reverse());
      }, 0);
    });
  }


  back() {
    this.showDetail = !this.showDetail;
  }

  downloadCsv(data: any): void {
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
}
