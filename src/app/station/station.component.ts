import { Component, OnDestroy, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import * as L from 'leaflet';
import { saveAs } from 'file-saver';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit, OnDestroy {
  modelParam: {
    nama;
  }

  map: any;
  mapVisible: boolean = false;

  index: any;
  color: string;

  stationForm: any;
  chartTest: any;

  listData: any = [];
  listDetail: any = [];
  selectedStation: any;
  idMap: any;
  isEmpty: boolean = false;

  showDetail: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private stationService: StationService,
    private authService: AuthService
  ) { }

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
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.idMap = id
      if (this.idMap != undefined) {
        setTimeout(() => {
          this.view(this.selectedStation);
        }, 200);
      }
    });


  }

  ngOnDestroy(): void {
    // Clean up the map when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }

  emptyParam() {
    this.modelParam = {
      nama: "",
    }
  }

  initMap(data, detail) {
    this.map = L.map('map', {
      center: [data.lat, data.long], // Centered on Indonesia
      zoom: 9, // Adjust zoom level as needed
      zoomControl: false, // Disable zoom control
      scrollWheelZoom: false, // Disable zooming via mouse scroll
      gestureHandling: false, // Disable gesture handling
      dragging: false, // Disable map drag
      layers: [
        L.tileLayer('https://osm.airvisual.net/{z}/{x}/{y}.png', {
          maxZoom: 19,
          minZoom: 5,
        })
      ]
    });

    this.index = detail[0].index;
    this.color = this.index <= 50 ? 'green' : this.index <= 100 ? 'yellow' : this.index <= 150 ? 'orange' : this.index <= 200 ? 'red' : this.index <= 250 ? 'purple' : 'maroon';


    // Define custom marker icon
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
    const params = {
      nama: this.modelParam.nama
    }

    this.stationService.getData(params).subscribe((res: any) => {
      this.listData = res.data;
      this.selectedStation = this.listData.find((data) => data.id == this.idMap)


    });
  }

  view(data) {
    this.stationForm = data;
    data = this.idMap == null ? data : this.selectedStation
    this.stationService.getById(data.id).subscribe((res: any) => {
      this.listDetail = res.data;

      this.showDetail = !this.showDetail;

      this.mapVisible = true;
      setTimeout(() => {
        this.initMap(data, this.listDetail.reverse());
      }, 0);
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
}
