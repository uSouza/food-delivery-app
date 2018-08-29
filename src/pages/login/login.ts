import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Authorization } from '../../models/authorization';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';
import { UsersProvider } from "../../providers/users/users";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import { OrderCompletionPage } from "../order-completion/order-completion";
import { RegisterPage } from '../register/register';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  authorization: Authorization;
  clientAuthorization: Observable<Authorization>;
  value: any;
  selected_price: number;
  user: UserPandeco = new UserPandeco();
  selected_additionals: AdditionalRestaurant[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              private userService: UsersProvider,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private storage: Storage) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.selected_additionals = navParams.data.selected_additionals;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Autenticando...",
      duration: 2000
    });
    loader.present();
  }

  failed() {
    let toast = this.toastCtrl.create({
      message: 'Dados incorretos. Tente novamente!',
      duration: 2000,
      position: 'bottom'
    });
    toast.present(toast);
    this.user.email = '';
    this.user.password = '';
  }

  login() {
    this.showLoading();
    this.userService
        .findUserByEmail(this.authorization, this.user.email)
        .subscribe(
          userPandeco => {
            this.authenticationService
              .getClientBearer(this.user)
              .subscribe(
                clientAuthorization => {
                  this.goToOrderCompletion(userPandeco, clientAuthorization);
                },
                err => {
                  this.failed();
                }
              )
          },
          err => {
            this.failed();
          }
        );
  }

  goToOrderCompletion(user: UserPandeco, clientAuthorization: Authorization) {
    this.storage.set('token', clientAuthorization.access_token);
    this.navCtrl.push(OrderCompletionPage, {
      clientAuthorization: clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals,
      user: user
    })

  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals
    });
  }

}
