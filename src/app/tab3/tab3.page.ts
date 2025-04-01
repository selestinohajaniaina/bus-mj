import { Component } from '@angular/core';
import { Bus, Stop } from '../interface/bus';
import { getAllBus, getAllStop, getStop, getStopLabel } from 'bus-mj';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public allStop: Stop[];
  public idSearch: string;
  public valueSearch: string;
  private allBus: {id: string, desc: Bus}[];
  public busStops: {busId: string, stops: string[]}[];
  public busFilter: {busId: string, stops: string[]}[];
  public isShowStopHelp: boolean = false;
  public stopFiltered: Stop[];

  public get stop() {
    return this.valueSearch;
  }

  public set stop(value: string) {
    this.valueSearch = value;
    this.isShowStopHelp = true;
    this.stopFiltered = this.filterStop(this.valueSearch);
    if(this.valueSearch.length == 0) {
      this.isShowStopHelp = false;
    }
  }

  constructor() {}

  ngOnInit() {
    this.completeData();
  }
  
  completeData() {
    this.allStop = getAllStop();
    this.allBus = Object.entries(getAllBus()).map((e) => {return {id: e[0], desc: e[1]}});
    this.busStops = this.allBus.map((e) => { return{busId: e.id, stops: getStop(e.id)} });
  }

  stopLabel(stopId: string) {
    return getStopLabel(stopId);
  }

  getBusLabel(busId: string) {
    return this.allBus.filter((e)=> e.id == busId)[0].desc.label;
  }

  getStopAtPosition(stops: string[], position: number) {
    return this.stopLabel(stops[position] == this.idSearch ? stops[stops.length - 1] : stops[position]);
  }

  filterBusByStop(stopId: string) {
    this.busFilter = this.busStops.filter((e) => e.stops.includes(stopId));
    // console.log(this.busFilter);
  }

  choisir(key: string) {
    this.idSearch = key;
    this.valueSearch = this.stopLabel(this.idSearch);
    this.isShowStopHelp = false;
    this.filterBusByStop(this.idSearch);
  }

  filterStop(value: string) {
    return this.allStop.filter((e) => e.value.toLowerCase().includes(value.toLowerCase()));
  }

}
