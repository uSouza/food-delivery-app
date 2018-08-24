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
import { LoginPage } from '../login/login';

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
  authorization: Authorization;
  value: any;
  selected_price: number;
  additionals: AdditionalRestaurant[] = [];
  selected_additionals: AdditionalRestaurant[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restauranteService: RestaurantsProvider) {
    this.authorization = this.navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = parseFloat(navParams.data.value);
    this.selected_price = navParams.data.selected_price;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.restauranteService
      .getAdditionalsFromRestaurant(this.authorization, this.restaurant)
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
    if (add.quantity > 0) {
      add.quantity -= 1;
      this.value -= parseFloat(add.value.toString());
    }
  }

  getSelectedAdditionals() {
    this.additionals.forEach((add) => {
      if (add.quantity > 0) {
        this.selected_additionals.push(add);
      }
    });
  }

  goToLoginPage() {
    this.getSelectedAdditionals();
    this.navCtrl.push(LoginPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals
    })
  }

}
