import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import { Restaurant } from "../../models/restaurant";
import {Authorization} from "../../models/authorization";

@Injectable()
export class RestaurantsProvider {

  constructor(public http: HttpClient) {

  }

  getRestaurants (authorization: Authorization): Observable<Restaurant[]> {
      return this.http.get<Restaurant[]>('http://localhost:8000/api/v1/companies',
        {headers: {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer ' + authorization.access_token
                }
        });
  }

}
