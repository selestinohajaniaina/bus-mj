import { Component } from '@angular/core';
import { Bus } from '../interface/bus';
import { findBusAll, findOperatorAll, findBusDetailByOperator } from 'bus-mj';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  public allBus: Bus[];
  public allCooperative: string[];
  public chargeShow: boolean = true;
  public Bus: Bus;
  public ionColor = [
    'tertiary',
    'medium',
    'danger',
    'warning',
    'dark',
    'primary',
    'secondary',
    'success',
  ];

  constructor() {}

  ngOnInit() {
    this.allBus = findBusAll();
    this.allCooperative = findOperatorAll();
    setTimeout(() => {
      this.chargeShow = this.allBus.length === 0 ? true : false;
    }, 1000);
    this.allBus.map((bus) => console.log(bus.tags.color));
  }

  getBusByCooperative(coop: string) {
    return findBusDetailByOperator(coop).length;
  }

  getBusColor(position: number) {
    return this.ionColor[position % this.ionColor.length];
  }
}
