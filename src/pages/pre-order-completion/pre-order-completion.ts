import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Menu } from '../../models/menu';
import { Restaurant } from '../../models/restaurant';
import { Ingredient } from '../../models/ingredient';
import { Product, AdditionalProduct } from '../../models/product';
import { Authorization } from '../../models/authorization';
import { Client } from '../../models/client';
import { Price } from '../../models/price';
import { UserPandeco } from '../../models/user-pandeco';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { ProductsProvider } from '../../providers/products/products';
import { OrderCompletionPage } from '../order-completion/order-completion';
import { RestaurantMenuPage } from '../restaurant-menu/restaurant-menu';
import { RestaurantsPage } from '../restaurants/restaurants';

@IonicPage()
@Component({
  selector: 'page-pre-order-completion',
  templateUrl: 'pre-order-completion.html',
})
export class PreOrderCompletionPage {

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
  selected_additionals: any[];
  additionals: AdditionalRestaurant[] = [];
  drinks: AdditionalRestaurant[] = [];
  products: Product[] = [];
  lunch_price: any = 0;
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  itemsIngredients = [
    {
      name: 'Ingredientes'
    }
  ];

  itemsAdditionals = [
    {
      name: 'Adicionais e bebidas'
    }
  ];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private productService: ProductsProvider,
  ) {
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
    if (this.navParams.get('products').length > 0) {
      this.products = this.navParams.get('products');
    }
    this.addProduct();
  }

  addProduct() {
    let ingredients_ids = [];
    let additionalsProducts: AdditionalProduct[] = [];

    if (this.selected_additionals.length > 0) {
      this.selected_additionals.forEach((add) => {
        let additional: AdditionalProduct = new AdditionalProduct();
        additional.add_id = add.id;
        additional.add_quantity = add.quantity;
        additionalsProducts.push(additional);
      });
    }

    this.ingredients.forEach((ingredient) => {
      ingredients_ids.push(ingredient.id);
    });

    let product = new Product();
    product.ingredients_ids = ingredients_ids;
    product.menu_id = this.menu.id;
    product.description = 'Pedido ' + ' - ' + this.user.name;
    product.price_id = this.selected_price.id;
    product.additionals = additionalsProducts;
    this.loader.present();
    this.productService.addProduct(this.clientAuthorization, product)
      .subscribe(p => {
        this.createIngredientsString(p, this.ingredients);
        this.showProducts(p);
      });
  }

  createIngredientsString(product: any, ingredients: any) {
    let count = 0;
    product.ingredients_string = '';
    ingredients.forEach(i => {
      if (count == 0) {
        product.ingredients_string = i.name;
      } else {
        product.ingredients_string = product.ingredients_string + ', ' + i.name;
      }
      ++count;
    });
    count = 0;
    console.log(product);
  }

  showProducts(product: Product) {
    this.loader.dismiss();
    product.additionals = this.selected_additionals;
    product.ingredients = this.ingredients;
    this.products.push(product);
    this.updateValue();
  }

  updateValue() {
    this.products.forEach((p) => {
      this.lunch_price += parseFloat(p.price.price);
    });
  }

  addMorePackedLunch() {
    this.navCtrl.setRoot(RestaurantMenuPage,
      {
        authorization: this.authorization,
        date: this.menu.date,
        restaurant: this.restaurant,
        products: this.products,
        value: this.value
      }
    );
  }

  goToOrderCompletionPage() {
    this.navCtrl.push(OrderCompletionPage,
      {
        clientAuthorization: this.clientAuthorization,
        authorization: this.authorization,
        value: this.value,
        user: this.user,
        client: this.client,
        products: this.products,
        restaurant: this.restaurant,
        menu: this.menu
      }
    );
  }

  goToHome() {
    const confirm = this.alertCtrl.create({
      title: 'Retornar a tela inicial',
      message: 'Tem certeza? Todos os dados do pedido serão perdidos!',
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
