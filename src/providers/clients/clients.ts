import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from '../../models/authorization';
import { Client } from '../../models/client';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';
import { api_url} from '../../config';

/*
  Generated class for the ClientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientsProvider {

  constructor(public http: HttpClient) {
  }

  endpoint = 'api/v1/clients';

  addClient(authorization: Authorization, user: UserPandeco, cell_phone: string, phone: string): Observable<Client> {
    let data = {
      user_id: user.id,
      name: user.name,
      phone: phone,
      cell_phone: cell_phone
    };

    return this.http.post<Client>(api_url + this.endpoint, data, {
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

    return this.http.put<Location>(api_url + this.endpoint + '/' + client.id, data,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      })
  }
}
