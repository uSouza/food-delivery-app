import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { AdditionalRestaurant } from '../../models/additional-restaurant';

/**
 * Generated class for the AdditionalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-additionals',
  templateUrl: 'additionals.html',
})
export class AdditionalsPage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  product: Product;
  clientAuthorization: Authorization;
  value: any;
  additional_value: any;
  selected_price: number;
  user: UserPandeco;
  additionals: AdditionalRestaurant[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restauranteService: RestaurantsProvider) {
    this.clientAuthorization = this.navParams.data.clientAuthorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.value = parseFloat(navParams.data.value);
    this.selected_price = navParams.data.selected_price;
    this.user = navParams.data.user;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.restauranteService
      .getAdditionalsFromRestaurant(this.clientAuthorization, this.restaurant)
      .subscribe(
        additionals => {
          this.updateAdditionals(additionals)
        }
      )
  }

  updateAdditionals(adds: AdditionalRestaurant[]) {
    adds.forEach((add) => {
      add.quantity = 0;
    });
    this.additionals = adds;
  }

  addAdd(add: AdditionalRestaurant) {
    add.quantity += 1;
    this.value += parseFloat(add.value.toString());
  }

  rmAdd(add: AdditionalRestaurant) {
    add.quantity -= 1;
    this.value -= parseFloat(add.value.toString());
  }

}
