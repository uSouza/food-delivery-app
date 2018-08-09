import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {MenusProvider} from "../../providers/menus/menus";
import {Authorization} from "../../models/authorization";
import {Menu} from "../../models/menu";
import {Observable} from "rxjs/Observable";
import {SelectProductIngredientsPage} from "../select-product-ingredients/select-product-ingredients";

@IonicPage()
@Component({
  selector: 'page-restaurant-menu',
  templateUrl: 'restaurant-menu.html',
})
export class RestaurantMenuPage {

  menus: Menu[];
  authorization: Observable<Authorization>;
  restaurant: Restaurant;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              //public restaurantService: RestaurantsProvider,
              public menuService: MenusProvider,
              public authenticationService: AuthenticationProvider) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.restaurant = navParams.data.restaurant;
  }

  ionViewDidLoad() {
    this.getMenusByRestaurant();
  }

  goBack() {
    this.navCtrl.pop();
  }

  getMenusByRestaurant() {
    this.authorization.subscribe(
      authorization => this.menuService.getMenuByRestaurant(authorization, this.restaurant).subscribe(
        menus => this.menus = menus
      )
    );
  }

  goToIngredientsProductPage(menu: Menu) {
    this.navCtrl.push(SelectProductIngredientsPage, {menu: menu, restaurant: this.restaurant});
  }


}
