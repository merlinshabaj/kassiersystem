<script lang='ts'>
  import { type Item } from '$lib/types';
  import { assert } from '$lib/utilities';

  let { items, menge }: { items: Item[], menge: number } = $props();
  const total_price = $derived(
    items.reduce((sum, item) => {
      let price = sum;

      if (item.storno) {
        return price;
      }

      if (item.lidl_discount !== undefined) {
        price -= item.lidl_discount;
      }

      if (item.lidl_plus_discount !== undefined) {
        price -= item.lidl_plus_discount;
      }

      if (item.discount !== undefined) {
        price += ((item.price * (item.count ?? 1)) * (1 - item.discount));
      } else if (item.count !== undefined && item.count > 1) {
        price += item.price * item.count;
      } else {
        price += item.price;
      }

      if (item.pfand !== undefined) {
        price += item.pfand;
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

      // Unselect all items and select last one when item list updates
      items.forEach(item => item.selected = false);
      select_item(items, items.length - 1);
    }

    if (menge > 1) {
      assert(list !== null);
      list.scrollTop = list.scrollHeight;
      previous_items_length = items.length;
    }
  });

  const price_format = new Intl.NumberFormat(
    'de-DE',
    {
      style: 'currency',
      currency: 'EUR',
    },
  );

  function format_price(
    price: number,
  ): string {
    return price_format.format(price);
  }

  function select_item(
    items: Item[],
    index: number,
  ) {
    const item = items.at(index);
    assert(item !== undefined);

    if (item.storno) {
      return
    }

    items.forEach(item => item.selected = false);
    item.selected = !item.selected;
  }
</script>

<div class="flex flex-col m-2">
  <div id="list" class="flex flex-col h-[50vh] overflow-scroll {hide_scrollbar ? 'scrollbar-hide' : ''}">
    {#each items as item, i}
      <div
        class="
          grid
          grid-cols-[9fr_auto]
          my-0.5
          p-1
          rounded-sm
          bg-neutral-200
          {item.storno ? 'line-through *:text-neutral-500' : ''}
          {item.selected ? 'bg-neutral-300' : ''}
        "
        onpointerdown={() => select_item(items, i)}
      >
      {#if item.count === undefined || item.count === 1}
        <span class="font-medium">{item.name}</span>
      {:else}
        <span class="font-medium">{item.count}x {item.name}</span>
      {/if}
      <span class="font-medium text-right">{format_price(item.price * (item.count ?? 1))}</span>
        {#if item.pfand}
          <span class="">Pfand</span>
          <span class="text-right">{format_price(item.pfand * (item.count ?? 1))}</span>
        {/if}
        {#if item.lidl_discount}
          <span class="text-red-500">Preisvorteil</span>
          <span class="text-red-500">{format_price(-item.lidl_discount * (item.count ?? 1))}</span>
        {/if}
        {#if item.lidl_plus_discount}
          <span class="text-blue-500">Lidl Plus Rabatt</span>
          <span class="text-blue-500">{format_price(-item.lidl_plus_discount * (item.count ?? 1))}</span>
        {/if}
        {#if item.discount}
          <span class="text-red-500">Rabatt</span>
          <span class="text-red-500">{format_price(-item.price * item.discount * (item.count ?? 1))}</span>
        {/if}
      </div>
    {/each}

    {#if menge > 1}
      <div
        class="
          grid
          grid-cols-[9fr_auto]
          my-0.5
          p-1
          rounded-sm
          bg-neutral-200
        "
      >
      {menge}x
      </div>
    {/if}
  </div>
  
  <div class="flex flex-row justify-between font-bold">
    <span>Total:</span>
    <span>{format_price(total_price)}</span>
  </div>
</div>