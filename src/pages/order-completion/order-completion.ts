import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, ModalController } from 'ionic-angular';
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
import { FreightsPage } from '../freights/freights';

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
  freight: any = 0;
  clientAuthorization: Authorization;
  client: Client;
  value: any;
  user: UserPandeco = new UserPandeco();
  location: number;
  locations: Location[] = [];
  deliver: boolean = false;
  formPayment: any;
  freight_id: any = null;
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
              public modalCtrl: ModalController,
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

    this.orderService
        .now(this.clientAuthorization.access_token)
        .subscribe(
          now => {
            this.now = now;
            this.setDeliverHour();
          }
        )
  }

  updateFreight(location) {
    if (this.freight > 0) {
      this.value -= parseFloat(this.freight);
      this.freight = 0;
    }
    this.locations.forEach(l => {
      if (l.id == location) {
        this.restaurant.freights.forEach(f => {
          if (f.district_id == l.district_id) {
            this.freight = f.value;
            this.freight_id = f.id;
          }
        });
      }
    });
    this.value += parseFloat(this.freight);
  }

  setDeliverHour() {
    this.hour = moment(this.now.date).add(this.restaurant.avg_delivery_time.split(':')[1], 'minutes').add(5, 'minutes').format('HH:mm');
  }

  getClientLocations() {
    this.locationService
      .getLocations(this.clientAuthorization)
      .subscribe(
        locations => this.locations = locations
      )
  }

  hourValidate() {
    this.orderService
        .now(this.clientAuthorization.access_token)
        .subscribe(
          serverNow => {
            let horaInformada = moment(moment().format('YYYY-MM-DD') + ' ' + this.hour);
            let horaAtual = moment(moment(serverNow.date).format('YYYY-MM-DD HH:mm:ss'));
            let diferencaInformadaAtual = moment.duration(horaInformada.diff(horaAtual));
            let horaEntrega = moment(moment(serverNow.date).add(this.restaurant.avg_delivery_time.split(':')[1], 'minutes').format('YYYY-MM-DD HH:mm:ss'));
            let diferencaInformadaEntrega = moment.duration(horaInformada.diff(horaEntrega));

            console.log('horaInformada', horaInformada);
            console.log('horaAtual', horaAtual);
            console.log('horaEntrega', horaEntrega);
            console.log('diferencaInformadaAtual', diferencaInformadaAtual.asMinutes());
            console.log('diferencaInformadaEntrega', diferencaInformadaEntrega.asMinutes());

            if (diferencaInformadaAtual.asMinutes() < 0) {
              this.showToast('Informe uma hora de entrega maior que a atual!');
              this.hour = null;
            } else if (diferencaInformadaEntrega.asMinutes() < -1) {
              const confirm = this.alertCtrl.create({
                title: 'Horário de entrega menor que o mínimo',
                subTitle: 'O horário de entrega informado é menor que o mínimo de ' + this.restaurant.avg_delivery_time.split(':')[1] + ' minutos requerido pelo restaurante. Desta forma, pode ser que o restaurante não consiga cumprir o horário de entrega informado.',
                buttons: [
                  {
                    text: 'Entendi',
                    handler: () => {
                     //
                    }
                  }
                ],
                enableBackdropDismiss: false
              });
              confirm.present();
            }
          }
        );
  }

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
      this.value -= parseFloat(this.freight);
      this.freight = 0;
      this.freight_id = null;
      this.location = null;
      this.deliver = true;
    } else {
        this.deliver = false;
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
    order.freight_id = this.freight_id;
    order.observation = this.observation_order;
    if (this.change_remarks != null) {
      order.observation += '\n*Observações para o troco: *' + this.change_remarks;
    }
    order.form_payment_id = this.formPayment;
    order.status_id = 1;
    this.orderService.addOrder(this.clientAuthorization, order)
      .subscribe(
        () => {
          this.successOrder();
        },
        () => {
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

  showFreights(restaurant) {
    let profileModal = this.modalCtrl.create(FreightsPage, { restaurant: restaurant });
    profileModal.present();
    profileModal.onDidDismiss(data => {
      console.log(data);
    });
  }

}
