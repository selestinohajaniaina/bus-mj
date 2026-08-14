import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { findBusDetailById } from 'bus-mj';
import { Bus, Stop } from '../interface/bus';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  public titre!: string;
  private bus_id: string = this.route.snapshot.queryParams['relation_id'];
  public bus: Bus;
  public stops: Stop[] = [];

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.bus_id = this.route.snapshot.queryParams['relation_id'];
    this.bus = findBusDetailById(Number(this.bus_id));
    this.titre = this.bus.tags.name;
    this.stops = this.bus.members.filter(member => member.label != undefined);
  }

  colorOf(propriety: string) {
    return propriety ? this.translate.instant(`COLOR.${propriety.toUpperCase()}`) : this.translate.instant('COLOR.ALL');
  }

  ionColorOf(propriety: string) {
    switch (propriety) {
      case 'yellow':
        return 'warning';
      case 'orange':
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
