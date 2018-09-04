import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Order } from '../../models/order';

/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  order: Order;
  items = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.order = navParams.data.order;
  }

  ionViewDidLoad() {
    console.log(this.order);
    this.items = [
      {
        name: 'Ingredientes',
        subItems: this.order.products[0].ingredients
      },
      {
        name: 'Adicionais e bebidas',
        subItems: this.order.additionals
      }
    ];

  }

}
