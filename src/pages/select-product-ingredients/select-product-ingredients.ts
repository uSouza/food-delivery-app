import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Menu} from "../../models/menu";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import {AuthenticationProvider} from "../../providers/authentication/authentication";

/**
 * Generated class for the SelectProductIngredientsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-product-ingredients',
  templateUrl: 'select-product-ingredients.html',
})
export class SelectProductIngredientsPage {

  menu: Menu;
  authorization: Observable<Authorization>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
  }

  ionViewDidLoad() {
  }

}
