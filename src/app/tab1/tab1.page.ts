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
  }

  getBusByCooperative(coop: string) {
    return findBusDetailByOperator(coop).length;
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
