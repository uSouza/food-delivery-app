import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Authorization } from '../../models/authorization';
import { Observable } from 'rxjs/Observable';
import { UserPandeco } from '../../models/user-pandeco';
import { UsersProvider } from "../../providers/users/users";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import { RegisterPage } from '../register/register';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { Storage } from '@ionic/storage';
import { Price } from '../../models/price';
import { MyOrdersPage } from '../my-orders/my-orders';
import { RestaurantsPage } from '../restaurants/restaurants';
import { UserEditPage } from '../user-edit/user-edit';
import { Product } from '../../models/product';
import { PreOrderCompletionPage } from '../pre-order-completion/pre-order-completion';
import { OneSignal, OSNotificationPayload } from '@ionic-native/onesignal';
import { oneSignalAppId, sender_id } from '../../config';
import { isCordovaAvailable } from '../../common/is-cordova-available';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { ClientsProvider } from '../../providers/clients/clients';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  menu?: Menu;
  restaurant?: Restaurant;
  ingredients?: Ingredient[];
  authorization: Authorization;
  clientAuthorization: Observable<Authorization>;
  value?: any;
  selected_price?: Price;
  user: UserPandeco = new UserPandeco();
  selected_additionals?: AdditionalRestaurant[];
  page: string = null;
  isWeb: boolean = false;
  is_facebook: boolean = false;
  products: Product[] = [];
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              private userService: UsersProvider,
              public toastCtrl: ToastController,
              private oneSignal: OneSignal,
              public loadingCtrl: LoadingController,
              public clientService: ClientsProvider,
              public alertCtrl: AlertController,
              private storage: Storage,
              private facebook: Facebook) {
    if (navParams.data.page == 'additionalsPage') {
      this.menu = this.navParams.data.menu;
      this.restaurant = this.navParams.data.restaurant;
      this.ingredients = this.navParams.data.ingredients;
      this.value = this.navParams.data.value;
      this.selected_price = this.navParams.data.selected_price;
      this.selected_additionals = this.navParams.data.selected_additionals;
      this.products = navParams.get('products');
    }
    this.page = navParams.data.page;
    this.authorization = navParams.data.authorization;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    if (! isCordovaAvailable()) {
      this.isWeb = true;
    }
  }

  failed() {
    if (this.is_facebook == true) {
      this.registerFacebookUser();
    } else {
      this.loader.dismiss();
      let toast = this.toastCtrl.create({
        message: 'Dados incorretos. Tente novamente!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
      this.user.email = '';
      this.user.password = '';
    }
  }

  login(user) {
    if (this.is_facebook) {
      this.user.email = user.email;
      this.user.name = user.name;
      this.user.password = user.id;
    }
    this.loader.present();
    this.userService
        .findUserByEmail(this.authorization, this.user.email)
        .subscribe(
          userPandeco => {
            this.authenticationService
              .getClientBearer(this.user)
              .subscribe(
                clientAuthorization => {
                  this.goToNextPage(userPandeco, clientAuthorization);
                },
                err => {
                  this.failed();
                }
              )
          },
          err => {
            this.failed();
          }
        );
  }

  goToNextPage(user: UserPandeco, clientAuthorization: Authorization) {
    this.loader.dismiss();
    this.storage.set('token', clientAuthorization.access_token);
    this.storage.set('username', user.name);
    this.storage.set('email', user.email);
    if (isCordovaAvailable()){
      console.log('Registrando one signal...');
      this.oneSignal.startInit(oneSignalAppId, sender_id);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
      this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
      this.oneSignal.endInit();
      this.oneSignal.getIds().then(res => {
        this.getAccessToken(res);
      });
    }
    if (this.page == 'additionalsPage') {
      this.goToOrderCompletion(user, clientAuthorization);
    }
    else if (this.page == 'userEditPage') {
      this.goToUserEditPage(user, clientAuthorization);
    }
    else {
      this.goToMyOrdersPage(user, clientAuthorization);
    }
  }

  private getAccessToken(userOneSignal: any) {
    this.storage.get('token').then((val) => {
      if(val != null) {
        this.setOneSignalId(val, userOneSignal.userId);
      }
    });
  }

  private setOneSignalId(access_token: any, user_id: any) {
    this.userService
    .setOneSignalId(access_token, user_id)
    .subscribe(
      user => {
        console.log(user)
      }
    )
  }

  private onPushReceived(payload: OSNotificationPayload) {
    console.log('Push recevied:' + payload.body);
  }

  private onPushOpened(payload: OSNotificationPayload) {
    console.log('Push opened: ' + payload.body);
  }

  goToOrderCompletion(user: UserPandeco, clientAuthorization: Authorization) {
    this.navCtrl.setRoot(PreOrderCompletionPage, {
      clientAuthorization: clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals,
      user: user,
      client: user.client,
      products: this.products,
    })
  }

  goToMyOrdersPage(user: UserPandeco, clientAuthorization: Authorization) {
    this.navCtrl.setRoot(MyOrdersPage, {
      clientAuthorization: clientAuthorization,
      user: user
    })
  }

  goToUserEditPage(user: UserPandeco, clientAuthorization: Authorization) {
    this.navCtrl.setRoot(UserEditPage, {
      clientAuthorization: clientAuthorization,
      user: user
    })
  }

  openRegisterPage() {
    this.navCtrl.push(RegisterPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals,
      page: this.page,
      products: this.products,
    });
  }

  goToHome() {
    this.navCtrl.setRoot(RestaurantsPage);
  }

  facebookLogin() {
    this.is_facebook = true;
    this.facebook.login(['public_profile', 'email'])
    .then(
      res => {
        let params = new Array<string>();
        this.facebook
            .api("/me?fields=name,email", params)
            .then(
              res => {
                this.login(res);
              },
              err => {
                console.log(err)
              }
            )
      }
    )
    .catch(e => console.log('Error logging into Facebook', e));
  }

  registerFacebookUser() {
    this.is_facebook = false;
    this.userService
        .addUser(this.authorization, this.user.email, this.user.name, this.user.password)
        .subscribe(
          userPandeco => {
            this.authenticationService
              .getClientBearer(this.user)
              .subscribe(
                clientAuthorization => {
                  this.addFacebookClient(clientAuthorization, userPandeco)
                },
                err => {
                  this.failed();
                }
              )
          },
          err => {
            console.log(err)
          }
        )
  }

  addFacebookClient(clientAuthorization, userPandeco) {
    this.clientService
        .addClient(clientAuthorization, userPandeco, '(00)00000-0000', '(00)0000-0000')
        .subscribe(
            client => {
              this.goToNextPage(userPandeco, clientAuthorization);
            },
            err => {
              console.log(err)
            }
        )
  }

  resetPassword() {
    const prompt = this.alertCtrl.create({
      title: 'Redefinir Senha',
      message: "Informe o seu e-mail",
      inputs: [
        {
          name: 'email',
          placeholder: 'E-mail'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            this.loader.present();
            this.userService
                .reset(this.authorization.access_token, data.email)
                .subscribe(
                  success => {
                    this.loader.dismiss();
                    const confirm = this.alertCtrl.create({
                      title: 'Solicitação realizada!',
                      subTitle: 'Realizamos o envio de um link para redefinição da sua senha para o e-mail informado. Favor, acesse seu e-mail e redefina a sua senha.',
                      buttons: [
                        {
                          text: 'Ok'
                        }
                      ]
                    });
                    confirm.present();
                  },
                  err => {
                    this.loader.dismiss();
                    const confirm = this.alertCtrl.create({
                      title: 'Solicitação recusada!',
                      subTitle: 'O e-mail informado não foi encontrado em nossa base de dados!',
                      buttons: [
                        {
                          text: 'Ok'
                        }
                      ]
                    });
                    confirm.present();
                  }
                )
          }
        }
      ]
    });
    prompt.present();
  }

}
