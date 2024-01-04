import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getStop } from 'bus-mj';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.page.html',
  styleUrls: ['./bus.page.scss'],
})
export class BusPage implements OnInit {

  public titre: string = this.route.snapshot.queryParams['bus_name'];
  private bus_id: number = this.route.snapshot.queryParams['bus_id'];
  public busStop: [];


  constructor(
    private route: ActivatedRoute
  ) { }

  async ngOnInit() {
    this.titre = await this.route.snapshot.queryParams['bus_name'];
    this.bus_id = await this.route.snapshot.queryParams['bus_id'];
    this.busStop = await getStop(this.bus_id);
    console.log(await getStop(this.bus_id));
    
  }

}
