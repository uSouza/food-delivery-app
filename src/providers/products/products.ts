import {HttpClient} from '@angular/common/http';
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

  url_api = 'https://api.pandeco.com.br/api/v1/';
  endpoint = 'products';

  addProduct(authorization: Authorization, product: Product): Observable<Product> {
    let data = {
      menu_id: product.menu_id,
      price_id: product.price_id,
      description: product.description,
      observation: 'nobody',
      ingredients_ids: product.ingredients_ids,
      additionals: product.additionals
    };
    return this.http.post<Product>(this.url_api + this.endpoint, data,{
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + authorization.access_token,
        'Content-Type': 'application/json'
      }
    });
  }

  getProduct(access_token: any, product_id: any) {
    return this.http.get<Product>(this.url_api + this.endpoint + '/' + product_id,
      {headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + access_token
              }
      });
    }

}
