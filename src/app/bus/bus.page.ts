import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { busAt, getStop, getStopLabel } from 'bus-mj';
import { Bus } from '../interface/bus';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  public titre!: string;
  private bus_id: string = this.route.snapshot.queryParams['bus_id'];
  public bus: Bus;
  public busStop!: string[];
  public color = {
    yellow: 'jaune',
    blue: 'bleu',
    green: 'vert',
    red: 'rouge',
  };

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.bus_id = this.route.snapshot.queryParams['bus_id'];
    this.bus = busAt(this.bus_id);
    this.titre = this.bus.label;
    this.busStop = getStop(this.bus_id);
  }

  labelOf(stopId: string) {
    return getStopLabel(stopId);
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
        return;
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
