import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Location } from '../../models/location';
import { Authorization } from '../../models/authorization';
import { LocationsProvider } from '../../providers/locations/locations';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Menu } from '../../models/menu';
import { Client } from '../../models/client';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { OrderCompletionPage } from '../order-completion/order-completion';

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
  selected_price: number;
  menu: Menu;
  selected_additionals: AdditionalRestaurant[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationsService: LocationsProvider,
              public loadingCtrl: LoadingController) {
    this.clientAuthorization = this.navParams.data.clientAuthorization;
    this.menu = navParams.data.menu;
    this.authorization = navParams.data.authorization;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.client = navParams.data.client;
    this.selected_additionals = navParams.data.selected_additionals;
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
    this.showLoading();
    this.locationsService
      .addLocation(this.clientAuthorization, this.location)
      .subscribe(
        location => {
          this.addLocation(location)
        }
      )
  }

  goToOrderCompletionPage() {
    this.navCtrl.setRoot(OrderCompletionPage, {
      client: this.client,
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      locations: this.locations,
      selected_additionals: this.selected_additionals
    })
  }

}
