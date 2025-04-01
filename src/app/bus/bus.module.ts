import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusPageRoutingModule } from './bus-routing.module';

import { BusPage } from './bus.page';
import { BusImgModule } from '../bus-img/bus-img.module';
import { StopListModule } from '../stop-list/stop-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BusPageRoutingModule,
    BusImgModule,
    StopListModule
  ],
  declarations: [BusPage]
})
export class BusPageModule {}
