import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { UserPandeco } from '../../models/user-pandeco';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { LocationsProvider } from '../../providers/locations/locations';
import { Location } from '../../models/location';
import { RestaurantsPage } from '../restaurants/restaurants';
import { LocationsPage } from '../locations/locations';

@IonicPage()
@Component({
  selector: 'page-order-completion',
  templateUrl: 'order-completion.html',
})
export class OrderCompletionPage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  product: Product;
  authorization: Authorization;
  clientAuthorization: Authorization;
  value: any;
  selected_price: number;
  user: UserPandeco = new UserPandeco();
  selected_additionals: AdditionalRestaurant[];
  location: Location;
  locations: Location[] = [];
  deliver: any;
  formPayment: any;

  items = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public locationService: LocationsProvider,
              public alertCtrl: AlertController) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.selected_additionals = navParams.data.selected_additionals;
    this.user = navParams.data.user;
    this.clientAuthorization = navParams.data.clientAuthorization;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    if (this.navParams.get('locations') == null) {
      this.getClientLocations();
    }
    else {
      this.locations = this.navParams.data.locations
    }
    if (this.restaurant.delivery_value == null) {
      this.restaurant.delivery_value = 0;
    }
    this.items = [
      {
        name: 'Ingredientes',
        subItems: this.ingredients
      },
      {
        name: 'Adicionais e bebidas',
        subItems: this.selected_additionals
      }
    ];
  }

  getClientLocations() {
    this.locationService
      .getLocations(this.clientAuthorization)
      .subscribe(
        locations => this.locations = locations
      )
  }

  orderSave() {
    const alert = this.alertCtrl.create({
      title: 'Pedido realizado com sucesso!',
      subTitle: 'Obrigado por fazer o seu pedido pelo Pandeco!',
      buttons: ['OK']
    });
    alert.present();
    this.navCtrl.push(RestaurantsPage);
  }

  orderDeliver(event) {
    if (event.checked) {
      if (this.restaurant.delivery_value > 0) {
        this.value += parseFloat(this.restaurant.delivery_value.toString());
      }
    } else {
      if (this.restaurant.delivery_value > 0) {
        this.value -= parseFloat(this.restaurant.delivery_value.toString());
      }
    }

  }

  locationValidade() {
    if (this.locations.length <= 0) {
      const confirm = this.alertCtrl.create({
        title: 'Cadastrar local de entrega',
        message: 'É necessário cadastrar ao menos um local de entrega para finalizar o pedido.',
        buttons: [
          {
            text: 'Ok',
            handler: () => {
              this.navCtrl.push(LocationsPage, {
                client: this.user.client,
                clientAuthorization: this.clientAuthorization,
                menu: this.menu,
                restaurant: this.restaurant,
                ingredients: this.ingredients,
                value: this.value,
                authorization: this.authorization,
                selected_price: this.selected_price,
                selected_additionals: this.selected_additionals
              })
            }
          }
        ]
      });
      confirm.present();
    }


  }

}
