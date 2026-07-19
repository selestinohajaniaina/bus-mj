import { Component } from '@angular/core';
import {
  findBusByStopLabel,
  findBusByTwoStop,
  findStopAll,
  findBusByTwoStopLabel,
} from 'bus-mj';
import { Stop, Bus } from '../interface/bus';

// import * as maplibregl from 'maplibre-gl';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public allStop: Stop[];
  public result: Bus[] = [];
  public depart: string = 'c';
  public fin: string = 'c';
  public departOld: string = 'c';
  public finOld: string = 'c';
  public isShowEmpty: boolean = false;
  public valueSearch: string | null;
  public valueSearch2: string | null;
  public stopFiltered: Stop[];
  public isShowStopHelp: boolean = false;
  public isShowStopHelp2: boolean = false;
  public busFilter: Bus[];

  public get stop_1(): string | null {
    return this.valueSearch;
  }

  public set stop_1(value: string) {
    this.valueSearch = value;
    this.depart = this.valueSearch ? this.valueSearch : 'c';
    this.isShowStopHelp = true;
    this.stopFiltered = this.filterStop(this.valueSearch);
    if (this.valueSearch.length == 0 || this.stopFiltered.length == 0) {
      this.isShowStopHelp = false;
    }
  }

  public get stop_2(): string | null {
    return this.valueSearch2;
  }

  public set stop_2(value: string) {
    this.valueSearch2 = value;
    this.fin = this.valueSearch2 ? this.valueSearch2 : 'c';
    this.isShowStopHelp2 = true;
    this.stopFiltered = this.filterStop(this.valueSearch2);
    if (this.valueSearch2.length == 0 || this.stopFiltered.length == 0) {
      this.isShowStopHelp2 = false;
    }
  }

  constructor() {}

  ngOnInit() {
    this.allStop = findStopAll().sort((a, b) =>
      a.label!.localeCompare(b.label!)
    );

    // const map = new maplibregl.Map({
    //   container: 'maps', // container id
    //   style: 'https://tiles.openfreemap.org/styles/positron', // style URL
    //   center: [46.3167, -15.7167], // starting position [lng, lat]
    //   zoom: 12, // starting zoom
    // });
  }

  findBus() {
    if (this.depart == 'c' || this.fin == 'c') {
      alert("Choisissez l'arrêt de départ et celui d'arrivée.");
    } else if (this.depart == this.fin) {
      alert('Les deux arrêts doivent être différents.');
    } else {
      console.log(this.depart, this.fin);
      this.departOld = this.depart;
      this.finOld = this.fin;
      this.isShowEmpty = false;
      this.result = findBusByTwoStopLabel(this.depart, this.fin);
      console.log('result: ', this.result);
      if (!this.result[0]) {
        this.isShowEmpty = true;
      }
    }
  }

  busLabel(busId: string) {
    // return busAt(busId);
  }

  stopLabel(stopId: string) {
    // return getStopLabel(stopId);
  }

  filterStop(value: string) {
    const seen = new Set<string>();
    return this.allStop.filter((e) => {
      const label = e.label!.toLowerCase();
      if (!label.includes(value.toLowerCase())) return false;
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }

  choisir(label: string) {
    this.result = [];
    this.valueSearch = this.allStop.filter((e) => e.label == label)[0].label;
    this.depart = this.valueSearch ? this.valueSearch : 'c';
    this.isShowStopHelp = false;
    this.busFilter = findBusByStopLabel(label);
  }

  choisir2(label: string) {
    this.result = [];
    this.valueSearch2 = this.allStop.filter((e) => e.label == label)[0].label;
    this.fin = this.valueSearch2 ? this.valueSearch2 : 'c';
    this.isShowStopHelp2 = false;
    this.busFilter = findBusByStopLabel(label);
  }

  onFocus(inputNumber: number) {
    console.log('focus:', inputNumber);
  }

  onBlur(inputNumber: number) {
    console.log('perdu le focus: ', inputNumber);
  }
}
