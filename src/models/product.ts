import { Ingredient } from "./ingredient";

export class Product {
  id: number;
  menu_id: number;
  description: string;
  ingredients_ids: number[];
  price_id: number;
  observation: string;
  ingredients: Ingredient[];
  additionals: AdditionalProduct[];
  price: any;
}

export class AdditionalProduct {
  add_id: number;
  add_quantity: number;
  isDrink: any;
  value: any;
}
