import { Item } from "./item";

export type Round = {
  id: string;
  created: string;
  items: Item[];
};

export type RoundRequest = {
  beer_id: string;
  quantity: number;
  discount_flat: number;
  discount_rate: number;
};
