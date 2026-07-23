import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-search',
  templateUrl: './modal-search.component.html',
  styleUrls: ['./modal-search.component.scss'],
})
export class ModalSearchComponent  implements OnInit {

  private url: string = environment.searchUrl;

  public querySearch: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {}

  find() {
    if(this.querySearch == '' || !this.querySearch) {
      return;
    } else {
      this.http.get(this.url, {
        params: {
          q: this.querySearch
        }
      })
      .subscribe((result: any) => {
        console.log("result: ", result);
        
      })
    }
  }

}
