import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal-choose',
  templateUrl: './modal-choose.component.html',
  styleUrls: ['./modal-choose.component.scss'],
})
export class ModalChooseComponent  implements OnInit {

  @Input() trigger: string;

  public querySearch: string = '';


  constructor() { }

  ngOnInit() {}

}
