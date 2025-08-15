<script lang='ts'>
  import { item_list } from "$lib/data";
  import { type Item, type Item_list, type Item_state } from '$lib/types';
  import OperationButton from "./ButtonFull.svelte";

  let {
    current_items,
    input = $bindable(),
    menge = $bindable(),
    show_weight_input = $bindable(),
    weighing_item = $bindable(),
    summe = $bindable(),
  }: {
    current_items: Item_list,
    input: string,
    menge: number,
    show_weight_input: boolean,
    weighing_item: (Item & Item_state) | undefined,
    summe: boolean,
  } = $props();

  function add_by_number(type: 'plu' | 'ean') {
    const item = (
      type === 'plu'
        ? item_list.find(item => item.plu !== undefined && item.plu === parseInt(input))
        : item_list.find(item => item.ean !== undefined && item.ean === parseInt(input))
    );

    if (item !== undefined) {
      const item_copy = { ...item };
      if (menge > 1) {
        item_copy.count = menge;
        menge = 0;
      }

      if (item_copy.weighable) {
        show_weight_input = true;
        weighing_item = item_copy;
        input = '';
        return;
      }

      current_items.push(item_copy);
      input = '';
    }
  }
</script>

<div class="flex flex-col gap-2">
  {#if summe}
    <OperationButton text={'Karte mit Cashback'} disabled={show_weight_input} />
    <OperationButton text={'Karte'} disabled={show_weight_input} />
    <OperationButton text={'Bar'} disabled={show_weight_input} />
  {:else}
    <OperationButton text={'PLU'} disabled={show_weight_input} onpointerdown={() => add_by_number('plu')} />
    <OperationButton text={'Summe'} disabled={show_weight_input} onpointerdown={() => {
      // if (active_items.length > 0) {
        summe = true;
      // }
    }} />
    <OperationButton text={'EAN'} disabled={show_weight_input} onpointerdown={() => add_by_number('ean')} />
  {/if}
</div>
