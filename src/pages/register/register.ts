import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Observable } from 'rxjs/Observable';
import { Authorization } from '../../models/authorization';
import { UserPandeco } from '../../models/user-pandeco';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UsersProvider } from '../../providers/users/users';
import { LocationsPage } from '../locations/locations';
import { ClientsProvider } from '../../providers/clients/clients';

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
  authorization: Observable<Authorization>;
  value: any;
  additional_value: any;
  selected_price: number;
  user: UserPandeco;
  phone: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public clientService: ClientsProvider,
              private userService: UsersProvider,
              public toastCtrl: ToastController) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.user = new UserPandeco();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
  }

  ionViewDidLoad() {

  }

  register() {
    if (this.confirm_password == this.user.password) {
      if (this.phone != null && this.user.name != null && this.user.email != null) {
        this.authorization
        .subscribe(
          authorization => this.userService
            .addUser(authorization, this.user.email, this.user.name, this.user.password)
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
                          this.navCtrl.setRoot(LocationsPage, {
                            client: client,
                            clientAuthorization: clientAuthorization,
                            menu: this.menu,
                            restaurant: this.restaurant,
                            ingredients: this.ingredients,
                            additional_value: this.additional_value,
                            value: this.value,
                            authorization: this.authorization,
                            selected_price: this.selected_price
                          })
                        }
                      )
                  })
              }
            )
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

}
