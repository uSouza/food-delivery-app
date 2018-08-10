import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {Menu} from "../../models/menu";
import {Ingredient} from "../../models/ingredient";
import {Price} from "../../models/price";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {IngredientsProvider} from "../../providers/ingredients/ingredients";
import {Observable} from "rxjs/Observable";
import {Authorization} from "../../models/authorization";

/**
 * Generated class for the SelectProductSizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-product-size',
  templateUrl: 'select-product-size.html',
})
export class SelectProductSizePage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  authorization: Observable<Authorization>;
  value: number;
  additional_value: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public alertCtrl: AlertController) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseInt(navParams.data.additional_value);
    this.value = 0;
  }

  ionViewDidLoad() {
  }

  updateValue(price: Price) {
    this.value = parseInt(price.price.toString());
  }

}
