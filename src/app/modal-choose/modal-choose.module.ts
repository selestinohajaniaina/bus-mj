import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ModalChooseComponent } from './modal-choose.component';



@NgModule({
  declarations: [ModalChooseComponent],
  imports: [
        CommonModule,
        IonicModule,
        FormsModule
  ],
  exports: [ModalChooseComponent]
})
export class ModalChooseModule { }
