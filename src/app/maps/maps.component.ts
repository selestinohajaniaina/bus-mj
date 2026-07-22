import { Component, Input, OnInit } from '@angular/core';
import * as maplibregl from 'maplibre-gl';
import { Coordinates, MapMarker } from '../interface/Map';
import { Stop } from '../interface/bus';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss'],
})
export class MapsComponent implements OnInit {
  @Input() triggerElementId: string;
  @Input() stop: Stop[];
  @Input() routes: Stop[][];
  @Input() title: string = 'Affichage sur Carte';

  private map: maplibregl.Map;
  private mapCenter: Coordinates;
  private mapZoom: number = 13;
  private mapStyleUrl: string = 'https://tiles.openfreemap.org/styles/positron';

  private palette = [
    '#e63946', '#457b9d', '#2a9d8f', '#f4a261', '#9d4edd',
    '#e76f51', '#06d6a0', '#118ab2', '#ffb703', '#fb8500',
    '#8338ec', '#ff006e', '#3a86ff', '#06a77d', '#d62828',
  ];
  private used = 0;

  constructor() {
    const theme = localStorage.getItem("theme");
    if(theme == "dark") {
      this.mapStyleUrl = 'https://tiles.openfreemap.org/styles/dark';
    } else {
      this.mapStyleUrl = 'https://tiles.openfreemap.org/styles/positron';
    }
  }

  ngOnInit() {}

  initMap() {
    console.log('init map');

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

    if( this.routes) {
      this.routes.map( (members) => {
        const routes: number[][] = members.map((e) => [e.lon, e.lat]);
        this.addRoutes(routes);
      })
    }
  }

  destroyMap() {
    console.log('destroyMap called');
    this.map.remove();
  }

  addMarker(_marker: MapMarker) {
    const marker = new maplibregl.Marker()
      .setLngLat([_marker.longitude, _marker.latitude])
      .setPopup(new maplibregl.Popup().setText(_marker.label))
      .addTo(this.map);
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
}
