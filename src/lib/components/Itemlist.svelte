<script lang='ts'>
  import { type Item } from '$lib/types';

  let {items}: {items: Item[]} = $props();
</script>

<div class="flex flex-col mx-2">
  {#each items as item}
    <div class="grid grid-cols-[9fr_1fr] my-0.5 rounded-sm bg-neutral-200 p-1 hover:bg-neutral-300 active:bg-neutral-400">
      <span>{item.name}</span>
      <span>{item.price}€</span>
    </div>
    <div class="bg-neutral-50 h-1"></div>
  {/each}
</div>