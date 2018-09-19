import {Ingredient} from "./ingredient";

export class IngredientGroup {
  id: number;
  name: number;
  number_options: string;
  ingredients: Ingredient[];
  value: any;
  company_id: number;
  has_additional: boolean;
}
