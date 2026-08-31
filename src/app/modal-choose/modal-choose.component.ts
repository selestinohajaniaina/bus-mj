import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../service/storage.service';
import {
  Coordinates,
  MapMarker,
  OSMResult,
  OSMResultStored,
} from '../interface/Map';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { LocalisationService } from '../service/localisation.service';
import { Stop } from '../interface/bus';
import * as turf from '@turf/turf';
import { findStopAll } from 'bus-mj';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-choose',
  templateUrl: './modal-choose.component.html',
  styleUrls: ['./modal-choose.component.scss'],
})
export class ModalChooseComponent implements OnInit {
  @Input() trigger: string;
  @Output() OSMResultChooseEmitter: EventEmitter<OSMResultStored> =
    new EventEmitter();

  public valueSearch: string = '';
  public placeResult: OSMResultStored[];
  public isStorageEmpty: boolean = true;
  public myPositionOSM: OSMResultStored;
  private allStop: Stop[] = [];
  private url: string = environment.searchUrl;

  public chargeShow: boolean = false;

  public get querySearch(): string {
    return this.valueSearch;
  }

  set querySearch(value: string) {
    this.valueSearch = value;
    if (!value.trim()) {
      this.loadPlaces();
    }
  }

  constructor(
    private storage: StorageService,
    private router: Router,
    private localisation: LocalisationService,
    private translate: TranslateService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.allStop = findStopAll();
  }

  loadPlaces() {
    this.placeResult = this.storage.getAllMyPlaces();
    if (this.placeResult.length > 0) {
      this.isStorageEmpty = false;
    } else {
      this.isStorageEmpty = true;
      const stopExample: Stop[] = this.allStop.slice(0, 10);
      this.placeResult = this.stopToOsmResultStored(stopExample);
    }
    const myP = this.localisation.getMyPostion();
    if (myP)
      this.myPositionToOSMResult({
        label: this.translate.instant('MODAL_CHOOSE.MY_POSITION'),
        longitude: myP.longitude,
        latitude: myP.latitude,
      });
  }

  goToSearch() {
    this.router.navigate(['/tabs/tab3']);
  }

  chooseOSMResult(element: OSMResultStored) {
    this.OSMResultChooseEmitter.emit(element);
  }

  stopsNearMe(position: MapMarker): Stop[] {
    return this.localisation.getNearsStop(position);
  }

  myPositionToOSMResult(position: MapMarker) {
    this.myPositionOSM = {
      osm_id: 0,
      display_name: position.label,
      name: position.label,
      lon: position.longitude,
      lat: position.latitude,
      type: 'place',
      distance: 0,
      display_distance: '',
      nearStop: this.stopsNearMe(position),
      nearStopLength: this.stopsNearMe(position).length,
      saved_at: new Date().toLocaleString(),
    };
  }

  filterStop(value: string) {
    const seen = new Set<string>();
    return this.allStop.filter((e) => {
      const label = e.label!.toLowerCase();
      if (!label.includes(value.toLowerCase())) return false;
      if (seen.has(label)) return false;
      seen.add(label);
      return true;
    });
  }

  stopToOsmResultStored(stop: Stop[]): OSMResultStored[] {
    return stop.map((st) => {
      const distance = this.getDistance(
        turf.point([
          Number(this.localisation.getMyPostion()?.longitude),
          Number(this.localisation.getMyPostion()?.latitude),
        ]),
        turf.point([st.lon, st.lat])
      );
      return {
        osm_id: st.id,
        display_name: String(st.label),
        name: String(st.label),
        lon: st.lon,
        lat: st.lat,
        type: st.type,
        distance,
        display_distance: this.localisation.getDisplayDistance(distance),
        nearStop: [st],
        nearStopLength: 0,
        saved_at: '',
      };
    });
  }

  getDistance(point1: turf.Coord, point2: turf.Coord) {
    return turf.distance(point1, point2, { units: 'meters' });
  }

  displayDistance(distance: number): string {
    return this.localisation.getDisplayDistance(distance);
  }

  /**
   * Recherche un peu de resultat enligne si un acces internet est disponible
   * @returns
   */
  find() {
    if (!this.querySearch.trim()) {
      this.loadPlaces();
    } else {
      this.placeResult = this.storage.getMyPlacesByName(this.querySearch);
      const stopResult = this.filterStop(this.querySearch);
      const OsmStopResult = this.stopToOsmResultStored(stopResult);
      OsmStopResult.map((e: OSMResultStored) => this.placeResult.push(e));
      try {
        this.searchToNet();
      } catch (error) {
        return;
      }
    }
  }

  searchToNet() {
    this.chargeShow = true;
    this.http
      .get(this.url, {
        params: {
          q: this.querySearch,
          format: 'json',
          countrycodes: 'mg',
          viewbox: '46.20,-15.60,46.45,-15.82',
          bounded: '1',
        },
      })
      .subscribe({
        next: (result: any) => {
          this.chargeShow = false;
          result.map((e: OSMResult) => {
            const distance = this.getDistance(
              turf.point([
                Number(this.myPositionOSM.lon),
                Number(this.myPositionOSM.lat),
              ]),
              turf.point([Number(e.lon), Number(e.lat)])
            );
            const nearStop = this.getNearsStop({
              longitude: Number(e.lon),
              latitude: Number(e.lat),
            });
            const nearStopLength = nearStop.length;
            const elementOSMResult = {
              ...e,
              distance,
              display_distance: this.localisation.getDisplayDistance(distance),
              nearStop,
              nearStopLength,
              saved_at: new Date().toISOString(),
            };
            if (!this.isSaved(elementOSMResult)) {
              this.placeResult.push(elementOSMResult);
              this.save(elementOSMResult);
            }
          });
        },
        error: (err: any) => {
          this.chargeShow = false;
        },
      });
  }

  getNearsStop(coordinate: Coordinates) {
    const searchedPoint = turf.point([
      coordinate.longitude,
      coordinate.latitude,
    ]);
    const sortedStops = this.allStop
      .map((stop) => {
        const distance = this.getDistance(
          searchedPoint,
          turf.point([stop.lon, stop.lat])
        );
        return {
          ...stop,
          distance,
          display_distance: this.localisation.getDisplayDistance(distance),
        };
      })
      .sort((a, b) => a.distance - b.distance);
    const nearbyStops = sortedStops
      .filter((stop) => stop.distance <= 250)
      .slice(0, 10);
    return nearbyStops.length > 0 ? nearbyStops : sortedStops.slice(0, 1);
  }

  stopToOsmResult(stop: Stop[]): OSMResult[] {
    return stop.map((st) => {
      const distance = this.getDistance(
        turf.point([
          Number(this.myPositionOSM.lon),
          Number(this.myPositionOSM.lat),
        ]),
        turf.point([st.lon, st.lat])
      );
      return {
        osm_id: st.id,
        display_name: String(st.label),
        name: String(st.label),
        lon: st.lon,
        lat: st.lat,
        type: st.type,
        distance,
        display_distance: this.localisation.getDisplayDistance(distance),
        nearStop: [],
        nearStopLength: 0,
      };
    });
  }

  isSaved(place: OSMResult): boolean {
    return this.storage.getAllMyPlaces().some((p) => p.osm_id === place.osm_id);
  }

  save(place: OSMResult) {
    this.storage.addMyPlace(place);
  }
}
