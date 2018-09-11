import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Product } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { UserPandeco } from '../../models/user-pandeco';
import { LocationsProvider } from '../../providers/locations/locations';
import { Location } from '../../models/location';
import { RestaurantsPage } from '../restaurants/restaurants';
import { LocationsPage } from '../locations/locations';
import { Client } from '../../models/client';
import { Order } from '../../models/order';
import { OrdersProvider } from '../../providers/orders/orders';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-order-completion',
  templateUrl: 'order-completion.html',
})
export class OrderCompletionPage {

  menu: Menu;
  restaurant: Restaurant;
  products: Product[] = [];
  authorization: Authorization;
  clientAuthorization: Authorization;
  client: Client;
  value: any;
  user: UserPandeco = new UserPandeco();
  location: number;
  locations: Location[] = [];
  deliver: boolean = false;
  formPayment: any;
  hour: string;
  observation_order: string;
  order: Order;
  change_remarks: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public locationService: LocationsProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private orderService: OrdersProvider,
              public datepipe: DatePipe,
              public loadingCtrl: LoadingController) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.value = navParams.data.value;
    this.user = navParams.data.user;
    this.clientAuthorization = navParams.data.clientAuthorization;
    this.client = navParams.data.client;
    this.products = navParams.get('products');
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.getClientLocations();

    if (this.restaurant.delivery_value != null) {
      this.value += parseFloat(this.restaurant.delivery_value.toString());
    }

    if (this.restaurant.delivery_value == null) {
      this.restaurant.delivery_value = 0;
    }

    console.log(this.products);

  }

  getClientLocations() {
    this.showLoading(1500);
    this.locationService
      .getLocations(this.clientAuthorization)
      .subscribe(
        locations => this.locations = locations
      )
  }

  orderSave() {

    if (this.validate()) {
      this.addOrder();
    }

  }

  showLoading(duration: number) {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: duration
    });
    loader.present();
  }

  validate(): boolean {
    if (!this.deliver && this.location == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário selecionar o local de entrega!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      return false;
    }
    else if (this.hour == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar o horário de retirada!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      return false;
    }
    else if (this.formPayment == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar a forma de pagamento!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      return false;
    } else {
      return true;
    }
  }

  orderDeliver(event) {
    if (event.checked) {
      if (this.restaurant.delivery_value > 0) {
        this.deliver = true;
        this.value -= parseFloat(this.restaurant.delivery_value.toString());
      }
    } else {
      if (this.restaurant.delivery_value > 0) {
        this.deliver = false;
        this.value += parseFloat(this.restaurant.delivery_value.toString());
      }
    }

  }

  addLocation() {
    this.navCtrl.push(LocationsPage, {
      client: this.client,
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      value: this.value,
      authorization: this.authorization,
      products: this.products,
      page: 'orderCompletionPage'
    });
  }


  addOrder() {

    let product_ids = [];
    this.products.forEach((p) => {
      product_ids.push(p.id);
    });

    let order = new Order();
    order.products_ids = product_ids;
    order.company_id = this.restaurant.id;
    order.receive_at = this.menu.date + ' ' + this.hour;
    order.price = this.value;
    if (this.location == null) {
      order.location_id = 1;
    } else {
      order.location_id = this.location;
    }
    order.deliver = !this.deliver;
    order.observation = this.observation_order;
    order.observation += '\nObservações para o troco: ' + this.change_remarks;
    order.form_payment_id = this.formPayment;

    let today = new Date();

    if (this.datepipe.transform(today, 'yyyy-MM-dd') == this.menu.date) {
      order.status_id = 1;
    } else {
      order.status_id = 3;
    }

    this.showLoading(1500);

    this.orderService.addOrder(this.clientAuthorization, order)
      .subscribe(
        order => {
          this.successOrder();
        },
        err => {
          console.log(err);
        }
      );
  }

  successOrder() {
    const confirm = this.alertCtrl.create({
      title: 'Pedido realizado com sucesso!',
      subTitle: 'Seu pedido foi recebido e logo será processado pelo restaurante, aguarde o aviso de confirmação pelos nossos meios de contato.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.setRoot(RestaurantsPage);
          }
        }
      ],
      enableBackdropDismiss: false
    });
    confirm.present();
  }

  goToHome() {
    const confirm = this.alertCtrl.create({
      title: 'Retornar a tela inicial',
      message: 'Tem certeza? Todos os dados do pedido serão perdidos!',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.navCtrl.setRoot(RestaurantsPage);
          }
        }
      ]
    });
    confirm.present();
  }

}
