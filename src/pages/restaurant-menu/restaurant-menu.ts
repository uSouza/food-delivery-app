import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import {Restaurant} from "../../models/restaurant";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {MenusProvider} from "../../providers/menus/menus";
import {Authorization} from "../../models/authorization";
import {Menu} from "../../models/menu";
import { SelectProductSizePage } from '../select-product-size/select-product-size';
import { DatePipe } from '@angular/common';

@IonicPage()
@Component({
  selector: 'page-restaurant-menu',
  templateUrl: 'restaurant-menu.html',
})
export class RestaurantMenuPage {

  menus: Menu[];
  authorization: Authorization;
  restaurant: Restaurant;
  minPrice: number;
  items = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public menuService: MenusProvider,
              public authenticationService: AuthenticationProvider,
              public loadingCtrl: LoadingController,
              public datepipe: DatePipe) {
    this.authorization = navParams.data.authorization;
    this.restaurant = navParams.data.restaurant;
  }

  ionViewDidLoad() {
    this.getMenusByRestaurant();
  }

  goBack() {
    this.navCtrl.pop();
  }

  getMenusByRestaurant() {
    this.menuService.getMenuByRestaurant(this.authorization, this.restaurant).subscribe(
        menus => this.prepareMenus(menus)
    );
  }

  goToProductSizePage(menu: Menu) {
    console.log(menu);
    this.navCtrl.push(SelectProductSizePage, {
      menu: menu,
      restaurant: this.restaurant,
      authorization: this.authorization
    });
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }

  prepareMenus(menus: Menu[]) {

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
      if (menu.date == this.datepipe.transform(today, 'yyyy-MM-dd')) {
        todayMenus.push(menu);
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


}
