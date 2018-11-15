import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Menu} from "../../models/menu";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import {Restaurant} from "../../models/restaurant";

/*
  Generated class for the MenusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MenusProvider {

  constructor(public http: HttpClient) {
  }

  url_api = 'https://api.pandeco.com.br/api/v1/';
  endpoint = 'menus/company/';

  getMenuByRestaurant (authorization: Authorization, restaurant: Restaurant): Observable<Menu[]> {
    return this.http.get<Menu[]>(this.url_api + this.endpoint + restaurant.id,
      {headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

}
