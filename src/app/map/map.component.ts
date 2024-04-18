import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: L.Map;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map').setView([51.505, -0.09], 13); // Set lokasi awal map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  }
}
