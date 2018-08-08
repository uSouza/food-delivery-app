import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Authorization} from "../../models/authorization";
import {Menu} from "../../models/menu";
import {Ingredient} from "../../models/ingredient";

/*
  Generated class for the IngredientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IngredientsProvider {

  constructor(public http: HttpClient) {
  }

  url_api = 'http://localhost:8000/api/v1/';
  endpoint = 'ingredient_groups/menu/';

  getIngredientsByMenu (authorization: Authorization, menu: Menu): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(this.url_api + this.endpoint + menu.id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

}
