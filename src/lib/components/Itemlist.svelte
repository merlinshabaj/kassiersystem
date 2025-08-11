<script lang='ts'>
  import { type Item } from '$lib/types';
  import { assert } from '$lib/utilities';

  let {items}: {items: Item[]} = $props();
  const total_price = $derived(
    items.reduce((sum, item) => sum + item.price * 100, 0)
  );

  // TODO: find a way to hide the scrollbar when scrolling using js in the effect below
  // otherwise it should be visible
  let hide_scrollbar = $state(false);

  let previous_items_length = items.length;

  $effect(() => {
    const list = document.getElementById('list');
    if (previous_items_length < items.length) {
      assert(list !== null);
      list.scrollTop = list.scrollHeight;
      previous_items_length = items.length;
    }
  });
</script>

<div class="flex flex-col m-2">
  <div id="list" class="flex flex-col h-[50vh] overflow-scroll {hide_scrollbar ? 'scrollbar-hide' : ''}">
    {#each items as item}
      <div class="grid grid-cols-[9fr_1fr] my-0.5 rounded-sm bg-neutral-200 p-1 hover:bg-neutral-300 active:bg-neutral-400">
        <span>{item.name}</span>
        <span>{item.price}€</span>
      </div>
      <div class="bg-neutral-50 h-1"></div>
    {/each}
  </div>
  
  <div class="flex flex-row justify-between font-bold">
    <span>Total:</span>
    <span>{total_price / 100}€</span>
  </div>
</div>