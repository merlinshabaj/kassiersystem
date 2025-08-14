export type Item = {
  name: string,
  price: number,

  plu?: number,
  ean?: number,
  weighable?: boolean,
  pfand?: number,
  gebinde?: number,
  discount?: number, // from 0 to 1 (percentage)
  lidl_plus_discount?: number, // in euro
  lidl_discount?: number, // in euro
  min_age?: number,
}

export type Item_state = {
  storno?: boolean,
  selected?: boolean,
  count?: number,
  discount_applied?: boolean,
  gebinde_applied?: boolean,
}

export type Item_list = (Item & Item_state)[];

type Item_identifier = [type: 'plu' | 'ean', number: number];

export type Offer = {
  count: number,
  item: Item_identifier,
  discount: number,
  lidl_plus: boolean,
};