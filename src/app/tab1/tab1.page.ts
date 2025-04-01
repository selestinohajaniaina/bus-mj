import { Component } from '@angular/core';
import { getAllBus } from 'bus-mj';
import { Bus } from '../interface/bus';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public allBus: {id: string, desc: Bus}[];
  public chargeShow: boolean = true;
  public Bus: Bus;
  public isOpen: boolean = false;

  constructor() {}

  ngOnInit() {
    // this.allBus = await getAllBus();
    setTimeout(() => {
      this.chargeShow = this.allBus? false : true;
    }, 1000);
    this.listBus();
  }

  listBus() {
    this.allBus = Object.entries(getAllBus()).map((e) => {return {id: e[0], desc: e[1]}});
  }

}
