import { Product } from "./product";

export class Order {
  price: number;
  observation: string;
  receive_at: string;
  client_id: number;
  company_id: number;
  deliver: boolean;
  status_id: number;
  form_payment_id: number;
  products_ids: number[];
  additionals_ids: number[];
  location_id: number;
  value: number;
  products: Product[];
}
