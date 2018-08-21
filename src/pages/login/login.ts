import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebaseConfig from '../../app/firebase-config';
import * as firebase from 'firebase';
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
import { User } from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  value: any;
  additional_value: any;
  selected_price: number;
  user: UserPandeco;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              private userService: UsersProvider) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
  }

  ionViewDidLoad() {
    this.firebaseInit();
  }

  firebaseInit() {
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
  }

  login(userPandeco: UserPandeco, user?:User) {
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

  }

  firebaseLoginResult() {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
      this.authorization
        .subscribe(
          authorization => this.userService.findUserByEmail(authorization, user.email).subscribe(
            userPandeco => this.login(userPandeco, user)
          )
      )
    })
  }

}
