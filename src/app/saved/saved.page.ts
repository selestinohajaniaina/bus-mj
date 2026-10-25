import { Component, OnInit } from '@angular/core';
import { MapMarker, OSMResult, OSMResultStored } from '../interface/Map';
import { StorageService } from '../service/storage.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SearchHistory } from '../interface/bus';
import { TranslateService } from '@ngx-translate/core';
import { LocalisationService } from '../service/localisation.service';
import { Geolocation } from '@capacitor/geolocation';
import * as turf from '@turf/turf';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-saved',
  templateUrl: './saved.page.html',
  styleUrls: ['./saved.page.scss'],
})
export class SavedPage implements OnInit {
  public valueSearch: string = '';
  public placeResult: OSMResultStored[];
  public isStorageEmpty: boolean = true;
  private myPosition: MapMarker;
  private haveGPSPermission: boolean = false;

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

  constructor(
    private storage: StorageService,
    private alert: AlertController,
    private router: Router,
    private translate: TranslateService,
    private localisation: LocalisationService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.getGPS();
    this.loadPlaces();
  }

  loadPlaces() {
    this.placeResult = this.storage.getAllMyPlaces();

    this.placeResult.map((e) => {
      e.distance = this.myPosition
        ? this.getDistance(
            turf.point([this.myPosition.longitude, this.myPosition.latitude]),
            turf.point([Number(e.lon), Number(e.lat)])
          )
        : 0;
      e.display_distance = this.localisation.getDisplayDistance(e.distance);
    });

    this.placeResult.sort((a, b) => {
      return new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime();
    });

    this.isStorageEmpty = this.placeResult.length > 0 ? false : true;
  }

  isSaved(place: OSMResult): boolean {
    return this.storage.getAllMyPlaces().some((p) => p.osm_id === place.osm_id);
  }

  save(place: OSMResult) {
    this.storage.addMyPlace(place);
    this.showToast(
      this.translate.instant('MODAL_SEARCH.SAVE', { name: place.name })
    );
  }

  unSave(place: OSMResult) {
    this.storage.removeMyPlace(place.osm_id);
    this.showToast(
      this.translate.instant('MODAL_SEARCH.UNSAVE', { name: place.name })
    );
  }

  async clearSearch() {
    const alert = await this.alert.create({
      mode: 'ios',
      header: this.translate.instant('ALERT.CONFIRMATION'),
      message: this.translate.instant('ALERT.DELETE_PLACE'),
      buttons: [
        {
          text: this.translate.instant('ALERT.CANCEL'),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant('ALERT.DELETE'),
          handler: () => {
            this.storage.clearMyPlaces();
            this.loadPlaces();
            this.addToHistory();
            this.showToast(this.translate.instant('SAVED.CLEAR'));
          },
        },
      ],
    });

    await alert.present();
  }

  goToSearch() {
    this.router.navigate(['/tabs/tab3']);
  }

  addToHistory() {
    const history: SearchHistory = {
      type: 'ACTION',
      id: this.storage.getHistoryId(),
      display_name: 'TAB4.PLACE_SAVED',
      description: 'SAVED.CLEAR',
      key_words: [],
      saved_at: new Date().toISOString(),
    };
    this.storage.addHistory(history);
  }

  displayDistance(distance: number): string {
    return this.localisation.getDisplayDistance(distance);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
    });

    await toast.present();
  }

  async getGPS() {
    if (Capacitor.getPlatform() === 'web') {
      this.getWebPosition();
    } else {
      this.getNativePosition();
    }
  }

  async getWebPosition() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.haveGPSPermission = true;
        this.myPosition = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          label: this.translate.instant('TAB3.YOUR_POSITION'),
        };
        this.loadPlaces();
      },
      (error) => {
        this.haveGPSPermission = false;
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  async getNativePosition() {
    const permissions = await Geolocation.checkPermissions();
    if (permissions.location === 'granted') {
      this.haveGPSPermission = true;
    } else {
      const reqPermissions = await Geolocation.requestPermissions();
      this.haveGPSPermission = reqPermissions.location === 'granted';
    }
    if (this.haveGPSPermission) {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      this.myPosition = {
        longitude: Number(position.coords.longitude),
        latitude: Number(position.coords.latitude),
        label: this.translate.instant('TAB3.YOUR_POSITION'),
      };
      this.loadPlaces();
    }
  }

  getDistance(point1: turf.Coord, point2: turf.Coord) {
    return turf.distance(point1, point2, { units: 'meters' });
  }
}
