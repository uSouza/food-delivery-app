import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Location } from '../../models/location';
import { Authorization } from '../../models/authorization';
import { LocationsProvider } from '../../providers/locations/locations';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product } from '../../models/product';
import { Observable } from 'rxjs/Observable';
import { Menu } from '../../models/menu';
import { AdditionalsPage } from '../additionals/additionals';
import { Client } from '../../models/client';

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
  authorization: Observable<Authorization>;
  value: any;
  client: Client;
  additional_value: any;
  selected_price: number;
  menu: Menu;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private locationsService: LocationsProvider) {
    this.clientAuthorization = this.navParams.data.clientAuthorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.client = navParams.data.client;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
  }

  addLocation(location: Location) {
    this.locations.push(location);
    this.location.address = '';
    this.location.number = '';
    this.location.district = '';
    this.location.observation = '';
  }

  locationSave() {
    this.locationsService
      .addLocation(this.clientAuthorization, this.location)
      .subscribe(
        location => {
          this.addLocation(location)
        }
      )
  }

  goToAdditionalsPage() {
    this.navCtrl.setRoot(AdditionalsPage, {
      client: this.client,
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      additional_value: this.additional_value,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      locations: this.locations
    })
  }

}
