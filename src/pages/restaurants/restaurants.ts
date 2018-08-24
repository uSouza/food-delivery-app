import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { Restaurant } from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import {RestaurantMenuPage} from "../restaurant-menu/restaurant-menu";
import { LoadingController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {

  restaurants: Restaurant[];
  authorizationService: Observable<Authorization>;
  authorization: Authorization;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider,
              public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    this.authenticationService
      .getGuestBearer()
      .subscribe(
        authorization => {
          this.setAuthorization(authorization)
        }
      );
  }

  setAuthorization(authorization: Authorization) {
    this.authorization = authorization;
    this.getRestaurants();
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }

  getRestaurants() {
    this.restaurantService.getRestaurants(this.authorization).subscribe(
        restaurants => this.restaurants = restaurants
    );
    this.showLoading();
  }

  getRestaurantsByName(ev) {

    var val = ev.target.value;

    if (val && val.trim() != '') {
      this.restaurants = this.restaurants.filter((restaurant) => {
        return (restaurant.fantasy_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.getRestaurants();
    }
  }

  goToRestaurantMenuPage(restaurant: Restaurant) {
    this.showLoading();
    this.navCtrl.push(RestaurantMenuPage, {restaurant: restaurant, authorization: this.authorization});
  }

}
