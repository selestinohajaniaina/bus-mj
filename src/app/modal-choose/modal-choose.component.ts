import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { MapMarker, OSMResult, OSMResultStored } from '../interface/Map';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { LocalisationService } from '../service/localisation.service';
import { Stop } from '../interface/bus';
import * as turf from '@turf/turf';
import { findStopAll } from 'bus-mj';

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

  public get querySearch(): string | null {
    return this.valueSearch;
  }

  set querySearch(value: string) {
    this.valueSearch = value;
    if (!value.trim()) {
      this.loadPlaces();
    } else {
      this.placeResult = this.storage.getMyPlacesByName(value);

      const stopResult = this.filterStop(value);
      const OsmStopResult = this.stopToOsmResultStored(stopResult);
      OsmStopResult.map((e: OSMResultStored) => this.placeResult.push(e));
    }
  }

  constructor(
    private storage: StorageService,
    private router: Router,
    private localisation: LocalisationService
  ) {}

  ngOnInit() {
    this.allStop = findStopAll();
  }

  loadPlaces() {
    this.placeResult = this.storage.getAllMyPlaces();
    if(this.placeResult.length > 0) {
      this.isStorageEmpty = false;
    } else {
      this.isStorageEmpty = true;
      const stopExample: Stop[] = this.allStop.slice(0, 10);
      this.placeResult = this.stopToOsmResultStored(stopExample);
    }
    const myP = this.localisation.getMyPostion();
    if (myP)
      this.myPositionToOSMResult({
        label: 'Ma position actuel',
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
      display_name: 'Ma position actuel',
      name: 'Ma position actuel',
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

}