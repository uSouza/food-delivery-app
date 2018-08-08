import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Menu} from "../../models/menu";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Ingredient} from "../../models/ingredient";
import {IngredientsProvider} from "../../providers/ingredients/ingredients";

/**
 * Generated class for the SelectProductIngredientsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-product-ingredients',
  templateUrl: 'select-product-ingredients.html',
})
export class SelectProductIngredientsPage {

  menu: Menu;
  ingredients: Ingredient[];
  authorization: Observable<Authorization>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public ingredientsService: IngredientsProvider) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
  }

  ionViewDidLoad() {
    this.getIngredients();
  }

  getIngredients() {
    this.authorization.subscribe(
      authorization => this.ingredientsService.getIngredientsByMenu(authorization, this.menu).subscribe(
        ingredients => this.ingredients = ingredients
      )
    );
  }
}
