import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { RestaurantsPage } from '../pages/restaurants/restaurants';
import { LoginPage } from "../pages/login/login";
import { MyOrdersPage } from "../pages/my-orders/my-orders";
import { UserEditPage } from "../pages/user-edit/user-edit";

import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { isCordovaAvailable } from '../common/is-cordova-available';
import { oneSignalAppId, sender_id } from '../config';
import { UsersProvider } from '../providers/users/users';

import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = RestaurantsPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private oneSignal: OneSignal,
              private storage: Storage,
              private userService: UsersProvider) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Meus pedidos', component: MyOrdersPage },
      { title: 'Locais de entrega', component: UserEditPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      if (isCordovaAvailable()){
        console.log('Registrando one signal...');
        this.oneSignal.startInit(oneSignalAppId, sender_id);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
        this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
        this.oneSignal.endInit();
        this.oneSignal.getIds().then(res => {
          this.getAccessToken(res);
        });
      }
      this.splashScreen.hide();
    });
  }

  private onPushReceived(payload: OSNotificationPayload) {
    console.log('Push recevied:' + payload.body);
  }

  private onPushOpened(payload: OSNotificationPayload) {
    console.log('Push opened: ' + payload.body);
  }

  private getAccessToken(userOneSignal: any) {
    this.storage.get('token').then((val) => {
      if(val != null) {
        this.setOneSignalId(val, userOneSignal.userId);
      }
    });
  }

  private setOneSignalId(access_token: any, user_id: any) {
    this.userService
    .setOneSignalId(access_token, user_id)
    .subscribe(
      user => {
        console.log(user)
      }
    )
  }



  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}
