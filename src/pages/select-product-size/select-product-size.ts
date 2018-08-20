import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {Menu} from "../../models/menu";
import {Ingredient} from "../../models/ingredient";
import {Price} from "../../models/price";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {IngredientsProvider} from "../../providers/ingredients/ingredients";
import {Observable} from "rxjs/Observable";
import {Authorization} from "../../models/authorization";
import {Product} from "../../models/product";
import {ProductsProvider} from "../../providers/products/products";

/**
 * Generated class for the SelectProductSizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-product-size',
  templateUrl: 'select-product-size.html',
})
export class SelectProductSizePage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  product: Product;
  authorization: Observable<Authorization>;
  value: any;
  additional_value: any;
  selected_price: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public productService: ProductsProvider,
              public alertCtrl: AlertController) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.additional_value = parseFloat(navParams.data.additional_value);
    this.value = 0;
  }

  ionViewDidLoad() {
  }

  updateValue(price: Price) {
    this.value = parseFloat(price.price);
    this.selected_price = price.id;
  }

  createProduct() {
    let ingredients_ids: Array<number> = [];
    this.product = new Product();
    this.product.menu_id = this.menu.id;
    this.product.price_id = this.selected_price;
    this.ingredients.forEach((ingredient) => {
      ingredients_ids.push(ingredient.id);
    });
    this.product.ingredients_ids = ingredients_ids;

    this.authorization.subscribe(
      authorization => this.productService.addProduct(authorization, this.product).subscribe(
        product => console.log(product)//this.restaurants = restaurants
      )
    );
  }

}
