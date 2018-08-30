import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from '../../models/authorization';
import { Location } from '../../models/location';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the LocationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LocationsProvider {

  constructor(public http: HttpClient) {
  }
  url_api = 'http://api.pandeco.com.br/api/v1/';
  endpoint = 'clients_locations';

  addLocation(authorization: Authorization, location: Location): Observable<Location> {
    let data = {
      city: 'Toledo',
      state: 'Paraná',
      address: location.address,
      number: location.number,
      district: location.district,
      postal_code: '99999-999',
      observation: location.observation,
    };
    return this.http.post<Location>(this.url_api + this.endpoint, data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization.access_token,
        'Content-Type': 'application/json'
      }
    });
  }

  getLocations(authorization: Authorization): Observable<Location[]> {
    return this.http.get<Location[]>(this.url_api + this.endpoint,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

}
