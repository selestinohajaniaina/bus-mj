import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { ModalChooseComponent } from './modal-choose.component';
import { TranslatePipe } from '@ngx-translate/core';

@NgModule({
  declarations: [ModalChooseComponent],
  imports: [CommonModule, IonicModule, FormsModule, TranslatePipe],
  exports: [ModalChooseComponent],
})
export class ModalChooseModule {}
