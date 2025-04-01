import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StopListComponent } from './stop-list.component';



@NgModule({
  declarations: [StopListComponent],
  imports: [
    CommonModule
  ],
  exports: [StopListComponent]
})
export class StopListModule { }
