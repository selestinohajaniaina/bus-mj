import { Component } from '@angular/core';
import {
  findBusByStopLabel,
  findBusByTwoStop,
  findStopAll,
  findBusByTwoStopLabel,
} from 'bus-mj';
import { Stop, Bus, SearchHistory } from '../interface/bus';
import { OSMResultStored } from '../interface/Map';
import { ToastController } from '@ionic/angular';
import { StorageService } from '../service/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  public firstBtnLabel: string = '';
  public secondBtnLabel: string = '';
  public firstData: OSMResultStored;
  public secondData: OSMResultStored;
  public allStop: Stop[];
  public result: Bus[] = [];
  public busResult: Bus[] = [];
  public depart: string = 'c';
  public fin: string = 'c';
  public departOld: string = 'c';
  public finOld: string = 'c';
  public isShowEmpty: boolean = false;
  public valueSearch: string | null;
  public valueSearch2: string | null;
  public stopFiltered: Stop[];
  public isShowStopHelp: boolean = false;
  public isShowStopHelp2: boolean = false;
  public busFilter: Bus[];

  public searchByStop: boolean = true;

  public get stop_1(): string | null {
    return this.valueSearch;
  }

  public set stop_1(value: string) {
    this.valueSearch = value;
    this.depart = this.valueSearch ? this.valueSearch : 'c';
    this.isShowStopHelp = true;
    this.stopFiltered = this.filterStop(this.valueSearch);
    if (this.valueSearch.length == 0 || this.stopFiltered.length == 0) {
      this.isShowStopHelp = false;
    }
  }

  public get stop_2(): string | null {
    return this.valueSearch2;
  }

  public set stop_2(value: string) {
    this.valueSearch2 = value;
    this.fin = this.valueSearch2 ? this.valueSearch2 : 'c';
    this.isShowStopHelp2 = true;
    this.stopFiltered = this.filterStop(this.valueSearch2);
    if (this.valueSearch2.length == 0 || this.stopFiltered.length == 0) {
      this.isShowStopHelp2 = false;
    }
  }

  constructor(
    private toastController: ToastController,
    private storage: StorageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.allStop = findStopAll().sort((a, b) =>
      a.label!.localeCompare(b.label!)
    );
  }

  findBus() {
    if (this.depart == 'c' || this.fin == 'c') {
      this.showToast(this.translate.instant('TAB2.FILL_ALL_FIELDS'));
    } else if (this.depart == this.fin) {
      this.showToast(this.translate.instant('TAB2.STOP_MUST_DIFFERENT'));
    } else {
      this.result = findBusByTwoStopLabel(this.depart, this.fin);
      // pour garder en mémoire les deux arrêts de la recherche précédente
      this.departOld = this.depart;
      this.finOld = this.fin;
      this.isShowEmpty = false;

      if (this.result.length == 0) {
        this.isShowEmpty = true;
        this.showToast(this.translate.instant('TAB2.NO_RESULTS'));
      } else {
        // ajout au hitorique de recherche
        const history: SearchHistory = {
          type: 'PLACE',
          id: this.storage.getHistoryId(),
          display_name: 'HISTORY.DISPLAY_NAME',
          key_words: [this.depart, this.fin],
          description: 'HISTORY.DESCRIPTION_STOP',
          saved_at: new Date().toISOString(),
        };
        this.storage.addHistory(history);
      }
    }
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

  choisir(label: string) {
    this.result = [];
    this.valueSearch = this.allStop.filter((e) => e.label == label)[0].label;
    this.depart = this.valueSearch ? this.valueSearch : 'c';
    this.isShowStopHelp = false;
    this.busFilter = findBusByStopLabel(label);
  }

  choisir2(label: string) {
    this.result = [];
    this.valueSearch2 = this.allStop.filter((e) => e.label == label)[0].label;
    this.fin = this.valueSearch2 ? this.valueSearch2 : 'c';
    this.isShowStopHelp2 = false;
    this.busFilter = findBusByStopLabel(label);
  }

  OSMResultChooseFirst(data: OSMResultStored) {
    this.firstBtnLabel = data.name;
    this.firstData = data;
  }

  OSMResultChooseSecond(data: OSMResultStored) {
    this.secondBtnLabel = data.name;
    this.secondData = data;
  }

  findBusByPlace() {
    if (
      this.firstData &&
      this.secondData &&
      this.firstData.osm_id == this.secondData.osm_id
    ) {
      this.showToast(this.translate.instant('TAB2.PLACE_MUST_DIFFERENT'));
    } else if (this.firstData && this.secondData) {
      this.SearchBusByOSMResult(this.firstData, this.secondData);
    } else {
      this.showToast(this.translate.instant('KEY_WORDS.FILL_ALL'));
    }
  }

  SearchBusByOSMResult(begin: OSMResultStored, end: OSMResultStored) {
    const stopNearBegin: Stop[] = begin.nearStop;
    const stopNearEnd: Stop[] = end.nearStop;

    const busFoundByNearStop: Bus[] = [];

    stopNearBegin.map((stopBegin: Stop) => {
      stopNearEnd.map((stopEnd: Stop) => {
        const busFound: Bus[] = findBusByTwoStopLabel(
          String(stopBegin.label),
          String(stopEnd.label)
        );
        busFoundByNearStop.push(...busFound);
      });
    });

    // const uniqueBus = Array.from(
    //   busFoundByNearStop
    //     .reduce((map, bus) => {
    //       const existing = map.get(bus.tags.name);

    //       if (!existing || bus.members.length < existing.members.length) {
    //         map.set(bus.tags.name, bus);
    //       }

    //       return map;
    //     }, new Map<string, Bus>())
    //     .values()
    // );
    // this.result = uniqueBus;

    this.result = busFoundByNearStop.sort((a, b) => {
      return a.members.length - b.members.length;
    });

    if (this.result.length === 0) {
      this.showToast(this.translate.instant('TAB2.NO_RESULTS'));
    } else {
      // ajout au hitorique de recherche
      const history: SearchHistory = {
        type: 'PLACE',
        id: this.storage.getHistoryId(),
        display_name: 'HISTORY.DISPLAY_NAME',
        key_words: [begin.name, end.name],
        description: 'HISTORY.DESCRIPTION_PLACE',
        saved_at: new Date().toISOString(),
      };
      this.storage.addHistory(history);
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 1500,
    });

    await toast.present();
  }
}
