import { Component, Input, OnInit, ViewChild } from '@angular/core';
// import { Bus } from '../interface/bus';
import { IonModal } from '@ionic/angular';
import { busAt } from 'bus-mj';

@Component({
  selector: 'app-modal-bus',
  templateUrl: './modal-bus.component.html',
  styleUrls: ['./modal-bus.component.scss'],
})
export class ModalBusComponent  implements OnInit {

  @Input() bus: {
    BUS_ID: string,
    ROAD: string[]
  };
  @Input() stopList: string;
  @Input() trigger: string;
  // public busDetail: Bus;

  constructor() { }

  ngOnInit() {
    // this.busDetail = busAt(this.bus.BUS_ID);
  }

  colorOf(propriety: string) {
    switch (propriety) {
      case 'yellow':
        return 'jaune';
      case 'blue':
        return 'bleu';
      case 'green':
        return 'vert';
      case 'red':
        return 'rouge';
      case 'white':
        return 'blanc';
      default:
        return "toute couleur";
    }
  }

  ionColorOf(propriety: string) {
    switch (propriety) {
      case 'yellow':
        return 'warning';
      case 'blue':
        return 'primary';
      case 'green':
        return 'success';
      case 'red':
        return 'danger';
      case 'white':
        return 'light';
      default:
        return;
    }
  }


}
