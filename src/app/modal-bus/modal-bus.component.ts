import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Bus, Stop } from '../interface/bus';
import { IonModal } from '@ionic/angular';
import { findBusDetailById } from 'bus-mj';
import { TranslateService } from '@ngx-translate/core';
import * as turf from '@turf/turf';
import { LocalisationService } from '../service/localisation.service';

@Component({
  selector: 'app-modal-bus',
  templateUrl: './modal-bus.component.html',
  styleUrls: ['./modal-bus.component.scss'],
})
export class ModalBusComponent implements OnInit {
  @Input() bus: Bus;
  @Input() stopList: string;
  @Input() isOpen = false;

  @Output() closed = new EventEmitter<void>();

  constructor(
    private translate: TranslateService,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {}

  onModalDismiss() {
    this.isOpen = false;
    this.closed.emit();
  }

  colorOf(propriety: string) {
    return propriety
      ? this.translate.instant(`COLOR.${propriety.toUpperCase()}`)
      : this.translate.instant('COLOR.ALL');
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

  distanceMeters(stops: Stop[]) {
    const route = turf.lineString(stops.map((stop) => [stop.lon, stop.lat]));
    return turf.length(route, { units: 'meters' });
  }

  getDistanceOfRoute(stops: Stop[]) {
    const distance = this.distanceMeters(stops);
    return this.localisation.getDisplayDistance(distance);
  }

  getTimeTravel(stops: Stop[]) {
    const AVERAGE_BUS_SPEED = this.localisation.getAverageBusSpeed(); // 25 km/h
    const AVERAGE_BUS_STOP_TIME = this.localisation.getAverageBusStopTime(); // 0.5 min
    const distanceKm = this.distanceMeters(stops) / 1000;
    const timeHours = distanceKm / AVERAGE_BUS_SPEED;
    const timeMinutes = timeHours * 60 + AVERAGE_BUS_STOP_TIME * stops.length; // +30sec par arrets
    return this.localisation.getDisplayDuration(timeMinutes);
  }
}
