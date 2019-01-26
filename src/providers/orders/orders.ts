import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Authorization } from '../../models/authorization';
import { Order } from '../../models/order';
import { Observable } from 'rxjs/Observable';
import { api_url} from '../../config';

/*
  Generated class for the OrdersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrdersProvider {

  constructor(public http: HttpClient) {
  }

  endpoint = 'api/v1/orders';

  addOrder(authorization: Authorization, order: Order): Observable<Order> {
    let data = {
      price: order.price,
      observation: order.observation,
      receive_at: order.receive_at,
      company_id: order.company_id,
      freight_id: order.freight_id,
      deliver: order.deliver,
      status_id: order.status_id,
      form_payment_id: order.form_payment_id,
      products_ids: order.products_ids,
      location_id: order.location_id,
      time_delivery: order.time_delivery,
    };
    return this.http.post<Order>(api_url + this.endpoint, data,{
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization.access_token,
        'Content-Type': 'application/json'
      }
    });
  }

  getOrders(access_token: any, client_id: any): Observable<Order[]> {
    return this.http.get<Order[]>(api_url + this.endpoint + '/client/' + client_id,
      {headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + access_token
              }
      });
  }

  cancelOrder(access_token: any, order: any): Observable<Order> {
    return this.http.get<Order>(api_url + this.endpoint + '/cancel/' + order.id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      });
  }

  now(access_token: any) {
    return this.http.get<any>(api_url + 'api/now',
    {headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + access_token
            }
    });
  }
}
