import { Component, OnInit } from '@angular/core';
import { OSMResult, OSMResultStored } from '../interface/Map';
import { StorageService } from '../service/storage.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SearchHistory } from '../interface/bus';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  public valueSearch: string = '';
  public placeResult: OSMResultStored[];
  public isStorageEmpty: boolean = true;

  public get querySearch(): string | null {
    return this.valueSearch;
  }

  set querySearch(value: string) {
    this.valueSearch = value;
    if (!value.trim()) {
      this.loadPlaces();
    } else {
      this.placeResult = this.storage.getMyPlacesByName(value);
    }
  }

  constructor(private storage: StorageService, private alert: AlertController, private router: Router) {}

  ngOnInit() {
    this.loadPlaces();
  }

  loadPlaces() {
    this.placeResult = this.storage.getAllMyPlaces();
    this.isStorageEmpty = this.placeResult.length > 0 ? false : true;
  }

  isSaved(place: OSMResult): boolean {
    return this.storage.getAllMyPlaces().some(
      p => p.osm_id === place.osm_id
    );
  }

  save(place: OSMResult) {
    this.storage.addMyPlace(place);
  }

  unSave(place: OSMResult) {
    this.storage.removeMyPlace(place.osm_id);
  }

  async clearSearch() {
    const alert = await this.alert.create({
      header: 'Confirmation',
      message: 'Voulez-vous vraiment supprimer tous les lieux enregistrés ?',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Supprimer',
          handler: () => {
            this.storage.clearMyPlaces();
            this.loadPlaces();
            this.addToHistory();
          }
        }
      ]
    });

    await alert.present();
  }

  goToSearch() {
    this.router.navigate(['/tabs/tab3']);
  }

  addToHistory() {
    const history: SearchHistory = {
      type: 'OSMResultStored',
      id: this.storage.getHistoryId(),
      display_name: 'Lieux enregistrés',
      description: 'Vous avez vidé les lieux enregistrés',
      saved_at: new Date().toISOString()
    };
    this.storage.addHistory(history);
  }

}
