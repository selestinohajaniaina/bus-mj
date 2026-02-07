import { Component } from '@angular/core';
import { getAllBus, getAllStop } from 'bus-mj';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public allStop: Stop[];
  public idSearch: number;
  public valueSearch: string;
  private allBus: Relation[];
  public busStops: {busId: string, stops: string[]}[];
  public busFilter: Relation[];
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
    this.allBus = getAllBus();
  }

  // stopLabel(stopId: string) {
  //   return getStopLabel(stopId);
  // }

  // getBusLabel(busId: string) {
  //   return this.allBus.filter((e)=> e.id == busId)[0].desc.label;
  // }

  // getStopAtPosition(stops: string[], position: number) {
  //   return this.stopLabel(stops[position] == this.idSearch ? stops[stops.length - 1] : stops[position]);
  // }

  filterBusByStop(stopId: number) {
    this.busFilter = this.allBus.filter((e) => e.members.includes(e.members.filter((m) => m.type == 'stop' && m.ref == stopId)[0]));
    console.log(this.busFilter);
  }

  choisir(id: number) {
    this.valueSearch = this.allStop.filter((e) => e.id == id)[0].label;
    this.isShowStopHelp = false;
    this.filterBusByStop(id);
  }

  filterStop(value: string) {
    return this.allStop.filter((e) => e.label.toLowerCase().includes(value.toLowerCase()));
  }

}
