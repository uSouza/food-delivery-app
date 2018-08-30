import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {Menu} from "../../models/menu";
import {Ingredient} from "../../models/ingredient";
import {Price} from "../../models/price";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
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
  selected_price: Price;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public productService: ProductsProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
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
    this.selected_price = price;
  }

  goToAdditionalsPage() {
    if (this.selected_price != null) {
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
    } else {
      let toast = this.toastCtrl.create({
        message: 'É necessário selecionar um tamanho de marmita!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

}
