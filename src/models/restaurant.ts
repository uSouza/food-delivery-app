export class Restaurant {
  id: number;
  user_id: number;
  cnpj: string;
  responsible_name: string;
  responsible_phone: string;
  social_name: string;
  fantasy_name: string;
  phone: string;
  cell_phone: string;
  order_limit: number;
  observation: string;
  url: string;
  image_base64: string;
  opening_time: string;
  tags: object;
  additionals: object;
  delivery_value: number;
  is_open: boolean;
}
