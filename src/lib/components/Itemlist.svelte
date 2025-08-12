<script lang='ts'>
  import { type Item_list } from '$lib/types';
  import { assert } from '$lib/utilities';

  let { items, menge, lidl_plus }: { items: Item_list, menge: number, lidl_plus: boolean } = $props();
  const total_price = $derived(
    items.reduce((sum, item) => {
      let price = sum;

      if (item.storno) {
        return price;
      }

      if (item.lidl_discount !== undefined) {
        price -= item.lidl_discount * (item.count ?? 1);
      }

      if (lidl_plus && item.lidl_plus_discount !== undefined) {
        price -= item.lidl_plus_discount * (item.count ?? 1);
      }

      if (item.discount !== undefined && item.discount_applied === true) {
        price += ((item.price * (item.count ?? 1)) * (1 - item.discount));
      } else if (item.count !== undefined && item.count > 1) {
        price += item.price * item.count;
      } else {
        price += item.price;
      }

      if (item.pfand !== undefined) {
        price += item.pfand * (item.count ?? 1);
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
    items: Item_list,
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
          bg-neutral-200 dark:bg-neutral-800
          {item.storno ? 'line-through *:text-neutral-500' : ''}
          {item.selected ? 'bg-neutral-300 dark:bg-neutral-700!' : ''}
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
          <span class="text-red-500 text-right">{format_price(-item.lidl_discount * (item.count ?? 1))}</span>
        {/if}
        {#if lidl_plus && item.lidl_plus_discount}
          <span class="text-blue-500">Lidl Plus Rabatt</span>
          <span class="text-blue-500 text-right">{format_price(-item.lidl_plus_discount * (item.count ?? 1))}</span>
        {/if}
        {#if item.discount_applied === true && item.discount !== undefined}
          <span class="text-red-500">Rabatt {item.discount * 100}%</span>
          <span class="text-red-500 text-right">{format_price(-item.price * item.discount * (item.count ?? 1))}</span>
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
          bg-neutral-200 dark:bg-neutral-800
        "
      >
      {menge}x
      </div>
    {/if}
  </div>
  
  <div class="flex flex-row justify-between font-bold mt-1">
    <span>Total:</span>
    <span class="flex flex-row gap-2">
      {format_price(total_price)}
      {#if lidl_plus}
        <svg class="rounded border" xmlns="http://www.w3.org/2000/svg" version="1.1" width="30" height="30" viewBox="0 0 60 60">
          <path fill="#0050aa" d="M0.522 0.522h58.957v58.957h-58.957z"/>
          <path fill="#fff" d="M59.478 0.522v58.957h-58.957v-58.957h58.957zM60 0h-60v60h60v-60z"/>
          <path fill="#fff000" d="M30 3.85c-14.442 0-26.15 11.708-26.15 26.15s11.708 26.15 26.15 26.15c14.438 0 26.144-11.702 26.15-26.139v-0.001c0-14.444-11.706-26.154-26.149-26.16h-0.001z"/>
          <path fill="#e60a14" d="M28.377 30.736l-4.617-4.617-5.322 5.332v1.79l1.341-1.346 3.715 3.725-1.372 1.367 0.892 0.897 7.43-7.44v-1.784l-2.066 2.077z"/>
          <path fill="#0050aa" d="M6.824 25.148h8.223v1.774h-1.372v5.739l4.763-2.65v4.857h-11.614v-1.784h1.377v-6.162h-1.377v-1.774zM41.494 25.148v1.774h1.377v6.162h-1.377v1.784h11.624v-4.857l-4.769 2.65v-5.739h1.377v-1.774h-8.233z"/>
          <path fill="#e60a14" d="M23.082 19.623c1.616 0 2.927 1.31 2.927 2.927s-1.31 2.927-2.927 2.927c-1.616 0-2.927-1.31-2.927-2.927 0-0.004 0-0.007 0-0.011v0.001c0 0 0 0 0 0 0-1.611 1.306-2.917 2.917-2.917 0.004 0 0.007 0 0.011 0h-0.001z"/>
          <path fill="#e60a14" d="M30 2.087c-0.002 0-0.003 0-0.005 0-15.419 0-27.918 12.499-27.918 27.918s12.499 27.918 27.918 27.918c15.417 0 27.915-12.496 27.918-27.913v-0c-0.003-15.417-12.497-27.915-27.912-27.923h-0.001zM30 56.155c-14.442 0-26.15-11.708-26.15-26.15s11.708-26.15 26.15-26.15c14.442 0 26.15 11.708 26.15 26.15 0 0.004 0 0.007 0 0.011v-0.001c-0.012 14.434-11.714 26.131-26.149 26.134h-0z"/>
          <path fill="#0050aa" d="M36.913 25.148h-7.826v1.774h1.372v6.162h-1.388v1.784h7.826c5.812 0 5.885-9.72 0.016-9.72z"/>
          <path fill="#fff000" d="M35.812 31.826h-0.391v-3.652h0.329c1.717 0 1.717 3.652 0.063 3.652z"/>
        </svg>
      {/if}
    </span>

    
  </div>
</div>