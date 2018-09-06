import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Menu} from "../../models/menu";
import {Authorization} from "../../models/authorization";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Ingredient} from "../../models/ingredient";
import {IngredientGroup} from "../../models/ingredient-group";
import {IngredientsProvider} from "../../providers/ingredients/ingredients";
import {Restaurant} from "../../models/restaurant";
import { RestaurantsPage } from '../restaurants/restaurants';
import { AdditionalRestaurant } from '../../models/additional-restaurant';
import { AdditionalsPage } from '../additionals/additionals';
import { Price } from '../../models/price';

/**
 * Generated class for the SelectProductIngredientsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-product-ingredients',
  templateUrl: 'select-product-ingredients.html',
})
export class SelectProductIngredientsPage {

  menu: Menu;
  restaurant: Restaurant;
  ingredients: Ingredient[];
  ingredients_groups: IngredientGroup[];
  authorization: Authorization;
  additional_value: number;
  selected_price: Price;
  value: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public ingredientsService: IngredientsProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.ingredients = navParams.data.ingredients;
    this.selected_price = navParams.data.selected_price;
    this.value = navParams.data.value;
  }

  ionViewDidLoad() {
    console.log(this.value);
    console.log(this.navParams.data);
    this.getIngredients();
  }

  showLoading() {
    const loader = this.loadingCtrl.create({
      content: "Carregando...",
      duration: 2000
    });
    loader.present();
  }

  getIngredients() {
    this.ingredientsService.getIngredientsGroupByMenu(this.authorization, this.menu).subscribe(
        ingredients => this.ingredients_groups = ingredients
    );
    this.showLoading();
  }

  onCheckIngredient(ingredient_group: IngredientGroup, ingredient: Ingredient, event) {

    if (event.checked) {
      if (parseInt(ingredient_group.number_options) > 0) {
        ingredient_group.number_options = (parseInt(ingredient_group.number_options) - 1).toString();
      }
      else {
        const confirm = this.alertCtrl.create({
          title: 'Item adicional identificado',
          message: 'Será cobrado o valor de R$' + ingredient_group.additional_value + ' pelo(a) ' + ingredient.name + '. Deseja confirmar a inclusão?',
          buttons: [
            {
              text: 'Não',
              handler: () => {
                event.checked = false;
              }
            },
            {
              text: 'Sim',
              handler: () => {
                event.checked = true;
                this.value += parseFloat(ingredient_group.additional_value);
                ingredient.additional = true;
              }
            }
          ],
          enableBackdropDismiss: false
        });
        ingredient_group.number_options = "-1";
        confirm.present();
      }
    } else {
      ingredient_group.number_options = (parseInt(ingredient_group.number_options) + 1).toString();
      if (ingredient.additional) {
        this.value -= parseFloat(ingredient_group.additional_value);
        ingredient.additional = false;
      }
    }

  }

  goToAdditionalsPage() {
    let ingredients: Array<Ingredient> = this.getSelectedIngredients();
    this.navCtrl.push(AdditionalsPage, {
      menu: this.menu,
      restaurant: this.restaurant,
      ingredients: ingredients,
      value: this.value,
      authorization: this.authorization,
      selected_price: this.selected_price
    });
  }

  getSelectedIngredients() : Ingredient[]{

    let ingredients: Array<Ingredient> = [];

    this.ingredients_groups.forEach((ingredient_group) => {
      ingredient_group.ingredients.forEach((ingredient) => {
        if (ingredient.checked) {
          ingredients.push(ingredient);
        }
      })
    });
    return ingredients;
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
