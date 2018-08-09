import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
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
  authorization: Observable<Authorization>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public authenticationService: AuthenticationProvider,
              public ingredientsService: IngredientsProvider,
              public alertCtrl: AlertController) {
    this.authorization = this.authenticationService.getGuestBearer();
    this.menu = navParams.data.menu;
    this.restaurant = navParams.data.restaurant;
  }

  ionViewDidLoad() {
    this.getIngredients();
  }

  getIngredients() {
    this.authorization.subscribe(
      authorization => this.ingredientsService.getIngredientsGroupByMenu(authorization, this.menu).subscribe(
        ingredients => this.ingredients_groups = ingredients
      )
    );
  }

  onCheckIngredient(ingredient_group: IngredientGroup, ingredient: Ingredient, event) {

    if (event.checked) {
      if (parseInt(ingredient_group.number_options) > 0) {
        ingredient_group.number_options = (parseInt(ingredient_group.number_options) - 1).toString();
      }
      else {
        const confirm = this.alertCtrl.create({
          title: 'Item adicional identificado',
          message: 'Itens adicionais serão cobrados separadamente. Deseja confirmar a inclusão?',
          buttons: [
            {
              text: 'Sim',
              handler: () => {
                event.checked = true;
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
      ingredient_group.number_options = (parseInt(ingredient_group.number_options) + 1).toString();
    }

  }

  goToSelectProductSizePage() {
    let ingredients: Array<Ingredient> = this.getSelectedIngredients();
    this.navCtrl.push(SelectProductSizePage, {ingredients: ingredients, menu: this.menu, restaurant: this.restaurant});
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
