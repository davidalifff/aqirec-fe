import { Component, OnInit } from '@angular/core';
import { StationService } from '../services/station.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.css']
})
export class StationComponent implements OnInit {
  modelParam: {
    nama;
  }

  map: any;

  stationForm: any;

  listData: any = [];
  listDetail: any = [];

  showDetail: boolean = false;

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.modelParam = {
      nama: ""
    }

    this.getData();
  }

  emptyParam() {
    this.modelParam = {
      nama: ""
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
    });
  }

  back() {
    this.showDetail = !this.showDetail;
  }
}
