import { Component } from '@angular/core';
import { getAllBus } from 'bus-mj';
import { Relation } from '../interface/bus';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public allBus: Relation[];
  public chargeShow: boolean = true;
  public Bus: Relation;

  constructor() {}

  ngOnInit() {
    // this.allBus = await getAllBus();
    setTimeout(() => {
      this.chargeShow = this.allBus? false : true;
    }, 1000);
    this.listBus();
  }

  listBus() {
    this.allBus = getAllBus();
  }

}
