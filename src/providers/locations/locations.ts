import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from '../../models/authorization';
import { Location } from '../../models/location';
import { api_url} from '../../config';
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
  endpoint = 'api/v1/clients_locations';

  addLocation(authorization: Authorization, location: Location): Observable<Location> {
    let data = {
      city: 'Toledo',
      state: 'Paraná',
      address: location.address,
      number: location.number,
      district_id: location.district,
      postal_code: '99999-999',
      observation: location.observation,
    };
    return this.http.post<Location>(api_url + this.endpoint, data, {
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
      district_id: location.district,
      postal_code: '99999-999',
      observation: location.observation,
    };
    return this.http.post<Location>(api_url + this.endpoint, data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization,
        'Content-Type': 'application/json'
      }
    });
  }

  getLocations(authorization: Authorization): Observable<Location[]> {
    return this.http.get<Location[]>(api_url + this.endpoint,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

  getLocationsAccessToken(access_token: any): Observable<Location[]> {
    return this.http.get<Location[]>(api_url + this.endpoint,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      });
  }

  deleteLocation(access_token: any, location: any) {
    return this.http.delete(api_url + this.endpoint + '/' + location,
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
      district_id: location.district,
      postal_code: '99999-999',
      observation: location.observation,
    };
    return this.http.put<Location>(api_url + this.endpoint + '/' + location.id, data,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      })
  }

  getCities(access_token: any) {
    return this.http.get<any[]>(api_url + 'api/v1/cities',
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      });
  }

  getDistricts(access_token: any, city_id: any) {
    return this.http.get<any[]>(api_url + 'api/v1/districts/city/' + city_id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      });
  }

}
