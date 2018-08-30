import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import { Product } from "../../models/product";
/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {

  constructor(public http: HttpClient) {
  }

  url_api = 'http://api.pandeco.com.br/api/v1/';
  endpoint = 'products/';

  addProduct(authorization: Authorization, product: Product): Observable<Product> {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + authorization.access_token);

    let data = {
      menu_id: product.menu_id,
      price_id: product.price_id,
      description: 'MARMITA',
      observation: 'nobody',
      ingredients_ids: product.ingredients_ids
    };
    return this.http.post<Product>(this.url_api + this.endpoint, data, {headers: headers});
  }

}
