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
  additional_price: any = 0;
  drink_price: any = 0;
  lunch_price: any = 0;

  itemsIngredients = [
    {
      name: 'Ingredientes'
    }
  ];

  itemsAdditionals = [
    {
      name: 'Adicionais e bebidas'
    }
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
    this.order = navParams.data.order;
  }

  ionViewDidLoad() {
    console.log(this.order);
    this.updateValues();
  }

  updateValues() {
    this.order.products.forEach((p) => {
      this.lunch_price += parseFloat(p.price.price);
      if (p.additionals.length > 0) {
        p.additionals.forEach((add) => {
          if (add.isDrink) {
            this.drink_price += parseFloat(add.value);
          } else {
            this.additional_price += parseFloat(add.value);
          }
        })
      }
    })
  }

}
