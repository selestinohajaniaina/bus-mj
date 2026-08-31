import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MapMarker, OSMResult } from '../interface/Map';
import { SearchHistory, Stop } from '../interface/bus';
import { Coordinates } from '../interface/Map';
import * as turf from '@turf/turf';
import { StorageService } from '../service/storage.service';
import { LocalisationService } from '../service/localisation.service';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent implements OnInit {
  @Input() allStop: Stop[];
  @Input() myPosition: MapMarker;

  @Output() osmDataEmit: EventEmitter<OSMResult> = new EventEmitter();

  private url: string = environment.searchUrl;

  public querySearch: string = '';
  public chargeShow: boolean = false;
  public placeResult: OSMResult[];
  public placeResultLength: number = 0;

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private localisation: LocalisationService,
    private toastController: ToastController,
    private translate: TranslateService
  ) {}

  ngOnInit() {}

  find() {
    if (this.querySearch == '' || !this.querySearch) {
      return;
    } else {
      this.chargeShow = true;
      this.placeResult = [];
      this.placeResultLength = 0;
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
              const distance = this.myPosition ? this.getDistance(
                turf.point([
                  this.myPosition.longitude,
                  this.myPosition.latitude,
                ]),
                turf.point([Number(e.lon), Number(e.lat)])
              ) : 0;
              const nearStop = this.getNearsStop({
                longitude: Number(e.lon),
                latitude: Number(e.lat),
              });
              const nearStopLength = nearStop.length;
              const elementOSMResult = {
                ...e,
                distance,
                display_distance:
                  this.localisation.getDisplayDistance(distance),
                nearStop,
                nearStopLength,
              };
              this.placeResult.push(elementOSMResult);
              if(!this.isSaved(elementOSMResult)) {
                this.save(elementOSMResult, false);
              }
            });

            if (result.length > 0) {
              // ajout au hitorique de recherche
              const history: SearchHistory = {
                type: 'SEARCH',
                id: this.storage.getHistoryId(),
                display_name: 'HISTORY.SEARCH_DISPLAY_NAME',
                description: 'HISTORY.SEARCH_DESCRIPTION_PLACE',
                key_words: [this.querySearch],
                saved_at: new Date().toISOString(),
              };
              this.storage.addHistory(history);
            }

            const stopResult = this.filterStop(this.querySearch);
            const OsmStopResult = this.stopToOsmResult(stopResult);
            OsmStopResult.map((e: OSMResult) => this.placeResult.push(e));
            this.placeResultLength = this.placeResult.length;
          },
          error: (err: any) => {
            this.chargeShow = false;
            const stopResult = this.filterStop(this.querySearch);
            const OsmStopResult = this.stopToOsmResult(stopResult);
            OsmStopResult.map((e: OSMResult) => this.placeResult.push(e));
            this.placeResultLength = this.placeResult.length;
            this.showToast(this.translate.instant('MODAL_SEARCH.NO_INTERNET'));
          },
        });
    }
  }

  isSaved(place: OSMResult): boolean {
    return this.storage.getAllMyPlaces().some((p) => p.osm_id === place.osm_id);
  }

  save(place: OSMResult, isAlerted: boolean = true) {
    this.storage.addMyPlace(place);
    if(isAlerted) this.showToast(
      this.translate.instant('MODAL_SEARCH.SAVE', { name: place.name })
    );
  }

  unSave(place: OSMResult) {
    this.storage.removeMyPlace(place.osm_id);
    this.showToast(
      this.translate.instant('MODAL_SEARCH.UNSAVE', { name: place.name })
    );
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

  getDistance(point1: turf.Coord, point2: turf.Coord) {
    return turf.distance(point1, point2, { units: 'meters' });
  }

  stopToOsmResult(stop: Stop[]): OSMResult[] {
    return stop.map((st) => {
      const distance = this.myPosition ? this.getDistance(
        turf.point([this.myPosition.longitude, this.myPosition.latitude]),
        turf.point([st.lon, st.lat])
      ) : 0;
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

  afficherSurCarte(osmData: OSMResult) {
    this.osmDataEmit.emit(osmData);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
    });

    await toast.present();
  }
}
