<script lang='ts'>
  import { item_list } from "$lib/data";
  import OperationButton from "./ButtonFull.svelte";
  import { get_app_context } from "$lib/app.svelte";

  let state = get_app_context();

  function add_by_number(type: 'plu' | 'ean') {
    const item = (
      type === 'plu'
        ? item_list.find(item => item.plu !== undefined && item.plu === parseInt(state.input))
        : item_list.find(item => item.ean !== undefined && item.ean === parseInt(state.input))
    );

    if (item !== undefined) {
      const item_copy = { ...item };
      if (state.menge > 1) {
        item_copy.count = state.menge;
        state.menge = 0;
      }

      if (item_copy.weighable) {
        state.show_weight_input = true;
        state.weighing_item = item_copy;
        state.input = '';
        return;
      }

      state.items.push(item_copy);
      state.input = '';
    }
  }
</script>

<div class="flex flex-col gap-2">
  {#if state.summe}
    <OperationButton text={'Karte mit Cashback'} disabled={state.show_weight_input} />
    <OperationButton text={'Karte'} disabled={state.show_weight_input} />
    <OperationButton text={'Bar'} disabled={state.show_weight_input} />
  {:else}
    <OperationButton text={'PLU'} disabled={state.show_weight_input} onpointerdown={() => add_by_number('plu')} />
    <OperationButton
      text={'Summe'}
      disabled={state.show_weight_input || state.active_items.length === 0}
      onpointerdown={() => {
        if (state.active_items.length > 0) {
          state.summe = true;
      }
    }} />
    <OperationButton text={'EAN'} disabled={state.show_weight_input} onpointerdown={() => add_by_number('ean')} />
  {/if}
</div>
