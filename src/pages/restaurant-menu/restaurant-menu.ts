import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {MenusProvider} from "../../providers/menus/menus";
import {Authorization} from "../../models/authorization";
import {Menu} from "../../models/menu";
import { SelectProductSizePage } from '../select-product-size/select-product-size';
import { DatePipe } from '@angular/common';
import { Product } from '../../models/product';
import { RestaurantsPage } from '../restaurants/restaurants';

@IonicPage()
@Component({
  selector: 'page-restaurant-menu',
  templateUrl: 'restaurant-menu.html',
})
export class RestaurantMenuPage {

  menus: Menu[] = [];
  authorization: Authorization;
  restaurant: Restaurant;
  minPrice: number;
  items = [];
  date: any = null;
  valueOrder: any;
  products: Product[] = [];
  loader = this.loadingCtrl.create({
    content: "Carregando..."
  });

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menuService: MenusProvider,
              public authenticationService: AuthenticationProvider,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public datepipe: DatePipe) {
    this.authorization = navParams.data.authorization;
    this.restaurant = navParams.data.restaurant;
  }

  ionViewDidLoad() {
    console.log(this.navParams.data.restaurant)
    if (this.navParams.get('value') != null) {
      this.valueOrder = this.navParams.get('value');
    }
    if (this.navParams.get('products') != null) {
      this.products = this.navParams.get('products');
    }
    if (this.navParams.get('date') != null) {
      this.date = this.navParams.get('date');
      console.log(this.date);
    }

    this.getMenusByRestaurant();
  }

  goBack() {
    this.navCtrl.pop();
  }

  getMenusByRestaurant() {
    if (this.restaurant.is_open) {
      this.loader.present();
      this.menuService.getMenuByRestaurant(this.authorization, this.restaurant).subscribe(
        menus => this.setMenus(menus)
    );
    }
  }

  setMenus(menus) {
    this.loader.dismiss();
    this.menus = menus;
    let count = 0;
    if (this.menus.length > 0) {
      this.menus.forEach(m => {
        m.ingredients_string = '';
        m.ingredients.forEach(i => {
          console.log(m.ingredients.length);
          if (count == 0) {
            m.ingredients_string = i.name;
          } else {
            m.ingredients_string = m.ingredients_string + ', ' + i.name;
          }
          ++count;
        })
        count = 0;
      })
    }
  }

  goToProductSizePage(menu: Menu) {
    this.navCtrl.push(SelectProductSizePage, {
      menu: menu,
      restaurant: this.restaurant,
      authorization: this.authorization,
      value: this.valueOrder,
      products: this.products
    });
  }

  verifyMenus(menus: Menu[]) {
    this.loader.dismiss();
    if (this.date == null) {
      this.prepareAllMenus(menus);
    } else {
      this.prepareMenusFromDate(menus);
    }
  }

  prepareMenusFromDate(menus: Menu[]) {
    let dateMenus: Array<Menu> = [];
    let today = new Date();

    menus.forEach((menu) => {
      if (menu.date == this.date) {
        dateMenus.push(menu);
      }
    });

    if (dateMenus.length > 0) {
      let item = {
        date: 'Dia ' + this.datepipe.transform(this.date, 'dd/MM/yyyy'),
        menus: dateMenus
      }
      this.items.push(item);
    }

  }

  prepareAllMenus(menus: Menu[]) {
    let todayMenus: Array<Menu> = [];
    let oneMenus: Array<Menu> = [];
    let twoMenus: Array<Menu> = [];
    let threeMenus: Array<Menu> = [];
    let fourMenus: Array<Menu> = [];

    let today = new Date();
    let tomorrow = new Date();
    let twoDays = new Date();
    let threeDays = new Date();
    let fourDays = new Date();

    tomorrow.setDate(tomorrow.getDate() + 1);
    twoDays.setDate(twoDays.getDate() + 2);
    threeDays.setDate(threeDays.getDate() + 3);
    fourDays.setDate(fourDays.getDate() + 4);

    menus.forEach((menu) => {
      if (menu.deleted_at == null) {
        if (menu.date == this.datepipe.transform(today, 'yyyy-MM-dd')) {
          if (this.restaurant.is_open) {
            todayMenus.push(menu);
          }
        }
        else if (menu.date == this.datepipe.transform(tomorrow, 'yyyy-MM-dd')) {
          oneMenus.push(menu);
        }
        else if (menu.date == this.datepipe.transform(twoDays, 'yyyy-MM-dd')) {
          twoMenus.push(menu);
        }
        else if (menu.date == this.datepipe.transform(threeDays, 'yyyy-MM-dd')) {
          threeMenus.push(menu);
        }
        else if (menu.date == this.datepipe.transform(fourDays, 'yyyy-MM-dd')) {
          fourMenus.push(menu);
        }
      }
    });

    if (todayMenus.length > 0) {
      let item = {
        date: 'Hoje',
        menus: todayMenus
      }
      this.items.push(item);
    }
    if (oneMenus.length > 0) {
      let item = {
        date: 'Amanhã',
        menus: oneMenus
      }
      this.items.push(item);
    }
    if (twoMenus.length > 0) {
      let item = {
        date: 'Para o dia ' + this.datepipe.transform(twoDays, 'dd/MM/yyyy'),
        menus: twoMenus
      }
      this.items.push(item);
    }
    if (threeMenus.length > 0) {
      let item = {
        date: 'Para o dia ' + this.datepipe.transform(threeDays, 'dd/MM/yyyy'),
        menus: threeMenus
      }
      this.items.push(item);
    }
    if (fourMenus.length > 0) {
      let item = {
        date: 'Para o dia ' + this.datepipe.transform(fourDays, 'dd/MM/yyyy'),
        menus: fourMenus
      }
      this.items.push(item);
    }
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
