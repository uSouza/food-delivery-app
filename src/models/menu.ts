import {Ingredient} from "./ingredient";
import {Price} from "./price";

export class Menu {
  id: number;
  company_id: number;
  description: string;
  date: string;
  ingredients: Ingredient[];
  prices: Price[];
  observation: string;
  url: string;
  image_base64: string;
  deleted_at: string;
}
