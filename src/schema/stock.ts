import { Beer } from "./beer";

export type Stock = {
  lastUpdated: string;
  beers: Beer[];
};
