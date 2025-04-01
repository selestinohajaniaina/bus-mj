import { Component, Input, OnInit } from '@angular/core';
import { getStopLabel } from 'bus-mj';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss'],
})
export class StopListComponent  implements OnInit {
  @Input() StopList: string[];

  constructor() { }

  ngOnInit() {}

  labelOf(stopId: string) {
    return getStopLabel(stopId);
  }

}
