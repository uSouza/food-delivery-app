import { Ingredient } from "./ingredient";
import { AdditionalRestaurant } from "./additional-restaurant";

export class Product {
  id: number;
  menu_id: number;
  description: string;
  ingredients_ids: number[];
  price_id: number;
  observation: string;
  ingredients: Ingredient[];
  additionals: AdditionalProduct[];
}

export class AdditionalProduct {
  add_id: number;
  add_quantity: number;
}
