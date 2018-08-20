import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebaseConfig from '../../app/firebase-config';
import * as firebase from 'firebase';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.firebaseInit();
/*    firebase.auth().getRedirectResult().then((result) => {
      console.log(result);
    })*/
  }

  firebaseInit() {
    firebase.initializeApp(firebaseConfig);
    this.firebaseLoginResult()
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

  firebaseLoginResult() {
    firebase.auth().onAuthStateChanged(function (user) {
      console.log(user);
    })
  }

}
