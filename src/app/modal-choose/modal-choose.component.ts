import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { MapMarker, OSMResultStored } from '../interface/Map';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';
import { LocalisationService } from '../service/localisation.service';
import { Stop } from '../interface/bus';

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

  constructor(private storage: StorageService, private router: Router, private localisation: LocalisationService) {}

  ngOnInit() {}

  loadPlaces() {
    this.placeResult = this.storage.getAllMyPlaces();
    this.isStorageEmpty = this.placeResult.length > 0 ? false : true;
    const myP = this.localisation.getMyPostion();
    if (myP) this.myPositionToOSMResult( {label: "Ma position actuel", longitude: myP.longitude, latitude: myP.latitude} );
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
        saved_at: new Date().toLocaleString()
    }
  }
}
