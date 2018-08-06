import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Restaurant } from "../../models/restaurant";
import {Authorization} from "../../models/authorization";
import {AdditionalRestaurant} from "../../models/additional-restaurant";

@Injectable()
export class RestaurantsProvider {

  constructor(public http: HttpClient) {

  }
  url_api = 'http://localhost:8000/api/v1/';
  endpoint = 'companies';

  getRestaurants (authorization: Authorization): Observable<Restaurant[]> {
      return this.http.get<Restaurant[]>(this.url_api + this.endpoint,
        {headers: {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + authorization.access_token
                }
        });
  }

  getAdditionalsFromRestaurant(authorization: Authorization, restaurant: Restaurant): Observable<AdditionalRestaurant[]> {
    return this.http.get<AdditionalRestaurant[]>(this.url_api + 'additionals_company/' + restaurant.id,
      {headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

}
