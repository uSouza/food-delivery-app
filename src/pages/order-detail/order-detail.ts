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
  additionals = [];
  drinks = [];
  additionalsProduct = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.order = navParams.data.order;
  }

  ionViewDidLoad() {
    if (this.order.products[0].additionals.length > 0) {
      this.additionalsProduct = this.order.products[0].additionals;
    }
    this.additionalsProduct.forEach((add) => {
      if (add.isDrink) {
        this.drinks.push(add);
      } else {
        this.additionals.push(add);
      }
    });

    this.items = [
      {
        name: 'Ingredientes',
        subItems: this.order.products[0].ingredients
      },
      {
        name: 'Adicionais',
        subItems: this.additionals
      },
      {
        name: 'Bebidas',
        subItems: this.drinks
      }
    ];

  }

}
