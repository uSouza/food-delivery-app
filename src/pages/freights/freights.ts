import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-freights',
  templateUrl: 'freights.html',
})
export class FreightsPage {

  restaurant: any = null;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController) {
    this.restaurant = navParams.get('restaurant');
  }

  ionViewDidLoad() {
    console.log(this.navParams);
  }

  goToHome() {
    this.viewCtrl.dismiss();
  }

}
