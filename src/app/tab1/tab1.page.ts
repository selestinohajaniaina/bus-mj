import { Component } from '@angular/core';
import { getAllBus } from 'bus-mj';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public allBus: [{
    BUS_ID: number,
    BUS_NAME: string
  }];
  public chargeShow: boolean = true;

  constructor() {}

  async ngOnInit() {
    this.allBus = await getAllBus();
    setTimeout(() => {
      this.chargeShow = this.allBus? false : true;
    }, 1000);
    this.listBus();
  }

  async listBus() {
    if(this.chargeShow){
      console.log(this.allBus);
      
    }
  }

}
