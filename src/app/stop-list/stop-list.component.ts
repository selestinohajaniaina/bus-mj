import { Component, Input, OnInit } from '@angular/core';
import { Members } from '../interface/bus';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.scss'],
})
export class StopListComponent  implements OnInit {
  @Input() StopList: Members[];

  constructor() { }

  ngOnInit() {}

}
