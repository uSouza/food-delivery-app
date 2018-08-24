import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {Menu} from "../../models/menu";
import {Ingredient} from "../../models/ingredient";
import {Price} from "../../models/price";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {IngredientsProvider} from "../../providers/ingredients/ingredients";
import {Observable} from "rxjs/Observable";
import {Authorization} from "../../models/authorization";
import {Product} from "../../models/product";
import {ProductsProvider} from "../../providers/products/products";
import { AdditionalsPage } from '../additionals/additionals';
import { AdditionalRestaurant } from '../../models/additional-restaurant';

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
  selected_additionals: AdditionalRestaurant[];
  product: Product;
  authorization: Authorization;
  value: any = 0;
  additional_value: any;
  selected_price: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public productService: ProductsProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.selected_additionals = navParams.data.selected_additionals;
  }

  ionViewDidLoad() {
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }

  updateValue(price: Price) {
    this.value = parseFloat(price.price);
    this.selected_price = price.id;
  }

  goToAdditionalsPage() {
    this.showLoading();
    this.navCtrl.push(AdditionalsPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value + this.additional_value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals
    });
  }

}
