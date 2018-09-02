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

@IonicPage()
@Component({
  selector: 'page-my-orders',
  templateUrl: 'my-orders.html',
})
export class MyOrdersPage {

  orders: Order[];
  ingredients: Ingredient[];
  authorizationService: Observable<Authorization>;
  authorization: Authorization;

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
        this.getUser(val);
      }
    });
  }

  getUser(val: any) {
    this.showLoading();
    this.userService.getUser(val)
    .subscribe(
      userPandeco => {
        this.getOrders(userPandeco, val)
      },
      err => {
        this.goToLoginPage()
      }
    );
  }

  getOrders(user: UserPandeco, val: any) {
    this.showLoading();
    this.orderService.getOrders(val, user.client.id)
      .subscribe(
        orders => {
          this.setOrders(orders)
        }
      )
  }

  setOrders(orders: Order[]) {
    this.orders = orders;
    if (orders.length <= 0) {
      const alert = this.alertCtrl.create({
        title: 'Não possui pedidos',
        subTitle: 'Ops... Você ainda não realizou pedidos pelo Pandeco.',
        buttons: ['Ok']
      });
      alert.present();
      this.navCtrl.setRoot(RestaurantsPage);
    }
  }

  goToLoginPage() {
    this.navCtrl.setRoot(LoginPage, {page:'myOrdersPage', authorization: this.authorization});
  }

  goToHome() {
    this.navCtrl.setRoot(RestaurantsPage);
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 4000
    });
    loader.present();
  }

  goToOrderDetailPage(order: Order) {

  }

}
