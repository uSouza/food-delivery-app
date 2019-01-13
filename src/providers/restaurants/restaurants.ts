import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Restaurant } from "../../models/restaurant";
import { api_url} from '../../config';
import {Authorization} from "../../models/authorization";

@Injectable()
export class RestaurantsProvider {

  constructor(public http: HttpClient) {

  }
  endpoint = 'api/v1/companies';

  getRestaurants (authorization: Authorization): Observable<Restaurant[]> {
      return this.http.get<Restaurant[]>(api_url + this.endpoint + '/available',
        {headers: {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + authorization.access_token
                }
        });
  }

  getRestaurantsByCity(authorization: Authorization, city: any): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(api_url + this.endpoint + '/available/city/' + city.id,
      {headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authorization.access_token
              }
      });
}

}
