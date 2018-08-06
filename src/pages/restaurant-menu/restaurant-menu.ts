import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {AdditionalRestaurant} from "../../models/additional-restaurant";
import {RestaurantsProvider} from "../../providers/restaurants/restaurants";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-restaurant-menu',
  templateUrl: 'restaurant-menu.html',
})
export class RestaurantMenuPage {

  //additionals: AdditionalRestaurant[];
  authorization: Observable<Authorization>;
  restaurant: Restaurant;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.restaurant = navParams.data.restaurant;
  }

  ionViewDidLoad() {
    console.log(this.restaurant);
    //this.getAdditionalsRestaurant();
  }

  goBack() {
    this.navCtrl.pop();
  }

/*  getAdditionalsRestaurant() {
    this.authorization.subscribe(
      authorization => this.restaurantService.getAdditionalsFromRestaurant(authorization, this.navParams.data.restaurant).subscribe(
        additionals => this.additionals = additionals
      )
    );
  }*/

}
