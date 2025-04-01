import { Component } from '@angular/core';
import { busAt, getAllBus, getAllStop, getBus, getStop, getStopLabel } from 'bus-mj';
import { Stop } from '../interface/bus';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public allStop: Stop[];
  public result: [{
    BUS_ID: string,
    ROAD: string[]
  }];
  public depart: string = 'c';
  public fin: string = 'c';
  public isShowEmpty: boolean = false;

  constructor(
  ) {}

  ngOnInit() {
    this.allStop = getAllStop();
  }

  findBus() {
    if(this.depart == 'c' || this.fin == 'c') {
      alert('Choisir l\'arret du depart et celle d\'arrive');
    }else if(this.depart == this.fin){
      alert('Les deux arrets doivent etre different');
    }else{
      this.isShowEmpty = false;
      this.result = getBus(this.depart, this.fin);
      if(!this.result[0]) {
        this.isShowEmpty = true;
      }
    }
  }

  busLabel(busId: string) {
    return busAt(busId);
  }
  
  stopLabel(stopId: string) {
    return getStopLabel(stopId);
  }

}
