import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import { Product } from "../../models/product";
import {Restaurant} from "../../models/restaurant";
/*
  Generated class for the ProductsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductsProvider {

  constructor(public http: HttpClient) {
  }

  url_api = 'http://localhost:8000/api/v1/';
  endpoint = 'products/';

}
