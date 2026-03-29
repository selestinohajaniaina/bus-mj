import { Component } from '@angular/core';
import { Bus, Stop } from '../interface/bus';
import { findStopAll, findBusAll, findBusByOneStop, findBusByStopLabel } from 'bus-mj';

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

  getBusLabel(busId: number) {
    return this.allBus.filter((e)=> e.id == busId)[0].tags.name;
  }

  getStopLabelAtPosition(members: Stop[], position: number) {
    return members[position].label;
  }
  
  choisir(label: string) {
    this.valueSearch = this.allStop.filter((e) => e.label == label)[0].label;
    this.isShowStopHelp = false;
    this.busFilter = findBusByStopLabel(label);
    console.log(label,this.busFilter);

  }

  filterStop(value: string) {
    return this.allStop.filter((e) => e.label!.toLowerCase().includes(value.toLowerCase()));
  }

  getOperatorColor(operator: string): string {
    const map: { [k: string]: string } = {
      MAMI: '#1E88E5',
      'KOFIBE/ KOFIMARE': '#009688',
      MAHATSINJO: '#8E24AA',
      TAMBATRA: '#43A047',
      'NY ANTSIKA': '#E53935',
      AMBONDRONA: '#FFB300',
      MIRAY: '#00ACC1',
      AINA: '#D81B60',
    };
    return map[operator] || '#607D8B';
  }

}
