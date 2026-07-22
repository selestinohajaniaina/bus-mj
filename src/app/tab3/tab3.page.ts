import { Component } from '@angular/core';
import { Bus, Stop } from '../interface/bus';
import { findStopAll } from 'bus-mj';
import { Coordinates, MapMarker } from '../interface/Map';
import * as maplibregl from 'maplibre-gl';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  private map: maplibregl.Map;
  private mapCenter: Coordinates;
  private mapZoom: number = 13;
  private mapStyleUrl: string = 'https://tiles.openfreemap.org/styles/positron';
  private haveGPSPermission: boolean = false;
  private myPosition: MapMarker;
  private mySpeed: number = 0;

  public allStop: Stop[];

  constructor() {
    const theme = localStorage.getItem("theme");
    if (theme == "dark") {
      this.mapStyleUrl = 'https://tiles.openfreemap.org/styles/dark';
    } else {
      this.mapStyleUrl = 'https://tiles.openfreemap.org/styles/positron';
    }
  }

  ngOnInit() {
    this.allStop = findStopAll();
    this.initMap();
    this.getGPS();
  }

  initMap() {
    console.log('init map');

    this.mapCenter = { longitude: 46.3167, latitude: -15.7167 };

    this.map = new maplibregl.Map({
      container: 'maplibreglTab3',
      style: this.mapStyleUrl,
      center: [this.mapCenter.longitude, this.mapCenter.latitude],
      zoom: this.mapZoom,
    });

    if (this.allStop) {
      this.allStop.map((e) => {
        this.addMarker({
          longitude: e.lon,
          latitude: e.lat,
          label: String(e.label),
        });
      });
    }

  }

  addMarker(_marker: MapMarker, isMyPosition = false) {
    const marker = new maplibregl.Marker({
      color: isMyPosition ? '#e74c3c' : '#3FB1CE'
    })
      .setLngLat([_marker.longitude, _marker.latitude])
      .setPopup(new maplibregl.Popup().setText(_marker.label))
      .addTo(this.map);
  }

  async getGPS() {
    if (Capacitor.getPlatform() === 'web') {
      this.getWebPosition();
    } else {
      this.getNativePosition();
    }
  }

  async getWebPosition() {
    const status = await navigator.permissions.query({
      name: 'geolocation'
    });
    if (status.state == "granted") {
      console.log(status);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.haveGPSPermission = true;
          this.myPosition = { longitude: position.coords.longitude, latitude: position.coords.latitude, label: "Vous etes ici" };
          this.mySpeed = position.coords.speed ?? 0;
          this.addMarker(this.myPosition, true)
        },
        (error) => {
          this.haveGPSPermission = false;
        },
        {
          enableHighAccuracy: true
        }
      );
    }
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
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      this.myPosition = { longitude: Number(position.coords.longitude), latitude: Number(position.coords.latitude), label: "Vous etes ici" };
      this.mySpeed = position.coords.speed ?? 0;
    }
  }

}
