import { Component, OnInit } from '@angular/core';
import { SearchHistory } from '../interface/bus';
import { StorageService } from '../service/storage.service';
import { AlertController } from '@ionic/angular';
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
    private translate: TranslateService
  ) {}

  ngOnInit() {
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
          },
        },
      ],
    });

    await alert.present();
  }

  addToHistory() {
    const history: SearchHistory = {
      type: 'History',
      id: this.storage.getHistoryId(),
      display_name: 'Historique',
      description: 'Vous avez vidé les historiques de recherche.',
      saved_at: new Date().toISOString(),
    };
    this.storage.addHistory(history);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
