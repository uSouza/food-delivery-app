import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {Menu} from "../../models/menu";
import {Price} from "../../models/price";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Authorization} from "../../models/authorization";
import {Product} from "../../models/product";
import {ProductsProvider} from "../../providers/products/products";
import { SelectProductIngredientsPage } from '../select-product-ingredients/select-product-ingredients';
import { RestaurantsPage } from '../restaurants/restaurants';

@IonicPage()
@Component({
  selector: 'page-select-product-size',
  templateUrl: 'select-product-size.html',
})
export class SelectProductSizePage {

  menu: Menu;
  restaurant: Restaurant;
  products: Product[] = [];
  authorization: Authorization;
  valueOrder: any;
  value: any = 0;
  selected_price: Price;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public productService: ProductsProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.products = navParams.get('products');
  }

  ionViewDidLoad() {
    if (this.navParams.get('value') != null) {
      this.valueOrder = this.navParams.get('value');
    } else {
      this.valueOrder = 0;
    }
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }

  updateValue(price: Price) {
    this.value = parseFloat(price.price);
    this.selected_price = price;
  }

  goToSelectIngredientsPage() {
    if (this.selected_price != null) {
      this.showLoading();
      this.navCtrl.push(SelectProductIngredientsPage, {
        menu: this.menu,
        restaurant: this.restaurant,
        value: parseFloat(this.value) + parseFloat(this.valueOrder),
        authorization: this.authorization,
        selected_price: this.selected_price,
        products: this.products
      });
    } else {
      let toast = this.toastCtrl.create({
        message: 'É necessário selecionar um tamanho de marmita!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
  }

  goToHome() {
    const confirm = this.alertCtrl.create({
      title: 'Retornar a tela inicial',
      message: 'Tem certeza? Os dados do pedido serão perdidos!',
      buttons: [
        {
          text: 'Não',
          handler: () => {
          }
        },
        {
          text: 'Sim',
          handler: () => {
            this.navCtrl.setRoot(RestaurantsPage);
          }
        }
      ]
    });
    confirm.present();
  }

}
