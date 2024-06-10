import { Component, OnDestroy, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import * as L from 'leaflet';

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

  listData: any = [];
  listDetail: any = [];

  showDetail: boolean = false;

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.emptyParam();
    this.getData();
  }

  ngOnDestroy(): void {
    // Clean up the map when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }

  emptyParam() {
    this.modelParam = {
      nama: ""
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

    this.index = detail[0].index_1;
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
    });
  }

  view(data) {
    this.stationForm = data;

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
}
