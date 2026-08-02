import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StorageService } from '../service/storage.service';
import { OSMResultStored } from '../interface/Map';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-choose',
  templateUrl: './modal-choose.component.html',
  styleUrls: ['./modal-choose.component.scss'],
})
export class ModalChooseComponent implements OnInit {

  @Input() trigger: string;
  @Output() OSMResultChooseEmitter: EventEmitter<OSMResultStored> = new EventEmitter();

  public valueSearch: string = '';
  public placeResult: OSMResultStored[];
  public isStorageEmpty: boolean = true;

  public get querySearch(): string | null {
    return this.valueSearch;
  }

  public set querySearch(value: string) {
    this.valueSearch = value;
    this.placeResult = this.storage.getMyPlacesByName(this.valueSearch);
  }


  constructor(private storage: StorageService, private router: Router) { }

  ngOnInit() {}

  ngAfterViewChecked() {
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
