import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { Restaurant } from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {

  restaurants: Restaurant[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    this.authenticationService.getGuestBearer()
      .subscribe(
        authorization =>
          this.restaurantService.getRestaurants(authorization)
            .subscribe(
              restaurants => this.restaurants = restaurants
            )
      );
  }

}
