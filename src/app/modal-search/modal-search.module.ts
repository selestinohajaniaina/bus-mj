import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalSearchComponent } from './modal-search.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalSearchComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslatePipe
  ],
  exports: [ModalSearchComponent]
})
export class ModalSearchModule { }
