import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { getAllStop, getBus } from 'bus-mj';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public allStop: [];
  public result: [{
    BUS_ID: number,
    BUS_NAME: string,
    BUS_PLAQUE: string,
    LONG: string,
    TIME: string,
    YOUR_TRAJET: []
  }];
  public depart: string = 'c';
  public fin: string = 'c';

  constructor(
    private alertControler: AlertController
  ) {}

  async ngOnInit() {
    this.allStop = await getAllStop();
    
  }

  async findBus() {
    if(this.depart != 'c' && this.fin != 'c') {
      this.result = await getBus(this.depart, this.fin);
      console.log(this.result);

    }else{
      this.alertControler.create({
        message: 'Choisir l\'arret du depart et celle d\'arrive'
      });
    }
    
  }

}
