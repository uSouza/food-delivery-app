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
import { ClientsProvider } from '../../providers/clients/clients';
import * as moment from 'moment';

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
  observation_order: string = '';
  order: Order;
  change_remarks: string = '';
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });
  cell_phone: any = null;
  now: any = null;
  disabled: boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public locationService: LocationsProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private orderService: OrdersProvider,
              private clientService: ClientsProvider,
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
    this.getClientLocations();
    if (this.client.cell_phone == '(00)00000-0000') {
      this.cell_phone = null;
    } else {
      this.cell_phone = this.client.cell_phone;
    }

    if (this.restaurant.delivery_value != null) {
      this.value += parseFloat(this.restaurant.delivery_value.toString());
    }

    if (this.restaurant.delivery_value == null) {
      this.restaurant.delivery_value = 0;
    }

    this.orderService
        .now(this.clientAuthorization.access_token)
        .subscribe(
          now => {
            this.now = now;
            this.setDeliverHour();
          }
        )
  }

  setDeliverHour() {
    const hour = moment(moment(this.now.date));
    const deliverHour = hour.add(this.restaurant.avg_delivery_time.split(':')[1], 'minutes');
    console.log('hour', hour);
    console.log('deliverHour', deliverHour);
  }

  getClientLocations() {
    this.locationService
      .getLocations(this.clientAuthorization)
      .subscribe(
        locations => this.locations = locations
      )
  }

  /*hourValidate() {
    this.orderService
        .now(this.clientAuthorization.access_token)
        .subscribe(
          serverNow => {
            let horaInformada = moment(moment().format('YYYY-MM-DD') + ' ' + this.hour);
            let horaAtual = moment(moment(serverNow).format('YYYY-MM-DD HH:mm:ss'));
            let diferencaInformadaAtual = moment.duration(horaAtual.diff(horaInformada));
            let diferencaInformadaAtualHoras = diferencaInformadaAtual.asHours();
            let horaEntrega = moment(moment().format('YYYY-MM-DD') + ' ' + this.restaurant.avg_delivery_time);
            let diferencaInformadaEntrega = moment.duration(horaEntrega.diff(horaInformada));

            console.log(diferencaInformadaAtualHoras);
            console.log(diferencaInformadaEntrega.asHours());
            
          }
        )
  }*/

  setLocations(locations) {
    this.locations = locations;
  }

  orderSave() {

    if (this.validate()) {
      this.loader.present();
      if (this.cell_phone != this.client.cell_phone) {
        this.client.cell_phone = this.cell_phone;
        this.clientService
            .updateClient(this.authorization.access_token, this.client)
            .subscribe(client => console.log(client))
      }
      this.addOrder();
    }

  }

  validate(): boolean {
    if (!this.deliver && this.location == null) {
      this.showToast('É necessário selecionar o local de entrega!');
      return false;
    }
    else if (this.hour == null) {
      this.showToast('É necessário selecionar o horário de entrega!');
      return false;
    }
    else if (this.formPayment == null) {
      this.showToast('É necessário informar a forma de pagamento!');
      return false;
    } else if (this.cell_phone == null) {
      this.showToast('Informe o telefone de contato!');
      return false;
    } else if (this.hour == null) {
      this.showToast('Informe o horário de entrega!');
      return false;
    } else if (this.hour.split(':').length < 2) {
      this.showToast('Informe o horário de entrega no formato hh:mm!');
      return false;
    } else if ((parseInt(this.hour.split(':')[0]) < 0 
      || parseInt(this.hour.split(':')[0]) > 23) ||
      (parseInt(this.hour.split(':')[1]) < 0 || 
      parseInt(this.hour.split(':')[1]) > 59)) {
        this.showToast('O horário de entrega informado não é válido!');
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
    order.status_id = 1;

    this.orderService.addOrder(this.clientAuthorization, order)
      .subscribe(
        order => {
          this.successOrder();
        },
        err => {
          this.loader.dismiss();
        }
      );
  }

  successOrder() {
    this.loader.dismiss();
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

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present(toast);
  }

}
