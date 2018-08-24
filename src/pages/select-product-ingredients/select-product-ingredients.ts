import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {Menu} from "../../models/menu";
import {Authorization} from "../../models/authorization";
import {Observable} from "rxjs/Observable";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {Ingredient} from "../../models/ingredient";
import {IngredientGroup} from "../../models/ingredient-group";
import {IngredientsProvider} from "../../providers/ingredients/ingredients";
import {Restaurant} from "../../models/restaurant";
import {RestaurantMenuPage} from "../restaurant-menu/restaurant-menu";
import {SelectProductSizePage} from "../select-product-size/select-product-size";

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
  ingredients_groups: IngredientGroup[];
  authorization: Authorization;
  additional_value: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public ingredientsService: IngredientsProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    this.authorization = navParams.data.authorization;
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
    this.additional_value = 0;
  }

  ionViewDidLoad() {
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

    let additional_ingredients: Array<Ingredient> = [];
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
              text: 'Sim',
              handler: () => {
                event.checked = true;
                this.additional_value += ingredient_group.additional_value;
                ingredient.additional = true;
              }
            },
            {
              text: 'Não',
              handler: () => {
                event.checked = false;
              }
            }
          ]
        });
        ingredient_group.number_options = "-1";
        confirm.present();
      }
    } else {
      console.log(additional_ingredients);
      ingredient_group.number_options = (parseInt(ingredient_group.number_options) + 1).toString();
      if (ingredient.additional) {
        this.additional_value -= ingredient_group.additional_value;
        ingredient.additional = false;
      }
    }

  }

  goToSelectProductSizePage() {
    let ingredients: Array<Ingredient> = this.getSelectedIngredients();
    this.navCtrl.push(SelectProductSizePage, {ingredients: ingredients, menu: this.menu, restaurant: this.restaurant, additional_value: this.additional_value, authorization: this.authorization});
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

}
