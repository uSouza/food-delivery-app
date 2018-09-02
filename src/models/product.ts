import { Ingredient } from "./ingredient";

export class Product {
  id: number;
  menu_id: number;
  description: string;
  ingredients_ids: number[];
  price_id: number;
  observation: string;
  ingredients: Ingredient[];
}
