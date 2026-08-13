import { Component, OnInit } from '@angular/core';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  public paletteToggle!: boolean;
  public savedPlacesCount!: number;

  constructor(private storage: StorageService) {
    const theme = localStorage.getItem('theme');
    this.paletteToggle = theme == 'dark' ? true : false;
  }

  ngOnInit() {
    this.savedPlacesCount = this.storage.count();
  }

  ionViewWillEnter() {
    this.savedPlacesCount = this.storage.count();
  }

  toggleChange(event: CustomEvent) {
    this.toggleDarkPalette(event.detail.checked);
  }

  // Add or remove the "ion-palette-dark" class on the html element
  toggleDarkPalette(shouldAdd: boolean) {
    document.documentElement.classList.toggle('ion-palette-dark', shouldAdd);
    localStorage.setItem('theme', shouldAdd ? 'dark' : 'light');
  }
}
