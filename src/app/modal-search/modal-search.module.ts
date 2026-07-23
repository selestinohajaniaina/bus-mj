import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchComponent } from './modal-search.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [ModalSearchComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ],
  exports: [ModalSearchComponent]
})
export class ModalSearchModule { }
