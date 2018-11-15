import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Restaurant } from "../../models/restaurant";
import {Authorization} from "../../models/authorization";

@Injectable()
export class RestaurantsProvider {

  constructor(public http: HttpClient) {

  }
  url_api = 'https://api.pandeco.com.br/api/v1/';
  endpoint = 'companies';

  getRestaurants (authorization: Authorization): Observable<Restaurant[]> {
      return this.http.get<Restaurant[]>(this.url_api + this.endpoint + '/available',
        {headers: {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + authorization.access_token
                }
        });
  }

}
