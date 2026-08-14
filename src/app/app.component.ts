import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    this.darkModeChecker();
    this.languageChecker();
  }
  
  darkModeChecker() {
    const theme = localStorage.getItem("theme");
    if(!theme) localStorage.setItem("theme", "light");
    document.documentElement.classList.toggle('ion-palette-dark', theme=="dark");
  }

  languageChecker() {
    const lang = localStorage.getItem("bus-nakay-lang");
    if(!lang) localStorage.setItem("bus-nakay-lang", "fr");
    this.translate.use(lang || 'fr');
  }
}
