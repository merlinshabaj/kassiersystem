<script lang='ts'>
  import { type Item } from '$lib/types';
  import { assert } from '$lib/utilities';

  let {items}: {items: Item[]} = $props();
  const total_price = $derived(
    items.reduce((sum, item) => {
      let price = sum + item.price;
      if (item.lidl_discount !== undefined) {
        price -= item.lidl_discount;
      }

      if (item.lidl_plus_discount !== undefined) {
        price -= item.lidl_plus_discount;
      }

      if (item.discount !== undefined) {
        price *= item.discount;
      }

      return price;
    }, 0)
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
      <div class="grid grid-cols-[9fr_auto] my-0.5 rounded-sm bg-neutral-200 p-1 hover:bg-neutral-300 active:bg-neutral-400">
        <span class="font-medium">{item.name}</span>
        <span class="font-medium text-right">{item.price}€</span>
        {#if item.lidl_discount}
          <span class="text-red-500">Preisvorteil</span>
          <span class="text-red-500">−{item.lidl_discount.toFixed(2)}€</span>
        {/if}
        {#if item.lidl_plus_discount}
          <span class="text-blue-500">Lidl Plus Rabatt</span>
          <span class="text-blue-500">−{item.lidl_plus_discount.toFixed(2)}€</span>
        {/if}
        {#if item.discount}
          <span class="text-red-500">Rabatt</span>
          <span class="text-red-500">−{(item.price * item.discount).toFixed(2)}€</span>
        {/if}
      </div>
      <div class="bg-neutral-50 h-1"></div>
    {/each}
  </div>
  
  <div class="flex flex-row justify-between font-bold">
    <span>Total:</span>
    <span>{total_price.toFixed(2)}€</span>
  </div>
</div>