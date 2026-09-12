import { Injectable } from '@angular/core';
import { Coordinates, MapMarker } from '../interface/Map';
import * as turf from '@turf/turf';
import { findStopAll } from 'bus-mj';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LocalisationService {
  private lSMPId: string = 'busNakayMP';
  public myPosition: MapMarker;
  private mySpeed: number = 0;
  private haveGPSPermission: boolean = false;

  constructor(
    private translate: TranslateService,
    private storage: StorageService,
    private toastController: ToastController
  ) {}

  getAverageBusSpeed(): number {
    return this.storage.getSpeed();
  }

  getAverageBusStopTime(): number {
    return this.storage.getTimeStop();
  }

  getDisplayDistance(distance: number): string {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} ${this.translate.instant(
        'KEY_WORDS.KM'
      )}`;
    }
    return `${Math.round(distance)} ${this.translate.instant('KEY_WORDS.M')}`;
  }

  getDisplayDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = Math.round(minutes % 60);
      if (remainingMinutes > 0) {
        return `${hours} ${this.translate.instant(
          'KEY_WORDS.H'
        )} ${remainingMinutes} ${this.translate.instant('KEY_WORDS.MIN')}`;
      }
      return `${hours} ${this.translate.instant('KEY_WORDS.H')}`;
    }
    return `${Math.round(minutes)} ${this.translate.instant('KEY_WORDS.MIN')}`;
  }

  // verification d'arrondissement de la position dans la ville de Mahajanga
  isInMahajanga(position: Coordinates): boolean {
    const minLongitude = 46.2;
    const maxLongitude = 46.45;
    const minLatitude = -15.82;
    const maxLatitude = -15.6;

    return (
      position.longitude >= minLongitude &&
      position.longitude <= maxLongitude &&
      position.latitude >= minLatitude &&
      position.latitude <= maxLatitude
    );
  }

  getNearsStop(coordinate: Coordinates) {
    const myPoint = turf.point([coordinate.longitude, coordinate.latitude]);

    const allStop = findStopAll();

    const sortedStops = allStop
      .map((stop) => ({
        ...stop,
        distance: turf.distance(myPoint, turf.point([stop.lon, stop.lat]), {
          units: 'meters',
        }),
      }))
      .sort((a, b) => a.distance - b.distance);

    const nearbyStops = sortedStops
      .filter((stop) => stop.distance <= 300)
      .slice(0, 10);

    return nearbyStops.length > 0 ? nearbyStops : sortedStops.slice(0, 1);
  }

  getMyPostion(): MapMarker | null {
    if (Capacitor.getPlatform() === 'web') {
      this.getWebPosition();
    } else {
      this.getNativePosition();
    }
    if (this.haveGPSPermission) {
      if (this.isInMahajanga(this.myPosition)) {
        return this.myPosition;
      } else {
        this.showToast(this.translate.instant('TAB3.YOU_NOT_IN_MAHAJANGA'));
        return null;
      }
    } else {
      return null;
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
        this.mySpeed = position.coords.speed ?? 0;
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
        label: 'Vous etes ici',
      };
      this.mySpeed = position.coords.speed ?? 0;
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
    });

    await toast.present();
  }
}
