import { Injectable } from '@angular/core';
import { Coordinates } from '../interface/Map';
import * as turf from '@turf/turf';
import { findStopAll } from 'bus-mj';

@Injectable({
  providedIn: 'root',
})
export class LocalisationService {
  private lSMPId: string = "busNakayMP";
  constructor() {}

  getDisplayDistance(distance: number): string {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(1)} km`;
    }
    return `${Math.round(distance)} m`;
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

  getMyPostion(): Coordinates | null {
    const position = localStorage.getItem(this.lSMPId);
    return position ? (JSON.parse(position) as Coordinates) : null;
  }

  savePosition(position: Coordinates) {
    localStorage.setItem(this.lSMPId, JSON.stringify(position));
  }
}
