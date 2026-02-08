import { Component } from '@angular/core';
import { findBusByTwoStop, findStopAll } from 'bus-mj';
import { Stop, Bus } from '../interface/bus';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public allStop: Stop[];
  public result: Bus[] = [];
  public depart: string | number = 'c';
  public fin: string | number = 'c';
  public isShowEmpty: boolean = false;

  constructor(
  ) {}

  ngOnInit() {
    this.allStop = findStopAll().sort((a, b) => a.label!.localeCompare(b.label!));
  }

  findBus() {
    if(this.depart == 'c' || this.fin == 'c') {
      alert("Choisissez l\'arrêt de départ et celui d'arrivée.");
    }else if(this.depart == this.fin){
      alert('Les deux arrêts doivent être différents.');
    }else{
      console.log(this.depart, this.fin);
      
      this.isShowEmpty = false;
      this.result = findBusByTwoStop(Number(this.depart), Number(this.fin));
      if(!this.result[0]) {
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

}
