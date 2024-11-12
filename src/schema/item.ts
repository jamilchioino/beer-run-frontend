import { Beer } from "./beer";

export type Item = {
  beer_id: string;
  beer?: Beer;
  price_per_unit: number;
  quantity: number;
  discount_flat: number;
  discount_rate: number;
};
