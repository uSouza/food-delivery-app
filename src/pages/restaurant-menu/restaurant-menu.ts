import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {MenusProvider} from "../../providers/menus/menus";
import {Authorization} from "../../models/authorization";
import {Menu} from "../../models/menu";
import {SelectProductIngredientsPage} from "../select-product-ingredients/select-product-ingredients";
import { SelectProductSizePage } from '../select-product-size/select-product-size';

@IonicPage()
@Component({
  selector: 'page-restaurant-menu',
  templateUrl: 'restaurant-menu.html',
})
export class RestaurantMenuPage {

  menus: Menu[];
  authorization: Authorization;
  restaurant: Restaurant;
  minPrice: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menuService: MenusProvider,
              public authenticationService: AuthenticationProvider,
              public loadingCtrl: LoadingController) {
    this.authorization = navParams.data.authorization;
    this.restaurant = navParams.data.restaurant;
  }

  ionViewDidLoad() {
    this.getMenusByRestaurant();
  }

  goBack() {
    this.navCtrl.pop();
  }

  getMenusByRestaurant() {
    this.menuService.getMenuByRestaurant(this.authorization, this.restaurant).subscribe(
        menus => this.menus = menus
    );
  }

  goToProductSizePage(menu: Menu) {
    this.navCtrl.push(SelectProductSizePage, {
      menu: menu,
      restaurant: this.restaurant,
      authorization: this.authorization
    });
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }


}
