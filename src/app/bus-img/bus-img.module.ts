import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusImgComponent } from './bus-img.component';



@NgModule({
  declarations: [BusImgComponent],
  imports: [
    CommonModule
  ],
  exports: [BusImgComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class BusImgModule { }
