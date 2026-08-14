import { Component, OnInit } from '@angular/core';
import { SearchHistory } from '../interface/bus';
import { StorageService } from '../service/storage.service';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  public valueSearch: string = '';
  public historyResult: SearchHistory[] = [];
  public isStorageEmpty: boolean = true;

  public get querySearch(): string | null {
    return this.valueSearch;
  }

  set querySearch(value: string) {
    this.valueSearch = value;
    if (!value.trim()) {
      this.loadHistory();
    } else {
      this.historyResult = this.storage.getHistoryByName(value);
    }
  }

  constructor(
    private storage: StorageService,
    private alert: AlertController,
    private translate: TranslateService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.loadHistory();
  }

  loadHistory() {
    this.historyResult = this.storage.getHistory();

    this.historyResult.sort((a, b) => {
      return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
    });

    this.isStorageEmpty = this.historyResult.length > 0 ? false : true;
  }

  async clearHistory() {
    const alert = await this.alert.create({
      header: this.translate.instant('ALERT.CONFIRMATION'),
      message: this.translate.instant('ALERT.DELETE_HISTORY'),
      buttons: [
        {
          text: this.translate.instant('ALERT.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('ALERT.DELETE'),
          handler: () => {
            this.storage.clearHistory();
            this.loadHistory();
            this.addToHistory();
            this.showToast(this.translate.instant('HISTORY.CLEAR'));
          },
        },
      ],
    });

    await alert.present();
  }

  addToHistory() {
    const history: SearchHistory = {
      type: 'ACTION',
      id: this.storage.getHistoryId(),
      display_name: 'TAB4.HISTORY',
      description: 'HISTORY.CLEAR',
      key_words: [],
      saved_at: new Date().toISOString(),
    };
    this.storage.addHistory(history);
  }

  formatHistory(history: SearchHistory) {
    const display_name = this.translate.instant(history.display_name, {begin: history.key_words[0], end: history.key_words[1] });
    const description = this.translate.instant(history.description, {begin: history.key_words[0], end: history.key_words[1] });
    const datetime = this.formatDate(history.saved_at);
    return {display_name, description, datetime};
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
    });

    await toast.present();
  }
}
