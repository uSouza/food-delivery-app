import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Authorization} from "../../models/authorization";
import {Menu} from "../../models/menu";
import {IngredientGroup} from "../../models/ingredient-group";
import { api_url} from '../../config';

/*
  Generated class for the IngredientsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class IngredientsProvider {

  constructor(public http: HttpClient) {
  }

  endpoint = 'api/v1/ingredient_groups/menu/';

  getIngredientsGroupByMenu (authorization: Authorization, menu: Menu): Observable<IngredientGroup[]> {
    return this.http.get<IngredientGroup[]>(api_url + this.endpoint + menu.id,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + authorization.access_token
        }
      });
  }

}
