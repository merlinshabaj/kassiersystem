<script lang='ts'>
  import { item_list } from "$lib/data";
  import OperationButton from "./ButtonFull.svelte";
  import { get_app_context } from "$lib/app.svelte";

  let app = get_app_context();

  function add_by_number(type: 'plu' | 'ean') {
    const item = (
      type === 'plu'
        ? item_list.find(item => item.plu !== undefined && item.plu === parseInt(app.input))
        : item_list.find(item => item.ean !== undefined && item.ean === parseInt(app.input))
    );

    if (item !== undefined) {
      const item_copy = { ...item };
      if (app.menge > 1) {
        item_copy.count = app.menge;
        app.menge = 0;
      }

      if (item_copy.weighable) {
        app.sidebar_view = 'weight_input';
        app.weighing_item = item_copy;
        app.input = '';
        return;
      }

      app.items.push(item_copy);
      app.input = '';
    }
  }
</script>

<div class="flex flex-col gap-2">
  {#if app.summe}
    <OperationButton
      text={'Karte mit Cashback'}
      disabled={app.sidebar_view !== 'default'}
      onpointerdown={() => app.sidebar_view = 'cashback_input'}
    />
    <OperationButton text={'Karte'} disabled={app.sidebar_view !== 'default'} />
    <OperationButton text={'Bar'} disabled={app.sidebar_view !== 'default'} />
  {:else}
    <OperationButton text={'PLU'} disabled={app.sidebar_view !== 'default'} onpointerdown={() => add_by_number('plu')} />
    <OperationButton
      text={'Summe'}
      disabled={app.sidebar_view !== 'default' || app.active_items.length === 0}
      onpointerdown={() => {
        if (app.active_items.length > 0) {
          app.summe = true;
      }
    }} />
    <OperationButton text={'EAN'} disabled={app.sidebar_view !== 'default'} onpointerdown={() => add_by_number('ean')} />
  {/if}
</div>
