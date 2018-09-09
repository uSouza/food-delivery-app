import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyOrdersPage } from '../../my-orders/my-orders';
import { UserEditPage } from '../../user-edit/user-edit';
/**
 * Generated class for the PopoverRestaurantPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-restaurant',
  templateUrl: 'popover-restaurant.html',
})
export class PopoverRestaurantPage {

  username: any = null;
  email: any = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public alertCtrl: AlertController,
              public platform: Platform,
              public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    this.storage.get('username').then((val) => {
      if(val != null) {
        this.username = val;
      }
    });
    this.storage.get('email').then((val) => {
      if(val != null) {
        this.email = val;
      }
    });
  }

  optionsUsers() {
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(UserEditPage);
  }

  logout() {
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
            this.platform.exitApp();
          }
        }
      ]
    });
    confirm.present();
  }

  myOrders() {
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(MyOrdersPage);
  }

}
