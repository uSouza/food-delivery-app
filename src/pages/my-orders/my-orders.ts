import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { OrdersProvider } from '../../providers/orders/orders';
import { UsersProvider } from '../../providers/users/users';
import { UserPandeco } from '../../models/user-pandeco';
import { Order } from '../../models/order';
import { Storage } from '@ionic/storage';
import { Ingredient } from '../../models/ingredient';
import { LoginPage } from '../login/login';
import { RestaurantsPage } from '../restaurants/restaurants';
import { Observable } from 'rxjs/Observable';
import { Authorization } from '../../models/authorization';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { OrderDetailPage } from '../order-detail/order-detail';

@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage {

  ingredients: Ingredient[];
  authorizationService: Observable<Authorization>;
  authorization: Authorization;
  access_token: any;
  outstanding: Order[] = [];
  confirmed: Order[] = [];
  items = [];
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage,
              private orderService: OrdersProvider,
              private userService: UsersProvider,
              public loadingCtrl: LoadingController,
              public authenticationService: AuthenticationProvider,
              public alertCtrl: AlertController,) {
  }

  ionViewDidLoad() {
    this.authenticationService
    .getGuestBearer()
    .subscribe(
      authorization => {
        this.isLogged(authorization)
      }
    );

  }

  isLogged(authorization: Authorization) {
    this.authorization = authorization;
    this.storage.get('token').then((val) => {
      if (val == null) {
        this.goToLoginPage();
      } else {
        this.access_token = val;
        this.getUser();
      }
    });
  }

  getUser() {
    this.loader.present();
    this.userService.getUser(this.access_token)
    .subscribe(
      userPandeco => {
        this.getOrders(userPandeco)
      },
      err => {
        this.goToLoginPage()
      }
    );
  }

  getOrders(user: UserPandeco) {
    this.loader.present();
    this.orderService.getOrders(this.access_token, user.client.id)
      .subscribe(
        orders => {
          this.setOrders(orders)
        }
      )
  }

  setOrders(orders: Order[]) {
    this.loader.dismiss();
    if (orders.length <= 0) {
      const alert = this.alertCtrl.create({
        title: 'Não possui pedidos',
        subTitle: 'Ops... Você ainda não realizou pedidos pelo Pandeco.',
        buttons: ['Ok']
      });
      alert.present();
      this.navCtrl.setRoot(RestaurantsPage);
    }

    orders.forEach((order) => {
      if (order.status_id == 2) {
        this.confirmed.push(order);
      }
      else if (order.status_id == 1){
        this.outstanding.push(order);
      }
    });

    if (this.outstanding.length > 0) {
      let item = {
        name: 'Pendentes',
        orders: this.outstanding
      }
      this.items.push(item);
    }
    if (this.confirmed.length > 0) {
      let item = {
        name: 'Encerrados',
        orders: this.confirmed
      }
      this.items.push(item);
    }

  }

  goToLoginPage() {
    this.loader.dismiss();
    this.navCtrl.setRoot(LoginPage, {page:'myOrdersPage', authorization: this.authorization});
  }

  goToHome() {
    this.navCtrl.setRoot(RestaurantsPage);
  }

  goToOrderDetailPage(order: Order) {
    console.log(order);
    this.navCtrl.push(OrderDetailPage, {order: order, access_token: this.access_token});
  }

}
