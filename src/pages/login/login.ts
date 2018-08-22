import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
/* import firebaseConfig from '../../app/firebase-config';
import * as firebase from 'firebase'; */
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';
import { UsersProvider } from "../../providers/users/users";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import { AdditionalsPage } from "../additionals/additionals";
/* import { User } from 'firebase'; */
import { RegisterPage } from '../register/register';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  product: Product;
  authorization: Observable<Authorization>;
  clientAuthorization: Observable<Authorization>;
  value: any;
  additional_value: any;
  selected_price: number;
  user: UserPandeco = new UserPandeco();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              private userService: UsersProvider,
              public toastCtrl: ToastController) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
  }

  ionViewDidLoad() {
    //this.firebaseInit();
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
    this.authorization
    .subscribe(
      authorization => this.userService
        .findUserByEmail(authorization, this.user.email)
        .subscribe(
          userPandeco => {
            this.authenticationService
              .getClientBearer(this.user)
              .subscribe(
                clientAuthorization => {
                    this.navCtrl.setRoot(AdditionalsPage, {
                    clientAuthorization: clientAuthorization,
                    menu: this.menu,
                    restaurant: this.restaurant,
                    ingredients: this.ingredients,
                    additional_value: this.additional_value,
                    value: this.value,
                    authorization: this.authorization,
                    selected_price: this.selected_price
                  })
                },
                err => {
                  this.failed();
                }
              )
          },
          err => {
            this.failed();
          }
        )
    );
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      additional_value: this.additional_value,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price
    });
  }

/*   firebaseInit() {
    firebase.initializeApp(firebaseConfig);
    this.firebaseLoginResult();
  }

  loginFacebook() {
    const facebookProvider = new firebase.auth.FacebookAuthProvider();
    facebookProvider.addScope('public_profile');
    firebase
      .auth()
      .signInWithRedirect(facebookProvider)
      .then(() => {
      })
  } */

/*   login(userPandeco: UserPandeco, user?:User) {
    if (userPandeco == null) {
      this.authorization
      .subscribe(
        authorization => this.userService
          .addUser(authorization, user.email, user.displayName, user.uid)
          .subscribe(
            userPandeco => this.navCtrl.push(AdditionalsPage, {
              menu: this.menu,
              restaurant: this.restaurant,
              ingredients: this.ingredients,
              additional_value: this.additional_value,
              value: this.value,
              authorization: this.authorization,
              selected_price: this.selected_price,
              userFacebook: user,
              userPandeco: userPandeco
            })
          )
        );
    } else {
      this.navCtrl.push(AdditionalsPage, {
        menu: this.menu,
        restaurant: this.restaurant,
        ingredients: this.ingredients,
        additional_value: this.additional_value,
        value: this.value,
        authorization: this.authorization,
        selected_price: this.selected_price,
        userFacebook: user,
        userPandeco: userPandeco
      });
    }

  } */

/*   firebaseLoginResult() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      this.authorization
        .subscribe(
          authorization => this.userService.findUserByEmail(authorization, user.email).subscribe(
            userPandeco => this.login(userPandeco, user)
          )
      )
    })
  } */

}
