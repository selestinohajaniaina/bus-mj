import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalBusComponent } from './modal-bus.component';
import { IonicModule } from '@ionic/angular';
import { BusImgModule } from '../bus-img/bus-img.module';
import { StopListModule } from '../stop-list/stop-list.module';



@NgModule({
  declarations: [ModalBusComponent],
  imports: [
    CommonModule,
    IonicModule,
    BusImgModule,
    StopListModule
  ],
  exports: [ModalBusComponent]
})
export class ModalBusModule { }
