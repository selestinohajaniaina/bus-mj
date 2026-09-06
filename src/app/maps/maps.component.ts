import { Component, Input, OnInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { Coordinates, MapMarker, OSMResultStored } from '../interface/Map';
import { Stop } from '../interface/bus';
import { TranslateService } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { StorageService } from '../service/storage.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  @Input() triggerElementId: string;
  @Input() stop: Stop[];
  @Input() routes: Stop[][];
  @Input() title: string = '';

  private map: maplibregl.Map;
  private mapCenter: Coordinates;
  private mapZoom: number = 13;
  private mapStyleUrl: string = 'https://tiles.openfreemap.org/styles/positron';
  private haveGPSPermission: boolean = false;
  public myPosition: MapMarker;
  private mySpeed: number = 0;

  private webWatchId: number | null = null;
  private nativeWatchId: string | null = null;

  private myPositionMarker: maplibregl.Marker;

  private placeToGo: OSMResultStored | null;

  private palette = [
    '#e63946',
    '#457b9d',
    '#2a9d8f',
    '#f4a261',
    '#9d4edd',
    '#e76f51',
    '#06d6a0',
    '#118ab2',
    '#ffb703',
    '#fb8500',
    '#8338ec',
    '#ff006e',
    '#3a86ff',
    '#06a77d',
    '#d62828',
  ];
  private used = 0;

  constructor(
    private translate: TranslateService,
    private storage: StorageService
  ) {
    const theme = localStorage.getItem('theme');
    if (theme == 'dark') {
      this.mapStyleUrl = 'https://tiles.openfreemap.org/styles/dark';
    } else {
      this.mapStyleUrl = 'https://tiles.openfreemap.org/styles/positron';
    }
  }

  ngOnInit() {}

  initMap() {
    let semiData = 0;
    this.used = 0;

    if (this.stop) {
      semiData = Math.round(this.stop.length / 4);
      this.mapCenter = {
        longitude: this.stop[semiData].lon,
        latitude: this.stop[semiData].lat,
      };
    } else if (this.routes) {
      // this.mapCenter = {longitude: this.stop[0][0].lon, latitude: this.stop[0][0].lat};
    } else {
      this.mapCenter = { longitude: 46.3167, latitude: -15.7167 };
    }

    this.map = new maplibregl.Map({
      container: 'maplibregl',
      style: this.mapStyleUrl,
      center: [this.mapCenter.longitude, this.mapCenter.latitude],
      zoom: this.mapZoom,
    });

    setTimeout(() => this.map?.resize(), 100);

    if (this.stop) {
      this.stop.map((e) => {
        this.addMarker({
          longitude: e.lon,
          latitude: e.lat,
          label: String(e.label),
        });
      });
    }

    if (this.routes) {
      this.routes.map((members) => {
        const routes: number[][] = members.map((e) => [e.lon, e.lat]);
        this.addRoutes(routes);
      });
    }

    this.placeToGo = this.storage.getSearchKey();
    if (this.placeToGo) {
      this.addMarker(
        {
          longitude: Number(this.placeToGo.lon),
          latitude: Number(this.placeToGo.lat),
          label: this.placeToGo.name,
        },
        '#f39c12'
      );
    }

    this.getGPS();
  }

  destroyMap() {
    this.map.remove();
  }

  addMarker(_marker: MapMarker, _color: string = '#3FB1CE') {
    const marker = new maplibregl.Marker({
      color: _color,
    })
      .setLngLat([_marker.longitude, _marker.latitude])
      .setPopup(new maplibregl.Popup().setText(_marker.label))
      .addTo(this.map);
    return marker;
  }

  addRoutes(_routes: number[][]) {
    this.map.on('load', () => {
      this.map.addSource('ma-route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: _routes,
          },
        },
      });

      const choise = this.used;
      this.used++;

      this.map.addLayer({
        id: 'ma-route-layer',
        type: 'line',
        source: 'ma-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': this.palette[choise],
          'line-width': 5,
        },
      });
    });
  }

  setCenter(coordinate: Coordinates, zoom: number = 16, speed: number = 1.5) {
    this.map.flyTo({
      center: [coordinate.longitude, coordinate.latitude],
      zoom: zoom,
      speed: speed,
    });
  }

  getGPS() {
    if (Capacitor.getPlatform() === 'web') {
      this.getWebPosition();
    } else {
      this.getNativePosition();
    }
  }

  async getWebPosition() {
    if (!navigator.geolocation) {
      this.haveGPSPermission = false;
      return;
    }

    // Évite de créer plusieurs watchers
    if (this.webWatchId !== null) {
      navigator.geolocation.clearWatch(this.webWatchId);
    }

    this.webWatchId = navigator.geolocation.watchPosition(
      (position) => {
        this.haveGPSPermission = true;

        this.myPosition = {
          longitude: position.coords.longitude,
          latitude: position.coords.latitude,
          label: this.translate.instant('TAB3.YOUR_POSITION'),
        };

        this.mySpeed = position.coords.speed ?? 0;

        // Met à jour la position du marker
        this.updateMyPositionMarker();
      },
      (error) => {
        console.error('Erreur GPS Web:', error);
        this.haveGPSPermission = false;
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
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

    if (!this.haveGPSPermission) {
      this.haveGPSPermission = false;
      return;
    }

    // Évite de créer plusieurs watchers
    if (this.nativeWatchId !== null) {
      await Geolocation.clearWatch({
        id: this.nativeWatchId,
      });
    }

    this.nativeWatchId = await Geolocation.watchPosition(
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      },
      (position, err) => {
        if (err || !position) {
          console.error('Erreur GPS Native:', err);
          return;
        }

        this.myPosition = {
          longitude: Number(position.coords.longitude),
          latitude: Number(position.coords.latitude),
          label: this.translate.instant('TAB3.YOUR_POSITION'),
        };

        this.mySpeed = position.coords.speed ?? 0;

        // Met à jour la position du marker
        this.updateMyPositionMarker();
      }
    );
  }

  updateMyPositionMarker() {
    if (!this.myPosition) {
      return;
    }

    if (this.myPositionMarker) {
      this.myPositionMarker.setLngLat([
        this.myPosition.longitude,
        this.myPosition.latitude,
      ]);
    } else {
      this.myPositionMarker = this.addMarker(this.myPosition, '#e74c3c');
    }
  }
}
