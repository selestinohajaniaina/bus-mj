import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { busAt } from 'bus-mj';
import { Members, Relation } from '../interface/bus';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  public titre!: string;
  private bus_id: string = this.route.snapshot.queryParams['relation_id'];
  public bus: Relation;
  public stops: Members[] = [];

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.bus_id = this.route.snapshot.queryParams['relation_id'];
    this.bus = busAt(Number(this.bus_id));
    this.titre = this.bus.tags.name;
    this.stops = this.bus.members.filter(m => m.role === 'stop');
    console.log(this.bus);
    
  }

  colorOf(propriety: string) {
    switch (propriety) {
      case 'yellow':
        return 'jaune';
      case 'orange':
        return 'orange';
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
