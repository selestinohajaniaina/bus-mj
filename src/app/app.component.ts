import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    const theme = localStorage.getItem("theme");
    if(!theme) localStorage.setItem("theme", "light");
    document.documentElement.classList.toggle('ion-palette-dark', theme=="dark");
  }
}
