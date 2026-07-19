import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsComponent } from './maps.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [MapsComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [MapsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MapsModule { }
