import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Menu} from "../../models/menu";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import {Restaurant} from "../../models/restaurant";
import { api_url} from '../../config';

/*
  Generated class for the MenusProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MenusProvider {

  constructor(public http: HttpClient) {
  }

  endpoint = 'api/v1/menus/company/';

  getMenuByRestaurant (authorization: Authorization, restaurant: Restaurant): Observable<Menu[]> {
    return this.http.get<Menu[]>(api_url + this.endpoint + restaurant.id,
      {headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

}
