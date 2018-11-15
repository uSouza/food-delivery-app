import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyOrdersPage } from '../../my-orders/my-orders';
import { UserEditPage } from '../../user-edit/user-edit';
import { AppVersion } from '@ionic-native/app-version';
import { SocialSharing } from '@ionic-native/social-sharing';
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
  version: any = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              public alertCtrl: AlertController,
              private appVersion: AppVersion,
              public platform: Platform,
              private socialSharing: SocialSharing,
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
    this.appVersion.getVersionNumber().then(version => {
      this.version = version;
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

  chat() {
    this.socialSharing.shareViaWhatsAppToReceiver('554591058739', 'Olá, preciso de ajuda.').then(() => {
      console.log('works');
    }).catch(() => {
      console.log('not works');
    });
  }

}
