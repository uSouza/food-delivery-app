import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Location } from '../../models/location';
import { Authorization } from '../../models/authorization';
import { LocationsProvider } from '../../providers/locations/locations';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Menu } from '../../models/menu';
import { Client } from '../../models/client';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { OrderCompletionPage } from '../order-completion/order-completion';
import { Price } from '../../models/price';
import { UserPandeco } from '../../models/user-pandeco';
import { MyOrdersPage } from '../my-orders/my-orders';
import { UserEditPage } from '../user-edit/user-edit';
import { PreOrderCompletionPage } from '../pre-order-completion/pre-order-completion';
import { Product } from '../../models/product';

@IonicPage()
@Component({
  selector: 'page-locations',
  templateUrl: 'locations.html',
})
export class LocationsPage {

  locations: Location[] = [];
  location: Location = new Location();
  clientAuthorization: Authorization;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  authorization: Authorization;
  value: any;
  client: Client;
  selected_price: Price;
  menu: Menu;
  selected_additionals: AdditionalRestaurant[];
  page: string;
  user: UserPandeco;
  products: Product[] = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationsService: LocationsProvider,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.clientAuthorization = this.navParams.data.clientAuthorization;
    this.menu = navParams.data.menu;
    this.authorization = navParams.data.authorization;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.client = navParams.data.client;
    this.selected_additionals = navParams.data.selected_additionals;
    this.page = navParams.data.page;
    this.user = navParams.data.user;
    this.products = navParams.get('products');
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 1500
    });
    loader.present();
  }

  addLocation(location: Location) {
    this.locations.push(location);
    this.location.address = '';
    this.location.number = '';
    this.location.district = '';
    this.location.observation = '';
  }

  locationSave() {
    if (this.location.address == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar o endereço!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    } else if (this.location.district == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar o bairro!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    } else {
      this.showLoading();
      this.locationsService
        .addLocation(this.clientAuthorization, this.location)
        .subscribe(
          location => {
            this.addLocation(location)
          }
        )
    }
  }

  goToNextPage() {
    if (this.page == 'additionalsPage') {
      this.goToPreOrderCompletionPage();
    } else if (this.page == 'userEditPage') {
      this.goToUserEditPage();
    } else if (this.page == 'orderCompletionPage') {
      this.goToOrderCompletionPage();
    }
    else {
      this.goToMyOrdersPage();
    }
  }

  goToOrderCompletionPage() {
    this.navCtrl.setRoot(OrderCompletionPage, {
      client: this.client,
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      value: this.value,
      authorization: this.authorization,
      locations: this.locations,
      products: this.products
    });
  }

  goToPreOrderCompletionPage() {
    this.navCtrl.setRoot(PreOrderCompletionPage, {
      client: this.client,
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      locations: this.locations,
      selected_additionals: this.selected_additionals,
      products: this.products
    });
  }

  goToMyOrdersPage() {
    this.navCtrl.setRoot(MyOrdersPage, {
      user: this.user,
      clientAuthorization: this.clientAuthorization
    })
  }

  goToUserEditPage() {
    this.navCtrl.setRoot(UserEditPage, {
      user: this.user,
      clientAuthorization: this.clientAuthorization
    })
  }

}
