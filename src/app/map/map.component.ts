import { Component, OnDestroy, OnInit } from '@angular/core';
import { AirQualityService } from '../services/air-quality.service';
import * as L from 'leaflet';
import 'leaflet-gesture-handling';

// Custom options for MapOptions
declare module 'leaflet' {
  interface MapOptions {
    gestureHandling?: boolean;
  }
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, OnDestroy {
  map: any;
  mapVisible: boolean = false;

  listData: any = [];

  constructor(
    private airService: AirQualityService
  ) { }

  ngOnInit(): void {
    this.mapVisible = true;
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  ngOnDestroy(): void {
    // Clean up the map when the component is destroyed
    if (this.map) {
      this.map.remove();
    }
  }

  initMap(): void {
    var southWest = L.latLng(-12.168, 93.515),
        northEast = L.latLng(8.494, 142.294),
        bounds = L.latLngBounds(southWest, northEast);

    this.map = L.map('map', {
      center: [-1.8893, 117.9213], // Centered on Indonesia
      zoom: 5, // Adjust zoom level as needed
      zoomControl: false, // Disable zoom control
      scrollWheelZoom: false, // Disable zooming via mouse scroll
      gestureHandling: true, // Enable gesture handling
      maxBounds: bounds,
      layers: [
        L.tileLayer('https://osm.airvisual.net/{z}/{x}/{y}.png', {
          maxZoom: 19,
          minZoom: 5,
        })
      ]
    });

    // Add zoom control
    L.control.zoom({
      position: 'bottomright', // Adjust the position of the zoom control
    }).addTo(this.map);

    this.airService.getData().subscribe((res: any) => {
      this.listData = res.data;
      
      this.listData.forEach((data) => {
        const lat = data.lat;
        const long = data.long;
        const idStation = data.id;
        const namaStation = data.nama;
        const index = data.index;
        const color = index <= 50 ? 'map-pin-green' : index <= 100 ? 'map-pin-yellow' : index <= 150 ? 'map-pin-orange' : index <= 200 ? 'map-pin-red' : index <= 250 ? 'map-pin-purple' : 'map-pin-maroon';

        // Define custom marker icon
        const customIcon = L.divIcon({
          iconSize: [0, 0],
          html: `<div class="map-pin ${color}">${index}</div>`
        });

        const popupContent = `
        <div>
          <span style="cursor: pointer; color: #00A3FF; font-size: 15px;" id="marker-popup-button-${idStation}">${namaStation}</span>
        </div>`;

        const marker = L.marker(new L.LatLng(lat, long), { icon: customIcon });

        marker.bindPopup(popupContent, {
          autoPan: true,
          autoPanPadding: [10, 10],
          autoClose: true,
          closeButton: false
        });

        if (index != '-') {
          marker.addTo(this.map);
        }
      });
    });
    
  }
}
