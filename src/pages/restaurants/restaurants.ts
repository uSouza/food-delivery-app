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
      this.restaurants = restaurants;
    } else {
      const confirm = this.alertCtrl.create({
        title: 'Obrigado por instalar o Pandeco!',
        message: 'Não fique ancioso, estamos buscando os melhores restaurantes para você. Os cardápios estarão disponíveis a partir do dia 05/11/2018. Fique ligado em nossas notificações!',
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
