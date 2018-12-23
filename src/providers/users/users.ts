import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';
import {Authorization} from "../../models/authorization";
import { api_url} from '../../config';

/*
  Generated class for the UsersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsersProvider {

  constructor(public http: HttpClient) {
  }
  endpoint = 'api/v1/users';

  addUser(authorization: Authorization, email: string, name: string, uid: string): Observable<UserPandeco> {
    let data = {
      email: email,
      type: 'client',
      name: name,
      password: uid
    };
    return this.http.post<UserPandeco>(api_url + this.endpoint, data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization.access_token,
        'Content-Type': 'application/json'
      }
    });
  }

  setOneSignalId(access_token: any, player_id: any) {
    let data = {
      player_id: player_id
    };
    return this.http.post<any>(api_url + this.endpoint + '/one_signal', data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      }
    });
  }

  findUserByEmail(authorization: Authorization, email: string) {
    return this.http.get<UserPandeco>(api_url + this.endpoint + '/' + email,
      {headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + authorization.access_token
              }
      });
  }

  getUser(access_token: any) {
    return this.http.get<UserPandeco>(api_url + this.endpoint + '/me',
    {headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + access_token
            }
    });
  }

  reset(access_token: any, email: any) {
    let data = {
      email: email
    };
    return this.http.post<any>(api_url + 'api/v1/password/create' , data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
      }
    });
  }

}
