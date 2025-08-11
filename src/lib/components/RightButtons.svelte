<script lang='ts'>
  import { item_list } from "$lib/data";
  import { type Item } from '$lib/types';

  let { current_items, input = $bindable() }: { current_items: Item[], input: string } = $props();

</script>

<div class="flex flex-col gap-2">
  <div
    class="w-full h-full bg-neutral-200 text-center place-content-center border border-neutral-300 active:bg-neutral-300 rounded-xs"
    onpointerdown={() => {
      const item = item_list.find(item => item.ean !== undefined && item.ean.toString() === input);
      if (item !== undefined) {
        current_items.push(item);
        input = '';
      }
    }}
  >
  EAN
  </div>

  <div
    class="w-full h-full bg-neutral-200 text-center place-content-center border border-neutral-300 active:bg-neutral-300 rounded-xs"
    onpointerdown={() => {
      const item = item_list.find(item => item.plu !== undefined && item.plu.toString() === input);
      if (item !== undefined) {
        current_items.push(item);
        input = '';
      }
    }}
  >
  PLU
  </div>

  <div
    class="w-full h-full bg-neutral-200 text-center place-content-center border border-neutral-300 active:bg-neutral-300 rounded-xs"
    onpointerdown={() => {}}
  >
  Summe
  </div>
</div>