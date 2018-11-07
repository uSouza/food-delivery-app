import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from '../../models/authorization';
import { Client } from '../../models/client';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';

/*
  Generated class for the ClientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientsProvider {

  constructor(public http: HttpClient) {
  }

  url_api = 'http://api.pandeco.com.br/api/v1/';
  endpoint = 'clients';

  addClient(authorization: Authorization, user: UserPandeco, cell_phone: string, phone: string): Observable<Client> {
    let data = {
      user_id: user.id,
      name: user.name,
      phone: phone,
      cell_phone: cell_phone
    };

    return this.http.post<Client>(this.url_api + this.endpoint, data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization.access_token,
        'Content-Type': 'application/json'
      }
    });
  }

  updateClient(access_token: any, client: any): Observable<any> {
    let data = {
      user_id: client.user_id,
      name: client.name,
      phone: client.phone,
      cell_phone: client.cell_phone
    };

    return this.http.put<Location>(this.url_api + this.endpoint + '/' + client.id, data,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      })
  }
}
