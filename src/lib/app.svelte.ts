import { getContext, setContext } from "svelte";
import type { Item, Item_list, Item_state } from "./types";

type Sidebar_view =
  | 'default'
  | 'weight_input'
  | 'cashback_input';

export class App {
  items: Item_list = $state([]);
  active_items: Item_list = $derived(this.items.filter((item) => item.storno !== true));
  selected_item = $derived(this.items.filter((item) => item.selected === true).at(0));

  input: string = $state('');
  menge: number = $state(0);
  summe: boolean = $state(true);

  lidl_plus: boolean = $state(false);
  customer_age: number = $state(0);

  sidebar_view: Sidebar_view = $state('default');
  weighing_item: (Item & Item_state) | undefined = $state();
}

const APP_KEY = Symbol('state_app');

export function set_app_context() {
  const store = new App();
  setContext(APP_KEY, store);
  return store;
}

export function get_app_context() {
  return getContext<App>(APP_KEY);
}
