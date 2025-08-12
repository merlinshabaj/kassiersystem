<script lang='ts'>
  import Itemlist from "$lib/components/Itemlist.svelte";
  import Numpad from "$lib/components/Numpad.svelte";
  import RightButtons from "$lib/components/RightButtons.svelte";
  import ButtonFull from "$lib/components/ButtonFull.svelte";
  import ButtonSmall from "$lib/components/ButtonSmall.svelte";
  import { type Item_list } from '$lib/types';
  import { item_list } from "$lib/data";
  import { assert } from "$lib/utilities";

  let current_items: Item_list = $state([
    {
      name: 'Coca Cola',
      price: 1.29,
      lidl_discount: 0.35,
      pfand: 0.25,
      storno: false,
      selected: false,
      gebinde: 6,
      discount: 0.2,
    },
    {
      name: 'Nuss Nougat Croissant',
      price: 1.19,
      lidl_plus_discount: 0.20,
      storno: false,
      selected: false,
      discount: undefined,
    },
    {
      name: 'Bioland Milch 3.8%',
      price: 1.19,
      storno: false,
      selected: false,
      discount: 0.2,
    },
    {
      name: 'Manuka Honig',
      price: 15.99,
      discount: 0.2,
      discount_applied: true,
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

  let lidl_plus: boolean = $state(false);

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
        const item_copy = { ...item };
        if (menge > 1) {
          item_copy.count = menge;
          menge = 0;
        }
        current_items.push(item_copy);
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
    items: Item_list,
    selected_items: Item_list,
  ) {
    if (!allow_storno()) {
      return;
    }

    selected_items.forEach(item => {
      item.storno = true;
      item.selected = false;
    });

    select_last_item(items);
  }

  function allow_storno(): boolean {
    const selected_item = selected_items().at(0);
    if (selected_item === undefined) {
      return false;
    }

    const active_positions = current_items.filter(item => item.storno === false);
    if (active_positions.length === 1) {
      return false;
    }

    return true
  }
  
  function gebinde(
    items: Item_list,
    selected_items: Item_list,
  ) {
    selected_items.forEach(item => {
      const count = item.count ?? 1;
      const gebinde = item.gebinde ?? 1;
      item.count = count * gebinde;
      item.selected = false;
    });

    select_last_item(items)
  }

  function select_last_item(items: Item_list) {
    const last_item = items.findLast(item => item.storno === false);
    if (last_item !== undefined) {
      last_item.selected = true;
    }
  }

  function apply_menge() {
    menge = parseInt(input);

    if (Number.isNaN(menge)) {
      if (selected_items().at(0) !== undefined) {
        const selected_item = { ...selected_items().at(0)! };
        selected_item.discount = undefined; 
        selected_item.count = undefined;
        current_items.push(selected_item);
      }

      return;
    }

    input = ''; 
  }

  function discount() {
    const selected_item = selected_items().at(-1);

    if (!discount_allowed()) {
      return;
    }
    
    assert(selected_item !== undefined);

    selected_item.discount_applied = true;
  }

  function discount_allowed(): boolean {
    const selected_item = selected_items().at(-1);
    if (selected_item === undefined) {
      return false;
    }

    const condition = (
      selected_item.discount_applied !== true &&
      selected_item.discount !== undefined
    );

    return condition;
  }
</script>

<svelte:body onkeydown={keybindings}/>

<div class="grid grid-cols-[1fr_2fr] select-none cursor-default dark:text-white">
  <div class="flex flex-col">
    <Itemlist items={current_items} {menge} {lidl_plus} />
    <div class="h-[20%] p-2 gap-2 grid grid-cols-3 grid-rows-2 items-center">
      <ButtonSmall text={''} />
      <ButtonSmall text={''} />
      <ButtonSmall text={''} />
      <ButtonSmall text={''} />
      <ButtonSmall text={''} />
      <ButtonSmall text={'Rabatt'} onpointerdown={() => discount()} disabled={!discount_allowed()} />
    </div>
    <div class="w-full h-1 m-2 bg-neutral-400 dark:bg-neutral-800 rounded-2xl"></div>
    <div class="flex flex-col gap-2 p-2">
      <ButtonSmall text={'Lidl Plus'} disabled={lidl_plus} onpointerdown={() => lidl_plus = true} />
      <ButtonSmall text={'Waare'} />
    </div>
  </div>
  
  <div class="h-[100dvh] mx-10 flex flex-col">
    <div class="flex flex-row gap-2">
      <input type="text" bind:value={input} placeholder="PLU" class="w-full my-2 bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xs p-1.5">
      
      <div 
        class="place-content-center bg-neutral-200 dark:bg-neutral-800 active:bg-neutral-300 active:dark:bg-neutral-600 my-2 border border-neutral-300 dark:border-neutral-700 p-1.5 rounded text-2xl"
        onpointerdown={() => {
          input = input.slice(0, -1);
          menge = 0;
        }}
      >
      ←
      </div>
      <div 
        class="place-content-center bg-neutral-200 dark:bg-neutral-800 active:bg-neutral-300 dark:active:bg-neutral-600 my-2 border border-neutral-300 dark:border-neutral-700 p-1.5 rounded text-lg"
        onpointerdown={() => {
          input = '';
          menge = 0;
        }}
      >
        C
      </div>
    </div>

    <div class="grow-2 flex flex-row gap-4 my-3">
      <ButtonFull text={'Storno'} disabled={!allow_storno()} onpointerdown={() => storno(current_items, selected_items())} />
      <ButtonFull text={'Bon Abbruch'} />
      <ButtonFull text={'Gebinde'} onpointerdown={() => gebinde(current_items, selected_items())} />
      <ButtonFull text={'Menge'} onpointerdown={() => apply_menge()}
      />
    </div>

    <div class="grow-3 grid grid-cols-[4fr_1fr] gap-6 mb-4">
      <Numpad bind:input={input} />
      <RightButtons {current_items} bind:input={input} bind:menge={menge} />
    </div>
  </div>
</div>
