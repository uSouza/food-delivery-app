import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { Restaurant } from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {

  restaurants: Restaurant[];
  authorization: Observable<Authorization>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider) {
    this.authorization = this.authenticationService.getGuestBearer();
  }

  ionViewDidLoad() {
    this.getRestaurants();
  }

  getRestaurants() {
    this.authorization.subscribe(
      authorization => this.restaurantService.getRestaurants(authorization).subscribe(
        restaurants => this.restaurants = restaurants
      )
    );
  }

  initializeRestaurants() {

  }

  getRestaurantsByName(ev) {

    var val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.restaurants = this.restaurants.filter((restaurant) => {
        return (restaurant.fantasy_name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.getRestaurants();
    }

  }
}
/*
export class ModalFilterPage {
  character;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) { }


  dismiss() {
    this.viewCtrl.dismiss();
  }

}*/
