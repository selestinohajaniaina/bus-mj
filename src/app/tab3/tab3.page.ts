import { Component } from '@angular/core';
import { Bus, Stop } from '../interface/bus';
import { findStopAll } from 'bus-mj';
import { Coordinates, MapMarker, OSMResult } from '../interface/Map';
import * as maplibregl from 'maplibre-gl';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import * as turf from '@turf/turf';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  private map: maplibregl.Map;
  private mapCenter: Coordinates;
  private mapZoom: number = 13;
  private mapStyleUrl: string = 'https://tiles.openfreemap.org/styles/positron';
  private haveGPSPermission: boolean = false;
  private mySpeed: number = 0;
  private markedPlace: Coordinates[] = [];

  public myPosition: MapMarker;
  public allStop: Stop[];

  constructor() {
    const theme = localStorage.getItem('theme');
    if (theme == 'dark') {
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

  addMarker(_marker: MapMarker, _color: string = '#3FB1CE') {
    const marker = new maplibregl.Marker({
      color: _color,
    })
      .setLngLat([_marker.longitude, _marker.latitude])
      .setPopup(new maplibregl.Popup().setText(_marker.label))
      .addTo(this.map);
  }

  setCenter(coordinate: Coordinates, zoom: number = 16, speed: number = 1.5) {
    this.map.flyTo({
      center: [coordinate.longitude, coordinate.latitude],
      zoom: zoom,
      speed: speed,
    });
  }

  drawDistance(
    coordinate1: Coordinates,
    coordinate2: Coordinates,
    text: string = ''
  ) {
    const routeId = `route-${Math.abs(
      coordinate1.longitude +
      coordinate1.latitude +
      coordinate2.longitude +
      coordinate2.latitude
    )}-${text}`;

    this.map.addSource(routeId, {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [coordinate1.longitude, coordinate1.latitude],
            [coordinate2.longitude, coordinate2.latitude],
          ],
        },
      },
    });

    this.map.addLayer({
      id: `${routeId}-line`,
      type: 'line',
      source: routeId,
      paint: {
        'line-color': '#0d6efd',
        'line-width': 4,
      },
    });

    this.map.addLayer({
      id: `${routeId}-label`,
      type: 'symbol',
      source: routeId,
      layout: {
        'symbol-placement': 'line',
        'text-field': text,
        'text-size': 14,
        'text-offset': [0, -1],
      },
      paint: {
        'text-color': '#757575',
        'text-halo-color': '#fff',
        'text-halo-width': 2,
      },
    });
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
          label: 'Vous etes ici',
        };
        this.mySpeed = position.coords.speed ?? 0;
        this.addMarker(this.myPosition, '#e74c3c');
        this.setCenter(this.myPosition);
        const stopNearsMe = this.getNearsStop(this.myPosition);

        stopNearsMe.map((e) => {
          this.drawDistance(
            this.myPosition,
            { longitude: e.lon, latitude: e.lat },
            `${Math.round(e.distance)}m`
          );
        });

        // this.map.on('load', () => {
        // stopNearsMe.map((e) => {
        //   this.drawDistance(
        //     this.myPosition,
        //     { longitude: e.lon, latitude: e.lat },
        //     `${Math.round(e.distance)}m`
        //   );
        // });
        // });

      },
      (error) => {
        this.haveGPSPermission = false;
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  setToMyPosition() {
    if (this.myPosition) {
      this.setCenter(this.myPosition);
    } else {
      this.getGPS();
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
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
      });
      this.myPosition = {
        longitude: Number(position.coords.longitude),
        latitude: Number(position.coords.latitude),
        label: 'Vous etes ici',
      };
      this.mySpeed = position.coords.speed ?? 0;
      this.addMarker(this.myPosition, '#e74c3c');
      this.setCenter(this.myPosition);
      const stopNearsMe = this.getNearsStop(this.myPosition);
      this.map.on('load', () => {
        stopNearsMe.map((e) => {
          this.drawDistance(
            this.myPosition,
            { longitude: e.lon, latitude: e.lat },
            `${Math.round(e.distance)}m`
          );
        });
      });
    }
  }

  getNearsStop(coordinate: Coordinates) {
    const myPoint = turf.point([coordinate.longitude, coordinate.latitude]);

    const sortedStops = this.allStop
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

  showOsmData(data: OSMResult) {
    const longitude = Number(data.lon);
    const latitude = Number(data.lat);
    const label = data.name;
    if (data.nearStopLength > 0) {
      const place = this.markedPlace.find(
        (p) => p.longitude === longitude && p.latitude === latitude
      );

      if (!place) {
        this.markedPlace.push({ longitude, latitude });
        this.addMarker({ longitude, latitude, label }, '#f39c12');
        data.nearStop.map((dis: Stop) => {
          const _distance = this.getDistance(
            [longitude, latitude],
            [dis.lon, dis.lat]
          );
          this.drawDistance(
            { longitude, latitude },
            { longitude: dis.lon, latitude: dis.lat },
            this.getDisplayDistance(_distance)
          );
        });
      }
    }
    this.setCenter({ longitude, latitude }, 19);
  }

  getDistance(point1: turf.Coord, point2: turf.Coord) {
    return turf.distance(point1, point2, { units: 'meters' });
  }

  getDisplayDistance(distance: number) {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
  }
}
