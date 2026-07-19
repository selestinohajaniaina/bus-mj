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

  constructor() {}

  ngOnInit() {}

  initMap() {
    console.log('init map');

    if (this.stop) {
      this.mapCenter = {
        longitude: this.stop[0].lon,
        latitude: this.stop[0].lat,
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

      this.map.addLayer({
        id: 'ma-route-layer',
        type: 'line',
        source: 'ma-route',
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
          'line-color': '#e63946',
          'line-width': 5,
        },
      });
    });
  }
}
