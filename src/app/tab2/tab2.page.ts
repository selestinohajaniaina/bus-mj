import { Component } from '@angular/core';
import { busAt, getAllBus, getAllStop, getBus, getStop } from 'bus-mj';
import { Node } from '../interface/bus';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public allStop: Node[];
  public result: Relation[] = [];
  public depart: string | number = 'c';
  public fin: string | number = 'c';
  public isShowEmpty: boolean = false;

  constructor(
  ) {}

  ngOnInit() {
    this.allStop = getAllStop();
    this.allStop.sort((a, b) => a.label.localeCompare(b.label));
  }

  findBus() {
    if(this.depart == 'c' || this.fin == 'c') {
      alert("Choisissez l\'arrêt de départ et celui d'arrivée.");
    }else if(this.depart == this.fin){
      alert('Les deux arrêts doivent être différents.');
    }else{
      this.isShowEmpty = false;
      this.result = getBus(Number(this.depart), Number(this.fin));
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
