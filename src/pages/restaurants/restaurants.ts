import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, PopoverController } from 'ionic-angular';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { Restaurant } from "../../models/restaurant";
import { AuthenticationProvider } from "../../providers/authentication/authentication";
import { Authorization } from "../../models/authorization";
import { Observable } from "rxjs/Observable";
import { RestaurantMenuPage } from "../restaurant-menu/restaurant-menu";
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DatePipe } from '@angular/common';
import { PopoverRestaurantPage } from './popover-restaurant/popover-restaurant';


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
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public restaurantService: RestaurantsProvider,
              public authenticationService: AuthenticationProvider,
              private storage: Storage,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public platform: Platform,
              public datepipe: DatePipe,
              public popoverCtrl: PopoverController
            ) {
  }

  ionViewDidLoad() {
    this.authenticationService
      .getGuestBearer()
      .subscribe(
        authorization => {
          this.setAuthorization(authorization)
        },
        err => {
          this.exitApp()
        }
      );
      this.storage.get('token').then((val) => {
        if(val != null) {
          this.logged = true;
        }
      });
  }

  exitApp() {
    const confirm = this.alertCtrl.create({
      title: 'Falha com a conexão com a internet',
      message: 'Verifique a conexão com a internet!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.platform.exitApp();
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

  getRestaurants() {
    this.loader.present();
    this.restaurantService.getRestaurants(this.authorization).subscribe(
        restaurants => this.setRestaurants(restaurants)
    );
  }

  setRestaurants(restaurants) {
    this.loader.dismiss();
    if (restaurants.length > 0) {
      restaurants.forEach(r => {
        let addHour = parseInt(r.open_at.split(':')[0]) + 1;
        r.open_at = addHour + ':' + r.open_at.split(':')[1] + ':' + r.open_at.split(':')[2];
        r.open_at = this.datepipe.transform('2018-01-01 ' + r.open_at, 'H:mm');
      });
      this.restaurants = restaurants;
    }
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
    this.navCtrl.push(RestaurantMenuPage, {restaurant: restaurant, authorization: this.authorization});
  }

  presentPopover(event) {
    let popover = this.popoverCtrl.create(PopoverRestaurantPage);
    popover.present({
      ev: event
    });
  }

}
