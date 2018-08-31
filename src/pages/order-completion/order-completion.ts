import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
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
import { Client } from '../../models/client';
import { ProductsProvider } from '../../providers/products/products';
import { Price } from '../../models/price';
import { Order } from '../../models/order';
import { OrdersProvider } from '../../providers/orders/orders';

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
  client: Client;
  value: any;
  selected_price: Price;
  user: UserPandeco = new UserPandeco();
  selected_additionals: AdditionalRestaurant[];
  location: number;
  locations: Location[] = [];
  deliver: boolean = false;
  formPayment: any;
  hour: string;
  observation_order: string;
  order: Order;

  items = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public locationService: LocationsProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController,
              private productService: ProductsProvider,
              private orderService: OrdersProvider) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.value = navParams.data.value;
    this.selected_price = navParams.data.selected_price;
    this.selected_additionals = navParams.data.selected_additionals;
    this.user = navParams.data.user;
    this.clientAuthorization = navParams.data.clientAuthorization;
    this.client = navParams.data.client;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data);
    this.getClientLocations();

    if (this.restaurant.delivery_value != null) {
      this.value += parseFloat(this.restaurant.delivery_value.toString());
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
    this.addProduct();
    if (this.hour == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar o horário de retirada!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
    else if (this.formPayment == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário informar a forma de pagamento!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
    else if (!this.deliver && this.location == null) {
      let toast = this.toastCtrl.create({
        message: 'É necessário selecionar o local de entrega!',
        duration: 2000,
        position: 'bottom'
      });
      toast.present(toast);
    }
    else {
      const alert = this.alertCtrl.create({
        title: 'Pedido realizado com sucesso!',
        subTitle: 'Seu pedido foi recebido e logo será processado pelo restaurante, aguarde o aviso de confirmação pelos nossos meios de contato.',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.push(RestaurantsPage);
    }

  }

  orderDeliver(event) {
    if (event.checked) {
      if (this.restaurant.delivery_value > 0) {
        this.deliver = true;
        this.value -= parseFloat(this.restaurant.delivery_value.toString());
      }
    } else {
      if (this.restaurant.delivery_value > 0) {
        this.deliver = false;
        this.value += parseFloat(this.restaurant.delivery_value.toString());
      }
    }

  }

  addLocation() {
    this.navCtrl.push(LocationsPage, {
      client: this.client,
      clientAuthorization: this.clientAuthorization,
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: this.ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price,
      selected_additionals: this.selected_additionals
    });
  }

  addProduct() {
    let ingredients_ids = [];
    this.ingredients.forEach((ingredient) => {
      ingredients_ids.push(ingredient.id);
    });

    let product = new Product();
    product.ingredients_ids = ingredients_ids;
    product.menu_id = this.menu.id;
    product.description = 'Pedido ' + ' - ' + this.user.name;
    product.price_id = this.selected_price.id;

    this.productService.addProduct(this.clientAuthorization, product)
      .subscribe(p =>this.addOrder(p));
  }

  addOrder(product: Product) {
    let product_ids = [];
    product_ids.push(product.id);
    let additionals_ids = [];
    this.selected_additionals.forEach((add) => {
      additionals_ids.push(add.additional_id);
    });
    let order = new Order();
    order.additionals_ids = additionals_ids;
    order.products_ids = product_ids;
    order.company_id = this.restaurant.id;
    order.receive_at = this.hour;
    order.price = this.selected_price.id;
    order.location_id = this.location;
    order.deliver = !this.deliver;
    order.observation = this.observation_order;
    order.form_payment_id = this.formPayment;
    order.value = this.value;

    this.orderService.addOrder(this.clientAuthorization, order)
      .subscribe(order => console.log(order));
  }

}
