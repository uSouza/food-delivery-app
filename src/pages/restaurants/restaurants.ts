import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { Restaurant } from "../../models/restaurant";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { Authorization } from "../../models/authorization";
import { Observable } from "rxjs/Observable";
import { RestaurantMenuPage } from "../restaurant-menu/restaurant-menu";
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-restaurants',
  templateUrl: 'restaurants.html',
})
export class RestaurantsPage {

  restaurants: Restaurant[];
  authorizationService: Observable<Authorization>;
  authorization: Authorization;
  logged: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider,
              private storage: Storage,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
            ) {
  }

  ionViewDidLoad() {
    this.authenticationService
      .getGuestBearer()
      .subscribe(
        authorization => {
          this.setAuthorization(authorization)
        }
      );
      this.storage.get('token').then((val) => {
        if(val != null) {
          this.logged = true;
        }
      });
  }

  logoff() {
    const confirm = this.alertCtrl.create({
      title: 'Deseja mesmo sair do Pandeco?',
      message: '',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.storage.set('token', null);
            this.logged = false;
          }
        }
      ]
    });
    confirm.present();
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
