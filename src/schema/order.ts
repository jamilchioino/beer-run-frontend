import { Round } from "./round";

export type Order = {
  id: string;
  created: string;
  paid: boolean;
  sub_total: number;
  taxes: number;
  discounts: number;
  total: number;
  rounds: Round[];
};
