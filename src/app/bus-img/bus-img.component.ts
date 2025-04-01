import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bus-img',
  templateUrl: './bus-img.component.html',
  styleUrls: ['./bus-img.component.scss'],
})
export class BusImgComponent  implements OnInit {

  @Input() firstBand: string;
  @Input() secondBand: string;
  @Input() busColor: string;
  @Input() busBoard: string | null;

  constructor() { }

  ngOnInit() {}

}
