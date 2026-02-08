import { Component, Input, OnInit } from '@angular/core';
import { Stop } from '../interface/bus';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss'],
})
export class StopListComponent  implements OnInit {
  @Input() StopList: Stop[];

  constructor() { }

  ngOnInit() {}

}
