<script lang='ts'>
  import Itemlist from "$lib/components/Itemlist.svelte";
  import { type Item } from '$lib/types';
  import { item_list } from "$lib/data";

  let current_items: Item[] = $state([
    {
      name: 'Gurke',
      price: 0.79,
    },
    {
      name: 'Nuss Nougat Croissant',
      price: 1.29,
    },
    {
      name: 'Bioland Milch 3.8%',
      price: 1.19,
    },
    {
      name: 'Honig',
      price: 3.79,
    },
  ]);

  let input: string = $state('');
  
  const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '00', ','];
</script>

<div class="grid grid-cols-[1fr_2fr] select-none cursor-default">
  <Itemlist items={current_items} />
  
  <div class="h-screen mx-10">
    <div class="flex flex-row gap-2">
      <input type="text" bind:value={input} placeholder="PLU" class="w-full my-2 bg-neutral-200 border border-neutral-300 rounded-xs p-1.5">
      <div 
        class="place-content-center bg-neutral-200 active:bg-neutral-300 my-2 border border-neutral-300 p-1.5 rounded text-lg"
        onpointerdown={() => {
          input = '';
        }}
      >
        C
      </div>
      <div 
        class="place-content-center bg-neutral-200 active:bg-neutral-300 my-2 border border-neutral-300 p-1.5 rounded text-lg"
        onpointerdown={() => {
          input = input.slice(0, -1);
        }}
      >
      back
      </div>
    </div>

    <div class="grid grid-cols-[4fr_1fr] gap-6">
      <div class="grid grid-cols-3 grid-rows-4 gap-3.5">
        {#each numbers as number}
          <div
            class="bg-neutral-200 rounded text-7xl text-center active:bg-neutral-300 py-2"
            onpointerdown={() => {
              input += number.toString();
            }}
          >
            {number}
          </div>
        {/each}
      </div>
      
      <div class="flex flex-col gap-2">
        <div
          class="w-full h-full bg-neutral-200 text-center place-content-center active:bg-neutral-300 rounded-xs"
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
          class="w-full h-full bg-neutral-200 text-center place-content-center active:bg-neutral-300 rounded-xs"
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
          class="w-full h-full bg-neutral-200 text-center place-content-center active:bg-neutral-300 rounded-xs"
          onpointerdown={() => {}}
        >
        Summe
        </div>
      </div>

    </div>
  </div>
</div>
