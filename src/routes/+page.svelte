<script lang='ts'>
  import Itemlist from "$lib/components/Itemlist.svelte";
  import Numpad from "$lib/components/Numpad.svelte";
  import RightButtons from "$lib/components/RightButtons.svelte";
  import OperationButton from "$lib/components/OperationButton.svelte";
  import { type Item } from '$lib/types';
  import { item_list } from "$lib/data";
  import { assert } from "$lib/utilities";

  let current_items: Item[] = $state([
    {
      name: 'Coca Cola',
      price: 1.29,
      lidl_discount: 0.35,
      pfand: 0.25,
      storno: false,
      selected: false,
      gebinde: 6,
    },
    {
      name: 'Nuss Nougat Croissant',
      price: 1.19,
      lidl_plus_discount: 0.20,
      storno: false,
      selected: false,
    },
    {
      name: 'Bioland Milch 3.8%',
      price: 1.19,
      storno: false,
      selected: false,
    },
    {
      name: 'Manuka Honig',
      price: 15.99,
      discount: 0.2,
      storno: false,
      selected: true,
      gebinde: 15,
    },
  ]);

  let selected_items = $derived(() => {
    const possible_items = current_items.map(item => {
      if (item.selected === true) {
        return item;
      }
      return undefined;
    });

    return possible_items.filter(item => item !== undefined);
  });

  let input: string = $state('');

  let menge: number = $state(0);

  function simulate_click(element: HTMLElement) {
    element.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true
    }));

    element.classList.add('simulated-active');
    
    setTimeout(() => {
      element.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true
      }));

      element.classList.remove('simulated-active')
      
      element.click();
    }, 100);
  }

  function keybindings(event: KeyboardEvent) {
    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(event.key)) {
      const element = document.getElementById(event.key);
      assert(element !== null);
      simulate_click(element);
    }

    if (event.key === 'Backspace') {
      input = input.slice(0, -1);
    }

    if (event.key === 'Enter' && event.shiftKey) {
      const item = item_list.find(item => item.ean !== undefined && item.ean.toString() === input);
      if (item !== undefined) {
        current_items.push(item);
        input = '';
        
      }
    } else if (event.key === 'Enter') {
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
    }

    if (
      event.key === 'c' ||
      (event.metaKey && event.key === 'Backspace') ||
      event.key === 'Escape'
    ) {
      input = '';
    }

    if (event.key === 'm' || event.key === '*') {
      apply_menge();
    }
  }

  function storno(
    items: Item[],
    selected_items: Item[],
  ) {
    selected_items.forEach(item => {
      item.storno = true;
      item.selected = false;
    });

    select_last_item(items);
  }
  
  function gebinde(
    items: Item[],
    selected_items: Item[],
  ) {
    selected_items.forEach(item => {
      const count = item.count ?? 1;
      const gebinde = item.gebinde ?? 1;
      item.count = count * gebinde;
      item.selected = false;
    });

    select_last_item(items)
  }

  function select_last_item(items: Item[]) {
    const last_item = items.findLast(item => item.storno === false);
    if (last_item !== undefined) {
      last_item.selected = true;
    }
  }

  function apply_menge() {
    menge = parseInt(input);
    input = ''; 
  }
</script>

<svelte:body onkeydown={keybindings}/>

<div class="grid grid-cols-[1fr_2fr] select-none cursor-default">
  <Itemlist items={current_items} {menge} />
  
  <div class="h-screen mx-10">
    <div class="flex flex-row gap-2">
      <input type="text" bind:value={input} placeholder="PLU" class="w-full my-2 bg-neutral-200 border border-neutral-300 rounded-xs p-1.5">
      
      <div 
        class="place-content-center bg-neutral-200 active:bg-neutral-300 my-2 border border-neutral-300 p-1.5 rounded text-lg"
        onpointerdown={() => {
          input = input.slice(0, -1);
          menge = 0;
        }}
      >
      back
      </div>
      <div 
        class="place-content-center bg-neutral-200 active:bg-neutral-300 my-2 border border-neutral-300 p-1.5 rounded text-lg"
        onpointerdown={() => {
          input = '';
          menge = 0;
        }}
      >
        C
      </div>
    </div>

    <div class="flex flex-row h-[19lvh] gap-4 my-3">
      <OperationButton text={'Storno'} onpointerdown={() => storno(current_items, selected_items())} />
      <OperationButton text={'Bon Abbruch'} onpointerdown={() => {}} />
      <OperationButton text={'Gebinde'} onpointerdown={() => gebinde(current_items, selected_items())} />
      <OperationButton text={'Menge'} onpointerdown={() => apply_menge()}
      />
    </div>

    <div class="grid grid-cols-[4fr_1fr] gap-6">
      <Numpad bind:input={input} />
      <RightButtons {current_items} bind:input={input} bind:menge={menge} />
    </div>
  </div>
</div>
