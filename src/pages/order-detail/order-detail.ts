import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Order } from '../../models/order';
import { OrdersProvider } from '../../providers/orders/orders';
import { MyOrdersPage } from '../my-orders/my-orders';

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
  access_token: any;
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

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
              public navParams: NavParams,
              private orderService: OrdersProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.order = navParams.data.order;
    this.access_token = navParams.data.access_token;
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

  cancelOrder() {

    const confirm = this.alertCtrl.create({
      title: 'Cancelamento do pedido',
      message: 'Tem certeza de que deseja cancelar o seu pedido?',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.loader.present();
            this.orderService
                .cancelOrder(this.access_token, this.order)
                .subscribe(
                order => {
                   this.goToMyOrdersPage()
                }
        )
          }
        }
      ]
    });
    confirm.present();
  }

  goToMyOrdersPage() {
    this.loader.dismiss();
    this.navCtrl.setRoot(MyOrdersPage);
  }

}
