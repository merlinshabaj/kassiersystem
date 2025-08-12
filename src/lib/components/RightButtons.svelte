<script lang='ts'>
  import { item_list } from "$lib/data";
  import { type Item } from '$lib/types';
  import OperationButton from "./OperationButton.svelte";

  let { current_items, input = $bindable(), menge = $bindable() }: 
    { current_items: Item[], input: string, menge: number } = $props();

</script>

<div class="flex flex-col gap-2">
  <OperationButton text={'PLU'} onpointerdown={() => {
      const item = item_list.find(item => item.plu !== undefined && item.plu.toString() === input);
      if (item !== undefined) {
        const item_copy = { ...item };
        if (menge > 1) {
          item_copy.count = menge;
          menge = 0;
        }
        current_items.push(item_copy);
        input = '';
      }
    }}
  />
  <OperationButton text={'Summe'} onpointerdown={() => {}} />
  <OperationButton text={'EAN'} onpointerdown={() => {
      const item = item_list.find(item => item.ean !== undefined && item.ean.toString() === input);
      if (item !== undefined) {
        current_items.push(item);
        input = '';
      }
    }}
  />
</div>