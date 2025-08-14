<script lang='ts'>
  import Itemlist from "$lib/components/Itemlist.svelte";
  import Numpad from "$lib/components/Numpad.svelte";
  import RightButtons from "$lib/components/RightButtons.svelte";
  import ButtonFull from "$lib/components/ButtonFull.svelte";
  import ButtonSmall from "$lib/components/ButtonSmall.svelte";
  import { type Item, type Item_list, type Item_state } from '$lib/types';
  import { item_list, offers, scan_items, special_items } from "$lib/data";
  import { assert } from "$lib/utilities";

  let current_items: Item_list = $state([]);
  const active_items: Item_list = $derived(current_items.filter(item => item.storno === false));
  const selected_item = $derived(current_items.filter(item => item.selected === true).at(0));

  let input: string = $state('');
  let menge: number = $state(0);
  let lidl_plus: boolean = $state(false);
  // TODO
  let customer_age: number = $state(0);

  $effect(() => {
    offers.forEach(offer => {
      let count = 0;
      if (offer.item[0] === 'plu') {
        current_items.forEach(item => {
          if (item.plu === offer.item[1] && !item.storno) {
            count += item.count ?? 1;
          }
        });
      } else {
        current_items.forEach(item => {
          if (item.ean === offer.item[1]) {
            count += item.count ?? 1;
          }
        });
      }

      const is_eligible = count >= offer.count;
      if (is_eligible) {
        const final_discount = offer.discount * Math.floor(count / offer.count);
        console.log(final_discount);

        const first_item = current_items.find(item => {
          if (offer.item[0] === 'plu') {
            return item.plu === offer.item[1] && !item.storno;
          } else {
            return item.ean === offer.item[1] && !item.storno;
          }
        });

        assert(first_item !== undefined);

        if (offer.lidl_plus) {
          first_item.lidl_plus_discount = final_discount / (first_item.count ?? 1);
          return;
        }

        first_item.lidl_discount = final_discount / (first_item.count ?? 1);
      }
    })
  });

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
    selected_item: (Item & Item_state) | undefined,
  ) {
    if (!allow_storno()) {
      return;
    }
    
    if (selected_item === undefined) {
      select_last_item();
      return;
    }

    selected_item.storno = true;
    selected_item.selected = false;
  }

  function allow_storno(): boolean {
    if (selected_item === undefined && active_items.length > 1) {
      return true;
    } else if (selected_item === undefined) {
      return false;
    }

    if (active_items.length === 1) {
      return false;
    }

    return true
  }
  
  function gebinde(
    items: Item_list,
    selected_item: (Item & Item_state) | undefined,
  ) {
    if (selected_item === undefined) {
      return;
    }

    if (selected_item.gebinde_applied) {
      return;
    }
    
    const count = selected_item.count ?? 1;
    const gebinde = selected_item.gebinde ?? 1;
    selected_item.count = count * gebinde;
    selected_item.selected = false;
    selected_item.gebinde_applied = true;
  }

  function allow_gebinde() {
    if (selected_item === undefined) {
      return;
    }

    return !selected_item.gebinde_applied && selected_item.gebinde !== undefined;
  }

  function select_last_item() {
    const last_item = active_items.at(-1);
    if (last_item !== undefined) {
      last_item.selected = true;
    }
  }

  function apply_menge() {
    menge = parseInt(input);

    if (Number.isNaN(menge)) {
      if (selected_item !== undefined) {
        const item = item_list.find(item => item.name === selected_item.name);
        assert(item !== undefined);
        current_items.push(item);
      }

      return;
    }

    input = ''; 
  }

  function discount() {
    if (!discount_allowed()) {
      return;
    }
    
    assert(selected_item !== undefined);

    selected_item.discount_applied = true;
  }

  function discount_allowed(): boolean {
    if (selected_item === undefined) {
      return false;
    }

    const condition = (
      selected_item.discount_applied !== true &&
      selected_item.discount !== undefined
    );

    return condition;
  }

  function add_pfand(
    type: 'Sodastream Pfand' | 'Pfand',
  ) {
    const pfand = special_items.find(item => item.name === type);
    assert(pfand !== undefined);

    const pfand_copy = {...pfand};

    if (menge >= 1) {
      pfand_copy.count = menge;
      menge = 0;
    }

    current_items.push(pfand_copy);
  }
</script>

<svelte:body onkeydown={keybindings}/>

<div class="grid grid-cols-[1fr_2fr] select-none cursor-default dark:text-white">
  <div class="flex flex-col">
    <Itemlist items={current_items} {menge} {lidl_plus} />
    <div class="h-[20%] p-2 gap-2 grid grid-cols-[auto_auto_auto] grid-rows-2 items-center">
      <ButtonSmall text={'Bonrückstellung'} disabled={true} />
      <ButtonSmall text={''} />
      <ButtonSmall text={''} />
      <ButtonSmall text={'Sodastream'} onpointerdown={() => add_pfand('Sodastream Pfand')} />
      <ButtonSmall text={'Pfand'} disabled={false} onpointerdown={() => add_pfand('Pfand')}/>
      <ButtonSmall text={'Rabatt'} onpointerdown={() => discount()} disabled={!discount_allowed()} />
    </div>
    <div class="h-1 m-2 bg-neutral-400 dark:bg-neutral-800 rounded-2xl"></div>
    <div class="flex flex-col gap-2 p-2">
      <div class="flex flex-row gap-2 justify-between">
        <span class="grow">
          <ButtonSmall text={'Lidl Plus'} disabled={lidl_plus} onpointerdown={() => lidl_plus = true} />
        </span>
        <ButtonSmall text={'Lidl Plus Storno'} disabled={!lidl_plus} onpointerdown={() => lidl_plus = false} />
      </div>
      <ButtonSmall text={'Waare scannen'} onpointerdown={() => {
        current_items.push(scan_items[Math.floor(Math.random() * scan_items.length)])
      }}/>
      <ButtonSmall text={'Rückstellungen'} disabled={true} />
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
          if (selected_item !== undefined) {
            selected_item.selected = false;
          }
        }}
      >
      ←
      </div>
      <div 
        class="place-content-center bg-neutral-200 dark:bg-neutral-800 active:bg-neutral-300 dark:active:bg-neutral-600 my-2 border border-neutral-300 dark:border-neutral-700 p-1.5 rounded text-lg"
        onpointerdown={() => {
          input = '';
          menge = 0;
          if (selected_item !== undefined) {
            selected_item.selected = false;
          }
        }}
      >
        C
      </div>
    </div>

    <div class="grow-2 flex flex-row gap-4 my-3">
      <ButtonFull text={'Storno'} disabled={!allow_storno()} onpointerdown={() => storno(current_items, selected_item)} />
      <ButtonFull text={'Bon Abbruch'} disabled={current_items.length === 0 && lidl_plus === false } onpointerdown={() => {current_items = []; lidl_plus = false;}}/>
      <ButtonFull text={'Gebinde'} disabled={current_items.length === 0 || !allow_gebinde()} onpointerdown={() => gebinde(current_items, selected_item)} />
      <ButtonFull text={'Menge'} disabled={current_items.length === 0 && input === ''} onpointerdown={() => apply_menge()}
      />
    </div>

    <div class="grow-3 grid grid-cols-[4fr_1fr] gap-6 mb-4">
      <Numpad bind:input={input} />
      <RightButtons {current_items} bind:input={input} bind:menge={menge} />
    </div>
  </div>
</div>
