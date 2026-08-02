import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { OSMResultStored } from '../interface/Map';
import { Router } from '@angular/router';
import { ViewWillEnter } from '@ionic/angular';

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

  constructor(private storage: StorageService, private router: Router) {}

  ngOnInit() {}

  loadPlaces() {
    this.placeResult = this.storage.getAllMyPlaces();
    this.isStorageEmpty = this.placeResult.length > 0 ? false : true;
  }

  goToSearch() {
    this.router.navigate(['/tabs/tab3']);
  }

  chooseOSMResult(element: OSMResultStored) {
    this.OSMResultChooseEmitter.emit(element);
  }
}
