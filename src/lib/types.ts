export type Item = {
  name: string,
  price: number,
  plu?: number,
  ean?: number,
  weighing?: boolean,
  pfand?: number,
  gebinde?: number,
  discount?: number, // from 0 to 1 (percentage)
  lidl_plus_discount?: number, // in euro
  lidl_discount?: number, // in euro
};