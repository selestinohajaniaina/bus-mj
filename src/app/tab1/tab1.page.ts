import { Component } from '@angular/core';
import { Bus } from '../interface/bus';
import { findBusAll } from 'bus-mj';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public allBus: Bus[];
  public chargeShow: boolean = true;
  public Bus: Bus;

  constructor() {}

  ngOnInit() {
    this.allBus = findBusAll();
    setTimeout(() => {
      this.chargeShow = this.allBus.length === 0 ? true : false;    
    }, 1000);
    this.allBus.map(bus => console.log(bus.tags.color));
    
  }

}
