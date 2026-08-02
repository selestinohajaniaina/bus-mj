import { Component } from '@angular/core';
import {
  findBusByStopLabel,
  findBusByTwoStop,
  findStopAll,
  findBusByTwoStopLabel,
} from 'bus-mj';
import { Stop, Bus } from '../interface/bus';
import { OSMResultStored } from '../interface/Map';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public firstBtnLabel: string = 'Lieu de départ';
  public secondBtnLabel: string = 'Lieu de destination';
  public firstData: OSMResultStored;
  public secondData: OSMResultStored;
  public allStop: Stop[];
  public result: Bus[] = [];
  public busResult: Bus[] = [];
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

  public searchByStop: boolean = true;

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
      if (!this.result[0]) {
        this.isShowEmpty = true;
      }
    }
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

  OSMResultChooseFirst(data: OSMResultStored) {
    this.firstBtnLabel = data.name;
    this.firstData = data;
  }

  OSMResultChooseSecond(data: OSMResultStored) {
    this.secondBtnLabel = data.name;
    this.secondData = data;
  }

  findBusByPlace() {
    if (
      this.firstData &&
      this.secondData &&
      this.firstData.osm_id == this.secondData.osm_id
    ) {
      alert('Les deux lieux doivent etre different');
    } else if (this.firstData && this.secondData) {
      this.SearchBusByOSMResult(this.firstData, this.secondData);
    } else {
      alert('Veuillez tous remplir.');
    }
  }

  SearchBusByOSMResult(begin: OSMResultStored, end: OSMResultStored) {
    const stopNearBegin: Stop[] = begin.nearStop;
    const stopNearEnd: Stop[] = end.nearStop;

    const busFoundByNearStop: Bus[] = [];

    stopNearBegin.map((stopBegin: Stop) => {
      stopNearEnd.map((stopEnd: Stop) => {
        const busFound: Bus[] = findBusByTwoStopLabel(
          String(stopBegin.label),
          String(stopEnd.label)
        );
        busFoundByNearStop.push(...busFound);

        console.log(
          'busFoundByNearStop',
          busFoundByNearStop,
          'busFound',
          busFound
        );
      });
    });

    const uniqueBus = Array.from(
      busFoundByNearStop
        .reduce((map, bus) => {
          const existing = map.get(bus.tags.name);

          if (!existing || bus.members.length < existing.members.length) {
            map.set(bus.tags.name, bus);
          }

          return map;
        }, new Map<string, Bus>())
        .values()
    );

    this.result = uniqueBus;

    console.log('busFoundByNearStop final', uniqueBus);
  }
}
