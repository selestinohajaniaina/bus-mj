import { Component } from '@angular/core';
import { Bus, Stop } from '../interface/bus';
import { findStopAll, findBusAll, findBusByOneStop } from 'bus-mj';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public allStop: Stop[];
  public idSearch: number;
  public valueSearch: string | null;
  private allBus: Bus[];
  public busStops: {busId: string, stops: string[]}[];
  public busFilter: Bus[];
  public isShowStopHelp: boolean = false;
  public stopFiltered: Stop[];

  public get stop(): string | null {
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
    this.allStop = findStopAll();
    this.allBus = findBusAll();
  }

  stopLabel(stopId: number) {
    // return getStopLabel(stopId);
  }

  getBusLabel(busId: number) {
    return this.allBus.filter((e)=> e.id == busId)[0].tags.name;
  }

  getStopAtPosition(stops: string[], position: number) {
    // return this.stopLabel(stops[position] == this.idSearch ? stops[stops.length - 1] : stops[position]);
  }
  
  choisir(id: number) {
    this.valueSearch = this.allStop.filter((e) => e.id == id)[0].label;
    this.isShowStopHelp = false;
    this.busFilter = findBusByOneStop(id);
    console.log(id,this.busFilter);

  }

  filterStop(value: string) {
    return this.allStop.filter((e) => e.label!.toLowerCase().includes(value.toLowerCase()));
  }

}
