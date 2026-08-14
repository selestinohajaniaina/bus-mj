import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Bus } from '../interface/bus';
import { IonModal } from '@ionic/angular';
import { findBusDetailById } from 'bus-mj';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-bus',
  templateUrl: './modal-bus.component.html',
  styleUrls: ['./modal-bus.component.scss'],
})
export class ModalBusComponent implements OnInit {
  @Input() bus: Bus;
  @Input() stopList: string;
  @Input() trigger: string;
  public busDetail: Bus;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.busDetail = findBusDetailById(this.bus.id);
  }

  colorOf(propriety: string) {
    return propriety ? this.translate.instant(`COLOR.${propriety.toUpperCase()}`) : this.translate.instant('COLOR.ALL');
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
