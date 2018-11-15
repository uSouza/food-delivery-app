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
  url_api = 'https://api.pandeco.com.br/api/v1/';
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

  addLocationAccessToken(authorization: any, location: Location): Observable<Location> {
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
        'Authorization': 'Bearer ' + authorization,
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

  getLocationsAccessToken(access_token: any): Observable<Location[]> {
    return this.http.get<Location[]>(this.url_api + this.endpoint,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      });
  }

  deleteLocation(access_token: any, location: any) {
    return this.http.delete(this.url_api + this.endpoint + '/' + location,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      })
  }

  updateLocation(access_token: any, location: Location): Observable<Location> {
    let data = {
      city: 'Toledo',
      state: 'Paraná',
      address: location.address,
      number: location.number,
      district: location.district,
      postal_code: '99999-999',
      observation: location.observation,
    };
    return this.http.put<Location>(this.url_api + this.endpoint + '/' + location.id, data,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      })
  }
}
