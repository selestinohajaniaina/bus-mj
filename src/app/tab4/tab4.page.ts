import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public paletteToggle!: boolean;
  public savedPlacesCount!: number;
  public savedHistoryCount!: number;
  public langPalette: string;

  constructor(private storage: StorageService, private translate: TranslateService) {
    const theme = localStorage.getItem('theme');
    this.paletteToggle = theme == 'dark' ? true : false;
    this.langPalette = localStorage.getItem("bus-nakay-lang") as string || 'fr';
  }

  ngOnInit() {
    this.initData();
  }

  ionViewWillEnter() {
    this.initData();
  }

  initData() {
    this.savedPlacesCount = this.storage.countPlaces();
    this.savedHistoryCount = this.storage.countHistory();
  }

  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    localStorage.setItem('theme', shouldAdd ? 'dark' : 'light');
  }

  // Add or change the global language
  chooseLangPalette(lang: string) {
    localStorage.setItem("bus-nakay-lang", lang);
    this.translate.use(lang);
  }
}
