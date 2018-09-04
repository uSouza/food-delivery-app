import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { UserPandeco } from '../../models/user-pandeco';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UsersProvider } from '../../providers/users/users';
import { LocationsPage } from '../locations/locations';
import { ClientsProvider } from '../../providers/clients/clients';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { Client } from '../../models/client';
import { Storage } from '@ionic/storage';
import { Price } from '../../models/price';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  confirm_password: any;

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  product: Product;
  authorization: Authorization;
  value: any;
  selected_price: Price;
  user: UserPandeco;
  phone: any;
  selected_additionals: AdditionalRestaurant[];
  page: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public clientService: ClientsProvider,
              private userService: UsersProvider,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              private storage: Storage) {
    this.authorization = navParams.data.authorization;
    this.user = new UserPandeco();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.selected_additionals = navParams.data.selected_additionals;
    this.page = navParams.data.page;
  }

  ionViewDidLoad() {

  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Criando o usuário...",
      duration: 6000
    });
    loader.present();
  }

  register() {
    if (this.confirm_password == this.user.password) {
      if (this.phone != null && this.user.name != null && this.user.email != null) {
        this.showLoading();
        this.userService
            .addUser(this.authorization, this.user.email, this.user.name, this.user.password)
            .subscribe(
              userPandeco => {
                this.authenticationService
                  .getClientBearer(this.user)
                  .subscribe(
                    clientAuthorization => {
                      this.clientService
                        .addClient(clientAuthorization, userPandeco, this.phone, '(45)3252-0434')
                        .subscribe(
                          client => {
                            this.goToLocationsPage(client, clientAuthorization, userPandeco);
                          }
                        )
                    })
              },
              err => {
                let toast = this.toastCtrl.create({
                  message: 'O email informado já está cadastrado na base de dados!',
                  duration: 2000,
                  position: 'bottom'
                });
                toast.present(toast);
              }
            )
      } else {
        let toast = this.toastCtrl.create({
          message: 'Todos os dados são obrigatórios!',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
      }

    } else {
        let toast = this.toastCtrl.create({
          message: 'As senhas informadas não coincidem, informe novamente!',
          duration: 2000,
          position: 'bottom'
        });
        toast.present(toast);
        this.confirm_password = '';
        this.user.password = '';
      }
  }

  goToLocationsPage(client: Client, clientAuthorization: Authorization, user: UserPandeco) {
    this.storage.set('token', clientAuthorization.access_token);
    this.navCtrl.push(LocationsPage, {
      client: client,
      clientAuthorization: clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals,
      page: this.page,
      user: user
    })
  }

}
