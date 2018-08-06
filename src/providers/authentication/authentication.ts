import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from "../../models/authorization";
import {Observable} from "rxjs/Observable";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  constructor(public http: HttpClient) {

  }
  url_api = 'http://localhost:8000/';
  endpoint = 'oauth/token';

  getGuestBearer(): Observable<Authorization> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let data = {
      grant_type: 'password',
      client_id: 1,
      client_secret: '0gOxlBjxcY7N9e1vIv1hFzpU7UoenFR6KIEkYF0Z',
      username: 'guest@pandeco.com.br',
      password: 'pandeco2018',
      scope: ''
    };
    return this.http.post<Authorization>(this.url_api + this.endpoint, data, {headers: headers});
  }

}
