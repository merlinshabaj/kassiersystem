import { type Item, type Item_list } from '$lib/types';

/* PLU first products */
const bake_off: Item[] = [
  {
    name: 'Nuss Nougat Croissant',
    price: 1.29,
    plu: 928
  },
  {
    name: 'Schinken Käse Croissant',
    price: 0.99,
    plu: 941,
  },
  {
    name: 'Schoko Donut',
    price: 0.99,
    plu: 937,
  },
  {
    name: 'Wienerle Croissant',
    price: 0.99,
    plu: 938,
  },
  {
    name: 'Berliner mit Mehrfruchtfüllung',
    price: 0.99,
    plu: 861,
  },
  {
    name: 'Brioche Croissant',
    price: 0.99,
    plu: 764,
  },
  {
    name: 'Croissant',
    price: 0.99,
    plu: 991,
  },
  {
    name: 'Brezel',
    price: 0.99,
    plu: 512,
  },
  {
    name: 'Käse Laugenstange',
    price: 0.99,
    plu: 934,
  },
  {
    name: 'Milchbrötchen',
    price: 0.99,
    plu: 943,
  },
  {
    name: 'Frikandel',
    price: 0.99,
    plu: 724,
  },
];

const fruits: Item[] = [
  {
    name: 'Bio Zitrone Stk.',
    price: 0.99,
    plu: 415,
  },
  {
    name: 'Trauben hell',
    price: 0.99,
    plu: 533,
  },
  {
    name: 'Trauben dunkel',
    price: 0.99,
    plu: 523,
  },
  {
    name: 'Cantaloupe Melone',
    price: 0.99,
    plu: 21,
    weighable: true,
  },
  {
    name: 'Galia Melone',
    price: 0.99,
    plu: 24,
    weighable: true,
  },
  {
    name: 'Zuckermelone',
    price: 0.99,
    plu: 108,
    weighable: true,
  },
  {
    name: 'Wassermelone',
    price: 0.99,
    plu: 78,
    weighable: true,
  },
  {
    name: 'Wassermelone breit',
    price: 0.99,
    plu: 79,
    weighable: true,
  },
  {
    name: 'Bio Baby Wasser',
    price: 0.99,
    plu: 19,
    weighable: true,
  },
  {
    name: 'Bananen',
    price: 0.99,
    plu: 55,
    weighable: true,
  },
  {
    name: 'Bio Fairtrade Bananen',
    price: 0.99,
    plu: 45,
    weighable: true,
  },
  {
    name: 'Fairtrade Bananen',
    price: 0.99,
    plu: 48,
    weighable: true,
  },
];

const vegetables: Item[] = [
  {
    name: 'Gurke',
    price: 0.79,
    plu: 310,
  },
  {
    name: 'Radieschen',
    price: 0.99,
    plu: 150,
  },
  {
    name: 'Lauchzwiebeln',
    price: 0.99,
    plu: 140,
  },
  {
    name: 'Cherry Strauchtomaten',
    price: 0.99,
    plu: 99,
    weighable: true,
  },
  {
    name: 'Tomaten',
    price: 0.99,
    plu: 97,
    weighable: true,
  },
  {
    name: 'Tomaten rosa',
    price: 0.99,
    plu: 46,
    weighable: true,
  },
];

const drinks: Item[] = [
  {
    name: 'Wasser Medium 0.5L',
    price: 0.15,
    plu: 701,
    pfand: 0.25,
    gebinde: 9,
  }
];

/* EAN products */
const ean: Item[] = [
  {
    name: 'Bioland Milch 3.8%',
    price: 1.19,
    ean: 123456,
  },
  {
    name: 'Honig',
    price: 3.79,
    ean: 213456,
  },
];

const popular_ean: Item[] = [
  {
    name: 'Wasser Still 1.5L',
    price: 0.25,
    ean: 2,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Wasser Medium 1.5L',
    price: 0.25,
    ean: 8,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Wasser Classic 1.5L',
    price: 0.25,
    ean: 1,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Volvic',
    price: 0.49,
    ean: 56,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Volvic Touch Tee',
    price: 0.89,
    ean: 14,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Coca Cola',
    price: 1.29,
    lidl_discount: 0.35,
    ean: 99,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Coca Cola Zero',
    price: 1.29,
    ean: 66,
    pfand: 0.25,
    gebinde: 6,
  },
  {
    name: 'Freeway Cola',
    price: 0.99,
    ean: 22,
    pfand: 0.25,
    gebinde: 6,
  },
];

export const item_list: Item_list = [
  ...bake_off,
  ...drinks,
  ...fruits,
  ...vegetables,
  ...ean,
  ...popular_ean,
].map(item => ({
  ...item,
  storno: false,
  selected: false,
  count: 1,
  discount: 0.2,
  discount_applied: false,
}));