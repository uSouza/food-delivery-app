import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from "../../models/authorization";
import { Observable } from "rxjs/Observable";
import { UserPandeco } from '../../models/user-pandeco';
import { api_url, client_id, client_secret} from '../../config';

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  constructor(public http: HttpClient) {

  }
  endpoint = 'oauth/token';

  getGuestBearer(): Observable<Authorization> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let data = {
      grant_type: 'password',
      client_id: client_id,
      client_secret: client_secret,
      username: 'guest@pandeco.com.br',
      password: 'pandeco2018',
      scope: ''
    };
    return this.http.post<Authorization>(api_url + this.endpoint, data, {headers: headers});
  }

  getClientBearer(user: UserPandeco) {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    let data = {
      grant_type: 'password',
      client_id: client_id,
      client_secret: client_secret,
      username: user.email,
      password: user.password,
      scope: ''
    };
    return this.http.post<Authorization>(api_url + this.endpoint, data, {headers: headers});
  }

  getMinVersion(access_token) {
    return this.http.get<any>(api_url + 'api/min_version',
    {headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + access_token
            }
    });
  }

}
