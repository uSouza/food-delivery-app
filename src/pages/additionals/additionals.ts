import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { RestaurantsProvider } from '../../providers/restaurants/restaurants';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { OrderCompletionPage } from '../order-completion/order-completion';
import { UsersProvider } from '../../providers/users/users';
import { Price } from '../../models/price';
import { RestaurantsPage } from '../restaurants/restaurants';

/**
 * Generated class for the AdditionalsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-additionals',
  templateUrl: 'additionals.html',
})
export class AdditionalsPage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  product: Product;
  authorization: Authorization;
  value: any;
  selected_price: Price;
  additionals: AdditionalRestaurant[] = [];
  drinks: AdditionalRestaurant[] = [];
  selected_additionals: AdditionalRestaurant[] = [];
  clientAuthorization = {
    access_token: ''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private restauranteService: RestaurantsProvider,
              private storage: Storage,
              private userService: UsersProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,) {
    this.authorization = this.navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = parseFloat(navParams.data.value);
    this.selected_price = navParams.data.selected_price
  }

  ionViewDidLoad() {
    this.showLoading();
    this.restauranteService
      .getAdditionalsFromRestaurant(this.authorization, this.restaurant)
      .subscribe(
        additionals => {
          this.updateAdditionals(additionals)
        }
      )
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 3000
    });
    loader.present();
  }

  updateAdditionals(adds: AdditionalRestaurant[]) {
    console.log(adds);
    adds.forEach((add) => {
      add.quantity = 0;
      if (add.isDrink) {
        this.drinks.push(add);
      } else {
        this.additionals.push(add);
      }
    });
  }

  addAdd(add: AdditionalRestaurant) {
    add.quantity += 1;
    this.value += parseFloat(add.value.toString());
  }

  rmAdd(add: AdditionalRestaurant) {
    if (add.quantity > 0) {
      add.quantity -= 1;
      this.value -= parseFloat(add.value.toString());
    }
  }

  getSelectedAdditionals() {
    this.additionals.forEach((add) => {
      if (add.quantity > 0) {
        this.selected_additionals.push(add);
      }
    });
    this.drinks.forEach((add) => {
      if (add.quantity > 0) {
        this.selected_additionals.push(add);
      }
    });
  }

  goToNextPage() {
    this.getSelectedAdditionals();
    this.storage.get('token').then((val) => {
      if (val == null) {
        this.goToLoginPage();
      } else {
        this.getUser(val);
      }
    });
  }

  goToLoginPage() {
    this.navCtrl.push(LoginPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals,
      page: 'additionalsPage'
    });
  }

  getUser(val: any) {
    this.showLoading();
    this.userService.getUser(val)
    .subscribe(
      userPandeco => {
        this.goToOrderPage(userPandeco, val)
      },
      err => {
        this.goToLoginPage()
      }
    );
  }

  goToOrderPage(user: any, val: any) {
    this.clientAuthorization.access_token = val;
    this.navCtrl.push(OrderCompletionPage, {
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals,
      user: user,
      client: user.client
    });
  }

  goToHome() {
    const confirm = this.alertCtrl.create({
      title: 'Retornar a tela inicial',
      message: 'Tem certeza? Os dados do pedido serão perdidos!',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.navCtrl.setRoot(RestaurantsPage);
          }
        }
      ]
    });
    confirm.present();
  }

}
