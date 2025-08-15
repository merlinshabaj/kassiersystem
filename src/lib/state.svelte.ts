import { getContext, setContext } from "svelte";
import type { Item, Item_list, Item_state } from "./types";

export class State {
  current_items: Item_list = $state([]);
  active_items: Item_list = $derived(this.current_items.filter((item) => item.storno !== true));
  selected_item = $derived(this.current_items.filter((item) => item.selected === true).at(0));

  input: string = $state('');
  menge: number = $state(0);
  summe: boolean = $state(false);

  lidl_plus: boolean = $state(false);
  customer_age: number = $state(0);

  show_weight_input: boolean = $state(false);
  weighing_item: (Item & Item_state) | undefined = $state();
}

const STATE_KEY = Symbol('state_key');

export function set_state_context() {
  const store = new State();
  setContext(STATE_KEY, store);
  return store;
}

export function get_state_context() {
  return getContext<State>(STATE_KEY);
}
